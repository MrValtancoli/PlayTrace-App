import { sha1, uuidV5 } from '../clipUid';

const hex = (bytes: number[]) => bytes.map((b) => b.toString(16).padStart(2, '0')).join('');

describe('clipUid', () => {
  it('computes SHA-1 like the standard test vectors', () => {
    expect(hex(sha1([]))).toBe('da39a3ee5e6b4b0d3255bfef95601890afd80709');
    expect(hex(sha1([...'abc'].map((c) => c.charCodeAt(0))))).toBe('a9993e364706816aba3e25717850c26c9cd0d89d');
  });

  it('builds RFC 9562 version 5 UUIDs', () => {
    // RFC 9562 example: DNS namespace and "www.example.com"
    expect(uuidV5('www.example.com', '6ba7b810-9dad-11d1-80b4-00c04fd430c8')).toBe(
      '2ed6657d-e927-568b-95e1-2665a8aea6a2'
    );
  });
});
