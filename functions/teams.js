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

module.exports = { TEAMS, LEGACY, teamKey, teamLabel, teamAge, wantsTeamPrefs, GAMES_RE };
