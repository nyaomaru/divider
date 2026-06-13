import type {
  DividerInput,
  DividerEmptyOptions,
  DividerInferredOptions,
  DividerResult,
} from '@/types';
import { DIVIDER_EXCLUDE_MODES } from '@/constants';
import {
  applyExcludeOption,
  applyFlattenOption,
  applyTrimOption,
} from '@/utils/option-transformers';
import { isString } from '@/utils/guards/primitives';
import type {
  DividerOutput,
  ResolvedDividerOptions,
} from '@/utils/option-types';

export { extractOptions } from '@/utils/option-arguments';

const DEFAULT_RESOLVED_OPTIONS = {
  flatten: false,
  trim: false,
  preserveEmpty: false,
  exclude: DIVIDER_EXCLUDE_MODES.NONE,
} as const satisfies ResolvedDividerOptions;

const isDividerExcludeMode = (
  value: unknown,
): value is ResolvedDividerOptions['exclude'] =>
  isString(value) &&
  Object.values(DIVIDER_EXCLUDE_MODES).includes(
    value as ResolvedDividerOptions['exclude'],
  );

const resolveExcludeMode = (value: unknown): ResolvedDividerOptions['exclude'] =>
  isDividerExcludeMode(value) ? value : DEFAULT_RESOLVED_OPTIONS.exclude;

const resolveDividerOptions = (
  options: DividerInferredOptions,
): ResolvedDividerOptions => ({
  flatten: options.flatten === true,
  trim: options.trim === true,
  preserveEmpty: options.preserveEmpty === true,
  exclude: resolveExcludeMode(options.exclude),
});

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
  const resolvedOptions = resolveDividerOptions(options);
  let output: DividerOutput = result;

  output = applyTrimOption(output, resolvedOptions);
  output = applyFlattenOption(output, resolvedOptions);
  output = applyExcludeOption(output, resolvedOptions);

  return output as DividerResult<T, O>;
}
