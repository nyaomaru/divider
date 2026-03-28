import { countUnescaped } from '@/utils/count-unescaped';
import { dividePreserve } from '@/utils/divide-preserve';
import { isEmptyString } from '@/utils/is';
import { stripOuterQuotes } from '@/utils/strip-outer-quotes';

/**
 * Mutable parser state used while rebuilding quoted fields from split pieces.
 */
type QuotedParserState = {
  /** Parsed fields collected so far */
  fields: string[];
  /** Buffered content for the field currently being rebuilt */
  current: string;
  /** Whether the parser is currently inside a quoted field */
  insideQuotes: boolean;
};

/**
 * Options for quoted-aware field division.
 */
type QuotedDivideOptions = {
  /** Field delimiter used to split the source line */
  delimiter?: string;
  /** Quote string used to detect and unescape quoted fields */
  quote?: string;
  /** Whether to trim field values after unquoting */
  trim?: boolean;
  /** Whether to tolerate unclosed leading quotes */
  lenient?: boolean;
};

/**
 * Advance quote state using only the newly appended segment.
 *
 * WHY: For single-character quotes, escaped pairs contribute an even number of
 * quote markers, so toggling parity on each encountered quote is enough to
 * track whether the parser is currently inside a quoted field.
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
 * @param state Mutable parser state.
 * @param quote Quote string used for the current parse.
 * @param trim Whether to trim the field after unquoting.
 * @param lenient Whether to tolerate unclosed leading quotes.
 */
const flushField = (
  state: QuotedParserState,
  quote: string,
  trim: boolean,
  lenient: boolean,
) => {
  let fieldValue = stripOuterQuotes(state.current, quote, { lenient });
  if (trim) fieldValue = fieldValue.trim();

  state.fields.push(fieldValue);
  state.current = '';
  state.insideQuotes = false;
};

/**
 * Append a split piece to the current buffer and flush once the quote state closes.
 *
 * WHY: The delimiter is reattached when rebuilding the buffered field so
 * delimiters inside quoted sections remain part of the same logical value.
 *
 * @param state Mutable parser state.
 * @param piece Next split piece.
 * @param delimiter Delimiter used to split the original line.
 * @param quote Quote string used for the current parse.
 * @param trim Whether to trim the field after unquoting.
 * @param lenient Whether to tolerate unclosed leading quotes.
 */
const appendPiece = (
  state: QuotedParserState,
  piece: string,
  delimiter: string,
  quote: string,
  trim: boolean,
  lenient: boolean,
) => {
  const segment = isEmptyString(state.current) ? piece : delimiter + piece;
  state.current += segment;

  state.insideQuotes =
    quote.length === 1
      ? advanceQuoteState(state.insideQuotes, segment, quote)
      : countUnescaped(state.current, quote) % 2 === 1;

  if (!state.insideQuotes) {
    flushField(state, quote, trim, lenient);
  }
};

/**
 * Rebuild quoted-aware fields from delimiter-split pieces.
 * @param line Source line to parse.
 * @param delimiter Field delimiter.
 * @param quote Quote string used for the current parse.
 * @param trim Whether to trim fields after unquoting.
 * @param lenient Whether to tolerate unclosed leading quotes.
 * @returns Parsed field values.
 */
const buildQuotedFields = (
  line: string,
  delimiter: string,
  quote: string,
  trim: boolean,
  lenient: boolean,
) => {
  const pieces = dividePreserve(line, delimiter);
  const state: QuotedParserState = {
    fields: [],
    current: '',
    insideQuotes: false,
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
  return buildQuotedFields(line, delimiter, quote, trim, lenient);
}
