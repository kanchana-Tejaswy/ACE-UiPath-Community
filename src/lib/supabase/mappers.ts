import { Activity, ProjectShowcase, CommunityResource } from '../../types';
import { DatabaseActivityRow, DatabaseProjectRow, DatabaseResourceRow } from './types';

export function mapActivityRowToEntity(row: DatabaseActivityRow): Activity {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    eventType: row.event_type,
    date: row.activity_date,
    timeStart: row.time_start,
    timeEnd: row.time_end,
    venue: row.venue,
    summary: row.summary,
    fullDescriptionMd: row.full_description_md,
    objectives: row.objectives_text || [],
    agenda: [],
    uipathTopicsCovered: row.uipath_topics || [],
    learningOutcomes: row.learning_outcomes || [],
    bannerImage: row.banner_image_url,
    galleryImages: [row.banner_image_url],
    recordingUrl: row.recording_url,
    slidesUrl: row.slides_url,
    githubUrl: row.github_url,
    workflowPackageUrl: row.workflow_package_url,
    status: row.status,
    isFeatured: row.is_featured,
    speakers: [],
    achievements: [],
    createdAt: row.created_at
  };
}

export function mapProjectRowToEntity(row: DatabaseProjectRow): ProjectShowcase {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    tagline: row.tagline,
    summary: row.summary,
    problemStatement: row.problem_statement,
    solutionDescription: row.solution_description,
    uipathToolsUsed: row.uipath_tools_used || [],
    roiMetrics: row.roi_metrics,
    repoUrl: row.repo_url,
    packageDownloadUrl: row.package_download_url,
    videoDemoUrl: row.video_demo_url,
    previewImages: ['https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'],
    authorName: row.author_name,
    authorRollNumber: row.author_roll_number,
    authorBranch: row.author_branch,
    status: row.status,
    downloadCount: row.download_count,
    upvotes: row.upvotes,
    createdAt: row.created_at
  };
}

export function mapResourceRowToEntity(row: DatabaseResourceRow): CommunityResource {
  return {
    id: row.id,
    title: row.title,
    category: row.category as any,
    description: row.description,
    uipathVersion: row.uipath_version,
    downloadUrl: row.download_url,
    fileType: row.file_type as any,
    tags: row.tags || [],
    downloadCount: row.download_count,
    createdAt: row.created_at
  };
}
