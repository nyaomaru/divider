import type {
  DividerArrayResult,
  DividerOptions,
  DividerStringResult,
} from '@/types';

/**
 * Runtime divider output before generic result casting.
 */
export type DividerOutput = DividerStringResult | DividerArrayResult;

/**
 * Internal divider options after defaults and invalid runtime values are resolved.
 */
export type ResolvedDividerOptions = Required<DividerOptions>;

/**
 * Transforms a flat row of divider segments.
 */
export type SegmentTransformer = (segments: readonly string[]) => string[];

/**
 * Determines whether a divider segment should be retained.
 */
export type SegmentPredicate = (segment: string) => boolean;
