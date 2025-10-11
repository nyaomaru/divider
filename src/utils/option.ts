import type {
  DividerOptions,
  DividerResult,
  DividerStringResult,
  DividerArrayResult,
} from '@/types';
import {
  isOptions,
  isNestedStringArray,
  isNoneMode,
  isStringOrNumber,
} from '@/utils/is';
import { excludePredicateMap } from '@/utils/exclude-predicate';
import { DIVIDER_EXCLUDE_MODES } from '@/constants';

/**
 * Extracts `options` object and cleans argument list.
 *
 * This function processes a list of arguments which may include
 * an optional `DividerOptions` object at the end.
 *
 * - If the last argument is a valid `DividerOptions`, it is extracted and removed.
 * - The remaining arguments are filtered to keep only `string` or `number` types.
 *
 * @param args - An array of strings, numbers, or a `DividerOptions` object.
 * @returns An object containing:
 *   - `cleanedArgs`: An array of strings and numbers only.
 *   - `options`: The extracted `DividerOptions` object (or an empty object if none found).
 */
export function extractOptions(args: (string | number | DividerOptions)[]): {
  cleanedArgs: (string | number)[];
  options: DividerOptions;
} {
  const clonedArgs = [...args];
  const lastArg = clonedArgs.at(-1);

  const options = isOptions(lastArg)
    ? (clonedArgs.pop(), lastArg as DividerOptions)
    : {};

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
  return preserveEmpty ? trimmed : trimmed.filter((segment) => segment !== '');
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
export function applyDividerOptions<T extends string | readonly string[]>(
  result: DividerStringResult | DividerArrayResult,
  options: DividerOptions
): DividerResult<T> {
  let output = result;
  const shouldPreserveEmpty = options.preserveEmpty === true;

  // 1. Apply trim
  if (options.trim) {
    output = isNestedStringArray(output)
      ? trimNestedSegments(output, shouldPreserveEmpty)
      : trimSegments(output, shouldPreserveEmpty);
  }

  // 2. Apply flatten
  if (options.flatten) {
    output = output.flat();
  }

  // 3. Apply exclude rules
  if (!isNoneMode(options.exclude)) {
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

    output = isNestedStringArray(output)
      ? filterNested(output)
      : filterFlat(output);
  }

  return output as DividerResult<T>;
}
