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
  | 'Community Meetup';

export type ActivityEventType = 'Offline' | 'Online' | 'Hybrid';

export type ActivityStatus = 'Draft' | 'Upcoming' | 'Ongoing' | 'Completed' | 'Archived';

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
  | 'AI_NO_ANSWER';

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
  uipathToolsUsed: string[];
  roiMetrics: string; // e.g. "Saves 35 manual hours / month"
  repoUrl?: string;
  packageDownloadUrl?: string;
  videoDemoUrl?: string;
  previewImages: string[];
  authorName: string;
  authorRollNumber?: string;
  authorBranch?: string;
  authorAvatar?: string;
  authorLinkedin?: string;
  status: 'Pending' | 'Approved' | 'Featured';
  downloadCount: number;
  upvotes: number;
  createdAt: string;
}

export interface Challenge {
  id: string;
  slug: string;
  title: string;
  theme: string;
  category: 'Monthly Sprint' | 'Hackathon' | 'Ideathon' | 'Bug Bash';
  status: 'Upcoming' | 'Active' | 'Judging' | 'Completed';
  startDate: string;
  endDate: string;
  prizePool: string;
  descriptionMd: string;
  description?: string;
  difficulty?: string;
  uipathProduct?: string;
  rulesMd: string;
  evaluationCriteria: string[];
  starterDatasetUrl?: string;
  submissionCount: number;
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

export interface LeadershipMember {
  id: string;
  name: string;
  roleTitle: string;
  category: 'Faculty Advisor' | 'Current Core Lead' | 'Technical Lead' | 'Community Lead' | 'Alumni';
  academicYear: string; // e.g. "2025-2026", "2024-2025"
  avatarUrl: string;
  linkedinUrl?: string;
  githubUrl?: string;
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
  communityStoryHeading?: string;
  communityStoryText?: string;
  communityStoryHighlight?: string;
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
