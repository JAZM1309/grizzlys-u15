/**
 * Automatische Spielberichte (ab 1.37.0) – für alle Mannschaften.
 *
 * Läuft am Ende von autoResults (alle 30 Minuten, kein eigener Zeitplan):
 *  1. Entwurf: Für gespielte Spiele der letzten Tage mit Ergebnis und ohne Bericht wird aus dem
 *     EHV-Spielbericht ein faktenbasierter Fließtext erzeugt – mit derselben Vorlage wie im
 *     Admin-Bereich (spielbericht.js, geladen von der Live-Seite; Fallback: Kopie in diesem Ordner).
 *     Gespeichert als unveröffentlichter Entwurf (reports/<Spiel>, auto: true) + Admin-Push.
 *  2. Freigabe: Ohne Reaktion des Admins wird der Entwurf nach AUTO_PUBLISH_HOURS veröffentlicht.
 *     Speichert oder verwirft der Admin den Bericht in der App, entfällt die automatische Freigabe.
 *
 * Nur Fakten (Ergebnis, Drittel, Torfolge, Über-/Unterzahl, Strafen, Tabelle, Spielplan).
 * Spieler nie mit Namen – nur Rückennummern.
 */
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const vm = require("vm");
const { _ehv } = require("./standings");
const { _report } = require("./game-report");
const { TEAMS, teamLabel } = require("./teams");

const SITE = "https://jazm1309.github.io/grizzlys-u15/";
const STANDINGS_URL = "https://europe-west1-grizzlys-u15.cloudfunctions.net/standings";
const ADMIN_UID = "q6AID4Wkp2arQlCTROTKqON6ckk2";
const AUTO_PUBLISH_HOURS = 12;   // so lange hat der Admin Zeit zum Prüfen
const MAX_AGE_DAYS = 4;          // ältere Spiele bekommen keinen automatischen Bericht mehr
const WAIT_FULL_HOURS = 36;      // so lange auf einen vollständigen EHV-Spielbericht warten
const MAX_PER_RUN = 3;

const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9äöüß]/g, "");
const hasScore = (r) => !!r && r.homeScore !== undefined && r.awayScore !== undefined && r.homeScore !== "" && r.awayScore !== "";

// ---------- Vorlage laden ----------
let engineCache = null;
async function loadEngine() {
  if (engineCache && Date.now() - engineCache.ts < 30 * 60 * 1000) return engineCache.fn;
  let fn = null, from = "live";
  try {
    const res = await fetch(SITE + "spielbericht.js?ts=" + Date.now(), { signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const code = await res.text();
    const box = { console, Proxy, Math, Date, JSON, Number, String, Array, Object, Set, Map, RegExp, Intl, isNaN, parseInt };
    box.globalThis = box;
    vm.runInNewContext(code, box, { timeout: 2000, filename: "spielbericht.js" });
    if (typeof box.createSpielbericht !== "function") throw new Error("createSpielbericht fehlt");
    fn = box.createSpielbericht;
  } catch (err) {
    from = "kopie";
    logger.warn("spielbericht.js von der Live-Seite nicht nutzbar – nehme die Kopie", { err: String(err && err.message) });
    fn = require("./spielbericht.js");
  }
  engineCache = { ts: Date.now(), fn, from };
  return fn;
}

// ---------- Helfer wie in der App ----------
function shortTeam(name) {
  const n = String(name);
  if (/grizzlys/i.test(n)) { if (/young cats/i.test(n)) return "Grizzlys / Young Cats"; if (/1b/i.test(n)) return "Grizzlys B"; return "Grizzlys"; }
  return n;
}
function editDistance(a, b) {
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0]; prev[0] = i;
    for (let j = 1; j <= b.length; j++) { const tmp = prev[j]; prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1)); diag = tmp; }
  }
  return prev[b.length];
}
function makeEnv(games, results, standings, details) {
  const resultFor = (g) => results[g.date + "_" + g.time.replace(/:/g, "") + "_" + g.team] || null;
  const standRow = (team, name) => {
    const rows = standings[team] && standings[team].rows; if (!Array.isArray(rows)) return null;
    const n = norm(name);
    return rows.find((r) => norm(r.n) === n) || rows.find((r) => n.length >= 8 && editDistance(norm(r.n), n) <= 1) || null;
  };
  const standPeriodsData = (g) => {
    const L = standings[g.team] && standings[g.team].games; if (!Array.isArray(L)) return null;
    const h = standRow(g.team, g.home), a = standRow(g.team, g.away); if (!h || !a) return null;
    const x = L.find((y) => y.d === g.date && y.h === h.n && y.a === a.n); if (!x || !x.p || x.p.length < 3) return null;
    const r = resultFor(g); if (!r || Number(r.homeScore) !== x.hs || Number(r.awayScore) !== x.as) return null;
    return x;
  };
  return {
    win: { resultFor, repDetails: details },
    ALL_GAMES: games,
    standings: () => standings,
    dt: (g) => new Date(g.date + "T" + g.time + ":00"),
    isHome: (g) => g.home.includes("ESV Grizzlys"),
    shortTeam,
    teamName: (t) => teamLabel(t),
    standRow, standPeriodsData,
    leagues: () => Object.fromEntries(Object.entries(TEAMS).map(([k, v]) => [k, v.league])),
  };
}

async function loadStandings() {
  try {
    const res = await fetch(STANDINGS_URL, { signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error("HTTP " + res.status);
    return await res.json();
  } catch (err) { logger.warn("Tabellenstand für Spielbericht nicht abrufbar", { err: String(err && err.message) }); return {}; }
}

async function adminPush(title, body) {
  try {
    const snap = await admin.firestore().collection("pushTokens").where("admin", "==", true).get();
    await Promise.all(snap.docs.filter((d) => d.get("adminUid") === ADMIN_UID).map((d) =>
      admin.messaging().send({ token: d.id, data: { type: "adminReport", title, body }, webpush: { headers: { Urgency: "normal", TTL: "86400" } } })
        .catch(() => null)));
  } catch (err) { logger.warn("Admin-Push für Spielbericht fehlgeschlagen", { err: String(err && err.message) }); }
}

const fmtTime = (ms) => new Date(ms).toLocaleString("de-DE", { timeZone: "Europe/Berlin", weekday: "short", hour: "2-digit", minute: "2-digit" });

// ---------- 1. Entwürfe ----------
async function createDrafts({ games, today, loadEhvRows, findEhvGame, daysBefore }) {
  const db = admin.firestore();
  const [resSnap, repSnap] = await Promise.all([db.collection("results").get(), db.collection("reports").get()]);
  const results = {}; resSnap.forEach((d) => { results[d.id] = d.data(); });
  const reports = new Set(repSnap.docs.map((d) => d.id));
  // 1.37.1: verwendete Formulierungs-Bausteine früherer Berichte – die letzten 8 je Mannschaft werden gemieden
  const prevBs = repSnap.docs.map((d) => ({ id: d.id, team: d.get("team"), b: d.get("bausteine") })).filter((x) => x.b && typeof x.b === "object");
  const recentFor = (g, id) => { const m = {}; prevBs.filter((x) => x.team === g.team && x.id < id).sort((a, b) => (a.id < b.id ? -1 : 1)).slice(-8)
    .forEach((x) => Object.entries(x.b).forEach(([k, v]) => { (m[k] = m[k] || []).push(v); })); return m; };
  const from = daysBefore(today, MAX_AGE_DAYS);
  const key = (g) => g.date + "_" + g.time.replace(/:/g, "") + "_" + g.team;
  const todo = games.filter((g) => !g.cancelled && g.date >= from && g.date <= today && hasScore(results[key(g)]) && !reports.has(key(g)))
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)).slice(0, MAX_PER_RUN);
  if (!todo.length) return 0;

  const rows = await loadEhvRows(new Set(todo.map((g) => g.team)));
  const standings = await loadStandings();
  const create = await loadEngine();
  let made = 0;
  for (const g of todo) {
    const id = key(g), r = results[id];
    try {
      let ehvId = String(r.ehvGameId || "");
      if (!ehvId && rows[g.team]) { const x = findEhvGame(g, rows[g.team]); if (x && _ehv.isFinished(x)) ehvId = String(x.id); }
      let det = null;
      if (ehvId) {
        det = _report.summarize(await _report.fetchReport(ehvId), false); // nur Rückennummern
        const need = Number(r.homeScore) + Number(r.awayScore) - (det.so ? 1 : 0);
        const full = det.hs === Number(r.homeScore) && det.as === Number(r.awayScore) && det.goals.length >= need;
        const ageH = (Date.now() - new Date(g.date + "T" + g.time + ":00+01:00").getTime()) / 3600000;
        if (!full && ageH < WAIT_FULL_HOURS) { logger.info("Spielbericht wartet auf vollständige EHV-Daten", { id }); continue; }
        if (!full) det = null;
      } else {
        const ageH = (Date.now() - new Date(g.date + "T" + g.time + ":00+01:00").getTime()) / 3600000;
        if (ageH < WAIT_FULL_HOURS) continue; // EHV-Spiel noch nicht gefunden – später erneut
      }
      const env = makeEnv(games, results, standings, det ? { [id]: det } : {});
      env.recent = () => recentFor(g, id);
      const eng = create(env);
      const d = eng.repDraft(g, 0, "", {}, "");
      if (!d || !d.text) continue;
      const publishAt = Date.now() + AUTO_PUBLISH_HOURS * 3600000;
      const ts = admin.firestore.FieldValue.serverTimestamp();
      await db.collection("reports").doc(id).create({
        gameId: id, team: g.team, date: g.date, title: String(d.title || "").slice(0, 120), text: String(d.text).slice(0, 2000),
        keywords: "", use: {}, len: "", published: false, publishedAt: null,
        auto: true, autoPublishAt: admin.firestore.Timestamp.fromMillis(publishAt), autoSource: engineCache ? engineCache.from : "",
        withDetails: !!det, bausteine: d.bausteine || null, createdAt: ts, updatedAt: ts,
      });
      made++;
      prevBs.push({ id, team: g.team, b: d.bausteine || {} }); // gilt schon für den nächsten Entwurf im selben Lauf
      logger.info("Spielbericht-Entwurf erstellt", { id, details: !!det });
      await adminPush("📝 Spielbericht-Entwurf · " + teamLabel(g.team),
        `${shortTeam(g.home)} – ${shortTeam(g.away)} ${r.homeScore}:${r.awayScore}. Bitte prüfen – ohne Änderung erscheint er ${fmtTime(publishAt)} Uhr.`);
    } catch (err) {
      if (String(err && err.code) === "6" || /already exists/i.test(String(err && err.message))) continue; // inzwischen vorhanden
      logger.warn("Spielbericht-Entwurf fehlgeschlagen", { id, err: String(err && err.message) });
    }
  }
  return made;
}

// ---------- 2. Automatische Freigabe ----------
async function publishDue() {
  const db = admin.firestore();
  const snap = await db.collection("reports").where("auto", "==", true).where("published", "==", false).get();
  const now = Date.now(); let n = 0;
  for (const d of snap.docs) {
    const at = d.get("autoPublishAt");
    if (!at || !at.toMillis || at.toMillis() > now) continue;
    await d.ref.update({ published: true, publishedAt: admin.firestore.FieldValue.serverTimestamp(), autoPublished: true, autoPublishAt: null, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    n++; logger.info("Spielbericht automatisch veröffentlicht", { id: d.id });
  }
  return n;
}

async function runAutoReports(ctx) {
  const published = await publishDue().catch((err) => { logger.warn("Auto-Freigabe fehlgeschlagen", { err: String(err) }); return 0; });
  const drafts = await createDrafts(ctx).catch((err) => { logger.warn("Auto-Entwürfe fehlgeschlagen", { err: String(err) }); return 0; });
  return { drafts, published };
}

module.exports = { runAutoReports, _test: { makeEnv, loadEngine, shortTeam } };
