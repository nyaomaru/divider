import { isEmptyString } from '@/utils/is';

const countUnescapedSingleChar = (text: string, quote: string) => {
  let count = 0;

  for (let index = 0; index < text.length; index++) {
    if (text[index] !== quote) continue;
    if (text[index + 1] === quote) {
      index++;
      continue;
    }
    count++;
  }

  return count;
};

const countUnescapedMultiChar = (text: string, quote: string) => {
  const escapedPair = quote + quote;
  const quoteLength = quote.length;
  const escapedPairLength = escapedPair.length;
  let count = 0;

  let index = 0;

  while (index < text.length) {
    if (text.startsWith(escapedPair, index)) {
      index += escapedPairLength;
      continue;
    }
    if (text.startsWith(quote, index)) {
      count++;
      index += quoteLength;
      continue;
    }
    index++;
  }

  return count;
};

/**
 * Count quote markers excluding escaped pairs.
 * @param text Text to scan.
 * @param quote Quote string to count.
 * @returns Number of unescaped quote occurrences in `text`.
 */
export function countUnescaped(text: string, quote: string): number {
  if (isEmptyString(quote)) return 0;
  if (quote.length === 1) return countUnescapedSingleChar(text, quote);
  return countUnescapedMultiChar(text, quote);
}
