import type {
  DividerEmptyOptions,
  DividerInferredOptions,
  DividerInput,
  DividerResult,
} from '@/types';
import { divideNumberString } from '@/utils/divide';
import { transformDividerInput } from '@/utils/transform-divider-input';

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
export function dividerNumberString<
  T extends DividerInput,
  O extends DividerInferredOptions = DividerEmptyOptions,
>(input: T, options?: O): DividerResult<T, O> {
  return transformDividerInput(input, divideNumberString, options);
}
