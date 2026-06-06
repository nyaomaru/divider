import { isEmptyString } from '@/utils/guards/whitespace';
import { getRegex } from '@/utils/regex';

/**
 * Divide a string by a single separator while preserving empty fields.
 *
 * WHY: Presets and quoted parsing need preserving split behavior without
 * depending on the public `divider` API. Reusing the regex builder keeps
 * delimiter escaping and normalization consistent with core division.
 *
 * @param input Source string to divide. Empty string yields a single empty field.
 * @param separator Separator used to divide the string.
 * @returns Array of fields with consecutive and trailing empties preserved.
 */
export function dividePreserve(input: string, separator: string): string[] {
  if (isEmptyString(input)) return [''];

  const regex = getRegex([separator]);
  return regex == null ? [input] : input.split(regex);
}
