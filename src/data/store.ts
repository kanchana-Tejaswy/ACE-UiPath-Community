import { useState, useEffect } from 'react';
import {
  Activity,
  LearningPath,
  ProjectShowcase,
  Challenge,
  CommunityResource,
  LeadershipMember,
  SiteSettings,
  User,
  UserRole,
  UserStatus,
  AuditLogEntry,
  ActivityDraft,
  DraftStatus,
  AnalyticsEvent,
  CommunityStatistic,
  Announcement,
  TimelineMilestone,
  Article
} from '../types';
import { localDatabase } from './local/localDatabase';
import { activitiesRepository } from './repositories/activitiesRepository';
import { projectsRepository } from './repositories/projectsRepository';
import { learningRepository } from './repositories/learningRepository';
import { resourcesRepository } from './repositories/resourcesRepository';
import { settingsRepository } from './repositories/settingsRepository';
import { activityDraftsRepository } from './repositories/activityDraftsRepository';
import { analyticsRepository } from './repositories/analyticsRepository';
import { articlesRepository } from './repositories/articlesRepository';
import { activeAdapter } from './adapters';
import { hasPermission, isValidDraftStatusTransition, normalizeRole } from '../lib/security';
import { authService } from '../lib/auth/authService';

const DB_CHANGE_EVENT = 'ace_uipath_db_update';

function notifyDbChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(DB_CHANGE_EVENT));
  }
}

export function useCommunityStore() {
  const [activities, setActivities] = useState<Activity[]>(() => activitiesRepository.getAll());
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>(() => learningRepository.getAll());
  const [projects, setProjects] = useState<ProjectShowcase[]>(() => projectsRepository.getAll());
  const [challenges, setChallenges] = useState<Challenge[]>(() => localDatabase.getChallenges());
  const [resources, setResources] = useState<CommunityResource[]>(() => resourcesRepository.getAll());
  const [leadership, setLeadership] = useState<LeadershipMember[]>(() => localDatabase.getLeadership());
  const [settings, setSettings] = useState<SiteSettings>(() => settingsRepository.get());
  const [users, setUsers] = useState<User[]>(() => localDatabase.getUsers());
  const [currentUserId, setCurrentUserId] = useState<string>(() => localDatabase.getCurrentUserId());
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => localDatabase.getAuditLogs());
  const [completedModuleIds, setCompletedModuleIds] = useState<string[]>(() => localDatabase.getCompletedModules());
  const [activityDrafts, setActivityDrafts] = useState<ActivityDraft[]>(() => activityDraftsRepository.getAll());
  const [analyticsEvents, setAnalyticsEvents] = useState<AnalyticsEvent[]>(() => localDatabase.getAnalyticsEvents());
  const [articles, setArticles] = useState<Article[]>(() => articlesRepository.getAll());

  // Sync with remote Supabase cloud backend
  useEffect(() => {
    let isMounted = true;

    async function syncCloudBackend() {
      if (!activeAdapter.isCloudConnected()) {
        return;
      }

      try {
        const [
          remoteSettings,
          remoteActivities,
          remoteProjects,
          remoteResources,
          remoteLearningPaths,
          remoteChallenges,
          remoteLeadership,
          remoteDrafts,
          remoteArticles
        ] = await Promise.all([
          activeAdapter.getSettings(),
          activeAdapter.getActivities(),
          activeAdapter.getProjects(),
          activeAdapter.getResources(),
          activeAdapter.getLearningPaths(),
          activeAdapter.getChallenges(),
          activeAdapter.getLeadership(),
          activeAdapter.getActivityDrafts(),
          activeAdapter.getArticles()
        ]);

        if (isMounted) {
          if (remoteSettings && remoteSettings.heroHeading) {
            if (!remoteSettings.communityStoryImageUrl || remoteSettings.communityStoryImageUrl.includes('photo-1522071820081')) {
              remoteSettings.communityStoryImageUrl = '/ace-campus.jpg';
            }
            setSettings(remoteSettings);
            localDatabase.saveSettings(remoteSettings);
          }
          if (remoteActivities && remoteActivities.length > 0) {
            setActivities(remoteActivities);
            localDatabase.saveActivities(remoteActivities);
          }
          if (remoteProjects && remoteProjects.length > 0) {
            setProjects(remoteProjects);
            localDatabase.saveProjects(remoteProjects);
          }
          if (remoteResources && remoteResources.length > 0) {
            setResources(remoteResources);
            localDatabase.saveResources(remoteResources);
          }
          if (remoteLearningPaths && remoteLearningPaths.length > 0) {
            setLearningPaths(remoteLearningPaths);
            localDatabase.saveLearningPaths(remoteLearningPaths);
          }
          if (remoteChallenges && remoteChallenges.length > 0) {
            setChallenges(remoteChallenges);
            localDatabase.saveChallenges(remoteChallenges);
          }
          if (remoteLeadership && remoteLeadership.length > 0) {
            setLeadership(remoteLeadership);
            localDatabase.saveLeadership(remoteLeadership);
          }
          if (remoteDrafts && remoteDrafts.length > 0) {
            setActivityDrafts(remoteDrafts);
            localDatabase.saveActivityDrafts(remoteDrafts);
          }
          if (remoteArticles && remoteArticles.length > 0) {
            setArticles(remoteArticles);
            localDatabase.saveArticles(remoteArticles);
          }
        }
      } catch (err) {
        console.debug('Cloud backend sync notice:', err);
      }
    }

    syncCloudBackend();

    // Auto-transition scheduled articles whose time has passed
    const evaluateScheduledArticles = () => {
      const allArticles = articlesRepository.getAll();
      const now = new Date();
      let hasChanges = false;
      const updated = allArticles.map((art) => {
        if (art.status === 'SCHEDULED' && art.scheduledAt && new Date(art.scheduledAt) <= now) {
          hasChanges = true;
          return {
            ...art,
            status: 'PUBLISHED' as const,
            publishedAt: art.scheduledAt,
            updatedAt: now.toISOString()
          };
        }
        return art;
      });
      if (hasChanges) {
        localDatabase.saveArticles(updated);
        setArticles(updated);
        notifyDbChange();
      }
    };

    evaluateScheduledArticles();
    const scheduledTimer = setInterval(evaluateScheduledArticles, 15000);

    const handleUpdate = () => {
      setActivities(activitiesRepository.getAll());
      setLearningPaths(learningRepository.getAll());
      setProjects(projectsRepository.getAll());
      setChallenges(localDatabase.getChallenges());
      setResources(resourcesRepository.getAll());
      setLeadership(localDatabase.getLeadership());
      setSettings(settingsRepository.get());
      setUsers(localDatabase.getUsers());
      setCurrentUserId(localDatabase.getCurrentUserId());
      setAuditLogs(localDatabase.getAuditLogs());
      setActivityDrafts(activityDraftsRepository.getAll());
      setAnalyticsEvents(localDatabase.getAnalyticsEvents());
      setArticles(articlesRepository.getAll());
    };

    window.addEventListener(DB_CHANGE_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      isMounted = false;
      clearInterval(scheduledTimer);
      window.removeEventListener(DB_CHANGE_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  const recordAnalyticsEvent = (event: Omit<AnalyticsEvent, 'id' | 'timestamp'>) => {
    const newEvent = localDatabase.addAnalyticsEvent({
      ...event,
      userId: event.userId || currentUser?.id,
    });
    setAnalyticsEvents(localDatabase.getAnalyticsEvents());
    if (activeAdapter.isCloudConnected()) {
      activeAdapter.recordAnalyticsEvent(event).catch(() => {});
    }
    return newEvent;
  };

  const setCurrentRole = (role: UserRole) => {
    const norm = normalizeRole(role);
    const targetUser = users.find((u) => normalizeRole(u.role) === norm) || users[0];
    setCurrentUserId(targetUser.id);
    localDatabase.saveCurrentUserId(targetUser.id);
    notifyDbChange();
  };

  const updateUserRole = async (userId: string, newRole: UserRole): Promise<{ success: boolean; error?: string }> => {
    try {
      if (authService.isConfigured()) {
        const res = await authService.updateUserRoleInCloud(userId, newRole);
        if (!res.success) {
          return { success: false, error: res.error || 'Failed to update user role in Supabase.' };
        }
      }
      const allUsers = localDatabase.getUsers();
      const updated = allUsers.map((u) => (u.id === userId ? { ...u, role: newRole } : u));
      localDatabase.saveUsers(updated);
      setUsers(updated);

      const target = allUsers.find((u) => u.id === userId);
      localDatabase.addAuditLog({
        action: 'ROLE_CHANGED',
        entityType: 'User',
        entityId: userId,
        description: `Role for "${target?.name || userId}" changed to ${newRole}.`,
        performedBy: currentUser.name
      });
      notifyDbChange();
      return { success: true };
    } catch (err: any) {
      console.error('Update user role failed:', err);
      return { success: false, error: err?.message || 'Failed to update user role.' };
    }
  };

  const updateUserStatus = async (userId: string, newStatus: UserStatus): Promise<{ success: boolean; error?: string }> => {
    try {
      if (authService.isConfigured()) {
        const res = await authService.updateUserStatusInCloud(userId, newStatus);
        if (!res.success) {
          return { success: false, error: res.error || 'Failed to update user status in Supabase.' };
        }
      }
      const allUsers = localDatabase.getUsers();
      const updated = allUsers.map((u) => (u.id === userId ? { ...u, status: newStatus } : u));
      localDatabase.saveUsers(updated);
      setUsers(updated);

      const target = allUsers.find((u) => u.id === userId);
      const actionName = newStatus === 'INACTIVE' ? 'ACCOUNT_DEACTIVATED' : 'ACCOUNT_ACTIVATED';
      localDatabase.addAuditLog({
        action: actionName,
        entityType: 'User',
        entityId: userId,
        description: `Account status for "${target?.name || userId}" changed to ${newStatus}.`,
        performedBy: currentUser.name
      });
      notifyDbChange();
      return { success: true };
    } catch (err: any) {
      console.error('Update user status failed:', err);
      return { success: false, error: err?.message || 'Failed to update user status.' };
    }
  };

  const saveActivity = async (activity: Activity): Promise<{ success: boolean; error?: string }> => {
    try {
      if (activeAdapter.isCloudConnected()) {
        await activeAdapter.saveActivity(activity);
      }
      const updated = activitiesRepository.save(activity);
      setActivities(updated);
      localDatabase.addAuditLog({
        action: 'ADMIN_SAVED_ACTIVITY',
        entityType: 'ACTIVITY',
        entityId: activity.id,
        description: `Saved activity record "${activity.title}" (${activity.status})`,
        performedBy: currentUser.name
      });
      notifyDbChange();
      return { success: true };
    } catch (err: any) {
      console.error('Save activity failed:', err);
      return { success: false, error: err?.message || 'Failed to save activity.' };
    }
  };

  const deleteActivity = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const act = activities.find((a) => a.id === id);
      if (activeAdapter.isCloudConnected()) {
        await activeAdapter.deleteActivity(id);
      }
      const updated = activitiesRepository.delete(id);
      setActivities(updated);
      localDatabase.addAuditLog({
        action: 'ADMIN_DELETED_ACTIVITY',
        entityType: 'ACTIVITY',
        entityId: id,
        description: `Deleted activity record "${act?.title || id}"`,
        performedBy: currentUser.name
      });
      notifyDbChange();
      return { success: true };
    } catch (err: any) {
      console.error('Delete activity failed:', err);
      return { success: false, error: err?.message || 'Failed to delete activity.' };
    }
  };

  const saveProject = async (project: ProjectShowcase): Promise<{ success: boolean; error?: string }> => {
    try {
      if (activeAdapter.isCloudConnected()) {
        await activeAdapter.saveProject(project);
      }
      const updated = projectsRepository.save(project);
      setProjects(updated);
      localDatabase.addAuditLog({
        action: 'ADMIN_SAVED_PROJECT',
        entityType: 'PROJECT',
        entityId: project.id,
        description: `Saved project showcase "${project.title}" (${project.status})`,
        performedBy: currentUser.name
      });
      notifyDbChange();
      return { success: true };
    } catch (err: any) {
      console.error('Save project failed:', err);
      return { success: false, error: err?.message || 'Failed to save project.' };
    }
  };

  const deleteProject = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const proj = projects.find((p) => p.id === id);
      if (activeAdapter.isCloudConnected()) {
        await activeAdapter.deleteProject(id);
      }
      const updated = projectsRepository.delete(id);
      setProjects(updated);
      localDatabase.addAuditLog({
        action: 'ADMIN_DELETED_PROJECT',
        entityType: 'PROJECT',
        entityId: id,
        description: `Deleted project showcase "${proj?.title || id}"`,
        performedBy: currentUser.name
      });
      notifyDbChange();
      return { success: true };
    } catch (err: any) {
      console.error('Delete project failed:', err);
      return { success: false, error: err?.message || 'Failed to delete project.' };
    }
  };

  const upvoteProject = (id: string) => {
    const updated = projectsRepository.upvote(id);
    setProjects(updated);
    if (activeAdapter.isCloudConnected()) {
      activeAdapter.upvoteProject(id).catch((e) => console.warn('Supabase upvoteProject warning:', e));
    }
    recordAnalyticsEvent({
      eventType: 'PROJECT_UPVOTED',
      entityType: 'Project',
      entityId: id
    });
    notifyDbChange();
  };

  const saveResource = async (res: CommunityResource): Promise<{ success: boolean; error?: string }> => {
    try {
      if (activeAdapter.isCloudConnected()) {
        await activeAdapter.saveResource(res);
      }
      const updated = resourcesRepository.save(res);
      setResources(updated);
      localDatabase.addAuditLog({
        action: 'ADMIN_SAVED_RESOURCE',
        entityType: 'RESOURCE',
        entityId: res.id,
        description: `Saved resource vault asset "${res.title}"`,
        performedBy: currentUser.name
      });
      notifyDbChange();
      return { success: true };
    } catch (err: any) {
      console.error('Save resource failed:', err);
      return { success: false, error: err?.message || 'Failed to save resource.' };
    }
  };

  const deleteResource = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = resources.find((r) => r.id === id);
      if (activeAdapter.isCloudConnected()) {
        await activeAdapter.deleteResource(id);
      }
      const updated = resourcesRepository.delete(id);
      setResources(updated);
      localDatabase.addAuditLog({
        action: 'ADMIN_DELETED_RESOURCE',
        entityType: 'RESOURCE',
        entityId: id,
        description: `Deleted resource vault asset "${res?.title || id}"`,
        performedBy: currentUser.name
      });
      notifyDbChange();
      return { success: true };
    } catch (err: any) {
      console.error('Delete resource failed:', err);
      return { success: false, error: err?.message || 'Failed to delete resource.' };
    }
  };

  const saveArticle = async (article: Article): Promise<{ success: boolean; error?: string }> => {
    if (!hasPermission(currentUser.role, 'CORE_TEAM')) {
      const msg = 'Access Restricted: Only Admin and Core Team members can create or edit articles.';
      alert(msg);
      return { success: false, error: msg };
    }

    try {
      if (activeAdapter.isCloudConnected()) {
        await activeAdapter.saveArticle(article);
      }

      const updated = articlesRepository.save(article);
      setArticles(updated);

      if (article.isFeatured) {
        await updateSettings({ featuredArticleId: article.id });
      } else if (settings.featuredArticleId === article.id) {
        await updateSettings({ featuredArticleId: undefined });
      }

      localDatabase.addAuditLog({
        action: 'ADMIN_SAVED_ARTICLE',
        entityType: 'ARTICLE',
        entityId: article.id,
        description: `Saved article "${article.title}" (${article.status})`,
        performedBy: currentUser.name
      });
      notifyDbChange();
      return { success: true };
    } catch (err: any) {
      console.error('Save article failed:', err);
      return { success: false, error: err?.message || 'Failed to save article.' };
    }
  };

  const deleteArticle = async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (!hasPermission(currentUser.role, 'CORE_TEAM')) {
      const msg = 'Access Restricted: Only Admin and Core Team members can delete articles.';
      alert(msg);
      return { success: false, error: msg };
    }

    try {
      const target = articles.find((a) => a.id === id);
      if (activeAdapter.isCloudConnected()) {
        await activeAdapter.deleteArticle(id);
      }

      const updated = articlesRepository.delete(id);
      setArticles(updated);

      if (settings.featuredArticleId === id) {
        await updateSettings({ featuredArticleId: undefined });
      }

      localDatabase.addAuditLog({
        action: 'ADMIN_DELETED_ARTICLE',
        entityType: 'ARTICLE',
        entityId: id,
        description: `Deleted article "${target?.title || id}"`,
        performedBy: currentUser.name
      });
      notifyDbChange();
      return { success: true };
    } catch (err: any) {
      console.error('Delete article failed:', err);
      return { success: false, error: err?.message || 'Failed to delete article.' };
    }
  };

  const incrementArticleViews = (id: string) => {
    const updated = articlesRepository.incrementViews(id);
    setArticles(updated);
    if (activeAdapter.isCloudConnected()) {
      activeAdapter.incrementArticleViews(id).catch((e) => console.warn('Supabase incrementArticleViews warning:', e));
    }
  };

  const saveChallenge = async (chal: Challenge): Promise<{ success: boolean; error?: string }> => {
    try {
      if (activeAdapter.isCloudConnected()) {
        await activeAdapter.saveChallenge(chal);
      }
      const currentChallenges = localDatabase.getChallenges();
      const existingIndex = currentChallenges.findIndex((c) => c.id === chal.id);
      let updated: Challenge[];
      if (existingIndex >= 0) {
        updated = [...currentChallenges];
        updated[existingIndex] = chal;
      } else {
        updated = [chal, ...currentChallenges];
      }
      setChallenges(updated);
      localDatabase.saveChallenges(updated);
      localDatabase.addAuditLog({
        action: 'ADMIN_SAVED_CHALLENGE',
        entityType: 'CHALLENGE',
        entityId: chal.id,
        description: `Saved hackathon sprint "${chal.title}"`,
        performedBy: currentUser.name
      });
      notifyDbChange();
      return { success: true };
    } catch (err: any) {
      console.error('Save challenge failed:', err);
      return { success: false, error: err?.message || 'Failed to save challenge.' };
    }
  };

  const deleteChallenge = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const currentChallenges = localDatabase.getChallenges();
      const chal = currentChallenges.find((c) => c.id === id);
      if (activeAdapter.isCloudConnected()) {
        await activeAdapter.deleteChallenge(id);
      }
      const updated = currentChallenges.filter((c) => c.id !== id);
      setChallenges(updated);
      localDatabase.saveChallenges(updated);
      localDatabase.addAuditLog({
        action: 'ADMIN_DELETED_CHALLENGE',
        entityType: 'CHALLENGE',
        entityId: id,
        description: `Deleted hackathon challenge "${chal?.title || id}"`,
        performedBy: currentUser.name
      });
      notifyDbChange();
      return { success: true };
    } catch (err: any) {
      console.error('Delete challenge failed:', err);
      return { success: false, error: err?.message || 'Failed to delete challenge.' };
    }
  };

  const updateSettings = async (newSettings: Partial<SiteSettings>): Promise<{ success: boolean; error?: string }> => {
    try {
      if (activeAdapter.isCloudConnected()) {
        await activeAdapter.updateSettings(newSettings);
      }
      const updated = settingsRepository.update(newSettings);
      setSettings(updated);
      localDatabase.addAuditLog({
        action: 'ADMIN_UPDATED_SETTINGS',
        entityType: 'SETTINGS',
        entityId: 'global_settings',
        description: `Updated global site settings & hero tagline`,
        performedBy: currentUser.name
      });
      notifyDbChange();
      return { success: true };
    } catch (err: any) {
      console.error('Update settings failed:', err);
      return { success: false, error: err?.message || 'Failed to update settings.' };
    }
  };

  const resetToDefaultData = () => {
    localDatabase.resetAll();
    localDatabase.addAuditLog({
      action: 'ADMIN_RESET_DATABASE',
      entityType: 'SYSTEM',
      entityId: 'factory_reset',
      description: `Reset database to original 2022-2026 seed data`,
      performedBy: currentUser.name
    });
    notifyDbChange();
  };

  const exportDatabaseJson = () => {
    localDatabase.addAuditLog({
      action: 'ADMIN_EXPORTED_BACKUP',
      entityType: 'BACKUP',
      entityId: 'backup_json',
      description: `Exported full database JSON snapshot`,
      performedBy: currentUser.name
    });
    return JSON.stringify(
      {
        version: '2.18.0',
        exportedAt: new Date().toISOString(),
        settings,
        activities,
        learningPaths,
        projects,
        challenges,
        resources,
        articles,
        activityDrafts,
        leadership,
        users,
        auditLogs,
        analyticsEvents: analyticsEvents.slice(0, 200)
      },
      null,
      2
    );
  };

  const importDatabaseJson = (jsonString: string) => {
    try {
      if (!jsonString || !jsonString.trim()) {
        return { success: false, error: 'Empty backup file content provided.' };
      }
      const data = JSON.parse(jsonString);
      if (typeof data !== 'object' || data === null || Array.isArray(data)) {
        return { success: false, error: 'Invalid backup file format. Expected a JSON snapshot object.' };
      }
      if (!data.version && !data.activities && !data.projects) {
        return { success: false, error: 'Unrecognized snapshot schema. Missing required community collection keys.' };
      }
      if (Array.isArray(data.activities)) localDatabase.saveActivities(data.activities);
      if (Array.isArray(data.learningPaths)) localDatabase.saveLearningPaths(data.learningPaths);
      if (Array.isArray(data.projects)) localDatabase.saveProjects(data.projects);
      if (Array.isArray(data.challenges)) localDatabase.saveChallenges(data.challenges);
      if (Array.isArray(data.resources)) localDatabase.saveResources(data.resources);
      if (Array.isArray(data.articles)) localDatabase.saveArticles(data.articles);
      if (Array.isArray(data.activityDrafts)) localDatabase.saveActivityDrafts(data.activityDrafts);
      if (Array.isArray(data.leadership)) localDatabase.saveLeadership(data.leadership);
      if (Array.isArray(data.analyticsEvents)) localDatabase.saveAnalyticsEvents(data.analyticsEvents);
      if (data.settings && typeof data.settings === 'object') localDatabase.saveSettings(data.settings);
      localDatabase.addAuditLog({
        action: 'ADMIN_IMPORTED_BACKUP',
        entityType: 'BACKUP',
        entityId: 'restore_json',
        description: `Restored database snapshot from JSON backup (v${data.version || 'legacy'})`,
        performedBy: currentUser.name
      });
      notifyDbChange();
      return { success: true };
    } catch (e: any) {
      return { success: false, error: `JSON Parse Error: ${e.message}` };
    }
  };

  const incrementResourceDownloads = (id: string) => {
    const updated = resourcesRepository.incrementDownloads(id);
    setResources(updated);
    if (activeAdapter.isCloudConnected()) {
      activeAdapter.incrementResourceDownloads(id).catch((e) => console.warn('Supabase incrementResourceDownloads warning:', e));
    }
    recordAnalyticsEvent({
      eventType: 'RESOURCE_DOWNLOADED',
      entityType: 'Resource',
      entityId: id
    });
    notifyDbChange();
  };

  const toggleModuleCompletion = (moduleId: string) => {
    const updated = localDatabase.toggleModuleCompletion(moduleId);
    setCompletedModuleIds(updated);
    recordAnalyticsEvent({
      eventType: 'LESSON_COMPLETED',
      entityType: 'LearningModule',
      entityId: moduleId
    });
    notifyDbChange();
  };

  const saveActivityDraft = async (draft: ActivityDraft): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser || !hasPermission(currentUser.role, 'CoreTeam')) {
      localDatabase.addAuditLog({
        action: 'UNAUTHORIZED_ATTEMPT_BLOCKED',
        entityType: 'ActivityDraft',
        entityId: draft.id,
        description: `Blocked unauthorized saveActivityDraft attempt by role "${currentUser?.role || 'Guest'}".`,
        performedBy: currentUser?.name || 'Guest'
      });
      return { success: false, error: 'Unauthorized: Core Team role required to save activity drafts.' };
    }
    try {
      if (activeAdapter.isCloudConnected()) {
        await activeAdapter.saveActivityDraft(draft);
      }
      const updated = activityDraftsRepository.save(draft);
      setActivityDrafts(updated);
      localDatabase.addAuditLog({
        action: draft.createdAt === draft.updatedAt ? 'CORE_CREATED_DRAFT' : 'CORE_UPDATED_DRAFT',
        entityType: 'ActivityDraft',
        entityId: draft.id,
        description: `Core Team draft "${draft.title}" saved.`,
        performedBy: currentUser.name
      });
      notifyDbChange();
      return { success: true };
    } catch (err: any) {
      console.error('Save activity draft failed:', err);
      return { success: false, error: err?.message || 'Failed to save activity draft.' };
    }
  };

  const deleteActivityDraft = async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser || !hasPermission(currentUser.role, 'CoreTeam')) {
      return { success: false, error: 'Unauthorized: Core Team role required to delete drafts.' };
    }
    try {
      const draft = activityDraftsRepository.getById(id);
      if (activeAdapter.isCloudConnected()) {
        await activeAdapter.deleteActivityDraft(id);
      }
      const updated = activityDraftsRepository.delete(id);
      setActivityDrafts(updated);
      if (draft) {
        localDatabase.addAuditLog({
          action: 'CORE_DELETED_DRAFT',
          entityType: 'ActivityDraft',
          entityId: id,
          description: `Core Team draft "${draft.title}" deleted.`,
          performedBy: currentUser.name
        });
      }
      notifyDbChange();
      return { success: true };
    } catch (err: any) {
      console.error('Delete activity draft failed:', err);
      return { success: false, error: err?.message || 'Failed to delete activity draft.' };
    }
  };

  const submitActivityDraft = async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser || !hasPermission(currentUser.role, 'CoreTeam')) {
      return { success: false, error: 'Unauthorized: Core Team role required to submit drafts.' };
    }
    const draft = activityDraftsRepository.getById(id);
    if (!draft) return { success: false, error: 'Draft not found.' };

    const check = isValidDraftStatusTransition(draft.status, 'SUBMITTED', currentUser.role);
    if (!check.valid) {
      alert(check.reason);
      return { success: false, error: check.reason };
    }

    try {
      if (activeAdapter.isCloudConnected()) {
        await activeAdapter.updateDraftStatus(id, 'SUBMITTED');
      }
      const updated = activityDraftsRepository.updateStatus(id, 'SUBMITTED');
      setActivityDrafts(updated);
      localDatabase.addAuditLog({
        action: 'CORE_SUBMITTED_DRAFT',
        entityType: 'ActivityDraft',
        entityId: id,
        description: `Draft "${draft.title}" submitted for Admin review.`,
        performedBy: currentUser.name
      });
      notifyDbChange();
      return { success: true };
    } catch (err: any) {
      console.error('Submit draft failed:', err);
      return { success: false, error: err?.message || 'Failed to submit draft.' };
    }
  };

  const reviewActivityDraft = async (id: string, status: DraftStatus, notes?: string): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser || !hasPermission(currentUser.role, 'Admin')) {
      const msg = 'Unauthorized: Admin role required to review Core Team drafts.';
      alert(msg);
      return { success: false, error: msg };
    }
    const draft = activityDraftsRepository.getById(id);
    if (!draft) return { success: false, error: 'Draft not found.' };

    const check = isValidDraftStatusTransition(draft.status, status, currentUser.role);
    if (!check.valid) {
      alert(check.reason);
      return { success: false, error: check.reason };
    }

    try {
      if (activeAdapter.isCloudConnected()) {
        await activeAdapter.updateDraftStatus(id, status, notes);
      }
      const updated = activityDraftsRepository.updateStatus(id, status, notes);
      setActivityDrafts(updated);
      const actionName = status === 'CHANGES_REQUESTED' ? 'ADMIN_REQUESTED_CHANGES' : status === 'APPROVED' ? 'ADMIN_APPROVED_DRAFT' : 'ADMIN_REVIEWED_DRAFT';
      localDatabase.addAuditLog({
        action: actionName,
        entityType: 'ActivityDraft',
        entityId: id,
        description: `Draft "${draft.title}" reviewed -> status set to ${status}. Notes: ${notes || 'None'}`,
        performedBy: currentUser.name
      });
      notifyDbChange();
      return { success: true };
    } catch (err: any) {
      console.error('Review draft failed:', err);
      return { success: false, error: err?.message || 'Failed to review draft.' };
    }
  };

  const publishActivityDraft = async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser || !hasPermission(currentUser.role, 'Admin')) {
      const msg = 'Unauthorized: Admin role required to publish drafts to the public timeline.';
      alert(msg);
      return { success: false, error: msg };
    }
    const draft = activityDraftsRepository.getById(id);
    if (!draft) return { success: false, error: 'Draft not found.' };

    const check = isValidDraftStatusTransition(draft.status, 'PUBLISHED', currentUser.role);
    if (!check.valid) {
      alert(check.reason);
      return { success: false, error: check.reason };
    }

    const publicActivity: Activity = {
      id: draft.id,
      slug: draft.slug,
      title: draft.title,
      category: draft.category,
      eventType: draft.eventType,
      date: draft.date,
      timeStart: draft.timeStart,
      timeEnd: draft.timeEnd,
      venue: draft.venue,
      summary: draft.summary,
      fullDescriptionMd: draft.fullDescriptionMd,
      objectives: draft.objectives,
      agenda: draft.agenda,
      uipathTopicsCovered: draft.uipathTopicsCovered,
      learningOutcomes: draft.learningOutcomes,
      bannerImage: draft.bannerImage,
      galleryImages: draft.galleryImages,
      recordingUrl: draft.recordingUrl,
      slidesUrl: draft.slidesUrl,
      githubUrl: draft.githubUrl,
      workflowPackageUrl: draft.workflowPackageUrl,
      status: 'Upcoming',
      isFeatured: draft.isFeatured,
      speakers: draft.speakers,
      achievements: draft.achievements
    };

    try {
      if (activeAdapter.isCloudConnected()) {
        await activeAdapter.saveActivity(publicActivity);
        await activeAdapter.updateDraftStatus(id, 'PUBLISHED');
      }

      const updatedActivities = activitiesRepository.save(publicActivity);
      setActivities(updatedActivities);

      const updatedDrafts = activityDraftsRepository.updateStatus(id, 'PUBLISHED');
      setActivityDrafts(updatedDrafts);

      localDatabase.addAuditLog({
        action: 'ADMIN_PUBLISHED_DRAFT',
        entityType: 'Activity',
        entityId: draft.id,
        description: `Draft "${draft.title}" published into public activity timeline.`,
        performedBy: currentUser.name
      });
      notifyDbChange();
      return { success: true };
    } catch (err: any) {
      console.error('Publish draft failed:', err);
      return { success: false, error: err?.message || 'Failed to publish draft.' };
    }
  };

  const saveStatistic = async (stat: CommunityStatistic): Promise<{ success: boolean; error?: string }> => {
    const currentStats = settingsRepository.get().statistics || [];
    const idx = currentStats.findIndex((s) => s.id === stat.id);
    let updatedStats: CommunityStatistic[];
    if (idx >= 0) {
      updatedStats = [...currentStats];
      updatedStats[idx] = stat;
    } else {
      updatedStats = [...currentStats, stat];
    }
    return updateSettings({ statistics: updatedStats });
  };

  const deleteStatistic = async (id: string): Promise<{ success: boolean; error?: string }> => {
    const currentStats = settingsRepository.get().statistics || [];
    const updatedStats = currentStats.filter((s) => s.id !== id);
    return updateSettings({ statistics: updatedStats });
  };

  const saveAnnouncement = async (ann: Announcement): Promise<{ success: boolean; error?: string }> => {
    const currentAnns = settingsRepository.get().announcements || [];
    const idx = currentAnns.findIndex((a) => a.id === ann.id);
    let updatedAnns: Announcement[];
    if (idx >= 0) {
      updatedAnns = [...currentAnns];
      updatedAnns[idx] = ann;
    } else {
      updatedAnns = [ann, ...currentAnns];
    }
    return updateSettings({ announcements: updatedAnns });
  };

  const deleteAnnouncement = async (id: string): Promise<{ success: boolean; error?: string }> => {
    const currentAnns = settingsRepository.get().announcements || [];
    const updatedAnns = currentAnns.filter((a) => a.id !== id);
    return updateSettings({ announcements: updatedAnns });
  };

  const saveTimelineMilestone = async (milestone: TimelineMilestone): Promise<{ success: boolean; error?: string }> => {
    const currentMilestones = settingsRepository.get().timelineMilestones || [];
    const idx = currentMilestones.findIndex((m) => m.id === milestone.id);
    let updatedMilestones: TimelineMilestone[];
    if (idx >= 0) {
      updatedMilestones = [...currentMilestones];
      updatedMilestones[idx] = milestone;
    } else {
      updatedMilestones = [...currentMilestones, milestone];
    }
    return updateSettings({ timelineMilestones: updatedMilestones });
  };

  const deleteTimelineMilestone = async (id: string): Promise<{ success: boolean; error?: string }> => {
    const currentMilestones = settingsRepository.get().timelineMilestones || [];
    const updatedMilestones = currentMilestones.filter((m) => m.id !== id);
    return updateSettings({ timelineMilestones: updatedMilestones });
  };

  const saveLeadership = async (member: LeadershipMember): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser || !hasPermission(currentUser.role, 'Admin')) {
      const msg = 'Access Restricted: Administrator role required to manage team leadership.';
      alert(msg);
      return { success: false, error: msg };
    }
    try {
      await activeAdapter.saveLeadership(member);
      const all = localDatabase.getLeadership();
      const idx = all.findIndex((m) => m.id === member.id);
      let updated: LeadershipMember[];
      if (idx >= 0) {
        updated = [...all];
        updated[idx] = member;
      } else {
        updated = [...all, member];
      }
      setLeadership(updated);
      localDatabase.saveLeadership(updated);
      localDatabase.addAuditLog({
        action: 'ADMIN_SAVED_LEADERSHIP',
        entityType: 'LEADERSHIP',
        entityId: member.id,
        description: `Saved leadership member "${member.name}" (${member.roleTitle})`,
        performedBy: currentUser.name
      });
      notifyDbChange();
      return { success: true };
    } catch (err: any) {
      console.error('Save leadership failed:', err);
      return { success: false, error: err?.message || 'Failed to save team member.' };
    }
  };

  const deleteLeadership = async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser || !hasPermission(currentUser.role, 'Admin')) {
      const msg = 'Access Restricted: Administrator role required to manage team leadership.';
      alert(msg);
      return { success: false, error: msg };
    }
    try {
      await activeAdapter.deleteLeadership(id);
      const all = localDatabase.getLeadership();
      const target = all.find((m) => m.id === id);
      const updated = all.filter((m) => m.id !== id);
      setLeadership(updated);
      localDatabase.saveLeadership(updated);
      localDatabase.addAuditLog({
        action: 'ADMIN_DELETED_LEADERSHIP',
        entityType: 'LEADERSHIP',
        entityId: id,
        description: `Deleted leadership member "${target?.name || id}"`,
        performedBy: currentUser.name
      });
      notifyDbChange();
      return { success: true };
    } catch (err: any) {
      console.error('Delete leadership failed:', err);
      return { success: false, error: err?.message || 'Failed to delete team member.' };
    }
  };

  const saveLearningPath = async (path: LearningPath): Promise<{ success: boolean; error?: string }> => {
    try {
      if (activeAdapter.isCloudConnected()) {
        await activeAdapter.saveLearningPath(path);
      }
      const all = learningRepository.getAll();
      const idx = all.findIndex((p) => p.id === path.id);
      let updated: LearningPath[];
      if (idx >= 0) {
        updated = [...all];
        updated[idx] = path;
      } else {
        updated = [...all, path];
      }
      setLearningPaths(updated);
      localDatabase.saveLearningPaths(updated);
      localDatabase.addAuditLog({
        action: 'ADMIN_SAVED_LEARNING_PATH',
        entityType: 'LEARNING_PATH',
        entityId: path.id,
        description: `Saved learning path "${path.title}"`,
        performedBy: currentUser.name
      });
      notifyDbChange();
      return { success: true };
    } catch (err: any) {
      console.error('Save learning path failed:', err);
      return { success: false, error: err?.message || 'Failed to save learning path.' };
    }
  };

  const deleteLearningPath = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (activeAdapter.isCloudConnected()) {
        await activeAdapter.deleteLearningPath(id);
      }
      const updated = learningRepository.delete(id);
      setLearningPaths(updated);
      localDatabase.addAuditLog({
        action: 'ADMIN_DELETED_LEARNING_PATH',
        entityType: 'LEARNING_PATH',
        entityId: id,
        description: `Deleted learning path ID "${id}"`,
        performedBy: currentUser.name
      });
      notifyDbChange();
      return { success: true };
    } catch (err: any) {
      console.error('Delete learning path failed:', err);
      return { success: false, error: err?.message || 'Failed to delete learning path.' };
    }
  };

  return {
    activities,
    learningPaths,
    projects,
    challenges,
    resources,
    articles,
    leadership,
    settings,
    users,
    currentUser,
    auditLogs,
    completedModuleIds,
    activityDrafts,
    analyticsEvents,
    recordAnalyticsEvent,
    toggleModuleCompletion,
    incrementResourceDownloads,
    saveActivityDraft,
    deleteActivityDraft,
    submitActivityDraft,
    reviewActivityDraft,
    publishActivityDraft,
    setCurrentRole,
    updateUserRole,
    updateUserStatus,
    saveActivity,
    deleteActivity,
    saveProject,
    deleteProject,
    upvoteProject,
    saveResource,
    deleteResource,
    saveArticle,
    deleteArticle,
    incrementArticleViews,
    saveChallenge,
    deleteChallenge,
    saveLearningPath,
    deleteLearningPath,
    saveLeadership,
    deleteLeadership,
    saveStatistic,
    deleteStatistic,
    saveAnnouncement,
    deleteAnnouncement,
    saveTimelineMilestone,
    deleteTimelineMilestone,
    updateSettings,
    resetToDefaultData,
    exportDatabaseJson,
    importDatabaseJson
  };
}
