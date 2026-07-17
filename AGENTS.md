# Repository Guidelines

## Project Structure & Module Organization

EggscuseMe is a pnpm-managed Next.js App Router app written in TypeScript. Routes, layouts, and pages live in `app/`. Shared code is under `src/`, with feature modules in `src/features/`, utilities in `src/lib/`, hooks in `src/hooks/`, and generated Prisma types in `src/generated/`. Email templates are in `emails/`, localized messages in `messages/`, assets in `public/`, docs/content in `docs/` and `content/`, Prisma files in `prisma/`, unit tests in `__tests__/`, and Playwright tests in `e2e/`.

## Build, Test, and Development Commands

Use pnpm, matching `packageManager` in `package.json`.

- `pnpm dev`: start the local Next.js dev server with Turbopack.
- `pnpm build`: build the app for production.
- `pnpm start`: serve the production build.
- `pnpm ts`: run TypeScript checking with `tsc --noEmit`.
- `pnpm lint:ci`: run ESLint without modifying files.
- `pnpm lint`: run ESLint with auto-fix.
- `pnpm format`: format files with Prettier.
- `pnpm test:ci`: run Vitest once.
- `pnpm test:e2e:ci`: run Playwright headlessly.
- `pnpm prisma:migrate`, `pnpm prisma:generate`, `pnpm prisma:seed`: manage local Prisma changes.

## Coding Style & Naming Conventions

Follow strict TypeScript and existing App Router patterns. Use 2-space indentation, semicolons, Unix line endings, type-only imports, and `type` aliases when ESLint requires them. Prefer aliases from `vitest.config.mjs`: `@/`, `@app/`, `@email/`, and `@test/`. Keep feature logic under `src/features/<feature>/`, with descriptive files such as `newsletter.schema.ts` and `newsletter.action.ts`.

## Testing Guidelines

Vitest uses `happy-dom`, `test/vitest.setup.ts`, and `__tests__/**/*.[jt]s?(x)`. Name unit tests after the behavior or module, for example `freshness-calculator.test.ts`. Playwright tests live in `e2e/*.spec.ts`; reuse `e2e/utils/` helpers for authentication and setup. Run the smallest relevant test before submitting changes; use `pnpm test:e2e:ci -g "name"` for targeted E2E checks.

## Commit & Pull Request Guidelines

Recent history uses Conventional Commits such as `fix(email): ...`, `fix: ...`, and `chore: ...`. Keep subjects imperative and scoped when useful. Pull requests should include a clear summary, linked issue or context, screenshots for UI changes, Prisma migration notes, and the checks run.

## Security & Configuration Tips

Copy `.env-template` to `.env` and never commit secrets. Database, auth, email, Stripe, Redis, and webhook settings are environment-driven. Treat production database scripts in `scripts/db/` as high-risk.
