import { csvDivider } from '../../src/presets/csv-divider';

describe('csvDivider', () => {
  it('parses simple comma-separated values', () => {
    const input = 'a,b,c';

    const result = csvDivider(input);

    expect(result).toEqual(['a', 'b', 'c']);
  });

  it('handles quoted field with comma', () => {
    const input = '"a,b",c';

    const result = csvDivider(input);

    expect(result).toEqual(['a,b', 'c']);
  });

  it('handles multiple quoted fields with commas', () => {
    const input = '"a, b", "c, d", e';

    const result = csvDivider(input);

    expect(result).toEqual(['a, b', ' c, d', ' e']);
  });

  it('handles escaped double quotes inside field', () => {
    const input = '"a, ""quoted""",b';

    const result = csvDivider(input);

    expect(result).toEqual(['a, "quoted"', 'b']);
  });

  it('trims whitespace when option is enabled', () => {
    const input = '  a , " b , c "  , d ';

    const result = csvDivider(input, { trim: true });

    expect(result).toEqual(['a', 'b , c', 'd']);
  });

  it('does not trim when option is disabled', () => {
    const input = '  a , " b " , c ';

    const result = csvDivider(input, { trim: false });

    expect(result).toEqual(['  a ', '  b  ', ' c ']);
  });

  it('respects single quote as quoteChar option', () => {
    const input = "'a,b',c";

    const result = csvDivider(input, { quoteChar: "'" });

    expect(result).toEqual(['a,b', 'c']);
  });

  it('parses empty values correctly', () => {
    const input = 'a,,c,';

    const result = csvDivider(input);

    expect(result).toEqual(['a', '', 'c', '']);
  });

  it('handles quoted empty strings', () => {
    const input = '"",a,"",b';

    const result = csvDivider(input);

    expect(result).toEqual(['', 'a', '', 'b']);
  });
});
