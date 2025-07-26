import { divider } from '@/core/divider';
import type { DividerStringResult } from '@/types';
import type { EmailDividerOptions } from '@/types/preset';

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
  const result = divider(input, '@', options);

  if (result.length > 2) {
    console.warn(
      `[divider/emailDivider] Too many "@" symbols in "${input}". Expected at most one.`
    );
  }

  return result;
}
