# Contributing to Chessers

Thanks for your interest in contributing! Every contribution helps make Chessers better.

## Ways to Contribute

- **Bug Reports** — Found something broken? [Open an issue](https://github.com/Umr-sajid/Chessers/issues/new?template=bug_report.md)
- **Feature Requests** — Have an idea? [Request a feature](https://github.com/Umr-sajid/Chessers/issues/new?template=feature_request.md)
- **Puzzles** — Add tactical puzzles with FEN, solution, and description
- **Bot Personalities** — Create new AI opponents with unique styles
- **Openings** — Add openings to the database
- **Code** — Fix bugs or implement new features
- **Documentation** — Improve the README or add guides

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Chessers.git
   cd Chessers
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
5. Make your changes
6. Test locally:
   ```bash
   npm run dev
   npm run lint
   ```
7. Commit and push:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   git push origin feature/your-feature-name
   ```
8. Open a Pull Request

## Development Guidelines

### Code Style
- Use TypeScript for all new files
- Follow existing component patterns (functional components with hooks)
- Use Tailwind CSS for styling — no inline styles or CSS files
- Keep components small and focused

### Adding a Bot

Add a new entry to `src/data/bots.ts`:

```typescript
{
  id: 'bot_yourname',
  name: 'YourName',
  title: 'Title',
  rating: 1200,
  avatar: 'https://...',
  description: 'A short description.',
  style: 'balanced', // aggressive | positional | tactical | defensive | endgame | balanced
  skillLevel: 5,      // Stockfish skill 0-20
  depthLimit: 5,
  maxRandomness: 50,
  quote: 'A fun quote.',
  countryFlag: '🇺🇸',
  tacticalStrength: 50,
  positionalStrength: 50,
  endgameStrength: 50,
}
```

### Adding a Puzzle

Add to `src/data/puzzles.ts`:

```typescript
{
  id: 'p_unique_id',
  title: 'Puzzle Title',
  fen: 'FEN_STRING',
  turn: 'w',            // or 'b'
  solution: ['Move1', 'Move2', ...],  // SAN notation
  rating: 1200,
  category: 'fork',     // mate_in_1 | mate_in_2 | mate_in_3 | fork | pin | skewer | ...
  difficulty: 'medium', // easy | medium | hard | master | grandmaster
  description: 'What is happening in this position.',
  hint: 'A helpful hint.',
}
```

### Adding an Opening

Add to `src/data/openings.ts`:

```typescript
{
  eco: 'C50',
  name: 'Italian Game',
  moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'],
  fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
  description: 'A classic opening...',
  keyIdeas: ['Control center', 'Develop quickly'],
  whiteWinPct: 38.5,
  drawPct: 29.2,
  blackWinPct: 32.3,
  category: "King's Pawn",
}
```

## Commit Convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Usage |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation changes |
| `style:` | Code style (formatting, no logic change) |
| `refactor:` | Code restructuring (no feature/fix) |
| `puzzle:` | Adding puzzles |
| `bot:` | Adding bot personalities |
| `opening:` | Adding openings |

## Code of Conduct

Be respectful and constructive. We're all here to make chess better.

## Questions?

Open a [discussion](https://github.com/Umr-sajid/Chessers/discussions) if you have questions about contributing.
