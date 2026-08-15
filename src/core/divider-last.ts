import { selectDividerSegment } from '@/core/divider-segment';
import type { DividerInput, DividerSegmentArgs } from '@/types';

/**
 * Extracts the last segment after dividing the input using specified separators.
 *
 * @param input - A string or array of strings to divide
 * @param args - Separators and optional segment-processing options
 * @returns The last segment after division, or an empty string if no segments are found
 * @example
 * dividerLast("hello-world", "-") // returns "world"
 * dividerLast("abc123def", "3") // returns "def"
 */
export function dividerLast(
  input: DividerInput,
  ...args: DividerSegmentArgs
): string {
  return selectDividerSegment(input, args, (segments) => segments.at(-1));
}
