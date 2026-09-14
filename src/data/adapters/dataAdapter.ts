import { 
  Activity, 
  LearningPath, 
  ProjectShowcase, 
  Challenge, 
  CommunityResource, 
  LeadershipMember,
  SiteSettings, 
  AuditLogEntry, 
  ActivityDraft, 
  DraftStatus,
  AnalyticsEvent,
  AnalyticsEventType,
  Article
} from '../../types';

export interface DataAdapter {
  isCloudConnected(): boolean;
  
  // Activities
  getActivities(): Promise<Activity[]>;
  saveActivity(activity: Activity): Promise<Activity[]>;
  deleteActivity(id: string): Promise<Activity[]>;

  // Projects
  getProjects(): Promise<ProjectShowcase[]>;
  saveProject(project: ProjectShowcase): Promise<ProjectShowcase[]>;
  deleteProject(id: string): Promise<ProjectShowcase[]>;
  upvoteProject(id: string): Promise<ProjectShowcase[]>;

  // Learning
  getLearningPaths(): Promise<LearningPath[]>;
  saveLearningPath(path: LearningPath): Promise<LearningPath[]>;
  deleteLearningPath(id: string): Promise<LearningPath[]>;
  getCompletedModules(): Promise<string[]>;
  toggleModuleCompletion(moduleId: string): Promise<string[]>;

  // Challenges
  getChallenges(): Promise<Challenge[]>;
  saveChallenge(challenge: Challenge): Promise<Challenge[]>;
  deleteChallenge(id: string): Promise<Challenge[]>;

  // Resources
  getResources(): Promise<CommunityResource[]>;
  saveResource(resource: CommunityResource): Promise<CommunityResource[]>;
  deleteResource(id: string): Promise<CommunityResource[]>;
  incrementResourceDownloads(id: string): Promise<CommunityResource[]>;

  // Leadership
  getLeadership(): Promise<LeadershipMember[]>;
  saveLeadership(member: LeadershipMember): Promise<LeadershipMember[]>;
  deleteLeadership(id: string): Promise<LeadershipMember[]>;

  // Activity Drafts
  getActivityDrafts(): Promise<ActivityDraft[]>;
  saveActivityDraft(draft: ActivityDraft): Promise<ActivityDraft[]>;
  deleteActivityDraft(id: string): Promise<ActivityDraft[]>;
  updateDraftStatus(id: string, status: DraftStatus, notes?: string): Promise<ActivityDraft[]>;

  // Articles & Technical Write-ups
  getArticles(): Promise<Article[]>;
  saveArticle(article: Article): Promise<Article[]>;
  deleteArticle(id: string): Promise<Article[]>;
  incrementArticleViews(id: string): Promise<Article[]>;

  // Settings & System
  getSettings(): Promise<SiteSettings>;
  updateSettings(newSettings: Partial<SiteSettings>): Promise<SiteSettings>;
  getAuditLogs(): Promise<AuditLogEntry[]>;
  addAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<AuditLogEntry[]>;

  // Product Analytics & Telemetry
  getAnalyticsEvents(): Promise<AnalyticsEvent[]>;
  recordAnalyticsEvent(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): Promise<AnalyticsEvent[]>;
  getEventsByType(type: AnalyticsEventType): Promise<AnalyticsEvent[]>;
}
