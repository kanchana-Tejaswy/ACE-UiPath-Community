import { DataAdapter } from './dataAdapter';
import { localAdapter } from './localAdapter';
import { localDatabase } from '../local/localDatabase';
import { isSupabaseConfigured } from '../../lib/supabase/client';
import { 
  fetchActivitiesFromSupabase, 
  saveActivityToSupabase,
  deleteActivityFromSupabase,
  fetchProjectsFromSupabase, 
  saveProjectToSupabase,
  deleteProjectFromSupabase,
  upvoteProjectInSupabase,
  fetchResourcesFromSupabase,
  saveResourceToSupabase,
  deleteResourceFromSupabase,
  incrementResourceDownloadsInSupabase,
  fetchLearningPathsFromSupabase,
  saveLearningPathToSupabase,
  deleteLearningPathFromSupabase,
  fetchChallengesFromSupabase,
  saveChallengeToSupabase,
  deleteChallengeFromSupabase,
  fetchLeadershipFromSupabase,
  saveLeadershipToSupabase,
  deleteLeadershipFromSupabase,
  fetchActivityDraftsFromSupabase,
  saveActivityDraftToSupabase,
  deleteActivityDraftFromSupabase,
  updateDraftStatusInSupabase,
  fetchArticlesFromSupabase,
  saveArticleToSupabase,
  deleteArticleFromSupabase,
  incrementArticleViewsInSupabase,
  fetchSettingsFromSupabase,
  saveSettingsToSupabase,
  fetchAuditLogsFromSupabase,
  saveAuditLogToSupabase,
  fetchAnalyticsEventsFromSupabase,
  recordAnalyticsEventToSupabase
} from '../../lib/supabase/services';
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

export const supabaseAdapter: DataAdapter = {
  isCloudConnected: () => isSupabaseConfigured(),

  // ==================================================================
  // ACTIVITIES
  // ==================================================================
  getActivities: async (): Promise<Activity[]> => {
    if (!isSupabaseConfigured()) return localAdapter.getActivities();
    try {
      const remote = await fetchActivitiesFromSupabase();
      if (remote && remote.length > 0) {
        localDatabase.saveActivities(remote);
        return remote;
      }
    } catch (e) {
      console.warn('Supabase getActivities fallback to local:', e);
    }
    return localAdapter.getActivities();
  },

  saveActivity: async (activity: Activity): Promise<Activity[]> => {
    if (isSupabaseConfigured()) {
      const res = await saveActivityToSupabase(activity);
      if (!res.success) {
        throw new Error(res.error || 'Failed to save activity to Supabase database.');
      }
    }
    return localAdapter.saveActivity(activity);
  },

  deleteActivity: async (id: string): Promise<Activity[]> => {
    if (isSupabaseConfigured()) {
      const res = await deleteActivityFromSupabase(id);
      if (!res.success) {
        throw new Error(res.error || 'Failed to delete activity from Supabase database.');
      }
    }
    return localAdapter.deleteActivity(id);
  },

  // ==================================================================
  // PROJECTS
  // ==================================================================
  getProjects: async (): Promise<ProjectShowcase[]> => {
    if (!isSupabaseConfigured()) return localAdapter.getProjects();
    try {
      const remote = await fetchProjectsFromSupabase();
      if (remote && remote.length > 0) {
        localDatabase.saveProjects(remote);
        return remote;
      }
    } catch (e) {
      console.warn('Supabase getProjects fallback to local:', e);
    }
    return localAdapter.getProjects();
  },

  saveProject: async (project: ProjectShowcase): Promise<ProjectShowcase[]> => {
    if (isSupabaseConfigured()) {
      const res = await saveProjectToSupabase(project);
      if (!res.success) {
        throw new Error(res.error || 'Failed to save project to Supabase database.');
      }
    }
    return localAdapter.saveProject(project);
  },

  deleteProject: async (id: string): Promise<ProjectShowcase[]> => {
    if (isSupabaseConfigured()) {
      const res = await deleteProjectFromSupabase(id);
      if (!res.success) {
        throw new Error(res.error || 'Failed to delete project from Supabase database.');
      }
    }
    return localAdapter.deleteProject(id);
  },

  upvoteProject: async (id: string): Promise<ProjectShowcase[]> => {
    const local = await localAdapter.upvoteProject(id);
    if (!isSupabaseConfigured()) return local;
    try {
      const proj = local.find((p) => p.id === id);
      if (proj) {
        const res = await upvoteProjectInSupabase(id, proj.upvotes);
        if (!res.success) {
          console.warn('Supabase project upvote warning:', res.error);
        }
      }
    } catch (e) {
      console.warn('Supabase project upvote fallback to local:', e);
    }
    return local;
  },

  // ==================================================================
  // LEARNING PATHS
  // ==================================================================
  getLearningPaths: async (): Promise<LearningPath[]> => {
    if (!isSupabaseConfigured()) return localAdapter.getLearningPaths();
    try {
      const remote = await fetchLearningPathsFromSupabase();
      if (remote && remote.length > 0) {
        localDatabase.saveLearningPaths(remote);
        return remote;
      }
    } catch (e) {
      console.warn('Supabase getLearningPaths fallback to local:', e);
    }
    return localAdapter.getLearningPaths();
  },

  saveLearningPath: async (path: LearningPath): Promise<LearningPath[]> => {
    if (isSupabaseConfigured()) {
      const res = await saveLearningPathToSupabase(path);
      if (!res.success) {
        throw new Error(res.error || 'Failed to save learning path to Supabase database.');
      }
    }
    return localAdapter.saveLearningPath(path);
  },

  deleteLearningPath: async (id: string): Promise<LearningPath[]> => {
    if (isSupabaseConfigured()) {
      const res = await deleteLearningPathFromSupabase(id);
      if (!res.success) {
        throw new Error(res.error || 'Failed to delete learning path from Supabase database.');
      }
    }
    return localAdapter.deleteLearningPath(id);
  },

  getCompletedModules: async (): Promise<string[]> => {
    return localAdapter.getCompletedModules();
  },

  toggleModuleCompletion: async (moduleId: string): Promise<string[]> => {
    return localAdapter.toggleModuleCompletion(moduleId);
  },

  // ==================================================================
  // CHALLENGES
  // ==================================================================
  getChallenges: async (): Promise<Challenge[]> => {
    if (!isSupabaseConfigured()) return localAdapter.getChallenges();
    try {
      const remote = await fetchChallengesFromSupabase();
      if (remote && remote.length > 0) {
        localDatabase.saveChallenges(remote);
        return remote;
      }
    } catch (e) {
      console.warn('Supabase getChallenges fallback to local:', e);
    }
    return localAdapter.getChallenges();
  },

  saveChallenge: async (challenge: Challenge): Promise<Challenge[]> => {
    if (isSupabaseConfigured()) {
      const res = await saveChallengeToSupabase(challenge);
      if (!res.success) {
        throw new Error(res.error || 'Failed to save challenge to Supabase database.');
      }
    }
    return localAdapter.saveChallenge(challenge);
  },

  deleteChallenge: async (id: string): Promise<Challenge[]> => {
    if (isSupabaseConfigured()) {
      const res = await deleteChallengeFromSupabase(id);
      if (!res.success) {
        throw new Error(res.error || 'Failed to delete challenge from Supabase database.');
      }
    }
    return localAdapter.deleteChallenge(id);
  },

  // ==================================================================
  // RESOURCES
  // ==================================================================
  getResources: async (): Promise<CommunityResource[]> => {
    if (!isSupabaseConfigured()) return localAdapter.getResources();
    try {
      const remote = await fetchResourcesFromSupabase();
      if (remote && remote.length > 0) {
        localDatabase.saveResources(remote);
        return remote;
      }
    } catch (e) {
      console.warn('Supabase getResources fallback to local:', e);
    }
    return localAdapter.getResources();
  },

  saveResource: async (resource: CommunityResource): Promise<CommunityResource[]> => {
    if (isSupabaseConfigured()) {
      const res = await saveResourceToSupabase(resource);
      if (!res.success) {
        throw new Error(res.error || 'Failed to save resource to Supabase database.');
      }
    }
    return localAdapter.saveResource(resource);
  },

  deleteResource: async (id: string): Promise<CommunityResource[]> => {
    if (isSupabaseConfigured()) {
      const res = await deleteResourceFromSupabase(id);
      if (!res.success) {
        throw new Error(res.error || 'Failed to delete resource from Supabase database.');
      }
    }
    return localAdapter.deleteResource(id);
  },

  incrementResourceDownloads: async (id: string): Promise<CommunityResource[]> => {
    const local = await localAdapter.incrementResourceDownloads(id);
    if (!isSupabaseConfigured()) return local;
    try {
      const res = local.find((r) => r.id === id);
      if (res) {
        const cloudRes = await incrementResourceDownloadsInSupabase(id, res.downloadCount);
        if (!cloudRes.success) {
          console.warn('Supabase download increment warning:', cloudRes.error);
        }
      }
    } catch (e) {
      console.warn('Supabase download increment fallback to local:', e);
    }
    return local;
  },

  // ==================================================================
  // LEADERSHIP
  // ==================================================================
  getLeadership: async (): Promise<LeadershipMember[]> => {
    if (!isSupabaseConfigured()) return localAdapter.getLeadership();
    try {
      const remote = await fetchLeadershipFromSupabase();
      if (remote && remote.length > 0) {
        localDatabase.saveLeadership(remote);
        return remote;
      }
    } catch (e) {
      console.warn('Supabase getLeadership fallback to local:', e);
    }
    return localAdapter.getLeadership();
  },

  saveLeadership: async (member: LeadershipMember): Promise<LeadershipMember[]> => {
    if (isSupabaseConfigured()) {
      const res = await saveLeadershipToSupabase(member);
      if (!res.success) {
        throw new Error(res.error || 'Failed to save team member to Supabase database.');
      }
    }
    return localAdapter.saveLeadership(member);
  },

  deleteLeadership: async (id: string): Promise<LeadershipMember[]> => {
    if (isSupabaseConfigured()) {
      const res = await deleteLeadershipFromSupabase(id);
      if (!res.success) {
        throw new Error(res.error || 'Failed to delete team member from Supabase database.');
      }
    }
    return localAdapter.deleteLeadership(id);
  },

  // ==================================================================
  // ACTIVITY DRAFTS
  // ==================================================================
  getActivityDrafts: async (): Promise<ActivityDraft[]> => {
    if (!isSupabaseConfigured()) return localAdapter.getActivityDrafts();
    try {
      const remote = await fetchActivityDraftsFromSupabase();
      if (remote && remote.length > 0) {
        localDatabase.saveActivityDrafts(remote);
        return remote;
      }
    } catch (e) {
      console.warn('Supabase getActivityDrafts fallback to local:', e);
    }
    return localAdapter.getActivityDrafts();
  },

  saveActivityDraft: async (draft: ActivityDraft): Promise<ActivityDraft[]> => {
    if (isSupabaseConfigured()) {
      const res = await saveActivityDraftToSupabase(draft);
      if (!res.success) {
        throw new Error(res.error || 'Failed to save activity draft to Supabase database.');
      }
    }
    return localAdapter.saveActivityDraft(draft);
  },

  deleteActivityDraft: async (id: string): Promise<ActivityDraft[]> => {
    if (isSupabaseConfigured()) {
      const res = await deleteActivityDraftFromSupabase(id);
      if (!res.success) {
        throw new Error(res.error || 'Failed to delete activity draft from Supabase database.');
      }
    }
    return localAdapter.deleteActivityDraft(id);
  },

  updateDraftStatus: async (id: string, status: DraftStatus, notes?: string): Promise<ActivityDraft[]> => {
    if (isSupabaseConfigured()) {
      const res = await updateDraftStatusInSupabase(id, status, notes);
      if (!res.success) {
        throw new Error(res.error || 'Failed to update activity draft status in Supabase database.');
      }
    }
    return localAdapter.updateDraftStatus(id, status, notes);
  },

  // ==================================================================
  // ARTICLES & TECHNICAL WRITE-UPS
  // ==================================================================
  getArticles: async (): Promise<Article[]> => {
    if (!isSupabaseConfigured()) return localAdapter.getArticles();
    try {
      const remote = await fetchArticlesFromSupabase();
      if (remote && remote.length > 0) {
        localDatabase.saveArticles(remote);
        return remote;
      }
    } catch (e) {
      console.warn('Supabase getArticles fallback to local:', e);
    }
    return localAdapter.getArticles();
  },

  saveArticle: async (article: Article): Promise<Article[]> => {
    if (isSupabaseConfigured()) {
      const res = await saveArticleToSupabase(article);
      if (!res.success) {
        throw new Error(res.error || 'Failed to save article to Supabase database.');
      }
    }
    return localAdapter.saveArticle(article);
  },

  deleteArticle: async (id: string): Promise<Article[]> => {
    if (isSupabaseConfigured()) {
      const res = await deleteArticleFromSupabase(id);
      if (!res.success) {
        throw new Error(res.error || 'Failed to delete article from Supabase database.');
      }
    }
    return localAdapter.deleteArticle(id);
  },

  incrementArticleViews: async (id: string): Promise<Article[]> => {
    const local = await localAdapter.incrementArticleViews(id);
    if (!isSupabaseConfigured()) return local;
    try {
      const res = await incrementArticleViewsInSupabase(id);
      if (!res.success) {
        console.warn('Supabase increment article views warning:', res.error);
      }
    } catch (e) {
      console.warn('Supabase increment article views fallback to local:', e);
    }
    return local;
  },

  // ==================================================================
  // SETTINGS & SYSTEM (CMS)
  // ==================================================================
  getSettings: async (): Promise<SiteSettings> => {
    if (!isSupabaseConfigured()) return localAdapter.getSettings();
    try {
      const remote = await fetchSettingsFromSupabase();
      if (remote && remote.heroHeading) {
        localDatabase.saveSettings(remote);
        return remote;
      }
    } catch (e) {
      console.warn('Supabase getSettings fallback to local:', e);
    }
    return localAdapter.getSettings();
  },

  updateSettings: async (newSettings: Partial<SiteSettings>): Promise<SiteSettings> => {
    const currentSettings = await localAdapter.getSettings();
    const mergedSettings: SiteSettings = {
      ...currentSettings,
      ...newSettings
    };
    if (isSupabaseConfigured()) {
      const res = await saveSettingsToSupabase(mergedSettings);
      if (!res.success) {
        throw new Error(res.error || 'Failed to save site settings to Supabase database.');
      }
    }
    return localAdapter.updateSettings(newSettings);
  },

  // ==================================================================
  // AUDIT LOGS
  // ==================================================================
  getAuditLogs: async (): Promise<AuditLogEntry[]> => {
    if (!isSupabaseConfigured()) return localAdapter.getAuditLogs();
    try {
      const remote = await fetchAuditLogsFromSupabase();
      if (remote && remote.length > 0) {
        return remote;
      }
    } catch (e) {
      console.warn('Supabase getAuditLogs fallback to local:', e);
    }
    return localAdapter.getAuditLogs();
  },

  addAuditLog: async (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<AuditLogEntry[]> => {
    if (isSupabaseConfigured()) {
      const res = await saveAuditLogToSupabase(entry);
      if (!res.success) {
        console.warn('Supabase addAuditLog warning:', res.error);
      }
    }
    return localAdapter.addAuditLog(entry);
  },

  // ==================================================================
  // ANALYTICS & TELEMETRY
  // ==================================================================
  getAnalyticsEvents: async (): Promise<AnalyticsEvent[]> => {
    if (!isSupabaseConfigured()) return localAdapter.getAnalyticsEvents();
    try {
      const remote = await fetchAnalyticsEventsFromSupabase();
      if (remote && remote.length > 0) {
        return remote;
      }
    } catch (e) {
      console.warn('Supabase getAnalyticsEvents fallback to local:', e);
    }
    return localAdapter.getAnalyticsEvents();
  },

  recordAnalyticsEvent: async (event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): Promise<AnalyticsEvent[]> => {
    if (isSupabaseConfigured()) {
      const res = await recordAnalyticsEventToSupabase(event);
      if (!res.success) {
        console.warn('Supabase recordAnalyticsEvent warning:', res.error);
      }
    }
    return localAdapter.recordAnalyticsEvent(event);
  },

  getEventsByType: async (type: AnalyticsEventType): Promise<AnalyticsEvent[]> => {
    return localAdapter.getEventsByType(type);
  }
};
