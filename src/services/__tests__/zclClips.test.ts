import Ajv2020 from 'ajv/dist/2020';
import { EventRecord, MatchConfig } from '../../types';
import { buildZclClips, periodSeconds } from '../zclClips';
// The schema and example are pinned copies from
// https://github.com/ZonaCalcioLab/clip-format (CC BY 4.0, Zona Calcio Lab).
import schema from './fixtures/zcl-clips-1.schema.json';
import example from './fixtures/zcl-clips-playtrace-live.json';

const ajv = new Ajv2020({ strict: false });
const validate = ajv.compile(schema);

const matchConfig: MatchConfig = {
  competition: 'Promozione',
  date: '2026-10-11',
  venue: 'Stadio Comunale',
  homeTeam: 'Home FC',
  awayTeam: 'Away FC',
  halfDuration: 45,
};

const event = (
  tag_id: number,
  tag_name: string,
  time_match: string,
  team: EventRecord['team'] = null,
  timestamp_absolute = '11/10/26 15:23:45'
): EventRecord => ({
  tag_id,
  tag_name,
  team,
  timestamp_absolute,
  time_period: '',
  time_match,
  time_continuous: '00:00',
});

const window = { lead: 5, lag: 3 };
const build = (events: EventRecord[], config = matchConfig) =>
  JSON.parse(buildZclClips({ matchConfig: config, events }, window, '1.4.0'));

describe('periodSeconds', () => {
  it('reads the first half as is', () => {
    expect(periodSeconds('23:45 (1T)', 45)).toEqual({ period: 1, t: 1425 });
  });

  it('keeps the seconds in added time', () => {
    // time_period would say "45+2 1T"; time_match keeps 47:35.
    expect(periodSeconds('47:35 (1T)', 45)).toEqual({ period: 1, t: 2855 });
  });

  it('counts the second half from its own kick-off', () => {
    expect(periodSeconds('68:30 (2T)', 45)).toEqual({ period: 2, t: 1410 });
    expect(periodSeconds('92:10 (2T)', 45)).toEqual({ period: 2, t: 2830 });
  });

  it('follows the half duration of the match', () => {
    expect(periodSeconds('40:00 (2T)', 35)).toEqual({ period: 2, t: 300 });
  });

  it('rejects malformed values', () => {
    expect(periodSeconds('45+2 1T', 45)).toBeNull();
    expect(periodSeconds('', 45)).toBeNull();
    expect(periodSeconds('10:00 (2T)', 45)).toBeNull();
  });
});

describe('buildZclClips', () => {
  it('is valid against the published schema', () => {
    const doc = build([
      event(3, 'Shot', '23:45 (1T)', 'home'),
      event(4, 'Corner', '47:00 (1T)', 'away'),
      event(1, 'Goal', '67:30 (2T)'),
    ]);
    expect(validate(doc)).toBe(true);
    expect(validate.errors).toBeNull();
  });

  it('is valid with no events and an empty match', () => {
    const empty = { competition: '', date: '', venue: '', homeTeam: '', awayTeam: '', halfDuration: 45 };
    const doc = build([], empty);
    expect(validate(doc)).toBe(true);
    expect(doc.match).toEqual({ period_duration: 45 });
    expect(doc.clips).toEqual([]);
  });

  it('matches the published PlayTrace example', () => {
    const doc = build([
      event(3, 'Shot', '23:45 (1T)', 'home'),
      event(4, 'Corner', '47:00 (1T)', 'away'),
      event(1, 'Goal', '67:30 (2T)', 'home'),
    ]);
    // The example carries extra only on its first clip and no uid; compare the rest.
    const strip = (clips: Record<string, unknown>[]) =>
      clips.map(({ extra, uid, ...rest }) => rest);
    expect(doc.format).toBe(example.format);
    expect(doc.version).toBe(example.version);
    expect(doc.generator).toEqual(example.generator);
    expect(doc.match).toEqual(example.match);
    expect(doc.sources).toEqual(example.sources);
    expect(strip(doc.clips)).toEqual(strip(example.clips));
    expect(doc.clips[0].extra).toEqual(example.clips[0].extra);
  });

  it('keeps tagging order, the name at tagging time and unattributed events', () => {
    const doc = build([
      event(2, 'Shot on Target', '30:00 (1T)', 'away'),
      event(1, 'Gol', '10:00 (1T)'),
    ]);
    expect(doc.clips.map((c: { label: string }) => c.label)).toEqual(['Shot on Target', 'Gol']);
    expect(doc.clips[1]).not.toHaveProperty('team');
  });

  it('uses the XML clip window, clamped', () => {
    const doc = JSON.parse(
      buildZclClips(
        { matchConfig, events: [event(1, 'Goal', '10:00 (1T)')] },
        { lead: 90, lag: -2 },
        '1.4.0'
      )
    );
    expect(doc.clips[0]).toMatchObject({ pre: 60, post: 0 });
  });

  it('gives every clip a uid that is the same in every export (#64)', () => {
    const events = [
      event(3, 'Shot', '23:45 (1T)', 'home'),
      event(3, 'Shot', '23:45 (1T)', 'home'), // two taps in the same second
      event(1, 'Goal', '67:30 (2T)', 'home', '11/10/26 16:10:02'),
    ];
    const uids = build(events).clips.map((c: { uid: string }) => c.uid);
    expect(new Set(uids).size).toBe(3);
    uids.forEach((u: string) =>
      expect(u).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
    );
    expect(build(events).clips.map((c: { uid: string }) => c.uid)).toEqual(uids);
    // a later tag does not change the uids of the earlier ones
    const more = build([...events, event(4, 'Corner', '80:00 (2T)')]).clips;
    expect(more.slice(0, 3).map((c: { uid: string }) => c.uid)).toEqual(uids);
    expect(validate(build(events))).toBe(true);
  });

  it('skips events whose time cannot be read', () => {
    const doc = build([event(1, 'Goal', 'broken'), event(2, 'Corner', '05:00 (1T)')]);
    expect(doc.clips).toHaveLength(1);
    expect(validate(doc)).toBe(true);
  });
});
