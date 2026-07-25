import { countUnescaped } from '@/utils/count-unescaped';
import { dividePreserve } from '@/utils/divide-preserve';
import { isEmptyString } from '@/utils/guards/whitespace';
import { stripOuterQuotes } from '@/utils/strip-outer-quotes';

/**
 * Options for quoted-aware field division.
 */
type QuotedDivideOptions = {
  /** Field delimiter used to split the source line */
  delimiter?: string;
  /** Quote string used to detect, strip, and unescape quoted fields */
  quote?: string;
  /** Whether to trim field values after unquoting */
  trim?: boolean;
  /** Whether to tolerate unclosed leading quotes */
  lenient?: boolean;
};

type ResolvedQuotedDivideOptions = Required<QuotedDivideOptions>;

/**
 * Parser context used while rebuilding quoted fields from split pieces.
 *
 * WHY: Keeping immutable parse options beside the mutable state avoids
 * threading the same related arguments through each parser transition.
 */
type QuotedParserContext = {
  /** Parsed fields collected so far */
  fields: string[];
  /** Buffered content for the field currently being rebuilt */
  current: string;
  /** Whether the parser is currently inside a quoted field */
  insideQuotes: boolean;
  /** Options shared by every transition in the current parse */
  readonly options: ResolvedQuotedDivideOptions;
};

/**
 * Advance quote state using only the newly appended segment.
 *
 * WHY: For single-character quotes, escaped pairs contribute an even number of
 * quote markers, so toggling parity on each encountered quote is enough to
 * track whether the parser is currently inside a quoted field. Multi-character
 * quote strings use `countUnescaped` instead because scanning one character at
 * a time cannot detect escaped quote tokens correctly.
 *
 * @param insideQuotes Current parser quote state.
 * @param segment Newly appended text segment.
 * @param quote Quote character used for the current parse.
 * @returns Next quote state after scanning `segment`.
 */
const advanceQuoteState = (
  insideQuotes: boolean,
  segment: string,
  quote: string,
) => {
  let nextInsideQuotes = insideQuotes;

  for (const char of segment) {
    if (char === quote) nextInsideQuotes = !nextInsideQuotes;
  }

  return nextInsideQuotes;
};

/**
 * Finalize the current buffered field and reset parser state for the next one.
 * @param context Parser state and options.
 */
const flushField = (context: QuotedParserContext) => {
  const { quote, trim, lenient } = context.options;
  let fieldValue = stripOuterQuotes(context.current, quote, { lenient });
  if (trim) fieldValue = fieldValue.trim();

  context.fields.push(fieldValue);
  context.current = '';
  context.insideQuotes = false;
};

/**
 * Append a split piece to the current buffer and flush once the quote state closes.
 *
 * WHY: The delimiter is reattached when rebuilding the buffered field so
 * delimiters inside quoted sections remain part of the same logical value.
 *
 * @param context Parser state and options.
 * @param piece Next split piece.
 */
const appendPiece = (context: QuotedParserContext, piece: string) => {
  const { delimiter, quote } = context.options;
  const segment = isEmptyString(context.current) ? piece : delimiter + piece;
  context.current += segment;

  context.insideQuotes =
    quote.length === 1
      ? advanceQuoteState(context.insideQuotes, segment, quote)
      : countUnescaped(context.current, quote) % 2 === 1;

  if (!context.insideQuotes) {
    flushField(context);
  }
};

/**
 * Rebuild quoted-aware fields from delimiter-split pieces.
 * @param line Source line to parse.
 * @param options Resolved options shared by the parser transitions.
 * @returns Parsed field values.
 */
const buildQuotedFields = (
  line: string,
  options: ResolvedQuotedDivideOptions,
) => {
  const pieces = dividePreserve(line, options.delimiter);
  const context: QuotedParserContext = {
    fields: [],
    current: '',
    insideQuotes: false,
    options,
  };

  for (const piece of pieces) {
    appendPiece(context, piece);
  }

  if (!isEmptyString(context.current)) {
    flushField(context);
  }

  return context.fields;
};

/**
 * Divide a delimited string while respecting quoted fields and escaped quotes.
 * @param line Delimited line to parse.
 * @param options Parsing options.
 * @param options.delimiter Field delimiter.
 * @param options.quote Quote string used for fields.
 * @param options.trim When true, trim fields after unquoting.
 * @param options.lenient When true, tolerate unclosed leading quotes.
 * @returns Parsed field values.
 */
export function quotedDivide(
  line: string,
  {
    delimiter = ',',
    quote = '"',
    trim = false,
    lenient = true,
  }: QuotedDivideOptions = {},
): string[] {
  if (isEmptyString(line)) return [''];
  return buildQuotedFields(line, { delimiter, quote, trim, lenient });
}
