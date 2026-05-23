import { createDividerPlan } from '../../src/core/divider-plan';
import type { DividerArgs } from '../../src/types';

describe('createDividerPlan', () => {
  it('groups numeric and string separators while extracting trailing options', () => {
    const args = [
      2,
      ',',
      5,
      '-',
      { trim: true, preserveEmpty: true },
    ] as const satisfies DividerArgs;

    expect(createDividerPlan(args)).toEqual({
      numSeparators: [2, 5],
      strSeparators: [',', '-'],
      options: { trim: true, preserveEmpty: true },
    });
  });

  it('uses empty options when no trailing options object is provided', () => {
    const args = [1, '/', '\\'] as const satisfies DividerArgs;

    expect(createDividerPlan(args)).toEqual({
      numSeparators: [1],
      strSeparators: ['/', '\\'],
      options: {},
    });
  });

  it('handles an empty argument list', () => {
    const args = [] as const satisfies DividerArgs;

    expect(createDividerPlan(args)).toEqual({
      numSeparators: [],
      strSeparators: [],
      options: {},
    });
  });
});
