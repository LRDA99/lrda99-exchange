# LRDA99 XCHANGE

A standalone Next.js manual OTC cryptocurrency quote website prepared for local development, GitHub, PostgreSQL, Vercel, and a custom domain.

## Included functionality

- Responsive light and cobalt themes
- Buy and sell quote calculator for NGN, USD, GBP, and EUR
- Fee policy: fixed $1 at or below $5; $0.15 per $1 (15%) above $5
- Network-specific public receiving addresses and QR codes
- XRP destination-tag warning
- PostgreSQL-backed order requests and order references
- WhatsApp handoff for manual confirmation
- OPay and Kuda transfer instructions
- API input validation, basic abuse throttling, honeypot field, secure headers, and health endpoint
- Prisma schema and deployable SQL migration

## Important operating boundary

This is a manual OTC order-request system. Quotes, rates, minimum deposits, wallet networks, payments, and settlement require human confirmation. It does not automatically trade, custody private keys, verify deposits, perform KYC, or send bank/crypto payouts. Do not market those capabilities until regulated providers and audited integrations are implemented.

The displayed rates are indicative placeholders. Replace them with an approved pricing source before accepting real orders. Bybit-aligned minimum deposits are confirmed manually because minimums vary by asset/network and may change.

## Project structure

```text
lrda99-xchange-production/
├── prisma/
│   ├── migrations/202607100001_init/migration.sql
│   ├── migrations/migration_lock.toml
│   └── schema.prisma
├── public/favicon.svg
├── src/
│   ├── app/
│   │   ├── api/health/route.ts
│   │   ├── api/orders/route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/exchange.tsx
│   └── lib/
│       ├── fees.ts
│       ├── order-schema.ts
│       ├── prisma.ts
│       ├── rate-limit.ts
│       └── reference.ts
├── tests/fees.test.ts
├── .env.example
├── .gitignore
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
├── SECURITY.md
├── tsconfig.json
└── vercel.json
```

## Run locally

Prerequisites: Node.js 20.11+, npm, Git, and PostgreSQL.

1. Copy `.env.example` to `.env.local`.
2. Set `DATABASE_URL` to a PostgreSQL database.
3. Run `npm install`.
4. Run `npx prisma migrate deploy`.
5. Run `npm run dev`.
6. Open `http://localhost:3000`.

Validation commands:

```bash
npm test
npm run build
```

Health endpoint: `GET /api/health`.

## Create the GitHub repository

1. Sign in to GitHub and create a new empty repository named `lrda99-xchange`.
2. Do not initialize the GitHub repository with a README, `.gitignore`, or license because these already exist.
3. In a terminal, enter this project directory and run:

```bash
git init
git add .
git commit -m "Initial LRDA99 XCHANGE production project"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/lrda99-xchange.git
git push -u origin main
```

Never commit `.env`, `.env.local`, database exports, private keys, seed phrases, or API secrets.

## Create the production database

1. Create a PostgreSQL database using Neon, Supabase, Railway, or Vercel Marketplace.
2. Copy its pooled production connection string.
3. Add it to Vercel as `DATABASE_URL` for Production, Preview, and Development as appropriate.
4. Run the migration against production from a trusted terminal:

```bash
DATABASE_URL="YOUR_PRODUCTION_CONNECTION_STRING" npx prisma migrate deploy
```

## Deploy to Vercel

1. Sign in at Vercel and choose **Add New → Project**.
2. Import the `lrda99-xchange` GitHub repository.
3. Confirm the detected framework is **Next.js**.
4. Add the environment variables from `.env.example`:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_SITE_URL` initially set to the Vercel production URL, then changed to `https://www.lrdexchange.com`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER=2348079222519`
   - `NEXT_PUBLIC_SUPPORT_EMAIL=LRDA991119@gmail.com`
   - `ADMIN_API_KEY` containing at least 32 random characters
5. Select **Deploy**.
6. After deployment, open `/api/health` and confirm it returns `status: ok`.
7. Submit a test order using non-financial test data and confirm a database row and WhatsApp handoff are created.

## Connect `www.lrdexchange.com`

The requested hostname is `www.lrdexchange.com`. Confirm this spelling before changing DNS; it differs from previously mentioned domain spellings.

1. In Vercel, open the project and go to **Settings → Domains**.
2. Add `www.lrdexchange.com`.
3. Vercel will display the required DNS record. For a `www` subdomain this is normally a CNAME, but use the exact target Vercel displays.
4. Sign in to the DNS provider where `lrdexchange.com` is registered.
5. Create or replace the `www` CNAME record with Vercel's displayed target.
6. Remove conflicting `www` A, AAAA, or CNAME records.
7. Return to Vercel and wait for the domain and TLS certificate to show as valid.
8. Update `NEXT_PUBLIC_SITE_URL` to `https://www.lrdexchange.com` and redeploy.
9. Add the apex domain `lrdexchange.com` in Vercel if you want it redirected to `www.lrdexchange.com`; apply the exact DNS record Vercel provides.

DNS changes can take time to propagate. Do not guess Vercel's DNS target; copy the value shown in the project dashboard.

## Before accepting real money

- Replace indicative rates with an approved, authenticated pricing/liquidity integration.
- Add a shared rate limiter such as Upstash Redis.
- Add authenticated administration, audit logging, reconciliation, monitoring, alerts, database backups, and an incident plan.
- Complete legal review, privacy disclosures, AML/KYC controls, sanctions screening, transaction monitoring, and record-retention requirements.
- Independently verify every public wallet address and bank account displayed in production.
- Perform a professional security review and end-to-end test with small controlled amounts.
