# PlayTrace - GitHub Issue Templates Setup

## 📁 Struttura file

Copia questi file nella tua repository PlayTrace seguendo questa struttura:

```
playtrace/
├── .github/
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.yml
│       ├── feature_request.yml
│       ├── documentation.yml
│       └── config.yml
└── CONTRIBUTING.md
```

## 🚀 Come installare

### Opzione 1: Manualmente
1. Nella tua repo, crea la cartella `.github/ISSUE_TEMPLATE/`
2. Carica i 4 file `.yml` in quella cartella
3. Carica `CONTRIBUTING.md` nella root del progetto

### Opzione 2: Da riga di comando
```bash
# Dalla root della tua repo locale
git checkout -b add-issue-templates
mkdir -p .github/ISSUE_TEMPLATE
# Copia i file dalle cartelle che ti ho preparato
git add .
git commit -m "Add issue templates and contributing guidelines"
git push origin add-issue-templates
# Poi fai la pull request su GitHub
```

## ✅ Verifica installazione

Dopo il commit:
1. Vai su GitHub → Issues → New Issue
2. Dovresti vedere 3 template disponibili:
   - 🐛 Bug Report
   - ✨ Feature Request
   - 📚 Documentation Improvement

## 🎨 Personalizzazioni

### Modificare i template
- Apri i file `.yml` e modifica i campi necessari
- Puoi aggiungere/rimuovere domande
- Cambia labels, assignees, etc.

### Aggiungere nuovi template
Crea un nuovo file `.yml` in `.github/ISSUE_TEMPLATE/` seguendo lo stesso formato.

### Link utili nei template
Nel file `config.yml` puoi modificare i link (es. quando attivi le GitHub Discussions).

## 📋 Cosa fanno i template

### bug_report.yml
Raccoglie informazioni strutturate sui bug:
- Descrizione del problema
- Step per riprodurlo
- Comportamento atteso vs effettivo
- Device e versione Android
- Version di PlayTrace

### feature_request.yml
Raccoglie richieste di nuove funzionalità:
- Categoria della feature
- Problema che risolve
- Soluzione proposta
- Ruolo dell'utente (coach/analyst/scout)
- Priorità

### documentation.yml
Per miglioramenti alla documentazione:
- Tipo di documentazione
- Problema attuale
- Miglioramento suggerito

### config.yml
Configura il menu "New Issue" con link utili.

### CONTRIBUTING.md
Guida per i contributori con:
- Come contribuire
- Setup sviluppo
- Code style
- Roadmap

## 🎯 Best Practices

1. **Mantieni i template aggiornati** quando il progetto evolve
2. **Rispondi velocemente** alle prime issue per incoraggiare contributi
3. **Usa labels** per categorizzare: `bug`, `enhancement`, `good-first-issue`, `help-wanted`
4. **Milestone** per pianificare release (v1.1, v1.2, etc.)

## 🏷️ Labels suggerite

Crea queste labels nella tua repo (Settings → Labels):
- `bug` (rosso) - Qualcosa non funziona
- `enhancement` (verde) - Nuova funzionalità
- `documentation` (blu) - Miglioramenti docs
- `good-first-issue` (viola) - Facile per nuovi contributori
- `help-wanted` (giallo) - Serve aiuto esterno
- `needs-triage` (arancione) - Da valutare
- `needs-review` (ciano) - In attesa di review
- `wontfix` (grigio) - Non verrà implementato
- `duplicate` (grigio) - Issue duplicata

---

**Prossimi step dopo l'installazione:**
1. Abilita GitHub Discussions per Q&A
2. Crea il primo issue "Welcome contributors" con label `good-first-issue`
3. Aggiungi badge al README: `![GitHub issues](https://img.shields.io/github/issues/robertovaltancoli/playtrace)`

Buon lavoro con PlayTrace! ⚽
