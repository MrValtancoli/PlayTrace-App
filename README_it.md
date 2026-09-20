# ⚽ PlayTrace - Analyze The Game

[![Licenza: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Piattaforma](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-green.svg)](https://reactnative.dev/)
[![Sviluppato con](https://img.shields.io/badge/Built%20with-Expo-000020.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6.svg)](https://www.typescriptlang.org/)
![GitHub issues](https://img.shields.io/github/issues/MrValtancoli/PlayTrace-App)
![GitHub stars](https://img.shields.io/github/stars/MrValtancoli/PlayTrace-App)
![Licenza](https://img.shields.io/github/license/MrValtancoli/PlayTrace-App)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

🌐 **Traduzioni:** [English](README.md) | [Português](README_pt.md)

App mobile gratuita e open-source per il tagging di partite di calcio in
real-time. Perfetta per allenatori, videoanalisti, scout e chiunque voglia avere
dati precisi.

> **Stato del progetto:** lavori in corso. L'app è in fase di riscrittura con
> React Native ed Expo per iOS e Android. Le istruzioni di installazione saranno
> aggiunte una volta validata la prima build.

## ✨ Funzionalità

- ⏱️ **Timer partita** con pausa/ripresa, gestione primo/secondo tempo e inserimento dei minuti di recupero
- 🏷️ **Pulsanti tag personalizzabili** (nome, colore, attivazione/disattivazione)
- 📊 **4 formati di riferimento temporale** registrati per ogni evento
- 📤 **Esportazione in JSON/CSV** con funzionalità di condivisione
- ⚙️ **Informazioni sulla partita configurabili** (competizione, data, luogo, squadre, durata del tempo)
- 📴 **Funziona offline** — non è richiesta una connessione a Internet

## ⏱️ Riferimenti temporali

Ogni evento taggato registra 4 diversi timestamp:

| Formato | Esempio | Descrizione |
|--------|---------|-------------|
| `timestamp_absolute` | 30/12/25 15:23:45 | Timestamp reale |
| `time_period` | 23:45 1T | Tempo nel periodo corrente |
| `time_match` | 68:30 (2T) | Tempo di gioco con indicatore di periodo |
| `time_continuous` | 72:30 | Tempo continuo inclusi i minuti di recupero |

I nomi dei campi esportati usano lo snake_case volutamente, per corrispondere
1:1 alla specifica di esportazione PlayTrace pubblicata.

## 📤 Esportazione

Le esportazioni includono le informazioni sulla partita, la configurazione dei
tag e tutti gli eventi taggati con i dati temporali completi.

**JSON** — formato strutturato, ideale per l'analisi dati con Python/R
**CSV** — pronto per i fogli di calcolo, si apre direttamente in Excel

## 🗺️ Roadmap

- [ ] Assegnazione squadra (Casa/Trasferta)
- [ ] Tagging dei giocatori
- [ ] Selezione della zona di campo
- [ ] Sincronizzazione con i timestamp video
- [ ] Supporto multilingua

## 🤝 Contributi

Accogliamo volentieri i contributi della community di analisi calcistica!

**Nuovo nel progetto?** Consulta il [Welcome Contributors issue](https://github.com/MrValtancoli/PlayTrace-App/issues/1) per iniziare al meglio.

**Vuoi contribuire?** Leggi la nostra [Contributing Guide](CONTRIBUTING.md) per iniziare.

Aree in cui abbiamo particolare bisogno (cerca l'etichetta `help wanted`):
- 🌍 Traduzioni (Spagnolo, Portoghese, Francese, Tedesco)
- 📚 Documentazione & tutorial (etichetta `documentation`)
- 🧪 Test su dispositivi iOS e Android differenti
- 💡 Suggerimenti di funzionalità da parte di allenatori ed analisti (etichetta `enhancement`)

**Usi un assistente AI?** Nessun problema — leggi la sezione [AI-assisted contributions](CONTRIBUTING.md#-ai-assisted-contributions).

## 📄 Licenza

[MIT License](LICENSE) - Gratuito da usare, modificare e distribuire.

## 👤 Autore

**Roberto Valtancoli**
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue)](https://linkedin.com/in/robertovaltancoli)

---

⭐ Aggiungi una stella a questo repository se lo trovi utile!
