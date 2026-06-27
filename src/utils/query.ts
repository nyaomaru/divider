import { QUERY_DECODE_MODES, QUERY_SEPARATORS } from '@/constants';
import type { DividerArrayResult } from '@/types';
import type { QueryDecodeMode, QueryDividerOptions } from '@/types/preset';
import { dividePreserve } from '@/utils/divide-preserve';

/**
 * Extracts query text from an absolute URL, relative URL, or raw query string.
 * @param input String that may be a URL, URL-like path, or raw query.
 * @returns Query string without a leading question mark when one is detected.
 */
export function extractQuery(input: string): string {
  try {
    const url = new URL(input);
    return stripLeadingQuestionMark(url.search);
  } catch {
    return extractQueryFromQuestionMark(input);
  }
}

/**
 * Extracts query text from non-absolute URL-like input.
 *
 * WHY: Relative URLs cannot be passed to `new URL` without a base, while raw
 * query values can legitimately contain `?`. The prefix check keeps both cases
 * distinguishable without requiring callers to classify the input first.
 *
 * @param input Raw input string that may contain path, query, or fragment text.
 * @returns Query portion when `?` is a URL boundary; otherwise the input without fragment.
 */
function extractQueryFromQuestionMark(input: string): string {
  const fragmentIndex = input.indexOf('#');
  const withoutFragment =
    fragmentIndex >= 0 ? input.slice(0, fragmentIndex) : input;

  const questionMarkIndex = withoutFragment.indexOf(
    QUERY_SEPARATORS.QUESTION_MARK,
  );

  if (questionMarkIndex < 0) {
    return withoutFragment;
  }

  if (questionMarkIndex === 0) {
    return withoutFragment.slice(1);
  }

  const prefix = withoutFragment.slice(0, questionMarkIndex);
  const hasQuerySeparatorBefore =
    prefix.includes(QUERY_SEPARATORS.AMPERSAND) ||
    prefix.includes(QUERY_SEPARATORS.EQUALS);

  return hasQuerySeparatorBefore
    ? withoutFragment
    : withoutFragment.slice(questionMarkIndex + 1);
}

/**
 * Removes one leading question mark from query text.
 * @param query Query string that may start with `?`.
 * @returns Query string without one leading question mark.
 */
export function stripLeadingQuestionMark(query: string): string {
  return query.startsWith(QUERY_SEPARATORS.QUESTION_MARK)
    ? query.slice(1)
    : query;
}

/**
 * Splits a query part into a key/value tuple on the first equals sign.
 * @param part Query part such as `key=value`.
 * @returns Tuple with empty strings for missing key or value positions.
 */
export function splitQueryPair(part: string): [string, string] {
  const keyValue = dividePreserve(part, QUERY_SEPARATORS.EQUALS);
  if (keyValue.length === 1) return [keyValue[0] ?? '', ''];
  return [
    keyValue[0] ?? '',
    keyValue.slice(1).join(QUERY_SEPARATORS.EQUALS),
  ];
}

/**
 * Decodes a query key or value according to the selected mode.
 * @param text Query field text to decode.
 * @param mode Decoding mode.
 * @param trim Whether to trim after decoding.
 * @returns Decoded query field text.
 */
export function decodeQueryField(
  text: string,
  mode: QueryDecodeMode,
  trim: boolean,
): string {
  let decoded = text;

  if (mode === QUERY_DECODE_MODES.AUTO) {
    decoded = decoded.replace(/\+/g, ' ');
    try {
      decoded = decodeURIComponent(decoded);
    } catch {
      // Malformed escape sequences should not make query parsing fail.
    }
  }

  return trim ? decoded.trim() : decoded;
}

/**
 * Parses query input into key/value pairs.
 * @param input Query string or URL containing a query string.
 * @param options Query parsing options.
 * @returns Parsed key/value pairs in input order.
 */
export function parseQueryPairs(
  input: string,
  { mode = QUERY_DECODE_MODES.AUTO, trim = false }: QueryDividerOptions = {},
): DividerArrayResult {
  if (input.length === 0) return [];

  const query = stripLeadingQuestionMark(extractQuery(input));
  if (query.length === 0) return [];

  return dividePreserve(query, QUERY_SEPARATORS.AMPERSAND).map((part) => {
    const [key, value] = splitQueryPair(part);
    return [
      decodeQueryField(key, mode, trim),
      decodeQueryField(value, mode, trim),
    ];
  });
}
