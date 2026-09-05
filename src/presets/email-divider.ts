import { divider } from '@/core/divider';
import type { DividerStringResult } from '@/types';
import type { EmailDividerOptions } from '@/types/preset';

const MAX_EMAIL_PARTS = 2;

/**
 * Determines whether an email-like input contains more than one separator.
 *
 * WHY: Empty segments are omitted by the core divider, so the divided result
 * cannot reliably reveal repeated separators such as those in `a@@b`.
 *
 * @param input Email-like input to inspect.
 * @returns True when more than one at sign is present.
 */
const hasMultipleAtSigns = (input: string): boolean =>
  input.indexOf('@') !== input.lastIndexOf('@');

/**
 * Divides an email address string at the "@" symbol into its local and domain parts.
 *
 * @param input - The email address string to divide
 * @param options - Optional configuration for the divider operation
 * @returns A DividerStringResult containing the divided parts of the email address
 */
export function emailDivider(
  input: string,
  options: EmailDividerOptions = {}
): DividerStringResult {
  const { splitTLD, ...dividerOptions } = options;

  const result = divider(input, '@', dividerOptions);
  const hasMultipleSeparators = hasMultipleAtSigns(input);

  if (hasMultipleSeparators) {
    console.warn(
      `[divider/emailDivider] Too many "@" symbols in "${input}". Expected at most one.`
    );
  }

  if (
    splitTLD &&
    !hasMultipleSeparators &&
    result.length === MAX_EMAIL_PARTS
  ) {
    const [local, domain] = result;
    const domainParts = divider(domain, '.', dividerOptions);
    return [local, ...domainParts];
  }

  return result;
}
