/**
 * Suggesting the injury time (#50).
 *
 * At the end of a half the app knows how long the half really lasted, so the
 * injury time prompt opens on the time actually played past the regular
 * duration instead of on 0. What matters is the time played, not the number
 * shown on the fourth official's board.
 *
 * Rounded to the NEAREST minute, which is the closest a whole number of
 * minutes can get to the time played: 2:20 becomes 2, 2:47 becomes 3, and the
 * error is never more than 30 seconds.
 *
 * The approximation is safe: since #26 the injury time is not used to compute
 * any time reference. The second half of `time_continuous`, and so any video
 * cut between the halves, is based on the first half's duration measured to
 * the second, which is also exported in `periods`.
 */
export function suggestedInjuryMinutes(
  elapsedSec: number,
  halfDurationMin: number
): number {
  if (!Number.isFinite(elapsedSec) || !Number.isFinite(halfDurationMin)) {
    return 0;
  }
  const played = Math.floor(elapsedSec) - halfDurationMin * 60;
  return Math.max(0, Math.round(played / 60));
}
