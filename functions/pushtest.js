/* Grizzlys U15 – Test-Push an alle Admin-Geräte (aufrufbar nur vom Admin aus dem Admin-Bereich).
   Einbinden in functions/index.js mit:
     exports.adminPushTest = require("./pushtest").adminPushTest;
*/
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
if (!admin.apps.length) admin.initializeApp();

const ADMIN_UID = "q6AID4Wkp2arQlCTROTKqON6ckk2";

exports.adminPushTest = onCall({ region: "europe-west1", timeoutSeconds: 60 }, async request => {
  if (!request.auth || request.auth.uid !== ADMIN_UID) {
    throw new HttpsError("permission-denied", "Nur für den Admin.");
  }
  const deviceToken = String((request.data && request.data.token) || "");

  // Optional verzögert senden (max. 30 s), damit der Admin die App vorher in den Hintergrund legen kann.
  const delay = Math.min(30, Math.max(0, Number(request.data && request.data.delaySeconds) || 0));
  if (delay) await new Promise(resolve => setTimeout(resolve, delay * 1000));

  const snap = await admin.firestore().collection("pushTokens").where("admin", "==", true).get();
  const targets = snap.docs
    .filter(d => d.get("adminUid") === ADMIN_UID)
    .map(d => ({ token: d.id, ref: d.ref, platform: String(d.get("platform") || "") }));

  const time = new Date().toLocaleTimeString("de-DE", { timeZone: "Europe/Berlin", hour: "2-digit", minute: "2-digit" });

  const results = await Promise.all(targets.map(async t => {
    try {
      // Nur "data": so zeigt der Service Worker der App die Meldung selbst an (mit Grizzlys-Symbol).
      await admin.messaging().send({
        token: t.token,
        data: {
          type: "adminTest",
          title: "Test-Push ✓",
          body: "Dieses Gerät ist als Admin für Push angemeldet (" + time + " Uhr)."
        },
        webpush: { headers: { Urgency: "high", TTL: "300" } }
      });
      return { platform: t.platform, thisDevice: t.token === deviceToken, ok: true };
    } catch (err) {
      const code = String((err && err.code) || "");
      // Tote Einträge (Token bei Firebase nicht mehr gültig) gleich aufräumen.
      let removed = false;
      if (code === "messaging/registration-token-not-registered" || code === "messaging/invalid-registration-token") {
        try { await t.ref.delete(); removed = true; } catch (e) { /* ignorieren */ }
      }
      return {
        platform: t.platform,
        thisDevice: t.token === deviceToken,
        ok: false,
        removed,
        error: String(code || (err && err.message) || "unbekannt").replace("messaging/", "")
      };
    }
  }));

  const sent = results.filter(r => r.ok).length;
  return { adminDevices: targets.length, sent, failed: results.length - sent, removed: results.filter(r => r.removed).length, results };
});
