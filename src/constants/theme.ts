import { useColorScheme } from 'react-native';
import { useConfigStore } from '../store/configStore';

/**
 * Every colour the UI is allowed to use. Screens must never hardcode a colour:
 * they read a Palette through useTheme() so light and dark stay in sync.
 *
 * Tag colours are NOT part of the palette — they are user data (TagConfig.color)
 * and stay identical in both themes, so an exported match always means the same
 * thing regardless of how the phone was configured.
 */
export interface Palette {
  /** Screen background. */
  bg: string;
  /** Raised surface: cards, rows, inputs. */
  card: string;
  /** Second-level surface: secondary buttons. */
  cardAlt: string;
  border: string;
  /** Brand green (#00BF63, taken from the app icon). Primary actions. */
  accent: string;
  /** Darker green, for switch tracks, borders and pressed states. */
  accentDark: string;
  /** Text drawn on top of `accent`. */
  onAccent: string;
  /** Destructive actions only: end half, end match, reset. */
  danger: string;
  /** Injury time and partial-export warnings. */
  warning: string;
  text: string;
  textMuted: string;
  /** Text on top of a user-chosen tag colour. Tag colours are bright in both
   *  themes, so this is dark in both. */
  textOnTag: string;
  /** Modal scrim. */
  overlay: string;
  /** Hairline ring around a tag colour dot, so light dots stay visible. */
  dotRing: string;
}

export const DARK: Palette = {
  bg: '#0E1612',
  card: '#1A241E',
  cardAlt: '#22302A',
  border: '#2E3D35',
  accent: '#00BF63',
  accentDark: '#00913F',
  onAccent: '#0B0F0D',
  danger: '#EF4444',
  warning: '#F59E0B',
  text: '#F1F5F2',
  textMuted: '#8FA396',
  textOnTag: '#0B0F0D',
  overlay: 'rgba(0,0,0,0.7)',
  dotRing: 'rgba(255,255,255,0.25)',
};

export const LIGHT: Palette = {
  bg: '#F2F8F4',
  card: '#FFFFFF',
  cardAlt: '#E3EDE6',
  border: '#CBDBD1',
  // Same brand green in both themes. Its luminance carries dark text at
  // ~8.6:1, so onAccent stays dark here too rather than flipping to white.
  accent: '#00BF63',
  accentDark: '#00913F',
  onAccent: '#0B0F0D',
  danger: '#C62828',
  warning: '#9A5B00',
  text: '#10201A',
  textMuted: '#5A6F63',
  textOnTag: '#0B0F0D',
  overlay: 'rgba(0,0,0,0.45)',
  dotRing: 'rgba(0,0,0,0.25)',
};

export type ThemeMode = 'system' | 'light' | 'dark';

/** The palette in force, honouring the user's preference then the OS setting. */
export function useTheme(): Palette {
  const mode = useConfigStore((s) => s.themeMode);
  const system = useColorScheme();
  if (mode === 'light') return LIGHT;
  if (mode === 'dark') return DARK;
  return system === 'light' ? LIGHT : DARK;
}
