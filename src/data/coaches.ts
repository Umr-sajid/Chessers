import { Coach } from '../types/chess';

export const COACHES: Coach[] = [
  {
    id: 'beginner',
    name: 'Coach Leo',
    title: 'Beginner Coach',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    description: 'Explains foundational concepts in simple, encouraging terms.',
    style: 'Friendly & Direct',
    focus: ['Piece values', 'Controlling center', 'King safety', 'Basic captures'],
  },
  {
    id: 'intermediate',
    name: 'Coach Maya',
    title: 'Intermediate Coach',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    description: 'Teaches tactical motifs like forks, pins, and pawn structures.',
    style: 'Instructive & Tactical',
    focus: ['Forks & Pins', 'Opening Principles', 'Rook Files', 'Pawn Chains'],
  },
  {
    id: 'advanced',
    name: 'Coach David',
    title: 'Advanced Coach',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    description: 'Deep dives into positional dynamics, outposts, and king attacks.',
    style: 'Analytical & Precise',
    focus: ['Outposts', 'Prophylaxis', 'Pawn Levers', 'Endgame Conversion'],
  },
  {
    id: 'master',
    name: 'Master Alexei',
    title: 'Master Coach',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    description: 'Focuses on complex calculation, candidate moves, and initiative.',
    style: 'Rigorous & Strategic',
    focus: ['Initiative', 'Calculation Trees', 'Weak Squares', 'Dynamic Counterplay'],
  },
  {
    id: 'grandmaster',
    name: 'GM Magnusson',
    title: 'Grandmaster Coach',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    description: 'Provides top-tier grandmaster insight on subtle imbalances and pawn structures.',
    style: 'Elite Insight',
    focus: ['Deep Imbalances', 'Opposite Bishops', 'Space Advantage', 'Prophylactic Thinking'],
  },
];
