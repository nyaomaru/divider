import { isNumber } from '@/utils/guards/primitives';

// Constants for better maintainability
const MIN_ALLOWED_CHUNKS = 0;

/**
 * Determines whether the chunks array should be truncated
 * based on the maxChunks setting.
 *
 * @param chunks - The array of string chunks to evaluate
 * @param maxChunks - The maximum number of chunks allowed
 * @returns True if truncation is needed, false otherwise
 */
export function shouldTruncateChunks(
  chunks: readonly string[],
  maxChunks: number
): boolean {
  return (
    isNumber(maxChunks) &&
    maxChunks > MIN_ALLOWED_CHUNKS &&
    maxChunks < chunks.length
  );
}

/**
 * Truncates the chunks array to the specified maxChunks length.
 * The remaining chunks are merged into the last chunk.
 *
 * @param chunks - The original array of string chunks
 * @param maxChunks - The maximum number of chunks to retain
 * @returns A new array of chunks with at most maxChunks elements
 */
export function truncateChunksToMax(
  chunks: readonly string[],
  maxChunks: number
): string[] {
  const headCount = maxChunks - 1;
  const head = chunks.slice(0, headCount);
  const tail = chunks.slice(headCount).join('');
  return [...head, tail];
}
