# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About the project EggscuseMe

**EggscuseMe** is a web application that helps users manage the freshness of their eggs, avoid food waste, and cook eggs optimally based on their laying date.

### Problem Solved

- Confusion about egg expiration dates leads to unnecessary waste
- People don't know which cooking method suits eggs at different freshness levels
- No easy way to track multiple egg boxes in the fridge

### Main Features

1. **Virtual Fridge**: Track egg boxes with color-coded freshness indicators
2. **Smart Recommendations**: Cooking suggestions based on egg freshness
3. **Intelligent Timer**: Cooking times adjusted for egg size/temperature
4. **Anti-Waste Statistics**: Track savings and consumption patterns
5. **Family Sharing**: Share fridge with family/roommates via Organizations

### Business Model

- **Free Plan**: 2 egg boxes max, basic features
- **Premium Plan** (2.99/month): Unlimited boxes, full history, notifications, recipes

### Egg Freshness Rules (Core Business Logic)

| Period    | Status          | Color      | Recommended Use                          |
| --------- | --------------- | ---------- | ---------------------------------------- |
| Day 0-9   | Extra-fresh     | Green      | Soft-boiled, poached, raw (mayo, mousse) |
| Day 10-21 | Fresh           | Yellow     | Fried, scrambled, omelette, baking       |
| Day 22-28 | Cook thoroughly | Orange/Red | Hard-boiled only                         |
| Day 29+   | Expired         | Gray       | Discard                                  |

### Technical Decisions

- **i18n**: French (default) + English via next-intl
- **Theme**: Dark mode by default, light mode available
- **Design System**: Complete token-based system (no hardcoded values)
- **Multi-tenant**: Uses Organization system for family sharing

## Development Commands

### Core Commands

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build the application
- `pnpm start` - Start production server
- `pnpm ts` - Run TypeScript type checking
- `pnpm lint` - Run ESLint with auto-fix
- `pnpm lint:ci` - Run ESLint without auto-fix for CI
- `pnpm clean` - Run lint, type check, and format code
- `pnpm format` - Format code with Prettier

### Testing Commands

- `pnpm test` - Run unit tests in watch mode
- `pnpm test:ci` - Run unit tests in CI mode
- `pnpm test:e2e` - Run e2e tests with UI (requires HEADLESS=0)
- `pnpm test:e2e:ci` - Run e2e tests in CI mode (headless)

**Run a single test:**

```bash
# Unit test (Vitest)
pnpm test -- __tests__/path/to/test.test.ts

# E2E test (Playwright)
pnpm test:e2e:ci -- e2e/signup.spec.ts
```

### Database Commands

- `pnpm prisma:migrate` - Run database migrations
- `pnpm prisma:seed` - Seed the database
- `pnpm prisma:generate` - Regenerate Prisma client
- `pnpm better-auth:migrate` - Generate better-auth Prisma schema

### Development Tools

- `pnpm email` - Email development server
- `pnpm stripe-webhooks` - Listen for Stripe webhooks
- `pnpm knip` - Run knip for unused code detection

## Architecture Overview

### Technology Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS v4 with Shadcn/UI components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better Auth with organization support
- **Email**: React Email with Resend
- **Payments**: Stripe integration
- **Testing**: Vitest for unit tests, Playwright for e2e
- **Package Manager**: pnpm
- **Caching**: Redis (required for session and organization caching)
- **PWA**: Service Worker with push notifications support

### Required Services

| Service       | Purpose                   | Setup                                 |
| ------------- | ------------------------- | ------------------------------------- |
| PostgreSQL    | Primary database          | Required                              |
| Redis         | Session caching, org data | Required - See `/docs/redis-setup.md` |
| Resend        | Email delivery            | Required for auth emails              |
| Stripe        | Payments                  | Optional (for billing features)       |
| Google Gemini | AI Vision scan            | Optional (for IA date scanning)       |

### Project Structure

- `app/` - Next.js App Router pages and layouts
- `src/components/` - UI components (Shadcn/UI in `ui/`, custom in `nowts/`)
- `src/features/` - Feature-specific components and logic
- `src/lib/` - Utilities, configurations, and services
- `src/hooks/` - Custom React hooks
- `emails/` - Email templates using React Email
- `prisma/` - Database schema and migrations
- `e2e/` - End-to-end tests
- `__tests__/` - Unit tests

### Key Features

- **Multi-tenant Organizations**: Full organization management with roles and permissions
- **Authentication**: Email/password, magic links, OAuth (GitHub, Google)
- **Billing**: Stripe subscriptions with plan management
- **Dialog System**: Global dialog manager for modals and confirmations
- **Forms**: React Hook Form with Zod validation and server actions
- **Email System**: Transactional emails with React Email

## Code Conventions

### TypeScript

- Use `type` over `interface` (enforced by ESLint)
- Prefer functional components with TypeScript types
- No enums - use maps instead
- Strict TypeScript configuration

### React/Next.js

- Prefer React Server Components over client components
- Use `"use client"` only for Web API access in small components
- Wrap client components in `Suspense` with fallback
- Use dynamic loading for non-critical components
- **ALWAYS use the global `PageProps<"/route/path">` type for page components** - NEVER create local `PageProps` type definitions
  - Example: `export default async function MyPage(props: PageProps<"/admin/users">) {}`

### Styling

- Mobile-first approach with TailwindCSS
- Use Shadcn/UI components from `src/components/ui/`
- Custom components in `src/components/nowts/`

### Styling preferences

- Use the shared typography components in `@src/components/ui/typography.tsx` for paragraphs and headings (instead of creating custom `p`, `h1`, `h2`, etc.).
- For spacing, prefer utility layouts like `flex flex-col gap-4` for vertical spacing and `flex gap-4` for horizontal spacing (instead of `space-y-4`).
- Prefer the card container `@src/components/ui/card.tsx` for styled wrappers rather than adding custom styles directly to `<div>` elements.

### State Management

- Use `nuqs` for URL search parameter state
- Zustand for global state (see dialog-store.ts)
- TanStack Query for server state

### Forms and Server Actions

- Use React Hook Form with Zod validation
- Server actions in `.action.ts` files
- Use `resolveActionResult` helper for mutations
- Follow form creation pattern in `/src/features/form/`

### Authentication

- Use `getUser()` for optional user (server-side)
- Use `getRequiredUser()` for required user (server-side)
- Use `useSession()` from auth-client.ts (client-side)
- Use `getCurrentOrgCache()` to get the current org

### Database

- Prisma ORM with PostgreSQL
- Database hooks for user creation setup
- Organization-based data access patterns

### Dialog System

- Use `dialogManager` for global modals
- Types: confirm, input, custom dialogs
- Automatic loading states and error handling

## Testing

### Unit Tests

- Located in `__tests__/` directory
- Use Vitest with React Testing Library
- Mock extended with `vitest-mock-extended`

### E2E Tests

- Located in `e2e/` directory
- Use Playwright with custom test utilities
- Helper functions in `e2e/utils/`

## Important Files

- `src/lib/auth.ts` - Authentication configuration
- `src/features/dialog-manager/` - Global dialog system
- `src/lib/actions/actions-utils.ts` - Server action utilities
- `src/components/ui/form.tsx` - Form components
- `prisma/schema.prisma` - Database schema
- `src/site-config.ts` - Site configuration
- `src/lib/actions/safe-actions.ts` - All Server Action SHOULD use this logic
- `src/lib/zod-route.ts` - All Next.js route (inside the folder `/app/api` and name `route.ts`) SHOULD use this logic

## Development Notes

- Always use `pnpm` for package management
- Use TypeScript strict mode - no `any` types
- Prefer server components and avoid unnecessary client-side state
- Prefer using `??` than `||`
- All API Route SHOULD use @src/lib/zod-route.ts, each file name `route.ts` should use Zod Route. ALWAYS READ zod-route.ts before creating any routes.
- All API Request SHOULD use @src/lib/up-fetch.ts and NEVER use `fetch`

## Files naming

- All server actions should be suffix by `.action.ts` eg. `user.action.ts`, `dashboard.action.ts`

## Debugging and complexe tasks

- For complexe logic and debugging, use logs. Add a lot of logs at each steps and ASK ME TO SEND YOU the logs so you can debugs easily.

## TypeScript imports

Important, when you import thing try to always use TypeScript paths :

- `@/*` is link to @src
- `@email/*` is link to @emails
- `@app/*` is link to @app

## Workflow modification

🚨 **CRITICAL RULE - ALWAYS FOLLOW THIS** 🚨

**BEFORE editing any files, you MUST Read at least 3 files** that will help you to understand how to make a coherent and consistency.

This is **NON-NEGOTIABLE**. Do not skip this step under any circumstances. Reading existing files ensures:

- Code consistency with project patterns
- Proper understanding of conventions
- Following established architecture
- Avoiding breaking changes

**Types of files you MUST read:**

1. **Similar files**: Read files that do similar functionality to understand patterns and conventions
2. **Imported dependencies**: Read the definition/implementation of any imports you're not 100% sure how to use correctly - understand their API, types, and usage patterns

**Steps to follow:**

1. Read at least 3 relevant existing files (similar functionality + imported dependencies)
2. Understand the patterns, conventions, and API usage
3. Only then proceed with creating/editing files

## UI / UX experiences

- Never use emojis (prefer Lucide Icon for illustration)
- Never use gradients unless explicitly asked by user

## Design System

### Principles

- **NO hardcoded values** - Always use CSS tokens
- **Dark mode by default** - `defaultTheme="dark"` in providers.tsx
- **Semantic naming** - Use `bg-primary` not `bg-blue-500`

### Color Tokens (Freshness-specific)

```css
--color-fresh-extra   /* Green - Extra-fresh eggs */
--color-fresh         /* Yellow - Fresh eggs */
--color-fresh-cook    /* Orange - Cook thoroughly */
--color-expired       /* Red/Gray - Expired */
```

### Key Files

- `/app/globals.css` - All CSS tokens (colors, spacing, radius, shadows)
- `/tailwind.config.ts` - Tailwind mapping to CSS tokens
- `/app/providers.tsx` - Theme configuration (dark mode default)

### Usage Examples

```tsx
// Freshness badge
<Badge className="bg-fresh-extra text-fresh-extra-foreground">Extra-frais</Badge>

// Using tokens
<div className="p-[var(--space-4)] rounded-card bg-card shadow-md">
```

## PWA Features

### Push Notifications

Located in `/src/features/pwa/` and `/src/lib/pwa/`:

| File                             | Purpose                                |
| -------------------------------- | -------------------------------------- |
| `notification-permission.tsx`    | Permission request modal               |
| `push-notifications.ts`          | Subscription logic with error handling |
| `service-worker-registration.ts` | SW registration                        |
| `install-prompt.tsx`             | PWA install prompt                     |

**Configuration required:**

```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
```

## EggscuseMe-specific Components

### Core Components (to create in `/src/features/eggs/`)

- `EggBoxCard` - Card displaying egg box with freshness indicator
- `FreshnessGauge` - Visual gauge (green/yellow/orange/red)
- `CookingRecommendation` - Suggestions based on freshness
- `EggTimer` - Smart cooking timer

### Freshness Calculation

```typescript
// src/features/eggs/lib/freshness-calculator.ts
function getFreshnessStatus(layingDate: Date): FreshnessStatus {
  const daysOld = differenceInDays(new Date(), layingDate);

  if (daysOld <= 9) return { status: "extra-fresh", color: "green" };
  if (daysOld <= 21) return { status: "fresh", color: "yellow" };
  if (daysOld <= 28) return { status: "cook-thoroughly", color: "orange" };
  return { status: "expired", color: "gray" };
}
```
