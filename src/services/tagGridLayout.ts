/**
 * Layout maths for the match tag grid (#37).
 *
 * The grid shows only the enabled tags and lets them share the whole grid
 * area, so a board with few tags gives big targets instead of small ones
 * surrounded by empty cells. Kept out of the component so it can be tested.
 */

/** Columns and rows for `count` buttons: as square an arrangement as possible. */
export function gridShape(count: number): { columns: number; rows: number } {
  if (count <= 0) return { columns: 0, rows: 0 };
  const columns = Math.ceil(Math.sqrt(count));
  return { columns, rows: Math.ceil(count / columns) };
}

/**
 * How many buttons sit in each row, top to bottom. Full rows first; whatever
 * is left goes in the last row, where the buttons stretch to fill the width.
 */
export function rowCounts(count: number): number[] {
  const { columns, rows } = gridShape(count);
  if (rows === 0) return [];
  const full = rows - 1;
  const counts = Array<number>(full).fill(columns);
  counts.push(count - columns * full);
  return counts;
}

/**
 * The height the grid occupies, kept the same whatever the number of tags:
 * that of the original 4x4 grid of square buttons. Rows then share it.
 */
export function gridHeight(width: number, gap: number, reference = 4): number {
  if (width <= 0) return 0;
  const cell = (width - gap * (reference - 1)) / reference;
  return cell * reference + gap * (reference - 1);
}

/** Height of one row, once `rows` rows share the grid height. */
export function rowHeight(
  totalHeight: number,
  rows: number,
  gap: number
): number {
  if (rows <= 0) return 0;
  return (totalHeight - gap * (rows - 1)) / rows;
}

/** Horizontal padding inside a tag button, on each side (TagGrid styles). */
export const BUTTON_PADDING = 6;

/**
 * Average width of a bold glyph as a fraction of the font size. An estimate:
 * the real width is only known after layout, which is too late to size by.
 */
const GLYPH_WIDTH = 0.6;

/** Characters in the longest word of a label; words break only at spaces. */
export function longestWordLength(label: string): number {
  return label
    .trim()
    .split(/\s+/)
    .reduce((max, word) => Math.max(max, Array.from(word).length), 0);
}

/**
 * Label size for a button of this size. Scales with the smaller side so text
 * grows with the button, within limits that stay readable and never overflow.
 *
 * With a label, the size also lets its longest word fit the button width on
 * one line: Android otherwise breaks a long single word mid-word on big
 * buttons, "Interceptio / n" (#58). Several words still use two lines.
 */
export function labelFontSize(
  buttonWidth: number,
  buttonHeight: number,
  label = ''
): number {
  const side = Math.min(buttonWidth, buttonHeight);
  let size = Math.min(24, Math.round(side * 0.17));
  const longest = longestWordLength(label);
  if (longest > 0) {
    const available = buttonWidth - BUTTON_PADDING * 2;
    size = Math.min(size, Math.floor(available / (longest * GLYPH_WIDTH)));
  }
  return Math.max(11, size);
}
