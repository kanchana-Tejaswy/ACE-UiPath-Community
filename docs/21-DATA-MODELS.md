# 21 — Data Models & TypeScript Domain Contracts

**Product**: ACE UiPath Community Digital Operating System  
**Implementation**: [`src/types/index.ts`](file:///d:/ace%20uipath%20communtiy/ACE-UiPath-Community/src/types/index.ts)  

---

## 1. Domain Interfaces Summary

1. `User` (id, email, name, rollNumber, branch, graduationYear, role, avatarUrl, githubUrl, linkedinUrl)
2. `Activity` (id, slug, title, category, eventType, date, timeStart, timeEnd, venue, summary, fullDescriptionMd, objectives, agenda, uipathTopicsCovered, learningOutcomes, bannerImage, galleryImages, recordingUrl, slidesUrl, githubUrl, workflowPackageUrl, status, isFeatured, speakers, achievements)
3. `LearningPath` & `LearningModule` (curriculum roadmaps, duration, markdown lessons, starter code)
4. `ProjectShowcase` (title, tagline, problemStatement, solutionDescription, uipathToolsUsed, roiMetrics, repoUrl, packageDownloadUrl, videoDemoUrl, status, upvotes)
5. `Challenge` & `ChallengeSubmission` (sprints, datasets, rubrics, team entries, scores)
6. `CommunityResource` (cheat sheets, REFramework templates, exam question banks)
7. `SiteSettings` (headlines, marquee ticker, live impact counters, alliance ID)
8. `AuditLog` (user_id, action, entity_type, entity_id, changes_json, created_at)

---

## 2. CURRENT vs. PLANNED vs. Future State

### CURRENT (Actually Implemented)
- Handcrafted TypeScript interfaces defined in [`src/types/index.ts`](file:///d:/ace%20uipath%20communtiy/ACE-UiPath-Community/src/types/index.ts).

### PLANNED (Decided & Approved)
- Generated TypeScript types matching PostgreSQL tables using `npx supabase gen types typescript --local > src/types/supabase.ts`.

### FUTURE (Under Consideration)
- Shared Zod validation schemas for API requests and frontend form validations.
