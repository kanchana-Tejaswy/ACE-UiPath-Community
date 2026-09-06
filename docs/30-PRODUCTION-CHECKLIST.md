# 30 — Production Launch Readiness Checklist

**Product**: ACE UiPath Community Digital Operating System  
**Target Release**: Production Launch  

---

## 1. Production Go-Live Checklist

### 1.1 Database & Persistence
- [ ] PostgreSQL instance provisioned (Supabase / Neon) with connection pooler enabled.
- [ ] Prisma / Drizzle migrations executed without errors.
- [ ] Rich 2022–2026 historical seed data populated in PostgreSQL.
- [ ] Database backup and restore verified.

### 1.2 Authentication & Security
- [ ] Real server-side authentication enabled (Supabase Auth / NextAuth).
- [ ] PostgreSQL Row-Level Security (RLS) policies tested and active.
- [ ] Server-side route guards on `/admin` and `/core` verified.
- [ ] HTML sanitization (DOMPurify) active on all markdown content.

### 1.3 Media Storage
- [ ] S3 / Cloudflare R2 bucket created with CORS policies.
- [ ] Direct pre-signed upload handler tested for `.xaml`, `.nupkg`, `.pdf`, `.jpg`.

### 1.4 UI & Performance
- [ ] Sub-100ms TTFB on ISR cached public pages.
- [ ] Responsive layouts verified across iPhone SE (375px), iPad (768px), and 4K (2560px).
- [ ] WCAG 2.1 AA contrast ratio verified on all dark-mode text.

### 1.5 Quality Assurance
- [ ] Zero TypeScript errors (`tsc --noEmit`).
- [ ] Playwright E2E test suites passing in CI pipeline.
- [ ] OpenGraph social preview cards rendering on LinkedIn and WhatsApp.
