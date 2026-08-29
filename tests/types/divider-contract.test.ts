import {
  csvDivider,
  divider,
  dividerAt,
  dividerFirst,
  dividerLast,
  dividerLoop,
  dividerNumberString,
  emailDivider,
  lineDivider,
  pathDivider,
  queryDivider,
} from '../../src';
import type {
  CsvDividerOptions,
  DividerArrayResult,
  DividerLoopOptions,
  DividerOptions,
  DividerSegmentOptions,
  DividerStringResult,
  EmailDividerOptions,
  LineDividerOptions,
  PathDividerOptions,
  QueryDividerOptions,
} from '../../src';

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

describe('root public API contract', () => {
  it('exports divider functions with stable return types', () => {
    expectType<DividerStringResult[number]>(dividerAt('a,b', 1, ','));
    expectType<DividerStringResult[number]>(dividerFirst('a,b', ','));
    expectType<DividerStringResult[number]>(dividerLast('a,b', ','));
    expectType<DividerStringResult[number]>(
      dividerFirst(' a,b', ',', { trim: true }),
    );
    expectType<DividerStringResult[number]>(
      dividerLast('a,b ', ',', { exclude: 'whitespace' }),
    );
    expectType<DividerStringResult>(dividerLoop('abcdef', 2));
    expectType<DividerArrayResult>(dividerLoop(['abcdef'], 2));
    expectType<DividerStringResult>(
      dividerLoop(['abcdef'], 2, { flatten: true }),
    );
    expectType<DividerStringResult>(dividerNumberString('a1'));
    expectType<DividerArrayResult>(dividerNumberString(['a1']));
    expectType<DividerStringResult>(
      dividerNumberString(['a1'], { flatten: true }),
    );

    expectType<DividerStringResult>(csvDivider('a,b'));
    expectType<DividerStringResult>(emailDivider('name@example.com'));
    expectType<DividerStringResult>(lineDivider('first\nsecond'));
    expectType<DividerStringResult>(pathDivider('/a/b'));
    expectType<DividerArrayResult>(queryDivider('a=1&b=2'));

    expect(true).toBe(true);
  });

  it('exports public option types from the root entry point', () => {
    const dividerOptions: DividerOptions = {
      flatten: true,
      trim: true,
      preserveEmpty: true,
      exclude: 'none',
    };
    const loopOptions: DividerLoopOptions = {
      flatten: true,
      maxChunks: 2,
      startOffset: 1,
    };
    const segmentOptions: DividerSegmentOptions = {
      trim: true,
      preserveEmpty: true,
      exclude: 'empty',
    };
    const csvOptions: CsvDividerOptions = {
      delimiter: ',',
      quoteChar: '"',
      trim: true,
    };
    const emailOptions: EmailDividerOptions = {
      splitTLD: true,
      trim: true,
    };
    const pathOptions: PathDividerOptions = {
      collapse: true,
      trim: true,
    };
    const lineOptions: LineDividerOptions = {
      preserveEmpty: true,
      trim: true,
    };
    const queryOptions: QueryDividerOptions = {
      mode: 'auto',
      trim: true,
    };

    expectType<DividerOptions>(dividerOptions);
    expectType<DividerLoopOptions>(loopOptions);
    expectType<DividerSegmentOptions>(segmentOptions);
    expectType<CsvDividerOptions>(csvOptions);
    expectType<EmailDividerOptions>(emailOptions);
    expectType<LineDividerOptions>(lineOptions);
    expectType<PathDividerOptions>(pathOptions);
    expectType<QueryDividerOptions>(queryOptions);
  });
});
