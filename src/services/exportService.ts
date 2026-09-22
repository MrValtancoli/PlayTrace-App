import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { EventRecord, MatchConfig, TagConfig } from '../types';
import { APP_VERSION } from '../constants/defaultTags';
import { exportBaseName, formatMMSS, formatTimestampAbsolute } from './timeFormat';

export interface ExportInput {
  matchConfig: MatchConfig;
  tags: TagConfig[];
  injuryTime1: number;
  injuryTime2: number;
  events: EventRecord[];
}

function buildMetadata(input: ExportInput) {
  const { matchConfig, injuryTime1, injuryTime2, events } = input;
  const totalMin =
    matchConfig.halfDuration * 2 + injuryTime1 + injuryTime2;
  return {
    app_version: APP_VERSION,
    export_timestamp: formatTimestampAbsolute(new Date()),
    total_events: events.length,
    match_duration: formatMMSS(totalMin * 60),
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

/** Flat CSV per Export-Format-Reference.md (one row per event). */
export function buildCSV(input: ExportInput): string {
  const { matchConfig, injuryTime1, injuryTime2, events } = input;
  const meta = buildMetadata(input);
  const header = [
    'tag_id',
    'tag_name',
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

  const rows = events.map((e) =>
    [
      e.tag_id,
      e.tag_name,
      e.timestamp_absolute,
      e.time_period,
      e.time_match,
      e.time_continuous,
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
    ]
      .map(csvEscape)
      .join(',')
  );

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
    throw new Error('Sharing is not available on this device');
  }

  await Sharing.shareAsync(file.uri, {
    mimeType: format === 'json' ? 'application/json' : 'text/csv',
    dialogTitle: `Share PlayTrace ${format.toUpperCase()} export`,
    UTI: format === 'json' ? 'public.json' : 'public.comma-separated-values-text',
  });
}
