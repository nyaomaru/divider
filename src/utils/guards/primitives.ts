/**
 * Determines whether the provided value is a string.
 * @param value Value to inspect.
 * @returns True when the value is a string.
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Determines whether the provided value is a number.
 * @param value Value to inspect.
 * @returns True when the value is a number.
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

/**
 * Determines whether the provided value is an object excluding null.
 * @param value Value to inspect.
 * @returns True when the value is an object.
 */
function isObject(value: unknown): value is object {
  return typeof value === 'object' && value !== null;
}

/**
 * Determines whether the value is a plain object with a simple prototype chain.
 * @param value Value to inspect.
 * @returns True when the value behaves like a plain object.
 */
export function isPlainObject(
  value: unknown
): value is Record<string, unknown> {
  if (!isObject(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === null || Object.getPrototypeOf(proto) === null;
}

/**
 * Determines whether the provided value is a positive integer.
 * @param value Value to inspect.
 * @returns True when the value is an integer greater than zero.
 */
export function isPositiveInteger(value: unknown): boolean {
  return typeof value === 'number' && Number.isInteger(value) && value > 0;
}

/**
 * Determines whether the value is a string or a number.
 * @param value Value to inspect.
 * @returns True when the value is a primitive string or number.
 */
export function isStringOrNumber(value: unknown): value is string | number {
  return isString(value) || isNumber(value);
}
