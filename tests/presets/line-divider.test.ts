import { lineDivider } from '../../src/presets/line-divider';

describe('lineDivider', () => {
  it('divides Unix line endings', () => {
    expect(lineDivider('first\nsecond\nthird')).toEqual([
      'first',
      'second',
      'third',
    ]);
  });

  it('divides Windows line endings without leaving carriage returns', () => {
    expect(lineDivider('first\r\nsecond\r\nthird')).toEqual([
      'first',
      'second',
      'third',
    ]);
  });

  it('divides mixed and legacy Mac line endings', () => {
    expect(lineDivider('first\rsecond\nthird\r\nfourth')).toEqual([
      'first',
      'second',
      'third',
      'fourth',
    ]);
  });

  it('preserves blank lines and trailing line endings by default', () => {
    expect(lineDivider('first\n\nthird\n')).toEqual([
      'first',
      '',
      'third',
      '',
    ]);
  });

  it('removes blank lines when preserveEmpty is false', () => {
    expect(lineDivider('\nfirst\n\nsecond\n', { preserveEmpty: false })).toEqual([
      'first',
      'second',
    ]);
  });

  it('trims whitespace from each line', () => {
    expect(lineDivider(' first \n  second\t', { trim: true })).toEqual([
      'first',
      'second',
    ]);
  });

  it('handles empty input according to preserveEmpty', () => {
    expect(lineDivider('')).toEqual(['']);
    expect(lineDivider('', { preserveEmpty: false })).toEqual([]);
  });
});
