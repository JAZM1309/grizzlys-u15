#!/usr/bin/env python3
"""Startprüfung beim „Live gehen“ (ab 1.39.0).

Startet die fertig umgewandelte Live-App in einem Browser (ohne Service Worker, ohne Statistik)
und meldet JavaScript-Fehler. Aufruf: python3 startcheck.py APP-ORDNER [BILD-ORDNER]
Rückgabe: 0 = startet fehlerfrei, 1 = Fehler gefunden, 3 = Prüfung konnte nicht laufen.
"""
import sys, os, threading, functools, http.server, socketserver, time

ordner = os.path.abspath(sys.argv[1]); bilder = sys.argv[2] if len(sys.argv) > 2 else ""
try:
    from playwright.sync_api import sync_playwright
except Exception as e:
    print("Playwright fehlt:", e); sys.exit(3)

class Leise(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass

try:
    srv = socketserver.TCPServer(("127.0.0.1", 0), functools.partial(Leise, directory=ordner))
    port = srv.server_address[1]
    threading.Thread(target=srv.serve_forever, daemon=True).start()
except Exception as e:
    print("Webserver ließ sich nicht starten:", e); sys.exit(3)

fehler = []
try:
    with sync_playwright() as p:
        b = p.chromium.launch()
        for teams, name in (('["A","B","U13"]', "alle"), ('["U13"]', "eine")):
            ctx = b.new_context(viewport={"width": 400, "height": 860}, service_workers="block")
            ctx.add_init_script("try{localStorage.setItem('grizzlysConsent','denied');localStorage.setItem('grizzlysTeams','" + teams + "')}catch(e){}")
            pg = ctx.new_page()
            pg.on("pageerror", lambda e, n=name: fehler.append(f"[{n}] {e}"))
            pg.goto(f"http://127.0.0.1:{port}/index.html", wait_until="domcontentloaded", timeout=30000)
            pg.wait_for_timeout(6000)
            ok = pg.evaluate("typeof showView==='function' && Array.isArray(window.SPIELPLAN) && window.SPIELPLAN.length>0")
            if not ok:
                fehler.append(f"[{name}] App-Code oder Spielplan nicht geladen")
            for v in ("schedule", "opponents", "settings", "home"):
                try:
                    pg.evaluate(f"showView('{v}')"); pg.wait_for_timeout(400)
                except Exception as e:
                    fehler.append(f"[{name}] Ansicht {v}: {str(e)[:120]}")
            if bilder and name == "alle":
                os.makedirs(bilder, exist_ok=True); pg.screenshot(path=os.path.join(bilder, "startpruefung.png"))
            ctx.close()
        b.close()
except Exception as e:
    print("Browser-Prüfung lief nicht:", str(e)[:200]); sys.exit(3)
finally:
    srv.shutdown()

if fehler:
    for f in fehler[:5]: print(f[:240])
    sys.exit(1)
print("ok"); sys.exit(0)
