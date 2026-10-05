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
        localDatabase.saveActivities(remote);
        return remote;
      }
    } catch (e) {
      console.warn('Supabase getActivities fallback to local:', e);
    }
    return localAdapter.getActivities();
  },

  saveActivity: async (activity: Activity): Promise<Activity[]> => {
    const updated = await localAdapter.saveActivity(activity);
    if (isSupabaseConfigured()) {
      try {
        const res = await saveActivityToSupabase(activity);
        if (!res.success) {
          console.warn('Supabase saveActivity warning:', res.error);
        }
      } catch (e) {
        console.warn('Supabase saveActivity network notice:', e);
      }
    }
    return updated;
  },

  deleteActivity: async (id: string): Promise<Activity[]> => {
    const updated = await localAdapter.deleteActivity(id);
    if (isSupabaseConfigured()) {
      try {
        const res = await deleteActivityFromSupabase(id);
        if (!res.success) {
          console.warn('Supabase deleteActivity warning:', res.error);
        }
      } catch (e) {
        console.warn('Supabase deleteActivity network notice:', e);
      }
    }
    return updated;
  },

  // ==================================================================
  // PROJECTS
  // ==================================================================
  getProjects: async (): Promise<ProjectShowcase[]> => {
    if (!isSupabaseConfigured()) return localAdapter.getProjects();
    try {
      const remote = await fetchProjectsFromSupabase();
      if (remote !== null && Array.isArray(remote)) {
        localDatabase.saveProjects(remote);
        return remote;
      }
    } catch (e) {
      console.warn('Supabase getProjects fallback to local:', e);
    }
    return localAdapter.getProjects();
  },

  saveProject: async (project: ProjectShowcase): Promise<ProjectShowcase[]> => {
    const updated = await localAdapter.saveProject(project);
    if (isSupabaseConfigured()) {
      try {
        const res = await saveProjectToSupabase(project);
        if (!res.success) {
          console.warn('Supabase saveProject warning:', res.error);
        }
      } catch (e) {
        console.warn('Supabase saveProject network notice:', e);
      }
    }
    return updated;
  },

  deleteProject: async (id: string): Promise<ProjectShowcase[]> => {
    const updated = await localAdapter.deleteProject(id);
    if (isSupabaseConfigured()) {
      try {
        const res = await deleteProjectFromSupabase(id);
        if (!res.success) {
          console.warn('Supabase deleteProject warning:', res.error);
        }
      } catch (e) {
        console.warn('Supabase deleteProject network notice:', e);
      }
    }
    return updated;
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
      if (remote !== null && Array.isArray(remote) && remote.length > 0) {
        localDatabase.saveLearningPaths(remote);
        return remote;
      }
    } catch (e) {
      console.warn('Supabase getLearningPaths fallback to local:', e);
    }
    return localAdapter.getLearningPaths();
  },

  saveLearningPath: async (path: LearningPath): Promise<LearningPath[]> => {
    const updated = await localAdapter.saveLearningPath(path);
    if (isSupabaseConfigured()) {
      try {
        const res = await saveLearningPathToSupabase(path);
        if (!res.success) {
          console.warn('Supabase saveLearningPath warning:', res.error);
        }
      } catch (e) {
        console.warn('Supabase saveLearningPath network notice:', e);
      }
    }
    return updated;
  },

  deleteLearningPath: async (id: string): Promise<LearningPath[]> => {
    const updated = await localAdapter.deleteLearningPath(id);
    if (isSupabaseConfigured()) {
      try {
        const res = await deleteLearningPathFromSupabase(id);
        if (!res.success) {
          console.warn('Supabase deleteLearningPath warning:', res.error);
        }
      } catch (e) {
        console.warn('Supabase deleteLearningPath network notice:', e);
      }
    }
    return updated;
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
        localDatabase.saveChallenges(remote);
        return remote;
      }
    } catch (e) {
      console.warn('Supabase getChallenges fallback to local:', e);
    }
    return localAdapter.getChallenges();
  },

  saveChallenge: async (challenge: Challenge): Promise<Challenge[]> => {
    const updated = await localAdapter.saveChallenge(challenge);
    if (isSupabaseConfigured()) {
      try {
        const res = await saveChallengeToSupabase(challenge);
        if (!res.success) {
          console.warn('Supabase saveChallenge warning:', res.error);
        }
      } catch (e) {
        console.warn('Supabase saveChallenge network notice:', e);
      }
    }
    return updated;
  },

  deleteChallenge: async (id: string): Promise<Challenge[]> => {
    const updated = await localAdapter.deleteChallenge(id);
    if (isSupabaseConfigured()) {
      try {
        const res = await deleteChallengeFromSupabase(id);
        if (!res.success) {
          console.warn('Supabase deleteChallenge warning:', res.error);
        }
      } catch (e) {
        console.warn('Supabase deleteChallenge network notice:', e);
      }
    }
    return updated;
  },

  // ==================================================================
  // RESOURCES
  // ==================================================================
  getResources: async (): Promise<CommunityResource[]> => {
    if (!isSupabaseConfigured()) return localAdapter.getResources();
    try {
      const remote = await fetchResourcesFromSupabase();
      if (remote !== null && Array.isArray(remote)) {
        localDatabase.saveResources(remote);
        return remote;
      }
    } catch (e) {
      console.warn('Supabase getResources fallback to local:', e);
    }
    return localAdapter.getResources();
  },

  saveResource: async (resource: CommunityResource): Promise<CommunityResource[]> => {
    const updated = await localAdapter.saveResource(resource);
    if (isSupabaseConfigured()) {
      try {
        const res = await saveResourceToSupabase(resource);
        if (!res.success) {
          console.warn('Supabase saveResource warning:', res.error);
        }
      } catch (e) {
        console.warn('Supabase saveResource network notice:', e);
      }
    }
    return updated;
  },

  deleteResource: async (id: string): Promise<CommunityResource[]> => {
    const updated = await localAdapter.deleteResource(id);
    if (isSupabaseConfigured()) {
      try {
        const res = await deleteResourceFromSupabase(id);
        if (!res.success) {
          console.warn('Supabase deleteResource warning:', res.error);
        }
      } catch (e) {
        console.warn('Supabase deleteResource network notice:', e);
      }
    }
    return updated;
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
        localDatabase.saveLeadership(remote);
        return remote;
      }
    } catch (e) {
      console.warn('Supabase getLeadership fallback to local:', e);
    }
    return localAdapter.getLeadership();
  },

  saveLeadership: async (member: LeadershipMember): Promise<LeadershipMember[]> => {
    const updated = await localAdapter.saveLeadership(member);
    if (isSupabaseConfigured()) {
      try {
        const res = await saveLeadershipToSupabase(member);
        if (!res.success) {
          console.warn('Supabase saveLeadership warning:', res.error);
        }
      } catch (e) {
        console.warn('Supabase saveLeadership network notice:', e);
      }
    }
    return updated;
  },

  deleteLeadership: async (id: string): Promise<LeadershipMember[]> => {
    const updated = await localAdapter.deleteLeadership(id);
    if (isSupabaseConfigured()) {
      try {
        const res = await deleteLeadershipFromSupabase(id);
        if (!res.success) {
          console.warn('Supabase deleteLeadership warning:', res.error);
        }
      } catch (e) {
        console.warn('Supabase deleteLeadership network notice:', e);
      }
    }
    return updated;
  },

  // ==================================================================
  // ACTIVITY DRAFTS
  // ==================================================================
  getActivityDrafts: async (): Promise<ActivityDraft[]> => {
    if (!isSupabaseConfigured()) return localAdapter.getActivityDrafts();
    try {
      const remote = await fetchActivityDraftsFromSupabase();
      if (remote !== null && Array.isArray(remote) && remote.length > 0) {
        localDatabase.saveActivityDrafts(remote);
        return remote;
      }
    } catch (e) {
      console.warn('Supabase getActivityDrafts fallback to local:', e);
    }
    return localAdapter.getActivityDrafts();
  },

  saveActivityDraft: async (draft: ActivityDraft): Promise<ActivityDraft[]> => {
    const updated = await localAdapter.saveActivityDraft(draft);
    if (isSupabaseConfigured()) {
      try {
        const res = await saveActivityDraftToSupabase(draft);
        if (!res.success) {
          console.warn('Supabase saveActivityDraft warning:', res.error);
        }
      } catch (e) {
        console.warn('Supabase saveActivityDraft network notice:', e);
      }
    }
    return updated;
  },

  deleteActivityDraft: async (id: string): Promise<ActivityDraft[]> => {
    const updated = await localAdapter.deleteActivityDraft(id);
    if (isSupabaseConfigured()) {
      try {
        const res = await deleteActivityDraftFromSupabase(id);
        if (!res.success) {
          console.warn('Supabase deleteActivityDraft warning:', res.error);
        }
      } catch (e) {
        console.warn('Supabase deleteActivityDraft network notice:', e);
      }
    }
    return updated;
  },

  updateDraftStatus: async (id: string, status: DraftStatus, notes?: string): Promise<ActivityDraft[]> => {
    const updated = await localAdapter.updateDraftStatus(id, status, notes);
    if (isSupabaseConfigured()) {
      try {
        const res = await updateDraftStatusInSupabase(id, status, notes);
        if (!res.success) {
          console.warn('Supabase updateDraftStatus warning:', res.error);
        }
      } catch (e) {
        console.warn('Supabase updateDraftStatus network notice:', e);
      }
    }
    return updated;
  },

  // ==================================================================
  // ARTICLES & TECHNICAL WRITE-UPS
  // ==================================================================
  getArticles: async (): Promise<Article[]> => {
    if (!isSupabaseConfigured()) return localAdapter.getArticles();
    try {
      const remote = await fetchArticlesFromSupabase();
      if (remote !== null && Array.isArray(remote)) {
        localDatabase.saveArticles(remote);
        return remote;
      }
    } catch (e) {
      console.warn('Supabase getArticles fallback to local:', e);
    }
    return localAdapter.getArticles();
  },

  saveArticle: async (article: Article): Promise<Article[]> => {
    const updated = await localAdapter.saveArticle(article);
    if (isSupabaseConfigured()) {
      try {
        const res = await saveArticleToSupabase(article);
        if (!res.success) {
          console.warn('Supabase saveArticle warning:', res.error);
        }
      } catch (e) {
        console.warn('Supabase saveArticle network notice:', e);
      }
    }
    return updated;
  },

  deleteArticle: async (id: string): Promise<Article[]> => {
    const updated = await localAdapter.deleteArticle(id);
    if (isSupabaseConfigured()) {
      try {
        const res = await deleteArticleFromSupabase(id);
        if (!res.success) {
          console.warn('Supabase deleteArticle warning:', res.error);
        }
      } catch (e) {
        console.warn('Supabase deleteArticle network notice:', e);
      }
    }
    return updated;
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
    const updated = await localAdapter.updateSettings(newSettings);
    if (isSupabaseConfigured()) {
      try {
        const res = await saveSettingsToSupabase(updated);
        if (!res.success) {
          console.warn('Supabase saveSettings warning:', res.error);
        }
      } catch (e) {
        console.warn('Supabase saveSettings network notice:', e);
      }
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
