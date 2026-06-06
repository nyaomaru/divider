import { isString } from '@/utils/guards/primitives';

/**
 * Determines whether the provided array is empty.
 * @param value Array to inspect.
 * @returns True when the array contains no elements.
 */
export function isEmptyArray<T>(value: readonly T[]): boolean {
  return Array.isArray(value) && value.length === 0;
}

/**
 * Determines whether the value is an array populated solely by strings.
 * @param value Value to inspect.
 * @returns True when the value is a string array.
 */
export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

/**
 * Determines whether the value is a non-empty nested array of strings.
 * @param value Value to inspect.
 * @returns True when the value is a nested string array.
 */
export function isNestedStringArray(value: unknown): value is string[][] {
  if (!Array.isArray(value) || value.length === 0) return false;
  const firstRow = value[0];
  // WHY: Divider outputs are trusted; checking only the first row avoids
  // a full scan while still distinguishing nested vs flat arrays.
  return Array.isArray(firstRow) && firstRow.every((item) => isString(item));
}
