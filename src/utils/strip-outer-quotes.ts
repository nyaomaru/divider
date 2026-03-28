import { TAB, WHITE_SPACE } from "@/constants";

const findNonSpaceBounds = (
  text: string,
  isWhitespace: (char: string) => boolean,
) => {
  let left = 0;
  let right = text.length - 1;

  while (left <= right && isWhitespace(text[left])) left++;
  while (right >= left && isWhitespace(text[right])) right--;

  return { left, right };
};

const stripMatchedOuterQuotes = (text: string, left: number, right: number) =>
  text.slice(0, left) + text.slice(left + 1, right) + text.slice(right + 1);

const removeCharAt = (text: string, index: number) =>
  text.slice(0, index) + text.slice(index + 1);

const stripTrailingQuote = (
  text: string,
  quoteChar: string,
  isWhitespace: (char: string) => boolean,
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

const stripOuterQuotesRaw = (
  text: string,
  quoteChar: string,
  lenient: boolean,
  isWhitespace: (char: string) => boolean,
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
 * Remove a single outer quote pair while keeping surrounding spaces, and
 * restore doubled quotes inside the field.
 * @param text Input field text which may be surrounded by spaces and quotes.
 * @param quoteChar Quote string to strip.
 * @param options Behavior flags.
 * @param options.lenient When true, tolerate an unclosed leading quote.
 * @returns Field without its outer quote pair, with doubled quotes restored.
 */
export function stripOuterQuotes(
  text: string,
  quoteChar: string,
  { lenient = true }: { lenient?: boolean } = {},
): string {
  const escapedPair = quoteChar + quoteChar;
  const isWhitespace = (char: string) => char === WHITE_SPACE || char === TAB;
  const stripped = stripOuterQuotesRaw(text, quoteChar, lenient, isWhitespace);

  return stripped.split(escapedPair).join(quoteChar);
}
