import type { DividerOptions, DividerInput } from '@/types';
import { DIVIDER_EXCLUDE_MODES, DIVIDER_OPTION_KEYS } from '@/constants';

/**
 * Determines whether the provided value is a string.
 * @param value Value to inspect.
 * @returns True when the value is a string.
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Determines whether the provided value is a number.
 * @param value Value to inspect.
 * @returns True when the value is a number.
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

/**
 * Determines whether the provided value is an object excluding null.
 * @param value Value to inspect.
 * @returns True when the value is an object.
 */
export function isObject(value: unknown): value is object {
  return typeof value === 'object' && value !== null;
}

/**
 * Determines whether the value is a plain object with a simple prototype chain.
 * @param value Value to inspect.
 * @returns True when the value behaves like a plain object.
 */
export function isPlainObject(
  value: unknown
): value is Record<string, unknown> {
  if (!isObject(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === null || Object.getPrototypeOf(proto) === null;
}

/**
 * Validates that the value matches the DividerOptions contract.
 * @param value Value to inspect.
 * @returns True when the value owns at least one known option key.
 */
export function isOptions(value: unknown): value is DividerOptions {
  if (!isPlainObject(value)) return false;
  const options = value as Record<string, unknown>;

  return DIVIDER_OPTION_KEYS.some((key) => Object.hasOwn(options, key));
}

/**
 * Determines whether the provided array is empty.
 * @param value Array to inspect.
 * @returns True when the array contains no elements.
 */
export function isEmptyArray<T>(value: readonly T[]): boolean {
  return Array.isArray(value) && value.length === 0;
}

/**
 * Determines whether the provided value is a positive integer.
 * @param value Value to inspect.
 * @returns True when the value is an integer greater than zero.
 */
export function isPositiveInteger(value: unknown): boolean {
  return Number.isInteger(value) && (value as number) > 0;
}

/**
 * Determines whether the value is a string or readonly array of strings.
 * @param value Value to inspect.
 * @returns True when the value is a string or an array of strings.
 */
export function isValidInput(value: unknown): value is DividerInput {
  return isString(value) || (Array.isArray(value) && value.every(isString));
}

/**
 * Determines whether the value is a string or a number.
 * @param value Value to inspect.
 * @returns True when the value is a primitive string or number.
 */
export function isStringOrNumber(value: unknown): value is string | number {
  return isString(value) || isNumber(value);
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
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    Array.isArray(value[0]) &&
    value[0].length > 0 &&
    isStringArray(value[0])
  );
}

/**
 * Determines whether the provided string contains only whitespace characters.
 * @param value String to inspect.
 * @returns True when the string trims to an empty value.
 */
export function isWhitespaceOnly(value: string): boolean {
  return value.trim() === '';
}

/**
 * Determines whether the provided string is empty.
 * @param value String to inspect.
 * @returns True when the string length is zero.
 */
export function isEmptyString(value: string): boolean {
  return value === '';
}

/**
 * Determines whether the provided value matches the exclude mode `none`.
 * @param value Value to inspect.
 * @returns True when the value equals `none`.
 */
export function isNoneMode(
  value: unknown
): value is typeof DIVIDER_EXCLUDE_MODES.NONE {
  return value === DIVIDER_EXCLUDE_MODES.NONE;
}
