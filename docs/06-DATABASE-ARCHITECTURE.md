# 06 — Database Architecture & Relational Model

**Product**: ACE UiPath Community Digital Operating System  
**Database Engine**: PostgreSQL 15+ (Hosted on Supabase)  
**Status**: PLANNED (Production Architecture)  

---

## 1. CURRENT Implementation (Audited)

- **Source of Truth**: Hardcoded JavaScript arrays in [`src/data/initialData.ts`](file:///d:/ace%20uipath%20communtiy/ACE-UiPath-Community/src/data/initialData.ts).
- **Persistence**: Browser `localStorage` via [`src/data/store.ts`](file:///d:/ace%20uipath%20communtiy/ACE-UiPath-Community/src/data/store.ts).
- **Limitations**: Data is trapped on individual physical devices; zero multi-user sync; zero relational foreign key constraints.

---

## 2. PLANNED Relational Entity Model (Supabase PostgreSQL)

Instead of storing large nested JSON structures, the production database uses normalized relational tables:

```text
users (id PK, email UK, name, roll_number, branch, graduation_year, avatar_url, github_url, linkedin_url, created_at)
roles (id PK, name UK) -- "STUDENT", "CORE_TEAM", "ADMIN"
user_roles (user_id FK, role_id FK, PRIMARY KEY (user_id, role_id))

activities (id PK, slug UK, title, category, event_type, activity_date, time_start, time_end, venue, summary, full_description_md, objectives_text, uipath_topics, learning_outcomes, banner_image_url, recording_url, slides_url, github_url, workflow_package_url, status, is_featured, created_at, updated_at)

activity_agenda (id PK, activity_id FK, time_slot, title, description, speaker_name, order_index)
speakers (id PK, name, role_title, organization, avatar_url, linkedin_url, bio)
activity_speakers (activity_id FK, speaker_id FK, order_index, PRIMARY KEY (activity_id, speaker_id))
activity_achievements (id PK, activity_id FK, title, recipient_name, roll_number, badge_type, description)
activity_media (id PK, activity_id FK, media_url, media_type, caption, storage_path, order_index)

learning_paths (id PK, slug UK, title, tagline, level, target_audience, estimated_hours, icon_name, description, order_index, is_published)
learning_modules (id PK, path_id FK, slug UK, title, summary, duration_minutes, level, uipath_tool, content_md, practice_exercise_md, starter_code_url, solution_code_url, order_index)

projects (id PK, slug UK, title, tagline, summary, problem_statement, solution_description, uipath_tools_used, roi_metrics, repo_url, package_download_url, video_demo_url, author_id FK, author_name, author_roll_number, author_branch, status, download_count, upvotes, created_at)
project_media (id PK, project_id FK, media_url, media_type, caption, order_index)

challenges (id PK, slug UK, title, theme, category, status, start_date, end_date, prize_pool, description_md, rules_md, evaluation_criteria, starter_dataset_url, submission_count)
challenge_submissions (id PK, challenge_id FK, user_id FK, team_name, team_members_text, project_title, repo_url, video_demo_url, score, rank, feedback, submitted_at)

resources (id PK, title, category, description, uipath_version, download_url, file_type, tags, download_count, created_at)
announcements (id PK, title, body_text, action_url, is_active, start_date, end_date, created_at)
site_settings (key PK, value_json JSONB, updated_at)

audit_logs (id PK, user_id FK, action, entity_type, entity_id, changes_json JSONB, ip_address, created_at)
```

---

## 3. Relational Foreign Key Integrity

- `activity_agenda.activity_id` → `activities.id` (ON DELETE CASCADE)
- `activity_speakers.activity_id` → `activities.id` (ON DELETE CASCADE)
- `activity_speakers.speaker_id` → `speakers.id` (ON DELETE RESTRICT)
- `activity_achievements.activity_id` → `activities.id` (ON DELETE CASCADE)
- `activity_media.activity_id` → `activities.id` (ON DELETE CASCADE)
- `learning_modules.path_id` → `learning_paths.id` (ON DELETE CASCADE)
- `challenge_submissions.challenge_id` → `challenges.id` (ON DELETE CASCADE)
- `challenge_submissions.user_id` → `users.id` (ON DELETE SET NULL)
- `audit_logs.user_id` → `users.id` (ON DELETE SET NULL)

---

## 4. FUTURE Enhancements
- Automated database function triggers for updating `submission_count` and `download_count`.
- Full-text search index (`tsvector`) on `activities`, `learning_modules`, and `projects`.
