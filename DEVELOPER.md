# DEVELOPER.md

Welcome! This is the developer guide for `divider`. It keeps things light, practical, and up‑to‑date with how the repo works today. Have fun building! ✨

## Quick Start 🚀

- Requirements: Node.js ≥ 20, pnpm
- Recommended: enable pnpm via corepack

```sh
corepack enable
git clone https://github.com/nyaomaru/divider.git
cd divider
pnpm install
```

Note: the repo enforces pnpm's minimum package age policy. Installs will block
dependency versions published within the last 2 days (`minimumReleaseAge: 2880`)
to reduce supply-chain risk.

Using mise? It’s optional but comfy:

- Install mise (pick one):
  - macOS: `brew install mise`
  - Linux: `curl https://mise.run | sh`
  - Windows (PowerShell): `irm https://mise.run | iex`
- Install pinned toolchain: `mise install`
- Run tasks with pinned tools: `mise run <task>`
- One‑shot QA: `mise run qa` (lint + test + build)

## Project Map 🧭

- `src/` TypeScript source
  - `core/` core logic
  - `utils/` small helpers
  - `presets/` ready‑to‑use presets
  - `types/` shared types
  - `constants/` constants
  - Entry: `index.ts` (Node/NPM), `mod.ts` (JSR)
- `tests/` Jest tests
  - Unit: `tests/utils/`, `tests/core/`, `tests/presets/`
  - Integration: `tests/integration/`
  - Performance: `tests/performance/`
- `tests-deno/`, `tests-bun/` Deno/Bun checks
- `dist/` built by tsup — don’t edit
- Alias: `@/…` → `src/` (see `tsconfig.json` / `deno.json`)

## Everyday Commands 🛠

| Command                 | Description                                   |
| ----------------------- | --------------------------------------------- |
| `pnpm build`            | Build the library using tsup                  |
| `pnpm test`             | Run all tests (unit + performance) via vitest |
| `pnpm test:performance` | Benchmark `divider` against common scenarios  |
| `pnpm test:unit`        | Run isolated unit tests                       |
| `pnpm lint`             | Run ESLint for code quality                   |
| `pnpm typedoc`          | Generate API documentation with TypeDoc       |

Before pushing: `pnpm lint && pnpm test && pnpm build` ✅

Using mise instead:

- `mise run qa` (lint → test → build)
- `mise run lint|build|test|test_unit|test_performance|test_integration`
- Deno: `mise run deno_check|deno_test|deno_lint|deno_fmt|deno_fmt_check|deno_publish`
- Bun smoke: `mise run bun_test`

## Coding Style 🧰

- TypeScript `strict: true`; prefer `readonly` inputs; avoid mutating params
- Naming: files kebab‑case, Types PascalCase, functions camelCase, constants UPPER_SNAKE_CASE
- Formatting: Prettier 3 via ESLint (2‑space, single quotes, trailing commas)
- Complexity: keep cyclomatic complexity ≤ 7
- Avoid magic numbers; lift them into `src/constants/`
- Public APIs: JSDoc (one‑liner + `@param`/`@returns`)
- Add short WHY comments where behavior isn’t obvious
- Prefer `@/…` imports over deep relative paths

Handy configs: `eslint.config.js`, `tsconfig.json`, `tsup.config.ts`, `jest.config.cjs`, `jest.performance.config.cjs`

## Testing 🧪 (Jest + ts‑jest)

- Env: Node; preset: `ts-jest`
- Where: `tests/**.test.ts`, performance in `tests/performance/**.performance.test.ts`, integration in `tests/integration/`
- Alias: `@/` → `src/` via `moduleNameMapper`
- Cover: normal paths, edge/error cases (empty strings/arrays), quoted/escaped, irregular separators

## Build & Distribution 📦

- Bundled by `tsup` → ESM/CJS + `.d.ts` in `dist/`
- Don’t edit `dist/` manually
- Node/NPM consumers use `package.json` `exports`
- JSR (Deno/Bun) uses `deno.json` / `jsr.json` and `src/mod.ts`

## Deno / Bun / JSR Notes 🟦

- Deno import map: `deno.json` → `imports: { "@/": "./src/" }`
- Helpful: `deno task check | test | lint | fmt`
- Publish to JSR from a tag: `deno publish` (CI supports OIDC)
- See `tests-deno/` and `tests-bun/` for extra checks

## Commits & PRs 📮

- Conventional Commits: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`
- PRs: explain purpose, link issues, note behavior changes; add tiny examples when tweaking parsing
- Quality gate: pass `pnpm lint && pnpm test && pnpm build`
- Don’t bump versions or edit `dist/` by hand (automated releases)

## Happy Path Checklist ✅

1. Implement in `src/**` (helpers → `utils/`, core → `core/`)
2. Add tests in `tests/**` (BDD + AAA)
3. Lint → `pnpm lint`
4. Test → `pnpm test` (narrow as needed)
5. Build → `pnpm build`

More docs: `README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`

Questions or ideas? Open an Issue/PR — we’re friendly! 😺

Happy hacking! 🛠✨
