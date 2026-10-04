import { canUndo, removeEventAt } from '../eventEditing';
import { EventRecord } from '../../types';

const event = (tag_name: string, time: string): EventRecord => ({
  tag_id: 1,
  tag_name,
  team: null,
  timestamp_absolute: '10/06/26 15:00:00',
  time_period: `${time} 1T`,
  time_match: `${time} (1T)`,
  time_continuous: time,
});

const events = [
  event('Goal', '05:00'),
  event('Corner', '12:30'),
  event('Foul', '20:15'),
];

describe('removeEventAt', () => {
  it('removes the event at the index and keeps the order of the rest', () => {
    expect(removeEventAt(events, 1).map((e) => e.tag_name)).toEqual([
      'Goal',
      'Foul',
    ]);
  });

  it('removes the first and the last event', () => {
    expect(removeEventAt(events, 0)).toHaveLength(2);
    expect(removeEventAt(events, 2).map((e) => e.tag_name)).toEqual([
      'Goal',
      'Corner',
    ]);
  });

  it('leaves the remaining events exactly as they were recorded', () => {
    const [first, last] = removeEventAt(events, 1);
    expect(first).toBe(events[0]);
    expect(last).toBe(events[2]);
  });

  it('does not touch the original list', () => {
    removeEventAt(events, 0);
    expect(events).toHaveLength(3);
  });

  it('ignores an index that is out of range or not a whole number', () => {
    expect(removeEventAt(events, -1)).toBe(events);
    expect(removeEventAt(events, 3)).toBe(events);
    expect(removeEventAt(events, 1.5)).toBe(events);
  });

  it('handles an empty list', () => {
    expect(removeEventAt([], 0)).toEqual([]);
  });
});

describe('canUndo', () => {
  const base = { phase: 'first_half' as const, undoAvailable: true, eventCount: 3 };

  it('is available right after tagging, while a half is played', () => {
    expect(canUndo(base)).toBe(true);
    expect(canUndo({ ...base, phase: 'second_half' })).toBe(true);
  });

  it('is one step: off once used, until a new event is tagged', () => {
    expect(canUndo({ ...base, undoAvailable: false })).toBe(false);
  });

  it('is off outside a half in play', () => {
    expect(canUndo({ ...base, phase: 'idle' })).toBe(false);
    expect(canUndo({ ...base, phase: 'half_time' })).toBe(false);
    expect(canUndo({ ...base, phase: 'ended' })).toBe(false);
  });

  it('is off with nothing recorded', () => {
    expect(canUndo({ ...base, eventCount: 0 })).toBe(false);
  });
});
