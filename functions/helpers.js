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
