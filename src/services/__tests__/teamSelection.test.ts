import {
  selectionAfterTagging,
  selectionAfterTap,
  teamLabel,
} from '../teamSelection';

describe('selectionAfterTagging', () => {
  it('clears the selection, so the next event is not attributed by accident', () => {
    expect(selectionAfterTagging('home', false)).toBeNull();
    expect(selectionAfterTagging('away', false)).toBeNull();
  });

  it('keeps it when locked, for a spell of one team', () => {
    expect(selectionAfterTagging('home', true)).toBe('home');
  });

  it('has nothing to keep when nothing was selected', () => {
    expect(selectionAfterTagging(null, true)).toBeNull();
    expect(selectionAfterTagging(null, false)).toBeNull();
  });
});

describe('selectionAfterTap', () => {
  it('selects the side that was tapped', () => {
    expect(selectionAfterTap(null, 'home')).toBe('home');
    expect(selectionAfterTap('away', 'home')).toBe('home');
  });

  it('clears when the selected side is tapped again', () => {
    expect(selectionAfterTap('home', 'home')).toBeNull();
  });
});

describe('teamLabel', () => {
  it('uses the names the analyst entered', () => {
    expect(teamLabel('home', 'Milan', 'Inter')).toBe('Milan');
    expect(teamLabel('away', 'Milan', 'Inter')).toBe('Inter');
  });

  it('falls back when a name was left empty', () => {
    expect(teamLabel('home', '', '')).toBe('Home');
    expect(teamLabel('away', '  ', '')).toBe('Away');
  });

  it('trims surrounding spaces', () => {
    expect(teamLabel('home', '  Milan  ', 'Inter')).toBe('Milan');
  });
});
