import type { DividerOptions, DividerExcludeMode } from '@/types';

/**
 * Checks whether the given argument is a string.
 */
export function isString(arg: unknown): arg is string {
  return typeof arg === 'string';
}

/**
 * Checks whether the given argument is a number.
 */
export function isNumber(arg: unknown): arg is number {
  return typeof arg === 'number';
}

/**
 * Checks whether the given argument is a valid DividerOptions object.
 * It must be a non-null object and contain at least one of the known option keys.
 */
export function isOptions(arg: unknown): arg is DividerOptions {
  if (typeof arg !== 'object' || arg === null) return false;

  return 'flatten' in arg || 'trim' in arg || 'exclude' in arg;
}

/**
 * Checks whether the given array is empty.
 */
export function isEmptyArray<T>(input: T[]): boolean {
  return Array.isArray(input) && input.length === 0;
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
export function isValidInput(input: unknown): input is string | string[] {
  return isString(input) || (Array.isArray(input) && input.every(isString));
}

/**
 * Checks whether the input is an array of strings.
 */
export function isStringArray(input: unknown): input is string[] {
  return Array.isArray(input) && input.every(isString);
}

/**
 * Checks whether the input is a non-empty, nested array of strings.
 */
export function isNestedStringArray(input: unknown): input is string[][] {
  return (
    Array.isArray(input) &&
    input.length > 0 &&
    Array.isArray(input[0]) &&
    input[0].length > 0 &&
    isStringArray(input[0])
  );
}

/**
 * Checks whether the given string contains only whitespace characters.
 */
export function isWhitespaceOnly(s: string): boolean {
  return s.trim() === '';
}

/**
 * Checks whether the given string is empty.
 */
export function isEmptyString(s: string): boolean {
  return s === '';
}

/**
 * Checks whether the given value is exactly the string 'none'.
 */
export function isNoneMode(mode: unknown): mode is 'none' {
  return mode === 'none';
}
