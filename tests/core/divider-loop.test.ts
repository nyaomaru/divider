import { dividerLoop } from '../../src/index';
import {
  TEST_STRINGS,
  TEST_ARRAYS,
  TEST_SEPARATORS,
} from '../fixtures/test-data';

describe('dividerLoop with string', () => {
  test('divides evenly', () => {
    expect(
      dividerLoop(TEST_STRINGS.ABCDEFGH, TEST_SEPARATORS.NUMBERS.SINGLE)
    ).toEqual(['ab', 'cd', 'ef', 'gh']);
  });

  test('divides unevenly', () => {
    expect(
      dividerLoop(TEST_STRINGS.ABCDEFGHI, TEST_SEPARATORS.NUMBERS.THREE)
    ).toEqual(['abc', 'def', 'ghi']);
    expect(
      dividerLoop(TEST_STRINGS.ABCDEFGHIJ, TEST_SEPARATORS.NUMBERS.THREE)
    ).toEqual(['abc', 'def', 'ghi', 'j']);
  });

  describe('with startOffset option', () => {
    test('applies startOffset correctly', () => {
      expect(
        dividerLoop(TEST_STRINGS.ABCDEFGH, TEST_SEPARATORS.NUMBERS.SINGLE, {
          startOffset: 1,
        })
      ).toEqual(['abc', 'de', 'fg', 'h']);
    });

    test('returns original string if startOffset exceeds string length', () => {
      expect(
        dividerLoop(TEST_STRINGS.ABC, TEST_SEPARATORS.NUMBERS.SINGLE, {
          startOffset: 10,
        })
      ).toEqual(['abc']);
    });
  });

  describe('with maxChunks option', () => {
    test('limits chunks to 2 for a string input', () => {
      expect(
        dividerLoop(TEST_STRINGS.ABCDEFGHIJ, TEST_SEPARATORS.NUMBERS.THREE, {
          maxChunks: 2,
        })
      ).toEqual(['abc', 'defghij']);
    });

    test('does not alter result when chunk count is below maxChunks', () => {
      expect(
        dividerLoop(TEST_STRINGS.ABCDE, TEST_SEPARATORS.NUMBERS.SINGLE, {
          maxChunks: 5,
        })
      ).toEqual(['ab', 'cd', 'e']);
    });

    test('returns a single merged chunk when maxChunks is 1', () => {
      expect(
        dividerLoop(TEST_STRINGS.ABCDEF, TEST_SEPARATORS.NUMBERS.SINGLE, {
          maxChunks: 1,
        })
      ).toEqual(['abcdef']);
    });
  });

  test('handles empty string', () => {
    expect(
      dividerLoop(TEST_STRINGS.EMPTY, TEST_SEPARATORS.NUMBERS.THREE)
    ).toEqual(['']);
  });

  test('handles invalid size', () => {
    expect(
      dividerLoop(TEST_STRINGS.ABCDEF, TEST_SEPARATORS.NUMBERS.ZERO)
    ).toEqual([]);
    expect(
      dividerLoop(TEST_STRINGS.ABCDEF, TEST_SEPARATORS.NUMBERS.NEGATIVE, {
        flatten: true,
      })
    ).toEqual([]);
  });

  test('handles invalid input gracefully', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

    expect(
      dividerLoop(
        null as unknown as string,
        TEST_SEPARATORS.NUMBERS.SINGLE
      )
    ).toEqual([]);
    expect(
      dividerLoop(
        [123] as unknown as readonly string[],
        TEST_SEPARATORS.NUMBERS.SINGLE
      )
    ).toEqual([]);

    warnSpy.mockRestore();
  });
});

describe('dividerLoop with string[]', () => {
  const input = TEST_ARRAYS.ABCDEF_GHIJKLMN;

  test('divides evenly', () => {
    expect(dividerLoop(input, TEST_SEPARATORS.NUMBERS.SINGLE)).toEqual([
      ['ab', 'cd', 'ef'],
      ['gh', 'ij', 'kl', 'mn'],
    ]);
  });

  test('divides with flatten true', () => {
    expect(
      dividerLoop(input, TEST_SEPARATORS.NUMBERS.SINGLE, { flatten: true })
    ).toEqual(['ab', 'cd', 'ef', 'gh', 'ij', 'kl', 'mn']);
  });

  describe('with startOffset option', () => {
    test('applies startOffset correctly', () => {
      expect(
        dividerLoop(TEST_ARRAYS.ABCDEF_GHIJKL, TEST_SEPARATORS.NUMBERS.SINGLE, {
          startOffset: 1,
        })
      ).toEqual([
        ['abc', 'de', 'f'],
        ['ghi', 'jk', 'l'],
      ]);
    });

    test('works with startOffset + flatten + trim', () => {
      expect(
        dividerLoop(
          TEST_ARRAYS.HELLO_WORLD_SPACED,
          TEST_SEPARATORS.NUMBERS.SINGLE,
          {
            startOffset: 1,
            flatten: true,
            trim: true,
          }
        )
      ).toEqual(['h', 'el', 'lo', 'wor', 'ld']);
    });
  });

  describe('with maxChunks option', () => {
    test('limits chunks to 2 for an array of strings', () => {
      expect(
        dividerLoop(
          TEST_ARRAYS.ABCDEFGHIJ_KLMNOPQRST,
          TEST_SEPARATORS.NUMBERS.THREE,
          {
            maxChunks: 2,
          }
        )
      ).toEqual([
        ['abc', 'defghij'],
        ['klm', 'nopqrst'],
      ]);
    });

    test('flattens the result when flatten: true is used', () => {
      expect(
        dividerLoop(
          TEST_ARRAYS.ABCDEFGHIJ_KLMNOPQRST,
          TEST_SEPARATORS.NUMBERS.THREE,
          {
            maxChunks: 2,
            flatten: true,
          }
        )
      ).toEqual(['abc', 'defghij', 'klm', 'nopqrst']);
    });
  });

  test('handles invalid size', () => {
    expect(
      dividerLoop(input, TEST_SEPARATORS.NUMBERS.ZERO, { flatten: true })
    ).toEqual([]);
    expect(
      dividerLoop(input, TEST_SEPARATORS.NUMBERS.NEGATIVE, { flatten: true })
    ).toEqual([]);
  });

  test('handles empty array', () => {
    expect(
      dividerLoop(TEST_ARRAYS.EMPTY, TEST_SEPARATORS.NUMBERS.SINGLE, {
        flatten: true,
      })
    ).toEqual([]);
  });
});

describe('dividerLoop with trim option', () => {
  test('trims whitespace in string mode', () => {
    expect(
      dividerLoop(TEST_STRINGS.WHITESPACE_ALT, TEST_SEPARATORS.NUMBERS.SINGLE, {
        trim: true,
      })
    ).toEqual(['ab', 'cd', 'e', 'f']);
  });

  test('does not trim when trim is false (string)', () => {
    expect(
      dividerLoop(TEST_STRINGS.WHITESPACE_ALT, TEST_SEPARATORS.NUMBERS.SINGLE, {
        trim: false,
      })
    ).toEqual(['  ', 'ab', '  ', 'cd', ' e', 'f ', ' ']);
  });

  test('trims whitespace in string[] mode with flatten', () => {
    expect(
      dividerLoop(
        TEST_ARRAYS.HELLO_WORLD_SPACED_2,
        TEST_SEPARATORS.NUMBERS.SINGLE,
        {
          flatten: true,
          trim: true,
        }
      )
    ).toEqual(['h', 'el', 'lo', 'w', 'or', 'ld']);
  });

  test('does not trim when trim is false (string[] flatten)', () => {
    expect(
      dividerLoop(
        TEST_ARRAYS.HELLO_WORLD_SPACED_3,
        TEST_SEPARATORS.NUMBERS.SINGLE,
        {
          flatten: true,
          trim: false,
        }
      )
    ).toEqual(['  ', 'he', 'll', 'o ', ' w', 'or', 'ld', '  ']);
  });
});
