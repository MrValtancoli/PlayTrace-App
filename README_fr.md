# ⚽ PlayTrace - Analyze The Game

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform](https://img.shields.io/badge/Platform-Android-green.svg)](https://reactnative.dev/)
[![Built with](https://img.shields.io/badge/Built%20with-Expo-000020.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6.svg)](https://www.typescriptlang.org/)
![GitHub issues](https://img.shields.io/github/issues/MrValtancoli/PlayTrace-App)
![GitHub stars](https://img.shields.io/github/stars/MrValtancoli/PlayTrace-App)
![License](https://img.shields.io/github/license/MrValtancoli/PlayTrace-App)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

🌐 **Traductions:** [English](README.md) | [Italiano](README_it.md) | [Español](README_es.md) | [Português](README_pt.md) | [Deutsch](README_de.md)

Application mobile gratuite et open source pour le tagging de matchs de
football en temps réel. Idéale pour les entraîneurs, analystes vidéo et
recruteurs qui ont besoin de données de temps précises.

> **Statut :** disponible pour Android — téléchargez la
> [dernière version](https://github.com/MrValtancoli/PlayTrace-App/releases/latest).
> Le code est multiplateforme, mais iOS n'est pas encore validé.

## 📲 Téléchargement

Téléchargez le dernier APK depuis la
[page des releases](https://github.com/MrValtancoli/PlayTrace-App/releases/latest) et ouvrez-le sur votre appareil
Android. Android vous demandera d'autoriser l'installation depuis des sources
inconnues, ce qui est normal pour une app distribuée hors du Play Store.

## 🛠️ Lancer depuis le code source

Nécessite Node.js LTS (>= 20.19.4).

```bash
npm ci
npx expo start
```

Ouvrez ensuite le projet dans Expo Go, ou appuyez sur `a` / `i` pour un
émulateur Android ou un simulateur iOS.

## ✨ Fonctionnalités

- ⏱️ **Chronomètre de match** avec pause/reprise, enchaînement 1re/2e mi-temps et saisie du temps additionnel
- 🏷️ **Boutons de tag personnalisables** (nom, couleur, activation/désactivation)
- 📊 **4 formats de référence temporelle** enregistrés pour chaque événement
- 📤 **Export JSON/CSV** avec partage
- ⚙️ **Infos du match configurables** (compétition, date, stade, équipes, durée d'une mi-temps)
- 📴 **Fonctionne hors ligne** — aucune connexion internet requise

## ⏱️ Références temporelles

Chaque événement tagué enregistre 4 horodatages différents :

| Format | Exemple | Description |
|--------|---------|-------------|
| `timestamp_absolute` | 30/12/25 15:23:45 | Date et heure réelles |
| `time_period` | 23:45 1T | Temps dans la mi-temps en cours |
| `time_match` | 68:30 (2T) | Temps de match avec indicateur de mi-temps |
| `time_continuous` | 72:30 | Position dans une vidéo montée en continu |

Les noms de champs exportés utilisent volontairement le snake_case, pour
correspondre 1:1 à la spécification d'export publiée de PlayTrace.

## 📤 Export

Les exports contiennent les infos du match, la configuration des tags, chaque
événement tagué avec toutes ses données de temps, ainsi que le début réel et la
durée mesurée de chaque mi-temps — le match peut ainsi être segmenté et sa
durée réelle calculée.

- **JSON** — format structuré, idéal pour l'analyse de données avec Python/R
- **CSV** — prêt pour les tableurs, s'ouvre directement dans Excel

## 🗺️ Feuille de route

La feuille de route et l'état à jour du projet se trouvent dans le
[README en anglais](README.md) et dans les
[milestones](https://github.com/MrValtancoli/PlayTrace-App/milestones) : cette traduction ne les reprend pas, pour ne
pas devenir obsolète.

## 🤝 Contribuer

Les contributions de la communauté de l'analyse football sont les bienvenues !

**Nouveau sur le projet ?** Consultez l'[issue de bienvenue](https://github.com/MrValtancoli/PlayTrace-App/issues/1) pour trouver de bonnes premières tâches.

**Envie de contribuer ?** Lisez le [Contributing Guide](CONTRIBUTING.md) pour commencer.

Domaines où nous avons particulièrement besoin d'aide (cherchez le label `help wanted`) :
- 🌍 Relecture des traductions de l'app et des README ([#51](https://github.com/MrValtancoli/PlayTrace-App/issues/51))
- 📚 Documentation et tutoriels (label `documentation`)
- 🧪 Tests sur différents appareils iOS et Android
- 💡 Suggestions de fonctionnalités d'entraîneurs et d'analystes (label `enhancement`)

**Vous utilisez un assistant IA ?** Aucun problème — voir la section [AI-assisted contributions](CONTRIBUTING.md#-ai-assisted-contributions).

## 📄 Licence

[Licence MIT](LICENSE) - Libre d'utilisation, de modification et de distribution.

## 👤 Auteur

**Roberto Valtancoli**
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue)](https://linkedin.com/in/robertovaltancoli)

---

⭐ Ajoutez une étoile à ce dépôt si vous le trouvez utile !
