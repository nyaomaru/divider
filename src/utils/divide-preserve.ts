import { divider } from '@/core/divider';
import { isEmptyString } from '@/utils/is';

/**
 * Divide a string by a single separator while preserving empty fields.
 *
 * WHY: This reuses the core divider behavior so delimiter handling stays
 * consistent with the rest of the library while keeping consecutive and
 * trailing empty segments intact.
 *
 * @param input Source string to divide. Empty string yields a single empty field.
 * @param separator Separator used to divide the string.
 * @returns Array of fields with consecutive and trailing empties preserved.
 */
export function dividePreserve(input: string, separator: string): string[] {
  if (isEmptyString(input)) return [''];
  return divider(input, separator, { preserveEmpty: true });
}
