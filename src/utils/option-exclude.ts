import type { DividerInferredOptions } from '@/types';
import type { SegmentPredicate } from '@/utils/option-types';
import { excludePredicateMap } from '@/utils/exclude-predicate';
import { isNoneMode } from '@/utils/guards/options';

/**
 * Resolves a segment filter for the provided exclude mode.
 * @param exclude Exclude mode candidate.
 * @returns Predicate when the mode is supported; otherwise null.
 */
export function resolveExcludePredicate(
  exclude: DividerInferredOptions['exclude'] | unknown,
): SegmentPredicate | null {
  if (exclude == null || isNoneMode(exclude) || typeof exclude !== 'string') {
    return null;
  }

  return Object.hasOwn(excludePredicateMap, exclude)
    ? excludePredicateMap[exclude as keyof typeof excludePredicateMap]
    : null;
}
