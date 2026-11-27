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
| `sprueche.js` | Standardliste für den „Spruch des Tages“ (gilt, bis im Admin-Bereich eine eigene Liste gespeichert ist) |
| `sw.js` | Service Worker (Offline, Update-Hinweis, Push-Anzeige) |
| `nur-live/bauen.py` | trägt nach jeder Änderung die Prüfsummen ein: `python3 nur-live/bauen.py .` |

Workflows im Live-Repo (`.github/workflows`): **Live gehen** (`live-gehen.yml` → `.github/werkzeug/live.sh`, `tolive.py`, `pruefen.py`, `startcheck.py`) und **Functions deployen** (`functions-deploy.yml`).

**Functions (ab 1.39.1):** Der Ordner `functions/` gehört mit ins Test-Paket (ZIP). „Live gehen“ übernimmt ihn ins Live-Repo (Syntaxprüfung vorher; `node_modules` nie; nur in Live vorhandene Dateien bleiben) und startet bei Änderungen selbst „Functions deployen“. Ändern sich nur die Functions, genügt dasselbe Vorgehen mit gleicher App-Version (wie bei reiner Doku). Direktes Hochladen in `functions/` des Live-Repos löst den Deploy weiterhin aus. „Live zurücksetzen“ ändert die Functions nie.

Mannschaften: `APP_CFG.teams` in `index.html` (U15 A, U15 B, U13). Jedes Gerät wählt in „Meine Mannschaften“, was es sieht und wofür es Push bekommt.

## Geplant zur neuen Saison (U17)

Bewusst auf die Saison 2027/28 verschoben (dann kommt die U17 dazu):

- **Kalender-Abo:** eine Abo-Adresse je Mannschaft, damit Terminänderungen automatisch im Handy-Kalender ankommen
- **CSS aufräumen:** doppelte und nicht mehr genutzte Regeln in `app.css` entfernen
- **Kopfbereich auf schmalen Handys:** Platz für vier Mannschaften (Schrift, Umbruch)
- **Lade-Platzhalter:** graue Platzhalter statt leerer Flächen, solange Tabelle/Ergebnisse laden
- **Logo-Ersatz:** einheitliches Kürzel-Wappen, wenn ein Gegner-Logo fehlt
- **Admin-Code nur bei Bedarf laden:** ca. 80 KB von `js/app-daten.js` gehören nur zum Admin-Bereich; Trennung erst mit ausreichender Testzeit (Admin-Bereich ist ohne Anmeldung nicht automatisch prüfbar)
- **Helfer-Dienste am Heimspieltag:** Liste der Dienste je Heimspiel (Kampfgericht, Anzeigetafel, Kiosk, Kasse), Eltern tragen sich mit Kürzel ein, offene Dienste sichtbar, Erinnerung per Push am Vortag (wird in dieser Saison noch anders geregelt)
- Saisonwechsel wie immer: Liga-Kennungen (`functions/standings.js`, `functions/teams.js`), `spielplan.js`, Ferien (`nrwFerien`)

## Versionsnummern

Schreibweise `1.ZWEITE.DRITTE.CACHE`:

- **zweite Stelle:** größere Änderungen und neue Funktionen (die dritte Stelle beginnt wieder bei 0)
- **dritte Stelle:** optische Änderungen, Fehlerbehebungen und kleine Verbesserungen
- **letzte Stelle:** Cache-Nummer aus `sw.js` (steigt bei fast jedem Stand)

Letzte Stände (vollständige Liste und ältere Versionen: `README-ARCHIV.md`):

| Neue Version | Alte Bezeichnung | Datum | Art |
|---|---|---|---|
| 1.73.7.305 | – (nur Test) | 27.11.2026 | Startseite: Abschnitts-Überschriften zuverlässig |
| 1.73.6.304 | – (nur Test) | 27.11.2026 | „Mehr“ im aktuellen Design ausgeblendet |
| 1.73.5.303 | – (nur Test) | 27.11.2026 | App-Fehler als erledigt markieren |
| 1.73.4.302 | – (nur Test) | 27.11.2026 | Fehlerbehebung Kalender/Druck, Admin-Reiter |
| 1.73.3.301 | – (nur Test) | 27.11.2026 | Kopf: Schrift weiter vom Logo |
| 1.73.2.300 | – (nur Test) | 27.11.2026 | Kopf etwas kleiner |
| 1.73.1.299 | – (nur Test) | 27.11.2026 | Kopf: Young Grizzlys einzeilig mit Strichschrift |
| 1.73.0.298 | – (nur Test) | 27.11.2026 | Navigation: „Mehr“ unten statt Knöpfe oben |
| 1.72.3.297 | – (nur Test) | 27.11.2026 | Saisonwechsel-Werkzeug, App Check vorbereitet |
| 1.72.2.296 | – (nur Test) | 27.11.2026 | Dunkelmodus-Durchgang, Seitenwechsel, Ladeplatzhalter |
| 1.72.1.295 | – (nur Test) | 27.11.2026 | Hintergrundbilder: Strichschrift hinter den Titeln |
| 1.72.0.294 | – (nur Test) | 27.11.2026 | Kalender-Abo (Vorbereitung 2027/28) |
| 1.71.7.293 | – (nur Test) | 27.11.2026 | Bilder: Strichschrift ohne Linien in den Buchstaben |
| 1.71.6.292 | – (nur Test) | 27.11.2026 | Bilder: Strichschrift kräftiger |
| 1.71.5.291 | – (nur Test) | 27.11.2026 | Bilder: Strichschrift hinter dem Titel |
| 1.71.4.290 | – (nur Test) | 27.11.2026 | Hintergrundbilder: Überschriften in Großschrift |
| 1.71.3.289 | – (nur Test) | 27.11.2026 | Neuigkeiten: Mannschaftschips lesbar |
| 1.71.2.288 | – (nur Test) | 27.11.2026 | Startseite: klare Abschnitte (Verein-Design) |
| 1.71.1.287 | – (nur Test) | 27.11.2026 | Push-Einstellung „Helferdienste“ |
| 1.71.0.286 | – (nur Test) | 27.11.2026 | Helferdienste: Erinnerung am Vortag, Aushang |
| 1.70.6.285 | – (nur Test) | 27.11.2026 | Helferliste aus WhatsApp lässt sich schließen |
| 1.70.5.284 | – (nur Test) | 26.11.2026 | Laufendes Spiel nicht doppelt |
| 1.70.4.283 | – (nur Test) | 26.11.2026 | Laufendes Spiel oben auf der Startseite |
| 1.70.3.282 | – (nur Test) | 26.11.2026 | Helferdienste: Liste öffnet über dem Admin, Admin-Kasten einklappbar |
| 1.70.2.281 | – (nur Test) | 26.11.2026 | Live-Gang: Lesbarkeitsprüfung startet wieder |
| 1.70.1.280 | – (nur Test) | 26.11.2026 | Vereinsdesign: Admin-Fenster nicht mehr unter der Kopfleiste |
| 1.70.0.279 | – (nur Test) | 26.11.2026 | Helferdienste (Vorschau) |
| 1.69.0.278 | – (nur Test) | 26.11.2026 | Vereinsdesign: Restpunkte, Aufräumen; Feedback-Name freiwillig |
| 1.68.0.277 | – (nur Test) | 26.11.2026 | Neues App-Icon (Puck) in der Test-App |
| 1.67.0.276 | – (nur Test) | 26.11.2026 | Vereinsdesign: Social-Media-Bilder und Hintergrundbilder |
| 1.66.0.275 | – (nur Test) | 26.11.2026 | Festlegung auf Vereinsdesign, Einstellungen angepasst |
| 1.65.1.274 | – (nur Test) | 26.11.2026 | Design „Verein“: Admin „Zu tun“ lesbar |
| 1.65.0.273 | – (nur Test) | 26.11.2026 | Neue Designs: Seitentitel überall, „Verein“ auch für News und Admin |
| 1.64.4.272 | – (nur Test) | 26.11.2026 | Neue Designs: Wischen im Bereich „Bilanz“ |
| 1.64.3.271 | – (nur Test) | 26.11.2026 | Neue Designs: Gegnerliste kompakter |
| 1.64.2.270 | – (nur Test) | 26.11.2026 | Neue Designs: Puck mit runder Kante |
| 1.64.1.269 | – (nur Test) | 26.11.2026 | Design „Verein“: Highlight am Spieltag korrigiert |
| 1.64.0.268 | – (nur Test) | 26.11.2026 | Design „Verein“: Nächstes Spiel als Highlight mit Eisfläche |
| 1.63.5.267 | – (nur Test) | 26.11.2026 | Neue Designs: Puck dreht flüssiger |
| 1.63.4.266 | – (nur Test) | 26.11.2026 | Neue Designs: Puck steht auf der Kante und dreht sich |
| 1.63.3.265 | – (nur Test) | 26.11.2026 | Neue Designs: Puck dreht sich um seine Achse |
| 1.63.2.264 | – (nur Test) | 26.11.2026 | Design „Verein“: Wasserzeichen-Schrift sauber |
| 1.63.1.263 | – (nur Test) | 26.11.2026 | Vorschaubilder ohne News-Eintrag |
| 1.63.0.262 | – (nur Test) | 26.11.2026 | Social-Media-Downloads mit Vorschaubildern |
| 1.62.0.261 | – (nur Test) | 26.11.2026 | Neue Designs: Mannschaften+Bilanz zusammengefasst, kompakte Bilanz, Puck |
| 1.61.2.260 | – (nur Test) | 26.11.2026 | Design „Verein“: Kopf neu angeordnet |
| 1.61.1.259 | – (nur Test) | 26.11.2026 | Design-Vorschau: Korrekturen Gameday-Kopf, Spielplan-Kopf, Liste |
| 1.61.0.258 | – (nur Test) | 26.11.2026 | Design-Entwurf „Verein“ |
| 1.60.0.257 | – (nur Test) | 25.11.2026 | Design-Entwurf „Klar“ zum Umschalten |
| 1.59.1.256 | – (nur Test) | 25.11.2026 | Trikot-Design: keine runden Chips mehr, Spielplan-Kopf |
| 1.59.0.255 | – (nur Test) | 25.11.2026 | Trikot-Design Stufe 5: Downloads, Einstellungen, Info |
| 1.58.1.254 | – (nur Test) | 25.11.2026 | Trikot-Design: Filter laufen beim Scrollen mit |
| 1.58.0.253 | – (nur Test) | 25.11.2026 | Trikot-Design Stufe 4: Spieldetails, Fenster |
| 1.57.0.252 | – (nur Test) | 25.11.2026 | Trikot-Design: Saisonbilanz in der Navigation |
| 1.56.0.251 | – (nur Test) | 25.11.2026 | Trikot-Design Stufe 3: Spielplan-Kopf, Filter, Gegner |
| 1.55.3.250 | – (nur Test) | 25.11.2026 | Trikot-Design: kleinerer Kopfbereich |
| 1.55.2.249 | – (nur Test) | 25.11.2026 | Trikot-Design: Kacheln ohne Rahmen |
| 1.55.1.248 | – (nur Test) | 25.11.2026 | Trikot-Design: eckige Kacheln |
| 1.55.0.247 | – (nur Test) | 25.11.2026 | Trikot-Design Stufe 2: Karten |
| 1.54.1.246 | – (nur Test) | 25.11.2026 | Fix Vorschau-Design: Filterzeile beim Scrollen |
| 1.54.0.245 | – (nur Test) | 25.11.2026 | Neues Trikot-Design als Vorschau (Stufe 1) |
| 1.53.1.244 | – (nur Test) | 25.11.2026 | Hintergrund-Auswahl schöner |
| 1.53.0.243 | – (nur Test) | 25.11.2026 | Hintergrund: Logo in Dunkelblau |
| 1.52.3.242 | – (nur Test) | 25.11.2026 | Startbildschirm-Hintergrund kräftiger, mit Schrift |
| 1.52.2.241 | – (nur Test) | 25.11.2026 | Vereinsdesign: Variante „Startbildschirm“ |
| 1.52.1.240 | – (nur Test) | 24.11.2026 | Fan-Tipp: Eingabe und bis 40 Tore |
| 1.52.0.239 | – (nur Test) | 24.11.2026 | Einstellungen als gegliederte Liste |
| 1.51.1.238 | – (nur Test) | 24.11.2026 | Fix: Karte „App installieren“ bei installierter App |
| 1.51.0.237 | – (nur Test) | 24.11.2026 | Knopf „App installieren“ |
| 1.50.3.236 | – (nur Test) | 22.11.2026 | Saisonbilanz: „Stand nach 2 Dritteln“ verständlicher |
| 1.50.2.235 | – (nur Test) | 22.11.2026 | Trikot-Hintergrund ohne Mannschaftsauswahl |
| 1.50.1.234 | – (nur Test) | 21.11.2026 | Hintergrund „Eishalle“ hell mit Hallenbild |
| 1.50.0.233 | – (nur Test) | 21.11.2026 | Hintergrundbilder auch hell |
| 1.49.0.232 | – (nur Test) | 21.11.2026 | Downloads in Reitern |
| 1.48.1.231 | – (nur Test) | 21.11.2026 | Trikot-Hintergrund wie das Original |
| 1.48.0.230 | – (nur Test) | 21.11.2026 | Neue Funktion: Hintergrundbilder fürs Handy |
| 1.47.0.229 | – (nur Test) | 20.11.2026 | Neue Funktion: Saisonbilanz mit Reitern und neuen Statistiken |
| 1.46.1.228 | – (nur Test) | 20.11.2026 | Fix: Strafen & Special Teams in der Saisonbilanz |
| 1.46.0.227 | – (nur Test) | 20.11.2026 | Admin-Bereich nach Aufgaben geordnet |
| 1.45.0.226 | – (nur Test) | 20.11.2026 | Neue Funktion: Kapitän (C) und Assistenten (A) – ohne Eintrag in „Neu in der App“ |
| 1.44.5.224 | – (nur Test) | 20.11.2026 | Fenster: × bleibt stehen, Zurück-Taste schließt |
| 1.44.4.223 | – (nur Test) | 19.11.2026 | Admin: Geräteliste mit Entfernen |
| 1.44.3.222 | – (nur Test) | 19.11.2026 | Admin: EHV „ohne Termin“ und abgesagte Spiele |
| 1.44.2.221 | – (nur Test) | 19.11.2026 | Neu: Status „Verlegt – Termin offen“ |
| 1.44.1.220 | – (nur Test) | 19.11.2026 | Fix: zwei App-Fehler aus der Fehler-Liste |
| 1.44.0.219 | – (nur Test) | 19.11.2026 | Neue Funktionen (Wunschliste, Ein-Tipp-Feedback, Feedback-Einstiege) |
| 1.43.0.218 | – (nur Test) | 19.11.2026 | Neue Funktionen (Rückennummer, Bericht-Push, Wochenende, Wetter, Special Teams) |
| 1.42.2.217 | – (nur Test) | 19.11.2026 | Spielbericht: Meilensteine |
| 1.42.1.216 | – (nur Test) | 19.11.2026 | Neue Funktionen (Meilensteine, QR-Code, App-Verknüpfungen zur Saisonbilanz) |
| 1.41.4.214 | – (nur Test) | 18.11.2026 | Mehr Sprüche mit Namen |
| 1.41.3.213 | – (nur Test) | 18.11.2026 | Optik: Spruch des Tages ohne Hintergrund, mittig |
| 1.41.2.212 | – (nur Test) | 18.11.2026 | Optik: Spruch des Tages als dunkle Karte oben |
| 1.41.1.211 | – (nur Test) | 18.11.2026 | Fix: Admin-Link in den Einstellungen |
| 1.41.0.210 | – (nur Test) | 18.11.2026 | Neue Funktion (Spruch des Tages) |
| 1.40.6.209 | – (nur Test) | 17.11.2026 | Fix: Start-Animation-Fehler |
| 1.40.5.208 | – (nur Test) | 17.11.2026 | Linien-Icons in Einstellungen, Gegner, Regeln |
| 1.40.4.207 | – (nur Test) | 17.11.2026 | News: Linien-Icons statt Emojis |
| 1.40.3.206 | – (nur Test) | 17.11.2026 | Fix: verlegtes Spiel gilt nicht mehr als abgesagt |
| 1.40.2.205 | – (nur Test) | 16.11.2026 | „Teilen“ als Bild |
| 1.40.1.203 | – (nur Test) | 16.11.2026 | Optik (Icons, Leerzustände, Übergänge, Dunkelmodus) |
| 1.40.0.202 | – (nur Test) | 16.11.2026 | Neue Funktion (Fehlerübersicht, Regelcheck, Optik) |
| 1.39.1.200 | – (nur Test) | 13.11.2026 | Fan-Tipp: kein Gleichstand |
| 1.39.0.199 | 13.11.2026 | 13.11.2026 | Umbau |
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

## Version 1.73.7

- Startseite (Verein-Design): Die Überschriften „Weitere Spiele“ und „Letzte Ergebnisse“ fehlten auf einem Handy. `vHomeSecs` ist jetzt gegen Fehler abgesichert und wird zusätzlich von einem MutationObserver auf `#homeView` nach jedem Umbau der Startseite neu ausgeführt.

## Version 1.73.6

- Fehler behoben: Der Tab „Mehr“ erschien auch im aktuellen Design (eine allgemeine Tab-Regel überschrieb das Ausblenden). Jetzt nur im Verein-Design.

## Version 1.73.5

- Admin › Rückmeldungen › App-Fehler: jede Meldung hat einen Haken „erledigt“ (löscht den Eintrag in `appErrors`; tritt der Fehler wieder auf, erscheint er neu). Der Knopf unten markiert alle als erledigt (mit Rückfrage) statt nur Meldungen älter als 14 Tage zu löschen.

## Version 1.73.4

- Fehler behoben: „Kalenderdatei laden“ mit eigener Auswahl brach ab (`teamName(t.replace)`), ebenso der Spielplan-Druck (`teamName(esc)`, gemeldet als App-Fehler am 22.11. von iOS). Beide Aufrufe korrigiert.
- Admin-Reiter im Verein-Design: Breite nach Textlänge, „Rückmeldungen“ wird nicht mehr abgeschnitten; Reiterleiste eckig.

## Version 1.73.3

- Kopf im Verein-Design: Titel und Strichschrift ein Stück nach rechts (Abstand zum Logo 20 px, Strichschrift ab 90 px), damit die Strichschrift nicht ans Logo stößt.

## Version 1.73.2

- Kopf im Verein-Design etwas kleiner: Strichschrift „GRIZZLYS“ rund ein Drittel kleiner, Titel „Young Grizzlys“ etwas kleiner.

## Version 1.73.1

- Kopf im Verein-Design: „Young Grizzlys“ wieder in einer Zeile und größer, dahinter „GRIZZLYS“ groß in Strichschrift (`.hero::after`, rechts angeschnitten wie bei den Seitenköpfen). Platz rechts ist frei, seit die Knöpfe oben entfallen sind.

## Version 1.73.0

- **Navigation im Verein-Design.** Die Knöpfe oben (Neuigkeiten, Einstellungen, Info) entfallen; in der unteren Leiste ersetzt „Mehr“ den Tab Downloads. „Mehr“ öffnet ein kleines Menü mit Downloads, Neuigkeiten (Anzahl ungelesen), Einstellungen und Info; ungelesene Neuigkeiten zeigen einen roten Punkt auf „Mehr“. „Mehr“ ist aktiv markiert, solange Downloads, Einstellungen oder Info offen sind.
- Wischen erreicht jetzt alle Seiten: Start › Spielplan › Gegner › Bilanz › Downloads › Einstellungen › Info (Neuigkeiten bleiben ein Fenster). Wisch-Punkte passen sich der Anzahl an, Hinweistexte nennen die Seiten beim Namen.

## Version 1.72.3

- **Saisonwechsel (Admin › Technik › Saison).** Neue Cloud Function `seasonImport` (`functions/season.js`, nur Admin, nur lesen): holt zu eingegebenen EHV-Liganummern alle Grizzlys-Spiele und liefert den fertigen Text für `spielplan.js` (Hallen per `rinkAddresses`, sonst über den Namen der Heimmannschaft; Spiele ohne Termin werden gezählt, aber nicht übernommen). Im Admin: Eingabe je Mannschaft (Zahl oder EHV-Link mit divisionId), Vorschau, Download „spielplan.js“, Checkliste Saisonstart (auf dem Gerät gespeichert).
- **App Check vorbereitet.** `APP_CFG.appCheckKey` in index.html (leer = aus). Mit Schlüssel wird Firebase App Check (reCAPTCHA v3) per dynamischem Import aktiviert; Durchsetzen erst später in der Firebase-Konsole. reCAPTCHA-Badge ausgeblendet – vor dem Einschalten Hinweis in den Datenschutz aufnehmen.

## Version 1.72.2

- Dunkelmodus-Durchgang (Verein-Design): B-/U13-Buchstaben auf Orange/Gold mit dunkler Schrift (Kontrast), alle Fenstertitel in schmaler Großschrift wie die Neuigkeiten.
- Tabs antippen: neue Seite gleitet aus der passenden Richtung herein (`vSlide`, Klassen `vInR`/`vInL`); beim Wischen bleibt die eigene Bewegung (`window.__swNav`).
- Solange die Ergebnisse laden: graue Platzhalter in „Mannschaften“ (Startseite) und in der Saisonbilanz statt „noch keine Ergebnisse“; Bilanz baut sich nach dem Laden neu auf.

## Version 1.72.1

- Hintergrundbilder im Vereinsdesign: Strichschrift hinter den Titeln auch bei Vereinsdesign (alle vier Stile), Trikot, Nächstes Spiel (Wochentag) und Advent. `icGhost` passt mittige Strichschrift automatisch an die Bildbreite an (optional `maxW`).

## Version 1.72.0

- **Kalender-Abo (Vorbereitung Saison 2027/28).** Neue Cloud Function `calendarFeed` (`functions/calendar.js`, europe-west1): liefert den Spielplan als iCalendar-Feed, Parameter `t` (Mannschaften, z. B. `A,B`) und `v` (`home`/`away`). Quellen: `spielplan.js` der Live-App, `scheduleOverrides` (Verlegung/Absage, gleiche Regeln wie in der App) und `results` (Endstand im Termin-Titel aus Grizzlys-Sicht). Hallen-Adressen liest der Feed aus `rinkAddresses` in `js/app.js`. Zwischenspeicher 15 Min., Kalender holen alle ~4 Std. neu.
- In der Kalender-Auswahl (Downloads › Spielplan) Abschnitt „Kalender abonnieren“ mit webcal-Link, Google-Kalender-Link und „Link kopieren“ – vorerst nur mit Vorschau-Schalter (Verein-Design). Funktioniert erst, wenn die Function mit „Live gehen“ deployt ist; in der Live-App bleibt der Abschnitt bis zum Saisonstart unsichtbar.

## Version 1.71.7

- Strichschrift in den Bildern: Umriss wird auf einer eigenen Ebene gezeichnet und das Buchstabeninnere ausgestanzt (`destination-out`). Damit fallen die Linien weg, die die Handy-Schrift (überlappende Konturen) sonst in den Buchstaben zeigt.

## Version 1.71.6

- Strichschrift hinter den Bildtiteln kräftiger (dickere Linie, höhere Deckkraft).

## Version 1.71.5

- Social-Media-Bilder und Hintergrundbild „Spiele des Monats“ im Vereinsdesign: große Umriss-Schrift (Strichschrift) hinter der Überschrift wie in den Seitenköpfen (`icGhost`).

## Version 1.71.4

- Hintergrundbilder im Vereinsdesign: Überschriften in Großschrift (Datum bei „Nächstes Spiel“, Monat/„Nächste Spiele“, „Frohe Weihnachten“) über `IC_.up()`; `wpFitFont` verkleinert sie, falls sie nicht in die Breite passen.

## Version 1.71.3

- Neuigkeiten (Berichte, Änderungen, Hinweise): Mannschaftschips im Verein-Design wieder lesbar – die Einträge tragen die Mannschaft als `data-team`, nicht als Klasse, deshalb fehlte die Chipfarbe (weiße Schrift auf hellem Grund).

## Version 1.71.2

- Startseite im Verein-Design übersichtlicher: eigene Überschriften „Weitere Spiele“ und „Letzte Ergebnisse“, keine doppelte Beschriftung „Nächstes Spiel“ mehr, Ergebniszeilen ohne farbigen Verlauf (Sieg/Niederlage zeigt das Etikett).

## Version 1.71.1

- **Push-Einstellung „Helferdienste“.** In Einstellungen › Push-Nachrichten gibt es unter „Erinnerung am Vortag“ den Schalter „Helferdienste“ (Standard an, `prefs.helpers`). Sichtbar, sobald die Helferdienste aktiv sind (Test-App mit Vorschau-Schalter bzw. später für alle). `helperReminder` überspringt Geräte mit ausgeschaltetem Schalter.

## Version 1.71.0

- **Helferdienste (Vorschau) – Erinnerung am Vortag.** Neue Cloud Function `helperReminder` (täglich 18:00 Uhr): sucht Einträge für Spiele am nächsten Tag (`helpers` und `helpersTest`), ordnet sie über die Geräte-Kennung (`iid` im Eintrag = `installationId` in `pushTokens`) den Push-Tokens zu und schickt je Gerät und Spiel eine Meldung „Morgen Heimspiel U15 A – danke fürs Helfen!“ mit allen eingetragenen Diensten (Test-Einträge mit „[Test]“). Tippen öffnet die Helferliste (`go=helfer-<Spiel-ID>`). Einträge speichern dafür zusätzlich `label` (Name des Dienstes) und `iid`; die Firestore-Regeln erlauben beide Felder (optional, begrenzte Länge). Ohne Push keine Erinnerung – Hinweis steht unter der Liste.
- **Aushang drucken.** Neuer Knopf in der Helferliste: öffnet eine A4-Seite (schwarz-weiß) mit Spiel, Datum, Halle und allen Diensten – eingetragene Namen stehen auf den Linien, freie Plätze bleiben als Linie zum Handeintrag; unten der Link zur Online-Liste. Der Druckdialog öffnet sich automatisch.

## Version 1.70.6

- **Helferdienste (Vorschau) – Schließen nach Öffnen per Link.** Wurde die Liste über den WhatsApp-Link geöffnet (`#helfer/…`), öffnete sie sich nach dem × sofort wieder: Die Zurück-Logik (1.44.5) springt beim Schließen einen Verlaufseintrag zurück – auf die Adresse mit `#helfer/…`, was erneut öffnete, weil der Anker vorher schon entfernt worden war. Jetzt wird der Anker erst danach entfernt, und eine bereits offene Liste wird nicht erneut geöffnet.

## Version 1.70.5

- **Laufendes Spiel nicht doppelt.** Unter „Letztes Spiel“ bzw. „Letzte Ergebnisse“ erscheinen nur noch abgeschlossene Spiele; das laufende steht ausschließlich oben (gemeinsame Prüfung `isLiveNow`).

## Version 1.70.4

- **Laufendes Spiel oben auf der Startseite (für alle).** Bisher zeigte die oberste Karte nur Spiele, deren Bully noch bevorsteht – ein laufendes Spiel rutschte zu „Letztes Spiel“ bzw. „Letzte Ergebnisse“. Jetzt steht ein laufendes Spiel (Bully vorbei, noch kein Endstand, höchstens 2,5 Std.) als erste Karte mit der Beschriftung „Läuft gerade“ (inkl. Live-Stand, falls vorhanden), darunter die nächsten Spiele. Kein Eintrag in „Neu in der App“.

## Version 1.70.3

- **Helferdienste (Vorschau) – Admin.** „Öffnen“ zeigte die Liste hinter dem Admin-Bereich (Ebene 50 statt über 1100) – Helferliste und Vorlage liegen jetzt darüber. Der Kasten „Helferdienste (Vorschau)“ in Technik › Neue Saison ist einklappbar wie „Veröffentlichen“ (zu Beginn zu, rechts „an/aus“).

## Version 1.70.2

- **Live-Gang wieder möglich.** Die Lesbarkeitsprüfung bildet die Firebase-Module nach; ihr Anmelde-Modul kennt `signInAnonymously` nicht, deshalb startete die App dort nicht („Kontrast 0.00 – Skriptfehler“) und der Live-Gang wurde gesperrt. `signInAnonymously` wird jetzt erst beim ersten Eintragen in eine Helferliste nachgeladen (`import()`), der statische Import entfällt. In der echten App ändert sich nichts.

## Version 1.70.1

- **Vereinsdesign (Vorschau) – Fenster über der Kopfleiste.** `main` hatte im neuen Design `z-index:1` und bildete dadurch einen eigenen Stapel: Admin-Bereich und andere Fenster (z-index 1100) lagen unter der eingeblendeten Kopfleiste, das Schließen-Kreuz war verdeckt. Jetzt `z-index:auto`.

## Version 1.70.0

- **Helferdienste (Vorschau für 2027/28).** Je Heimspiel eine Helferliste aus einer gemeinsamen Vorlage (Standard: 9 Dienste „Für das Spiel“, 11 Positionen „Verpflegung“, mit Anzahl der Plätze). Sie erscheint automatisch 5 Tage vor dem Spiel: Hinweis „Helfer gesucht/komplett“ in der Spielkarte (antippbar) und Kachel „Helferdienste“ in den Details mit Fortschritt. Die Liste öffnet sich auch über einen Link ohne App (`…/#helfer/<Spiel-ID>`, Spiel-ID = ursprünglicher Termin, wandert bei Verlegung mit; bei Absage keine Liste). Eintragen mit frei gewähltem Namen (wird auf dem Gerät gemerkt), „Ich mach's/Ich bring's“ je Platz; austragen kann nur das eintragende Gerät (anonyme Firebase-Anmeldung, gleiche uid) oder der Admin. „In WhatsApp teilen“ erzeugt einen Text mit allen noch offenen Diensten und dem Link, „Link kopieren“ kopiert nur den Link.
- **Admin › Technik › Neue Saison › Helferdienste:** Schalter (nur dieses Gerät, nur Test-App), kommende Heimspiele mit „Liste“ an/aus und „Öffnen“, „Vorlage bearbeiten“ (Bereich, Dienst, Hinweis, Anzahl; Standard wiederherstellen). Vorlage und An/Aus liegen in `helperCfg/template` bzw. `helperCfg/games` (auch für die spätere Live-App).
- **Daten und Datenschutz:** Einträge in `helpers` (Live) bzw. `helpersTest` (Test-App; Schreiben ist für diese Sammlung in der Test-App ausdrücklich erlaubt). Neue Firestore-Regeln (`helperEntryOk`, nur festgelegte Felder, Name 2–40 Zeichen). Neue Cloud Function `helperCleanup` (täglich 4:15 Uhr) löscht Einträge 3 Tage nach dem Spiel. Regeln und Function werden beim nächsten „Live gehen“ automatisch veröffentlicht – erst danach funktioniert das Eintragen in der Test-App.
- **Einmalig in der Firebase-Konsole:** Authentication › Sign-in method › „Anonym“ aktivieren. Ohne diesen Schritt zeigt die Liste „Eintragen ist gerade nicht möglich (Anmeldung bei Firebase noch nicht eingerichtet)“.
- Admin-Status zeigt bei anonymer Anmeldung weiterhin „Nicht angemeldet“.

## Version 1.69.0

- **Vereinsdesign (Vorschau) – Restpunkte.** Spielplan-Liste: Ergebnis je Team in eigener Zeile neben dem Teamnamen (`.gzScore` jetzt mit `<i>`-Teilen), Sieg/Niederlage-Hinweis links daneben. „Letzte Ergebnisse“ wie die Liste: Datum oben in Blau, Mannschafts-Chip rechts oben, Teams untereinander mit Logos, Ergebnis je Team. Kalenderansicht (Rahmen, Monatstitel, Wochentage, Heute-Markierung, Knöpfe, Filter-Chips) und Gegner-Karte (Filter-Chips, „Karte laden“, Kartenrahmen) im Vereinsstil.
- **Aufräumen der Designvorschläge.** Trikot und Klar sind entfernt: statt drei Klassen (`d27`, `d28`, `d29`) gibt es nur noch `html.dv` für das Vereinsdesign (Spezifität der Regeln unverändert); tote Regeln nur für Trikot/Klar (Sammelregel „keine runden Ecken“, Trikotstreifen im Kopf) und das Streifen-SVG im Kopf gelöscht. Das vollständige Zusammenführen der Stilblöcke bleibt für die Sommerpause vorgemerkt.
- **Feedback: Name freiwillig (für alle).** Das Namensfeld ist kein Pflichtfeld mehr („Name (freiwillig)“); leer wird „anonym“ gespeichert, die Firestore-Regel bleibt unverändert. Kein Eintrag in „Neu in der App“.

## Version 1.68.0

- **Neues App-Icon für die Saison 2027/28 (nur Test-App).** Liegender 3D-Puck mit Vereinslogo auf dem Bullypunkt einer hellen Eisfläche (rote Mittellinie, blauer Bullykreis). Die Test-App nutzt es ab sofort (mit orangem TEST-Band): `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` (Puck kleiner, damit er in runden Masken vollständig bleibt). Die Live-Icons bleiben unverändert – sie stehen in `live.sh` unter NUR_LIVE. Die fertigen Live-Varianten ohne TEST-Band liegen in `img/icons-2027/` bereit; zum Saisonstart diese drei Dateien im Live-Repo über `icon-192.png`, `icon-512.png` und `icon-maskable-512.png` kopieren.

## Version 1.67.0

- **Vereinsdesign (Vorschau) – erzeugte Bilder.** Social-Media-Bilder (Spieltag, Ergebnis, Verlegung, Wochenende, Tabelle, Jahresrückblick) und Hintergrundbilder nutzen eine gemeinsame Farbpalette `IC_`: im Vereinsdesign Anthrazit und Grau statt Navy, Logo-Blau statt Orange als Akzent, Hallenfoto in Graustufen, Überschriften in schmalen Großbuchstaben statt Pinselschrift. Mannschaftsfarben (U15 A blau, U15 B orange, U13 gelb) bleiben. Ohne Vorschau sehen alle Bilder exakt aus wie bisher. Vorschaubilder in den Downloads werden je Design getrennt zwischengespeichert.

## Version 1.66.0

- **Festlegung auf das Vereinsdesign (Vorschau).** Auswahl in Admin › Technik › Neue Saison nur noch „Aus / Verein“; Trikot und Klar sind entfernt. Gespeicherte Werte `on`/`e` werden als „Verein“ behandelt. Technisch baut „Verein“ weiter auf den Stilebenen `d27`/`d28` auf (immer zusammen mit `d29` gesetzt) – das Zusammenführen der CSS-Blöcke ist für den Umbau in der Sommerpause vorgemerkt.
- **Einstellungen im Vereinsdesign.** Gruppentitel wie überall mit blauem Strich und gesperrter Schrift; Symbole einfarbig im Kreis statt bunter Kacheln; „Aktiv“ in Blau, „Aus“ neutral; Hinweis „Push ist aus“ grau mit blauem „Einschalten“-Knopf statt Orange.

## Version 1.65.1

- **Design „Verein“ (Vorschau) – Admin.** Box „Zu tun“ war weiß auf weiß: jetzt anthrazit mit heller Schrift und blauer Überschrift. Design-Auswahl Aus/Trikot/Klar/Verein als runde Leiste, aktive Auswahl blau.

## Version 1.65.0

- **Neue Designs (Vorschau) – Seitentitel überall.** Downloads, Einstellungen und Info haben jetzt wie Spielplan, Gegner und Bilanz einen Seitentitel (`.vPage`, nur in den neuen Designs sichtbar; der blaue Einstellungen-Kopf entfällt dort). In „Verein“ mit Wasserzeichen MEDIA, SETUP, INFO. „Verein“ jetzt auch im News-Fenster (Titel schmal in Großbuchstaben, runde Karten, blaue Datumszeilen) und im Admin-Bereich (Anthrazit-Kopf, Reiter als Pill-Leiste mit blauem aktivem Reiter, Gruppentitel mit blauem Strich, runde Boxen, Pill-Knöpfe, runde Eingabefelder).

## Version 1.64.4

- **Neue Designs (Vorschau) – Wischen im Bereich „Bilanz“.** `#statsView` fehlte in der Liste der Bereiche, in denen die Wischgeste startet. Jetzt lässt sich auch aus der Bilanz wischen; außerdem startet die Geste auch im leeren Bereich unter kurzen Seiten (ganzes `main`).

## Version 1.64.3

- **Neue Designs (Vorschau) – Gegnerliste.** In „Verein“ kleinere Abstände zwischen und in den Gegnerkarten, kleinere Logos und ein schmalerer Route-Knopf. In allen neuen Designs darf die Zeile „2 Spiele · U15 B · 170 km“ umbrechen, statt unter den Route-Knopf zu laufen.

## Version 1.64.2

- **Neue Designs (Vorschau) – Puck mit runder Kante.** In der Schrägansicht wirkte der Puck „abgeschnitten“, weil die Kante nur aus einer Fläche in der Mitte bestand. Jetzt bilden 18 schmale Flächen rundum eine echte zylindrische Kante (`.pkE`, abwechselnd hell/dunkel für die Riffelung), dazu Vorder- und Rückseite mit Logo.

## Version 1.64.1

- **Design „Verein“ (Vorschau) – Highlight am Spieltag.** Wetter und Spielort („Heimspiel/Auswärtsspiel“ + Halle, ggf. Route) stehen jetzt unter Datum und Chips statt über der Eisfläche; Wetter dunkel hinterlegt, Spielort hell lesbar. Puck bekommt mehr Platz und wird beim Drehen nicht mehr abgeschnitten.

## Version 1.64.0

- **Design „Verein“ (Vorschau) – „Nächstes Spiel“ als Highlight.** Die oberste Karte auf der Startseite ist dunkel (anthrazit), quer durch läuft eine helle Eisfläche mit dezenten Markierungen (rote Mittellinie, zwei blaue Linien, Bullykreis – reine CSS-Verläufe). Logos und Teamnamen stehen auf dem Eis, der Puck dreht sich genau auf dem Mittelpunkt (Mittelspalte fest, Puck absolut zentriert). Datum, Countdown und Kopfzeile hell auf dunkel; im Dunkelmodus ist das Eis etwas gedämpft. Gilt nur für „Verein“.

## Version 1.63.5

- **Neue Designs (Vorschau) – Puck dreht flüssiger.** Das Zucken kam vom Neusortieren der 11 Schichten, wenn der Puck genau hochkant steht. Jetzt nur noch Vorder- und Rückseite (jeweils mit ausgeblendeter Rückfläche) plus eine geriffelte Kantenfläche; Animation mit festem Start- und Endwinkel und `will-change`.

## Version 1.63.4

- **Neue Designs (Vorschau) – Puck steht auf der Kante.** Der Puck (`.g3Puck`) enthält jetzt einen 3D-Körper `.pk3` aus 11 Schichten (Vorder- und Rückseite mit Vereinslogo, dazwischen die Kante) und dreht sich hochkant um die senkrechte Achse (`rotateY`, 5 s je Umdrehung), mit Schatten am Boden. Bei „Bewegung reduzieren“ steht er leicht schräg still. Im bisherigen Design unverändert (`.pk3` ausgeblendet).

## Version 1.63.3

- **Neue Designs (Vorschau) – Puck dreht sich um seine Achse.** Oberseite jetzt als echte 3D-Scheibe mit aufgedrucktem Vereinslogo (`rotateX(72deg)` + `rotateZ` animiert, 6 s je Umdrehung); die geriffelte Kante läuft passend mit. Bei „Bewegung reduzieren“ still.

## Version 1.63.2

- **Design „Verein“ (Vorschau) – Wasserzeichen sauber.** Die umrandete Hintergrundschrift (PLAN, TEAMS, STATS) zeigte bei manchen Buchstaben innere Linien, weil `-webkit-text-stroke` auch überlappende Glyphenteile nachzeichnet. Jetzt Umriss über acht 1-px-Schatten in deckender Mischfarbe, Füllung in Hintergrundfarbe – saubere Konturen auf allen drei Seiten, hell und dunkel.

## Version 1.63.0

- **Downloads › Social Media mit Vorschaubildern (für alle).** Statt der Symbole (Kalender, Pokal, Tabelle) zeigt jeder Eintrag ein kleines Vorschaubild des fertigen Bildes (48×60). Erzeugt mit denselben Zeichenfunktionen wie das große Bild (`instaDraw`, `instaTable`, `instaYear`, `instaWeekend`), aber erst, wenn der Eintrag sichtbar wird (IntersectionObserver), nacheinander und als kleines JPEG im Speicher zwischengespeichert (`instaThumbCache`, Schlüssel je Bildart, Spiel und Ergebnis bzw. Tabellenstand). Bis dahin bleibt das Symbol stehen und pulsiert leicht. Kein Eintrag in „Neu in der App“ (ab 1.63.1 wieder entfernt).

## Version 1.62.0

- **Neue Designs (Vorschau) – Startseite und Saisonbilanz.** „Mannschaften“ und „Saisonbilanz“ auf der Startseite zu einem Block zusammengefasst (`renderHomeTeams27`, `#homeTeams27`): eine Zeile je Mannschaft mit Buchstabe, Name, Tabellenplatz, Liga und Spielfortschritt, Formpunkten der letzten 5 Spiele, Siege–Niederlagen groß, Tore und Differenz, Fortschrittsbalken unten; Antippen öffnet den Bereich „Bilanz“ mit dieser Mannschaft. Saisonbilanz kompakter: Kapitäns-Chips klein in einer Zeile (nur „C 43“, ohne „Kapitän“), Zahlen-Kacheln in 4er- bzw. 3er-Reihe mit kleinerer Schrift. Puck neu: gerade Seitenkante, dicker (Verhältnis näher am echten Puck), dreht sich langsam (Lichtreflex oben und geriffelte Kante laufen mit; bei „Bewegung reduzieren“ still). Ohne Vorschau unverändert.

## Version 1.61.2

- **Design „Verein“ (Vorschau) – Kopf neu angeordnet.** „YOUNG GRIZZLYS“ zweizeilig neben dem Logo, Saison- bzw. Bully-Chip direkt unter dem Logo (Logo ragt nicht mehr über). „GAMEDAY“-Leuchtschrift rechts auf Höhe des Chips, nicht mehr tiefer als der übrige Kopf.

## Version 1.61.1

- **Design-Vorschau – Korrekturen nach Handy-Test.** Leuchtschrift „GAMEDAY“ im Kopf sitzt in allen neuen Designs unten rechts statt über den Knöpfen oben. Spielplan-Kopf: Tabellen-Knöpfe rutschen in eine eigene Zeile, wenn sie nicht neben den Titel passen (z. B. mit U13 drei Knöpfe). „Verein“-Liste: Datum bleibt einzeilig, oben nur der Mannschafts-Chip (Verlegt/Heim/Auswärts stehen rechts bzw. in den Details). Titel im Kopf etwas schmaler.

## Version 1.61.0

- **Design-Entwurf „Verein“ (Vorschau).** Vierte Auswahl in Admin › Technik › Neue Saison (`grizzlysD27`=`v`, setzt `html.d27.d28.d29`). Angelehnt an grizzlys-bergkamen.de, ohne zu kopieren: Anthrazit-Kopf, Logo ragt unten über, schmale Großbuchstaben (Systemschrift Roboto Condensed bzw. Arial Narrow), Abschnittstitel mit blauem Strich und gesperrter Schrift, Seitentitel mit umrandetem Wasserzeichen (PLAN, TEAMS, STATS), Logo-Blau `#0A7FE0` als Akzent. Karten rund (14 px) mit dünnem Rand; auf der Startseite oben graue Logofläche, darunter Datum in Blau. Knöpfe als Pill mit Umriss, „Tipp abgeben“ gefüllt blau. Spielplan als Liste: Datum und Mannschafts-Chip oben, darunter Heim- und Gastteam untereinander mit kleinen Logos, Ergebnis rechts; angetippt klappt die Karte wie gewohnt auf. Die Sammelregel „keine runden Ecken“ gilt nicht für „Verein“.

## Version 1.60.0

- **Design-Entwurf „Klar“ (Vorschau) zum Umschalten.** Admin › Technik › Neue Saison: statt Schalter jetzt Auswahl „Aus / Trikot / Klar“ (`grizzlysD27` = `off`/`on`/`e`; „Klar“ setzt `html.d27.d28`). „Klar“ baut auf dem Trikot-Design auf: dunkelblauer Kopf mit gerader Kante (ohne Streifen), weißer Hintergrund, Kacheln über die volle Breite ohne abgeschrägte Ecken und ohne Balken, Kachel in Pastell je Mannschaft (U15 A hellblau, U15 B hellorange, U13 hellgelb; dunkel: gedeckte Töne), Datum oben in einer Zeile statt Spalte links, „Nächstes Spiel“ als ruhige Überschrift. Analytics `design27_toggle` mit `variant`.

## Version 1.59.1

- **Trikot-Design (Vorschau) – keine runden Ecken mehr.** Eine Sammelregel setzt im Trikot-Design überall die Eckenrundung auf 0 (Wetter-, Spielbericht-, Torschützen-, Tabellenplatz-, Filter- und „Verlegt“-Chips, Saison-Chip und Kopf-Knöpfe, Knöpfe bei „Deine Stimme zählt“, alle Rahmen in der Saisonbilanz, Filter auf der Gegner-Karte …). Rund bleiben bewusst: Logos und Bilder, Schalter (an/aus), Formpunkte, Live- und Hinweispunkte, Puck, Kartenmarker und die Saison-Designs (Weihnachten/Halloween). Spielplan-Kopf: Spielanzahl steht unter „Spielplan“, damit „Tabelle A/B“ auf schmalen Handys nicht mehr über dem Titel liegt. Vereinsname im Kopf bleibt einzeilig (Schrift passt sich der Breite an). Fan-Tipp: +/− und Eingabefeld etwas schmaler, damit auf 360-px-Handys nichts abgeschnitten wird. Nur mit eingeschalteter Vorschau.

## Version 1.59.0

- **Trikot-Design (Vorschau) – Stufe 5: Downloads, Einstellungen, Info.** Alle Info- und Einstellungskarten eckig mit abgeschrägten Ecken, ohne Schatten. Download-Einträge, Wegweiser-Zeilen und Mannschafts-Links als eckige Kacheln mit dezentem Farbbalken links. Hinweis „Benachrichtigungen“ mit orangem Balken. Einstellungs-Fenster eckig mit abgeschrägter Ecke. Hintergrundbilder: Vorschauen, Auswahl-Segmente und Chips eckig, Auswahl schwarz (dunkel: Trikotblau). Nur mit eingeschalteter Vorschau.

## Version 1.58.1

- **Trikot-Design (Vorschau) – Filter laufen mit.** Beim Scrollen bleiben oben unter der Kopfleiste stehen: Mannschaftswahl in „Bilanz“ (die Reiter Überblick/Verlauf/… direkt darunter), Suchfeld bei den Gegnern und die Reiter in den Downloads (jetzt auch eckig, aktiver Reiter schwarz). Nur mit eingeschalteter Vorschau.

## Version 1.58.0

- **Trikot-Design (Vorschau) – Stufe 4: Spieldetails und Fenster.** Aufgeklappte Spielkarte: Fan-Tipp, Spielort und Ergebnis-Kacheln eckig auf hellblauem Grund, „Tipp abgeben“ und „Route“ schwarz mit abgeschrägter Ecke, +/− und Kalender/Erinnerung/Teilen eckig. Spielbericht mit schwarzem Balken links. Alle Fenster (`.matchModalBox`: Spieldetails, Saisonbilanz, Gegner …) eckig mit abgeschrägter Ecke oben rechts und schwarzem Kopf (dunkel: Trikotblau). Reiter der Saisonbilanz als eckige Segmente, aktiver Reiter schwarz. Nur sichtbar mit eingeschalteter Vorschau.

## Version 1.57.0

- **Trikot-Design (Vorschau) – Saisonbilanz als eigener Bereich.** In der unteren Navigation ersetzt „Bilanz“ den Punkt „Regeln“. Neuer Bereich `#statsView` mit Mannschaftsauswahl (gemerkt in `grizzlysStatsTeam`) und der kompletten Saisonbilanz (`bilanzHtml`, Reiter Überblick/Verlauf/Liga/Nummern, Reiterleiste klebt unter der Kopfleiste). Regeln sind in der Info als eigene Karte „Regeln & Begriffe“ erreichbar. Wischen zwischen den Bereichen folgt der neuen Reihenfolge. Die Saisonbilanz-Kachel auf der Startseite öffnet weiter das Fenster. Ohne Vorschau bleibt alles wie bisher. Analytics: `stats_opened`, `saisonbilanz_opened` mit `src:"nav"`.

## Version 1.56.0

- **Trikot-Design (Vorschau) – Stufe 3: Spielplan-Kopf, Filter, Gegner.** Umschalter Liste/Kalender und Liste/Karte als eckige Segmente (aktiv schwarz, dunkel: Trikotblau). Filter, Suchfeld, Tabellen-Links und Monatsleiste eckig; aktueller Monat schwarz. „Heute“- und Route-Knopf schwarz mit abgeschrägter Ecke. Monatsanzeige an der Scroll-Leiste eckig. Gegnerkarten wie die Spielkarten: abgeschrägte Ecken, dezenter Farbbalken links (U15 A blau, U15 B orange). Nur sichtbar mit eingeschalteter Vorschau.

## Version 1.55.3

- **Trikot-Design (Vorschau) – kleinerer Kopfbereich.** Logo 54 statt 76 px, weniger Abstand unten, Trikotstreifen flacher (88 statt 150 px). Der Kopfbereich ist rund 90 px niedriger, Inhalte rücken nach oben. Nur sichtbar mit eingeschalteter Vorschau.

## Version 1.55.2

- **Trikot-Design (Vorschau) – Kacheln ohne Rahmen.** Die abgeschrägten Ecken bleiben, der schwarze/blaue Rahmen entfällt. Stattdessen ein dezenter Farbbalken links in der Mannschaftsfarbe (70 % Deckkraft; „Nächstes Spiel“ kräftiger, 5 px), bei Mannschaftskarten oben. Neutrale Karten (letzte Ergebnisse, Saisonbilanz, Feedback) mit blassblauem Balken. Nur sichtbar mit eingeschalteter Vorschau.

## Version 1.55.1

- **Trikot-Design (Vorschau) – eckige Kacheln.** Spielkarten, letzte Ergebnisse, Mannschafts- und Saisonbilanz-Karten haben keine runden Ecken mehr, sondern zwei abgeschrägte Ecken (oben rechts, unten links) wie ein Trikot-Patch, mit durchgehendem schwarzem Rahmen (dunkel: Trikotblau) inklusive Schrägen. Mannschaftsfarbe als Streifen innen links bzw. oben. „Nächstes Spiel“ mit kräftigerem Rahmen und größerer Schräge. Countdown-Kästchen eckig. Nur sichtbar mit eingeschalteter Vorschau.

## Version 1.55.0

- **Trikot-Design (Vorschau, `html.d27`) – Stufe 2: Karten.** Spielkarten (Startseite und Spielplan, `.card.gz3`): weiß bzw. #15212f, runde Ecken, Mannschaftsfarbe nur noch als schmaler Streifen links, Kopfband schwarz (dunkel: Trikotblau), Datumsspalte hell. „Nächstes Spiel“ als weiße Karte statt Hallenfoto, Countdown in hellen Kästchen. Letzte Ergebnisse: weiße Karte, Kopfzeile dezent, Siege schwarz, Niederlagen hellblau. Mannschafts- und Saisonbilanz-Karten weiß mit Farbstreifen oben. Nur sichtbar mit eingeschalteter Vorschau.

## Version 1.54.1

- **Fix im Vorschau-Design:** Die mitlaufende Filterzeile im Spielplan (und weitere `.stickyFilters`) hing beim Scrollen mitten im Bild, weil ihr Abstand oben noch die Höhe der Reiterleiste enthielt – die liegt im neuen Design unten. Mit `html.d27` jetzt direkt unter der Kopfleiste; „Heute“-Sprung (`stickyOffset`) entsprechend angepasst.

## Version 1.54.0

- **Neues Trikot-Design für 2027/28 als Vorschau – Stufe 1.** Schalter in Admin › Technik › „Neue Saison“ (nur dieses Gerät, `localStorage` `grizzlysD27`, Klasse `html.d27`, wird schon im `<head>` gesetzt). Hat Vorrang vor Halloween/Weihnachten (deren Klassen werden entfernt, solange die Vorschau an ist). Alle anderen sehen unverändert das bisherige Design.
- Stufe 1: Grundfarben (Hintergrund Eisblau #dcebfa bzw. Nachtblau #0d1520, Karten weiß bzw. #15212f, Akzent Schwarz bzw. Trikotblau), Kopfbereich hellblau mit weichem Übergang und geschwungenen Trikotstreifen (`.d27sw`, SVG im Header), Navigation als Leiste unten (die bisherigen 5 Reiter), Mini-Kopfleiste beim Scrollen blau.
- Nächste Stufen: Startseite (Nächstes Spiel, letzte Ergebnisse), Spielplan, Saisonbilanz als eigener Navigationspunkt, Gegner, Spieldetails, Downloads, Einstellungen, Admin.
- Analytics: `design27_toggle`.

## Version 1.53.1

- **Auswahl im Hintergrundbild-Fenster neu gestaltet:** statt loser Knöpfe je Zeile eine kleine Überschrift (Hintergrund · Stil · Logo · Verwendung bzw. Trikot/Mannschaft) und ein Segment-Schalter wie bei den Reitern, mit Symbolen (Mond/Sonne, Schloss/App-Raster, kleines Logo farbig/dunkelblau). Die vier Stile erscheinen als Mini-Vorschaubilder mit den aktuellen Einstellungen. Handy-Vorschau etwas kleiner, Speichern-Knöpfe bleiben unten sichtbar.

## Version 1.53.0

- **Vereinsdesign: Auswahl „Logo farbig / Logo dunkelblau“.** Dunkelblau = Entwurf 4 („Dunkelblau / Weiß“): Originallogo in Graustufen, Kontrast gestreckt, Gamma 1,4, eingefärbt von #0b2a52 (dunkel) bis Weiß – Fell, Zähne, Schläger und Schriftzug bleiben erkennbar. Wird auf dem Gerät aus `logo.png` berechnet (`wpNavyLogo`, einmal zwischengespeichert). Kombinierbar mit allen Stilen, Hell/Dunkel und Sperr-/Startbildschirm. Dateiname bekommt „-blau“.
- Eintrag in „Neu in der App“ (fasst auch die Startbildschirm-Variante zusammen).

## Version 1.52.3

- **„Startbildschirm“ überarbeitet:** statt blassem Wasserzeichen jetzt dasselbe Motiv wie beim Sperrbildschirm (Logo und Schrift an gleicher Stelle), aber Logo, Schrift und Zierstrich halb durchsichtig (Hell 50 %, Dunkel 55 %). Hintergrund bleibt voll.

## Version 1.52.2

- **Hintergrund „Vereinsdesign“: neue Auswahl „Sperrbildschirm / Startbildschirm“.** Sperrbildschirm wie bisher (Logo groß mit Schrift). Startbildschirm: gleicher Hintergrund in allen vier Stilen, aber ohne Schrift und das Logo nur als blasses Wasserzeichen in der Mitte – die App-Symbole gehen nicht mehr unter (vor allem bei Hell). Dateiname bekommt „-start“.

## Version 1.52.1

- **Fan-Tipp: Tore direkt eintippen.** Die Zahl zwischen − und + ist jetzt ein Eingabefeld (Zifferntastatur, max. 2 Stellen, beim Antippen markiert); − und + funktionieren weiter. Ungültiges wird beim Verlassen auf 0–40 begrenzt.
- **Obergrenze 40 statt 20** (Jugendspiele enden auch mal 26:3): `FT_MAX` in `js/app.js`, `firestore.rules` (`fanTips` hs/as ≤ 40) und `functions/fan-tips.js` (Auswertung). Regeln und Function werden mit „Live gehen“ automatisch veröffentlicht; bis dahin werden Tipps über 20 in der Test-App von den Regeln abgelehnt.
- Eintrag in „Neu in der App“.

## Version 1.52.0

- **Einstellungen als gegliederte Liste** (wie Handy-Einstellungen): Gruppen **Für mich** (Meine Mannschaften, Meine Rückennummer, Push-Nachrichten) · **Aussehen** (Darstellung, Saison-Designs) · **App** (App installieren, Datenschutz) · **Mitmachen** (Feedback & Wunschliste); Admin-Link bleibt klein ganz unten. Jede Zeile zeigt rechts den aktuellen Wert (z. B. „U15 A, U13“, „17“, „Aus“ rot, „installiert ✓“ grün, „Automatisch“). Saison-Designs erscheint nur, wenn ein Saison-Design verfügbar ist.
- Antippen öffnet die **bisherige Karte** als Fenster von unten (`#stSheetWrap`, liegt in `#settingsView`, damit alle `#settingsView …`-Stile weiter greifen). Die Karten werden nur verschoben (`#stStore` ↔ `#stBody`), alle Schalter, Knöpfe und Listener bleiben unverändert. Kopfzeile der Karte wird im Fenster ausgeblendet, der Titel steht im Fenster. Schließen: ✕, „Fertig“, Tippen daneben, nach unten wischen oder Zurück-Taste (`.stSheetWrap` im Zurück-Taste-Code ergänzt).
- Ist Push aus (aber möglich), steht oben ein Hinweis „Push ist aus · Einschalten“, der direkt das Push-Fenster öffnet.
- Werte werden beim Schließen eines Fensters, bei Push-Änderungen, Installation und beim Öffnen der Einstellungen neu berechnet. Das bisherige Ein-/Ausklappen der Karten (`settingsFold`) bleibt im Code, wirkt aber nur noch im Hintergrund.
- Analytics: `settings_open` (Eintrag). Eintrag in „Neu in der App“.

## Version 1.51.1

- **Fix: Karte „App installieren“ (Einstellungen) war bei installierter App leer.** Ursache 1: Die Einstellungen blenden Beschreibungszeilen mit `style="margin:6px 0 10px"` per CSS aus – der Text „installiert“ war dadurch unsichtbar, und der Knopf ist bei installierter App ausgeblendet. Text hat jetzt die Klasse `instTxt`. Ursache 2: Die Karte teilte sich beim Ein-/Ausklappen den gemerkten Zustand mit „Darstellung“ (Schlüssel `design`); jetzt eigener Schlüssel `install`.
- Bei installierter App: grünes „installiert ✓“ in der Kopfzeile (auch zugeklappt sichtbar) und Hinweis auf „App teilen“/„QR-Code“ für andere Geräte.

## Version 1.51.0

- **Knopf „App installieren“:** Hinweis-Karte auf der Startseite (unter dem letzten Spiel, ausblendbar für 30 Tage, `localStorage` `grizzlysInstHide`) und Karte in den Einstellungen. Das Installationsangebot des Browsers (`beforeinstallprompt`, Chrome/Samsung Internet/Edge) wird früh im `<head>` abgefangen (`window.__bip`) und erst beim Tippen auf den Knopf geöffnet – dadurch erscheint Chromes eigenes Banner nicht mehr, stattdessen unser Hinweis.
- Ohne Installationsangebot (iPhone, Firefox, Samsung ohne Angebot, Desktop) öffnet der Knopf eine kurze Anleitung passend zum erkannten Browser (iPhone in anderem Browser: Hinweis auf Safari).
- Ist die App installiert (Vollbild-Modus), verschwindet der Hinweis auf der Startseite; in den Einstellungen steht „installiert ✓“. Auf dem Desktop erscheint der Startseiten-Hinweis nur, wenn der Browser die Installation anbietet.
- Analytics: `install_click` (mit/ohne Browser-Dialog, Browser), `install_result`, `app_installed`. Eintrag in „Neu in der App“.

## Version 1.50.3

- **Saisonbilanz → Verlauf: Kasten „Comebacks und Führungen“ heißt jetzt „Stand nach 2 Dritteln“** und ist klarer beschriftet: je Fall (Vorn · Gleich · Hinten) die Zahl der Spiele und „→ x gewonnen“ bzw. „→ x gedreht“; kam ein Fall noch nicht vor, steht „kam noch nicht vor“ (vorher missverständlich „noch nie … danach gewonnen“). Zeile zum 1. Drittel im selben Stil.

## Version 1.50.2

- **Trikot-Hintergrund ohne Mannschaftsauswahl:** alle Mannschaften tragen dasselbe Trikot. Auswahl: Hell/Dunkel (Hintergrund), Blau/Weiß (Trikot) und Rückennummer (vorbelegt aus „Meine Rückennummer“, erste eingetragene).

## Version 1.50.1

- **Hintergrund „Eishalle“ in Hell mit Hallenbild:** nutzt jetzt `img/header-hell.webp` wie der Kopfbereich der hellen App (Scheinwerfer und weißes Eis). Das Bild ist so breit gesetzt, dass die Scheinwerfer links und rechts sichtbar bleiben; oben bleibt es dunkel (Platz für die Uhr), nach unten wird das Eis hell weitergeführt. Schrift dunkelblau.

## Version 1.50.0

- **Hintergrundbilder auch hell:** In der Vorschau jedes Motivs gibt es jetzt „Dunkel“ und „Hell“. Hell = heller Blauverlauf mit feinen Streifen (statt Hallenfoto), Schrift dunkelblau, Karten weiß; Spielfeld als weiße Eisfläche mit Linien; Advent mit hellem Winterhimmel. Die Wahl wird pro Gerät gemerkt (`localStorage` `grizzlysWpTone`) und gilt auch für die Vorschau-Kacheln. Dateiname bekommt „-hell“.
- Eintrag in „Neu in der App“.

## Version 1.49.0

- **Downloads in drei Reitern:** **Spielplan** (Kalender herunterladen, Spielplan als PDF, Kampfgericht-Anleitung) · **Social Media** (Spieltags-, Ergebnis-, Verlegungs-, Wochenend-, Tabellen- und Jahresbilder) · **Hintergründe** (Handy-Hintergrundbilder).
- Zahl am Reiter „Social Media“ = aktuelle Spieltags-, Ergebnis- und Verlegungsbilder (`window.dlInstaFresh`, gesetzt in `renderInstaDownloads`).
- Der zuletzt gewählte Reiter wird pro Gerät gemerkt (`localStorage` `grizzlysDlTab`); ohne gemerkten Reiter startet „Social Media“, wenn dort aktuelle Bilder liegen, sonst „Spielplan“.
- Die Vorschaubilder der Hintergründe werden erst beim ersten Öffnen ihres Reiters erzeugt (spart Rechenzeit).
- Analytics: `downloads_tab` (Reiter). Eintrag in „Neu in der App“.
- **Live gehen fasst „Neu in der App“ zusammen** (`.github/werkzeug/tolive.py` im Live-Repo, manuell hochgeladen): Alle Einträge, die neuer als die bisherige Live-Version sind, werden beim Umwandeln zu einem Eintrag mit der neuen Versionsnummer zusammengefasst (Punkte aller Einträge, neueste zuerst). In der Test-App bleiben die Einzeleinträge stehen. Ist die bisherige Live-Version nicht lesbar, bleibt alles unverändert.

## Version 1.48.1

- **Trikot-Hintergrundbild dem Original nachempfunden:** hellblau mit schwarzem Kragen, schwarzer Bruchlinie vom Kragen zum rechten Ärmel, geschwungenen schwarz-weißen Streifen unten, „Bergkamen“ in Weiß mit schwarzem Rand auf beiden Ärmeln und gestreiften Bündchen; Nummer schwarz mit weißem Rand. Varianten „Blau“ (Original) und „Weiß“ (gleiches Muster, helle Grundfarbe). Statt Spielername steht „GRIZZLYS“ im Bogen; Sponsoren- und Herstellerlogos sind nicht dabei.

## Version 1.48.0

- **Hintergrundbilder fürs Handy** (Downloads, neue Karte unter „Bilder für Social Media“): Motive als Kacheln mit Vorschau; Antippen öffnet ein Fenster mit Handy-Vorschau samt Beispiel-Uhr, Optionen und „In Fotos sichern / Teilen“ (Web Share mit Datei, wo verfügbar) sowie „Herunterladen“.
  - **Vereinsdesign** in vier Stilen: Eishalle (Hallenfoto), Nacht, Spielfeld (Eisflächen-Linien), Streifen (diagonaler Orange-Strich wie bei den Social-Media-Bildern).
  - **Trikot mit Rückennummer:** Trikot-Rückenansicht mit „GRIZZLYS“ und Nummer, dunkel oder hell; Nummer vorbelegt aus „Meine Rückennummer“ (je Mannschaft), sonst frei eintragbar (1–2 Ziffern). Keine Namen.
  - **Nächstes Spiel:** Datum, Uhrzeit, beide Logos, Heim/Auswärts und Halle, „Stand“-Datum; bei mehreren Mannschaften auswählbar.
  - **Spiele des Monats:** bis zu 7 Spiele der nächsten 5 Wochen, alle oder je Mannschaft.
  - **Advent & Weihnachten:** Weihnachtslogo, Sterne, Schnee – nur vom 20.11. bis 6.1. sichtbar.
- Größe = Bildschirm × Pixeldichte (max. 1440 px breit; Desktop/ungewöhnliche Formate: 1179 × 2556). Layout sperrbildschirmtauglich: oben ca. 30 % frei für die Uhr, unten ca. 13 % frei. Alles wird auf dem Gerät erzeugt (Canvas), kein Server.
- Analytics: `wallpaper_opened` und `wallpaper_saved` (Motiv, ggf. Stil) – ohne Nummer.
- Eintrag in „Neu in der App“.

## Version 1.47.0

- **Saisonbilanz mit Reitern:** **Überblick** (Platz, Kacheln, Tordifferenz je Spiel, Heim/auswärts, Auffälliges, Meilensteine, Spielberichte, Tabelle als Bild) · **Verlauf** · **Liga** · **Nummern**. Die Reiterleiste bleibt beim Scrollen unter der Kopfzeile stehen; leere Reiter werden ausgeblendet. Alles je Mannschaft, nichts mannschaftsübergreifend, weiter nur Rückennummern.
- **Verlauf:** Zeit in Führung/Gleichstand/Rückstand (Balken, Ø Minuten je Spiel, aus `timeValues` der EHV-Spielberichte) · Comebacks und Führungen nach 2 Dritteln (Ringe: Führung gehalten / aus Gleichstand gewonnen / Rückstand gedreht) plus Zeile nach dem 1. Drittel (aus den Drittelergebnissen) · Knappe (1 Tor oder n.P.) und deutliche Spiele als Balken mit den letzten knappen Ergebnissen · Tore je Drittel mit Balken und „letzte 5“-Trend · Tore nach Spielminute (10-Minuten-Abschnitte, Tore oben/Gegentore unten, stärkste und schwächste Phase) · Strafen & Special Teams.
- **Liga:** Tabellenverlauf · Ligavergleich Angriff und Abwehr (Punktleiste aller Teams, Rang, Liga-Schnitt; aus allen EHV-Ligaergebnissen) · Bilanz gegen obere und untere Tabellenhälfte (aktueller Platz des Gegners) · Restprogramm mit Gegnerplatz (farbig nach Drittel der Tabelle) und Ø Gegnerplatz im Vergleich zu bisher.
- **Nummern:** Tore nach Rückennummer · Besondere Tore (Überzahltore, Siegtore je Nummer) · Hattricks und Doppelpacks · aktuelle Scorer-Serien (Spiele in Folge mit Tor oder Vorlage).
- **Cloud Function `standings` erweitert** (wird mit „Live gehen“ veröffentlicht): je Spielbericht zusätzlich `shG`/`shGA` (Unterzahltore), `lead`/`tied`/`trail` (Sekunden), `tf`/`ta` (Tore/Gegentore je 10 Minuten, Index 6 = Verlängerung) in `scorers.special`; `gw` (Siegtore) je Nummer in `scorers.list`; `av` (Vorlagen-Nummern) je eigenem Spiel in `games`. Bis die Function neu läuft, fehlen in der App nur Zeit in Führung, Tore nach Spielminute, Siegtore und Vorlagen in den Serien (dann „Tor-Serien“). Torschüsse und Paraden werden vom EHV nicht erfasst (immer 0) und sind deshalb nicht dabei.
- Eintrag in „Neu in der App“.

## Version 1.46.1

- **Fix: Kasten „Strafen & Special Teams“ in der Saisonbilanz fehlte** (seit 1.43.0). Die Cloud Function `standings` lieferte die Werte (`scorers.special`) korrekt, aber `standClean()` in `js/app.js` übernahm aus `scorers` nur `games` und `list` und warf `special` weg. Jetzt werden auch `special` (Spiele, Strafminuten, Gegner-Strafminuten, Überzahlspiele/-tore, Unterzahlsituationen/-gegentore) übernommen. Gilt sofort, die Function bleibt unverändert.

## Version 1.46.0

- **Admin-Bereich nach Aufgaben statt nach Technik:** vier Reiter – **Spieltag** (EHV-Abweichungen, Spielliste mit Ergebnissen, Terminen, Absagen und Spielberichten), **Inhalte** (News, Spruch des Tages, Kapitäne, Wunschliste, Social Media), **Rückmeldungen** (Feedback, Reaktionen, App-Fehler) und **Technik** (Veröffentlichen, Push-Status, App-Statistik, Tipp-Fenster, Saisonsachen). Der bisherige Reiter „Social“ ist jetzt der aufklappbare Bereich „Social Media“ unter Inhalte. Die internen Reiter-Namen (`games`, `news`, `bugs`, `stats`) bleiben gleich.
- **Zahlen an den Reitern:** Spieltag zählt Spiele mit fehlendem Ergebnis, EHV-Abweichung oder einem Spielbericht der letzten 10 Tage, der noch nicht veröffentlicht ist; Rückmeldungen zählt offene Rückmeldungen (wie bisher); Technik zeigt „!“, wenn dieses Gerät keinen Admin-Push bekommt.
- **Spielliste startet mit „Zu tun“:** Abschnitte „Ergebnis fehlt“, „EHV-Abweichung“, „Bericht wartet auf Freigabe“ und „Heute“; ist nichts offen, steht „Nichts zu tun“ und die nächsten drei Spiele. Weitere Filter: Kommende · Gespielt · Alle.
- **Saisonsachen nur zur passenden Zeit:** Adventskalender 20.11.–15.1. (wie bisher), Saisonende-Sicherung nur März bis August. Gruppe „Saison“ verschwindet, wenn beides nicht dran ist.
- **Einheitlicher Aufbau:** alle Bereiche zugeklappt mit Kurzinfo rechts; welche Bereiche offen waren, merkt sich das Gerät (`localStorage` `grizzlysAdmFolds`) und öffnet sie beim nächsten Mal wieder (inkl. Nachladen von Veröffentlichen, App-Fehler, Adventskalender, Social Media). Gemischte Emojis in den Überschriften sind durch einheitliche Linien-Symbole ersetzt (auch im Spiel-Blatt: Ergebnis, Termin & Ort, Spielbericht, Absage, Hinweis).
- **Fix:** „App-Fehler“ lud beim Aufklappen nicht neu, sondern beim Zuklappen.

## Version 1.45.0

- **Kapitän (C) und Assistenten (A):** Admin › Spiele › „©️ Kapitäne“ – je Mannschaft eine Rückennummer für C und bis zu zwei für A (nur Nummern, keine Namen), Schalter „In der App anzeigen“. Gespeichert in Firestore `appConfig/kapitaene` (`{ on, list: [{ team, c, a: [] }] }`, `firestore.rules` erweitert); Nutzer lesen höchstens alle 6 Stunden neu. Anzeige: Zeile „C 17 · A 9 · A 23“ auf den Mannschafts-Kacheln der Startseite, Kasten oben in der Saisonbilanz, kleines „C“/„A“ in „Tore nach Rückennummer“ und neben „Nr. 17“ bei Torschützen und Live-Toren (nicht im Fließtext des Spielberichts, nie bei Gegnertoren).

## Version 1.44.5

- **× bleibt beim Scrollen sichtbar:** In allen Fenstern (Spieldetails, Saisonbilanz, Gegner, News, Regeln, Formulare, QR-Code, Wunschliste …) bleibt die Kopfzeile mit Titel und × oben stehen. Im Admin-Bereich steht die Kopfzeile mit × fest, die Reiter darunter; im Spiel-Blatt des Admin-Bereichs bleibt die Spielzeile mit × stehen.
- **Zurück-Taste des Handys schließt das oberste Fenster** statt die App zu verlassen: Beim Öffnen eines Fensters legt die App einen Eintrag im Browser-Verlauf an (`history.pushState`), die Zurück-Taste schließt dann das Fenster; wird per × geschlossen, wird der Eintrag wieder entfernt. Gilt auch für verschachtelte Fenster (Admin › Spiel: erst das Spiel, dann der Admin-Bereich). Ohne offenes Fenster verhält sich die Zurück-Taste wie bisher.
- **Fix:** Saisonbilanz ohne Ergebnisse zeigte „Sobald ${esc(teamName(team))} gespielt hat …“ statt des Mannschaftsnamens.

## Version 1.44.4

- **Admin › System › Push-Status – Geräteliste:** Statt „Android, Android, …“ jetzt eine Liste aller Admin-Push-Anmeldungen mit Gerät und Browser (aus dem gespeicherten User-Agent, z. B. „Android 14 · Chrome“), Test- oder Live-App, App-Version und „zuletzt aktiv“. Je Eintrag „Entfernen“ (nicht beim eigenen Gerät) und „🧹 x alte Anmeldungen entfernen“ für alles, was länger als 30 Tage nicht aktiv war. Warum es mehr Einträge als Geräte gibt: Test- und Live-App, jeder Browser und jede Neuanmeldung (Daten löschen, Push neu einrichten) haben eine eigene Anmeldung. Entfernte Geräte melden sich beim nächsten Öffnen von selbst wieder an – als Admin nur, solange dort jemand im Admin-Bereich angemeldet ist.
- `pushTokens` speichert dafür zusätzlich `app` („test“/„live“) und `ver` (App-Version) – `firestore.rules` entsprechend erweitert. Ältere Einträge zeigen „App unbekannt“, bis sich das Gerät das nächste Mal meldet.

## Version 1.44.3

- **Admin – EHV „ohne Termin“:** Diese Abweichung erscheint nicht mehr, wenn das Spiel in der App schon abgesagt oder „verlegt – Termin offen“ ist. Setzt der EHV später einen neuen Termin, kommt die Abweichung wie gewohnt wieder (dann mit „EHV übernehmen“). Ist das Spiel in der App noch normal, hat die Abweichung jetzt den Knopf „⏸ Als „Termin offen“ markieren“ – ein Tipp, und sie ist erledigt.
- **Admin – „Ergebnis fehlt“:** abgesagte und verlegte Spiele (Termin offen) zählen nicht mehr als fehlendes Ergebnis (Zu-tun-Liste und Liste „Ergebnis fehlt“); in der Spielliste steht stattdessen „abgesagt“ bzw. „Termin offen“.

## Version 1.44.2

- **Neuer Status „Verlegt – neuer Termin offen“:** Admin › Spiel › „🚫 Absage / Termin offen“ hat jetzt zwei Knöpfe: „🚫 Spiel absagen“ und „⏸ Verlegt – Termin offen“ (bei einem schon abgesagten Spiel: „⏸ Nur verlegt – Termin offen“, umgekehrt „🚫 Doch abgesagt“). Technisch eine Absage mit `postponed: true` im Dokument `scheduleOverrides/{Spiel-ID}`: Das Spiel ist kein nächstes Spiel, bekommt keine Erinnerung und kein Live-Ticker, bleibt am alten Datum im Spielplan – angezeigt wird aber überall „Verlegt · Termin offen“ in Orange (Spielkarten, Letzte Ergebnisse, Kalender-Download, Druckansicht, News, Social-Media-Bilder, Wochenend-Bild). Optionaler Push: „Spiel gegen … ist verlegt – neuer Termin folgt.“ Steht der neue Termin fest, einfach unter „Termin & Ort“ ändern – dann gilt das Spiel automatisch wieder als normales Spiel.

## Version 1.44.1

- **Fix Start-Animation** („Cannot read properties of null (reading 'forEach')“, `index.html` Zeile ~197): Lief die App beim Start im Hintergrund oder ruckelte stark, sprang die Animation über den Aufprall hinweg; die Scherben wurden dann nie erzeugt. Jetzt werden sie nachgeholt, und falls das nicht geht, endet die Animation einfach.
- **Fix Admin-Bereich** („Cannot read properties of null (reading 'hidden')“, `js/app-daten.js`): Die Link-Kästen „App-Statistik“ und „Tipp-Fenster ansehen“ sehen aus wie aufklappbare Kästen, haben aber nichts zum Aufklappen – ein Tipp darauf warf zusätzlich einen Fehler. Sie werden beim Aufklappen jetzt übersprungen.

## Version 1.44.0

### Neu in Version 1.44.0 (Stand 1.44.0.219, 19.11.2026, nur in der Test-App)

- **Wunschliste:** Nutzer stimmen ab, welche Funktion als Nächstes kommt – bis zu 3 Stimmen je Gerät, anonym, jederzeit änderbar. Zu finden auf der Startseite (Karte „Deine Stimme zählt“ ganz unten), in News › App (oben) und in der Info. Umgesetzte Wünsche stehen unter „Umgesetzt dank euch“. Standardliste in `js/app.js` (`WUENSCHE_STANDARD`: Fahrgemeinschaften, Trainingszeiten, Neu bei den Grizzlys, Umfragen, Regel-Quiz, Losfahren um …). **Admin › Rückmeldungen › 💡 Wunschliste:** Wünsche hinzufügen, bearbeiten, löschen, als „umgesetzt“ markieren, Stimmen ansehen, Liste ein-/ausblenden (Firestore `appConfig/wuensche`). Stimmen: `wishVotes/{Geräte-ID}`, gezählt von der neuen Function `onWishVoteWritten` nach `wishStats/all`.
- **Ein-Tipp-Feedback:** Unter jedem Spielbericht „War der Bericht gut? 👍 👎“, unter den drei neuesten Einträgen in „Neu in der App“ „Gefällt dir das? 👍 👎“. Bei 👎 bietet die App „Was können wir besser machen?“ an – das öffnet das Feedback-Formular mit passender Art, Bereich (neu: „Spielbericht“) und Bezug im Text. Stimmen: `reactions/{Ziel}__{Geräte-ID}`, gezählt von der neuen Function `onReactionWritten` nach `reactionStats/{Ziel}`. **Admin › Rückmeldungen › 👍 Reaktionen:** Übersicht je Bericht bzw. Version.
- **Feedback-Einstiege:** Startseite (unten), Info (unter „App teilen“) und News › App (unten) – „Idee, Fehler oder Lob? Sag's uns“.
- **Fehler behoben:** Fan-Tipps der U13 wurden von `onFanTipWritten` nicht gezählt (nur A/B erlaubt) – jetzt auch U13 (`functions/fan-tips.js`).
- **Functions/Regeln:** neu `functions/feedback-votes.js` (`onReactionWritten`, `onWishVoteWritten`), geändert `fan-tips.js`, `index.js`; `firestore.rules` um `reactions`, `reactionStats`, `wishVotes`, `wishStats` und `appConfig/wuensche` ergänzt. Alles geht mit „Live gehen“ mit; die Zähler laufen erst nach dem Deploy.

## Version 1.43.0

### Neu in Version 1.43.0 (Stand 1.43.0.218, 19.11.2026, nur in der Test-App)

- **Meine Rückennummer:** Einstellungen › Karte „Meine Rückennummer“ (unter „Meine Mannschaften“) – je gewählter Mannschaft bis zu 3 Nummern (`localStorage grizzlysMyNr`, z. B. `{"A":["17"]}`). „Nr. 17“ wird überall in Grizzlys-Texten gelb markiert (Torschützen, Live-Tore, Spielbericht, Spieldetails), in „Tore nach Rückennummer“ die ganze Zeile – nur bei der passenden Mannschaft, nie bei Gegnertoren. Push-Auswahl „Tore meiner Nummer“ (Live, `prefs.liveMyNr`, nur auf Wunsch): `functions/live.js` schickt bei Tor oder Vorlage dieser Nummer „🎉 Tor durch die Nr. 17!“ bzw. „🎯 Vorlage von der Nr. 17!“ statt der allgemeinen Live-Tor-Meldung (`prefs.myNr` wird mit der Push-Auswahl gespeichert – nur Nummern, keine Namen).
- **Push „Spielbericht ist online“:** neuer Schalter in der Push-Auswahl (`prefs.reports`, nur auf Wunsch). Neue Function `onReportPublished` (`functions/report-push.js`): meldet jeden Bericht einmal, sobald er veröffentlicht ist (Admin oder automatisch nach der Frist), Sperre `reportPushes/{Spiel-ID}`, keine Meldung für Spiele älter als 7 Tage. Ein Tipp auf die Meldung öffnet den Bericht (`./?go=report-<Spiel-ID>`; bei offener App per Nachricht vom Service Worker).
- **Wochenende als Bild:** Downloads › „Wochenende · x Spiele“ (ab Montag für das kommende Wochenende Fr–So, alle eigenen Mannschaften, bis zu 6 Spiele mit Logos, Uhrzeit, Heim/Auswärts, schon gespielte mit Ergebnis); im Admin-Bereich › Social Media als Kachel „Wochenende“ (alle Mannschaften).
- **Wetter am Spielort:** neue Function `weatherForecast` (`functions/weather.js`, alle 3 Stunden): holt für Spiele der nächsten 3 Tage die Vorhersage bei Open-Meteo (kostenlos, ohne Schlüssel) und speichert sie in `weather/{Spiel-ID}` (für alle lesbar, `firestore.rules` ergänzt). Ort = Koordinaten aus `RINK_GEO` in `js/app.js` (steht dafür jetzt oben in der Datei; neue Halle dort eintragen). Glättegefahr: ≤ 1 °C rund um die Anfahrt (4 Std. vor bis 3 Std. nach Bully) mit Niederschlag/Regenwahrscheinlichkeit ab 40 % oder Schnee bzw. gefrierender Regen; Frost ohne Niederschlag = „Frost“. Anzeige: Zeile auf den Karten „Nächstes Spiel“ und Kasten in den Spieldetails; die 24h-Erinnerung (`push.js`) hängt die Zusammenfassung an. Die Geräte fragen keinen Wetterdienst selbst (Datenschutz-Seite ergänzt).
- **Saisonbilanz – Strafen & Special Teams:** Strafminuten (gesamt, je Spiel, Gegner), Überzahlquote (Tore/Überzahlspiele) und Unterzahlquote (überstanden/Unterzahlspiele) aus den EHV-Spielberichten. Dafür liefert die Function `standings` jetzt `scorers.special` mit (`functions/standings.js`).
- **Functions:** neu `onReportPublished`, `weatherForecast`; geändert `live.js`, `push.js`, `standings.js`, `index.js`. Gehen mit „Live gehen“ automatisch mit. Der Push „Spielbericht“, die Wetteranzeige und die Special-Teams-Zahlen funktionieren erst nach dem Deploy.

## Version 1.42.2

- **Meilensteine im Spielbericht:** Der automatische Bericht (App und Cloud Function `autoResults`, gemeinsame Vorlage `spielbericht.js`) erwähnt jetzt das 25./50./75./100. … Saisontor – mit Rückennummer des Torschützen, wenn die EHV-Spieldetails vorliegen („Ein Meilenstein: Die Nr. 17 erzielte das 100. Saisontor der U15 A.“) –, den ersten Saisonsieg, den 5./10./15. … Saisonsieg und den höchsten Saisonsieg (ab 5 Toren Unterschied). Neuer Chip „🏆 …“ unter „Im Bericht verwenden“ (standardmäßig an), auch in der Kurzfassung und im KI-Auftrag. „x. Sieg in Folge“ und „Zu null“ hatten schon eigene Bausteine.
- `functions/spielbericht.js` (Rückfall-Kopie der Function) ist identisch mit `spielbericht.js`; die Function lädt die Vorlage sonst von der Live-Seite – wirksam also nach „Live gehen“.

## Version 1.42.0

### Neu in Version 1.42.0 (Stand 1.42.1.216, 19.11.2026, nur in der Test-App)

- **Meilensteine:** aus den eingetragenen Ergebnissen je Mannschaft – erster Saisonsieg, 5./10./15. … Saisonsieg, 3/5/7/10/15 Siege in Folge, 25./50./75./100. … Saisontor, zu null gewonnen, höchster Saisonsieg (ab 5 Toren Unterschied und höher als der bisherige). Anzeige in „Letzte Ergebnisse“ (goldene Zeile), in den Spieldetails (Kasten „Meilenstein“) und in der Saisonbilanz (Liste „Meilensteine“). Keine Namen, keine neuen Daten oder Abfragen.
- **App weiterempfehlen:** Info › neben „App teilen“ der Knopf „QR-Code zeigen“ – großer QR-Code der **Live-App** (`https://jazm1309.github.io/grizzlys-u15/`, fest eingebaut, auch in der Test-App) mit kurzer Anleitung und „Link teilen“. Der Code ist im Programm gespeichert und funktioniert offline.
- **App-Verknüpfungen (Android):** langes Drücken auf das App-Symbol zeigt „U13“, „U15 A“ und „U15 B“ und öffnet direkt die Saisonbilanz der Mannschaft (`shortcuts` in `manifest.webmanifest`, Symbole `img/shortcut-u13.png`, `-u15a.png`, `-u15b.png` in den Mannschaftsfarben). Die App öffnet dazu `./?go=bilanz-U13|bilanz-A|bilanz-B` und räumt die Adresse danach wieder auf; ist die Mannschaft unter „Meine Mannschaften“ nicht gewählt, kommt ein Hinweis und die Einstellungen öffnen sich. Kommt zur neuen Saison die U17 dazu, die Verknüpfungen im Manifest (Test und Live) anpassen; der Service Worker speichert solche Aufrufe unter der normalen Adresse (offline nutzbar). iPhone kennt keine App-Verknüpfungen. Android übernimmt neue Verknüpfungen erst, wenn Chrome die installierte App aktualisiert (kann einen Tag dauern).
- **Wichtig für Live:** `manifest.webmanifest` gehört zu den Dateien, die „Live gehen“ **nicht** überträgt (Test hat einen eigenen Namen). Für die Verknüpfungen in der Live-App die mitgelieferte Live-Fassung einmal von Hand ins Live-Repo hochladen (ersetzt die alte Datei).

## Version 1.41.4

- **Mehr Sprüche mit Namen:** Standardliste in `sprueche.js` um 19 Zitate bekannter Spieler und Trainer erweitert (u. a. Bobby Orr, Sidney Crosby, Brett Hull, Mark Messier, Henrik Lundqvist, Herb Brooks, Scotty Bowman, Fred Shero, „Badger“ Bob Johnson, Anatoli Tarassow) – jetzt 83 Sprüche, davon 24 mit Namen; Sprüche mit und ohne Namen wechseln sich ab.
- **Admin › Spruch des Tages:** neuer Knopf „＋ x neue Standard-Sprüche“ – ergänzt nur die Standard-Sprüche, die noch nicht in der gespeicherten Liste stehen; eigene Sprüche bleiben erhalten (erscheint nur, wenn es neue gibt).

## Version 1.41.3

- **Spruch des Tages ohne Karte:** steht weiter ganz oben auf der Startseite, jetzt ohne Hintergrund und mittig wie ein Motto – Titel schräg in Pinselschrift mit farbigem Pinselstrich (blau, nach einem Sieg grün, Halloween orange), Spruch groß und kursiv in Navy (im Dunkelmodus weiß), Urheber darunter. Das Bären-Wasserzeichen entfällt.

## Version 1.41.2

- **Spruch des Tages auffälliger:** steht jetzt ganz oben auf der Startseite (vor dem nächsten Spiel) als dunkle Karte im Header-Look – Titel „Spruch des Tages“ leicht schräg in Pinselschrift mit farbigem Pinselstrich (blau, nach einem Sieg grün, im Halloween-Design orange), der Spruch groß und kursiv, Bären-Logo als Wasserzeichen.

## Version 1.41.1

- **Fix:** Der Link „Admin-Bereich“ unten in den Einstellungen war seit 1.40.5 unsichtbar (beim Umstellen auf Linien-Icons war das Symbol kaputtgegangen und hat den Text verschluckt). Jetzt wieder sichtbar, mit Schloss-Symbol. Dasselbe beim Titel „Admin-Bereich“ im Admin-Fenster und beim Knopf „Anmelden“.

## Version 1.41.0

### Neu in Version 1.41.0 (Stand 1.41.0.210, 18.11.2026, nur in der Test-App)

- **Spruch des Tages (Startseite):** zwischen „Nächstes Spiel“ und „Letzte Ergebnisse“ steht jeden Tag ein anderer Eishockey-Spruch – für alle Geräte derselbe (hängt am Datum). Keine Sammlung in der App, immer nur ein Spruch.
- **Passend zum Anlass:** Spielt heute eine der gewählten Mannschaften und fehlt das Ergebnis noch, kommt ein Spruch zum Spieltag; nach einem Sieg oder einer Niederlage (am selben und am nächsten Tag) ein passender Spruch, sonst einer aus „Allgemein“. Fehlt für einen Anlass ein Spruch, kommt einer aus „Allgemein“.
- **Admin › News › Spruch des Tages:** Sprüche hinzufügen, bearbeiten und löschen (Text, Urheber, Anlass), Vorschau „Heute zu sehen“, Schalter „Auf der Startseite zeigen“, Standardliste wiederherstellen. Gespeichert wird erst mit „Speichern“ (die Test-App übernimmt nur auf dem Gerät).
- **Daten:** Firestore-Dokument `appConfig/sprueche` (`on`, `list` mit `t`/`a`/`k`, `updatedAt`), für alle lesbar, nur der Admin schreibt – **`firestore.rules` geändert** (geht mit „Live gehen“ mit). Nutzer lesen das Dokument höchstens alle 3 Stunden, sonst aus dem Gerätespeicher; solange nichts gespeichert ist, gilt die Standardliste aus `sprueche.js` (seit 1.41.4: 83 Sprüche, auch offline). Die Admin-Sicherung enthält jetzt auch `appConfig`.
- Neue Datei `sprueche.js` (Standardliste), im Offline-Speicher der App.

## Version 1.40.6

- **Fix:** Die Start-Animation (Eisbruch) bricht nicht mehr mit einem Fehler ab, wenn ihre Daten fehlen (laut Fehlerübersicht aufgetreten).

## Version 1.40.5

- **Icons:** Linien-Icons statt Emojis bei Gegner (Liste/Karte, Halle, Route), Einstellungen (Darstellung, Push, Datenschutz, Saison-Schalter) und Regeln (Themen-Kacheln).

## Version 1.40.4

- **News:** Linien-Icons statt Emojis (Reiter, Banner, Spielbericht, Absage).

## Version 1.40.3

- **Fix:** Eine Absage gilt nur für den Tag, an dem sie gesetzt wurde. Wird das Spiel verlegt (z. B. vom EHV), ist es am neuen Termin nicht mehr abgesagt.

## Version 1.40.2

### Neu in Version 1.40.2 (Stand 1.40.2.205, 16.11.2026, nur in der Test-App)

- **Ergebnis teilen als Bild:** „Ergebnis teilen“ (und „Teilen“ vor dem Spiel) öffnet jetzt das Bild-Fenster mit der fertigen Karte (Logos, Spielstand, Drittel) zum Teilen oder Speichern, statt nur Text zu senden. Abgesagte Spiele werden weiter als Text geteilt.
- **App-Fehler:** Die Zeilennummer wird jetzt mit gespeichert (bisher abgeschnitten), damit Fehler auffindbar sind.

## Version 1.40.1

### Neu in Version 1.40.1 (Stand 1.40.1.203, 16.11.2026, nur in der Test-App) – Optik

- **Admin-Reiter:** Linien-Icons statt Emojis (Variante A).
- **Leerzustände:** Kleines Symbol mit Titel und Hinweis statt nackter Textzeile (Spielplan ohne Treffer, Saisonbilanz, Spielberichte, Terminänderungen, Regelsuche).
- **Übergänge:** Admin-Reiter blenden weich ein, Karten reagieren beim Antippen; bei „Bewegung reduzieren“ aus.
- **Dunkelmodus:** Admin-Reiter, Schatten und Leerzustände nachgezogen.

## Version 1.40.0

### Neu in Version 1.40.0 (Stand 1.40.0.202, 16.11.2026, nur in der Test-App)

- **App-Fehler (Admin):** Unerwartete Fehler der App werden anonym gemeldet (Tag, Meldung, App-Version, Plattform – keine Personendaten) und stehen im Admin-Bereich unter „🧯 App-Fehler“ (Aktualisieren / Leeren). Dort auch Link „💶 Kosten ansehen“ (Google-Abrechnung; die Kostenwarnung per E-Mail bleibt die Hauptwarnung). Regel `appErrors` in `firestore.rules`.
- **Regeln-Check:** „Live gehen“ prüft, ob jede Mannschaft aus der App in `firestore.rules` (Tipps, News) steht (`regelcheck.py`). Bei Fehlern stoppt Live; `firestore.rules` wird mit den Functions automatisch veröffentlicht (Rolle `roles/firebaserules.admin` fürs Dienstkonto nötig).
- **Optik:** Graue Kleintexte und das orange B-Label kontrastreicher; Platzhalter statt „Ergebnis folgt“-Flackern beim Laden; fehlt ein Gegner-Logo, erscheint ein Kürzel-Wappen.
- **Sommerpause:** Admin-Code nachladen (ca. 80 KB sparen).

## Version 1.39.1

### Neu in Version 1.39.1 (Stand 1.39.1.200, 13.11.2026, nur in der Test-App) – Fan-Tipp

- **Kein Gleichstand beim Tippen:** Ein Tipp mit gleichem Stand (z. B. 2:2) wird nicht mehr angenommen – es erscheint der Hinweis, einen Sieger zu tippen (bei Penaltyschießen zählt der Endstand mit einem Tor Vorsprung, z. B. 3:2).
- **Auswertung:** Die Zeile „Penaltys“ ist weg. Nur wenn es noch alte Tipps mit Gleichstand gibt, erscheint eine Zeile „Gleichstand“.
- **Ablauf:** Functions gehören mit ins Test-Paket und werden mit „Live gehen“ automatisch deployt (siehe Abschnitt „Aufbau der App“).

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
