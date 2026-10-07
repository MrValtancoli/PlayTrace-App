import { CONTACT_EMAIL, DeviceInfo, problemReportMailto } from '../contact';

const info: DeviceInfo = {
  appVersion: '1.3.0',
  os: 'Android',
  osVersion: '14',
  model: 'Google Pixel 7',
};

/** Splits a mailto: link into its address and decoded parameters. */
function parse(url: string) {
  const [address, query] = url.replace(/^mailto:/, '').split('?');
  const params = Object.fromEntries(
    query.split('&').map((pair) => {
      const [key, value] = pair.split('=');
      return [key, decodeURIComponent(value)];
    })
  );
  return { address, params };
}

describe('problemReportMailto', () => {
  it('writes to the PlayTrace address', () => {
    expect(parse(problemReportMailto(info, 'Hi')).address).toBe(CONTACT_EMAIL);
  });

  it('names the app version in the subject', () => {
    const { params } = parse(problemReportMailto(info, 'Hi'));
    expect(params.subject).toBe('PlayTrace 1.3.0 — problem report');
  });

  it('starts with the intro and ends with the device details', () => {
    const { params } = parse(problemReportMailto(info, 'Describe the problem:'));
    expect(params.body.startsWith('Describe the problem:\n')).toBe(true);
    expect(params.body.endsWith(
      'App version: 1.3.0\nAndroid version: 14\nDevice: Google Pixel 7'
    )).toBe(true);
  });

  it('encodes characters that would break the link', () => {
    const url = problemReportMailto(info, 'A & B = C? 100%');
    expect(url).not.toMatch(/[ \n]/);
    expect(parse(url).params.body.startsWith('A & B = C? 100%')).toBe(true);
  });
});
