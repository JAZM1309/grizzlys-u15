# Hilfsfunktionen für die GitHub-Abläufe (Knöpfe im Admin-Bereich). Meldungen erscheinen im Admin-Bereich.
set -o pipefail
info()   { echo "::notice title=Grizzlys::$*"; }
warnung(){ echo "::warning title=Grizzlys::$*"; }
fehler() { echo "::error title=Grizzlys::$*"; exit 1; }
version_von() { grep -o 'inVer">[0-9.]*' "$1/index.html" 2>/dev/null | head -1 | sed 's/.*">//'; }
cache_von()   { grep -o 'const CACHE = "[^"]*"' "$1/sw.js" 2>/dev/null | grep -o '[0-9]\+"' | tr -d '"'; }
git_name()    { git config user.name "JAZM"; git config user.email "jazm1309@users.noreply.github.com"; }
pages_neu()   {   # GitHub Pages ausdrücklich neu bauen lassen (zusätzlich zum automatischen Lauf)
  gh api -X POST "repos/$GITHUB_REPOSITORY/pages/builds" >/dev/null 2>&1 \
    || warnung "Veröffentlichung konnte nicht ausdrücklich angestoßen werden – sie startet normalerweise trotzdem von selbst."
}
pruefung() {   # pruefung ORDNER → setzt PRUEF_RC (0 gut, 1 Hinweise, 2 kaum lesbar, 3 lief nicht, 9 nicht eingerichtet)
  PRUEF_RC=9
  python3 -c "import playwright, PIL" 2>/dev/null || { warnung "Lesbarkeitsprüfung übersprungen (Browser ließ sich bei GitHub nicht einrichten)."; return; }
  timeout 600 python3 -I "$WZ/pruefen.py" "$1" "$RUNNER_TEMP/pruefung" 2>"$RUNNER_TEMP/pruefung.log"; PRUEF_RC=$?
  [ $PRUEF_RC -gt 3 ] && PRUEF_RC=3
  case $PRUEF_RC in
    0) info "Lesbarkeit: alles gut lesbar." ;;
    1) info "Lesbarkeit: keine schlecht lesbaren Stellen ($(grep -o 'Schwach[^:]*: [0-9]*' "$RUNNER_TEMP/pruefung/bericht.txt" | grep -o '[0-9]*$') schwache Kontraste, nur Hinweis)." ;;
    2) STELLEN=$(sed -n '/KAUM LESBAR/,/^$/p' "$RUNNER_TEMP/pruefung/bericht.txt" | grep 'Kontrast' | head -4 | sed 's/  */ /g' | tr '\n' ';')
       warnung "Lesbarkeit: kaum lesbare Stellen gefunden – $STELLEN (Bericht mit Bildern bei GitHub unter „Artifacts“)." ;;
    3) warnung "Lesbarkeitsprüfung konnte nicht laufen: $(tail -1 "$RUNNER_TEMP/pruefung.log")" ;;
  esac
}
