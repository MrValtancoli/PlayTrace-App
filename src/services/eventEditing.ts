import { EventRecord, MatchPhase } from '../types';

/**
 * Removing recorded events (#41).
 *
 * Two ways in, for two moments: Undo during play removes the event just
 * tagged, with no confirmation, so it is as quick as the mis-tap it repairs;
 * deleting from the event list fixes an older mistake, behind a confirmation.
 *
 * Removal never touches the timer or the remaining events: their four time
 * references stay exactly as they were recorded. Nothing records that an
 * event was removed, so the export contract does not change.
 */

/** The events with the one at `index` removed; unchanged if out of range. */
export function removeEventAt(
  events: EventRecord[],
  index: number
): EventRecord[] {
  if (!Number.isInteger(index) || index < 0 || index >= events.length) {
    return events;
  }
  return [...events.slice(0, index), ...events.slice(index + 1)];
}

/**
 * Undo is one step, and only while a half is being played: once used it stays
 * off until a new event is tagged, so a nervous double tap cannot remove two
 * events in a row.
 */
export function canUndo(s: {
  phase: MatchPhase;
  undoAvailable: boolean;
  eventCount: number;
}): boolean {
  const inPlay = s.phase === 'first_half' || s.phase === 'second_half';
  return inPlay && s.undoAvailable && s.eventCount > 0;
}
