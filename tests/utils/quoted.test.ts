import {
  dividePreserve,
  countUnescaped,
  stripOuterQuotes,
  quotedDivide,
} from '../../src/utils/quoted';

describe('dividePreserve', () => {
  it('splits normally with single delimiter', () => {
    expect(dividePreserve('a,b,c', ',')).toEqual(['a', 'b', 'c']);
  });

  it('preserves consecutive empties', () => {
    expect(dividePreserve('a,,c', ',')).toEqual(['a', '', 'c']);
  });

  it('preserves trailing empty token', () => {
    expect(dividePreserve('a,b,', ',')).toEqual(['a', 'b', '']);
  });

  it('preserves leading empty token', () => {
    expect(dividePreserve(',a,b', ',')).toEqual(['', 'a', 'b']);
  });

  it('returns single empty field for empty input', () => {
    expect(dividePreserve('', ',')).toEqual(['']);
  });
});

describe('countUnescaped', () => {
  it('counts single quotes, ignoring escaped pairs', () => {
    expect(countUnescaped('"', '"')).toBe(1);
    expect(countUnescaped('""', '"')).toBe(0);
    expect(countUnescaped('"""', '"')).toBe(1);
    expect(countUnescaped('""""', '"')).toBe(0);
  });

  it('counts quotes across chunks split by escaped pairs', () => {
    expect(countUnescaped('He said ""Hi""', '"')).toBe(0);
    expect(countUnescaped('"a","b"', '"')).toBe(4);
  });
});

describe('stripOuterQuotes', () => {
  it('removes a matched outer quote pair and keeps surrounding spaces', () => {
    expect(stripOuterQuotes(' "a" ', '"')).toBe(' a ');
    expect(stripOuterQuotes('\t"abc"\t', '"')).toBe('\tabc\t');
  });

  it('restores escaped quotes inside', () => {
    expect(stripOuterQuotes('"He said ""Hi"""', '"')).toBe('He said "Hi"');
  });

  it('returns original when not starting with a quote (except escape restore)', () => {
    expect(stripOuterQuotes('no-quotes', '"')).toBe('no-quotes');
  });

  it('handles unclosed starting quote leniently (default)', () => {
    expect(stripOuterQuotes('"abc', '"')).toBe('abc');
    expect(stripOuterQuotes('  "abc  ', '"')).toBe('  abc  ');
  });

  it('does not strip when lenient=false and unclosed', () => {
    expect(stripOuterQuotes('"abc', '"', { lenient: false })).toBe('"abc');
  });

  it('optionally removes trailing quote after spaces when only start is quoted', () => {
    expect(stripOuterQuotes('"a"  ', '"')).toBe('a  ');
  });
});

describe('quotedDivide', () => {
  it('splits simple CSV', () => {
    expect(quotedDivide('a,b,c')).toEqual(['a', 'b', 'c']);
  });

  it('preserves empty values from consecutive/trailing delimiters', () => {
    expect(quotedDivide('a,,c,')).toEqual(['a', '', 'c', '']);
    expect(quotedDivide(',a,')).toEqual(['', 'a', '']);
  });

  it('handles a quoted field containing delimiter', () => {
    expect(quotedDivide('"a,b",c')).toEqual(['a,b', 'c']);
  });

  it('handles multiple quoted fields with commas and spaces around', () => {
    expect(quotedDivide('"a, b"," c, d"," e"')).toEqual([
      'a, b',
      ' c, d',
      ' e',
    ]);
  });

  it('handles escaped double quotes inside a field', () => {
    expect(quotedDivide('"a, ""quoted""",b')).toEqual(['a, "quoted"', 'b']);
  });

  it('trims whitespace when option is enabled (after unquoting)', () => {
    expect(quotedDivide('  "a" , " b , c " ,  "d"  ', { trim: true })).toEqual([
      'a',
      'b , c',
      'd',
    ]);
  });

  it('does not trim when option is disabled', () => {
    expect(quotedDivide('  "a" , " b " ,  " c "  ', { trim: false })).toEqual([
      '  a ',
      '  b  ',
      '   c   ',
    ]);
  });

  it('respects single-quote as quote char', () => {
    expect(quotedDivide("'a,b',c", { quote: "'" })).toEqual(['a,b', 'c']);
  });

  it('handles quoted empty strings and normal values', () => {
    expect(quotedDivide('"",a,"",b')).toEqual(['', 'a', '', 'b']);
  });

  it('handles input with only delimiters', () => {
    expect(quotedDivide(',,')).toEqual(['', '', '']);
  });

  it('handles trailing quoted field with delimiter inside', () => {
    expect(quotedDivide('a,"b,c"')).toEqual(['a', 'b,c']);
  });

  it('handles unclosed quote gracefully (lenient)', () => {
    expect(quotedDivide('"a,b')).toEqual(['a,b']);
  });

  it('supports custom delimiter', () => {
    expect(quotedDivide('"a;b";c;"";d;', { delimiter: ';' })).toEqual([
      'a;b',
      'c',
      '',
      'd',
      '',
    ]);
  });

  it('returns single empty field for empty input', () => {
    expect(quotedDivide('')).toEqual(['']);
  });
});
