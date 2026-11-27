/* 1.70.0: Helferdienste – Namen werden 3 Tage nach dem Spiel automatisch gelöscht (täglich 4:15 Uhr) */
const { onSchedule } = require("firebase-functions/v2/scheduler");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
if (!admin.apps.length) admin.initializeApp();

function isoDaysAgo(n) {
  const d = new Date(Date.now() - n * 86400000);
  const p = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Berlin", year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
  return p; // JJJJ-MM-TT
}

exports.helperCleanup = onSchedule(
  { schedule: "15 4 * * *", timeZone: "Europe/Berlin", region: "europe-west1", maxInstances: 1, timeoutSeconds: 120 },
  async () => {
    const db = admin.firestore();
    const limitDay = isoDaysAgo(3);
    let total = 0;
    for (const col of ["helpers", "helpersTest"]) {
      const snap = await db.collection(col).where("gd", "<", limitDay).limit(450).get();
      if (snap.empty) continue;
      const batch = db.batch();
      snap.forEach(d => batch.delete(d.ref));
      await batch.commit();
      total += snap.size;
    }
    logger.info("Helferdienste aufgeräumt", { deleted: total, before: limitDay });
  }
);

/* 1.71.0: Erinnerung am Vortag um 18 Uhr an alle, die sich eingetragen haben und Push nutzen.
   Zuordnung über die Geräte-Kennung (iid) des Eintrags = installationId in pushTokens. Je Gerät eine Meldung
   mit allen seinen Diensten; Tippen öffnet die Helferliste (go=helfer-<Spiel-ID>). */
exports.helperReminder = onSchedule(
  { schedule: "0 18 * * *", timeZone: "Europe/Berlin", region: "europe-west1", maxInstances: 1, timeoutSeconds: 120 },
  async () => {
    const db = admin.firestore();
    const tomorrow = isoDaysAgo(-1);
    const byDevice = new Map();
    for (const col of ["helpers", "helpersTest"]) {
      const snap = await db.collection(col).where("gd", "==", tomorrow).get();
      snap.forEach(doc => {
        const e = doc.data();
        if (!e.iid) return;
        const k = e.iid + "|" + e.gid;
        if (!byDevice.has(k)) byDevice.set(k, { iid: e.iid, gid: e.gid, team: e.team, test: col === "helpersTest", items: [] });
        byDevice.get(k).items.push(e.label || e.item);
      });
    }
    if (!byDevice.size) { logger.info("Helfer-Erinnerung: niemand eingetragen", { tomorrow }); return; }
    let sent = 0, missing = 0;
    for (const x of byDevice.values()) {
      const toks = await db.collection("pushTokens").where("installationId", "==", x.iid).get();
      const tokens = toks.docs.map(d => d.data().token).filter(Boolean);
      if (!tokens.length) { missing += 1; continue; }
      const team = x.team === "U13" ? "U13" : x.team === "U17" ? "U17" : "U15 " + x.team;
      const data = {
        title: (x.test ? "[Test] " : "") + "Morgen Heimspiel " + team + " – danke fürs Helfen!",
        body: "Du hast dich eingetragen für: " + [...new Set(x.items)].join(", "),
        type: "gameReminder", tag: "helfer-" + x.gid, go: "helfer-" + x.gid
      };
      const res = await admin.messaging().sendEachForMulticast({ tokens, data, webpush: { headers: { Urgency: "high", TTL: String(6 * 3600) } } });
      sent += res.successCount;
    }
    logger.info("Helfer-Erinnerung verschickt", { tomorrow, geraete: byDevice.size, sent, ohnePush: missing });
  }
);
