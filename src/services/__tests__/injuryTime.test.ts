import { suggestedInjuryMinutes } from '../injuryTime';

const min = (m: number, s = 0) => m * 60 + s;

describe('suggestedInjuryMinutes', () => {
  it('suggests nothing when the half ends on time or early', () => {
    expect(suggestedInjuryMinutes(min(45), 45)).toBe(0);
    expect(suggestedInjuryMinutes(min(12), 45)).toBe(0);
    expect(suggestedInjuryMinutes(0, 45)).toBe(0);
  });

  it('rounds the time played to the nearest minute', () => {
    expect(suggestedInjuryMinutes(min(47, 20), 45)).toBe(2); // 2:20
    expect(suggestedInjuryMinutes(min(47, 47), 45)).toBe(3); // 2:47
    expect(suggestedInjuryMinutes(min(50), 45)).toBe(5);
  });

  it('switches at the half minute', () => {
    expect(suggestedInjuryMinutes(min(45, 29), 45)).toBe(0);
    expect(suggestedInjuryMinutes(min(45, 30), 45)).toBe(1);
    expect(suggestedInjuryMinutes(min(46, 29), 45)).toBe(1);
    expect(suggestedInjuryMinutes(min(46, 30), 45)).toBe(2);
  });

  it('is never more than 30 seconds away from the time played', () => {
    for (let extra = 0; extra <= 600; extra++) {
      const suggested = suggestedInjuryMinutes(min(45) + extra, 45);
      expect(Math.abs(suggested * 60 - extra)).toBeLessThanOrEqual(30);
    }
  });

  it('follows a non-standard half duration', () => {
    expect(suggestedInjuryMinutes(min(31, 10), 30)).toBe(1);
    expect(suggestedInjuryMinutes(min(31, 10), 45)).toBe(0);
  });

  it('ignores fractions of a second', () => {
    // 45:29.9 is still 29 seconds played.
    expect(suggestedInjuryMinutes(min(45, 29) + 0.9, 45)).toBe(0);
  });

  it('falls back to 0 on values that are not numbers', () => {
    expect(suggestedInjuryMinutes(Number.NaN, 45)).toBe(0);
    expect(suggestedInjuryMinutes(min(50), Number.NaN)).toBe(0);
  });
});
