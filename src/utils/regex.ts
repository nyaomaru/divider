import { isEmptyArray } from '@/utils/is';

const regexCache = new Map<string, RegExp>();

/**
 * Generates a global RegExp to match any of the provided string separators.
 *
 * - Returns `null` if the input array is empty.
 * - Uses a simple in-memory cache (`regexCache`) to avoid recompiling the same pattern.
 * - Escapes each separator string to safely include special regex characters.
 * - Compiled pattern is in the form `[a|b|c]` using a character class.
 *
 * @param separators - Array of strings to use as delimiters.
 * @returns A global RegExp to match any of the delimiters, or `null` if input is empty.
 */
export function getRegex(separators: string[]): RegExp | null {
  if (isEmptyArray(separators)) return null;

  const key = JSON.stringify(separators);

  if (regexCache.has(key)) return regexCache.get(key)!;

  const pattern = separators.reduce((acc, sep) => acc + escapeRegExp(sep), '');
  regexCache.set(key, new RegExp(`[${pattern}]`, 'g'));
  return regexCache.get(key)!;
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
