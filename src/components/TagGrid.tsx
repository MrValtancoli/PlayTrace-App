import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Palette, useTheme } from '../constants/theme';
import { TagConfig } from '../types';

interface Props {
  tags: TagConfig[];
  disabled: boolean;
  onTagPress: (tag: TagConfig) => void;
}

export function TagGrid({ tags, disabled, onTagPress }: Props) {
  const c = useTheme();
  const styles = useMemo(() => makeStyles(c), [c]);

  return (
    <View style={styles.grid}>
      {tags.map((tag) => {
        const inactive = disabled || !tag.enabled;
        return (
          <Pressable
            key={tag.id}
            disabled={inactive}
            onPress={() => onTagPress(tag)}
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: tag.enabled ? tag.color : c.card },
              inactive && styles.buttonDisabled,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text
              style={[styles.label, !tag.enabled && styles.labelDisabled]}
              numberOfLines={2}
            >
              {tag.enabled ? tag.name : ''}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    width: '23.5%',
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  buttonDisabled: {
    opacity: 0.35,
  },
  buttonPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.85,
  },
  label: {
    color: c.textOnTag,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  labelDisabled: {
    color: c.textMuted,
  },
});
