import type {
  DividerArrayResult,
  DividerEmptyOptions,
  DividerInferredOptions,
  DividerInput,
  DividerResult,
  DividerStringResult,
} from '@/types';
import { isString } from '@/utils/is';
import { applyDividerOptions } from '@/utils/option';

/**
 * Applies a string transformer to divider input and finalizes the result with
 * shared divider options.
 *
 * WHY: Core divider entry points all follow the same pipeline: transform each
 * input string, preserve nesting for `string[]`, then apply the shared option
 * handling. Centralizing that flow keeps those APIs focused on their own
 * parsing logic and reduces drift between implementations.
 *
 * @param input Divider input to transform.
 * @param transform String-level transformer used by the caller.
 * @param options Shared divider options applied after transformation.
 * @returns Divider result with the shape inferred from `input` and `options`.
 */
export function transformDividerInput<
  T extends DividerInput,
  O extends DividerInferredOptions = DividerEmptyOptions,
>(
  input: T,
  transform: (value: string) => DividerStringResult,
  options?: O,
): DividerResult<T, O> {
  const result: DividerStringResult | DividerArrayResult = isString(input)
    ? transform(input)
    : input.map(transform);

  const resolvedOptions = (options ?? {}) as O;

  return applyDividerOptions<T, O>(result, resolvedOptions);
}
