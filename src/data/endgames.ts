import { EndgameDrill } from '../types/chess';

export const ENDGAME_DRILLS: EndgameDrill[] = [
  {
    id: 'eg_lucena',
    title: 'The Lucena Position',
    category: 'Rook Endgames',
    fen: '1R6/3k4/8/3P4/8/8/3K4/7r w - - 0 1',
    description: 'The fundamental winning technique in Rook & Pawn endgames. White must build a bridge with the rook on the 4th rank.',
    goal: 'Promote the d-pawn by cutting off Black\'s king and building a bridge on the 4th rank.',
    keyPrinciples: [
      'Cut off the enemy king on the adjacent file',
      'Lift the rook to the 4th rank (Building a bridge)',
      'Escort the pawn out of the promotion square with check defense',
    ],
  },
  {
    id: 'eg_philidor',
    title: 'The Philidor Position',
    category: 'Rook Endgames',
    fen: '8/8/3k4/3P4/8/8/4R3/3K1r2 b - - 0 1',
    description: 'The standard drawing defense in Rook & Pawn endgames. Keep your rook on the 3rd rank until the pawn advances.',
    goal: 'Draw as Black by keeping the rook on the 6th rank (or 3rd rank for Black) to prevent the enemy king from advancing.',
    keyPrinciples: [
      'Keep rook on 6th rank blocking enemy king advance',
      'When the pawn reaches 6th rank, drop rook to 1st rank for checking from behind',
      'Endless checks behind the pawn',
    ],
  },
  {
    id: 'eg_kp_opposition',
    title: 'King & Pawn Opposition',
    category: 'King & Pawn',
    fen: '8/8/4k3/8/4P3/4K3/8/8 w - - 0 1',
    description: 'Master the concept of King Opposition to force pawn promotion or block the enemy king.',
    goal: 'White to move and take opposition to promote the e-pawn.',
    keyPrinciples: [
      'Place your king directly in front of your pawn',
      'Gain the opposition (one square apart with opponent to move)',
      'Outflank the enemy king when they step aside',
    ],
  },
  {
    id: 'eg_opposite_bishops',
    title: 'Opposite-Colored Bishops Fortress',
    category: 'Bishop Endgames',
    fen: '8/8/3b4/8/3B4/4P3/4K1k1/8 w - - 0 1',
    description: 'Opposite-colored bishops tend towards drawish fortresses even when down material.',
    goal: 'Defend the light squares as White to hold a rock-solid draw.',
    keyPrinciples: [
      'Place pawns on the opposite color of your bishop',
      'Block passed pawns on light squares',
      'Create an impenetrable barrier',
    ],
  },
  {
    id: 'eg_queen_vs_pawn',
    title: 'Queen vs Pawn on 7th Rank',
    category: 'Queen Endgames',
    fen: '8/8/8/8/8/3K4/3p4/3Q3k w - - 0 1',
    description: 'How to win with a Queen against a pawn on the 7th rank near promotion.',
    goal: 'Force Black\'s king in front of their pawn with checks, then bring your king closer.',
    keyPrinciples: [
      'Deliver checks forcing the enemy king onto the promotion square',
      'Use the free turn to step your king one square closer',
      'Repeat until mate or pawn capture',
    ],
  },
  {
    id: 'eg_mate_rk',
    title: 'Rook & King Checkmate',
    category: 'Basic Mates',
    fen: '8/8/8/4k3/8/8/8/R3K3 w - - 0 1',
    description: 'The fundamental box technique to corner the enemy king on the edge of the board.',
    goal: 'Corner Black\'s king onto the h-file or 8th rank and deliver checkmate.',
    keyPrinciples: [
      'Create a shrinking box with your rook',
      'Use your king to support the rook and deny escape squares',
      'Deliver back-rank checkmate once trapped',
    ],
  }
];
