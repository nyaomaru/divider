import { divider } from '@/core/divider';
import { getLastElement } from '@/utils/array';
import type { DividerInput, DividerSeparators } from '@/types';

/**
 * Extracts the last segment after dividing the input using specified separators.
 *
 * @param input - A string or array of strings to divide
 * @param args - Array of separators (numbers/strings) to use for division
 * @returns The last segment after division, or an empty string if no segments are found
 * @example
 * dividerLast("hello-world", "-") // returns "world"
 * dividerLast("abc123def", "3") // returns "def"
 */
export function dividerLast(
  input: DividerInput,
  ...args: DividerSeparators
): string {
  const result = divider(input, ...args, { flatten: true });
  return getLastElement(result, '');
}
