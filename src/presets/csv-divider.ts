import type { DividerStringResult } from '@/types';
import type { CsvDividerOptions } from '@/types/preset';
import { quotedDivide } from '@/utils/quoted-parser';

/**
 * Divides a CSV line into an array of fields, handling quoted values appropriately.
 *
 * @param line - The CSV line string to be divided into fields
 * @param options - Configuration options for CSV parsing
 * @param options.delimiter - The character used to separate fields (default: ',')
 * @param options.quoteChar - The character used to quote fields containing delimiters or newlines (default: '"')
 * @param options.trim - Whether to trim whitespace from field values (default: false)
 * @returns A DividerStringResult containing the parsed CSV fields
 */
export function csvDivider(
  line: string,
  options: CsvDividerOptions = {}
): DividerStringResult {
  const { delimiter = ',', quoteChar = '"', trim = false } = options;
  return quotedDivide(line, {
    delimiter,
    quote: quoteChar,
    trim,
    lenient: true,
  });
}
