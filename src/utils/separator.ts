import type { DividerSeparators } from '@/types';
import { isNumber, isString } from '@/utils/guards/primitives';

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
export function classifySeparators(args: DividerSeparators): {
  numSeparators: number[];
  strSeparators: string[];
} {
  const numSeparators: number[] = [];
  const strSeparators: string[] = [];

  for (const arg of args) {
    if (isNumber(arg)) numSeparators.push(arg);
    else if (isString(arg)) strSeparators.push(arg);
  }

  return { numSeparators, strSeparators };
}
