# 😺 Contributing to Divider

🎉 Thanks for considering contributing to `@nyaomaru/divider` !

We welcome any improvements, whether it's a feature, bugfix, test, or documentation change.

---

## 🛠 Setup

```sh
pnpm install
```

To run tests locally:

```sh
pnpm test
```

## Workflow

1. Fork this repository
2. Clone your forked repository

```sh
git clone https://github.com/YOUR_USERNAME/divider.git
cd divider
```

3. Create a feature branch

```sh
git checkout -b your-feature-name
```

## 🌱 Branch Naming Convention

We don't enforce strict rules on branch naming.

But we recommend using descriptive names for clarity.

Feel free to set your naming like below.

Examples:

- feat/add-email-divider
- fix/multiple-at-symbols
- docs/update-readme

## 💬 Commit Message Style

Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

(Don't worry if you forget it—happens to the best of us!)

```sh
type(scope): brief description

e.g.,
feat(emailDivider): add splitTLD option
fix(core): handle multiple @ symbols
```

Types include: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

## 🚀 Pull Request Process

- Make sure all tests pass (`pnpm test`)
- Describe what you changed and why
- If your PR resolves an issue, mention it (Closes #123)
- Add or update tests if applicable
- Keep PRs focused and concise
- Feel free to open it as a **Draft PR** while you're still working.

## 📏 Style Guide

- No strict rules
- Keep the code **clean**, **readable**, and **documented**
- Prefer descriptive naming
- Add JSDoc comments when introducing new public functions

Thank you again! 🙌

If you have any questions or ideas, feel free to open a discussion or issue. 🚀
