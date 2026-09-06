# Project Management Guide - PlayTrace

Guida completa su come gestire Issues, Labels e Project Board per PlayTrace.

## 📋 Panoramica

**GitHub fornisce 3 strumenti principali:**
1. **Issues** - Tracciamento di bug, feature, documentazione
2. **Labels** - Categorizzazione delle issues
3. **Project Board** - Visualizzazione Kanban del workflow

## 🏷️ Labels Standard

GitHub fornisce già queste label di default (verificale in Settings → Labels):

| Label | Colore | Quando usarla |
|-------|--------|---------------|
| `bug` | 🔴 Rosso | Qualcosa non funziona correttamente |
| `enhancement` | 🟢 Verde | Richiesta di nuova funzionalità |
| `documentation` | 🔵 Blu | Miglioramenti a docs/guide/wiki |
| `good first issue` | 🟣 Viola | Task facili per nuovi contributori |
| `help wanted` | 🟡 Giallo | Serve aiuto dalla community |
| `duplicate` | ⚪ Grigio | Issue già esistente |
| `wontfix` | ⚪ Grigio | Non verrà implementato |

## 📊 Stati del Project Board

Il tuo Project Board ha 4 colonne:

| Stato | Significato | Quando usarlo |
|-------|-------------|---------------|
| **To Do** | Da fare | Issue prioritizzate, pronte per essere lavorate |
| **In Progress** | In lavorazione | Stai attivamente lavorando su queste (max 2-3) |
| **Done** | Completate | Issue risolte e verificate |
| **Rejected** | Rifiutate | Issue che non verranno implementate |

## 🔄 Workflow Completo

### 1️⃣ Arriva una nuova Issue

**Esempio**: User crea issue "Timer si blocca su iOS 17"

**Actions:**
1. Leggi e riproduci il bug
2. Verifica se il problema è su una sola piattaforma o su entrambe: con React
   Native è la prima domanda da farsi, e cambia completamente la diagnosi
3. Applica label: `bug`
4. Decidi se è prioritaria
5. Se sì → Aggiungi al Project Board in "To Do"
6. Se è critica → Commenta "Grazie! Priorità alta, lo risolvo presto"

---

**Esempio 2**: User chiede "Aggiungere supporto per hockey"

**Actions:**
1. Valuta la richiesta
2. Applica label: `enhancement`, `wontfix`
3. Sposta in "Rejected" (o non aggiungere al board)
4. Commenta: "Grazie per l'idea! PlayTrace è focalizzato sul calcio, ma essendo open-source puoi forkare il progetto"
5. Chiudi issue

---

**Esempio 3**: User chiede "Come esportare i dati?"

**Actions:**
1. Rispondi alla domanda
2. Applica label: `documentation`
3. Se manca documentazione → Crea issue separata "Add export guide to Wiki"
4. Aggiungi `good first issue` se appropriato
5. Chiudi la domanda originale

### 2️⃣ Iniziare a lavorare

**Workflow:**
1. Scegli issue da "To Do"
2. Spostala in "In Progress"
3. Opzionale: Aggiungi commento "Working on this"
4. Lavora sul codice

**Pro tip**: Mantieni max 2-3 issues in "In Progress" per evitare dispersione

### 3️⃣ Completare l'issue

**Se risolto:**
1. Testa la soluzione
2. Committa con messaggio: `fix: resolve timer crash on iOS 17 (#15)`
3. Sposta issue in "Done"
4. Chiudi issue con commento: "Fixed in v1.1.0"

**Se non si può risolvere:**
1. Sposta in "Rejected"
2. Applica label `wontfix`
3. Spiega il motivo
4. Chiudi issue

## 🎯 Casi d'uso specifici

### Bug critici

```
Label: bug
Priority: Alta
Board: To Do → In Progress → Done (rapidamente)
Commento: "Thanks for reporting! This is critical, fixing ASAP"
```

### Richieste community

```
Label: enhancement, help wanted
Priority: Media
Board: To Do
Commento: "Great idea! I'd welcome contributions on this"
```

### Task per newcomers

```
Label: good first issue, documentation
Priority: Bassa
Board: To Do
Commento: "Perfect for first-time contributors! Check CONTRIBUTING.md"
```

### Feature complesse

```
Label: enhancement
Priority: Bassa
Board: To Do (o non nel board)
Commento: "Interesting! This would require significant changes. Adding to roadmap"
```

### Duplicati

```
Label: duplicate
Priority: N/A
Board: Non aggiungere
Commento: "Thanks! This is a duplicate of #23" + chiudi
```

## 📈 Metriche da monitorare

- **Issues aperte**: Cerca di mantenerle gestibili (<20 aperte)
- **Response time**: Rispondi entro 48h alle nuove issue
- **Issues in Progress**: Max 2-3 alla volta
- **Good first issues**: Mantieni sempre 3-5 disponibili per newcomers

## 🚀 Tips per attrarre contributors

1. **Label "good first issue"** su task facili (docs, UI tweaks, test)
2. **Label "help wanted"** su feature che necessitano competenze specifiche
3. **Commenti accoglienti**: "Thanks for contributing!", "Great suggestion!"
4. **Rispondi rapidamente** alle prime PR/issues di nuovi contributori
5. **Festeggia i contributi**: "Merged! Thanks @username for your first contribution!"

## 🔍 Esempi reali

### Issue #1: Welcome Contributors
```
Labels: good first issue
Board: Non nel board (è un meta-issue)
Pinned: Sì
```

### Issue #5: "Add Spanish translation"
```
Labels: enhancement, help wanted, good first issue, documentation
Board: To Do
Commento: "Would love help with this! See CONTRIBUTING.md for translation guide"
```

*Nota: il portoghese è già stato tradotto da @Lucasqrz1. Le lingue ancora
scoperte sono spagnolo, francese e tedesco.*

### Issue #12: "Export to Excel format"
```
Labels: enhancement
Board: To Do
Milestone: v1.2
Commento: "Great idea! Planning this for v1.2"
```

### Issue #18: "App crashes when..."
```
Labels: bug
Board: To Do → In Progress → Done
Commento: "Reproduced! Working on a fix now" → "Fixed in PR #19"
```

## 📚 Manutenzione della documentazione

I file di documentazione sono collegati fra loro: modificarne uno spesso obbliga
a toccarne altri. Questa è la parte che si dimentica per prima.

| Se modifichi... | Verifica anche... |
|-----------------|-------------------|
| `README.md` | `README.it.md` e `README.pt.md` (stessa struttura, contenuto tradotto) |
| Stato di una feature | `FEATURES.md` — è l'unico posto che traccia Done / In Progress / Planned |
| Setup di sviluppo | `CONTRIBUTING.md` **e** le note per sviluppatori in fondo a `FEATURES.md` |
| `WELCOME_CONTRIBUTORS_ISSUE.md` | Il corpo della **issue #1 pinnata** su GitHub: il file nel repo e la issue sono due copie separate, aggiornarne una non aggiorna l'altra |
| Requisiti di piattaforma o di ambiente | `.github/ISSUE_TEMPLATE/bug_report.yml` (i campi Device / versione OS) |

**Regola pratica**: quando apri una PR di documentazione, elenca nella
descrizione quali degli altri file restano da allineare. Non serve farlo tutto
subito, serve non perdere traccia.

Per le traduzioni non sei tenuto a tradurre tu: apri una issue con label
`documentation` + `help wanted` e tagga chi ha già contribuito quella lingua.

## 🛠️ Automazioni utili

Puoi automatizzare con GitHub Actions (opzionale):
- Auto-label in base a keywords nel titolo
- Auto-add issues con label `bug` al Project Board
- Auto-chiudi issues stale dopo 90 giorni di inattività

Ma per ora, gestione manuale va benissimo!

---

**Remember**: Le labels e il project board sono strumenti per TE. Usali come ti è più comodo, l'importante è la coerenza. 

Buon lavoro! ⚽
