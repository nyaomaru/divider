import type { DividerExcludeMode } from '@/types';
import {
  isEmptyString,
  isWhitespaceOnly,
} from '@/utils/guards/whitespace';

/**
 * A mapping of `exclude` modes to their corresponding filter predicates.
 *
 * - `'none'`: Accepts all strings (no filtering)
 * - `'empty'`: Filters out empty strings (`""`)
 * - `'whitespace'`: Filters out strings that contain only whitespace characters
 *   (e.g. `"   "`, `"\n"`, `"\t"`)
 *
 * Typically used with `Array.prototype.filter()` to remove undesired items
 * from divided results.
 */
export const excludePredicateMap: Record<
  DividerExcludeMode,
  (s: string) => boolean
> = {
  none: () => true,
  empty: (s) => !isEmptyString(s),
  whitespace: (s) => !isWhitespaceOnly(s),
};
