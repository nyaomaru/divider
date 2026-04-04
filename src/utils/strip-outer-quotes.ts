import { isWhiteSpace } from '@/utils/is';

const findNonSpaceBounds = (text: string) => {
  let left = 0;
  let right = text.length - 1;

  while (left <= right && isWhiteSpace(text[left])) left++;
  while (right >= left && isWhiteSpace(text[right])) right--;

  return { left, right };
};

const stripMatchedOuterQuotes = (
  text: string,
  left: number,
  rightQuoteStart: number,
  quote: string,
) =>
  text.slice(0, left) +
  text.slice(left + quote.length, rightQuoteStart) +
  text.slice(rightQuoteStart + quote.length);

const removeQuoteAt = (text: string, start: number, quote: string) =>
  text.slice(0, start) + text.slice(start + quote.length);

const stripTrailingQuote = (
  text: string,
  quote: string,
) => {
  const quoteLength = quote.length;
  let lastNonSpaceIndex = text.length - 1;
  while (lastNonSpaceIndex >= 0 && isWhiteSpace(text[lastNonSpaceIndex])) {
    lastNonSpaceIndex--;
  }

  const trailingQuoteStart = lastNonSpaceIndex - quoteLength + 1;
  if (
    trailingQuoteStart < 0 ||
    !text.startsWith(quote, trailingQuoteStart)
  ) {
    return text;
  }

  return removeQuoteAt(text, trailingQuoteStart, quote);
};

const stripOuterQuotesRaw = (
  text: string,
  quote: string,
  lenient: boolean,
) => {
  if (quote.length === 0) return text;

  const { left, right } = findNonSpaceBounds(text);
  if (left > right) return text;
  if (!text.startsWith(quote, left)) return text;

  const rightQuoteStart = right - quote.length + 1;
  if (
    rightQuoteStart >= left + quote.length &&
    text.startsWith(quote, rightQuoteStart)
  ) {
    return stripMatchedOuterQuotes(text, left, rightQuoteStart, quote);
  }

  if (!lenient) return text;

  const withoutLeading = removeQuoteAt(text, left, quote);
  return stripTrailingQuote(withoutLeading, quote);
};

/**
 * Remove a single outer quote pair while keeping surrounding spaces, and
 * restore doubled quotes inside the field.
 * @param text Input field text which may be surrounded by spaces and quotes.
 * @param quoteChar Quote string to strip from the outer field boundaries.
 * @param options Behavior flags.
 * @param options.lenient When true, tolerate an unclosed leading quote.
 * @returns Field without its outer quote pair, with doubled quotes restored.
 */
export function stripOuterQuotes(
  text: string,
  quoteChar: string,
  { lenient = true }: { lenient?: boolean } = {},
): string {
  const stripped = stripOuterQuotesRaw(text, quoteChar, lenient);
  if (quoteChar.length === 0) return stripped;

  const escapedPair = quoteChar + quoteChar;

  return stripped.split(escapedPair).join(quoteChar);
}
