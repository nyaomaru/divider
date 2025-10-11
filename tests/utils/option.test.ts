import { applyDividerOptions, extractOptions } from '../../src/utils/option';

describe('applyDividerOptions', () => {
  test('trim only', () => {
    const result = [
      ['  a ', ' b'],
      ['c ', ' d '],
    ];
    const options = { trim: true } as const;

    expect(applyDividerOptions(result, options)).toEqual([
      ['a', 'b'],
      ['c', 'd'],
    ]);
  });

  test('flatten only', () => {
    const result = [
      ['a', 'b'],
      ['c', 'd'],
    ];
    const options = { flatten: true } as const;

    expect(applyDividerOptions(result, options)).toEqual(['a', 'b', 'c', 'd']);
  });

  test('both trim and flatten', () => {
    const result = [
      [' a ', ' b'],
      ['c ', 'd'],
    ];
    const options = { trim: true, flatten: true } as const;

    expect(applyDividerOptions(result, options)).toEqual(['a', 'b', 'c', 'd']);
  });

  test('neither', () => {
    const result = [
      ['a', 'b'],
      ['c', 'd'],
    ];
    const options = {} as const;

    expect(applyDividerOptions(result, options)).toEqual(result);
  });

  test('trim keeps empty segments when preserveEmpty is true', () => {
    const result = [
      ['  a ', '   '],
      ['   ', ' b '],
    ];

    expect(
      applyDividerOptions(result, { trim: true, preserveEmpty: true })
    ).toEqual([
      ['a', ''],
      ['', 'b'],
    ]);
  });

  test('handles unknown exclude mode gracefully', () => {
    const result = [['a', '', ' '], ['b']];

    expect(applyDividerOptions(result, { exclude: 'unknown' } as any)).toEqual([
      ['a', '', ' '],
      ['b'],
    ]);
  });
});

describe('extractOptions', () => {
  test('separate options from args', () => {
    const args = [1, 'x', { flatten: true }];

    const { cleanedArgs, options } = extractOptions(args);

    expect(cleanedArgs).toEqual([1, 'x']);
    expect(options).toEqual({ flatten: true });
  });

  test('return empty options when not provided', () => {
    const args = [1, 'x'];

    const { cleanedArgs, options } = extractOptions(args);

    expect(cleanedArgs).toEqual([1, 'x']);
    expect(options).toEqual({});
  });

  test('return all cleanedArgs if only strings and numbers', () => {
    const args = ['a', 2, 3, 'b'];

    const { cleanedArgs, options } = extractOptions(args);

    expect(cleanedArgs).toEqual(['a', 2, 3, 'b']);
    expect(options).toEqual({});
  });

  test('handle empty args', () => {
    const args: (string | number)[] = [];

    const { cleanedArgs, options } = extractOptions(args);

    expect(cleanedArgs).toEqual([]);
    expect(options).toEqual({});
  });
});
