import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { APP_VERSION } from '../constants/defaultTags';
import i18n from '../i18n';
import { TagConfig } from '../types';
import { exportBaseName } from './timeFormat';

/**
 * Sharing a tag set between devices (#34).
 *
 * A tag set file carries configuration only — the 16 tags — and never events.
 * It is told apart from a match export by its `type` marker, and `version`
 * lets a future, incompatible format be rejected instead of misread.
 * Importing replaces the whole board.
 */

export const TAG_SET_TYPE = 'playtrace-tagset';
export const TAG_SET_VERSION = 1;
export const TAG_COUNT = 16;
export const TAG_NAME_MAX = 20;

const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;

/** Why a file was rejected; each code maps to a message in the UI. */
export type TagSetError =
  | 'notJson'
  | 'matchExport'
  | 'notTagSet'
  | 'unsupportedVersion'
  | 'invalidTags';

export type TagSetParseResult =
  | { ok: true; tags: TagConfig[] }
  | { ok: false; error: TagSetError };

export function buildTagSet(tags: TagConfig[]): string {
  const file = {
    type: TAG_SET_TYPE,
    version: TAG_SET_VERSION,
    app_version: APP_VERSION,
    tags: [...tags]
      .sort((a, b) => a.id - b.id)
      .map(({ id, name, color, enabled }) => ({ id, name, color, enabled })),
  };
  return JSON.stringify(file, null, 2);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** One tag as stored in the file, or null when any field is off. */
function parseTag(value: unknown): TagConfig | null {
  if (!isRecord(value)) return null;
  const { id, name, color, enabled } = value;
  if (typeof id !== 'number' || !Number.isInteger(id)) return null;
  if (typeof name !== 'string' || name.length > TAG_NAME_MAX) return null;
  if (typeof color !== 'string' || !HEX_COLOR.test(color)) return null;
  if (typeof enabled !== 'boolean') return null;
  return { id, name, color, enabled };
}

/**
 * Reads a tag set file. Anything short of exactly 16 valid tags with ids 1–16
 * is rejected as a whole, so a bad file can never leave a half-applied board.
 */
export function parseTagSet(text: string): TagSetParseResult {
  let root: unknown;
  try {
    root = JSON.parse(text);
  } catch {
    return { ok: false, error: 'notJson' };
  }
  if (!isRecord(root)) return { ok: false, error: 'notTagSet' };

  if (root.type !== TAG_SET_TYPE) {
    // A match export is the likeliest wrong file: say so plainly.
    const isMatchExport = isRecord(root.metadata) && 'match_info' in root;
    return { ok: false, error: isMatchExport ? 'matchExport' : 'notTagSet' };
  }
  if (root.version !== TAG_SET_VERSION) {
    return { ok: false, error: 'unsupportedVersion' };
  }
  if (!Array.isArray(root.tags) || root.tags.length !== TAG_COUNT) {
    return { ok: false, error: 'invalidTags' };
  }

  const tags: TagConfig[] = [];
  for (const raw of root.tags) {
    const tag = parseTag(raw);
    if (tag === null) return { ok: false, error: 'invalidTags' };
    tags.push(tag);
  }
  tags.sort((a, b) => a.id - b.id);
  const idsOk = tags.every((t, i) => t.id === i + 1);
  if (!idsOk) return { ok: false, error: 'invalidTags' };

  return { ok: true, tags };
}

/** Writes the tag set to the cache directory and opens the share sheet. */
export async function shareTagSet(tags: TagConfig[]): Promise<void> {
  const fileName = `${exportBaseName(new Date()).replace('PlayTrace_', 'PlayTrace_tags_')}.json`;
  const file = new File(Paths.cache, fileName);
  if (file.exists) {
    file.delete();
  }
  file.create();
  file.write(buildTagSet(tags));

  if (!(await Sharing.isAvailableAsync())) {
    throw new Error(i18n.t('export.shareUnavailable'));
  }
  await Sharing.shareAsync(file.uri, {
    mimeType: 'application/json',
    dialogTitle: i18n.t('tagSet.shareTitle'),
    UTI: 'public.json',
  });
}

/**
 * Lets the analyst pick a file and returns its text, or null when the picker
 * was cancelled. Any file type is accepted: chat apps often deliver a .json
 * as a generic binary, and the content check decides anyway.
 */
export async function pickTagSetText(): Promise<string | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: '*/*',
    copyToCacheDirectory: true,
    multiple: false,
  });
  if (result.canceled || result.assets.length === 0) return null;
  return new File(result.assets[0].uri).text();
}
