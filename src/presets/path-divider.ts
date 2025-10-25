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

  const segments = collapse
    ? divider(input, PATH_SEPARATORS.SLASH, PATH_SEPARATORS.ALT)
    : dividePreserve(input, PATH_SEPARATORS.ALT).flatMap((part) =>
        dividePreserve(part, PATH_SEPARATORS.SLASH)
      );

  const maybeTrimmed = trim
    ? segments.map((segment) => segment.trim())
    : segments;

  return collapse
    ? maybeTrimmed.filter((segment) => !isEmptyString(segment))
    : maybeTrimmed;
}
