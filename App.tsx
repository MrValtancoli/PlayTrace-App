import { useLocales } from 'expo-localization';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DARK, useTheme } from './src/constants/theme';
import i18n, { resolveLanguage } from './src/i18n';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useConfigStore } from './src/store/configStore';

/** Separate component so it can read the theme store via useTheme(). */
function ThemedStatusBar() {
  const c = useTheme();
  return <StatusBar style={c === DARK ? 'light' : 'dark'} />;
}

/**
 * Keeps i18next on the picked language, or on the device's when none is
 * picked. useLocales re-renders when the device language changes.
 */
function LanguageSync() {
  const picked = useConfigStore((s) => s.language);
  const locales = useLocales();
  useEffect(() => {
    const language = resolveLanguage(picked);
    if (i18n.language !== language) i18n.changeLanguage(language);
  }, [picked, locales]);
  return null;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <LanguageSync />
      <ThemedStatusBar />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
