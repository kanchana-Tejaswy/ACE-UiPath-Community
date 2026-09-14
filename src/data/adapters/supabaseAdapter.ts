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
    const local = await localAdapter.saveActivity(activity);
    if (!isSupabaseConfigured()) return local;
    try {
      await saveActivityToSupabase(activity);
    } catch (e) {
      console.warn('Supabase activity save fallback to local:', e);
    }
    return local;
  },

  deleteActivity: async (id: string): Promise<Activity[]> => {
    const local = await localAdapter.deleteActivity(id);
    if (!isSupabaseConfigured()) return local;
    try {
      await deleteActivityFromSupabase(id);
    } catch (e) {
      console.warn('Supabase activity delete fallback to local:', e);
    }
    return local;
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
    const local = await localAdapter.saveProject(project);
    if (!isSupabaseConfigured()) return local;
    try {
      await saveProjectToSupabase(project);
    } catch (e) {
      console.warn('Supabase project save fallback to local:', e);
    }
    return local;
  },

  deleteProject: async (id: string): Promise<ProjectShowcase[]> => {
    const local = await localAdapter.deleteProject(id);
    if (!isSupabaseConfigured()) return local;
    try {
      await deleteProjectFromSupabase(id);
    } catch (e) {
      console.warn('Supabase project delete fallback to local:', e);
    }
    return local;
  },

  upvoteProject: async (id: string): Promise<ProjectShowcase[]> => {
    const local = await localAdapter.upvoteProject(id);
    if (!isSupabaseConfigured()) return local;
    try {
      const proj = local.find((p) => p.id === id);
      if (proj) {
        await upvoteProjectInSupabase(id, proj.upvotes);
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
    const local = await localAdapter.saveLearningPath(path);
    if (!isSupabaseConfigured()) return local;
    try {
      await saveLearningPathToSupabase(path);
    } catch (e) {
      console.warn('Supabase learning path save fallback to local:', e);
    }
    return local;
  },

  deleteLearningPath: async (id: string): Promise<LearningPath[]> => {
    const local = await localAdapter.deleteLearningPath(id);
    if (!isSupabaseConfigured()) return local;
    try {
      await deleteLearningPathFromSupabase(id);
    } catch (e) {
      console.warn('Supabase learning path delete fallback to local:', e);
    }
    return local;
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
    const local = await localAdapter.saveChallenge(challenge);
    if (!isSupabaseConfigured()) return local;
    try {
      await saveChallengeToSupabase(challenge);
    } catch (e) {
      console.warn('Supabase challenge save fallback to local:', e);
    }
    return local;
  },

  deleteChallenge: async (id: string): Promise<Challenge[]> => {
    const local = await localAdapter.deleteChallenge(id);
    if (!isSupabaseConfigured()) return local;
    try {
      await deleteChallengeFromSupabase(id);
    } catch (e) {
      console.warn('Supabase challenge delete fallback to local:', e);
    }
    return local;
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
    const local = await localAdapter.saveResource(resource);
    if (!isSupabaseConfigured()) return local;
    try {
      await saveResourceToSupabase(resource);
    } catch (e) {
      console.warn('Supabase resource save fallback to local:', e);
    }
    return local;
  },

  deleteResource: async (id: string): Promise<CommunityResource[]> => {
    const local = await localAdapter.deleteResource(id);
    if (!isSupabaseConfigured()) return local;
    try {
      await deleteResourceFromSupabase(id);
    } catch (e) {
      console.warn('Supabase resource delete fallback to local:', e);
    }
    return local;
  },

  incrementResourceDownloads: async (id: string): Promise<CommunityResource[]> => {
    const local = await localAdapter.incrementResourceDownloads(id);
    if (!isSupabaseConfigured()) return local;
    try {
      const res = local.find((r) => r.id === id);
      if (res) {
        await incrementResourceDownloadsInSupabase(id, res.downloadCount);
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
    const local = await localAdapter.saveLeadership(member);
    if (!isSupabaseConfigured()) return local;
    try {
      await saveLeadershipToSupabase(member);
    } catch (e) {
      console.warn('Supabase leadership save fallback to local:', e);
    }
    return local;
  },

  deleteLeadership: async (id: string): Promise<LeadershipMember[]> => {
    const local = await localAdapter.deleteLeadership(id);
    if (!isSupabaseConfigured()) return local;
    try {
      await deleteLeadershipFromSupabase(id);
    } catch (e) {
      console.warn('Supabase leadership delete fallback to local:', e);
    }
    return local;
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
    const local = await localAdapter.saveActivityDraft(draft);
    if (!isSupabaseConfigured()) return local;
    try {
      await saveActivityDraftToSupabase(draft);
    } catch (e) {
      console.warn('Supabase activity draft save fallback to local:', e);
    }
    return local;
  },

  deleteActivityDraft: async (id: string): Promise<ActivityDraft[]> => {
    const local = await localAdapter.deleteActivityDraft(id);
    if (!isSupabaseConfigured()) return local;
    try {
      await deleteActivityDraftFromSupabase(id);
    } catch (e) {
      console.warn('Supabase activity draft delete fallback to local:', e);
    }
    return local;
  },

  updateDraftStatus: async (id: string, status: DraftStatus, notes?: string): Promise<ActivityDraft[]> => {
    const local = await localAdapter.updateDraftStatus(id, status, notes);
    if (!isSupabaseConfigured()) return local;
    try {
      await updateDraftStatusInSupabase(id, status, notes);
    } catch (e) {
      console.warn('Supabase update draft status fallback to local:', e);
    }
    return local;
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
    const local = await localAdapter.saveArticle(article);
    if (!isSupabaseConfigured()) return local;
    try {
      await saveArticleToSupabase(article);
    } catch (e) {
      console.warn('Supabase article save fallback to local:', e);
    }
    return local;
  },

  deleteArticle: async (id: string): Promise<Article[]> => {
    const local = await localAdapter.deleteArticle(id);
    if (!isSupabaseConfigured()) return local;
    try {
      await deleteArticleFromSupabase(id);
    } catch (e) {
      console.warn('Supabase article delete fallback to local:', e);
    }
    return local;
  },

  incrementArticleViews: async (id: string): Promise<Article[]> => {
    const local = await localAdapter.incrementArticleViews(id);
    if (!isSupabaseConfigured()) return local;
    try {
      await incrementArticleViewsInSupabase(id);
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
    const updated = await localAdapter.updateSettings(newSettings);
    if (!isSupabaseConfigured()) return updated;
    try {
      await saveSettingsToSupabase(updated);
    } catch (e) {
      console.warn('Supabase updateSettings fallback to local:', e);
    }
    return updated;
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
    const local = await localAdapter.addAuditLog(entry);
    if (!isSupabaseConfigured()) return local;
    try {
      await saveAuditLogToSupabase(entry);
    } catch (e) {
      console.warn('Supabase addAuditLog fallback to local:', e);
    }
    return local;
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
    const local = await localAdapter.recordAnalyticsEvent(event);
    if (!isSupabaseConfigured()) return local;
    try {
      await recordAnalyticsEventToSupabase(event);
    } catch (e) {
      console.warn('Supabase recordAnalyticsEvent fallback to local:', e);
    }
    return local;
  },

  getEventsByType: async (type: AnalyticsEventType): Promise<AnalyticsEvent[]> => {
    return localAdapter.getEventsByType(type);
  }
};
