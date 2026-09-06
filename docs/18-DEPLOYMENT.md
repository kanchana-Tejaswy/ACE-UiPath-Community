# 18 — Deployment Architecture & CI/CD Pipeline

**Product**: ACE UiPath Community Digital Operating System  
**Target Infrastructure**: Vercel Edge Network + Managed PostgreSQL (Supabase / Neon)  

---

## 1. Hosting & Infrastructure Topography

```text
GitHub Repo (main branch)
           │
           ▼
Vercel Automated CI/CD Pipeline
  ├── Linting & Type Checks (tsc --noEmit)
  ├── Prisma Client Generation & Migrations
  └── Next.js Production Build Optimization
           │
           ▼
Global Edge CDN Distribution (Sub-100ms Worldwide TTFB)
           │
     ┌─────┴─────┐
     ▼           ▼
Managed Postgres   Cloud Object Storage (S3/R2)
(Supabase / Neon)  (Media & .XAML Packages)
```

---

## 2. Environment Variables Configuration

| Variable Key | Scope | Purpose |
| :--- | :--- | :--- |
| `DATABASE_URL` | Server Only | PostgreSQL connection pool string with SSL mode. |
| `DIRECT_URL` | Server Only | Direct PostgreSQL URL for Prisma migrations. |
| `NEXTAUTH_SECRET` | Server Only | Cryptographic secret for signing session JWTs. |
| `NEXTAUTH_URL` | Server Only | Canonical production URL (`https://uipath.aceec.ac.in`). |
| `S3_BUCKET_NAME` | Server Only | Target bucket for `.xaml` and image assets. |
| `S3_ACCESS_KEY` | Server Only | IAM credentials for object storage. |
| `NEXT_PUBLIC_UIPATH_ALLIANCE_ID` | Client & Server | Public identifier for academic partner badge. |

---

## 3. Deployment Runbook

```bash
# 1. Clone repository
git clone https://github.com/kanchana-Tejaswy/ACE-UiPath-Community.git

# 2. Install dependencies
npm install

# 3. Apply database migrations
npx prisma migrate deploy

# 4. Seed database with ACE historical data
npx prisma db seed

# 5. Build and launch
npm run build
npm start
```
