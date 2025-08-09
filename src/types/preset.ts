import type { DividerOptions } from '@/types';

export type EmailDividerOptions = Pick<DividerOptions, 'trim'> & {
  splitTLD?: boolean;
};

export type CsvDividerOptions = Pick<DividerOptions, 'trim'> & {
  quoteChar?: '"' | "'";
  delimiter?: string;
};
