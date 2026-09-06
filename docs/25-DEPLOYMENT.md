# 25 — Deployment & Hosting Infrastructure

**Product**: ACE UiPath Community Digital Operating System  
**Hosting Target**: Vercel Edge Network + Managed PostgreSQL (Supabase / Neon)  

---

## 1. Purpose
Provide a resilient, globally distributed hosting architecture with zero maintenance burden on student leads.

---

## 2. Infrastructure Setup & Pipeline
* **Frontend / Server Runtime**: Vercel Edge Network (Automated continuous deployment from GitHub `main` branch).
* **Database**: Supabase / Neon PostgreSQL 15+ with SSL encryption and automated daily backups.
* **Storage**: Cloudflare R2 / S3 bucket with global CDN edge delivery for `.xaml` workflows and images.

---

## 3. Current vs. Planned vs. Future State

### CURRENT (Actually Implemented)
- Vite SPA build scripts (`npm run build`, `vite preview`) configured in `package.json`.

### PLANNED (Decided & Approved)
- Next.js production build connected to production Vercel project and live PostgreSQL database.

### FUTURE (Under Consideration)
- Custom sub-domain routing (`uipath.aceec.ac.in`) with automated SSL certification.
