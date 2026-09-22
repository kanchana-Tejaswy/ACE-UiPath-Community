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
  TimelineMilestone,
  Article
} from '../types';

export const INITIAL_STATISTICS: CommunityStatistic[] = [
  {
    id: 'stat_1',
    title: 'Students Trained',
    value: '950+',
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
  communityStoryHeading: 'Built by Students, Powered by UiPath',
  communityStoryText: 'Founded in 2022 under the department of CSE & IT, the ACE UiPath Community started as a group of 15 students eager to automate routine campus processes. Today, it stands as one of the premier student automation hubs in the region.',
  communityStoryHighlight: 'Recognized by UiPath Academic Alliance with 450+ students trained and 38 software bots deployed across college administration.',
  communityStoryImageUrl: '/ace-campus.jpg',
  communityEmail: 'uipath.community@aceec.ac.in',
  communityDiscordUrl: 'https://discord.gg/ace-uipath',
  communityWhatsappUrl: 'https://chat.whatsapp.com/ace-uipath',
  communityLinkedinUrl: 'https://linkedin.com/company/ace-uipath-community',
  communityGithubUrl: 'https://github.com/kanchana-Tejaswy/ACE-UiPath-Community',
  uipathAllianceId: 'ACE-UIPATH-EDU-ALLIANCE-9421',
  totalStudentsTrained: 950,
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
        description: 'Successfully cleared the industry-recognized UiPath Certified Associate Developer examination.'
      }
    ],
    createdAt: '2024-09-01'
  }
];

export const INITIAL_LEARNING_PATHS: LearningPath[] = [
  {
    id: 'path_associate_dev',
    slug: 'uipath-associate-developer',
    title: 'UiPath Associate Developer',
    tagline: 'Foundation to certification: master essential RPA workflows, UI automation, and Orchestrator integration.',
    level: 'Beginner',
    targetAudience: '1st, 2nd & 3rd year engineering students aiming for UiPath Certified Associate certification',
    estimatedHours: 16,
    iconName: 'GraduationCap',
    badgeText: 'Official Certification Track',
    officialAcademyUrl: 'https://academy.uipath.com/learning-plans/uipath-certified-professional-associate-track',
    description: 'The standard zero-to-hero curriculum designed to prepare students for the official UiPath Certified Professional Associate Developer (UiRPA) examination with hands-on workflows and community mentorship.',
    overviewMd: `### Course Curriculum Overview
The **UiPath Associate Developer** track covers the core foundational building blocks of enterprise robotic process automation (RPA).

Students learn how to design linear and modular workflows in UiPath Studio, utilize modern selectors with computer vision anchors, manipulate complex data types, and interact with UiPath Orchestrator cloud assets.

#### What You Will Learn
* **Core Fundamentals**: Understanding software robots, attended vs unattended automation, and Studio architecture.
* **Workflow Modeling**: Creating Sequences, Flowcharts, and Control Flow branching with If/Switch statements.
* **Targeting & Selectors**: Modern Design Experience with fuzzy selectors, strict selectors, and visual anchors.
* **Data Handling**: Manipulating Variables, Arguments, Strings, Collections, and Microsoft Excel DataTables.
* **Certification Ready**: Complete preparation aligned directly with the official UiPath Associate certification exam blueprint.`,
    orderIndex: 1,
    isPublished: true,
    modules: [
      {
        id: 'mod_assoc_01',
        slug: 'introduction-to-rpa',
        title: 'Introduction to RPA & UiPath Ecosystem',
        summary: 'Understand the robotic process automation paradigm, discover how software bots execute business tasks, and navigate the complete UiPath automation cloud ecosystem.',
        durationMinutes: 45,
        level: 'Beginner',
        uipathTool: 'Studio',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        videoDuration: '14 mins',
        blogUrl: '#blogs/what-are-activities-in-uipath',
        blogArticleId: 'art_1',
        blogTitle: 'What Are Activities in UiPath? The Foundation of Workflow Automation',
        officialResourceUrl: 'https://academy.uipath.com/courses/introduction-to-rpa-and-automation',
        topicsCovered: ['RPA Fundamentals', 'UiPath Studio', 'Attended vs Unattended', 'Community Cloud Setup'],
        orderIndex: 1,
        isPublished: true,
        contentMd: `# Introduction to RPA & The UiPath Ecosystem

Robotic Process Automation (RPA) is a software technology that enables anyone to configure computer software, or a **"robot"**, to emulate and integrate the actions of a human interacting within digital systems to execute a business process.

### What Makes UiPath the Global RPA Leader?
The UiPath platform consists of three core layers:
1. **Build (Studio Family)**: StudioX for no-code, Studio for low-code RPA developers, and Studio Web for browser-first automation.
2. **Manage (Orchestrator)**: Cloud-native control center to provision, schedule, monitor, and scale robot fleets.
3. **Run (Robots & Assistants)**: Attended robots that assist humans on their desktops, and unattended robots running in background server environments.

### Core Automation Concepts
* **Attended Automation**: Bots triggered by a human user to complete sub-tasks during daily work.
* **Unattended Automation**: Autonomous bots operating 24/7 on remote VMs or containers based on queue triggers and scheduled cron intervals.
* **Deterministic Execution**: Robots execute rules-based instructions with 100% precision and compliance.

### Community Quick Start
Students can download **UiPath Studio Community Edition** for free from [cloud.uipath.com](https://cloud.uipath.com). Pair it with our community exercises to start building your first project today!`,
        practiceExerciseMd: 'Create a simple sequence in Studio that opens your favorite browser, navigates to the ACE College portal, and writes the current page title to the Output panel using Log Message.'
      },
      {
        id: 'mod_assoc_02',
        slug: 'uipath-platform-overview',
        title: 'UiPath Platform Overview & Studio Setup',
        summary: 'Tour the UiPath Studio interface, understand project dependencies (.json / NuGet packages), configure your cloud workspace, and build your first hello-world bot.',
        durationMinutes: 60,
        level: 'Beginner',
        uipathTool: 'Studio',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        videoDuration: '18 mins',
        officialResourceUrl: 'https://academy.uipath.com/courses/build-your-first-automation-with-studio',
        topicsCovered: ['Studio Interface', 'Project.json', 'Package Manager', 'Output & Watch Panels'],
        orderIndex: 2,
        isPublished: true,
        contentMd: `# UiPath Studio Interface & Project Anatomy

UiPath Studio is an integrated development environment (IDE) built specifically for process design, workflow testing, and enterprise orchestration.

### Anatomy of a UiPath Studio Project
When you create a project in Studio, the following critical files are generated:
* \`project.json\`: Contains project metadata, target framework (.NET), and NuGet dependencies (e.g., \`UiPath.UIAutomation.Activities\`, \`UiPath.System.Activities\`).
* \`Main.xaml\`: The entry point workflow serialized as standard Extensible Application Markup Language (XAML).
* \`.entities/\` & \`.local/\`: Cached configurations and local project schema.

### Core Panels in Studio
* **Designer Panel**: The visual canvas where activities are composed into Sequences or Flowcharts.
* **Activities Panel (Ctrl+Shift+T)**: Search and drag activities into your canvas.
* **Properties Panel**: Configure input arguments, timeout thresholds, error handlers, and output variables.
* **Output & Immediate Panels**: View execution logs, breakpoint inspections, and live variable evaluations during debugging.`,
        practiceExerciseMd: 'Open Package Manager in Studio, install the "UiPath.Excel.Activities" package, and verify that Excel activities appear in your Activities panel.'
      },
      {
        id: 'mod_assoc_03',
        slug: 'variables-and-control-flow',
        title: 'Variables, Data Types & Control Flow',
        summary: 'Master declaring variables, scoping rules, converting between .NET types, and building robust decision trees with Sequences, Flowcharts, and Switch blocks.',
        durationMinutes: 75,
        level: 'Beginner',
        uipathTool: 'Studio',
        starterCodeUrl: 'https://github.com/kanchana-Tejaswy/ACE-UiPath-Community/releases/download/v1.0/Variables_ControlFlow_Starter.xaml',
        officialResourceUrl: 'https://academy.uipath.com/courses/variables-arguments-and-control-flow-in-studio',
        topicsCovered: ['Variables & Scopes', 'Data Types (.NET)', 'If / Else & Switch', 'Loops & For Each'],
        orderIndex: 3,
        isPublished: true,
        contentMd: `# Variables, Data Types & Control Flow

Variables store dynamic data during workflow execution. In UiPath Studio, variables are strongly typed using the .NET type system.

### Common Data Types
* \`String\`: Text values (\`"ACE UiPath Community"\`).
* \`Int32\`: Integer numerical values (\`42\`).
* \`Double\`: Floating point decimal numbers (\`98.6\`).
* \`Boolean\`: Truth values (\`True\` or \`False\`).
* \`DateTime\`: Date and timestamps (\`DateTime.Now\`).
* \`DataTable\`: In-memory 2D tabular dataset with columns and rows.
* \`GenericValue\`: Auto-coercing variable type (recommended to avoid in enterprise code).

### Variable Scoping Rules
Variables have a defined **Scope** corresponding to the container activity (e.g., specific Sequence vs entire workflow). Always scope variables as tightly as possible to prevent unintended side effects and memory retention.

### Control Flow Structures
1. **Sequence**: Linear step-by-step execution from top to bottom.
2. **Flowchart**: Branching and decision points with diamond decision nodes.
3. **If & Else If**: Binary or conditional branching.
4. **Switch**: Multi-branch condition based on an exact evaluation key.
5. **For Each & While**: Iterating collections, arrays, and lists.`,
        practiceExerciseMd: 'Build a workflow that takes a student score variable (0-100) and uses a Switch activity to output the grade (A, B, C, or D) with formatted message.'
      },
      {
        id: 'mod_assoc_04',
        slug: 'arguments-and-modularization',
        title: 'Arguments & Workflow Modularization',
        summary: 'Deconstruct monolithic workflows into clean, reusable child XAML components using In, Out, and In/Out direction arguments.',
        durationMinutes: 75,
        level: 'Intermediate',
        uipathTool: 'Studio',
        starterCodeUrl: 'https://github.com/kanchana-Tejaswy/ACE-UiPath-Community/releases/download/v1.0/Arguments_Invocation_Starter.xaml',
        officialResourceUrl: 'https://academy.uipath.com/courses/arguments-and-invoking-workflows-in-studio',
        topicsCovered: ['Arguments (In/Out)', 'Invoke Workflow File', 'Naming Conventions', 'Passing By Reference'],
        orderIndex: 4,
        isPublished: true,
        contentMd: `# Arguments & Workflow Modularization

Never write 500 lines of logic in a single \`Main.xaml\`. Enterprise RPA requires **modularization**—breaking a large business process into small, testable, and reusable workflow files.

### Difference Between Variables and Arguments
* **Variables**: Pass data *internally* between activities inside the **same** workflow file.
* **Arguments**: Pass data *externally* between **different** \`.xaml\` workflow files.

### Argument Directions & Naming Conventions
Always prefix your arguments to indicate direction clearly:
* \`in_VariableName\`: Input parameter passed from caller to child workflow.
* \`out_VariableName\`: Output parameter returned from child back to caller.
* \`io_VariableName\`: In/Out bidirectional parameter modified by child.

\`\`\`csharp
// Example: Invoking a workflow with bound arguments
// Input Argument: in_StudentRollNo = "21ACE05A01"
// Output Argument: out_AttendancePercentage -> varStudentAttendance
\`\`\`

### The "Invoke Workflow File" Activity
Use **Invoke Workflow File** to call your sub-components. Ensure **Isolated** mode is checked if you need the child workflow to run in a separate Windows process for crash resilience.`,
        practiceExerciseMd: 'Create a reusable child workflow named "CalculateTax.xaml" that accepts in_GrossSalary and out_NetTax, then invoke it from Main.xaml.'
      },
      {
        id: 'mod_assoc_05',
        slug: 'ui-automation-and-modern-selectors',
        title: 'UI Automation & Modern Selectors',
        summary: 'Master UI targeting with the Modern Design Experience, fuzzy selectors, strict XML paths, wildcards, and Computer Vision anchors.',
        durationMinutes: 90,
        level: 'Intermediate',
        uipathTool: 'Studio',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        videoDuration: '22 mins',
        blogUrl: '#blogs/what-are-activities-in-uipath',
        blogTitle: 'Modern Selectors vs Classic Selectors Guide',
        starterCodeUrl: 'https://github.com/kanchana-Tejaswy/ACE-UiPath-Community/releases/download/v1.0/Modern_Selectors_Starter.xaml',
        officialResourceUrl: 'https://academy.uipath.com/courses/ui-automation-with-studio-modern-design-experience',
        topicsCovered: ['Modern Experience', 'Fuzzy & Strict Selectors', 'Anchors & Computer Vision', 'Dynamic Wildcards'],
        orderIndex: 5,
        isPublished: true,
        contentMd: `# UI Automation & Modern Selectors

A selector is an XML fragment that uniquely identifies a graphical user interface (GUI) element on the screen (such as a textbox, submit button, or dropdown).

### Modern Design Experience Targeting
UiPath Modern UI Automation combines multiple targeting technologies into a unified fallback chain:
1. **Strict Selector**: Exact XML tree hierarchy and attributes (\`id\`, \`name\`, \`tag\`).
2. **Fuzzy Selector**: Levenshtein distance matching for slight text/CSS variations.
3. **Image / Anchor Matching**: Visual anchor positioning relative to static labels.
4. **Computer Vision (AI)**: Neural-network analysis of pixels when UI descriptors fail.

### Anatomy of an Enterprise Selector
\`\`\`xml
<html app='chrome.exe' title='ACE Student Portal - Dashboard' />
<webctrl id='txt_rollNumber' tag='INPUT' type='text' />
<nav up='1' />
<webctrl tag='BUTTON' aaname='Search Records' />
\`\`\`

### Dynamic Wildcards
* \`*\`: Matches zero or more characters (e.g., \`title='Invoice #* - ERP Portal'\`).
* \`?\`: Matches exactly one character.
* \`{{variableName}}\`: Dynamically passes variable values into selectors at runtime.`,
        practiceExerciseMd: 'Automate filling the UiPath RPA Challenge input fields (rpachallenge.com) where inputs change locations dynamically on each submit.'
      },
      {
        id: 'mod_assoc_06',
        slug: 'excel-and-datatables-automation',
        title: 'Excel & DataTables Automation',
        summary: 'Filter, sort, aggregate, and transform large datasets using Excel Workbook activities, in-memory DataTables, and LINQ queries.',
        durationMinutes: 75,
        level: 'Intermediate',
        uipathTool: 'Studio',
        starterCodeUrl: 'https://github.com/kanchana-Tejaswy/ACE-UiPath-Community/releases/download/v1.0/DataTable_Automation_Starter.xaml',
        officialResourceUrl: 'https://academy.uipath.com/courses/data-manipulation-in-studio',
        topicsCovered: ['Excel Activities', 'Read/Write Range', 'Filter DataTable', 'LINQ Expressions'],
        orderIndex: 6,
        isPublished: true,
        contentMd: `# Excel & DataTables Automation

Tabular data is the lifeblood of enterprise business operations. UiPath offers two ways to interact with Excel:
1. **Workbook Activities**: Headless, fast, does not require Microsoft Excel installed on the machine.
2. **Excel Application Scope / Modern Excel**: Interacts with Excel COM object directly, supporting macros, pivot tables, and chart formatting.

### Core DataTable Activities
* **Read Range**: Loads Excel or CSV data into a \`System.Data.DataTable\` variable.
* **Write Range / Append Range**: Writes in-memory tables back to disk.
* **Filter DataTable**: Keeps or removes rows matching specific conditions.
* **For Each Row in Data Table**: Iterates row-by-row with \`row("ColumnName").ToString\`.

### Power User: LINQ in UiPath
Instead of slow nested loops, use C# / VB.NET LINQ queries for high-speed in-memory filtering:
\`\`\`csharp
// Filter students with attendance > 75%
dtEligible = dtStudents.AsEnumerable()
    .Where(r => Convert.ToDouble(r["Attendance"]) >= 75.0)
    .CopyToDataTable();
\`\`\``,
        practiceExerciseMd: 'Write a workflow that reads an Excel sheet of 50 student marks, computes their average grade, and writes back "Passed" or "Failed" status in column D.'
      }
    ]
  },
  {
    id: 'path_professional_dev',
    slug: 'uipath-professional-developer',
    title: 'UiPath Professional Developer',
    tagline: 'Enterprise architecture: State Machines, REFramework, Orchestrator Queues, and resilient exception handling.',
    level: 'Advanced',
    targetAudience: '3rd & 4th year engineering students preparing for Senior RPA Developer & Solution Architect roles',
    estimatedHours: 24,
    iconName: 'Cpu',
    badgeText: 'Advanced Enterprise Track',
    officialAcademyUrl: 'https://academy.uipath.com/learning-plans/uipath-certified-professional-automation-developer-professional-track',
    description: 'Master the industry-standard Robotic Enterprise Framework (REFramework), transaction processing queues, Orchestrator APIs, and enterprise error-recovery patterns.',
    overviewMd: `### Advanced Architecture Curriculum
The **UiPath Professional Developer** track is aimed at senior engineering students who want to build production-grade, enterprise-scale bots.

You will master the State Machine paradigm, decouple workflows using the Dispatcher-Performer pattern with Orchestrator Queues, and implement automated crash recovery.

#### Key Focus Areas
* **Robotic Enterprise Framework (REFramework)**: Deep state machine lifecycle analysis.
* **Orchestrator Queues & Transactions**: Deadlock prevention, auto-retries, SLA prioritization.
* **Global Exception Handlers**: Auto-healing screenshot logging and fault management.
* **Config.xlsx Management**: Decoupling environment settings from workflow binaries.`,
    orderIndex: 2,
    isPublished: true,
    modules: [
      {
        id: 'mod_prof_01',
        slug: 'state-machine-architecture',
        title: 'Advanced State Machine Architecture',
        summary: 'Understand state machines, state transitions, entry/exit actions, and how to model complex non-linear business flows in Studio.',
        durationMinutes: 90,
        level: 'Advanced',
        uipathTool: 'Studio',
        officialResourceUrl: 'https://academy.uipath.com/courses/state-machines-in-studio',
        topicsCovered: ['State Machines', 'Transitions & Triggers', 'Entry/Exit Actions', 'Final State'],
        orderIndex: 1,
        isPublished: true,
        contentMd: `# Advanced State Machine Architecture

A **State Machine** is a behavioral model consisting of a finite number of states, transitions between those states, and actions. Unlike linear Sequences or Flowcharts, State Machines are ideal for long-running, event-driven transactional processes.

### Elements of a State Machine
* **State**: A condition during execution where the robot performs specific Entry actions and waits for transitions.
* **Transition**: A directed link that connects one state to another when a Trigger condition evaluates to true.
* **Final State**: A terminal state that represents process completion with no outgoing transitions.`,
        practiceExerciseMd: 'Build a 3-state state machine modeling an ATM cash withdrawal workflow (Card Inserted -> PIN Validated -> Dispense / Reject).'
      },
      {
        id: 'mod_prof_02',
        slug: 'reframework-deep-dive',
        title: 'Robotic Enterprise Framework (REFramework) Deep Dive',
        summary: 'Deconstruct the 4 core states of REFramework: Init, Get Transaction Data, Process Transaction, and End Process.',
        durationMinutes: 150,
        level: 'Advanced',
        uipathTool: 'Studio',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        videoDuration: '35 mins',
        blogUrl: '#blogs/mastering-reframework-guide',
        blogArticleId: 'art_2',
        blogTitle: "Mastering Robotic Enterprise Framework (REFramework): A Student's Guide",
        starterCodeUrl: 'https://github.com/kanchana-Tejaswy/ACE-UiPath-Community/releases/download/v1.0/REFramework_Enterprise_Template.zip',
        officialResourceUrl: 'https://academy.uipath.com/courses/robotic-enterprise-framework-deep-dive',
        topicsCovered: ['REFramework Lifecycle', 'Config.xlsx', 'BusinessRuleException', 'System Exception Retries'],
        orderIndex: 2,
        isPublished: true,
        contentMd: `# Robotic Enterprise Framework (REFramework) Deep Dive

REFramework is the gold standard for enterprise UiPath bot authoring. It comes pre-built with retry logic, exception handling, configuration management, and queue integration.

### The 4 States of REFramework
1. **Init State**: Reads \`Config.xlsx\`, kills legacy background processes, initializes applications.
2. **Get Transaction Data**: Fetches the next queue item from Orchestrator or local collection.
3. **Process Transaction**: Executes business logic inside a strict Try-Catch boundary.
4. **End Process**: Gracefully closes open applications and logs total transaction telemetry.

### Handling Exceptions in REFramework
* **BusinessRuleException (BRE)**: Data-level issue (e.g., negative salary). The transaction is marked **Failed (Business)** and the robot immediately advances to the next item with no retry.
* **System.Exception (SE)**: Infrastructure crash (e.g., website down). The robot closes applications, re-initializes, and retries the item up to \`MaxRetryNumber\`.`,
        practiceExerciseMd: 'Open the REFramework template, add a custom asset in Config.xlsx, and wire Process.xaml to process an invoice number.'
      },
      {
        id: 'mod_prof_03',
        slug: 'orchestrator-queues-and-slas',
        title: 'Orchestrator Queues, Transactions & SLAs',
        summary: 'Decouple automations using the Dispatcher-Performer pattern with Orchestrator cloud queues, encrypted credentials, and transaction SLAs.',
        durationMinutes: 120,
        level: 'Advanced',
        uipathTool: 'Orchestrator',
        starterCodeUrl: 'https://github.com/kanchana-Tejaswy/ACE-UiPath-Community/releases/download/v1.0/Dispatcher_Performer_Starter.xaml',
        officialResourceUrl: 'https://academy.uipath.com/courses/working-with-orchestrator-queues-in-studio',
        topicsCovered: ['Orchestrator Queues', 'Dispatcher-Performer', 'SpecificContent Dictionary', 'Queue SLA Alerts'],
        orderIndex: 3,
        isPublished: true,
        contentMd: `# Orchestrator Queues & Asset Architecture

Orchestrator Queues provide FIFO/Priority-based storage for transaction data items.

### The Dispatcher-Performer Pattern
* **Dispatcher Bot**: Ingests raw batch data from spreadsheets or databases, creates queue items in Orchestrator with metadata.
* **Performer Bot**: Fetches items one-by-one, executes business logic, and records final status (Successful / Failed).

\`\`\`csharp
// Accessing Queue Item SpecificContent in Studio
string customerId = in_TransactionItem.SpecificContent["CustomerID"].ToString();
double invoiceAmount = Convert.ToDouble(in_TransactionItem.SpecificContent["TotalAmount"]);
\`\`\``,
        practiceExerciseMd: 'Create a Dispatcher workflow that pushes 10 records to an Orchestrator queue with High/Normal priority.'
      },
      {
        id: 'mod_prof_04',
        slug: 'enterprise-error-handling',
        title: 'Enterprise Error Handling, Logging & Global Handlers',
        summary: 'Implement robust Try-Catch-Finally trees, automatic failure screenshots, and Global Exception Handlers for uninterrupted enterprise runs.',
        durationMinutes: 90,
        level: 'Advanced',
        uipathTool: 'Studio',
        officialResourceUrl: 'https://academy.uipath.com/courses/error-handling-in-studio',
        topicsCovered: ['Try-Catch-Finally', 'Global Exception Handler', 'Take Screenshot Activity', 'Custom Exception Types'],
        orderIndex: 4,
        isPublished: true,
        contentMd: `# Enterprise Error Handling & Logging

A production bot must never crash silently. It must capture diagnostics, take a screenshot of the display, log telemetry to Orchestrator, and exit or recover safely.

### The Global Exception Handler
Studio provides a specialized workflow named \`GlobalHandler.xaml\` that intercepts unhandled exceptions globally and decides whether to **Retry**, **Ignore**, **Abort**, or **Step Over** the failed activity.`,
        practiceExerciseMd: 'Add a Global Exception Handler to a workflow that saves a timestamped screenshot to a "Logs/Screenshots" folder upon any UI failure.'
      }
    ]
  },
  {
    id: 'path_agentic_assoc',
    slug: 'agentic-associate',
    title: 'UiPath Agentic Automation Associate',
    tagline: 'Next-gen automation: autonomous AI agents, UiPath Autopilot, GenAI activities, and semantic grounding.',
    level: 'Intermediate',
    targetAudience: 'Students interested in Generative AI, Large Language Models (LLMs) & Intelligent Agents',
    estimatedHours: 12,
    iconName: 'Sparkles',
    badgeText: 'Agentic AI Track',
    officialAcademyUrl: 'https://academy.uipath.com/courses/introduction-to-agentic-automation-and-uipath-autopilot',
    description: 'Learn how modern AI agents think, reason, and act across enterprise software using UiPath Autopilot and generative AI activities.',
    overviewMd: `### Agentic Automation Curriculum
Agentic automation moves beyond deterministic RPA scripts into autonomous reasoning systems where AI agents plan workflows dynamically.

#### What You Will Learn
* **Agentic Paradigms**: Differences between deterministic RPA scripts vs reasoning AI agents.
* **UiPath Autopilot**: Natural language code generation, test case synthesis, and intelligent assistants.
* **GenAI Activities**: Grounding prompts with company context, semantic search, and RAG architectures.`,
    orderIndex: 3,
    isPublished: true,
    modules: [
      {
        id: 'mod_agnt_01',
        slug: 'introduction-to-agentic-ai',
        title: 'Introduction to AI Agents & Agentic Automation',
        summary: 'Explore the shift from deterministic rule-based bots to reasoning AI agents with autonomous planning, tool calling, and human validation.',
        durationMinutes: 60,
        level: 'Intermediate',
        uipathTool: 'Autopilot & GenAI',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        videoDuration: '20 mins',
        officialResourceUrl: 'https://academy.uipath.com/courses/introduction-to-agentic-automation-and-uipath-autopilot',
        topicsCovered: ['Agentic Automation', 'ReAct Loops', 'LLM Tool Calling', 'Deterministic vs Autonomous'],
        orderIndex: 1,
        isPublished: true,
        contentMd: `# Introduction to AI Agents & Agentic Automation

Traditional RPA executes rigid, deterministic paths. **Agentic Automation** empowers software agents with Large Language Models (LLMs) to reason about unstructured inputs, decompose goals into sub-tasks, and invoke activities dynamically.

### The 4 Pillars of an AI Agent
1. **Perception**: Ingesting unstructured text, documents, emails, and UI DOM states.
2. **Reasoning & Planning**: Formulating a multi-step execution plan using LLMs.
3. **Action (Tool Use)**: Triggering UiPath activities and API connectors to change external systems.
4. **Reflection**: Evaluating whether execution achieved the intended outcome before proceeding.`,
        practiceExerciseMd: 'Design a high-level flowchart describing how an AI agent processes an ambiguous customer support email and routes it to billing or tech support.'
      },
      {
        id: 'mod_agnt_02',
        slug: 'uipath-autopilot-studio',
        title: 'UiPath Autopilot for Studio & Test Suite',
        summary: 'Leverage UiPath Autopilot to generate complex workflows from natural language prompts, auto-heal broken selectors, and generate synthetic test datasets.',
        durationMinutes: 75,
        level: 'Intermediate',
        uipathTool: 'Autopilot & GenAI',
        officialResourceUrl: 'https://academy.uipath.com/courses/uipath-autopilot-for-developers',
        topicsCovered: ['UiPath Autopilot', 'Natural Language to XAML', 'Auto-healing Selectors', 'Synthetic Test Generation'],
        orderIndex: 2,
        isPublished: true,
        contentMd: `# UiPath Autopilot for Developers

UiPath Autopilot brings Generative AI directly into Studio and Test Suite to accelerate developer velocity.

### Key Autopilot Capabilities
* **Prompt to Workflow**: Describe what you want in plain English; Autopilot generates the complete sequence with configured activities.
* **Auto-Generating Expressions**: Autopilot writes VB.NET / C# regular expressions and LINQ queries from example strings.
* **Intelligent Documentation**: Auto-generates summary docstrings and activity annotation notes.`,
        practiceExerciseMd: 'Use Autopilot in Studio to prompt: "Extract invoice date and total amount from this text and convert to EUR".'
      },
      {
        id: 'mod_agnt_03',
        slug: 'genai-activities-and-llm-connectors',
        title: 'GenAI Activities & Semantic RAG Workflows',
        summary: 'Integrate OpenAI, Azure OpenAI, and Google Gemini connectors into UiPath Studio workflows to summarize documents and perform semantic entity extraction.',
        durationMinutes: 90,
        level: 'Intermediate',
        uipathTool: 'Autopilot & GenAI',
        starterCodeUrl: 'https://github.com/kanchana-Tejaswy/ACE-UiPath-Community/releases/download/v1.0/GenAI_Connector_Starter.xaml',
        officialResourceUrl: 'https://academy.uipath.com/courses/generative-ai-activities-in-studio',
        topicsCovered: ['GenAI Connector', 'Prompt Engineering', 'JSON Schema Output', 'Grounding Data'],
        orderIndex: 3,
        isPublished: true,
        contentMd: `# GenAI Studio Activities & Connectors

UiPath provides first-class activities under \`UiPath.GenerativeAI.Activities\` to embed foundational LLMs directly into transactional workflows.

### Structured Output Extraction
Prompting an LLM to return valid JSON with strict schema validation ensures downstream RPA activities can parse the response reliably without regex parsing errors.`,
        practiceExerciseMd: 'Build a workflow that takes a raw customer complaint paragraph and outputs a JSON object with Sentiment, Category, and Urgency fields.'
      }
    ]
  },
  {
    id: 'path_agentic_prof',
    slug: 'agentic-professional',
    title: 'UiPath Agentic Automation Professional',
    tagline: 'Enterprise autonomous agents: multi-agent orchestration, custom AI Center models, and trust guardrails.',
    level: 'Specialist',
    targetAudience: 'Advanced students aiming to deploy autonomous AI systems with human-in-the-loop validation',
    estimatedHours: 20,
    iconName: 'Zap',
    badgeText: 'Autonomous Orchestration',
    officialAcademyUrl: 'https://academy.uipath.com/learning-plans/agentic-automation-specialist',
    description: 'Deploy multi-agent workflows with UiPath Action Center human governance, AI Center ML model fine-tuning, and enterprise security guardrails.',
    overviewMd: `### Specialist Curriculum
The **UiPath Agentic Professional** track focuses on enterprise governance, multi-agent systems, and production observability for autonomous AI systems.

#### Key Focus Areas
* **Multi-Agent Orchestration**: Coordinating specialized worker agents with human oversight.
* **AI Center Integration**: Training, deploying, and monitoring custom machine learning extractors.
* **Trust & Safety Guardrails**: Hallucination detection, PII redacting, and compliance audits.`,
    orderIndex: 4,
    isPublished: true,
    modules: [
      {
        id: 'mod_agntp_01',
        slug: 'multi-agent-orchestration',
        title: 'Multi-Agent Orchestration & Action Center Governance',
        summary: 'Coordinate multi-agent swarms with UiPath Action Center to keep human decision makers in the loop for high-risk autonomous choices.',
        durationMinutes: 120,
        level: 'Specialist',
        uipathTool: 'AI Center',
        officialResourceUrl: 'https://academy.uipath.com/courses/orchestrating-ai-agents-with-action-center',
        topicsCovered: ['Multi-Agent Swarms', 'Action Center Integration', 'Confidence Scoring', 'Human-in-the-Loop'],
        orderIndex: 1,
        isPublished: true,
        contentMd: `# Multi-Agent Orchestration & Governance

In complex enterprises, a single AI agent is insufficient. Systems employ specialized agent swarms:
1. **Classifier Agent**: Routes incoming tickets.
2. **Extraction Agent**: Parses structured data fields.
3. **Verification Agent**: Validates records against enterprise databases.
4. **Action Center Gate**: Prompts human operator if confidence falls below threshold.`,
        practiceExerciseMd: 'Design a workflow where an AI agent classifies an expense report and routes items over $1,000 to UiPath Action Center for manager signoff.'
      },
      {
        id: 'mod_agntp_02',
        slug: 'ai-center-custom-models',
        title: 'Custom AI Center ML Models & LLM Connectors',
        summary: 'Train and deploy custom Machine Learning models in UiPath AI Center and integrate them seamlessly into Studio pipelines.',
        durationMinutes: 120,
        level: 'Specialist',
        uipathTool: 'AI Center',
        officialResourceUrl: 'https://academy.uipath.com/courses/ai-center-for-developers',
        topicsCovered: ['AI Center Deployment', 'ML Skills', 'Continuous Learning Pipelines', 'Dataset Labeling'],
        orderIndex: 2,
        isPublished: true,
        contentMd: `# UiPath AI Center & Machine Learning Pipelines

UiPath AI Center bridges the gap between Data Science and RPA. It allows teams to host, manage, and retrain machine learning models that robots can invoke via **ML Skill** activities.`,
        practiceExerciseMd: 'Package a dataset of sample receipts, upload to AI Center, and deploy a Document Understanding ML Skill.'
      },
      {
        id: 'mod_agntp_03',
        slug: 'agentic-guardrails-and-observability',
        title: 'Autonomous Agent Guardrails & Observability',
        summary: 'Implement security guardrails, PII redaction, token budgets, and full audit telemetry for enterprise autonomous agents.',
        durationMinutes: 90,
        level: 'Specialist',
        uipathTool: 'AI Center',
        officialResourceUrl: 'https://academy.uipath.com/courses/ai-trust-and-governance',
        topicsCovered: ['Agent Guardrails', 'PII Redaction', 'Token Budgeting', 'Audit Telemetry'],
        orderIndex: 3,
        isPublished: true,
        contentMd: `# Agentic Guardrails, Safety & Observability

Deploying autonomous agents in production requires strict controls:
* **Hallucination Mitigation**: Grounding prompts strictly in retrieved context.
* **PII Redaction**: Stripping sensitive personal information before sending to external APIs.
* **Audit Trails**: Logging every LLM prompt, response, and tool invocation to immutable logs.`,
        practiceExerciseMd: 'Configure a pre-processing filter activity that masks credit card numbers and email addresses before invoking an LLM.'
      }
    ]
  },
  {
    id: 'path_citizen_dev',
    slug: 'citizen-developer-studiox',
    title: 'UiPath Citizen Developer (StudioX)',
    tagline: 'Zero-code personal productivity: automate Excel, Gmail, desktop apps, and web scraping with visual cards.',
    level: 'Beginner',
    targetAudience: 'Any student (1st & 2nd year across all engineering branches: CSE, IT, ECE, EEE, Mech, Civil)',
    estimatedHours: 8,
    iconName: 'Zap',
    badgeText: 'No-Code Foundation',
    officialAcademyUrl: 'https://academy.uipath.com/learning-plans/citizen-developer-foundation',
    description: 'Master UiPath StudioX. Automate Microsoft Excel data cleaning, bulk PDF file renaming, web scraping, and automated email reporting using no-code visual workflow cards.',
    overviewMd: `### Citizen Developer Curriculum
UiPath StudioX allows engineering students from all branches to automate repetitive manual computer tasks without writing complex software code.

#### Key Skills Acquired
* **Excel Card Automation**: Filtering tables, auto-formatting, formula injection.
* **Gmail / Outlook Automation**: Sending personalized bulk emails with dynamic templates.
* **Web Scraping**: Extracting data tables from websites with zero programming.`,
    orderIndex: 5,
    isPublished: true,
    modules: [
      {
        id: 'mod_cx_01',
        slug: 'studiox-introduction-setup',
        title: 'Installing UiPath StudioX & First Automation',
        summary: 'Download UiPath Community Edition, configure StudioX mode, and build a simple clipboard-to-Notepad bot.',
        durationMinutes: 45,
        level: 'Beginner',
        uipathTool: 'StudioX',
        officialResourceUrl: 'https://academy.uipath.com/courses/build-your-first-automation-with-studiox',
        starterCodeUrl: 'https://github.com/kanchana-Tejaswy/ACE-UiPath-Community/releases/download/v1.0/StudioX_Mod1_Starter.xaml',
        topicsCovered: ['StudioX Profile', 'Card Activities', 'Clipboard Automation', 'Project Run'],
        orderIndex: 1,
        isPublished: true,
        contentMd: `# Welcome to UiPath StudioX

UiPath StudioX is designed for business users and citizen developers who want to eliminate tedious manual computer tasks.

### What You Will Build
You will create an automated workflow that:
1. Reads text from an Excel sheet
2. Opens a web browser
3. Fills an online form automatically
4. Saves confirmation data back to the sheet

### Prerequisites
* Install **UiPath Studio Community Edition** from [cloud.uipath.com](https://cloud.uipath.com)
* Switch profile to **StudioX** from *Home > Settings > License and Profile > Change Profile*.`,
        practiceExerciseMd: 'Create a bot that reads a list of 5 student names and generates a custom text message file for each.'
      },
      {
        id: 'mod_cx_02',
        slug: 'excel-and-email-automation',
        title: 'Advanced Excel Tables & Gmail Integration',
        summary: 'Filter data tables, compute grades/scores, and send personalized email attachments with dynamic templates.',
        durationMinutes: 60,
        level: 'Beginner',
        uipathTool: 'StudioX',
        starterCodeUrl: 'https://github.com/kanchana-Tejaswy/ACE-UiPath-Community/releases/download/v1.0/StudioX_Mod2_Excel_Email.xaml',
        officialResourceUrl: 'https://academy.uipath.com/courses/excel-and-mail-automation-with-studiox',
        topicsCovered: ['Excel Cards', 'For Each Row', 'Send Email Card', 'Dynamic Templates'],
        orderIndex: 2,
        isPublished: true,
        contentMd: `# Automated Excel & Email Workflows

Spreadsheets and emails consume 60% of office productivity. With StudioX, you can connect Excel Cards with Gmail/Outlook cards seamlessly.

### Core Activities Used
* **Use Excel File**: Designates the working workbook.
* **For Each Row in Excel**: Iterates over data rows with header recognition.
* **Send Email**: Dispatches formatted HTML messages with attachments.`,
        practiceExerciseMd: 'Build a StudioX bot that sends an email notification to all students in an Excel list who scored above 80%.'
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
    startTime: '09:00',
    endTime: '18:00',
    registrationDeadline: '2026-09-25',
    registrationDeadlineTime: '23:59',
    registrationUrl: 'https://unstop.com/hackathons/ace-uipath-2026',
    communityChannelUrl: 'https://discord.gg/ace-uipath-community',
    bannerImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1920&auto=format&fit=crop&q=80',
    isFeatured: true,
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
    submissionCount: 18,
    recordings: [
      {
        id: 'rec_01',
        title: 'Hackathon Kickoff & Problem Statement Breakdown',
        type: 'Kickoff Recording',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '45 mins',
        speakerName: 'UiPath Community Leads'
      },
      {
        id: 'rec_02',
        title: 'Starter Bot Setup Tutorial & REFramework Scaffolding',
        type: 'Bot Tutorial Walkthrough',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '32 mins',
        speakerName: 'Student Technical Mentor'
      }
    ],
    useCases: [
      {
        id: 'uc_01',
        title: 'Invoice & PO Reconciliation with Document Understanding',
        problemBrief: 'Automate PDF invoice extraction with UiPath Document Understanding ML models, cross-validate item line totals against SAP/Excel tables, and generate exception logs for discrepancies.',
        evaluationRubric: 'Accuracy > 95%, Exception Handling for corrupted PDFs, Execution speed < 45s per invoice.',
        starterTemplateUrl: 'https://github.com/kanchana-Tejaswy/ACE-UiPath-Community/releases/download/v1.0/Invoice_DU_Starter_Template.zip',
        starterTemplateType: 'ZIP',
        difficulty: 'Intermediate'
      },
      {
        id: 'uc_02',
        title: 'Autonomous Exam Invigilation & Hall Ticket Verification Bot',
        problemBrief: 'Extract student roll numbers from attendance sheets, check fee clearance on campus portal via web automation, and send instant WhatsApp/Email alerts with hall ticket barcodes.',
        evaluationRubric: 'Zero false approvals, queue management via Orchestrator, clean audit trail logging.',
        starterTemplateUrl: 'https://github.com/kanchana-Tejaswy/ACE-UiPath-Community/releases/download/v1.0/Attendance_Bot_Scaffold.xaml',
        starterTemplateType: 'XAML',
        difficulty: 'Beginner'
      }
    ],
    referenceMaterials: [
      {
        id: 'ref_01',
        title: 'UiPath Action Center Official Integration Guide',
        type: 'PDF Guide',
        url: 'https://docs.uipath.com/action-center',
        description: 'Comprehensive human-in-the-loop task validation workflow architecture.'
      },
      {
        id: 'ref_02',
        title: 'Synthetic Invoice & PO Sample Dataset (500 Records)',
        type: 'Sample Dataset (CSV/XLSX)',
        url: 'https://github.com/kanchana-Tejaswy/ACE-UiPath-Community/releases/download/v1.0/Sample_Invoices_Dataset.xlsx',
        description: '500 anonymized multi-vendor invoice PDFs and companion Excel lookup tables.'
      },
      {
        id: 'ref_03',
        title: 'REFramework State Machine Quick Reference Cheat Sheet',
        type: 'Cheat Sheet',
        url: 'https://github.com/kanchana-Tejaswy/ACE-UiPath-Community/releases/download/v1.0/REFramework_CheatSheet_v2024.pdf',
        description: 'Essential transitions, transaction states, and retry logic guidelines.'
      }
    ]
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
    startTime: '10:00',
    endTime: '17:00',
    bannerImage: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1920&auto=format&fit=crop&q=80',
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
    rosterCategories: ['Faculty Advisor'],
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
    category: 'Core Team Member',
    rosterCategories: ['Student Developer Champion', 'Core Team Member', 'Trainer / Technical Lead'],
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
    category: 'Trainer / Technical Lead',
    rosterCategories: ['Trainer / Technical Lead', 'Core Team Member'],
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
    category: 'Alumni Mentor',
    rosterCategories: ['Alumni Mentor'],
    academicYear: '2022-2024',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    linkedinUrl: 'https://linkedin.com',
    bio: 'Currently Senior RPA Consultant at Cognizant. Founded the ACE UiPath student chapter in 2022.',
    contributions: ['Founded the chapter in 2022', 'Organized first 50-student boot-camp'],
    orderIndex: 4
  }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art_1',
    slug: 'what-are-activities-in-uipath',
    title: 'What Are Activities in UiPath? The Foundation of Workflow Automation',
    excerpt: 'A deep dive into UiPath activities, how they form the fundamental building blocks of workflow automation, and how to select the right activities for enterprise projects.',
    category: 'Tutorial',
    authorName: 'Tejaswy',
    authorRole: 'UiPath Student Developer Champion',
    status: 'PUBLISHED',
    publishedAt: '2026-09-14T08:00:00.000Z',
    isFeatured: true,
    views: 142,
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    coverImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    aspectRatio: 'default',
    coverBanner: {
      url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
      aspectRatio: 'default'
    },
    createdAt: '2026-09-14T07:30:00.000Z',
    updatedAt: '2026-09-14T08:00:00.000Z',
    createdBy: 'Tejaswy',
    content: `# What Are Activities in UiPath?

In robotic process automation (RPA), **Activities** are the essential building blocks that perform individual discrete actions within a software workflow. From clicking a UI button to querying a SQL database, reading an Excel cell, or classifying an invoice with AI, everything in UiPath executes through an activity.

---

## The Core Concept

Imagine writing code in Python or C#. You define methods like \`click()\`, \`read_csv()\`, or \`send_email()\`. In UiPath Studio, these methods are packaged as visual, reusable drag-and-drop components known as **Activities**.

Each activity possesses:
- **Inputs**: Data passed into the activity (e.g., file path, selector, timeout).
- **Outputs**: Results produced by the action (e.g., extracted text, HTTP response code).
- **Properties**: Configuration parameters such as *ContinueOnError*, *DelayBefore*, and *TimeoutMS*.

> [!TIP]
> Always rename your activity titles in UiPath Studio to reflect business intent rather than keeping defaults like \`Click 'Button'\` or \`Assign\`. For instance, use \`Click 'Submit ERP Invoice'\`.

---

## Activity Categories in Modern UiPath Studio

UiPath groups activities into logical packages and categories:

| Category | Typical Activities | Primary Use Case |
| :--- | :--- | :--- |
| **UI Automation** | Use Application/Browser, Click, Type Into, Get Text | Interacting with legacy desktop and web applications |
| **Data & Files** | Read Range, Write Cell, Read PDF, Read CSV | Spreadsheet and structured document extraction |
| **Control Flow** | If, Switch, For Each, While, Retry Scope | Conditional branching and loops in sequence |
| **Integrations** | HTTP Request, Send Outlook Mail, Query Database | Headless API and database connectivity |
| **System & Orchestrator** | Get Transaction Item, Set Asset, Log Message | Enterprise coordination and telemetry |

---

## Example: Working with UI Activities in Workflow XAML

Under the hood, every UiPath workflow is serialized into standard Windows Workflow Foundation (\`XAML\`). Here is what a simple Click and Type sequence looks like:

\`\`\`xml
<Sequence DisplayName="Process Employee Record" sap:VirtualizedContainerService.HintSize="450,320">
  <!-- Launch and Attach to Web ERP -->
  <uix:NApplicationCard AttachMode="ByInstance" DisplayName="Use ERP Portal" ScopeGuid="a1b2c3d4">
    <uix:NApplicationCard.Body>
      <ActivityAction x:TypeArguments="x:Object">
        <Sequence DisplayName="Execute Data Entry">
          <uix:NTypeInto DisplayName="Type Employee ID" Text="[in_EmployeeId]" />
          <uix:NClick DisplayName="Click Query Button" ClickType="Single" MouseButton="BTN_LEFT" />
        </Sequence>
      </ActivityAction>
    </uix:NApplicationCard.Body>
  </uix:NApplicationCard>
</Sequence>
\`\`\`

---

## 3 Best Practices When Choosing Activities

### 1. Modern Experience Over Classic
Always prefer modern activities under \`UiPath.UIAutomation.Activities\` with unified target resolution (Fuzzy selector + Strict selector + Image anchor). They drastically reduce workflow flakiness caused by subtle web CSS updates.

### 2. Guard Critical Calls with Retry Scope
Network requests and web navigation can intermittently time out. Enclose them in a **Retry Scope** with an explicit condition (like element existence check) rather than arbitrary hardcoded sleep delays:

\`\`\`csharp
// Retry Scope evaluation logic
int maxRetries = 3;
TimeSpan retryInterval = TimeSpan.FromSeconds(5);
// Executes action and asserts Element Exists condition
\`\`\`

### 3. Log Meaningful Messages
Use the \`Log Message\` activity with severity levels:
- **Trace/Debug**: Detailed variable values for developer inspection.
- **Info**: Milestone progress (e.g., *"Processing invoice #8921"*).
- **Warn/Error**: Handled recovery paths and business exceptions.

---

## Summary

Activities are what make UiPath intuitive yet deeply powerful. By mastering how to search the Activities panel, configure properties cleanly, and adhere to community naming conventions, you set a solid foundation for your UiPath Associate Certification journey.`
  },
  {
    id: 'art_2',
    slug: 'mastering-reframework-guide',
    title: "Mastering Robotic Enterprise Framework (REFramework): A Student's Guide",
    excerpt: 'How to use the standard State Machine architecture in UiPath Studio to build fault-tolerant, transaction-based automation bots with retry logic.',
    category: 'Associate Developer',
    authorName: 'Rohit Varma',
    authorRole: 'Technical & Lab Lead',
    status: 'PUBLISHED',
    publishedAt: '2026-09-10T10:30:00.000Z',
    isFeatured: false,
    views: 98,
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
    coverImageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
    aspectRatio: 'default',
    coverBanner: {
      url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
      aspectRatio: 'default'
    },
    createdAt: '2026-09-10T09:00:00.000Z',
    updatedAt: '2026-09-10T10:30:00.000Z',
    createdBy: 'Rohit Varma',
    content: `# Mastering REFramework (Robotic Enterprise Framework)

Every student preparing for enterprise automation roles or the **UiPath Certified Associate** exam must thoroughly understand the **Robotic Enterprise Framework (REFramework)**.

REFramework is a standardized template built on a State Machine architecture. It provides built-in logging, exception handling, retry mechanisms, and transaction queue management right out of the box.

---

## The Four Core States of REFramework

1. **Init (Initialization)**:
   - Reads \`Config.xlsx\` (Settings, Constants, Assets).
   - Initializes applications and closes legacy sessions.
   - Throws a system error if critical systems are unreachable.

2. **Get Transaction Data**:
   - Queries an Orchestrator Queue or local datatable for the next item.
   - Sets \`TransactionItem\` for downstream processing.
   - Stops the process gracefully when queue is empty or stop signal received.

3. **Process Transaction**:
   - Executes the core business automation.
   - Handles two distinct exception classifications:
     - **Business Rule Exception**: Invalid input data (no retry).
     - **System Exception**: Network failure, application freeze (triggers retry).

4. **End Process**:
   - Safely logs out and closes all open applications.
   - Sends notification telemetry.

---

## State Transition Diagram

\`\`\`
  [Init] ── Success ──> [Get Transaction] <── Next Item ── [Process Transaction]
    │                         │                                  │
    │ Fatal Error             │ No More Items                    │ System Exception
    ▼                         ▼                                  ▼
[End Process] <────────────────────────────────────────── [Init State (Retry)]
\`\`\`

---

## Pro Tip for ACE Students

When customizing REFramework for college projects or hackathons, isolate your business logic inside a clean subfolder:
\`\`\`
📁 Framework/
   ├── InitAllSettings.xaml
   ├── InitAllApplications.xaml
   ├── CloseAllApplications.xaml
   └── SetTransactionStatus.xaml
📁 Workflows/
   ├── ERP_NavigateToInvoices.xaml
   ├── ERP_ExtractInvoiceData.xaml
   └── ERP_SubmitApproval.xaml
\`\`\`

This modularity keeps your project clean, testable, and ready for code review!`
  },
  {
    id: 'art_3',
    slug: 'automating-college-attendance-reporting',
    title: 'How We Automated College Attendance Reporting at ACE',
    excerpt: 'A case study on developing an unattended RPA bot that extracts biometric logs, generates departmental shortage reports, and saves 40+ faculty hours weekly.',
    category: 'Student Project Story',
    authorName: 'Tejaswy',
    authorRole: 'UiPath Student Developer Champion',
    status: 'PUBLISHED',
    publishedAt: '2026-09-02T14:15:00.000Z',
    isFeatured: false,
    views: 215,
    coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&auto=format&fit=crop&q=80',
    coverImageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&auto=format&fit=crop&q=80',
    aspectRatio: 'default',
    coverBanner: {
      url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&auto=format&fit=crop&q=80',
      aspectRatio: 'default'
    },
    createdAt: '2026-09-02T12:00:00.000Z',
    updatedAt: '2026-09-02T14:15:00.000Z',
    createdBy: 'Tejaswy',
    content: `# How We Automated College Attendance Reporting at ACE

Every Friday at ACE Engineering College, academic coordinators used to spend 3 to 4 hours per department reconciling biometric check-ins with class attendance logs.

Here is how the ACE UiPath Community built and deployed an unattended software bot that fully eliminated this manual burden.

---

## The Problem Statement

- **Data Sources**: Biometric turnstile SQL database + College ERP portal.
- **Pain Points**: Manual Excel merges, human calculation errors in calculating percentage thresholds (e.g., <75% attendance warning letters).
- **Time Spent**: Over 40 cumulative faculty hours every single week.

---

## The Technical Solution Architecture

1. **Scheduled Trigger**:
   - UiPath Orchestrator triggers the bot unattended every Friday at 5:00 PM.
2. **Data Extraction**:
   - Executes parameterized stored procedures against the biometric server.
   - Downloads weekly lecture attendance sheets via Modern Web Automation.
3. **Data Processing via LINQ**:
   - Merges datasets in memory using optimized C# LINQ queries instead of slow spreadsheet loops.
4. **Report Distribution**:
   - Generates formatted Excel pivot sheets with color-coded alerts.
   - Automatically drafts and sends emails to Head of Department (HoD) with PDF attachments.

---

## Measurable Community ROI

- **Time Saved**: 42 hours / week across 6 academic departments.
- **Accuracy**: 100% calculation consistency.
- **Deployment Status**: Production active on college server.`
  },
  {
    id: 'art_4',
    slug: 'modern-vs-classic-experience-uipath',
    title: 'Modern Design vs Classic Experience in UiPath Studio',
    excerpt: 'Understanding Unified Target Technology, App/Web Recorder, and why every new automation project at ACE should default to the Modern Experience.',
    category: 'UiPath Tips & Tricks',
    authorName: 'Siddharth Rao',
    authorRole: 'Founding Lead & RPA Consultant',
    status: 'PUBLISHED',
    publishedAt: '2026-08-25T09:00:00.000Z',
    isFeatured: false,
    views: 76,
    coverImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&auto=format&fit=crop&q=80',
    coverImageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&auto=format&fit=crop&q=80',
    aspectRatio: 'default',
    coverBanner: {
      url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&auto=format&fit=crop&q=80',
      aspectRatio: 'default'
    },
    createdAt: '2026-08-25T08:00:00.000Z',
    updatedAt: '2026-08-25T09:00:00.000Z',
    createdBy: 'Siddharth Rao',
    content: `# Modern vs Classic Design Experience in UiPath Studio

When starting a new UiPath automation project, one of the first configuration choices you encounter in Project Settings is whether to enable the **Modern Design Experience**.

Here is why all community students should build modern:

---

## Key Differences

| Feature | Classic Experience | Modern Experience |
| :--- | :--- | :--- |
| **Targeting Method** | Single Selector (Strict) | Unified (Strict + Fuzzy + Image + Computer Vision fallback) |
| **Application Scopes** | \`Attach Browser\` / \`Open Browser\` | \`Use Application/Browser\` with unified scope |
| **Object Repository** | Limited | Fully integrated UI element library across projects |
| **Recording Tool** | Basic Web/Desktop recorder | Unified App/Web Recorder |

---

## Why Modern Experience Wins in Hackathons

During hackathons, applications under test often update dynamically. With Classic selectors, a single attribute change breaks the bot. Modern Unified Targeting automatically falls back to fuzzy matching and anchor imagery, keeping your automation resilient during live demonstrations!`
  }
];
