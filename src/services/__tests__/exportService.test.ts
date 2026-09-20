import { buildCSV, buildJSON, ExportInput } from '../exportService';
import { EventRecord, MatchConfig, TagConfig } from '../../types';

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

const input: ExportInput = {
  matchConfig,
  tags,
  injuryTime1: 3,
  injuryTime2: 5,
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

  it('reports total events and total duration including injury time', () => {
    expect(root.metadata.total_events).toBe(2);
    // 45 + 45 + 3 + 5 = 98 minutes
    expect(root.metadata.match_duration).toBe('98:00');
  });
});

describe('buildCSV', () => {
  const lines = buildCSV(input).split('\n');

  it('starts with the documented 16-column header', () => {
    expect(lines[0]).toBe(
      'tag_id,tag_name,timestamp_absolute,time_period,time_match,time_continuous,' +
        'competition,date,venue,home_team,away_team,half_duration,' +
        'injury_time_1st,injury_time_2nd,app_version,export_timestamp'
    );
  });

  it('writes one row per event', () => {
    expect(lines).toHaveLength(events.length + 1);
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
    const row = buildCSV(tricky).split('\n')[1]!;
    expect(row).toContain('"Shot, blocked"');
    expect(row).toContain('"Stadio ""Grande"", Torino"');
  });

  it('produces a header-only file when there are no events', () => {
    expect(buildCSV({ ...input, events: [] }).split('\n')).toHaveLength(1);
  });
});
