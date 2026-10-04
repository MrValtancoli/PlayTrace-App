import { suggestedInjuryMinutes } from '../injuryTime';

const min = (m: number, s = 0) => m * 60 + s;

describe('suggestedInjuryMinutes', () => {
  it('suggests nothing when the half ends on time or early', () => {
    expect(suggestedInjuryMinutes(min(45), 45)).toBe(0);
    expect(suggestedInjuryMinutes(min(12), 45)).toBe(0);
    expect(suggestedInjuryMinutes(0, 45)).toBe(0);
  });

  it('suggests nothing for less than a full extra minute', () => {
    expect(suggestedInjuryMinutes(min(45, 59), 45)).toBe(0);
  });

  it('counts each full minute played past the regular duration', () => {
    expect(suggestedInjuryMinutes(min(46), 45)).toBe(1);
    expect(suggestedInjuryMinutes(min(46, 30), 45)).toBe(1);
    expect(suggestedInjuryMinutes(min(50), 45)).toBe(5);
  });

  // The case the rounding was chosen for: +2 on the board, whistle at 47:20.
  it('rounds down, so a half whistled just after the board minute keeps it', () => {
    expect(suggestedInjuryMinutes(min(47, 20), 45)).toBe(2);
  });

  it('can be pushed up by a late press — the analyst corrects it', () => {
    // +2 shown, End pressed at 48:05 instead of at the whistle.
    expect(suggestedInjuryMinutes(min(48, 5), 45)).toBe(3);
  });

  it('follows a non-standard half duration', () => {
    expect(suggestedInjuryMinutes(min(31, 10), 30)).toBe(1);
    expect(suggestedInjuryMinutes(min(31, 10), 45)).toBe(0);
  });

  it('ignores fractions of a second', () => {
    expect(suggestedInjuryMinutes(min(46) - 0.5, 45)).toBe(0);
    expect(suggestedInjuryMinutes(min(46) + 0.9, 45)).toBe(1);
  });

  it('falls back to 0 on values that are not numbers', () => {
    expect(suggestedInjuryMinutes(Number.NaN, 45)).toBe(0);
    expect(suggestedInjuryMinutes(min(50), Number.NaN)).toBe(0);
  });
});
