import {
  Activity,
  LearningPath,
  ProjectShowcase,
  Challenge,
  CommunityResource,
  LeadershipMember,
  SiteSettings,
  User,
  CommunityStatistic,
  Announcement,
  TimelineMilestone
} from '../types';

export const INITIAL_STATISTICS: CommunityStatistic[] = [
  {
    id: 'stat_1',
    title: 'Students Trained',
    value: '850+',
    description: 'Workshops across CSE, IT, ECE & allied engineering branches',
    visible: true,
    order: 1
  },
  {
    id: 'stat_2',
    title: 'Automations Built',
    value: '140+',
    description: 'Production-ready bots deployed for student & campus needs',
    visible: true,
    order: 2
  },
  {
    id: 'stat_3',
    title: 'UiPath Certifications',
    value: '95+',
    description: 'Certified Associate & Specialist developers at ACE',
    visible: true,
    order: 3
  },
  {
    id: 'stat_4',
    title: 'Hours Automated',
    value: '3,800+',
    description: 'Manual hours saved in academic records and compliance tasks',
    visible: true,
    order: 4
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann_1',
    title: 'Meetup on RPA & AI by Industry Experts',
    message: 'Flagship session with Bhavani Munaga (Senior RPA & AI Developer) at ACE Engineering College.',
    date: '2026-08-19',
    link: 'activities',
    isActive: true
  },
  {
    id: 'ann_2',
    title: 'ACE UiPath Enterprise Hackathon 2026',
    message: 'Registrations open! Build campus automation solutions before October 15.',
    date: '2026-09-01',
    link: 'challenges',
    isActive: true
  }
];

export const INITIAL_TIMELINE_MILESTONES: TimelineMilestone[] = [
  {
    id: 'tm_2022',
    year: '2022',
    title: 'Community Chapter Inauguration',
    category: 'Foundation',
    description: 'ACE Engineering College established the official UiPath Academic Alliance Chapter to empower students with enterprise RPA capabilities.',
    date: 'October 2022',
    order: 1
  },
  {
    id: 'tm_2023',
    year: '2023',
    title: 'First Certified Developer Cohort',
    category: 'Milestone',
    description: 'Over 40 engineering students cleared the UiPath Certified Associate examination, building their first autonomous grading bots.',
    date: 'May 2023',
    order: 2
  },
  {
    id: 'tm_2024',
    year: '2024',
    title: 'Dedicated Automation Lab Launch',
    category: 'Infrastructure',
    description: 'A 60-seat high-performance automation lab was inaugurated on campus with enterprise UiPath licenses and Orchestrator connectivity.',
    date: 'February 2024',
    order: 3
  },
  {
    id: 'tm_2025',
    year: '2025',
    title: 'Document Processing & AI Hackathon',
    category: 'Competition',
    description: '35 teams competed in a 24-hour sprint building Document Understanding pipelines for academic transcript and receipt parsing.',
    date: 'November 2025',
    order: 4
  },
  {
    id: 'tm_2026',
    year: '2026',
    title: 'RPA & AI Industry Expert Meetup',
    category: 'Industry Connect',
    description: 'Senior RPA & AI developers from industry visited ACE to mentor 175+ students on enterprise REFramework and autonomous agent bots.',
    date: 'August 2026',
    imageUrl: '/uipath-session-1.png',
    order: 5
  }
];

export const INITIAL_SETTINGS: SiteSettings = {
  heroHeading: 'ACE UiPath Community',
  heroTagline: 'A student community at ACE Engineering College focused on learning, building and exploring automation.',
  heroSubheadline: 'Empowering engineering students to master Enterprise Robotic Process Automation, AI-driven workflows, and deploy high-impact automations at ACE Engineering College.',
  primaryCtaText: 'Explore the Community',
  primaryCtaLink: 'activities',
  secondaryCtaText: 'Start Learning',
  secondaryCtaLink: 'learn',
  announcementTicker: '📢 Meetup on RPA & AI by Industry Experts held with 175+ student registrations! | 🚀 Registration open for ACE UiPath Enterprise Hackathon 2026.',
  isAnnouncementActive: true,
  featuredActivityId: 'act_meetup_2026',
  featuredProjectIds: ['proj_01', 'proj_02'],
  communityStoryHeading: 'Building an Engineering Legacy in Robotic Automation',
  communityStoryText: 'Founded under the UiPath Academic Alliance at ACE Engineering College (Ghatkesar, Hyderabad), our community bridges the gap between academic theory and industry automation practice. Guided by dedicated faculty and student champions, we conduct weekly hands-on labs, open-source bot hackathons, and enterprise certification bootcamps.',
  communityStoryHighlight: 'Over 850 students trained and 140+ functional automations built for campus and enterprise use cases.',
  communityEmail: 'uipath.community@aceec.ac.in',
  communityDiscordUrl: 'https://discord.gg/ace-uipath',
  communityWhatsappUrl: 'https://chat.whatsapp.com/ace-uipath',
  communityLinkedinUrl: 'https://linkedin.com/company/ace-uipath-community',
  communityGithubUrl: 'https://github.com/kanchana-Tejaswy/ACE-UiPath-Community',
  uipathAllianceId: 'ACE-UIPATH-EDU-ALLIANCE-9421',
  totalStudentsTrained: 850,
  totalBotsBuilt: 142,
  totalCertifications: 95,
  totalHoursSaved: 3840,
  statistics: INITIAL_STATISTICS,
  announcements: INITIAL_ANNOUNCEMENTS,
  timelineMilestones: INITIAL_TIMELINE_MILESTONES
};

export const INITIAL_USERS: User[] = [
  {
    id: 'user_admin_1',
    email: 'mail2tejaswy@gmail.com',
    name: 'k.tejaswy',
    rollNumber: '21ACE05A01',
    branch: 'Computer Science & Engineering',
    graduationYear: 2025,
    role: 'ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    linkedinUrl: 'https://linkedin.com/in/kanchana-tejaswy',
    githubUrl: 'https://github.com/kanchana-Tejaswy',
  },
  {
    id: 'user_core_1',
    email: 'techlead@aceec.ac.in',
    name: 'Rohit Varma',
    rollNumber: '22ACE05B14',
    branch: 'Information Technology',
    graduationYear: 2026,
    role: 'CORE_TEAM',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    linkedinUrl: 'https://linkedin.com/in/rohit-varma-rpa',
  },
  {
    id: 'user_student_1',
    email: 'student@aceec.ac.in',
    name: 'Ananya Reddy',
    rollNumber: '23ACE05C32',
    branch: 'Data Science & AI',
    graduationYear: 2027,
    role: 'STUDENT',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  }
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act_meetup_2026',
    slug: 'meetup-rpa-ai-industry-experts-2026',
    title: 'Meetup on RPA & AI by Industry Experts',
    category: 'Community Meetup',
    eventType: 'Hybrid',
    date: '2026-08-19',
    timeStart: '02:00 PM',
    timeEnd: '05:00 PM',
    venue: 'ACE Engineering College, Ghatkesar (Auditorium & Virtual)',
    summary: 'Special interactive meetup organized by ACE UiPath Student Chapter featuring Bhavani Munaga (Senior RPA & AI Developer, UiPath Community Core Member). Over 175 students registered to explore modern RPA architectures and AI in automation.',
    fullDescriptionMd: `### Meetup on RPA & AI by Industry Experts
**Organized by ACE UiPath Student Developers Community**

This flagship meetup brought together engineering students across departments to interact directly with industry RPA professionals and understand the transition from academic programming to enterprise automation.

### Key Highlights:
1. **Industry Perspective on RPA & AI**: How leading organizations use UiPath to orchestrate end-to-end business workflows.
2. **AI Center & Document Understanding**: Integrating machine learning models with UiPath bots for intelligent data extraction.
3. **Career Roadmap in Automation**: Guidance on certifications (UiPath Certified Professional), portfolio building, and real-world project development.
4. **Live Q&A & Mentorship**: Practical advice on starting with StudioX and advancing to enterprise REFramework.`,
    objectives: [
      'Understand how enterprise robotic automation is evolving with generative AI',
      'Learn directly from UiPath Community Core Members about career pathways',
      'Demonstrate practical automation workflows built on modern UiPath Studio'
    ],
    agenda: [
      { time: '02:00 PM - 02:15 PM', title: 'Welcome Address & Community Introduction', speaker: 'Student Community Leads' },
      { time: '02:15 PM - 03:30 PM', title: 'Keynote & Deep-Dive: Enterprise RPA & AI Integration', speaker: 'Bhavani Munaga' },
      { time: '03:30 PM - 04:30 PM', title: 'Live Automation Walkthrough & Student Projects Review', speaker: 'Bhavani Munaga' },
      { time: '04:30 PM - 05:00 PM', title: 'Open Q&A, Certification Guidance & Networking', speaker: 'Faculty & Speaker' }
    ],
    uipathTopicsCovered: ['UiPath Studio', 'AI Center', 'Document Understanding', 'Enterprise RPA Architecture', 'Career Pathways'],
    learningOutcomes: [
      'Clarity on enterprise automation skills demanded by employers',
      'Hands-on insight into integrating AI capabilities with software bots'
    ],
    bannerImage: '/uipath-session-1.png',
    galleryImages: ['/uipath-session-1.png', '/uipath-session-2.png'],
    status: 'Upcoming',
    isFeatured: true,
    speakers: [
      {
        id: 'spk_bhavani',
        name: 'Bhavani Munaga',
        roleTitle: 'Senior RPA & AI Developer',
        organization: 'UiPath Community Core Member',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        bio: 'Senior RPA & AI Developer, active contributor and core member of the UiPath Community.'
      }
    ],
    createdAt: '2026-08-10'
  },
  {
    id: 'act_2026_01',
    slug: 'reframework-enterprise-masterclass-2026',
    title: 'Robotic Enterprise Framework (REFramework) Deep-Dive Masterclass',
    category: 'Workshop',
    eventType: 'Hybrid',
    date: '2026-09-12',
    timeStart: '10:00 AM',
    timeEnd: '04:30 PM',
    venue: 'Seminar Hall 3 & Microsoft Teams Live',
    summary: 'A comprehensive full-day architectural workshop dissecting State Machines, Orchestrator Queue transactions, Business vs Application Exception handling, and robust retry logic in enterprise RPA.',
    fullDescriptionMd: `### Workshop Overview
The **Robotic Enterprise Framework (REFramework)** is the gold standard for enterprise-grade automation in UiPath. In this hands-on masterclass, students will build a production-ready queue-driven bot from scratch.

### Key Focus Areas
1. **State Machine Architecture**: Understanding Init, Get Transaction Data, Process Transaction, and End Process states.
2. **Configuration Management**: Utilizing \`Config.xlsx\` for centralized asset, queue, and threshold parameters.
3. **Transactional Processing**: Fetching Queue Items with transactional locks and setting status (\`Success\`, \`BusinessRuleException\`, \`SystemException\`).
4. **Resilience & Auto-Healing**: Global exception handlers and auto-recovery mechanisms for desktop/web UI crashes.`,
    objectives: [
      'Master the 4 core states of UiPath REFramework',
      'Integrate UiPath Orchestrator Queues with transactional dispatchers and performers',
      'Implement structured Try-Catch blocks and dynamic screenshots on failure',
      'Refactor monolithic scripts into modular reusable workflows'
    ],
    agenda: [
      { time: '10:00 AM - 10:30 AM', title: 'Architecture Breakdown: Why Enterprise Bots Fail without REFramework', speaker: 'Kanchana Tejaswy' },
      { time: '10:30 AM - 12:00 PM', title: 'Hands-on Lab 1: Config File & Orchestrator Queue Setup', speaker: 'Rohit Varma' },
      { time: '12:00 PM - 01:00 PM', title: 'Transaction State Machine & Data Model Deep-Dive', speaker: 'Kanchana Tejaswy' },
      { time: '01:00 PM - 02:00 PM', title: 'Networking & Automation Showcase Lunch' },
      { time: '02:00 PM - 03:45 PM', title: 'Hands-on Lab 2: Building the Performer Bot with Retry Logic', speaker: 'Rohit Varma' },
      { time: '03:45 PM - 04:30 PM', title: 'Code Review, Live Q&A, and Certificate Distribution', speaker: 'Faculty Coordinator' }
    ],
    uipathTopicsCovered: ['UiPath Studio 2024.x', 'REFramework', 'Orchestrator Queues', 'State Machines', 'TryCatch & GlobalHandler', 'Config.xlsx'],
    learningOutcomes: [
      'Ability to convert any linear automation into a robust REFramework template',
      'Configuring Orchestrator Assets and Queues via Studio Cloud Connector',
      'Designing clean exception hierarchies that differentiate business logic errors from infrastructure failures'
    ],
    bannerImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80'
    ],
    recordingUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    slidesUrl: 'https://docs.google.com/presentation/d/e/2PACX-1vTemplate/pub',
    githubUrl: 'https://github.com/kanchana-Tejaswy/ACE-UiPath-Community/tree/main/workshops/reframework-masterclass',
    workflowPackageUrl: 'https://github.com/kanchana-Tejaswy/ACE-UiPath-Community/releases/download/v1.0/REFramework_Student_Starter_V2026.zip',
    status: 'Upcoming',
    isFeatured: true,
    speakers: [
      {
        id: 'spk_1',
        name: 'Kanchana Tejaswy',
        roleTitle: 'UiPath Student Community Lead',
        organization: 'ACE Engineering College',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        linkedinUrl: 'https://linkedin.com/in/kanchana-tejaswy',
        bio: 'UiPath Certified Associate Developer & Lead Organizer. Built 15+ automated enterprise bots for academic grading and compliance.'
      },
      {
        id: 'spk_2',
        name: 'Rohit Varma',
        roleTitle: 'Technical Architect',
        organization: 'ACE RPA Student Lab',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        linkedinUrl: 'https://linkedin.com',
        bio: 'Specialist in UiPath Orchestrator integrations, Document Understanding ML models, and custom C# activity authoring.'
      }
    ],
    createdAt: '2026-08-20'
  },
  {
    id: 'act_2025_03',
    slug: 'intelligent-document-processing-hackathon-2025',
    title: 'Intelligent Document Processing (IDP) & AI Center Hackathon',
    category: 'Hackathon',
    eventType: 'Offline',
    date: '2025-11-08',
    timeStart: '09:00 AM',
    timeEnd: '06:00 PM',
    venue: 'Central Computing Center Lab 4',
    summary: '24-hour bot sprint where 35 student teams trained UiPath Document Understanding ML models to extract semi-structured data from handwritten invoices, medical prescriptions, and academic transcripts.',
    fullDescriptionMd: `### Hackathon Summary
Students tackled real-world messy document data using UiPath AI Center and Document Understanding. Each team was provided a dataset of 500+ diverse invoice formats and had to build an end-to-end automation with validation station human-in-the-loop workflows.`,
    objectives: [
      'Deploy UiPath Document Understanding with ML Extractor',
      'Design Action Center validation station for human verification',
      'Achieve >92% OCR field accuracy across multi-page receipts'
    ],
    agenda: [
      { time: '09:00 AM - 09:30 AM', title: 'Problem Statement & Dataset Release', speaker: 'Faculty Mentor' },
      { time: '09:30 AM - 01:00 PM', title: 'Sprint Phase 1: Taxonomy & Document Taxonomy Design' },
      { time: '01:00 PM - 02:00 PM', title: 'Lunch & Mentorship Review' },
      { time: '02:00 PM - 05:00 PM', title: 'Sprint Phase 2: Action Center & Orchestrator Integration' },
      { time: '05:00 PM - 06:00 PM', title: 'Final Demos, Jury Evaluation & Awards' }
    ],
    uipathTopicsCovered: ['Document Understanding', 'AI Center', 'Taxonomy Manager', 'Action Center', 'Form Extractor', 'Validation Station'],
    learningOutcomes: [
      'Building OCR pipelines with OmniPage and UiPath Document OCR',
      'Configuring Human-in-the-Loop workflows using Action Center',
      'Exporting parsed document data directly into SQL databases'
    ],
    bannerImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80'
    ],
    recordingUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    githubUrl: 'https://github.com/kanchana-Tejaswy/ACE-UiPath-Community/tree/main/hackathons/idp-2025',
    workflowPackageUrl: 'https://github.com/kanchana-Tejaswy/ACE-UiPath-Community/releases/download/v1.0/IDP_Hackathon_Winning_Workflows.zip',
    status: 'Completed',
    isFeatured: true,
    speakers: [
      {
        id: 'spk_3',
        name: 'Dr. S. K. Murthy',
        roleTitle: 'Head of Department & Patron',
        organization: 'ACE Engineering College',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        bio: 'Passionate about emerging tech and institutional automation adoption.'
      }
    ],
    achievements: [
      {
        id: 'ach_1',
        title: 'First Place Winner',
        recipientName: 'Team AutoDocs (Varun & Sneha)',
        rollNumber: '22ACE05A44',
        badgeType: 'First Place',
        description: 'Built a 99.1% accurate medical prescription parser with automatic pharmacy inventory check.'
      },
      {
        id: 'ach_2',
        title: 'Best Innovation Award',
        recipientName: 'Team NeuralBot (Aditya M.)',
        rollNumber: '23ACE05B12',
        badgeType: 'Best Innovation',
        description: 'Combined UiPath Document Understanding with Local LLM classification for messy receipts.'
      }
    ],
    createdAt: '2025-11-01'
  },
  {
    id: 'act_2025_01',
    slug: 'citizen-developer-automation-kickstart-2025',
    title: 'Citizen Developer Kickstart: Automating Everyday Student Tasks with StudioX',
    category: 'Bootcamp',
    eventType: 'Offline',
    date: '2025-02-15',
    timeStart: '10:00 AM',
    timeEnd: '03:30 PM',
    venue: 'Auditorium Block A',
    summary: 'Introductory zero-code automation bootcamp for first and second year engineering students across all departments (CSE, IT, ECE, EEE, Mech, Civil).',
    fullDescriptionMd: `### Bootcamp Highlights
Over 250 freshers joined this zero-code automation boot-camp. We proved that any student, regardless of prior programming knowledge, can automate repetitive spreadsheet management, PDF file renaming, and bulk email notifications in under 2 hours with UiPath StudioX.`,
    objectives: [
      'Introduce UiPath StudioX visual drag-and-drop designer',
      'Automate Excel data filtering and automated email dispatch with Gmail/Outlook',
      'Scrape job postings from LinkedIn and summarize into an Excel spreadsheet'
    ],
    agenda: [
      { time: '10:00 AM - 11:00 AM', title: 'Why RPA is the Fastest Growing Tech Skill in 2025' },
      { time: '11:00 AM - 01:00 PM', title: 'Hands-on: Build Your First Excel Auto-Processing Bot' },
      { time: '01:00 PM - 02:00 PM', title: 'Lunch & Student Bot Showcase' },
      { time: '02:00 PM - 03:30 PM', title: 'Web Scraping & Instant Career Opportunities in RPA' }
    ],
    uipathTopicsCovered: ['UiPath StudioX', 'Excel Automation', 'Mail Automation', 'Table Extraction', 'File Management Cards'],
    learningOutcomes: [
      'Mastering StudioX drag-and-drop business activities',
      'Automating personal academic schedules and assignment trackers'
    ],
    bannerImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop&q=80'
    ],
    slidesUrl: 'https://docs.google.com/presentation/d/e/2PACX-1vCitizenDev/pub',
    githubUrl: 'https://github.com/kanchana-Tejaswy/ACE-UiPath-Community/tree/main/workshops/studiox-kickstart-2025',
    workflowPackageUrl: 'https://github.com/kanchana-Tejaswy/ACE-UiPath-Community/releases/download/v1.0/StudioX_Starter_Kit.zip',
    status: 'Completed',
    isFeatured: false,
    speakers: [
      {
        id: 'spk_1',
        name: 'Kanchana Tejaswy',
        roleTitle: 'Community Lead',
        organization: 'ACE UiPath Community',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        bio: 'UiPath Student Community Lead.'
      }
    ],
    createdAt: '2025-02-01'
  },
  {
    id: 'act_2024_02',
    slug: 'uipath-associate-certification-drive-2024',
    title: 'UiPath Certified Associate Developer (UiRPA) Fast-Track Certification Drive',
    category: 'Certification',
    eventType: 'Hybrid',
    date: '2024-09-20',
    timeStart: '02:00 PM',
    timeEnd: '05:30 PM',
    venue: 'RPA Lab 2 & Virtual Proctoring',
    summary: 'Curated 3-week study cohort and mock examination marathon that resulted in 42 ACE students clearing the official UiPath Associate Developer Certification on their first attempt.',
    fullDescriptionMd: `### Milestone Achievement
In partnership with the **UiPath Academic Alliance**, ACE UiPath Community conducted an intensive certification enablement boot-camp. We covered Selectors, Control Flow, Excel/DataTable manipulation, Error Handling, and Orchestrator assets with 100+ realistic practice questions.`,
    objectives: [
      'Comprehensive preparation for UiPath Certified Associate Exam',
      'Master dynamic selectors with wildcards, regex, and fuzzy matching',
      'Solve live mock exam papers under timed conditions'
    ],
    agenda: [
      { time: '02:00 PM - 03:00 PM', title: 'Exam Blueprint, Scoring Breakdown, and Tricky Question Traps' },
      { time: '03:00 PM - 04:30 PM', title: 'Deep Dive: Modern vs Classic Selectors, DataTables & LINQ' },
      { time: '04:30 PM - 05:30 PM', title: 'Live Mock Test & Instant Explanations' }
    ],
    uipathTopicsCovered: ['UiPath Certified Associate', 'Modern Selectors', 'LINQ Queries', 'DataTable Manipulation', 'Orchestrator Assets'],
    learningOutcomes: [
      'Passing the official UiPath Certified Professional examination',
      'Writing performant LINQ expressions inside UiPath Assign activities'
    ],
    bannerImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80'
    ],
    slidesUrl: 'https://docs.google.com/presentation/d/e/2PACX-1vCertificationDrive/pub',
    githubUrl: 'https://github.com/kanchana-Tejaswy/ACE-UiPath-Community/tree/main/certification-prep/associate-2024',
    workflowPackageUrl: 'https://github.com/kanchana-Tejaswy/ACE-UiPath-Community/releases/download/v1.0/Certification_Mock_Exam_Kit.zip',
    status: 'Completed',
    isFeatured: false,
    speakers: [
      {
        id: 'spk_4',
        name: 'Siddharth Rao',
        roleTitle: 'Senior RPA Consultant',
        organization: 'UiPath MVP & Alumni Mentor',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        bio: 'UiPath MVP and former ACE RPA Community President.'
      }
    ],
    achievements: [
      {
        id: 'ach_3',
        title: 'UiPath Certified Associate',
        recipientName: '42 ACE Engineering Students',
        badgeType: 'UiPath Certified',
        description: 'Successfully cleared the industry-recognized UiPath Associate Developer examination.'
      }
    ],
    createdAt: '2024-09-01'
  }
];

export const INITIAL_LEARNING_PATHS: LearningPath[] = [
  {
    id: 'path_citizen_dev',
    slug: 'citizen-developer-studiox',
    title: 'Track 1: Citizen Developer & Quick Automation',
    tagline: 'Start automating your daily workflow without writing complex code.',
    level: 'Beginner',
    targetAudience: 'Any student (1st/2nd year, all engineering branches)',
    estimatedHours: 8,
    iconName: 'Zap',
    description: 'Master UiPath StudioX. Automate Microsoft Excel data cleaning, bulk PDF file renaming, web scraping, and automated email reporting using no-code visual workflow cards.',
    orderIndex: 1,
    isPublished: true,
    modules: [
      {
        id: 'mod_cx_01',
        slug: 'studiox-introduction-setup',
        title: 'Module 1: Installing UiPath StudioX & First Automation',
        summary: 'Download UiPath Community Edition, configure StudioX mode, and build a simple clipboard-to-Notepad bot.',
        durationMinutes: 45,
        level: 'Beginner',
        uipathTool: 'StudioX',
        contentMd: `# Welcome to UiPath StudioX

UiPath StudioX is designed for business users and citizen developers who want to eliminate tedious manual computer tasks.

### What You Will Build
You will create an automated workflow that:
1. Reads text from an Excel sheet
2. Opens a web browser
3. Fills an online form automatically
4. Saves confirmation data back to the sheet

### Prerequisites
- Install **UiPath Studio Community Edition** from [cloud.uipath.com](https://cloud.uipath.com)
- Switch profile to **StudioX** from *Home > Settings > License and Profile > Change Profile*.`,
        practiceExerciseMd: 'Create a bot that reads a list of 5 student names and generates a custom text message file for each.',
        starterCodeUrl: 'https://github.com/kanchana-Tejaswy/ACE-UiPath-Community/releases/download/v1.0/StudioX_Mod1_Starter.xaml',
        orderIndex: 1
      },
      {
        id: 'mod_cx_02',
        slug: 'excel-and-email-automation',
        title: 'Module 2: Advanced Excel Tables & Gmail Integration',
        summary: 'Filter data tables, compute grades/scores, and send personalized email attachments with dynamic templates.',
        durationMinutes: 60,
        level: 'Beginner',
        uipathTool: 'StudioX',
        contentMd: `# Automated Excel & Email Workflows

Spreadsheets and emails consume 60% of office productivity. With StudioX, you can connect Excel Cards with Gmail/Outlook cards seamlessly.

### Core Activities Used
- **Use Excel File**: Designates the working workbook.
- **For Each Row**: Iterates over data rows with header recognition.
- **Send Email**: Dispatches formatted HTML messages with attachments.`,
        starterCodeUrl: 'https://github.com/kanchana-Tejaswy/ACE-UiPath-Community/releases/download/v1.0/StudioX_Mod2_Excel_Email.xaml',
        orderIndex: 2
      }
    ]
  },
  {
    id: 'path_associate_dev',
    slug: 'uipath-associate-developer-studio',
    title: 'Track 2: UiPath Associate Developer (Studio & Modern Design)',
    tagline: 'Become an industry-ready RPA developer using UiPath Studio.',
    level: 'Intermediate',
    targetAudience: 'CSE / IT / ECE students with basic programming foundation',
    estimatedHours: 20,
    iconName: 'Code',
    description: 'Comprehensive curriculum covering Variables, Arguments, Flowcharts, Sequences, Modern Experience Selectors, Computer Vision, Data Manipulation with LINQ, and Orchestrator Asset configuration.',
    orderIndex: 2,
    isPublished: true,
    modules: [
      {
        id: 'mod_as_01',
        slug: 'modern-selectors-and-computer-vision',
        title: 'Module 1: Modern Experience Selectors & UI Descriptors',
        summary: 'Master fuzzy selectors, strict selectors, computer vision anchors, and resilient UI automation against web updates.',
        durationMinutes: 90,
        level: 'Intermediate',
        uipathTool: 'Studio',
        contentMd: `# Modern Design Experience in UiPath Studio

Selectors are the backbone of RPA. In the Modern Experience, UiPath combines **Strict Selectors**, **Fuzzy Selectors**, and **Image/Computer Vision anchors** into a unified targeting method.

### Structure of a Robust Selector
\`\`\`xml
<html app='chrome.exe' title='ACE Student Portal - Dashboard' />
<webctrl id='txt_rollNumber' tag='INPUT' type='text' />
<nav up='1' />
<webctrl tag='BUTTON' aaname='Search Records' />
\`\`\`

### Key Best Practices
1. Avoid dynamic numeric indices like \`idx='4'\`.
2. Use wildcards \`*\` and \`?\` for fluctuating session tokens.
3. Always pair text fields with nearest static visual labels (Anchors).`,
        starterCodeUrl: 'https://github.com/kanchana-Tejaswy/ACE-UiPath-Community/releases/download/v1.0/Modern_Selectors_Starter.xaml',
        orderIndex: 1
      },
      {
        id: 'mod_as_02',
        slug: 'orchestrator-queues-and-assets',
        title: 'Module 2: UiPath Orchestrator Queues & Asset Architecture',
        summary: 'Decouple automation into Dispatcher and Performer bots using Orchestrator cloud queues and encrypted credentials.',
        durationMinutes: 120,
        level: 'Intermediate',
        uipathTool: 'Orchestrator',
        contentMd: `# Orchestrator Queues & Assets

Never hardcode credentials or process large lists in a single single-threaded bot.

### The Dispatcher-Performer Pattern
1. **Dispatcher**: Reads source database/APIs and creates queue items in UiPath Orchestrator.
2. **Performer**: Fetches queue items one-by-one, processes transactions, and reports status.

\`\`\`csharp
// Fetching an Orchestrator Credential in Studio
UiPath.Core.Activities.GetRobotCredential
// Output: System.Security.SecureString password
\`\`\``,
        starterCodeUrl: 'https://github.com/kanchana-Tejaswy/ACE-UiPath-Community/releases/download/v1.0/Dispatcher_Performer_Starter.xaml',
        orderIndex: 2
      }
    ]
  },
  {
    id: 'path_enterprise_architect',
    slug: 'enterprise-automation-architect-reframework',
    title: 'Track 3: Enterprise Automation Architect (REFramework)',
    tagline: 'Build scalable, fault-tolerant robotic workflows ready for Fortune 500 deployments.',
    level: 'Advanced',
    targetAudience: '3rd / 4th year students aiming for top RPA enterprise developer roles',
    estimatedHours: 25,
    iconName: 'Cpu',
    description: 'Master State Machines, Robotic Enterprise Framework (REFramework), Config.xlsx management, BusinessRuleException hierarchies, auto-healing screenshots, and Orchestrator integration.',
    orderIndex: 3,
    isPublished: true,
    modules: [
      {
        id: 'mod_ea_01',
        slug: 'reframework-anatomy-and-state-machine',
        title: 'Module 1: REFramework Anatomy & State Machine Logic',
        summary: 'Deconstruct Init State, Get Transaction Data, Process Transaction, and End Process state transitions.',
        durationMinutes: 150,
        level: 'Advanced',
        uipathTool: 'Studio',
        contentMd: `# The Enterprise Framework Anatomy

The Robotic Enterprise Framework provides an out-of-the-box state machine template with built-in retry logic, exception handling, and credential management.

### The 4 Fundamental States
1. **Initialization**: Reads \`Data/Config.xlsx\`, kills existing applications, initializes settings.
2. **Get Transaction Data**: Polls Orchestrator Queue or local collection for next work item.
3. **Process Transaction**: Executes business logic inside a strict Try-Catch block.
4. **End Process**: Gracefully closes applications and logs execution summary.`,
        starterCodeUrl: 'https://github.com/kanchana-Tejaswy/ACE-UiPath-Community/releases/download/v1.0/REFramework_Enterprise_Template.zip',
        orderIndex: 1
      }
    ]
  },
  {
    id: 'path_ai_specialist',
    slug: 'intelligent-automation-ai-center-document-understanding',
    title: 'Track 4: Intelligent Automation & Document Understanding',
    tagline: 'Combine RPA with Machine Learning models and Generative AI.',
    level: 'Specialist',
    targetAudience: 'Students interested in AI, Machine Learning & Intelligent Document Processing',
    estimatedHours: 18,
    iconName: 'Sparkles',
    description: 'Integrate UiPath AI Center, pre-trained OCR extraction models, Action Center human-in-the-loop validation, and Generative AI activities for natural language automations.',
    orderIndex: 4,
    isPublished: true,
    modules: [
      {
        id: 'mod_ai_01',
        slug: 'document-understanding-taxonomy-and-extractors',
        title: 'Module 1: Building a Document Understanding Pipeline',
        summary: 'Configure Taxonomy Manager, Digitization, Document Classification, and ML Extractors for complex invoices.',
        durationMinutes: 120,
        level: 'Specialist',
        uipathTool: 'Document Understanding',
        contentMd: `# UiPath Document Understanding Architecture

Document Understanding enables robots to read, interpret, and validate structured, semi-structured, and unstructured business documents.

### The 5 Stage DU Pipeline
1. **Taxonomy**: Define document types and data fields.
2. **Digitize**: Convert PDF/Scans to text and DOM using OCR engines.
3. **Classify**: Identify which document type is being handled.
4. **Extract**: Run ML Extractor, Form Extractor, or RegEx Extractor.
5. **Validate**: Trigger UiPath Action Center for human approval if confidence score is < 85%.`,
        starterCodeUrl: 'https://github.com/kanchana-Tejaswy/ACE-UiPath-Community/releases/download/v1.0/Document_Understanding_Pipeline.zip',
        orderIndex: 1
      }
    ]
  }
];

export const INITIAL_PROJECTS: ProjectShowcase[] = [
  {
    id: 'proj_01',
    slug: 'automated-student-grade-processing-bot',
    title: 'Automated Semester Grade Extraction & Verification Bot',
    tagline: 'Eliminated 40+ hours of manual faculty work during semester result declarations.',
    summary: 'An enterprise REFramework bot that ingests raw university result PDF gazettes, parses individual student credits, calculates SGPA/CGPA discrepancies, and dispatches encrypted scorecards to student emails.',
    problemStatement: 'Every semester, department faculty spent 4-5 manual workdays downloading result gazettes, cross-verifying backlogs, and manually emailing students their updated grade summaries.',
    solutionDescription: 'Built an unattended UiPath bot deployed on Orchestrator. It reads the raw tabular PDF results using UiPath Document OCR, maps each roll number to college database records, generates customized PDF scorecards, and sends secure emails with 100% data privacy.',
    uipathToolsUsed: ['UiPath Studio', 'REFramework', 'Document OCR', 'Orchestrator Assets', 'Mail Activities'],
    roiMetrics: 'Saved 45 hours per exam cycle | 100% calculation accuracy across 850 students',
    repoUrl: 'https://github.com/kanchana-Tejaswy/ACE-UiPath-Community/tree/main/projects/grade-extractor',
    packageDownloadUrl: 'https://github.com/kanchana-Tejaswy/ACE-UiPath-Community/releases/download/v1.0/GradeExtractor_v1.0.nupkg',
    videoDemoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    previewImages: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80'
    ],
    authorName: 'Kanchana Tejaswy & Team AutoACE',
    authorRollNumber: '21ACE05A01',
    authorBranch: 'CSE',
    authorLinkedin: 'https://linkedin.com/in/kanchana-tejaswy',
    status: 'Featured',
    downloadCount: 184,
    upvotes: 49,
    createdAt: '2025-10-15'
  },
  {
    id: 'proj_02',
    slug: 'intelligent-invoice-document-understanding-bot',
    title: 'Intelligent Vendor Invoice Parser & Action Center Approval Bot',
    tagline: 'Multi-format invoice processing with human-in-the-loop exception validation.',
    summary: 'A Document Understanding automation that extracts vendor details, line items, tax breakdowns, and total amounts from multi-currency international vendor invoices with automated ERP entry.',
    problemStatement: 'Finance office dealt with 300+ monthly vendor bills with varying layouts, leading to delayed payment authorizations and manual data entry errors.',
    solutionDescription: 'Implemented a hybrid pipeline using UiPath Machine Learning Extractor coupled with Action Center. When OCR confidence falls below 90%, the bot pauses and creates an Action for the finance officer on their mobile device.',
    uipathToolsUsed: ['Document Understanding', 'AI Center', 'Action Center', 'Excel Automation', 'REST API'],
    roiMetrics: 'Reduced invoice processing time from 15 mins to 18 seconds | 94.2% straight-through processing rate',
    repoUrl: 'https://github.com/kanchana-Tejaswy/ACE-UiPath-Community/tree/main/projects/invoice-parser',
    packageDownloadUrl: 'https://github.com/kanchana-Tejaswy/ACE-UiPath-Community/releases/download/v1.0/InvoiceParser_DU.nupkg',
    previewImages: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80'
    ],
    authorName: 'Rohit Varma',
    authorRollNumber: '22ACE05B14',
    authorBranch: 'IT',
    authorLinkedin: 'https://linkedin.com',
    status: 'Featured',
    downloadCount: 142,
    upvotes: 38,
    createdAt: '2025-11-20'
  },
  {
    id: 'proj_03',
    slug: 'library-overdue-fine-automation-bot',
    title: 'Smart Campus Library Due Notification & Fine Calculator',
    tagline: 'Automates book due-date tracking and generates consolidated WhatsApp/Email alerts.',
    summary: 'A scheduled Studio bot that interfaces with the college Koha LMS database, identifies overdue books, calculates fines based on academic policy, and generates friendly reminder notifications.',
    problemStatement: 'Students often missed physical library notice boards, resulting in mounting overdue fines and unreturned course reference books.',
    solutionDescription: 'Reads LMS records nightly via SQL activity, computes due dates against holiday calendars, and triggers instant personalized email & WhatsApp web notifications.',
    uipathToolsUsed: ['UiPath Studio', 'Database Activities', 'UiPath Web Automation', 'SMTP Mail'],
    roiMetrics: 'Reduced overdue return lag by 72% across 2,400 active library members',
    repoUrl: 'https://github.com/kanchana-Tejaswy/ACE-UiPath-Community/tree/main/projects/library-bot',
    previewImages: [
      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop&q=80'
    ],
    authorName: 'Ananya Reddy & Sneha K.',
    authorRollNumber: '23ACE05C32',
    authorBranch: 'DS & AI',
    status: 'Approved',
    downloadCount: 89,
    upvotes: 27,
    createdAt: '2026-01-10'
  }
];

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'chal_2026_01',
    slug: 'ace-uipath-enterprise-hackathon-2026',
    title: 'ACE UiPath Enterprise Automation Hackathon 2026',
    theme: 'Intelligent Campus & Industry 4.0 Autonomous Bots',
    category: 'Hackathon',
    status: 'Active',
    startDate: '2026-09-01',
    endDate: '2026-10-15',
    prizePool: '₹25,000 + UiPath Official Vouchers & Fast-Track Core Team Placement',
    descriptionMd: `### Challenge Objective
Build a real-world enterprise bot solving a critical problem in Education, Healthcare, Supply Chain, or Finance using UiPath Studio, Orchestrator, and Document Understanding or AI Center.

### Submission Guidelines
1. Working UiPath project repository (GitHub or .zip package).
2. 3-minute video demonstration highlighting error handling and business value.
3. Architecture diagram and README documentation.`,
    rulesMd: `1. Teams can comprise 1 to 4 students from ACE Engineering College.
2. The core automation workflow must be implemented in **UiPath Studio** or **StudioX**.
3. All submissions must include exception handling (Try-Catch or REFramework).
4. Plagiarized workflows from standard tutorials will be disqualified.`,
    evaluationCriteria: [
      'Business Value & Practical ROI (30%)',
      'UiPath Architecture & REFramework Best Practices (30%)',
      'Robust Exception Handling & Auto-recovery (20%)',
      'Code Cleanliness, Annotations & Documentation (20%)'
    ],
    starterDatasetUrl: 'https://github.com/kanchana-Tejaswy/ACE-UiPath-Community/releases/download/v1.0/Hackathon_2026_Problem_Statements.pdf',
    submissionCount: 18
  },
  {
    id: 'chal_2025_02',
    slug: 'monthly-bot-sprint-resume-parser',
    title: 'Monthly Bot Sprint #4: Campus Placement Resume Matcher Bot',
    theme: 'HR Automation & Skill Extraction',
    category: 'Monthly Sprint',
    status: 'Completed',
    startDate: '2025-12-01',
    endDate: '2025-12-20',
    prizePool: 'UiPath Merch Swag + Certificate of Excellence',
    descriptionMd: 'Parse 100 student resumes in PDF/Word format and match candidate technical keywords against company job descriptions.',
    rulesMd: 'Must use UiPath Text/RegEx extraction or Document Understanding.',
    evaluationCriteria: ['Accuracy of skill matching', 'Execution speed', 'Reporting dashboard'],
    submissionCount: 29,
    winners: [
      {
        rank: 1,
        teamName: 'Team ByteBots',
        members: ['Nikhil Sharma', 'Pooja V.'],
        projectTitle: 'Automated Placement Skill Matcher & Shortlist Generator',
        prize: 'UiPath Swag Pack + ₹5,000'
      }
    ]
  }
];

export const INITIAL_RESOURCES: CommunityResource[] = [
  {
    id: 'res_01',
    title: 'REFramework Cheat Sheet & Best Practices Manual v2024.x',
    category: 'Cheat Sheet',
    description: 'Comprehensive 12-page PDF guide detailing state machine transitions, Config.xlsx best practices, and transaction status codes.',
    uipathVersion: 'UiPath 2024.10+',
    downloadUrl: 'https://github.com/kanchana-Tejaswy/ACE-UiPath-Community/releases/download/v1.0/REFramework_CheatSheet_v2024.pdf',
    fileType: 'PDF',
    tags: ['REFramework', 'Architecture', 'State Machine', 'Exception Handling'],
    downloadCount: 420
  },
  {
    id: 'res_02',
    title: 'Production-Ready REFramework with Queue Template (.XAML)',
    category: 'Workflow Template',
    description: 'Pre-configured REFramework template with custom logging, error screenshot capture, and auto-retry for web crashes.',
    uipathVersion: 'UiPath 2024.10+',
    downloadUrl: 'https://github.com/kanchana-Tejaswy/ACE-UiPath-Community/releases/download/v1.0/REFramework_Production_Starter.zip',
    fileType: 'XAML',
    tags: ['XAML', 'Template', 'Orchestrator', 'TryCatch'],
    downloadCount: 310
  },
  {
    id: 'res_03',
    title: 'UiPath Modern Selectors & Computer Vision Targeting Guide',
    category: 'Guide',
    description: 'Visual reference guide for debugging failing web selectors, anchor pairing, and wildcard expressions.',
    uipathVersion: 'UiPath 2023 / 2024',
    downloadUrl: 'https://github.com/kanchana-Tejaswy/ACE-UiPath-Community/releases/download/v1.0/UiPath_Selectors_Guide.pdf',
    fileType: 'PDF',
    tags: ['Selectors', 'Computer Vision', 'Anchors', 'Web Automation'],
    downloadCount: 285
  },
  {
    id: 'res_04',
    title: 'UiPath Associate Developer Exam Practice Question Bank',
    category: 'Official Certification',
    description: '150 realistic multiple choice questions with detailed rationale and code snippets for the UiRPA Associate exam.',
    uipathVersion: 'UiPath Professional Exam',
    downloadUrl: 'https://github.com/kanchana-Tejaswy/ACE-UiPath-Community/releases/download/v1.0/UiPath_Associate_Exam_QuestionBank.pdf',
    fileType: 'PDF',
    tags: ['Certification', 'Associate', 'Practice Exam', 'Questions'],
    downloadCount: 512
  }
];

export const INITIAL_LEADERSHIP: LeadershipMember[] = [
  {
    id: 'lead_faculty_1',
    name: 'Dr. S. K. Murthy',
    roleTitle: 'Faculty Advisor & Professor',
    category: 'Faculty Advisor',
    academicYear: '2022-2026',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    linkedinUrl: 'https://linkedin.com',
    bio: 'Championing industry-aligned automation curriculum at ACE Engineering College. Spearheaded the official UiPath Academic Alliance MoU.',
    contributions: ['Established the Dedicated RPA CoE Lab', 'Mentored 800+ students in emerging technologies'],
    orderIndex: 1
  },
  {
    id: 'lead_lead_1',
    name: 'Kanchana Tejaswy',
    roleTitle: 'Community President & Lead Architect',
    category: 'Current Core Lead',
    academicYear: '2024-2026',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    linkedinUrl: 'https://linkedin.com/in/kanchana-tejaswy',
    githubUrl: 'https://github.com/kanchana-Tejaswy',
    bio: 'UiPath Certified Developer. Architected the community digital operating system, organized 12+ hackathons and masterclasses.',
    contributions: ['Engineered Student Grade Processing Bot', 'Organized IDP Hackathon 2025', 'Built the ACE UiPath Digital OS'],
    orderIndex: 2
  },
  {
    id: 'lead_tech_1',
    name: 'Rohit Varma',
    roleTitle: 'Technical & Lab Lead',
    category: 'Technical Lead',
    academicYear: '2024-2026',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    linkedinUrl: 'https://linkedin.com',
    bio: 'Orchestrator and Document Understanding specialist. Mentors junior batches on REFramework state machine workflows.',
    contributions: ['Authored 4 Learning Modules', 'Mentored winning hackathon teams'],
    orderIndex: 3
  },
  {
    id: 'lead_alumni_1',
    name: 'Siddharth Rao',
    roleTitle: 'Founding Lead (Alumni)',
    category: 'Alumni',
    academicYear: '2022-2024',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    linkedinUrl: 'https://linkedin.com',
    bio: 'Currently Senior RPA Consultant at Cognizant. Founded the ACE UiPath student chapter in 2022.',
    contributions: ['Founded the chapter in 2022', 'Organized first 50-student boot-camp'],
    orderIndex: 4
  }
];
