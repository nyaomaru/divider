import { divider } from '@/core/divider';
import type { DividerStringResult } from '@/types';
import type { PathDividerOptions } from '@/types/preset';
import { dividePreserve } from '@/utils/quoted';
import { isEmptyString } from '@/utils/is';
import { PATH_SEPARATORS } from '@/constants';

/**
 * Divides a path string into segments using path separators.
 * @param input - The path string to divide
 * @param options - Configuration options for path division
 * @param options.trim - Whether to trim whitespace from segments
 * @param options.collapse - Whether to collapse consecutive separators and filter empty segments
 * @returns Array of path segments
 */
export function pathDivider(
  input: string,
  options: PathDividerOptions = {}
): DividerStringResult {
  const { trim = false, collapse = true } = options;

  if (isEmptyString(input)) return [''];

  const segments = buildPathSegments(input, collapse);
  const maybeTrimmed = trimSegments(segments, trim);
  return applyCollapseRules(maybeTrimmed, collapse);
}

/**
 * Builds path segments based on collapse behavior.
 * @param input Path string to divide.
 * @param collapse Whether to collapse consecutive separators.
 * @returns Divided path segments.
 */
const buildPathSegments = (input: string, collapse: boolean) =>
  collapse
    ? divider(input, PATH_SEPARATORS.SLASH, PATH_SEPARATORS.ALT)
    : dividePreserve(input, PATH_SEPARATORS.ALT).flatMap((part) =>
        dividePreserve(part, PATH_SEPARATORS.SLASH)
      );

/**
 * Optionally trims path segments based on the `trim` option.
 * @param segments Path segments to process.
 * @param trim Whether to trim each segment.
 * @returns Trimmed segments when enabled; otherwise original segments.
 */
const trimSegments = (segments: DividerStringResult, trim: boolean) =>
  trim ? segments.map((segment) => segment.trim()) : segments;

/**
 * Applies collapse rules to remove empty segments when enabled.
 * @param segments Path segments to process.
 * @param collapse Whether to filter empty segments.
 * @returns Segments with empty entries removed when enabled.
 */
const applyCollapseRules = (segments: DividerStringResult, collapse: boolean) =>
  collapse ? segments.filter((segment) => !isEmptyString(segment)) : segments;
