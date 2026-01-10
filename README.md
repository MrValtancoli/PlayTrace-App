# ⚽ PlayTrace - Analise o Jogo

[![Licença: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Plataforma](https://img.shields.io/badge/Platform-Android-green.svg)](https://www.android.com/)
[![Construído com](https://img.shields.io/badge/Built%20with-B4A-blue.svg)](https://www.b4x.com/b4a.html)
![GitHub issues](https://img.shields.io/github/issues/MrValtancoli/PlayTrace-App)
![GitHub stars](https://img.shields.io/github/stars/MrValtancoli/PlayTrace-App)
![Licença](https://img.shields.io/github/license/MrValtancoli/PlayTrace-App)
[![PRs Bem Vindos](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

App Android gratuito e open-source para marcação de partidas em tempo real. Perfeito para treinadores, analistas de video e olheiros que necessitam de mais precisão em marcar tempos.

## ✨ Características

- ⏱️ **Timer de partidas** com pause/resume e marcador de tempo de lesão
- 🏷️ **Botões customizáveis**
- 📊 **4 formatos de referência de tempo** para todos os eventos
- 📤 **Exporte para JSON/CSV** com compartilhamento
- ⚙️ **Informações de partida configuráveis**
- 📴 **Funciona offline** - sem necessidade de internet

## ⏱️ Referências de Tempo

Cada evento marcado registra 4 carimbos de data/hora diferentes:

| Formato | Exemplo | Descrição |
|--------|---------|-------------|
| `timestamp_absolute` | 30/12/25 15:23:45 | Carimbo de data/hora real |
| `time_period` | 23:45 1T | Tempo dentro do período atual |
| `time_match` | 68:30 (2T) | Tempo da partida com indicador de período |
| `time_continuous` | 72:30 | Tempo contínuo, incluindo acréscimos |

<!-- Esta parte será adicionada quando estiver pronta!
## 📲 Instalação

### Baixar APK
Baixe a versão mais recente em [Releases](https://github.com/MrValtancoli/PlayTrace-App/releases).

### Compilar a partir do código-fonte
1. Instale o [B4A](https://www.b4x.com/b4a.html)
2. Clone este repositório
3. Abra `PlayTrace.b4a` no B4A
4. Execute no dispositivo ou emulador

## 🎮 Início Rápido

1. **Defina as informações da partida** (Menu → Informações da Partida)
2. **Inicie o 1º Tempo** → **INICIAR** para começar o cronômetro
3. **Toque nos botões de marcação** para registrar os eventos
4. **Termine o 1º Tempo** → **Iniciar 2º Tempo** quando estiver pronto
5. **Termine a Partida** → Exporte para JSON ou CSV

## 📤 Exportação

As exportações incluem informações da partida, configuração e todos os eventos marcados com dados completos de tempo.

**JSON** - Formato estruturado, ideal para análise de dados com Python/R
**CSV** - Pronto para planilhas, abre diretamente no Excel

## 🗺️ Roteiro

- [ ] Atribuição de times (Casa/Visitante)
- [ ] Marcação de jogadores
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
- 🧪 Testes em diferentes dispositivos Android
- 💡 Sugestões de recursos de treinadores e analistas (etiqueta `enhancement`)

## 📄 Licença

[Licença MIT](LICENSE) - Livre para usar, modificar e distribuir.

## 👤 Autor

**Roberto Valtancoli**
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue)](https://linkedin.com/in/robertovaltancoli)

---

⭐ Dê uma estrela neste repositório se você o achar útil!
