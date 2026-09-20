# ⚽ PlayTrace - Analyze The Game

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform](https://img.shields.io/badge/Platform-Android-green.svg)](https://reactnative.dev/)
[![Built with](https://img.shields.io/badge/Built%20with-Expo-000020.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6.svg)](https://www.typescriptlang.org/)
![GitHub issues](https://img.shields.io/github/issues/MrValtancoli/PlayTrace-App)
![GitHub stars](https://img.shields.io/github/stars/MrValtancoli/PlayTrace-App)
![License](https://img.shields.io/github/license/MrValtancoli/PlayTrace-App)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

🌐 **Translations:** [Português](README_pt.md) | [Italiano](README_it.md)

Free, open-source mobile app for real-time football match tagging. Perfect for
coaches, video analysts, and scouts who need precise event timing data.

> **Status:** v1.0.0 released for Android. The codebase is cross-platform,
> but iOS is not validated yet. The app has been tested on a single physical
> device — bug reports are very welcome.

## 📲 Download

Grab the latest APK from the
[releases page](https://github.com/MrValtancoli/PlayTrace-App/releases/latest) and open it on your
Android device. Android will ask you to allow installation from unknown
sources, which is expected for an app distributed outside the Play Store.

## 🛠️ Running from source

Requires Node.js LTS (>= 20.19.4).

```bash
npm ci
npx expo start
```

Then open the project in Expo Go, or press `a` / `i` for an Android emulator or
iOS simulator.

## ✨ Features

- ⏱️ **Match timer** with pause/resume, 1st/2nd half flow, and injury time entry
- 🏷️ **Customizable tag buttons** (name, color, enable/disable)
- 📊 **4 time reference formats** recorded for every event
- 📤 **Export to JSON/CSV** with share functionality
- ⚙️ **Configurable match info** (competition, date, venue, teams, half duration)
- 📴 **Works offline** — no internet required

## ⏱️ Time References

Each tagged event records 4 different timestamps:

| Format | Example | Description |
|--------|---------|-------------|
| `timestamp_absolute` | 30/12/25 15:23:45 | Real-world timestamp |
| `time_period` | 23:45 1T | Time within current period |
| `time_match` | 68:30 (2T) | Match time with period indicator |
| `time_continuous` | 72:30 | Position in a continuously edited video |

Export field names use snake_case on purpose, to match the published PlayTrace
export specification 1:1.

## 📤 Export

Exports include match info, tag configuration, and all tagged events with full
timing data.

- **JSON** — structured format, ideal for data analysis with Python/R
- **CSV** — spreadsheet-ready, opens directly in Excel

## 🗺️ Roadmap

- [ ] Team assignment (Home/Away)
- [ ] Player tagging
- [ ] Sharing a tag set between devices
- [ ] Landscape and tablet layouts
- [ ] Pitch zone selection
- [ ] Video timestamp sync
- [ ] Multi-language support

## 🤝 Contributing

We welcome contributions from the football analysis community!

**New to the project?** Check out our [Welcome Contributors issue](https://github.com/MrValtancoli/PlayTrace-App/issues/1) for good first tasks.

**Want to contribute?** Read our [Contributing Guide](CONTRIBUTING.md) to get started.

Areas where we especially need help (look for the `help wanted` label):
- 🌍 Translations (Spanish, Portuguese, French, German)
- 📚 Documentation & tutorials (`documentation` label)
- 🧪 Testing on different iOS and Android devices
- 💡 Feature suggestions from coaches and analysts (`enhancement` label)

**Using an AI assistant?** That's fine — see the [AI-assisted contributions](CONTRIBUTING.md#-ai-assisted-contributions) section.

## 📄 License

[MIT License](LICENSE) - Free to use, modify, and distribute.

## 👤 Author

**Roberto Valtancoli**
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue)](https://linkedin.com/in/robertovaltancoli)

## 🙏 Contributors

Thanks to everyone who helps make PlayTrace better!

- [@Lucasqrz1](https://github.com/Lucasqrz1) — Portuguese translation

---

⭐ Star this repo if you find it useful!
