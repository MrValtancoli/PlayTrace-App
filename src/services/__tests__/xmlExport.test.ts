import { EventRecord, MatchConfig, TagConfig } from '../../types';
import {
  buildXML,
  clampWindowSeconds,
  DEFAULT_CLIP_WINDOW,
  parseMMSS,
} from '../xmlExport';

const matchConfig: MatchConfig = {
  competition: 'Serie A',
  date: '2026-06-10',
  venue: 'San Siro',
  homeTeam: 'Milan',
  awayTeam: 'Inter & Co',
  halfDuration: 45,
};

const tags: TagConfig[] = [
  { id: 1, name: 'Goal', color: '#00FF00', enabled: true },
  { id: 2, name: 'Corner', color: '#1E90FF', enabled: true },
  { id: 3, name: 'Foul', color: '#FF0000', enabled: false },
];

const event = (
  tag_id: number,
  tag_name: string,
  time_continuous: string,
  team: EventRecord['team'] = null
): EventRecord => ({
  tag_id,
  tag_name,
  team,
  timestamp_absolute: '10/06/26 15:23:45',
  time_period: '00:00 1T',
  time_match: '00:00 (1T)',
  time_continuous,
});

const xml = (events: EventRecord[], window = DEFAULT_CLIP_WINDOW) =>
  buildXML({ matchConfig, tags, events }, window);

/** Each <instance> as { id, start, end, code, team }. */
function instances(doc: string) {
  return [...doc.matchAll(/<instance>([\s\S]*?)<\/instance>/g)].map(([, body]) => ({
    id: Number(/<ID>(.*?)<\/ID>/.exec(body)![1]),
    start: Number(/<start>(.*?)<\/start>/.exec(body)![1]),
    end: Number(/<end>(.*?)<\/end>/.exec(body)![1]),
    code: /<code>(.*?)<\/code>/.exec(body)![1],
    team: /<text>(.*?)<\/text>/.exec(body)?.[1] ?? null,
  }));
}

/** Each <row> as { code, rgb }. */
function rows(doc: string) {
  return [...doc.matchAll(/<row>([\s\S]*?)<\/row>/g)].map(([, body]) => ({
    code: /<code>(.*?)<\/code>/.exec(body)![1],
    rgb: ['R', 'G', 'B'].map((c) => Number(new RegExp(`<${c}>(\\d+)</${c}>`).exec(body)![1])),
  }));
}

describe('parseMMSS', () => {
  it('reads minutes beyond 99', () => {
    expect(parseMMSS('71:30')).toBe(4290);
    expect(parseMMSS('105:05')).toBe(6305);
  });

  it('rejects malformed values', () => {
    expect(parseMMSS('71:60')).toBeNull();
    expect(parseMMSS('45+2')).toBeNull();
    expect(parseMMSS('')).toBeNull();
  });
});

describe('clampWindowSeconds', () => {
  it('keeps whole seconds between 0 and 60', () => {
    expect(clampWindowSeconds(-3)).toBe(0);
    expect(clampWindowSeconds(4.6)).toBe(5);
    expect(clampWindowSeconds(200)).toBe(60);
    expect(clampWindowSeconds(NaN)).toBe(0);
  });
});

describe('buildXML', () => {
  it('declares UTF-8 and wraps instances and rows in <file>', () => {
    const doc = xml([event(1, 'Goal', '10:00')]);
    expect(doc.startsWith('<?xml version="1.0" encoding="UTF-8"?>\n<file>')).toBe(true);
    expect(doc).toContain('<ALL_INSTANCES>');
    expect(doc).toContain('<ROWS>');
    expect(doc.trimEnd().endsWith('</file>')).toBe(true);
  });

  it('turns each instant into a clip from time_continuous', () => {
    const [clip] = instances(xml([event(1, 'Goal', '71:30')], { lead: 5, lag: 3 }));
    expect(clip).toMatchObject({ start: 4285, end: 4293, code: 'Goal' });
  });

  it('never starts a clip before the video', () => {
    const [clip] = instances(xml([event(1, 'Goal', '00:02')], { lead: 5, lag: 3 }));
    expect(clip.start).toBe(0);
    expect(clip.end).toBe(5);
  });

  it('sorts clips by position and numbers them in that order', () => {
    const doc = xml([
      event(2, 'Corner', '50:00'),
      event(1, 'Goal', '10:00'),
      event(2, 'Corner', '10:00'),
    ]);
    expect(instances(doc).map((i) => [i.id, i.code, i.start])).toEqual([
      [1, 'Goal', 595],
      [2, 'Corner', 595],
      [3, 'Corner', 2995],
    ]);
  });

  it('labels attributed events with the team name, and only those', () => {
    const doc = xml([event(1, 'Goal', '10:00', 'home'), event(2, 'Corner', '20:00')]);
    expect(instances(doc).map((i) => i.team)).toEqual(['Milan', null]);
    expect(doc.match(/<group>Team<\/group>/g)).toHaveLength(1);
  });

  it('escapes XML special characters', () => {
    const doc = xml([event(1, 'Goal <late> & "lucky"', '10:00', 'away')]);
    expect(doc).toContain('<code>Goal &lt;late&gt; &amp; &quot;lucky&quot;</code>');
    expect(doc).toContain('<text>Inter &amp; Co</text>');
  });

  it('writes one row per enabled tag with its colour as R/G/B', () => {
    expect(rows(xml([]))).toEqual([
      { code: 'Goal', rgb: [0, 255, 0] },
      { code: 'Corner', rgb: [30, 144, 255] },
    ]);
  });

  it('adds a row for every code only found in the events', () => {
    // Tag 1 renamed after tagging, tag 3 disabled after tagging.
    const doc = xml([event(1, 'Gol', '10:00'), event(3, 'Foul', '20:00')]);
    const codes = rows(doc).map((r) => r.code);
    expect(codes).toEqual(['Goal', 'Corner', 'Gol', 'Foul']);
    expect(rows(doc).find((r) => r.code === 'Foul')!.rgb).toEqual([255, 0, 0]);
    for (const i of instances(doc)) expect(codes).toContain(i.code);
  });
});
