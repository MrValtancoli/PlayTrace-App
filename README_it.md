# ⚽ PlayTrace - Analyze The Game

[![Licenza: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Piattaforma](https://img.shields.io/badge/Platform-Android-green.svg)](https://reactnative.dev/)
[![Sviluppato con](https://img.shields.io/badge/Built%20with-Expo-000020.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6.svg)](https://www.typescriptlang.org/)
![GitHub issues](https://img.shields.io/github/issues/MrValtancoli/PlayTrace-App)
![GitHub stars](https://img.shields.io/github/stars/MrValtancoli/PlayTrace-App)
![Licenza](https://img.shields.io/github/license/MrValtancoli/PlayTrace-App)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

🌐 **Traduzioni:** [English](README.md) | [Español](README_es.md) | [Português](README_pt.md) | [Français](README_fr.md) | [Deutsch](README_de.md)

App mobile gratuita e open-source per il tagging di partite di calcio in
real-time. Perfetta per allenatori, videoanalisti, scout e chiunque voglia avere
dati precisi.

> **Stato del progetto:** disponibile per Android — scarica
> l'[ultima versione](https://github.com/MrValtancoli/PlayTrace-App/releases/latest).
> Il codice è multipiattaforma, ma iOS non è ancora validato.

## 📲 Download

Scarica l'ultimo APK dalla
[pagina delle release](https://github.com/MrValtancoli/PlayTrace-App/releases/latest) e aprilo sul
tuo dispositivo Android. Android chiederà di autorizzare l'installazione da
origini sconosciute: è normale per un'app distribuita fuori dal Play Store.

## 🛠️ Eseguire dai sorgenti

Richiede Node.js LTS (>= 20.19.4).

```bash
npm ci
npx expo start
```

Poi apri il progetto in Expo Go, oppure premi `a` per un emulatore Android.

## ✨ Funzionalità

- ⏱️ **Timer partita** con pausa/ripresa, gestione primo/secondo tempo e inserimento dei minuti di recupero
- 🏷️ **Pulsanti tag personalizzabili** (nome, colore, attivazione/disattivazione)
- 📊 **4 formati di riferimento temporale** registrati per ogni evento
- 📤 **Esportazione in JSON, CSV e XML** con funzionalità di condivisione — XML per i software di videoanalisi
- 🔁 **Condivisione del set di tag** con un collega, tramite file
- 🌍 **Sei lingue:** italiano, inglese, spagnolo, portoghese (Brasile), francese, tedesco
- ⚙️ **Informazioni sulla partita configurabili** (competizione, data, luogo, squadre, durata del tempo)
- 📴 **Funziona offline** — non è richiesta una connessione a Internet

## ⏱️ Riferimenti temporali

Ogni evento taggato registra 4 diversi timestamp:

| Formato | Esempio | Descrizione |
|--------|---------|-------------|
| `timestamp_absolute` | 30/12/25 15:23:45 | Timestamp reale |
| `time_period` | 23:45 1T | Tempo nel periodo corrente |
| `time_match` | 68:30 (2T) | Tempo di gioco con indicatore di periodo |
| `time_continuous` | 72:30 | Posizione nel video montato senza intervallo |

I nomi dei campi esportati usano lo snake_case volutamente, per corrispondere
1:1 alla specifica di esportazione PlayTrace pubblicata.

## 📤 Esportazione

Le esportazioni includono le informazioni sulla partita, la configurazione dei
tag, tutti gli eventi taggati con i dati temporali completi e l'inizio reale e
la durata misurata di ciascun tempo — così la gara si può segmentare e se ne
può calcolare la durata effettiva.

- **JSON** — formato strutturato, ideale per l'analisi dati con Python/R
- **CSV** — pronto per i fogli di calcolo, si apre direttamente in Excel
- **XML** — timeline in stile Sportscode per Once, Hudl Sportscode, Nacsport, LongoMatch: ogni evento diventa una clip attorno al suo `time_continuous`

## 🗺️ Roadmap

La roadmap e lo stato aggiornato del progetto si trovano nel
[README in inglese](README.md) e nelle
[milestone](https://github.com/MrValtancoli/PlayTrace-App/milestones): questa traduzione non li ripete, per non
restare indietro.

## 🤝 Contributi

Accogliamo volentieri i contributi della community di analisi calcistica!

**Nuovo nel progetto?** Consulta il [Welcome Contributors issue](https://github.com/MrValtancoli/PlayTrace-App/issues/1) per iniziare al meglio.

**Vuoi contribuire?** Leggi la nostra [Contributing Guide](CONTRIBUTING.md) per iniziare.

Aree in cui abbiamo particolare bisogno (cerca l'etichetta `help wanted`):
- 🌍 Revisione delle traduzioni dell'app e dei README ([#51](https://github.com/MrValtancoli/PlayTrace-App/issues/51))
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
