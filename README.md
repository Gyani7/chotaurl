# ChotaURL

Production-oriented URL infrastructure built with Vite, React 19, TypeScript, Tailwind CSS,
and Supabase.

ChotaURL makes every premium feature free. Eligible redirects participate in a transparent
traffic-sharing model: at least 80% go to the link owner's configured destination, while up
to 20% can be routed to vetted, administrator-managed promotions.

## Included

- Email/password and Google authentication through Supabase
- Custom aliases, expiration, click limits, passwords, QR codes, UTM parameters
- Country, language, and device targeting with deterministic fallbacks
- Bulk shortening, branded domains, workspaces, roles, and invitations
- Click history and country, city, browser, device, referrer, and promo analytics
- Dark/light themes, responsive landing, dashboard, docs, SEO metadata
- Admin traffic policy, promotions, blacklist, abuse, user, and revenue surfaces

## Local development

Requirements: Node.js 20+.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Without environment variables, the product runs in a safe visual demo mode. Link creation
returns temporary demo URLs, while production-only authentication and persistence remain
disabled.

## Environment

| Variable | Purpose |
| --- | --- |
| `VITE_APP_URL` | Canonical application URL |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Browser-safe Supabase anon key |

Never expose service-role or other secrets to the browser. Vite only exposes variables
prefixed with `VITE_`.

## Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
npm run preview
```

## Tech stack

This is the Vite version of ChotaURL. The original Next.js app server-side features (API
routes, edge redirect handler, Prisma, Redis caching, cron jobs) are replaced with
Supabase edge functions and direct Supabase client calls where appropriate.
