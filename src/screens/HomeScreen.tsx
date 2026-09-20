import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Palette, ThemeMode, useTheme } from '../constants/theme';
import { useConfigStore } from '../store/configStore';
import { useMatchStore } from '../store/matchStore';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const PHASE_TEXT: Record<string, string> = {
  idle: 'No match in progress',
  first_half: 'Match in progress — 1st half',
  half_time: 'Match in progress — half time',
  second_half: 'Match in progress — 2nd half',
  ended: 'Match ended — ready to export',
};

const THEME_OPTIONS: { mode: ThemeMode; label: string }[] = [
  { mode: 'system', label: 'System' },
  { mode: 'light', label: 'Light' },
  { mode: 'dark', label: 'Dark' },
];

export function HomeScreen({ navigation }: Props) {
  const c = useTheme();
  const styles = useMemo(() => makeStyles(c), [c]);
  // The Home screen hides the navigation header, so it owns its top inset.
  const insets = useSafeAreaInsets();
  const themeMode = useConfigStore((s) => s.themeMode);
  const setThemeMode = useConfigStore((s) => s.setThemeMode);
  const matchConfig = useConfigStore((s) => s.matchConfig);
  const phase = useMatchStore((s) => s.phase);
  const eventCount = useMatchStore((s) => s.events.length);

  const matchActive = phase !== 'idle';

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 56, paddingBottom: insets.bottom + 24 },
      ]}
    >
      <Text style={styles.logo}>⚽ PlayTrace</Text>
      <Text style={styles.tagline}>Real-time football match tagging</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          {matchConfig.homeTeam} vs {matchConfig.awayTeam}
        </Text>
        <Text style={styles.cardLine}>
          {matchConfig.competition || 'No competition set'}
          {matchConfig.venue ? ` · ${matchConfig.venue}` : ''}
        </Text>
        <Text style={styles.cardLine}>
          {matchConfig.date} · {matchConfig.halfDuration}' halves
        </Text>
        <Text style={[styles.cardStatus, matchActive && styles.cardStatusActive]}>
          {PHASE_TEXT[phase]}
          {matchActive ? ` · ${eventCount} events` : ''}
        </Text>
      </View>

      <Pressable
        style={[styles.mainBtn]}
        onPress={() => navigation.navigate('Timer')}
      >
        <Text style={styles.mainBtnText}>
          {matchActive ? 'Back to Match' : 'Go to Match'}
        </Text>
      </Pressable>

      <View style={styles.row}>
        <Pressable
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('MatchSetup')}
        >
          <Text style={styles.secondaryBtnText}>Match Info</Text>
        </Pressable>
        <Pressable
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('TagConfig')}
        >
          <Text style={styles.secondaryBtnText}>Tag Config</Text>
        </Pressable>
      </View>

      {eventCount > 0 && (
        <Pressable
          style={styles.exportBtn}
          onPress={() => navigation.navigate('Export')}
        >
          <Text style={styles.secondaryBtnText}>
            Export · {eventCount} events
          </Text>
        </Pressable>
      )}

      <Text style={styles.themeLabel}>Appearance</Text>
      <View style={styles.themeRow}>
        {THEME_OPTIONS.map((opt) => {
          const active = themeMode === opt.mode;
          return (
            <Pressable
              key={opt.mode}
              style={[styles.themeBtn, active && styles.themeBtnActive]}
              onPress={() => setThemeMode(opt.mode)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Text
                style={[styles.themeBtnText, active && styles.themeBtnTextActive]}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: c.bg,
  },
  content: {
    padding: 20,
    // paddingTop is applied inline, on top of the safe-area inset.
  },
  logo: {
    color: c.text,
    fontSize: 36,
    fontWeight: '800',
    textAlign: 'center',
  },
  tagline: {
    color: c.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 44,
  },
  card: {
    backgroundColor: c.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: c.border,
    padding: 16,
    marginBottom: 20,
  },
  cardTitle: {
    color: c.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  cardLine: {
    color: c.textMuted,
    fontSize: 13,
    marginBottom: 2,
  },
  cardStatus: {
    color: c.textMuted,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
  },
  cardStatusActive: {
    color: c.accent,
  },
  mainBtn: {
    backgroundColor: c.accent,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 12,
  },
  mainBtnText: {
    color: c.onAccent,
    fontSize: 18,
    fontWeight: '800',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: c.cardAlt,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: c.text,
    fontSize: 15,
    fontWeight: '600',
  },
  exportBtn: {
    backgroundColor: c.cardAlt,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  themeLabel: {
    color: c.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 28,
    marginBottom: 8,
  },
  themeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  themeBtn: {
    flex: 1,
    backgroundColor: c.cardAlt,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: c.border,
  },
  themeBtnActive: {
    backgroundColor: c.accent,
    borderColor: c.accent,
  },
  themeBtnText: {
    color: c.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  themeBtnTextActive: {
    color: c.onAccent,
  },
});
