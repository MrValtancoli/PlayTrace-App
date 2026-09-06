# Contributing to PlayTrace

Thank you for your interest in contributing to PlayTrace! 🎉

PlayTrace is built with **React Native** and **Expo** (TypeScript), and targets
both **iOS and Android** from a single codebase.

## How Can I Contribute?

### 🐛 Reporting Bugs
Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.yml) and include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Device, OS and OS version (e.g. iPhone 13, iOS 17 — or Pixel 6, Android 14)
- How you ran the app (Expo Go, development build, or installed release)
- PlayTrace version

### ✨ Suggesting Features
Use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.yml) and explain:
- What problem it solves
- Who benefits from it
- How it should work

### 📚 Improving Documentation
Use the [Documentation template](.github/ISSUE_TEMPLATE/documentation.yml) for:
- Typo fixes
- Clarifications
- New tutorials
- Translation improvements

Note that the README exists in several languages (`README.md`, `README.it.md`,
`README.pt.md`). If you change one, please flag in your PR which of the others
still need the same change — you don't have to translate them yourself.

### 💻 Code Contributions

**Development Setup:**
1. Install [Node.js](https://nodejs.org/) (LTS release) and npm
2. Fork this repository and clone your fork
3. Run `npm install` to install dependencies
4. Run `npx expo start` to launch the development server
5. Open the app with [Expo Go](https://expo.dev/go) on your phone (scan the QR
   code), or press `a` / `i` to launch an Android emulator or iOS simulator
6. Make your changes — the app reloads automatically
7. Test on both platforms if you can; if you only have one, say so in the PR

**Pull Request Guidelines:**
- Create a new branch for your feature (`feature/player-tagging`)
- Write clear commit messages
- Reference related issues (`Fixes #42`)
- Test thoroughly before submitting
- Update documentation if needed

**Code Style:**
- TypeScript throughout — avoid `any`, and type component props explicitly
- Follow the existing structure: screens, components, services, and state stores
  stay in their own folders
- Keep business logic (time calculations, export formatting) out of components
  and in services, so it can be reasoned about and tested on its own
- Add comments for complex logic
- Keep functions focused and readable

**One rule that is not negotiable:** the exported field names
(`timestamp_absolute`, `time_period`, `time_match`, `time_continuous`) use
snake_case and must match the published PlayTrace export specification exactly.
People analyze this data in Python and R — renaming a field breaks their
scripts.

## 🎯 Priority Areas

We especially welcome contributions in:
- **Translations** (Spanish, Portuguese, French, German)
- **UI/UX improvements**
- **Export format enhancements**
- **Testing on different iOS and Android devices**
- **Documentation & tutorials**

## 📋 Development Roadmap

See [FEATURES.md](FEATURES.md) for the feature roadmap and current status.

Check the [Project Board](https://github.com/MrValtancoli/PlayTrace-App/projects) to see:
- Current priorities
- Available tasks
- Features in development

## ❓ Questions?

- Open a [Discussion](https://github.com/MrValtancoli/PlayTrace-App/discussions)
- Check existing issues
- Reach out to [@MrValtancoli](https://github.com/MrValtancoli)

## 📜 Code of Conduct

- Be respectful and constructive
- Welcome newcomers
- Focus on what's best for the football analysis community
- Assume good intentions

## 🙏 Thank You!

Every contribution, no matter how small, helps make PlayTrace better for coaches, analysts, and scouts worldwide.

---

*Built with passion for the football community* ⚽
