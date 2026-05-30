import {
  decodeQueryField,
  extractQuery,
  parseQueryPairs,
  splitQueryPair,
  stripLeadingQuestionMark,
} from '../../src/utils/query';

describe('query utilities', () => {
  describe('extractQuery', () => {
    it('extracts query text from absolute and relative URLs', () => {
      expect(extractQuery('https://example.com/path?a=1&b=2#hash')).toBe(
        'a=1&b=2',
      );
      expect(extractQuery('/path/to/resource?a=1&b=2#hash')).toBe('a=1&b=2');
    });

    it('keeps a question mark inside raw query text', () => {
      expect(extractQuery('a=b?c=d')).toBe('a=b?c=d');
    });

    it('removes fragments from query-like input', () => {
      expect(extractQuery('?q=hello#hash')).toBe('q=hello');
    });
  });

  describe('stripLeadingQuestionMark', () => {
    it('removes only one leading question mark', () => {
      expect(stripLeadingQuestionMark('?a=1')).toBe('a=1');
      expect(stripLeadingQuestionMark('??a=1')).toBe('?a=1');
    });
  });

  describe('splitQueryPair', () => {
    it('splits on the first equals sign only', () => {
      expect(splitQueryPair('a=1=2')).toEqual(['a', '1=2']);
    });

    it('preserves missing keys and values', () => {
      expect(splitQueryPair('b')).toEqual(['b', '']);
      expect(splitQueryPair('=c')).toEqual(['', 'c']);
    });
  });

  describe('decodeQueryField', () => {
    it('decodes plus signs and percent escapes in auto mode', () => {
      expect(decodeQueryField('hello+%E3%81%82', 'auto', false)).toBe(
        'hello あ',
      );
    });

    it('keeps malformed percent escapes unchanged', () => {
      expect(decodeQueryField('%E0%A4%A', 'auto', false)).toBe('%E0%A4%A');
    });

    it('supports raw and trim modes', () => {
      expect(decodeQueryField('+a+', 'raw', false)).toBe('+a+');
      expect(decodeQueryField('+a+', 'auto', true)).toBe('a');
    });
  });

  describe('parseQueryPairs', () => {
    it('preserves empty keys, values, and trailing separators', () => {
      expect(parseQueryPairs('a=&b&=c&')).toEqual([
        ['a', ''],
        ['b', ''],
        ['', 'c'],
        ['', ''],
      ]);
    });
  });
});
