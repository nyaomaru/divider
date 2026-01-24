import { isString, isPositiveInteger } from '@/utils/is';
import { generateIndexes } from '@/utils/generate-indexes';
import { applyDividerOptions } from '@/utils/option';
import { shouldTruncateChunks, truncateChunksToMax } from '@/utils/chunk';
import type {
  DividerInput,
  DividerLoopEmptyOptions,
  DividerLoopOptionsLike,
  DividerResult,
} from '@/types';
import { divider } from '@/core/divider';
import { PERFORMANCE_CONSTANTS } from '@/constants';

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
  const indexes = generateIndexes(str, size, startOffset);
  const chunks = divider(str, ...indexes);

  return shouldTruncateChunks(chunks, maxChunks)
    ? truncateChunksToMax(chunks, maxChunks)
    : chunks;
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

  const resolvedOptions = (options ?? {}) as O;
  const {
    startOffset = PERFORMANCE_CONSTANTS.DEFAULT_START_OFFSET,
    maxChunks = PERFORMANCE_CONSTANTS.DEFAULT_MAX_CHUNKS,
  } = resolvedOptions;

  // Process input based on its type (string or string[])
  const result = isString(input)
    ? createChunksFromString(input, size, startOffset, maxChunks)
    : input.map((str) =>
        createChunksFromString(str, size, startOffset, maxChunks)
      );

  return applyDividerOptions<T, O>(result, resolvedOptions);
}
