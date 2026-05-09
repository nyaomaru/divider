import type {
  DividerOutput,
  SegmentPredicate,
  SegmentTransformer,
} from '@/utils/option-types';
import { isEmptyString, isNestedStringArray } from '@/utils/is';

/**
 * Maps divider output while preserving its flat or nested shape.
 * @param output Divider output to transform.
 * @param transform Transformer applied to each row or flat segment list.
 * @returns Output with the original shape preserved.
 */
export function mapDividerOutput(
  output: DividerOutput,
  transform: SegmentTransformer,
): DividerOutput {
  return isNestedStringArray(output) ? output.map(transform) : transform(output);
}

/**
 * Filters divider output while preserving shape and nested empty-row semantics.
 * @param output Divider output to filter.
 * @param shouldKeep Predicate used to retain segments.
 * @param preserveEmpty When true, retain nested rows that become empty.
 * @returns Filtered divider output.
 */
export function filterDividerOutput(
  output: DividerOutput,
  shouldKeep: SegmentPredicate,
  preserveEmpty: boolean,
): DividerOutput {
  if (!isNestedStringArray(output)) {
    return output.filter(shouldKeep);
  }

  const filteredRows = output.map((row) => row.filter(shouldKeep));
  return preserveEmpty
    ? filteredRows
    : filteredRows.filter((row) => row.length > 0);
}

/**
 * Trims segments while optionally preserving empty outputs.
 *
 * WHY: Centralize the flat trimming rule so higher-level option handling stays
 * focused on orchestration.
 *
 * @param segments Segments to trim.
 * @param preserveEmpty When true, retain empty strings produced by trimming.
 * @returns Trimmed segments, optionally filtered.
 */
export function trimSegments(
  segments: readonly string[],
  preserveEmpty: boolean,
): string[] {
  const trimmed = segments.map((segment) => segment.trim());
  return preserveEmpty
    ? trimmed
    : trimmed.filter((segment) => !isEmptyString(segment));
}
