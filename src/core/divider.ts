import type { DividerInput, DividerArgs, DividerReturn } from '@/types';
import { divideString } from '@/utils/parser';
import { isEmptyArray, isValidInput } from '@/utils/is';
import { ensureStringArray } from '@/utils/array';
import { extractOptions } from '@/utils/option';
import { classifySeparators } from '@/utils/separator';
import { transformDividerInput } from '@/utils/transform-divider-input';

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
    console.warn(
      "divider: 'input' must be a string or an array of strings. So returning an empty array.",
    );
    return [];
  }

  // Handle empty args case
  if (isEmptyArray(args)) {
    return ensureStringArray(input);
  }

  // Extract options and clean arguments
  const { cleanedArgs, options } = extractOptions(args);
  const { numSeparators, strSeparators } = classifySeparators(cleanedArgs);

  const applyDivision = (str: string) =>
    divideString(str, numSeparators, strSeparators, {
      preserveEmpty: options.preserveEmpty,
    });

  return transformDividerInput(input, applyDivision, options);
}
