# 🚀 PlayTrace - Features & Roadmap

This document outlines the planned features and development roadmap for
PlayTrace, providing a clear direction for the project and its contributors.

PlayTrace is built with **React Native** and **Expo** (SDK 57, TypeScript) and
runs on both iOS and Android.

The core tagging loop is implemented: match setup, tag configuration, the match
timer with injury time, and JSON/CSV export. Everything marked Done below is in
the codebase but has not yet been validated on physical devices.

**Status legend:** ✅ Done · 🔄 In Progress · 📅 Planned

## 🎯 v1.0 scope

v1.0 ships on **Android only** and covers the core tagging loop: match setup,
16 configurable tags, the match timer with injury time, and JSON/CSV export.

Events are not attributed to a team or a player. Tags always refer to the team
being analysed, which is what the analyst configures before kick-off. Team
assignment and player tagging are deferred to v1.1 and will be added as new
optional export fields, never by renaming or repurposing existing ones.

iOS support is built into the codebase but is not validated for v1.0.
Validation on Apple hardware is in progress and will land in a later release.

## ⏱️ Timing (Match Management)

*Core functionality to ensure high-precision data for football analysis.*

| Feature | Status | Description | Priority |
| --- | --- | --- | --- |
| **Advanced Match Timer** | ✅ Done | Stopwatch with pause/resume functionality and injury time entry. | High |
| **Multi-Format Timestamps** | ✅ Done | Simultaneous recording of 4 formats: absolute, period, match, and continuous time. | High |
| **Video Sync Tools** | 📅 Planned | Tools to align tags with external video file timestamps. | Medium |

## 🏷️ Tagging (Event Logging)

*The operational interface designed for the pitch-side analyst.*

| Feature | Status | Description | Priority |
| --- | --- | --- | --- |
| **Customizable Board** | ✅ Done | Ability to configure buttons for different events (shots, fouls, etc.). | High |
| **Player Tagging** | 📅 v1.1 | Associating events with specific jersey numbers or player names. | High |
| **Team Assignment** | 📅 v1.1 | Home/Away attribution. Out of v1.0: tags refer to the analysed team. | High |
| **Pitch Zoning** | 📅 Planned | Selection of the pitch area where the action occurred. | Medium |

## 📤 Data & Export

*Workflow management and post-match analysis.*

| Feature | Status | Description | Priority |
| --- | --- | --- | --- |
| **JSON/CSV Export** | ✅ Done | Data export for advanced analysis in Python, R, or Excel. | High |
| **Match Configuration** | ✅ Done | Management of metadata: teams, date, competition, and venue. | Medium |
| **Offline Engine** | ✅ Done | Full functionality without requiring an internet connection. | High |
| **Local Persistence** | ✅ Done | Match state survives app restarts and backgrounding. | High |
| **Tag Set Export/Import** | 📅 v1.1 | Share a tag configuration between devices as a file, so an analyst can set up once and hand the same board to a colleague. Separate from the match export: it carries configuration, not events. | High |

## 🎨 UI/UX & Quality

*Enhancing user experience and software stability.*

| Feature | Status | Description | Priority |
| --- | --- | --- | --- |
| **Localization** | 📅 Planned | Translate the app interface, which is English only today. The documentation is already available in English, Italian and Portuguese. | High |
| **Input Validation** | 📅 Planned | Formal checks on input data to prevent errors in reports. | Low |
| **Mobile-First UI** | ✅ Done | Modern interface optimized for quick thumb-use on mobile devices. | Medium |
| **Device Rotation** | 📅 v1.1 | Support landscape and auto-rotation, for tablets and for phones held sideways. The app is currently locked to portrait. Requires reworking the 4-column tag grid and the timer layout, not just unlocking the orientation. | High |
| **iOS Support Validation** | 🔄 In Progress | Verify layout, share sheet, and timing behavior on iOS devices. The codebase already builds for iOS; what is missing is validation on real hardware. | High |
| **Automated Tests** | ✅ Done | Jest suite covering the four time references and the JSON/CSV export schema, run with `npm test`. | High |

---

## 🛠️ Notes for Developers

To start working on any of these features:
1. Review the [Contributing Guide](CONTRIBUTING.md).
2. Check for existing issues in the [Project Board](https://github.com/MrValtancoli/PlayTrace-App/projects).
3. Set up the environment: Node.js LTS (>= 20.19.4), then `npm ci` and `npx expo start`.

The export field names follow the published PlayTrace export specification and
must not be renamed — downstream analysis scripts depend on them.
