# TapFlow AI

Automated NFC + QR-powered business action page.

TapFlow AI gives a business one mobile-friendly destination that customers open through an NFC tap or QR scan. The initial package supports up to three action links (e.g. Book an appointment, Call the business, Visit the business website).

## Status

- Production: https://tapflow-ai.vercel.app (build passing, tests passing, DB provisioning pending — see `docs/STATUS.md`)
- Stack: Next.js (App Router) + TypeScript + Prisma/PostgreSQL + NextAuth (credentials) + Tailwind + SWR
- Pricing (proposed, not validated): $149 setup + $19/month. Physical NFC materials quoted separately.

## Quick start (local)

1. Copy `.env.example` to `.env.local`.
2. Set `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_APP_URL`.
3. `npx prisma migrate dev` (or `npx prisma db push`).
4. `npx prisma db seed`.
5. `npm run dev`.

## Demo credentials (local seed)

- Email: `admin@tapflow.ai`
- Password: `demo1234`
- Public page: `/p/demo-business`

## API overview

- `POST /api/auth/[...nextauth]` — credentials auth
- `GET /api/health` — DB health
- `GET/POST/PATCH/DELETE /api/links` — action links (max 3, URL-validated)
- `GET /api/qr` — QR PNG for the business page (auth required)
- `GET /api/click?id=<linkId>` — record click + redirect
- `GET /p/[slug]` — public business page (records view)
- `GET /api/dashboard` — authenticated dashboard counts

## Security notes

- Webhook/signature: not applicable (event-driven, no inbound webhooks in this pass).
- Tenant isolation: all DB reads scoped by `businessId` from the authenticated admin's record.
- Link URL validation allows only `http`, `https`, `tel`, `mailto`.
- No fabricated analytics; metrics are recorded from real events only.
