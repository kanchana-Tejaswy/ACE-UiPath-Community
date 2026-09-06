import { supabase, isSupabaseConfigured } from './client';
import { mapActivityRowToEntity, mapProjectRowToEntity, mapResourceRowToEntity } from './mappers';
import { Activity, ProjectShowcase, CommunityResource } from '../../types';
import { DatabaseActivityRow, DatabaseProjectRow, DatabaseResourceRow } from './types';

export async function fetchActivitiesFromSupabase(): Promise<Activity[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('activity_date', { ascending: false });

    if (error || !data) {
      console.warn('Supabase fetch activities error:', error);
      return null;
    }

    return (data as DatabaseActivityRow[]).map(mapActivityRowToEntity);
  } catch (err) {
    console.error('Failed to query Supabase activities:', err);
    return null;
  }
}

export async function fetchProjectsFromSupabase(): Promise<ProjectShowcase[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.warn('Supabase fetch projects error:', error);
      return null;
    }

    return (data as DatabaseProjectRow[]).map(mapProjectRowToEntity);
  } catch (err) {
    console.error('Failed to query Supabase projects:', err);
    return null;
  }
}

export async function fetchResourcesFromSupabase(): Promise<CommunityResource[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.warn('Supabase fetch resources error:', error);
      return null;
    }

    return (data as DatabaseResourceRow[]).map(mapResourceRowToEntity);
  } catch (err) {
    console.error('Failed to query Supabase resources:', err);
    return null;
  }
}
