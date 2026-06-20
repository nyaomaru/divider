import assert from 'node:assert/strict';
import { divider } from '@nyaomaru/divider';

const result = divider('hello world', ' ');
assert.deepEqual(result, ['hello', 'world']);
