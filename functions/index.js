const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const { BetaAnalyticsDataClient } = require("@google-analytics/data");
const logger = require("firebase-functions/logger");

setGlobalOptions({ region: "europe-west1", maxInstances: 2 });

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
  const adminUid = process.env.ADMIN_UID;
  if (adminUid && request.auth.uid !== adminUid) throw new HttpsError("permission-denied", "Keine Admin-Berechtigung.");

  const propertyId = process.env.GA4_PROPERTY_ID;
  if (!propertyId) throw new HttpsError("failed-precondition", "GA4_PROPERTY_ID ist in der Function nicht gesetzt.");

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
