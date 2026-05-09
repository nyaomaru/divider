import type {
  DividerInput,
  DividerEmptyOptions,
  DividerInferredOptions,
  DividerResult,
} from '@/types';
import {
  applyExcludeOption,
  applyFlattenOption,
  applyTrimOption,
} from '@/utils/option-transformers';
import type { DividerOutput } from '@/utils/option-types';

export { extractOptions } from '@/utils/option-arguments';

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
