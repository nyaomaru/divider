import { dividerLast } from '../../src/index';
import {
  TEST_STRINGS,
  TEST_ARRAYS,
  TEST_SEPARATORS,
  EXPECTED_RESULTS,
} from '../fixtures/test-data';

const runDividerLastTests = (
  label: string,
  input: string | string[],
  expectedResults: typeof EXPECTED_RESULTS.DIVIDER_LAST.STRING
) => {
  describe(`${label}`, () => {
    test('divide with single number', () => {
      expect(dividerLast(input, TEST_SEPARATORS.NUMBERS.SINGLE)).toEqual(
        expectedResults.singleNumber
      );
    });

    test('divide with multiple number', () => {
      expect(dividerLast(input, ...TEST_SEPARATORS.NUMBERS.MULTIPLE)).toEqual(
        expectedResults.multipleNumbers
      );
    });

    test('divide with reverse number', () => {
      expect(dividerLast(input, ...TEST_SEPARATORS.NUMBERS.REVERSE)).toEqual(
        expectedResults.reverseNumbers
      );
    });

    test('divide with string', () => {
      expect(dividerLast(input, TEST_SEPARATORS.STRINGS.SINGLE)).toEqual(
        expectedResults.stringSeparator
      );
    });

    test('divide with multiple character separators', () => {
      expect(dividerLast(input, ...TEST_SEPARATORS.STRINGS.MULTIPLE)).toEqual(
        expectedResults.multipleStringSeparators
      );
    });

    test('empty separators', () => {
      expect(dividerLast(input, ...([] as const))).toEqual(
        expectedResults.emptySeparators
      );
    });

    test('handling undefined or null input', () => {
      expect(dividerLast(null as any, TEST_SEPARATORS.NUMBERS.SINGLE)).toEqual(
        ''
      );
      expect(
        dividerLast(undefined as any, TEST_SEPARATORS.NUMBERS.SINGLE)
      ).toEqual('');
    });

    test('edge cases', () => {
      expect(dividerLast(input)).toEqual(expectedResults.edgeCases[0]);
      expect(dividerLast(input, TEST_SEPARATORS.STRINGS.NOT_FOUND)).toEqual(
        expectedResults.edgeCases[1]
      );
      expect(dividerLast(input, TEST_SEPARATORS.NUMBERS.ZERO)).toEqual(
        expectedResults.edgeCases[2]
      );
      expect(dividerLast(input, 5)).toEqual(expectedResults.edgeCases[3]);
      expect(dividerLast(input, TEST_SEPARATORS.NUMBERS.LARGE)).toEqual(
        expectedResults.edgeCases[4]
      );
      expect(dividerLast(input, TEST_SEPARATORS.STRINGS.UNICODE)).toEqual(
        expectedResults.edgeCases[5]
      );
    });
  });
};

runDividerLastTests(
  'dividerLast with string',
  TEST_STRINGS.WORLD,
  EXPECTED_RESULTS.DIVIDER_LAST.STRING
);
runDividerLastTests(
  'dividerLast with string[]',
  TEST_ARRAYS.HELLO_WORLD,
  EXPECTED_RESULTS.DIVIDER_LAST.ARRAY
);

describe('dividerLast with options', () => {
  test('applies trim before selecting the last segment', () => {
    expect(dividerLast('  hello , world  ', ',', { trim: true })).toBe(
      'world'
    );
  });

  test('can preserve an empty last segment', () => {
    expect(dividerLast('hello,', ',', { preserveEmpty: true })).toBe('');
  });

  test('applies exclusion before selecting the last segment', () => {
    expect(
      dividerLast('hello,   ', ',', {
        preserveEmpty: true,
        exclude: 'whitespace',
      })
    ).toBe('hello');
  });
});
