import React, { useMemo } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Palette, useTheme } from '../constants/theme';
import { useConfigStore } from '../store/configStore';
import { MatchConfig } from '../types';

type Styles = ReturnType<typeof makeStyles>;

interface FieldProps {
  styles: Styles;
  mutedColor: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'number-pad';
}

function Field({
  styles,
  mutedColor,
  label,
  value,
  onChange,
  placeholder,
  keyboardType,
}: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={mutedColor}
        keyboardType={keyboardType ?? 'default'}
      />
    </View>
  );
}

export function MatchSetupScreen() {
  const c = useTheme();
  const styles = useMemo(() => makeStyles(c), [c]);
  const matchConfig = useConfigStore((s) => s.matchConfig);
  const setMatchConfig = useConfigStore((s) => s.setMatchConfig);

  const update = (key: keyof MatchConfig) => (v: string) =>
    setMatchConfig({ [key]: v });

  const updateHalfDuration = (v: string) => {
    const n = parseInt(v, 10);
    setMatchConfig({ halfDuration: Number.isFinite(n) && n > 0 ? n : 45 });
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.note}>Changes are saved automatically.</Text>
        <Field
          styles={styles}
          mutedColor={c.textMuted}
          label="Competition"
          value={matchConfig.competition}
          onChange={update('competition')}
          placeholder="e.g. Serie A"
        />
        <Field
          styles={styles}
          mutedColor={c.textMuted}
          label="Date (YYYY-MM-DD)"
          value={matchConfig.date}
          onChange={update('date')}
          placeholder="2026-06-10"
        />
        <Field
          styles={styles}
          mutedColor={c.textMuted}
          label="Venue"
          value={matchConfig.venue}
          onChange={update('venue')}
          placeholder="e.g. San Siro"
        />
        <Field
          styles={styles}
          mutedColor={c.textMuted}
          label="Home Team"
          value={matchConfig.homeTeam}
          onChange={update('homeTeam')}
        />
        <Field
          styles={styles}
          mutedColor={c.textMuted}
          label="Away Team"
          value={matchConfig.awayTeam}
          onChange={update('awayTeam')}
        />
        <Field
          styles={styles}
          mutedColor={c.textMuted}
          label="Half Duration (minutes)"
          value={String(matchConfig.halfDuration)}
          onChange={updateHalfDuration}
          keyboardType="number-pad"
        />
      </ScrollView>
    </KeyboardAvoidingView>
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
  },
  note: {
    color: c.textMuted,
    fontSize: 13,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  field: {
    marginBottom: 16,
  },
  label: {
    color: c.textMuted,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: c.card,
    color: c.text,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: c.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
});
