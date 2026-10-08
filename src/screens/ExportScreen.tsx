import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Palette, useTheme } from '../constants/theme';
import { ExportFormat, exportAndShare } from '../services/exportService';
import { buildPeriods } from '../services/periods';
import { teamLabel } from '../services/teamSelection';
import { useConfigStore } from '../store/configStore';
import { useMatchStore } from '../store/matchStore';
import { EventRecord } from '../types';

export function ExportScreen() {
  const c = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(c), [c]);

  const events = useMatchStore((s) => s.events);
  const injuryTime1 = useMatchStore((s) => s.injuryTime1);
  const injuryTime2 = useMatchStore((s) => s.injuryTime2);
  const firstHalfStart = useMatchStore((s) => s.firstHalfStart);
  const firstHalfElapsed = useMatchStore((s) => s.firstHalfElapsed);
  const secondHalfStart = useMatchStore((s) => s.secondHalfStart);
  const secondHalfElapsed = useMatchStore((s) => s.secondHalfElapsed);
  const phase = useMatchStore((s) => s.phase);
  const deleteEvent = useMatchStore((s) => s.deleteEvent);

  // Deleting cannot be undone, so it always asks first (#41).
  const confirmDelete = (item: EventRecord, index: number) =>
    Alert.alert(
      t('export.deleteTitle', { number: index + 1 }),
      t('export.deleteBody', { tag: item.tag_name, time: item.time_match }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('export.delete'),
          style: 'destructive',
          onPress: () => deleteEvent(index),
        },
      ]
    );
  const matchConfig = useConfigStore((s) => s.matchConfig);
  const tags = useConfigStore((s) => s.tags);
  const clipWindow = useConfigStore((s) => s.clipWindow);
  const setClipWindow = useConfigStore((s) => s.setClipWindow);

  // Edited as text so the field can be emptied while typing; stored as a
  // clamped number once the edit ends.
  const [leadText, setLeadText] = useState(String(clipWindow.lead));
  const [lagText, setLagText] = useState(String(clipWindow.lag));
  const commitWindow = () => {
    setClipWindow({ lead: Number(leadText) || 0, lag: Number(lagText) || 0 });
    const { clipWindow: saved } = useConfigStore.getState();
    setLeadText(String(saved.lead));
    setLagText(String(saved.lag));
  };

  const [busy, setBusy] = useState(false);

  const doExport = async (format: ExportFormat) => {
    if (busy) return;
    // A value still being typed counts, even if the field has not lost focus.
    if (format === 'xml') commitWindow();
    setBusy(true);
    try {
      const periodSource = {
        firstHalfStart,
        firstHalfElapsed,
        secondHalfStart,
        secondHalfElapsed,
      };
      await exportAndShare(
        {
          matchConfig,
          tags,
          injuryTime1,
          injuryTime2,
          periods: buildPeriods(periodSource),
          firstHalfElapsed,
          secondHalfElapsed,
          events,
        },
        format,
        useConfigStore.getState().clipWindow
      );
    } catch (err) {
      Alert.alert(
        t('export.failed'),
        err instanceof Error ? err.message : t('export.unknownError')
      );
    } finally {
      setBusy(false);
    }
  };

  const renderItem = ({ item, index }: { item: EventRecord; index: number }) => (
    <Pressable
      style={({ pressed }) => [styles.eventRow, pressed && styles.eventRowPressed]}
      onLongPress={() => confirmDelete(item, index)}
      delayLongPress={400}
      accessibilityRole="button"
      accessibilityHint={t('export.deleteHint')}
    >
      <Text style={styles.eventIndex}>{index + 1}</Text>
      <View style={styles.eventBody}>
        <View style={styles.eventHeader}>
          <Text style={styles.eventName} numberOfLines={1}>
            {item.tag_name}
          </Text>
          {/* Unattributed events show nothing: a placeholder could be read
              as a side (#47). */}
          {item.team && (
            <Text style={styles.eventTeam} numberOfLines={1}>
              {teamLabel(item.team, matchConfig.homeTeam, matchConfig.awayTeam, {
                home: t('team.home'),
                away: t('team.away'),
              })}
            </Text>
          )}
        </View>
        <Text style={styles.eventTime}>
          {t('export.eventTimes', {
            match: item.time_match,
            continuous: item.time_continuous,
          })}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>
          {t('common.versus', {
            home: matchConfig.homeTeam,
            away: matchConfig.awayTeam,
          })}
        </Text>
        <Text style={styles.summaryLine}>
          {t('export.summary', {
            count: events.length,
            first: injuryTime1,
            second: injuryTime2,
          })}
        </Text>
        {phase !== 'ended' && events.length > 0 && (
          <Text style={styles.warning}>
            {t('export.partialWarning')}
          </Text>
        )}
      </View>

      <View style={styles.btnRow}>
        <Pressable
          style={[styles.btn, (busy || events.length === 0) && styles.btnDisabled]}
          disabled={busy || events.length === 0}
          onPress={() => doExport('json')}
        >
          <Text style={styles.btnText}>{t('export.json')}</Text>
        </Pressable>
        <Pressable
          style={[styles.btn, (busy || events.length === 0) && styles.btnDisabled]}
          disabled={busy || events.length === 0}
          onPress={() => doExport('csv')}
        >
          <Text style={styles.btnText}>{t('export.csv')}</Text>
        </Pressable>
        <Pressable
          style={[styles.btn, (busy || events.length === 0) && styles.btnDisabled]}
          disabled={busy || events.length === 0}
          onPress={() => doExport('xml')}
        >
          <Text style={styles.btnText}>{t('export.xml')}</Text>
        </Pressable>
      </View>

      {/* XML clips are windows around each instant, set at export time (#40). */}
      <View style={styles.clipRow}>
        <Text style={styles.clipLabel}>{t('export.clipWindow')}</Text>
        <TextInput
          style={styles.clipInput}
          value={leadText}
          onChangeText={setLeadText}
          onEndEditing={commitWindow}
          keyboardType="number-pad"
          maxLength={2}
          selectTextOnFocus
          accessibilityLabel={t('export.clipBefore')}
        />
        <Text style={styles.clipUnit}>{t('export.clipBefore')}</Text>
        <TextInput
          style={styles.clipInput}
          value={lagText}
          onChangeText={setLagText}
          onEndEditing={commitWindow}
          keyboardType="number-pad"
          maxLength={2}
          selectTextOnFocus
          accessibilityLabel={t('export.clipAfter')}
        />
        <Text style={styles.clipUnit}>{t('export.clipAfter')}</Text>
      </View>

      <FlatList
        data={events}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 24 },
        ]}
        ListHeaderComponent={
          events.length > 0 ? (
            <Text style={styles.hint}>{t('export.listHint')}</Text>
          ) : null
        }
        ListEmptyComponent={
          <Text style={styles.empty}>{t('export.empty')}</Text>
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
  clipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    paddingHorizontal: 16,
    marginTop: -6,
    marginBottom: 8,
  },
  clipLabel: {
    color: c.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  clipInput: {
    minWidth: 40,
    backgroundColor: c.card,
    color: c.text,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: c.border,
    paddingVertical: 4,
    paddingHorizontal: 6,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  clipUnit: {
    color: c.textMuted,
    fontSize: 13,
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
  eventRowPressed: {
    opacity: 0.7,
  },
  hint: {
    color: c.textMuted,
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 8,
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
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  eventName: {
    color: c.text,
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 1,
  },
  eventTeam: {
    color: c.accent,
    fontSize: 12,
    fontWeight: '700',
    // Takes what is left after the tag name, so a long team name is cut
    // before the tag name is.
    flexShrink: 2,
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
