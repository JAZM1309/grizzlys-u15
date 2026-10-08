// News-Hinweise aus dem Adminbereich: optionaler Push an alle angemeldeten Geräte.
// Wird ausgelöst, sobald im Adminbereich ein Hinweis mit Haken "Zusätzlich als Push senden" veröffentlicht wird.
// Ohne Haken passiert hier nichts – der Hinweis steht dann nur in der App.
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

if (!admin.apps.length) admin.initializeApp();

const REGION = "europe-west1";
const SITE = "https://jazm1309.github.io/grizzlys-u15/";
const ICON = SITE + "icon-192.png";
const BADGE = SITE + "badge-96.png";

// Geräte ohne gespeicherte Auswahl bekommen alles; bei einem Hinweis für nur eine Mannschaft
// gilt die Mannschaftsauswahl des Geräts.
function wantsNews(prefs, team) {
  const p = prefs || {};
  if (team === "A") return p.teamA !== false;
  if (team === "B") return p.teamB !== false;
  return true;
}

function pushText(n) {
  const team = String(n.team || "").toUpperCase();
  const title = "📰 ESV Grizzlys U15" + (team === "A" || team === "B" ? " · U15 " + team : "");
  const raw = String(n.title || "") + (n.text ? " – " + String(n.text).replace(/\s+/g, " ") : "");
  const body = raw.length > 180 ? raw.slice(0, 177).trimEnd() + "…" : raw;
  return { title, body, team };
}

exports.onNewsCreated = onDocumentCreated(
  { document: "news/{newsId}", region: REGION, maxInstances: 2 },
  async (event) => {
    const snap = event.data;
    if (!snap) return;
    const n = snap.data() || {};
    if (n.push !== true || n.pushSentAt) return;
    const db = admin.firestore();

    // Doppelte Auslösung abfangen
    const claimed = await db.runTransaction(async (tx) => {
      const cur = (await tx.get(snap.ref)).data() || {};
      if (cur.pushSentAt || cur.pushClaimedAt) return false;
      tx.update(snap.ref, { pushClaimedAt: admin.firestore.FieldValue.serverTimestamp() });
      return true;
    });
    if (!claimed) return;

    const { title, body, team } = pushText(n);
    const tokSnap = await db.collection("pushTokens").get();
    const seen = new Set();
    const targets = [];
    tokSnap.docs.forEach(d => {
      const x = d.data() || {};
      if (!x.token || seen.has(x.token) || !wantsNews(x.prefs, team)) return;
      seen.add(x.token);
      targets.push({ token: x.token, ref: d.ref });
    });

    let success = 0, failed = 0;
    for (let i = 0; i < targets.length; i += 500) {
      const batch = targets.slice(i, i + 500);
      const res = await admin.messaging().sendEachForMulticast({
        tokens: batch.map(x => x.token),
        notification: { title, body },
        webpush: {
          notification: { icon: ICON, badge: BADGE },
          data: { type: "news", title, body },
          fcmOptions: { link: SITE }
        }
      });
      success += res.successCount;
      res.responses?.forEach((r, idx) => {
        if (r.success) return;
        failed += 1;
        const code = r.error?.code;
        if (code === "messaging/registration-token-not-registered" || code === "messaging/invalid-registration-token") {
          batch[idx].ref?.delete?.().catch(() => {});
        }
      });
    }
    logger.info("News-Push", { id: event.params?.newsId, team, total: targets.length, success, failed });
    await snap.ref.update({
      pushSentAt: admin.firestore.FieldValue.serverTimestamp(),
      pushSentCount: success, pushFailedCount: failed, pushTargetCount: targets.length
    });
  }
);

exports._test = { wantsNews, pushText };
