#!/usr/bin/env python3
"""Macht aus der Testversion die Live-Version.

Entfernt Test-Balken, Test-Titel, Test-Sperren (nichts speichern / kein Push) und schaltet
Google Analytics wieder ein. Die Cache-Nummer wird von "grizzlys-u15-test-vNN" zu "grizzlys-u15-vNN".

Ab 1.39.0 liegt der App-Code in eigenen Dateien (app.css, js/app.js, js/app-daten.js). Die Test-Sperren
können darum in index.html ODER in diesen Dateien stehen – jede Stelle muss insgesamt genau einmal
vorkommen. Ältere Stände (alles in index.html) funktionieren weiter.

Aufruf: python3 tolive.py TEST_index.html LIVE_index.html TEST_sw.js LIVE_sw.js
Bricht mit einer Meldung ab, wenn eine erwartete Stelle fehlt – dann lieber nichts veröffentlichen.
"""
import sys, re, os

src, dst, swsrc, swdst = sys.argv[1:5]
SRC_DIR, DST_DIR = os.path.dirname(os.path.abspath(src)), os.path.dirname(os.path.abspath(dst))
EXTRA = ["app.css", "js/app.js", "js/app-daten.js"]   # ab 1.39.0

files = {"index.html": open(src, encoding="utf-8").read()}
for f in EXTRA:
    p = os.path.join(SRC_DIR, f)
    if os.path.exists(p):
        files[f] = open(p, encoding="utf-8").read()


def stopp(was):
    sys.exit("FEHLER beim Umwandeln nach Live: " + was + "\n"
             "Die Testversion hat nicht den erwarteten Aufbau. Es wurde nichts verändert.")


def ersetze(alt, neu, was):
    treffer = [(f, t.count(alt)) for f, t in files.items() if alt in t]
    n = sum(c for _, c in treffer)
    if n != 1:
        stopp(f"{was} ({n}× gefunden statt 1×)")
    f = treffer[0][0]
    files[f] = files[f].replace(alt, neu)


def ersetze_re(muster, neu, was):
    treffer = [(f, re.findall(muster, t)) for f, t in files.items()]
    alle = [(f, m) for f, ms in treffer for m in ms]
    if len(alle) != 1:
        stopp(was)
    f, m = alle[0]
    files[f] = files[f].replace(m, neu)


ersetze('<meta name="theme-color" content="#e8760a">', '<meta name="theme-color" content="#071b33">', "Test-Farbe der Statusleiste")
# Test-Titel: „TEST – <Name>“ → „<Name>“ (ab 1.36: „Young Grizzlys“; alte Stände: „Grizzlys U15“ → „ESV Grizzlys U15“)
m = re.findall(r'<title>TEST – ([^<]+)</title><script>window\.GRIZZLYS_TEST=true</script>\n', files["index.html"])
if len(m) != 1:
    stopp(f"Test-Titel ({len(m)}× gefunden statt 1×)")
name = m[0].strip()
live_name = "ESV Grizzlys U15" if name == "Grizzlys U15" else name
files["index.html"] = files["index.html"].replace(f'<title>TEST – {m[0]}</title><script>window.GRIZZLYS_TEST=true</script>\n', f'<title>{live_name}</title>\n')
ersetze('eingebunden -->\n\n<script>', 'eingebunden -->\n<script async src="https://www.googletagmanager.com/gtag/js?id=G-WJ539PL04L"></script>\n<script>', "Google-Analytics-Skript")
ersetze('  /* Test: kein Analytics */', '  gtag("config", "G-WJ539PL04L");', "Google-Analytics-Einstellung")
ersetze('.testRibbon{position:sticky;top:0;z-index:70;background:#e8760a;color:#fff;text-align:center;font:800 12px/1 system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;padding:7px 8px}\n', '', "Stil des Test-Balkens")
ersetze_re(r'<body><div class="testRibbon" role="note">Test [0-9.]+ · nichts wird gespeichert</div>', '<body>', "Test-Balken")
ersetze('setDoc as _setDoc, addDoc as _addDoc, updateDoc as _updateDoc, deleteDoc as _deleteDoc,', 'setDoc, addDoc, updateDoc, deleteDoc,', "Speicher-Sperre (Import)")
for f in files:
    files[f] = files[f].replace('deleteToken as _deleteToken', 'deleteToken')
ersetze('getToken as _getToken,', 'getToken,', "Push-Sperre (Import)")
ersetze_re(r'\n/\* TESTVERSION:[^\n]*\nconst _testBlock=[^\n]*\nconst setDoc=_testBlock[^\n]*\n', '', "Block der Test-Sperren")
for f, t in files.items():
    for rest in ('class="testRibbon"', 'window.GRIZZLYS_TEST=true', 'const _testBlock'):
        if rest in t:
            stopp(f"Test-Rest übrig in {f}: " + rest)

open(dst, "w", encoding="utf-8").write(files["index.html"])
for f in EXTRA:
    if f in files:
        out = os.path.join(DST_DIR, f)
        os.makedirs(os.path.dirname(out), exist_ok=True)
        open(out, "w", encoding="utf-8").write(files[f])

w = open(swsrc, encoding="utf-8").read()
if w.count('"grizzlys-u15-test-v') != 1:
    stopp("Cache-Name im sw.js")
open(swdst, "w", encoding="utf-8").write(w.replace('"grizzlys-u15-test-v', '"grizzlys-u15-v'))
