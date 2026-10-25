/**
 * Live-Ticker für die Grizzlys-U15-App (ab 1.26.0)
 *
 *  - liveTicker: läuft jede Minute, arbeitet aber nur, wenn laut Spielplan gerade ein
 *                Grizzlys-Spiel stattfindet (15 Minuten vor Beginn bis 3,5 Stunden danach).
 *                Sonst liest er nur ein einziges Firestore-Dokument und ist fertig.
 *  - Quelle:     hockeydata „GetGameReport“ – dieselben Daten, die die EHV-Spielseite live zeigt.
 *  - Ergebnis:   Firestore live/{Spiel-ID} (Spiel-ID wie bei den Ergebnissen: Datum_Uhrzeit_Team).
 *                Die App liest es in Echtzeit (für alle lesbar, schreiben nur diese Function).
 *  - Push:       „Live-Tore“ (jedes Tor) und „Drittelergebnisse“ (nach dem 1. und 2. Drittel),
 *                jeweils nur für Geräte, die das in der App ausdrücklich eingeschaltet haben.
 *                Das Endergebnis kommt wie bisher über den normalen Ergebnis-Push.
 *  - Spielende:  Sobald der EHV das Spiel als beendet führt, wird sofort der automatische
 *                Ergebnis-Eintrag (autoResults) angestoßen – nicht erst nach bis zu 30 Minuten.
 *  - Keine Namen: Es werden nur Rückennummern gespeichert und angezeigt.
 *
 * Einbinden in functions/index.js (eine Zeile):
 *   exports.liveTicker = require("./live").liveTicker;
 *
 * Deploy (nur diese Function):
 *   firebase deploy --only functions:liveTicker --project grizzlys-u15
 */
const { onSchedule } = require("firebase-functions/v2/scheduler");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const { _ehv } = require("./standings");
const { _test: sync } = require("./ehv-sync");
const { _send } = require("./push");

if (!admin.apps.length) admin.initializeApp();

const REGION = "europe-west1";
const SITE = "https://jazm1309.github.io/grizzlys-u15/";
const API = "https://api.hockeydata.net/data/ih";
const API_KEY = "f4b71c8702bd3a6eadc89becf6da5a4e"; // öffentlicher Schlüssel der EHV-Seite (wie standings.js)

// Testphase: true = Live-Pushs gehen NUR an Admin-Geräte (unabhängig von deren Auswahl).
// Erst auf false stellen (und neu deployen), wenn die Live-App die Push-Auswahl „Live“ hat.
const LIVE_PUSH_NUR_ADMIN = true;

const VOR_BEGINN_MIN = 15;        // so viele Minuten vor Spielbeginn schon nachsehen
const NACH_BEGINN_MIN = 210;      // so lange nach Spielbeginn höchstens
const PLAN_NEU_LADEN_MIN = 60;    // Tagesplan höchstens stündlich neu aus der App laden
const ERGEBNIS_VERSUCH_MIN = 5;   // nach Spielende alle 5 Minuten autoResults anstoßen, bis das Ergebnis da ist

const ts = () => admin.firestore.FieldValue.serverTimestamp();
const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

function berlinToday(now = new Date()) {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Berlin" }).format(now);
}

// ---------- Tagesplan: welche Grizzlys-Spiele sind heute? (gespeichert in ehvSync/liveToday) ----------
async function todaysGames(db, now) {
  const today = berlinToday(now);
  const ref = db.collection("ehvSync").doc("liveToday");
  const snap = await ref.get();
  const d = snap.exists ? snap.data() : null;
  const age = d && d.loadedAt && d.loadedAt.toMillis ? now.getTime() - d.loadedAt.toMillis() : Infinity;
  if (d && d.date === today && age < PLAN_NEU_LADEN_MIN * 60000) return d.games || [];

  const all = await sync.loadAppGames();
  const games = all
    .filter(g => g.date === today && !g.cancelled)
    .map(g => ({ id: sync.resultKey(g), team: g.team, date: g.date, time: g.time, home: g.home, away: g.away }));
  await ref.set({ date: today, games, loadedAt: ts() });
  return games;
}

function startMs(g) { return _send.berlinDate(g.date, g.time).getTime(); }
function inWindow(g, now) {
  const s = startMs(g), t = now.getTime();
  return t >= s - VOR_BEGINN_MIN * 60000 && t <= s + NACH_BEGINN_MIN * 60000;
}

// ---------- hockeydata ----------
async function fetchReport(gameId) {
  const url = `${API}/GetGameReport?apiKey=${API_KEY}&gameId=${gameId}&lang=de&referer=www.ehv-nrw.de&format=json`;
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error("HTTP " + res.status);
  const d = await res.json();
  if (!d || d.statusId !== 1 || !d.data || !d.data.gameData) throw new Error("Unerwartete Antwort");
  return d.data;
}

async function findEhvGameId(g) {
  const rows = (await _ehv.fetchApi("Schedule", _ehv.DIVISIONS[g.team])).data.rows;
  const x = sync.findEhvGame(g, rows);
  return x ? String(x.id) : "";
}

const nr = (p) => (p && p.playerJerseyNr !== undefined && p.playerJerseyNr !== null && String(p.playerJerseyNr) !== "" ? String(p.playerJerseyNr) : "");

/** Spielbericht -> kompakter Live-Stand (nur Rückennummern, keine Namen). */
function parse(r) {
  const g = r.gameData;
  const len = num(g.lengthOfPeriod) || 1200;
  const nPer = num(g.numberOfPeriods) || 3;
  const liveTime = num(g.liveTime);
  const phase = String(g.liveTimeGamePhase || "").slice(0, 40);
  const status = num(g.gameStatus);

  const goals = [];
  for (const [side, list] of [["h", r.homeGoals], ["a", r.awayGoals]]) {
    for (const x of Array.isArray(list) ? list : []) {
      const str = String(x.gameStrength || "EQ").toUpperCase();
      const o = { t: num(x.gameTime), side, score: String(x.newScore || "").slice(0, 7), nr: nr(x.scoredBy) };
      const a = [nr(x.assistBy), nr(x.assist2By)].filter(Boolean);
      if (a.length) o.ast = a;
      if (/^PP/.test(str)) o.pp = true;
      if (/^SH/.test(str)) o.sh = true;
      if (x.isEmptyNet === true) o.en = true;
      if (x.isPenaltyShot === true) o.ps = true;
      goals.push(o);
    }
  }
  goals.sort((a, b) => a.t - b.t);

  const finished = status === 4 || /END OF GAME|FINAL/i.test(phase) || /END-GAME/i.test(String(g.liveTimeString || ""));
  const started = finished || status === 1 || liveTime > 0 || goals.length > 0;
  const regLen = len * nPer;
  // Abgeschlossene Drittel: aus der Spielzeit (die Uhr bleibt am Drittelende genau auf 20:00, 40:00 …)
  let done = Math.min(nPer, Math.floor(liveTime / len));
  if (finished) done = nPer;
  const pause = !finished && started && (/END OF PERIOD|INTERMISSION|PAUSE|BREAK/i.test(phase)
    || (liveTime > 0 && liveTime < regLen && liveTime % len === 0));
  let period = num(g.liveTimePeriod) || (started ? Math.min(nPer, done + 1) : 0);
  if (pause && done > 0) period = done;

  const periods = (Array.isArray(g.periodStats) ? g.periodStats : [])
    .slice(0, Math.max(done + (finished || pause ? 0 : 1), 0))
    .map(p => [num(p.homeScore), num(p.awayScore)]);

  return {
    hs: num(g.homeTeamScore), as: num(g.awayTeamScore),
    status: finished ? "final" : !started ? "pre" : pause ? "pause" : "live",
    period, clock: String(g.liveTimeFormatted || "").slice(0, 8), liveTime, phase,
    periodsDone: done, periodCount: nPer, periodLength: len, periods,
    ot: num(g.isOvertime) > 0, so: num(g.isShootOut) > 0,
    goals
  };
}

// ---------- Push ----------
const goalKey = (q) => q.side + "|" + q.t + "|" + q.score;
const minute = (t) => Math.floor(num(t) / 60) + 1;
const isG = (name) => /grizzlys/i.test(String(name || ""));
function label(name) { return isG(name) ? "Grizzlys" : String(name || "").slice(0, 40); }
function scoreLine(g, s) { return `${label(g.home)} ${s.hs}:${s.as} ${label(g.away)}`; }

async function targets(kind, team) {
  const all = await _send.loadTokens();
  if (LIVE_PUSH_NUR_ADMIN) return all.filter(x => x.admin);
  return all.filter(x => x.prefs[kind] === true && _send.wantsTeam(x, team));
}

async function sendLive(kind, g, title, body) {
  const tokens = await targets(kind, g.team);
  if (!tokens.length) return { total: 0, success: 0 };
  return _send.sendPush(tokens, { title, body }, {
    data: { type: kind, title, body, tag: "live-" + g.id, gameId: g.id },
    fcmOptions: { link: SITE }
  });
}

function goalPush(g, s, fresh) {
  const ourSide = isG(g.home) ? "h" : "a";
  const ours = fresh.filter(q => q.side === ourSide);
  const head = `U15 ${g.team}: ${scoreLine(g, s)}`;
  const last = fresh[fresh.length - 1];
  if (fresh.length === 1) {
    const q = fresh[0], extra = [q.pp ? "Überzahl" : "", q.sh ? "Unterzahl" : "", q.en ? "leeres Tor" : "", q.ps ? "Penalty" : ""].filter(Boolean);
    const who = q.side === ourSide && q.nr ? ` · Nr. ${q.nr}` : "";
    return {
      title: q.side === ourSide ? "🚨 Tor für die Grizzlys!" : "🏒 Gegentor",
      body: `${head}\n${minute(q.t)}. Minute${who}${extra.length ? " · " + extra.join(", ") : ""}`
    };
  }
  return {
    title: ours.length === fresh.length ? `🚨 ${fresh.length} Tore für die Grizzlys!` : `🏒 ${fresh.length} Tore`,
    body: `${head}\nzuletzt in der ${minute(last.t)}. Minute`
  };
}

// ---------- Ein Spiel bearbeiten ----------
async function tick(db, g, now) {
  const ref = db.collection("live").doc(g.id);
  const prevSnap = await ref.get();
  const prev = prevSnap.exists ? prevSnap.data() : null;
  if (prev && prev.status === "final") {
    // Spiel ist vorbei – nur noch das Ergebnis anstoßen, bis es eingetragen ist.
    await maybeAutoResult(db, g, ref, prev, now);
    return { id: g.id, status: "final" };
  }

  let ehvGameId = (prev && prev.ehvGameId) || "";
  if (!ehvGameId) ehvGameId = await findEhvGameId(g);
  if (!ehvGameId) return { id: g.id, status: "nicht beim EHV gefunden" };

  const s = parse(await fetchReport(ehvGameId));
  const base = { gameId: g.id, team: g.team, date: g.date, time: g.time, home: g.home, away: g.away, ehvGameId };

  if (s.status === "pre") {
    if (!prev) await ref.set({ ...base, status: "pre", goals: [], hs: 0, as: 0, periodsPushed: 0, updatedAt: ts() });
    return { id: g.id, status: "pre" };
  }

  // Erstes Mal mitten im Spiel (z. B. Function gerade erst deployt): nur merken, keine alten Tore melden.
  const baseline = !prev || prev.status === undefined;
  const known = new Set(((prev && prev.goals) || []).map(goalKey));
  const fresh = baseline ? [] : s.goals.filter(q => !known.has(goalKey(q)));
  let periodsPushed = prev ? num(prev.periodsPushed) : s.periodsDone;
  if (baseline) periodsPushed = s.periodsDone;

  const doc = { ...base, ...s, periodsPushed, updatedAt: ts() };
  if (baseline) doc.startedMidGame = true;

  const changed = !prev || prev.hs !== s.hs || prev.as !== s.as || prev.status !== s.status || prev.clock !== s.clock
    || prev.period !== s.period || (prev.goals || []).length !== s.goals.length;
  if (changed) await ref.set(doc, { merge: false });

  // Tore melden (nicht mehr, wenn das Spiel in diesem Moment schon beendet ist – dann kommt der Ergebnis-Push)
  if (fresh.length && s.status !== "final") {
    const p = goalPush(g, s, fresh);
    const st = await sendLive("liveGoals", g, p.title, p.body);
    logger.info("Live-Tor-Push", { id: g.id, tore: fresh.length, ...st });
  }

  // Drittelergebnisse: nur nach dem 1. und 2. Drittel (das Spielende meldet der Ergebnis-Push)
  if (s.status !== "final" && s.periodsDone > periodsPushed && s.periodsDone < s.periodCount) {
    const p = s.periodsDone;
    const per = s.periods[p - 1];
    const title = `⏸️ Nach dem ${p}. Drittel`;
    const body = `U15 ${g.team}: ${scoreLine(g, s)}` + (per && p > 1 ? `\n${p}. Drittel: ${per[0]}:${per[1]}` : "");
    const st = await sendLive("livePeriods", g, title, body);
    logger.info("Live-Drittel-Push", { id: g.id, drittel: p, ...st });
    await ref.update({ periodsPushed: p });
  }

  if (s.status === "final") await maybeAutoResult(db, g, ref, doc, now, true);
  return { id: g.id, status: s.status, hs: s.hs, as: s.as, clock: s.clock, neueTore: fresh.length };
}

async function maybeAutoResult(db, g, ref, d, now, force = false) {
  const r = await db.collection("results").doc(g.id).get();
  const has = r.exists && r.data().homeScore !== undefined && r.data().homeScore !== "";
  if (has) return;
  const last = d.resultTryAt && d.resultTryAt.toMillis ? d.resultTryAt.toMillis() : 0;
  if (!force && now.getTime() - last < ERGEBNIS_VERSUCH_MIN * 60000) return;
  await ref.update({ resultTryAt: ts() });
  try { logger.info("Spielende – autoResults angestoßen", await sync.runAutoResults()); }
  catch (err) { logger.warn("autoResults nach Spielende fehlgeschlagen", { err: String(err && err.message) }); }
}

async function runLiveTicker(now = new Date()) {
  const db = admin.firestore();
  const games = (await todaysGames(db, now)).filter(g => inWindow(g, now));
  if (!games.length) return null;
  const out = [];
  for (const g of games) {
    try { out.push(await tick(db, g, now)); }
    catch (err) { logger.warn("Live-Ticker: Spiel nicht abrufbar", { id: g.id, err: String(err && err.message) }); }
  }
  return out;
}

exports.liveTicker = onSchedule(
  { schedule: "every 1 minutes", timeZone: "Europe/Berlin", region: REGION, maxInstances: 1, timeoutSeconds: 50, memory: "256MiB" },
  async () => {
    const r = await runLiveTicker();
    if (r) logger.info("liveTicker", { spiele: r });
  }
);

exports._test = { parse, goalPush, inWindow, runLiveTicker };
