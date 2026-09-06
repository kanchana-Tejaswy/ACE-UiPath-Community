import { isSupabaseConfigured, supabase } from './client';
import { localDatabase } from '../../data/local/localDatabase';
import { activitiesRepository } from '../../data/repositories/activitiesRepository';
import { projectsRepository } from '../../data/repositories/projectsRepository';
import { resourcesRepository } from '../../data/repositories/resourcesRepository';
import { activityDraftsRepository } from '../../data/repositories/activityDraftsRepository';

export interface MigrationReport {
  success: boolean;
  message: string;
  counts: {
    activities: number;
    projects: number;
    resources: number;
    drafts: number;
  };
  errors: string[];
}

export async function migrateLocalToSupabase(): Promise<MigrationReport> {
  const report: MigrationReport = {
    success: false,
    message: '',
    counts: { activities: 0, projects: 0, resources: 0, drafts: 0 },
    errors: []
  };

  if (!isSupabaseConfigured()) {
    report.message = 'Supabase credentials missing or set to placeholders. Local-first mode active.';
    return report;
  }

  try {
    // 1. Migrate Activities
    const activities = activitiesRepository.getAll();
    if (activities.length > 0) {
      const rows = activities.map((act) => ({
        id: act.id,
        slug: act.slug,
        title: act.title,
        category: act.category,
        event_type: act.eventType,
        activity_date: act.date,
        time_start: act.timeStart,
        time_end: act.timeEnd,
        venue: act.venue,
        summary: act.summary,
        full_description_md: act.fullDescriptionMd,
        objectives_text: act.objectives,
        uipath_topics: act.uipathTopicsCovered,
        learning_outcomes: act.learningOutcomes,
        banner_image_url: act.bannerImage,
        recording_url: act.recordingUrl,
        slides_url: act.slidesUrl,
        github_url: act.githubUrl,
        workflow_package_url: act.workflowPackageUrl,
        status: act.status,
        is_featured: act.isFeatured,
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase.from('activities').upsert(rows);
      if (error) {
        report.errors.push(`Activities migration error: ${error.message}`);
      } else {
        report.counts.activities = activities.length;
      }
    }

    // 2. Migrate Projects
    const projects = projectsRepository.getAll();
    if (projects.length > 0) {
      const rows = projects.map((proj) => ({
        id: proj.id,
        slug: proj.slug,
        title: proj.title,
        tagline: proj.tagline,
        summary: proj.summary,
        problem_statement: proj.problemStatement,
        solution_description: proj.solutionDescription,
        uipath_tools_used: proj.uipathToolsUsed,
        roi_metrics: proj.roiMetrics,
        repo_url: proj.repoUrl,
        package_download_url: proj.packageDownloadUrl,
        video_demo_url: proj.videoDemoUrl,
        author_name: proj.authorName,
        author_roll_number: proj.authorRollNumber,
        author_branch: proj.authorBranch,
        status: proj.status,
        upvotes: proj.upvotes,
        download_count: proj.downloadCount,
        created_at: proj.createdAt
      }));

      const { error } = await supabase.from('projects').upsert(rows);
      if (error) {
        report.errors.push(`Projects migration error: ${error.message}`);
      } else {
        report.counts.projects = projects.length;
      }
    }

    // 3. Migrate Resources
    const resources = resourcesRepository.getAll();
    if (resources.length > 0) {
      const rows = resources.map((res) => ({
        id: res.id,
        title: res.title,
        category: res.category,
        description: res.description,
        download_url: res.downloadUrl,
        file_type: res.fileType,
        uipath_version: res.uipathVersion,
        tags: res.tags,
        download_count: res.downloadCount
      }));

      const { error } = await supabase.from('resources').upsert(rows);
      if (error) {
        report.errors.push(`Resources migration error: ${error.message}`);
      } else {
        report.counts.resources = resources.length;
      }
    }

    // 4. Migrate Drafts
    const drafts = activityDraftsRepository.getAll();
    if (drafts.length > 0) {
      report.counts.drafts = drafts.length;
    }

    report.success = report.errors.length === 0;
    report.message = report.success 
      ? `Successfully migrated local dataset to Supabase (${report.counts.activities} activities, ${report.counts.projects} projects, ${report.counts.resources} resources).`
      : `Migration completed with ${report.errors.length} warning(s).`;

    localDatabase.addAuditLog({
      action: 'MIGRATION_LOCAL_TO_SUPABASE',
      entityType: 'MIGRATION',
      entityId: 'cloud_sync',
      description: report.message,
      performedBy: 'System Migration Engine'
    });

    return report;
  } catch (err: any) {
    report.success = false;
    report.message = `Unexpected migration failure: ${err.message}`;
    report.errors.push(err.message);
    return report;
  }
}
