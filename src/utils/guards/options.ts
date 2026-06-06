import type { DividerOptions } from '@/types';
import { DIVIDER_EXCLUDE_MODES, DIVIDER_OPTION_KEYS } from '@/constants';
import { isPlainObject } from '@/utils/guards/primitives';

/**
 * Validates that the value matches the DividerOptions contract.
 * @param value Value to inspect.
 * @returns True when the value owns at least one known option key.
 */
export function isOptions(value: unknown): value is DividerOptions {
  if (!isPlainObject(value)) return false;
  const options = value;

  return DIVIDER_OPTION_KEYS.some((key) => Object.hasOwn(options, key));
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
