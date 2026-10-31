import {
  isNonNegativeInteger,
  isPositiveInteger,
} from '@/utils/guards/primitives';
import { generateIndexes } from '@/utils/generate-indexes';
import { sliceByIndexes } from '@/utils/slice';
import { applyMaxChunks } from '@/utils/chunk';
import type {
  DividerInput,
  DividerLoopEmptyOptions,
  DividerLoopOptions,
  DividerLoopOptionsLike,
  DividerResult,
} from '@/types';
import { PERFORMANCE_CONSTANTS } from '@/constants';
import { transformDividerInput } from '@/utils/transform-divider-input';

type ResolvedDividerLoopOptions = Required<
  Pick<DividerLoopOptions, 'startOffset' | 'maxChunks'>
>;

const DEFAULT_DIVIDER_LOOP_OPTIONS = {
  startOffset: PERFORMANCE_CONSTANTS.DEFAULT_START_OFFSET,
  maxChunks: PERFORMANCE_CONSTANTS.DEFAULT_MAX_CHUNKS,
} as const satisfies ResolvedDividerLoopOptions;

/**
 * Resolves loop-specific options to concrete runtime values.
 * @param options Optional divider loop configuration.
 * @returns Start offset and max chunk settings with defaults applied.
 */
function resolveDividerLoopOptions(
  options?: DividerLoopOptionsLike
): ResolvedDividerLoopOptions {
  const startOffset = options?.startOffset;
  const maxChunks = options?.maxChunks;

  // WHY: Numeric options can arrive from untyped JavaScript callers. Passing a
  // fractional offset to `divider` eventually creates invalid slice indexes,
  // while fractional chunk limits are coerced inconsistently by `Array#slice`.
  return {
    startOffset: isNonNegativeInteger(startOffset)
      ? startOffset
      : DEFAULT_DIVIDER_LOOP_OPTIONS.startOffset,
    maxChunks: isNonNegativeInteger(maxChunks)
      ? maxChunks
      : DEFAULT_DIVIDER_LOOP_OPTIONS.maxChunks,
  };
}

/**
 * Splits the input string into chunks based on size and offset,
 * and optionally truncates the result if it exceeds maxChunks.
 *
 * @param str - The input string to chunk
 * @param size - The size of each chunk
 * @param startOffset - The starting offset for chunking
 * @param maxChunks - The maximum number of chunks to allow
 * @returns An array of string chunks, possibly truncated
 */
function createChunksFromString(
  str: string,
  size: number,
  startOffset: number,
  maxChunks: number
): string[] {
  // WHY: These indexes are already sorted integers. Slicing directly avoids
  // sending them back through `divider`, which would reclassify separators and
  // apply a second default option pass before maxChunks can merge the tail.
  const indexes = generateIndexes(str, size, startOffset);
  const chunks = sliceByIndexes(str, indexes);

  return applyMaxChunks(chunks, maxChunks);
}

/**
 * Divides input into chunks of specified size with optional configuration.
 *
 * This function provides a way to split input into equal-sized chunks with additional control:
 * - Can specify starting offset for the chunking
 * - Can limit the maximum number of chunks produced
 * - Supports both string and array inputs
 * - When maxChunks is specified, remaining content is merged into the last chunk
 *
 * @param input - String or array of strings to divide into chunks
 * @param size - Size of each chunk
 * @param options - Configuration options for chunking behavior
 * @param options.startOffset - Starting position for the first chunk (default: 0)
 * @param options.maxChunks - Maximum number of chunks to produce (default: 0 = no limit)
 * @returns Array of chunks based on input type and options
 * @example
 * dividerLoop("abcdef", 2) // returns ["ab", "cd", "ef"]
 * dividerLoop("abcdef", 2, { maxChunks: 2 }) // returns ["ab", "cdef"]
 */
export function dividerLoop<
  T extends DividerInput,
  O extends DividerLoopOptionsLike = DividerLoopEmptyOptions,
>(input: T, size: number, options?: O): DividerResult<T, O> {
  // Validate chunk size
  if (!isPositiveInteger(size)) {
    console.warn('dividerLoop: chunk size must be a positive number');
    return [];
  }

  const { startOffset, maxChunks } = resolveDividerLoopOptions(options);

  return transformDividerInput(
    input,
    (str) => createChunksFromString(str, size, startOffset, maxChunks),
    options,
  );
}
