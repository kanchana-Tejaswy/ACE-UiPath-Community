// PostgreSQL Database Schema Types matching Supabase tables
import { ActivityAgendaItem, ActivitySpeaker, ActivityAchievement, LearningModule } from '../../types';

export interface DatabaseActivityRow {
  id: string;
  slug: string;
  title: string;
  category: string;
  event_type: string;
  activity_date: string;
  time_start: string;
  time_end: string;
  venue: string;
  summary: string;
  full_description_md: string;
  objectives_text?: string[];
  agenda?: ActivityAgendaItem[];
  uipath_topics?: string[];
  learning_outcomes?: string[];
  banner_image_url: string;
  gallery_images?: string[];
  recording_url?: string;
  slides_url?: string;
  github_url?: string;
  workflow_package_url?: string;
  status: string;
  is_featured: boolean;
  speakers?: ActivitySpeaker[];
  achievements?: ActivityAchievement[];
  created_at?: string;
  updated_at?: string;
}

export interface DatabaseProjectRow {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  problem_statement: string;
  solution_description: string;
  uipath_tools_used?: string[];
  roi_metrics: string;
  repo_url?: string;
  package_download_url?: string;
  video_demo_url?: string;
  preview_images?: string[];
  author_name: string;
  author_roll_number?: string;
  author_branch?: string;
  author_avatar?: string;
  author_linkedin?: string;
  status: 'Pending' | 'Approved' | 'Featured';
  download_count: number;
  upvotes: number;
  created_at?: string;
}

export interface DatabaseResourceRow {
  id: string;
  title: string;
  category: string;
  description: string;
  uipath_version: string;
  download_url: string;
  file_type: string;
  tags?: string[];
  download_count: number;
  created_at?: string;
}

export interface DatabaseSiteSettingsRow {
  key: string;
  value_json: any;
  updated_at?: string;
}

export interface DatabaseLearningPathRow {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  level: string;
  target_audience: string;
  estimated_hours: number;
  icon_name: string;
  description: string;
  order_index: number;
  is_published: boolean;
  modules?: LearningModule[];
  created_at?: string;
}

export interface DatabaseChallengeRow {
  id: string;
  slug: string;
  title: string;
  theme: string;
  category: string;
  status: string;
  start_date: string;
  end_date: string;
  start_time?: string;
  end_time?: string;
  registration_deadline?: string;
  registration_deadline_time?: string;
  registration_url?: string;
  community_channel_url?: string;
  banner_image_url?: string;
  is_featured?: boolean;
  prize_pool: string;
  description_md: string;
  rules_md: string;
  evaluation_criteria?: string[];
  starter_dataset_url?: string;
  submission_count: number;
  recordings?: any[];
  use_cases?: any[];
  reference_materials?: any[];
  winners?: any[];
  created_at?: string;
}

export interface DatabaseLeadershipRow {
  id: string;
  name: string;
  role_title: string;
  category: string;
  roster_categories?: string[];
  academic_year: string;
  avatar_url: string;
  start_year?: string;
  end_year?: string;
  is_active?: boolean;
  department?: string;
  linkedin_url?: string;
  github_url?: string;
  uipath_profile_url?: string;
  bio: string;
  contributions?: string[];
  order_index: number;
  created_at?: string;
}

export interface DatabaseActivityDraftRow {
  id: string;
  slug: string;
  title: string;
  category: string;
  event_type: string;
  activity_date: string;
  time_start: string;
  time_end: string;
  venue: string;
  summary: string;
  full_description_md?: string;
  objectives?: string[];
  agenda?: any[];
  uipath_topics_covered?: string[];
  learning_outcomes?: string[];
  banner_image?: string;
  gallery_images?: string[];
  recording_url?: string;
  slides_url?: string;
  github_url?: string;
  workflow_package_url?: string;
  speakers?: any[];
  achievements?: any[];
  status: string;
  is_featured: boolean;
  created_by: string;
  created_at?: string;
  updated_at?: string;
  submitted_at?: string;
  reviewed_at?: string;
  review_notes?: string;
  completion_percentage: number;
}

export interface DatabaseAuditLogRow {
  id: string;
  user_id?: string;
  action: string;
  entity_type: string;
  entity_id: string;
  description: string;
  performed_by: string;
  created_at?: string;
}

export interface DatabaseAnalyticsEventRow {
  id: string;
  event_type: string;
  user_id?: string;
  anonymous_session_id?: string;
  entity_type?: string;
  entity_id?: string;
  metadata?: Record<string, any>;
  created_at?: string;
}

export interface DatabaseArticleRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image?: string;
  aspect_ratio?: string;
  category: string;
  author_name: string;
  author_role: string;
  status: string;
  scheduled_at?: string;
  published_at?: string;
  is_featured: boolean;
  views: number;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

