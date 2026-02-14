import type { DividerArrayResult } from '@/types';
import type { QueryDividerOptions, QueryDecodeMode } from '@/types/preset';
import { QUERY_DECODE_MODES, QUERY_SEPARATORS } from '@/constants';
import { dividePreserve } from '@/utils/quoted';

// WHY: Preserve consecutive and trailing empty segments to reflect query strings precisely
// (e.g., 'a=&b&=c&' keeps empties). Split helpers isolate concerns for readability and testability.

/**
 * Extract the query component from a full URL when possible.
 * Returns the URL's search part without the leading '?' when input is a URL; otherwise returns the original input.
 * @param input String potentially containing a full URL.
 * @returns Query string without leading '?' or the original input.
 */
function tryExtractQuery(input: string): string {
  try {
    const url = new URL(input);
    return url.search.startsWith(QUERY_SEPARATORS.QUESTION_MARK)
      ? url.search.slice(1)
      : url.search;
  } catch {
    return extractQueryFromQuestionMark(input);
  }
}

/**
 * Extract query substring from a non-absolute URL-like input.
 * WHY: Relative URLs (e.g. "/path?a=1&b=2#frag") cannot be passed to `new URL`
 * without a base, so this fallback keeps query parsing behavior consistent.
 * @param input Raw input string that may contain path/query/fragment.
 * @returns Query portion when `?` exists before `#`; otherwise the original input without fragment.
 */
function extractQueryFromQuestionMark(input: string): string {
  const fragmentIndex = input.indexOf('#');
  const withoutFragment =
    fragmentIndex >= 0 ? input.slice(0, fragmentIndex) : input;

  const questionMarkIndex = withoutFragment.indexOf(
    QUERY_SEPARATORS.QUESTION_MARK,
  );

  return questionMarkIndex >= 0
    ? withoutFragment.slice(questionMarkIndex + 1)
    : withoutFragment;
}

/**
 * Remove a single leading '?' from a query string if present.
 * @param query Query string that may start with '?'.
 * @returns Query string without the leading '?'.
 */
function stripLeadingQuestionMark(query: string): string {
  return query.startsWith(QUERY_SEPARATORS.QUESTION_MARK)
    ? query.slice(1)
    : query;
}

/**
 * Split a key-value part on the first '=' only, preserving additional '=' in the value.
 * Empty keys/values are preserved to reflect the exact input.
 * @param part A single 'key=value' segment (may be empty or without '=').
 * @returns Tuple [key, value] with empty strings where appropriate.
 */
function splitOnFirstEquals(part: string): [string, string] {
  const kv = dividePreserve(part, QUERY_SEPARATORS.EQUALS);
  if (kv.length === 1) return [kv[0] ?? '', ''];
  return [kv[0] ?? '', kv.slice(1).join(QUERY_SEPARATORS.EQUALS)];
}

/**
 * Decode a query field according to the selected mode, then optionally trim.
 * - 'auto': replace '+' with space and apply decodeURIComponent (ignore malformed escapes)
 * - 'raw': leave text untouched
 * @param text Field text to decode.
 * @param mode Decoding mode: 'auto' or 'raw'.
 * @param trim Whether to trim the resulting text.
 * @returns Decoded (and optionally trimmed) field value.
 */
function decodeField(
  text: string,
  mode: QueryDecodeMode,
  trim: boolean,
): string {
  let t = text;
  if (mode === QUERY_DECODE_MODES.AUTO) {
    t = t.replace(/\+/g, ' ');
    try {
      t = decodeURIComponent(t);
    } catch {
      // leave undecoded on malformed escape sequences
    }
  }
  if (trim) t = t.trim();
  return t;
}

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
  { mode = QUERY_DECODE_MODES.AUTO, trim = false }: QueryDividerOptions = {},
): DividerArrayResult {
  if (input.length === 0) return [];

  const query = stripLeadingQuestionMark(tryExtractQuery(input));
  if (query.length === 0) return [];

  return dividePreserve(query, QUERY_SEPARATORS.AMPERSAND).map((part) => {
    const [key, value] = splitOnFirstEquals(part);
    return [decodeField(key, mode, trim), decodeField(value, mode, trim)];
  });
}
