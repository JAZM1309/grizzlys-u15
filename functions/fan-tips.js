/**
 * Fan-Tipp (ab 1.28.0)
 *
 * Fans tippen in der App anonym das Ergebnis eines Spiels. Jeder Tipp ist ein Dokument
 *   fanTips/{Spiel-ID}__{Geräte-ID}  { gameId, team, hs, as, g, createdAt }
 * (hs/as = Heim/Gast wie auf der Spielkarte, g = "h" oder "a": auf welcher Seite die Grizzlys stehen).
 *
 * Diese Function zählt nach jedem neuen oder geänderten Tipp alle Tipps des Spiels zusammen und
 * schreibt das Ergebnis nach fanTipStats/{Spiel-ID}. Die App liest nur dieses eine Dokument –
 * so bleiben es wenige Lesezugriffe, egal wie viele Fans tippen.
 *
 *   fanTipStats/{Spiel-ID} { n, w, d, l, scores: { "4:2": 5, … }, updatedAt }
 *   (w/d/l aus Grizzlys-Sicht, scores als Heim:Gast)
 *
 * Einbinden in functions/index.js:
 *   exports.onFanTipWritten = require("./fan-tips").onFanTipWritten;
 * Deploy:
 *   firebase deploy --only functions:onFanTipWritten --project grizzlys-u15
 */
const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

if (!admin.apps.length) admin.initializeApp();

function summarize(docs) {
  const out = { n: 0, w: 0, d: 0, l: 0, scores: {} };
  for (const x of docs) {
    const hs = Number(x.hs), as = Number(x.as);
    if (!Number.isInteger(hs) || !Number.isInteger(as) || hs < 0 || as < 0 || hs > 20 || as > 20) continue;
    const us = x.g === "a" ? as : hs, them = x.g === "a" ? hs : as;
    out.n++;
    out[us > them ? "w" : us < them ? "l" : "d"]++;
    const k = hs + ":" + as;
    out.scores[k] = (out.scores[k] || 0) + 1;
  }
  return out;
}

exports.onFanTipWritten = onDocumentWritten(
  { document: "fanTips/{tipId}", region: "europe-west1" },
  async (event) => {
    const after = event.data && event.data.after && event.data.after.exists ? event.data.after.data() : null;
    const before = event.data && event.data.before && event.data.before.exists ? event.data.before.data() : null;
    const gameId = String((after && after.gameId) || (before && before.gameId) || "");
    if (!/^\d{4}-\d{2}-\d{2}_\d{4}_[AB]$/.test(gameId)) return;
    const db = admin.firestore();
    const snap = await db.collection("fanTips").where("gameId", "==", gameId).get();
    const s = summarize(snap.docs.map((d) => d.data()));
    await db.collection("fanTipStats").doc(gameId).set({ ...s, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    logger.info("Fan-Tipps gezählt", { gameId, n: s.n });
  }
);

exports._test = { summarize };
