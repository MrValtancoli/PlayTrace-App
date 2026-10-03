import React, { useMemo, useState } from 'react';
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Palette, useTheme } from '../constants/theme';
import {
  gridHeight,
  gridShape,
  labelFontSize,
  rowCounts,
  rowHeight,
} from '../services/tagGridLayout';
import { TagConfig } from '../types';

const GAP = 8;

interface Props {
  tags: TagConfig[];
  disabled: boolean;
  onTagPress: (tag: TagConfig) => void;
}

/**
 * The match tag grid. Only enabled tags are shown, and they share the whole
 * grid area so a short board gives big targets (#37). The footprint stays the
 * height of a 4x4 grid whatever the number of tags, so the screen does not
 * jump when a tag is switched on or off mid-match.
 */
export function TagGrid({ tags, disabled, onTagPress }: Props) {
  const c = useTheme();
  const styles = useMemo(() => makeStyles(c), [c]);
  const [width, setWidth] = useState(0);

  const enabled = useMemo(() => tags.filter((t) => t.enabled), [tags]);

  const onLayout = (e: LayoutChangeEvent) =>
    setWidth(e.nativeEvent.layout.width);

  const { rows } = gridShape(enabled.length);
  const height = gridHeight(width, GAP);
  const perRow = rowCounts(enabled.length);
  const rowH = rowHeight(height, rows, GAP);

  // Before the first layout pass the width is unknown; reserve the space and
  // draw nothing, rather than flashing a wrongly sized grid.
  const measured = width > 0 && enabled.length > 0;

  let index = 0;
  return (
    <View style={[styles.grid, { height: height || undefined }]} onLayout={onLayout}>
      {measured &&
        perRow.map((count, rowIndex) => {
          const buttonWidth = (width - GAP * (count - 1)) / count;
          const fontSize = labelFontSize(buttonWidth, rowH);
          const row = enabled.slice(index, index + count);
          index += count;

          return (
            <View
              key={rowIndex}
              style={[
                styles.row,
                { height: rowH, marginBottom: rowIndex < rows - 1 ? GAP : 0 },
              ]}
            >
              {row.map((tag) => (
                <Pressable
                  key={tag.id}
                  disabled={disabled}
                  onPress={() => onTagPress(tag)}
                  accessibilityRole="button"
                  accessibilityLabel={tag.name}
                  style={({ pressed }) => [
                    styles.button,
                    { backgroundColor: tag.color },
                    disabled && styles.buttonDisabled,
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <Text
                    style={[styles.label, { fontSize }]}
                    numberOfLines={2}
                    adjustsFontSizeToFit
                    minimumFontScale={0.7}
                  >
                    {tag.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          );
        })}

      {width > 0 && enabled.length === 0 && (
        <Text style={styles.empty}>
          No tags enabled — turn some on in Tag Configuration.
        </Text>
      )}
    </View>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    grid: {
      width: '100%',
    },
    row: {
      flexDirection: 'row',
      gap: GAP,
    },
    button: {
      flex: 1,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 6,
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
      fontWeight: '700',
      textAlign: 'center',
    },
    empty: {
      color: c.textMuted,
      textAlign: 'center',
      fontStyle: 'italic',
      marginTop: 24,
    },
  });
