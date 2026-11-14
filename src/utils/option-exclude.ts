import type { DividerInferredOptions } from '@/types';
import type { SegmentPredicate } from '@/utils/option-types';
import { excludePredicateMap } from '@/utils/exclude-predicate';
import { isNoneMode } from '@/utils/guards/options';
import { isString } from '@/utils/guards/primitives';

const isMappedExcludeMode = (
  value: string,
): value is keyof typeof excludePredicateMap =>
  Object.hasOwn(excludePredicateMap, value);

/**
 * Resolves a segment filter for the provided exclude mode.
 * @param exclude Exclude mode candidate.
 * @returns Predicate when the mode removes segments; otherwise null.
 */
export function resolveExcludePredicate(
  exclude: DividerInferredOptions['exclude'] | unknown,
): SegmentPredicate | null {
  // WHY: `none` already keeps every segment. Skipping the filter leaves the
  // existing array in place instead of copying it.
  if (!isString(exclude) || isNoneMode(exclude)) return null;
  if (!isMappedExcludeMode(exclude)) return null;

  return excludePredicateMap[exclude];
}
