# 20 — API Specification & Server Endpoints

**Product**: ACE UiPath Community Digital Operating System  
**Protocol**: RESTful HTTPS & Next.js Server Actions  

---

## 1. Purpose
Define the formal contract between the frontend React application, the server application layer, and the PostgreSQL database.

---

## 2. Endpoint Catalog

### 2.1 Public Endpoints
* `GET /api/activities`: List activities with query filters (`year`, `category`, `mode`, `search`).
* `GET /api/activities/:slug`: Fetch complete institutional memory record for an activity.
* `GET /api/learn/paths`: Fetch all learning tracks and modules.
* `GET /api/projects`: Fetch approved/featured student bots.
* `GET /api/challenges`: Fetch active and past hackathons.
* `GET /api/resources`: Fetch technical cheat sheets and question banks.
* `GET /api/settings`: Fetch global headlines, announcement ticker, and live counters.

### 2.2 Student Actions (Auth Required)
* `POST /api/projects/submit`: Submit new bot for Core Team moderation.
* `POST /api/challenges/:id/submit`: Submit hackathon team project.
* `POST /api/projects/:id/upvote`: Upvote a student automation.

### 2.3 Administrative Endpoints (Admin RBAC Required)
* `POST /api/admin/activities`: Create new activity record.
* `PUT /api/admin/activities/:id`: Update existing activity.
* `DELETE /api/admin/activities/:id`: Delete activity record.
* `PUT /api/admin/settings`: Update global site configuration.
* `GET /api/admin/backup/export`: Download complete JSON database snapshot.
* `POST /api/admin/backup/import`: Restore database from JSON snapshot.

---

## 3. Current vs. Planned vs. Future State

### CURRENT (Actually Implemented)
- Internal TypeScript store functions in `src/data/store.ts` executing synchronously against `localStorage`.

### PLANNED (Decided & Approved)
- Production Next.js API route handlers and Server Actions with Zod payload validation.

### FUTURE (Under Consideration)
- Public OpenAPI / Swagger documentation portal.
