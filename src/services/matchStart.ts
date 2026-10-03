/**
 * Starting a half late (#14).
 *
 * The analyst can declare the match time the half is already at — "we are at
 * 12:30" — and the half starts from there. The elapsed time is still derived
 * from a persisted wall-clock timestamp, so crash recovery is unaffected: the
 * start timestamp is simply moved back.
 *
 * Nothing here reaches the export. The declared time only shifts the relative
 * references; `timestamp_absolute` stays the real time of each tap.
 */

export interface StartTimeInput {
  minutes: string;
  seconds: string;
}

/**
 * Parse the MM:SS the analyst typed into seconds.
 * Returns null when the input is not a plain, in-range time.
 */
export function parseStartTime({ minutes, seconds }: StartTimeInput): number | null {
  const m = minutes.trim();
  const s = seconds.trim();
  // An empty field reads as zero, so "12" and an untouched seconds box work.
  if (!/^\d*$/.test(m) || !/^\d*$/.test(s)) return null;
  const mins = m === '' ? 0 : Number(m);
  const secs = s === '' ? 0 : Number(s);
  if (!Number.isFinite(mins) || !Number.isFinite(secs)) return null;
  if (secs > 59) return null;
  return mins * 60 + secs;
}

/**
 * A half cannot already be past its regular duration when it starts: that
 * would mean the analyst is declaring injury time before kick-off. Zero is
 * valid and means starting normally.
 */
export function isStartTimeValid(
  elapsedSec: number,
  halfDurationMin: number
): boolean {
  return (
    Number.isFinite(elapsedSec) &&
    elapsedSec >= 0 &&
    elapsedSec < halfDurationMin * 60
  );
}

/**
 * The epoch milliseconds to record as the half's start, given how far along it
 * already is. `now` is injected so this stays testable.
 */
export function startTimestampFor(elapsedSec: number, now: number): number {
  return now - Math.max(0, Math.floor(elapsedSec)) * 1000;
}
