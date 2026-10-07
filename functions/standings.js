/**
 * Tabellenstand und beendete Spiele der Ligen von U15 A / U15 B
 * vom EHV NRW (Datenquelle: hockeydata)
 *
 * Die App fragt nur diese Function ab – nie den externen Dienst direkt.
 * Vorteile: kein fremder Code in der App, der EHV-Schlüssel steht nicht
 * im App-Quelltext, und bei einem Ausfall wird der letzte Stand geliefert.
 *
 * Einbinden in functions/index.js (eine Zeile):
 *   exports.standings = require("./standings").standings;
 *
 * Deploy (nur diese Function, alle anderen bleiben unberührt):
 *   firebase deploy --only functions:standings
 */
const { onRequest } = require("firebase-functions/v2/https");

const API = "https://api.hockeydata.net/data/ih";
const API_KEY = "f4b71c8702bd3a6eadc89becf6da5a4e"; // öffentlicher Schlüssel der EHV-Seite
const DIVISIONS = { A: "21652", B: "21656" };        // A: U15 Landesliga NRW · B: Liga der U15 B
const ALLOWED_ORIGINS = ["https://jazm1309.github.io"]; // Live- und Test-App
const CACHE_MS = 30 * 60 * 1000;                     // höchstens alle 30 Minuten neu abrufen

let cache = null; // { ts, body } – bleibt erhalten, solange die Instanz warm ist

async function fetchApi(method, divisionId) {
  const url = `${API}/${method}?apiKey=${API_KEY}&divisionId=${divisionId}&lang=de&referer=www.ehv-nrw.de&format=json`;
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error("HTTP " + res.status);
  const d = await res.json();
  if (!d || d.statusId !== 1 || !d.data || !Array.isArray(d.data.rows)) {
    throw new Error("Unerwartete Antwort");
  }
  return d;
}

// Beendet ist ein Spiel, wenn der EHV es als "FINISHED" kennzeichnet. Das Feld gameHasEnded
// allein reicht nicht: Es bleibt bei vielen Spielen auf false, wenn die Spieluhr im
// Spielbericht nicht bis zum Ende gelaufen ist, obwohl das Spiel als Endstand geführt wird.
function isFinished(x) {
  return !!x && (x.gameHasEnded === true || (Array.isArray(x.labels) && x.labels.includes("FINISHED")));
}

const PERIOD = /^\d{1,2}:\d{1,2}$/;

/** Beendete Spiele der Liga (alle Teams): Datum, Teams, Endstand, Drittel. Ohne Spielernamen. */
async function fetchGames(divisionId) {
  const d = await fetchApi("Schedule", divisionId);
  return d.data.rows
    .filter((x) => isFinished(x) && typeof x.scheduledGameStart === "string")
    .map((x) => ({
      d: x.scheduledGameStart.slice(0, 10),
      t: Number(x.gameUtcTimestamp) || 0,
      h: String(x.homeTeamLongName || "").slice(0, 120),
      a: String(x.awayTeamLongName || "").slice(0, 120),
      hs: Number(x.homeTeamScore) || 0,
      as: Number(x.awayTeamScore) || 0,
      ot: x.isOvertime === true,
      so: x.isShootOut === true,
      p: [x.periodResults1, x.periodResults2, x.periodResults3].filter((v) => typeof v === "string" && PERIOD.test(v)),
    }))
    .filter((x) => x.h && x.a && /^\d{4}-\d{2}-\d{2}$/.test(x.d))
    .sort((x, y) => x.t - y.t)
    .slice(-400);
}

async function fetchDivision(divisionId) {
  const d = await fetchApi("Standings", divisionId);
  if (!d.data.rows.length) throw new Error("Leere Tabelle");
  const rows = d.data.rows
    .map((x) => ({
      n: String(x.teamLongname || "").slice(0, 120),
      r: Number(x.tableRank) || 0,
      gp: Number(x.gamesPlayed) || 0,
      p: Number(x.points) || 0,
      gd: parseInt(x.goalDifference, 10) || 0,
    }))
    .filter((x) => x.n && x.r);
  if (!rows.length) throw new Error("Keine Tabellenzeilen");
  return { rows, upd: String((d.lastUpdate && d.lastUpdate.formattedShort) || "").slice(0, 40) };
}

async function loadAll() {
  const body = { ts: Date.now() };
  const results = await Promise.allSettled(
    Object.entries(DIVISIONS).map(async ([team, id]) => {
      const [table, games] = await Promise.allSettled([fetchDivision(id), fetchGames(id)]);
      if (table.status !== "fulfilled") throw table.reason;
      const part = table.value;
      if (games.status === "fulfilled") part.games = games.value;
      else {
        console.warn("Spiele U15 " + team + " nicht abrufbar:", games.reason && games.reason.message);
        if (cache && cache.body[team] && cache.body[team].games) part.games = cache.body[team].games;
      }
      return [team, part];
    })
  );
  let ok = 0;
  results.forEach((r, i) => {
    const team = Object.keys(DIVISIONS)[i];
    if (r.status === "fulfilled") { body[team] = r.value[1]; ok++; }
    else {
      console.warn("Tabellenstand U15 " + team + " nicht abrufbar:", r.reason && r.reason.message);
      if (cache && cache.body[team]) body[team] = cache.body[team]; // letzter bekannter Stand
    }
  });
  if (!ok && !cache) throw new Error("Kein Tabellenstand verfügbar");
  return body;
}

exports.standings = onRequest(
  { region: "europe-west1", cors: ALLOWED_ORIGINS, maxInstances: 2, memory: "256MiB", timeoutSeconds: 30 },
  async (req, res) => {
    if (req.method !== "GET") { res.status(405).json({ error: "Nur GET" }); return; }
    try {
      if (!cache || Date.now() - cache.ts > CACHE_MS) {
        const body = await loadAll();
        cache = { ts: Date.now(), body };
      }
      res.set("Cache-Control", "public, max-age=900");
      res.status(200).json(cache.body);
    } catch (err) {
      console.error("standings:", err && err.message);
      if (cache) { res.status(200).json(cache.body); return; }
      res.status(502).json({ error: "Tabellenstand derzeit nicht verfügbar" });
    }
  }
);

// Für ehv-sync.js (automatische Ergebnisse, Spielplan-Abgleich)
exports._ehv = { fetchApi, DIVISIONS, isFinished };
