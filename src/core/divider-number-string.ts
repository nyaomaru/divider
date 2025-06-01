import { isString } from '@/utils/is';
import type { DividerOptions, DividerResult } from '@/types';
import { divideNumberString } from '@/utils/divide';
import { applyDividerOptions } from '@/utils/option';

/**
 * Divides a string or array of strings by separating numbers from non-numbers.
 * 
 * This function splits input by detecting transitions between numeric and non-numeric characters.
 * For example, "abc123def" would be split into ["abc", "123", "def"].
 * 
 * @param input - String or array of strings to divide
 * @param options - Optional configuration options for the division process
 * @returns Array of segments where numbers and non-numbers are separated
 * @example
 * dividerNumberString("abc123def") // returns ["abc", "123", "def"]
 * dividerNumberString("test42") // returns ["test", "42"]
 */
export function dividerNumberString<T extends string | string[]>(
  input: T,
  options?: DividerOptions
): DividerResult<T> {
  const result = isString(input)
    ? divideNumberString(input)
    : input.map(divideNumberString);

  return applyDividerOptions<T>(result, options ?? {});
}
