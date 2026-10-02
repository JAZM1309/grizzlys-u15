const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`GitHub Secret ${name} fehlt.`);
  return value;
}

admin.initializeApp({ credential: admin.credential.cert(JSON.parse(required("FIREBASE_SERVICE_ACCOUNT"))) });
const db = admin.firestore();
const messaging = admin.messaging();
const STATE_REF = db.doc("system/bugReportNotifier");
const NOTIFY_EMAIL = required("BUG_REPORT_EMAIL");
const BUG_ICON_URL = "https://raw.githubusercontent.com/JAZM1309/grizzlys-u15/main/grizzlys-bug-icon.png";

function smtpTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "mail.gmx.net",
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: required("SMTP_USER"), pass: required("SMTP_PASSWORD") }
  });
}

async function sendEmail(report) {
  const text = [
    "Neue Fehlermeldung in der Grizzlys-U15-App","",
    `Name: ${report.name || "Nicht angegeben"}`,
    `Bereich: ${report.area || "Sonstiges"}`,
    `Version: ${report.appVersion || "?"}`,
    `Plattform: ${report.platform || "?"}`,
    `Push beim Nutzer: ${report.pushRegistered ? "aktiv" : "nicht registriert"}`,"",
    "Fehlerbeschreibung:",report.description || "","",
    report.contact ? `Rückfrage-Kontakt: ${report.contact}` : "Kein Rückfrage-Kontakt angegeben."
  ].join("\n");

  const safe = String(report.description || "")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/\n/g,"<br>");

  await smtpTransport().sendMail({
    from: process.env.SMTP_USER,
    to: NOTIFY_EMAIL,
    subject: `🏒 Grizzlys U15 – neue Fehlermeldung (${report.area || "Sonstiges"})`,
    text,
    attachments: [{
      filename: "grizzlys-bug-icon.png",
      content: "aVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQU5VQUFBRUFDQUlBQUFDcnBxVDhBQUVBQUVsRVFWUjQycVM5ZFdDazFmVStmczU5WlZ3eUUvZHNWcEoxTjViRmZRc1VpcFpTb1pSUzkzNnFsRG9WaXBWU29FQ1I0aFJmWklGMTErd20yYmpidU0rOGRzL3ZqK3h1WnBMSlFyKy8vRFBKNUoxMzNudnZ1VWVmODF3ME9BY0FoT2wrNk5RL2lRQ252dzRSaVFnK3djL3A3NVAvNWdDVWN3ZkMvK0VXa3k2bms3Zk1IaDBCSUNBZ2pmK2JjcWFFOGsvUXBLZjZtS3VudS96RTlYUzZSVGpkdkdWOU1QOFYyZmZQOHd5SThNblc3Zi94WjJMMng3L214TzhubnBvaFRQeHI2b0N6SjJYYUZTY0NBczU1bm9IVDVOdWR2TS9wUjB4Wk42Q1RmeE9kdkdHT05OSGt1MUhPUzdhb2piOWcxcUN5ZnBuNHN1bEY0ZFEwblJUUy8yWGxwdHVlbVBza3A5bmgwMytjOGwxQkozY2EwYVJKeUI0TGNmcjRwY2daS2swM0VnTElKOTlaazR3NDZmL3N4QWp3ZEhJd3paOHdzYUlJT0hYd3B4YWFhTXJXUEtFc0o0K0VzcFhUK0EwdzU4MlRDaXAzdzJQMkEyS08xQkVSalY5ejRpbE9maEluSnZQa3g4Wi95enVRU1NMQXBzb0VaUXZFaEtCbUxkdnBWSGFlRmFYVHpQbmtUMkhPSFNoYjAyVDlRaE1xWUtyS3pOSVdORlZuWkE4VmM5YWFjamI2cVhuTjh6T3U2N0syR3dJZzUzeUs3cWNUK2dBblN3MFJJRTVSRDFsWFRiblRhVzN0bEE4U0VPYmZDblJxWGZIamZJVkp6MEJFRXhNKzNlZkhOY1NVb2VHSm5VK1ROTzZVZTV5NkpQc08yYTdMNlIwR3lyS01lUEw2WEsyUVBWZFpEMEJFOEwvNEl0UGIrUk5UTU9XNm5BL2s5U0ZPclZwK3IyWHFmR1c5ZzV6ei8xZm5ZeHBCbkhScDdwOTBVdEVnZmlLajgzSFBOcTd5RWZLSlYvWmtUZGxKMDBwNjNzay9uZHdDVE5VbXVRT2tjYjJkYjNYejZNNWNEL1cwTTNIYXFmNkVYaldlVHNkT0Vzci9kYWxPNTV2aUtVTkMvNXZ6UVZPY3A5eUxFSE92d2ttS2ZOcVBuN29xeHpSamZ2Y3UrejZZNzVFb3gyazVxWndtREJhZVp0cVJjbTE1UHMvcXBLMUdQUFVHbmZMbEVYRkNjdk40ZURqRmNHVUpIeUdjR2hMbWVpV1VhL0VtUGRha0VQQ2t2enlka3pyVkFUb3hTOWxmUUpQYzVJOFI2R3pmbi9JOUcrWkdCMnpDTThxYUZaeG1xU25YTjg4WjdLUXJrVTdqUE9mM0gwN3RrSEhWTWExTG11MnA1TDN0eEp4TitscWFMQVFuZ3hmSzR6ZG4rL2FUb2h5Y05EcEFKTUJ4MXlUblgxbUdab3FQanZtODF0enROSEZsdGpnaVR1c1o1cGhpeEVucWVXcFFsbi8vWTA1TWt4MXUwTFFPSytWVFdaZzdhWGtDVHdiWnV6aExCdWxFWERIZGhxUEp6NW10ZGs0cGJhSjhtaS92UHB6NE5VOXdPbmxVcDlZajU4dXpWR2JXUHFNcDVwcHlBaDA4R2VsTTNjbDAwb0lnVHZhc0ovdlptQjBpNVYvbEUxczdhd3RqVHZpYTlha3MxVFgrSzA1ZGJQellDQ1kzenNpZEdjb2ZWTlBFRTJHV3FaZ3F2b2pUNkQ3S05qOXdXb2NBRVZpK0dIYzhYTVFwL2cxTmlwQW0yNVZUZ2VUNFhXaENzcWRJR0U0YUNXTFcvSnhLd2syZTU2d01UTDdjU3M2ejVORlZOT0VnZkt4TE9YVlNjcDFZbkN4YnAxTXRKd05yeW1PbHhqVWVBWEV5T0hBT1JHUndBczZST0dQRUdCQ0N3WW5US1RXTWVYeW1LVG81YTdWb2N0NWhXcnVKK2JZODVKL2VmR3J4bEZDY1ZFQkEwL3M1UklDR1llQ1VvSUVtMll1cy9NVEhCVnVVblFDaGovZFQ4L3ZhVTdLbFdhRnQ5bHM0NlVrcDF6aE4zVUtUQWhBNmFlM3lQUFpwbngrbTZvblRCVzc1dk85VHZpNG56Z0NZSUV6NnFBRmdjRURPSlhGOE1qZ1E2Y1RZMUlqZ2xIcjdIeFA3MDRjeUFCK2JNWmcyMXowMXlKdDJtakJQM25ocVltQWlmVENobndsT2huZzVVYzdrVWdOT2szL0lmZXMwS2QrOFNtM3lYc1JQdENYeXBaVHk3b0pjcit2a1IvS25KRTc5TldXM2ZFd3RaOXl2RXRnSmJkemU1ZDg3YWo2c1NQV2FiNmk5KzJCcnUyOGttb2txSEcyVmpZdVhyVzA0YzFYWjJobmdSZ0N1NjhRRWhoOGpPdE5JeVhpbGF2cVVFSjAwbTVSL2oxRmVkUUdmc0lxVGszekpJMzg1Q2NtOEtiYzhTVEw0cERXYzZaNDlOemRCZUZLVDVXUXRNTXNoeTZkcnA1R1AwNG5wSnhDVUNlazdVWUNoN0VMT3lWUXZBVERFRTVuWjNEMTN5bkJrMzV4ekVnUUdBT0VFN1cvcHVlZlBqMzYwMzU4MlpGRDlNSFlFb0E5QUFYQUJWRENQbDd4enlUc1RxcXBxRnpSY2MrSGNiNjJTS2dGMGd6TkVOam1Nbno0SFEvazlBNWlpQmZLTFp2NlBaOGVxMHliNUprbHl0bUhKbGI5SlZqaTdjb2NUVDNZeUM1M3IrSCtTTEdnZXhVR25OMlJaQXBoWDYweksyZUkwOVVmNDJDbzJqY2NYVSswMEowNGNBUVJSK0NRSlN5TE9PVElHK2RLUUp4NmFHMXdRaFZGZjdGZC9mRzV6VTMvbnJtZU5WTGZkV1RaM1ZsM1RrZWJTMnNxenpyNWcyWnAxOVhWVlprd2ZQTGh2ODliZG16ZnRUaVpIQVdaQ3pjcjVHODY4KzlZTEwxaFVBd0NjaUUzNC9EbUsrclFUZ25uOGtoT1ZIanlkWk9YNk85UHM4dWtyN0RTNUFwZlgvdEpKVnpXM1BQRy9BZ2RPYy8wSmYzeUt5enloYTA0Zk9YM2NvMlNKNWNmTzQzUjd6K0JjWklqc2hGdW02VEE0R3U4ZlMvWDBCL3I2eG9iSFJsT3hJQ011eVhhcjNWMVhWZHd3dTdSaGRrVmRoUlVBeURBNElDQXluSndHSitLQ0lHemEwZjM1ejkwKzNITVFFSUg4MTF4NzNXV2Z1cnF6dDMvSndubnJhdVhpaWtLdHR5UGN1b1VWVm0zYTI5V2RSTVZhMHRrMzhNb3I3MlNpTVFBdlZwMzc1ZHR1K2ZYdEt3cWRBakprK1lFSk5MbmEvLy9QSDh4UjVGTm1jOW9sbVdKUmMzSVowOWpmRSs1NVRtV0ZQaDRuazljNjVuR01wc055VE9lVW5OU3ZsS3Y2Y0ZKQjhPVEd5Vi9jeUo0SXdxbjVPVHBoR1RrQUNDZWpnWjZCeU5idGg3ZHVQN0IzOTViang5djBsQUVRQlFnQU1BQVJRQVVBQUJOQU1WaG1leHJPV0hMSkJWKzdidkZWQyswbllnakRBRURHRUJDSkUzRXVpTUlEVDJ6NzVsZS9WZUpPbHBaWlcxdmFIbmp3b1Z0ditYenc2RVlwM0dHTCsxSjlieElLY1g5U3Q0cW13TkJRanlKNkNpVlBiVUNxMlJrelhtaFNEdTArQmtrT0RUZmM4ZHNmL2VwcU8zR2R3NFEzbUYvdFQ1LzN3a2xXOHVQaE9EU1JmL3JmVE43SmFHOVMvZTIwbHYzMGhhcjhwZVBUK2xZZlcwK2JmdlJaY0lQc1JPaTRTd0E0K2YzeHdIT2kranQ5SVJJQitMaFpGQkNSQVVEdllQajF0N2E5L05LYnUvZnNWZVBOQURvQXpKL2J1R2poZk1hazJYTm1XbVNwWjhnWFQ2c1dxejN1SDJnNmN1UllheHNBQUhpZ1lOR2FjeTY2N0xJTHJycGtVV09aQUFDYzY1d3pSQklFNFJkL2VlTzNQN3lsdUVqKyt0ZHZlL2ZkamIrNzYrNnp6MXltZlBSL0kxdGVjczFhWVoyOVFxNmR5OEVxZUV1QmhhbTNtVElwSHU4TEg5clNzcVdOVW9LMDhsTk4zZ3RlZW0zVGxvMXZtRXJQLytGZjcvLzVEUlVpTnppd0thWDZTZEg4YVhYY3hIVGxDQ1RMazRwQ09JMUJtVnl4eTdPVWsvMC8rcVQ0djBrZVV2NVE0Qk5aeTQ4eENQOFA5bUlpQzBFQXhQbDRMSUNmckR4cUdGd1VHQ0J5Z0ErMkhuLzhpWmRlZXVGNUxYa01BT2JQTEpsVlAydkcvRFZYWEhYZHlxVUxCTkJFc3cwQWdsMUh0SmpQSnBLajBKdE1KSTczaHc2M0QrM1lkK2pnL3YzTng5cDBVZ0NLSERXcnJ2ak1aMis5K2VMMUM5M2pYL1NUUDcvenh4OTl6bUtPdnZEQ2F3WTNGaTFaVk90cVY1dGZZYnFDWmN1RW1SY0FWdXF4WTZMVjRFaytlblMzeTZaYjU1OEx6SXl4NHhEWUgydHA2My8zbzY1QlVaOTMrU0d4NnFtWE4vYTMwZVcvdU8vWlg2MjJjSjRyT3A5VVFaMlV2T212UGVIUy9lL0YrbE8yZE9xYnAzYitKUHM3eVpLUEt3WThYVmlRUDFyOEJFbVJLWHAxa3FNd1BaaGcwZy9ueElrWWtDQ01wN3RaVnZRd3Joa0FXWDYzMmpBNFk4Q1lvSEY0K1kyOTk5ejlqejFiL3dzUVhicGs2VTNYWGJGODhUeTd1MmhXNHdLN2swT2lqNUorc0hxTVpNTG8rbEFlYm9wMUh2SDE5Q2REbENDcmVjNVpEUmQveHI3cUVwMTVXenA2TnI3KzZwT1BQZHpTMFEwQVlGMTExcVhYZitNclY3YTBOTi94bmUrWXpLTi8rTU1mdi91ZHIvUEVFQnQ3VFV2NlJPOThjbFF5UnhFbCt0WDJUU2ExdTNYSXNmYy83NTgzbDVldFdtU1V6MmYyQ3JHZzNEQjVtUm8yT2pZZWZlYTVqOTZQNHN6S3JubGZmSDE3ODhEdXcxZi84SUhuL25RSjQvd1RSSUg1TVQ2VEMzMmZ4Q0JOY2NyR0ZTamxRTFZPRmZOUFpGdW41ditNVHhoYm5IVE84a1hhTUkybisvOEMwSmdRdnJ5cFlNeENXM0lhTDJDZnVHY0NvQ2NFSThjSFNjODRuSlpaTThxS25PT3lTTHBPMlppbDhlOWdpT05aMytmZVBQem51eDQ4dVAwSkFPM3FxNjY1OWZadm5IZm1DdEdVZ3NRUVlBcVNQaVVSTnJtOUlKZnc3cDBzY2pTalpES0MyNEpwazZDcGc5Mmp1dzY4dlR0emNCanF5MjNuWG5IK2lxdS9ESTNudGJRTlBQUGtFNisrL0ZML1lEeVJKRUFiMEVoMVZkbDNmL1NMNzN6dEJxUGpTVEJpNENvWENtYnlzU2JtTEZFNmQyWU92UzJud20rMWl2YzkxMzFOQTVEVHRIZEVjekIrMWRyQ1ZldG5PdGZlQUxWblVidy9jL0NGWFkrK1BkQVJHaTJvK0hlbnAyTW9yT3V6di91SE8rLys0Um1HUVl6aC8xOWJjcnBseWhhNlV5L1RvdVpPcWRZcE9kUlBsbjgrYlhBd1VSMzl4Q1BKbTRNN25WQk9VYXNURnhzR0Z4QTRzTU9kcVkwZkhEOTZyR2xmZjZRL3JCa0RBekI2QkNUZFVWaXlmTlhxcXo1OXhaVVhOMVFXNUwvL2UzdUg3N3JyNFE5ZnVSOGdlZXRYdnZUTjczeC9RV005R1AxOFpDOUhqaVl2bUt3b2x6T1QzYi96NmEzLytHZno4ZFlkQWRBMVhGNGtuRmx2V3Jxc3FtajVDb2xIK3o3Y2ZIQi9yR3NVV29LZ08reFhmK3I4aXo3M0ZmUGNsVHQzSHZqdFhYZHYrbkNYb2FkbEdWNTY1YTFMejE5cjlQNFhaWUVWejBKSWREMytoN3BhMjdGK1MyemJTM2JkT0JLVWYvcGgybXJGdUE1aktnR0FUVVNuU1poaEY2OWZWSGpaalJkV1gzS3BBS24wcG9kZnVtZG5NNXV4WmRIbmpuM3dRV3JFeitmZTh0OS9mUFdLWmRaSjB6a0p3cGpqbnVYa1N2TExLZWJVSS9GL0Y1TFRaUG16ODg5NWhPQ1Q1R2FuSm51eWloTlpsbjRjbjBzSURITkJORGx4dy9SVm12ejRDa3dSUFBydTJGOGUzakx3MXZPZ05nRWFacE9Pc2xCZFhSdVBKNG85OHVGRFJ3SGNqbG1mK2ZvM2IvemlwK2NuNGtsL01CNkpacm9HWXAyRDRkN3U0eCs5OEU4d1d0ZXRPK2V2OTkyL2NzazhpTFpvSTd0UlNBc21LM25tQVNHbXVoSGhuYjgvL050ZmY5Z0M0Q3dzY2hjVVhsQWhubDhTY3lUN1psUkI4WnBWTUh1NU50YmoyM3VnL2VEWTdrN2NOa3hCRG9zYUtqOXp4Y1ZyYi8xWkdLMy92UC9ldSs3NncvZC8rTE0vL2ZFMyt2Ri9NN2VITzJlSm8rOTgrSy9IVGYzSGhQS1pMNzdVWG1DR1FBTCtPd2o5L01Sd3h4WFpPRHplQ2JET0RqZk1na3R2VytlKzloY3MydG54Mk8vL2N1K1FkdUZsdStmZDNuN1B0MGdvK3VGOXovN3hzM1djODJrbGdDWVFORVQvazJMTVNlUGh5Zm9YNE1kNVZYbU5aZFlsMCtxL3Fjbm4vN215Y1Jvbk5MOWdmV3dyemFrYU9pZk8zOXJlL2NERHIrLzY2SjNFYUh0TjQ3ejE1NTU3L2VXckswdGQ4V1NtcHFKY1pXSThsdkNOamg1dWFybi8zaWNIZXROaWNZMGVHNFZNREVBQmlBTXdnT0RNR1hYZitiOWZmdm1HaTAycFpyWHBXZUFKY2VZNlZGT0FPbWthcGtlMWFQQ0RmN3l5ZWJTdTR1d3JHdGF1V3JwMFNhSEhESm5oK1BESTNvZi9HanF5WitrU2E4MlNlaWl0RisyUzFycjcrTGIyZDNZYm00WnhNRW1GSnZqY3VmWFgvK1plKzZMTHRtemZ2YUJ4aG52NE9SQVRJSHZWN2M5MmRYWDg1WW5oY3h1ay94eldMQUJwQXcwQkE0ekNhUnFJQTUyVXZKTTFUalF6dUxCT3VPZkxWWFVYMzJDVXJ4SjIvZld4dTdadWJZWHdsKzk2Ly8zZDZjTmJacDcxL1Mxdi9xVE1TdnlVdS92L0dONmRaakVKY3hKaEp5QU5wekFrbEwveThjbnF2LzlqUTlmL2MrajZ2OXh3U3M2RmMwTEdIbnc3L00zYmZ3Y0RENkZVc083OGkxWXZXOXhvQ1M0MERudXRpdDBDaHFYQU5YZWQyVk1LT3U4TnNXMzdtcDU2ZWN2KzVqNlB0NkNnMENOTFhKUmdkdDFzdDdmaSs5KzlwVFJ6UUc5K21WTlNOQ0tzcXBIQ1FkNTdHQmxpMVFwWWZGdTR1VlVGYyttWlp3SWpBQlZJcHZneGlMVWppRW84Nmp2VzZ0KzFwOHdWSzF1MWxEd3pRVThaM1hzQ1IzdGFteE9iT21EVENKaUF6cDF0dnZibWErWis3cWRncStSdHo2WDJQUjFzT2lCazByL1lSSU5SR2xaQVY2aFF4bFhWY09rUzRlY2Y2Z2Q5b1BQSjlVd2N6N2dScnFoeVB2R2JLK2VldDQ1OGh6dWZlLzUzRHdhR0dwWkhMdnZ5MGIvK1VVazNmdjIrdXg3NCtnTERNRmhXQldaSzRRank1RkNteWM3angzV2dmRHh5UHFlQ05kbUlpNURqSE9UVk90UEdzMVBzNXVrem1QOVBXWlVjMENJWkJvZ2lPOXl2UGZtdlIrM3hkemJjZFBOWGJycThNbm8wZnVnNWp5eTRxeXZNQmNXQ2xvcDFOUjk5NklWd1NtRFZxOXZGdWZhNkJmOTY0cCtTczlBc2NBdVB4WDFqZ1lIK2hyTXZCVzAwL3V3WGt2RmpwcUlxTVJiVWxCUjBObXYrcUduR0xHSGh0YkQwS3dDeVozVVJTQkVqMFdrSWhXaXBRVFZJWUJNc1phaUdaSXhVVlhOUFFEeSsxVGZXL1c3ak9mM3lqSGxDK1l3aUFFZ2NGd3pOWVBCbVAvNm5TUWsvK1BSTnFkamkyeDRRR203cTNMNjMvZUNXc2JqdzNnQTNBQ0k2TmxoUTBlbk1XdFkwWnV3Wm1YYWRHUUVnakF4SDMvcmJTOVdMMWhKYlZsanc2cG9sN0w3OVRabHpoWXJydnRUeitJdi9mdVMxYjE4eloxYXhOQjZJWUo3NkQ1NHF6OEZFVTh5a3VEbXI4SkEzNTVvWHV2VXgzbE4rMEp0d3h4MTNRUGJYVDNybUNVd3kwTFN0Z3BqakdFeUwxcDU0anYrcGtuZHFlM0NPb3NoMjkyUTJYUDd0OWkxL09uZkQxYis2N1hMcHZWL3FIUnZMWnhhNkswb3pvMFBxU05kb1Q0OVBLWlhuWDFmeG1UL011ZWI3WjF5MGR0RzhFdGZBTzViT054TWZQWGo0bjNjOWY5YzlybmtyaTVXbTRYdXZGdU05T3RoR0QzZTJOQWY5dlRHYmFES2QreVdwY1RuTTNJQ29VK29ZSU9lR0JTeXpCVk1sQlBhTFlrZ3dTeEFQS09tRUpGdkI2cFl0RENQKzRaWVlaVkxlMmRYZ2JlU3lYYzFFQTc0a2orcHVDVHZTY0NSTUJiRytHbFBFVWI5SW1uUGg5cGFldjd6VjR1ZVlBYkZVQmhHbzNvbmxMcmh6TjJXTUNUU05rRFZ4REdDOFR6dUZ3aUtMc3JZeTVGaC9nOUt4TytVYjNObUozZlo1VkZFaEI4ZGlQbFl5YjlINmVXNkRFOE5jMENKT1dQT0pmQVZtdzdZbTlBaE9JSE5QK0dCWnFkOWMrQm1jekE3aXRObm1rNFdQUEVzdVRoRytYT3dyVGx0ZW52dys0bVJoenhPMDRrUmE2R01MSlJNRHdKT0FFVHpTcDJ6NDFIZkR6VS8vK0pkLys5YTFxME12ZlkvcHZ0MFIrMy92UGxnblpicEdPTnJ3UjNmK2J2Vk4vMmN4STBTT1FIU1RFVXBocEEwaUhkcEllK3pJd2JZbWZkM1h2cjJxZUN6NDZGL2I0MEl3d2lnMlpDOFFLOTI4ZHRrQ3o0M2Z4MFE3V2EzRWZUdzZ5cXd6eVR5SG1Nd01sZHFlRktsL1pGZjRYLy9kMzNLOGEyMXBadG1hV2M2YWVhV0ZidStLbFRYaHJVUHRZZnNIVzByUDVrTDFjdStGeFV2TDl0amYzVzg1bm9ybzhNb3cvbWxYSmhsNDVNYWo3elhjL3ZkdjNmOWMzUDZWdXg3NEQ5ZTRRbVRpVUZNSWJ3eFFJRDBlbndFQ0NJaG1oQXduUW1BRUlvSkdZQURvQm45dEZMOGVHU2xRT3NUR3RjYmJlMERRN1UxdmhoZmNLUnNwVnVBOEdMSmtkREFKU0xtSTdXeW94NGs4M3drdE54WG9oOWtsbFBFRnkzTHNwc0JWSjJLT1NUSEtoR3hNcDNERUhOVTgzaVF5RFN4dmFqNzlaRUY2UXV3SVRzSXhjb2VEMlczaE9NbW80OGNRREp5VTVHQWNydi9pUGRyZ1IzZmUvZmZicjc5ZzROOWZUWTBPUHJvbjl2U2hzQVlJUUhXejV6Nys3MmZPV2owSHVsN1FlcmN3WlZpUWJZTFZrdzZFakk0OVdpTFZQOFRyMXpRVWE5MnYvK0dOOXJRMDROZVdWTkU1WjFXVU9wUHU2aXBwN2FjaDNrYVNERFkzWlFiUlBwOHNDMEVRV2FJci9NcDMxVVQ0eVE5OUQ3eldNYWlEQ2VBdEFRcmVEdFk0ZGw4eTMzek5sUXM5czhzN095TWZiWTFzcU82MGw4d2tzOHRhWE5pd3hDT0FGbFMxakVIYmd2aFJVRmpSMGxleTZTK0ZoUlhmKy9xM2V0cGFYLzN3VUZxbFFvbDNSbWhIY0J5UVFRQWdBSGdFc2pBSTZraEV3SkNJVEF6U0hBUUc2UXdkYkZlcW1ReVU4aVV4dzRUVVdNREV6SWs1YTNEamV6SjhYUWN3QXhGTzZ2N0ViRW1jYXFFK0hvQTVIU0oxc3VhYjFPZUJrQ05UT1JrYWNUS01LdWVycDFXcTR6NEQ0VW1zL3NudnlXMmVPYldEOEZSblNaYUtwVHhvNzBsQXJ5eFFreUFJMy8vdEs4Yy9lcWgrNGJ6NVN4WjN2dkxIWVBQT1p3OW1ubTVKaWdJRGcxLzNtYXNlKzllL0lydGYrZUNMbDgveUJnckwzQWJLU2pBWTk2ZjcrbzJJQWg0bmpDWmg2R2gvMzN2SE9lS2lTdTNpRlFWTEwxcHB4aFF2S3NHcVJxN29ZSEdoMVVXa29HMHgySmN4UGdxQlkvdnUrczZlcmMwdkRRaGJSZ3dBSm9tSVJEYUJyQ0oySnVEQXNMcndVT3ZxdVM1UHFiazNrTzQ4UEx4a1dad3NIaTQ1VTl5YTBkRWlZYkZFYTkxMElHbzhmWlJWT2JmSytDM0xwVCsvN1h1LzJIWHN5KzA5bzVJSmo0VWhySnhBVVFvQWhTSlVXd0FSbUVLR0FTcVN3a0ZDa0FCaVJLc3FrTVdEa0JnR2toV1ZtM1dlWUZZaEdCWnE1eHVXclllMjdZU3ZYa2Q4WXBVeFQrUHdpWklCVFdtUXloSVB6QXB2Y1FLcmtMKytoZFBXOFNhRndLZnlrSWduNVc5cThUNG5pNWN2bllTWUN6K2RFbzFnanNOd1VrUGo1QTlOaXJaT2dWbXl2dEl3dUNnSzI0K0ZuM3I0Q1REek0yLzcwUkozN0krUFBkWTVsTncwQnBJa2FwcCt3MmMvLysxck56ejJoNSs5ZS8rRGE0dEJuNDJXOXBIV1FkZzlKcXd1cDlXVjJCR0U5akRzSEFXSnA2NmFqMmV2Y3BmTjhzS3lpNDBvTnp4RmFEY1JDT0FvQkRBSURMQTJnSDBwR3YzeGJYL1o4ZEN6cjN3VWVEZUMvYW9oQ0V3Z3NDRjVKZkRLVUNKVG9ZWE1Hb1Q2VWpUSDVpNlFQSTcwd0VCeVp0K2dZMEU1ZDVmYlp5OHFDOFFIUjhlc1lSQXlWR3Vob1JUOWVTZGVHOXEyTHZLMU5kOTk3dFhuSHJybDF1KzJkUXdTR2VNT0hnQllHVlNZUUVhd2lTQURwSFZJRWFnY1JFUk9GRkZBdExLYVlxdVI4SXNPRHdPVFRWU2syQ0Q1eHJEYXhVRnUyN1B2NE1pMTY4dVlZVUEyRERGck9iS0VEdk9ndUNHUEVxS3MvalU4S1c4MHFkMHViMkE5RFJuT0NYa1ZKN21TK1dUaTR6QTUyVitWcmRob3dvL0YzRnZrR3ZrSkQ0U3k0Wk81NDNya3FUMDhraTY0N0tkRkdEcm5zcTlFTlBmNjlSdHVzdHErZE91WExaQmFVTzlWbWw0TURMOTI4eVhlT2ljNWhiaTl5RlpWbUcxWkx4dTBXbzM2alY0dm9uY2JyanowK2FhdVhYSkJFc3R2TUpTVklvRjQ2UWtPa2cyRUVSRVJ0YWxZSm5QOU03NEM5Lzk3eVB2UDdLWDk1SjVVQmNST1JrNmlNaUJOREpTT2cwYW9BSE9kME02YVF5MEJjb3F6VVdGd3VFT3JlbnQ3V2RVVkdESmZMbkFWenFuc25JZ2NtUW9MVEVRQmJBUmhCVjZ1MU9RcGI2VnJwODBYdmVUSDkxNitkZC9mTzl3aGdrTURVNEFZQk1ncG9IR29jNE9jUTFpREt5QWFSME1Ub0JnVnNCQVBtZDVQVmtxNUhETFNGSUlxeUF6blFlR0xPZXZpUE9JTm5CODk2R2g5V1dWbkF4Mm9oUk9VNXkyVTNpK0tVSGx1QXFnYkhlZnBtWm1NQTkyTlFmL011VWorYjBzRWZLM3JVK0pXU2ViK2V4R2tGT2c2a24rS2VGRUZISUtjRHVsSm94WjJ1K2t4VDRKUHdRaUVBUVdTdkwzQWlVNDl6eTkvL0I5UDN5M1lkYXNSLzc4aC9QT1h3OXFINHdkQmtFekJsODN1ZW44ODJya3lEQzZIVWJFbHc1RjBjV3VQNzlBYzNyMFJHSnNuODlUS1A3cUYrdE10WFA4dmVGOXpjTVgzYlNHRWdHdzJwQm55TWlRVklpbVlqSlhrVlNNOFVPWlE0Kys5L0pIOTdaWTJneEtpalBBVlNwb293N1pzSkRDakZSU1N4bEd4c20wa1RSWUJMQkwwTnFuRzFyU0pLSFpoTkhSUkdiUE82WVZISkxoeE1pd29tb2VDL2dTWU5laFdJWW93VUNHSC9MQnJEMmJ2QTY2OHFaZmFwbkViZi8zcjdDQkRJRVJKQTBJY0RqVEExNHpjQWFNZ1pWQlhLRU13YUFLMVRMT0xBRHp2Q1U4N2N1MDdScExwVWNWRkFWZFM4V2R0aUpvckE0ZENtM2YwZlNqU3l2WmFTSzZVOHVNK1d0a3A2VXRJQ0NjMG42YVAzK1NLOW01d25ySy9tS2VVSlltTkZWT2cyVjJGVEVyT3MyaEc4cDFJN0pDWUNKQ21OeDJsTnZDaGxrcEtBQUFEc0FBRGtXdzRleVpxVjBQeDQ0Kzkra2JibjN4NlQ4SnpPRHhneXk4RmF6MVVIaVdVRllCYWxpY3V4SjZqbXFqUFZpM1ZCN3FQUGhoUjhQbmJuYlUxY1hmZWViWGI0Lzk1cDRycFhWWDYxeDk1cmQzRmxWNG1hTkFwMklCTTBBWlFJblpWaEV6TWZCQjZIWGxvMGRmZStEREgrKzI5U2tpYzg3RDhqTWhxUXJjeUdpaGpJQlczYWRxVFJFTk1nSVdDZXBRZ2t3TVlocUtFaFJiS1pHa0FMSkF4MmlSYmJNOFl3a1dWNEtIcDJpczFzWFBtaTFZQk5SVnZUMUk3WDc0NnhaMnh1aTJxNXlQWGZPREgxYklvUy9lOFdwN1ZFQTBVaHdxVGJERUNZUlFZQUszQkVWbThscGhqdzhHUXV6eUdyNWlRUVVWVlNoTk81dTJOa2NTRkFXVFNVU1dpbXVEWVh1Vkp6VGk2UnlNWndETUREaWNDS2luS2YrUHcxSnlUTkprUmdYTWRjQk9tTFBUcHl6d1kxb0VzeVJhbkpxVXg=",
      encoding: "base64",
      cid: "grizzlys-bug-icon@grizzlys-u15",
      contentType: "image/png",
      contentDisposition: "inline"
    }],
    html: `<div style="font-family:Arial,sans-serif;color:#111;max-width:700px">
      <img src="cid:grizzlys-bug-icon@grizzlys-u15" alt="Grizzlys Fehler" width="220" style="display:block;margin:0 0 18px">
      <h2>Neue Fehlermeldung in der Grizzlys-U15-App</h2>
      <p><b>Name:</b> ${report.name || "Nicht angegeben"}<br><b>Bereich:</b> ${report.area || "Sonstiges"}<br><b>Version:</b> ${report.appVersion || "?"}<br><b>Plattform:</b> ${report.platform || "?"}<br><b>Push beim Nutzer:</b> ${report.pushRegistered ? "aktiv" : "nicht registriert"}</p>
      <p><b>Fehlerbeschreibung:</b></p><p>${safe}</p>
      ${report.contact ? `<p><b>Rückfrage-Kontakt:</b> ${report.contact}</p>` : "<p>Kein Rückfrage-Kontakt angegeben.</p>"}
    </div>`
  });
}

async function sendPush(report) {
  const snap = await db.collection("pushTokens").where("admin","==",true).get();
  const byInstallation = new Map();

  for (const doc of snap.docs) {
    const d = doc.data() || {};
    if (!d.token) continue;
    const key = d.installationId || doc.id;
    const previous = byInstallation.get(key);
    const currentMs = d.updatedAt?.toMillis ? d.updatedAt.toMillis() : 0;
    const previousMs = previous?.updatedAt?.toMillis ? previous.updatedAt.toMillis() : 0;
    if (!previous || currentMs >= previousMs) byInstallation.set(key, { data:d });
  }

  const candidates = [...byInstallation.values()].map(x => x.data).filter(d => d.token);
  candidates.sort((a,b) => {
    const am = a.updatedAt?.toMillis ? a.updatedAt.toMillis() : 0;
    const bm = b.updatedAt?.toMillis ? b.updatedAt.toMillis() : 0;
    return bm - am;
  });
  console.log("Bug-Push: Admin-Token gefunden:", candidates.length, "– verwende das zuletzt aktualisierte Gerät.");
  if (!candidates.length) return false;

  const tokens = [candidates[0].token];
  const title = "🏒 Neue Grizzlys-Fehlermeldung";
  const body = `${report.area || "Sonstiges"}: ${(report.description || "").slice(0,100)}`;

  // Genau dieselbe FCM/WebPush-Struktur wie beim funktionierenden 24h-Push.
  const successCount = await messaging.sendEachForMulticast({
    tokens,
    notification: { title, body },
    webpush: {
      notification: {
        icon: "https://jazm1309.github.io/grizzlys-u15/grizzlys-bug-icon.png",
        badge: "https://jazm1309.github.io/grizzlys-u15/badge-96.png",
        image: "https://jazm1309.github.io/grizzlys-u15/grizzlys-bug-icon.png"
      },
      data: { type: "bugReport", title, body },
      fcmOptions: {
        link: "https://jazm1309.github.io/grizzlys-u15/"
      }
    }
  });

  console.log("Bug-Push Ergebnis:", { successCount });
  return successCount > 0;
}

async function main() {
  const stateSnap=await STATE_REF.get();
  let lastProcessedMs=0;

  if (stateSnap.exists && stateSnap.data().lastProcessedAt) {
    const ts=stateSnap.data().lastProcessedAt;
    lastProcessedMs=ts.toMillis ? ts.toMillis() : Date.parse(ts);
  } else {
    await STATE_REF.set({lastProcessedAt:admin.firestore.Timestamp.now(),initializedAt:admin.firestore.FieldValue.serverTimestamp()},{merge:true});
    console.log("Notifier initialisiert – bestehende Fehlermeldungen werden nicht nachträglich versendet.");
    return;
  }

  const snap=await db.collection("bugReports").get();
  const reports=[];
  snap.forEach(doc=>{
    const data=doc.data()||{};
    const createdAt=data.createdAt;
    const createdMs=createdAt?.toMillis ? createdAt.toMillis() : 0;
    if(createdMs>lastProcessedMs) reports.push({id:doc.id,...data,_createdMs:createdMs});
  });

  reports.sort((a,b)=>a._createdMs-b._createdMs);
  console.log("Bug-Notifier: neue Fehlermeldungen:", reports.length);

  for(const report of reports){
    console.log("Bug-Notifier: verarbeite Fehlermeldung:", report.id, report.area || "Sonstiges");
    const ref=db.collection("bugReports").doc(report.id);
    let current=(await ref.get()).data()||{};
    let pushSent=Boolean(current.pushSentAt);

    if(!pushSent){
      pushSent=await sendPush(report);
      console.log("Bug-Notifier: Push gesendet:", pushSent);
      if(pushSent) await ref.update({pushSentAt:admin.firestore.FieldValue.serverTimestamp()});
    }

    current=(await ref.get()).data()||{};
    let emailSent=Boolean(current.emailSentAt);

    if(!emailSent){
      try{
        await sendEmail(report);
        await ref.update({emailSentAt:admin.firestore.FieldValue.serverTimestamp()});
        emailSent=true;
        console.log("Bug-Notifier: E-Mail gesendet:", report.id);
      }catch(error){
        console.error("E-Mail-Versand fehlgeschlagen:",error.message);
      }
    }

    if(pushSent && emailSent){
      await STATE_REF.set({
        lastProcessedAt:admin.firestore.Timestamp.fromMillis(report._createdMs),
        lastProcessedReportId:report.id,
        updatedAt:admin.firestore.FieldValue.serverTimestamp()
      },{merge:true});
    }
  }
}

main().catch(error=>{console.error(error);process.exit(1);});
