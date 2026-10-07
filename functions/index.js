const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const { BetaAnalyticsDataClient } = require("@google-analytics/data");
const logger = require("firebase-functions/logger");
const { defineString, defineSecret } = require("firebase-functions/params");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

if (!admin.apps.length) admin.initializeApp();

setGlobalOptions({ region: "europe-west1", maxInstances: 2 });

// Nicht geheim: GA4 Property-ID und die UID des einzigen Admins.
// Parameterisierte Konfiguration ist der aktuelle Firebase-Weg für Functions.
const GA4_PROPERTY_ID = defineString("GA4_PROPERTY_ID", {
  default: "556483153",
  description: "GA4 Property-ID für das Grizzlys Statistik-Dashboard"
});
const ADMIN_UID = defineString("ADMIN_UID", {
  default: "q6AID4Wkp2arQlCTROTKqON6ckk2",
  description: "Firebase Auth UID des Grizzlys Admins"
});

function rows(report) {
  return (report?.rows || []).map(r => {
    const obj = {};
    (report.dimensionHeaders || []).forEach((h, i) => obj[h.name] = r.dimensionValues?.[i]?.value || "");
    (report.metricHeaders || []).forEach((h, i) => obj[h.name] = Number(r.metricValues?.[i]?.value || 0));
    return obj;
  });
}

function dateRange(startDate, endDate) {
  return [{ startDate, endDate }];
}

exports.getAnalyticsDashboard = onCall(async (request) => {
  if (!request.auth?.uid) throw new HttpsError("unauthenticated", "Admin-Anmeldung erforderlich.");
  const adminUid = ADMIN_UID.value();
  if (request.auth.uid !== adminUid) throw new HttpsError("permission-denied", "Keine Admin-Berechtigung.");

  const propertyId = GA4_PROPERTY_ID.value();

  const startDate = String(request.data?.startDate || "");
  const endDate = String(request.data?.endDate || "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
    throw new HttpsError("invalid-argument", "Ungültiger Zeitraum.");
  }

  const client = new BetaAnalyticsDataClient();
  const property = "properties/" + propertyId;
  const range = dateRange(startDate, endDate);

  try {
    const [summaryReport] = await client.runReport({
      property,
      dateRanges: range,
      metrics: [
        { name: "activeUsers" },
        { name: "newUsers" },
        { name: "sessions" },
        { name: "eventCount" }
      ]
    });

    const [dailyReport] = await client.runReport({
      property, dateRanges: range,
      dimensions: [{ name: "date" }],
      metrics: [{ name: "activeUsers" }],
      orderBys: [{ dimension: { dimensionName: "date" } }]
    });

    const [eventsReport] = await client.runReport({
      property, dateRanges: range,
      dimensions: [{ name: "eventName" }],
      metrics: [{ name: "eventCount" }],
      orderBys: [{ metric: { metricName: "eventCount", desc: true } }],
      limit: 12
    });

    const [devicesReport] = await client.runReport({
      property, dateRanges: range,
      dimensions: [{ name: "deviceCategory" }],
      metrics: [{ name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "activeUsers", desc: true } }]
    });

    const [osReport] = await client.runReport({
      property, dateRanges: range,
      dimensions: [{ name: "operatingSystem" }],
      metrics: [{ name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "activeUsers", desc: true } }],
      limit: 10
    });

    const [pagesReport] = await client.runReport({
      property, dateRanges: range,
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }],
      orderBys: [{ metric: { metricName: "screenPageViews", desc: true } }],
      limit: 10
    });

    const [citiesReport] = await client.runReport({
      property, dateRanges: range,
      dimensions: [{ name: "city" }],
      metrics: [{ name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "activeUsers", desc: true } }],
      limit: 10
    });

    const summary = rows(summaryReport)[0] || {};
    return {
      startDate, endDate,
      summary: {
        activeUsers: summary.activeUsers || 0,
        newUsers: summary.newUsers || 0,
        sessions: summary.sessions || 0,
        eventCount: summary.eventCount || 0
      },
      daily: rows(dailyReport).map(x => ({ date: x.date, activeUsers: x.activeUsers })),
      events: rows(eventsReport).map(x => ({ name: x.eventName || "(not set)", count: x.eventCount })),
      devices: rows(devicesReport).map(x => ({ name: x.deviceCategory || "(not set)", activeUsers: x.activeUsers })),
      os: rows(osReport).map(x => ({ name: x.operatingSystem || "(not set)", activeUsers: x.activeUsers })),
      pages: rows(pagesReport).map(x => ({ name: x.pagePath || "(not set)", views: x.screenPageViews })),
      cities: rows(citiesReport).map(x => ({ name: x.city || "(not set)", activeUsers: x.activeUsers }))
    };
  } catch (err) {
    logger.error("GA4 Data API failed", err);
    throw new HttpsError("internal", "Google Analytics konnte nicht abgefragt werden.");
  }
});


// ---------------------------------------------------------------------------
// Sofort-Benachrichtigung bei neuen Rückmeldungen (Fehler / Wunsch / Lob)
// Sendet Push (an das zuletzt aktive Admin-Gerät) und E-Mail, sobald ein neues
// Dokument in "bugReports" angelegt wird. Der GitHub-Workflow
// "bug-report-notify" bleibt als Sicherheitsnetz bestehen und versendet nur,
// was hier nicht erfolgreich war (pushSentAt / emailSentAt).
// Der Ergebnis- und Erinnerungs-Push (main.yml) ist davon nicht betroffen.
// ---------------------------------------------------------------------------
const SMTP_USER = defineSecret("SMTP_USER");
const SMTP_PASSWORD = defineSecret("SMTP_PASSWORD");
const BUG_REPORT_EMAIL = defineSecret("BUG_REPORT_EMAIL");
const SMTP_HOST = defineString("SMTP_HOST", { default: "mail.gmx.net" });
const SMTP_PORT = defineString("SMTP_PORT", { default: "587" });

const ICON_BASE_URL = "https://jazm1309.github.io/grizzlys-u15/";
const BUG_BADGE_URL = ICON_BASE_URL + "badge-96.png";
const TYPE_INFO = {
  "Fehler": {
    file: "grizzlys-bug-icon.png",
    mailLabel: "Fehlermeldung",
    heading: "Neue Fehlermeldung in der Grizzlys-U15-App",
    descLabel: "Fehlerbeschreibung",
    pushTitle: "🏒 Neue Grizzlys-Fehlermeldung",
    alt: "Grizzlys Fehler"
  },
  "Wunsch / Anregung": {
    file: "grizzlys-wunsch-icon.png",
    mailLabel: "Wunsch / Anregung",
    heading: "Neuer Wunsch / neue Anregung zur Grizzlys-U15-App",
    descLabel: "Wunsch / Anregung",
    pushTitle: "💡 Neuer Grizzlys-Wunsch / Neue Anregung",
    alt: "Grizzlys Wunsch und Anregungen"
  },
  "Lob": {
    file: "grizzlys-lob-icon.png",
    mailLabel: "Lob",
    heading: "Neues Lob für die Grizzlys-U15-App",
    descLabel: "Lob",
    pushTitle: "👍 Neues Lob für die Grizzlys-App",
    alt: "Grizzlys Lob"
  }
};

function typeInfo(report) {
  return TYPE_INFO[report.type] || TYPE_INFO["Fehler"];
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function sendBugEmail(report) {
  const info = typeInfo(report);
  const area = report.area || "Sonstiges";
  const text = [
    info.heading, "",
    `Name: ${report.name || "Nicht angegeben"}`,
    `Art: ${report.type || "Fehler"}`,
    `Bereich: ${area}`,
    `Version: ${report.appVersion || "?"}`,
    `Plattform: ${report.platform || "?"}`,
    `Push beim Nutzer: ${report.pushRegistered ? "aktiv" : "nicht registriert"}`, "",
    `${info.descLabel}:`, report.description || "", "",
    report.contact ? `Rückfrage-Kontakt: ${report.contact}` : "Kein Rückfrage-Kontakt angegeben."
  ].join("\n");

  const safeDescription = escapeHtml(report.description).replace(/\n/g, "<br>");
  const transport = nodemailer.createTransport({
    host: SMTP_HOST.value(),
    port: Number(SMTP_PORT.value()),
    secure: false,
    auth: { user: SMTP_USER.value(), pass: SMTP_PASSWORD.value() }
  });

  await transport.sendMail({
    from: SMTP_USER.value(),
    to: BUG_REPORT_EMAIL.value(),
    subject: `🏒 Grizzlys U15 – ${info.mailLabel} (${area})`,
    text,
    attachments: [{
      filename: info.file,
      path: ICON_BASE_URL + info.file,
      cid: "grizzlys-feedback-icon@grizzlys-u15",
      contentType: "image/png",
      contentDisposition: "inline"
    }],
    html: `<div style="font-family:Arial,sans-serif;color:#111;max-width:700px">
      <img src="cid:grizzlys-feedback-icon@grizzlys-u15" alt="${escapeHtml(info.alt)}" width="160" height="160" style="display:block;margin:0 0 18px">
      <h2>${escapeHtml(info.heading)}</h2>
      <p><b>Name:</b> ${escapeHtml(report.name || "Nicht angegeben")}<br><b>Art:</b> ${escapeHtml(report.type || "Fehler")}<br><b>Bereich:</b> ${escapeHtml(area)}<br><b>Version:</b> ${escapeHtml(report.appVersion || "?")}<br><b>Plattform:</b> ${escapeHtml(report.platform || "?")}<br><b>Push beim Nutzer:</b> ${report.pushRegistered ? "aktiv" : "nicht registriert"}</p>
      <p><b>${escapeHtml(info.descLabel)}:</b></p><p>${safeDescription}</p>
      ${report.contact ? `<p><b>Rückfrage-Kontakt:</b> ${escapeHtml(report.contact)}</p>` : "<p>Kein Rückfrage-Kontakt angegeben.</p>"}
    </div>`
  });
}

async function sendBugPush(report) {
  const db = admin.firestore();
  const snap = await db.collection("pushTokens").where("admin", "==", true).get();
  const byInstallation = new Map();

  for (const doc of snap.docs) {
    const d = doc.data() || {};
    if (!d.token) continue;
    const key = d.installationId || doc.id;
    const previous = byInstallation.get(key);
    const currentMs = d.updatedAt?.toMillis ? d.updatedAt.toMillis() : 0;
    const previousMs = previous?.updatedAt?.toMillis ? previous.updatedAt.toMillis() : 0;
    if (!previous || currentMs >= previousMs) byInstallation.set(key, d);
  }

  const candidates = [...byInstallation.values()].sort((a, b) => {
    const am = a.updatedAt?.toMillis ? a.updatedAt.toMillis() : 0;
    const bm = b.updatedAt?.toMillis ? b.updatedAt.toMillis() : 0;
    return bm - am;
  });

  logger.info("Bug-Push: Admin-Geräte gefunden", { count: candidates.length });
  if (!candidates.length) return false;

  const info = typeInfo(report);
  const title = info.pushTitle;
  const body = `${report.area || "Sonstiges"}: ${(report.description || "").slice(0, 100)}`;

  // Gleicher FCM/WebPush-Aufbau wie im bisherigen Notifier.
  const response = await admin.messaging().sendEachForMulticast({
    tokens: [...new Set(candidates.map(c => c.token))],
    notification: { title, body },
    webpush: {
      notification: {
        icon: ICON_BASE_URL + info.file,
        badge: BUG_BADGE_URL
      },
      data: { type: "bugReport", title, body },
      fcmOptions: { link: ICON_BASE_URL }
    }
  });

  logger.info("Bug-Push Ergebnis", { successCount: response.successCount, failureCount: response.failureCount });
  return response.successCount > 0;
}

exports.onBugReportCreated = onDocumentCreated(
  {
    document: "bugReports/{reportId}",
    secrets: [SMTP_USER, SMTP_PASSWORD, BUG_REPORT_EMAIL]
  },
  async (event) => {
    const snap = event.data;
    if (!snap) return;
    const report = snap.data() || {};
    const update = {};

    if (!report.pushSentAt) {
      try {
        if (await sendBugPush(report)) update.pushSentAt = admin.firestore.FieldValue.serverTimestamp();
      } catch (err) {
        logger.error("Bug-Push fehlgeschlagen", err);
      }
    }

    if (!report.emailSentAt) {
      try {
        await sendBugEmail(report);
        update.emailSentAt = admin.firestore.FieldValue.serverTimestamp();
      } catch (err) {
        logger.error("Bug-E-Mail fehlgeschlagen", err);
      }
    }

    if (Object.keys(update).length) await snap.ref.update(update);
  }
);

// Ergebnis-Push und 24h-Erinnerung (ersetzt den GitHub-Workflow)
const push = require("./push");
exports.onResultWritten = push.onResultWritten;
exports.sendGameReminders = push.sendGameReminders;

// EHV-Daten: Tabellenstand, automatische Ergebnisse, Spielplan-Abgleich
exports.standings = require("./standings").standings;
exports.autoResults = require("./ehv-sync").autoResults;
exports.scheduleCheck = require("./ehv-sync").scheduleCheck;
exports.scheduleWatch = require("./ehv-sync").scheduleWatch;
