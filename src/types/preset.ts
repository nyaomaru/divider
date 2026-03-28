import type { DividerOptions } from '@/types';
import { QUERY_DECODE_MODES } from '@/constants';

export type EmailDividerOptions = Pick<DividerOptions, 'trim'> & {
  /** Split top-level domain from the rest of the email address. */
  readonly splitTLD?: boolean;
};

export type CsvDividerOptions = Pick<DividerOptions, 'trim'> & {
  /** Quote string used for quoting values. */
  readonly quoteChar?: string;
  /** Delimiter string used to separate CSV fields. */
  readonly delimiter?: string;
};

export type PathDividerOptions = Pick<DividerOptions, 'trim'> & {
  /** Collapse empty segments produced by leading/trailing or repeated separators. */
  readonly collapse?: boolean;
};

export type QueryDecodeMode =
  (typeof QUERY_DECODE_MODES)[keyof typeof QUERY_DECODE_MODES];

export type QueryDividerOptions = Pick<DividerOptions, 'trim'> & {
  /** Decoding mode: 'auto' applies standard URL decoding; 'raw' leaves values untouched. */
  readonly mode?: QueryDecodeMode;
};
