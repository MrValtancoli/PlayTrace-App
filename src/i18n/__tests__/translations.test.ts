import { defaultTags } from '../../constants/defaultTags';
import { LANGUAGES, LanguageCode, isLanguageCode } from '..';
import en from '../en.json';

type Tree = { [key: string]: string | Tree };

/** Every leaf as "path.to.key" -> value. */
function flatten(tree: Tree, prefix = ''): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(tree)) {
    const path = prefix + key;
    if (typeof value === 'string') out[path] = value;
    else Object.assign(out, flatten(value, path + '.'));
  }
  return out;
}

const placeholders = (s: string) => (s.match(/\{\{\w+\}\}/g) ?? []).sort();

const source = flatten(en);
const codes = Object.keys(LANGUAGES) as LanguageCode[];

describe.each(codes)('%s.json', (code) => {
  const strings = flatten(LANGUAGES[code] as Tree);

  it('has exactly the keys of en.json', () => {
    expect(Object.keys(strings).sort()).toEqual(Object.keys(source).sort());
  });

  it('keeps the {{placeholders}} of en.json', () => {
    for (const [key, value] of Object.entries(source)) {
      expect([key, placeholders(strings[key])]).toEqual([key, placeholders(value)]);
    }
  });

  it('has no empty strings', () => {
    for (const [key, value] of Object.entries(strings)) {
      expect([key, value.trim().length > 0]).toEqual([key, true]);
    }
  });

  it('builds 16 default tags within the 20-character limit', () => {
    const tags = defaultTags(code);
    expect(tags.map((t) => t.id)).toEqual(
      Array.from({ length: 16 }, (_, i) => i + 1)
    );
    for (const tag of tags) {
      expect(tag.name.length).toBeGreaterThan(0);
      expect(tag.name.length).toBeLessThanOrEqual(20);
    }
  });
});

describe('default tags', () => {
  it('differ only in names between languages', () => {
    const strip = (code: LanguageCode) =>
      defaultTags(code).map(({ name, ...rest }) => rest);
    for (const code of codes) expect(strip(code)).toEqual(strip('en'));
  });
});

describe('isLanguageCode', () => {
  it('accepts only bundled languages', () => {
    expect(isLanguageCode('en')).toBe(true);
    expect(isLanguageCode('it')).toBe(true);
    expect(isLanguageCode('xx')).toBe(false);
    expect(isLanguageCode('toString')).toBe(false);
    expect(isLanguageCode(null)).toBe(false);
  });
});
