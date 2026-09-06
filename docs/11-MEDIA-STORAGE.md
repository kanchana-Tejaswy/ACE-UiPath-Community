# 11 — Media Asset & Workflow Storage Architecture

**Product**: ACE UiPath Community Digital Operating System  
**Storage Provider**: Supabase Storage / S3  
**Status**: PLANNED (Production Architecture)  

---

## 1. Storage Architecture Principle

> **Binary files must NEVER be stored directly inside PostgreSQL.**

The database stores metadata, file paths, and relationships. The actual binary files live in cloud object storage (Supabase Storage Buckets or Cloudflare R2 / S3), served over global CDN edge networks.

```text
Activity / Resource Record
          │
          ▼
Database Media Metadata (Postgres)
          │
          ▼
Pre-Signed Cloud Storage Object (Supabase Storage)
          │
          ▼
Global Edge CDN Distribution
```

---

## 2. Supported File Formats & Metadata

### 2.1 File Types
1. **Event Photos & Posters**: `.jpg`, `.png`, `.webp`
2. **Presentation Decks & PDFs**: `.pdf`, `.pptx`
3. **UiPath Workflows & Code**: `.xaml`, `.zip`, `.nupkg`
4. **Sample Datasets & Guides**: `.csv`, `.xlsx`, `.json`, `.docx`

### 2.2 Metadata Schema (PostgreSQL `activity_media` & `resources`)
```text
{
  "id": "uuid",
  "filename": "REFramework_Masterclass_Starter.zip",
  "file_type": "ZIP",
  "mime_type": "application/zip",
  "file_size_bytes": 2458920,
  "storage_path": "activities/act_2026_01/workflows/REFramework_Masterclass_Starter.zip",
  "uploaded_by": "user_id_1",
  "uploaded_at": "2026-08-31T22:00:00Z",
  "related_entity": "ACTIVITY",
  "related_entity_id": "act_2026_01",
  "visibility": "PUBLIC"
}
```

---

## 3. CURRENT vs. PLANNED vs. FUTURE State

### CURRENT (Actually Implemented)
- External HTTPS links (Unsplash images, GitHub releases, YouTube video IDs) saved as string fields.
- Zero binary file upload handlers.

### PLANNED (Decided & Approved)
- Provision Supabase Storage buckets (`activities-media`, `resources-files`, `user-avatars`).
- Pre-signed upload URLs generated for client-side direct uploads.

### FUTURE (Under Consideration)
- Automatic edge image resizing and WebP compression pipeline.
