import { dividerAt } from '../../src/index';

describe('dividerAt', () => {
  it('selects a segment by zero-based index', () => {
    expect(dividerAt('first/middle/last', 1, '/')).toBe('middle');
  });

  it('selects backward from the end with a negative index', () => {
    expect(dividerAt('first/middle/last', -2, '/')).toBe('middle');
  });

  it('selects across flattened array input', () => {
    expect(dividerAt(['first/middle', 'last/end'], 2, '/')).toBe('last');
  });

  it('applies segment-processing options before selection', () => {
    expect(
      dividerAt(' first ,   , middle , last ', 1, ',', {
        trim: true,
        preserveEmpty: true,
        exclude: 'whitespace',
      }),
    ).toBe('middle');
  });

  it('returns an empty string when the index is out of range', () => {
    expect(dividerAt('first/middle/last', 3, '/')).toBe('');
    expect(dividerAt('first/middle/last', -4, '/')).toBe('');
  });

  it('returns an empty string when the index is not an integer', () => {
    expect(dividerAt('first/middle/last', 1.5, '/')).toBe('');
    expect(dividerAt('first/middle/last', Number.NaN, '/')).toBe('');
  });
});
