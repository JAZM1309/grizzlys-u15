/**
 * 1.43.0: Wetter und Glätte am Spieltag
 *
 *  - weatherForecast: läuft alle 3 Stunden. Für jedes Spiel der nächsten 3 Tage holt sie bei Open-Meteo
 *    (kostenlos, ohne Schlüssel) die Vorhersage am Spielort und speichert eine kurze Zusammenfassung in
 *    weather/{Spiel-ID} (Spiel-ID wie bei den Ergebnissen: Datum_Uhrzeit_Team). Die App liest diese
 *    Dokumente (für alle lesbar, schreiben nur diese Function) – die Geräte selbst fragen keinen Wetterdienst.
 *  - Ort: Koordinaten der Halle aus RINK_GEO in js/app.js der Live-Seite (Schlüssel = Spielort im Spielplan).
 *  - Glättegefahr: um die Anfahrt (4 Std. vor bis 3 Std. nach Bully) höchstens 1 °C und Niederschlag
 *    (oder Regenwahrscheinlichkeit ab 40 %) bzw. Schneefall; Frost ohne Niederschlag gilt als „Frost“.
 *  - sendGameReminders (push.js) hängt die Zusammenfassung an die 24h-Erinnerung an.
 *
 * Einbinden in functions/index.js:  exports.weatherForecast = require("./weather").weatherForecast;
 */
const { onSchedule } = require("firebase-functions/v2/scheduler");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const { _test: sync } = require("./ehv-sync");

if (!admin.apps.length) admin.initializeApp();

const REGION = "europe-west1";
const SITE = "https://jazm1309.github.io/grizzlys-u15/";
const TAGE = 3;
const FALLBACK_GEO = { Bergkamen: [51.6275, 7.646] };

// WMO-Wettercodes -> kurzer Text
function codeText(c) {
  if (c === 0) return "Klar";
  if (c <= 2) return "Leicht bewölkt";
  if (c === 3) return "Bewölkt";
  if (c === 45 || c === 48) return "Nebel";
  if (c >= 51 && c <= 57) return c >= 56 ? "Gefrierender Niesel" : "Nieselregen";
  if (c >= 61 && c <= 67) return c >= 66 ? "Gefrierender Regen" : "Regen";
  if (c >= 71 && c <= 77) return "Schnee";
  if (c >= 80 && c <= 82) return "Schauer";
  if (c === 85 || c === 86) return "Schneeschauer";
  if (c >= 95) return "Gewitter";
  return "";
}

async function loadGeo() {
  try {
    const res = await fetch(SITE + "js/app.js?t=" + Date.now(), { signal: AbortSignal.timeout(10000) });
    const m = (await res.text()).match(/const RINK_GEO=(\{[^}]*\});/);
    if (m) return { ...FALLBACK_GEO, ...JSON.parse(m[1]) };
  } catch (err) { logger.warn("RINK_GEO nicht ladbar", { err: String(err && err.message) }); }
  return FALLBACK_GEO;
}

// Datum/Uhrzeit in Berlin -> Schlüssel "YYYY-MM-DDTHH:00" wie in Open-Meteo (timezone=Europe/Berlin)
function hourKey(date, time, addH = 0) {
  const [y, mo, d] = date.split("-").map(Number), [h] = time.split(":").map(Number);
  const t = new Date(Date.UTC(y, mo - 1, d, h + addH));
  return t.toISOString().slice(0, 13) + ":00";
}

function summarize(H, g) {
  const idx = (k) => H.time.indexOf(k);
  const at = idx(hourKey(g.date, g.time));
  if (at < 0) return null;
  const win = [];
  for (let k = -4; k <= 3; k++) { const i = idx(hourKey(g.date, g.time, k)); if (i >= 0) win.push(i); }
  const tAt = H.temperature_2m[at], code = H.weather_code[at];
  const tMin = Math.min(...win.map((i) => H.temperature_2m[i]));
  const rain = win.reduce((a, i) => a + (H.precipitation[i] || 0), 0);
  const snow = win.reduce((a, i) => a + (H.snowfall[i] || 0), 0);
  const pp = Math.max(...win.map((i) => H.precipitation_probability[i] || 0));
  const freezing = win.some((i) => [56, 57, 66, 67].includes(H.weather_code[i]));
  const ice = freezing || (tMin <= 1 && (rain >= 0.2 || pp >= 40 || snow > 0));
  const frost = !ice && tMin <= 0;
  const parts = [(Math.round(tAt) || 0) + " °C", codeText(code)].filter(Boolean);
  if (pp >= 30 && !/Regen|Schnee|Schauer|Niesel|Gewitter/.test(parts[1] || "")) parts.push("Regen " + pp + " %");
  const warn = ice ? (snow > 0 ? "Schnee und Glätte möglich" : "Glättegefahr") : frost ? "Frost" : "";
  return {
    t: Math.round(tAt) || 0, tMin: Math.round(tMin) || 0, code, pp, rain: Math.round(rain * 10) / 10, snow: Math.round(snow * 10) / 10,
    ice, frost, txt: parts.join(", "), warn,
  };
}

async function runWeather() {
  const db = admin.firestore();
  const now = Date.now();
  const games = (await sync.loadAppGames()).filter((g) => {
    const t = new Date(g.date + "T" + g.time + ":00+01:00").getTime();
    return t > now - 3 * 3600000 && t < now + TAGE * 86400000;
  });
  if (!games.length) return { games: 0 };
  const geo = await loadGeo();
  const byPlace = new Map();
  games.forEach((g) => { const ll = geo[g.stadium] || geo.Bergkamen; const k = ll.join(","); if (!byPlace.has(k)) byPlace.set(k, { ll, games: [] }); byPlace.get(k).games.push(g); });
  let saved = 0;
  for (const { ll, games: list } of byPlace.values()) {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${ll[0]}&longitude=${ll[1]}&hourly=temperature_2m,precipitation,precipitation_probability,snowfall,weather_code&timezone=Europe%2FBerlin&forecast_days=${TAGE + 1}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const H = (await res.json()).hourly;
      for (const g of list) {
        const w = summarize(H, g);
        if (!w) continue;
        await db.collection("weather").doc(sync.resultKey(g)).set({ ...w, date: g.date, time: g.time, team: g.team, stadium: g.stadium, at: admin.firestore.FieldValue.serverTimestamp() });
        saved++;
      }
    } catch (err) { logger.warn("Wetter nicht abrufbar", { ll, err: String(err && err.message) }); }
  }
  // alte Einträge (Spiel länger als 2 Tage vorbei) aufräumen
  const old = await db.collection("weather").where("date", "<", new Date(now - 2 * 86400000).toISOString().slice(0, 10)).get();
  await Promise.all(old.docs.map((d) => d.ref.delete()));
  return { games: games.length, saved, removed: old.size };
}

exports.weatherForecast = onSchedule(
  { schedule: "every 3 hours", timeZone: "Europe/Berlin", region: REGION, maxInstances: 1, timeoutSeconds: 120 },
  async () => { const r = await runWeather(); logger.info("Wetter aktualisiert", r); }
);
exports._test = { summarize, hourKey, codeText };
