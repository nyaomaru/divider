import type { DividerInput } from '@/types';
import { isString } from '@/utils/guards/primitives';

const INVALID_INPUT_WARNING =
  "divider: 'input' must be a string or an array of strings. So returning an empty array.";

/**
 * Determines whether the value is a string or readonly array of strings.
 * @param value Value to inspect.
 * @returns True when the value is a string or an array of strings.
 */
export function isValidInput(value: unknown): value is DividerInput {
  return isString(value) || (Array.isArray(value) && value.every(isString));
}

/**
 * Warns when a runtime caller passes an unsupported divider input shape.
 * @returns Nothing.
 */
export function warnInvalidInput(): void {
  console.warn(INVALID_INPUT_WARNING);
}
