import { defaultTags } from '../../constants/defaultTags';
import { TagConfig } from '../../types';
import {
  TAG_SET_TYPE,
  TAG_SET_VERSION,
  buildTagSet,
  parseTagSet,
} from '../tagSet';

const board = (): TagConfig[] =>
  defaultTags('en').map((t, i) => ({
    ...t,
    name: i === 0 ? 'Pressing' : t.name,
    color: i === 1 ? '#a855f7' : t.color,
    enabled: i % 3 !== 0,
  }));

/** A valid file as an object, for tests that break one field at a time. */
const fileObject = () => JSON.parse(buildTagSet(board()));
const parseObject = (o: unknown) => parseTagSet(JSON.stringify(o));

describe('buildTagSet', () => {
  it('writes the type and version markers', () => {
    const file = fileObject();
    expect(file.type).toBe(TAG_SET_TYPE);
    expect(file.version).toBe(TAG_SET_VERSION);
    expect(file.tags).toHaveLength(16);
  });

  it('writes only the tag fields, in id order', () => {
    const shuffled = [...board()].reverse();
    const file = JSON.parse(buildTagSet(shuffled));
    expect(file.tags.map((t: TagConfig) => t.id)).toEqual(
      Array.from({ length: 16 }, (_, i) => i + 1)
    );
    expect(Object.keys(file.tags[0]).sort()).toEqual(
      ['color', 'enabled', 'id', 'name']
    );
  });
});

describe('parseTagSet', () => {
  it('round-trips a board unchanged', () => {
    const result = parseTagSet(buildTagSet(board()));
    expect(result).toEqual({ ok: true, tags: board() });
  });

  it('keeps empty tag names, which the editor allows', () => {
    const file = fileObject();
    file.tags[4].name = '';
    const result = parseObject(file);
    expect(result.ok && result.tags[4].name).toBe('');
  });

  it('rejects text that is not JSON', () => {
    expect(parseTagSet('not json')).toEqual({ ok: false, error: 'notJson' });
  });

  it('recognises a match export', () => {
    const matchExport = { metadata: { schema_version: 2 }, match_info: {}, events: [] };
    expect(parseObject(matchExport)).toEqual({ ok: false, error: 'matchExport' });
  });

  it('rejects other JSON', () => {
    expect(parseObject({ hello: 'world' })).toEqual({ ok: false, error: 'notTagSet' });
    expect(parseObject([1, 2, 3])).toEqual({ ok: false, error: 'notTagSet' });
  });

  it('rejects a future version', () => {
    const file = fileObject();
    file.version = TAG_SET_VERSION + 1;
    expect(parseObject(file)).toEqual({ ok: false, error: 'unsupportedVersion' });
  });

  const invalid: [string, (f: ReturnType<typeof fileObject>) => void][] = [
    ['fewer than 16 tags', (f) => f.tags.pop()],
    ['more than 16 tags', (f) => f.tags.push({ ...f.tags[0], id: 17 })],
    ['a duplicate id', (f) => (f.tags[15].id = 1)],
    ['an id out of range', (f) => (f.tags[15].id = 17)],
    ['a non-integer id', (f) => (f.tags[0].id = 1.5)],
    ['a name over 20 characters', (f) => (f.tags[0].name = 'x'.repeat(21))],
    ['a missing name', (f) => delete f.tags[0].name],
    ['a malformed color', (f) => (f.tags[0].color = 'red')],
    ['a short hex color', (f) => (f.tags[0].color = '#FFF')],
    ['a non-boolean enabled', (f) => (f.tags[0].enabled = 'yes')],
    ['tags that are not a list', (f) => (f.tags = {})],
  ];

  it.each(invalid)('rejects %s', (_, breakFile) => {
    const file = fileObject();
    breakFile(file);
    expect(parseObject(file)).toEqual({ ok: false, error: 'invalidTags' });
  });

  it('accepts tags listed out of order', () => {
    const file = fileObject();
    file.tags.reverse();
    expect(parseObject(file)).toEqual({ ok: true, tags: board() });
  });
});
