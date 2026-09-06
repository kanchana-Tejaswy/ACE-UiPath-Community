-- ACE UiPath Community Digital Operating System
-- Migration Seed Script: supabase/seed.sql
-- Maps historical initialData.ts records into PostgreSQL relational tables

-- 1. SITE SETTINGS
INSERT INTO site_settings (key, value_json) VALUES (
  'global_config',
  '{
    "heroTitle": "Empowering Enterprise Automation Engineers at ACE Engineering College",
    "heroSubtitle": "Discover UiPath, master REFramework, deploy production software robots, participate in hackathons, and shape your career in Intelligent Automation.",
    "announcementTicker": "🚀 Flagship Event: UiPath REFramework Masterclass 2026 scheduled for Sept 12, 2026. Registrations Open!",
    "totalStudentsTrained": 450,
    "totalBotsBuilt": 38,
    "totalCertifications": 24,
    "totalHoursSaved": 1250,
    "uipathAlliancePartnerId": "ACE-UIPATH-EDU-ALLIANCE-9421"
  }'::jsonb
) ON CONFLICT (key) DO UPDATE SET value_json = EXCLUDED.value_json;

-- 2. ACTIVITIES
INSERT INTO activities (
  id, slug, title, category, event_type, activity_date, time_start, time_end, venue, 
  summary, full_description_md, objectives_text, uipath_topics, learning_outcomes, 
  banner_image_url, recording_url, slides_url, github_url, workflow_package_url, status, is_featured
) VALUES 
(
  'a1111111-1111-1111-1111-111111111111',
  'reframework-enterprise-masterclass-2026',
  'Robotic Enterprise Framework (REFramework) Deep-Dive Masterclass',
  'Workshop',
  'Hybrid',
  '2026-09-12',
  '10:00 AM',
  '04:30 PM',
  'Seminar Hall 3 & Zoom Live Stream',
  'An intensive hands-on bootcamp mastering UiPath State Machines, Transactional Processing, Config.xlsx, Orchestrator Queues, and Auto-Recovery Exception Handling.',
  '# REFramework Enterprise Masterclass 2026\n\nJoin the ACE UiPath Community for a comprehensive architectural deep-dive into the Robotic Enterprise Framework (REFramework).',
  ARRAY['Master REFramework State Machine Architecture', 'Configure Orchestrator Queue Dispatcher and Performer bots', 'Implement Business Rule Exceptions vs System Exceptions'],
  ARRAY['UiPath Studio 2024.x', 'REFramework', 'Orchestrator Queues', 'State Machines', 'JSON/Excel Config'],
  ARRAY['Ability to build enterprise-grade transactional bots', 'Deep understanding of Init, Get Transaction, Process, and End Process states'],
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
  'https://youtube.com/watch?v=reframework-masterclass-demo',
  'https://slideshare.net/ace-uipath/reframework-2026',
  'https://github.com/ACE-UiPath-Community/REFramework-Masterclass-2026',
  'https://github.com/ACE-UiPath-Community/REFramework-Masterclass-2026/releases/download/v1.0/REFramework_Starter.zip',
  'Upcoming',
  true
),
(
  'a2222222-2222-2222-2222-222222222222',
  'document-understanding-ai-hackathon-2025',
  'Intelligent Document Understanding AI Hackathon 2025',
  'Hackathon',
  'Offline',
  '2025-11-20',
  '09:00 AM',
  '06:00 PM',
  'ACE Innovation & Incubation Center',
  'A 24-hour hackathon where 18 student teams engineered automated invoice extraction and resume parsing workflows using UiPath AI Center and DU ML Extractors.',
  '# Intelligent Document Understanding AI Hackathon 2025\n\nStudents built end-to-end intelligent document processing pipelines using UiPath Document Understanding.',
  ARRAY['Train ML models in UiPath AI Center', 'Configure Action Center for Human-in-the-loop validation'],
  ARRAY['UiPath AI Center', 'Document Understanding', 'Action Center', 'Form Extractors'],
  ARRAY['18 Production-ready IDP bots deployed', '3 Teams fast-tracked to national UiPath competition'],
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
  'https://youtube.com/watch?v=du-hackathon-2025',
  'https://slideshare.net/ace-uipath/du-hackathon-slides',
  'https://github.com/ACE-UiPath-Community/DU-Hackathon-2025',
  'https://github.com/ACE-UiPath-Community/DU-Hackathon-2025/releases/download/v1.0/DU_Starter_Kit.zip',
  'Completed',
  false
) ON CONFLICT (slug) DO NOTHING;

-- 3. LEARNING PATHS & MODULES
INSERT INTO learning_paths (
  id, slug, title, tagline, level, target_audience, estimated_hours, icon_name, description, order_index
) VALUES 
(
  'p1111111-1111-1111-1111-111111111111',
  'track-1-citizen-dev',
  'Track 1: Citizen Developer (StudioX)',
  'Zero-Code Automation for Excel, Web & Email',
  'Beginner',
  'All 1st & 2nd Year Students across all branches',
  8,
  'Zap',
  'Start your automation journey with UiPath StudioX. Learn to automate Excel spreadsheets, scrape web data, process PDFs, and automate Outlook emails without writing complex code.',
  1
),
(
  'p2222222-2222-2222-2222-222222222222',
  'track-3-reframework',
  'Track 3: Enterprise Automation Architect (REFramework)',
  'State Machines, Queue Processing & Auto-Recovery',
  'Advanced',
  '3rd & 4th Year CSE/IT Students',
  25,
  'Cpu',
  'Master the industry-standard Robotic Enterprise Framework (REFramework). Learn transactional processing, Orchestrator queue locks, business rule exception handling, and self-healing bots.',
  3
) ON CONFLICT (slug) DO NOTHING;

-- 4. PROJECTS SHOWCASE
INSERT INTO projects (
  id, slug, title, tagline, summary, problem_statement, solution_description, 
  uipath_tools_used, roi_metrics, repo_url, package_download_url, author_name, author_branch, status, upvotes
) VALUES 
(
  'b1111111-1111-1111-1111-111111111111',
  'automated-college-grade-extractor-bot',
  'Automated College Exam Grade Extractor Bot',
  'Automated PDF Report Card Extraction & Student Notification Bot',
  'An enterprise UiPath bot built using Studio and REFramework that processes 850+ university PDF grade sheets, calculates SGPA/CGPA, and dispatches personalized WhatsApp/Email grade summaries.',
  'Manual grade sheet extraction for 800+ students took 45 faculty hours per semester with frequent manual calculation errors.',
  'Engineered a dual Dispatcher-Performer REFramework bot that reads raw university PDF gazettes, parses tabular data using Regex & Computer Vision, calculates CGPA, and logs results into Orchestrator Queues.',
  ARRAY['UiPath Studio', 'REFramework', 'PDF Automation', 'Orchestrator Queues', 'Mail Activities'],
  'Saves 45 hours per exam cycle; 100% calculation accuracy across 850 students',
  'https://github.com/ACE-UiPath-Community/Grade-Extractor-Bot',
  'https://github.com/ACE-UiPath-Community/Grade-Extractor-Bot/releases/download/v1.0/GradeExtractor.nupkg',
  'Kanchana Tejaswy',
  'CSE',
  'Featured',
  42
) ON CONFLICT (slug) DO NOTHING;

-- 5. RESOURCES
INSERT INTO resources (
  id, title, category, description, uipath_version, download_url, file_type, tags, download_count
) VALUES 
(
  'r1111111-1111-1111-1111-111111111111',
  'REFramework Production Starter Template V2026',
  'Template',
  'Official REFramework template pre-configured with Custom Logging, Excel Config loader, and Orchestrator Queue Retry rules.',
  '2024.10+',
  'https://github.com/ACE-UiPath-Community/REFramework-Template/archive/refs/heads/main.zip',
  'ZIP',
  ARRAY['REFramework', 'Template', 'State Machine', 'Queues'],
  128
),
(
  'r2222222-2222-2222-2222-222222222222',
  'UiPath Associate Developer Exam Question Bank (150+ Questions)',
  'Exam Questions',
  'Curated question bank covering Selectors, DataTables, Control Flow, and Exception Handling for the official UiRPA Associate Exam.',
  'All Versions',
  'https://github.com/ACE-UiPath-Community/UiPath-Certification-Bank/raw/main/UiRPA_Mock_Questions.pdf',
  'PDF',
  ARRAY['Certification', 'UiRPA', 'Question Bank', 'Exam Prep'],
  215
) ON CONFLICT DO NOTHING;
