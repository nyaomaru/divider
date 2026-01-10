import { isEmptyArray, isEmptyString, isNumber } from '@/utils/is';
import { getRegex } from '@/utils/regex';
import { sliceByIndexes } from '@/utils/slice';
import { sortAscending } from '@/utils/sort';

type DivideStringOptions = {
  /** When true, keep empty segments produced by splitting. */
  readonly preserveEmpty?: boolean;
};

/**
 * Divides a string using both numeric index positions and string delimiters.
 *
 * - If no separators are provided, returns the input string as a single-element array.
 * - First, splits the string at given numeric index positions (sorted in ascending order).
 * - Then, further splits each resulting segment using the provided string delimiters (as regex).
 *
 * @param input - The input string to be divided.
 * @param numSeparators - An array of numeric index positions to slice the string at.
 * @param strSeparators - An array of string delimiters to further split the result.
 * @returns An array of divided string segments.
 */
export function divideString(
  input: string,
  numSeparators: readonly number[],
  strSeparators: readonly string[],
  options?: DivideStringOptions
): string[] {
  if (hasNoSeparators(numSeparators, strSeparators)) {
    return [input];
  }

  assertValidNumSeparators(numSeparators);

  // Precompile regex for string separators
  const regex = getRegex(strSeparators);
  const shouldPreserveEmpty = options?.preserveEmpty === true;

  // Divide by number delimiters
  const sortedNumSeparators = sortAscending(numSeparators);
  const parts: string[] = sliceByIndexes(input, sortedNumSeparators);

  // Divide by string delimiters
  const segments = regex ? parts.flatMap((part) => part.split(regex)) : parts;

  return shouldPreserveEmpty
    ? segments
    : segments.filter((segment) => !isEmptyString(segment));
}

/**
 * Checks whether both numeric and string separators are empty.
 * @param numSeparators Numeric separators to check.
 * @param strSeparators String separators to check.
 * @returns True when there are no separators.
 */
const hasNoSeparators = (
  numSeparators: readonly number[],
  strSeparators: readonly string[]
) => isEmptyArray(numSeparators) && isEmptyArray(strSeparators);

/**
 * Validates numeric separators before slicing.
 * @param numSeparators Numeric separator candidates.
 * @returns Throws when the separators are not numeric.
 */
const assertValidNumSeparators = (numSeparators: readonly number[]) => {
  if (!Array.isArray(numSeparators) || !numSeparators.every(isNumber)) {
    throw new Error('Invalid numeric separators');
  }
};
