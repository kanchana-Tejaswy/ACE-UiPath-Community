# 12 — Resources Vault & Media Asset Storage

**Product**: ACE UiPath Community Digital Operating System  
**Scope**: Technical Assets, Workflow Packages, Media Buckets & CDN Distribution  

---

## 1. Technical Resources Vault (`/resources`)

The Resources Vault hosts verified automation assets categorized into:
1. **Cheat Sheets**: Production REFramework transition manuals, Modern Selector syntax guides, and LINQ expression cheat sheets.
2. **Workflow Templates (.XAML / .ZIP)**: Pre-configured REFramework templates with Queue dispatcher/performer architectures and custom logging.
3. **Official Certification Question Banks**: 150+ realistic multiple-choice practice questions with detailed architectural rationales for the UiPath Associate Developer exam.
4. **Setup & Installation Guides**: Step-by-step documentation for installing UiPath Studio Community Edition and connecting to UiPath Automation Cloud.

---

## 2. Media & Asset Storage Architecture (Production)

```text
User / Admin Uploader
         │
         ▼
Pre-Signed S3 / Supabase Upload URL
         │
         ▼
Cloud Object Storage Bucket (S3 / Cloudflare R2 / Supabase Storage)
         ├── /activities/{activity_id}/photos/ (Optimized WebP images)
         ├── /activities/{activity_id}/workflows/ (.xaml, .nupkg, .zip)
         ├── /activities/{activity_id}/slides/ (.pdf presentation decks)
         └── /resources/{resource_id}/ (Templates, question banks)
         │
         ▼
Global CDN Edge Delivery (Fast global downloads with cached URLs)
```

---

## 3. Prototype vs. Production Asset Delta

* **Prototype State**: Images and downloads rely on external Unsplash URLs and placeholder GitHub release URLs. There is no binary upload pipeline.
* **Production State**: S3-compatible cloud bucket with pre-signed direct uploads, client-side image compression, and secure CDN distribution.
