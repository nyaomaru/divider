import { isEmptyArray } from '@/utils/guards/array';
import { isNumber } from '@/utils/guards/primitives';
import { isEmptyString } from '@/utils/guards/whitespace';
import { getRegex } from '@/utils/regex';
import { sliceByIndexes } from '@/utils/slice';
import { sortAscending } from '@/utils/sort';

type DivideStringOptions = {
  /** When true, keep empty segments produced by splitting. */
  readonly preserveEmpty?: boolean;
};

type StringDivider = (input: string) => string[];

/**
 * Creates a reusable string divider from normalized separator groups.
 *
 * WHY: Array input applies the same separators to every string. Sorting numeric
 * indexes and resolving the separator regex here avoids repeating invariant
 * setup for each item while keeping the per-string operation focused on slicing.
 *
 * @param numSeparators Numeric index positions used to slice each input.
 * @param strSeparators String delimiters used to split each sliced part.
 * @param options Division behavior shared by every input.
 * @returns String transformer that applies the compiled separator configuration.
 */
export function createStringDivider(
  numSeparators: readonly number[],
  strSeparators: readonly string[],
  options?: DivideStringOptions,
): StringDivider {
  if (hasNoSeparators(numSeparators, strSeparators)) {
    return (input) => [input];
  }

  assertValidNumSeparators(numSeparators);

  const sortedNumSeparators = sortAscending(numSeparators);
  const regex = getRegex(strSeparators);
  const shouldPreserveEmpty = options?.preserveEmpty === true;

  return (input) => {
    const parts = sliceByIndexes(input, sortedNumSeparators);
    const segments = regex ? parts.flatMap((part) => part.split(regex)) : parts;

    return shouldPreserveEmpty
      ? segments
      : segments.filter((segment) => !isEmptyString(segment));
  };
}

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
 * @param options Division behavior for the input.
 * @returns An array of divided string segments.
 */
export function divideString(
  input: string,
  numSeparators: readonly number[],
  strSeparators: readonly string[],
  options?: DivideStringOptions,
): string[] {
  return createStringDivider(numSeparators, strSeparators, options)(input);
}

/**
 * Checks whether both numeric and string separators are empty.
 * @param numSeparators Numeric separators to check.
 * @param strSeparators String separators to check.
 * @returns True when there are no separators.
 */
const hasNoSeparators = (
  numSeparators: readonly number[],
  strSeparators: readonly string[],
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
