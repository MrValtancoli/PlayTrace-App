import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { EventRecord, MatchConfig, PeriodRecord, TagConfig } from '../types';
import { APP_VERSION } from '../constants/defaultTags';
import i18n from '../i18n';
import { exportBaseName, formatMMSS, formatTimestampAbsolute } from './timeFormat';
import { measuredDurationSeconds } from './periods';

export interface ExportInput {
  matchConfig: MatchConfig;
  tags: TagConfig[];
  injuryTime1: number;
  injuryTime2: number;
  /** Measured boundaries of the halves that have ended. */
  periods: PeriodRecord[];
  firstHalfElapsed: number | null;
  secondHalfElapsed: number | null;
  events: EventRecord[];
}

/** The export schema this build writes. Bumped on any contract change. */
export const SCHEMA_VERSION = 2;

/** Which half an event belongs to, from the documented `1T` / `2T` suffix. */
export function eventPeriod(e: EventRecord): 1 | 2 {
  return e.time_period.trim().endsWith('2T') ? 2 : 1;
}

function buildMetadata(input: ExportInput) {
  const { events } = input;
  return {
    schema_version: SCHEMA_VERSION,
    app_version: APP_VERSION,
    export_timestamp: formatTimestampAbsolute(new Date()),
    /** Tagged events only; period boundaries are not events. */
    total_events: events.length,
    /** Measured, not nominal: the halves that have actually been played. */
    match_duration: formatMMSS(measuredDurationSeconds(input)),
    platform: Platform.OS === 'ios' ? 'iOS' : 'Android',
  };
}

/** JSON structure per Export-Format-Reference.md */
export function buildJSON(input: ExportInput): string {
  const { matchConfig, tags, injuryTime1, injuryTime2, events } = input;
  const root = {
    match_info: {
      competition: matchConfig.competition,
      date: matchConfig.date,
      venue: matchConfig.venue,
      home_team: matchConfig.homeTeam,
      away_team: matchConfig.awayTeam,
      half_duration: matchConfig.halfDuration,
    },
    configuration: {
      tags: tags
        .filter((t) => t.enabled)
        .map((t) => ({ id: t.id, name: t.name, color: t.color })),
      injury_time: {
        first_half: injuryTime1,
        second_half: injuryTime2,
      },
    },
    periods: input.periods,
    events,
    metadata: buildMetadata(input),
  };
  return JSON.stringify(root, null, 2);
}

// Spreadsheets evaluate a cell starting with one of these as a formula.
const FORMULA_TRIGGER = /^[=+\-@\t\r]/;

function csvEscape(value: string | number): string {
  let s = String(value);
  // CSV only: prefix user text with ' so Excel & co. show it as text instead
  // of running it (OWASP CSV injection). Numbers are left untouched.
  if (typeof value === 'string' && FORMULA_TRIGGER.test(s)) {
    s = `'${s}`;
  }
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/**
 * Flat CSV: one row per record, as a single timeline. A `type` column tells
 * tag rows from period rows; period rows leave `tag_id` and `tag_name` empty.
 *
 * This is deliberately not the shape of the JSON export, where periods are a
 * separate block: in a spreadsheet one sequence reads better, in JSON a
 * structured block does. The row count is therefore not the event count.
 */
export function buildCSV(input: ExportInput): string {
  const { matchConfig, injuryTime1, injuryTime2, events, periods } = input;
  const meta = buildMetadata(input);

  const header = [
    'type',
    'tag_id',
    'tag_name',
    'team',
    'timestamp_absolute',
    'time_period',
    'time_match',
    'time_continuous',
    'competition',
    'date',
    'venue',
    'home_team',
    'away_team',
    'half_duration',
    'injury_time_1st',
    'injury_time_2nd',
    'app_version',
    'export_timestamp',
  ].join(',');

  const trailer = [
    matchConfig.competition,
    matchConfig.date,
    matchConfig.venue,
    matchConfig.homeTeam,
    matchConfig.awayTeam,
    matchConfig.halfDuration,
    injuryTime1,
    injuryTime2,
    meta.app_version,
    meta.export_timestamp,
  ];

  const eventRow = (e: EventRecord) =>
    [
      'tag',
      e.tag_id,
      e.tag_name,
      e.team ?? '',
      e.timestamp_absolute,
      e.time_period,
      e.time_match,
      e.time_continuous,
      ...trailer,
    ]
      .map(csvEscape)
      .join(',');

  // A period row opens its half: start time in the absolute column, measured
  // duration in time_period, so the timeline reads top to bottom.
  const periodRow = (p: PeriodRecord) =>
    [
      'period',
      '',
      '',
      '',
      p.start_absolute,
      `${p.duration} ${p.period}T`,
      '',
      '',
      ...trailer,
    ]
      .map(csvEscape)
      .join(',');

  const rows: string[] = [];
  for (const period of [1, 2] as const) {
    const start = periods.find((p) => p.period === period);
    if (start) rows.push(periodRow(start));
    rows.push(...events.filter((e) => eventPeriod(e) === period).map(eventRow));
  }

  return [header, ...rows].join('\n');
}

/** Writes the export to the cache directory and opens the share sheet. */
export async function exportAndShare(
  input: ExportInput,
  format: 'json' | 'csv'
): Promise<void> {
  const content = format === 'json' ? buildJSON(input) : buildCSV(input);
  const fileName = `${exportBaseName(new Date())}.${format}`;

  const file = new File(Paths.cache, fileName);
  if (file.exists) {
    file.delete();
  }
  file.create();
  file.write(content);

  const available = await Sharing.isAvailableAsync();
  if (!available) {
    throw new Error(i18n.t('export.shareUnavailable'));
  }

  await Sharing.shareAsync(file.uri, {
    mimeType: format === 'json' ? 'application/json' : 'text/csv',
    dialogTitle: i18n.t('export.shareTitle', { format: format.toUpperCase() }),
    UTI: format === 'json' ? 'public.json' : 'public.comma-separated-values-text',
  });
}
