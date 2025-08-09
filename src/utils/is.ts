import type { DividerOptions } from '@/types';
import { DividerExcludeModes, dividerOptionKeys } from '@/constants';

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
 * Checks whether the given argument is an object.
 */
export function isObject(arg: unknown): arg is object {
  return typeof arg === 'object' && arg !== null;
}

/**
 * Checks whether the given argument is a valid DividerOptions object.
 * It must be a non-null object and contain at least one of the known option keys.
 */
export function isOptions(value: unknown): value is DividerOptions {
  if (!isObject(value)) return false;
  const options = value as Record<string, unknown>;

  return dividerOptionKeys.some((key) => Object.hasOwn(options, key));
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
export function isNoneMode(
  mode: unknown
): mode is typeof DividerExcludeModes.NONE {
  return mode === DividerExcludeModes.NONE;
}

/**
 * Checks if a character represents an escaped quote in a string.
 *
 * An escaped quote is identified when the current character matches the quote character
 * and is immediately followed by the same quote character (e.g., "" in CSV or '' in SQL).
 */
export function isEscapedQuote(
  char: string,
  next: string,
  quoteChar: string
): boolean {
  return char === quoteChar && next === quoteChar;
}
