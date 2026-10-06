import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import de from './de.json';
import en from './en.json';
import es from './es.json';
import fr from './fr.json';
import it from './it.json';
import pt from './pt.json';

/**
 * UI translations (#39). en.json is the source of truth; every other file
 * mirrors its keys. Metro cannot discover files at runtime, so a new language
 * is added by importing its file and listing it here — the picker reads this
 * map.
 *
 * Export data is never translated: nothing in the export path reads from here.
 */
export const LANGUAGES = {
  en,
  it,
  es,
  pt, // Brazilian Portuguese
  fr,
  de,
} as const;

export type LanguageCode = keyof typeof LANGUAGES;

export const FALLBACK_LANGUAGE: LanguageCode = 'en';

export function isLanguageCode(code: string | null | undefined): code is LanguageCode {
  return code != null && Object.prototype.hasOwnProperty.call(LANGUAGES, code);
}

/** The first device language the app has, otherwise English. */
export function deviceLanguage(): LanguageCode {
  for (const locale of getLocales()) {
    if (isLanguageCode(locale.languageCode)) return locale.languageCode;
  }
  return FALLBACK_LANGUAGE;
}

/** The language in use: the one picked by the user, or the device's. */
export function resolveLanguage(picked: string | null): LanguageCode {
  return isLanguageCode(picked) ? picked : deviceLanguage();
}

i18n.use(initReactI18next).init({
  resources: Object.fromEntries(
    Object.entries(LANGUAGES).map(([code, strings]) => [code, { translation: strings }])
  ),
  lng: deviceLanguage(),
  fallbackLng: FALLBACK_LANGUAGE,
  interpolation: { escapeValue: false },
  returnNull: false,
});

export default i18n;
