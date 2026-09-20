import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { DARK, useTheme } from '../constants/theme';
import { ExportScreen } from '../screens/ExportScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { MatchSetupScreen } from '../screens/MatchSetupScreen';
import { TagConfigScreen } from '../screens/TagConfigScreen';
import { TimerScreen } from '../screens/TimerScreen';
import { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const c = useTheme();
  const isDark = c === DARK;

  const theme = useMemo(() => {
    const base = isDark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        background: c.bg,
        card: c.card,
        text: c.text,
        primary: c.accent,
        border: c.border,
      },
    };
  }, [c, isDark]);

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: c.card },
          headerTintColor: c.text,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: c.bg },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MatchSetup"
          component={MatchSetupScreen}
          options={{ title: 'Match Info' }}
        />
        <Stack.Screen
          name="TagConfig"
          component={TagConfigScreen}
          options={{ title: 'Tag Configuration' }}
        />
        <Stack.Screen
          name="Timer"
          component={TimerScreen}
          options={{ title: 'Match' }}
        />
        <Stack.Screen
          name="Export"
          component={ExportScreen}
          options={{ title: 'Export' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
