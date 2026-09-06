# ADR-001: Foundational System Architecture & Zero-Friction Student Exploration

* **Status**: Accepted
* **Date**: 2026-08-31
* **Deciders**: Lead Product Architect & Senior Full-Stack Engineer

---

## 1. Context & Problem Statement

The ACE UiPath Community requires a permanent, scalable web platform and institutional operating system. Previous student club websites suffered from three fundamental failures:
1. **The Login Barrier**: Forcing students to sign up before viewing tutorials or past event recordings caused high bounce rates.
2. **The Graduation Brain Drain**: Past workshop recordings, `.xaml` workflows, and presentation slides were lost when senior student leads graduated.
3. **Hard-Coded Content Bottlenecks**: Modifying a date or adding a speaker required a software developer to edit code and redeploy.

---

## 2. Decision Elements

### 2.1 Why React / Next.js Was Selected
* **Decision**: Next.js App Router (React 19 / TypeScript).
* **Rationale**: Enables Incremental Static Regeneration (ISR) and Server-Side Rendering (SSR) for instant sub-100ms loading of public activity archives while providing Server Actions for the Admin CMS.

### 2.2 Why PostgreSQL (Supabase / Neon) Was Selected
* **Decision**: Relational PostgreSQL database accessed via Prisma/Drizzle ORM.
* **Rationale**: Event agendas, speakers, student achievements, and learning modules are deeply relational. PostgreSQL provides strict ACID compliance, foreign key integrity, and Row-Level Security (RLS).

### 2.3 Why Public Users Do Not Require Login
* **Decision**: Zero mandatory authentication for browsing, learning, searching, and downloading public `.xaml` templates.
* **Rationale**: Maximum accessibility for freshers and prospective members. Authentication is gated strictly for active identity tasks (bot/hackathon submissions).

### 2.4 Why Activities Use Institutional Memory Architecture
* **Decision**: Every activity is stored as a permanent structured entity with minute-by-minute agendas, speakers, slide decks, `.xaml` starter packages, recordings, and student awards.
* **Rationale**: Transforms past events into evergreen learning assets for future student generations.

### 2.5 Why Media Uses Cloud Storage (S3 / R2)
* **Decision**: Binary workflow archives (`.xaml`, `.nupkg`, `.zip`) and high-resolution event photography are hosted in S3-compatible cloud object storage with pre-signed uploads.
* **Rationale**: Keeps database size small and guarantees fast global downloads via CDN.

### 2.6 Why Admin and Core Team Permissions Are Separated
* **Decision**: Core Team members have scoped access to stage workshop artifacts and moderate bot submissions, while full site settings, user roles, and database backups are restricted strictly to Administrators.
* **Rationale**: Prevents accidental misconfiguration while distributing operational workload across student organizers.

---

## 3. Consequences

* **Positive**: The system is resilient, self-documenting, multi-user synchronized, and sustainable for 5+ years across graduating student batches.
* **Negative**: Requires initial database provisioning and server-side authentication setup before live deployment.
