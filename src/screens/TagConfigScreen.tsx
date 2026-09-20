import React, { useMemo } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { TAG_COLOR_PALETTE } from '../constants/defaultTags';
import { Palette, useTheme } from '../constants/theme';
import { useConfigStore } from '../store/configStore';
import { TagConfig } from '../types';

export function TagConfigScreen() {
  const c = useTheme();
  const styles = useMemo(() => makeStyles(c), [c]);

  const tags = useConfigStore((s) => s.tags);
  const updateTag = useConfigStore((s) => s.updateTag);
  const resetTags = useConfigStore((s) => s.resetTags);

  const cycleColor = (tag: TagConfig) => {
    const idx = TAG_COLOR_PALETTE.indexOf(tag.color);
    const next =
      TAG_COLOR_PALETTE[(idx + 1) % TAG_COLOR_PALETTE.length] ??
      TAG_COLOR_PALETTE[0];
    updateTag(tag.id, { color: next });
  };

  const renderItem = ({ item }: { item: TagConfig }) => (
    <View style={[styles.row, !item.enabled && styles.rowDisabled]}>
      <Text style={styles.id}>{item.id}</Text>
      <Pressable
        style={[styles.colorDot, { backgroundColor: item.color }]}
        onPress={() => cycleColor(item)}
      />
      <TextInput
        style={styles.input}
        value={item.name}
        onChangeText={(name) => updateTag(item.id, { name })}
        maxLength={20}
        placeholder={`Tag ${item.id}`}
        placeholderTextColor={c.textMuted}
      />
      <Switch
        value={item.enabled}
        onValueChange={(enabled) => updateTag(item.id, { enabled })}
        trackColor={{ false: c.border, true: c.accentDark }}
        thumbColor={item.enabled ? c.accent : c.textMuted}
      />
    </View>
  );

  return (
    <View style={styles.screen}>
      <FlatList
        data={tags}
        keyExtractor={(t) => String(t.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={styles.note}>
            Tap the color dot to change color. Changes are saved automatically.
          </Text>
        }
        ListFooterComponent={
          <Pressable style={styles.resetBtn} onPress={resetTags}>
            <Text style={styles.resetText}>Reset to Defaults</Text>
          </Pressable>
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
  list: {
    padding: 16,
  },
  note: {
    color: c.textMuted,
    fontSize: 13,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: c.card,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
    gap: 10,
  },
  rowDisabled: {
    opacity: 0.5,
  },
  id: {
    color: c.textMuted,
    width: 22,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  colorDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  input: {
    flex: 1,
    color: c.text,
    fontSize: 15,
    paddingVertical: 6,
  },
  resetBtn: {
    backgroundColor: c.cardAlt,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  resetText: {
    color: c.danger,
    fontWeight: '700',
    fontSize: 15,
  },
});
