/* Grizzlys U15 – Veröffentlichen aus dem Admin-Bereich (Knöpfe „Test-Paket hochladen“, „Live gehen“,
   „Live zurücksetzen“). Nur für den Admin. Die eigentliche Arbeit machen die GitHub-Abläufe
   (.github/workflows/test-hochladen.yml im Test-Repo, live-gehen.yml im Live-Repo); diese Function
   nimmt nur den Auftrag an und reicht ihn mit dem geschützten GitHub-Schlüssel weiter.
   Einbinden in functions/index.js mit:
     exports.deployControl = require("./deploy").deployControl;
   Schlüssel (Secret) setzt ./knoepfe-einrichten.sh im Grizzlys-Werkzeug.
*/
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const logger = require("firebase-functions/logger");

const GH_SCHLUESSEL = defineSecret("GRIZZLYS_GITHUB_TOKEN");
const ADMIN_UID = "q6AID4Wkp2arQlCTROTKqON6ckk2";
const OWNER = "jazm1309";
const REPO = { live: "grizzlys-u15", test: "grizzlys-u15-test" };
const ABLAUF = { live: "live-gehen.yml", test: "test-hochladen.yml" };
const MAX_ZIP = 7 * 1024 * 1024;   // 7 MB (Aufrufe sind auf 10 MB begrenzt, Base64 macht ein Drittel mehr)

async function gh(pfad, { method = "GET", body, raw = false } = {}) {
  const r = await fetch("https://api.github.com" + pfad, {
    method,
    headers: {
      Authorization: "Bearer " + GH_SCHLUESSEL.value(),
      Accept: raw ? "application/vnd.github.raw" : "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "grizzlys-u15-admin",
      ...(body ? { "Content-Type": "application/json" } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (r.status === 204) return null;
  const text = await r.text();
  if (!r.ok) {
    const err = new Error(pfad + " → " + r.status + " " + text.slice(0, 200));
    err.status = r.status;
    throw err;
  }
  return raw ? text : (text ? JSON.parse(text) : null);
}

function verstaendlich(e) {
  const s = e && e.status;
  if (s === 401) return "Der GitHub-Schlüssel ist abgelaufen oder ungültig. In der Cloud Shell: ./einrichten.sh --neuer-schluessel und danach ./knoepfe-einrichten.sh";
  if (s === 403) return "Der GitHub-Schlüssel hat nicht genug Rechte (nötig: Contents, Actions und Workflows – jeweils Read and write).";
  if (s === 404) return "Bei GitHub nicht gefunden – sind die Abläufe eingerichtet? (./knoepfe-einrichten.sh)";
  if (s === 422) return "GitHub hat den Auftrag abgelehnt (" + String(e.message || "").slice(-120) + ")";
  return "GitHub nicht erreichbar: " + String((e && e.message) || e).slice(0, 160);
}

async function version(welche) {
  try {
    const html = await gh(`/repos/${OWNER}/${REPO[welche]}/contents/index.html?ref=main`, { raw: true });
    const m = /inVer">([0-9.]+)/.exec(html);
    return m ? m[1] : "";
  } catch (e) { return ""; }
}

async function letzterLauf(welche) {
  const d = await gh(`/repos/${OWNER}/${REPO[welche]}/actions/workflows/${ABLAUF[welche]}/runs?per_page=1`);
  const run = d && d.workflow_runs && d.workflow_runs[0];
  if (!run) return null;
  const out = {
    titel: run.display_title || run.name, status: run.status, ergebnis: run.conclusion,
    zeit: run.run_started_at || run.created_at, url: run.html_url, meldungen: []
  };
  if (run.status === "completed") {
    try {
      const jobs = await gh(`/repos/${OWNER}/${REPO[welche]}/actions/runs/${run.id}/jobs`);
      for (const job of (jobs && jobs.jobs) || []) {
        const ann = await gh(`/repos/${OWNER}/${REPO[welche]}/check-runs/${job.id}/annotations`);
        for (const a of ann || []) {
          if (a.title === "Grizzlys") out.meldungen.push({ stufe: a.annotation_level, text: a.message });
        }
      }
    } catch (e) { logger.warn("Meldungen nicht lesbar", e.message); }
  }
  return out;
}

async function pagesLauf(welche) {
  try {
    const d = await gh(`/repos/${OWNER}/${REPO[welche]}/actions/runs?event=dynamic&per_page=5`);
    const run = ((d && d.workflow_runs) || []).find(r => /pages/i.test(r.name || ""));
    if (!run) return null;
    return { status: run.status, ergebnis: run.conclusion, zeit: run.created_at, url: run.html_url };
  } catch (e) { return null; }
}

async function staende() {
  const tags = await gh(`/repos/${OWNER}/${REPO.live}/git/matching-refs/tags/live-`);
  const liste = (tags || []).map(t => t.ref.replace("refs/tags/live-", "")).filter(v => /^[0-9.]+$/.test(v));
  const vgl = (a, b) => { const x = a.split(".").map(Number), y = b.split(".").map(Number);
    for (let i = 0; i < Math.max(x.length, y.length); i++) { const d = (y[i] || 0) - (x[i] || 0); if (d) return d; } return 0; };
  return liste.sort(vgl).slice(0, 10);
}

async function starten(welche, inputs) {
  await gh(`/repos/${OWNER}/${REPO[welche]}/actions/workflows/${ABLAUF[welche]}/dispatches`,
    { method: "POST", body: { ref: "main", inputs } });
}

function auftragsName(was) {
  const t = new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  return `${was} · ${t} · ${Date.now().toString(36)}`;
}

async function paketAblegen(zipBase64, name) {
  // Paket als einzige Datei in den Zweig "eingang" des Test-Repos legen (nicht veröffentlicht, nur Ablage)
  const r = `/repos/${OWNER}/${REPO.test}`;
  const blob = await gh(`${r}/git/blobs`, { method: "POST", body: { content: zipBase64, encoding: "base64" } });
  const tree = await gh(`${r}/git/trees`, { method: "POST", body: { tree: [{ path: "paket.zip", mode: "100644", type: "blob", sha: blob.sha }] } });
  const commit = await gh(`${r}/git/commits`, { method: "POST", body: { message: "Paket " + name, tree: tree.sha, parents: [] } });
  try {
    await gh(`${r}/git/refs/heads/eingang`, { method: "PATCH", body: { sha: commit.sha, force: true } });
  } catch (e) {
    if (e.status !== 422 && e.status !== 404) throw e;
    await gh(`${r}/git/refs`, { method: "POST", body: { ref: "refs/heads/eingang", sha: commit.sha } });
  }
}

exports.deployControl = onCall(
  { region: "europe-west1", timeoutSeconds: 120, memory: "512MiB", secrets: [GH_SCHLUESSEL] },
  async request => {
    if (!request.auth || request.auth.uid !== ADMIN_UID) throw new HttpsError("permission-denied", "Nur für den Admin.");
    const d = request.data || {};
    const aktion = String(d.aktion || "status");
    try {
      if (aktion === "status") {
        const [testV, liveV, testL, liveL, testP, liveP, st] = await Promise.all([
          version("test"), version("live"), letzterLauf("test"), letzterLauf("live"),
          pagesLauf("test"), pagesLauf("live"), staende().catch(() => [])
        ]);
        return { test: { version: testV, lauf: testL, pages: testP }, live: { version: liveV, lauf: liveL, pages: liveP }, staende: st };
      }

      if (aktion === "testHochladen") {
        const name = String(d.name || "paket.zip").replace(/[^\w.\-]/g, "_").slice(0, 80);
        const aelter = d.aelter === true ? "ja" : "nein";
        if (!d.nochmal) {
          const zip = String(d.zip || "");
          if (!zip.startsWith("UEsDB")) throw new HttpsError("invalid-argument", "Das ist keine Zip-Datei.");
          if (zip.length * 3 / 4 > MAX_ZIP) throw new HttpsError("invalid-argument", "Das Paket ist zu groß (höchstens 7 MB).");
          await paketAblegen(zip, name);
        }
        const auftrag = auftragsName(`Test hochladen (${name})` + (aelter === "ja" ? " – älteres erlaubt" : ""));
        await starten("test", { aktion: "hochladen", auftrag, aelter });
        return { ok: true, auftrag };
      }

      if (aktion === "liveGehen") {
        const trotzdem = d.trotzdem === true ? "ja" : "nein";
        const auftrag = auftragsName("Live gehen" + (trotzdem === "ja" ? " (trotz Lesbarkeit)" : ""));
        await starten("live", { aktion: "live", auftrag, trotzdem });
        return { ok: true, auftrag };
      }

      if (aktion === "zurueck") {
        const v = String(d.version || "");
        if (!/^[0-9]+(\.[0-9]+)+$/.test(v)) throw new HttpsError("invalid-argument", "Ungültiger Stand.");
        const auftrag = auftragsName("Live zurück auf " + v);
        await starten("live", { aktion: "zurueck", version: v, auftrag });
        return { ok: true, auftrag };
      }

      if (aktion === "neu") {
        const welche = d.ziel === "live" ? "live" : "test";
        const auftrag = auftragsName((welche === "live" ? "Live" : "Test") + " neu bereitstellen");
        await starten(welche, { aktion: "neu", auftrag });
        return { ok: true, auftrag };
      }

      throw new HttpsError("invalid-argument", "Unbekannte Aktion.");
    } catch (e) {
      if (e instanceof HttpsError) throw e;
      logger.error("deployControl", aktion, e.message || e);
      throw new HttpsError("failed-precondition", verstaendlich(e));
    }
  }
);
