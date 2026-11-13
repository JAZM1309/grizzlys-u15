/**
 * Mannschaften der App „Young Grizzlys“ (ab 1.35.0) – an einer Stelle für alle Functions.
 *
 * Schlüssel = Wert "team" im Spielplan der App (index.html).
 * Push-Auswahl der Geräte (pushTokens.prefs):
 *   - A und B: wie bisher – fehlt die Angabe, gibt es Push (alte Geräte bekommen weiter alles von der U15).
 *   - weitere Mannschaften (z. B. U13): nur mit ausdrücklichem prefs.teamU13 === true.
 *     So bekommen bestehende U15-Nutzer nicht plötzlich U13-Meldungen.
 */
const TEAMS = {
  A: { label: "U15 A", age: "U15", league: "Landesliga NRW" },
  B: { label: "U15 B", age: "U15", league: "Bezirksliga NRW" },
  U13: { label: "U13", age: "U13", league: "Landesliga NRW" }
};
const LEGACY = ["A", "B"];

function teamKey(t) {
  const k = String(t || "").trim().toUpperCase();
  return TEAMS[k] ? k : "A";
}
function teamLabel(t) { return TEAMS[teamKey(t)].label; }
function teamAge(t) { return TEAMS[teamKey(t)].age; }

function wantsTeamPrefs(prefs, team) {
  const p = prefs || {}, k = teamKey(team);
  return LEGACY.includes(k) ? p["team" + k] !== false : p["team" + k] === true;
}

// Spielplan aus der index.html: ab 1.35.0 heißt er ALL_GAMES (vorher games) – beides wird erkannt.
const GAMES_RE = /const (?:ALL_GAMES|games)=(\[[\s\S]*?\]);/;
// Ab 1.39.0 liegt der Spielplan in einer eigenen Datei spielplan.js (Variable SPIELPLAN in spielplan.js)
const SPIELPLAN_RE = /window\.SPIELPLAN\s*=\s*(\[[\s\S]*?\]);/;

/** Spielplan der Live-Seite laden: zuerst spielplan.js, sonst (ältere Stände) aus der index.html. */
async function loadSpielplan(site) {
  const get = async (f) => {
    const res = await fetch(site + f + "?t=" + Date.now(), { headers: { "cache-control": "no-cache" } });
    if (!res.ok) throw new Error(f + " nicht ladbar: HTTP " + res.status);
    return res.text();
  };
  try {
    const m = (await get("spielplan.js")).match(SPIELPLAN_RE);
    if (m) return JSON.parse(m[1]);
  } catch (e) { /* ältere Live-Stände haben keine spielplan.js */ }
  const m = (await get("index.html")).match(GAMES_RE);
  if (!m) throw new Error("Spielplan weder in spielplan.js noch in index.html gefunden");
  return JSON.parse(m[1]);
}

module.exports = { TEAMS, LEGACY, teamKey, teamLabel, teamAge, wantsTeamPrefs, GAMES_RE, SPIELPLAN_RE, loadSpielplan };
