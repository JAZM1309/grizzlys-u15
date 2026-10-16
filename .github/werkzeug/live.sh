#!/usr/bin/env bash
# Live gehen / Live zurücksetzen / Veröffentlichung neu anstoßen – gestartet aus dem Admin-Bereich.
# Gleiche Logik wie ./live-gehen.sh und ./zurueck.sh im Grizzlys-Werkzeug.
WZ="$(cd "$(dirname "$0")" && pwd)"; source "$WZ/gemeinsam.sh"
cd "$GITHUB_WORKSPACE"; git_name
TEST_REPO="${TEST_REPO:-https://github.com/${GITHUB_REPOSITORY}-test.git}"
# Bleiben in Live unverändert (Test hat eigene Varianten bzw. gehören nur zu Live)
NUR_LIVE=(README.md README.txt FUNCTIONS-ANLEITUNG.txt manifest.webmanifest icon-192.png icon-512.png icon-maskable-512.png
          firebase.json firestore.rules functions .github .git .gitignore .nojekyll index.html sw.js)
L=$(version_von .)
doku_kopieren() {   # Doku für Live, die mit dem Test-Paket kam (README, Anleitung, PDF) → setzt DOKU
  DOKU=""
  [ -d "$T/.github/live-doku" ] || return 0
  for f in "$T/.github/live-doku"/*; do
    b=$(basename "$f"); case "$b" in *.md|*.txt|*.pdf) cmp -s "$f" "./$b" || { cp "$f" "./$b"; DOKU="$DOKU $b"; } ;; esac
  done
}

case "$AKTION" in
neu)
  pages_neu; info "Veröffentlichung der Live-App neu angestoßen ($L)."; exit 0 ;;

zurueck)
  [[ "$VERSION" =~ ^[0-9]+(\.[0-9]+)+$ ]] || fehler "Ungültiger Stand: $VERSION"
  git rev-parse -q --verify "refs/tags/live-$VERSION" >/dev/null || fehler "Den Stand $VERSION gibt es nicht."
  [ "$VERSION" = "$L" ] && { info "Live ist schon auf $L – nichts zu tun."; exit 0; }
  git tag -l "live-$L" | grep -q . || { git tag "live-$L"; git push -q origin "refs/tags/live-$L"; }
  git read-tree -u --reset "live-$VERSION" || fehler "Zurücksetzen fehlgeschlagen."
  # Nur die App zurücksetzen: Abläufe, Functions und Firebase-Dateien bleiben auf dem aktuellen Stand
  for f in .github functions firebase.json firestore.rules .gitignore .nojekyll; do git checkout -q HEAD -- "$f" 2>/dev/null; done
  git commit -q -m "Zurück auf $VERSION (Admin-Bereich)" || fehler "Zurücksetzen: nichts zu ändern."
  git push -q origin HEAD:main || fehler "Hochladen ins Live-Repo fehlgeschlagen."
  pages_neu
  info "Live: $L → $VERSION zurückgesetzt. In 1–2 Minuten in der App. Firestore-Regeln und Functions bleiben unverändert."
  ;;

live)
  T="$RUNNER_TEMP/test"
  rm -rf "$T"; git clone -q --depth 1 "$TEST_REPO" "$T" || fehler "Test-Repo konnte nicht geladen werden."
  V=$(version_von "$T")
  [ -n "$V" ] || fehler "In der Test-App wurde keine Versionsnummer gefunden."
  grep -q 'class="testRibbon"' "$T/index.html" || fehler "Die Test-App hat keinen Test-Balken – Aufbau unerwartet, nichts geändert."
  if [ "$V" = "$L" ]; then
    doku_kopieren
    [ -n "$DOKU" ] || { info "Live ist schon auf $V – nichts zu tun."; exit 0; }
    git add -A; git commit -q -m "Live-Doku $V (Admin-Bereich)"
    git push -q origin HEAD:main || fehler "Hochladen ins Live-Repo fehlgeschlagen."
    pages_neu; info "Live ist schon auf $V – nur die Doku übernommen:$DOKU"; exit 0
  fi
  if [ "$(printf '%s\n%s\n' "$L" "$V" | sort -V | tail -1)" = "$L" ]; then
    fehler "Die Test-App ($V) ist älter als Live ($L). Dafür bitte „Live zurücksetzen“ verwenden."
  fi
  # alten Live-Stand markieren (für „Live zurücksetzen“)
  git tag -l "live-$L" | grep -q . || { git tag "live-$L"; git push -q origin "refs/tags/live-$L" || warnung "Markierung live-$L nicht gespeichert."; }

  AUSNAHMEN=(); for f in "${NUR_LIVE[@]}"; do AUSNAHMEN+=(--exclude="./$f"); done
  ( cd "$T" && tar -cf - "${AUSNAHMEN[@]}" . ) | tar -xf - || fehler "Dateien konnten nicht übernommen werden."
  python3 "$WZ/tolive.py" "$T/index.html" index.html "$T/sw.js" sw.js 2>"$RUNNER_TEMP/tolive.log" \
    || { git checkout -q -- . ; fehler "$(tail -2 "$RUNNER_TEMP/tolive.log" | tr '\n' ' ')"; }
  [ "$(version_von .)" = "$V" ] || fehler "Nach dem Umwandeln stimmt die Version nicht ($(version_von .) statt $V)."
  doku_kopieren
  # Update-Hinweis für Nutzer ja/nein (Häkchen im Admin-Bereich); ältere Versionen kennen den Schalter noch nicht
  if grep -q '^const UPDATE_HINWEIS = ' sw.js; then
    [ "$HINWEIS" = "ja" ] && W=true || W=false
    sed -i "s/^const UPDATE_HINWEIS = [a-z]*;/const UPDATE_HINWEIS = $W;/" sw.js
    [ "$W" = true ] && HINWEIS_TEXT="Nutzer sehen den Update-Hinweis." || HINWEIS_TEXT="Ohne Update-Hinweis – Nutzer bekommen die Version still beim nächsten Öffnen."
  else
    HINWEIS_TEXT="Update-Hinweis: diese Version kennt den Schalter noch nicht (Hinweis erscheint wie bisher)."
  fi

  # Dateien, die nur in Live liegen (nicht im Test) – nur als Hinweis
  NUR_HIER=$(cd . && git ls-files | grep -v '^\.github/\|^functions/\|^\.' | while read -r f; do [ -e "$T/$f" ] || echo "$f"; done \
             | grep -v -x -F -f <(printf '%s\n' "${NUR_LIVE[@]}") | head -8 | tr '\n' ' ')

  git add -A 2>/dev/null; git reset -q -- functions/node_modules 2>/dev/null
  GEAENDERT=$(git diff --cached --name-only | wc -l)

  pruefung "$GITHUB_WORKSPACE"
  if [ "$PRUEF_RC" = 2 ] && [ "$TROTZDEM" != "ja" ]; then
    fehler "LESBARKEIT: Live wurde NICHT geändert, weil kaum lesbare Stellen gefunden wurden. Mit „Trotzdem live gehen“ geht es ohne diese Sperre."
  fi

  git commit -q -m "Live $V (Admin-Bereich, aus Test übernommen)"
  git tag -f "live-$V" >/dev/null
  git push -q origin HEAD:main || fehler "Hochladen ins Live-Repo fehlgeschlagen."
  git push -q -f origin "refs/tags/live-$V" || warnung "Markierung live-$V nicht gespeichert."
  pages_neu
  info "Live: $L → $V ($GEAENDERT Dateien). In 1–2 Minuten in der App. $HINWEIS_TEXT"
  [ -n "$NUR_HIER" ] && info "Nur in Live (nicht im Test, bleiben unverändert): $NUR_HIER"
  if [ -n "$DOKU" ]; then info "Doku mit übernommen:$DOKU"
  else grep -q "Stand $V" README.md 2>/dev/null || info "Hinweis: Die README beschreibt noch nicht $V (kam keine Doku mit dem Test-Paket)."; fi
  ;;
*) fehler "Unbekannte Aktion: $AKTION" ;;
esac
