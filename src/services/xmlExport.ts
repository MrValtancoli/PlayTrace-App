import { EventRecord, MatchConfig, TagConfig } from '../types';
import { teamLabel } from './teamSelection';

/**
 * SportsCode-style XML (#40): the "instances" timeline that Once, LongoMatch,
 * Nacsport and Hudl Sportscode import. There is no published schema; the
 * structure follows the de-facto standard described in the issue and the
 * Export Format Reference.
 *
 * PlayTrace records instants, while these programs expect clips, so each event
 * becomes a window around its `time_continuous`: the position in a video cut
 * at kick-off with the interval removed.
 */

/** Seconds of video kept before and after each event. */
export interface ClipWindow {
  lead: number;
  lag: number;
}

export const DEFAULT_CLIP_WINDOW: ClipWindow = { lead: 5, lag: 3 };

/** Bounds for the lead and lag inputs on the Export screen. */
export const CLIP_WINDOW_MAX = 60;

/** Clamps a lead or lag value to a whole number of seconds in range. */
export function clampWindowSeconds(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(CLIP_WINDOW_MAX, Math.max(0, Math.round(value)));
}

/** "MM:SS" (minutes may exceed 99) -> seconds, or null when malformed. */
export function parseMMSS(value: string): number | null {
  const match = /^(\d+):([0-5]\d)$/.exec(value.trim());
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** "#1E90FF" -> [30, 144, 255]; grey when the colour is not #RRGGBB. */
function hexToRgb(hex: string): [number, number, number] {
  const match = /^#([0-9A-Fa-f]{6})$/.exec(hex);
  if (!match) return [128, 128, 128];
  const n = parseInt(match[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const seconds = (s: number) => s.toFixed(1);

interface XmlInput {
  matchConfig: MatchConfig;
  tags: TagConfig[];
  events: EventRecord[];
}

export function buildXML(input: XmlInput, window: ClipWindow): string {
  const { matchConfig, tags, events } = input;
  const lead = clampWindowSeconds(window.lead);
  const lag = clampWindowSeconds(window.lag);

  // Importers mishandle unsorted files: order by position in the video, ties
  // kept in tagging order, and number the IDs in that order.
  const timed = events
    .map((event, index) => ({ event, index, t: parseMMSS(event.time_continuous) }))
    .filter((e): e is { event: EventRecord; index: number; t: number } => e.t !== null)
    .sort((a, b) => a.t - b.t || a.index - b.index);

  const instances = timed.map(({ event, t }, i) => {
    const lines = [
      '    <instance>',
      `      <ID>${i + 1}</ID>`,
      `      <start>${seconds(Math.max(0, t - lead))}</start>`,
      `      <end>${seconds(t + lag)}</end>`,
      // The name at tagging time, like tag_name in JSON and CSV.
      `      <code>${escapeXml(event.tag_name)}</code>`,
    ];
    if (event.team) {
      const team = teamLabel(event.team, matchConfig.homeTeam, matchConfig.awayTeam);
      lines.push(
        '      <label>',
        '        <group>Team</group>',
        `        <text>${escapeXml(team)}</text>`,
        '      </label>'
      );
    }
    lines.push('    </instance>');
    return lines.join('\n');
  });

  // One row per code used in the instances, with exactly the same text, in
  // tag order. Rows for unused tags would only add empty lines to the
  // imported timeline. The colour comes from the tag's current configuration.
  const rowColors = new Map<string, string>();
  const used = [...timed].sort((a, b) => a.event.tag_id - b.event.tag_id || a.index - b.index);
  for (const { event } of used) {
    if (!rowColors.has(event.tag_name)) {
      const tag = tags.find((t) => t.id === event.tag_id);
      rowColors.set(event.tag_name, tag?.color ?? '');
    }
  }
  const rows = [...rowColors].map(([code, color]) => {
    const [r, g, b] = hexToRgb(color);
    return [
      '    <row>',
      `      <code>${escapeXml(code)}</code>`,
      `      <R>${r}</R>`,
      `      <G>${g}</G>`,
      `      <B>${b}</B>`,
      '    </row>',
    ].join('\n');
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<file>',
    '  <ALL_INSTANCES>',
    ...instances,
    '  </ALL_INSTANCES>',
    '  <ROWS>',
    ...rows,
    '  </ROWS>',
    '</file>',
    '',
  ].join('\n');
}
