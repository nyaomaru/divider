import type { DividerResult, DividerInput } from '@/types';
import { isString } from '@/utils/is';

/**
 * Ensures that the input is returned as a string array.
 *
 * - If the input is a single string, it returns an array containing that string.
 * - If the input is already a string array, it is returned as-is.
 *
 * This utility is helpful for normalizing input types when both `string` and `string[]`
 * are supported.
 *
 * @param input - A string or array of strings
 * @returns A normalized string array
 */
export function ensureStringArray<T extends DividerInput>(
  input: T
): DividerResult<T> {
  return (isString(input) ? [input] : input) as DividerResult<T>;
}

/**
 * Extracts the first element from an array with a fallback value.
 *
 * @param array - The array to extract from
 * @param fallback - The fallback value if array is empty (default: '')
 * @returns The first element or fallback value
 */
export function getFirstElement<T>(array: readonly T[], fallback: T): T {
  return array[0] ?? fallback;
}

/**
 * Extracts the last element from an array with a fallback value.
 *
 * @param array - The array to extract from
 * @param fallback - The fallback value if array is empty (default: '')
 * @returns The last element or fallback value
 */
export function getLastElement<T>(array: readonly T[], fallback: T): T {
  return array.at(-1) ?? fallback;
}
