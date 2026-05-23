import type { DividerArgs, ExtractedDividerOptions } from '@/types';
import { extractOptions } from '@/utils/option';
import { classifySeparators } from '@/utils/separator';

/**
 * Parsed execution plan for a `divider` call.
 */
export type DividerPlan<TArgs extends DividerArgs> = {
  /** Numeric separators used as slice indexes */
  readonly numSeparators: readonly number[];
  /** String separators used as literal delimiters */
  readonly strSeparators: readonly string[];
  /** Trailing options extracted from the original arguments */
  readonly options: ExtractedDividerOptions<TArgs>;
};

/**
 * Converts variadic divider arguments into the normalized plan used at runtime.
 *
 * WHY: `divider` accepts a compact public argument shape, but execution needs
 * typed groups for numeric separators, string separators, and trailing options.
 * Keeping that translation in one place protects the public overload from
 * accumulating parsing details as additional separator behavior is added.
 *
 * @param args Variadic divider arguments.
 * @returns Normalized separator groups and extracted options.
 */
export function createDividerPlan<const TArgs extends DividerArgs>(
  args: TArgs,
): DividerPlan<TArgs> {
  const { cleanedArgs, options } = extractOptions(args);
  const { numSeparators, strSeparators } = classifySeparators(cleanedArgs);

  return {
    numSeparators,
    strSeparators,
    options,
  };
}
