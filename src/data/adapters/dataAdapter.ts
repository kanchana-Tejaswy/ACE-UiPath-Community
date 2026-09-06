import { 
  Activity, 
  LearningPath, 
  ProjectShowcase, 
  Challenge, 
  CommunityResource, 
  SiteSettings, 
  AuditLogEntry, 
  ActivityDraft, 
  DraftStatus,
  AnalyticsEvent,
  AnalyticsEventType
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
  getCompletedModules(): Promise<string[]>;
  toggleModuleCompletion(moduleId: string): Promise<string[]>;

  // Resources
  getResources(): Promise<CommunityResource[]>;
  saveResource(resource: CommunityResource): Promise<CommunityResource[]>;
  deleteResource(id: string): Promise<CommunityResource[]>;
  incrementResourceDownloads(id: string): Promise<CommunityResource[]>;

  // Activity Drafts
  getActivityDrafts(): Promise<ActivityDraft[]>;
  saveActivityDraft(draft: ActivityDraft): Promise<ActivityDraft[]>;
  deleteActivityDraft(id: string): Promise<ActivityDraft[]>;
  updateDraftStatus(id: string, status: DraftStatus, notes?: string): Promise<ActivityDraft[]>;

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
