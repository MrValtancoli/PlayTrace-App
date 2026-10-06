import { TagConfig } from '../types';
import appConfig from '../../app.json';
import { LANGUAGES, LanguageCode } from '../i18n';

// Read from app.json so the exported app_version always matches the build.
export const APP_VERSION: string = appConfig.expo.version;

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

// Default 16-tag configuration from the PlayTrace spec. Names come from the
// language's `defaultTags` (#39); colors and order are the same everywhere.
const DEFAULT_TAG_COLORS = [
  '#00FF00',
  '#FFD700',
  '#FF6347',
  '#1E90FF',
  '#FF8C00',
  '#FF0000',
  '#FFFF00',
  '#8B0000',
  '#800080',
  '#808080',
  '#00CED1',
  '#32CD32',
  '#4169E1',
  '#20B2AA',
  '#778899',
  '#FF1493',
];

/** The default tag set with names in the given language. */
export function defaultTags(language: LanguageCode): TagConfig[] {
  const names: Record<string, string> = LANGUAGES[language].defaultTags;
  return DEFAULT_TAG_COLORS.map((color, i) => ({
    id: i + 1,
    name: names[String(i + 1)],
    color,
    enabled: true,
  }));
}

export const DEFAULT_MATCH_CONFIG = {
  competition: '',
  date: new Date().toISOString().slice(0, 10),
  venue: '',
  homeTeam: 'Home',
  awayTeam: 'Away',
  halfDuration: 45,
};
