/**
 * Constants defining the available exclusion modes for divider functions.
 * These modes control how empty or whitespace segments are handled in the output.
 *
 * @constant
 * @enum {string}
 * @property {string} NONE - Keep all segments, including empty and whitespace-only segments
 * @property {string} EMPTY - Exclude empty segments (length = 0)
 * @property {string} WHITESPACE - Exclude segments that contain only whitespace characters
 */
export const DividerExcludeModes = {
  NONE: 'none',
  EMPTY: 'empty',
  WHITESPACE: 'whitespace',
} as const;

/**
 * List of valid option keys for the divider functions.
 * These keys are used to validate and process divider options.
 *
 * - `flatten`: Whether to flatten nested arrays into a single level
 * - `trim`: Whether to trim whitespace from string segments
 * - `exclude`: The exclusion mode to apply to segments (e.g., 'none', 'empty', 'whitespace')
 */
export const dividerOptionKeys = ['flatten', 'trim', 'exclude'] as const;

/**
 * Performance and behavior constants
 */
export const PERFORMANCE_CONSTANTS = {
  /** Maximum number of cached regex patterns to prevent memory leaks */
  MAX_REGEX_CACHE_SIZE: 100,
  /** Default chunk size for dividerLoop when not specified */
  DEFAULT_CHUNK_SIZE: 1,
  /** Default start offset for dividerLoop */
  DEFAULT_START_OFFSET: 0,
  /** Default max chunks for dividerLoop (0 = no limit) */
  DEFAULT_MAX_CHUNKS: 0,
} as const;

/**
 * Separator character used for cache key concatenation.
 */
export const CACHE_KEY_SEPARATOR = '\x00';
