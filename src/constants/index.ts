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
export const DIVIDER_EXCLUDE_MODES = {
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
 * - `preserveEmpty`: Whether to retain empty segments created during division
 * - `exclude`: The exclusion mode to apply to segments (e.g., 'none', 'empty', 'whitespace')
 */
export const DIVIDER_OPTION_KEYS = [
  'flatten',
  'trim',
  'preserveEmpty',
  'exclude',
] as const;

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

/**
 * A constant representing a single whitespace character.
 */
export const WHITE_SPACE = ' ';

/**
 * Tab character constant used for indentation and formatting.
 */
export const TAB = '\t';

/**
 * Path separator constants used throughout the application.
 */
export const PATH_SEPARATORS = {
  SLASH: '/',
  ALT: '|',
} as const;

/**
 * Query string separator characters.
 */
export const QUERY_SEPARATORS = {
  QUESTION_MARK: '?',
  AMPERSAND: '&',
  EQUALS: '=',
} as const;

/**
 * Query string decode modes.
 */
export const QUERY_DECODE_MODES = {
  AUTO: 'auto',
  RAW: 'raw',
} as const;
