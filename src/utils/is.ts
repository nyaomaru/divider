import type { DividerOptions } from '@/types';
import { DIVIDER_EXCLUDE_MODES, DIVIDER_OPTION_KEYS } from '@/constants';

/**
 * Checks whether the given argument is a string.
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Checks whether the given argument is a number.
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

/**
 * Checks whether the given argument is an object.
 */
export function isObject(value: unknown): value is object {
  return typeof value === 'object' && value !== null;
}

/**
 * Checks whether the given argument is a valid DividerOptions object.
 * It must be a non-null object and contain at least one of the known option keys.
 */
export function isOptions(value: unknown): value is DividerOptions {
  if (!isObject(value)) return false;
  const options = value as Record<string, unknown>;

  return DIVIDER_OPTION_KEYS.some((key) => Object.hasOwn(options, key));
}

/**
 * Checks whether the given array is empty.
 */
export function isEmptyArray<T>(value: readonly T[]): boolean {
  return Array.isArray(value) && value.length === 0;
}

/**
 * Checks whether the given value is a positive integer.
 */
export function isPositiveInteger(value: unknown): boolean {
  return Number.isInteger(value) && (value as number) > 0;
}

/**
 * Checks whether the input is a string or an array of strings.
 */
export function isValidInput(value: unknown): value is string | string[] {
  return isString(value) || (Array.isArray(value) && value.every(isString));
}

/**
 * Checks whether the given value is a string or a number.
 */
export function isStringOrNumber(value: unknown): value is string | number {
  return isString(value) || isNumber(value);
}

/**
 * Checks whether the input is an array of strings.
 */
export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

/**
 * Checks whether the input is a non-empty, nested array of strings.
 */
export function isNestedStringArray(value: unknown): value is string[][] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    Array.isArray(value[0]) &&
    value[0].length > 0 &&
    isStringArray(value[0])
  );
}

/**
 * Checks whether the given string contains only whitespace characters.
 */
export function isWhitespaceOnly(value: string): boolean {
  return value.trim() === '';
}

/**
 * Checks whether the given string is empty.
 */
export function isEmptyString(value: string): boolean {
  return value === '';
}

/**
 * Checks whether the given value is exactly the string 'none'.
 */
export function isNoneMode(
  value: unknown
): value is typeof DIVIDER_EXCLUDE_MODES.NONE {
  return value === DIVIDER_EXCLUDE_MODES.NONE;
}
