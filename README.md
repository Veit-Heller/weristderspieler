# Wer ist der Spieler? ⚽️

Ein interaktives Fußball-Quiz, bei dem Spieler anhand ihrer Vereinsstationen erraten werden müssen.

## 🚀 Schnellstart

### Voraussetzungen
- Node.js (Version 18 oder höher)
- npm oder yarn

### Installation

1. Dependencies installieren:
```bash
npm install
```

2. Entwicklungsserver starten:
```bash
npm run dev
```

3. Im Browser öffnen:
Die App läuft standardmäßig auf `http://localhost:5173`

### Build für Produktion

```bash
npm run build
```

Die gebauten Dateien befinden sich im `dist` Ordner.

## 🚀 Deployment auf Vercel

### Option 1: Via Vercel CLI

1. Vercel CLI installieren:
```bash
npm i -g vercel
```

2. Projekt deployen:
```bash
vercel
```

3. Für Produktion:
```bash
vercel --prod
```

### Option 2: Via GitHub (empfohlen)

1. Projekt auf GitHub hochladen
2. Auf [vercel.com](https://vercel.com) einloggen
3. "Add New Project" klicken
4. GitHub-Repository auswählen
5. Vercel erkennt automatisch das Vite-Projekt und konfiguriert alles
6. "Deploy" klicken

Die `vercel.json` Datei ist bereits konfiguriert und sorgt für:
- Automatisches Build mit `npm run build`
- Korrektes Routing für die Single Page Application
- Optimale Performance-Einstellungen

## 🛠️ Technologien

- **React 18** - UI-Framework
- **Vite** - Build-Tool und Dev-Server
- **Framer Motion** - Animationen
- **Tailwind CSS** - Styling

## 📁 Projektstruktur

```
├── src/
│   ├── components/
│   │   └── FootballQuiz.jsx    # Hauptkomponente
│   ├── App.jsx                  # App-Wrapper
│   ├── main.jsx                 # React-Einstiegspunkt
│   └── index.css                # Tailwind CSS
├── index.html                   # HTML-Einstiegsdatei
├── vite.config.js               # Vite-Konfiguration
├── tailwind.config.js           # Tailwind-Konfiguration
└── package.json                 # Dependencies
```

## 🎮 Spielablauf

1. Es werden die Vereinsstationen eines Spielers angezeigt
2. Der Spieler muss aus 4 Optionen den richtigen Namen wählen
3. Nach jeder Antwort wird das Ergebnis angezeigt (grün = richtig, rot = falsch)
4. Am Ende wird der Gesamtscore angezeigt

## 🔧 Anpassungen

Die Spielerdaten können in `src/components/FootballQuiz.jsx` im Array `PLAYERS_DATA` angepasst werden.

