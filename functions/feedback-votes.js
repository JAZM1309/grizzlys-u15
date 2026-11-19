/**
 * 1.44.0: Ein-Tipp-Feedback und Wunschliste – zählt anonyme Stimmen zusammen.
 *
 *  - onReactionWritten: reactions/{Ziel}__{Geräte-ID} { target, v: 1 | -1, createdAt }
 *      Ziel = "rep_<Spiel-ID>" (Spielbericht) oder "neu_<Version>" (Eintrag in „Neu in der App“).
 *      Ergebnis: reactionStats/{Ziel} { up, down, updatedAt } – lesen alle, schreibt nur diese Function.
 *  - onWishVoteWritten: wishVotes/{Geräte-ID} { v: [Wunsch-IDs, höchstens 3], updatedAt }
 *      Ergebnis: wishStats/all { counts: { <Wunsch-ID>: n }, voters, updatedAt }.
 *  Keine Namen, keine Texte – nur Zähler. Einzelne Stimmen liest nur der Admin.
 *
 * Einbinden in functions/index.js:
 *   const fv = require("./feedback-votes"); exports.onReactionWritten = fv.onReactionWritten; exports.onWishVoteWritten = fv.onWishVoteWritten;
 */
const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

if (!admin.apps.length) admin.initializeApp();
const REGION = "europe-west1";
const ts = () => admin.firestore.FieldValue.serverTimestamp();

exports.onReactionWritten = onDocumentWritten({ document: "reactions/{id}", region: REGION }, async (event) => {
  const a = event.data && event.data.after && event.data.after.exists ? event.data.after.data() : null;
  const b = event.data && event.data.before && event.data.before.exists ? event.data.before.data() : null;
  const target = String((a && a.target) || (b && b.target) || "");
  if (!/^(rep|neu)_[A-Za-z0-9._-]{3,60}$/.test(target)) return;
  const db = admin.firestore();
  const snap = await db.collection("reactions").where("target", "==", target).get();
  let up = 0, down = 0;
  snap.forEach((d) => { const v = d.data().v; if (v === 1) up++; else if (v === -1) down++; });
  await db.collection("reactionStats").doc(target).set({ up, down, updatedAt: ts() });
  logger.info("Reaktionen gezählt", { target, up, down });
});

exports.onWishVoteWritten = onDocumentWritten({ document: "wishVotes/{id}", region: REGION }, async () => {
  const db = admin.firestore();
  const snap = await db.collection("wishVotes").get();
  const counts = {}; let voters = 0;
  snap.forEach((d) => {
    const v = Array.isArray(d.data().v) ? d.data().v.filter((x) => typeof x === "string" && /^[a-z0-9-]{2,40}$/.test(x)).slice(0, 3) : [];
    if (v.length) voters++;
    [...new Set(v)].forEach((id) => { counts[id] = (counts[id] || 0) + 1; });
  });
  await db.collection("wishStats").doc("all").set({ counts, voters, updatedAt: ts() });
  logger.info("Wunschliste gezählt", { voters });
});
