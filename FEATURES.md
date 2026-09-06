# 🚀 PlayTrace - Features & Roadmap

This document outlines the planned features and development roadmap for
PlayTrace, providing a clear direction for the project and its contributors.

PlayTrace is built with **React Native** and **Expo** (TypeScript) and runs on
both iOS and Android.

**Status legend:** ✅ Done · 🔄 In Progress · 📅 Planned

## ⏱️ Timing (Match Management)

*Core functionality to ensure high-precision data for football analysis.*

| Feature | Status | Description | Priority |
| --- | --- | --- | --- |
| **Advanced Match Timer** | 📅 Planned | Stopwatch with pause/resume functionality and injury time entry. | High |
| **Multi-Format Timestamps** | 📅 Planned | Simultaneous recording of 4 formats: absolute, period, match, and continuous time. | High |
| **Video Sync Tools** | 📅 Planned | Tools to align tags with external video file timestamps. | Medium |

## 🏷️ Tagging (Event Logging)

*The operational interface designed for the pitch-side analyst.*

| Feature | Status | Description | Priority |
| --- | --- | --- | --- |
| **Customizable Board** | 📅 Planned | Ability to configure buttons for different events (shots, fouls, etc.). | High |
| **Player Tagging** | 📅 Planned | Associating events with specific jersey numbers or player names. | High |
| **Team Assignment** | 📅 Planned | Quick distinction between Home and Away team events. | High |
| **Pitch Zoning** | 📅 Planned | Selection of the pitch area where the action occurred. | Medium |

## 📤 Data & Export

*Workflow management and post-match analysis.*

| Feature | Status | Description | Priority |
| --- | --- | --- | --- |
| **JSON/CSV Export** | 📅 Planned | Data export for advanced analysis in Python, R, or Excel. | High |
| **Match Configuration** | 📅 Planned | Management of metadata: teams, date, competition, and venue. | Medium |
| **Offline Engine** | 📅 Planned | Full functionality without requiring an internet connection. | High |
| **Local Persistence** | 📅 Planned | Match state survives app restarts and backgrounding. | High |

## 🎨 UI/UX & Quality

*Enhancing user experience and software stability.*

| Feature | Status | Description | Priority |
| --- | --- | --- | --- |
| **Localization** | 🔄 In Progress | Interface translation into multiple languages (docs: EN, IT, PT). | High |
| **Input Validation** | 📅 Planned | Formal checks on input data to prevent errors in reports. | Low |
| **Mobile-First UI** | 📅 Planned | Modern interface optimized for quick thumb-use on mobile devices. | Medium |
| **iOS Support Validation** | 📅 Planned | Verify layout, share sheet, and timing behavior on iOS devices. | High |
| **Automated Tests** | 📅 Planned | Unit tests for the time calculations and export formatting. | Medium |

---

## 🛠️ Notes for Developers

To start working on any of these features:
1. Review the [Contributing Guide](CONTRIBUTING.md).
2. Check for existing issues in the [Project Board](https://github.com/MrValtancoli/PlayTrace-App/projects).
3. Set up the environment: Node.js LTS, then `npm install` and `npx expo start`.

The export field names follow the published PlayTrace export specification and
must not be renamed — downstream analysis scripts depend on them.
