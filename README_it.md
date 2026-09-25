# ⚽ PlayTrace - Analyze The Game

[![Licenza: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Piattaforma](https://img.shields.io/badge/Platform-Android-green.svg)](https://reactnative.dev/)
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

> **Stato del progetto:** disponibile per Android — scarica
> l'[ultima versione](https://github.com/MrValtancoli/PlayTrace-App/releases/latest).
> Il codice è multipiattaforma, ma iOS non è ancora validato. L'app è stata
> provata su un solo dispositivo fisico: le segnalazioni di bug sono molto
> gradite.

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
| `time_continuous` | 72:30 | Posizione nel video montato senza intervallo |

I nomi dei campi esportati usano lo snake_case volutamente, per corrispondere
1:1 alla specifica di esportazione PlayTrace pubblicata.

## 📤 Esportazione

Le esportazioni includono le informazioni sulla partita, la configurazione dei
tag e tutti gli eventi taggati con i dati temporali completi.

- **JSON** — formato strutturato, ideale per l'analisi dati con Python/R
- **CSV** — pronto per i fogli di calcolo, si apre direttamente in Excel

## 🗺️ Roadmap

Il lavoro pianificato è tracciato nelle
[milestone](https://github.com/MrValtancoli/PlayTrace-App/milestones).

**v1.1**
- [ ] Assegnazione squadra: Casa / Trasferta ([#32](https://github.com/MrValtancoli/PlayTrace-App/issues/32))
- [ ] Avvio ritardato del timer, quando il tempo è iniziato prima di premere Start ([#14](https://github.com/MrValtancoli/PlayTrace-App/issues/14))
- [ ] Griglia dei tag che si ingrandisce quando i tag attivi sono pochi ([#37](https://github.com/MrValtancoli/PlayTrace-App/issues/37))
- [ ] Condivisione di un set di tag fra dispositivi ([#34](https://github.com/MrValtancoli/PlayTrace-App/issues/34))
- [ ] CSV protetto dall'esecuzione di formule nei fogli di calcolo ([#36](https://github.com/MrValtancoli/PlayTrace-App/issues/36))

**v1.2**
- [ ] Tagging dei giocatori ([#33](https://github.com/MrValtancoli/PlayTrace-App/issues/33))
- [ ] Layout orizzontale e per tablet ([#35](https://github.com/MrValtancoli/PlayTrace-App/issues/35))
- [ ] Eliminazione di un evento e annullamento dell'ultimo ([#41](https://github.com/MrValtancoli/PlayTrace-App/issues/41))
- [ ] Esportazione XML per i software di analisi video ([#40](https://github.com/MrValtancoli/PlayTrace-App/issues/40))
- [ ] Supporto multilingua ([#39](https://github.com/MrValtancoli/PlayTrace-App/issues/39))

**Più avanti**
- [ ] Correzione del tag di un evento già registrato ([#42](https://github.com/MrValtancoli/PlayTrace-App/issues/42))
- [ ] Riordino dei pulsanti dei tag ([#43](https://github.com/MrValtancoli/PlayTrace-App/issues/43))
- [ ] Timer che segue gli spostamenti nel video durante il tagging ([#25](https://github.com/MrValtancoli/PlayTrace-App/issues/25))
- [ ] App companion per Wear OS ([#29](https://github.com/MrValtancoli/PlayTrace-App/issues/29))
- [ ] Validazione su dispositivi iOS reali ([#24](https://github.com/MrValtancoli/PlayTrace-App/issues/24))
- [ ] Selezione della zona di campo ([#44](https://github.com/MrValtancoli/PlayTrace-App/issues/44))

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
