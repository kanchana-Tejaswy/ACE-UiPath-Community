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
      if (remote !== null && Array.isArray(remote)) {
        if (remote.length === 0) {
          return localDatabase.getActivities();
        }
        const local = localDatabase.getActivities();
        const remoteIds = new Set(remote.map((r) => r.id));
        const remoteSlugs = new Set(remote.map((r) => (r.slug || '').toLowerCase()).filter(Boolean));
        const preservedLocal = local.filter(
          (l) => !remoteIds.has(l.id) && !(l.slug && remoteSlugs.has(l.slug.toLowerCase()))
        );
        const merged = [...remote, ...preservedLocal];
        localDatabase.saveActivities(merged);
        return merged;
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
        throw new Error(res.error || 'Failed to save activity to Supabase');
      }
    }
    return localAdapter.saveActivity(activity);
  },

  deleteActivity: async (id: string): Promise<Activity[]> => {
    if (isSupabaseConfigured()) {
      const res = await deleteActivityFromSupabase(id);
      if (!res.success) {
        throw new Error(res.error || 'Failed to delete activity from Supabase');
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
      if (remote !== null && Array.isArray(remote)) {
        if (remote.length === 0) {
          return localDatabase.getProjects();
        }
        const local = localDatabase.getProjects();
        const remoteIds = new Set(remote.map((p) => p.id));
        const remoteSlugs = new Set(remote.map((p) => (p.slug || '').toLowerCase()).filter(Boolean));
        const preservedLocal = local.filter(
          (l) => !remoteIds.has(l.id) && !(l.slug && remoteSlugs.has(l.slug.toLowerCase()))
        );
        const merged = [...remote, ...preservedLocal];
        localDatabase.saveProjects(merged);
        return merged;
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
        throw new Error(res.error || 'Failed to save project to Supabase');
      }
    }
    return localAdapter.saveProject(project);
  },

  deleteProject: async (id: string): Promise<ProjectShowcase[]> => {
    if (isSupabaseConfigured()) {
      const res = await deleteProjectFromSupabase(id);
      if (!res.success) {
        throw new Error(res.error || 'Failed to delete project from Supabase');
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
      if (remote !== null && Array.isArray(remote)) {
        if (remote.length === 0) {
          return localDatabase.getLearningPaths();
        }
        const local = localDatabase.getLearningPaths();
        const remoteIds = new Set(remote.map((l) => l.id));
        const preservedLocal = local.filter((l) => !remoteIds.has(l.id));
        const merged = [...remote, ...preservedLocal];
        localDatabase.saveLearningPaths(merged);
        return merged;
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
        throw new Error(res.error || 'Failed to save learning path to Supabase');
      }
    }
    return localAdapter.saveLearningPath(path);
  },

  deleteLearningPath: async (id: string): Promise<LearningPath[]> => {
    if (isSupabaseConfigured()) {
      const res = await deleteLearningPathFromSupabase(id);
      if (!res.success) {
        throw new Error(res.error || 'Failed to delete learning path from Supabase');
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
      if (remote !== null && Array.isArray(remote)) {
        if (remote.length === 0) {
          return localDatabase.getChallenges();
        }
        const local = localDatabase.getChallenges();
        const remoteIds = new Set(remote.map((c) => c.id));
        const preservedLocal = local.filter((l) => !remoteIds.has(l.id));
        const merged = [...remote, ...preservedLocal];
        localDatabase.saveChallenges(merged);
        return merged;
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
        throw new Error(res.error || 'Failed to save challenge to Supabase');
      }
    }
    return localAdapter.saveChallenge(challenge);
  },

  deleteChallenge: async (id: string): Promise<Challenge[]> => {
    if (isSupabaseConfigured()) {
      const res = await deleteChallengeFromSupabase(id);
      if (!res.success) {
        throw new Error(res.error || 'Failed to delete challenge from Supabase');
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
      if (remote !== null && Array.isArray(remote)) {
        if (remote.length === 0) {
          return localDatabase.getResources();
        }
        const local = localDatabase.getResources();
        const remoteIds = new Set(remote.map((r) => r.id));
        const preservedLocal = local.filter((l) => !remoteIds.has(l.id));
        const merged = [...remote, ...preservedLocal];
        localDatabase.saveResources(merged);
        return merged;
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
        throw new Error(res.error || 'Failed to save resource to Supabase');
      }
    }
    return localAdapter.saveResource(resource);
  },

  deleteResource: async (id: string): Promise<CommunityResource[]> => {
    if (isSupabaseConfigured()) {
      const res = await deleteResourceFromSupabase(id);
      if (!res.success) {
        throw new Error(res.error || 'Failed to delete resource from Supabase');
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
      if (remote !== null && Array.isArray(remote)) {
        if (remote.length === 0) {
          return localDatabase.getLeadership();
        }
        const local = localDatabase.getLeadership();
        const remoteIds = new Set(remote.map((m) => m.id));
        const preservedLocal = local.filter((l) => !remoteIds.has(l.id));
        const merged = [...remote, ...preservedLocal];
        localDatabase.saveLeadership(merged);
        return merged;
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
        throw new Error(res.error || 'Failed to save leadership to Supabase');
      }
    }
    return localAdapter.saveLeadership(member);
  },

  deleteLeadership: async (id: string): Promise<LeadershipMember[]> => {
    if (isSupabaseConfigured()) {
      const res = await deleteLeadershipFromSupabase(id);
      if (!res.success) {
        throw new Error(res.error || 'Failed to delete leadership member from Supabase');
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
      if (remote !== null && Array.isArray(remote)) {
        if (remote.length === 0) {
          return localDatabase.getActivityDrafts();
        }
        const local = localDatabase.getActivityDrafts();
        const remoteIds = new Set(remote.map((d) => d.id));
        const preservedLocal = local.filter((l) => !remoteIds.has(l.id));
        const merged = [...remote, ...preservedLocal];
        localDatabase.saveActivityDrafts(merged);
        return merged;
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
        throw new Error(res.error || 'Failed to save activity draft to Supabase');
      }
    }
    return localAdapter.saveActivityDraft(draft);
  },

  deleteActivityDraft: async (id: string): Promise<ActivityDraft[]> => {
    if (isSupabaseConfigured()) {
      const res = await deleteActivityDraftFromSupabase(id);
      if (!res.success) {
        throw new Error(res.error || 'Failed to delete activity draft from Supabase');
      }
    }
    return localAdapter.deleteActivityDraft(id);
  },

  updateDraftStatus: async (id: string, status: DraftStatus, notes?: string): Promise<ActivityDraft[]> => {
    if (isSupabaseConfigured()) {
      const res = await updateDraftStatusInSupabase(id, status, notes);
      if (!res.success) {
        throw new Error(res.error || 'Failed to update draft status in Supabase');
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
      if (remote !== null && Array.isArray(remote)) {
        // Smart merge: retain any locally created or updated articles that aren't yet in Supabase
        const local = localDatabase.getArticles();
        const remoteIds = new Set(remote.map((r) => r.id));
        const remoteSlugs = new Set(remote.map((r) => (r.slug || '').toLowerCase()).filter(Boolean));
        const preservedLocal = local.filter(
          (l) => !remoteIds.has(l.id) && !(l.slug && remoteSlugs.has(l.slug.toLowerCase()))
        );
        const merged = [...remote, ...preservedLocal];
        localDatabase.saveArticles(merged);
        return merged;
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
        throw new Error(res.error || 'Failed to save article to Supabase');
      }
    }
    return localAdapter.saveArticle(article);
  },

  deleteArticle: async (id: string): Promise<Article[]> => {
    if (isSupabaseConfigured()) {
      const res = await deleteArticleFromSupabase(id);
      if (!res.success) {
        throw new Error(res.error || 'Failed to delete article from Supabase');
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
    const local = await localAdapter.getSettings();
    if (!isSupabaseConfigured()) return local;
    try {
      const remote = await fetchSettingsFromSupabase();
      if (remote && typeof remote === 'object' && remote.heroHeading) {
        const merged: SiteSettings = {
          ...local,
          ...remote
        };
        localDatabase.saveSettings(merged);
        return merged;
      }
    } catch (e) {
      console.warn('Supabase getSettings fallback to local:', e);
    }
    return local;
  },

  updateSettings: async (newSettings: Partial<SiteSettings>): Promise<SiteSettings> => {
    if (isSupabaseConfigured()) {
      const current = await localAdapter.getSettings();
      const merged = { ...current, ...newSettings };
      const res = await saveSettingsToSupabase(merged);
      if (!res.success) {
        throw new Error(res.error || 'Failed to save settings to Supabase');
      }
    }
    const updated = await localAdapter.updateSettings(newSettings);
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
