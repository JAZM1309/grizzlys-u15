#!/usr/bin/env python3
"""Macht aus der Testversion (index.html + sw.js) die Live-Version.

Entfernt Test-Balken, Test-Titel, Test-Sperren (nichts speichern / kein Push) und schaltet
Google Analytics wieder ein. Die Cache-Nummer wird von "grizzlys-u15-test-vNN" zu "grizzlys-u15-vNN".

Aufruf: python3 tolive.py TEST_index.html LIVE_index.html TEST_sw.js LIVE_sw.js
Bricht mit einer Meldung ab, wenn eine erwartete Stelle fehlt – dann lieber nichts veröffentlichen.
"""
import sys, re

src, dst, swsrc, swdst = sys.argv[1:5]
s = open(src, encoding="utf-8").read()


def stopp(was):
    sys.exit("FEHLER beim Umwandeln nach Live: " + was + "\n"
             "Die Testversion hat nicht den erwarteten Aufbau. Es wurde nichts verändert.")


def ersetze(alt, neu, was):
    global s
    n = s.count(alt)
    if n != 1:
        stopp(f"{was} ({n}× gefunden statt 1×)")
    s = s.replace(alt, neu)


ersetze('<meta name="theme-color" content="#e8760a">', '<meta name="theme-color" content="#071b33">', "Test-Farbe der Statusleiste")
ersetze('<title>TEST – Grizzlys U15</title><script>window.GRIZZLYS_TEST=true</script>\n', '<title>ESV Grizzlys U15</title>\n', "Test-Titel")
ersetze('eingebunden -->\n\n<script>', 'eingebunden -->\n<script async src="https://www.googletagmanager.com/gtag/js?id=G-WJ539PL04L"></script>\n<script>', "Google-Analytics-Skript")
ersetze('  /* Test: kein Analytics */', '  gtag("config", "G-WJ539PL04L");', "Google-Analytics-Einstellung")
ersetze('.testRibbon{position:sticky;top:0;z-index:70;background:#e8760a;color:#fff;text-align:center;font:800 12px/1 system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;padding:7px 8px}\n', '', "Stil des Test-Balkens")
m = re.findall(r'<body><div class="testRibbon" role="note">Test [0-9.]+ · nichts wird gespeichert</div>', s)
if len(m) != 1:
    stopp("Test-Balken")
s = s.replace(m[0], '<body>')
ersetze('setDoc as _setDoc, addDoc as _addDoc, updateDoc as _updateDoc, deleteDoc as _deleteDoc,', 'setDoc, addDoc, updateDoc, deleteDoc,', "Speicher-Sperre (Import)")
s = s.replace('deleteToken as _deleteToken', 'deleteToken')
ersetze('getToken as _getToken,', 'getToken,', "Push-Sperre (Import)")
m = re.findall(r'\n/\* TESTVERSION:[^\n]*\nconst _testBlock=[^\n]*\nconst setDoc=_testBlock[^\n]*\n', s)
if len(m) != 1:
    stopp("Block der Test-Sperren")
s = s.replace(m[0], '')
for rest in ('class="testRibbon"', 'window.GRIZZLYS_TEST=true', 'const _testBlock'):
    if rest in s:
        stopp("Test-Rest übrig: " + rest)
open(dst, "w", encoding="utf-8").write(s)

w = open(swsrc, encoding="utf-8").read()
if w.count('"grizzlys-u15-test-v') != 1:
    stopp("Cache-Name im sw.js")
open(swdst, "w", encoding="utf-8").write(w.replace('"grizzlys-u15-test-v', '"grizzlys-u15-v'))
