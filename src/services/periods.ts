import { PeriodRecord } from '../types';
import { formatMMSS, formatTimestampAbsolute } from './timeFormat';

/**
 * The real boundaries of the halves, for the export (#45).
 *
 * A half appears only once it has ended, because only then is its measured
 * duration known. A match exported while a half is still running therefore
 * reports the halves completed so far — consistent with the warning the export
 * screen already shows for a match that has not ended.
 */
export interface PeriodSource {
  /** Epoch ms when the 1st half started, reconstructed if it started late. */
  firstHalfStart: number | null;
  /** Seconds actually played in the 1st half, known once it ends. */
  firstHalfElapsed: number | null;
  secondHalfStart: number | null;
  secondHalfElapsed: number | null;
}

export function buildPeriods(s: PeriodSource): PeriodRecord[] {
  const periods: PeriodRecord[] = [];

  if (s.firstHalfStart !== null && s.firstHalfElapsed !== null) {
    periods.push({
      period: 1,
      start_absolute: formatTimestampAbsolute(new Date(s.firstHalfStart)),
      duration: formatMMSS(s.firstHalfElapsed),
    });
  }

  if (s.secondHalfStart !== null && s.secondHalfElapsed !== null) {
    periods.push({
      period: 2,
      start_absolute: formatTimestampAbsolute(new Date(s.secondHalfStart)),
      duration: formatMMSS(s.secondHalfElapsed),
    });
  }

  return periods;
}

/** Total seconds actually played, across the halves that have ended. */
export function measuredDurationSeconds(s: {
  firstHalfElapsed: number | null;
  secondHalfElapsed: number | null;
}): number {
  return (s.firstHalfElapsed ?? 0) + (s.secondHalfElapsed ?? 0);
}
