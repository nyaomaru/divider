import type { DividerInput, DividerArgs, DividerReturn } from '@/types';
import { divideString } from '@/utils/parser';
import { isEmptyArray } from '@/utils/guards/array';
import { isValidInput, warnInvalidInput } from '@/utils/guards/divider-input';
import { ensureStringArray } from '@/utils/array';
import { transformDividerInput } from '@/utils/transform-divider-input';
import { createDividerPlan } from '@/core/divider-plan';

/**
 * Main divider function that splits input based on numeric positions or string delimiters.
 *
 * This function can:
 * - Split a string or array of strings
 * - Use numeric positions and/or string delimiters
 * - Apply various options like flattening and trimming
 *
 * @param input - String or array of strings to divide
 * @param args - Array of separators (numbers/strings) and optional options object
 * @returns Divided string segments based on input type and options
 */
export function divider<
  T extends DividerInput,
  const TArgs extends DividerArgs,
>(input: T, ...args: TArgs): DividerReturn<T, TArgs>;
export function divider(input: DividerInput, ...args: DividerArgs) {
  // Validate input
  if (!isValidInput(input)) {
    warnInvalidInput();
    return [];
  }

  // Handle empty args case
  if (isEmptyArray(args)) {
    return ensureStringArray(input);
  }

  const { numSeparators, strSeparators, options } = createDividerPlan(args);

  const applyDivision = (str: string) =>
    divideString(str, numSeparators, strSeparators, {
      preserveEmpty: options.preserveEmpty,
    });

  return transformDividerInput(input, applyDivision, options);
}
