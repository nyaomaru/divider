import { divider } from '@/core/divider';
import type { DividerInput, DividerSeparators } from '@/types';

type DividerSegmentSelector = (segments: readonly string[]) => string | undefined;

/**
 * Divides input and selects a single segment from the flattened result.
 *
 * WHY: `dividerFirst` and `dividerLast` share the same setup: they always
 * flatten array input before choosing one value. Keeping that flow together
 * makes their public wrappers only describe which segment they select.
 *
 * @param input String or array of strings to divide.
 * @param args Separators used for division.
 * @param select Selector applied to the flattened divider result.
 * @returns Selected segment, or an empty string when no segment exists.
 */
export function selectDividerSegment(
  input: DividerInput,
  args: DividerSeparators,
  select: DividerSegmentSelector,
): string {
  const result = divider(input, ...args, { flatten: true });
  return select(result) ?? '';
}
