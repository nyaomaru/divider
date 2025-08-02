import { divider } from '@/core/divider';
import type { DividerStringResult } from '@/types';
import type { EmailDividerOptions } from '@/types/preset';

const MAX_EMAIL_PARTS = 2;

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

  if (result.length > MAX_EMAIL_PARTS) {
    console.warn(
      `[divider/emailDivider] Too many "@" symbols in "${input}". Expected at most one.`
    );
  }

  if (splitTLD && result.length === MAX_EMAIL_PARTS) {
    const [local, domain] = result;
    const domainParts = divider(domain, '.', dividerOptions);
    return [local, ...domainParts];
  }

  return result;
}
