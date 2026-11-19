# TapFlow AI — Status

Date: 2026-11-19
Product: TapFlow AI (automated NFC + QR business action page)
Owner: AI Cipher Agency (commercial) / Flex Perez (operator)
Environment: Vercel production (auto-deploy via GitHub once remote is added)

## Honest status snapshot (2026-11-19)

- Repository: `C:\Projects\tapflow-ai` (git initialized, commit `Initial TapFlow AI SaaS implementation`, no remote yet).
- Production deployment: READY at `https://tapflow-ai.vercel.app` (Vercel deployment `tapflow-pmifzdtsi-theperezcode`, alias `tapflow-ai.vercel.app`).
- Local production build: exit 0 (16 routes: /, /login, /dashboard, /settings, /links, /p/[slug], /api/{auth,click,dashboard,health,links,qr,settings}).
- Tests executed: `npx jest` → **5/5 passed** (`__tests__/validation.test.ts` — action URL validation incl. unsafe-protocol rejection).
- Verified live: `GET /api/health` → **503** with `Environment variable not found: DATABASE_URL` (expected until a Postgres `DATABASE_URL` is provisioned). Deployment itself is live and serving.

## What was built (this pass)

- Independent SaaS scaffold: Next.js (App Router) + React + TypeScript + Prisma (PostgreSQL) + NextAuth credentials (JWT) + Tailwind + SWR.
- Database schema: `Business`, `BusinessAdmin`, `ActionLink`, `PageView`, `LinkClick`, `AuditLog`.
- Auth: credentials login (bcrypt compare), JWT sessions, tenant isolation via `businessId` scoping on all queries.
- Public business page: `GET /p/[slug]` — mobile-first, renders business name/description/logo/links; records a `PageView` (best effort).
- Action links API: `GET/POST/PATCH/DELETE /api/links` — max 3 links per business, URL validation (http/https/tel/mailto only, unsafe protocols rejected).
- Click tracking: `GET /api/click?id=<linkId>` — records `LinkClick`, redirects to validated destination.
- QR generation: `GET /api/qr` — authenticated, returns PNG QR code (512px) with `Content-Disposition: attachment` for `<slug>-qr.png`.
- Dashboard: completed counts (active links, page views, link clicks) + public page slug.
- Settings: business details (name, description, logo, contact phone/email, website URL), NFC setup instructions (program any NFC tag via standard writer apps; software does not program tags remotely).
- Cron: not applicable in this pass (no scheduled jobs; view/click events are event-driven).
- Env: `NEXTAUTH_SECRET`, `NEXT_PUBLIC_APP_URL`, `CRON_SECRET` set in Vercel production.

## Known limitations / honest gaps (current)

- Database not provisioned (shared Vercel marketplace/Neon terms blocker across all five products) → all DB-backed features not yet runtime-verified.
- No Stripe/payment integration yet (commercial phase pending).
- No onboarding flow for creating a business + admin beyond the seed (`demo-business`, login `admin@tapflow.ai` / `demo1234`).
- No analytics beyond recorded page views/link clicks (no fabricated metrics).
- Physical NFC materials quoted separately (not part of software subscription).

## Acceptance criteria mapping

- [x] Independent repository (own repo, DB, deployment, config, customer admin).
- [x] Auth + tenant isolation implemented (code-level).
- [x] Public business page + up to 3 action links + URL validation.
- [x] QR code generation endpoint.
- [x] NFC compatibility instructions (URL-based, software does not program tags).
- [x] Dashboard (page views / clicks recorded from real events).
- [x] Build + tests pass, deployed.
- [ ] Database provisioned → migrations → runtime verification.
- [ ] Live E2E (public page render, link add/edit, QR generation, click tracking).
- [ ] Payment / subscription activation.
- [ ] Onboarding documentation (see README.md).

## Next steps

1. Owner accepts Neon integration terms in Vercel dashboard → `vercel install neon` in `C:\Projects\tapflow-ai` → set `DATABASE_URL` → `npx prisma migrate deploy` → redeploy → `/api/health` → 200.
2. Live E2E: public page render, add/edit/delete links, QR PNG fetch, click redirect.
3. Payment activation (Stripe) + onboarding docs finalization.
4. Add git remote + push.

## Pricing (proposed, not validated)

- Setup: $149.
- Monthly: $19.
- Physical NFC materials: quoted separately.
