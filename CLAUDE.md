# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production (Next.js standalone output)
npm run start        # Start production server
npm run lint         # ESLint check

npm run db:push      # Push Prisma schema to DB (used in Docker startup)
npm run db:migrate   # Apply Prisma migrations
npm run db:generate  # Regenerate Prisma client after schema changes
npm run db:studio    # Open Prisma Studio GUI
```

**No test suite is configured.** Type checking is enforced via TypeScript strict mode.

Docker:
```bash
docker-compose up -d           # Start all services (app, PostgreSQL, Redis)
docker-compose down            # Stop services
docker-compose logs -f app     # Follow app logs
```

## Architecture Overview

**Le Moniteur IT** is an AI-powered French IT/AI news aggregation platform. A single Next.js app handles the UI, API routes, and background workers.

### Data Flow

```
16 RSS feeds → RSS Worker → Groq AI (summarize + categorize) → PostgreSQL
                                                                     ↓
                                              Frontend ← /api/articles (paginated)
                                              LiveFeed ← /api/stream (SSE, polls every 30s)
                                              MoodBanner ← /api/mood (latest mood entry)
```

### Key Subsystems

**Workers** (`src/lib/`): Three background workers triggered via authenticated HTTP POST (`CRON_SECRET` Bearer token):
- `rss-worker.ts` — Fetches 16 RSS feeds, deduplicates via string similarity (>0.6 threshold), calls Groq at 500ms intervals to generate editorial titles, key points, importance scores (1–10), and category (IT/IA)
- `mood-worker.ts` — Analyzes 20 recent articles via Groq to produce an editorial opinion + weather level (CALM/AGITATED/STORM), factoring in density of high-score articles (≥7)
- `newsletter-worker.ts` — Selects top 12 articles from last 48h, synthesizes intro via Groq, renders HTML email, sends in batches of 50 via Resend

**Cron Endpoints** (`src/app/api/cron/`): All require `Authorization: Bearer <CRON_SECRET>`. Schedules defined in `cron/moniteur-it` (runs on the host, not in-process):
- `fetch-rss` — every 30 minutes
- `mood` — every 6 hours
- `newsletter` — every 48 hours at 8:00 AM

**Real-time Feed** (`/api/stream`): Server-Sent Events endpoint using Redis pub/sub. When the RSS worker saves new articles, it publishes to Redis; the SSE endpoint forwards to connected clients.

**AI Client** (`src/lib/groq-client.ts`): All Groq API calls are centralized here. Model: `llama-3.3-70b-versatile`. All prompts are written in French.

### Database Models (Prisma / PostgreSQL)

- `Article` — core content: guid, title, editorial title, summary, key points (JSON), importance score, category (IT/IA), image URL, source name, published date
- `Subscriber` — newsletter subscribers (email, confirmed flag)
- `Newsletter` — sent newsletter records
- `MoodEntry` — editorial mood snapshots with weather level

### Environment Variables

See `.env.example`. Required keys:
- `DATABASE_URL` — PostgreSQL connection string
- `REDIS_URL` — Redis connection string
- `GROQ_API_KEY` — Groq LLM API
- `RESEND_API_KEY` + `RESEND_FROM_EMAIL` — email delivery
- `CRON_SECRET` — protects cron trigger endpoints
- `NEXT_PUBLIC_SITE_URL` — used in newsletter links

### Frontend

Components in `src/components/` are React client/server components using Next.js 15 App Router. Design system uses Tailwind CSS 4 with custom colors (navy, gold, paper) defined in `globals.css`. Fonts: Playfair Display (headings) + Inter (body).

### Docker

Multi-stage `Dockerfile` produces a standalone Next.js image. `docker-entrypoint.sh` runs `prisma db push` before starting the server (no migration history — schema is applied directly). The `.env.docker` file is used instead of `.env` in container environments.
