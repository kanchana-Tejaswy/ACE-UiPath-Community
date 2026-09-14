import { DataAdapter } from './dataAdapter';
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
import { localDatabase } from '../local/localDatabase';
import { activitiesRepository } from '../repositories/activitiesRepository';
import { projectsRepository } from '../repositories/projectsRepository';
import { learningRepository } from '../repositories/learningRepository';
import { resourcesRepository } from '../repositories/resourcesRepository';
import { settingsRepository } from '../repositories/settingsRepository';
import { activityDraftsRepository } from '../repositories/activityDraftsRepository';
import { analyticsRepository } from '../repositories/analyticsRepository';
import { articlesRepository } from '../repositories/articlesRepository';

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

  saveLearningPath: async (path: LearningPath): Promise<LearningPath[]> => {
    return learningRepository.save(path);
  },

  deleteLearningPath: async (id: string): Promise<LearningPath[]> => {
    const paths = localDatabase.getLearningPaths();
    const updated = paths.filter((p) => p.id !== id);
    localDatabase.saveLearningPaths(updated);
    return updated;
  },

  getCompletedModules: async (): Promise<string[]> => {
    return localDatabase.getCompletedModules();
  },

  toggleModuleCompletion: async (moduleId: string): Promise<string[]> => {
    return localDatabase.toggleModuleCompletion(moduleId);
  },

  getChallenges: async (): Promise<Challenge[]> => {
    return localDatabase.getChallenges();
  },

  saveChallenge: async (challenge: Challenge): Promise<Challenge[]> => {
    const challenges = localDatabase.getChallenges();
    const idx = challenges.findIndex((c) => c.id === challenge.id);
    let updated: Challenge[];
    if (idx >= 0) {
      updated = [...challenges];
      updated[idx] = challenge;
    } else {
      updated = [challenge, ...challenges];
    }
    localDatabase.saveChallenges(updated);
    return updated;
  },

  deleteChallenge: async (id: string): Promise<Challenge[]> => {
    const challenges = localDatabase.getChallenges();
    const updated = challenges.filter((c) => c.id !== id);
    localDatabase.saveChallenges(updated);
    return updated;
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

  getLeadership: async (): Promise<LeadershipMember[]> => {
    return localDatabase.getLeadership();
  },

  saveLeadership: async (member: LeadershipMember): Promise<LeadershipMember[]> => {
    const list = localDatabase.getLeadership();
    const idx = list.findIndex((m) => m.id === member.id);
    let updated: LeadershipMember[];
    if (idx >= 0) {
      updated = [...list];
      updated[idx] = member;
    } else {
      updated = [...list, member];
    }
    localDatabase.saveLeadership(updated);
    return updated;
  },

  deleteLeadership: async (id: string): Promise<LeadershipMember[]> => {
    const list = localDatabase.getLeadership();
    const updated = list.filter((m) => m.id !== id);
    localDatabase.saveLeadership(updated);
    return updated;
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

  // Articles
  getArticles: async (): Promise<Article[]> => {
    return articlesRepository.getAll();
  },

  saveArticle: async (article: Article): Promise<Article[]> => {
    return articlesRepository.save(article);
  },

  deleteArticle: async (id: string): Promise<Article[]> => {
    return articlesRepository.delete(id);
  },

  incrementArticleViews: async (id: string): Promise<Article[]> => {
    return articlesRepository.incrementViews(id);
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
