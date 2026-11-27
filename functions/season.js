/**
 * Saisonwechsel (ab 1.72.3): neuen Spielplan beim EHV abrufen – nur Admin, nur lesen.
 *
 *   exports.seasonImport = require("./season").seasonImport;
 *
 * Eingabe (Admin-Bereich › Saison › Saisonwechsel): je Mannschaft die EHV-Liganummer (divisionId).
 * Ausgabe: alle Grizzlys-Spiele dieser Ligen im Format von spielplan.js und der fertige Dateitext.
 * Die App schreibt nichts – der Admin lädt die Datei herunter und schickt sie für das Test-Paket mit.
 * Hallen: Ortsname wie in rinkAddresses (js/app.js der Live-App), sonst die Angabe des EHV.
 */
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { _ehv } = require("./standings");

const REGION = "europe-west1";
const SITE = "https://jazm1309.github.io/grizzlys-u15/";
const ADMIN_UID = "q6AID4Wkp2arQlCTROTKqON6ckk2";
const OWN = /grizzlys|bergkamen/i;
const DAYS = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

const norm = s => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ß/g, "ss").replace(/[^a-z0-9]/g, "");

async function loadRinks() {
  try {
    const res = await fetch(SITE + "js/app.js?t=" + Date.now(), { headers: { "cache-control": "no-cache" } });
    if (!res.ok) return [];
    const m = (await res.text()).match(/const rinkAddresses=(\{[^}]*\})/);
    return m ? Object.keys(JSON.parse(m[1])) : [];
  } catch (e) { return []; }
}

function stadiumOf(x, rinks) {
  const loc = String((x.location && (x.location.shortname || x.location.name)) || "").trim();
  const keys = rinks.slice().sort((a, b) => b.length - a.length);
  // erst die Hallenangabe des EHV, dann der Name der Heimmannschaft (z. B. „EV Duisburg 1b“ → Duisburg)
  const hit = keys.find(k => norm(loc).includes(norm(k))) || keys.find(k => norm(x.homeTeamLongName).includes(norm(k)));
  return { stadium: hit || loc || "", known: !!hit, raw: loc };
}

function mapRow(team, x, rinks) {
  const start = String(x.scheduledGameStart || "");
  const open = x.dateIsToBeDetermined === true || x.timeIsToBeDetermined === true || start.length < 16;
  const date = open ? "" : start.slice(0, 10), time = open ? "" : start.slice(11, 16);
  const st = stadiumOf(x, rinks);
  const day = date ? DAYS[new Date(date + "T12:00:00Z").getUTCDay()] : "";
  return {
    g: { team, day, date, time, home: String(x.homeTeamLongName || "").trim(), away: String(x.awayTeamLongName || "").trim(), stadium: st.stadium },
    open, unknownHall: !st.known, rawHall: st.raw
  };
}

function fileText(games, season) {
  const head = "/* Young Grizzlys – Spielplan (ab 1.39.0 eigene Datei)\n" +
    " * Ein Eintrag je Spiel. \"team\": Schlüssel aus APP_CFG.teams in index.html.\n" +
    " * Wird von der App (vor dem App-Code) und von den Cloud Functions gelesen (Variable SPIELPLAN).\n" +
    " * Verlegungen/Absagen während der Saison: im Admin-Bereich (Firestore „scheduleOverrides“), nicht hier.\n" +
    (season ? " * Saison " + season + " – aus dem EHV-Spielplan übernommen am " + new Date().toISOString().slice(0, 10) + ".\n" : "") +
    " */\n";
  return head + "window.SPIELPLAN=[\n" + games.map(g => JSON.stringify(g)).join(",\n") + "\n];\n";
}

exports.seasonImport = onCall({ region: REGION, maxInstances: 1, timeoutSeconds: 60 }, async (request) => {
  if (!request.auth?.uid) throw new HttpsError("unauthenticated", "Admin-Anmeldung erforderlich.");
  if (request.auth.uid !== ADMIN_UID) throw new HttpsError("permission-denied", "Keine Admin-Berechtigung.");
  const d = request.data || {};
  const div = d.divisions && typeof d.divisions === "object" ? d.divisions : {};
  const entries = Object.entries(div)
    .map(([t, id]) => [String(t).trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6), String(id || "").replace(/\D/g, "").slice(0, 8)])
    .filter(([t, id]) => t && id);
  if (!entries.length || entries.length > 6) throw new HttpsError("invalid-argument", "Bitte 1 bis 6 Mannschaften mit Liganummer angeben.");
  const rinks = await loadRinks();
  const teams = {}, all = [];
  await Promise.all(entries.map(async ([team, id]) => {
    try {
      const rows = (await _ehv.fetchApi("Schedule", id)).data.rows || [];
      const own = rows.filter(x => OWN.test(String(x.homeTeamLongName) + " " + String(x.awayTeamLongName)));
      const mapped = own.map(x => mapRow(team, x, rinks));
      teams[team] = { id, ok: true, total: rows.length, games: mapped.length, open: mapped.filter(m => m.open).length,
        unknownHalls: [...new Set(mapped.filter(m => m.unknownHall).map(m => m.rawHall || m.g.home))] };
      all.push(...mapped);
    } catch (err) {
      logger.warn("seasonImport: Liga " + id + " nicht abrufbar", { err: String(err && err.message) });
      teams[team] = { id, ok: false, error: "Liga nicht gefunden oder EHV nicht erreichbar" };
    }
  }));
  all.sort((a, b) => ((a.g.date || "9999") + a.g.time + a.g.team).localeCompare((b.g.date || "9999") + b.g.time + b.g.team));
  const games = all.map(m => m.g);
  return { teams, games, open: all.filter(m => m.open).length, text: fileText(games.filter(g => g.date), String(d.season || "").slice(0, 9)) };
});

exports._test = { mapRow, stadiumOf, fileText };
