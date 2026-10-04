import { TeamSide } from '../types';

/**
 * Team attribution while tagging (#32).
 *
 * The selection is optional and one-shot: it clears after each tagged event,
 * so forgetting to choose leaves an event unattributed rather than attributed
 * to the wrong side. A lock keeps the selection, for a long spell of one
 * team's play.
 */

/** The selection to keep once an event has been tagged. */
export function selectionAfterTagging(
  selected: TeamSide | null,
  locked: boolean
): TeamSide | null {
  return locked ? selected : null;
}

/**
 * Tapping a side: the same side again clears it, so a mistake is undone with
 * the button that caused it rather than by hunting for a third control.
 */
export function selectionAfterTap(
  selected: TeamSide | null,
  tapped: TeamSide
): TeamSide | null {
  return selected === tapped ? null : tapped;
}

/** The label for a side, falling back when the analyst left the name empty. */
export function teamLabel(
  side: TeamSide,
  homeTeam: string,
  awayTeam: string
): string {
  const name = side === 'home' ? homeTeam : awayTeam;
  const trimmed = name.trim();
  if (trimmed !== '') return trimmed;
  return side === 'home' ? 'Home' : 'Away';
}
