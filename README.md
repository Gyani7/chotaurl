# ChotaURL

Production-oriented URL infrastructure built with Next.js 16, TypeScript, Tailwind CSS,
Supabase, Prisma, and Redis.

ChotaURL makes every premium feature free. Eligible redirects participate in a transparent
traffic-sharing model: at least 80% go to the link owner's configured destination, while up
to 20% can be routed to vetted, administrator-managed promotions. The administrator can
lower the global promotional percentage at any time.

## Included

- Email/password and Google authentication through Supabase
- Custom aliases, expiration, click limits, passwords, QR codes, UTM parameters
- Country, language, and device targeting with deterministic fallbacks
- Bulk shortening, branded domains, workspaces, roles, and invitations
- Click history and country, city, browser, device, referrer, and promo analytics
- Versioned REST endpoints with API-key and session authentication
- Edge-compatible redirect handler with Redis caching
- Admin traffic policy, promotions, blacklist, abuse, user, and revenue surfaces
- Dark/light themes, responsive landing, dashboard, docs, SEO metadata, sitemap, and robots

## Local development

Requirements: Node.js 22.14+ and PostgreSQL (Supabase Postgres is recommended).

```bash
nvm use
npm install
cp .env.example .env.local
npm run db:generate
npm run dev
```

Without environment variables, the product runs in a safe visual demo mode. Link creation
returns temporary demo URLs, while production-only authentication and persistence remain
disabled.

## Production setup

1. Create a Supabase project and enable Email and Google providers.
2. Set the values documented in `.env.example`.
3. Apply the Prisma schema:

   ```bash
   npm run db:push
   ```

4. Run `supabase/bootstrap.sql` in the Supabase SQL editor. It installs the Auth profile and
   workspace trigger, click-recording RPC, and row-level security policies.
5. Create an Upstash Redis database and set its REST URL/token for redirect caching and rate
   limiting.
6. Promote the first administrator:

   ```sql
   update public.users set is_admin = true where email = 'admin@example.com';
   ```

7. Deploy to Vercel. `vercel.json` configures domain-verification checks every six hours.

## Environment

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_APP_URL` | Canonical application URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser-safe Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only redirect and administrative access |
| `DATABASE_URL` | Pooled PostgreSQL connection used by Prisma |
| `UPSTASH_REDIS_REST_URL` | Edge-compatible Redis URL |
| `UPSTASH_REDIS_REST_TOKEN` | Edge-compatible Redis token |
| `CRON_SECRET` | Protects scheduled domain verification |
| `IP_HASH_SALT` | Signs password unlock cookies; use a long random value |

Never expose service-role, database, Redis, cron, or signing secrets to the browser.

## Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
npm run db:generate
npm run db:push
```

## API

Interactive-style endpoint documentation is available at `/docs`. All create-link requests
must include `"acceptedTrafficShare": true`; this prevents clients from silently creating
traffic-sharing links without disclosure.
