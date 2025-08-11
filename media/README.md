# 📌 Presets

Some common use cases are wrapped as presets for convenience.

## `emailDivider()`

Divide an email address into its local and domain parts.

```ts
import { emailDivider } from '@nyaomaru/divider';

const result = emailDivider('user@example.com');
// ['user', 'example.com']
```

You can also divide the domain part into subdomain and TLD by enabling the splitTLD option:

```ts
const result = emailDivider('user@mail.example.co.uk', { splitTLD: true });
// ['user', 'mail', 'example', 'co', 'uk']
```

Trim whitespace from both parts if needed:

```ts
const result = emailDivider('  user@example.com  ', { trim: true });
// ['user', 'example.com']
```

🛎 If multiple @ symbols are found, all segments are returned and a warning is logged.

### Options

| name       | default | description                                                                             |
| ---------- | ------- | --------------------------------------------------------------------------------------- |
| `trim`     | `false` | if true, trims leading and trailing whitespace from field values after removing quotes. |
| `splitTLD` | `false` | if true, divide top-level domain from the rest of the email address.                    |

## `csvDivider()`

Splits a CSV line into an array of fields, handling quoted values correctly.
Internally uses a quoted-aware splitter built on top of `divider`.

```ts
import { csvDivider } from '@nyaomaru/divider';

const result = csvDivider('a,b,c');
// ['a', 'b', 'c']
```

Multiple quoted fields:

```ts
const result = csvDivider('"a, b", "c, d", e');
// ['a, b', ' c, d', ' e']
```

Escaped quotes ("" → " restoration):

```ts
const result = csvDivider('"a, ""quoted""",b');
// ['a, "quoted"', 'b']
```

Empty values and trailing separators are preserved:

```ts
const result = csvDivider('a,,c,');
// ['a', '', 'c', '']
```

Without trimming (outer spaces are preserved):

```ts
const result = csvDivider('  a , " b " , c ', { trim: false });
// ['  a ', '  b  ', ' c ']
```

Custom quote character:

```ts
const result = csvDivider("'a,b',c", { quoteChar: "'" });
// ['a,b', 'c']
```

Custom delimiter:

```ts
const result = csvDivider('"a;b";c;"";d;', { delimiter: ';' });
// ['a;b', 'c', '', 'd', '']
```

Lenient parsing for unclosed quotes:

```ts
const result = csvDivider('"a,b');
// ['a,b']
```

Empty input returns a single empty field:

```ts
const result = csvDivider('');
// ['']
```

### Options

| name        | default | description                                                                             |
| ----------- | ------- | --------------------------------------------------------------------------------------- |
| `delimiter` | `','`   | Character used to separate fields (one character only).                                 |
| `quoteChar` | `'"'`   | Character used to wrap fields containing special characters (one character only).       |
| `trim`      | `false` | If true, trims leading and trailing whitespace from field values after removing quotes. |

## `pathDivider()`

Splits a file path string into segments using both forward slash (/) and pipe (|) as separators.

```ts
import { pathDivider } from '@nyaomaru/divider';

pathDivider('/usr/local/bin');
// ['usr', 'local', 'bin']

pathDivider('foo|bar/baz');
// ['foo', 'bar', 'baz']
```

Collapse empty segments (default):

```ts
pathDivider('/a//b/');
// ['a', 'b']
```

Keep empty segments:

```ts
pathDivider('/a//b/', { collapse: false });
// ['', 'a', '', 'b', '']
```

Trim whitespace from each segment:

```ts
pathDivider(' a / b | c ', { trim: true });
// ['a', 'b', 'c']
```

### Options

| name       | default | description                                                                |
| ---------- | ------- | -------------------------------------------------------------------------- |
| `trim`     | `false` | If true, trims leading and trailing whitespace from each segment.          |
| `collapse` | `true`  | If true, removes empty segments caused by repeated or trailing separators. |
