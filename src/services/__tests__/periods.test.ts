import { buildPeriods, measuredDurationSeconds } from '../periods';

// 10 June 2026, 15:03:12 and 16:05:40 local time.
const firstStart = new Date(2026, 5, 10, 15, 3, 12).getTime();
const secondStart = new Date(2026, 5, 10, 16, 5, 40).getTime();

const full = {
  firstHalfStart: firstStart,
  firstHalfElapsed: 47 * 60 + 47,
  secondHalfStart: secondStart,
  secondHalfElapsed: 49 * 60 + 12,
};

describe('buildPeriods', () => {
  it('reports both halves once the match has ended', () => {
    expect(buildPeriods(full)).toEqual([
      { period: 1, start_absolute: '10/06/26 15:03:12', duration: '47:47' },
      { period: 2, start_absolute: '10/06/26 16:05:40', duration: '49:12' },
    ]);
  });

  it('reports a half only once its duration is known', () => {
    // First half still running: started, but not yet measured.
    expect(
      buildPeriods({ ...full, firstHalfElapsed: null, secondHalfStart: null, secondHalfElapsed: null })
    ).toEqual([]);
  });

  it('reports the first half while the second is still being played', () => {
    const periods = buildPeriods({ ...full, secondHalfElapsed: null });
    expect(periods).toHaveLength(1);
    expect(periods[0]!.period).toBe(1);
  });

  it('reports nothing before kick-off', () => {
    expect(
      buildPeriods({
        firstHalfStart: null,
        firstHalfElapsed: null,
        secondHalfStart: null,
        secondHalfElapsed: null,
      })
    ).toEqual([]);
  });

  it('keeps the measured duration, not the nominal one', () => {
    // 47:47 played against a declared +2 on a 45' half.
    expect(buildPeriods(full)[0]!.duration).toBe('47:47');
  });
});

describe('measuredDurationSeconds', () => {
  it('adds up the halves that have been played', () => {
    expect(measuredDurationSeconds(full)).toBe(47 * 60 + 47 + 49 * 60 + 12);
  });

  it('counts only what has been measured so far', () => {
    expect(
      measuredDurationSeconds({ firstHalfElapsed: 2820, secondHalfElapsed: null })
    ).toBe(2820);
  });

  it('is zero before anything has been played', () => {
    expect(
      measuredDurationSeconds({ firstHalfElapsed: null, secondHalfElapsed: null })
    ).toBe(0);
  });
});
