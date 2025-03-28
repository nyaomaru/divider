import { isEmptyArray } from '@/utils/is';

const regexCache = new Map<string, RegExp>();

export function getRegex(separators: string[]): RegExp | null {
  if (isEmptyArray(separators)) return null;

  const key = JSON.stringify(separators);

  if (!regexCache.has(key)) {
    const pattern = separators.reduce(
      (acc, sep) => acc + escapeRegExp(sep),
      ''
    );
    regexCache.set(key, new RegExp(`[${pattern}]`, 'g'));
  }

  return regexCache.get(key)!;
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
