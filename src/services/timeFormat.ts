import { Period } from '../types';

const pad = (n: number): string => String(n).padStart(2, '0');

/** Seconds -> "MM:SS" (minutes are not capped at 99). */
export function formatMMSS(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
}

/** "DD/MM/YY HH:MM:SS" real-world timestamp. */
export function formatTimestampAbsolute(d: Date): string {
  return (
    `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${pad(d.getFullYear() % 100)} ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  );
}

/**
 * Time within the current period: "23:45 1T".
 * Past the regular duration it switches to injury-time notation "45+2 1T"
 * (the +N matches the spec: 47:00 elapsed in a 45' half -> "45+2").
 */
export function formatTimePeriod(
  elapsedSec: number,
  period: Period,
  halfDurationMin: number
): string {
  const halfSec = halfDurationMin * 60;
  if (elapsedSec <= halfSec) {
    return `${formatMMSS(elapsedSec)} ${period}T`;
  }
  const extraMin = Math.max(1, Math.ceil((elapsedSec - halfSec) / 60));
  return `${halfDurationMin}+${extraMin} ${period}T`;
}

/**
 * Broadcast-style cumulative time: "68:30 (2T)".
 * 2nd half counts from the regular half duration (45:00), excluding
 * 1st-half injury time, per spec.
 */
export function formatTimeMatch(
  elapsedSec: number,
  period: Period,
  halfDurationMin: number
): string {
  const base = period === 2 ? halfDurationMin * 60 : 0;
  return `${formatMMSS(base + elapsedSec)} (${period}T)`;
}

/**
 * Total elapsed time including 1st-half injury time: "71:30".
 * time_continuous = half_duration + injury_1st + time_in_2nd (per spec).
 */
export function formatTimeContinuous(
  elapsedSec: number,
  period: Period,
  halfDurationMin: number,
  injuryTime1Min: number
): string {
  const base = period === 2 ? (halfDurationMin + injuryTime1Min) * 60 : 0;
  return `${formatMMSS(base + elapsedSec)}`;
}

/** "PlayTrace_YYYYMMDD_HHMM" export file base name. */
export function exportBaseName(d: Date): string {
  return (
    `PlayTrace_${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
    `_${pad(d.getHours())}${pad(d.getMinutes())}`
  );
}
