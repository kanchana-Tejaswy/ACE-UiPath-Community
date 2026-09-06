# 17 — API Specification & Server Endpoints

**Product**: ACE UiPath Community Digital Operating System  
**Protocol**: RESTful HTTPS Endpoints & Next.js Server Actions  
**Data Format**: JSON (`application/json`)  

---

## 1. Public Endpoints (Read-Only)

### `GET /api/activities`
* **Description**: Retrieve list of published activities with multi-dimensional filtering.
* **Query Parameters**: `year` (e.g. `2026`), `category`, `mode`, `search`.
* **Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "id": "act_2026_01",
      "slug": "reframework-enterprise-masterclass-2026",
      "title": "Robotic Enterprise Framework (REFramework) Deep-Dive Masterclass",
      "category": "Workshop",
      "eventType": "Hybrid",
      "date": "2026-09-12",
      "timeStart": "10:00 AM",
      "timeEnd": "04:30 PM",
      "venue": "Seminar Hall 3",
      "summary": "...",
      "status": "Upcoming",
      "uipathTopicsCovered": ["UiPath Studio", "REFramework"]
    }
  ]
}
```

### `GET /api/activities/:slug`
* **Description**: Retrieve deep institutional memory record for a single activity.
* **Response `200 OK`**: Complete Activity entity with `agenda`, `speakers`, `learningOutcomes`, `galleryImages`, `recordingUrl`, `slidesUrl`, and `workflowPackageUrl`.

### `GET /api/projects`
* **Description**: Retrieve approved/featured student bots.
* **Response `200 OK`**: Array of Project entities with ROI metrics and GitHub URLs.

### `GET /api/settings`
* **Description**: Retrieve global site configurations, announcements ticker, and live counters.

---

## 2. Student Submission Endpoints (Authenticated)

### `POST /api/projects/submit`
* **Description**: Submit a student bot for Core Team moderation.
* **Payload**: `{ title, summary, problemStatement, solutionDescription, uipathToolsUsed, roiMetrics, repoUrl, packageDownloadUrl }`
* **Response `201 Created`**: `{ "success": true, "message": "Bot submitted for moderation.", "projectId": "..." }`

### `POST /api/challenges/:id/submit`
* **Description**: Submit hackathon team project.
* **Payload**: `{ teamName, members, projectTitle, repoUrl, videoDemoUrl }`
* **Response `201 Created`**: `{ "success": true, "submissionId": "..." }`

---

## 3. Administrative Mutation Endpoints (Admin RBAC Required)

### `POST /api/admin/activities`
* **Headers**: `Authorization: Bearer <ADMIN_JWT>`
* **Description**: Create new activity record.

### `PUT /api/admin/settings`
* **Headers**: `Authorization: Bearer <ADMIN_JWT>`
* **Description**: Update site headlines, ticker banner, and impact stats.

### `GET /api/admin/backup/export`
* **Headers**: `Authorization: Bearer <ADMIN_JWT>`
* **Description**: Download full database JSON snapshot.
