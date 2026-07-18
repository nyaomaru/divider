import { isEmptyArray } from '@/utils/guards/array';
import { isEmptyString } from '@/utils/guards/whitespace';
import { PERFORMANCE_CONSTANTS } from '@/constants';

// WHY: Normalizing separators (dedupe + remove empties) is needed both for
// cache key creation and pattern generation. Sorting by length descending
// ensures longer delimiters (e.g. "--") are matched before shorter ones
// they include (e.g. "-"), preventing unstable split results.
function normalizeSeparators(separators: readonly string[]): string[] {
  return Array.from(new Set(separators)).filter(
    (separator) => !isEmptyString(separator)
  ).sort((left, right) => right.length - left.length);
}

/**
 * Creates a cache key from already-normalized separators.
 *
 * WHY: Length prefixes keep the encoding unambiguous even when a separator
 * contains control characters or text that resembles another cache entry.
 *
 * @param normalizedSeparators - Separators after dedupe/filter/sort normalization
 * @returns Cache key string
 */
function createCacheKey(
  normalizedSeparators: readonly string[],
): string {
  return normalizedSeparators
    .map((separator) => `${separator.length}:${separator}`)
    .join('');
}

/**
 * Enhanced regex cache with LRU (Least Recently Used) eviction policy.
 * Prevents memory leaks by limiting cache size and efficiently managing cache entries.
 */
class RegexCache {
  private cache = new Map<string, RegExp>();
  private readonly maxSize: number;

  constructor(maxSize: number = PERFORMANCE_CONSTANTS.MAX_REGEX_CACHE_SIZE) {
    this.maxSize = maxSize;
  }

  /**
   * Retrieves a cached RegExp and marks it as recently used.
   *
   * @param key - Cache key string
   * @returns Cached RegExp or null if not found
   */
  get(key: string): RegExp | null {
    const regex = this.cache.get(key);

    if (regex) {
      // Move to end (most recently used) for LRU behavior
      this.cache.delete(key);
      this.cache.set(key, regex);
    }

    return regex || null;
  }

  /**
   * Stores a RegExp and evicts the least-recently-used entry when full.
   *
   * @param key - Cache key string
   * @param regex - Compiled RegExp to cache
   */
  set(key: string, regex: RegExp): void {
    // If key already exists, remove it first to update position
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // LRU eviction: remove oldest entry if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, regex);
  }

  /**
   * Gets current cache size for debugging/monitoring.
   *
   * @returns Number of cached entries
   */
  get size(): number {
    return this.cache.size;
  }

  /**
   * Clears all cached entries.
   * Useful for testing or memory management.
   */
  clear(): void {
    this.cache.clear();
  }
}

// Singleton instance for the entire application
const regexCache = new RegexCache();

/**
 * Generates a global RegExp to match any of the provided string separators.
 *
 * - Returns `null` if the input array is empty.
 * - Uses an enhanced LRU cache to avoid recompiling the same pattern.
 * - Escapes each separator string to safely include special regex characters.
 * - Supports both single-character and multi-character separators.
 * - Compiled pattern uses alternation: `(a|b|c)` for multi-character support.
 * - Automatically manages cache size to prevent memory leaks.
 *
 * @param separators - Array of strings to use as delimiters.
 * @returns A global RegExp to match any of the delimiters, or `null` if input is empty.
 */
export function getRegex(separators: readonly string[]): RegExp | null {
  if (isEmptyArray(separators)) return null;

  // Normalize once per call so cache lookup and compilation share the same data.
  const uniqueSeparators = normalizeSeparators(separators);
  if (uniqueSeparators.length === 0) {
    // If all separators were empty strings, return null
    return null;
  }
  const cacheKey = createCacheKey(uniqueSeparators);

  // Check cache first
  const cached = regexCache.get(cacheKey);
  if (cached) return cached;

  // Compile new regex and cache it
  // Build pattern using alternation for multi-character support
  const pattern = uniqueSeparators.map(escapeRegExp).join('|');
  const regex = new RegExp(`(?:${pattern})`, 'g');

  regexCache.set(cacheKey, regex);
  return regex;
}

/**
 * Escapes special characters in a string to be used safely in a regular expression.
 *
 * For example, '.' becomes '\.', '*' becomes '\*', etc.
 * This prevents unintended behavior when dynamically constructing RegExp patterns.
 *
 * @param str - The string to escape.
 * @returns The escaped string, safe for use in RegExp constructors.
 */
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Export for testing and debugging purposes
export { regexCache };
