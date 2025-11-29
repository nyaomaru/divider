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

  // Find first/last non-space indices
  let left = 0;
  let right = text.length - 1;
  while (left <= right && isWhitespace(text[left])) left++;
  while (right >= left && isWhitespace(text[right])) right--;

  // All spaces or empty → nothing to strip
  if (left > right) return restoreEscapedQuotes(text);

  const startsWithQuote = text[left] === quoteChar;
  if (!startsWithQuote) return restoreEscapedQuotes(text);

  const endsWithQuote = text[right] === quoteChar;

  // Matched pair → strip both
  if (endsWithQuote && right > left) {
    const withoutPair =
      text.slice(0, left) + text.slice(left + 1, right) + text.slice(right + 1);
    return restoreEscapedQuotes(withoutPair);
  }

  // Unclosed/mismatched start quote
  if (!lenient) return restoreEscapedQuotes(text);

  // Strip only the starting quote
  let result = text.slice(0, left) + text.slice(left + 1);

  // Find the index of the last non-space character
  let lastNonSpaceIndexAfterTrim = result.length - 1;
  while (
    lastNonSpaceIndexAfterTrim >= 0 &&
    isWhitespace(result[lastNonSpaceIndexAfterTrim])
  ) {
    lastNonSpaceIndexAfterTrim--;
  }

  // If it's a trailing quote, remove it
  if (
    lastNonSpaceIndexAfterTrim >= 0 &&
    result[lastNonSpaceIndexAfterTrim] === quoteChar
  ) {
    result =
      result.slice(0, lastNonSpaceIndexAfterTrim) +
      result.slice(lastNonSpaceIndexAfterTrim + 1);
  }

  return restoreEscapedQuotes(result);
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

  const pieces = dividePreserve(line, delimiter);
  const fields: string[] = [];
  let currentFieldBuffer = '';
  let insideQuotes = false;

  const flush = () => {
    let fieldValue = stripOuterQuotes(currentFieldBuffer, quote, { lenient });
    if (trim) fieldValue = fieldValue.trim();
    fields.push(fieldValue);
    currentFieldBuffer = '';
  };

  for (const piece of pieces) {
    currentFieldBuffer = isEmptyString(currentFieldBuffer)
      ? piece
      : currentFieldBuffer + delimiter + piece;
    insideQuotes = countUnescaped(currentFieldBuffer, quote) % 2 === 1;
    if (!insideQuotes) flush();
  }

  if (!isEmptyString(currentFieldBuffer)) flush();

  return fields;
}
