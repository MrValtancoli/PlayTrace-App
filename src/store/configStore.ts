import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { ThemeMode } from '../constants/theme';
import { MatchConfig, TagConfig } from '../types';
import { DEFAULT_MATCH_CONFIG, defaultTags } from '../constants/defaultTags';
import { deviceLanguage, resolveLanguage } from '../i18n';

interface ConfigState {
  matchConfig: MatchConfig;
  tags: TagConfig[];
  themeMode: ThemeMode;
  /** The picked UI language, or null to follow the device (#39). */
  language: string | null;
  setMatchConfig: (patch: Partial<MatchConfig>) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setLanguage: (language: string | null) => void;
  updateTag: (id: number, patch: Partial<Omit<TagConfig, 'id'>>) => void;
  resetTags: () => void;
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set, get) => ({
      matchConfig: { ...DEFAULT_MATCH_CONFIG },
      tags: defaultTags(deviceLanguage()),
      themeMode: 'system',
      language: null,

      setThemeMode: (themeMode) => set({ themeMode }),

      // Tag names are user data: changing language never renames them.
      setLanguage: (language) => set({ language }),

      setMatchConfig: (patch) =>
        set((s) => ({ matchConfig: { ...s.matchConfig, ...patch } })),

      updateTag: (id, patch) =>
        set((s) => ({
          tags: s.tags.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        })),

      // The only place a language change reaches the tags: Reset to Defaults
      // restores them in the selected language.
      resetTags: () =>
        set({ tags: defaultTags(resolveLanguage(get().language)) }),
    }),
    {
      name: 'playtrace-config',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
