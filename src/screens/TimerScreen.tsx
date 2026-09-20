import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  Vibration,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { InjuryTimeModal } from '../components/InjuryTimeModal';
import { TagGrid } from '../components/TagGrid';
import { TimerDisplay } from '../components/TimerDisplay';
import { Palette, useTheme } from '../constants/theme';
import { useTimer } from '../hooks/useTimer';
import { useConfigStore } from '../store/configStore';
import { useMatchStore } from '../store/matchStore';
import { RootStackParamList, TagConfig } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Timer'>;

export function TimerScreen({ navigation }: Props) {
  useTimer();

  const c = useTheme();
  const styles = useMemo(() => makeStyles(c), [c]);
  const insets = useSafeAreaInsets();

  const phase = useMatchStore((s) => s.phase);
  const isRunning = useMatchStore((s) => s.isRunning);
  const events = useMatchStore((s) => s.events);
  const startFirstHalf = useMatchStore((s) => s.startFirstHalf);
  const startSecondHalf = useMatchStore((s) => s.startSecondHalf);
  const pause = useMatchStore((s) => s.pause);
  const resume = useMatchStore((s) => s.resume);
  const endFirstHalf = useMatchStore((s) => s.endFirstHalf);
  const endMatch = useMatchStore((s) => s.endMatch);
  const resetMatch = useMatchStore((s) => s.resetMatch);
  const logEvent = useMatchStore((s) => s.logEvent);
  const tags = useConfigStore((s) => s.tags);

  const [injuryModal, setInjuryModal] = useState<'half' | 'match' | null>(null);

  const inPlay = phase === 'first_half' || phase === 'second_half';
  const lastEvent = events.length > 0 ? events[events.length - 1] : null;

  const onTagPress = (tag: TagConfig) => {
    logEvent(tag);
    Vibration.vibrate(40);
  };

  const onInjuryConfirm = (minutes: number) => {
    if (injuryModal === 'half') {
      endFirstHalf(minutes);
    } else if (injuryModal === 'match') {
      endMatch(minutes);
    }
    setInjuryModal(null);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + 32 },
      ]}
    >
      <TimerDisplay />

      <View style={styles.controls}>
        {phase === 'idle' && (
          <Btn styles={styles} label="Start 1st Half" type="primary" onPress={startFirstHalf} />
        )}

        {inPlay && (
          <>
            {isRunning ? (
              <Btn styles={styles} label="Pause" type="ghost" onPress={pause} />
            ) : (
              <Btn styles={styles} label="Resume" type="primary" onPress={resume} />
            )}
            {phase === 'first_half' ? (
              <Btn
                styles={styles}
                label="End 1st Half"
                type="danger"
                onPress={() => setInjuryModal('half')}
              />
            ) : (
              <Btn
                styles={styles}
                label="End Match"
                type="danger"
                onPress={() => setInjuryModal('match')}
              />
            )}
          </>
        )}

        {phase === 'half_time' && (
          <Btn styles={styles} label="Start 2nd Half" type="primary" onPress={startSecondHalf} />
        )}

        {phase === 'ended' && (
          <>
            <Btn
              styles={styles}
              label="Export Data"
              type="primary"
              onPress={() => navigation.navigate('Export')}
            />
            <Btn styles={styles} label="New Match" type="ghost" onPress={resetMatch} />
          </>
        )}
      </View>

      <View style={styles.eventBar}>
        <Text style={styles.eventCount}>
          {events.length} event{events.length === 1 ? '' : 's'}
        </Text>
        {lastEvent && (
          <Text style={styles.lastEvent} numberOfLines={1}>
            Last: {lastEvent.tag_name} · {lastEvent.time_match}
          </Text>
        )}
      </View>

      <TagGrid tags={tags} disabled={!inPlay} onTagPress={onTagPress} />

      {!inPlay && phase !== 'ended' && (
        <Text style={styles.hint}>
          {phase === 'idle'
            ? 'Start the match to enable tagging'
            : 'Half time — start the 2nd half to resume tagging'}
        </Text>
      )}

      <InjuryTimeModal
        visible={injuryModal !== null}
        title={injuryModal === 'half' ? 'End 1st Half' : 'End Match'}
        onConfirm={onInjuryConfirm}
        onCancel={() => setInjuryModal(null)}
      />
    </ScrollView>
  );
}

type Styles = ReturnType<typeof makeStyles>;

function Btn({
  styles,
  label,
  type,
  onPress,
}: {
  styles: Styles;
  label: string;
  type: 'primary' | 'ghost' | 'danger';
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        type === 'primary' && styles.btnPrimary,
        type === 'ghost' && styles.btnGhost,
        type === 'danger' && styles.btnDanger,
        pressed && { opacity: 0.8 },
      ]}
    >
      <Text
        style={[
          styles.btnText,
          type === 'primary' ? styles.btnTextDark : styles.btnTextLight,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: c.bg,
  },
  content: {
    padding: 16,
    // paddingBottom is applied inline, on top of the safe-area inset.
  },
  controls: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  btn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnPrimary: {
    backgroundColor: c.accent,
  },
  btnGhost: {
    backgroundColor: c.cardAlt,
  },
  btnDanger: {
    backgroundColor: c.danger,
  },
  btnText: {
    fontSize: 15,
    fontWeight: '700',
  },
  btnTextDark: {
    color: c.onAccent,
  },
  btnTextLight: {
    color: c.text,
  },
  eventBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: c.card,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  eventCount: {
    color: c.accent,
    fontWeight: '700',
    fontSize: 13,
  },
  lastEvent: {
    color: c.textMuted,
    fontSize: 13,
    flexShrink: 1,
    marginLeft: 8,
  },
  hint: {
    color: c.textMuted,
    textAlign: 'center',
    marginTop: 12,
    fontSize: 13,
  },
});
