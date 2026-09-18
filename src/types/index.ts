export type UserRole = 'STUDENT' | 'CORE_TEAM' | 'ADMIN' | 'Student' | 'CoreTeam' | 'Admin';

export type UserStatus = 'ACTIVE' | 'INACTIVE';

export interface User {
  id: string;
  email: string;
  name: string;
  rollNumber?: string;
  branch?: string;
  graduationYear?: number;
  role: UserRole;
  status?: UserStatus;
  avatarUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  uipathForumUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type ActivityCategory = 
  | 'Workshop' 
  | 'Hackathon' 
  | 'Certification' 
  | 'Guest Lecture' 
  | 'Ideathon' 
  | 'Bootcamp'
  | 'Community Meetup'
  | 'Masterclass';

export type ActivityEventType = 'Offline' | 'Online' | 'Hybrid';

export type ActivityStatus = 'Draft' | 'Upcoming' | 'Ongoing' | 'In Progress' | 'Completed' | 'Archived';

export type DraftStatus = 'DRAFT' | 'SUBMITTED' | 'IN_REVIEW' | 'CHANGES_REQUESTED' | 'APPROVED' | 'PUBLISHED';

export interface ActivityDraft extends Omit<Activity, 'status'> {
  status: DraftStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  completionPercentage: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  entityType: string;
  entityId: string;
  description: string;
  performedBy: string;
}

export type AnalyticsEventType = 
  | 'PAGE_VIEW'
  | 'ACTIVITY_VIEWED'
  | 'LEARNING_MODULE_OPENED'
  | 'LESSON_COMPLETED'
  | 'PROJECT_VIEWED'
  | 'PROJECT_UPVOTED'
  | 'CHALLENGE_VIEWED'
  | 'CHALLENGE_SUBMITTED'
  | 'RESOURCE_VIEWED'
  | 'RESOURCE_DOWNLOADED'
  | 'DRAFT_CREATED'
  | 'DRAFT_SUBMITTED'
  | 'DRAFT_REVIEWED'
  | 'DRAFT_PUBLISHED'
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILURE'
  | 'LOGOUT'
  | 'ROLE_CHANGED'
  | 'ACCOUNT_DEACTIVATED'
  | 'SEARCH_PERFORMED'
  | 'SEARCH_RESULT_OPENED'
  | 'SEARCH_NO_RESULTS'
  | 'AI_ASSISTANT_OPENED'
  | 'AI_QUESTION_ASKED'
  | 'AI_SOURCE_OPENED'
  | 'AI_NO_ANSWER'
  | 'ARTICLE_VIEWED';

export interface AnalyticsEvent {
  id: string;
  eventType: AnalyticsEventType;
  userId?: string;
  anonymousSessionId?: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface ActivitySpeaker {
  id: string;
  name: string;
  roleTitle: string;
  organization: string;
  avatarUrl: string;
  linkedinUrl?: string;
  bio: string;
}

export interface ActivityAgendaItem {
  time: string;
  title: string;
  description?: string;
  speaker?: string;
}

export interface ActivityAchievement {
  id: string;
  title: string;
  recipientName: string;
  rollNumber?: string;
  badgeType: 'First Place' | 'Runner Up' | 'UiPath Certified' | 'Top Automator' | 'Best Innovation' | 'Winner';
  description: string;
}

export interface Activity {
  id: string;
  slug: string;
  title: string;
  category: ActivityCategory;
  eventType: ActivityEventType;
  date: string; // YYYY-MM-DD
  timeStart: string; // e.g. "10:00 AM"
  timeEnd: string; // e.g. "04:30 PM"
  venue: string;
  summary: string;
  fullDescriptionMd: string;
  objectives: string[];
  agenda: ActivityAgendaItem[];
  uipathTopicsCovered: string[]; // e.g. ["UiPath Studio", "REFramework", "Orchestrator Queues"]
  learningOutcomes: string[];
  bannerImage: string;
  galleryImages: string[];
  recordingUrl?: string;
  slidesUrl?: string;
  githubUrl?: string;
  workflowPackageUrl?: string; // .xaml or .nupkg or .zip
  status: ActivityStatus;
  isFeatured: boolean;
  speakers: ActivitySpeaker[];
  achievements?: ActivityAchievement[];
  registrationUrl?: string;
  meetingUrl?: string;
  capacity?: string;
  targetAudience?: string;
  createdAt?: string;
}

export interface LearningModule {
  id: string;
  slug: string;
  title: string;
  summary: string;
  durationMinutes: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Architect' | 'Specialist';
  uipathTool: 'StudioX' | 'Studio' | 'Orchestrator' | 'AI Center' | 'Document Understanding' | 'Test Suite' | 'C# / Python Extensions';
  contentMd: string;
  videoUrl?: string;
  practiceExerciseMd?: string;
  starterCodeUrl?: string; // .xaml link
  solutionCodeUrl?: string; // .xaml link
  orderIndex: number;
  topicsCovered?: string[];
}

export interface LearningPath {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Specialist';
  targetAudience: string;
  estimatedHours: number;
  iconName: string;
  description: string;
  orderIndex: number;
  isPublished: boolean;
  modules: LearningModule[];
}

export interface ProjectShowcase {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  problemStatement: string;
  solutionDescription: string;
  workflowArchitecture?: 'REFramework (Robotic Enterprise Framework)' | 'Linear Sequential Workflow' | 'State Machine' | 'Dispatcher / Performer Model' | 'Attended Assistant' | string;
  automationType?: string | string[];
  uipathToolsUsed: string[];
  roiMetrics: string; // e.g. "Saves 35 manual hours / month"
  repoUrl?: string;
  packageDownloadUrl?: string;
  liveDemoUrl?: string;
  videoDemoUrl?: string;
  thumbnailUrl?: string;
  previewImages: string[];
  authorName: string;
  authorRollNumber?: string;
  authorBranch?: string;
  authorAvatar?: string;
  authorLinkedin?: string;
  authorPortfolioUrl?: string;
  contributors?: string[];
  status: 'Pending' | 'Approved' | 'Featured';
  downloadCount: number;
  upvotes: number;
  createdAt: string;
}

export interface ChallengeVideoRecording {
  id: string;
  title: string;
  type: 'Kickoff Recording' | 'Bot Tutorial Walkthrough' | 'AMA / Q&A Session' | 'Closing & Demos';
  url: string;
  duration?: string;
  speakerName?: string;
}

export interface ChallengeUseCaseTrack {
  id: string;
  title: string;
  problemBrief: string;
  evaluationRubric: string;
  starterTemplateUrl?: string;
  starterTemplateType?: 'XAML' | 'ZIP' | 'GitHub' | 'Docs';
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface ChallengeReferenceMaterial {
  id: string;
  title: string;
  type: 'PDF Guide' | 'API Docs' | 'Cheat Sheet' | 'Sample Dataset (CSV/XLSX)';
  url: string;
  description?: string;
}

export interface Challenge {
  id: string;
  slug: string;
  title: string;
  theme: string;
  category: 'Monthly Sprint' | 'Hackathon' | 'Ideathon' | 'Bug Bash';
  status: 'Upcoming' | 'Active' | 'Judging' | 'Completed' | 'Draft' | 'Archived';
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  registrationDeadline?: string;
  registrationDeadlineTime?: string;
  registrationUrl?: string;
  communityChannelUrl?: string;
  bannerImage?: string;
  isFeatured?: boolean;
  prizePool: string;
  descriptionMd: string;
  description?: string;
  difficulty?: string;
  uipathProduct?: string;
  rulesMd: string;
  evaluationCriteria: string[];
  starterDatasetUrl?: string;
  submissionCount: number;
  recordings?: ChallengeVideoRecording[];
  useCases?: ChallengeUseCaseTrack[];
  referenceMaterials?: ChallengeReferenceMaterial[];
  winners?: {
    rank: number;
    teamName: string;
    members: string[];
    projectTitle: string;
    prize: string;
  }[];
}

export interface CommunityResource {
  id: string;
  title: string;
  category: 'Cheat Sheet' | 'Workflow Template' | 'Custom Activity' | 'Guide' | 'Official Certification' | 'Template' | 'Cheatsheet' | 'Exam Questions';
  description: string;
  uipathVersion: string;
  downloadUrl: string;
  fileType: 'XAML' | 'PDF' | 'NUPKG' | 'DOCS';
  tags: string[];
  downloadCount: number;
  createdAt?: string;
}

export interface CommunityStatistic {
  id: string;
  title: string;
  value: string;
  description: string;
  visible: boolean;
  order: number;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  date: string;
  link?: string;
  isActive: boolean;
}

export interface TimelineMilestone {
  id: string;
  year: string;
  title: string;
  category: string;
  description: string;
  imageUrl?: string;
  date?: string;
  order: number;
}

export type RosterCategory =
  | 'Student Developer Champion'
  | 'Core Team Member'
  | 'Trainer / Technical Lead'
  | 'Domain Lead'
  | 'Faculty Advisor'
  | 'Alumni Mentor'
  | 'Honorary Member'
  | 'Current Core Lead'
  | 'Technical Lead'
  | 'Community Lead'
  | 'Alumni';

export interface LeadershipMember {
  id: string;
  name: string;
  roleTitle: string;
  category: RosterCategory;
  rosterCategories?: RosterCategory[];
  academicYear: string; // e.g. "2024 - Present" or "2022-2026"
  avatarUrl: string;
  startYear?: string | number;
  endYear?: string | number;
  isActive?: boolean;
  department?: string; // Department / Batch / Roll No. (e.g. "CSE - 2024 Batch")
  linkedinUrl?: string;
  githubUrl?: string;
  uipathProfileUrl?: string;
  bio: string;
  contributions: string[];
  orderIndex: number;
}

export interface SiteSettings {
  heroHeading?: string;
  heroTagline: string;
  heroSubheadline: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  announcementTicker: string;
  isAnnouncementActive: boolean;
  featuredActivityId?: string;
  featuredProjectIds?: string[];
  featuredArticleId?: string;
  communityStoryHeading?: string;
  communityStoryText?: string;
  communityStoryHighlight?: string;
  communityStoryImageUrl?: string;
  communityEmail: string;
  communityDiscordUrl: string;
  communityWhatsappUrl: string;
  communityLinkedinUrl: string;
  communityGithubUrl: string;
  uipathAllianceId: string;
  totalStudentsTrained: number;
  totalBotsBuilt: number;
  totalCertifications: number;
  totalHoursSaved: number;
  statistics?: CommunityStatistic[];
  announcements?: Announcement[];
  timelineMilestones?: TimelineMilestone[];
}

export type ArticleCategory =
  | 'Associate Developer'
  | 'Tutorial'
  | 'Student Project Story'
  | 'UiPath Tips & Tricks'
  | 'Industry News'
  | 'RPA'
  | 'AI & Automation'
  | 'Community'
  | 'Advanced Developer'
  | 'Specialized AI'
  | 'Architecture'
  | 'Community Spotlight';

export const ARTICLE_CATEGORIES: ArticleCategory[] = [
  'Associate Developer',
  'Tutorial',
  'Student Project Story',
  'UiPath Tips & Tricks',
  'Industry News',
  'RPA',
  'AI & Automation',
  'Community',
  'Advanced Developer',
  'Specialized AI',
  'Architecture',
  'Community Spotlight'
];

export type ArticleStatus = 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';

export type BannerAspectRatio = 'default' | '21/9' | '16/9' | 'auto';

export interface CoverBannerConfig {
  url?: string;
  aspectRatio: BannerAspectRatio;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown technical content
  coverImage?: string;
  coverImageUrl?: string;
  coverBanner?: CoverBannerConfig;
  aspectRatio?: BannerAspectRatio;
  category: ArticleCategory;
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  authorId?: string;
  tags?: string[];
  status: ArticleStatus;
  scheduledAt?: string; // ISO string
  publishedAt?: string; // ISO string
  isFeatured: boolean;
  views: number;
  viewsCount?: number;
  readTimeMinutes?: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}
