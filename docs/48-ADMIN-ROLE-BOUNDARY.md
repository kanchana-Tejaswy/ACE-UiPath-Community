# 48 — Admin & Core Team Role Boundary Architecture

**Product**: ACE UiPath Community Digital Ecosystem  
**Scope**: 3-Tier Governance Boundary Matrix  

---

## 1. Role Boundary Matrix

| Capability | Public / Student | Core Team | System Admin |
| :--- | :---: | :---: | :---: |
| **Browse Timeline & Detail Archives** | ✅ | ✅ | ✅ |
| **Explore Learning Academy & Resources** | ✅ | ✅ | ✅ |
| **Submit Bot Showcase Project** | ✅ | ✅ | ✅ |
| **Draft Activity Record** | ❌ | ✅ | ✅ |
| **Attach Session Media & Artifacts** | ❌ | ✅ | ✅ |
| **Approve & Publish Content** | ❌ | ❌ | ✅ |
| **Manage Global Site Settings & Marquee** | ❌ | ❌ | ✅ |
| **Database Backup & Disaster Restore** | ❌ | ❌ | ✅ |

---

## 2. Future Cloud Migration Readiness

This boundary layer is enforced in UI views and local store state today, and maps 1-to-1 with PostgreSQL Row Level Security (RLS) policies in `supabase/migrations/20260831000000_initial_schema.sql` for Phase 5 cloud activation.
