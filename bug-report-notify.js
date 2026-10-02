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
const BUG_ICON = "https://raw.githubusercontent.com/JAZM1309/grizzlys-u15/main/grizzlys-bug-icon.png";
const PUSH_ICON = "https://jazm1309.github.io/grizzlys-u15/grizzlys-bug-icon.png";
const BUG_ICON_BASE64 = `aVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQU5VQUFBRUFDQUlBQUFDcnBxVDhB
QUVBQUVsRVFWUjQycVM5ZFdDazFmVStmczU5WlZ3eUUvZHNWcEoxTjViRmZR
c1VpcFpTb1pSUzkzNnFsRG9WaXBWU29FQ1I0aFJmWklGMTErd20yYmpidU0r
OGRzL3ZqK3h1WnBMSlFyKy8vRFBKNUoxMzNudnZ1VWVmODF3ME9BY0FoT2wr
Nk5RL2lRQ252dzRSaVFnK3djL3A3NVAvNWdDVWN3ZkMvK0VXa3k2bms3Zk1I
aDBCSUNBZ2pmK2JjcWFFOGsvUXBLZjZtS3VudS96RTlYUzZSVGpkdkdWOU1Q
OFYyZmZQOHd5SThNblc3Zi94WjJMMng3L214TzhubnBvaFRQeHI2b0N6SjJY
YUZTY0NBczU1bm9IVDVOdWR2TS9wUjB4Wk42Q1RmeE9kdkdHT05OSGt1MUhP
Uzdhb2piOWcxcUN5ZnBuNHN1bEY0ZFEwblJUUy8yWGxwdHVlbVBza3A5bmgw
MytjOGwxQkozY2EwYVJKeUI0TGNmcjRwY2daS2swM0VnTElKOTlaazR3NDZm
L3N4QWp3ZEhJd3paOHdzYUlJT0hYd3B4YWFhTXJXUEtFc0o0K0VzcFhUK0Ew
dzU4MlRDaXAzdzJQMkEyS08xQkVSalY5ejRpbE9maEluSnZQa3g4Wi95enVR
U1NMQXBzb0VaUXZFaEtCbUxkdnBWSGFlRmFYVHpQbmtUMkhPSFNoYjAyVDlR
aE1xWUtyS3pOSVdORlZuWkE4VmM5YWFjamI2cVhuTjh6T3U2N0syR3dJZzUz
eUs3cWNUK2dBblN3MFJJRTVSRDFsWFRiblRhVzN0bEE4U0VPYmZDblJxWGZI
amZJVkp6MEJFRXhNKzNlZkhOY1NVb2VHSm5VK1ROTzZVZTV5NkpQc08yYTdM
NlIwR3lyS01lUEw2WEsyUVBWZFpEMEJFOEwvNEl0UGIrUk5UTU9XNm5BL2s5
U0ZPclZwK3IyWHFmR1c5ZzV6ei8xZm5ZeHBCbkhScDdwOTBVdEVnZmlLajgz
SFBOcTd5RWZLSlYvWmtUZGxKMDBwNjNzay9uZHdDVE5VbXVRT2tjYjJkYjNY
ejZNNWNEL1cwTTNIYXFmNkVYaldlVHNkT0Vzci9kYWxPNTV2aUtVTkMvNXZ6
UVZPY3A5eUxFSE92d2ttS2ZOcVBuN29xeHpSamZ2Y3UrejZZNzVFb3gyazVx
WndtREJhZVp0cVJjbTE1UHMvcXBLMUdQUFVHbmZMbEVYRkNjdk40ZURqRmNH
VUpIeUdjR2hMbWVpV1VhL0VtUGRha0VQQ2t2enlka3pyVkFUb3hTOWxmUUpQ
YzVJOFI2R3pmbi9JOUcrWkdCMnpDTThxYUZaeG1xU25YTjg4WjdLUXJrVTdq
UE9mM0gwN3RrSEhWTWExTG11MnA1TDN0eEp4TitscWFMQVFuZ3hmSzR6ZG4r
L2FUb2h5Y05EcEFKTUJ4MXlUblgxbUdab3FQanZtODF0enROSEZsdGpnaVR1
c1o1cGhpeEVucWVXcFFsbi8vWTA1TWt4MXUwTFFPSytWVFdaZzdhWGtDVHdi
WnV6aExCdWxFWERIZGhxUEp6NW10ZGs0cGJhSjhtaS92UHB6NE5VOXdPbmxV
cDlZajU4dXpWR2JXUHFNcDVwcHlBaDA4R2VsTTNjbDAwb0lnVHZhc0ovdlpt
QjBpNVYvbEUxczdhd3RqVHZpYTlha3MxVFgrSzA1ZGJQellDQ1kzenNpZEdj
b2ZWTlBFRTJHV3FaZ3F2b2pUNkQ3S05qOXdXb2NBRVZpK0dIYzhYTVFwL2cx
TmlwQW0yNVZUZ2VUNFhXaENzcWRJR0U0YUNXTFcvSnhLd2syZTU2d01UTDdj
U3M2ejVORlZOT0VnZkt4TE9YVlNjcDFZbkN4YnAxTXRKd05yeW1PbHhqVWVB
WEV5T0hBT1JHUndBczZST0dQRUdCQ0N3WW5US1RXTWVYeW1LVG81YTdWb2N0
NWhXcnVKK2JZODVKL2VmR3J4bEZDY1ZFQkEwL3M1UklDR1llQ1VvSUVtMll1
cy9NVEhCVnVVblFDaGovZFQ4L3ZhVTdLbFdhRnQ5bHM0NlVrcDF6aE4zVUtU
QWhBNmFlM3lQUFpwbngrbTZvblRCVzc1dk85VHZpNG56Z0NZSUV6NnFBRmdj
RURPSlhGOE1qZ1E2Y1RZMUlqZ2xIcjdIeFA3MDRjeUFCK2JNWmcyMXowMXlK
dDJtakJQM25ocVltQWlmVENobndsT2huZzVVYzdrVWdOT2szL0lmZXMwS2Qr
OFNtM3lYc1JQdENYeXBaVHk3b0pjcit2a1IvS25KRTc5TldXM2ZFd3RaOXl2
RXRnSmJkemU1ZDg3YWo2c1NQV2FiNmk5KzJCcnUyOGttb2txSEcyVmpZdVhy
VzA0YzFYWjJobmdSZ0N1NjhRRWhoOGpPdE5JeVhpbGF2cVVFSjAwbTVSL2ox
RmVkUUdmc0lxVGszekpJMzg1Q2NtOEtiYzhTVEw0cERXYzZaNDlOemRCZUZL
VDVXUXRNTXNoeTZkcnA1R1AwNG5wSnhDVUNlazdVWUNoN0VMT3lWUXZBVERF
RTVuWjNEMTN5bkJrMzV4ekVnUUdBT0VFN1cvcHVlZlBqMzYwMzU4MlpGRDlN
SFlFb0E5QUFYQUJWRENQbDd4enlUc1RxcXBxRnpSY2MrSGNiNjJTS2dGMGd6
TkVOam1Nbno0SFEvazlBNWlpQmZLTFp2NlBaOGVxMHliNUprbHl0bUhKbGI5
SlZqaTdjb2NUVDNZeUM1M3IrSCtTTEdnZXhVR25OMlJaQXBoWDYweksyZUkw
OVVmNDJDbzJqY2NYVSswMEowNGNBUVJSK0NRSlN5TE9PVElHK2RLUUp4NmFH
MXdRaFZGZjdGZC9mRzV6VTMvbnJtZU5WTGZkV1RaM1ZsM1RrZWJTMnNxenpy
NWcyWnAxOVhWVlprd2ZQTGh2ODliZG16ZnRUaVpIQVdaQ3pjcjVHODY4KzlZ
TEwxaFVBd0NjaUUzNC9EbUsrclFUZ25uOGtoT1ZIanlkWk9YNk85UHM4dWty
N0RTNUFwZlgvdEpKVnpXM1BQRy9BZ2RPYy8wSmYzeUt5enloYTA0Zk9YM2Nv
MlNKNWNmTzQzUjd6K0JjWklqc2hGdW02VEE0R3U4ZlMvWDBCL3I2eG9iSFJs
T3hJQ011eVhhcjNWMVhWZHd3dTdSaGRrVmRoUlVBeURBNElDQXluSndHSitL
Q0lHemEwZjM1ejkwKzNITVFFSUg4MTF4NzNXV2Z1cnF6dDMvSndubnJhdVhp
aWtLdHR5UGN1b1VWVm0zYTI5V2RSTVZhMHRrMzhNb3I3MlNpTVFBdlZwMzc1
ZHR1K2ZYdEt3cWRBakprK1lFSk5MbmEvLy9QSDh4UjVGTm1jOW9sbVdKUmMz
SVowOWpmRSs1NVRtV0ZQaDRuazljNjVuR01wc055VE9lVW5OU3ZsS3Y2Y0ZK
QjhPVEd5Vi9jeUo0SXdxbjVPVHBoR1RrQUNDZWpnWjZCeU5idGg3ZHVQN0Iz
OTViang5djBsQUVRQlFnQU1BQVJRQVVBQUJOQU1WaG1leHJPV0hMSkJWKzdi
dkZWQyswbllnakRBRURHRUJDSkUzRXVpTUlEVDJ6NzVsZS9WZUpPbHBaWlcx
dmFIbmp3b1Z0ditYenc2RVlwM0dHTCsxSjlieElLY1g5U3Q0cW13TkJRanlK
NkNpVlBiVUNxMlJrelhtaFNEdTArQmtrT0RUZmM4ZHNmL2VwcU8zR2R3NFEz
bUYvdFQ1LzN3a2xXOHVQaE9EU1JmL3JmVE43SmFHOVMvZTIwbHYzMGhhcjhw
ZVBUK2xZZlcwK2JmdlJaY0lQc1JPaTRTd0E0K2YzeHdIT2kranQ5SVJJQitM
aFpGQkNSQVVEdllQajF0N2E5L05LYnUvZnNWZVBOQURvQXpKL2J1R2poZk1h
azJYTm1XbVNwWjhnWFQ2c1dxejN1SDJnNmN1UllheHNBQUhpZ1lOR2FjeTY2
N0xJTHJycGtVV09aQUFDYzY1d3pSQklFNFJkL2VlTzNQN3lsdUVqKyt0ZHZl
L2ZkamIrNzYrNnp6MXltZlBSL0kxdGVjczFhWVoyOVFxNmR5OEVxZUV1Qmhh
bTNtVElwSHU4TEg5clNzcVdOVW9LMDhsTk4zZ3RlZW0zVGxvMXZtRXJQLytG
ZjcvLzVEUlVpTnppd0thWDZTZEg4YVhYY3hIVGxDQ1RMazRwQ09JMUJtVnl4
eTdPVWsvMC8rcVQ0djBrZVV2NVE0Qk5aeTQ4eENQOFA5bUlpQzBFQXhQbDRM
SUNmckR4cUdGd1VHQ0J5Z0ErMkhuLzhpWmRlZXVGNUxYa01BT2JQTEpsVlAy
dkcvRFZYWEhYZHlxVUxCTkJFc3cwQWdsMUh0SmpQSnBLajBKdE1KSTczaHc2
M0QrM1lkK2pnL3YzTng5cDBVZ0NLSERXcnJ2ak1aMis5K2VMMUM5M2pYL1NU
UDcvenh4OTl6bUtPdnZEQ2F3WTNGaTFaVk90cVY1dGZZYnFDWmN1RW1SY0FW
dXF4WTZMVjRFaytlblMzeTZaYjU1OEx6SXl4NHhEWUgydHA2My8zbzY1QlVa
OTMrU0d4NnFtWE4vYTMwZVcvdU8vWlg2MjJjSjRyT3A5VVFaMlV2T212UGVI
Uy9lL0YrbE8yZE9xYnAzYitKUHM3eVpLUEt3WThYVmlRUDFyOEJFbVJLWHAx
a3FNd1BaaGcwZy9ueElrWWtDQ01wN3RaVnZRd3Joa0FXWDYzMmpBNFk4Q1lv
SEY0K1kyOTk5ejlqejFiL3dzUVhicGs2VTNYWGJGODhUeTd1MmhXNHdLN2sw
T2lqNUorc0hxTVpNTG8rbEFlYm9wMUh2SDE5Q2REbENDcmVjNVpEUmQveHI3
cUVwMTVXenA2TnI3KzZwT1BQZHpTMFEwQVlGMTExcVhYZitNclY3YTBOTi94
bmUrWXpLTi8rTU1mdi91ZHIvUEVFQnQ3VFV2NlJPOThjbFF5UnhFbCt0WDJU
U2ExdTNYSXNmYy83NTgzbDVldFdtU1V6MmYyQ3JHZzNEQjVtUm8yT2pZZWZl
YTVqOTZQNHN6S3JubGZmSDE3ODhEdXcxZi84SUhuL25RSjQvd1RSSUg1TVQ2
VEMzMmZ4Q0JOY2NyR0ZTamxRTFZPRmZOUFpGdW41ditNVHhoYm5IVE84a1hh
TUkybisvOEMwSmdRdnJ5cFlNeENXM0lhTDJDZnVHY0NvQ2NFSThjSFNjODRu
SlpaTThxS25PT3lTTHBPMlppbDhlOWdpT05aMytmZVBQem51eDQ4dVAwSkFP
M3FxNjY1OWZadm5IZm1DdEdVZ3NRUVlBcVNQaVVSTnJtOUlKZnc3cDBzY2pT
alpES0MyNEpwazZDcGc5Mmp1dzY4dlR0emNCanF5MjNuWG5IK2lxdS9ESTNu
dGJRTlBQUGtFNisrL0ZML1lEeVJKRUFiMEVoMVZkbDNmL1NMNzN6dEJxUGpT
VEJpNENvWENtYnlzU2JtTEZFNmQyWU92UzJud20rMWl2YzkxMzFOQTVEVHRI
ZEVjekIrMWRyQ1ZldG5PdGZlQUxWblVidy9jL0NGWFkrK1BkQVJHaTJvK0hl
bnAyTW9yT3V6di91SE8rLys0Um1HUVl6aC8xOWJjcnBseWhhNlV5L1RvdVpP
cWRZcE9kUlBsbjgrYlhBd1VSMzl4Q1BKbTRNN25WQk9VYXNURnhzR0Z4QTRz
TU9kcVkwZkhEOTZyR2xmZjZRL3JCa0RBekI2QkNUZFVWaXlmTlhxcXo1OXha
VVhOMVFXNUwvL2UzdUg3N3JyNFE5ZnVSOGdlZXRYdnZUTjczeC9RV005R1Ax
OFpDOUhqaVl2bUt3b2x6T1QzYi96NmEzLytHZno4ZFlkQWRBMVhGNGtuRmx2
V3Jxc3FtajVDb2xIK3o3Y2ZIQi9yR3NVV29LZ08reFhmK3I4aXo3M0ZmUGNs
VHQzSHZqdFhYZHYrbkNYb2FkbEdWNTY1YTFMejE5cjlQNFhaWUVWejBKSWRE
MytoN3BhMjdGK1MyemJTM2JkT0JLVWYvcGgybXJGdUE1aktnR0FUVVNuU1po
aEY2OWZWSGpaalJkV1gzS3BBS24wcG9kZnVtZG5NNXV4WmRIbmpuM3dRV3JF
eitmZTh0OS9mUFdLWmRaSjB6a0p3cGpqbnVYa1N2TExLZWJVSS9GL0Y1TFRa
UG16ODg5NWhPQ1Q1R2FuSm51eWloTlpsbjRjbjBzSURITkJORGx4dy9SVm12
ejRDa3dSUFBydTJGOGUzakx3MXZPZ05nRWFacE9Pc2xCZFhSdVBKNG85OHVG
RFJ3SGNqbG1mK2ZvM2IvemlwK2NuNGtsL01CNkpacm9HWXAyRDRkN3U0eCs5
OEU4d1d0ZXRPK2V2OTkyL2NzazhpTFpvSTd0UlNBc21LM25tQVNHbXVoSGhu
YjgvL050ZmY5Z0M0Q3dzY2hjVVhsQWhubDhTY3lUN1psUkI4WnBWTUh1NU50
YmoyM3VnL2VEWTdrN2NOa3hCRG9zYUtqOXp4Y1ZyYi8xWkdLMy92UC9ldSs3
NncvZC8rTE0vL2ZFMyt2Ri9NN2VITzJlSm8rOTgrSy9IVGYzSGhQS1pMNzdV
WG1DR1FBTCtPd2o5L01Sd3h4WFpPRHplQ2JET0RqZk1na3R2VytlKzloY3My
dG54Mk8vL2N1K1FkdUZsdStmZDNuN1B0MGdvK3VGOXovN3hzM1djODJrbGdD
WVFORVQvazJMTVNlUGh5Zm9YNE1kNVZYbU5aZFlsMCtxL3Fjbm4vN215Y1Jv
bk5MOWdmV3dyemFrYU9pZk8zOXJlL2NERHIrLzY2SjNFYUh0TjQ3ejE1NTU3
L2VXckswdGQ4V1NtcHFKY1pXSThsdkNOamg1dWFybi8zaWNIZXROaWNZMGVH
NFZNREVBQmlBTXdnT0RNR1hYZitiOWZmdm1HaTAycFpyWHBXZUFKY2VZNlZG
T0FPbWthcGtlMWFQQ0RmN3l5ZWJTdTR1d3JHdGF1V3JwMFNhSEhESm5oK1BE
STNvZi9HanF5WitrU2E4MlNlaWl0RisyUzFycjcrTGIyZDNZYm00WnhNRW1G
SnZqY3VmWFgvK1plKzZMTHRtemZ2YUJ4aG52NE9SQVRJSHZWN2M5MmRYWDg1
WW5oY3h1ay94eldMQUJwQXcwQkE0ekNhUnFJQTUyVXZKTTFUalF6dUxCT3VP
ZkxWWFVYMzJDVXJ4SjIvZld4dTdadWJZWHdsKzk2Ly8zZDZjTmJacDcxL1Mx
di9xVE1TdnlVdS92L0dONmRaakVKY3hKaEp5QU5wekFrbEwveThjbnF2Lzlq
UTlmL2MrajZ2OXh3U3M2RmMwTEdIbnc3L00zYmZ3Y0RENkZVc083OGkxWXZX
OXhvQ1M0MERudXRpdDBDaHFYQU5YZWQyVk1LT3U4TnNXMzdtcDU2ZWN2KzVq
NlB0NkNnMENOTFhKUmdkdDFzdDdmaSs5KzlwVFJ6UUc5K21WTlNOQ0tzcXBI
Q1FkNTdHQmxpMVFwWWZGdTR1VlVGYyttWlp3SWpBQlZJcHZneGlMVWppRW84
Nmp2VzZ0KzFwOHdWSzF1MWxEd3pRVThaM1hzQ1IzdGFteE9iT21EVENKaUF6
cDF0dnZibWErWis3cWRncStSdHo2WDJQUjFzT2lCazByL1lSSU5SR2xaQVY2
aFF4bFhWY09rUzRlY2Y2Z2Q5b1BQSjlVd2N6N2dScnFoeVB2R2JLK2VldDQ1
OGh6dWZlLzUzRHdhR0dwWkhMdnZ5MGIvK1VVazNmdjIrdXg3NCtnTERNRmhX
QldaSzRRank1RkNteWM3angzV2dmRHh5UHFlQ05kbUlpNURqSE9UVk90UEdz
MVBzNXVrem1QOVBXWlVjMENJWkJvZ2lPOXl2UGZtdlIrM3hkemJjZFBOWGJy
cThNbm8wZnVnNWp5eTRxeXZNQmNXQ2xvcDFOUjk5NklWd1NtRFZxOXZGdWZh
NkJmOTY0cCtTczlBc2NBdVB4WDFqZ1lIK2hyTXZCVzAwL3V3WGt2RmpwcUlx
TVJiVWxCUjBObXYrcUduR0xHSGh0YkQwS3dDeVozVVJTQkVqMFdrSWhXaXBR
VFZJWUJNc1phaUdaSXhVVlhOUFFEeSsxVGZXL1c3ak9mM3lqSGxDK1l3aUFF
Z2NGd3pOWVBCbVAvNm5TUWsvK1BSTnFkamkyeDRRR203cTNMNjMvZUNXc2Jq
dzNnQTNBQ0k2TmxoUTBlbk1XdFkwWnV3Wm1YYWRHUUVnakF4SDMvcmJTOVdM
MWhKYlZsanc2cG9sN0w3OVRabHpoWXJydnRUeitJdi9mdVMxYjE4eloxYXhO
QjZJWUo3NkQ1NHF6OEZFVTh5a3VEbXI4SkEzNTVvWHV2VXgzbE4rMEp0d3h4
MTNRUGJYVDNybUNVd3kwTFN0Z3BqakdFeUwxcDU0anYrcGtuZHFlM0NPb3No
MjkyUTJYUDd0OWkxL09uZkQxYis2N1hMcHZWL3FIUnZMWnhhNkswb3pvMFBx
U05kb1Q0OVBLWlhuWDFmeG1UL011ZWI3WjF5MGR0RzhFdGZBTzViT054TWZQ
WGo0bjNjOWY5YzlybmtyaTVXbTRYdXZGdU05T3RoR0QzZTJOQWY5dlRHYmFE
S2QreVdwY1RuTTNJQ29VK29ZSU9lR0JTeXpCVk1sQlBhTFlrZ3dTeEFQS09t
RUpGdkI2cFl0RENQKzRaWVlaVkxlMmRYZ2JlU3lYYzFFQTc0a2orcHVDVHZT
Y0NSTUJiRytHbFBFVWI5SW1uUGg5cGFldjd6VjR1ZVlBYkZVQmhHbzNvbmxM
cmh6TjJXTUNUU05rRFZ4REdDOFR6dUZ3aUtMc3JZeTVGaC9nOUt4TytVYjNO
bUozZlo1VkZFaEI4ZGlQbFl5YjlINmVXNkRFOE5jMENKT1dQT0pmQVZtdzdZ
bTlBaE9JSE5QK0dCWnFkOWMrQm1jekE3aXRObm1rNFdQUEVzdVRoRytYT3dy
VGx0ZW52dys0bVJoenhPMDRrUmE2R01MSlJNRHdKT0FFVHpTcDJ6NDFIZkR6
VS8vK0pkLys5YTFxME12ZlkvcHZ0MFIrMy92UGxnblpicEdPTnJ3UjNmK2J2
Vk4vMmN4STBTT1FIU1RFVXBocEEwaUhkcEllK3pJd2JZbWZkM1h2cjJxZUN6
NDZGL2I0MEl3d2lnMlpDOFFLOTI4ZHRrQ3o0M2Z4MFE3V2EzRWZUdzZ5cXd6
eVR5SG1Nd01sZHFlRktsL1pGZjRYLy9kMzNLOGEyMXBadG1hV2M2YWVhV0Zi
dStLbFRYaHJVUHRZZnNIVzByUDVrTDFjdStGeFV2TDl0amYzVzg1bm9ybzhN
b3cvbWxYSmhsNDVNYWo3elhjL3ZkdjNmOWMzUDZWdXg3NEQ5ZTRRbVRpVUZN
SWJ3eFFJRDBlbndFQ0NJaG1oQXduUW1BRUlvSkdZQURvQm45dEZMOGVHU2xR
T3NUR3RjYmJlMERRN1UxdmhoZmNLUnNwVnVBOEdMSmtkREFKU0xtSTdXeW94
NGs4M3drdE54WG9oOWtsbFBFRnkzTHNwc0JWSjJLT1NUSEtoR3hNcDNERUhO
VTgzaVF5RFN4dmFqNzlaRUY2UXV3SVRzSXhjb2VEMlczaE9NbW80OGNRREp5
VTVHQWNydi9pUGRyZ1IzZmUvZmZicjc5ZzROOWZUWTBPUHJvbjl2U2hzQVlJ
UUhXejV6Nys3MmZPV2owSHVsN1FlcmN3WlZpUWJZTFZrdzZFakk0OVdpTFZQ
OFRyMXpRVWE5MnYvK0dOOXJRMDROZVdWTkU1WjFXVU9wUHU2aXBwN2FjaDNr
YVNERFkzWlFiUlBwOHNDMEVRV2FJci9NcDMxVVQ0eVE5OUQ3eldNYWlEQ2VB
dEFRcmVEdFk0ZGw4eTMzek5sUXM5czhzN095TWZiWTFzcU82MGw4d2tzOHRh
WE5pd3hDT0FGbFMxakVIYmd2aFJVRmpSMGxleTZTK0ZoUlhmKy9xM2V0cGFY
LzN3VUZxbFFvbDNSbWhIY0J5UVFRQWdBSGdFc2pBSTZraEV3SkNJVEF6U0hB
UUc2UXdkYkZlcW1ReVU4aVV4dzRUVVdNREV6SWs1YTNEamV6SjhYUWN3QXhG
TzZ2N0ViRW1jYXFFK0hvQTVIU0oxc3VhYjFPZUJrQ05UT1JrYWNUS01LdWVy
cDFXcTR6NEQ0VW1zL3NudnlXMmVPYldEOEZSblNaYUtwVHhvNzBsQXJ5eFFr
eUFJMy8vdEs4Yy9lcWgrNGJ6NVN4WjN2dkxIWVBQT1p3OW1ubTVKaWdJRGcx
LzNtYXNlKzllL0lydGYrZUNMbDgveUJnckwzQWJLU2pBWTk2ZjcrbzJJQWg0
bmpDWmg2R2gvMzN2SE9lS2lTdTNpRlFWTEwxcHB4aFF2S3NHcVJxN29ZSEdo
MVVXa29HMHgySmN4UGdxQlkvdnUrczZlcmMwdkRRaGJSZ3dBSm9tSVJEYUJy
Q0oySnVEQXNMcndVT3ZxdVM1UHFiazNrTzQ4UEx4a1dad3NIaTQ1VTl5YTBk
RWlZYkZFYTkxMElHbzhmWlJWT2JmSytDM0xwVCsvN1h1LzJIWHN5KzA5bzVJ
Smo0VWhySnhBVVFvQWhTSlVXd0FSbUVLR0FTcVN3a0ZDa0FCaVJLc3FrTVdE
a0JnR2toV1ZtM1dlWUZZaEdCWnE1eHVXclllMjdZU3ZYa2Q4WXBVeFQrUHdp
WklCVFdtUXloSVB6QXB2Y1FLcmtMKytoZFBXOFNhRndLZnlrSWduNVc5cThU
NG5pNWN2bllTWUN6K2RFbzFnanNOd1VrUGo1QTlOaXJaT2dWbXl2dEl3dUNn
SzI0K0ZuM3I0Q1REek0yLzcwUkozN0krUFBkWTVsTncwQnBJa2FwcCt3MmMv
Lysxck56ejJoNSs5ZS8rRGE0dEJuNDJXOXBIV1FkZzlKcXd1cDlXVjJCR0U5
akRzSEFXSnA2NmFqMmV2Y3BmTjhzS3lpNDBvTnp4RmFEY1JDT0FvQkRBSURM
QTJnSDBwR3YzeGJYL1o4ZEN6cjN3VWVEZUMvYW9oQ0V3Z3NDRjVKZkRLVUNK
VG9ZWE1Hb1Q2VWpUSDVpNlFQSTcwd0VCeVp0K2dZMEU1ZDVmYlp5OHFDOFFI
Ujhlc1lSQXlWR3Vob1JUOWVTZGVHOXEyTHZLMU5kOTk3dFhuSHJybDF1KzJk
UXdTR2VNT0hnQllHVlNZUUVhd2lTQURwSFZJRWFnY1JFUk9GRkZBdExLYVlx
dVI4SXNPRHdPVFRWU2syQ0Q1eHJEYXhVRnUyN1B2NE1pMTY4dVlZVUEyRERG
ck9iS0VEdk9ndUNHUEVxS3MvalU4S1c4MHFkMHViMkE5RFJuT0NYa1ZKN21T
K1dUaTR6QTUyVitWcmRob3dvL0YzRnZrR3ZrSkQ0U3k0Wk81NDNya3FUMDhr
aTY0N0tkRkdEcm5zcTlFTlBmNjlSdHVzdHErZE91WExaQmFVTzlWbWw0TURM
OTI4eVhlT2ljNWhiaTl5RlpWbUcxWkx4dTBXbzM2alY0dm9uY2JyanowK2Fh
dVhYSkJFc3R2TUpTVklvRjQ2UWtPa2cyRUVSRVJ0YWxZSm5QOU03NEM5Lzk3
eVB2UDdLWDk1SjVVQmNST1JrNmlNaUJOREpTT2cwYW9BSE9kME02YVF5MEJj
b3F6VVdGd3VFT3JlbnQ3V2RVVkdESmZMbkFWenFuc25JZ2NtUW9MVEVRQmJB
UmhCVjZ1MU9RcGI2VnJwODBYdmVUSDkxNitkZC9mTzl3aGdrTURVNEFZQk1n
cG9IR29jNE9jUTFpREt5QWFSME1Ub0JnVnNCQVBtZDVQVmtxNUhETFNGSUlx
eUF6blFlR0xPZXZpUE9JTm5CODk2R2g5V1dWbkF4Mm9oUk9VNXkyVTNpK0tV
SGx1QXFnYkhlZnBtWm1NQTkyTlFmL011VWorYjBzRWZLM3JVK0pXU2ViK2V4
R2tGT2c2a24rS2VGRUZISUtjRHVsSm94WjJ1K2t4VDRKUHdRaUVBUVdTdkwz
QWlVNDl6eTkvL0I5UDN5M1lkYXNSLzc4aC9QT1h3OXFINHdkQmtFekJsODN1
ZW44ODJya3lEQzZIVWJFbHc1RjBjV3VQNzlBYzNyMFJHSnNuODlUS1A3cUYr
dE10WFA4dmVGOXpjTVgzYlNHRWdHdzJwQm55TWlRVklpbVlqSlhrVlNNOFVP
WlE0Kys5L0pIOTdaWTJneEtpalBBVlNwb293N1pzSkRDakZSU1N4bEd4c20w
a1RSWUJMQkwwTnFuRzFyU0pLSFpoTkhSUkdiUE82WVZISkxoeE1pd29tb2VD
L2dTWU5laFdJWW93VUNHSC9MQnJEMmJ2QTY2OHFaZmFwbkViZi8zcjdDQkRJ
RVJKQTBJY0RqVEExNHpjQWFNZ1pWQlhLRU13YUFLMVRMT0xBRHp2Q1U4N2N1
MDdScExwVWNWRkFWZFM4V2R0aUpvckE0ZENtM2YwZlNqU3l2WmFTSzZVOHVN
K1d0a3A2VXRJQ0NjMG42YVAzK1NLOW01d25ySy9tS2VVSlltTkZWT2cyVjJG
VEVyT3MyaEc4cDFJN0pDWUNKQ21OeDJsTnZDaGxrcEtBQUFEc0FBRGtXdzRl
eVpxVjBQeDQ0Kzkra2JibjN4NlQ4SnpPRHhneXk4RmF6MVVIaVdVRllCYWxp
Y3V4SjZqbXFqUFZpM1ZCN3FQUGhoUjhQbmJuYlUxY1hmZWViWGI0Lzk1cDRy
cFhWWDYxeDk1cmQzRmxWNG1hTkFwMklCTTBBWlFJblpWaEV6TWZCQjZIWGxv
MGRmZStEREgrKzI5U2tpYzg3RDhqTWhxUXJjeUdpaGpJQlczYWRxVFJFTk1n
SVdDZXBRZ2t3TVlocUtFaFJiS1pHa0FMSkF4MmlSYmJNOFl3a1dWNEtIcDJp
czFzWFBtaTFZQk5SVnZUMUk3WDc0NnhaMnh1aTJxNXlQWGZPREgxYklvUy9l
OFdwN1ZFQTBVaHdxVGJERUNZUlFZQUszQkVWbThscGhqdzhHUXV6eUdyNWlR
UVVWVlNoTk81dTJOa2NTRkFXVFNVU1dpbXVEWVh1Vkp6VGk2UnlNWndETURE
aWNDS2luS2YrUHcxSnlUTkprUmdYTWRjQk9tTFBUcHl6d1kxb0VzeVJhbkpx
VXg=
`;

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
  const safe = String(report.description || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g,"<br>");
  await smtpTransport().sendMail({
    from: process.env.SMTP_USER, to: NOTIFY_EMAIL,
    subject: `🏒 Grizzlys U15 – neue Fehlermeldung (${report.area || "Sonstiges"})`,
    text,
    attachments: [{ filename: "grizzlys-bug-icon.png", content: Buffer.from(Buffer.from(BUG_ICON_BASE64, "base64").toString("utf8"), "base64"), cid: "grizzlys-bug-icon", contentType: "image/png", contentDisposition: "inline" }],
    html: `<div style="font-family:Arial,sans-serif;color:#111;max-width:700px"><img src="cid:grizzlys-bug-icon" alt="Grizzlys Fehler" width="220" style="display:block;margin:0 0 18px"><h2>Neue Fehlermeldung in der Grizzlys-U15-App</h2><p><b>Name:</b> ${report.name || "Nicht angegeben"}<br><b>Bereich:</b> ${report.area || "Sonstiges"}<br><b>Version:</b> ${report.appVersion || "?"}<br><b>Plattform:</b> ${report.platform || "?"}<br><b>Push beim Nutzer:</b> ${report.pushRegistered ? "aktiv" : "nicht registriert"}</p><p><b>Fehlerbeschreibung:</b></p><p>${safe}</p>${report.contact ? `<p><b>Rückfrage-Kontakt:</b> ${report.contact}</p>` : "<p>Kein Rückfrage-Kontakt angegeben.</p>"}</div>`
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
  console.log("Bug-Push: Admin-Token gefunden:", candidates.length);
  if (!candidates.length) return false;
  const tokens = candidates.map(d => d.token);
  const title = "🏒 Neue Grizzlys-Fehlermeldung";
  const body = `${report.area || "Sonstiges"}: ${(report.description || "").slice(0,100)}`;
  const response = await messaging.sendEachForMulticast({
    tokens,
    data: { type:"bugReport", reportId:report.id || "", title, body },
    webpush: {
      fcmOptions:{ link:"https://jazm1309.github.io/grizzlys-u15/" }
    }
  });
  for (let i=0;i<response.responses.length;i++) {
    const result=response.responses[i];
    if (!result.success) {
      const code=result.error?.code || "";
      if (code.includes("registration-token-not-registered") || code.includes("invalid-registration-token")) await db.collection("pushTokens").doc(tokens[i]).delete().catch(()=>{});
    }
  }
  console.log("Bug-Push Ergebnis:", { successCount: response.successCount, failureCount: response.failureCount });
  return response.successCount > 0;
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
  if (reports.length) console.log("Bug-Notifier: Admin-Push-Token werden beim Versand geprüft.");
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
      }catch(error){ console.error("E-Mail-Versand fehlgeschlagen:",error.message); }
    }
    if(pushSent && emailSent){
      await STATE_REF.set({lastProcessedAt:admin.firestore.Timestamp.fromMillis(report._createdMs),lastProcessedReportId:report.id,updatedAt:admin.firestore.FieldValue.serverTimestamp()},{merge:true});
    }
  }
}
main().catch(error=>{console.error(error);process.exit(1);});
