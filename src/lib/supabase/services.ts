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

export async function saveSettingsToSupabase(settings: SiteSettings): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase
      .from('site_settings')
      .upsert({
        key: 'global_config',
        value_json: settings,
        updated_at: new Date().toISOString()
      });
    if (error) {
      console.warn('Supabase site_settings save warning:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to save settings to Supabase:', err);
    return false;
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

    if (error || !data || data.length === 0) {
      return null;
    }
    return (data as DatabaseActivityRow[]).map(mapActivityRowToEntity);
  } catch (err) {
    console.warn('Failed to query Supabase activities:', err);
    return null;
  }
}

export async function saveActivityToSupabase(activity: Activity): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const row = mapActivityEntityToRow(activity);
    const { error } = await supabase.from('activities').upsert(row);
    if (error) {
      console.warn('Supabase activity save warning:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to save activity to Supabase:', err);
    return false;
  }
}

export async function deleteActivityFromSupabase(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('activities').delete().eq('id', id);
    return !error;
  } catch (err) {
    console.error('Failed to delete activity from Supabase:', err);
    return false;
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

    if (error || !data || data.length === 0) {
      return null;
    }
    return (data as DatabaseProjectRow[]).map(mapProjectRowToEntity);
  } catch (err) {
    console.warn('Failed to query Supabase projects:', err);
    return null;
  }
}

export async function saveProjectToSupabase(project: ProjectShowcase): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const row = mapProjectEntityToRow(project);
    const { error } = await supabase.from('projects').upsert(row);
    if (error) {
      console.warn('Supabase project save warning:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to save project to Supabase:', err);
    return false;
  }
}

export async function deleteProjectFromSupabase(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    return !error;
  } catch (err) {
    console.error('Failed to delete project from Supabase:', err);
    return false;
  }
}

export async function upvoteProjectInSupabase(id: string, newCount: number): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('projects').update({ upvotes: newCount }).eq('id', id);
    return !error;
  } catch (err) {
    console.error('Failed to upvote project in Supabase:', err);
    return false;
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

    if (error || !data || data.length === 0) {
      return null;
    }
    return (data as DatabaseResourceRow[]).map(mapResourceRowToEntity);
  } catch (err) {
    console.warn('Failed to query Supabase resources:', err);
    return null;
  }
}

export async function saveResourceToSupabase(resource: CommunityResource): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const row = mapResourceEntityToRow(resource);
    const { error } = await supabase.from('resources').upsert(row);
    if (error) {
      console.warn('Supabase resource save warning:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to save resource to Supabase:', err);
    return false;
  }
}

export async function deleteResourceFromSupabase(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('resources').delete().eq('id', id);
    return !error;
  } catch (err) {
    console.error('Failed to delete resource from Supabase:', err);
    return false;
  }
}

export async function incrementResourceDownloadsInSupabase(id: string, newCount: number): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('resources').update({ download_count: newCount }).eq('id', id);
    return !error;
  } catch (err) {
    console.error('Failed to increment download count in Supabase:', err);
    return false;
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

    if (error || !data || data.length === 0) {
      return null;
    }
    return (data as DatabaseLearningPathRow[]).map(mapLearningPathRowToEntity);
  } catch (err) {
    console.warn('Failed to query Supabase learning paths:', err);
    return null;
  }
}

export async function saveLearningPathToSupabase(path: LearningPath): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const row = mapLearningPathEntityToRow(path);
    const { error } = await supabase.from('learning_paths').upsert(row);
    if (error) {
      console.warn('Supabase learning path save warning:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to save learning path to Supabase:', err);
    return false;
  }
}

export async function deleteLearningPathFromSupabase(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('learning_paths').delete().eq('id', id);
    return !error;
  } catch (err) {
    console.error('Failed to delete learning path from Supabase:', err);
    return false;
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

    if (error || !data || data.length === 0) {
      return null;
    }
    return (data as DatabaseChallengeRow[]).map(mapChallengeRowToEntity);
  } catch (err) {
    console.warn('Failed to query Supabase challenges:', err);
    return null;
  }
}

export async function saveChallengeToSupabase(challenge: Challenge): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const row = mapChallengeEntityToRow(challenge);
    const { error } = await supabase.from('challenges').upsert(row);
    if (error) {
      console.warn('Supabase challenge save warning:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to save challenge to Supabase:', err);
    return false;
  }
}

export async function deleteChallengeFromSupabase(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('challenges').delete().eq('id', id);
    return !error;
  } catch (err) {
    console.error('Failed to delete challenge from Supabase:', err);
    return false;
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

    if (error || !data || data.length === 0) {
      return null;
    }
    return (data as DatabaseLeadershipRow[]).map(mapLeadershipRowToEntity);
  } catch (err) {
    console.warn('Failed to query Supabase leadership:', err);
    return null;
  }
}

export async function saveLeadershipToSupabase(member: LeadershipMember): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
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
      console.warn('Supabase leadership save warning:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to save leadership to Supabase:', err);
    return false;
  }
}

export async function deleteLeadershipFromSupabase(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('leadership').delete().eq('id', id);
    return !error;
  } catch (err) {
    console.error('Failed to delete leadership from Supabase:', err);
    return false;
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

    if (error || !data || data.length === 0) {
      return null;
    }
    return (data as DatabaseActivityDraftRow[]).map(mapActivityDraftRowToEntity);
  } catch (err) {
    console.warn('Failed to query Supabase activity drafts:', err);
    return null;
  }
}

export async function saveActivityDraftToSupabase(draft: ActivityDraft): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const row = mapActivityDraftEntityToRow(draft);
    const { error } = await supabase.from('activity_drafts').upsert(row);
    if (error) {
      console.warn('Supabase draft save warning:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to save activity draft to Supabase:', err);
    return false;
  }
}

export async function deleteActivityDraftFromSupabase(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('activity_drafts').delete().eq('id', id);
    return !error;
  } catch (err) {
    console.error('Failed to delete activity draft from Supabase:', err);
    return false;
  }
}

export async function updateDraftStatusInSupabase(id: string, status: DraftStatus, notes?: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
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
    return !error;
  } catch (err) {
    console.error('Failed to update draft status in Supabase:', err);
    return false;
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

export async function saveAuditLogToSupabase(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('audit_logs').insert({
      action: entry.action,
      entity_type: entry.entityType,
      entity_id: entry.entityId,
      description: entry.description,
      performed_by: entry.performedBy
    });
    return !error;
  } catch (err) {
    console.warn('Failed to insert audit log in Supabase:', err);
    return false;
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

export async function recordAnalyticsEventToSupabase(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('analytics_events').insert({
      event_type: event.eventType,
      user_id: event.userId,
      anonymous_session_id: event.anonymousSessionId,
      entity_type: event.entityType,
      entity_id: event.entityId,
      metadata: event.metadata
    });
    return !error;
  } catch (err) {
    console.warn('Failed to record analytics event in Supabase:', err);
    return false;
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

    if (error || !data || data.length === 0) {
      return null;
    }
    return (data as DatabaseArticleRow[]).map(mapArticleRowToEntity);
  } catch (err) {
    console.warn('Failed to query Supabase articles:', err);
    return null;
  }
}

export async function saveArticleToSupabase(article: Article): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
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
      console.warn('Supabase article upsert error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to save article to Supabase:', err);
    return false;
  }
}

export async function deleteArticleFromSupabase(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) {
      console.warn('Supabase article delete error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to delete article from Supabase:', err);
    return false;
  }
}

export async function incrementArticleViewsInSupabase(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    // Primary: Call atomic, secured RPC
    const { data, error } = await supabase.rpc('increment_article_views', { target_article_id: id });
    if (!error) return true;

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

    return !updateError;
  } catch (err) {
    console.warn('Failed to increment article views in Supabase:', err);
    return false;
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

/**
 * Upload team member avatar image to Supabase Storage ('blog-media' bucket)
 * Returns public URL, falling back to local Object URL for offline/preview.
 */
export async function uploadMemberAvatarImage(file: File): Promise<{ url: string | null; error?: string }> {
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
      const filePath = `avatars/${Date.now()}-${sanitizedName}`;

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
        console.warn('Supabase avatar upload warning, falling back to local preview:', uploadRes.error);
        const localUrl = URL.createObjectURL(file);
        return { url: localUrl };
      }

      const { data: publicData } = supabase.storage.from(bucketUsed).getPublicUrl(filePath);
      return { url: publicData.publicUrl };
    } catch (err: any) {
      console.warn('Avatar upload failed, falling back to local preview:', err);
      const localUrl = URL.createObjectURL(file);
      return { url: localUrl };
    }
  }

  const localUrl = URL.createObjectURL(file);
  return { url: localUrl };
}

