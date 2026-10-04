import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { KEYBOARD_BEHAVIOR } from '../constants/keyboard';
import { Palette, useTheme } from '../constants/theme';
import { isStartTimeValid, parseStartTime } from '../services/matchStart';

interface Props {
  visible: boolean;
  title: string;
  halfDuration: number;
  onConfirm: (elapsedSec: number) => void;
  onCancel: () => void;
}

/**
 * Starting a half that is already under way (#14): the analyst declares the
 * match time it has reached, and the half runs from there.
 */
export function StartTimeModal({
  visible,
  title,
  halfDuration,
  onConfirm,
  onCancel,
}: Props) {
  const c = useTheme();
  const styles = useMemo(() => makeStyles(c), [c]);

  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');

  const parsed = parseStartTime({ minutes, seconds });
  const valid = parsed !== null && isStartTimeValid(parsed, halfDuration);

  const reset = () => {
    setMinutes('');
    setSeconds('');
  };

  const confirm = () => {
    if (parsed === null || !valid) return;
    onConfirm(parsed);
    reset();
  };

  const cancel = () => {
    reset();
    onCancel();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <KeyboardAvoidingView
        behavior={KEYBOARD_BEHAVIOR}
        style={styles.backdrop}
      >
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>
            What time is the half already at?
          </Text>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={minutes}
              onChangeText={setMinutes}
              keyboardType="number-pad"
              maxLength={2}
              placeholder="00"
              placeholderTextColor={c.textMuted}
              accessibilityLabel="Minutes"
              selectTextOnFocus
              autoFocus
            />
            <Text style={styles.colon}>:</Text>
            <TextInput
              style={styles.input}
              value={seconds}
              onChangeText={setSeconds}
              keyboardType="number-pad"
              maxLength={2}
              placeholder="00"
              placeholderTextColor={c.textMuted}
              accessibilityLabel="Seconds"
              selectTextOnFocus
            />
          </View>

          <Text style={[styles.hint, !valid && styles.hintError]}>
            {valid
              ? 'The clock starts from this time.'
              : `Enter a time between 00:00 and ${halfDuration - 1}:59.`}
          </Text>

          <View style={styles.row}>
            <Pressable style={[styles.btn, styles.btnGhost]} onPress={cancel}>
              <Text style={styles.btnGhostText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.btn, styles.btnPrimary, !valid && styles.btnDisabled]}
              disabled={!valid}
              onPress={confirm}
            >
              <Text style={styles.btnPrimaryText}>Start</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: c.overlay,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    },
    card: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: c.card,
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: c.border,
    },
    title: {
      color: c.text,
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 4,
    },
    subtitle: {
      color: c.textMuted,
      fontSize: 14,
      marginBottom: 12,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    input: {
      flex: 1,
      backgroundColor: c.bg,
      color: c.text,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: c.border,
      fontSize: 28,
      fontWeight: '700',
      textAlign: 'center',
      paddingVertical: 10,
    },
    colon: {
      color: c.text,
      fontSize: 28,
      fontWeight: '700',
    },
    hint: {
      color: c.textMuted,
      fontSize: 13,
      marginTop: 10,
      marginBottom: 16,
    },
    hintError: {
      color: c.warning,
    },
    row: {
      flexDirection: 'row',
      gap: 10,
    },
    btn: {
      flex: 1,
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: 'center',
    },
    btnPrimary: {
      backgroundColor: c.accent,
    },
    btnDisabled: {
      opacity: 0.4,
    },
    btnPrimaryText: {
      color: c.onAccent,
      fontWeight: '700',
      fontSize: 16,
    },
    btnGhost: {
      backgroundColor: c.cardAlt,
    },
    btnGhostText: {
      color: c.text,
      fontWeight: '600',
      fontSize: 16,
    },
  });
