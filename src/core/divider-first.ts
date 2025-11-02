import { divider } from '@/core/divider';
import { getFirstElement } from '@/utils/array';
import type { DividerInput, DividerSeparators } from '@/types';

/**
 * Extracts the first segment after dividing the input using specified separators.
 *
 * @param input - A string or array of strings to divide
 * @param args - Array of separators (numbers/strings) to use for division
 * @returns The first segment after division, or an empty string if no segments are found
 * @example
 * dividerFirst("hello-world", "-") // returns "hello"
 * dividerFirst("abc123def", 3) // returns "abc"
 */
export function dividerFirst(
  input: DividerInput,
  ...args: DividerSeparators
): string {
  const result = divider(input, ...args, { flatten: true });
  return getFirstElement(result, '');
}
