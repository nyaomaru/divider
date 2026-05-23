import { divider } from '../../src';

const expectType = <TExpected>(value: TExpected): void => {
  void value;
};

describe('divider type contract', () => {
  it('keeps compile-time result inference stable', () => {
    expectType<string[]>(divider('a,b', ','));
    expectType<string[][]>(divider(['a,b', 'c,d'], ','));
    expectType<string[]>(
      divider(['a,b', 'c,d'], ',', {
        flatten: true,
      }),
    );
    expectType<readonly ['a', 'b']>(divider(['a', 'b'] as const));

    const dynamicFlatten = true as boolean;
    expectType<string[][]>(
      divider(['a,b'], ',', {
        flatten: dynamicFlatten,
      }),
    );

    expect(true).toBe(true);
  });
});
