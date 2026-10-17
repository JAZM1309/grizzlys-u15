/**
 * Spieldetails vom EHV NRW (hockeydata „GetGameReport“) für den Spielbericht-Entwurf im Admin-Bereich.
 *
 *  - Nur für den Admin (onCall mit Anmeldung) – es gibt keinen öffentlichen Abruf.
 *  - Liefert eine aufbereitete Zusammenfassung: Tore mit Spielzeit und Spielsituation,
 *    Strafen-Anzahl, Über-/Unterzahl, Zeit in Führung, Zuschauer.
 *  - Spielernamen (Torschützen/Vorlagen/Torhüter) nur, wenn die App sie ausdrücklich anfordert
 *    (Schalter „Namen nennen“ im Admin). Strafen werden nie mit Namen geliefert.
 *
 * Einbinden in functions/index.js (eine Zeile):
 *   exports.gameReport = require("./game-report").gameReport;
 *
 * Deploy (nur diese Function):
 *   firebase deploy --only functions:gameReport --project grizzlys-u15
 */
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { _ehv } = require("./standings");
const { _test: sync } = require("./ehv-sync");

const REGION = "europe-west1";
const ADMIN_UID = "q6AID4Wkp2arQlCTROTKqON6ckk2";
const API = "https://api.hockeydata.net/data/ih";
const API_KEY = "f4b71c8702bd3a6eadc89becf6da5a4e"; // öffentlicher Schlüssel der EHV-Seite (wie standings.js)
const CACHE_MS = 10 * 60 * 1000;
const cache = new Map(); // gameId -> { ts, data }

const isId = (s) => typeof s === "string" && /^[0-9a-f-]{36}$/i.test(s);
const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

async function fetchReport(gameId) {
  const hit = cache.get(gameId);
  if (hit && Date.now() - hit.ts < CACHE_MS) return hit.data;
  const url = `${API}/GetGameReport?apiKey=${API_KEY}&gameId=${gameId}&lang=de&referer=www.ehv-nrw.de&format=json`;
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error("HTTP " + res.status);
  const d = await res.json();
  if (!d || d.statusId !== 1 || !d.data || !d.data.gameData) throw new Error("Unerwartete Antwort");
  cache.set(gameId, { ts: Date.now(), data: d.data });
  return d.data;
}

// „LANGNER“ -> „Langner“, „SCHÄFERS“ -> „Schäfers“, „MAAß“ -> „Maaß“
function nice(s) {
  return String(s || "").toLowerCase().replace(/(^|[\s-])(\p{L})/gu, (m, a, b) => a + b.toUpperCase());
}
function person(p, withNames) {
  if (!p) return null;
  const o = { nr: String(p.playerJerseyNr ?? "") };
  if (withNames) o.name = (nice(p.playerFirstname) + " " + nice(p.playerLastname)).trim();
  return o;
}

function summarize(r, withNames) {
  const g = r.gameData;
  const goals = [];
  for (const [side, list] of [["h", r.homeGoals], ["a", r.awayGoals]]) {
    for (const x of Array.isArray(list) ? list : []) {
      const str = String(x.gameStrength || "EQ").toUpperCase();
      goals.push({
        t: num(x.gameTime), side, score: String(x.newScore || ""),
        pp: /^PP/.test(str), sh: /^SH/.test(str), en: x.isEmptyNet === true, ps: x.isPenaltyShot === true,
        scorer: person(x.scoredBy, withNames), a1: person(x.assistBy, withNames), a2: person(x.assist2By, withNames),
      });
    }
  }
  goals.sort((a, b) => a.t - b.t);
  const team = (k) => {
    const s = r[k + "TeamStats"] || {}, tv = s.timeValues || {};
    const pens = Array.isArray(r[k + "Penalties"]) ? r[k + "Penalties"] : [];
    const keepers = (Array.isArray(r[k + "GoalKeepers"]) ? r[k + "GoalKeepers"] : [])
      .filter((p) => num(p.playingTime) > 0)
      .map((p) => ({ ...person(p, withNames), min: Math.round(num(p.playingTime) / 60), ga: num(p.goalsAgainst) }));
    return {
      name: String(g[k + "TeamLongname"] || "").slice(0, 120),
      pim: num(s.penaltyMinutes), penalties: pens.length,
      ppOpp: num(s.powerplayOpportunities), pkSit: num(s.penaltykillSituations),
      lead: num(tv.leading), tied: num(tv.tied), trail: num(tv.trailing),
      keepers,
    };
  };
  return {
    id: String(g.id), date: String((g.scheduledDate && g.scheduledDate.value) || ""),
    hs: num(g.homeTeamScore), as: num(g.awayTeamScore),
    ot: num(g.isOvertime) > 0, so: num(g.isShootOut) > 0,
    attendance: num(g.attendance), periodLength: num(g.lengthOfPeriod) || 1200,
    periods: (Array.isArray(g.periodStats) ? g.periodStats : []).map((p) => [num(p.homeScore), num(p.awayScore)]),
    home: team("home"), away: team("away"), goals, names: !!withNames,
  };
}

exports.gameReport = onCall({ region: REGION, maxInstances: 2, timeoutSeconds: 30 }, async (request) => {
  if (!request.auth?.uid) throw new HttpsError("unauthenticated", "Admin-Anmeldung erforderlich.");
  if (request.auth.uid !== ADMIN_UID) throw new HttpsError("permission-denied", "Keine Admin-Berechtigung.");
  const q = request.data || {};
  const team = q.team === "B" ? "B" : "A";
  try {
    let id = isId(q.ehvGameId) ? q.ehvGameId : "";
    if (!id) {
      // Spiel über den EHV-Spielplan suchen (wie beim automatischen Ergebnis)
      const rows = (await _ehv.fetchApi("Schedule", _ehv.DIVISIONS[team])).data.rows;
      const x = sync.findEhvGame({ home: String(q.home || ""), away: String(q.away || ""), date: String(q.date || "") }, rows);
      if (!x || !_ehv.isFinished(x)) return { ok: false, reason: "Spiel beim EHV nicht gefunden oder noch nicht beendet." };
      id = String(x.id);
    }
    const r = await fetchReport(id);
    return { ok: true, report: summarize(r, q.names === true) };
  } catch (err) {
    logger.warn("gameReport fehlgeschlagen", { err: String(err && err.message) });
    throw new HttpsError("unavailable", "Spieldetails vom EHV gerade nicht abrufbar.");
  }
});

exports._test = { summarize, nice };
