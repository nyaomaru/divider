import type { DividerArrayResult } from '@/types';
import type { QueryDividerOptions } from '@/types/preset';
import { parseQueryPairs } from '@/utils/query';

/**
 * Divide a query string into key/value pairs.
 * - Supports raw query (with or without leading '?').
 * - Accepts full URLs (query extracted automatically).
 * - Preserves empty keys/values and trailing separators.
 * @param input Query string or full URL.
 * @param options Parsing options: { mode?: 'auto' | 'raw'; trim?: boolean }.
 * @returns Array of [key, value] string tuples in input order.
 */
export function queryDivider(
  input: string,
  options: QueryDividerOptions = {},
): DividerArrayResult {
  return parseQueryPairs(input, options);
}
