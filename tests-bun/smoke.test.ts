import { test, expect } from 'bun:test';
import {
  divider,
  dividerAt,
  dividerFirst,
  dividerLast,
  dividerLoop,
  dividerNumberString,
  csvDivider,
  emailDivider,
  pathDivider,
} from '../src/index.ts';

test('divider: basic index split', () => {
  expect(divider('hello', 1, 3)).toEqual(['h', 'el', 'lo']);
});

test('divider: string separator', () => {
  expect(divider('hello', 'l')).toEqual(['he', 'o']);
});

test('dividerFirst/Last helpers', () => {
  expect(dividerFirst('hello world', ' ')).toBe('hello');
  expect(dividerLast('hello world', ' ')).toBe('world');
});

test('dividerAt helper', () => {
  expect(dividerAt('first/middle/last', -2, '/')).toBe('middle');
});

test('dividerLoop: chunk size', () => {
  expect(dividerLoop('abcdefghij', 3)).toEqual(['abc', 'def', 'ghi', 'j']);
});

test('dividerNumberString', () => {
  expect(dividerNumberString('abc123def')).toEqual(['abc', '123', 'def']);
});

test('presets: pathDivider', () => {
  expect(pathDivider('a/b/c')).toEqual(['a', 'b', 'c']);
});

test('presets: csvDivider with quotes', () => {
  expect(csvDivider('"a,b",c')).toEqual(['a,b', 'c']);
});

test('presets: emailDivider', () => {
  expect(emailDivider('name@example.com')).toEqual(['name', 'example.com']);
});
