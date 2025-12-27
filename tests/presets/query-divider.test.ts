import { queryDivider } from '../../src/presets/query-divider';

describe('queryDivider', () => {
  it('parses simple pairs', () => {
    expect(queryDivider('a=1&b=2')).toEqual([
      ['a', '1'],
      ['b', '2'],
    ]);
  });

  it('handles leading question mark', () => {
    expect(queryDivider('?q=hello')).toEqual([
      ['q', 'hello'],
    ]);
  });

  it('decodes percent-escapes and + as space by default', () => {
    expect(queryDivider('q=hello+world&u=%E3%81%82')).toEqual([
      ['q', 'hello world'],
      ['u', 'あ'],
    ]);
  });

  it('raw mode keeps + as plus', () => {
    expect(queryDivider('q=hello+world', { mode: 'raw' })).toEqual([
      ['q', 'hello+world'],
    ]);
  });

  it('raw mode disables percent-decoding', () => {
    expect(queryDivider('a=%2B', { mode: 'raw' })).toEqual([
      ['a', '%2B'],
    ]);
  });

  it('preserves empty values and keys', () => {
    expect(queryDivider('a=&b&=c&')).toEqual([
      ['a', ''],
      ['b', ''],
      ['', 'c'],
      ['', ''],
    ]);
  });

  it('splits only on the first equals', () => {
    expect(queryDivider('a=1=2')).toEqual([
      ['a', '1=2'],
    ]);
  });

  it('accepts full URLs and extracts the query', () => {
    expect(
      queryDivider('https://example.com/path?a=1&b=%E3%81%82#hash')
    ).toEqual([
      ['a', '1'],
      ['b', 'あ'],
    ]);
  });

  it('returns empty array for empty input or just question mark', () => {
    expect(queryDivider('')).toEqual([]);
    expect(queryDivider('?')).toEqual([]);
  });
});
