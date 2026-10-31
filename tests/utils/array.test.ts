import { ensureStringArray } from '../../src/utils/array';

describe('ensureStringArray', () => {
  test('wrap a string in an array', () => {
    expect(ensureStringArray('hello')).toEqual(['hello']);
  });

  test('return the same array if input is already an array', () => {
    const arr = ['a', 'b', 'c'];
    expect(ensureStringArray(arr)).toBe(arr);
  });

  test('return the same array if input is an empty array', () => {
    const arr: string[] = [];
    expect(ensureStringArray(arr)).toBe(arr);
  });
});
