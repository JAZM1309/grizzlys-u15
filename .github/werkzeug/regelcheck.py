#!/usr/bin/env python3
"""Regelprüfung (ab 1.40.0): Jede Mannschaft aus APP_CFG.teams (index.html) muss in den Firestore-Regeln
bei Fan-Tipp (fanTips) und News (news) erlaubt sein. Aufruf: python3 regelcheck.py ORDNER
Rückgabe: 0 = in Ordnung, 1 = Mannschaft fehlt, 3 = Prüfung nicht möglich."""
import re, sys, os
d = sys.argv[1] if len(sys.argv) > 1 else "."
try:
    html = open(os.path.join(d, "index.html"), encoding="utf8").read()
    rules = open(os.path.join(d, "firestore.rules"), encoding="utf8").read()
except Exception as e:
    print("Dateien nicht lesbar:", e); sys.exit(3)
m = re.search(r"window\.APP_CFG\s*=\s*\{(.*?)\n\};", html, re.S)
if not m:
    print("APP_CFG nicht gefunden"); sys.exit(3)
keys = re.findall(r"(?<![A-Za-z0-9_])([A-Za-z0-9]+)\s*:\s*\{\s*name\s*:", m.group(1))
keys = list(dict.fromkeys(keys))
if not keys:
    print("Keine Mannschaften erkannt"); sys.exit(3)
fehlt = []
for coll in ("fanTips", "news"):
    i = rules.find("match /%s/" % coll)
    if i < 0:
        print("Abschnitt %s fehlt in den Regeln" % coll); sys.exit(1)
    j = rules.find("match /", i + 10); block = rules[i:j if j > 0 else len(rules)]
    for k in keys:
        if '"%s"' % k not in block: fehlt.append("%s (in %s)" % (k, coll))
if fehlt:
    print("In firestore.rules fehlt: " + ", ".join(fehlt)); sys.exit(1)
print("ok", ",".join(keys)); sys.exit(0)
