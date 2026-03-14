import { DIVIDER_EXCLUDE_MODES } from '@/constants';

/**
 * Supported exclusion modes used to filter divider output.
 */
export type DividerExcludeMode =
  (typeof DIVIDER_EXCLUDE_MODES)[keyof typeof DIVIDER_EXCLUDE_MODES];

/**
 * Single string input accepted by divider functions.
 */
export type StringInput = string;

/**
 * Readonly string array input accepted by divider functions.
 */
export type StringArrayInput = readonly string[];

/**
 * Supported input shapes for divider functions.
 */
export type DividerInput = StringInput | StringArrayInput;

/**
 * Flat divider result.
 */
export type DividerStringResult = string[];

/**
 * Nested divider result for `string[]` inputs when `flatten` is not enabled.
 */
export type DividerArrayResult = string[][];

/**
 * Shared options supported by divider functions.
 */
export type DividerOptions = {
  /** If true, flattens nested arrays into a single array */
  readonly flatten?: boolean;
  /** If true, trims whitespace from each divided segment */
  readonly trim?: boolean;
  /** If true, retains empty segments produced by division */
  readonly preserveEmpty?: boolean;
  /** Controls how empty or whitespace segments are handled */
  readonly exclude?: DividerExcludeMode;
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

/**
 * Computes whether the provided options explicitly enable `flatten`.
 */
type IsFlattenEnabled<TOptions extends DividerInferredOptions> =
  TOptions extends {
    readonly flatten?: infer Flag;
  }
    ? Flag extends true
      ? true
      : false
    : false;

/**
 * Resolves the divider output shape from the input and options.
 */
export type DividerResult<
  T extends DividerInput,
  TOptions extends DividerInferredOptions = DividerEmptyOptions,
> = T extends StringInput
  ? DividerStringResult
  : IsFlattenEnabled<TOptions> extends true
    ? DividerStringResult
    : DividerArrayResult;

/**
 * Numeric separator interpreted as an index.
 */
export type NumericSeparator = number;

/**
 * String separator interpreted as a delimiter.
 */
export type StringSeparator = string;

/**
 * Any supported divider separator.
 */
export type DividerSeparator = NumericSeparator | StringSeparator;

/**
 * A readonly list of separators without options.
 */
export type DividerSeparators = readonly DividerSeparator[];

/**
 * Any single divider argument.
 */
export type DividerArg = DividerSeparator | DividerOptions;

/**
 * Divider arguments with an optional trailing options object.
 *
 * WHY: Runtime only consumes options when they are passed last. This tuple
 * shape keeps the public type contract aligned with that behavior.
 */
export type DividerArgs =
  | DividerSeparators
  | readonly [...DividerSeparator[], DividerOptions];

/**
 * Extracts trailing divider options from a variadic argument tuple.
 */
export type ExtractedDividerOptions<TArgs extends readonly unknown[]> =
  TArgs extends readonly [...infer _, infer Last]
    ? Last extends DividerOptions
      ? Last
      : DividerEmptyOptions
    : DividerEmptyOptions;

/**
 * Computes the divider return type based on the input and provided arguments.
 *
 * WHY: When no arguments are provided, divider returns the input as-is for
 * string arrays. This type keeps the signature aligned with runtime behavior.
 */
export type DividerReturn<
  T extends DividerInput,
  TArgs extends DividerArgs,
> = T extends StringInput
  ? DividerStringResult
  : TArgs['length'] extends 0
    ? T
    : IsFlattenEnabled<ExtractedDividerOptions<TArgs>> extends true
      ? DividerStringResult
      : DividerArrayResult;

/**
 * Additional options supported by `dividerLoop`.
 */
export type DividerLoopOptions = DividerOptions & {
  /** Starting position for the division (0-based) */
  readonly startOffset?: number;
  /** Maximum number of chunks to produce */
  readonly maxChunks?: number;
};

/**
 * Represents the absence of loop-specific options while preserving inference.
 */
export type DividerLoopEmptyOptions = DividerEmptyOptions & {
  /** Placeholder to signal startOffset is intentionally absent */
  readonly startOffset?: never;
  /** Placeholder to signal maxChunks is intentionally absent */
  readonly maxChunks?: never;
};

/**
 * Accepted option shapes for `dividerLoop`.
 */
export type DividerLoopOptionsLike =
  | DividerLoopOptions
  | DividerLoopEmptyOptions;
