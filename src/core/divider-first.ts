import { selectDividerSegment } from '@/core/divider-segment';
import type { DividerInput, DividerSegmentArgs } from '@/types';

/**
 * Extracts the first segment after dividing the input using specified separators.
 *
 * @param input - A string or array of strings to divide
 * @param args - Separators and optional segment-processing options
 * @returns The first segment after division, or an empty string if no segments are found
 * @example
 * dividerFirst("hello-world", "-") // returns "hello"
 * dividerFirst("abc123def", 3) // returns "abc"
 */
export function dividerFirst(
  input: DividerInput,
  ...args: DividerSegmentArgs
): string {
  return selectDividerSegment(input, args, (segments) => segments[0]);
}
