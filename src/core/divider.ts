import type { DividerInput, DividerArgs, DividerReturn } from '@/types';
import { createStringDivider } from '@/utils/parser';
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
  if (isEmptyArray(args)) {
    if (!isValidInput(input)) {
      warnInvalidInput();
      return [];
    }

    return ensureStringArray(input);
  }

  const { numSeparators, strSeparators, options } = createDividerPlan(args);

  const applyDivision = createStringDivider(numSeparators, strSeparators, {
    preserveEmpty: options.preserveEmpty,
  });

  // WHY: All transforming divider APIs validate input through this shared
  // pipeline. The no-argument branch remains separate because it preserves
  // array input as-is instead of producing nested rows.
  return transformDividerInput(input, applyDivision, options);
}
