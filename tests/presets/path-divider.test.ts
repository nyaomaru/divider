import { pathDivider } from '../../src/presets/path-divider';

describe('pathDivider', () => {
  it('splits by forward slash', () => {
    expect(pathDivider('/usr/local/bin')).toEqual(['usr', 'local', 'bin']);
    expect(pathDivider('a/b/c')).toEqual(['a', 'b', 'c']);
  });

  it('splits by pipe', () => {
    expect(pathDivider('foo|bar|baz')).toEqual(['foo', 'bar', 'baz']);
  });

  it('splits when both separators are mixed', () => {
    expect(pathDivider('foo|bar/baz')).toEqual(['foo', 'bar', 'baz']);
    expect(pathDivider('|a/b|c/')).toEqual(['a', 'b', 'c']);
  });

  it('collapses empty segments by default', () => {
    expect(pathDivider('/a//b/')).toEqual(['a', 'b']);
    expect(pathDivider('||x||')).toEqual(['x']);
  });

  it('keeps empty segments when collapse=false', () => {
    expect(pathDivider('/a//b/', { collapse: false })).toEqual([
      '',
      'a',
      '',
      'b',
      '',
    ]);
    expect(pathDivider('||x||', { collapse: false })).toEqual([
      '',
      '',
      'x',
      '',
      '',
    ]);
  });

  it('trims segments when trim=true', () => {
    expect(pathDivider('  a /  b |  c  ', { trim: true })).toEqual([
      'a',
      'b',
      'c',
    ]);
  });

  it('preserves empty trimmed segments when collapse=false', () => {
    expect(
      pathDivider('  / a /   | b / ', { trim: true, collapse: false }),
    ).toEqual(['', 'a', '', 'b', '']);
  });

  it('collapses whitespace-only segments after trimming', () => {
    expect(pathDivider('  / a /   | b / ', { trim: true })).toEqual([
      'a',
      'b',
    ]);
  });

  it('handles empty input', () => {
    expect(pathDivider('', { collapse: false })).toEqual(['']);
    // collapse=true drops empties that arise only from separators,
    // but for empty input we keep the single empty token above.
    expect(pathDivider('')).toEqual(['']);
  });

  it('handles paths with only separators', () => {
    expect(pathDivider('///', { collapse: false })).toEqual(['', '', '', '']);
    expect(pathDivider('|||', { collapse: false })).toEqual(['', '', '', '']);
    expect(pathDivider('///')).toEqual([]); // collapsed by default
    expect(pathDivider('|||')).toEqual([]); // collapsed by default
  });
});
