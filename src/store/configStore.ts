import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { ThemeMode } from '../constants/theme';
import { MatchConfig, TagConfig } from '../types';
import { DEFAULT_MATCH_CONFIG, defaultTags } from '../constants/defaultTags';
import { deviceLanguage, resolveLanguage } from '../i18n';
import { ClipWindow, DEFAULT_CLIP_WINDOW, clampWindowSeconds } from '../services/xmlExport';

interface ConfigState {
  matchConfig: MatchConfig;
  tags: TagConfig[];
  themeMode: ThemeMode;
  /** The picked UI language, or null to follow the device (#39). */
  language: string | null;
  /** Lead and lag of the XML clips, remembered between exports (#40). */
  clipWindow: ClipWindow;
  setMatchConfig: (patch: Partial<MatchConfig>) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setLanguage: (language: string | null) => void;
  setClipWindow: (patch: Partial<ClipWindow>) => void;
  updateTag: (id: number, patch: Partial<Omit<TagConfig, 'id'>>) => void;
  resetTags: () => void;
  /** Replaces the whole board, e.g. with an imported tag set (#34). */
  replaceTags: (tags: TagConfig[]) => void;
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set, get) => ({
      matchConfig: { ...DEFAULT_MATCH_CONFIG },
      tags: defaultTags(deviceLanguage()),
      themeMode: 'system',
      language: null,
      clipWindow: { ...DEFAULT_CLIP_WINDOW },

      setThemeMode: (themeMode) => set({ themeMode }),

      // Tag names are user data: changing language never renames them.
      setLanguage: (language) => set({ language }),

      setClipWindow: (patch) =>
        set((s) => {
          const next = { ...s.clipWindow, ...patch };
          return {
            clipWindow: {
              lead: clampWindowSeconds(next.lead),
              lag: clampWindowSeconds(next.lag),
            },
          };
        }),

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

      replaceTags: (tags) => set({ tags: tags.map((t) => ({ ...t })) }),
    }),
    {
      name: 'playtrace-config',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
