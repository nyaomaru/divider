import { isEmptyArray } from '@/utils/is';

/**
 * Slices a string into segments based on an array of index positions.
 *
 * Each index defines a cutting point. The string is sliced from the current
 * start position up to each index. Unsorted input is allowed: duplicate,
 * non-increasing (overlapping), and out-of-bounds indexes are ignored.
 *
 * @example
 * sliceByIndexes('hello world', [2, 5])
 * // => ['he', 'llo', ' world']
 *
 * @param input - The input string to slice.
 * @param indexes - An array of index positions to slice at. May be unsorted.
 * @returns An array of string segments.
 */
export function sliceByIndexes(
  input: string,
  indexes: readonly number[]
): string[] {
  if (isEmptyArray(indexes)) return [input];

  const parts: string[] = [];
  let start = 0;

  for (const index of indexes) {
    if (index <= start || input.length <= index) continue;
    parts.push(input.slice(start, index));
    start = index;
  }

  if (start < input.length) {
    parts.push(input.slice(start));
  }

  return parts;
}
