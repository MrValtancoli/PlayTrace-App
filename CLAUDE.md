@AGENTS.md

# PlayTrace — Analyze The Game

Free, open-source app for real-time football match event tagging.
Target users: coaches, video analysts, scouts. Offline-first.

## Project status

Active pre-release development toward v1.0.
The app is being **rewritten in React Native + Expo (TypeScript)**, cross-platform
iOS + Android. The previous implementation was B4A (Basic4Android) — Android only.
Do not reintroduce B4A patterns, code, or documentation references.

## Stack

- React Native + Expo (SDK 57, RN 0.86), TypeScript (strict)
- State: Zustand, with `persist` middleware on both stores
- Local persistence: AsyncStorage (`@react-native-async-storage/async-storage`)
- Navigation: React Navigation, native stack (not expo-router)
- Entry point: `index.ts` -> `App.tsx` (not file-based routing)
- No backend. No network calls. The app must work fully offline.

## Commands

```bash
npm ci                  # install from the lockfile
npx expo start          # dev server
npx expo start --android
npx expo start --ios
npm run typecheck       # tsc --noEmit
npx tsx scripts/verify-timeformat.ts   # check time formats vs the export spec
```

Node LTS >= 20.19.4 is required by Expo SDK 57.
There is no lint setup yet — do not reference `npm run lint`.

## Core domain rules

These are the product invariants. Breaking them is a bug, not a design choice.

**Timer.** Match timer with pause/resume and crash recovery: if the app is
killed mid-match, elapsed time must be reconstructible on restart from
persisted state, not from in-memory counters.

**Timestamps.** Every tagged event records four timestamps simultaneously:

| Field | Example | Meaning |
|---|---|---|
| `timestamp_absolute` | 30/12/25 15:23:45 | Real-world wall clock |
| `time_period` | 23:45 1T | Time within the current period |
| `time_match` | 68:30 (2T) | Match time with period indicator |
| `time_continuous` | 72:30 | Continuous time including injury time |

All four must be present on every event. Never derive one lazily at export time
in a way that loses precision.

**Tags.** 16 customizable tag buttons, configured before or during a match.

**Export.** JSON and CSV, both consumed downstream by Python and R.
The export schema is a public contract: changing field names or semantics is a
breaking change and needs a note in the release and the wiki.

## Conventions

- **All repository content is in English** — code, comments, commit messages,
  docs, issues, PRs. (Italian is used only for external Italian-language
  publications, which live outside this repo.)
- Commits: conventional style, referencing issues — `fix: resolve timer reset on resume (#15)`
- Branches: `feature/player-tagging`, `fix/timer-crash`
- Labels follow the standard GitHub taxonomy: `bug`, `enhancement`,
  `documentation`, `good first issue`, `help wanted`, `duplicate`, `wontfix`
  (spaces, not hyphens). Use `enhancement`, never "feature".
- Milestones use semantic versioning.

## Scope discipline

Everything declared in the v1.0 milestone ships in v1.0. Nothing is deferred
without an explicit decision. If a change looks like it grows scope, say so
before implementing it.

## Maintainer

Roberto Valtancoli (@MrValtancoli) is the sole maintainer and makes all
structural and roadmap decisions. Community contributions are welcome within
that boundary — documentation and issue templates should reflect this, not
suggest shared decision-making.

MIT License.