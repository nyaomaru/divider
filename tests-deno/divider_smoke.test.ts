import { assertEquals } from 'jsr:@std/assert';
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

Deno.test('divider: basic index split', () => {
  const result = divider('hello', 1, 3);
  assertEquals(result, ['h', 'el', 'lo']);
});

Deno.test('divider: string separator', () => {
  const result = divider('hello', 'l');
  assertEquals(result, ['he', 'o']);
});

Deno.test('dividerFirst/Last helpers', () => {
  assertEquals(dividerFirst('hello world', ' '), 'hello');
  assertEquals(dividerLast('hello world', ' '), 'world');
});

Deno.test('dividerAt helper', () => {
  assertEquals(dividerAt('first/middle/last', -2, '/'), 'middle');
});

Deno.test('dividerLoop: chunk size', () => {
  const result = dividerLoop('abcdefghij', 3);
  assertEquals(result, ['abc', 'def', 'ghi', 'j']);
});

Deno.test('dividerNumberString', () => {
  const result = dividerNumberString('abc123def');
  assertEquals(result, ['abc', '123', 'def']);
});

Deno.test('presets: pathDivider', () => {
  assertEquals(pathDivider('a/b/c'), ['a', 'b', 'c']);
});

Deno.test('presets: csvDivider with quotes', () => {
  const result = csvDivider('"a,b",c');
  assertEquals(result, ['a,b', 'c']);
});

Deno.test('presets: emailDivider', () => {
  const result = emailDivider('name@example.com');
  assertEquals(result, ['name', 'example.com']);
});
