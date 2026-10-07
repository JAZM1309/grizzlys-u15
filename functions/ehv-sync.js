/**
 * EHV-Abgleich für die Grizzlys-U15-App
 *
 *  - autoResults:   trägt beendete Grizzlys-Spiele automatisch als Ergebnis ein
 *                   (Quelle: EHV NRW). Läuft alle 30 Minuten. Der Ergebnis-Push geht
 *                   wie bei einem Handeintrag raus (onResultWritten in push.js) –
 *                   aber nur für frische Spiele. Ältere, nachgetragene Ergebnisse
 *                   werden still eingetragen (siehe RESULT_PUSH_MAX_AGE_DAYS).
 *                   Von Hand eingetragene Ergebnisse werden nie überschrieben.
 *  - scheduleWatch: vergleicht alle 3 Stunden den Spielplan der App mit dem des EHV
 *                   und meldet NEUE Abweichungen per Push an die Admin-Geräte.
 *                   Der erste Lauf merkt sich nur den Stand und meldet nichts.
 *  - scheduleCheck: derselbe Vergleich auf Knopfdruck im Admin-Bereich. Liest nur.
 *
 * Einbinden in functions/index.js (drei Zeilen):
 *   exports.autoResults = require("./ehv-sync").autoResults;
 *   exports.scheduleCheck = require("./ehv-sync").scheduleCheck;
 *   exports.scheduleWatch = require("./ehv-sync").scheduleWatch;
 *
 * Deploy:
 *   firebase deploy --only functions:standings,functions:autoResults,functions:scheduleCheck,functions:scheduleWatch --project grizzlys-u15
 */
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const { _ehv } = require("./standings");

if (!admin.apps.length) admin.initializeApp();

const REGION = "europe-west1";
const SITE = "https://jazm1309.github.io/grizzlys-u15/";      // Live-App: Quelle des Spielplans
const ADMIN_UID = "q6AID4Wkp2arQlCTROTKqON6ckk2";

// true  = automatisch eingetragene Ergebnisse lösen den Ergebnis-Push aus (wie Handeinträge).
// false = sie werden immer still eingetragen.
const AUTO_RESULT_PUSH = true;
// Push nur, wenn das Spiel höchstens so viele Tage zurückliegt. Ältere Ergebnisse
// (z. B. beim ersten Lauf nachgetragen) werden ohne Push eingetragen.
const RESULT_PUSH_MAX_AGE_DAYS = 2;

// ---------- Spielplan der App (wie in push.js) ----------
async function loadGames() {
  const res = await fetch(SITE + "index.html?t=" + Date.now(), { headers: { "cache-control": "no-cache" } });
  if (!res.ok) throw new Error("index.html nicht ladbar: HTTP " + res.status);
  const html = await res.text();
  const m = html.match(/const games=(\[[\s\S]*?\]);/);
  if (!m) throw new Error("Spielplan in index.html nicht gefunden");
  return JSON.parse(m[1]);
}

function applyScheduleOverrides(games, overrides) {
  for (const game of games) {
    game._baseId = game.date + "_" + game.time.replace(/:/g, "") + "_" + game.team;
    const o = overrides[game._baseId];
    if (!o) continue;
    Object.assign(game, {
      day: o.day || game.day, date: o.date || game.date, time: o.time || game.time,
      home: o.home || game.home, away: o.away || game.away, stadium: o.stadium || game.stadium
    });
  }
}

async function loadAppGames() {
  const db = admin.firestore();
  const games = await loadGames();
  const snap = await db.collection("scheduleOverrides").get();
  const overrides = {};
  snap.forEach(d => { overrides[d.id] = d.data(); });
  applyScheduleOverrides(games, overrides);
  return games;
}

// Schlüssel eines Ergebnisses – identisch zu resultKey() in der App.
function resultKey(g) { return g.date + "_" + g.time.replace(/:/g, "") + "_" + g.team; }

function berlinToday() {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Berlin" }).format(new Date()); // YYYY-MM-DD
}
function daysBefore(ymd, days) {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d - days)).toISOString().slice(0, 10);
}

// ---------- Zuordnung App-Spiel <-> EHV-Spiel ----------
function norm(s) { return String(s || "").toLowerCase().replace(/[^a-z0-9äöüß]/g, ""); }

function editDistance(a, b) {
  if (Math.abs(a.length - b.length) > 1) return 2;
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let last = prev[0]; prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, last + (a[i - 1] === b[j - 1] ? 0 : 1));
      last = tmp;
    }
  }
  return prev[b.length];
}

// Gleiches Team, wenn die Namen ohne Leer-/Sonderzeichen gleich sind oder sich nur in
// einem Zeichen unterscheiden (z. B. "Grefrather EC" in der App, "Grefrather EG" beim EHV).
function sameTeam(appName, ehvName) {
  const a = norm(appName), b = norm(ehvName);
  if (!a || !b) return false;
  return a === b || (a.length >= 8 && editDistance(a, b) <= 1);
}

// Jede Paarung (Heim/Gast) kommt pro Liga genau einmal vor – deshalb wird über die
// Teamnamen zugeordnet, nicht über das Datum. So werden auch verlegte Spiele gefunden.
function findEhvGame(g, rows) {
  const hits = rows.filter(x => sameTeam(g.home, x.homeTeamLongName) && sameTeam(g.away, x.awayTeamLongName));
  if (hits.length === 1) return hits[0];
  if (hits.length > 1) return hits.find(x => String(x.scheduledGameStart || "").slice(0, 10) === g.date) || null;
  return null;
}

async function loadEhvRows(teams) {
  const out = {};
  await Promise.all([...teams].map(async team => {
    const id = _ehv.DIVISIONS[team];
    if (!id) return;
    try { out[team] = (await _ehv.fetchApi("Schedule", id)).data.rows; }
    catch (err) { logger.warn("EHV-Spielplan U15 " + team + " nicht abrufbar", { err: String(err) }); }
  }));
  return out;
}

function validScore(v) { return Number.isInteger(v) && v >= 0 && v <= 99; }
function hasScore(r) { return !!r && r.homeScore !== undefined && r.awayScore !== undefined && r.homeScore !== "" && r.awayScore !== ""; }

// ---------- Ergebnisse automatisch eintragen (ohne Push) ----------
async function runAutoResults() {
  const db = admin.firestore();
  const games = await loadAppGames();
  const resSnap = await db.collection("results").get();
  const results = {};
  resSnap.forEach(d => { results[d.id] = d.data(); });

  const today = berlinToday();
  const pushFrom = daysBefore(today, RESULT_PUSH_MAX_AGE_DAYS);
  const pending = games.filter(g => g.date <= today && !hasScore(results[resultKey(g)]));
  if (!pending.length) return { pending: 0, written: 0 };

  const ehv = await loadEhvRows(new Set(pending.map(g => g.team)));
  let written = 0;
  for (const g of pending) {
    const rows = ehv[g.team];
    if (!rows) continue;
    const x = findEhvGame(g, rows);
    if (!x || !_ehv.isFinished(x)) continue;
    const hs = Number(x.homeTeamScore), as = Number(x.awayTeamScore);
    if (!validScore(hs) || !validScore(as)) continue;

    const id = resultKey(g);
    const ref = db.collection("results").doc(id);
    const ts = admin.firestore.FieldValue.serverTimestamp();
    const doc = {
      gameId: id, team: g.team, date: g.date, time: g.time, home: g.home, away: g.away,
      homeScore: hs, awayScore: as, updatedAt: ts,
      source: "ehv", ehvGameId: String(x.id || "")
    };
    // pushSentAt ist die Sperre, auf die onResultWritten (und der alte Workflow) achten:
    // Ist sie gesetzt, wird kein Ergebnis-Push verschickt.
    const withPush = AUTO_RESULT_PUSH && g.date >= pushFrom;
    if (!withPush) Object.assign(doc, { pushSentAt: ts, pushSkipped: true, pushSentCount: 0 });

    const done = await db.runTransaction(async tx => {
      const cur = await tx.get(ref);
      if (cur.exists && hasScore(cur.data())) return false; // inzwischen von Hand eingetragen
      tx.set(ref, doc);
      return true;
    });
    if (done) { written++; logger.info("Ergebnis vom EHV übernommen", { id, hs, as, push: withPush }); }
  }
  return { pending: pending.length, written };
}

exports.autoResults = onSchedule(
  { schedule: "every 30 minutes", timeZone: "Europe/Berlin", region: REGION, maxInstances: 1, timeoutSeconds: 60 },
  async () => {
    const stats = await runAutoResults();
    if (stats.pending) logger.info("autoResults", stats);
  }
);

// ---------- Spielplan-Abgleich (nur Admin, nur lesen) ----------
function sameStadium(a, b) {
  const x = norm(a), y = norm(b);
  if (!x || !y) return true; // ohne Angabe nicht als Abweichung werten
  return x.includes(y) || y.includes(x);
}

function ehvInfo(x) {
  const start = String(x.scheduledGameStart || "");
  const open = x.dateIsToBeDetermined === true || x.timeIsToBeDetermined === true;
  return {
    date: open ? "" : start.slice(0, 10),
    time: open ? "" : start.slice(11, 16),
    stadium: String((x.location && x.location.shortname) || "").slice(0, 80),
    open
  };
}

async function runScheduleCheck() {
  const games = await loadAppGames();
  const ehv = await loadEhvRows(new Set(games.map(g => g.team)));
  const diffs = [], extra = [], unavailable = [];
  for (const team of Object.keys(_ehv.DIVISIONS)) {
    const rows = ehv[team];
    if (!rows) { unavailable.push(team); continue; }
    const used = new Set();
    for (const g of games.filter(g => g.team === team)) {
      const base = { id: g._baseId, team, home: g.home, away: g.away, app: { date: g.date, time: g.time, stadium: g.stadium } };
      const x = findEhvGame(g, rows);
      if (!x) { diffs.push({ ...base, ehv: null, what: ["missing"] }); continue; }
      used.add(x.id);
      if (_ehv.isFinished(x)) continue; // gespielte Spiele nicht mehr prüfen
      const e = ehvInfo(x);
      const what = [];
      if (e.open) what.push("open");
      else {
        if (e.date !== g.date) what.push("date");
        if (e.time !== g.time) what.push("time");
      }
      if (!sameStadium(g.stadium, e.stadium)) what.push("stadium");
      if (what.length) diffs.push({ ...base, ehv: e, what });
    }
    // Grizzlys-Spiele beim EHV, die in der App fehlen (z. B. Heimrecht getauscht)
    for (const x of rows) {
      if (used.has(x.id) || _ehv.isFinished(x)) continue;
      if (!/grizzlys/i.test(String(x.homeTeamLongName) + " " + String(x.awayTeamLongName))) continue;
      extra.push({ team, home: String(x.homeTeamLongName || ""), away: String(x.awayTeamLongName || ""), ehv: ehvInfo(x) });
    }
  }
  diffs.sort((a, b) => (a.app.date + a.app.time).localeCompare(b.app.date + b.app.time));
  return { checkedAt: new Date().toISOString(), games: games.length, diffs, extra, unavailable };
}

exports.scheduleCheck = onCall({ region: REGION, maxInstances: 2, timeoutSeconds: 60 }, async (request) => {
  if (!request.auth?.uid) throw new HttpsError("unauthenticated", "Admin-Anmeldung erforderlich.");
  if (request.auth.uid !== ADMIN_UID) throw new HttpsError("permission-denied", "Keine Admin-Berechtigung.");
  try { return await runScheduleCheck(); }
  catch (err) {
    logger.error("scheduleCheck fehlgeschlagen", err);
    throw new HttpsError("internal", "Der Abgleich mit dem EHV-Spielplan ist fehlgeschlagen.");
  }
});

// ---------- Neue Abweichungen automatisch an den Admin melden ----------
const ICON = SITE + "icon-192.png";
const BADGE = SITE + "badge-96.png";

function diffKey(d) {
  const e = d.ehv || {};
  return [d.id, (d.what || []).join("+"), e.date || "", e.time || "", e.stadium || ""].join("|");
}
function shortDate(ymd) {
  if (!ymd) return "";
  const [y, m, d] = ymd.split("-");
  return d + "." + m + ".";
}
function diffText(d) {
  const opp = /grizzlys/i.test(d.home) ? d.away : d.home;
  const head = "U15 " + d.team + " gegen " + opp + ": ";
  if (!d.ehv) return head + "beim EHV nicht gefunden";
  if (d.ehv.open) return head + "beim EHV ohne Termin (bisher " + shortDate(d.app.date) + " " + d.app.time + ")";
  const parts = [];
  if (d.what.includes("date") || d.what.includes("time")) {
    parts.push("jetzt " + shortDate(d.ehv.date) + " " + d.ehv.time + " (bisher " + shortDate(d.app.date) + " " + d.app.time + ")");
  }
  if (d.what.includes("stadium")) parts.push("Spielort " + d.ehv.stadium + " (bisher " + d.app.stadium + ")");
  return head + parts.join(", ");
}

// Push nur an Admin-Geräte – gleiche Auswahl wie bei den Rückmeldungen (index.js).
async function sendAdminPush(title, body) {
  const snap = await admin.firestore().collection("pushTokens").where("admin", "==", true).get();
  const byInstallation = new Map();
  for (const doc of snap.docs) {
    const d = doc.data() || {};
    if (!d.token) continue;
    const key = d.installationId || doc.id;
    const prev = byInstallation.get(key);
    const ms = x => (x && x.updatedAt && x.updatedAt.toMillis ? x.updatedAt.toMillis() : 0);
    if (!prev || ms(d) >= ms(prev)) byInstallation.set(key, d);
  }
  const tokens = [...new Set([...byInstallation.values()].map(d => d.token))];
  if (!tokens.length) { logger.warn("scheduleWatch: kein Admin-Gerät für Push registriert"); return false; }
  const response = await admin.messaging().sendEachForMulticast({
    tokens,
    notification: { title, body },
    webpush: {
      notification: { icon: ICON, badge: BADGE },
      data: { type: "scheduleChange", title, body },
      fcmOptions: { link: SITE }
    }
  });
  logger.info("scheduleWatch: Admin-Push", { successCount: response.successCount, failureCount: response.failureCount });
  return response.successCount > 0;
}

async function runScheduleWatch() {
  const check = await runScheduleCheck();
  // Fällt der EHV-Abruf (teilweise) aus, nichts merken und nichts melden – sonst gäbe es Fehlalarme.
  if (check.unavailable.length) return { skipped: true };

  const all = check.diffs.concat(check.extra.map(x => ({
    id: "extra_" + x.team + "_" + norm(x.home) + "_" + norm(x.away), team: x.team, home: x.home, away: x.away,
    app: { date: "", time: "", stadium: "" }, ehv: x.ehv, what: ["extra"], text: "U15 " + x.team + ": " + x.home + " – " + x.away + " fehlt in der App"
  })));
  const keys = all.map(diffKey);
  const ref = admin.firestore().collection("ehvSync").doc("scheduleWatch");
  const prevSnap = await ref.get();
  const first = !prevSnap.exists;
  const known = new Set(first ? [] : (prevSnap.data().keys || []));
  const fresh = all.filter(d => !known.has(diffKey(d)));

  let pushed = false;
  if (!first && fresh.length) {
    const title = fresh.length === 1 ? "📅 Spielplan-Änderung beim EHV" : "📅 " + fresh.length + " Spielplan-Änderungen beim EHV";
    const lines = fresh.slice(0, 3).map(d => d.text || diffText(d));
    if (fresh.length > 3) lines.push("… und " + (fresh.length - 3) + " weitere");
    pushed = await sendAdminPush(title, lines.join("\n") + "\nIm Admin-Bereich unter „Spieländerungen“ prüfen.");
  }
  // Gemerkt wird nur, was gemeldet werden konnte (oder beim allerersten Lauf alles).
  // Schlägt der Push fehl, wird die Abweichung beim nächsten Lauf erneut versucht.
  const remember = (first || pushed || !fresh.length) ? keys : keys.filter(k => known.has(k));
  await ref.set({ keys: remember, checkedAt: admin.firestore.FieldValue.serverTimestamp(), count: all.length });
  return { first, total: all.length, fresh: fresh.length, pushed };
}

exports.scheduleWatch = onSchedule(
  { schedule: "every 3 hours", timeZone: "Europe/Berlin", region: REGION, maxInstances: 1, timeoutSeconds: 60 },
  async () => { logger.info("scheduleWatch", await runScheduleWatch()); }
);

exports._test = { runScheduleWatch, diffText, runAutoResults, runScheduleCheck, findEhvGame, sameTeam, resultKey };
