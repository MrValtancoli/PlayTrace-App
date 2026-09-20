import {
  exportBaseName,
  formatMMSS,
  formatTimeContinuous,
  formatTimeMatch,
  formatTimePeriod,
  formatTimestampAbsolute,
} from '../timeFormat';

describe('formatMMSS', () => {
  it('pads minutes and seconds', () => {
    expect(formatMMSS(0)).toBe('00:00');
    expect(formatMMSS(65)).toBe('01:05');
  });

  it('does not wrap past 99 minutes', () => {
    expect(formatMMSS(6000)).toBe('100:00');
  });

  it('floors fractional seconds and clamps negatives', () => {
    expect(formatMMSS(59.9)).toBe('00:59');
    expect(formatMMSS(-10)).toBe('00:00');
  });
});

describe('formatTimestampAbsolute', () => {
  it('renders DD/MM/YY HH:MM:SS with zero padding', () => {
    expect(formatTimestampAbsolute(new Date(2025, 11, 30, 15, 23, 45))).toBe(
      '30/12/25 15:23:45'
    );
    expect(formatTimestampAbsolute(new Date(2026, 0, 5, 9, 4, 7))).toBe(
      '05/01/26 09:04:07'
    );
  });
});

// The four time references are a public export contract: these cases come
// straight from the PlayTrace export specification and must not drift.
describe('the four time references, per the export spec', () => {
  it('1st half at 23:45', () => {
    expect(formatTimePeriod(1425, 1, 45)).toBe('23:45 1T');
    expect(formatTimeMatch(1425, 1, 45)).toBe('23:45 (1T)');
    expect(formatTimeContinuous(1425, 1, 0)).toBe('23:45');
  });

  it('1st half injury time at 47:00', () => {
    expect(formatTimePeriod(2820, 1, 45)).toBe('45+2 1T');
    expect(formatTimeMatch(2820, 1, 45)).toBe('47:00 (1T)');
    expect(formatTimeContinuous(2820, 1, 0)).toBe('47:00');
  });

  it('2nd half at 23:30 with 3 minutes of 1st-half injury time', () => {
    expect(formatTimePeriod(1410, 2, 45)).toBe('23:30 2T');
    expect(formatTimeMatch(1410, 2, 45)).toBe('68:30 (2T)');
    // 1st half measured at 48:00 -> 2880 s
    expect(formatTimeContinuous(1410, 2, 2880)).toBe('71:30');
  });

  it('2nd half at 35:45 with 3 minutes of 1st-half injury time', () => {
    expect(formatTimePeriod(2145, 2, 45)).toBe('35:45 2T');
    expect(formatTimeMatch(2145, 2, 45)).toBe('80:45 (2T)');
    expect(formatTimeContinuous(2145, 2, 2880)).toBe('83:45');
  });
});

describe('injury-time boundary in formatTimePeriod', () => {
  it('stays on the clock up to and including the regular duration', () => {
    expect(formatTimePeriod(0, 1, 45)).toBe('00:00 1T');
    expect(formatTimePeriod(2700, 1, 45)).toBe('45:00 1T');
  });

  it('switches to +N one second past the regular duration', () => {
    expect(formatTimePeriod(2701, 1, 45)).toBe('45+1 1T');
    expect(formatTimePeriod(2730, 1, 45)).toBe('45+1 1T');
    expect(formatTimePeriod(2760, 1, 45)).toBe('45+1 1T');
    expect(formatTimePeriod(2761, 1, 45)).toBe('45+2 1T');
  });

  it('honours a non-standard half duration', () => {
    expect(formatTimePeriod(1800, 1, 30)).toBe('30:00 1T');
    expect(formatTimePeriod(1860, 1, 30)).toBe('30+1 1T');
    expect(formatTimeMatch(600, 2, 30)).toBe('40:00 (2T)');
  });
});

describe('formatTimeContinuous', () => {
  it('ignores the first-half duration while still in the 1st half', () => {
    expect(formatTimeContinuous(600, 1, 3000)).toBe('10:00');
  });

  it('starts the 2nd half at the measured first-half duration', () => {
    expect(formatTimeContinuous(0, 2, 3000)).toBe('50:00');
  });

  // Regression for #26. A half whistled at 47:47 with a declared +2 used to
  // produce a 47:00 base, putting every second-half event 47 s out of step
  // with the edited video.
  it('uses the measured duration, not half duration plus declared injury', () => {
    const measured = 47 * 60 + 47;
    expect(formatTimeContinuous(0, 2, measured)).toBe('47:47');
    expect(formatTimeContinuous(1410, 2, measured)).toBe('71:17');
  });

  it('clamps a negative or fractional first half', () => {
    expect(formatTimeContinuous(60, 2, -5)).toBe('01:00');
    expect(formatTimeContinuous(0, 2, 2867.9)).toBe('47:47');
  });
});

describe('exportBaseName', () => {
  it('builds PlayTrace_YYYYMMDD_HHMM', () => {
    expect(exportBaseName(new Date(2026, 5, 10, 18, 9))).toBe(
      'PlayTrace_20260610_1809'
    );
  });
});
