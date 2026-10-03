import {
  isStartTimeValid,
  parseStartTime,
  startTimestampFor,
} from '../matchStart';

describe('parseStartTime', () => {
  it('reads MM:SS as seconds', () => {
    expect(parseStartTime({ minutes: '12', seconds: '30' })).toBe(750);
    expect(parseStartTime({ minutes: '0', seconds: '45' })).toBe(45);
    expect(parseStartTime({ minutes: '5', seconds: '0' })).toBe(300);
  });

  it('treats an empty field as zero, so the seconds box can be left alone', () => {
    expect(parseStartTime({ minutes: '5', seconds: '' })).toBe(300);
    expect(parseStartTime({ minutes: '', seconds: '' })).toBe(0);
  });

  it('ignores surrounding spaces', () => {
    expect(parseStartTime({ minutes: ' 7 ', seconds: ' 5 ' })).toBe(425);
  });

  it('rejects anything that is not a plain number', () => {
    expect(parseStartTime({ minutes: '12.5', seconds: '0' })).toBeNull();
    expect(parseStartTime({ minutes: '-3', seconds: '0' })).toBeNull();
    expect(parseStartTime({ minutes: 'ab', seconds: '0' })).toBeNull();
    expect(parseStartTime({ minutes: '12', seconds: 'x' })).toBeNull();
  });

  it('rejects seconds past 59, which would be a typo rather than a time', () => {
    expect(parseStartTime({ minutes: '12', seconds: '60' })).toBeNull();
    expect(parseStartTime({ minutes: '12', seconds: '99' })).toBeNull();
    expect(parseStartTime({ minutes: '12', seconds: '59' })).toBe(779);
  });
});

describe('isStartTimeValid', () => {
  it('accepts zero, which is a normal start', () => {
    expect(isStartTimeValid(0, 45)).toBe(true);
  });

  it('accepts any time inside the regular half', () => {
    expect(isStartTimeValid(750, 45)).toBe(true);
    expect(isStartTimeValid(45 * 60 - 1, 45)).toBe(true);
  });

  it('rejects a half that would already be over, or in injury time', () => {
    expect(isStartTimeValid(45 * 60, 45)).toBe(false);
    expect(isStartTimeValid(50 * 60, 45)).toBe(false);
  });

  it('follows a non-standard half duration', () => {
    expect(isStartTimeValid(29 * 60, 30)).toBe(true);
    expect(isStartTimeValid(31 * 60, 30)).toBe(false);
  });

  it('rejects a kickoff in the future', () => {
    expect(isStartTimeValid(-1, 45)).toBe(false);
  });
});

describe('startTimestampFor', () => {
  const now = 1_800_000_000_000;

  it('moves the start back by the declared time', () => {
    expect(startTimestampFor(750, now)).toBe(now - 750_000);
  });

  it('starts at now when nothing is declared', () => {
    expect(startTimestampFor(0, now)).toBe(now);
  });

  it('never moves the start forward', () => {
    expect(startTimestampFor(-120, now)).toBe(now);
  });

  it('is consistent with how elapsed time is derived', () => {
    // The store computes elapsed as (now - startTimestamp) / 1000.
    const started = startTimestampFor(750, now);
    expect(Math.floor((now - started) / 1000)).toBe(750);
  });
});
