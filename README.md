<div align="center">

# ♟️ Chessers

**A full-featured offline chess platform with AI coaching, Stockfish engine, puzzles, openings database, and endgame training.**

[![License: MIT](https://img.shields.io/badge/License-MIT-00b894.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Issues](https://img.shields.io/github/issues/Umr-sajid/Chessers)](https://github.com/Umr-sajid/Chessers/issues)
[![Stars](https://img.shields.io/github/stars/Umr-sajid/Chessers)](https://github.com/Umr-sajid/Chessers/stargazers)

[Features](#-features) | [Quick Start](#-quick-start) | [Tech Stack](#-tech-stack) | [Project Structure](#-project-structure) | [Contributing](#-contributing) | [License](#-license)

---

</div>

## About

Chessers is a 100% offline chess application built with React and TypeScript. It runs a local Stockfish-based engine in your browser with no server required for gameplay. Whether you're a beginner learning the basics or an advanced player studying endgames, Chessers has something for you.

## Features

### 🎮 Play
- **vs Computer** — Battle AI bots with unique personalities, playing styles, and skill levels (400 to 2500+ rating)
- **vs Human** — Play locally with a friend on the same device
- **Computer vs Computer** — Watch bots duke it out automatically

### 🧩 Puzzles
- Curated tactical puzzles across categories: Mate in 1/2/3, Forks, Pins, Skewers, Discovered Attacks, Sacrifices, and more
- Difficulty ranges from Easy to Grandmaster
- Hint system and solution tracking

### 🔍 Analysis
- Full game review with move classifications: Brilliant, Great, Best, Inaccuracy, Mistake, Blunder
- Centipawn loss tracking and accuracy scores
- Evaluation bar with live engine assessment
- AI-powered coaching explanations via Gemini

### 📖 Openings
- Database of chess openings with ECO codes
- Win/draw/loss statistics for each opening
- Key ideas and strategic explanations
- Practice mode to train specific openings

### 🛡️ Endgames
- Structured endgame training drills
- Categories: King & Pawn, Rook, Queen, Bishop, Knight, Basic Mates
- Key principles and target move counts

### ✏️ Board Editor
- Set up any position on the board
- Edit FEN strings directly
- Analyze custom positions with the engine

### 🎨 Customization
- 6 board themes (Green, Wood, Slate, Cyber, Ice, Charcoal)
- 5 piece styles (Neo, Alpha, Glass, Wood, Minimal)
- Dark / Light / Minimal themes
- Sound effects with volume control
- Configurable engine depth and threads

### 📊 Profile & Stats
- Track games played, wins, losses, draws
- Rating system (Bullet, Blitz, Rapid, Puzzle)
- Puzzle streak tracking
- Achievement system
- Game history with PGN

## Quick Start

**Prerequisites:** [Node.js](https://nodejs.org/) (v18+)

```bash
# Clone the repository
git clone https://github.com/Umr-sajid/Chessers.git
cd Chessers

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Optional: Gemini AI Coaching

To enable AI-powered move explanations and coaching, create a `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Get a free API key from [Google AI Studio](https://ai.google.dev/).

> The core chess engine, puzzles, analysis, and gameplay work fully offline without an API key.

## Tech Stack

| Technology | Purpose |
|---|---|
| [React 19](https://react.dev/) | UI framework |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Vite](https://vitejs.dev/) | Build tool & dev server |
| [Tailwind CSS v4](https://tailwindcss.com/) | Styling |
| [chess.js](https://github.com/jhlywa/chess.js) | Chess logic & move validation |
| [Stockfish](https://stockfishchess.org/) | Engine evaluation (Web Worker) |
| [Gemini AI](https://ai.google.dev/) | AI coaching (optional) |
| [Lucide](https://lucide.dev/) | Icons |
| [Framer Motion](https://www.framer.com/motion/) | Animations |

## Project Structure

```
Chessers/
├── public/
├── src/
│   ├── assets/              # Static assets
│   ├── audio/               # Sound effects
│   ├── components/
│   │   ├── analysis/        # Game analysis page
│   │   ├── board/           # Chess board, pieces, eval bar
│   │   ├── coaching/        # AI coach panel
│   │   ├── editor/          # Position editor
│   │   ├── endgames/        # Endgame training
│   │   ├── game/            # Play page, clock, review
│   │   ├── layout/          # Navigation sidebar
│   │   ├── openings/        # Opening explorer
│   │   ├── profile/         # Player profile & stats
│   │   ├── puzzles/         # Tactical puzzles
│   │   ├── settings/        # App settings
│   │   └── testing/         # Self-diagnostics
│   ├── data/                # Bots, puzzles, openings, endgames
│   ├── engine/              # Stockfish wrapper, evaluation, coaching
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Storage helpers
│   ├── App.tsx              # Root component
│   └── main.tsx             # Entry point
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Type-check with TypeScript |

## Contributing

Contributions are welcome! Whether it's bug fixes, new features, puzzles, bot personalities, or documentation — everything helps.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a PR.

## License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

**Made with ♟️ by [Umr-sajid](https://github.com/Umr-sajid)**

</div>
