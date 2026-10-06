// Ergebnis-Push und 24-Stunden-Erinnerung als Cloud Functions.
// Ersetzt den GitHub-Workflow "Grizzlys Ergebnisdienst" (main.yml):
//  - onResultWritten: sendet den Ergebnis-Push sofort, wenn im Admin-Bereich ein Ergebnis gespeichert wird.
//  - sendGameReminders: läuft alle 10 Minuten (Google Cloud Scheduler) und verschickt die 24h-Erinnerungen.
// Die Duplikatsperren sind dieselben wie im Workflow (results.pushSentAt, gameReminders/{id}),
// beide Varianten können deshalb kurzzeitig parallel laufen, ohne doppelt zu senden.
const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

if (!admin.apps.length) admin.initializeApp();

const REGION = "europe-west1";
const SITE = "https://jazm1309.github.io/grizzlys-u15/";
const RESULT_ICON = SITE + "grizzlys-result-icon.png";
const REMINDER_ICON = SITE + "grizzlys-24h-icon-192.png";
const BADGE = SITE + "badge-96.png";

// ---------- Hilfsfunktionen ----------
function prefsOf(data) { return (data && data.prefs) || {}; }
// Geräte ohne gespeicherte Auswahl bekommen weiterhin alles.
function wantsTeam(tokenDoc, team) {
  const p = tokenDoc.prefs;
  return String(team).toUpperCase() === "B" ? p.teamB !== false : p.teamA !== false;
}

async function loadTokens() {
  const snap = await admin.firestore().collection("pushTokens").get();
  return snap.docs
    .map(d => ({ token: d.data().token, ref: d.ref, prefs: prefsOf(d.data()) }))
    .filter(x => Boolean(x.token));
}

async function sendPush(tokens, notification, webpush) {
  let success = 0, failed = 0;
  const invalid = [];
  for (let i = 0; i < tokens.length; i += 500) {
    const batch = tokens.slice(i, i + 500);
    const response = await admin.messaging().sendEachForMulticast({
      tokens: batch.map(x => x.token),
      notification,
      ...(webpush ? { webpush } : {})
    });
    success += response.successCount;
    response.responses.forEach((r, idx) => {
      if (r.success) return;
      failed += 1;
      const code = r.error?.code;
      logger.warn("FCM Fehler", { code, message: r.error?.message });
      if (code === "messaging/registration-token-not-registered" || code === "messaging/invalid-registration-token") {
        invalid.push(batch[idx].ref);
      }
    });
  }
  for (const ref of invalid) { try { await ref.delete(); } catch (e) { /* ignorieren */ } }
  return { total: tokens.length, success, failed };
}

function teamOfResult(r, id) {
  return String(r.team || String(r.gameId || id || "").split("_").pop() || "A").toUpperCase();
}

function applyScheduleOverrides(games, overrides) {
  for (const game of games) {
    const baseId = game.date + "_" + game.time.replace(/:/g, "") + "_" + game.team;
    game._baseId = baseId;
    const o = overrides[baseId];
    if (!o) continue;
    Object.assign(game, {
      day: o.day || game.day, date: o.date || game.date, time: o.time || game.time,
      home: o.home || game.home, away: o.away || game.away, stadium: o.stadium || game.stadium
    });
  }
}

function berlinDate(date, time) {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const localAsUtc = Date.UTC(y, m - 1, d, hh, mm);
  let guess = localAsUtc;
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Berlin", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23"
  });
  for (let i = 0; i < 3; i++) {
    const p = Object.fromEntries(fmt.formatToParts(new Date(guess)).filter(x => x.type !== "literal").map(x => [x.type, x.value]));
    const displayedAsUtc = Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day), Number(p.hour), Number(p.minute), Number(p.second));
    guess += localAsUtc - displayedAsUtc;
  }
  return new Date(guess);
}

function isReminderTime(game, now = Date.now()) {
  const diff = berlinDate(game.date, game.time).getTime() - now;
  return diff >= 23 * 3600 * 1000 && diff <= 25 * 3600 * 1000;
}

function normalizeGamePart(v) {
  return String(v || "").toLowerCase().trim().replace(/[^a-z0-9äöüß]+/gi, "-").replace(/^-+|-+$/g, "");
}
function gameIdentity(game, occurrence) {
  return [normalizeGamePart(game._baseId || ""), normalizeGamePart(game.team), occurrence].join("_");
}

async function loadGames() {
  const res = await fetch(SITE + "index.html?t=" + Date.now(), { headers: { "cache-control": "no-cache" } });
  if (!res.ok) throw new Error("index.html nicht ladbar: HTTP " + res.status);
  const html = await res.text();
  const m = html.match(/const games=(\[[\s\S]*?\]);/);
  if (!m) throw new Error("Spielplan in index.html nicht gefunden");
  return JSON.parse(m[1]);
}

// ---------- Ergebnis-Push (sofort) ----------
exports.onResultWritten = onDocumentWritten(
  { document: "results/{resultId}", region: REGION, maxInstances: 2 },
  async (event) => {
    const after = event.data && event.data.after;
    if (!after || !after.exists) return;           // gelöscht
    const r = after.data() || {};
    if (!r.updatedAt || r.pushSentAt) return;       // unfertig oder schon gesendet
    const db = admin.firestore();

    // Doppelte Auslösung abfangen (Claim in Transaktion).
    const claimed = await db.runTransaction(async (tx) => {
      const cur = (await tx.get(after.ref)).data() || {};
      if (cur.pushSentAt) return false;
      const claimMs = cur.pushClaimedAt?.toMillis ? cur.pushClaimedAt.toMillis() : 0;
      if (claimMs && Date.now() - claimMs < 2 * 60 * 1000) return false;
      tx.update(after.ref, { pushClaimedAt: admin.firestore.FieldValue.serverTimestamp() });
      return true;
    });
    if (!claimed) return;

    const team = teamOfResult(r, event.params.resultId);
    const all = await loadTokens();
    const tokens = all.filter(x => x.prefs.results !== false && wantsTeam(x, team));
    const title = "🏒 ESV Grizzlys U15";
    const body = `Ergebnis: ${r.home} ${r.homeScore}:${r.awayScore} ${r.away}`;

    let stats = { total: 0, success: 0, failed: 0 };
    if (tokens.length) {
      stats = await sendPush(tokens, { title, body }, {
        notification: { icon: RESULT_ICON, badge: BADGE },
        data: { type: "result", title, body },
        fcmOptions: { link: SITE }
      });
    }
    logger.info("Ergebnis-Push", { id: event.params.resultId, team, ...stats });

    // Erledigt, sobald es mindestens einen Empfänger gab – oder niemand Push für diese Mannschaft will
    // (dann dürfen später aktivierende Geräte keine alten Ergebnisse bekommen).
    if (stats.success > 0 || tokens.length === 0) {
      await after.ref.update({
        pushSentAt: admin.firestore.FieldValue.serverTimestamp(),
        pushSentCount: stats.success, pushFailedCount: stats.failed, pushTargetCount: stats.total
      });
    }
  }
);

// ---------- 24h-Erinnerung (alle 10 Minuten) ----------
exports.sendGameReminders = onSchedule(
  { schedule: "every 10 minutes", timeZone: "Europe/Berlin", region: REGION, maxInstances: 1, timeoutSeconds: 120 },
  async () => {
    const db = admin.firestore();
    const games = await loadGames();
    const overridesSnap = await db.collection("scheduleOverrides").get();
    const overrides = {};
    overridesSnap.forEach(d => { overrides[d.id] = d.data(); });
    applyScheduleOverrides(games, overrides);

    const tokens = await loadTokens();
    const occurrences = new Map();
    for (const game of games) {
      const baseKey = [game.team, game.home, game.away, game.stadium].map(normalizeGamePart).join("|");
      const occurrence = (occurrences.get(baseKey) || 0) + 1;
      occurrences.set(baseKey, occurrence);
      if (!isReminderTime(game)) continue;

      const reminderId = gameIdentity(game, occurrence);
      const scheduleKey = game.date + "_" + game.time;
      try {
        const ref = db.collection("gameReminders").doc(reminderId);
        const prev = await ref.get();
        // Pro Termin nur einmal; bei Verschiebung ist scheduleKey neu.
        if (prev.exists && prev.data().sentScheduleKey === scheduleKey) continue;

        const targets = tokens.filter(x => x.prefs.reminders !== false && wantsTeam(x, game.team));
        if (!targets.length) { logger.info("Erinnerung: niemand angemeldet", { reminderId }); continue; }

        const title = "🏒 ESV Grizzlys U15";
        const body = `Morgen: U15 ${game.team} – ${game.home} gegen ${game.away} um ${game.time} Uhr in ${game.stadium}.`;
        const stats = await sendPush(targets, { title, body }, {
          notification: { icon: REMINDER_ICON, badge: BADGE },
          data: { type: "gameReminder", title, body },
          fcmOptions: { link: SITE }
        });
        if (stats.success > 0) {
          await ref.set({ sentAt: admin.firestore.FieldValue.serverTimestamp(), sentScheduleKey: scheduleKey, game });
          logger.info("24h-Erinnerung gesendet", { reminderId, ...stats });
        } else {
          logger.warn("24h-Erinnerung nicht zugestellt", { reminderId, ...stats });
        }
      } catch (err) {
        logger.error("Fehler bei 24h-Erinnerung", { reminderId, err: String(err) });
      }
    }
  }
);

exports._test = { isReminderTime, berlinDate, gameIdentity, applyScheduleOverrides, wantsTeam, teamOfResult };
