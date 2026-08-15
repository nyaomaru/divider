import { dividerFirst } from '../../src/index';
import {
  TEST_STRINGS,
  TEST_ARRAYS,
  TEST_SEPARATORS,
  EXPECTED_RESULTS,
} from '../fixtures/test-data';

const runDividerFirstTests = (
  label: string,
  input: string | string[],
  expectedResults: typeof EXPECTED_RESULTS.DIVIDER_FIRST.STRING
) => {
  describe(`${label}`, () => {
    test('divide with single number', () => {
      expect(dividerFirst(input, TEST_SEPARATORS.NUMBERS.SINGLE)).toEqual(
        expectedResults.singleNumber
      );
    });

    test('divide with multiple number', () => {
      expect(dividerFirst(input, ...TEST_SEPARATORS.NUMBERS.MULTIPLE)).toEqual(
        expectedResults.multipleNumbers
      );
    });

    test('divide with reverse number', () => {
      expect(dividerFirst(input, ...TEST_SEPARATORS.NUMBERS.REVERSE)).toEqual(
        expectedResults.reverseNumbers
      );
    });

    test('divide with string', () => {
      expect(dividerFirst(input, TEST_SEPARATORS.STRINGS.SINGLE)).toEqual(
        expectedResults.stringSeparator
      );
    });

    test('divide with multiple character separators', () => {
      expect(dividerFirst(input, ...TEST_SEPARATORS.STRINGS.MULTIPLE)).toEqual(
        expectedResults.multipleStringSeparators
      );
    });

    test('empty separators', () => {
      expect(dividerFirst(input, ...([] as const))).toEqual(
        expectedResults.emptySeparators
      );
    });

    test('handling undefined or null input', () => {
      expect(dividerFirst(null as any, TEST_SEPARATORS.NUMBERS.SINGLE)).toEqual(
        ''
      );
      expect(
        dividerFirst(undefined as any, TEST_SEPARATORS.NUMBERS.SINGLE)
      ).toEqual('');
    });

    test('edge cases', () => {
      expect(dividerFirst(input)).toEqual(expectedResults.edgeCases[0]);
      expect(dividerFirst(input, TEST_SEPARATORS.STRINGS.NOT_FOUND)).toEqual(
        expectedResults.edgeCases[1]
      );
      expect(dividerFirst(input, TEST_SEPARATORS.NUMBERS.ZERO)).toEqual(
        expectedResults.edgeCases[2]
      );
      expect(dividerFirst(input, 5)).toEqual(expectedResults.edgeCases[3]);
      expect(dividerFirst(input, TEST_SEPARATORS.NUMBERS.LARGE)).toEqual(
        expectedResults.edgeCases[4]
      );
      expect(dividerFirst(input, TEST_SEPARATORS.STRINGS.UNICODE)).toEqual(
        expectedResults.edgeCases[5]
      );
    });
  });
};

runDividerFirstTests(
  'dividerFirst with string',
  TEST_STRINGS.HELLO,
  EXPECTED_RESULTS.DIVIDER_FIRST.STRING
);
runDividerFirstTests(
  'dividerFirst with string[]',
  TEST_ARRAYS.HELLO_WORLD,
  EXPECTED_RESULTS.DIVIDER_FIRST.ARRAY
);

describe('dividerFirst with options', () => {
  test('applies trim before selecting the first segment', () => {
    expect(dividerFirst('  hello , world  ', ',', { trim: true })).toBe(
      'hello'
    );
  });

  test('can preserve an empty first segment', () => {
    expect(dividerFirst(',hello', ',', { preserveEmpty: true })).toBe('');
  });

  test('applies exclusion before selecting the first segment', () => {
    expect(
      dividerFirst('   ,hello', ',', {
        preserveEmpty: true,
        exclude: 'whitespace',
      })
    ).toBe('hello');
  });
});
