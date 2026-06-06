import { isPositiveInteger } from '@/utils/guards/primitives';

/**
 * Generates an array of index positions to divide a string into chunks.
 *
 * This function calculates split points by repeatedly adding the given `size`
 * starting from the specified `startOffset`. These split points can be used
 * with the `divider()` function to chunk a string.
 *
 * @param str - The target string to be divided
 * @param size - The chunk size (must be a positive integer)
 * @param startOffset - Optional starting index offset (default: 0)
 * @returns An array of index positions where the string should be split
 *
 * @example
 * generateIndexes('abcdefg', 2)       // → [2, 4, 6]
 * generateIndexes('abcdefg', 3, 1)    // → [4]
 */
export function generateIndexes(
  str: string,
  size: number,
  startOffset = 0
): number[] {
  if (!isPositiveInteger(size)) {
    console.warn('generateIndexes: size must be a positive integer');
    return [];
  }

  const result: number[] = [];
  for (let i = startOffset + size; i < str.length; i += size) {
    result.push(i);
  }
  return result;
}
