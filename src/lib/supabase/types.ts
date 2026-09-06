// PostgreSQL Database Schema Types matching Supabase tables

export interface DatabaseActivityRow {
  id: string;
  slug: string;
  title: string;
  category: 'Workshop' | 'Hackathon' | 'Certification' | 'Bootcamp' | 'Guest Lecture';
  event_type: 'Offline' | 'Online' | 'Hybrid';
  activity_date: string;
  time_start: string;
  time_end: string;
  venue: string;
  summary: string;
  full_description_md: string;
  objectives_text: string[];
  uipath_topics: string[];
  learning_outcomes: string[];
  banner_image_url: string;
  recording_url?: string;
  slides_url?: string;
  github_url?: string;
  workflow_package_url?: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Archived';
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseSpeakerRow {
  id: string;
  name: string;
  role_title: string;
  organization: string;
  avatar_url: string;
  linkedin_url?: string;
  bio?: string;
}

export interface DatabaseAgendaRow {
  id: string;
  activity_id: string;
  time_slot: string;
  title: string;
  description: string;
  speaker_name?: string;
  order_index: number;
}

export interface DatabaseProjectRow {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  problem_statement: string;
  solution_description: string;
  uipath_tools_used: string[];
  roi_metrics: string;
  repo_url?: string;
  package_download_url?: string;
  video_demo_url?: string;
  author_id?: string;
  author_name: string;
  author_roll_number?: string;
  author_branch?: string;
  status: 'Pending' | 'Approved' | 'Featured';
  download_count: number;
  upvotes: number;
  created_at: string;
}

export interface DatabaseResourceRow {
  id: string;
  title: string;
  category: 'Template' | 'Cheatsheet' | 'Exam Questions' | 'Guide';
  description: string;
  uipath_version: string;
  download_url: string;
  file_type: string;
  tags: string[];
  download_count: number;
  created_at: string;
}
