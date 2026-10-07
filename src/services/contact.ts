import { Platform } from 'react-native';

/**
 * Contact links on the Home screen (#54). They only hand over to the mail app
 * or the browser: PlayTrace itself never makes a network call.
 */

export const CONTACT_EMAIL = 'support@zonacalciolab.it';
export const PROJECT_URL = 'https://github.com/MrValtancoli/PlayTrace-App';
export const ZONACALCIOLAB_URL = 'https://www.zonacalciolab.it';

export interface DeviceInfo {
  appVersion: string;
  os: string;
  osVersion: string;
  model: string;
}

/** What the running device reports about itself, for a problem report. */
export function currentDeviceInfo(appVersion: string): DeviceInfo {
  const constants = Platform.constants as {
    Release?: string;
    Brand?: string;
    Model?: string;
    systemName?: string;
  };
  if (Platform.OS === 'android') {
    const model = [constants.Brand, constants.Model].filter(Boolean).join(' ');
    return {
      appVersion,
      os: 'Android',
      osVersion: constants.Release ?? String(Platform.Version),
      model: model || 'unknown',
    };
  }
  return {
    appVersion,
    os: constants.systemName ?? 'iOS',
    osVersion: String(Platform.Version),
    model: 'unknown',
  };
}

/**
 * A mailto: link pre-filled with the details every report needs. The details
 * block stays in English whatever the UI language, like the export, so the
 * maintainer can read every report.
 */
export function problemReportMailto(info: DeviceInfo, intro: string): string {
  const subject = `PlayTrace ${info.appVersion} — problem report`;
  const body = [
    intro,
    '',
    '',
    '---',
    `App version: ${info.appVersion}`,
    `${info.os} version: ${info.osVersion}`,
    `Device: ${info.model}`,
  ].join('\n');
  return (
    `mailto:${CONTACT_EMAIL}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`
  );
}
