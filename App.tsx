import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DARK, useTheme } from './src/constants/theme';
import { AppNavigator } from './src/navigation/AppNavigator';

/** Separate component so it can read the theme store via useTheme(). */
function ThemedStatusBar() {
  const c = useTheme();
  return <StatusBar style={c === DARK ? 'light' : 'dark'} />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemedStatusBar />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
