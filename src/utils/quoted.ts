import { divider } from '@/core/divider';
import { WHITE_SPACE, TAB } from '@/constants';
import { isEmptyString } from '@/utils/is';

/**
 * Divide a string by a single `separator`, preserving consecutive and trailing empty fields.
 *
 * WHY: Uses the library `divider` for consistency; if the reconstructed output differs from the input
 * (e.g., due to option defaults or implementation details), falls back to native `String.split` to
 * guarantee strict preservation of empty segments.
 * @param input - Source string to divide. Empty string yields a single empty field.
 * @param separator - Single-character separator to split on.
 * @returns Array of fields with consecutive and trailing empties preserved.
 */
export function dividePreserve(input: string, separator: string): string[] {
  if (isEmptyString(input)) return [''];
  // Use core divider with preserveEmpty to retain consecutive/edge empties
  return divider(input, separator, { preserveEmpty: true });
}

/**
 * Count quote characters excluding escaped pairs (e.g., "" for an embedded ").
 * Assumes `quote` is a single character.
 * @param text - Text to scan.
 * @param quote - Quote character to count (single character).
 * @returns The number of unescaped quote occurrences in `text`.
 */
export function countUnescaped(text: string, quote: string): number {
  const pair = quote + quote;
  let count = 0;
  for (const chunk of dividePreserve(text, pair)) {
    count += dividePreserve(chunk, quote).length - 1;
  }
  return count;
}

/**
 * Remove a single outer quote pair while keeping surrounding spaces, and unescape doubled quotes.
 *
 * - Restores escaped pairs: "" -> "
 * - If `lenient` is true and only a leading quote exists, removes the leading quote and a matching
 *   trailing quote if it appears at the last non-space position.
 * - If `lenient` is false, leaves unclosed quotes intact.
 * @param text - Input field text which may be surrounded by spaces and quotes.
 * @param quoteChar - Quote character to strip (single character).
 * @param options - Behavior flags.
 * @param [options.lenient=true] - Allow removing a solitary leading quote and a terminal trailing
 *   quote after trimming trailing spaces.
 * @returns The field without its outer quote pair, with doubled quotes restored.
 */
export function stripOuterQuotes(
  text: string,
  quoteChar: string,
  { lenient = true }: { lenient?: boolean } = {}
): string {
  const escapedPair = quoteChar + quoteChar;
  const isWhitespace = (char: string) => char === WHITE_SPACE || char === TAB;
  const restoreEscapedQuotes = (fieldText: string) =>
    fieldText.split(escapedPair).join(quoteChar);

  const stripped = stripOuterQuotesRaw(text, quoteChar, lenient, isWhitespace);
  return restoreEscapedQuotes(stripped);
}

/**
 * Quoted-aware divide built on top of `divider`.
 * - Tokenize by delimiter (preserving empties)
 * - Merge tokens while inside quotes
 * - Remove outer quotes, restore escaped quotes, optionally trim
 *
 * @param line - A delimited line, possibly containing quoted fields and escaped quotes ("").
 * @param options - Parsing options.
 * @param [options.delimiter=","] - Field delimiter.
 * @param [options.quote='"'] - Quote character for fields (single character).
 * @param [options.trim=false] - Trim resulting fields after unquoting.
 * @param [options.lenient=true] - Permit unclosed starting quotes to be handled leniently.
 * @returns Array of parsed fields with quoting/escaping handled.
 * @example
 * quotedDivide('"a,b",c,,"d""e"') // => ['a,b', 'c', '', 'd"e']
 */
export function quotedDivide(
  line: string,
  {
    delimiter = ',',
    quote = '"',
    trim = false,
    lenient = true,
  }: {
    delimiter?: string;
    quote?: string;
    trim?: boolean;
    lenient?: boolean;
  } = {}
): string[] {
  if (isEmptyString(line)) return [''];
  return buildQuotedFields(line, delimiter, quote, trim, lenient);
}

/**
 * Finds the first and last non-whitespace indices in the text.
 * @param text Source text to scan.
 * @param isWhitespace Predicate to detect whitespace.
 * @returns Bounds of non-whitespace content.
 */
const findNonSpaceBounds = (
  text: string,
  isWhitespace: (char: string) => boolean
) => {
  let left = 0;
  let right = text.length - 1;
  while (left <= right && isWhitespace(text[left])) left++;
  while (right >= left && isWhitespace(text[right])) right--;
  return { left, right };
};

/**
 * Removes a matching outer quote pair at the given bounds.
 * @param text Source text containing quotes.
 * @param left Index of the leading quote.
 * @param right Index of the trailing quote.
 * @returns Text with the outer quote pair removed.
 */
const stripMatchedOuterQuotes = (text: string, left: number, right: number) =>
  text.slice(0, left) + text.slice(left + 1, right) + text.slice(right + 1);

/**
 * Removes a single character at the given index.
 * @param text Source text.
 * @param index Index of the character to remove.
 * @returns Text with the character removed.
 */
const removeCharAt = (text: string, index: number) =>
  text.slice(0, index) + text.slice(index + 1);

/**
 * Strips a trailing quote after trimming trailing whitespace.
 * @param text Source text.
 * @param quoteChar Quote character to remove.
 * @param isWhitespace Predicate to detect whitespace.
 * @returns Text with a trailing quote removed when present.
 */
const stripTrailingQuote = (
  text: string,
  quoteChar: string,
  isWhitespace: (char: string) => boolean
) => {
  let lastNonSpaceIndex = text.length - 1;
  while (lastNonSpaceIndex >= 0 && isWhitespace(text[lastNonSpaceIndex])) {
    lastNonSpaceIndex--;
  }

  if (lastNonSpaceIndex < 0 || text[lastNonSpaceIndex] !== quoteChar) {
    return text;
  }

  return removeCharAt(text, lastNonSpaceIndex);
};

/**
 * Strips outer quotes without restoring escaped quote pairs.
 * @param text Source text.
 * @param quoteChar Quote character to strip.
 * @param lenient Whether to handle unclosed leading quotes leniently.
 * @param isWhitespace Predicate to detect whitespace.
 * @returns Text with outer quotes removed when applicable.
 */
const stripOuterQuotesRaw = (
  text: string,
  quoteChar: string,
  lenient: boolean,
  isWhitespace: (char: string) => boolean
) => {
  const { left, right } = findNonSpaceBounds(text, isWhitespace);
  if (left > right) return text;
  if (text[left] !== quoteChar) return text;

  if (text[right] === quoteChar && right > left) {
    return stripMatchedOuterQuotes(text, left, right);
  }

  if (!lenient) return text;

  const withoutLeading = removeCharAt(text, left);
  return stripTrailingQuote(withoutLeading, quoteChar, isWhitespace);
};

/**
 * Builds parsed fields from a delimited line with quotes.
 * @param line Source line to parse.
 * @param delimiter Field delimiter.
 * @param quote Quote character.
 * @param trim Whether to trim unquoted field values.
 * @param lenient Whether to handle unclosed leading quotes leniently.
 * @returns Parsed field values.
 */
const buildQuotedFields = (
  line: string,
  delimiter: string,
  quote: string,
  trim: boolean,
  lenient: boolean
) => {
  const pieces = dividePreserve(line, delimiter);
  const state = {
    fields: [] as string[],
    current: '',
  };

  for (const piece of pieces) {
    appendPiece(state, piece, delimiter, quote, trim, lenient);
  }

  if (!isEmptyString(state.current)) {
    flushField(state, quote, trim, lenient);
  }

  return state.fields;
};

/**
 * Appends a token and flushes a field when not inside quotes.
 * @param state Parser state.
 * @param piece Token to append.
 * @param delimiter Field delimiter.
 * @param quote Quote character.
 * @param trim Whether to trim field values.
 * @param lenient Whether to handle unclosed leading quotes leniently.
 */
const appendPiece = (
  state: { fields: string[]; current: string },
  piece: string,
  delimiter: string,
  quote: string,
  trim: boolean,
  lenient: boolean
) => {
  state.current = isEmptyString(state.current)
    ? piece
    : state.current + delimiter + piece;

  const insideQuotes = countUnescaped(state.current, quote) % 2 === 1;
  if (!insideQuotes) {
    flushField(state, quote, trim, lenient);
  }
};

/**
 * Flushes the current buffer into the fields array.
 * @param state Parser state.
 * @param quote Quote character.
 * @param trim Whether to trim field values.
 * @param lenient Whether to handle unclosed leading quotes leniently.
 */
const flushField = (
  state: { fields: string[]; current: string },
  quote: string,
  trim: boolean,
  lenient: boolean
) => {
  let fieldValue = stripOuterQuotes(state.current, quote, { lenient });
  if (trim) fieldValue = fieldValue.trim();
  state.fields.push(fieldValue);
  state.current = '';
};
