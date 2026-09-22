import { supabase, isSupabaseConfigured } from './client';
import { 
  mapActivityRowToEntity, 
  mapActivityEntityToRow,
  mapProjectRowToEntity, 
  mapProjectEntityToRow,
  mapResourceRowToEntity,
  mapResourceEntityToRow,
  mapLearningPathRowToEntity,
  mapLearningPathEntityToRow,
  mapChallengeRowToEntity,
  mapChallengeEntityToRow,
  mapLeadershipRowToEntity,
  mapLeadershipEntityToRow,
  mapActivityDraftRowToEntity,
  mapActivityDraftEntityToRow,
  mapArticleRowToEntity,
  mapArticleEntityToRow
} from './mappers';
import { 
  Activity, 
  ProjectShowcase, 
  CommunityResource, 
  LearningPath, 
  Challenge, 
  LeadershipMember, 
  SiteSettings, 
  ActivityDraft, 
  DraftStatus,
  AuditLogEntry, 
  AnalyticsEvent,
  AnalyticsEventType,
  Article
} from '../../types';
import { 
  DatabaseActivityRow, 
  DatabaseProjectRow, 
  DatabaseResourceRow,
  DatabaseLearningPathRow,
  DatabaseChallengeRow,
  DatabaseLeadershipRow,
  DatabaseActivityDraftRow,
  DatabaseArticleRow
} from './types';

// ==================================================================
// SITE SETTINGS
// ==================================================================
export async function fetchSettingsFromSupabase(): Promise<SiteSettings | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value_json')
      .eq('key', 'global_config')
      .maybeSingle();

    if (error || !data) {
      return null;
    }
    return data.value_json as SiteSettings;
  } catch (err) {
    console.warn('Failed to query Supabase site settings:', err);
    return null;
  }
}

export async function saveSettingsToSupabase(settings: SiteSettings): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { error } = await supabase
      .from('site_settings')
      .upsert({
        key: 'global_config',
        value_json: settings,
        updated_at: new Date().toISOString()
      });
    if (error) {
      console.error('Supabase site_settings save failed:', error);
      return { success: false, error: error.message || 'Failed to save site settings to Supabase.' };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Failed to save settings to Supabase:', err);
    return { success: false, error: err?.message || 'Network error occurred while saving site settings.' };
  }
}

// ==================================================================
// ACTIVITIES
// ==================================================================
export async function fetchActivitiesFromSupabase(): Promise<Activity[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('activity_date', { ascending: false });

    if (error || !data) {
      return null;
    }
    return (data as DatabaseActivityRow[]).map(mapActivityRowToEntity);
  } catch (err) {
    console.warn('Failed to query Supabase activities:', err);
    return null;
  }
}

export async function saveActivityToSupabase(activity: Activity): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const row = mapActivityEntityToRow(activity);
    const { error } = await supabase.from('activities').upsert(row);
    if (error) {
      console.error('Supabase activity save failed:', error);
      return { success: false, error: error.message || 'Failed to save activity to Supabase.' };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Failed to save activity to Supabase:', err);
    return { success: false, error: err?.message || 'Network error occurred while saving activity.' };
  }
}

export async function deleteActivityFromSupabase(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { error } = await supabase.from('activities').delete().eq('id', id);
    if (error) {
      console.error('Supabase activity delete failed:', error);
      return { success: false, error: error.message || 'Failed to delete activity from Supabase.' };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Failed to delete activity from Supabase:', err);
    return { success: false, error: err?.message || 'Network error occurred while deleting activity.' };
  }
}

// ==================================================================
// PROJECTS
// ==================================================================
export async function fetchProjectsFromSupabase(): Promise<ProjectShowcase[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return null;
    }
    return (data as DatabaseProjectRow[]).map(mapProjectRowToEntity);
  } catch (err) {
    console.warn('Failed to query Supabase projects:', err);
    return null;
  }
}

export async function saveProjectToSupabase(project: ProjectShowcase): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const row = mapProjectEntityToRow(project);
    const { error } = await supabase.from('projects').upsert(row);
    if (error) {
      console.error('Supabase project save failed:', error);
      return { success: false, error: error.message || 'Failed to save project to Supabase.' };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Failed to save project to Supabase:', err);
    return { success: false, error: err?.message || 'Network error occurred while saving project.' };
  }
}

export async function deleteProjectFromSupabase(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
      console.error('Supabase project delete failed:', error);
      return { success: false, error: error.message || 'Failed to delete project from Supabase.' };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Failed to delete project from Supabase:', err);
    return { success: false, error: err?.message || 'Network error occurred while deleting project.' };
  }
}

export async function upvoteProjectInSupabase(id: string, newCount: number): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { error } = await supabase.from('projects').update({ upvotes: newCount }).eq('id', id);
    if (error) {
      console.error('Supabase project upvote failed:', error);
      return { success: false, error: error.message || 'Failed to upvote project in Supabase.' };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Failed to upvote project in Supabase:', err);
    return { success: false, error: err?.message || 'Network error occurred while upvoting project.' };
  }
}

// ==================================================================
// RESOURCES
// ==================================================================
export async function fetchResourcesFromSupabase(): Promise<CommunityResource[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return null;
    }
    return (data as DatabaseResourceRow[]).map(mapResourceRowToEntity);
  } catch (err) {
    console.warn('Failed to query Supabase resources:', err);
    return null;
  }
}

export async function saveResourceToSupabase(resource: CommunityResource): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const row = mapResourceEntityToRow(resource);
    const { error } = await supabase.from('resources').upsert(row);
    if (error) {
      console.error('Supabase resource save failed:', error);
      return { success: false, error: error.message || 'Failed to save resource to Supabase.' };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Failed to save resource to Supabase:', err);
    return { success: false, error: err?.message || 'Network error occurred while saving resource.' };
  }
}

export async function deleteResourceFromSupabase(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { error } = await supabase.from('resources').delete().eq('id', id);
    if (error) {
      console.error('Supabase resource delete failed:', error);
      return { success: false, error: error.message || 'Failed to delete resource from Supabase.' };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Failed to delete resource from Supabase:', err);
    return { success: false, error: err?.message || 'Network error occurred while deleting resource.' };
  }
}

export async function incrementResourceDownloadsInSupabase(id: string, newCount: number): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { error } = await supabase.from('resources').update({ download_count: newCount }).eq('id', id);
    if (error) {
      console.error('Supabase download increment failed:', error);
      return { success: false, error: error.message || 'Failed to increment download count in Supabase.' };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Failed to increment download count in Supabase:', err);
    return { success: false, error: err?.message || 'Network error occurred while incrementing downloads.' };
  }
}

// ==================================================================
// LEARNING PATHS
// ==================================================================
export async function fetchLearningPathsFromSupabase(): Promise<LearningPath[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('learning_paths')
      .select('*')
      .order('order_index', { ascending: true });

    if (error || !data) {
      return null;
    }
    return (data as DatabaseLearningPathRow[]).map(mapLearningPathRowToEntity);
  } catch (err) {
    console.warn('Failed to query Supabase learning paths:', err);
    return null;
  }
}

export async function saveLearningPathToSupabase(path: LearningPath): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const row = mapLearningPathEntityToRow(path);
    const { error } = await supabase.from('learning_paths').upsert(row);
    if (error) {
      console.error('Supabase learning path save failed:', error);
      return { success: false, error: error.message || 'Failed to save learning path to Supabase.' };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Failed to save learning path to Supabase:', err);
    return { success: false, error: err?.message || 'Network error occurred while saving learning path.' };
  }
}

export async function deleteLearningPathFromSupabase(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { error } = await supabase.from('learning_paths').delete().eq('id', id);
    if (error) {
      console.error('Supabase learning path delete failed:', error);
      return { success: false, error: error.message || 'Failed to delete learning path from Supabase.' };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Failed to delete learning path from Supabase:', err);
    return { success: false, error: err?.message || 'Network error occurred while deleting learning path.' };
  }
}

// ==================================================================
// CHALLENGES / HACKATHONS
// ==================================================================
export async function fetchChallengesFromSupabase(): Promise<Challenge[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .order('start_date', { ascending: false });

    if (error || !data) {
      return null;
    }
    return (data as DatabaseChallengeRow[]).map(mapChallengeRowToEntity);
  } catch (err) {
    console.warn('Failed to query Supabase challenges:', err);
    return null;
  }
}

export async function saveChallengeToSupabase(challenge: Challenge): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const row = mapChallengeEntityToRow(challenge);
    const { error } = await supabase.from('challenges').upsert(row);
    if (error) {
      console.error('Supabase challenge save failed:', error);
      return { success: false, error: error.message || 'Failed to save challenge to Supabase.' };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Failed to save challenge to Supabase:', err);
    return { success: false, error: err?.message || 'Network error occurred while saving challenge.' };
  }
}

export async function deleteChallengeFromSupabase(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { error } = await supabase.from('challenges').delete().eq('id', id);
    if (error) {
      console.error('Supabase challenge delete failed:', error);
      return { success: false, error: error.message || 'Failed to delete challenge from Supabase.' };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Failed to delete challenge from Supabase:', err);
    return { success: false, error: err?.message || 'Network error occurred while deleting challenge.' };
  }
}

// ==================================================================
// LEADERSHIP DIRECTORY
// ==================================================================
export async function fetchLeadershipFromSupabase(): Promise<LeadershipMember[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('leadership')
      .select('*')
      .order('order_index', { ascending: true });

    if (error || !data) {
      return null;
    }
    return (data as DatabaseLeadershipRow[]).map(mapLeadershipRowToEntity);
  } catch (err) {
    console.warn('Failed to query Supabase leadership:', err);
    return null;
  }
}

export async function saveLeadershipToSupabase(member: LeadershipMember): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const row = mapLeadershipEntityToRow(member);
    let { error } = await supabase.from('leadership').upsert(row);
    if (error && error.message && error.message.includes('column')) {
      const baseRow = {
        id: row.id,
        name: row.name,
        role_title: row.role_title,
        category: row.category,
        academic_year: row.academic_year,
        avatar_url: row.avatar_url,
        linkedin_url: row.linkedin_url,
        github_url: row.github_url,
        bio: row.bio,
        contributions: row.contributions,
        order_index: row.order_index
      };
      const retry = await supabase.from('leadership').upsert(baseRow);
      error = retry.error;
    }
    if (error) {
      console.error('Supabase leadership save failed:', error);
      return { success: false, error: error.message || 'Database rejected the leadership update.' };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Failed to save leadership to Supabase:', err);
    return { success: false, error: err?.message || 'Network error occurred while saving leadership.' };
  }
}

export async function deleteLeadershipFromSupabase(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { error } = await supabase.from('leadership').delete().eq('id', id);
    if (error) {
      console.error('Supabase leadership delete failed:', error);
      return { success: false, error: error.message || 'Database rejected the leadership deletion.' };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Failed to delete leadership from Supabase:', err);
    return { success: false, error: err?.message || 'Network error occurred while deleting leadership.' };
  }
}

// ==================================================================
// ACTIVITY DRAFTS (Core Team Staging)
// ==================================================================
export async function fetchActivityDraftsFromSupabase(): Promise<ActivityDraft[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('activity_drafts')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error || !data) {
      return null;
    }
    return (data as DatabaseActivityDraftRow[]).map(mapActivityDraftRowToEntity);
  } catch (err) {
    console.warn('Failed to query Supabase activity drafts:', err);
    return null;
  }
}

export async function saveActivityDraftToSupabase(draft: ActivityDraft): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const row = mapActivityDraftEntityToRow(draft);
    const { error } = await supabase.from('activity_drafts').upsert(row);
    if (error) {
      console.error('Supabase draft save failed:', error);
      return { success: false, error: error.message || 'Failed to save activity draft to Supabase.' };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Failed to save activity draft to Supabase:', err);
    return { success: false, error: err?.message || 'Network error occurred while saving activity draft.' };
  }
}

export async function deleteActivityDraftFromSupabase(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { error } = await supabase.from('activity_drafts').delete().eq('id', id);
    if (error) {
      console.error('Supabase draft delete failed:', error);
      return { success: false, error: error.message || 'Failed to delete activity draft from Supabase.' };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Failed to delete activity draft from Supabase:', err);
    return { success: false, error: err?.message || 'Network error occurred while deleting activity draft.' };
  }
}

export async function updateDraftStatusInSupabase(id: string, status: DraftStatus, notes?: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const now = new Date().toISOString();
    const payload: Record<string, any> = {
      status,
      updated_at: now
    };
    if (status === 'SUBMITTED') payload.submitted_at = now;
    if (['APPROVED', 'CHANGES_REQUESTED', 'PUBLISHED'].includes(status)) payload.reviewed_at = now;
    if (notes) payload.review_notes = notes;

    const { error } = await supabase.from('activity_drafts').update(payload).eq('id', id);
    if (error) {
      console.error('Supabase draft status update failed:', error);
      return { success: false, error: error.message || 'Failed to update draft status in Supabase.' };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Failed to update draft status in Supabase:', err);
    return { success: false, error: err?.message || 'Network error occurred while updating draft status.' };
  }
}

// ==================================================================
// AUDIT LOGS
// ==================================================================
export async function fetchAuditLogsFromSupabase(): Promise<AuditLogEntry[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);

    if (error || !data || data.length === 0) {
      return null;
    }
    return data.map((d: any) => ({
      id: d.id,
      timestamp: d.created_at,
      action: d.action,
      entityType: d.entity_type,
      entityId: d.entity_id,
      description: d.description,
      performedBy: d.performed_by
    }));
  } catch (err) {
    console.warn('Failed to query Supabase audit logs:', err);
    return null;
  }
}

export async function saveAuditLogToSupabase(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { error } = await supabase.from('audit_logs').insert({
      action: entry.action,
      entity_type: entry.entityType,
      entity_id: entry.entityId,
      description: entry.description,
      performed_by: entry.performedBy
    });
    if (error) {
      console.warn('Supabase audit log insert failed:', error);
      return { success: false, error: error.message || 'Failed to insert audit log in Supabase.' };
    }
    return { success: true };
  } catch (err: any) {
    console.warn('Failed to insert audit log in Supabase:', err);
    return { success: false, error: err?.message || 'Network error occurred while saving audit log.' };
  }
}

// ==================================================================
// ANALYTICS EVENTS (Telemetry)
// ==================================================================
export async function fetchAnalyticsEventsFromSupabase(): Promise<AnalyticsEvent[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('analytics_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);

    if (error || !data || data.length === 0) {
      return null;
    }
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
  } catch (err) {
    console.warn('Failed to query Supabase analytics events:', err);
    return null;
  }
}

export async function recordAnalyticsEventToSupabase(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { error } = await supabase.from('analytics_events').insert({
      event_type: event.eventType,
      user_id: event.userId,
      anonymous_session_id: event.anonymousSessionId,
      entity_type: event.entityType,
      entity_id: event.entityId,
      metadata: event.metadata
    });
    if (error) {
      console.warn('Supabase analytics event insert failed:', error);
      return { success: false, error: error.message || 'Failed to record analytics event in Supabase.' };
    }
    return { success: true };
  } catch (err: any) {
    console.warn('Failed to record analytics event in Supabase:', err);
    return { success: false, error: err?.message || 'Network error occurred while recording analytics event.' };
  }
}

// ==================================================================
// ARTICLES & TECHNICAL WRITE-UPS
// ==================================================================
export async function fetchArticlesFromSupabase(): Promise<Article[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('published_at', { ascending: false, nullsFirst: false });

    if (error || !data) {
      return null;
    }
    return (data as DatabaseArticleRow[]).map(mapArticleRowToEntity);
  } catch (err) {
    console.warn('Failed to query Supabase articles:', err);
    return null;
  }
}

export async function saveArticleToSupabase(article: Article): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const row = mapArticleEntityToRow(article);

    // If featuring this article, ensure any other featured articles in Supabase are unfeatured
    if (article.isFeatured) {
      const { error: unfeatureError } = await supabase
        .from('articles')
        .update({ is_featured: false })
        .neq('id', article.id)
        .eq('is_featured', true);
      if (unfeatureError) {
        console.warn('Supabase unfeature previous articles warning:', unfeatureError);
      }
    }

    const { error } = await supabase
      .from('articles')
      .upsert({
        ...row,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Supabase article upsert error:', error);
      return { success: false, error: error.message || 'Failed to save article to Supabase.' };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Failed to save article to Supabase:', err);
    return { success: false, error: err?.message || 'Network error occurred while saving article.' };
  }
}

export async function deleteArticleFromSupabase(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase article delete error:', error);
      return { success: false, error: error.message || 'Failed to delete article from Supabase.' };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Failed to delete article from Supabase:', err);
    return { success: false, error: err?.message || 'Network error occurred while deleting article.' };
  }
}

export async function incrementArticleViewsInSupabase(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    // Primary: Call atomic, secured RPC
    const { data, error } = await supabase.rpc('increment_article_views', { target_article_id: id });
    if (!error) return { success: true };

    // Fallback if RPC is not yet applied in environment
    const { data: rowData } = await supabase
      .from('articles')
      .select('views')
      .eq('id', id)
      .maybeSingle();

    const currentViews = rowData?.views || 0;
    const { error: updateError } = await supabase
      .from('articles')
      .update({ views: currentViews + 1 })
      .eq('id', id);

    if (updateError) {
      console.warn('Supabase fallback article view increment error:', updateError);
      return { success: false, error: updateError.message || 'Failed to increment article views.' };
    }
    return { success: true };
  } catch (err: any) {
    console.warn('Failed to increment article views in Supabase:', err);
    return { success: false, error: err?.message || 'Network error occurred while incrementing article views.' };
  }
}

/**
 * Upload article cover image to Supabase Storage (blog-media or activities-media)
 * Returns the public URL if uploaded, or generates a local object URL for offline/preview mode.
 */
export async function uploadArticleCoverImage(file: File): Promise<{ url: string | null; error?: string }> {
  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (!validTypes.includes(file.type)) {
    return { url: null, error: 'Unsupported file format. Please upload a PNG, JPEG, WEBP, or SVG image.' };
  }

  // 10 MB limit
  if (file.size > 10 * 1024 * 1024) {
    return { url: null, error: 'File size exceeds 10MB limit. Please upload a smaller image.' };
  }

  if (isSupabaseConfigured()) {
    try {
      const sanitizedName = file.name.toLowerCase().replace(/[^a-z0-9.]/g, '-');
      const filePath = `covers/${Date.now()}-${sanitizedName}`;

      // Attempt upload to 'blog-media', fallback to 'activities-media'
      let uploadRes = await supabase.storage.from('blog-media').upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

      let bucketUsed = 'blog-media';
      if (uploadRes.error) {
        uploadRes = await supabase.storage.from('activities-media').upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
        bucketUsed = 'activities-media';
      }

      if (uploadRes.error) {
        console.warn('Supabase storage upload error:', uploadRes.error);
        // Fallback to local Object URL for seamless editing
        const localUrl = URL.createObjectURL(file);
        return { url: localUrl };
      }

      const { data: publicData } = supabase.storage.from(bucketUsed).getPublicUrl(filePath);
      return { url: publicData.publicUrl };
    } catch (err: any) {
      console.warn('Cover image upload failed, falling back to local preview:', err);
      const localUrl = URL.createObjectURL(file);
      return { url: localUrl };
    }
  }

  // Local/Offline development mode fallback: Object URL
  const localUrl = URL.createObjectURL(file);
  return { url: localUrl };
}

export async function uploadMemberAvatarImage(file: File, memberId?: string): Promise<{ url: string | null; error?: string }> {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (!validTypes.includes(file.type)) {
    return { url: null, error: 'Unsupported file format. Please upload a PNG, JPEG, WEBP, or SVG image.' };
  }

  // 10 MB limit
  if (file.size > 10 * 1024 * 1024) {
    return { url: null, error: 'File size exceeds 10MB limit. Please upload a smaller image.' };
  }

  if (isSupabaseConfigured()) {
    try {
      const sanitizedName = file.name.toLowerCase().replace(/[^a-z0-9.]/g, '-');
      const folderId = memberId ? memberId.replace(/[^a-zA-Z0-9_-]/g, '') : 'avatars';
      const filePath = `leadership/${folderId}/${Date.now()}-${sanitizedName}`;

      let uploadRes = await supabase.storage.from('leadership-media').upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

      let bucketUsed = 'leadership-media';
      if (uploadRes.error) {
        uploadRes = await supabase.storage.from('blog-media').upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
        bucketUsed = 'blog-media';
      }

      if (uploadRes.error) {
        console.error('Supabase avatar upload failed:', uploadRes.error);
        return { url: null, error: uploadRes.error.message || 'Failed to upload photo to Supabase storage.' };
      }

      const { data: publicData } = supabase.storage.from(bucketUsed).getPublicUrl(filePath);
      return { url: publicData.publicUrl };
    } catch (err: any) {
      console.error('Avatar upload exception:', err);
      return { url: null, error: err?.message || 'Network error occurred during photo upload.' };
    }
  }

  return { url: null, error: 'Supabase storage is not configured.' };
}

