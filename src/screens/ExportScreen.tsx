import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Palette, useTheme } from '../constants/theme';
import { exportAndShare } from '../services/exportService';
import { useConfigStore } from '../store/configStore';
import { useMatchStore } from '../store/matchStore';
import { EventRecord } from '../types';

export function ExportScreen() {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(c), [c]);

  const events = useMatchStore((s) => s.events);
  const injuryTime1 = useMatchStore((s) => s.injuryTime1);
  const injuryTime2 = useMatchStore((s) => s.injuryTime2);
  const phase = useMatchStore((s) => s.phase);
  const matchConfig = useConfigStore((s) => s.matchConfig);
  const tags = useConfigStore((s) => s.tags);

  const [busy, setBusy] = useState(false);

  const doExport = async (format: 'json' | 'csv') => {
    if (busy) return;
    setBusy(true);
    try {
      await exportAndShare(
        { matchConfig, tags, injuryTime1, injuryTime2, events },
        format
      );
    } catch (err) {
      Alert.alert(
        'Export failed',
        err instanceof Error ? err.message : 'Unknown error'
      );
    } finally {
      setBusy(false);
    }
  };

  const renderItem = ({ item, index }: { item: EventRecord; index: number }) => (
    <View style={styles.eventRow}>
      <Text style={styles.eventIndex}>{index + 1}</Text>
      <View style={styles.eventBody}>
        <Text style={styles.eventName}>{item.tag_name}</Text>
        <Text style={styles.eventTime}>
          {item.time_match} · continuous {item.time_continuous}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>
          {matchConfig.homeTeam} vs {matchConfig.awayTeam}
        </Text>
        <Text style={styles.summaryLine}>
          {events.length} events · injury time {injuryTime1}' + {injuryTime2}'
        </Text>
        {phase !== 'ended' && events.length > 0 && (
          <Text style={styles.warning}>
            Match not ended yet — export will contain partial data.
          </Text>
        )}
      </View>

      <View style={styles.btnRow}>
        <Pressable
          style={[styles.btn, (busy || events.length === 0) && styles.btnDisabled]}
          disabled={busy || events.length === 0}
          onPress={() => doExport('json')}
        >
          <Text style={styles.btnText}>Export JSON</Text>
        </Pressable>
        <Pressable
          style={[styles.btn, (busy || events.length === 0) && styles.btnDisabled]}
          disabled={busy || events.length === 0}
          onPress={() => doExport('csv')}
        >
          <Text style={styles.btnText}>Export CSV</Text>
        </Pressable>
      </View>

      <FlatList
        data={events}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 24 },
        ]}
        ListEmptyComponent={
          <Text style={styles.empty}>No events tagged yet.</Text>
        }
      />
    </View>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: c.bg,
  },
  summary: {
    backgroundColor: c.card,
    margin: 16,
    marginBottom: 0,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: c.border,
  },
  summaryTitle: {
    color: c.text,
    fontSize: 16,
    fontWeight: '700',
  },
  summaryLine: {
    color: c.textMuted,
    fontSize: 13,
    marginTop: 4,
  },
  warning: {
    color: c.warning,
    fontSize: 13,
    marginTop: 6,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
  },
  btn: {
    flex: 1,
    backgroundColor: c.accent,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnDisabled: {
    opacity: 0.4,
  },
  btnText: {
    color: c.onAccent,
    fontWeight: '800',
    fontSize: 15,
  },
  list: {
    paddingHorizontal: 16,
    // paddingBottom is applied inline, on top of the safe-area inset.
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: c.card,
    borderRadius: 10,
    padding: 10,
    marginBottom: 6,
    gap: 10,
  },
  eventIndex: {
    color: c.textMuted,
    width: 26,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
  },
  eventBody: {
    flex: 1,
  },
  eventName: {
    color: c.text,
    fontSize: 14,
    fontWeight: '600',
  },
  eventTime: {
    color: c.textMuted,
    fontSize: 12,
    marginTop: 1,
  },
  empty: {
    color: c.textMuted,
    textAlign: 'center',
    marginTop: 24,
    fontStyle: 'italic',
  },
});
