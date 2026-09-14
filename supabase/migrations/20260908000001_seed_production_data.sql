-- ACE UiPath Community Digital Operating System
-- Migration Seed Script: supabase/migrations/20260908000001_seed_production_data.sql
-- Idempotent seed data for production Supabase database

-- ==================================================================
-- 1. GLOBAL SITE SETTINGS (with verified statistics & content)
-- ==================================================================
INSERT INTO public.site_settings (key, value_json) VALUES (
  'global_config',
  '{
    "heroHeading": "ACE UiPath Community",
    "heroTagline": "A student community at ACE Engineering College focused on learning, building and exploring automation.",
    "heroSubheadline": "Discover UiPath, master REFramework, deploy production software robots, participate in hackathons, and shape your career in Intelligent Automation.",
    "primaryCtaText": "Explore the Community",
    "primaryCtaLink": "activities",
    "secondaryCtaText": "Start Learning",
    "secondaryCtaLink": "learn",
    "announcementTicker": "🚀 Flagship Event: UiPath REFramework Masterclass 2026 scheduled for Sept 12, 2026. Registrations Open!",
    "isAnnouncementActive": true,
    "featuredActivityId": "act_1",
    "featuredProjectIds": ["proj_1", "proj_2"],
    "communityStoryHeading": "Built by Students, Powered by UiPath",
    "communityStoryText": "Founded in 2022 under the department of CSE & IT, the ACE UiPath Community started as a group of 15 students eager to automate routine campus processes. Today, it stands as one of the premier student automation hubs in the region.",
    "communityStoryHighlight": "Recognized by UiPath Academic Alliance with 450+ students trained and 38 software bots deployed across college administration.",
    "communityStoryImageUrl": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    "communityEmail": "uipath.community@aceec.ac.in",
    "communityDiscordUrl": "https://discord.gg/ace-uipath",
    "communityWhatsappUrl": "https://chat.whatsapp.com/ace-uipath-official",
    "communityLinkedinUrl": "https://linkedin.com/company/ace-uipath-community",
    "communityGithubUrl": "https://github.com/ACE-UiPath-Community",
    "uipathAllianceId": "ACE-UIPATH-EDU-ALLIANCE-9421",
    "totalStudentsTrained": 950,
    "totalBotsBuilt": 140,
    "totalCertifications": 95,
    "totalHoursSaved": 3800,
    "statistics": [
      {
        "id": "s1",
        "title": "Students Trained",
        "value": "950+",
        "description": "Workshops across CSE, IT, ECE & allied branches",
        "visible": true,
        "order": 1
      },
      {
        "id": "s2",
        "title": "Automations Built",
        "value": "140+",
        "description": "Production-ready bots deployed for student and campus needs",
        "visible": true,
        "order": 2
      },
      {
        "id": "s3",
        "title": "UiPath Certifications",
        "value": "95+",
        "description": "Certified Associate & Specialist developers",
        "visible": true,
        "order": 3
      },
      {
        "id": "s4",
        "title": "Hours Automated",
        "value": "3,800+",
        "description": "Saved in academic grading and records handling",
        "visible": true,
        "order": 4
      }
    ],
    "announcements": [
      {
        "id": "ann_1",
        "title": "Flagship Masterclass 2026",
        "message": "UiPath REFramework Enterprise Masterclass registrations are now live! Limited 120 seats.",
        "date": "2026-09-01",
        "link": "#activity/reframework-enterprise-masterclass-2026",
        "isActive": true
      },
      {
        "id": "ann_2",
        "title": "UiPath Certification Voucher Drive",
        "message": "UiPath Academic Alliance 50% certification discount vouchers distributed to 25 merit students.",
        "date": "2026-08-15",
        "isActive": true
      }
    ],
    "timelineMilestones": [
      {
        "id": "tm_1",
        "year": "2022",
        "title": "Community Inception & UiPath Alliance Partnership",
        "category": "Founding",
        "description": "ACE Engineering College formally partnered with the UiPath Academic Alliance. 15 founding students led by faculty advisors initiated the first StudioX citizen developer bootcamp.",
        "imageUrl": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
        "order": 1
      },
      {
        "id": "tm_2",
        "year": "2023",
        "title": "First 100 Certified Developers Milestone",
        "category": "Milestone",
        "description": "Over 100 students cleared official UiPath Certified Associate assessments. Community initiated the Student Bot Showcase repository.",
        "imageUrl": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
        "order": 2
      },
      {
        "id": "tm_3",
        "year": "2024",
        "title": "National Hackathon Accolades",
        "category": "Achievement",
        "description": "ACE student team won 2nd runner-up in national UiPath Automation Challenge for the Automated College Grade Extractor Bot.",
        "imageUrl": "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
        "order": 3
      },
      {
        "id": "tm_4",
        "year": "2025",
        "title": "Launch of AI Center & Document Understanding Labs",
        "category": "Innovation",
        "description": "Set up dedicated intelligent document processing sandbox environments for students exploring Machine Learning Extractors.",
        "imageUrl": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
        "order": 4
      },
      {
        "id": "tm_5",
        "year": "2026",
        "title": "Digital Operating System & Cloud Ecosystem Launch",
        "category": "Transformation",
        "description": "Rolled out the comprehensive ACE UiPath Community Digital Operating System, empowering real-time learning, draft reviews, and open-source packages.",
        "imageUrl": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
        "order": 5
      }
    ]
  }'::jsonb
) ON CONFLICT (key) DO UPDATE SET value_json = EXCLUDED.value_json, updated_at = NOW();

-- ==================================================================
-- 2. ACTIVITIES SEED
-- ==================================================================
INSERT INTO public.activities (
  id, slug, title, category, event_type, activity_date, time_start, time_end, venue,
  summary, full_description_md, objectives_text, agenda, uipath_topics, learning_outcomes,
  banner_image_url, gallery_images, recording_url, slides_url, github_url, workflow_package_url,
  status, is_featured, speakers, achievements
) VALUES
(
  'act_1',
  'reframework-enterprise-masterclass-2026',
  'Robotic Enterprise Framework (REFramework) Deep-Dive Masterclass',
  'Workshop',
  'Hybrid',
  '2026-09-12',
  '10:00 AM',
  '04:30 PM',
  'Seminar Hall 3 & Zoom Live Stream',
  'An intensive hands-on bootcamp mastering UiPath State Machines, Transactional Processing, Config.xlsx, Orchestrator Queues, and Auto-Recovery Exception Handling.',
  '# REFramework Enterprise Masterclass 2026\n\nJoin the ACE UiPath Community for a comprehensive architectural deep-dive into the Robotic Enterprise Framework (REFramework).\n\n### What You Will Build\nParticipants will build an enterprise-grade automated invoice reconciliation dispatcher and performer robot using UiPath Studio 2024.x and Orchestrator Queues.',
  ARRAY['Master REFramework State Machine Architecture', 'Configure Orchestrator Queue Dispatcher and Performer bots', 'Implement Business Rule Exceptions vs System Exceptions'],
  '[
    {"time": "10:00 AM - 11:30 AM", "title": "REFramework State Machine Fundamentals & Init State", "speaker": "Tejaswy Kanchana"},
    {"time": "11:45 AM - 01:15 PM", "title": "Orchestrator Queues, Transaction Items & Dispatcher Pattern", "speaker": "Priya Sharma"},
    {"time": "02:00 PM - 03:30 PM", "title": "Hands-on Lab: Config.xlsx, System vs Business Exceptions", "speaker": "Tejaswy Kanchana"},
    {"time": "03:45 PM - 04:30 PM", "title": "Code Review, Testing Checklist & Live Q&A", "speaker": "Dr. K. Srinivas"}
  ]'::jsonb,
  ARRAY['UiPath Studio 2024.x', 'REFramework', 'Orchestrator Queues', 'State Machines', 'JSON/Excel Config'],
  ARRAY['Ability to build enterprise-grade transactional bots', 'Deep understanding of Init, Get Transaction, Process, and End Process states'],
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
  '["https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
  'https://youtube.com/watch?v=reframework-masterclass-demo',
  'https://slideshare.net/ace-uipath/reframework-2026',
  'https://github.com/ACE-UiPath-Community/REFramework-Masterclass-2026',
  'https://github.com/ACE-UiPath-Community/REFramework-Masterclass-2026/releases/download/v1.0/REFramework_Starter.zip',
  'Upcoming',
  true,
  '[
    {
      "id": "spk_1",
      "name": "Tejaswy Kanchana",
      "roleTitle": "UiPath Certified Professional & Community Lead",
      "organization": "ACE Engineering College",
      "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      "linkedinUrl": "https://linkedin.com/in/tejaswy-kanchana",
      "bio": "Lead architect and mentor for enterprise automation initiatives with 4+ years UiPath hands-on experience."
    }
  ]'::jsonb,
  '[]'::jsonb
),
(
  'act_2',
  'document-understanding-ai-hackathon-2025',
  'Intelligent Document Understanding AI Hackathon 2025',
  'Hackathon',
  'Offline',
  '2025-11-20',
  '09:00 AM',
  '06:00 PM',
  'ACE Innovation & Incubation Center',
  'A 24-hour hackathon where 18 student teams engineered automated invoice extraction and resume parsing workflows using UiPath AI Center and DU ML Extractors.',
  '# Intelligent Document Understanding AI Hackathon 2025\n\nStudents built end-to-end intelligent document processing pipelines using UiPath Document Understanding and ML Extractors.',
  ARRAY['Train ML models in UiPath AI Center', 'Configure Action Center for Human-in-the-loop validation'],
  '[]'::jsonb,
  ARRAY['UiPath AI Center', 'Document Understanding', 'Action Center', 'Form Extractors'],
  ARRAY['18 Production-ready IDP bots deployed', '3 Teams fast-tracked to national UiPath competition'],
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
  '["https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
  'https://youtube.com/watch?v=du-hackathon-2025',
  'https://slideshare.net/ace-uipath/du-hackathon-slides',
  'https://github.com/ACE-UiPath-Community/DU-Hackathon-2025',
  'https://github.com/ACE-UiPath-Community/DU-Hackathon-2025/releases/download/v1.0/DU_Starter_Kit.zip',
  'Completed',
  false,
  '[]'::jsonb,
  '[
    {
      "id": "ach_1",
      "title": "First Place Winner",
      "recipientName": "Team DocuParse (CSE 3rd Year)",
      "badgeType": "First Place",
      "description": "Engineered a multi-format invoice extractor with 98.4% extraction accuracy across unstructured tables."
    }
  ]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  full_description_md = EXCLUDED.full_description_md,
  agenda = EXCLUDED.agenda,
  speakers = EXCLUDED.speakers,
  updated_at = NOW();

-- ==================================================================
-- 3. PROJECTS SEED
-- ==================================================================
INSERT INTO public.projects (
  id, slug, title, tagline, summary, problem_statement, solution_description,
  uipath_tools_used, roi_metrics, repo_url, package_download_url, author_name,
  author_branch, status, upvotes, download_count
) VALUES
(
  'proj_1',
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
  142,
  380
),
(
  'proj_2',
  'campus-library-book-rfid-reconciliation-bot',
  'Campus Library Book RFID Reconciliation Bot',
  'Automated Overdue Notice & Catalog Sync Bot',
  'A scheduled unattended robot that queries library Koha database tables, reconciles physical RFID return logs, and alerts students on upcoming return dates.',
  'Library staff spent 2.5 hours daily manually identifying overdue book borrowers and drafting individual email notices.',
  'Configured an unattended bot running via UiPath Orchestrator every night at 11 PM. It compares checkout records with RFID scanners and dispatches personalized reminders.',
  ARRAY['UiPath Studio', 'Database Activities', 'Orchestrator Triggers', 'Koha ILS'],
  'Eliminated 75 hours of repetitive monthly manual library clerical tasks',
  'https://github.com/ACE-UiPath-Community/Library-Reconciliation-Bot',
  'https://github.com/ACE-UiPath-Community/Library-Reconciliation-Bot/releases/download/v1.0/LibraryBot.zip',
  'Rahul Varma',
  'IT',
  'Approved',
  89,
  215
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  tagline = EXCLUDED.tagline,
  summary = EXCLUDED.summary,
  roi_metrics = EXCLUDED.roi_metrics,
  upvotes = EXCLUDED.upvotes,
  download_count = EXCLUDED.download_count;

-- ==================================================================
-- 4. LEARNING PATHS SEED
-- ==================================================================
INSERT INTO public.learning_paths (
  id, slug, title, tagline, level, target_audience, estimated_hours, icon_name, description, order_index, is_published, modules
) VALUES
(
  'path_1',
  'track-1-citizen-developer-studiox',
  'Track 1: Citizen Developer (StudioX)',
  'Zero-Code Automation for Excel, Web & Email',
  'Beginner',
  'All 1st & 2nd Year Students across all branches',
  8,
  'Zap',
  'Start your automation journey with UiPath StudioX. Learn to automate Excel spreadsheets, scrape web data, process PDFs, and automate Outlook emails without writing complex code.',
  1,
  true,
  '[
    {
      "id": "mod_1",
      "slug": "getting-started-studiox-installation",
      "title": "1. Getting Started with UiPath StudioX & Community Cloud",
      "summary": "Set up your free UiPath Automation Cloud account, configure StudioX in Community Edition, and understand citizen automation concepts.",
      "durationMinutes": 45,
      "level": "Beginner",
      "uipathTool": "StudioX",
      "contentMd": "# Getting Started with StudioX\n\nWelcome to your first step in Intelligent Automation!",
      "practiceExerciseMd": "Download sample student marks spreadsheet and create a robot to highlight distinction holders in green.",
      "orderIndex": 1
    }
  ]'::jsonb
),
(
  'path_2',
  'track-3-enterprise-reframework',
  'Track 3: Enterprise Automation Architect (REFramework)',
  'State Machines, Queue Processing & Auto-Recovery',
  'Advanced',
  '3rd & 4th Year CSE/IT Students',
  25,
  'Cpu',
  'Master the industry-standard Robotic Enterprise Framework (REFramework). Learn transactional processing, Orchestrator queue locks, business rule exception handling, and self-healing bots.',
  3,
  true,
  '[
    {
      "id": "mod_6",
      "slug": "reframework-architecture-state-machines",
      "title": "1. REFramework Architecture & State Machine Deep Dive",
      "summary": "Master the 4 states: Init, Get Transaction Data, Process Transaction, and End Process. Compare sequence workflows vs state machines.",
      "durationMinutes": 90,
      "level": "Advanced",
      "uipathTool": "Studio",
      "contentMd": "# REFramework Architecture Deep Dive\n\nRobotic Enterprise Framework is UiPath standard enterprise design template.",
      "practiceExerciseMd": "Open standard REFramework template in Studio 2024.x and configure Config.xlsx.",
      "orderIndex": 1
    }
  ]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  modules = EXCLUDED.modules;

-- ==================================================================
-- 5. CHALLENGES SEED
-- ==================================================================
INSERT INTO public.challenges (
  id, slug, title, theme, category, status, start_date, end_date, prize_pool,
  description_md, rules_md, evaluation_criteria, starter_dataset_url, submission_count
) VALUES
(
  'chal_1',
  'enterprise-invoice-automation-hackathon-2026',
  'Enterprise Invoice Automation Hackathon 2026',
  'Intelligent Document Extraction & Action Center Human-in-the-Loop',
  'Hackathon',
  'Active',
  '2026-09-01',
  '2026-09-30',
  '₹25,000 + UiPath Swag Kits',
  '# Enterprise Invoice Automation Hackathon 2026\n\nBuild an intelligent robot that parses 50 unstructured supplier invoices and reconciles them with an enterprise ERP ledger.',
  'Teams of 2-4 members. Must use UiPath Studio or StudioX. Workflow must include error handling and logging.',
  ARRAY['Extraction Accuracy (35%)', 'Exception Handling & Clean Code (25%)', 'Speed & Execution Efficiency (20%)', 'Video Demo & Documentation (20%)'],
  'https://github.com/ACE-UiPath-Community/Hackathon-Datasets/releases/download/v1/Invoices_50_Dataset.zip',
  14
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  theme = EXCLUDED.theme,
  status = EXCLUDED.status;

-- ==================================================================
-- 6. RESOURCES SEED
-- ==================================================================
INSERT INTO public.resources (
  id, title, category, description, uipath_version, download_url, file_type, tags, download_count
) VALUES
(
  'res_1',
  'Enterprise REFramework Production Starter Template 2024.x',
  'Template',
  'Battle-tested REFramework boilerplate pre-configured with enhanced Config.xlsx, JSON logging, Teams webhook notification, and Orchestrator queue auto-retry.',
  '2024.10 LTS',
  'https://github.com/ACE-UiPath-Community/REFramework-Starter/archive/refs/heads/main.zip',
  'XAML',
  ARRAY['REFramework', 'Queues', 'Enterprise', 'Template'],
  420
),
(
  'res_2',
  'UiPath Associate Developer (UiARD) Exam Cheat Sheet',
  'Cheatsheet',
  'A condensed 6-page revision guide covering Selector tuning, Regex pattern anchors, Excel activity modern design vs classic, and State machine transitions.',
  '2024.x Compatible',
  'https://github.com/ACE-UiPath-Community/Exam-Cheatsheets/raw/main/UiARD_Exam_Cheatsheet.pdf',
  'PDF',
  ARRAY['Certification', 'Exam Prep', 'UiARD', 'Selectors'],
  850
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  download_count = EXCLUDED.download_count;

-- ==================================================================
-- 7. LEADERSHIP DIRECTORY SEED
-- ==================================================================
INSERT INTO public.leadership (
  id, name, role_title, category, academic_year, avatar_url, linkedin_url, github_url, bio, contributions, order_index
) VALUES
(
  'lead_1',
  'Dr. K. Srinivas Rao',
  'Faculty Advisor & Head of Center for Automation',
  'Faculty Advisor',
  '2022-2026',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://linkedin.com',
  'https://github.com',
  'Professor in CSE department pioneering RPA curriculum integration with UiPath Academic Alliance since 2022.',
  ARRAY['Established UiPath Academic Alliance at ACE', 'Mentored 450+ students through certification', 'Co-authored automation research papers'],
  1
),
(
  'lead_2',
  'Tejaswy Kanchana',
  'Community Lead & Student President',
  'Current Core Lead',
  '2025-2026',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://linkedin.com/in/tejaswy-kanchana',
  'https://github.com/tejaswy',
  'UiPath Certified Advanced Developer and final year CSE student directing workshops, projects, and hackathon teams.',
  ARRAY['Led architecture of ACE UiPath Community OS', 'Delivered 8 REFramework masterclasses', 'Engineered Grade Extractor Bot'],
  2
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role_title = EXCLUDED.role_title,
  bio = EXCLUDED.bio;
