# ⚽ PlayTrace - Analyze The Game

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform](https://img.shields.io/badge/Platform-Android-green.svg)](https://reactnative.dev/)
[![Built with](https://img.shields.io/badge/Built%20with-Expo-000020.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6.svg)](https://www.typescriptlang.org/)
![GitHub issues](https://img.shields.io/github/issues/MrValtancoli/PlayTrace-App)
![GitHub stars](https://img.shields.io/github/stars/MrValtancoli/PlayTrace-App)
![License](https://img.shields.io/github/license/MrValtancoli/PlayTrace-App)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

🌐 **Traducciones:** [English](README.md) | [Italiano](README_it.md) | [Português](README_pt.md) | [Français](README_fr.md) | [Deutsch](README_de.md)

Aplicación móvil gratuita y de código abierto para etiquetar partidos de
fútbol en tiempo real. Ideal para entrenadores, analistas de vídeo y
ojeadores que necesitan datos de tiempo precisos.

> **Estado:** disponible para Android — descarga la
> [última versión](https://github.com/MrValtancoli/PlayTrace-App/releases/latest).
> El código es multiplataforma, pero iOS aún no está validado.

## 📲 Descarga

Descarga el APK más reciente desde la
[página de releases](https://github.com/MrValtancoli/PlayTrace-App/releases/latest) y ábrelo en tu dispositivo
Android. Android te pedirá permitir la instalación desde orígenes
desconocidos, algo normal en una app distribuida fuera de Play Store.

## 🛠️ Ejecutar desde el código fuente

Requiere Node.js LTS (>= 20.19.4).

```bash
npm ci
npx expo start
```

Después abre el proyecto en Expo Go, o pulsa `a` / `i` para un emulador de
Android o un simulador de iOS.

## ✨ Funciones

- ⏱️ **Cronómetro del partido** con pausa/reanudación, flujo de 1.ª/2.ª parte e introducción del tiempo añadido
- 🏷️ **Botones de etiqueta personalizables** (nombre, color, activar/desactivar)
- 📊 **4 formatos de referencia temporal** registrados para cada evento
- 📤 **Exportación a JSON/CSV** con opción de compartir
- ⚙️ **Datos del partido configurables** (competición, fecha, estadio, equipos, duración de cada parte)
- 📴 **Funciona sin conexión** — no necesita internet

## ⏱️ Referencias temporales

Cada evento etiquetado registra 4 marcas de tiempo distintas:

| Formato | Ejemplo | Descripción |
|--------|---------|-------------|
| `timestamp_absolute` | 30/12/25 15:23:45 | Fecha y hora reales |
| `time_period` | 23:45 1T | Tiempo dentro de la parte actual |
| `time_match` | 68:30 (2T) | Tiempo de partido con indicador de parte |
| `time_continuous` | 72:30 | Posición en un vídeo editado de forma continua |

Los nombres de los campos exportados usan snake_case a propósito, para
coincidir 1:1 con la especificación de exportación publicada de PlayTrace.

## 📤 Exportación

Las exportaciones incluyen los datos del partido, la configuración de las
etiquetas, cada evento etiquetado con todos sus datos de tiempo, y el inicio
real y la duración medida de cada parte — así el partido se puede segmentar y
calcular su duración real.

- **JSON** — formato estructurado, ideal para el análisis de datos con Python/R
- **CSV** — listo para hojas de cálculo, se abre directamente en Excel

## 🗺️ Hoja de ruta

La hoja de ruta y el estado actualizado del proyecto están en el
[README en inglés](README.md) y en los
[milestones](https://github.com/MrValtancoli/PlayTrace-App/milestones): esta traducción no los repite, para no
quedarse desactualizada.

## 🤝 Contribuir

¡Las contribuciones de la comunidad del análisis de fútbol son bienvenidas!

**¿Nuevo en el proyecto?** Consulta la [issue de bienvenida](https://github.com/MrValtancoli/PlayTrace-App/issues/1) para encontrar buenas primeras tareas.

**¿Quieres contribuir?** Lee la [Contributing Guide](CONTRIBUTING.md) para empezar.

Áreas en las que necesitamos ayuda especialmente (busca la etiqueta `help wanted`):
- 🌍 Revisión de las traducciones de la app y de los README ([#51](https://github.com/MrValtancoli/PlayTrace-App/issues/51))
- 📚 Documentación y tutoriales (etiqueta `documentation`)
- 🧪 Pruebas en distintos dispositivos iOS y Android
- 💡 Sugerencias de funciones de entrenadores y analistas (etiqueta `enhancement`)

**¿Usas un asistente de IA?** No hay problema — consulta la sección [AI-assisted contributions](CONTRIBUTING.md#-ai-assisted-contributions).

## 📄 Licencia

[Licencia MIT](LICENSE) - Libre para usar, modificar y distribuir.

## 👤 Autor

**Roberto Valtancoli**
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue)](https://linkedin.com/in/robertovaltancoli)

---

⭐ ¡Dale una estrella a este repositorio si te resulta útil!
