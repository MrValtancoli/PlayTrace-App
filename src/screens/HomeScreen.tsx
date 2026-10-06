import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Palette, ThemeMode, useTheme } from '../constants/theme';
import { LANGUAGES, LanguageCode, resolveLanguage } from '../i18n';
import { useConfigStore } from '../store/configStore';
import { useMatchStore } from '../store/matchStore';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const THEME_OPTIONS: ThemeMode[] = ['system', 'light', 'dark'];

const LANGUAGE_OPTIONS = Object.entries(LANGUAGES).map(([code, strings]) => ({
  code: code as LanguageCode,
  name: strings.language.name,
}));

export function HomeScreen({ navigation }: Props) {
  const c = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => makeStyles(c), [c]);
  // The Home screen hides the navigation header, so it owns its top inset.
  const insets = useSafeAreaInsets();
  const themeMode = useConfigStore((s) => s.themeMode);
  const setThemeMode = useConfigStore((s) => s.setThemeMode);
  const language = useConfigStore((s) => s.language);
  const setLanguage = useConfigStore((s) => s.setLanguage);
  const matchConfig = useConfigStore((s) => s.matchConfig);
  const phase = useMatchStore((s) => s.phase);
  const eventCount = useMatchStore((s) => s.events.length);

  const matchActive = phase !== 'idle';
  const currentLanguage = resolveLanguage(language);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 56, paddingBottom: insets.bottom + 24 },
      ]}
    >
      <Text style={styles.logo}>⚽ PlayTrace</Text>
      <Text style={styles.tagline}>{t('home.tagline')}</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          {t('common.versus', {
            home: matchConfig.homeTeam,
            away: matchConfig.awayTeam,
          })}
        </Text>
        <Text style={styles.cardLine}>
          {matchConfig.competition || t('home.noCompetition')}
          {matchConfig.venue ? ` · ${matchConfig.venue}` : ''}
        </Text>
        <Text style={styles.cardLine}>
          {matchConfig.date} ·{' '}
          {t('home.halves', { minutes: matchConfig.halfDuration })}
        </Text>
        <Text style={[styles.cardStatus, matchActive && styles.cardStatusActive]}>
          {t(`home.phase.${phase}`)}
          {matchActive ? ` · ${t('home.events', { count: eventCount })}` : ''}
        </Text>
      </View>

      <Pressable
        style={[styles.mainBtn]}
        onPress={() => navigation.navigate('Timer')}
      >
        <Text style={styles.mainBtnText}>
          {matchActive ? t('home.backToMatch') : t('home.goToMatch')}
        </Text>
      </Pressable>

      <View style={styles.row}>
        <Pressable
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('MatchSetup')}
        >
          <Text style={styles.secondaryBtnText}>{t('home.matchInfo')}</Text>
        </Pressable>
        <Pressable
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('TagConfig')}
        >
          <Text style={styles.secondaryBtnText}>{t('home.tagConfig')}</Text>
        </Pressable>
      </View>

      {eventCount > 0 && (
        <Pressable
          style={styles.exportBtn}
          onPress={() => navigation.navigate('Export')}
        >
          <Text style={styles.secondaryBtnText}>
            {t('home.export')} · {t('home.events', { count: eventCount })}
          </Text>
        </Pressable>
      )}

      <Text style={styles.themeLabel}>{t('home.appearance')}</Text>
      <View style={styles.themeRow}>
        {THEME_OPTIONS.map((mode) => {
          const active = themeMode === mode;
          return (
            <Pressable
              key={mode}
              style={[styles.themeBtn, active && styles.themeBtnActive]}
              onPress={() => setThemeMode(mode)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Text
                style={[styles.themeBtnText, active && styles.themeBtnTextActive]}
              >
                {t(`theme.${mode}`)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Each language is shown by its own name. Picking one never renames
          existing tags: only Reset to Defaults uses it (#39). */}
      <Text style={styles.themeLabel}>{t('home.language')}</Text>
      <View style={styles.themeRow}>
        {LANGUAGE_OPTIONS.map((opt) => {
          const active = currentLanguage === opt.code;
          return (
            <Pressable
              key={opt.code}
              style={[styles.themeBtn, active && styles.themeBtnActive]}
              onPress={() => setLanguage(opt.code)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Text
                style={[styles.themeBtnText, active && styles.themeBtnTextActive]}
              >
                {opt.name}
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
