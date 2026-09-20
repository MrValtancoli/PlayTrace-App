import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Palette, useTheme } from '../constants/theme';
import { formatMMSS, formatTimeContinuous, formatTimePeriod } from '../services/timeFormat';
import { useConfigStore } from '../store/configStore';
import { resolveFirstHalfSeconds, useMatchStore } from '../store/matchStore';

const PHASE_LABELS: Record<string, string> = {
  idle: 'Ready',
  first_half: '1st Half',
  half_time: 'Half Time',
  second_half: '2nd Half',
  ended: 'Full Time',
};

export function TimerDisplay() {
  const c = useTheme();
  const styles = useMemo(() => makeStyles(c), [c]);

  const phase = useMatchStore((s) => s.phase);
  const period = useMatchStore((s) => s.period);
  const isRunning = useMatchStore((s) => s.isRunning);
  const elapsed = useMatchStore((s) => s.elapsed);
  const injuryTime1 = useMatchStore((s) => s.injuryTime1);
  const firstHalfElapsed = useMatchStore((s) => s.firstHalfElapsed);
  const halfDuration = useConfigStore((s) => s.matchConfig.halfDuration);

  const inPlay = phase === 'first_half' || phase === 'second_half';
  const inInjuryTime = inPlay && elapsed > halfDuration * 60;

  let status = PHASE_LABELS[phase];
  if (inPlay) {
    status = `${PHASE_LABELS[phase]} · ${isRunning ? 'Running' : 'Paused'}`;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.status}>{status}</Text>
      <Text style={[styles.time, !isRunning && inPlay && styles.timePaused]}>
        {formatMMSS(elapsed)}
      </Text>
      {inInjuryTime && (
        <Text style={styles.injury}>
          {formatTimePeriod(elapsed, period, halfDuration)}
        </Text>
      )}
      {inPlay && period === 2 && (
        <Text style={styles.continuous}>
          Total:{' '}
          {formatTimeContinuous(
            elapsed,
            period,
            resolveFirstHalfSeconds({ firstHalfElapsed, injuryTime1 }, halfDuration)
          )}
        </Text>
      )}
    </View>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  status: {
    color: c.textMuted,
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 4,
  },
  time: {
    color: c.text,
    fontSize: 64,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  timePaused: {
    color: c.textMuted,
  },
  injury: {
    color: c.warning,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 2,
  },
  continuous: {
    color: c.textMuted,
    fontSize: 14,
    marginTop: 2,
  },
});
