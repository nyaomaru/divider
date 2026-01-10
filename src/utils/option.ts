import type {
  DividerInput,
  DividerEmptyOptions,
  DividerInferredOptions,
  DividerResult,
  DividerStringResult,
  DividerArrayResult,
  ExtractedDividerOptions,
  DividerArg,
  DividerSeparator,
} from '@/types';
import {
  isOptions,
  isNestedStringArray,
  isNoneMode,
  isStringOrNumber,
  isEmptyString,
} from '@/utils/is';
import { excludePredicateMap } from '@/utils/exclude-predicate';
import { DIVIDER_EXCLUDE_MODES } from '@/constants';

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
export function extractOptions<const TArgs extends readonly DividerArg[]>(
  args: TArgs
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
 * Trims segments while optionally preserving empty outputs.
 * WHY: centralize the flat trimming logic so higher-level option handling stays simple.
 * @param segments Segments to trim.
 * @param preserveEmpty When true, retain empty strings produced by trimming.
 * @returns Trimmed segments, optionally filtered.
 */
function trimSegments(
  segments: readonly string[],
  preserveEmpty: boolean
): string[] {
  const trimmed = segments.map((segment) => segment.trim());
  return preserveEmpty
    ? trimmed
    : trimmed.filter((segment) => !isEmptyString(segment));
}

/**
 * Trims nested rows of segments while optionally keeping empties.
 * WHY: reuse the flat helper so nested handling mirrors flat semantics before flattening.
 * @param rows Nested segment rows to trim.
 * @param preserveEmpty When true, retain empty strings in each row after trimming.
 * @returns Trimmed rows, optionally filtered per row.
 */
function trimNestedSegments(
  rows: readonly string[][],
  preserveEmpty: boolean
): string[][] {
  return rows.map((row) => trimSegments(row, preserveEmpty));
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
  result: DividerStringResult | DividerArrayResult,
  options: O
): DividerResult<T, O> {
  const shouldPreserveEmpty = options.preserveEmpty === true;
  let output = result;

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
  output: DividerStringResult | DividerArrayResult,
  options: DividerInferredOptions,
  shouldPreserveEmpty: boolean
) => {
  if (!options.trim) return output;
  return isNestedStringArray(output)
    ? trimNestedSegments(output, shouldPreserveEmpty)
    : trimSegments(output, shouldPreserveEmpty);
};

/**
 * Flattens nested rows when the `flatten` option is enabled.
 * @param output Current divider output (flat or nested).
 * @param options Options to check for `flatten`.
 * @returns Flattened output when enabled; otherwise unchanged output.
 */
const applyFlattenOption = (
  output: DividerStringResult | DividerArrayResult,
  options: DividerInferredOptions
) => (options.flatten ? output.flat() : output);

/**
 * Applies exclude rules to filter out unwanted segments.
 * @param output Current divider output (flat or nested).
 * @param options Options that determine exclusion behavior.
 * @param shouldPreserveEmpty When true, keep empty rows after filtering.
 * @returns Filtered output based on exclude mode.
 */
const applyExcludeOption = (
  output: DividerStringResult | DividerArrayResult,
  options: DividerInferredOptions,
  shouldPreserveEmpty: boolean
) => {
  if (isNoneMode(options.exclude)) return output;

  const exclude = options.exclude ?? DIVIDER_EXCLUDE_MODES.NONE;
  let shouldKeep: (s: string) => boolean = () => true;

  if (exclude in excludePredicateMap) {
    shouldKeep = excludePredicateMap[exclude];
  }

  const filterNested = (arr: DividerArrayResult) => {
    const filteredRows = arr.map((row) => row.filter(shouldKeep));
    return shouldPreserveEmpty
      ? filteredRows
      : filteredRows.filter((row) => row.length > 0);
  };

  const filterFlat = (arr: DividerStringResult) => arr.filter(shouldKeep);

  return isNestedStringArray(output)
    ? filterNested(output)
    : filterFlat(output);
};
