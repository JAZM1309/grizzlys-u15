ESV Grizzlys U15 App

Installierbare Web-App (PWA) für die ESV Grizzlys U15 A und U15 B, Saison 2026/27.

Version 1.6.3

Neu in Version 1.6.3
- Ergebnis-Push-Dienst korrigiert und zuverlässig an Firebase Cloud Messaging angebunden
- Eigenes Ergebnis-Push-Bild und 24-Stunden-Erinnerungsbild
- Push-Bild und Fallback-Verhalten verbessert
- Fehlermeldungen wieder mit verpflichtendem Namen
- Admin-Push-Token wird beim Admin-Login registriert
- Fehler-E-Mail und Fehler-Push inklusive Fehlermeldungsbild
- Direkter Analytics-Zugang im geschützten Admin-Bereich; Android öffnet bevorzugt die installierte Google-Analytics-App, alternativ die Analytics-Webseite
- Dokumentation und Versionsstand auf 1.6.3 aktualisiert

Google Analytics
- Aktive, neue und wiederkehrende Nutzer
- Durchschnittliche Interaktionsdauer
- Sitzungen und Ereignisanzahl
- Betriebssystem, Gerätekategorie und Stadt
- Seitenaufrufe
- Eigene Ereignisse für Spielplan, Gegner, Downloads, Push und Hockey-Mini-Spiel
- Zeiträume wie Woche, Monat und benutzerdefinierter Gesamtzeitraum

Vorherige Funktionen
- Zentrale Ergebnisverwaltung über Firebase Firestore
- Ergebnisse im Spielplan und in den Spieldetails
- Geschützter Admin-Bereich
- Firebase Authentication
- Push-Benachrichtigungen für Ergebnisse und 24-Stunden-Erinnerung
- Push-Geräte und Installationen in Firestore
- Gegnerübersicht, Spieldetails, Kalender, Downloads, Routen und PDF-Druck
- Fehler melden und Fehlerverwaltung
- Hockey Tic-Tac-Toe
- PWA-Unterstützung

Firebase-Projekt: grizzlys-u15

Firestore-Sammlungen:
- results
- pushTokens
- gameReminders
- appInstallations
- bugReports

Veröffentlichung
Kostenlose PWA über GitHub Pages.
Repository: JAZM1309/grizzlys-u15

Neu in Version 1.6.3
- Eigenes Analytics-Dashboard im geschützten Admin-Bereich
- Zeiträume: Heute, Woche, Monat, 30 Tage, Saison und Gesamt
- Aktive/neue Nutzer, Sitzungen, Events und Tagesverlauf
- Events, Geräte, Betriebssysteme, Seitenaufrufe und Städte
- Google Analytics bleibt die Datenquelle; keine Zugangsdaten im PWA-Frontend
