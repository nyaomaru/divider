import { selectDividerSegment } from '@/core/divider-segment';
import type { DividerInput, DividerSegmentArgs } from '@/types';

/**
 * Extracts a segment at the requested index after dividing the input.
 *
 * Negative indexes count backward from the final segment, matching
 * `Array.prototype.at` semantics.
 *
 * @param input String or array of strings to divide.
 * @param index Zero-based segment index to select.
 * @param args Separators and optional segment-processing options.
 * @returns Selected segment, or an empty string for an invalid or missing index.
 * @example
 * dividerAt('first/middle/last', 1, '/') // returns 'middle'
 * dividerAt('first/middle/last', -2, '/') // returns 'middle'
 */
export function dividerAt(
  input: DividerInput,
  index: number,
  ...args: DividerSegmentArgs
): string {
  if (!Number.isInteger(index)) return '';

  return selectDividerSegment(input, args, (segments) => segments.at(index));
}
