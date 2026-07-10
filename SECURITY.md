# Security policy

## Supported version

Only the latest commit on the default branch is supported.

## Reporting vulnerabilities

Do not publish a suspected vulnerability. Email `LRDA991119@gmail.com` with reproduction steps and impact. Never include wallet private keys, seed phrases, customer identity documents, or live database credentials.

## Operational requirements

- Store secrets only in Vercel environment variables or a dedicated secrets manager.
- Never place private keys or seed phrases in this repository, browser code, logs, or support messages.
- Use a managed PostgreSQL service with TLS, restricted credentials, backups, and point-in-time recovery.
- Enable Vercel account MFA, GitHub branch protection, dependency alerts, and deployment protection.
- Confirm every asset and network before instructing a customer to transfer.
- Treat wallet and bank-account changes as high-risk changes requiring independent verification.
- Do not collect NIN, BVN, identity documents, card numbers, passwords, or one-time codes through this application.
- Replace the in-memory request limiter with a shared managed limiter before high-volume traffic or multiple regions.

## Scope boundary

This release supports manual OTC quote requests. It does not custody customer private keys, automatically settle funds, verify blockchain deposits, provide KYC, or execute trades through a liquidity provider.
