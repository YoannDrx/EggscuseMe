# EggscuseMe

**Stop throwing away your eggs. Cook them perfectly.**

EggscuseMe is a web application that helps you manage the freshness of your eggs, avoid food waste, and cook eggs optimally based on the recommended consumption date (DCR / best-before date) printed on the box.

## The Problem

Every year, millions of eggs are thrown away due to confusion about expiration dates and optimal usage. People don't know:

- When eggs are truly expired vs. just past their "best by" date
- Which cooking method is best for eggs at different stages of freshness
- How to track multiple egg boxes in their fridge

## The Solution

EggscuseMe provides:

- **Virtual Fridge**: Track all your egg boxes from their DCR with color-coded freshness indicators
- **Smart Recommendations**: Know exactly what to cook based on egg freshness
- **Intelligent Timer**: Get perfect cooking times adjusted for egg size and temperature
- **Anti-Waste Stats**: See how much money and eggs you've saved

## Egg Freshness Rules

| Period    | Status          | Recommended Use                                |
| --------- | --------------- | ---------------------------------------------- |
| Day 0-9   | Extra-fresh     | Soft-boiled, poached, raw (mayonnaise, mousse) |
| Day 10-21 | Fresh           | Fried, scrambled, omelette, baking             |
| Day 22-28 | Cook thoroughly | Hard-boiled only                               |
| Day 29+   | Expired         | Discard                                        |

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS v4 with custom Design System
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better Auth with shared fridge access
- **Payments**: Stripe (Freemium model)
- **i18n**: next-intl (French + English)
- **Testing**: Vitest + Playwright

## Getting Started

### Prerequisites

- Node.js 20.9+
- pnpm
- PostgreSQL
- Redis

### Installation

```bash
# Clone the repository
git clone git@github.com:YoannDrx/EggscuseMe.git
cd EggscuseMe

# Install dependencies
pnpm install

# Copy environment variables
cp .env-template .env

# Setup database
pnpm prisma db push
pnpm prisma:seed

# Start development server
pnpm dev
```

### Environment Variables

See `.env-template` for all required variables. Key configurations:

```bash
# Database
DATABASE_URL="postgresql://USER:@localhost:5432/eggscuseme"

# Redis (required for caching)
REDIS_URL="redis://localhost:6379"

# Authentication
BETTER_AUTH_SECRET="your-secret"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
CRON_SECRET="a-long-random-secret"
GITHUB_CLIENT_ID="your-github-id"
GITHUB_CLIENT_SECRET="your-github-secret"

# AI scan (OpenAI is used first when AI_SCAN_PROVIDER=auto)
AI_SCAN_PROVIDER="auto"
OPENAI_API_KEY="your-openai-api-key"
OPENAI_VISION_MODEL="gpt-5-mini"
GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key"
GOOGLE_VISION_MODEL="gemini-1.5-flash"

# Email
RESEND_API_KEY="your-resend-key"
EMAIL_FROM="EggscuseMe <eggscuseme@yodev.fr>"
NEXT_PUBLIC_EMAIL_CONTACT="hello@eggscuseme.app"
BLOB_READ_WRITE_TOKEN="vercel-blob-token"

# Payments
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

## Development Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm ts           # Type checking
pnpm lint         # Lint with auto-fix
pnpm test:ci      # Run unit tests
pnpm test:e2e:ci  # Run e2e tests
```

## Features

### Solo Plan

- Track up to 2 egg boxes
- Basic timer
- Freshness recommendations

### Chef lifetime purchase

- One-time purchase with lifetime access
- Unlimited egg boxes and full consumption history
- Detailed statistics and push notifications
- Exclusive recipes, exports, multi-fridge and traceability features

The former Brigade subscription remains supported for historical accounts but
is no longer offered to new customers.

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

## License

MIT License - see LICENSE file for details.
