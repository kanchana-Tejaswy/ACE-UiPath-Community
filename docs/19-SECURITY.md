# 19 — Security Architecture & Threat Modeling

**Product**: ACE UiPath Community Digital Operating System  
**Core Principle**: Never Trust the Frontend  
**Status**: PLANNED (Production Architecture)  

---

## 1. Security Principle: Never Trust the Frontend

> **Hiding a button in the UI is visual layout, NOT security.**

The frontend application can render or hide tabs based on user role, but true authorization must be enforced at the API and database levels.

```text
Student → Cannot modify activities or settings (Database RLS rejects SQL)

Core Team → Permitted content operations only (Database RLS validates role)

Admin → Full administrative permissions (Database RLS checks admin role)
```

---

## 2. Threat Modeling & Defense Controls (PLANNED)

| Threat Vector | Defense Mechanism | RLS / Middleware Enforcement |
| :--- | :--- | :--- |
| **Role Impersonation** | JWT Session Validation | Supabase Auth signs JWTs with server secret key; client cannot forge role claims. |
| **Direct API Tampering** | PostgreSQL Row Level Security | Database tables reject unauthorized `INSERT`, `UPDATE`, `DELETE` queries regardless of API payload. |
| **Cross-Site Scripting (XSS)** | HTML Sanitization | All markdown descriptions sanitized via DOMPurify before rendering. |
| **SQL Injection** | Parameterized Queries | Parameterized queries handled natively by Supabase / ORM layer. |
| **File Upload Abuse** | MIME Type & Storage Policies | Supabase Storage bucket RLS limits upload permissions and file size limits (50MB max). |

---

## 3. CURRENT vs. PLANNED vs. FUTURE State

### CURRENT (Actually Implemented)
- Client-side React role checks (`currentUser.role`).
- Local escaping of text variables.

### PLANNED (Decided & Approved)
- Production Supabase RLS policies for every table.
- HTTP-only session cookies and Next.js middleware route guards.

### FUTURE (Under Consideration)
- Automated OWASP security vulnerability scanning in CI/CD pipeline.
