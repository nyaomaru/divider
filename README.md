# Divider

<p align="center">
    <img src="https://raw.githubusercontent.com/nyaomaru/divider/main/logo.svg" width="200px" align="center" alt="Divider logo" />
</p>

<p align="center">
    <a href="https://www.npmjs.com/package/@nyaomaru/divider">
        <img src="https://img.shields.io/npm/v/@nyaomaru/divider.svg?sanitize=true" alt="npm version">
    </a>
    <a href="https://github.com/nyaomaru/divider/blob/main/LICENSE">
        <img src="https://img.shields.io/npm/l/@nyaomaru/divider.svg?sanitize=true" alt="License">
    </a>
    <a href="https://www.npmjs.com/package/@nyaomaru/divider">
        <img src="https://img.shields.io/npm/dt/@nyaomaru/divider.svg" alt="npm downloads">
    </a>
    <a href="https://github.com/nyaomaru/divider/actions">
        <img src="https://github.com/nyaomaru/divider/actions/workflows/release.yml/badge.svg" alt="Build Status">
    </a>
</p>

A simple utility to divide a `string` or `string[]` based on given indexes or delimiters.

## 🚀 Installation

You can install `@nyaomaru/divider` using your favorite package manager:

```sh
# Using pnpm (recommended)
pnpm install @nyaomaru/divider

# Using npm
npm install @nyaomaru/divider

# Using bun
bun add @nyaomaru/divider

# Using yarn
yarn add @nyaomaru/divider
```

## 📖 Documentation

- 📝 Guide: [https://divider-docs.vercel.app](https://divider-docs.vercel.app)
- 🧪 API Reference: [https://nyaomaru.github.io/divider/](https://nyaomaru.github.io/divider/)

## 📖 Usage

👉 [Check out the full documentation here!](https://divider-docs.vercel.app/)

`divider` allows you to divide a string or an array of strings using index positions or delimiters.

### 📌 Basic Usage

```ts
import { divider } from '@nyaomaru/divider';

// Divide a string by index positions
const helloArray = divider('hello', 1, 3);
// ['h', 'el', 'lo']

const [hello1, hello2, ...restHello] = divider('hello', 1, 3, 4);
// hello1 = 'h'
// hello2 = 'el'
// restHello = ['l', 'o']

// Divide a string using a character separator
const divideWithString = divider('hello', 'e');
// ['h', 'llo']

const divideWithMultipleString = divider('hello', 'l');
// ['he', 'o']

// Divide an array of strings
const words = ['hello', 'world'];
const dividedWords = divider(words, 2);
// [['he', 'llo'], ['wo', 'rld']]
const dividedWordsWithFlattenOption = divider(words, 2, { flatten: true });
// ['he', 'llo', 'wo', 'rld']
```

### 📌 Advanced Usage

```ts
// Mixed usage of indexes and characters
const complexDivide = divider('hello world', 3, 'o');
// ['hel', 'l', ' w', 'rld']

// Nested array handling
const nestedArray = divider(['hello', 'new world'], ' ', 2);
// [['he', 'llo'], ['ne', 'w wor', 'ld']]

// Flatten option to get a single array
const flatArray = divider(['hello', 'new world'], ' ', 2, { flatten: true });
// ['he', 'llo', 'ne', 'w', 'wor', 'ld']
```

### 📌 `dividerFirst()` Usage

`dividerFirst()` returns only the first divided element from the result.

```ts
import { dividerFirst } from '@nyaomaru/divider';

const firstElement = dividerFirst('hello world', ' ');
// 'hello'

const firstArrayElement = dividerFirst(['hello', 'world'], 2);
// 'he'
```

### 📌 `dividerLast()` Usage

`dividerLast()` returns only the last divided element from the result.

```ts
import { dividerLast } from '@nyaomaru/divider';

const firstElement = dividerLast('hello world', ' ');
// 'world'

const firstArrayElement = dividerLast(['hello', 'world'], 2);
// 'rld'
```

### 📌 `dividerLoop()` Usage

```ts
import { dividerLoop } from '@nyaomaru/divider';

// Divide string into chunks of given size
const result = dividerLoop('abcdefghij', 3);
// ['abc', 'def', 'ghi', 'j']

// Supports flatten option for string[]
const result2 = dividerLoop(['hello', 'world'], 2, { flatten: true });
// ['he', 'll', 'ow', 'or', 'ld']

// You can also control where to start dividing using `startOffset`
const result3 = dividerLoop('abcdefghij', 3, { startOffset: 1 });
// ['abcd', 'efg', 'hij']

// Combine with flatten and trim
const result4 = dividerLoop(['  hello ', 'world  '], 2, {
  flatten: true,
  trim: true,
  startOffset: 1,
});
// ['h', 'el', 'lo', 'wor', 'ld']

// Limit the number of chunks using maxChunks
const result5 = dividerLoop('abcdefghij', 3, { maxChunks: 2 });
// ['abc', 'defghij']
```

### 📌 `dividerNumberString()` Usage

```ts
import { dividerNumberString } from '@nyaomaru/divider';

// Split numbers and letters from a string
const result = dividerNumberString('abc123def456');
// ['abc', '123', 'def', '456']

// Split each string in a string[]
const result2 = dividerNumberString(['abc123', '45z']);
// [['abc', '123'], ['45', 'z']]

// Flatten option
const result3 = dividerNumberString(['abc123', '45z'], { flatten: true });
// ['abc', '123', '45', 'z']
```

## 🎯 General Options

| Option    | Type                                 | Default  | Description                                                               |
| --------- | ------------------------------------ | -------- | ------------------------------------------------------------------------- |
| `flatten` | `boolean`                            | `false`  | If `true`, the resulting nested arrays are flattened into a single array. |
| `trim`    | `boolean`                            | `false`  | If `true`, trims whitespace from each divided segment.                    |
| `exclude` | `'none'  /  'empty'  / 'whitespace'` | `'none'` | See detailed explanation below                                            |

### `flatten` (default: `false`)

```ts
const words = ['hello', 'world'];
const result = divider(words, 2);
// [['he', 'llo'], ['wo', 'rld']]

const result = divider(words, 2, { flatten: true });
// ['he', 'llo', 'wo', 'rld']
```

### `trim` (default: `false`)

```ts
const result = divider('  hello world  ', 7, { trim: true });
// ['hello', 'world']

const result = divider(['  a  ', ' b  c '], ' ', {
  flatten: true,
  trim: true,
});
// ['a', 'b', 'c']
```

### `exclude` (default: `'none'`)

| Option         | Description                                                              |
| -------------- | ------------------------------------------------------------------------ |
| `'none'`       | Do not exclude any segments (all results are kept).                      |
| `'empty'`      | Exclude empty strings (`''`).                                            |
| `'whitespace'` | Exclude strings that contain only whitespace characters (e.g., `'   '`). |

Control how segments like empty strings (`''`) or whitespace-only strings (`'   '`) are handled.

```ts
// Remove truly empty strings
const result = divider('a,,b', ',', { exclude: 'empty' });
// ['a', 'b']

// Remove both empty and whitespace-only strings
const result = divider('a, ,b', ',', { exclude: 'whitespace' });
// ['a', 'b']

// You can combine with `trim` for clearer results
const result = divider('a, ,b', ',', {
  trim: true,
  exclude: 'whitespace',
});
// ['a', 'b']
```

## Special Options

| Option        | Type     | Default | Description                                                                                             |
| ------------- | -------- | ------- | ------------------------------------------------------------------------------------------------------- |
| `startOffset` | `number` | `0`     | Starting index offset when dividing into chunks (only for `dividerLoop`)                                |
| `maxChunks`   | `number` | `∞`     | Maximum number of chunks allowed. Extra chunks are joined into the last chunk. (only for `dividerLoop`) |

## 💡 Features

- 🧩 Flexible Division: Index-based and string-based separators
- 🧵 Handles Nested Input: Supports both string and string[]
- 🎛️ Optional Behaviors: flatten, trim, excludeEmpty
- 🎯 Targeted Extractors: dividerFirst(), dividerLast()
- 🔁 Loop Support: dividerLoop() for chunked division
- 🔢 Digit-Letter Splitter: dividerNumberString()

## 🛠 Contributing

Welcome your contributions! If you want to add features or fix issues, feel free to submit a PR!

For development setup, project structure, and scripts, see [DEVELOPER.md](./DEVELOPER.md).

### Setup

```sh
pnpm install
```

### Test

```sh
pnpm test
```

### Contribution Guidelines

- If you add new functions, please add corresponding tests in the `tests` directory.
- No strict rules—just keep it clean and readable!
- Thank you for your contribution. 😺
