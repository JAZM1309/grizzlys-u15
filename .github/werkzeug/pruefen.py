#!/usr/bin/env python3
"""Lesbarkeitsprüfung der Grizzlys-App.

Öffnet jede Seite (Start, Spielplan, Gegner, Regeln, Downloads, Einstellungen, Info, Admin-Bereich)
in allen sechs Design-Kombinationen (normal/dunkel, Halloween hell/dunkel, Weihnachten hell/dunkel)
in einem unsichtbaren Browser und misst bei jedem Text den Kontrast zum tatsächlich sichtbaren
Hintergrund (aus dem Bildschirmfoto, damit auch Bilder und Verläufe zählen).

Aufruf:  python3 pruefen.py ORDNER_MIT_DER_APP  BERICHTSORDNER
Rückgabe: 0 = alles gut, 1 = nur Hinweise, 2 = schlecht lesbare Stellen gefunden
"""
import sys, os, re, json, threading, functools, http.server, statistics
from PIL import Image, ImageDraw

APP, OUT = os.path.abspath(sys.argv[1]), os.path.abspath(sys.argv[2])
os.makedirs(OUT, exist_ok=True)
for f in os.listdir(OUT):
    if f.endswith(".png") or f == "bericht.txt":
        os.remove(os.path.join(OUT, f))

STARK, HINWEIS = 2.0, 3.0   # Kontrast unter 2,0 = kaum lesbar, unter 3,0 = schwach
DESIGNS = [("normal", ""), ("dunkel", "dark"), ("halloween-hell", "hw"), ("halloween-dunkel", "hw dark"),
           ("weihnachten-hell", "xm"), ("weihnachten-dunkel", "xm dark")]
SEITEN = ["home", "schedule", "opponents", "rules", "downloads", "settings", "info", "admin"]
NAMEN = {"home": "Start", "schedule": "Spielplan", "opponents": "Gegner", "rules": "Regeln", "downloads": "Downloads",
         "settings": "Einstellungen", "info": "Info", "admin": "Admin-Bereich"}

# Firebase wird nicht wirklich angesprochen: kleine Ersatz-Module (es wird nichts gelesen oder geschrieben)
ADMIN = "q6AID4Wkp2arQlCTROTKqON6ckk2"
STUBS = {
 "firebase-app.js": "export const initializeApp=()=>({});",
 "firebase-auth.js": "const U={uid:'%s'};const A={currentUser:U,authStateReady:async()=>{}};export const getAuth=()=>A;export const onAuthStateChanged=(a,cb)=>setTimeout(()=>cb(U),20);export const signInWithEmailAndPassword=async()=>({user:U});export const signOut=async()=>{};" % ADMIN,
 "firebase-firestore.js": "export const getFirestore=()=>({});export const collection=(d,n)=>({n});export const doc=()=>({});export const setDoc=async()=>{},addDoc=async()=>{},updateDoc=async()=>{},deleteDoc=async()=>{};export const serverTimestamp=()=>null;export const query=(...a)=>a[0];export const where=()=>({});export const orderBy=()=>({});export const limit=()=>({});export const onSnapshot=()=>()=>{};export const getDoc=async()=>({exists:()=>false,data:()=>({})});export const getDocs=async()=>({docs:[],size:0,empty:true,forEach:()=>{}});",
 "firebase-messaging.js": "export const getMessaging=()=>({});export const getToken=async()=>'';export const deleteToken=async()=>true;export const onMessage=()=>{};export const isSupported=async()=>false;",
 "firebase-functions.js": "export const getFunctions=()=>({});export const httpsCallable=()=>async()=>({data:{}});",
}

# Im Browser: alle sichtbaren Texte mit Farbe, Größe und Lage einsammeln
SAMMELN = r"""() => {
  const out = [];
  const vis = el => { for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.display === 'none' || cs.visibility === 'hidden' || n.hidden) return false;
      if (n.getAttribute('aria-hidden') === 'true') return false; } return true; };
  const opac = el => { let o = 1; for (let n = el; n && n.nodeType === 1; n = n.parentElement) o *= parseFloat(getComputedStyle(n).opacity || 1); return o; };
  const path = el => { const p = []; for (let n = el; n && n.nodeType === 1 && p.length < 4; n = n.parentElement) {
      let s = n.tagName.toLowerCase(); if (n.id) { s += '#' + n.id; p.unshift(s); break; }
      const c = [...n.classList].slice(0, 2).join('.'); if (c) s += '.' + c; p.unshift(s); } return p.join(' > '); };
  for (const el of document.querySelectorAll('body *')) {
    if (['SCRIPT','STYLE','SVG','PATH','OPTION','TITLE','NOSCRIPT'].includes(el.tagName.toUpperCase())) continue;
    if (el.closest('.testRibbon,svg,.hwScare,.hwScareDim')) continue;
    const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').replace(/\s+/g, ' ').trim();
    if (own.length < 2 || !/[A-Za-zÄÖÜäöü0-9]/.test(own)) continue;
    if (!vis(el)) continue;
    const cs = getComputedStyle(el);
    if (cs.webkitTextFillColor && /rgba\(.*,\s*0\)$/.test(cs.webkitTextFillColor)) continue;   // Verlaufsschrift
    const o = opac(el); if (o < 0.35) continue;                                                  // bewusst blasse Deko
    const r = el.getBoundingClientRect(); if (r.width < 4 || r.height < 6) continue;
    // verdeckt? (z. B. unter einem offenen Fenster) – Mittelpunkt muss zu diesem Element gehören
    const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    if (!top || !(top === el || el.contains(top))) continue;
    out.push({t: own.slice(0, 60), x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height,
      c: cs.webkitTextFillColor && cs.webkitTextFillColor !== 'rgba(0, 0, 0, 0)' ? cs.webkitTextFillColor : cs.color,
      o, fs: parseFloat(cs.fontSize), fw: parseInt(cs.fontWeight) || 400, p: path(el)});
  }
  return out;
}"""

def rgba(s):
    v = [float(x) for x in re.findall(r"[\d.]+", s)]
    return (v + [1.0])[:4] if len(v) >= 3 else [0, 0, 0, 1]

def lum(c):
    def ch(v):
        v /= 255
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    return 0.2126 * ch(c[0]) + 0.7152 * ch(c[1]) + 0.0722 * ch(c[2])

def kontrast(a, b):
    la, lb = sorted([lum(a), lum(b)], reverse=True)
    return (la + 0.05) / (lb + 0.05)

def hintergrund(img, it, tc):
    x0, y0 = max(0, int(it["x"])), max(0, int(it["y"]))
    x1, y1 = min(img.width, int(it["x"] + it["w"])), min(img.height, int(it["y"] + it["h"]))
    if x1 - x0 < 3 or y1 - y0 < 3:
        return None
    px = list(img.crop((x0, y0, x1, y1)).resize((min(60, x1 - x0), min(20, y1 - y0))).get_flattened_data())
    d = lambda p: sum((p[i] - tc[i]) ** 2 for i in range(3)) ** .5
    fern = [p for p in px if d(p) > 60]
    wahl = fern if len(fern) >= len(px) * 0.25 else px          # kaum andere Farben → Hintergrund ≈ Schriftfarbe
    return tuple(statistics.median(p[i] for p in wahl) for i in range(3))

def main():
    from playwright.sync_api import sync_playwright
    class H(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(H, directory=APP))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    url = "http://127.0.0.1:%d/index.html" % srv.server_address[1]
    funde, zaehl = [], 0
    with sync_playwright() as p:
        b = p.chromium.launch()
        for dname, cls in DESIGNS:
            ctx = b.new_context(viewport={"width": 412, "height": 900}, device_scale_factor=1, service_workers="block")
            def route(r):
                n = r.request.url.split("?")[0].split("/")[-1]
                if n in STUBS: r.fulfill(body=STUBS[n], content_type="text/javascript", headers={"Access-Control-Allow-Origin": "*"})
                elif "fonts.g" in r.request.url: r.continue_()
                else: r.abort()
            ctx.route(re.compile(r"^https?://(?!127\.0\.0\.1)"), route)
            ctx.add_init_script("try{localStorage.setItem('grizzlysHwScare','off');localStorage.setItem('grizzlysHalloween','off');localStorage.setItem('grizzlysXmas','off')}catch(e){}")
            pg = ctx.new_page()
            fehler = []
            pg.on("pageerror", lambda e: fehler.append(str(e)[:200]))
            pg.goto(url, wait_until="load"); pg.wait_for_timeout(1500)
            pg.add_style_tag(content="*,*::before,*::after{animation:none!important;transition:none!important}.gdSplash,.updateBanner,.hwScare,.hwScareDim{display:none!important}")
            for seite in SEITEN:
                pg.evaluate("""([cls,seite])=>{const h=document.documentElement;h.classList.remove('dark','hw','xm');cls.split(' ').filter(Boolean).forEach(c=>h.classList.add(c));
                  try{window.xmRefresh&&window.xmRefresh()}catch(e){}
                  document.querySelectorAll('.matchModal,.adminModal').forEach(m=>{if(m.id!=='adminModal'){m.hidden=true}});
                  const am=document.getElementById('adminModal'); if(am){am.hidden=true}
                  if(seite==='admin'){showView('settings');if(am){am.hidden=false;am.setAttribute('aria-hidden','false')}}
                  else showView(seite);
                  if(seite==='schedule'){const t=document.querySelector('.pastToggle');if(t&&!t.classList.contains('open'))t.click()}
                  window.scrollTo(0,0)}""", [cls, seite])
                pg.wait_for_timeout(500)
                # ganze Seite auf einmal sichtbar machen, damit Verdeckung und Bildschirmfoto übereinstimmen
                hoch = min(12000, pg.evaluate("()=>Math.max(document.documentElement.scrollHeight,innerHeight)"))
                pg.set_viewport_size({"width": 412, "height": hoch}); pg.wait_for_timeout(400)
                items = pg.evaluate(SAMMELN)
                shot = os.path.join(OUT, "_tmp.png")
                pg.screenshot(path=shot)
                pg.set_viewport_size({"width": 412, "height": 900})
                img = Image.open(shot).convert("RGB")
                schlecht = []
                for it in items:
                    zaehl += 1
                    c = rgba(it["c"]); bg = hintergrund(img, it, c)
                    if bg is None: continue
                    a = c[3] * it["o"]
                    tc = tuple(c[i] * a + bg[i] * (1 - a) for i in range(3))
                    k = kontrast(tc, bg)
                    if k < HINWEIS:
                        schlecht.append((k, it, tc, bg))
                if schlecht:
                    dr = ImageDraw.Draw(img)
                    for k, it, tc, bg in schlecht:
                        dr.rectangle([it["x"] - 2, it["y"] - 2, it["x"] + it["w"] + 2, it["y"] + it["h"] + 2], outline=(255, 0, 0) if k < STARK else (255, 170, 0), width=3)
                        funde.append({"design": dname, "seite": NAMEN[seite], "k": round(k, 2), "text": it["t"], "wo": it["p"],
                                      "schrift": "#%02x%02x%02x" % tuple(int(v) for v in tc), "grund": "#%02x%02x%02x" % tuple(int(v) for v in bg)})
                    img.save(os.path.join(OUT, "%s_%s.png" % (dname, seite)))
                os.remove(shot)
            if fehler:
                funde.append({"design": dname, "seite": "-", "k": 0, "text": "Skriptfehler: " + fehler[0], "wo": "", "schrift": "", "grund": ""})
            ctx.close()
        b.close()
    srv.shutdown()

    # gleiche Stelle (Design + Seite + Element) nur einmal melden, mit Anzahl
    gruppen = {}
    for f in funde:
        key = (f["design"], f["seite"], f["wo"].split(" > ")[-1] if f["wo"] else f["text"])
        g = gruppen.setdefault(key, dict(f, n=0)); g["n"] += 1
        if f["k"] < g["k"]: g.update(f, n=g["n"])
    stark = [g for g in gruppen.values() if g["k"] < STARK]
    schwach = [g for g in gruppen.values() if STARK <= g["k"] < HINWEIS]
    z = ["LESBARKEITSPRÜFUNG", "=" * 60,
         f"Geprüft: {len(SEITEN)} Seiten × {len(DESIGNS)} Designs, {zaehl} Textstellen.",
         f"Kaum lesbar (Kontrast unter {STARK}): {len(stark)} Stellen", f"Schwach (Kontrast {STARK}–{HINWEIS}): {len(schwach)} Stellen", ""]
    for titel, liste in (("KAUM LESBAR – bitte beheben", stark), ("SCHWACH – bei Gelegenheit ansehen", schwach)):
        if not liste: continue
        z += [titel, "-" * 60]
        for f in sorted(liste, key=lambda f: (f["design"], f["seite"], f["k"])):
            z.append(f'{f["design"]:19s} {f["seite"]:13s} Kontrast {f["k"]:4.2f}  „{f["text"]}“' + (f'  ({f["n"]}×)' if f["n"] > 1 else ""))
            if f["wo"]: z.append(f'{"":34s}Schrift {f["schrift"]} auf {f["grund"]}  ({f["wo"]})')
        z.append("")
    if funde:
        z.append("Bilder mit markierten Stellen (rot = kaum lesbar, orange = schwach) liegen im selben Ordner.")
    open(os.path.join(OUT, "bericht.txt"), "w", encoding="utf-8").write("\n".join(z) + "\n")
    print("\n".join(z[:6]))
    sys.exit(2 if stark else 1 if schwach else 0)

if __name__ == "__main__":
    try:
        main()
    except SystemExit:
        raise
    except Exception as e:          # Technischer Fehler → eigener Rückgabewert, damit er nicht als "Hinweise" gilt
        import traceback; traceback.print_exc()
        print("Prüfung abgebrochen:", e, file=sys.stderr)
        sys.exit(3)
