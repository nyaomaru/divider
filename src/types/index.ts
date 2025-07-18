import { DividerExcludeModes } from '@/constants';

export type DividerExcludeMode =
  (typeof DividerExcludeModes)[keyof typeof DividerExcludeModes];

// Type guard for string input
export type StringInput = string;
export type StringArrayInput = string[];
export type DividerInput = StringInput | StringArrayInput;

// Result types with more specific naming
export type DividerStringResult = string[];
export type DividerArrayResult = string[][];
export type DividerResult<T extends DividerInput> = T extends StringInput
  ? DividerStringResult
  : DividerArrayResult;

// Options with better documentation
export interface DividerOptions {
  /** If true, flattens nested arrays into a single array */
  flatten?: boolean;
  /** If true, trims whitespace from each divided segment */
  trim?: boolean;
  /** Controls how empty or whitespace segments are handled */
  exclude?: DividerExcludeMode;
}

// Extended options for loop operations
export interface DividerLoopOptions extends DividerOptions {
  /** Starting position for the division (0-based) */
  startOffset?: number;
  /** Maximum number of chunks to produce */
  maxChunks?: number;
}

// Separator types for better type safety
export type NumericSeparator = number;
export type StringSeparator = string;
export type DividerSeparator = NumericSeparator | StringSeparator;
export type DividerSeparators = DividerSeparator[];

// Arguments type combining separators and options
export type DividerArgs =
  | DividerSeparators
  | [...DividerSeparators, DividerOptions];
