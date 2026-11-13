# Young Grizzlys (bisher ESV Grizzlys U15 App)

Installierbare Web-App (PWA) für die ESV Grizzlys U15 A, U15 B und U13, Saison 2026/27.
Live: https://jazm1309.github.io/grizzlys-u15/ · Test: `grizzlys-u15-test`

Entwickelt von **JAZM**.

## Aufbau der App (ab 1.39.0)

| Datei | Inhalt |
|---|---|
| `index.html` | Gerüst der Seite, Startwerte (Mannschaften, Test-Kennung), Einwilligung |
| `app.css` | gesamtes Aussehen |
| `js/app.js` | App-Code: Ansichten, Spielplan, Kalender, Gegner, News, Bilder, Einstellungen |
| `js/app-daten.js` | Firebase: Ergebnisse, Push, Fehlermeldungen, Admin-Bereich |
| `spielplan.js` | alle Spiele (`window.SPIELPLAN`), eine Zeile pro Spiel – hier Termine der neuen Saison eintragen |
| `spielbericht.js` | Textbausteine der Spielberichte (von App und Functions gemeinsam genutzt) |
| `sw.js` | Service Worker (Offline, Update-Hinweis, Push-Anzeige) |
| `nur-live/bauen.py` | trägt nach jeder Änderung die Prüfsummen ein: `python3 nur-live/bauen.py .` |

Workflows im Live-Repo (`.github/workflows`): **Live gehen** (`live-gehen.yml` → `.github/werkzeug/live.sh`, `tolive.py`, `pruefen.py`, `startcheck.py`) und **Functions deployen** (`functions-deploy.yml`).

Mannschaften: `APP_CFG.teams` in `index.html` (U15 A, U15 B, U13). Jedes Gerät wählt in „Meine Mannschaften“, was es sieht und wofür es Push bekommt.

## Geplant zur neuen Saison (U17)

Bewusst auf die Saison 2027/28 verschoben (dann kommt die U17 dazu):

- **Kalender-Abo:** eine Abo-Adresse je Mannschaft, damit Terminänderungen automatisch im Handy-Kalender ankommen
- **CSS aufräumen:** doppelte und nicht mehr genutzte Regeln in `app.css` entfernen
- **Kopfbereich auf schmalen Handys:** Platz für vier Mannschaften (Schrift, Umbruch)
- **Lade-Platzhalter:** graue Platzhalter statt leerer Flächen, solange Tabelle/Ergebnisse laden
- **Logo-Ersatz:** einheitliches Kürzel-Wappen, wenn ein Gegner-Logo fehlt
- **Admin-Code nur bei Bedarf laden:** ca. 80 KB von `js/app-daten.js` gehören nur zum Admin-Bereich; Trennung erst mit ausreichender Testzeit (Admin-Bereich ist ohne Anmeldung nicht automatisch prüfbar)
- Saisonwechsel wie immer: Liga-Kennungen (`functions/standings.js`, `functions/teams.js`), `spielplan.js`, Ferien (`nrwFerien`)

## Versionsnummern

Schreibweise `1.ZWEITE.DRITTE.CACHE`:

- **zweite Stelle:** größere Änderungen und neue Funktionen (die dritte Stelle beginnt wieder bei 0)
- **dritte Stelle:** optische Änderungen, Fehlerbehebungen und kleine Verbesserungen
- **letzte Stelle:** Cache-Nummer aus `sw.js` (steigt bei fast jedem Stand)

Letzte Stände (vollständige Liste und ältere Versionen: `README-ARCHIV.md`):

| Neue Version | Alte Bezeichnung | Datum | Art |
|---|---|---|---|
| 1.39.0.199 | – (nur Test) | 13.11.2026 | Umbau |
| 1.38.0.198 | – (nur Test) | 13.11.2026 | Neue Funktion |
| 1.37.3.197 | – (nur Test) | 13.11.2026 | Optisch |
| 1.37.2.196 | – (nur Test) | 13.11.2026 | Optisch |
| 1.37.1.195 | – (nur Test) | 13.11.2026 | Verbesserung |
| 1.37.0.194 | – (nur Test) | 13.11.2026 | Neue Funktion |
| 1.36.7.193 | – (nur Test) | 13.11.2026 | Fehlerbehebung |
| 1.36.6.192 | – (nur Test) | 12.11.2026 | Kleine Ergänzung |
| 1.36.5.191 | – (nur Test) | 12.11.2026 | Optisch und kleine Ergänzung |
| 1.36.4.190 | – (nur Test) | 12.11.2026 | Optisch |
| 1.36.3.189 | – (nur Test) | 12.11.2026 | Optisch |
| 1.36.2.188 | – (nur Test) | 12.11.2026 | Kleine Ergänzung |
| 1.36.1.187 | – (nur Test) | 12.11.2026 | Optisch und Fehlerbehebung |
| 1.36.0.186 | – (nur Test) | 12.11.2026 | Neue Funktion (U13, Young Grizzlys) |
| 1.35.0.185 | – (nur Test) | 12.11.2026 | Neue Funktion |
| 1.34.1.184 | – (nur Test) | 12.11.2026 | Kleine Ergänzung |

## Version 1.39.0

### Neu in Version 1.39.0 (Stand 1.39.0.199, 13.11.2026, nur in der Test-App) – Umbau (für Nutzer unsichtbar)

- **App in Dateien aufgeteilt:** `index.html` (Gerüst, ca. 95 KB statt 760 KB), `app.css` (Aussehen), `js/app.js` (App-Code), `js/app-daten.js` (Firebase, Admin-Bereich), `spielplan.js` (alle Spiele). Die Dateien werden über eine Prüfsumme (`?h=…`) neu geladen, sobald sie sich ändern – `nur-live/bauen.py` trägt die Prüfsummen in `index.html` und `sw.js` ein.
- **Spielplan in eigener Datei:** `spielplan.js` – eine Zeile pro Spiel. Die Functions lesen den Spielplan dort (mit Rückfall auf `index.html` für ältere Stände).
- **Push folgt „Meine Mannschaften“:** Wer in den Einstellungen nur bestimmte Mannschaften wählt, bekommt auch nur deren Push-Meldungen; die Push-Schalter zeigen nur noch die gewählten Mannschaften.
- **Startprüfung beim Live gehen:** `startcheck.py` startet die umgewandelte Live-App im Browser. Meldet sie JavaScript-Fehler, bleibt Live unverändert (außer mit Häkchen „Trotzdem live gehen“).
- **Functions automatisch deployen:** Workflow `functions-deploy.yml` im Live-Repo – nach dem Hochladen des `functions`-Ordners deployt GitHub selbst (einmalige Einrichtung: `FUNCTIONS-AUTODEPLOY-EINRICHTEN.txt`).
- **README verschlankt:** ältere Versionen stehen jetzt in `README-ARCHIV.md`.

## Version 1.38.0

### Neu in Version 1.38.0 (Stand 1.38.0.198, 13.11.2026, nur in der Test-App) – Neue Funktion

- Einstellungen: Jede Karte (Meine Mannschaften, Darstellung, Saison-Designs, Push, Datenschutz, Feedback) lässt sich über ihre Überschrift auf- und zuklappen (Pfeil rechts). Der Zustand wird je Gerät gemerkt (`grizzlysSetOpen`).
- Standard: alles eingeklappt – außer „Nichts mehr verpassen“, solange Push noch nicht aktiv ist (damit der Knopf „Push aktivieren“ sichtbar bleibt).

## Version 1.37.3

### Neu in Version 1.37.3 (Stand 1.37.3.197, 13.11.2026, nur in der Test-App) – Optisch

- Einstellungen noch kompakter: Push-Auswahl (Ergebnisse, Erinnerung, Live, Mannschaften) erscheint erst, wenn Push aktiv ist; Push-Beispiel entfällt; Darstellungs- und Saison-Schalter ohne Erklärtext; Feedback ohne Untertitel.

## Version 1.37.2

### Neu in Version 1.37.2 (Stand 1.37.2.196, 13.11.2026, nur in der Test-App) – Optisch

- Einstellungen kompakter (etwa 15 % kürzer): kleinere Kopfzeile ohne Untertitel, engere Karten und Zeilen, „Meine Mannschaften“ mit kurzem Hinweis und „Übernehmen“ erst nach einer Änderung, Push-Beispiel nur noch eine Meldung (bei aktivem Push ausgeblendet), Feedback-Kacheln ohne Untertitel, weniger Hinweistexte.
- App-Neuigkeiten: kein eigener Eintrag zu den automatischen Spielberichten (Ablauf im Hintergrund, für Nutzer ohne Bedeutung).
- Fußzeile: „ESV Grizzlys Bergkamen · Young Grizzlys · Saison 2026/27“ (vorher „U15“).

## Version 1.37.1

### Neu in Version 1.37.1 (Stand 1.37.1.195, 13.11.2026, nur in der Test-App) – Verbesserung

- **Mehr Abwechslung in den Spielberichten** (gleiche Fakten, andere Erzählweise; U13 und U15 gleich):
  - meist 4–7 Formulierungen je Stelle statt 2–3, vorher feste Sätze sind jetzt austauschbar; 4–5 Überschriften je Spielausgang.
  - vier Aufbau-Varianten: klassisch, Mannschaftsleistung zuerst (nur wenn genug zu erzählen ist), Aufhänger zuerst (Hattrick, Drei-Tore-Lauf, Zu-null-Sieg), Zahlen (kompakter Verlauf mit Drittelergebnissen).
  - **Keine Wiederholung:** Jeder Bericht speichert seine Bausteine (`bausteine`). Neue Berichte meiden die Bausteine der letzten 8 Berichte derselben Mannschaft – in der App und in der Function.
- Messung mit 20 simulierten Spielen: gleiche Sätze zwischen zwei Berichten 12 % → 4 %, zwischen aufeinanderfolgenden Berichten 11 % → 0 %; verschiedene Einstiege 15 → 18 von 20, Überschriften-Muster 9 → 17. 2.400 Testberichte ohne Fehler.
- Korrektur: Bei nur einem Torschützen und mehreren Toren hieß es „Das Tore erzielte …“ – jetzt „Alle drei Tore erzielte …“.

## Version 1.37.0

### Neu in Version 1.37.0 (Stand 1.37.0.194, 13.11.2026, nur in der Test-App) – Neue Funktion

- **Automatische Spielberichte für alle Mannschaften** (U15 A, U15 B, U13): Die Cloud Function `autoResults` erzeugt nach jedem Spiel (letzte 4 Tage, Ergebnis vorhanden, noch kein Bericht) einen faktenbasierten Fließtext aus dem EHV-Spielbericht, speichert ihn als **Entwurf** (`reports/<Spiel>`, `auto: true`) und schickt einen Admin-Push.
- **Freigabe:** Ohne Reaktion wird der Entwurf nach **12 Stunden** automatisch veröffentlicht (`autoPublishAt`). Im Admin-Bereich: „Veröffentlichen“ (sofort), „Als Entwurf speichern“ oder „⏸ Nicht automatisch veröffentlichen“ (beides stoppt die automatische Freigabe).
- Wartet bis zu 36 Stunden auf einen vollständigen EHV-Spielbericht (Torzahl passt zum Ergebnis); danach Bericht ohne Torfolge. Höchstens 3 Entwürfe pro Lauf.
- **Eine Vorlage für beide:** Die Textvorlage steckt jetzt in `spielbericht.js` (App lädt sie per `<script>`, sw.js speichert sie zwischen). Die Function lädt dieselbe Datei von der Live-Seite – Textverbesserungen gelten nach „Live gehen“ automatisch auch für Auto-Berichte. Fallback: Kopie `functions/spielbericht.js`.
- Nur Fakten aus EHV-Daten, Spieler nur mit Rückennummer (auch U13). Keine Stichworte/KI in der Automatik.
- Korrektur in der Vorlage: Beim Hattrick wird der Spieler mit den meisten Toren genannt (vorher die kleinste Rückennummer mit mindestens drei Toren).
- KI-Auftrag (Admin) nennt die richtige Altersklasse (U13: „Kinder“, U15: „Jugendliche“).
- Functions: neu `auto-report.js`, `spielbericht.js`; geändert `ehv-sync.js` (Aufruf nach autoResults, Laufzeit 180 s), `game-report.js` (Export für Auto-Berichte), `teams.js` (Liganamen).

## Version 1.36.7

### Neu in Version 1.36.7 (Stand 1.36.7.193, 13.11.2026, nur in der Test-App) – Fehlerbehebung

- „Spielverlegung“ (Downloads, Social-Media-Bilder im Admin-Bereich) nur noch, wenn ein Spiel auf einen anderen Tag verlegt wurde. Geänderte Bullyzeit oder Halle (z. B. Tippfehler, Neuss → Moers) gilt nicht mehr als Verlegung.

## Version 1.36.6

### Neu in Version 1.36.6 (Stand 1.36.6.192, 12.11.2026, nur in der Test-App) – Kleine Ergänzung

- Spieldetails und aufgeklappte Spielkarten: Kachel „Torschützen“ mit den Rückennummern der Grizzlys (z. B. „Nr. 13 ×2“) und der Zahl der Überzahltore. Erscheint bei gespielten Spielen, wenn der EHV-Endstand zum Ergebnis passt; während eines Live-Spiels bleibt die Torfolge des Live-Tickers.

## Version 1.36.5

### Neu in Version 1.36.5 (Stand 1.36.5.191, 12.11.2026, nur in der Test-App) – Optisch und kleine Ergänzung

- Startseite › Letzte Ergebnisse: Der linke Balken zeigt wieder die Mannschaftsfarbe (U15 A blau, U15 B orange, U13 gelb); die Füllung bleibt grün (Sieg) bzw. rot (Niederlage).
- Letzte Ergebnisse: Torschützen der Grizzlys als Rückennummern (z. B. „Nr. 27 (2) · Nr. 91“), nur wenn der EHV-Endstand zum eingetragenen Ergebnis passt.
- Cloud Function `standings`: liefert bei den eigenen Spielen zusätzlich `sc` (Rückennummern der Torschützen) und `pp` (Überzahltore) – aus den Spielberichten, die sie für die Torschützenliste ohnehin liest. Neu deployen nötig (`firebase deploy --only functions:standings`).

## Version 1.36.4

### Neu in Version 1.36.4 (Stand 1.36.4.190, 12.11.2026, nur in der Test-App) – Optisch

- Spruch „Jung · Wild · Grizzlys“ mittig ausgerichtet, blauer Pinselstrich darunter kürzer (118 → 84 px).

## Version 1.36.3

### Neu in Version 1.36.3 (Stand 1.36.3.189, 12.11.2026, nur in der Test-App) – Optisch

- Neuer Spruch im Kopfbereich: „Jung · Wild · Grizzlys“ (vorher „Ein Team – zwei starke Mannschaften“).

## Version 1.36.2

### Neu in Version 1.36.2 (Stand 1.36.2.188, 12.11.2026, nur in der Test-App) – Kleine Ergänzung

- Info › Grizzlys Teamseiten: Link zur Teamseite der U13 (`slug=grizzlys-u13`).

## Version 1.36.1

### Neu in Version 1.36.1 (Stand 1.36.1.187, 12.11.2026, nur in der Test-App) – Optisch

- Titel „Young Grizzlys“ im Kopfbereich etwas kleiner (27 → 20 px, auf schmalen Handys 25 → 19 px; Halloween/Weihnachten entsprechend).
- Fehlerbehebung: Bei drei Mannschaften stand das dritte letzte Spiel zusätzlich als eigene Karte unter „Letzte Ergebnisse“ (doppelt). Diese Karte wird jetzt wie die anderen ausgeblendet.

## Version 1.36.0

### Neu in Version 1.36.0 (Stand 1.36.0.186, 12.11.2026, nur in der Test-App) – Neue Funktion

- **U13** als dritte Mannschaft (Farbe Gelb, `--u13: #f2b705`): 20 Spiele der U13 Landesliga NRW in `ALL_GAMES` (`"team":"U13"`), Tabelle, Form, Drittel, automatische Ergebnisse, Spielplan-Abgleich und Live-Ticker über dieselben Cloud Functions wie bei der U15 (hockeydata-Liga `21668`).
- **App-Name „Young Grizzlys“** (`APP_CFG.appName`): Kopfbereich, Seitentitel, Info, Teilen, Druck, Social-Media-Bilder. Adresse (`…/grizzlys-u15/`) und Firebase-Projekt bleiben unverändert, damit Installationen und Push-Anmeldungen erhalten bleiben. `manifest.webmanifest` (`name`, `short_name`) muss von Hand angepasst werden.
- **Bestandsnutzer** ohne Auswahl sehen weiterhin nur U15 A und U15 B (`APP_CFG.legacy`). Neue Nutzer wählen beim ersten Start aus allen drei.
- **Push U13 nur auf ausdrücklichen Wunsch:** `prefs.teamU13 === true`. Fehlt die Angabe (alle bisherigen Geräte), gibt es keine U13-Pushs. Für A/B gilt weiter: fehlt die Angabe, gibt es Push.
- Startseite: bis zu drei „Nächstes Spiel“- und „Letztes Spiel“-Karten (eine je gewählter Mannschaft).
- Admin: Mannschafts-Filter, Hinweise, Social-Media-Bilder und Spielbericht-Abruf kennen die U13.
- Halle Troisdorf (Icedome, Uckendorfer Straße 135) ergänzt; Entfernung ungefähr. Logo-Datei `logos/ehc-troisdorf.png` fehlt noch (bis dahin Kürzel).
- **Cloud Functions** (neue Datei `functions/teams.js`): Mannschaftsnamen, Push-Auswahl und Erkennung des Spielplans (`ALL_GAMES` oder `games`) an einer Stelle. Geändert: `standings.js` (U13-Liga), `push.js`, `live.js`, `news.js`, `ehv-sync.js`, `game-report.js`. Deploy siehe `FUNCTIONS-ANLEITUNG.txt`.
- **Reihenfolge beim Live-Gang:** zuerst die Functions deployen (sie verstehen alte und neue `index.html`), danach die App live schalten.

## Version 1.35.0

### Neu in Version 1.35.0 (Stand 1.35.0.185, 12.11.2026, nur in der Test-App) – Neue Funktion

- **Meine Mannschaften** (Vorbereitung für weitere Mannschaften wie die U13): Jedes Gerät wählt, welche Mannschaften es sieht (Einstellungen › Meine Mannschaften, gespeichert als `grizzlysTeams`).
- Neue Nutzer werden beim ersten Start gefragt; bestehende Nutzer behalten ohne Nachfrage alle Mannschaften.
- Nicht gewählte Mannschaften verschwinden aus Startseite, Spielplan, Kalender, Gegnern, Karte, Saisonbilanz, Downloads, News-Hinweisen und Kalender-/PDF-Export. Ist nur eine Mannschaft gewählt, entfallen alle Mannschafts-Filter.
- Push: Beim Ändern der Auswahl wird der Mannschafts-Push abgewählter Mannschaften ausgeschaltet (`prefs.teamA`/`teamB`), für neu gewählte eingeschaltet. Die Cloud Functions brauchen dafür keine Änderung.
- Technik: Der Spielplan heißt jetzt `ALL_GAMES`; `games` enthält nur die gewählten Mannschaften. Der Admin-Bereich (Ergebnisse, Spielplan, Spieländerungen, Social-Media-Bilder, Spielberichte, Sicherung) und der Adventskalender arbeiten weiter mit allen Spielen.
- Neue Mannschaft ergänzen: in `APP_CFG.teams` eintragen (z. B. `U13:{name:"U13",league:"…"}`), Spiele mit `"team":"U13"` in `ALL_GAMES`, Farbe im CSS. Für Tabelle/Ergebnisse/Push zusätzlich die Cloud Functions erweitern (`DIVISIONS` in `standings.js`, Push-Filter `prefs.teamU13`).

## Update-Hinweis

Wenn eine neue App-Version veröffentlicht wurde, lädt der Service Worker sie im Hintergrund und wartet. Die App zeigt dann unten den Banner „Neue Version verfügbar“.

- **Aktualisieren** aktiviert die neue Version und lädt die App neu
- **×** blendet den Banner bis zum nächsten App-Start aus

Technisch: `js/app.js` erkennt eine wartende Version über den Service-Worker-Status, `sw.js` aktiviert sie erst nach der Nachricht `SKIP_WAITING`. Bei jeder App-Änderung muss der Cache-Name in `sw.js` erhöht werden (Live `grizzlys-u15-vNNN`, Test `grizzlys-u15-test-vNNN`).

Die angezeigte Version hat die Form `1.25.1.157`: vorn die App-Version (Regeln siehe „Versionsnummern“ oben), die letzte Zahl ist die Cache-Nummer. Test- und Live-Stand mit derselben letzten Zahl sind inhaltlich gleich. Die Testversion (`grizzlys-u15-test`) zeigt die Nummer zusätzlich im orangen Balken und sperrt Speichern, Senden und Push-Anmeldung.

## Firebase

Firebase-Projekt: `grizzlys-u15`

Verwendete Firestore-Sammlungen:

- `results` – Spielergebnisse (von Hand oder automatisch vom EHV, dann mit `source: "ehv"`)
- `scheduleOverrides` – zentral geänderte Spieltermine
- `pushTokens` – registrierte Push-Geräte
- `gameReminders` – Erinnerungsdaten
- `appInstallations` – technische App-/Geräteregistrierungen
- `bugReports` – Fehlermeldungen aus der App
- `news` – Hinweise aus dem Admin-Bereich (Überschrift, Text, Mannschaft, sichtbar bis, Push ja/nein)
- `ehvSync` – merkt sich, welche Spielplan-Abweichungen schon gemeldet wurden (nur Cloud Function, kein Zugriff aus der App)
- `reports` – Spielberichte (Dokument-ID = Ergebnis-Schlüssel; Überschrift, Text, veröffentlicht ja/nein). Veröffentlichte sind für alle lesbar, Entwürfe nur für den Admin
- `scheduleOverrides.news` – optional: `true`/`false` legt fest, ob eine Spieländerung in den News steht (fehlt = automatische Erkennung)

Ergebnisse und Fehlermeldungen werden über die vorgesehenen Firebase-Regeln geschützt. Schreib- und Verwaltungszugriffe im Admin-Bereich sind auf den eingerichteten Admin-Benutzer beschränkt.

## EHV-Daten (Tabelle, Ergebnisse, Spielplan)

Die App zeigt Tabellenplatz, Spiele, Punkte, Tordifferenz, die Form der letzten fünf Ligaspiele und Drittelergebnisse. Die Daten stammen vom Eishockeyverband NRW. Die App fragt den Dienst des Verbands nie direkt ab, sondern nur die eigenen Cloud Functions:

| Function | Datei | Aufgabe |
|---|---|---|
| `standings` | `functions/standings.js` | liefert Tabelle und beendete Spiele beider Ligen; holt sie höchstens alle 30 Minuten, antwortet nur `jazm1309.github.io` |
| `autoResults` | `functions/ehv-sync.js` | trägt alle 30 Minuten beendete Grizzlys-Spiele als Ergebnis ein (Ergebnis-Push nur für Spiele der letzten 2 Tage; Handeinträge werden nie überschrieben) |
| `scheduleWatch` | `functions/ehv-sync.js` | vergleicht alle 3 Stunden den Spielplan der App mit dem des EHV und meldet neue Abweichungen per Push an die Admin-Geräte |
| `scheduleCheck` | `functions/ehv-sync.js` | derselbe Vergleich auf Knopfdruck im Admin-Bereich („Mit EHV-Spielplan abgleichen“) |
| `gameReport` | `functions/game-report.js` | holt für den Spielbericht-Entwurf die Spieldetails eines Spiels (hockeydata `GetGameReport`): Tore mit Spielzeit und Spielsituation, Strafen, Über-/Unterzahl, Führungszeit, Zuschauer. Nur für den Admin, nur auf Knopfdruck bzw. beim Öffnen des Spiel-Fensters, 10 Minuten zwischengespeichert. Namen nur auf Anforderung, Geburtsdaten nie |

- Die App speichert den Tabellenstand 15 Minuten auf dem Gerät und holt ihn nach jedem App-Update sofort neu.
- Fällt der Abruf aus, bleiben Chips, Form und Drittel weg; der Spielplan funktioniert unverändert.
- Liga-Kennungen: U15 A `21652` (Landesliga NRW), U15 B `21656` (Bezirksliga NRW), U13 `21668` (U13 Landesliga NRW, ab 1.36.0). Sie stehen in `functions/standings.js` und müssen zur neuen Saison angepasst werden.
- Der Zugriffsschlüssel in `standings.js` und `game-report.js` ist der öffentliche Schlüssel der EHV-Seite. Eine ausdrückliche Erlaubnis von EHV / hockeydata zur Nutzung in der App liegt nicht vor. Eine Anfrage beim EHV wurde zu Beginn der EHV-Abfragen gestellt, eine Antwort steht bis heute (12.11.2026) aus.
- Überzahltore zählt `gameReport` aus den Toren selbst (`gameStrength` PP/SH), weil die Teamstatistik des EHV dafür teils 0 liefert. Schüsse aufs Tor werden in der U15 nicht erfasst und deshalb nicht verwendet.
- Deploy und Schalter: siehe `FUNCTIONS-ANLEITUNG.txt`.

## Logos

Alle Gegner-Logos liegen als Dateien im Ordner `logos/`. Die erwarteten Dateinamen stehen in `logos/LIESMICH.txt` und in `js/app.js` (`LOGO_FILES`). Fehlt eine Datei, lädt die App das Logo von der bisherigen Adresse (`logoUrls`); im Social-Media-Bild steht dann ein Kürzel. Ein Logo wird ersetzt, indem eine Datei mit demselben Namen hochgeladen wird.

## Social-Media-Bilder

Im Admin-Bereich erzeugt der Abschnitt „Social-Media-Bilder“ pro Spiel ein Bild im Beitragsformat 4:5 (1080 × 1350): „Ankündigung“ (Spieltag, Datum, Uhrzeit, Tabellen-Chips) oder „Ergebnis“ (Heimsieg / Auswärtssieg / Endstand, Drittel). Das Bild entsteht im Browser, wird in einer Vorschau gezeigt und kann geteilt oder gespeichert werden. Es wird nichts automatisch gepostet.

Im Downloadbereich stehen dieselben Bilder allen Nutzern zur Verfügung: das Spieltagsbild ab 5 Tage vor dem Spiel bis Spielende, das Ergebnisbild ab Eintrag des Ergebnisses bis 5 Tage nach dem Spiel (`INSTA_DAYS` in `js/app.js`).

## News

Das News-Symbol im Kopfbereich zeigt die Zahl ungelesener Einträge. Das Fenster „Neuigkeiten“ hat bis zu vier Abschnitte:

- **Hinweise:** Freitexte aus dem Admin-Bereich (Sammlung `news`); abgelaufene Hinweise („Sichtbar bis“) werden nicht mehr angezeigt
- **Spieländerungen:** kommen automatisch aus `scheduleOverrides` (neuer Termin bzw. Ort, dazu der alte); ein Tipp öffnet das Spiel
- **Spielberichte:** veröffentlichte Berichte (Sammlung `reports`) der letzten 14 Tage; ein Tipp öffnet die Spieldetails beim Bericht
- **Neu in der App:** die Liste `APP_NEWS` in `js/app.js` – bei jedem Update dort die für Nutzer sichtbaren Neuerungen eintragen (neueste Version oben)

Was gelesen wurde, merkt sich jedes Gerät selbst. Der Push zu einem Hinweis kommt von der Cloud Function `onNewsCreated` (`functions/news.js`) und nur, wenn der Haken gesetzt ist.

## Schulferien

Die NRW-Ferien sind in der Kalenderansicht grün hinterlegt. Die Termine stehen als Liste `nrwFerien` in `js/app.js` (Schuljahr 2026/27) und müssen zur neuen Saison ersetzt werden.

## Push-Benachrichtigungen

Die Push-Funktion ist aktiv.

Sie wird verwendet für:

- neue Spielergebnisse
- automatische Erinnerung 24 Stunden vor einem Spiel
- Meldung an die Admin-Geräte bei einer neuen Abweichung zwischen App- und EHV-Spielplan
- Hinweise aus dem Admin-Bereich, wenn „Zusätzlich als Push senden“ gesetzt ist

Welche Mannschaften ein Gerät bekommt, steht in `pushTokens` (`teamA`, `teamB`, `teamU13`). U15 A/B: ohne Angabe = Push; U13 (und künftige Mannschaften): nur bei ausdrücklichem `true`. Ab 1.39.0 schaltet „Meine Mannschaften“ die Push-Meldungen nicht gewählter Mannschaften automatisch ab.

Im Admin-Bereich werden die registrierten Push-Geräte gezählt. Zusätzlich werden App-Installationen nach Plattform angezeigt.

## Fehlermeldungen

Nutzer können einen Fehler direkt über **Info → Fehler melden** melden.

Eine Meldung kann enthalten:

- Name
- Bereich
- Beschreibung des Fehlers
- optional E-Mail-Adresse
- App-Version
- technische Geräte-/Browserinformationen
- Push-Registrierungsstatus, sofern verfügbar

Die Meldungen werden im Admin-Bereich angezeigt und können dort mit einem Status versehen werden. Fehler können zusätzlich per E-Mail und Push an den Admin gemeldet werden.

## Veröffentlichung

Die App wird als kostenlose PWA über GitHub Pages veröffentlicht.

Repository:

`JAZM1309/grizzlys-u15`

Die README dient ausschließlich als Dokumentation des Projekts und ist nicht Bestandteil der sichtbaren App-Oberfläche.

## Google Analytics

Google Analytics 4 ist die Datenquelle für das geschützte Statistikdashboard.

Im Admin-Bereich gibt es den Button **📊 App-Statistik**. Dort können die Nutzungsdaten direkt innerhalb der App ausgewertet werden.

Das Dashboard zeigt unter anderem:

- Aktive Nutzer
- Neue Nutzer
- Sitzungen
- Events
- Tagesverlauf der aktiven Nutzer
- Nutzung bzw. wichtige App-Events
- Gerätekategorien
- Betriebssysteme
- Seitenaufrufe
- Städte

Verfügbare Zeiträume:

- Heute
- Diese Woche
- Dieser Monat
- 30 Tage
- Saison
- Gesamt

Die Daten werden serverseitig über eine Firebase Cloud Function und die Google Analytics Data API abgefragt. Zugangsdaten werden nicht in der PWA gespeichert.
