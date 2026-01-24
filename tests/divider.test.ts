import { divider } from '../src/index';

describe('divider with string', () => {
  test('divide with single number', () => {
    expect(divider('hello', 2)).toEqual(['he', 'llo']);
  });

  test('divide with multiple numbers', () => {
    expect(divider('hello', 1, 3)).toEqual(['h', 'el', 'lo']);
    expect(divider('hello', 1, 3, 4)).toEqual(['h', 'el', 'l', 'o']);
  });

  test('divide with reverse number order', () => {
    expect(divider('hello', 2, 1)).toEqual(['h', 'e', 'llo']);
    expect(divider('hello', 5, 3)).toEqual(['hel', 'lo']);
  });

  test('divide with string separator', () => {
    expect(divider('hello', 'e')).toEqual(['h', 'llo']);
    expect(divider('hello', 'l')).toEqual(['he', 'o']);
    expect(divider('hello', 'a')).toEqual(['hello']);
  });

  test('divide with multiple string separators', () => {
    expect(divider('hello', 'l', 'o')).toEqual(['he']);
    expect(divider('hello world', ' ', 'o')).toEqual(['hell', 'w', 'rld']);
  });

  test('divide with mixed numbers and strings', () => {
    expect(divider('hello', 2, 'l')).toEqual(['he', 'o']);
    expect(divider('hello world', ' ', 3)).toEqual(['hel', 'lo', 'world']);
  });

  describe('options', () => {
    test('trim option removes whitespace', () => {
      expect(divider('  a  b   c  ', ' ', { trim: true })).toEqual([
        'a',
        'b',
        'c',
      ]);
    });

    test('trim with only spaces returns empty array', () => {
      expect(divider('   ', ' ', { trim: true })).toEqual([]);
    });

    test('exclude option filters segments', () => {
      expect(divider('a, ,b', ',', { exclude: 'none' })).toEqual([
        'a',
        ' ',
        'b',
      ]);
      expect(divider('a, ,b', ',', { exclude: 'empty' })).toEqual([
        'a',
        ' ',
        'b',
      ]);
      expect(divider('a, ,b', ',', { exclude: 'whitespace' })).toEqual([
        'a',
        'b',
      ]);
    });

    test('combines trim and exclude options', () => {
      expect(
        divider('a, ,b', ',', { trim: true, exclude: 'whitespace' })
      ).toEqual(['a', 'b']);
    });
  });

  test('handles empty separators', () => {
    expect(divider('hello', ...([] as const))).toEqual(['hello']);
  });

  test('handles invalid input gracefully', () => {
    expect(divider(null as any, 2)).toEqual([]);
    expect(divider(undefined as any, 2)).toEqual([]);
    expect(divider(123 as any, 2)).toEqual([]);
    expect(divider({} as any, 2)).toEqual([]);
  });

  test('edge cases', () => {
    expect(divider('hello')).toEqual(['hello']);
    expect(divider('', 'a')).toEqual([]);
    expect(divider('hello', 0)).toEqual(['hello']);
    expect(divider('hello', 5)).toEqual(['hello']);
    expect(divider('hello', 10)).toEqual(['hello']);
    expect(divider('hello', '😃')).toEqual(['hello']);
  });

  test('handles unicode characters', () => {
    expect(divider('hello world', 3)).toEqual(['hel', 'lo world']);
    expect(divider('hello😃world', '😃')).toEqual(['hello', 'world']);
  });

  test('handles special regex characters', () => {
    expect(divider('hello.world', '.')).toEqual(['hello', 'world']);
    expect(divider('hello*world', '*')).toEqual(['hello', 'world']);
    expect(divider('hello+world', '+')).toEqual(['hello', 'world']);
  });
});

describe('divider with string[]', () => {
  test('divide with single number', () => {
    expect(divider(['hello', 'world'], 2)).toEqual([
      ['he', 'llo'],
      ['wo', 'rld'],
    ]);
  });

  test('divide with multiple numbers', () => {
    expect(divider(['hello', 'new world'], 1, 3)).toEqual([
      ['h', 'el', 'lo'],
      ['n', 'ew', ' world'],
    ]);
  });

  test('divide with string separator', () => {
    expect(divider(['hello', 'new world'], 'e')).toEqual([
      ['h', 'llo'],
      ['n', 'w world'],
    ]);
  });

  test('divide with mixed separators', () => {
    expect(divider(['hello', 'new world'], 2, 'l')).toEqual([
      ['he', 'o'],
      ['ne', 'w wor', 'd'],
    ]);
  });

  describe('options', () => {
    test('flatten option flattens nested arrays', () => {
      expect(divider(['hello', 'world'], 2, { flatten: true })).toEqual([
        'he',
        'llo',
        'wo',
        'rld',
      ]);
    });

    test('trim with flatten removes whitespace', () => {
      expect(
        divider(['  abc  ', ' de f '], ' ', { flatten: true, trim: true })
      ).toEqual(['abc', 'de', 'f']);
    });

    test('exclude with flatten filters segments', () => {
      expect(
        divider(['a', ', ,', 'b'], ',', {
          flatten: true,
          exclude: 'whitespace',
        })
      ).toEqual(['a', 'b']);
    });

    test('all options combined', () => {
      expect(
        divider(['  a, ,b  ', ' c,d '], ',', {
          flatten: true,
          trim: true,
          exclude: 'whitespace',
        })
      ).toEqual(['a', 'b', 'c', 'd']);
    });
  });

  test('handles empty array', () => {
    expect(divider([], 'a')).toEqual([]);
    expect(divider([''], 'a')).toEqual([[]]);
  });

  test('handles empty rows with trim option', () => {
    expect(divider([''], 'a', { trim: true })).toEqual([[]]);
  });

  test('handles edge cases', () => {
    expect(divider(['hello', 'world'])).toEqual(['hello', 'world']);
    expect(divider(['hello'], 0)).toEqual([['hello']]);
    expect(divider(['hello'], 10)).toEqual([['hello']]);
  });

  test('handles unicode in arrays', () => {
    expect(divider(['hello', 'ab'], 3)).toEqual([['hel', 'lo'], ['ab']]);
  });
});
