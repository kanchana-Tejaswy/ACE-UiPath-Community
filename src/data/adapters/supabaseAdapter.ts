import { DataAdapter } from './dataAdapter';
import { localAdapter } from './localAdapter';
import { isSupabaseConfigured, supabase } from '../../lib/supabase/client';
import { 
  fetchActivitiesFromSupabase, 
  fetchProjectsFromSupabase, 
  fetchResourcesFromSupabase 
} from '../../lib/supabase/services';
import { 
  Activity, 
  LearningPath, 
  ProjectShowcase, 
  CommunityResource, 
  SiteSettings, 
  AuditLogEntry, 
  ActivityDraft, 
  DraftStatus,
  AnalyticsEvent,
  AnalyticsEventType 
} from '../../types';

export const supabaseAdapter: DataAdapter = {
  isCloudConnected: () => isSupabaseConfigured(),

  getActivities: async (): Promise<Activity[]> => {
    if (!isSupabaseConfigured()) return localAdapter.getActivities();
    const remote = await fetchActivitiesFromSupabase();
    return remote && remote.length > 0 ? remote : localAdapter.getActivities();
  },

  saveActivity: async (activity: Activity): Promise<Activity[]> => {
    const local = await localAdapter.saveActivity(activity);
    if (!isSupabaseConfigured()) return local;
    try {
      await supabase.from('activities').upsert({
        id: activity.id,
        slug: activity.slug,
        title: activity.title,
        category: activity.category,
        event_type: activity.eventType,
        activity_date: activity.date,
        time_start: activity.timeStart,
        time_end: activity.timeEnd,
        venue: activity.venue,
        summary: activity.summary,
        full_description_md: activity.fullDescriptionMd,
        objectives_text: activity.objectives,
        uipath_topics: activity.uipathTopicsCovered,
        learning_outcomes: activity.learningOutcomes,
        banner_image_url: activity.bannerImage,
        recording_url: activity.recordingUrl,
        slides_url: activity.slidesUrl,
        github_url: activity.githubUrl,
        workflow_package_url: activity.workflowPackageUrl,
        status: activity.status,
        is_featured: activity.isFeatured,
        updated_at: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Supabase activity save fallback to local:', e);
    }
    return local;
  },

  deleteActivity: async (id: string): Promise<Activity[]> => {
    const local = await localAdapter.deleteActivity(id);
    if (!isSupabaseConfigured()) return local;
    try {
      await supabase.from('activities').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase activity delete fallback to local:', e);
    }
    return local;
  },

  getProjects: async (): Promise<ProjectShowcase[]> => {
    if (!isSupabaseConfigured()) return localAdapter.getProjects();
    const remote = await fetchProjectsFromSupabase();
    return remote && remote.length > 0 ? remote : localAdapter.getProjects();
  },

  saveProject: async (project: ProjectShowcase): Promise<ProjectShowcase[]> => {
    const local = await localAdapter.saveProject(project);
    if (!isSupabaseConfigured()) return local;
    try {
      await supabase.from('projects').upsert({
        id: project.id,
        slug: project.slug,
        title: project.title,
        tagline: project.tagline,
        summary: project.summary,
        problem_statement: project.problemStatement,
        solution_description: project.solutionDescription,
        uipath_tools_used: project.uipathToolsUsed,
        roi_metrics: project.roiMetrics,
        repo_url: project.repoUrl,
        package_download_url: project.packageDownloadUrl,
        video_demo_url: project.videoDemoUrl,
        author_name: project.authorName,
        author_roll_number: project.authorRollNumber,
        author_branch: project.authorBranch,
        status: project.status,
        upvotes: project.upvotes,
        download_count: project.downloadCount,
        created_at: project.createdAt
      });
    } catch (e) {
      console.warn('Supabase project save fallback to local:', e);
    }
    return local;
  },

  deleteProject: async (id: string): Promise<ProjectShowcase[]> => {
    const local = await localAdapter.deleteProject(id);
    if (!isSupabaseConfigured()) return local;
    try {
      await supabase.from('projects').delete().eq('id', id);
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
        await supabase.from('projects').update({ upvotes: proj.upvotes }).eq('id', id);
      }
    } catch (e) {
      console.warn('Supabase project upvote fallback to local:', e);
    }
    return local;
  },

  getLearningPaths: async (): Promise<LearningPath[]> => {
    return localAdapter.getLearningPaths();
  },

  getCompletedModules: async (): Promise<string[]> => {
    return localAdapter.getCompletedModules();
  },

  toggleModuleCompletion: async (moduleId: string): Promise<string[]> => {
    return localAdapter.toggleModuleCompletion(moduleId);
  },

  getResources: async (): Promise<CommunityResource[]> => {
    if (!isSupabaseConfigured()) return localAdapter.getResources();
    const remote = await fetchResourcesFromSupabase();
    return remote && remote.length > 0 ? remote : localAdapter.getResources();
  },

  saveResource: async (resource: CommunityResource): Promise<CommunityResource[]> => {
    const local = await localAdapter.saveResource(resource);
    if (!isSupabaseConfigured()) return local;
    try {
      await supabase.from('resources').upsert({
        id: resource.id,
        title: resource.title,
        category: resource.category,
        description: resource.description,
        download_url: resource.downloadUrl,
        file_type: resource.fileType,
        uipath_version: resource.uipathVersion,
        tags: resource.tags,
        download_count: resource.downloadCount
      });
    } catch (e) {
      console.warn('Supabase resource save fallback to local:', e);
    }
    return local;
  },

  deleteResource: async (id: string): Promise<CommunityResource[]> => {
    const local = await localAdapter.deleteResource(id);
    if (!isSupabaseConfigured()) return local;
    try {
      await supabase.from('resources').delete().eq('id', id);
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
        await supabase.from('resources').update({ download_count: res.downloadCount }).eq('id', id);
      }
    } catch (e) {
      console.warn('Supabase download increment fallback to local:', e);
    }
    return local;
  },

  getActivityDrafts: async (): Promise<ActivityDraft[]> => {
    return localAdapter.getActivityDrafts();
  },

  saveActivityDraft: async (draft: ActivityDraft): Promise<ActivityDraft[]> => {
    return localAdapter.saveActivityDraft(draft);
  },

  deleteActivityDraft: async (id: string): Promise<ActivityDraft[]> => {
    return localAdapter.deleteActivityDraft(id);
  },

  updateDraftStatus: async (id: string, status: DraftStatus, notes?: string): Promise<ActivityDraft[]> => {
    return localAdapter.updateDraftStatus(id, status, notes);
  },

  getSettings: async (): Promise<SiteSettings> => {
    return localAdapter.getSettings();
  },

  updateSettings: async (newSettings: Partial<SiteSettings>): Promise<SiteSettings> => {
    return localAdapter.updateSettings(newSettings);
  },

  getAuditLogs: async (): Promise<AuditLogEntry[]> => {
    return localAdapter.getAuditLogs();
  },

  addAuditLog: async (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<AuditLogEntry[]> => {
    return localAdapter.addAuditLog(entry);
  },

  getAnalyticsEvents: async (): Promise<AnalyticsEvent[]> => {
    const local = await localAdapter.getAnalyticsEvents();
    if (!isSupabaseConfigured()) return local;
    try {
      const { data } = await supabase
        .from('analytics_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);

      if (data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          eventType: d.event_type as AnalyticsEventType,
          userId: d.user_id,
          anonymousSessionId: d.anonymous_session_id,
          entityType: d.entity_type,
          entityId: d.entity_id,
          metadata: d.metadata,
          timestamp: d.created_at
        }));
      }
    } catch (e) {
      console.warn('Supabase analytics fetch fallback to local:', e);
    }
    return local;
  },

  recordAnalyticsEvent: async (event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): Promise<AnalyticsEvent[]> => {
    const local = await localAdapter.recordAnalyticsEvent(event);
    if (!isSupabaseConfigured()) return local;
    try {
      await supabase.from('analytics_events').insert({
        event_type: event.eventType,
        user_id: event.userId,
        anonymous_session_id: event.anonymousSessionId,
        entity_type: event.entityType,
        entity_id: event.entityId,
        metadata: event.metadata
      });
    } catch (e) {
      console.warn('Supabase analytics record fallback to local:', e);
    }
    return local;
  },

  getEventsByType: async (type: AnalyticsEventType): Promise<AnalyticsEvent[]> => {
    return localAdapter.getEventsByType(type);
  }
};
