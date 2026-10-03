import {
  gridHeight,
  gridShape,
  labelFontSize,
  rowCounts,
  rowHeight,
} from '../tagGridLayout';

describe('gridShape', () => {
  // The layouts agreed in #37.
  it.each([
    [1, 1, 1],
    [2, 2, 1],
    [3, 2, 2],
    [4, 2, 2],
    [5, 3, 2],
    [6, 3, 2],
    [7, 3, 3],
    [8, 3, 3],
    [9, 3, 3],
    [10, 4, 3],
    [11, 4, 3],
    [12, 4, 3],
    [13, 4, 4],
    [14, 4, 4],
    [15, 4, 4],
    [16, 4, 4],
  ])('%i tags -> %i columns x %i rows', (count, columns, rows) => {
    expect(gridShape(count)).toEqual({ columns, rows });
  });

  it('has no shape with nothing to show', () => {
    expect(gridShape(0)).toEqual({ columns: 0, rows: 0 });
    expect(gridShape(-3)).toEqual({ columns: 0, rows: 0 });
  });

  it('always leaves room for every tag', () => {
    for (let n = 1; n <= 16; n++) {
      const { columns, rows } = gridShape(n);
      expect(columns * rows).toBeGreaterThanOrEqual(n);
    }
  });
});

describe('rowCounts', () => {
  it('fills the rows above and leaves the remainder last', () => {
    expect(rowCounts(3)).toEqual([2, 1]);
    expect(rowCounts(5)).toEqual([3, 2]);
    expect(rowCounts(7)).toEqual([3, 3, 1]);
    expect(rowCounts(10)).toEqual([4, 4, 2]);
  });

  it('is square when it can be', () => {
    expect(rowCounts(4)).toEqual([2, 2]);
    expect(rowCounts(9)).toEqual([3, 3, 3]);
    expect(rowCounts(16)).toEqual([4, 4, 4, 4]);
  });

  it('accounts for every tag, and never leaves an empty row', () => {
    for (let n = 1; n <= 16; n++) {
      const counts = rowCounts(n);
      expect(counts.reduce((a, b) => a + b, 0)).toBe(n);
      expect(Math.min(...counts)).toBeGreaterThan(0);
    }
  });

  it('is empty with nothing to show', () => {
    expect(rowCounts(0)).toEqual([]);
  });
});

describe('gridHeight', () => {
  // The footprint must not change with the number of tags: it stays the
  // height of the original 4x4 grid of squares.
  it('matches a 4x4 grid of square buttons', () => {
    // width 356, gap 8 -> cell 83 -> 4*83 + 3*8 = 356
    expect(gridHeight(356, 8)).toBeCloseTo(356);
  });

  it('does not depend on how many tags are enabled', () => {
    const h = gridHeight(300, 8);
    expect(gridHeight(300, 8)).toBe(h);
  });

  it('is zero before the grid has been measured', () => {
    expect(gridHeight(0, 8)).toBe(0);
  });
});

describe('rowHeight', () => {
  it('shares the height between rows, gaps excluded', () => {
    expect(rowHeight(356, 2, 8)).toBeCloseTo(174);
    expect(rowHeight(356, 1, 8)).toBeCloseTo(356);
  });

  it('reproduces the original square cells with 16 tags', () => {
    // 4 rows of the 4x4 reference: the row height equals the cell width,
    // so a full board looks exactly as it did before #37.
    const width = 356;
    const cell = (width - 8 * 3) / 4;
    expect(rowHeight(gridHeight(width, 8), 4, 8)).toBeCloseTo(cell);
  });

  it('gives fewer rows taller buttons', () => {
    expect(rowHeight(356, 2, 8)).toBeGreaterThan(rowHeight(356, 4, 8));
  });

  it('is zero with no rows', () => {
    expect(rowHeight(356, 0, 8)).toBe(0);
  });
});

describe('labelFontSize', () => {
  it('grows with the button', () => {
    expect(labelFontSize(174, 174)).toBeGreaterThan(labelFontSize(83, 83));
  });

  it('follows the smaller side, so wide flat buttons stay readable', () => {
    expect(labelFontSize(300, 60)).toBe(labelFontSize(60, 60));
  });

  it('stays within readable limits', () => {
    expect(labelFontSize(20, 20)).toBe(11);
    expect(labelFontSize(900, 900)).toBe(24);
  });
});
