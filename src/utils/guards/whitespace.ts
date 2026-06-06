import { TAB, WHITE_SPACE } from '@/constants';

/**
 * Determines whether the provided character is a space or tab.
 * @param value Character to inspect.
 * @returns True when the character is a space or tab.
 */
export function isSpaceOrTab(value: string): boolean {
  return value === WHITE_SPACE || value === TAB;
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
