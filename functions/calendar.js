/**
 * Kalender-Abo (ab 1.72.0, Vorbereitung für die Saison 2027/28)
 *
 *   exports.calendarFeed = require("./calendar").calendarFeed;
 *
 * Liefert den Spielplan als abonnierbaren iCalendar-Feed (webcal://…/calendarFeed?t=A,B&v=home).
 * Kalender-Apps (iPhone, Google, Outlook) holen den Feed selbst regelmäßig ab – Verlegungen,
 * Absagen und Ergebnisse aus dem Admin-Bereich landen so automatisch in den Kalendern.
 *
 * Parameter:
 *   t  Mannschaften, Komma-getrennt (A, B, U13 …) – fehlt er: alle
 *   v  home | away – nur Heim- bzw. Auswärtsspiele (fehlt er: alle)
 *
 * Quellen: spielplan.js der Live-App, Firestore scheduleOverrides (Verlegung/Absage) und results.
 * Hallen-Adressen werden aus js/app.js der Live-App gelesen (rinkAddresses) – eine Quelle für beide.
 * Kosten: ein Aufruf je Kalender und Abruf (meist alle paar Stunden), Ergebnis 15 Min. zwischengespeichert.
 */
const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const { TEAMS, teamLabel, loadSpielplan } = require("./teams");

const SITE = "https://jazm1309.github.io/grizzlys-u15/";
const CACHE_MS = 15 * 60 * 1000;
let cache = null; // { ts, games, addr }

async function loadAddresses() {
  try {
    const res = await fetch(SITE + "js/app.js?t=" + Date.now(), { headers: { "cache-control": "no-cache" } });
    if (!res.ok) return {};
    const m = (await res.text()).match(/const rinkAddresses=(\{[^}]*\})/);
    return m ? JSON.parse(m[1]) : {};
  } catch (e) { return {}; }
}

async function loadData() {
  if (cache && Date.now() - cache.ts < CACHE_MS) return cache;
  const db = admin.firestore();
  const [games, addr, ovSnap, resSnap] = await Promise.all([
    loadSpielplan(SITE), loadAddresses(),
    db.collection("scheduleOverrides").get(), db.collection("results").get()
  ]);
  const ov = {}, res = {};
  ovSnap.forEach(d => { ov[d.id] = d.data(); });
  resSnap.forEach(d => { res[d.id] = d.data(); });
  for (const g of games) {
    g._baseId = g.date + "_" + g.time.replace(/:/g, "") + "_" + g.team;
    const o = ov[g._baseId];
    if (o) Object.assign(g, { date: o.date || g.date, time: o.time || g.time, home: o.home || g.home, away: o.away || g.away, stadium: o.stadium || g.stadium });
    // wie in der App (1.40.3/1.44.2): Absage gilt nur für den Tag, an dem sie gesetzt wurde
    g.cancelled = !!(o && o.cancelled === true && g.date === (o.cancelDate || o.originalDate || g.date));
    g.postponed = !!(g.cancelled && o.postponed === true);
    const r = res[g.date + "_" + g.time.replace(/:/g, "") + "_" + g.team];
    g.score = r && r.homeScore !== undefined && r.awayScore !== undefined && r.homeScore !== "" && r.awayScore !== "" ? r.homeScore + ":" + r.awayScore : "";
  }
  cache = { ts: Date.now(), games, addr };
  return cache;
}

// ---------- iCalendar ----------
const isHome = g => /ESV Grizzlys/.test(g.home);
const esc = s => String(s || "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
const p2 = n => String(n).padStart(2, "0");
const utc = d => d.getUTCFullYear() + p2(d.getUTCMonth() + 1) + p2(d.getUTCDate()) + "T" + p2(d.getUTCHours()) + p2(d.getUTCMinutes()) + p2(d.getUTCSeconds()) + "Z";

// Ortszeit Berlin (YYYY-MM-DD, HH:MM) → Date (UTC), Sommer-/Winterzeit berücksichtigt
function berlin(date, time) {
  const [y, m, d] = date.split("-").map(Number), [h, mi] = time.split(":").map(Number);
  const guess = Date.UTC(y, m - 1, d, h, mi);
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Berlin", hour12: false, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).formatToParts(new Date(guess));
  const v = k => Number(parts.find(x => x.type === k).value);
  const asBerlin = Date.UTC(v("year"), v("month") - 1, v("day"), v("hour") % 24, v("minute"));
  return new Date(guess - (asBerlin - guess));
}

// Zeilen über 75 Byte falten (RFC 5545)
function fold(line) {
  const out = []; let cur = "", len = 0;
  for (const ch of line) {
    const b = Buffer.byteLength(ch);
    if (len + b > (out.length ? 74 : 75)) { out.push(cur); cur = ""; len = 0; }
    cur += ch; len += b;
  }
  out.push(cur);
  return out.join("\r\n ");
}

function eventLines(g, addr, now) {
  const start = berlin(g.date, g.time), end = new Date(start.getTime() + 2 * 3600000);
  const opp = isHome(g) ? g.away : g.home, where = addr[g.stadium] || (g.stadium + ", Deutschland");
  const pre = g.cancelled ? (g.postponed ? "VERLEGT: " : "ABGESAGT: ") : "";
  const sc = g.score && !g.cancelled ? " (" + (isHome(g) ? g.score : g.score.split(":").reverse().join(":")) + ")" : "";
  const desc = [g.home + " gegen " + g.away, (isHome(g) ? "Heimspiel" : "Auswärtsspiel") + " · " + where];
  if (g.score && !g.cancelled) desc.push("Endstand " + g.score);
  desc.push("Young Grizzlys App: " + SITE);
  return [
    "BEGIN:VEVENT",
    "UID:" + g._baseId + "@young-grizzlys",
    "DTSTAMP:" + utc(now),
    "DTSTART:" + utc(start),
    "DTEND:" + utc(end),
    "SUMMARY:" + esc(pre + teamLabel(g.team) + " " + (isHome(g) ? "vs. " : "@ ") + opp + sc),
    "LOCATION:" + esc(where),
    "DESCRIPTION:" + esc(desc.join("\n")),
    "STATUS:" + (g.cancelled ? "CANCELLED" : "CONFIRMED"),
    "TRANSP:OPAQUE",
    "END:VEVENT"
  ];
}

function buildIcs(games, addr, name) {
  const now = new Date();
  const lines = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//ESV Grizzlys Bergkamen//Young Grizzlys//DE", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    "X-WR-CALNAME:" + esc(name), "X-WR-TIMEZONE:Europe/Berlin",
    "X-WR-CALDESC:" + esc("Spielplan der ESV Grizzlys Bergkamen – aktualisiert sich automatisch"),
    "REFRESH-INTERVAL;VALUE=DURATION:PT4H", "X-PUBLISHED-TTL:PT4H"
  ];
  games.forEach(g => lines.push(...eventLines(g, addr, now)));
  lines.push("END:VCALENDAR");
  return lines.map(fold).join("\r\n") + "\r\n";
}

exports.calendarFeed = onRequest(
  { region: "europe-west1", maxInstances: 2, memory: "256MiB", timeoutSeconds: 60 },
  async (req, res) => {
    if (req.method !== "GET" && req.method !== "HEAD") { res.status(405).send("Nur GET"); return; }
    try {
      const { games, addr } = await loadData();
      const want = String(req.query.t || "").split(",").map(s => s.trim().toUpperCase()).filter(k => TEAMS[k]);
      const teams = want.length ? want : Object.keys(TEAMS);
      const v = String(req.query.v || "");
      const list = games.filter(g => teams.includes(g.team) && (v === "home" ? isHome(g) : v === "away" ? !isHome(g) : true))
        .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
      const name = "Young Grizzlys" + (want.length ? " – " + teams.map(teamLabel).join(" + ") : "") + (v === "home" ? " (Heim)" : v === "away" ? " (Auswärts)" : "");
      res.set("Content-Type", "text/calendar; charset=utf-8");
      res.set("Content-Disposition", 'inline; filename="young-grizzlys.ics"');
      res.set("Cache-Control", "public, max-age=900");
      res.status(200).send(buildIcs(list, addr, name));
    } catch (err) {
      console.error("calendarFeed:", err && err.message);
      res.status(503).set("Retry-After", "600").send("Kalender derzeit nicht verfügbar");
    }
  }
);

exports._test = { buildIcs, berlin, fold };
