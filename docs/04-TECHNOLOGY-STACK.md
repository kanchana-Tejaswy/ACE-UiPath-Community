# 04 — Technology Stack Specification

**Product**: ACE UiPath Community Digital Operating System  
**Audit Source**: [`package.json`](file:///d:/ace%20uipath%20communtiy/ACE-UiPath-Community/package.json), [`vite.config.ts`](file:///d:/ace%20uipath%20communtiy/ACE-UiPath-Community/vite.config.ts), and Source Tree  

---

## 1. Actual Current Implementation Stack

```text
┌────────────────────────────────────────────────────────┐
│ CURRENT PROTOTYPE STACK                                │
├─────────────────────────┬──────────────────────────────┤
│ Core Framework          │ React 18.3.1 (SPA)           │
│ Language                │ TypeScript 5.4.5             │
│ Build Tool & Dev Server │ Vite 5.3.1                   │
│ Styling System          │ Vanilla CSS Tokens (index.css)│
│ Icons Library           │ Lucide React 0.395.0         │
│ Utility Helpers         │ clsx 2.1.1                   │
│ Data Persistence        │ In-Memory + Browser Storage  │
│ Routing                 │ Component-level View Router  │
└─────────────────────────┴──────────────────────────────┘
```

---

## 2. Planned Production Technology Stack

```text
┌────────────────────────────────────────────────────────┐
│ PLANNED PRODUCTION STACK                               │
├─────────────────────────┬──────────────────────────────┤
│ Application Framework   │ Next.js 15 (App Router, SSR) │
│ Runtime Environment     │ Node.js 20+ / Vercel Edge    │
│ Database Engine         │ PostgreSQL 15+ (Supabase)    │
│ ORM / Data Layer        │ Prisma ORM / Drizzle ORM     │
│ Authentication          │ Supabase Auth / NextAuth.js  │
│ Authorization           │ PostgreSQL RLS + Middleware  │
│ Object / Media Storage  │ Cloudflare R2 / S3           │
│ Input Validation        │ Zod                          │
│ Client Data Sync        │ SWR / TanStack Query         │
│ Testing Suite           │ Vitest + Playwright (E2E)    │
└─────────────────────────┴──────────────────────────────┘
```

---

## 3. Technology Stack Comparison & Rationale

| Layer | Current Implementation | Production Target | Architectural Rationale |
| :--- | :--- | :--- | :--- |
| **Rendering** | Client-Side SPA (Vite) | Server-Side + ISR (Next.js) | Delivers sub-100ms TTFB and perfect OpenGraph/SEO for public event pages. |
| **Data Storage** | `localStorage` (5MB quota) | PostgreSQL (ACID) | Supports concurrent multi-user writes, foreign key constraints, and relational queries. |
| **Auth** | Visual Role Switcher | JWT / HTTP-Only Cookies | Enforces real server-side security perimeter across Public, Core Team, and Admin. |
| **Media** | External Unsplash URLs | S3 / R2 Bucket | Enables direct uploads of `.xaml` workflows, `.nupkg` packages, slide decks, and photography. |
