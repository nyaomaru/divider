import { divider } from '@/core/divider';
import { WHITE_SPACE, TAB } from '@/constants';

/** Divide by `separator` while preserving consecutive/trailing empties. */
export function dividePreserve(input: string, separator: string): string[] {
  if (input === '') return [''];

  const divided = divider(input, separator);
  return divided.join(separator) === input ? divided : input.split(separator);
}

/** Count quotes excluding escaped pairs (""). Assumes single-char `quote`. */
export function countUnescaped(text: string, quote: string): number {
  const pair = quote + quote;
  let count = 0;
  for (const chunk of dividePreserve(text, pair)) {
    count += dividePreserve(chunk, quote).length - 1;
  }
  return count;
}

/** Remove an outer quote pair (keep surrounding spaces) and restore "" -> ". */
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
  if (line === '') return [''];

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
    currentFieldBuffer =
      currentFieldBuffer === ''
        ? piece
        : currentFieldBuffer + delimiter + piece;
    insideQuotes = countUnescaped(currentFieldBuffer, quote) % 2 === 1;
    if (!insideQuotes) flush();
  }

  if (currentFieldBuffer !== '') flush();

  return fields;
}
