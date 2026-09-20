import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Palette, useTheme } from '../constants/theme';

interface Props {
  visible: boolean;
  title: string;
  onConfirm: (injuryMinutes: number) => void;
  onCancel: () => void;
}

export function InjuryTimeModal({ visible, title, onConfirm, onCancel }: Props) {
  const c = useTheme();
  const styles = useMemo(() => makeStyles(c), [c]);

  const [value, setValue] = useState('0');

  const confirm = () => {
    const minutes = parseInt(value, 10);
    onConfirm(Number.isFinite(minutes) ? minutes : 0);
    setValue('0');
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.backdrop}
      >
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>Injury time (minutes)</Text>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={setValue}
            keyboardType="number-pad"
            maxLength={2}
            selectTextOnFocus
            autoFocus
          />
          <View style={styles.row}>
            <Pressable style={[styles.btn, styles.btnGhost]} onPress={onCancel}>
              <Text style={styles.btnGhostText}>Cancel</Text>
            </Pressable>
            <Pressable style={[styles.btn, styles.btnPrimary]} onPress={confirm}>
              <Text style={styles.btnPrimaryText}>Confirm</Text>
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
    backgroundColor: 'rgba(0,0,0,0.7)',
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
  input: {
    backgroundColor: c.bg,
    color: c.text,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: c.border,
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    paddingVertical: 10,
    marginBottom: 16,
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
