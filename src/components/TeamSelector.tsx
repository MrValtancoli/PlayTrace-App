import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Palette, useTheme } from '../constants/theme';
import { teamLabel } from '../services/teamSelection';
import { TeamSide } from '../types';

interface Props {
  homeTeam: string;
  awayTeam: string;
  selected: TeamSide | null;
  locked: boolean;
  disabled: boolean;
  onSelect: (side: TeamSide) => void;
  onToggleLock: () => void;
}

/**
 * Optional home/away attribution for the next tagged event (#32).
 *
 * The selection clears after each event, so forgetting to choose leaves the
 * event unattributed instead of attributing it to the wrong side. The lock
 * keeps it, for a long spell of one team's play.
 */
export function TeamSelector({
  homeTeam,
  awayTeam,
  selected,
  locked,
  disabled,
  onSelect,
  onToggleLock,
}: Props) {
  const c = useTheme();
  const styles = useMemo(() => makeStyles(c), [c]);

  const side = (value: TeamSide) => {
    const active = selected === value;
    return (
      <Pressable
        key={value}
        style={[styles.side, active && styles.sideActive, disabled && styles.faded]}
        disabled={disabled}
        onPress={() => onSelect(value)}
        onLongPress={onToggleLock}
        accessibilityRole="button"
        accessibilityState={{ selected: active }}
        accessibilityLabel={teamLabel(value, homeTeam, awayTeam)}
      >
        <Text
          style={[styles.sideText, active && styles.sideTextActive]}
          numberOfLines={1}
        >
          {teamLabel(value, homeTeam, awayTeam)}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.row}>
      {side('home')}
      {side('away')}
      <Pressable
        style={[styles.lock, locked && styles.lockActive, disabled && styles.faded]}
        disabled={disabled}
        onPress={onToggleLock}
        accessibilityRole="button"
        accessibilityState={{ selected: locked }}
        accessibilityLabel={
          locked ? 'Unlock the team selection' : 'Lock the team selection'
        }
        accessibilityHint={
          locked
            ? 'The selected team stays after each event'
            : 'The selection clears after each event'
        }
      >
        <Text style={[styles.lockText, locked && styles.lockTextActive]}>
          {locked ? '🔒' : '🔓'}
        </Text>
      </Pressable>
    </View>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'stretch',
      gap: 8,
      marginBottom: 12,
    },
    side: {
      flex: 1,
      backgroundColor: c.cardAlt,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: c.border,
      paddingVertical: 10,
      paddingHorizontal: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sideActive: {
      backgroundColor: c.accent,
      borderColor: c.accent,
    },
    sideText: {
      color: c.textMuted,
      fontSize: 15,
      fontWeight: '600',
    },
    sideTextActive: {
      color: c.onAccent,
      fontWeight: '800',
    },
    lock: {
      width: 48,
      backgroundColor: c.cardAlt,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    lockActive: {
      borderColor: c.accent,
    },
    lockText: {
      fontSize: 18,
      opacity: 0.6,
    },
    lockTextActive: {
      opacity: 1,
    },
    faded: {
      opacity: 0.35,
    },
  });
