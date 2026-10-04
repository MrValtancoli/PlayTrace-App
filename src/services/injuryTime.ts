/**
 * Suggesting the declared injury time (#50).
 *
 * At the end of a half the app knows how long the half really lasted, so the
 * injury time prompt can open on the minutes actually played past the regular
 * duration instead of on 0. It is only a suggestion: what the analyst confirms
 * is what is recorded, and since #26 the declared injury time is not used to
 * compute any time reference.
 *
 * Rounded DOWN on purpose. With +2 on the board, play usually stops a few
 * seconds later, around 47:20: rounding down gives 2, the number shown;
 * rounding up would give 3. This is the opposite of `time_period`, which counts
 * the *started* minute of injury time (45+3 at 47:20) — that is a position in
 * time, this is a declared amount.
 */
export function suggestedInjuryMinutes(
  elapsedSec: number,
  halfDurationMin: number
): number {
  if (!Number.isFinite(elapsedSec) || !Number.isFinite(halfDurationMin)) {
    return 0;
  }
  const played = Math.floor(elapsedSec) - halfDurationMin * 60;
  return Math.max(0, Math.floor(played / 60));
}
