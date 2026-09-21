# ⚽ PlayTrace - Analise o Jogo

[![Licença: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Plataforma](https://img.shields.io/badge/Platform-Android-green.svg)](https://reactnative.dev/)
[![Construído com](https://img.shields.io/badge/Built%20with-Expo-000020.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6.svg)](https://www.typescriptlang.org/)
![GitHub issues](https://img.shields.io/github/issues/MrValtancoli/PlayTrace-App)
![GitHub stars](https://img.shields.io/github/stars/MrValtancoli/PlayTrace-App)
![Licença](https://img.shields.io/github/license/MrValtancoli/PlayTrace-App)
[![PRs Bem Vindos](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

🌐 **Traduções:** [English](README.md) | [Italiano](README_it.md)

App móvel gratuito e open-source para marcação de partidas em tempo real.
Perfeito para treinadores, analistas de vídeo e olheiros que necessitam de mais
precisão em marcar tempos.

> **Status:** disponível para Android — baixe a
> [versão mais recente](https://github.com/MrValtancoli/PlayTrace-App/releases/latest).
> O código é multiplataforma, mas o iOS ainda não foi validado. O app foi
> testado em um único aparelho físico — relatos de bugs são muito bem-vindos.

## 📲 Download

Baixe o APK mais recente na
[página de releases](https://github.com/MrValtancoli/PlayTrace-App/releases/latest) e abra-o no seu
aparelho Android. O Android vai pedir autorização para instalar de fontes
desconhecidas, o que é esperado para um app distribuído fora da Play Store.

## 🛠️ Executando a partir do código-fonte

Requer Node.js LTS (>= 20.19.4).

```bash
npm ci
npx expo start
```

Depois abra o projeto no Expo Go, ou pressione `a` para um emulador Android.

## ✨ Características

- ⏱️ **Timer de partidas** com pause/resume, fluxo de 1º/2º tempo e marcação de acréscimos
- 🏷️ **Botões customizáveis** (nome, cor, ativar/desativar)
- 📊 **4 formatos de referência de tempo** registrados para todos os eventos
- 📤 **Exporte para JSON/CSV** com compartilhamento
- ⚙️ **Informações de partida configuráveis** (competição, data, local, times, duração do tempo)
- 📴 **Funciona offline** — sem necessidade de internet

## ⏱️ Referências de Tempo

Cada evento marcado registra 4 carimbos de data/hora diferentes:

| Formato | Exemplo | Descrição |
|--------|---------|-------------|
| `timestamp_absolute` | 30/12/25 15:23:45 | Carimbo de data/hora real |
| `time_period` | 23:45 1T | Tempo dentro do período atual |
| `time_match` | 68:30 (2T) | Tempo da partida com indicador de período |
| `time_continuous` | 72:30 | Posição no vídeo montado, sem o intervalo |

Os nomes dos campos exportados usam snake_case propositalmente, para
corresponder 1:1 à especificação de exportação publicada do PlayTrace.

## 📤 Exportação

As exportações incluem informações da partida, a configuração das marcações e
todos os eventos marcados com dados completos de tempo.

- **JSON** — formato estruturado, ideal para análise de dados com Python/R
- **CSV** — pronto para planilhas, abre diretamente no Excel

## 🗺️ Roteiro

- [ ] Atribuição de times (Casa/Visitante)
- [ ] Marcação de jogadores
- [ ] Compartilhar um conjunto de tags entre aparelhos
- [ ] Layouts em modo paisagem e para tablets
- [ ] Seleção de zona do campo
- [ ] Sincronização de carimbo de data/hora de vídeo
- [ ] Suporte a vários idiomas

## 🤝 Contribuindo

Aceitamos contribuições da comunidade de análise de futebol!

**É novo no projeto?** Confira nossa [issue de Boas-vindas aos Contribuidores](https://github.com/MrValtancoli/PlayTrace-App/issues/1) para encontrar boas tarefas para começar.

**Quer contribuir?** Leia nosso [Guia de Contribuição](CONTRIBUTING.md) para começar.

Áreas onde precisamos de ajuda (procure pela etiqueta `help wanted`):
- 🌍 Traduções (espanhol, português, francês, alemão)
- 📚 Documentação e tutoriais (etiqueta `documentation`)
- 🧪 Testes em diferentes dispositivos iOS e Android
- 💡 Sugestões de recursos de treinadores e analistas (etiqueta `enhancement`)

**Usa um assistente de IA?** Sem problema — veja a seção [AI-assisted contributions](CONTRIBUTING.md#-ai-assisted-contributions).

## 📄 Licença

[Licença MIT](LICENSE) - Livre para usar, modificar e distribuir.

## 👤 Autor

**Roberto Valtancoli**
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue)](https://linkedin.com/in/robertovaltancoli)

---
*Tradução por [@Lucasqrz1](https://github.com/Lucasqrz1)*

---

⭐ Dê uma estrela neste repositório se você o achar útil!
