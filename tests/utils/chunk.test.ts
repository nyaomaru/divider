import {
  applyMaxChunks,
  shouldTruncateChunks,
  truncateChunksToMax,
} from '../../src/utils/chunk';

describe('shouldTruncateChunks', () => {
  it('returns false when maxChunks is 0 (no limit)', () => {
    expect(shouldTruncateChunks(['a', 'b', 'c'], 0)).toBe(false);
  });

  it('returns false when maxChunks is negative', () => {
    expect(shouldTruncateChunks(['a', 'b', 'c'], -1)).toBe(false);
  });

  it('returns false when maxChunks is equal to chunks length', () => {
    expect(shouldTruncateChunks(['a', 'b', 'c'], 3)).toBe(false);
  });

  it('returns false when maxChunks is greater than chunks length', () => {
    expect(shouldTruncateChunks(['a', 'b', 'c'], 10)).toBe(false);
  });

  it('returns true when 0 < maxChunks < chunks.length', () => {
    expect(shouldTruncateChunks(['a', 'b', 'c', 'd'], 3)).toBe(true);
    expect(shouldTruncateChunks(['a', 'b', 'c', 'd'], 1)).toBe(true);
  });

  it('returns false for NaN maxChunks (guarded by isNumber)', () => {
    expect(shouldTruncateChunks(['a', 'b', 'c'], Number('NaN'))).toBe(false);
  });
});

describe('truncateChunksToMax', () => {
  it('merges tail parts into the last chunk when maxChunks < length', () => {
    const input = ['ab', 'cd', 'ef', 'gh', 'ij'];

    const result = truncateChunksToMax(input, 3);

    expect(result).toEqual(['ab', 'cd', 'efghij']);
  });

  it('works when maxChunks = 1 (everything collapses into one chunk)', () => {
    const input = ['a', 'b', 'c', 'd'];

    const result = truncateChunksToMax(input, 1);

    expect(result).toEqual(['abcd']);
  });

  it('does not mutate the original array', () => {
    const input = ['a', 'b', 'c'];
    const copy = [...input];

    truncateChunksToMax(input, 2);

    expect(input).toEqual(copy);
  });

  it('preserves order when merging tail', () => {
    const input = ['x', 'y', 'z1', 'z2'];

    const result = truncateChunksToMax(input, 2);

    expect(result).toEqual(['x', 'yz1z2']);
  });

  it('handles unicode / multibyte content correctly', () => {
    const input = ['🍣', '寿', '司', '🍵'];

    const result = truncateChunksToMax(input, 2);

    expect(result).toEqual(['🍣', '寿司🍵']);
  });

  it('edge: maxChunks just below length merges only the last element', () => {
    const input = ['a', 'b', 'c', 'd'];

    const result = truncateChunksToMax(input, 3);

    expect(result).toEqual(['a', 'b', 'cd']);
  });
});

describe('applyMaxChunks', () => {
  it('returns a shallow copy when no limit applies', () => {
    const input = ['a', 'b', 'c'];

    const result = applyMaxChunks(input, 0);

    expect(result).toEqual(input);
    expect(result).not.toBe(input);
  });

  it('merges tail chunks when a limit applies', () => {
    const result = applyMaxChunks(['ab', 'cd', 'ef', 'gh'], 2);

    expect(result).toEqual(['ab', 'cdefgh']);
  });
});
