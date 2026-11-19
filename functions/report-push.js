/**
 * 1.43.0: Push „Spielbericht ist online“
 *
 *  - onReportPublished: läuft bei jeder Änderung in reports/{Spiel-ID}. Wird ein Bericht veröffentlicht
 *    (published wechselt auf true – im Admin-Bereich oder automatisch nach der Frist durch autoResults),
 *    bekommen alle Geräte mit prefs.reports === true (Schalter „Spielbericht ist online“) und passender
 *    Mannschaft eine Meldung. Ein Tipp darauf öffnet den Bericht in der App (./?go=report-<Spiel-ID>).
 *  - Jeder Bericht wird höchstens einmal gemeldet (Sperre reportPushes/{Spiel-ID}), auch wenn er später
 *    zurückgezogen und erneut veröffentlicht wird. Berichte zu Spielen, die älter als 7 Tage sind, werden nicht gemeldet.
 *
 * Einbinden in functions/index.js:  exports.onReportPublished = require("./report-push").onReportPublished;
 */
const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const { teamKey, teamLabel } = require("./teams");
const { _send } = require("./push");

if (!admin.apps.length) admin.initializeApp();

const REGION = "europe-west1";
const SITE = "https://jazm1309.github.io/grizzlys-u15/";
const MAX_AGE_DAYS = 7;

exports.onReportPublished = onDocumentWritten({ document: "reports/{reportId}", region: REGION }, async (event) => {
  const before = event.data && event.data.before && event.data.before.exists ? event.data.before.data() : null;
  const after = event.data && event.data.after && event.data.after.exists ? event.data.after.data() : null;
  if (!after || after.published !== true || (before && before.published === true)) return;

  const id = event.params.reportId;
  const date = String(after.date || id.slice(0, 10));
  const ageDays = (Date.now() - new Date(date + "T12:00:00Z").getTime()) / 86400000;
  if (!(ageDays <= MAX_AGE_DAYS)) { logger.info("Bericht-Push übersprungen: Spiel zu alt", { id, date }); return; }

  const db = admin.firestore();
  const lock = db.collection("reportPushes").doc(id);
  try { await lock.create({ createdAt: admin.firestore.FieldValue.serverTimestamp() }); }
  catch (err) { logger.info("Bericht-Push schon verschickt", { id }); return; }

  const team = teamKey(after.team || id.split("_").pop());
  const tokens = (await _send.loadTokens()).filter((x) => x.prefs.reports === true && _send.wantsTeam(x, team));
  if (!tokens.length) { await lock.update({ targetCount: 0 }); logger.info("Bericht-Push: niemand angemeldet", { id }); return; }

  const title = "📝 Spielbericht · " + teamLabel(team);
  const body = String(after.title || "Der Bericht zum letzten Spiel ist online.").slice(0, 120);
  const st = await _send.sendPush(tokens, { title, body }, {
    data: { type: "report", title, body, go: "report-" + id, tag: "report-" + id },
    fcmOptions: { link: SITE }
  });
  await lock.update({ sentCount: st.success || 0, failedCount: st.failed || 0, targetCount: st.total || tokens.length });
  logger.info("Bericht-Push", { id, team, ...st });
});
