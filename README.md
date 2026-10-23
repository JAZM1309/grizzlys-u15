# ESV Grizzlys U15 App

Installierbare Web-App (PWA) für die ESV Grizzlys U15 A und U15 B, Saison 2026/27.

Entwickelt von **JAZM**.

## Versionsnummern

Schreibweise `1.ZWEITE.DRITTE.CACHE`:

- **zweite Stelle:** größere Änderungen und neue Funktionen (die dritte Stelle beginnt wieder bei 0)
- **dritte Stelle:** optische Änderungen, Fehlerbehebungen und kleine Verbesserungen
- **letzte Stelle:** Cache-Nummer aus `sw.js` (steigt bei fast jedem Stand)

Die Stände von 1.9.1.66 bis 1.9.1.140 hießen ursprünglich alle „1.9.1“ und wurden am 19.10.2026 nach diesem Schema nachträglich nummeriert. Die GitHub-Markierungen (`live-1.9.1.…`, wichtig für „Live zurücksetzen“) behalten ihren alten Namen:

| Neue Version | Alte Bezeichnung | Datum | Art |
|---|---|---|---|
| 1.25.0.156 | – | 23.10.2026 | Neue Funktion |
| 1.24.1.155 | – (nur Test) | 23.10.2026 | Kleine Verbesserung |
| 1.24.0.154 | – | 20.10.2026 | Neue Funktion |
| 1.23.2.153 | – (nur Test) | 20.10.2026 | Optisch |
| 1.23.1.152 | – (nur Test) | 20.10.2026 | Optisch |
| 1.23.0.151 | – (nur Test) | 20.10.2026 | Neue Funktion |
| 1.22.5.150 | – (nur Test) | 20.10.2026 | Fehlerbehebung und Optisch |
| 1.22.4.149 | – (nur Test) | 20.10.2026 | Optisch |
| 1.22.3.148 | – (nur Test) | 20.10.2026 | Fehlerbehebung |
| 1.22.2.147 | – (nur Test) | 20.10.2026 | Kleine Änderung |
| 1.22.1.146 | – (nur Test) | 20.10.2026 | Fehlerbehebung |
| 1.22.0.144 | – (nur Test) | 20.10.2026 | Neue Funktion |
| 1.21.1.143 | – (nur Test) | 19.10.2026 | Optisch |
| 1.21.0.142 | – (nur Test) | 19.10.2026 | Neue Funktion |
| 1.20.0.141 | – (nur Test) | 19.10.2026 | Neue Funktion |
| 1.19.2.140 | 1.9.1.140 | 18.10.2026 | Optisch |
| 1.19.1.138 | 1.9.1.138 | 18.10.2026 | Kleine Verbesserung |
| 1.19.0.137 | 1.9.1.137 | 18.10.2026 | Neue Funktion |
| 1.18.0.136 | 1.9.1.136 | 18.10.2026 | Neue Funktion |
| 1.17.1.132 | 1.9.1.132 | 17.10.2026 | Optisch |
| 1.17.0.131 | 1.9.1.131 | 17.10.2026 | Neue Funktion |
| 1.16.0.127 | 1.9.1.127 | 17.10.2026 | Neue Funktion |
| 1.15.6.125 | 1.9.1.125 | 17.10.2026 | Verbesserung |
| 1.15.5.124 | 1.9.1.124 | 17.10.2026 | Verbesserung |
| 1.15.4.123 | 1.9.1.123 | 17.10.2026 | Optisch |
| 1.15.3.122 | 1.9.1.122 | 17.10.2026 | Optisch |
| 1.15.2.121 | 1.9.1.121 | 16.10.2026 | Optisch |
| 1.15.1.120 | 1.9.1.120 | 16.10.2026 | Kleine Ergänzung |
| 1.15.0.117 | 1.9.1.117 | 16.10.2026 | Neue Funktion |
| 1.14.1.111 | 1.9.1.111 | 15.10.2026 | Kleine Ergänzung |
| 1.14.0.110 | 1.9.1.110 | 15.10.2026 | Neue Funktion |
| 1.13.1.109 | 1.9.1.109 | 15.10.2026 | Optisch |
| 1.13.0.108 | 1.9.1.108 | 14.10.2026 | Neue Funktion |
| 1.12.2.96 | 1.9.1.96 | 11.10.2026 | Optisch |
| 1.12.1.94 | 1.9.1.93 / 1.9.1.94 | 11.10.2026 | Kleine Änderung und Fehlerbehebung |
| 1.12.0.92 | 1.9.1.92 | 11.10.2026 | Neue Funktion |
| 1.11.0.90 | 1.9.1.90 | 10.10.2026 | Neue Funktion |
| 1.10.1.86 | 1.9.1.86 | 10.10.2026 | Fehlerbehebung und Verbesserung |
| 1.10.0.83 | 1.9.1.83 | 10.10.2026 | Neue Funktion |
| 1.9.1.66 | 1.9.1.66 | 08.10.2026 | Neue Funktion |

## Version 1.25.0

### Neu in Version 1.25.0 (Stand 1.25.0.156, 23.10.2026) – Neue Funktion

- **Spiel absagen (Admin):** im Spiel-Fenster neuer Kasten „🚫 Absage“ mit Knopf „Spiel absagen“ und optionalem Häkchen „📲 Push an alle senden“ (Text: „Spiel gegen … am … ist abgesagt.“, über den News-Push wie bei Spieländerungen). „Absage zurücknehmen“ macht es rückgängig. Gespeichert als Feld `cancelled` in `scheduleOverrides` (keine Regeländerung); gab es nur die Absage, wird das Dokument beim Zurücknehmen gelöscht, eine echte Terminänderung bleibt erhalten. Funktionen `admSetCancelled`, `admOvChanged`
- **Nur Anzeige – Ergebnisse laufen weiter:** abgesagte Spiele bleiben im Spielplan; Ergebnisse vom EHV werden unverändert übernommen und angezeigt (dann Ergebnis + „Abgesagt“)
- **Wo „Abgesagt“ erscheint:** Spielkarten (roter Hinweis, Datum/Uhrzeit durchgestrichen, statt „VS“ „Abgesagt“, ohne Termin/Erinnerung), Band der Startkarte „Nächstes Spiel · Abgesagt“, Letzte Ergebnisse, Kalenderansicht (durchgestrichen, „abgesagt“), Spieldetails, Admin-Spielliste, News (Abschnitt Spieländerungen als „Absage“, Hinweis oben auf der Startseite), Teilen-Text („❌ ABGESAGT“), PDF-Spielplan („abgesagt“), Kalenderdateien (Titel „ABGESAGT: …“, STATUS:CANCELLED). Gameday und Startbild entfallen für abgesagte Spiele
- **Social-Media-Bilder:** Überschrift „Spiel abgesagt“, roter Stempel „ABGESAGT“, Fußzeile „… · abgesagt“, Dateiname „…-abgesagt.png“
- **24h-Erinnerung:** `functions/push.js` überspringt abgesagte Spiele (muss neu bereitgestellt werden, zusammen mit dem Datenpush)

## Version 1.24.1

### Neu in Version 1.24.1 (Stand 1.24.1.155, 23.10.2026, nur in der Test-App) – Kleine Verbesserung

- **Push-Status zeigt die Push-Auswahl aus Firebase:** im Admin-Bereich › Status › Push-Status steht jetzt zusätzlich, wofür dieses Gerät in Firebase angemeldet ist (✓/✗ Ergebnisse · Erinnerung am Vortag · U15 A · U15 B) – genau danach entscheiden die Cloud Functions, wer welchen Push bekommt. Hinweis bei abgeschalteten Erinnerungen oder nur einer Mannschaft; Warnung, wenn die Auswahl in Firebase nicht zu den Einstellungen auf dem Handy passt (dann einmal umschalten und zurück, das speichert neu)

## Version 1.24.0

### Neu in Version 1.24.0 (Stand 1.24.0.154, 20.10.2026) – Neue Funktion

- **Suche auf der Gegner-Karte:** das Suchfeld „Gegner oder Ort suchen …“ steht jetzt direkt unter dem Umschalter Liste/Karte und gilt für beide Ansichten. Auf der Karte bleiben nur passende Hallen stehen (Vereinsname, Ort oder Adresse; Umlaute egal; „Bergkamen“/„Grizzlys“ findet unsere Halle), mit Anzahl der Treffer. Bei genau einem Treffer zoomt die Karte auf die Halle und öffnet das Fenster dazu. Der Filter Alle / U15 A / U15 B wirkt zusätzlich (`window.omSearch`, Suchlogik in `omRender`)
- **Liste:** die Suche findet jetzt auch den Ort der Auswärtshalle (z. B. „Neuss“ zeigt beide Neusser Spielgemeinschaften)

## Version 1.23.2

### Neu in Version 1.23.2 (Stand 1.23.2.153, 20.10.2026, nur in der Test-App) – Optisch

- **Anleitung Anzeigetafel – Kapitel-Knopf statt Wischleiste:** unter der Suche ein Knopf „☰ Kapitel“, der das aktuelle Kapitel anzeigt (z. B. „5. Strafzeitpulte“, oben „Übersicht – alle 7 Kapitel“). Ein Tipp klappt alle 7 Kapitel untereinander auf, das aktuelle ist markiert; ein Tipp auf ein Kapitel springt dorthin und klappt zu (ebenso Tipp daneben oder Esc). Suche und Knopf bleiben beim Scrollen oben stehen; beim Suchen ist der Knopf ausgeblendet

## Version 1.23.1

### Neu in Version 1.23.1 (Stand 1.23.1.152, 20.10.2026, nur in der Test-App) – Optisch

- **Anleitung Anzeigetafel – Kapitelleiste (seit 1.23.2 durch den Kapitel-Knopf ersetzt):** die Vorschlags-Knöpfe unter der Suche sind entfallen (Beispiele stehen im Suchfeld). Das Inhaltsverzeichnis ist jetzt eine schmale, waagerecht wischbare Kapitelleiste („1. Vor dem Spiel · 2. Hauptpult …“) direkt unter der Suche; beide bleiben beim Scrollen oben stehen, das aktuelle Kapitel ist orange unterstrichen. Beim Suchen ist die Leiste ausgeblendet
- **Gliederung unterscheidet sich von den Tasten:** Kapitel- und Schrittnummern stehen als schlichte Zahl mit Punkt („1.“) ohne Kreis. Kreise und Pillen bedeuten in der Anleitung jetzt nur noch Tasten

## Version 1.23.0

### Neu in Version 1.23.0 (Stand 1.23.0.151, 20.10.2026, nur in der Test-App) – Neue Funktion

- **Suche in der Anleitung Anzeigetafel:** oben ein Suchfeld (bleibt beim Scrollen stehen) (Vorschlags-Knöpfe seit 1.23.1 entfallen). Beim Tippen bleiben nur passende Kacheln, Schritte, Tabellenzeilen und Hinweise stehen, gelb umrandet, mit Anzahl der Treffer; passt eine Überschrift, erscheint der ganze Abschnitt. „2+2“, „2 + 2“, „2×2“ und „2x2“ gelten als gleich, Umlaute und Groß-/Kleinschreibung sind egal. Drucken druckt immer die ganze Anleitung. Alles in `anleitung-anzeigetafel.html` (Skript am Ende), Stand-Zeile „… mit Grafik der Strafzeitpulte und Suche“

## Version 1.22.5

### Neu in Version 1.22.5 (Stand 1.22.5.150, 20.10.2026, nur in der Test-App) – Fehlerbehebung und Optisch

- **Anleitung Anzeigetafel druckte alte Fassung:** Auf GitHub (Test und Live) liegt die neue Fassung mit der Grafik der Strafzeitpulte, und sie druckt auch korrekt. Manche Browser drucken aber aus ihrem eigenen Zwischenspeicher, an der App vorbei. Die App öffnet die Anleitung deshalb jetzt mit Versions-Anhang (`anleitung-anzeigetafel.html?v=<Cache-Nummer>`), sodass nach jedem Update garantiert die aktuelle Fassung geladen und gedruckt wird
- **Stand in der Anleitung:** im Kopf (auch auf dem Ausdruck) steht „Stand: 20.10.2026 · mit Grafik der Strafzeitpulte“ – so sieht man sofort, welche Fassung gedruckt wurde. Bei Änderungen an der Anleitung das Datum dort anpassen
- **Paket:** `anleitung-anzeigetafel.html` ist diesmal im Test-Paket enthalten
- **Regeln als Themen-Kacheln (ersetzt die Chips aus 1.21.0):** ohne Suchbegriff zeigt der Reiter große Kacheln (Symbol, Thema, Anzahl Regeln) zweispaltig, dazu „Alle Regeln“ (alphabetisch). Ein Tipp öffnet das Thema im Fenster `rulesModal` (Schließen mit ×, Tipp daneben oder Esc). Mit Suchbegriff verschwinden die Kacheln und die Trefferliste über alle Themen erscheint wie bisher. Funktionen `rlTopicOpen` / `rlTopicClose`, Symbole in `RL_IC`
- **Gegner-Karte ohne Liste darunter:** die Gegnerliste hat `display:grid` und ignorierte deshalb `hidden`; jetzt gilt `#opponentsView [hidden]{display:none}` – entweder Liste oder Karte

## Version 1.22.4

### Neu in Version 1.22.4 (Stand 1.22.4.149, 20.10.2026, nur in der Test-App) – Optisch

- **Schalter „Nutzungsstatistik erlauben“ (Einstellungen › Datenschutz):** das eigentliche Kontrollkästchen war zusätzlich zum Schieber sichtbar, und der Schieber zeigte den Zustand nicht an. Jetzt wie die Push-Schalter nur der Schieber (grün = erlaubt)

## Version 1.22.3

### Neu in Version 1.22.3 (Stand 1.22.3.148, 20.10.2026, nur in der Test-App) – Fehlerbehebung

- **Gegner-Karte öffnete als Weltkarte:** Leaflet hatte beim Anlegen noch keinen Ausschnitt, die Logos konnten dann nicht gesetzt werden; und wurde die Karte bei verstecktem Reiter erzeugt (App merkt sich „Karte“), berechnete sie den Ausschnitt mit Größe 0. Jetzt startet die Karte mit einem NRW-Ausschnitt und wird erst eingepasst, wenn sie sichtbar ist (`omFit` + ResizeObserver) – auch bei jedem erneuten Öffnen des Reiters und nach dem Filtern
- **Möglichst nah:** Einpassen mit 26 px Rand und Zoom in Viertelstufen (`zoomSnap 0.25`), sodass alle angezeigten Hallen gerade so draufpassen

## Version 1.22.2

### Neu in Version 1.22.2 (Stand 1.22.2.147, 20.10.2026, nur in der Test-App) – Kleine Änderung

- **„Datenschutz & Kontakt“ statt „Datenschutz & Impressum“:** keine Platzhalter mehr für Name und Anschrift. Abschnitt „Kontakt“: privates, nicht kommerzielles Angebot ohne Werbung, App entwickelt von JAZM, E-Mail grizzlys-app@gmx.de. Verantwortlich laut Datenschutzhinweis: der Entwickler (JAZM), erreichbar über dieselbe Adresse. Alle Verweise (Abfrage, Einstellungen, Info) umbenannt
- **Hinweis:** Ein vollständiges Impressum nach § 18 MStV (Name und ladungsfähige Anschrift) ist das nicht. Sobald geklärt ist, ob der Verein die App als Anbieter übernimmt, kann im Fenster `legalModal` wieder ein Abschnitt „Impressum“ ergänzt werden

## Version 1.22.1

### Neu in Version 1.22.1 (Stand 1.22.1.146, 20.10.2026, nur in der Test-App) – Fehlerbehebung

- **Entfernungen neu berechnet (`rinkDistanceKm`):** alle Werte jetzt als Fahrstrecke Eishalle Bergkamen → Eishalle des Gegners (OSRM auf OpenStreetMap-Daten, schnellste Route, Stand 20.10.2026; gegengeprüft mit Routenplanern: Ratingen, Dinslaken, Darmstadt ±1–2 km). Vorher waren viele Werte zu niedrig, einzelne sogar unter der Luftlinie. Alt → neu: Gelsenkirchen 43→47, Neuss 91→103, Duisburg 68→82, Hamm 24→17, Herford 91→112, Grefrath 80→123, Dinslaken 60→73, Essen 53→65, Dortmund 24→30, Bielefeld 91→95, Solingen 67→79, Aachen 155→170, Ratingen 62→94, Wiehl 95→122, Möhnesee 43→52, Neuwied 185→188, neu Darmstadt 262. Grundlage sind die Hallen-Koordinaten aus `RINK_GEO` (auf etwa 1 km genau)
- **ESC Darmstadt auf der Karte an der eigenen Halle:** Eishalle Darmstadt, Alsfelder Straße 45, 64289 Darmstadt (262 km). Im Fenster steht „Heimspiel wird nicht hier ausgetragen – beide Spiele finden in Bergkamen statt“, ohne Route-Knopf. Steuerung über `OPP_HOME` in `index.html` (Gegner → Halle für die Karte). In der Gegner-Liste bleibt es bei Bergkamen / 0 km, weil dort die Spiele stattfinden
- **Unsere Halle** steht jetzt immer auf der Karte, auch wenn dort kein Gegner einsortiert ist

## Version 1.22.0

### Neu in Version 1.22.0 (Stand 1.22.0.144, 20.10.2026, nur in der Test-App) – Neue Funktion

- **Gegner-Karte:** im Reiter „Gegner“ oben der Umschalter „☰ Liste / 🗺️ Karte“. Die Karte zeigt jeden Gegner mit Logo an der Halle seines Auswärtsspiels (wie Route und Entfernung in der Liste), Rand blau = U15 A, orange = U15 B, beide = zweifarbig; unsere Halle in Bergkamen mit gelbem Ring (ESC Darmstadt seit 1.22.1 an der eigenen Halle). Filter „Alle / U15 A / U15 B“. Ein Tipp auf ein Logo zeigt Halle, Adresse, Entfernung, die Mannschaften mit Knopf „Spiele“ (öffnet das Gegner-Fenster) und „Route“. Die zuletzt gewählte Ansicht merkt sich die App
- **Datenschutz bei der Karte:** Leaflet (cdnjs) und Kartenbilder (OpenStreetMap) werden erst nach „Karte laden“ geholt; mit „Nicht mehr fragen“ merkt sich die App das (`grizzlysMapOk`). Abschnitt 7 der Datenschutzerklärung ergänzt. Ohne Internet bleibt die Karte leer, der Knopf zeigt „Erneut versuchen“
- **Koordinaten:** `RINK_GEO` in `index.html` – ungefähre Lage der Hallen (Schlüssel wie in `rinkAddresses`). Kommt eine neue Halle dazu, muss sie dort mit Breiten- und Längengrad ergänzt werden, sonst fehlt der Gegner auf der Karte
- **Wischen:** auf der Karte verschiebt ein Wisch die Karte und wechselt nicht den Reiter (`data-noswipe`)

## Version 1.21.1

### Neu in Version 1.21.1 (Stand 1.21.1.143, 19.10.2026, nur in der Test-App) – Optisch

- **Letzte Ergebnisse kompakt (Startseite):** statt zweier großer „Letztes Spiel“-Karten eine Karte mit je einer Zeile pro Mannschaft (Datum, Teams mit Logos, Ergebnis, Sieg/Niederlage, Teamfarbe am Rand). Ein Tipp öffnet die Spieldetails; gibt es einen Spielbericht, steht darunter „📝 Spielbericht“. Funktion `lrRender` in `index.html`; die großen Karten `g3HomeLast`/`g3HomeLast2` bleiben unsichtbar im Dokument. Eigene Stile für Dunkel und Halloween
- **Mindestschriftgröße:** 56 Stellen im Stil mit 9–10,5 px auf 11 px (≤ 9,5 px) bzw. 12 px angehoben (u. a. Gegnerliste, Heim/Auswärts, Tabellen-Chips, Drittel, Admin-Bereich). Ausgenommen: News-Zähler am Symbol, Mini-Spiel und PDF-Druck
- **Neu in der App:** ein gemeinsamer Eintrag für 1.20.0 bis 1.24.0 (keine davon war einzeln live)

## Version 1.21.0

### Neu in Version 1.21.0 (Stand 1.21.0.142, 19.10.2026, nur in der Test-App) – Neue Funktion

- **Datenschutz & Impressum:** neue Seite, erreichbar über Info (unten), Einstellungen › Datenschutz und die Zustimmungs-Abfrage. seit 1.22.2 als „Datenschutz & Kontakt“ ohne Anschrift (siehe dort)
- **Nutzungsstatistik nur mit Zustimmung:** beim ersten Start fragt die App „Darf die App mitzählen?“ (Erlauben / Nein danke, gleich groß). Ohne Zustimmung landet nichts im `dataLayer`, es geht also nichts an Google Analytics; die `sw.js` liefert die Analytics-Datei dann gar nicht erst aus. Änderbar unter Einstellungen › Datenschutz („Nutzungsstatistik erlauben“), beim Widerruf werden die `_ga`-Cookies gelöscht. Gespeichert in `localStorage` (`grizzlysConsent`) und für die `sw.js` im Speicher `grizzlys-consent`. Die Ankerzeilen für `tolive.py` sind unverändert
- **Geräte-Zählung:** `appInstallations` wird nur noch mit Zustimmung oder bei eingeschaltetem Push geschrieben – die Gerätezahl in der App-Statistik fällt dadurch niedriger aus
- **Regeln mit Themen-Chips:** unter der Suche steht eine waagerecht wischbare Reihe mit allen Themen und Anzahl; ein Tipp filtert, „Alle“ zeigt wieder alles. Das alte Themen-Menü (☰) ist ausgeblendet
- **Push bei Spieländerung:** im Spiel-Fenster (Admin › Termin ändern) gibt es das Häkchen „📲 Push an alle senden“. Es lässt sich nur setzen, wenn Datum, Uhrzeit oder Spielort wirklich geändert wurden, und ist standardmäßig aus; der Hinweis darunter zeigt den genauen Push-Text. Versand über den bestehenden News-Push (`onNewsCreated`, beachtet die Mannschaftsauswahl der Geräte) – keine neue Cloud Function, keine Regeländerung. Der Hinweis wird mit „Sichtbar bis gestern“ angelegt, erscheint also nicht doppelt in den News, steht aber im Admin-Bereich unter den abgelaufenen Hinweisen als Nachweis. EHV-Übernahmen verschicken keinen Push

## Version 1.20.0

### Neu in Version 1.20.0 (Stand 1.20.0.141, 19.10.2026, nur in der Test-App) – Neue Funktion

- **Versandstatus bei Rückmeldungen:** im Admin-Bereich zeigt jede Rückmeldung, ob Push und E-Mail verschickt wurden (grün „gesendet“, grau „wird gesendet“ in den ersten 15 Minuten, rot „fehlt“)
- **Rückmeldungen gehen nicht mehr verloren:** ohne Verbindung meldet das Formular den Fehler nach spätestens 15 Sekunden direkt im Formular (statt endlos zu warten); der Text bleibt auf dem Gerät gespeichert, auch wenn die App geschlossen wird, und lässt sich mit „Nochmal senden“ erneut abschicken
- **Keine doppelten Rückmeldungen:** jede Meldung bekommt beim ersten Versuch eine feste ID; kam der erste Versuch doch an, legt „Nochmal senden“ keine zweite Meldung an
- **Versionsanzeige einheitlich:** Formular, Info-Seite und gespeicherte Meldungen zeigen dieselbe Version (im Formular stand zuvor noch 1.9.1.86)
- **Versionsnummern nachgetragen:** alle Live-Stände seit 1.9.1 haben nach dem neuen Schema eine eigene Version bekommen (siehe „Versionsnummern“)
- Push- und E-Mail-Versand (Cloud Function und GitHub-Workflow) sind unverändert

## Version 1.19.2

### Neu in Version 1.19.2 (Stand 1.19.2.140, 18.10.2026, bisher 1.9.1.140) – Optisch

- **Neue Bilder bei den Handzeichen:** Die 29 Bilder im Thema „Handzeichen“ zeigen jetzt einen gezeichneten Schiedsrichter auf dem Eis mit gut erkennbaren Händen. Dateien im Ordner `handzeichen/` als `<schlüssel>.webp` (320 × 360, transparent, Figur unten bündig, zusammen ca. 560 KB; Zuordnung in `handzeichen/LIESMICH.txt`). Ein Bild wird ersetzt, indem eine Datei mit demselben Namen hochgeladen wird; fehlt eines, zeigt die App die bisherige gezeichnete Figur (`sigSvgOld`). Die Bilder werden beim ersten Ansehen zwischengespeichert und sind danach offline verfügbar

## Version 1.19.1

### Neu in Version 1.19.1 (Stand 1.19.1.138, 18.10.2026, bisher 1.9.1.138) – Kleine Verbesserung

- **Übersicht in der Info:** Aufklappbare Karte „So findest du dich zurecht“ mit allen Bereichen (Start, Spielplan, Gegner, Regeln, Downloads, News, Einstellungen) und je einer Zeile Erklärung; ein Tipp springt direkt dorthin. Darunter drei Tipps (Wischen, Spielkarte antippen, Teilen). Der Admin-Bereich steht dort bewusst nicht. Neue Bereiche als weitere Zeile im Block `#appMap` in `index.html` ergänzen

## Version 1.19.0

### Neu in Version 1.19.0 (Stand 1.19.0.137, 18.10.2026, bisher 1.9.1.137) – Neue Funktion

- **Ergebnisbild mit Kurzbericht:** Im Fenster „Social-Media-Bild“ steht beim Ergebnisbild die Kurzfassung des Spielberichts (bearbeitbar, Häkchen „Kurzbericht mit teilen“, Knopf „Text kopieren“). Beim Teilen gehen Bild und Text zusammen raus (z. B. WhatsApp, Facebook); weil Instagram keinen Text übernimmt, kopiert die App ihn zusätzlich in die Zwischenablage. Ist der Bericht in „Kurz“ gespeichert, wird dieser Text genommen, sonst wird die Kurzfassung aus Schlagworten und Auswahl erzeugt (`instaCaption`). Nutzer sehen nur veröffentlichte Berichte, der Admin auch Entwürfe

## Version 1.18.0

### Neu in Version 1.18.0 (Stand 1.18.0.136, 18.10.2026, bisher 1.9.1.136) – Neue Funktion

- **Schlagworte für den Spielbericht:** Im Spiel-Fenster gibt es das Feld „Schlagworte“ (mit Komma getrennt, z. B. „Teamgeist, Kampfgeist, starker Torhüter“). Die App macht daraus passende Sätze – je nach Sieg, Niederlage oder Unentschieden – und setzt sie als eigenen Absatz nach dem Spielverlauf ein. Bekannte Begriffe (Teamgeist/Geschlossenheit, Kampfgeist/Einsatz, Torhüter, Defensive, Tempo, Disziplin, Chancen, Fans, Strafzeiten, dünner Kader, Spaß, Fortschritte, nie aufgegeben) haben eigene Satzbausteine (`REP_KW` in `index.html`); andere Begriffe erscheinen als Aufzählung („Was das Team heute auszeichnete: …“), Begriffe mit „mit …“ als „Die Mannschaft trat mit … auf.“ Die Schlagworte werden mit dem Bericht gespeichert (Feld `keywords` in `reports`, Firestore-Regel angepasst). Ab Cache-Stand 135 (live mit 1.18.0) mit Knopf „Übernehmen“ (oder Enter); der Formularstand übersteht das Neuzeichnen des Spiel-Fensters, und ein gespeicherter, unveränderter Entwurf bleibt automatisch
- **Angaben im Spielbericht auswählen:** Im Spiel-Fenster unter „Im Bericht verwenden“ steht für jede verfügbare Angabe ein Schalter mit dem echten Wert (z. B. „👥 45 Zuschauer“, „🎯 Überzahl (2 von 3)“). Vorbelegt ist, was meist interessant ist: Zuschauer ab 100 (`REP_ATT_MIN`), Traumstart nur bei einem Tor in den ersten 5 Minuten, Überzahl ab 2 Toren, Unterzahl ab 3 überstandenen, verschiedene Torschützen ab 5, Siegesserie ab 3; Spielverlauf, Doppelschlag, spätes Siegtor/Ehrentreffer, wenige Strafminuten, Zu null, Tabelle, erstes Duell und Ausblick immer. Angaben, die es im Spiel nicht gibt, erscheinen nicht. Dazu „Normal / Kurz“ (Kurz: Einstieg, Drittel, Schlagworte, Tabelle, Ausblick – z. B. für Instagram). Auswahl und Länge werden mit dem Bericht gespeichert (Felder `use` und `len` in `reports`, Firestore-Regel angepasst). Die Logik steckt in `repDraft` (`facts`)

## Version 1.17.1

### Neu in Version 1.17.1 (Stand 1.17.1.132, 17.10.2026, bisher 1.9.1.132) – Optisch

- **Zwei Spielberichte am selben Tag:** der Streifen auf der Startseite zeigt beide Berichte untereinander; gespielte Spiele zeigen statt Route und Adresse nur „Gespielt in …“

## Version 1.17.0

### Neu in Version 1.17.0 (Stand 1.17.0.131, 17.10.2026, bisher 1.9.1.131) – Neue Funktion

- **Spielberichte:** Im Spiel-Fenster des Admin-Bereichs entsteht nach dem Ergebnis automatisch ein Berichtsentwurf als Fließtext in Absätzen: Einstieg passend zum Spiel (Kantersieg, Zittersieg, Aufholjagd, Verlängerung, Niederlage …), Spielverlauf Drittel für Drittel, Special Teams und Mannschaftsleistung, Tabelle, erstes Duell und Ausblick. Grundlage sind Ergebnis, Drittel, Tabelle und – über die neue Cloud Function `gameReport` – der EHV-Spielbericht (Tore mit Spielzeit, Über-/Unterzahl, Führungszeit, Zuschauer). Überschrift und Text lassen sich bearbeiten; „↻ Neu erzeugen“ liefert eine andere Formulierung, „📋 Kopieren“ den Text für Social Media. Spielernamen nur mit dem Schalter „Namen von Torschützen und Torhütern nennen“ (aus, Einstellung je Gerät); Strafen nie mit Namen. Veröffentlichte Berichte stehen 14 Tage in den News („📝 Spielberichte“), im Streifen auf der Startseite und in den Spieldetails. Neue Sammlung `reports`, neue Firestore-Regel
- **Spielbericht auf der Startseite:** Die Karte „Letztes Spiel“ zeigt bei vorhandenem Bericht die Zeile „📝 Spielbericht“ mit Überschrift; ein Tipp öffnet die Spieldetails direkt beim Bericht. Im Spielplan gibt es dafür den Knopf „Bericht“. Haben beide Mannschaften am selben Tag gespielt, zeigt der Streifen beide Berichte untereinander. Gespielte Spiele zeigen keine Route und Adresse mehr, nur „Gespielt in …“

## Version 1.16.0

### Neu in Version 1.16.0 (Stand 1.16.0.127, 17.10.2026, bisher 1.9.1.127) – Neue Funktion

- **Tippfehler sind keine Spieländerung:** Ändert der Admin bei Spielort, Heim- oder Gastteam nur die Schreibweise (Groß/klein, Leerzeichen, ä/ae, 1–2 vertippte Buchstaben), erscheint keine Spieländerung in den News. Datum, Uhrzeit und andere Ziffern (z. B. „1b“) zählen immer als echte Änderung. Im Spiel-Fenster zeigt „In den News als Spieländerung melden“ die Erkennung an und lässt sich überstimmen (Feld `news` in `scheduleOverrides`; fehlt es, entscheidet die Erkennung). Funktionen `chgSame` / `chgFields` in `index.html`
- **Spieländerungen in den News steuern:** Admin-Bereich › News › „Spieländerungen“ listet alle kommenden geänderten Spiele mit Vorher/Nachher. Ein Schalter je Spiel legt fest, ob die Änderung für alle in den News steht; „automatisch“ setzt zurück auf die Erkennung

## Version 1.15.6

### Neu in Version 1.15.6 (Stand 1.15.6.125, 17.10.2026, bisher 1.9.1.125) – Verbesserung

- **Gameday mit zwei Spielen:** An Tagen mit zwei Spielen zeigt der Chip im Kopfbereich beide Spiele untereinander – jeweils Countdown („Bully in …“), „Läuft gerade“, „Ergebnis folgt“ oder das Ergebnis (Sieg/Niederlage/Remis)

## Version 1.15.5

### Neu in Version 1.15.5 (Stand 1.15.5.124, 17.10.2026, bisher 1.9.1.124) – Verbesserung

- **Push bei offener App:** Ist die App beim Eintreffen eines Pushs gerade geöffnet, erscheint jetzt eine echte Systembenachrichtigung (mit Ergebnis- bzw. 24h-Symbol) statt nur eines Hinweisfensters; beim Ergebnis-Push werden die Ergebnisse sofort neu geladen

## Version 1.15.4

### Neu in Version 1.15.4 (Stand 1.15.4.123, 17.10.2026, bisher 1.9.1.123) – Optisch

- **Strafzeitpult bebildert:** Die Anzeigetafel-Anleitung zeigt das Strafzeitpult als Grafik nach dem echten Pult (Foto aus der Halle) mit Tastennummern und Eingabe-Reihenfolge. Ablauf in der Halle bestätigt: Nummer → V → Minuten → V

## Version 1.15.3

### Neu in Version 1.15.3 (Stand 1.15.3.122, 17.10.2026, bisher 1.9.1.122) – Optisch

- **Einstellungen im gleichen Look:** Auch die Karten in den Einstellungen haben jetzt Rahmen, Farbleiste (Darstellung blau bzw. Designfarbe, Saison-Designs lila, Push gelb, Feedback grün) und kräftigeren Schatten

## Version 1.15.2

### Neu in Version 1.15.2 (Stand 1.15.2.121, 16.10.2026, bisher 1.9.1.121) – Optisch

- **Kacheln deutlicher:** In Downloads und Info haben die Kacheln einen feinen Rahmen, links eine Farbleiste (Kalender/Info blau bzw. Designfarbe, PDF rot, Anzeigetafel gelb, Social-Media-Bilder in Teamfarbe) und einen kräftigeren Schatten – in allen Designs

## Version 1.15.1

### Neu in Version 1.15.1 (Stand 1.15.1.120, 16.10.2026, bisher 1.9.1.120) – Kleine Ergänzung

- **Regeln: Nachwuchs NRW und Themen-Menü:** 17 neue Einträge aus den Durchführungsbestimmungen des EHV NRW, Anhang 4 – Nachwuchs (Stand 13.05.2026): Altersklassen, Hochspielen, Bodycheck ab U15 (U7–U13 verboten), Zahnschutz-Pflicht U15–U20, A-/B-Mannschaft und Ummeldung, Einsatz in den ersten beiden Spielen, höchstens zwei Mannschaften pro Spieler, Torhüter-Einsatzzeiten U13/U15 (mind. 10 %, max. 75 %), Antritts- und Meldestärken, Doppellizenz, Spielerinnen, Kontingentspieler, Tabelle bei Punktgleichheit, Spielzeiten, Spielverlegung, Meldeliga. Die Themen-Knöpfe sind durch ein Menü ☰ rechts im Suchfeld ersetzt; ein gewähltes Thema erscheint als „Thema: … ✕“. Anleitung Anzeigetafel: Tipp „Pause verkürzen“ (Taste 28). Die Cache-Stände 118/119 (Grizzly-Kopf) wurden nicht veröffentlicht

## Version 1.15.0

### Neu in Version 1.15.0 (Stand 1.15.0.117, 16.10.2026, bisher 1.9.1.117) – Neue Funktion

- **Handzeichen:** Im Reiter „Regeln“ neues Thema „Handzeichen“ mit 30 Zeichen von Schiedsrichter und Linienrichter, jeweils mit gezeichnetem Piktogramm (SVG, Funktion `sigSvg`, Posen in `SIG_POSE`) und kurzer Erklärung; Grundlage IIHF Official Rule Book, Anhang I „Game Official Signals“. Einträge im Feld `RULES` mit `c:"Handzeichen"` und `p` = Bild
- **Anleitung Anzeigetafel:** Downloads › „Für das Kampfgericht“ › „Anzeigetafel bedienen“ öffnet die eigene Seite `anleitung-anzeigetafel.html` (hell/dunkel, mit Knopf „Drucken / als PDF speichern“): Stramatel 452 Hauptpult als Tastenbild mit Nummern, Vorbereitung, Spielbetrieb, Korrekturen, Strafzeitpulte (Eingabe, Löschen, Warteliste) und Hilfe. Grundlage: Stramatel-Anleitungen Hauptbedienpult 452G und Strafzeitpulte 452G
- **Veröffentlichen robuster:** Kurze Verbindungsaussetzer beim automatischen Nachladen im Bereich „Veröffentlichen“ werden still überbrückt; statt „internal“ erscheint eine verständliche Meldung, und beim Zurückkehren in die App wird der Stand neu geladen
- **Reiter „Regeln“:** neuer fünfter Reiter zwischen Gegner und Downloads (auch per Wischen) mit rund 60 kurz erklärten Regeln in acht Themen (Spielablauf, Abseits & Icing, Strafen, Fouls, Torhüter, Tore & Statistik, Nachwuchs, Begriffe). Freitextsuche über Titel, Text und Stichworte, umlaut-unabhängig, Treffer markiert und nach Relevanz sortiert. Grundlage: IIHF-Regelbuch in der DEB-Fassung 2026/27; Liga-Details (Drittellänge, Körperspiel, Verlängerung) verweisen auf die Durchführungsbestimmungen des EHV NRW. Inhalte stehen in `index.html` im Feld `RULES` (Felder c = Thema, t = Titel, x = Text, k = Suchwörter). Die Lesbarkeitsprüfung umfasst die neue Seite
- **Update-Hinweis wählbar:** Beim „Live gehen“ legt das Häkchen „Update-Hinweis für Nutzer anzeigen“ fest, ob Nutzer „Neue Version verfügbar“ sehen. Ohne Häkchen kommt die neue Version still beim nächsten Öffnen der App. Technisch: `UPDATE_HINWEIS` in der `sw.js` (wird beim Live-Gang gesetzt; Werkzeug: `./live-gehen.sh --mit-hinweis`). Wirkt für Nutzer, die schon 1.15.0 oder neuer haben
- **Veröffentlichen mit dem Grizzlys-Werkzeug:** Test-Pakete, Live-Gang, Live-Dateien, Lesbarkeitsprüfung und Zurücksetzen laufen über Skripte in der Cloud Shell (`~/grizzlys-werkzeug`, Anleitung in dessen `LIESMICH.txt`)

## Version 1.14.1

### Neu in Version 1.14.1 (Stand 1.14.1.111, 15.10.2026, bisher 1.9.1.111) – Kleine Ergänzung

- **Doku beim Live-Gang:** README.md, README.txt, FUNCTIONS-ANLEITUNG.txt und PDFs kommen im Test-Paket im Ordner `nur-live` mit (im Test-Repo unter `.github/live-doku` abgelegt) und werden bei „Live gehen“ automatisch nach Live übernommen; ist die Version schon live, lässt sich nur die Doku übernehmen

## Version 1.14.0

### Neu in Version 1.14.0 (Stand 1.14.0.110, 15.10.2026, bisher 1.9.1.110) – Neue Funktion

- **Veröffentlichen aus dem Admin-Bereich:** Admin-Bereich › Status › „🚀 Veröffentlichen“ mit den Knöpfen „Test-Paket hochladen“, „Live gehen“ und „Live zurücksetzen“. Die Cloud Function `deployControl` nimmt den Auftrag an (nur Admin) und startet die GitHub-Abläufe `test-hochladen.yml` (Test-Repo) bzw. `live-gehen.yml` (Live-Repo) mit Lesbarkeitsprüfung; Ergebnis und Veröffentlichungsstatus erscheinen im Admin-Bereich. Ablage der Pakete im Zweig `eingang` des Test-Repos

## Version 1.13.1

### Neu in Version 1.13.1 (Stand 1.13.1.109, 15.10.2026, bisher 1.9.1.109) – Optisch

- **Lesbarkeit:** von der automatischen Prüfung gefundene Stellen verbessert: „JAZM“ auf der Info-Seite, Plakette „Letztes Spiel“, Knöpfe und „VS“ auf den Spielkarten im Weihnachtsdesign, Wochentag bei U15-B-Karten, Status-Chip im Admin-Bereich (dunkel)

## Version 1.13.0

### Neu in Version 1.13.0 (Stand 1.13.0.108, 14.10.2026, bisher 1.9.1.108) – Neue Funktion

- **Adventskalender-Auswertung:** Admin-Bereich > Status > „Adventskalender“: Geräte, Antworten, richtig/falsch gesamt sowie getrennt nach Regel- und Mannschaftsfragen, aufklappbar je Türchen. Jedes Gerät überträgt dafür je Türchen nur Fragenart und richtig/falsch (neue Sammlung `adventAnswers`, keine Namen). Unter dem Kalender steht für jeden Nutzer „Deine Auswertung“. **Firestore-Regeln müssen veröffentlicht werden**
- **Weihnachten und Dunkelmodus:** Tannenbaum im Hintergrund dezenter; „Gespielte Spiele anzeigen“ im Dunkelmodus und in den Themen-Designs lesbar
- **Update-Banner:** erscheint nur noch, wenn die wartende Version wirklich neuer ist als die angezeigte; gleich neue Versionen werden still übernommen. Live- und Test-App löschen sich nicht mehr gegenseitig den Offline-Speicher
- **Wischen:** Wisch nach links/rechts wechselt zwischen Start, Spielplan, Gegner und Downloads; die Seite folgt dem Finger, am Rand erscheint die Zielseite, danach zeigen Punkte die Position. Senkrechtes Scrollen, Bildschirmrand (Android-Zurück-Geste) und offene Fenster lösen nichts aus
- **Scroll-Leiste:** beim Scrollen zeigt rechts eine schmale Leiste die Position, im Spielplan mit Monat; der Balken lässt sich anfassen und ziehen
- **Zurückwischen:** in Einstellungen und Info führt ein Wisch nach rechts zurück; das News-Fenster schließt sich mit einem Wisch nach rechts oder unten
- **Kennzeichnung:** „App entwickelt von JAZM“ unten auf der Info-Seite, „APP: JAZM“ klein auf den Social-Media-Bildern, Autor-Angabe im Code
- **Halloween lesbar:** Download-Karten im Halloween-Design (heller Modus) dunkel, damit die Schrift lesbar ist
- **Updates sofort:** der Service Worker holt Seite und Programmdateien immer frisch vom Server (nicht aus dem 10-Minuten-Zwischenspeicher von GitHub Pages)
- **Gruselmoment:** im Halloween-Design lugt höchstens einmal am Tag kurz eine Gestalt von unten herein (`halloween/gestalt.webp`); nicht anklickbar, nie über offenen Fenstern; eigener Schalter in den Einstellungen
- **Kleinere Bilder:** `logo.png` (2 MB → 58 KB), App- und Push-Symbole und große Gegner-Logos verkleinert, Dateinamen unverändert; die App lädt beim ersten Öffnen deutlich schneller

## Version 1.12.2

### Neu in Version 1.12.2 (Stand 1.12.2.96, 11.10.2026, bisher 1.9.1.96) – Optisch

- **Übersichtlicher:** Spielplan zeigt gespielte Spiele zugeklappt („Gespielte Spiele anzeigen“, Zähler); Startseite ohne den alten Hinweis „38 Spiele · chronologisch sortiert“, Mannschafts-Kacheln kompakt nebeneinander (Platz, Bilanz, Form, Fortschritt); Einstellungen: Halloween und Weihnachten in einem Kasten „Saison-Designs“, die Beispiel-Meldungen verschwinden bei aktivem Push, Admin-Bereich nur noch als kleiner Link unten, „Push kommt nicht an? Neu einrichten“ nur bei aktivem Push; Info ohne die sechs Kacheln, die nur die Reiter wiederholten. News-Eintrag 1.9.1.95
- **Admin-Fenster fest:** das Admin-Fenster hat nach der Anmeldung immer die volle Höhe und springt beim Wechsel zwischen den Reitern nicht mehr; ist man nach unten gescrollt, beginnt der neue Reiter direkt unter der Reiterleiste

## Version 1.12.1

### Neu in Version 1.12.1 (Stand 1.12.1.94, 11.10.2026, bisher 1.9.1.93 / 1.9.1.94) – Kleine Änderung und Fehlerbehebung

- **Nächste und letzte Spiele beider Mannschaften:** die Startseite zeigt immer das nächste Spiel von U15 A und von U15 B als „Nächstes Spiel“ (oben das frühere) und ebenso das zuletzt gespielte Spiel beider Mannschaften als „Letztes Spiel“ (oben das neuere, ohne Ergebnis „Ergebnis folgt“), jeweils in Teamfarbe (1.9.1.93 zeigte nur zwei Spiele am selben Tag)

## Version 1.12.0

### Neu in Version 1.12.0 (Stand 1.12.0.92, 11.10.2026, bisher 1.9.1.92) – Neue Funktion

- **Admin-Bereich neu:** oben der Kasten „Zu tun“ (fehlende Ergebnisse, offene Rückmeldungen, EHV-Abweichungen, Spiele von heute, fehlender Admin-Push), darunter die Reiter Spiele · News · Feedback · Status. Im Reiter Spiele eine einzige kompakte Spielliste (Kommende / Gespielt / Alle, A/B); ein Tipp öffnet das Spiel-Fenster mit Ergebnis, Termin & Ort, Social-Media-Bildern und „News zu diesem Spiel“. EHV-Abweichungen bleiben stehen, bis sie übernommen oder abgelehnt werden; abgelehnte stehen in `ehvSync/dismissed` und werden auch vom Push (`scheduleWatch`) nicht mehr gemeldet. Push-Status (mit Test-Push und Fehlersuche) und App-Statistik liegen im Reiter Status. Neue Firestore-Regel für `ehvSync`; `functions/ehv-sync.js` geändert
- **Push-Status aufklappbar:** im Reiter Status ist der Push-Status zugeklappt; die Überschrift zeigt das Ergebnis der Prüfung als Zähler (z. B. „5 von 5 ✓“ grün oder „4 von 5 ✓ · 1 ✗“ rot), aufgeklappt stehen alle Prüfpunkte, Test-Push und Fehlersuche

## Version 1.11.0

### Neu in Version 1.11.0 (Stand 1.11.0.90, 10.10.2026, bisher 1.9.1.90) – Neue Funktion

- **Push-Status im Admin-Bereich:** neuer Abschnitt „Push-Status“ ganz oben: zeigt, ob dieses Gerät als Admin für Push angemeldet ist (Berechtigung, Token, Eintrag in Firebase, Admin-Markierung, Zahl der Admin-Geräte). „Test-Push sofort senden“ zeigt bei offener App eine grüne Bestätigung, „In 10 Sekunden senden“ die echte Benachrichtigung (vorher zum Startbildschirm wechseln). Ungültige Admin-Einträge räumt der Test-Push selbst auf. Unter „Fehlersuche“: lokale Test-Benachrichtigung (ohne Firebase) und Diagnose (Service Worker, Push-Abo, Token)
- **Push-Anmeldung wird erneuert:** die App holt alle 7 Tage beim Öffnen ein neues Push-Abo und ein neues Token (`renewPushRegistration` in `index.html`, Zeitraum `PUSH_RENEW_DAYS`). Das behebt „tote“ Abos, bei denen Firebase den Versand annimmt, aber auf dem Gerät nichts ankommt. In den Einstellungen gibt es dafür unter dem Push-Knopf zusätzlich „Push kommt nicht an? Neu einrichten“. Alte Token-Einträge entfernt der nächste Push-Versand
- **Neue Cloud Function:** `functions/pushtest.js` (`adminPushTest`, nur für den Admin aufrufbar) verschickt den Test-Push an alle Admin-Geräte; `functions/index.js` um eine Zeile ergänzt
- **Dunkles Design:** aufgeklappte Abschnitte im Admin-Bereich haben wieder einen lesbaren Kopf

## Version 1.10.1

### Neu in Version 1.10.1 (Stand 1.10.1.86, 10.10.2026, bisher 1.9.1.86) – Fehlerbehebung und Verbesserung

- **Gameday-Anzeige korrigiert:** steht das Ergebnis schon fest, zeigt der Kopfbereich das Ergebnis statt „Läuft gerade“
- **Tabellenstand schneller aktuell:** die App fragt den Tabellenstand alle 5 Minuten neu ab (auch bei offener App), die Function `standings` holt höchstens alle 5 Minuten neu vom EHV (vorher 30 Minuten); `functions/standings.js` muss neu bereitgestellt werden

## Version 1.10.0

### Neu in Version 1.10.0 (Stand 1.10.0.83, 10.10.2026, bisher 1.9.1.83) – Neue Funktion

- **Halloween-Zeitraum:** jetzt 26.10. bis 2.11. (Funktion `hwInSeason` in `index.html`); neues Halloween-Logo `halloween-logo.png`
- **Gameday:** an Spieltagen steht oben im Kopfbereich groß „GAME DAY“; der Saison-Chip wird zum Countdown („Bully in 2:15 h“, „Läuft gerade“, danach Sieg/Niederlage/Remis oder „Ergebnis folgt“). Beim ersten Öffnen am Spieltag erscheint ein Startbild mit Logo, Paarung, Uhrzeit und Halle (einmal pro Tag, schließt per Tipp oder nach ca. 3,5 s). Farbe passt sich an: blau normal, orange Halloween, rot Weihnachten
- **Halloween mit Bildern:** Spielkarten mit Bildhintergründen und eisig leuchtendem Rand, dezente Augen/Krallen/Spinnennetz/Fledermäuse, Eisfläche als Kopfbild, Seitenhintergrund, Bodennebel, gelegentlicher Fledermaus-Schwarm, Mannschafts-Kacheln im Kartenstil; Bilder im Ordner `halloween/` (Kleinschreibung beachten)
- **Weihnachtsdesign:** automatisch im Dezember bis 6. Januar (Schalter in den Einstellungen): Weihnachtslogo (`christmas-logo.png`, `christmas-logo-gross.png`), Eisfläche mit Tannenbaum im Kopfbereich, Tannenbaum als Seitenhintergrund, Spielkarten und Mannschafts-Kacheln mit Geschenke-Bildern, einzelne Geschenke als Deko, gelegentlich fliegt der Schlitten über die Seite; folgt der Einstellung Hell/Dunkel. Adventskalender mit 24 unsortierten Türchen und täglichem Quiz zu Regeln und Teamereignissen; Türchen öffnen sich erst ab dem jeweiligen Tag. Bilder im Ordner `weihnachten/`. Halloween hat Vorrang

## Version 1.9.1

### Neu in Version 1.9.1 (Stand 1.9.1.66, 08.10.2026, bisher 1.9.1.66) – Neue Funktion

- **Spielkarten zum Aufklappen:** jede Karte zeigt links einen Datumsblock (blau U15 A, orange U15 B) und rechts die Paarung mit Logos; ein Tipp klappt die Details als Blöcke aus: Tabellenplatz und Form je Team, Halle mit Adresse, Entfernung und Route-Knopf, Termin / Erinnerung / Teilen, bei gespielten Spielen zusätzlich die Drittel. Der Datumsbalken läuft beim Aufklappen bis zum Kartenende durch. Immer nur eine Karte ist offen; im Spielplan ist das nächste Spiel beim Öffnen aufgeklappt
- **Teamfarbe seitlich:** alle Spielkarten haben links einen Streifen in Teamfarbe; die Wasserzeichen A und B bleiben
- **Startseite:** „Nächstes Spiel“ und „Letztes Spiel“ im selben Kartenstil mit Farbband oben (nächstes Spiel in Teamfarbe mit „Heute“ / „Morgen“ / „in x Tagen“, letztes Spiel grün Sieg, rot Niederlage, gelb Unentschieden); beide starten eingeklappt, das Aufklappen der einen klappt die andere zu
- **Kopfbereich:** „Nächstes Spiel in … Tagen“ steht nur noch rechts in der schmalen Leiste beim Scrollen; oben sitzt neu das News-Symbol
- **„Ergebnis teilen“:** teilt bei gespielten Spielen den Endstand mit Dritteln statt der Spielinformationen
- **Bilder für Social Media (Downloads):** für alle Nutzer im Downloadbereich: Spieltagsbild ab 5 Tage vor dem Spiel bis Spielende, Ergebnisbild ab Eintrag des Ergebnisses bis 5 Tage nach dem Spiel; im Admin-Bereich heißt der Abschnitt jetzt „Social-Media-Bilder“
- **News-Bereich:** Symbol oben mit roter Zahl für Ungelesenes; Fenster „Neuigkeiten“ mit Hinweisen (Freitext aus dem Admin-Bereich), Spieländerungen (automatisch aus `scheduleOverrides`, mit altem und neuem Termin) und „Neu in der App“ (Liste `APP_NEWS` in `index.html`). Der neueste ungelesene Hinweis oder die neueste Spieländerung erscheint als Streifen auf der Startseite
- **Hinweise schreiben (Admin):** Abschnitt „Hinweise / News“ mit Überschrift, Text, Mannschaft, „Sichtbar bis“ und Haken „Zusätzlich als Push senden“; veröffentlichte Hinweise können gelöscht werden
- **Neue Cloud Function:** `functions/news.js` (`onNewsCreated`) verschickt den Push zu einem Hinweis, wenn der Haken gesetzt ist (beachtet die Mannschaftsauswahl der Geräte); `functions/index.js` um eine Zeile ergänzt
- **Firestore-Regeln:** neue Sammlung `news` (für alle lesbar, nur Admin schreibt) – Regeln müssen veröffentlicht werden
- **Dokumentation:** README, `FUNCTIONS-ANLEITUNG.txt` und PDF `Grizzlys-U15-App-Seitenuebersicht.pdf` auf 1.9.1 aktualisiert

## Version 1.9.0

### Neu in Version 1.9.0 (Stand 1.9.0.65)

- **Schreibweise der Version:** Die Version heißt jetzt z. B. `1.9.0.65`: vorn die App-Version, die letzte Zahl ist die Cache-Nummer zum Vergleich von Test und Live (bisher `1.8.0-v51`)
- **Tabellenstand vom EHV NRW:** Platz, Spiele, Punkte und Tordifferenz als kleiner Chip unter jeder Paarung (Startseite, Spielplan, Spieldetails, Gegner-Details) und in der Gegnerübersicht; darunter die Form der letzten fünf Ligaspiele als Punkte (grün Sieg, rot Niederlage, Rand = Entscheidung nach Verlängerung/Penaltyschießen)
- **Drittelergebnisse:** stehen unter jedem Endergebnis, sofern der EHV-Endstand zum eingetragenen Ergebnis passt
- **Neue Spielkacheln:** kommende Spiele kompakt (Kopfzeile mit Team, Heim/Auswärts, Datum und Uhrzeit; Ort und Aktionen als Symbole in einer Fußzeile), gespielte Spiele als flache Ergebniskachel (Tipp öffnet die Spieldetails); gleicher Stil in Spieldetails, Gegner-Details und bei „Nächstes Spiel“
- **Kurznamen in den Kacheln:** U15 A „Grizzlys / Young Cats“, U15 B „Grizzlys B“ (Kalenderdateien, Teilen und PDF behalten den vollen Namen)
- **Schulferien NRW:** im Kalender grün hinterlegt, mit Legende über dem Monat (Termine 2026/27 als Liste `nrwFerien` in `index.html`; für die nächste Saison dort neu eintragen)
- **Ergebnisse automatisch:** Cloud Function `autoResults` trägt beendete Grizzlys-Spiele alle 30 Minuten vom EHV ein; der Ergebnis-Push geht wie bei einem Handeintrag raus (nur für Spiele der letzten 2 Tage), von Hand eingetragene Ergebnisse werden nie überschrieben
- **Spielplan-Abgleich:** Cloud Function `scheduleWatch` vergleicht alle 3 Stunden den Spielplan der App mit dem des EHV und meldet neue Abweichungen per Push an die Admin-Geräte; im Admin-Bereich unter „Spieländerungen“ gibt es den Knopf „Mit EHV-Spielplan abgleichen“ (`scheduleCheck`) mit „Ins Formular übernehmen“
- **Instagram-Bilder (Admin):** neuer Abschnitt im Admin-Bereich: erzeugt pro Spiel ein Bild 1080 × 1350 (Ankündigung oder Ergebnis) mit Hallenfoto, großen Logos und Vorschau; Teilen oder Speichern, es wird nichts automatisch gepostet
- **Ordner `logos`:** alle Gegner-Logos kommen jetzt aus dem Ordner `logos/` (Dateinamen siehe `logos/LIESMICH.txt`); fehlt eine Datei, lädt die App das Logo wie bisher von der alten Adresse, im Instagram-Bild steht dann ein Kürzel
- **Neue Cloud Functions:** `functions/standings.js` (`standings`: Tabelle und beendete Spiele, höchstens alle 30 Minuten vom EHV, nur für `jazm1309.github.io`) und `functions/ehv-sync.js` (`autoResults`, `scheduleCheck`, `scheduleWatch`); `functions/index.js` um vier Zeilen ergänzt. Die App fragt den EHV-Dienst nie direkt ab
- **Unverändert:** Firestore-Regeln, `push.js`, Manifest und App-Symbole
- **PWA-Cache:** auf `grizzlys-u15-v65` erneuert
- **Dokumentation:** README (Abschnitte EHV-Daten, Logos, Instagram-Bilder, Firebase, Push) und die PDF `Grizzlys-U15-App-Seitenuebersicht.pdf` auf 1.9.0 aktualisiert

## Version 1.8.0

### Neu in Version 1.8.0

- **Kopfbereich aufgewertet:** Eis-Atmosphäre (ziehender Eisnebel, funkelnder Eisstaub, leuchtende Bandenlinie unten, Schein ums Logo), „Saison“-Abzeichen mit Puck-Symbol
- **Live-Status im Kopfbereich:** „Nächstes Spiel in x Tagen · U15 A“, am Vortag „Morgen 10:30 Uhr“, am Spieltag pulsierend **„GAMEDAY · 10:30 Uhr“** (bei zwei Spielen beide Zeiten)
- **Mini-Leiste beim Scrollen:** schmale Leiste mit kleinem Logo, Titel und Kurzstatus („Gameday“ / „in 5 Tagen“); die Tabs bleiben darunter sichtbar, die Filterleiste im Spielplan rutscht entsprechend mit; Tipp auf die Leiste scrollt nach oben
- **Halloween-Design** in Schwarz und Orange, automatisch vom 20.10. bis 2.11. (seit 1.9.1: ab 26.10.; danach schaltet sich die App von selbst wieder auf das normale Design zurück)
- Schalter „Halloween-Design“ in den Einstellungen (nur im Halloween-Zeitraum sichtbar), Auswahl wird auf dem Gerät gemerkt
- Halloween-Bär als Logo im Kopfbereich (`halloween-logo.png`), Kürbis neben dem Titel, Spinnennetz und fliegende Fledermäuse im Header
- Schließbarer Gruß „Happy Halloween – Zeit für Spuk auf dem Eis“ (wünscht das Grizzlys-Team) auf der Startseite
- Abzeichen „Halloween-Spiel“ beim Spiel am 31.10. (Spielliste, Nächstes/Letztes Spiel, Spiel-Details); die Karte dieses Spiels ist besonders gruselig: dunkel mit orange pulsierendem Leuchten, Spinnennetz, Geistern, Kürbis und blinzelnden roten Augen
- Der Button zum Hockey Mini-Spiel wird zum gruseligen „Gruselspiel“-Button (dunkel, pulsierender Rand, Spinnennetz, Geist, blinzelnde Augen). Das Mini-Spiel selbst wird im Halloween-Zeitraum zum **Gruselspiel**: dunkles Spielfeld mit Nebel, Spinne, Fledermaus und leuchtenden Augen, Kürbis gegen Geist, neue Gruseltexte, Gewinnlinie leuchtet, bei einer Niederlage wackelt und blitzt es kurz
- Hockey Mini-Spiel aufgewertet: Eisfläche mit Banden, Werbebanden und Anspielkreis, Anzeigetafel mit Serienstand und Torlampe, Puck- und Schläger-Figuren mit Einrutsch-Animation und Eisspray, Gewinnlinie leuchtet, „TOOOR!“ mit Konfetti und Vibration
- Mini-Spiel mit neuen Regeln: Serie „Best of 5“, drei Schwierigkeitsstufen (Anfänger, Profi, Torwart), drei Strafzeiten pro Runde (sperren ein Feld für den Gegner für 2 Züge) und Pokale (Hattrick, Serie gewonnen, Torwart bezwungen), die lokal auf dem Gerät gespeichert werden
- Gruselspiel im Halloween-Zeitraum mit Hallenlicht aus: Kürbis-Pucks, Geister, orange Torlampe, Fledermaus- und Kürbis-Konfetti
- Button zum Mini-Spiel aufgewertet: Eishallen-Look mit Lichtreflex, wippendem Puck-Symbol, „NEU“-Banderole, Mini-Spielfeld mit leuchtender Gewinnreihe und Pokal-Zähler (z. B. 🏆 1/3)
- Neuer Bereich **Einstellungen** (Zahnrad-Symbol im Kopfbereich neben dem Info-Symbol): Darstellung Hell / Dunkel / Automatisch (folgt dem Handy), Halloween-Schalter, Push-Anmeldung, Feedback & Fehler und Admin-Bereich. Diese Punkte stehen nicht mehr unten auf jeder Seite bzw. in der Info
- Dunkelmodus für alle Seiten, Fenster und das Minispiel; die Auswahl wird auf dem Gerät gespeichert (Standard: Hell). Das Halloween-Design hat Vorrang, solange es aktiv ist
- Slogan „Ein Team – zwei starke Mannschaften“ im Kopfbereich rechts neben dem Titel, in sauberer Pinsel-Handschrift (Schrift Permanent Marker, direkt in der App eingebettet, funktioniert offline) mit blauem Pinselstrich; im Halloween-Design orange; auf sehr schmalen Handys kleiner bzw. ausgeblendet
- Die angezeigte App-Version (Einstellungen/Info und Fehlermeldungen) enthält jetzt die Cache-Nummer, z. B. `1.8.0-v51`; so lassen sich Test- und Live-Stand genau vergleichen. Die Testversion zeigt sie zusätzlich im orangen Balken
- Aufgeräumt: nicht mehr genutzte Dateien entfernt (alte Übersichts-PDFs, ungenutzte Symbole, Mini-Spiel-Banner, `analytics-test.html`); statt der Versions-PDFs gibt es jetzt eine einzige PDF `Grizzlys-U15-App-Seitenuebersicht.pdf` (Aufbau der Seiten und Verknüpfungen, ohne Versionsnummer)
- Der Slogan im Kopfbereich wird beim Start Zeile für Zeile „geschrieben“ (der blaue Pinselstrich zeichnet sich zuletzt); bei aktivierter Bewegungsreduzierung erscheint er sofort
- Bereich „Push aktivieren“ (Einstellungen) neu gestaltet: klingelnde Glocke, Beispiel-Meldungen (Ergebnis und 24-Stunden-Erinnerung), drei Vorteile, großer Button und Statusanzeige (Aus / Aktiv / Blockiert / Nicht möglich) mit passendem Hinweis, auch für Dunkelmodus und Halloween. Die Anmeldung selbst ist unverändert
- PDF-Auswahl (Downloads) im neuen Chip-Design wie die Kalender-Auswahl: Gruppen „Umfang“, „Mannschaft“ (mit blauem/orangem Punkt) und „Spielort“, auch im Dunkelmodus
- Feedback-Bereich überarbeitet: Karte „Deine Meinung zählt“ mit Schnellauswahl (Fehler / Idee / Lob), Meldeformular mit Art-Umschalter, Zeichenzähler und Hinweis zum Datenschutz
- Admin: Ergebnisverwaltung und Spieländerungen zeigen die aktuellen bzw. nächsten Spiele oben (Ergebnisse: nach Nähe zum heutigen Tag, Spieländerungen: kommende zuerst, danach vergangene)
- Info-Seite im App-Stil überarbeitet (Kopfbereich mit Logo und Version, Funktionskacheln, Teamseiten-Karte)
- „Heute“-Button im Spielplan scrollt jetzt so weit, dass die Spielkachel nicht mehr vom Menü verdeckt wird
- Fehlermeldungs-Dienst (GitHub Action): beendet sich jetzt sauber und hat ein Zeitlimit von 4 Minuten – keine „All jobs were cancelled“-E-Mails mehr
- Push getrennt wählbar: Nutzer können in den Einstellungen Ergebnisse und 24-Stunden-Erinnerung sowie U15 A und U15 B einzeln ein-/ausschalten (neues Feld `prefs` in `pushTokens`; Firestore-Regeln und `main.yml` angepasst – Regeln müssen veröffentlicht werden)
- Ergebnis-Push und 24h-Erinnerung als Cloud Functions (`functions/push.js`: `onResultWritten` sofort, `sendGameReminders` alle 10 Minuten); Functions auf Node 22; GitHub-Workflow „Grizzlys Ergebnisdienst“ kann nach erfolgreichem Test abgeschaltet werden (siehe `FUNCTIONS-ANLEITUNG.txt`)
- Fledermäuse im Dankesfenster nach einer Rückmeldung
- Optional: Halloween-App-Symbole im Ordner `halloween-app-symbol` (siehe `ANLEITUNG.txt` darin)
- Push, Cloud Function und Firebase-Regeln unverändert
- PWA-Cache auf `grizzlys-u15-v51` erneuert
- Dokumentation und Versionsstand auf 1.8.0 aktualisiert

## Version 1.7.2

### Neu in Version 1.7.2

- Startseite: Karte „Nächstes Spiel“ kompakter (weniger Höhe, Adresszeile entfällt, kleinere Aktions-Icons)
- Neue Karte „Letztes Spiel“: zuletzt gespieltes Spiel mit Ergebnis, Sieg/Niederlage/Unentschieden-Label und Farbstreifen; Tipp öffnet die Spiel-Details. Liegt noch kein Ergebnis vor, steht „Ergebnis folgt“
- Mannschaftskacheln überarbeitet: Bilanz (Siege/Unentschieden/Niederlagen/Tore), Formpunkte der letzten 5 Spiele, Fortschrittsbalken „x von y Spielen gespielt“, nächster Gegner mit Logo, Buchstaben-Wasserzeichen und Farbverlauf in der Teamfarbe
- Kachel-Design (Farbverlauf, Buchstaben-Wasserzeichen, Farbstreifen) jetzt auch bei Spielkarten, Gegnerkarten, „Nächstes Spiel“, „Letztes Spiel“ und den Downloads
- Downloads: ein Button „Kalender herunterladen“ mit Auswahl (Mannschaft, Heim/Auswärts, ganze Saison oder nur kommende Spiele) statt drei fester Kalender-Buttons
- Alle Werte werden aus den vorhandenen Ergebnissen berechnet; Push, Cloud Function und Firebase-Regeln unverändert
- PWA-Cache auf `grizzlys-u15-v30` erneuert
- Dokumentation und Versionsstand auf 1.7.2 aktualisiert

## Version 1.7.1

### Neu in Version 1.7.1

- Das moderne Layout aus 1.7.0 gilt jetzt auch auf **Spielplan, Gegner, Downloads und Info**
- Spielplan: Umschalter „Chronologisch / Kalender“ als Segment-Schalter mit Icons, Filter- und „Heute“-Button mit Icons, Tabellen-Links als Chips, Monatsüberschriften leiser, Spielkarten mit weichem Schatten und Mannschaftsfarbe am Rand
- Spielkarten: Logos über den Namen, große Uhrzeit, Heim-/Auswärts-Label, Aktionen (Route, Termin, Erinnerung, Teilen) als Icon-Reihe; „Nächstes Spiel“ hervorgehoben
- Spiel-Details (Fenster): Emoji durch Linien-Icons ersetzt
- Gegner: Suchfeld mit Lupe, Gegnerkarten mit Farbstreifen und Route-Button mit Icon
- Downloads: Kalender-/PDF-Einträge mit runden Icons und Pfeil
- Info: weichere Karten, Überschriften mit Icons, Teamseiten als farbige Chips, Buttons mit Icons
- Push, Cloud Function und Firebase-Regeln unverändert
- PWA-Cache auf `grizzlys-u15-v29` erneuert
- Dokumentation und Versionsstand auf 1.7.1 aktualisiert

## Version 1.7.0

### Neu in Version 1.7.0

- Modernisierte Optik ohne Änderung an Farben, Logos, Menü und Funktionen
- Kopfbereich mit Stadionbild kompakter (kleineres Logo und weniger Höhe), das nächste Spiel steht dadurch höher
- Karte „Nächstes Spiel“: leiserer Titel, Teamlabel oben rechts, Uhrzeit groß, weiche Schatten statt harter Rahmen
- Spielpaarung aufgeräumt: Logos über den Namen, „VS“ in der Mitte, langer SpG-Name bricht nicht mehr über viele Zeilen
- Aktionen (Route, Termin, Erinnerung, Teilen) als einheitliche Linien-Icons in einer Reihe statt Emoji-Chips; Standort-Symbol als Linien-Icon
- Mannschaftskarten mit weicheren Rahmen und Schatten; „Heim · “ / „Auswärts · “ statt Emoji
- Kleine Bewegungen: Karten und Buttons reagieren beim Antippen, Ansichten blenden sanft ein (nicht bei „reduzierte Bewegung“)
- Versandlogik, Push, Cloud Function und Firebase-Regeln unverändert
- PWA-Cache auf `grizzlys-u15-v28` erneuert
- Dokumentation und Versionsstand auf 1.7.0 aktualisiert

## Version 1.6.7

### Neu in Version 1.6.7

- „Fehler melden“ wurde zu **Feedback & Fehler** erweitert: Auswahl der Art der Meldung (🐞 Fehler, 💡 Wunsch / Anregung, 👍 Lob) mit passenden Texten, Platzhaltern und Dankes-Meldung
- Neuer Bereich „Neue Funktion“ in der Bereichsauswahl
- Admin-Bereich: „Fehlermeldungen“ heißt jetzt **Rückmeldungen** und lässt sich zusätzlich nach Art filtern; jede Meldung zeigt Symbol und Art
- Neue Benachrichtigungsbilder: `grizzlys-wunsch-icon.png` (Wunsch & Anregungen) und `grizzlys-lob-icon.png` (Lob); Fehler behalten `grizzlys-bug-icon.png`
- `bug-report-notify.js`: Push-Titel, Push-Bild, E-Mail-Betreff, E-Mail-Bild und Überschriften richten sich nach der Art der Meldung (Ergebnis- und Erinnerungs-Push in `main.yml` unverändert)
- `firestore.rules`: neues optionales Feld `type` (erlaubt: Fehler, Wunsch / Anregung, Lob); Meldungen ohne `type` zählen als Fehler
- PWA-Cache auf `grizzlys-u15-v28` erneuert
- Dokumentation und Versionsstand auf 1.6.7 aktualisiert

## Version 1.6.6

### Neu in Version 1.6.6

- Statistik im Admin-Bereich zeigt jetzt die Ergebnis-Pushes: Zeitpunkt, Ergebnis, Anzahl erreichter Geräte („an 12 von 14 Geräten“), fehlgeschlagene Zustellungen sowie die aktuell registrierten Push-Geräte
- Der Workflow `main.yml` schreibt Versandzeitpunkt und Zahlen (`pushSentCount`, `pushFailedCount`, `pushTargetCount`) ins Ergebnis-Dokument und gibt sie im GitHub-Actions-Log aus
- Ältere Ergebnis-Pushes ohne gespeicherte Zahlen erscheinen als „Anzahl nicht erfasst“
- Aktualisieren-Button des Update-Hinweises robuster gemacht (Rückmeldung, mehrere Auslöser, automatischer Neustart nach 2,5 Sekunden)
- PWA-Cache auf `grizzlys-u15-v26` erneuert
- Dokumentation und Versionsstand auf 1.6.6 aktualisiert

## Version 1.6.5

### Neu in Version 1.6.5

- Update-Hinweis in der App: Sobald eine neue Version bereitsteht, erscheint unten ein dezenter Banner „Neue Version verfügbar“ mit den Buttons **Aktualisieren** und **Schließen**
- Die App prüft beim Zurückkehren in den Vordergrund sowie alle 30 Minuten, ob eine neue Version vorliegt
- Der Service Worker aktiviert eine neue Version erst nach Tippen auf „Aktualisieren“ (kein automatisches Umschalten mehr mitten in der Nutzung)
- Schließen blendet den Banner bis zum nächsten App-Start aus
- PWA-Cache auf `grizzlys-u15-v25` erneuert
- Dokumentation und Versionsstand auf 1.6.5 aktualisiert

## Version 1.6.4

### Neu in Version 1.6.4

- U15 A als Spielgemeinschaft „SpG ESV Grizzlys Bergkamen / ESC Rheine Young Cats“ ergänzt, inklusive Young-Cats-Logo in den Spieldarstellungen
- Integriertes Google-Analytics-Statistikdashboard direkt im geschützten Admin-Bereich
- Zeitraum-Auswahl im Statistikdashboard: Heute, Diese Woche, Dieser Monat, 30 Tage, Saison und Gesamt
- Kennzahlen für aktive Nutzer, neue Nutzer, Sitzungen und Events
- Tagesverlauf der aktiven Nutzer
- Auswertungen zu Events, Geräten, Betriebssystemen, Seitenaufrufen und Städten
- Analytics-Daten werden über eine geschützte Firebase Cloud Function aus der Google Analytics Data API geladen
- Google-Analytics-Zugangsdaten werden nicht im PWA-Frontend gespeichert
- Analytics-Tagesbeschriftungen im Diagramm korrigiert
- PWA-Cache für aktualisierte Analytics-Anzeige erneuert
- Ergebnis-Push-Dienst korrigiert und zuverlässig an Firebase Cloud Messaging angebunden
- Eigenes Ergebnis-Push-Bild im Grizzlys-Stil eingebunden
- Eigenes Bild für die automatische 24-Stunden-Spielerinnerung vorbereitet und im Erinnerungsdienst hinterlegt
- Push-Bild und Fallback-Verhalten des Firebase Messaging Service Workers verbessert
- Fehlermeldungen wieder mit verpflichtendem Namen im Formular und in der Verwaltung
- Admin-Push-Token wird beim Admin-Login automatisch registriert, damit Admin-Benachrichtigungen funktionieren
- Fehler-E-Mail und Fehler-Push inklusive passendem Fehlermeldungsbild funktionieren wieder zusammen
- Dokumentation und Versionsstand auf 1.6.4 aktualisiert

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

## Version 1.6.1

### Neu in Version 1.6.1

- Fehlerbeschreibung im Meldeformular mit größerer Schrift, größerem Zeilenabstand und höherem Eingabefeld
- Robustere Geräte-/Installationsstatistik für Apple und Android
- Ältere Registrierungen können anhand gespeicherter Gerätedaten der passenden Plattform zugeordnet werden

## Version 1.6

### Neu in Version 1.6

- Fehler melden direkt aus der App
- Fehlerformular mit Bereich und Fehlerbeschreibung
- Verpflichtende Namensangabe bei einer Fehlermeldung
- Optionales Feld für eine E-Mail-Adresse zur Rückfrage
- Automatische Übermittlung der App-Version und technischer Gerätedaten
- Push-Status kann bei einer Fehlermeldung mitübermittelt werden
- Zentrale Speicherung der Fehlermeldungen in Firebase
- Fehlermeldungen im geschützten Admin-Bereich
- Anzeige der Anzahl offener Fehlermeldungen
- Statusverwaltung: Neu, In Bearbeitung, Erledigt
- Hockey Tic-Tac-Toe als Minispiel
- Push-Registrierungen und App-Installationen im Admin-Bereich

## Vorherige Funktionen

- Zentrale Ergebnisverwaltung über Firebase Firestore
- Ergebnisse werden öffentlich aus Firestore geladen
- Ergebnisse werden direkt im Spielplan und in den Spieldetails angezeigt
- Geschützte Ergebnisverwaltung für den eingerichteten Admin
- Firebase Authentication mit E-Mail und Passwort
- Push-Benachrichtigungen über Firebase Cloud Messaging
- Automatische Push-Meldung bei neuen Spielergebnissen
- Automatische Erinnerung 24 Stunden vor einem Spiel
- Speicherung der Push-Geräte-Tokens in Firestore
- Ungültige bzw. nicht mehr registrierte Push-Tokens werden automatisch bereinigt
- Gegnerübersicht mit den jeweiligen Spielen
- Gegnerlogos in der App
- Spieldetails aus der Kalenderansicht
- Chronologische Spielplanansicht und Monatskalender
- Kalender-Downloads für U15 A, U15 B sowie U15 A + B
- Spielort und Hallenadresse
- Routenfunktion über Google Maps
- Teilen von Spielen
- Erinnerungen und Kalendertermine
- PDF-Druck des kompletten Spielplans inklusive vorhandener Ergebnisse und Grizzlys-Logo
- Überarbeitete Navigation und Darstellung für Smartphone und Desktop
- PWA-Unterstützung zum Installieren der App auf dem Gerät

## Update-Hinweis

Wenn eine neue App-Version veröffentlicht wurde, lädt der Service Worker sie im Hintergrund und wartet. Die App zeigt dann unten den Banner „Neue Version verfügbar“.

- **Aktualisieren** aktiviert die neue Version und lädt die App neu
- **×** blendet den Banner bis zum nächsten App-Start aus

Technisch: `index.html` erkennt eine wartende Version über den Service-Worker-Status, `sw.js` aktiviert sie erst nach der Nachricht `SKIP_WAITING`. Bei jeder App-Änderung muss der Cache-Name in `sw.js` erhöht werden (aktuell `grizzlys-u15-v156`).

Die angezeigte Version hat die Form `1.25.0.156`: vorn die App-Version (Regeln siehe „Versionsnummern“ oben), die letzte Zahl ist die Cache-Nummer. Test- und Live-Stand mit derselben letzten Zahl sind inhaltlich gleich. Die Testversion (`grizzlys-u15-test`) zeigt die Nummer zusätzlich im orangen Balken und sperrt Speichern, Senden und Push-Anmeldung.

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
- Liga-Kennungen: U15 A `21652` (Landesliga NRW), U15 B `21656` (Bezirksliga NRW). Sie stehen in `functions/standings.js` und müssen zur neuen Saison angepasst werden.
- Der Zugriffsschlüssel in `standings.js` und `game-report.js` ist der öffentliche Schlüssel der EHV-Seite. Eine ausdrückliche Erlaubnis von EHV / hockeydata zur Nutzung in der App liegt nicht vor – Anfrage beim EHV empfohlen.
- Überzahltore zählt `gameReport` aus den Toren selbst (`gameStrength` PP/SH), weil die Teamstatistik des EHV dafür teils 0 liefert. Schüsse aufs Tor werden in der U15 nicht erfasst und deshalb nicht verwendet.
- Deploy und Schalter: siehe `FUNCTIONS-ANLEITUNG.txt`.

## Logos

Alle Gegner-Logos liegen als Dateien im Ordner `logos/`. Die erwarteten Dateinamen stehen in `logos/LIESMICH.txt` und in `index.html` (`LOGO_FILES`). Fehlt eine Datei, lädt die App das Logo von der bisherigen Adresse (`logoUrls`); im Social-Media-Bild steht dann ein Kürzel. Ein Logo wird ersetzt, indem eine Datei mit demselben Namen hochgeladen wird.

## Social-Media-Bilder

Im Admin-Bereich erzeugt der Abschnitt „Social-Media-Bilder“ pro Spiel ein Bild im Beitragsformat 4:5 (1080 × 1350): „Ankündigung“ (Spieltag, Datum, Uhrzeit, Tabellen-Chips) oder „Ergebnis“ (Heimsieg / Auswärtssieg / Endstand, Drittel). Das Bild entsteht im Browser, wird in einer Vorschau gezeigt und kann geteilt oder gespeichert werden. Es wird nichts automatisch gepostet.

Im Downloadbereich stehen dieselben Bilder allen Nutzern zur Verfügung: das Spieltagsbild ab 5 Tage vor dem Spiel bis Spielende, das Ergebnisbild ab Eintrag des Ergebnisses bis 5 Tage nach dem Spiel (`INSTA_DAYS` in `index.html`).

## News

Das News-Symbol im Kopfbereich zeigt die Zahl ungelesener Einträge. Das Fenster „Neuigkeiten“ hat bis zu vier Abschnitte:

- **Hinweise:** Freitexte aus dem Admin-Bereich (Sammlung `news`); abgelaufene Hinweise („Sichtbar bis“) werden nicht mehr angezeigt
- **Spieländerungen:** kommen automatisch aus `scheduleOverrides` (neuer Termin bzw. Ort, dazu der alte); ein Tipp öffnet das Spiel
- **Spielberichte:** veröffentlichte Berichte (Sammlung `reports`) der letzten 14 Tage; ein Tipp öffnet die Spieldetails beim Bericht
- **Neu in der App:** die Liste `APP_NEWS` in `index.html` – bei jedem Update dort die für Nutzer sichtbaren Neuerungen eintragen (neueste Version oben)

Was gelesen wurde, merkt sich jedes Gerät selbst. Der Push zu einem Hinweis kommt von der Cloud Function `onNewsCreated` (`functions/news.js`) und nur, wenn der Haken gesetzt ist.

## Schulferien

Die NRW-Ferien sind in der Kalenderansicht grün hinterlegt. Die Termine stehen als Liste `nrwFerien` in `index.html` (Schuljahr 2026/27) und müssen zur neuen Saison ersetzt werden.

## Push-Benachrichtigungen

Die Push-Funktion ist aktiv.

Sie wird verwendet für:

- neue Spielergebnisse
- automatische Erinnerung 24 Stunden vor einem Spiel
- Meldung an die Admin-Geräte bei einer neuen Abweichung zwischen App- und EHV-Spielplan
- Hinweise aus dem Admin-Bereich, wenn „Zusätzlich als Push senden“ gesetzt ist

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
