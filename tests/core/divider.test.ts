import { divider } from '../../src/core/divider';

describe('divider', () => {
  it('omits empty segments by default', () => {
    expect(divider('foo,,bar,', ',')).toEqual(['foo', 'bar']);
  });

  it('preserves empty segments when preserveEmpty is true', () => {
    expect(divider('foo,,bar,', ',', { preserveEmpty: true })).toEqual([
      'foo',
      '',
      'bar',
      '',
    ]);
  });
});
