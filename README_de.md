# ⚽ PlayTrace - Analyze The Game

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform](https://img.shields.io/badge/Platform-Android-green.svg)](https://reactnative.dev/)
[![Built with](https://img.shields.io/badge/Built%20with-Expo-000020.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6.svg)](https://www.typescriptlang.org/)
![GitHub issues](https://img.shields.io/github/issues/MrValtancoli/PlayTrace-App)
![GitHub stars](https://img.shields.io/github/stars/MrValtancoli/PlayTrace-App)
![License](https://img.shields.io/github/license/MrValtancoli/PlayTrace-App)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

🌐 **Übersetzungen:** [English](README.md) | [Italiano](README_it.md) | [Español](README_es.md) | [Português](README_pt.md) | [Français](README_fr.md)

Kostenlose Open-Source-App zum Taggen von Fußballspielen in Echtzeit. Ideal
für Trainer, Videoanalysten und Scouts, die präzise Zeitdaten brauchen.

> **Status:** für Android verfügbar — lade die
> [neueste Version](https://github.com/MrValtancoli/PlayTrace-App/releases/latest) herunter.
> Der Code ist plattformübergreifend, iOS ist aber noch nicht validiert.

## 📲 Download

Lade die neueste APK von der
[Release-Seite](https://github.com/MrValtancoli/PlayTrace-App/releases/latest) herunter und öffne sie auf deinem
Android-Gerät. Android fragt nach der Erlaubnis, Apps aus unbekannten Quellen
zu installieren — das ist bei einer App außerhalb des Play Store normal.

## 🛠️ Aus dem Quellcode starten

Benötigt Node.js LTS (>= 20.19.4).

```bash
npm ci
npx expo start
```

Öffne das Projekt dann in Expo Go oder drücke `a` / `i` für einen
Android-Emulator oder iOS-Simulator.

## ✨ Funktionen

- ⏱️ **Spieluhr** mit Pause/Fortsetzen, Ablauf 1./2. Halbzeit und Eingabe der Nachspielzeit
- 🏷️ **Anpassbare Tag-Buttons** (Name, Farbe, aktivieren/deaktivieren)
- 📊 **4 Zeitreferenz-Formate** für jedes Ereignis
- 📤 **Export als JSON/CSV** mit Teilen-Funktion
- ⚙️ **Konfigurierbare Spieldaten** (Wettbewerb, Datum, Stadion, Mannschaften, Halbzeitdauer)
- 📴 **Funktioniert offline** — kein Internet nötig

## ⏱️ Zeitreferenzen

Jedes getaggte Ereignis speichert 4 verschiedene Zeitstempel:

| Format | Beispiel | Beschreibung |
|--------|---------|-------------|
| `timestamp_absolute` | 30/12/25 15:23:45 | Reale Uhrzeit |
| `time_period` | 23:45 1T | Zeit innerhalb der aktuellen Halbzeit |
| `time_match` | 68:30 (2T) | Spielzeit mit Halbzeitangabe |
| `time_continuous` | 72:30 | Position in einem durchgehend geschnittenen Video |

Die Feldnamen im Export verwenden absichtlich snake_case, damit sie 1:1 der
veröffentlichten PlayTrace-Exportspezifikation entsprechen.

## 📤 Export

Exporte enthalten die Spieldaten, die Tag-Konfiguration, jedes getaggte
Ereignis mit allen Zeitdaten sowie den tatsächlichen Beginn und die gemessene
Dauer jeder Halbzeit — so lässt sich das Spiel segmentieren und seine echte
Dauer berechnen.

- **JSON** — strukturiertes Format, ideal für Datenanalyse mit Python/R
- **CSV** — bereit für Tabellenkalkulationen, öffnet sich direkt in Excel

## 🗺️ Roadmap

Die Roadmap und der aktuelle Projektstatus stehen in der
[englischen README](README.md) und in den
[Milestones](https://github.com/MrValtancoli/PlayTrace-App/milestones): Diese Übersetzung wiederholt sie nicht, damit
sie nicht veraltet.

## 🤝 Mitwirken

Beiträge aus der Fußballanalyse-Community sind willkommen!

**Neu im Projekt?** Sieh dir das [Welcome-Issue](https://github.com/MrValtancoli/PlayTrace-App/issues/1) mit guten Einstiegsaufgaben an.

**Du möchtest mitmachen?** Lies den [Contributing Guide](CONTRIBUTING.md), um loszulegen.

Bereiche, in denen wir besonders Hilfe brauchen (Label `help wanted`):
- 🌍 Überprüfung der App- und README-Übersetzungen ([#51](https://github.com/MrValtancoli/PlayTrace-App/issues/51))
- 📚 Dokumentation und Tutorials (Label `documentation`)
- 🧪 Tests auf verschiedenen iOS- und Android-Geräten
- 💡 Funktionsvorschläge von Trainern und Analysten (Label `enhancement`)

**Du nutzt einen KI-Assistenten?** Kein Problem — siehe den Abschnitt [AI-assisted contributions](CONTRIBUTING.md#-ai-assisted-contributions).

## 📄 Lizenz

[MIT-Lizenz](LICENSE) - Frei nutzbar, veränderbar und weitergebbar.

## 👤 Autor

**Roberto Valtancoli**
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue)](https://linkedin.com/in/robertovaltancoli)

---

⭐ Gib diesem Repository einen Stern, wenn es dir nützt!
