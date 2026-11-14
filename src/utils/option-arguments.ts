import type {
  DividerArgs,
  DividerSeparator,
  ExtractedDividerOptions,
} from '@/types';
import { isOptions } from '@/utils/guards/options';
import { isStringOrNumber } from '@/utils/guards/primitives';

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
  const lastArg = args.at(-1);
  const hasTrailingOptions = isOptions(lastArg);
  // WHY: `filter` on a generic readonly tuple does not apply the separator
  // predicate. Copying first gives a plain array whose elements can narrow.
  const separatorArgs = hasTrailingOptions ? args.slice(0, -1) : args;
  const cleanedArgs = [...separatorArgs].filter(isStringOrNumber);

  return {
    cleanedArgs,
    options: (hasTrailingOptions
      ? lastArg
      : {}) as ExtractedDividerOptions<TArgs>,
  };
}
