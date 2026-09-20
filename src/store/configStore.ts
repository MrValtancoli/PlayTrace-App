import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { ThemeMode } from '../constants/theme';
import { MatchConfig, TagConfig } from '../types';
import { DEFAULT_MATCH_CONFIG, DEFAULT_TAGS } from '../constants/defaultTags';

interface ConfigState {
  matchConfig: MatchConfig;
  tags: TagConfig[];
  themeMode: ThemeMode;
  setMatchConfig: (patch: Partial<MatchConfig>) => void;
  setThemeMode: (mode: ThemeMode) => void;
  updateTag: (id: number, patch: Partial<Omit<TagConfig, 'id'>>) => void;
  resetTags: () => void;
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      matchConfig: { ...DEFAULT_MATCH_CONFIG },
      tags: DEFAULT_TAGS.map((t) => ({ ...t })),
      themeMode: 'system',

      setThemeMode: (themeMode) => set({ themeMode }),

      setMatchConfig: (patch) =>
        set((s) => ({ matchConfig: { ...s.matchConfig, ...patch } })),

      updateTag: (id, patch) =>
        set((s) => ({
          tags: s.tags.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        })),

      resetTags: () => set({ tags: DEFAULT_TAGS.map((t) => ({ ...t })) }),
    }),
    {
      name: 'playtrace-config',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
