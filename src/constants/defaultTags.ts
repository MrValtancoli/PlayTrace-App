import { TagConfig } from '../types';

export const APP_VERSION = '1.0.0';

export const TAG_COLOR_PALETTE = [
  '#00FF00',
  '#FFD700',
  '#FF6347',
  '#1E90FF',
  '#FF8C00',
  '#FF0000',
  '#FFFF00',
  '#A855F7',
  '#9CA3AF',
  '#00CED1',
  '#32CD32',
  '#FF1493',
];

// Default 16-tag configuration from the PlayTrace spec.
export const DEFAULT_TAGS: TagConfig[] = [
  { id: 1, name: 'Goal', color: '#00FF00', enabled: true },
  { id: 2, name: 'Shot on Target', color: '#FFD700', enabled: true },
  { id: 3, name: 'Shot off Target', color: '#FF6347', enabled: true },
  { id: 4, name: 'Corner', color: '#1E90FF', enabled: true },
  { id: 5, name: 'Free Kick', color: '#FF8C00', enabled: true },
  { id: 6, name: 'Foul', color: '#FF0000', enabled: true },
  { id: 7, name: 'Yellow Card', color: '#FFFF00', enabled: true },
  { id: 8, name: 'Red Card', color: '#8B0000', enabled: true },
  { id: 9, name: 'Offside', color: '#800080', enabled: true },
  { id: 10, name: 'Throw-in', color: '#808080', enabled: true },
  { id: 11, name: 'Substitution', color: '#00CED1', enabled: true },
  { id: 12, name: 'Pass Completed', color: '#32CD32', enabled: true },
  { id: 13, name: 'Tackle Won', color: '#4169E1', enabled: true },
  { id: 14, name: 'Interception', color: '#20B2AA', enabled: true },
  { id: 15, name: 'Clearance', color: '#778899', enabled: true },
  { id: 16, name: 'Save', color: '#FF1493', enabled: true },
];

export const DEFAULT_MATCH_CONFIG = {
  competition: '',
  date: new Date().toISOString().slice(0, 10),
  venue: '',
  homeTeam: 'Home',
  awayTeam: 'Away',
  halfDuration: 45,
};
