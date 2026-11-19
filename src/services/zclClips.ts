import { EventRecord, MatchConfig } from '../types';
import { eventUids } from './clipUid';
import { ClipWindow, clampWindowSeconds, parseMMSS } from './xmlExport';

/**
 * Zona Calcio Lab clip format, version 1 (#60): the JSON exchange format
 * shared with ClipTrimmer and MatchRazor.
 * Specification: https://github.com/ZonaCalcioLab/zcl-clips
 *
 * PlayTrace tags live and has no video, so every event becomes an instant
 * clip in **period time** — seconds from that half's kick-off — on a single
 * source without a uri. The receiving tool asks for the kick-off positions in
 * the video.
 */

export const ZCL_FORMAT = 'zcl-clips';
export const ZCL_VERSION = 1;
export const ZCL_SOURCE_ID = 'live';

interface ZclInput {
  matchConfig: MatchConfig;
  events: EventRecord[];
}

interface ZclClip {
  /** Stable identifier of the clip (zcl-clips `uid`, #64). */
  uid: string;
  source: string;
  period: 1 | 2;
  t: number;
  pre: number;
  post: number;
  label: string;
  team?: 'home' | 'away';
  extra: { playtrace: { tag_id: number; timestamp_absolute: string } };
}

/**
 * Seconds from the kick-off of the event's half, read from `time_match`
 * ("68:30 (2T)"), which keeps the seconds. `time_period` cannot be used: past
 * the regulation time it is in whole minutes ("45+2 1T").
 *
 * In the second half `time_match` counts from the nominal half duration, so
 * that is subtracted again. Returns null for a malformed value.
 */
export function periodSeconds(
  timeMatch: string,
  halfDurationMin: number
): { period: 1 | 2; t: number } | null {
  const match = /^(\d+:\d{2}) \(([12])T\)$/.exec(timeMatch.trim());
  if (!match) return null;
  const total = parseMMSS(match[1]);
  if (total === null) return null;
  const period = match[2] === '2' ? 2 : 1;
  const t = period === 2 ? total - halfDurationMin * 60 : total;
  return t < 0 ? null : { period, t };
}

/** Only non-empty match fields: every field of `match` is optional. */
function matchBlock(config: MatchConfig) {
  const text = (value: string) => (value.trim() === '' ? undefined : value.trim());
  const block = {
    competition: text(config.competition),
    date: /^\d{4}-\d{2}-\d{2}$/.test(config.date) ? config.date : undefined,
    venue: text(config.venue),
    home: text(config.homeTeam),
    away: text(config.awayTeam),
    period_duration: config.halfDuration > 0 ? config.halfDuration : undefined,
  };
  return Object.fromEntries(Object.entries(block).filter(([, v]) => v !== undefined));
}

export function buildZclClips(
  input: ZclInput,
  window: ClipWindow,
  appVersion: string
): string {
  const { matchConfig, events } = input;
  const pre = clampWindowSeconds(window.lead);
  const post = clampWindowSeconds(window.lag);

  // Tagging order, as recorded: the format shows clips in file order.
  const clips: ZclClip[] = [];
  const uids = eventUids(events);
  events.forEach((event, i) => {
    const time = periodSeconds(event.time_match, matchConfig.halfDuration);
    if (time === null) return;
    const clip: ZclClip = {
      uid: uids[i],
      source: ZCL_SOURCE_ID,
      period: time.period,
      t: time.t,
      pre,
      post,
      // The name at tagging time, like tag_name in JSON and CSV.
      label: event.tag_name,
      extra: {
        playtrace: {
          tag_id: event.tag_id,
          timestamp_absolute: event.timestamp_absolute,
        },
      },
    };
    if (event.team) clip.team = event.team;
    clips.push(clip);
  });

  const file = {
    format: ZCL_FORMAT,
    version: ZCL_VERSION,
    generator: { name: 'PlayTrace', version: appVersion },
    match: matchBlock(matchConfig),
    sources: [{ id: ZCL_SOURCE_ID, title: 'Live tagging, no video yet' }],
    clips,
  };
  return JSON.stringify(file, null, 2);
}
