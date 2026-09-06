# 26 — Environment Variables & Configuration Schema

**Product**: ACE UiPath Community Digital Operating System  
**Standard**: Strict Isolation Between Public and Secret Environment Variables  

---

## 1. Environment Variable Schema (Production Target)

```text
# 1. Database Connection (Server Only)
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/[DB]?sslmode=require"
DIRECT_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/[DB]"

# 2. Authentication Secrets (Server Only)
NEXTAUTH_SECRET="[CRYPTOGRAPHIC_RANDOM_SECRET_KEY]"
NEXTAUTH_URL="https://uipath.aceec.ac.in"

# 3. Object Storage Credentials (Server Only)
S3_BUCKET_NAME="ace-uipath-production-assets"
S3_ACCESS_KEY="[IAM_ACCESS_KEY]"
S3_SECRET_KEY="[IAM_SECRET_KEY]"
S3_REGION="auto"
S3_ENDPOINT="https://[ACCOUNT_ID].r2.cloudflarestorage.com"

# 4. Public Client Variables (Safe to Expose)
NEXT_PUBLIC_UIPATH_ALLIANCE_ID="ACE-UIPATH-EDU-ALLIANCE-9421"
NEXT_PUBLIC_SITE_URL="https://uipath.aceec.ac.in"
```

---

## 2. Current vs. Planned vs. Future State

### CURRENT (Actually Implemented)
- Zero environment variables currently required for the local client prototype.

### PLANNED (Decided & Approved)
- Production secrets configured in Vercel Project Settings; `.env.local` template provided for local backend development.

### FUTURE (Under Consideration)
- Automated secrets rotation policies via Infisical or Doppler.
