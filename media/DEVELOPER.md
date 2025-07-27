# DEVELOPER.md

Welcome, developer! This guide will help you understand how to set up and work with the `divider` codebase.

## 📦 Local Setup

First, make sure you're using Node.js version 22 or higher.

If you don’t have Node.js installed, download it from [here](https://nodejs.org/en/download).

### 📌 Make sure you have pnpm installed

We use [`pnpm`](https://pnpm.io/) as a fast, disk-efficient package manager.
You can enable it using:

```bash
corepack enable
```

### 🚀 Get started

```bash
git clone https://github.com/nyaomaru/divider.git
cd divider
pnpm install
```

## 🏗 Project Structure

```bash
divider/
├── src/            # Main library source code
│ ├── constants/    # Constants declaration
│ ├── core/         # Core implementation of divider functions
│ ├── types/        # Type definition
│ ├── utils/        # Utility functions (e.g., isString, isPositiveInteger)
│ └── index.ts      # Entry point
├── tests/          # Unit tests using vitest.
├── .github/        # GitHub workflows, issue templates, etc.
├── .cursor/        # Cursor prompt rules.
├── package.json    # Project metadata and scripts
├── README.md       # User-facing documentation
└── ...
```

## 🧪 Scripts

Common development scripts:

| Command                 | Description                                   |
| ----------------------- | --------------------------------------------- |
| `pnpm build`            | Build the library using tsup                  |
| `pnpm test`             | Run all tests (unit + performance) via vitest |
| `pnpm test:performance` | Benchmark `divider` against common scenarios  |
| `pnpm test:unit`        | Run isolated unit tests                       |
| `pnpm lint`             | Run ESLint for code quality                   |
| `pnpm typedoc`          | Generate API documentation with TypeDoc       |

## 🌱 Environment Variables

No environment variables are required for local development.

## 🔗 Related Docs

- `README.md` – General usage & install guide
- `CHANGELOG.md` – Release history

Happy hacking! 🛠✨
