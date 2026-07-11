import { dividerNumberString } from '../../src/core/divider-number-string';
import { TEST_STRINGS, TEST_ARRAYS } from '../fixtures/test-data';

describe('dividerNumberString with string', () => {
  test('divide number and string', () => {
    expect(dividerNumberString(TEST_STRINGS.ABC123DEF)).toEqual([
      'abc',
      '123',
      'def',
    ]);
  });

  test('handles strings with only number or string', () => {
    expect(dividerNumberString(TEST_STRINGS.NUM123)).toEqual(['123']);
    expect(dividerNumberString(TEST_STRINGS.ABC)).toEqual(['abc']);
  });

  test('handles empty string', () => {
    expect(dividerNumberString(TEST_STRINGS.EMPTY)).toEqual([]);
  });

  test('handles invalid input gracefully', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

    expect(dividerNumberString(null as unknown as string)).toEqual([]);
    expect(
      dividerNumberString([123] as unknown as readonly string[])
    ).toEqual([]);

    warnSpy.mockRestore();
  });
});

describe('dividerNumberString with string[]', () => {
  const input = TEST_ARRAYS.ABC123_45Z;

  test('returns nested array by default', () => {
    expect(dividerNumberString(input)).toEqual([
      ['abc', '123'],
      ['45', 'z'],
    ]);
  });

  test('returns flattened array when flatten option is true', () => {
    expect(dividerNumberString(input, { flatten: true })).toEqual([
      'abc',
      '123',
      '45',
      'z',
    ]);
  });

  test('explicit flatten: false returns nested array', () => {
    expect(dividerNumberString(input, { flatten: false })).toEqual([
      ['abc', '123'],
      ['45', 'z'],
    ]);
  });
});

describe('dividerNumberString with trim option', () => {
  test('trims each part in string mode', () => {
    expect(
      dividerNumberString(TEST_STRINGS.ABC123_SPACED, { trim: true })
    ).toEqual(['abc', '123']);
  });

  test('trims and flattens with string[] input', () => {
    expect(
      dividerNumberString(TEST_ARRAYS.A1_B2_SPACED, {
        flatten: true,
        trim: true,
      })
    ).toEqual(['a', '1', 'b', '2']);
  });

  test('preserves empty parts if trim is false', () => {
    expect(
      dividerNumberString(TEST_ARRAYS.A1_B2_SPACED_2, {
        flatten: true,
        trim: false,
      })
    ).toEqual([' a', '1', ' ', ' b', '2', ' ']);
  });

  test('removes empty strings after trim', () => {
    expect(
      dividerNumberString(TEST_ARRAYS.SPACES_ONLY, {
        flatten: true,
        trim: true,
      })
    ).toEqual([]);
  });
});
