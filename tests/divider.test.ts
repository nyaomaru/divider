import { divider } from '../src/index';

describe('divider with string', () => {
  test('divide with single number', () => {
    expect(divider('hello', 2)).toEqual(['he', 'llo']);
  });

  test('divide with multiple number', () => {
    expect(divider('hello', 1, 3)).toEqual(['h', 'el', 'lo']);
    expect(divider('hello', 1, 3, 4)).toEqual(['h', 'el', 'l', 'o']);
    expect(divider('hello', 1, 3, 5)).toEqual(['h', 'el', 'lo']);
  });

  test('divide with reverse number', () => {
    expect(divider('hello', 2, 1)).toEqual(['h', 'e', 'llo']);
    expect(divider('hello', 5, 3)).toEqual(['hel', 'lo']);
  });

  test('divide with string', () => {
    expect(divider('hello', 'e')).toEqual(['h', 'llo']);
    expect(divider('hello', 'l')).toEqual(['he', 'o']);
    expect(divider('hello', 'a')).toEqual(['hello']);
  });

  test('divide with multiple character separators', () => {
    expect(divider('hello', 'l', 'o')).toEqual(['he']);
    expect(divider('hello world', ' ', 'o')).toEqual(['hell', 'w', 'rld']);
  });

  test('divide with mixed numbers and characters', () => {
    expect(divider('hello', 2, 'l')).toEqual(['he', 'o']);
    expect(divider('hello world', ' ', 3)).toEqual(['hel', 'lo', 'world']);
  });

  test('edge cases', () => {
    expect(divider('', 'a')).toEqual([]);
    expect(divider('hello', 0)).toEqual(['hello']);
    expect(divider('hello', 5)).toEqual(['hello']);
    expect(divider('hello', 10)).toEqual(['hello']);
  });
});

describe('divider with string[]', () => {
  test('divide with single number', () => {
    expect(divider(['hello', 'world'], 2)).toEqual([
      ['he', 'llo'],
      ['wo', 'rld'],
    ]);
  });

  test('divide with multiple number', () => {
    expect(divider(['hello', 'new world'], 1, 3)).toEqual([
      ['h', 'el', 'lo'],
      ['n', 'ew', ' world'],
    ]);
    expect(divider(['hello', 'new world'], 1, 3, 4)).toEqual([
      ['h', 'el', 'l', 'o'],
      ['n', 'ew', ' ', 'world'],
    ]);
    expect(divider(['hello', 'new world'], 1, 3, 5)).toEqual([
      ['h', 'el', 'lo'],
      ['n', 'ew', ' w', 'orld'],
    ]);
  });

  test('divide with reverse number', () => {
    expect(divider(['hello', 'new world'], 2, 1)).toEqual([
      ['h', 'e', 'llo'],
      ['n', 'e', 'w world'],
    ]);
    expect(divider(['hello', 'new world'], 5, 3)).toEqual([
      ['hel', 'lo'],
      ['new', ' w', 'orld'],
    ]);
  });

  test('divide with string', () => {
    expect(divider(['hello', 'new world'], 'e')).toEqual([
      ['h', 'llo'],
      ['n', 'w world'],
    ]);
    expect(divider(['hello', 'new world'], 'l')).toEqual([
      ['he', 'o'],
      ['new wor', 'd'],
    ]);
    expect(divider(['hello', 'new world'], 'a')).toEqual([
      ['hello'],
      ['new world'],
    ]);
  });

  test('divide with multiple character separators', () => {
    expect(divider(['hello', 'new world'], 'l', 'o')).toEqual([
      ['he'],
      ['new w', 'r', 'd'],
    ]);
    expect(divider(['hello', 'new world'], ' ', 'o')).toEqual([
      ['hell'],
      ['new', 'w', 'rld'],
    ]);
  });

  test('divide with mixed numbers and characters', () => {
    expect(divider(['hello', 'new world'], 2, 'l')).toEqual([
      ['he', 'o'],
      ['ne', 'w wor', 'd'],
    ]);
    expect(divider(['hello', 'new world'], ' ', 3)).toEqual([
      ['hel', 'lo'],
      ['new', 'world'],
    ]);
  });

  test('edge cases', () => {
    expect(divider([''], 'a')).toEqual([[]]);
    expect(divider(['hello'], 0)).toEqual([['hello']]);
    expect(divider(['hello'], 5)).toEqual([['hello']]);
    expect(divider(['hello'], 10)).toEqual([['hello']]);
  });
});
