/**
 * Stable clip identifiers for the zcl-clips export (#64,
 * https://github.com/ZonaCalcioLab/zcl-clips#clip-identifier).
 *
 * A `uid` must stay the same when the same tag is exported again, so it is not
 * random: it is a name-based UUID (version 5, RFC 9562) of what identifies a
 * tag — when it was tapped, which tag it was and its match time. Nothing new is
 * stored with the event.
 */

// Namespace for PlayTrace tags (a fixed random UUID).
const NAMESPACE = '0b7e3f52-9c41-4d8a-a6f3-2e5d17c9b480';

function utf8(text: string): number[] {
  const out: number[] = [];
  for (const ch of text) {
    let c = ch.codePointAt(0) as number;
    if (c < 0x80) out.push(c);
    else if (c < 0x800) out.push(0xc0 | (c >> 6), 0x80 | (c & 63));
    else if (c < 0x10000) out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
    else {
      out.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
    }
  }
  return out;
}

/** SHA-1 of a byte array (only used to derive identifiers, not for security). */
export function sha1(bytes: number[]): number[] {
  const msg = [...bytes, 0x80];
  while (msg.length % 64 !== 56) msg.push(0);
  const bits = bytes.length * 8;
  for (let i = 7; i >= 0; i--) msg.push(i >= 4 ? 0 : (bits >>> (i * 8)) & 0xff);
  let [h0, h1, h2, h3, h4] = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
  const w = new Array<number>(80);
  const rotl = (x: number, n: number) => (x << n) | (x >>> (32 - n));
  for (let off = 0; off < msg.length; off += 64) {
    for (let i = 0; i < 16; i++) {
      w[i] = (msg[off + 4 * i] << 24) | (msg[off + 4 * i + 1] << 16) | (msg[off + 4 * i + 2] << 8) | msg[off + 4 * i + 3];
    }
    for (let i = 16; i < 80; i++) w[i] = rotl(w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16], 1);
    let [a, b, c, d, e] = [h0, h1, h2, h3, h4];
    for (let i = 0; i < 80; i++) {
      const [f, k] =
        i < 20 ? [(b & c) | (~b & d), 0x5a827999]
        : i < 40 ? [b ^ c ^ d, 0x6ed9eba1]
        : i < 60 ? [(b & c) | (b & d) | (c & d), 0x8f1bbcdc]
        : [b ^ c ^ d, 0xca62c1d6];
      const temp = (rotl(a, 5) + f + e + k + w[i]) | 0;
      e = d;
      d = c;
      c = rotl(b, 30);
      b = a;
      a = temp;
    }
    h0 = (h0 + a) | 0;
    h1 = (h1 + b) | 0;
    h2 = (h2 + c) | 0;
    h3 = (h3 + d) | 0;
    h4 = (h4 + e) | 0;
  }
  return [h0, h1, h2, h3, h4].flatMap((h) => [(h >>> 24) & 255, (h >>> 16) & 255, (h >>> 8) & 255, h & 255]);
}

/** Name-based UUID, version 5 (SHA-1), lowercase. */
export function uuidV5(name: string, namespace: string = NAMESPACE): string {
  const ns = namespace.replace(/-/g, '').match(/../g)!.map((h) => parseInt(h, 16));
  const hash = sha1([...ns, ...utf8(name)]).slice(0, 16);
  hash[6] = (hash[6] & 0x0f) | 0x50;
  hash[8] = (hash[8] & 0x3f) | 0x80;
  const hex = hash.map((b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/**
 * The uid of each event, in order. Two taps with the same tag in the same
 * second get different uids through their position among identical taps.
 */
export function eventUids(
  events: { tag_id: number; timestamp_absolute: string; time_match: string }[]
): string[] {
  const seen = new Map<string, number>();
  return events.map((e) => {
    const key = `${e.timestamp_absolute}|${e.tag_id}|${e.time_match}`;
    const n = seen.get(key) ?? 0;
    seen.set(key, n + 1);
    return uuidV5(n === 0 ? key : `${key}|${n}`);
  });
}
