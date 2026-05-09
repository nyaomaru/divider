import type { DividerArrayResult, DividerStringResult } from '@/types';

/**
 * Runtime divider output before generic result casting.
 */
export type DividerOutput = DividerStringResult | DividerArrayResult;

/**
 * Transforms a flat row of divider segments.
 */
export type SegmentTransformer = (segments: readonly string[]) => string[];

/**
 * Determines whether a divider segment should be retained.
 */
export type SegmentPredicate = (segment: string) => boolean;
