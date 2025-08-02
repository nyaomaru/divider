import type { DividerOptions } from '@/types';

export type CsvDividerOptions = Pick<DividerOptions, 'trim'> & {
  quoteChar?: '"' | "'";
};
