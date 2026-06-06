import type { DividerInput } from '@/types';
import { isString } from '@/utils/guards/primitives';

/**
 * Determines whether the value is a string or readonly array of strings.
 * @param value Value to inspect.
 * @returns True when the value is a string or an array of strings.
 */
export function isValidInput(value: unknown): value is DividerInput {
  return isString(value) || (Array.isArray(value) && value.every(isString));
}
