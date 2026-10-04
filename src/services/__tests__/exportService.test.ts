import {
  buildCSV,
  buildJSON,
  eventPeriod,
  ExportInput,
  SCHEMA_VERSION,
} from '../exportService';
import { EventRecord, MatchConfig, PeriodRecord, TagConfig } from '../../types';
import appConfig from '../../../app.json';

const matchConfig: MatchConfig = {
  competition: 'Serie A',
  date: '2026-06-10',
  venue: 'San Siro',
  homeTeam: 'Milan',
  awayTeam: 'Inter',
  halfDuration: 45,
};

const tags: TagConfig[] = [
  { id: 1, name: 'Goal', color: '#00FF00', enabled: true },
  { id: 2, name: 'Corner', color: '#1E90FF', enabled: true },
  { id: 3, name: 'Disabled one', color: '#FF0000', enabled: false },
];

const events: EventRecord[] = [
  {
    tag_id: 1,
    tag_name: 'Goal',
    timestamp_absolute: '10/06/26 15:23:45',
    time_period: '23:45 1T',
    time_match: '23:45 (1T)',
    time_continuous: '23:45',
  },
  {
    tag_id: 2,
    tag_name: 'Corner',
    timestamp_absolute: '10/06/26 16:12:30',
    time_period: '23:30 2T',
    time_match: '68:30 (2T)',
    time_continuous: '71:30',
  },
];

const periods: PeriodRecord[] = [
  { period: 1, start_absolute: '10/06/26 15:03:12', duration: '47:47' },
  { period: 2, start_absolute: '10/06/26 16:05:40', duration: '49:12' },
];

const input: ExportInput = {
  matchConfig,
  tags,
  injuryTime1: 3,
  injuryTime2: 5,
  periods,
  firstHalfElapsed: 47 * 60 + 47,
  secondHalfElapsed: 49 * 60 + 12,
  events,
};

describe('buildJSON', () => {
  const root = JSON.parse(buildJSON(input));

  // Field names are a public contract consumed by Python and R downstream.
  it('keeps match_info field names and values', () => {
    expect(root.match_info).toEqual({
      competition: 'Serie A',
      date: '2026-06-10',
      venue: 'San Siro',
      home_team: 'Milan',
      away_team: 'Inter',
      half_duration: 45,
    });
  });

  it('exports only enabled tags, without the enabled flag', () => {
    expect(root.configuration.tags).toEqual([
      { id: 1, name: 'Goal', color: '#00FF00' },
      { id: 2, name: 'Corner', color: '#1E90FF' },
    ]);
  });

  it('carries injury time for both halves', () => {
    expect(root.configuration.injury_time).toEqual({
      first_half: 3,
      second_half: 5,
    });
  });

  it('emits all four time references on every event', () => {
    for (const e of root.events) {
      expect(typeof e.timestamp_absolute).toBe('string');
      expect(typeof e.time_period).toBe('string');
      expect(typeof e.time_match).toBe('string');
      expect(typeof e.time_continuous).toBe('string');
    }
  });

  it('counts tagged events only, periods are not events', () => {
    expect(root.metadata.total_events).toBe(2);
    expect(root.events).toHaveLength(2);
  });

  it('reports the measured duration, not the nominal one', () => {
    // 47:47 + 49:12 = 96:59. The nominal figure would have been 98:00.
    expect(root.metadata.match_duration).toBe('96:59');
  });

  it('declares the schema version', () => {
    expect(root.metadata.schema_version).toBe(SCHEMA_VERSION);
  });

  it('carries the measured period boundaries', () => {
    expect(root.periods).toEqual(periods);
  });

  it('reports the app version from app.json', () => {
    expect(root.metadata.app_version).toBe(appConfig.expo.version);
  });
});

describe('buildCSV', () => {
  const lines = buildCSV(input).split('\n');

  /** The tag rows, in order, ignoring the header and the period markers. */
  const tagRows = (csv: string) =>
    csv
      .split('\n')
      .slice(1)
      .filter((r) => r.startsWith('tag,'));

  it('starts with the documented 17-column header', () => {
    expect(lines[0]).toBe(
      'type,tag_id,tag_name,timestamp_absolute,time_period,time_match,' +
        'time_continuous,competition,date,venue,home_team,away_team,' +
        'half_duration,injury_time_1st,injury_time_2nd,app_version,' +
        'export_timestamp'
    );
  });

  it('writes one row per event plus one per period', () => {
    expect(lines).toHaveLength(1 + events.length + periods.length);
  });

  it('opens each half with its period row, followed by its events', () => {
    expect(lines[1]).toContain('period');
    expect(lines[1]).toContain('15:03:12');
    expect(lines[2]).toContain('Goal');
    expect(lines[3]).toContain('period');
    expect(lines[4]).toContain('Corner');
  });

  it('leaves tag_id and tag_name empty on a period row', () => {
    const cells = lines[1]!.split(',');
    expect(cells[0]).toBe('period');
    expect(cells[1]).toBe('');
    expect(cells[2]).toBe('');
  });

  it('marks event rows as tag', () => {
    expect(lines[2]!.split(',')[0]).toBe('tag');
  });

  it('repeats match metadata on every row', () => {
    for (const row of lines.slice(1)) {
      expect(row).toContain('Serie A');
      expect(row).toContain('Milan');
    }
  });

  it('quotes and escapes values containing commas or quotes', () => {
    const tricky: ExportInput = {
      ...input,
      matchConfig: { ...matchConfig, venue: 'Stadio "Grande", Torino' },
      events: [{ ...events[0]!, tag_name: 'Shot, blocked' }],
    };
    const row = tagRows(buildCSV(tricky))[0]!;
    expect(row).toContain('"Shot, blocked"');
    expect(row).toContain('"Stadio ""Grande"", Torino"');
  });

  it('neutralizes values that spreadsheets would run as formulas', () => {
    const risky: ExportInput = {
      ...input,
      matchConfig: { ...matchConfig, homeTeam: '=1+1', awayTeam: '@SUM(A1)' },
      events: [
        { ...events[0]!, tag_name: '-1 lost ball' },
        { ...events[1]!, tag_name: '+ counter' },
      ],
    };
    const [first, second] = tagRows(buildCSV(risky));
    expect(first).toContain(",'-1 lost ball,");
    expect(first).toContain(",'=1+1,'@SUM(A1),");
    expect(second).toContain(",'+ counter,");
  });

  it('keeps safe values and numbers unchanged', () => {
    const row = tagRows(buildCSV(input))[0]!;
    expect(row.startsWith('tag,1,Goal,10/06/26 15:23:45,')).toBe(true);
    expect(row).not.toContain("'");
  });

  it('leaves the JSON export untouched', () => {
    const json = JSON.parse(
      buildJSON({ ...input, matchConfig: { ...matchConfig, homeTeam: '=1+1' } })
    );
    expect(json.match_info.home_team).toBe('=1+1');
  });

  it('produces a header-only file with nothing to report', () => {
    const empty = buildCSV({ ...input, events: [], periods: [] });
    expect(empty.split('\n')).toHaveLength(1);
  });

  it('still writes the period rows when no event was tagged', () => {
    const rows = buildCSV({ ...input, events: [] }).split('\n').slice(1);
    expect(rows).toHaveLength(periods.length);
    expect(rows.every((r) => r.startsWith('period,'))).toBe(true);
  });
});
