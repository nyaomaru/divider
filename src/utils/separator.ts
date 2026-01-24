import type { DividerSeparators } from '@/types';
import { isString, isNumber } from '@/utils/is';

/**
 * Classifies a mixed array of strings and numbers into separate arrays.
 *
 * Useful when variadic arguments (e.g., separators) may include both
 * numeric index positions and string delimiters.
 *
 * @example
 * classifySeparators([2, '-', 4, ','])
 * // => { numSeparators: [2, 4], strSeparators: ['-', ','] }
 *
 * @param args - An array containing strings and/or numbers
 * @returns An object with `numSeparators` and `strSeparators` arrays
 */
export function classifySeparators(args: DividerSeparators) {
  return args.reduce<{ numSeparators: number[]; strSeparators: string[] }>(
    (acc, arg) => {
      if (isNumber(arg)) acc.numSeparators.push(arg);
      else if (isString(arg)) acc.strSeparators.push(arg);
      return acc;
    },
    { numSeparators: [], strSeparators: [] }
  );
}
