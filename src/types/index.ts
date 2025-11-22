import { DIVIDER_EXCLUDE_MODES } from '@/constants';

export type DividerExcludeMode =
  (typeof DIVIDER_EXCLUDE_MODES)[keyof typeof DIVIDER_EXCLUDE_MODES];

// Type guard for string input
export type StringInput = string;
export type StringArrayInput = readonly string[];
export type DividerInput = StringInput | StringArrayInput;

// Result types with more specific naming
export type DividerStringResult = string[];
export type DividerArrayResult = string[][];

// Options with better documentation
export type DividerOptions = {
  /** If true, flattens nested arrays into a single array */
  flatten?: boolean;
  /** If true, trims whitespace from each divided segment */
  trim?: boolean;
  /** If true, retains empty segments produced by division */
  preserveEmpty?: boolean;
  /** Controls how empty or whitespace segments are handled */
  exclude?: DividerExcludeMode;
};

/**
 * Represents the absence of user-specified divider options while retaining
 * property knowledge for conditional typing.
 */
export type DividerEmptyOptions = {
  /** Explicitly omits flatten while preserving literal inference */
  readonly flatten?: never;
  /** Explicitly omits trim while preserving literal inference */
  readonly trim?: never;
  /** Explicitly omits preserveEmpty while preserving literal inference */
  readonly preserveEmpty?: never;
  /** Explicitly omits exclude while preserving literal inference */
  readonly exclude?: never;
};

export type DividerInferredOptions = DividerOptions | DividerEmptyOptions;

type HasFlattenOption<TOptions extends DividerInferredOptions> =
  TOptions extends {
    readonly flatten?: infer Flag;
  }
    ? Flag extends true
      ? true
      : false
    : false;

export type DividerResult<
  T extends DividerInput,
  TOptions extends DividerInferredOptions = DividerEmptyOptions,
> = T extends StringInput
  ? DividerStringResult
  : HasFlattenOption<TOptions> extends true
    ? DividerStringResult
    : DividerArrayResult;

export type ExtractedDividerOptions<TArgs extends DividerArgs> =
  TArgs extends readonly [...infer _Rest, infer Last]
    ? Last extends DividerOptions
      ? Last
      : DividerEmptyOptions
    : DividerEmptyOptions;

// Extended options for loop operations
export type DividerLoopOptions = DividerOptions & {
  /** Starting position for the division (0-based) */
  startOffset?: number;
  /** Maximum number of chunks to produce */
  maxChunks?: number;
};

export type DividerLoopEmptyOptions = DividerEmptyOptions & {
  /** Placeholder to signal startOffset is intentionally absent */
  readonly startOffset?: never;
  /** Placeholder to signal maxChunks is intentionally absent */
  readonly maxChunks?: never;
};

export type DividerLoopOptionsLike =
  | DividerLoopOptions
  | DividerLoopEmptyOptions;

// Separator types for better type safety
export type NumericSeparator = number;
export type StringSeparator = string;
export type DividerSeparator = NumericSeparator | StringSeparator;
export type DividerSeparators = DividerSeparator[];

export type DividerArg = DividerSeparator | DividerOptions;
export type DividerArgs = readonly DividerArg[];
