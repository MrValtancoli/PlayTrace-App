import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  Vibration,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { InjuryTimeModal } from '../components/InjuryTimeModal';
import { StartTimeModal } from '../components/StartTimeModal';
import { TeamSelector } from '../components/TeamSelector';
import { TagGrid } from '../components/TagGrid';
import { TimerDisplay } from '../components/TimerDisplay';
import { Palette, useTheme } from '../constants/theme';
import { useTimer } from '../hooks/useTimer';
import { canUndo } from '../services/eventEditing';
import { suggestedInjuryMinutes } from '../services/injuryTime';
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
  const halfDuration = useConfigStore((s) => s.matchConfig.halfDuration);
  const homeTeam = useConfigStore((s) => s.matchConfig.homeTeam);
  const awayTeam = useConfigStore((s) => s.matchConfig.awayTeam);
  const selectedTeam = useMatchStore((s) => s.selectedTeam);
  const teamLocked = useMatchStore((s) => s.teamLocked);
  const selectTeam = useMatchStore((s) => s.selectTeam);
  const toggleTeamLock = useMatchStore((s) => s.toggleTeamLock);
  const undoAvailable = useMatchStore((s) => s.undoAvailable);
  const undoLastEvent = useMatchStore((s) => s.undoLastEvent);

  // Brief confirmation of what Undo removed, e.g. "Corner removed".
  const [undoneLabel, setUndoneLabel] = useState<string | null>(null);
  useEffect(() => {
    if (undoneLabel === null) return;
    const id = setTimeout(() => setUndoneLabel(null), 3000);
    return () => clearTimeout(id);
  }, [undoneLabel]);

  const [injuryModal, setInjuryModal] = useState<'half' | 'match' | null>(null);
  const [injurySuggestion, setInjurySuggestion] = useState(0);

  // The suggestion is taken when End is pressed — the whistle — not when the
  // prompt is confirmed, so time spent in the prompt does not inflate it (#50).
  const openInjury = (which: 'half' | 'match') => {
    const { elapsed } = useMatchStore.getState();
    setInjurySuggestion(suggestedInjuryMinutes(elapsed, halfDuration));
    setInjuryModal(which);
  };
  const [lateStart, setLateStart] = useState<1 | 2 | null>(null);

  const inPlay = phase === 'first_half' || phase === 'second_half';
  const lastEvent = events.length > 0 ? events[events.length - 1] : null;

  const onTagPress = (tag: TagConfig) => {
    logEvent(tag);
    setUndoneLabel(null);
    Vibration.vibrate(40);
  };

  const onUndo = () => {
    const removed = undoLastEvent();
    if (removed) setUndoneLabel(`${removed.tag_name} removed`);
  };

  const undoEnabled = canUndo({
    phase,
    undoAvailable,
    eventCount: events.length,
  });

  /**
   * Abandoning or restarting a match throws away everything tagged so far, so
   * it always asks first when there is something to lose.
   */
  const confirmReset = () => {
    if (events.length === 0) {
      resetMatch();
      return;
    }
    Alert.alert(
      'Discard this match?',
      `${events.length} tagged event${events.length === 1 ? '' : 's'} will be ` +
        'deleted. Export first if you want to keep them.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: () => resetMatch() },
      ]
    );
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
          <>
            <Btn
              styles={styles}
              label="Start 1st Half"
              type="primary"
              onPress={() => startFirstHalf()}
            />
            <Btn
              styles={styles}
              label="Started late"
              type="ghost"
              onPress={() => setLateStart(1)}
            />
          </>
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
                onPress={() => openInjury('half')}
              />
            ) : (
              <Btn
                styles={styles}
                label="End Match"
                type="danger"
                onPress={() => openInjury('match')}
              />
            )}
          </>
        )}

        {phase === 'half_time' && (
          <>
            <Btn
              styles={styles}
              label="Start 2nd Half"
              type="primary"
              onPress={() => startSecondHalf()}
            />
            <Btn
              styles={styles}
              label="Started late"
              type="ghost"
              onPress={() => setLateStart(2)}
            />
          </>
        )}

        {phase === 'ended' && (
          <>
            <Btn
              styles={styles}
              label="Export Data"
              type="primary"
              onPress={() => navigation.navigate('Export')}
            />
            <Btn styles={styles} label="New Match" type="ghost" onPress={confirmReset} />
          </>
        )}
      </View>

      <View style={styles.eventBar}>
        <Text style={styles.eventCount}>
          {events.length} event{events.length === 1 ? '' : 's'}
        </Text>
        {undoneLabel ? (
          <Text style={styles.undone} numberOfLines={1}>
            {undoneLabel}
          </Text>
        ) : (
          lastEvent && (
            <Text style={styles.lastEvent} numberOfLines={1}>
              Last: {lastEvent.tag_name} · {lastEvent.time_match}
            </Text>
          )
        )}
        {inPlay && (
          <Pressable
            style={[styles.undo, !undoEnabled && styles.undoDisabled]}
            disabled={!undoEnabled}
            onPress={onUndo}
            accessibilityRole="button"
            accessibilityLabel="Undo the last event"
            hitSlop={8}
          >
            <Text style={styles.undoText}>Undo</Text>
          </Pressable>
        )}
      </View>

      <TeamSelector
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        selected={selectedTeam}
        locked={teamLocked}
        disabled={!inPlay}
        onSelect={selectTeam}
        onToggleLock={toggleTeamLock}
      />

      <TagGrid tags={tags} disabled={!inPlay} onTagPress={onTagPress} />

      {phase !== 'idle' && phase !== 'ended' && (
        <Pressable
          style={styles.discard}
          onPress={confirmReset}
          accessibilityRole="button"
        >
          <Text style={styles.discardText}>Discard match</Text>
        </Pressable>
      )}

      {!inPlay && phase !== 'ended' && (
        <Text style={styles.hint}>
          {phase === 'idle'
            ? 'Start the match to enable tagging'
            : 'Half time — start the 2nd half to resume tagging'}
        </Text>
      )}

      <StartTimeModal
        visible={lateStart !== null}
        title={lateStart === 2 ? 'Start 2nd Half late' : 'Start 1st Half late'}
        halfDuration={halfDuration}
        onConfirm={(elapsedSec) => {
          if (lateStart === 2) {
            startSecondHalf(elapsedSec);
          } else {
            startFirstHalf(elapsedSec);
          }
          setLateStart(null);
        }}
        onCancel={() => setLateStart(null)}
      />

      <InjuryTimeModal
        visible={injuryModal !== null}
        title={injuryModal === 'half' ? 'End 1st Half' : 'End Match'}
        suggestedMinutes={injurySuggestion}
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
    flexGrow: 1,
    textAlign: 'right',
    marginLeft: 8,
  },
  undone: {
    color: c.warning,
    fontSize: 13,
    fontWeight: '600',
    flexShrink: 1,
    flexGrow: 1,
    textAlign: 'right',
    marginLeft: 8,
  },
  undo: {
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: c.border,
  },
  undoDisabled: {
    opacity: 0.35,
  },
  undoText: {
    color: c.text,
    fontSize: 13,
    fontWeight: '700',
  },
  discard: {
    alignSelf: 'center',
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  discardText: {
    color: c.danger,
    fontSize: 14,
    fontWeight: '600',
  },
  hint: {
    color: c.textMuted,
    textAlign: 'center',
    marginTop: 12,
    fontSize: 13,
  },
});
