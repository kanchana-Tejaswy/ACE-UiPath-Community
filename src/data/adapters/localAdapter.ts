import { DataAdapter } from './dataAdapter';
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
import { localDatabase } from '../local/localDatabase';
import { activitiesRepository } from '../repositories/activitiesRepository';
import { projectsRepository } from '../repositories/projectsRepository';
import { learningRepository } from '../repositories/learningRepository';
import { resourcesRepository } from '../repositories/resourcesRepository';
import { settingsRepository } from '../repositories/settingsRepository';
import { activityDraftsRepository } from '../repositories/activityDraftsRepository';
import { analyticsRepository } from '../repositories/analyticsRepository';

export const localAdapter: DataAdapter = {
  isCloudConnected: () => false,

  getActivities: async (): Promise<Activity[]> => {
    return activitiesRepository.getAll();
  },

  saveActivity: async (activity: Activity): Promise<Activity[]> => {
    return activitiesRepository.save(activity);
  },

  deleteActivity: async (id: string): Promise<Activity[]> => {
    return activitiesRepository.delete(id);
  },

  getProjects: async (): Promise<ProjectShowcase[]> => {
    return projectsRepository.getAll();
  },

  saveProject: async (project: ProjectShowcase): Promise<ProjectShowcase[]> => {
    return projectsRepository.save(project);
  },

  deleteProject: async (id: string): Promise<ProjectShowcase[]> => {
    return projectsRepository.delete(id);
  },

  upvoteProject: async (id: string): Promise<ProjectShowcase[]> => {
    return projectsRepository.upvote(id);
  },

  getLearningPaths: async (): Promise<LearningPath[]> => {
    return learningRepository.getAll();
  },

  getCompletedModules: async (): Promise<string[]> => {
    return localDatabase.getCompletedModules();
  },

  toggleModuleCompletion: async (moduleId: string): Promise<string[]> => {
    return localDatabase.toggleModuleCompletion(moduleId);
  },

  getResources: async (): Promise<CommunityResource[]> => {
    return resourcesRepository.getAll();
  },

  saveResource: async (resource: CommunityResource): Promise<CommunityResource[]> => {
    return resourcesRepository.save(resource);
  },

  deleteResource: async (id: string): Promise<CommunityResource[]> => {
    return resourcesRepository.delete(id);
  },

  incrementResourceDownloads: async (id: string): Promise<CommunityResource[]> => {
    return resourcesRepository.incrementDownloads(id);
  },

  getActivityDrafts: async (): Promise<ActivityDraft[]> => {
    return activityDraftsRepository.getAll();
  },

  saveActivityDraft: async (draft: ActivityDraft): Promise<ActivityDraft[]> => {
    return activityDraftsRepository.save(draft);
  },

  deleteActivityDraft: async (id: string): Promise<ActivityDraft[]> => {
    return activityDraftsRepository.delete(id);
  },

  updateDraftStatus: async (id: string, status: DraftStatus, notes?: string): Promise<ActivityDraft[]> => {
    return activityDraftsRepository.updateStatus(id, status, notes);
  },

  getSettings: async (): Promise<SiteSettings> => {
    return settingsRepository.get();
  },

  updateSettings: async (newSettings: Partial<SiteSettings>): Promise<SiteSettings> => {
    return settingsRepository.update(newSettings);
  },

  getAuditLogs: async (): Promise<AuditLogEntry[]> => {
    return localDatabase.getAuditLogs();
  },

  addAuditLog: async (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<AuditLogEntry[]> => {
    return localDatabase.addAuditLog(entry);
  },

  getAnalyticsEvents: async (): Promise<AnalyticsEvent[]> => {
    return analyticsRepository.getEvents();
  },

  recordAnalyticsEvent: async (event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): Promise<AnalyticsEvent[]> => {
    return analyticsRepository.recordEvent(event);
  },

  getEventsByType: async (type: AnalyticsEventType): Promise<AnalyticsEvent[]> => {
    return analyticsRepository.getEventsByType(type);
  }
};
