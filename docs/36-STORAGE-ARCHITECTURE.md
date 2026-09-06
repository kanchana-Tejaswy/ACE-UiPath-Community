# 36 — Supabase Storage Architecture & File Security Rules

**Product**: ACE UiPath Community Digital Operating System  
**Scope**: Binary Buckets, MIME Validation & Storage RLS Policies  

---

## 1. Storage Bucket Architecture

| Bucket Name | Access Policy | File Size Limit | Allowed MIME Types |
| :--- | :---: | :---: | :--- |
| **`activities-media`** | **Public Read / Auth Insert** | 50 MB | `image/png`, `image/jpeg`, `image/webp`, `application/pdf`, `application/zip` |
| **`resources-files`** | **Public Read / Admin Insert** | 50 MB | `application/pdf`, `application/zip`, `application/x-zip-compressed` |
| **`project-artifacts`** | **Public Read / Auth Insert** | 50 MB | `image/png`, `image/jpeg`, `image/webp`, `application/zip` |
| **`challenge-submissions`** | **Private / Auth Insert** | 50 MB | `application/zip`, `application/pdf` |
| **`user-avatars`** | **Public Read / Auth Insert** | 5 MB | `image/png`, `image/jpeg`, `image/webp` |

---

## 2. File Security & Naming Conventions

1. **Path Organization**: `bucket_name/{entity_id}/{timestamp}_{filename}`.
2. **Sanitization**: Executable files (`.exe`, `.bat`, `.sh`) are strictly prohibited by bucket MIME type policies.
3. **Pre-signed Uploads**: Direct uploads from client browser require active JWT authentication tokens.
