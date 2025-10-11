import { divideString } from '../../src/utils/parser';

describe('divideString', () => {
  test('divide by index positions', () => {
    expect(divideString('hello world', [2, 4], [])).toEqual([
      'he',
      'll',
      'o world',
    ]);
  });

  test('divide by string separator', () => {
    expect(divideString('hello,world', [], [','])).toEqual(['hello', 'world']);
  });

  test('divide by both index and string separators', () => {
    expect(divideString('hello-world,beauty', [3], ['-'])).toEqual([
      'hel',
      'lo',
      'world,beauty',
    ]);
  });

  test('returns the input as a single element when no separators are provided', () => {
    expect(divideString('hello world', [], [])).toEqual(['hello world']);
  });

  test('handles an empty string correctly', () => {
    expect(divideString('', [2], [])).toEqual([]);
    expect(divideString('', [], [','])).toEqual([]);
  });

  test('preserves empty segments when requested', () => {
    expect(
      divideString('foo,,bar,', [], [','], { preserveEmpty: true })
    ).toEqual(['foo', '', 'bar', '']);
  });

  test('returns the input unchanged if no separators match', () => {
    expect(divideString('hello world', [12], ['-'])).toEqual(['hello world']);
  });

  test('handles consecutive string separators correctly', () => {
    expect(divideString('hello--world', [], ['-'])).toEqual(['hello', 'world']);
  });

  test('throws an error if numSeparators contains non-number values', () => {
    expect(() =>
      // @ts-expect-error intentional misuse
      divideString('hello', ['not-a-number'], [])
    ).toThrow('Invalid numeric separators');
  });

  test('throws an error if numSeparators is not an array', () => {
    expect(() =>
      // @ts-expect-error intentional misuse
      divideString('hello', 'not-an-array', [])
    ).toThrow('Invalid numeric separators');
  });
});
