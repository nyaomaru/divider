import { divider } from '@/core/divider';
import type { DividerStringResult } from '@/types';
import type { LineDividerOptions } from '@/types/preset';

const LINE_SEPARATORS = ['\r\n', '\n', '\r'] as const;

/**
 * Divides text into lines across Windows, Unix, and legacy Mac line endings.
 * @param input Text to divide into lines.
 * @param options Configuration for line division.
 * @param options.trim Whether to trim whitespace from each line.
 * @param options.preserveEmpty Whether to preserve blank lines.
 * @returns Lines in their original order without newline characters.
 */
export function lineDivider(
  input: string,
  options: LineDividerOptions = {},
): DividerStringResult {
  // WHY: Blank lines carry document structure, so this preset preserves them
  // unless callers explicitly opt into the core divider's filtering behavior.
  const { trim = false, preserveEmpty = true } = options;

  return divider(input, ...LINE_SEPARATORS, { trim, preserveEmpty });
}
