import type {
  DividerInput,
  DividerEmptyOptions,
  DividerInferredOptions,
  DividerResult,
  DividerStringResult,
  DividerArrayResult,
  ExtractedDividerOptions,
  DividerSeparator,
  DividerArgs,
} from '@/types';
import {
  isOptions,
  isNestedStringArray,
  isNoneMode,
  isStringOrNumber,
  isEmptyString,
} from '@/utils/is';
import { excludePredicateMap } from '@/utils/exclude-predicate';

type DividerOutput = DividerStringResult | DividerArrayResult;
type SegmentTransformer = (segments: readonly string[]) => string[];

/**
 * Extracts trailing options from a mixed argument list.
 *
 * WHY: Centralize the common "last-arg may be options" pattern so callers can
 * keep their overloads and parsing logic simple and consistent.
 *
 * @param args Mixed arguments where the last item may be `DividerOptions`.
 * @returns Object with `cleanedArgs` (string/number separators only) and
 * `options` (inferred from `args` or an empty object).
 */
export function extractOptions<const TArgs extends DividerArgs>(
  args: TArgs,
): {
  cleanedArgs: DividerSeparator[];
  options: ExtractedDividerOptions<TArgs>;
} {
  const clonedArgs = [...args];
  const lastArg = clonedArgs.at(-1);

  const options = (
    isOptions(lastArg) ? (clonedArgs.pop(), lastArg) : {}
  ) as ExtractedDividerOptions<TArgs>;

  const cleanedArgs = clonedArgs.filter(isStringOrNumber);

  return {
    cleanedArgs,
    options,
  };
}

/**
 * Maps divider output while preserving its flat or nested shape.
 * @param output Divider output to transform.
 * @param transform Transformer applied to each row or flat segment list.
 * @returns Output with the original shape preserved.
 */
function mapDividerOutput(
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
function filterDividerOutput(
  output: DividerOutput,
  shouldKeep: (segment: string) => boolean,
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
 * Resolves a segment filter for the provided exclude mode.
 * @param exclude Exclude mode candidate.
 * @returns Predicate when the mode is supported; otherwise null.
 */
function resolveExcludePredicate(
  exclude: DividerInferredOptions['exclude'] | unknown,
): ((segment: string) => boolean) | null {
  if (exclude == null || isNoneMode(exclude) || typeof exclude !== 'string') {
    return null;
  }

  return Object.hasOwn(excludePredicateMap, exclude)
    ? excludePredicateMap[exclude as keyof typeof excludePredicateMap]
    : null;
}

/**
 * Trims segments while optionally preserving empty outputs.
 * WHY: centralize the flat trimming logic so higher-level option handling stays simple.
 * @param segments Segments to trim.
 * @param preserveEmpty When true, retain empty strings produced by trimming.
 * @returns Trimmed segments, optionally filtered.
 */
function trimSegments(
  segments: readonly string[],
  preserveEmpty: boolean,
): string[] {
  const trimmed = segments.map((segment) => segment.trim());
  return preserveEmpty
    ? trimmed
    : trimmed.filter((segment) => !isEmptyString(segment));
}

/**
 * Applies `DividerOptions` to a divided result.
 *
 * This function modifies the result array based on the given options:
 *
 * - If `trim` is enabled, all string segments are trimmed of surrounding whitespace.
 * - If `flatten` is enabled, nested arrays are flattened into a single-level array.
 *
 * @param result - The divided result to process (could be flat or nested).
 * @param options - The `DividerOptions` that determine how to modify the result.
 * @returns The processed result after applying the options.
 */
export function applyDividerOptions<
  T extends DividerInput,
  O extends DividerInferredOptions = DividerEmptyOptions,
>(
  result: DividerOutput,
  options: O,
): DividerResult<T, O> {
  const shouldPreserveEmpty = options.preserveEmpty === true;
  let output: DividerOutput = result;

  output = applyTrimOption(output, options, shouldPreserveEmpty);
  output = applyFlattenOption(output, options);
  output = applyExcludeOption(output, options, shouldPreserveEmpty);

  return output as DividerResult<T, O>;
}

/**
 * Trims segments when the `trim` option is enabled.
 * @param output Current divider output (flat or nested).
 * @param options Options to check for `trim`.
 * @param shouldPreserveEmpty When true, keep empty segments after trimming.
 * @returns Trimmed output when enabled; otherwise unchanged output.
 */
const applyTrimOption = (
  output: DividerOutput,
  options: DividerInferredOptions,
  shouldPreserveEmpty: boolean,
) => {
  if (!options.trim) return output;
  return mapDividerOutput(output, (segments) =>
    trimSegments(segments, shouldPreserveEmpty),
  );
};

/**
 * Flattens nested rows when the `flatten` option is enabled.
 * @param output Current divider output (flat or nested).
 * @param options Options to check for `flatten`.
 * @returns Flattened output when enabled; otherwise unchanged output.
 */
const applyFlattenOption = (
  output: DividerOutput,
  options: DividerInferredOptions,
) => (options.flatten && isNestedStringArray(output) ? output.flat() : output);

/**
 * Applies exclude rules to filter out unwanted segments.
 * @param output Current divider output (flat or nested).
 * @param options Options that determine exclusion behavior.
 * @param shouldPreserveEmpty When true, keep empty rows after filtering.
 * @returns Filtered output based on exclude mode.
 */
const applyExcludeOption = (
  output: DividerOutput,
  options: DividerInferredOptions,
  shouldPreserveEmpty: boolean,
) => {
  const shouldKeep = resolveExcludePredicate(options.exclude);
  return shouldKeep == null
    ? output
    : filterDividerOutput(output, shouldKeep, shouldPreserveEmpty);
};
