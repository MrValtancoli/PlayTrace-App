import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { EventRecord, MatchPhase, Period, TagConfig } from '../types';
import {
  formatTimeContinuous,
  formatTimeMatch,
  formatTimePeriod,
  formatTimestampAbsolute,
} from '../services/timeFormat';
import { useConfigStore } from './configStore';

interface MatchState {
  phase: MatchPhase;
  period: Period;
  isRunning: boolean;
  /** Epoch ms when the current period started. */
  startTimestamp: number | null;
  /** Total paused ms accumulated in the current period. */
  pausedAccum: number;
  /** Epoch ms when the current pause began (null if not paused). */
  pauseStartedAt: number | null;
  /** Seconds elapsed in the current period (updated by tick). */
  elapsed: number;
  injuryTime1: number; // minutes, declared at end of 1st half
  injuryTime2: number; // minutes, declared at end of match
  /**
   * Seconds actually played in the 1st half, captured when it ends. This is
   * the base for time_continuous in the 2nd half; the declared injury minutes
   * are reported in the export but never used to compute time. Null until the
   * 1st half ends, and on matches persisted before this field existed.
   */
  firstHalfElapsed: number | null;
  events: EventRecord[];

  startFirstHalf: () => void;
  startSecondHalf: () => void;
  pause: () => void;
  resume: () => void;
  endFirstHalf: (injuryMinutes: number) => void;
  endMatch: (injuryMinutes: number) => void;
  resetMatch: () => void;
  tick: () => void;
  logEvent: (tag: TagConfig) => void;
}

/** Elapsed seconds derived from wall-clock timestamps, robust to app restarts. */
function computeElapsed(s: {
  startTimestamp: number | null;
  pausedAccum: number;
  pauseStartedAt: number | null;
}): number {
  if (s.startTimestamp === null) return 0;
  const now = Date.now();
  const pausing = s.pauseStartedAt !== null ? now - s.pauseStartedAt : 0;
  return Math.max(
    0,
    Math.floor((now - s.startTimestamp - s.pausedAccum - pausing) / 1000)
  );
}

/**
 * The 2nd-half base for time_continuous. Falls back to the old nominal figure
 * for matches that were already in progress when firstHalfElapsed was added,
 * so an upgrade mid-match does not produce a wild jump.
 */
export function resolveFirstHalfSeconds(
  s: { firstHalfElapsed: number | null; injuryTime1: number },
  halfDurationMin: number
): number {
  return s.firstHalfElapsed ?? (halfDurationMin + s.injuryTime1) * 60;
}

export const useMatchStore = create<MatchState>()(
  persist(
    (set, get) => ({
      phase: 'idle',
      period: 1,
      isRunning: false,
      startTimestamp: null,
      pausedAccum: 0,
      pauseStartedAt: null,
      elapsed: 0,
      injuryTime1: 0,
      injuryTime2: 0,
      firstHalfElapsed: null,
      events: [],

      startFirstHalf: () =>
        set({
          phase: 'first_half',
          period: 1,
          isRunning: true,
          startTimestamp: Date.now(),
          pausedAccum: 0,
          pauseStartedAt: null,
          elapsed: 0,
          injuryTime1: 0,
          injuryTime2: 0,
          firstHalfElapsed: null,
          events: [],
        }),

      startSecondHalf: () =>
        set({
          phase: 'second_half',
          period: 2,
          isRunning: true,
          startTimestamp: Date.now(),
          pausedAccum: 0,
          pauseStartedAt: null,
          elapsed: 0,
        }),

      pause: () => {
        const s = get();
        if (!s.isRunning) return;
        set({ isRunning: false, pauseStartedAt: Date.now() });
      },

      resume: () => {
        const s = get();
        if (s.isRunning || s.pauseStartedAt === null) return;
        set({
          isRunning: true,
          pausedAccum: s.pausedAccum + (Date.now() - s.pauseStartedAt),
          pauseStartedAt: null,
        });
      },

      endFirstHalf: (injuryMinutes) =>
        set({
          phase: 'half_time',
          isRunning: false,
          pauseStartedAt: null,
          injuryTime1: Math.max(0, injuryMinutes),
          // Captured before the clock is reset for the 2nd half.
          firstHalfElapsed: computeElapsed(get()),
        }),

      endMatch: (injuryMinutes) =>
        set({
          phase: 'ended',
          isRunning: false,
          pauseStartedAt: null,
          injuryTime2: Math.max(0, injuryMinutes),
        }),

      resetMatch: () =>
        set({
          phase: 'idle',
          period: 1,
          isRunning: false,
          startTimestamp: null,
          pausedAccum: 0,
          pauseStartedAt: null,
          elapsed: 0,
          injuryTime1: 0,
          injuryTime2: 0,
          firstHalfElapsed: null,
          events: [],
        }),

      tick: () => set({ elapsed: computeElapsed(get()) }),

      logEvent: (tag) => {
        const s = get();
        if (s.phase !== 'first_half' && s.phase !== 'second_half') return;

        const halfDuration =
          useConfigStore.getState().matchConfig.halfDuration;
        const elapsedSec = computeElapsed(s);
        const firstHalfSec = resolveFirstHalfSeconds(s, halfDuration);

        const event: EventRecord = {
          tag_id: tag.id,
          tag_name: tag.name,
          timestamp_absolute: formatTimestampAbsolute(new Date()),
          time_period: formatTimePeriod(elapsedSec, s.period, halfDuration),
          time_match: formatTimeMatch(elapsedSec, s.period, halfDuration),
          time_continuous: formatTimeContinuous(
            elapsedSec,
            s.period,
            firstHalfSec
          ),
        };

        set({ events: [...s.events, event] });
      },
    }),
    {
      name: 'playtrace-match',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
