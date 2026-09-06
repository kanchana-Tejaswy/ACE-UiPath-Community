# 15 — Security Architecture & Threat Modeling

**Product**: ACE UiPath Community Digital Operating System  
**Standard**: Zero-Trust Server Enforcement & Defense in Depth  

---

## 1. Threat Modeling & Attack Vectors

| Attack Vector | Threat Description | Production Defense Strategy |
| :--- | :--- | :--- |
| **Privilege Escalation** | Client tampering with role state to access Admin CMS. | Server-side cryptographic JWT / Session cookie verification + Postgres RLS. |
| **Cross-Site Scripting (XSS)** | Malicious JavaScript injected via activity markdown or bot descriptions. | Strict sanitization with DOMPurify + React's automated HTML escaping. |
| **SQL Injection** | Parameter tampering in search or filter inputs. | Parameterized queries via Prisma / Drizzle ORM. |
| **File Upload Abuse** | Uploading malicious executables masked as `.xaml` or `.png`. | Server-side MIME-type validation, file size limits (50MB max), and sandboxed S3 bucket storage. |
| **Denial of Service (DoS)** | Brute force spam on student bot / challenge submission endpoints. | IP-based rate limiting (Upstash Redis / Cloudflare Rate Limiting). |

---

## 2. Secrets Management & Environment Isolation

* Never commit `.env` or production credentials (`DATABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `S3_SECRET_KEY`) to Git.
* Secrets stored in Vercel / Railway encrypted environment variables.
* Client-exposed variables restricted strictly to public keys (`NEXT_PUBLIC_SUPABASE_ANON_KEY`).

---

## 3. Audit Logging

All administrative mutations (creating an activity, updating site settings, deleting a resource) write an immutable record to the `audit_logs` table containing `user_id`, `action`, `entity_type`, `entity_id`, `ip_address`, and `timestamp`.
