### 📌 Presets

Some common use cases are wrapped as presets for convenience.

#### `emailDivider()`

Split an email address into its local and domain parts.

```ts
import { emailDivider } from '@nyaomaru/divider';

const result = emailDivider('user@example.com');
// ['user', 'example.com']
```

You can also split the domain part into subdomain and TLD by enabling the splitTLD option:

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

#### `csvDivider()`

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

- Options
  - `delimiter` (default: `','`)
    - Character used to separate fields (one character only).
  - `quoteChar` (default: `'"'`)
    - Character used to wrap fields containing special characters (one character only).
  - `trim` (default: `false`)
    - If true, trims leading and trailing whitespace from field values after removing quotes.
