import type { DividerStringResult } from '@/types';
import type { CsvDividerOptions } from '@/types/preset';
import { quotedDivide } from '@/utils/quoted';

/** CSV preset built on top of divider-powered quoted splitter. */
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
