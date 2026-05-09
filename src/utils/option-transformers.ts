import type { DividerInferredOptions } from '@/types';
import type { DividerOutput } from '@/utils/option-types';
import { resolveExcludePredicate } from '@/utils/option-exclude';
import {
  filterDividerOutput,
  mapDividerOutput,
  trimSegments,
} from '@/utils/option-output';
import { isNestedStringArray } from '@/utils/is';

/**
 * Trims segments when the `trim` option is enabled.
 * @param output Current divider output (flat or nested).
 * @param options Options to check for `trim`.
 * @param shouldPreserveEmpty When true, keep empty segments after trimming.
 * @returns Trimmed output when enabled; otherwise unchanged output.
 */
export function applyTrimOption(
  output: DividerOutput,
  options: DividerInferredOptions,
  shouldPreserveEmpty: boolean,
): DividerOutput {
  if (!options.trim) return output;
  return mapDividerOutput(output, (segments) =>
    trimSegments(segments, shouldPreserveEmpty),
  );
}

/**
 * Flattens nested rows when the `flatten` option is enabled.
 * @param output Current divider output (flat or nested).
 * @param options Options to check for `flatten`.
 * @returns Flattened output when enabled; otherwise unchanged output.
 */
export function applyFlattenOption(
  output: DividerOutput,
  options: DividerInferredOptions,
): DividerOutput {
  return options.flatten && isNestedStringArray(output) ? output.flat() : output;
}

/**
 * Applies exclude rules to filter out unwanted segments.
 * @param output Current divider output (flat or nested).
 * @param options Options that determine exclusion behavior.
 * @param shouldPreserveEmpty When true, keep empty rows after filtering.
 * @returns Filtered output based on exclude mode.
 */
export function applyExcludeOption(
  output: DividerOutput,
  options: DividerInferredOptions,
  shouldPreserveEmpty: boolean,
): DividerOutput {
  const shouldKeep = resolveExcludePredicate(options.exclude);
  return shouldKeep == null
    ? output
    : filterDividerOutput(output, shouldKeep, shouldPreserveEmpty);
}
