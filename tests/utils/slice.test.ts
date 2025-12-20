import { sliceByIndexes } from '../../src/utils/slice';

describe('sliceByIndexes', () => {
  test('slice string at given indexes', () => {
    expect(sliceByIndexes('hello world', [5])).toEqual(['hello', ' world']);
    expect(sliceByIndexes('hello world', [3, 6])).toEqual([
      'hel',
      'lo ',
      'world',
    ]);
  });

  test('returns entire string when no indexes provided', () => {
    expect(sliceByIndexes('hello world', [])).toEqual(['hello world']);
  });

  test('ignores out-of-bounds indexes', () => {
    expect(sliceByIndexes('hello world', [12])).toEqual(['hello world']);
    expect(sliceByIndexes('hello world', [-1, 2, 10])).toEqual([
      'he',
      'llo worl',
      'd',
    ]);
  });

  test('ignores duplicate and unordered indexes gracefully', () => {
    expect(sliceByIndexes('hello world', [2, 2, 4, 1, 4])).toEqual([
      'he',
      'll',
      'o world',
    ]);
  });

  test('handles empty string input', () => {
    expect(sliceByIndexes('', [2, 4])).toEqual([]);
  });

  test('does not create empty segments', () => {
    expect(sliceByIndexes('hello world', [0, 3, 6])).toEqual([
      'hel',
      'lo ',
      'world',
    ]);
  });
});
