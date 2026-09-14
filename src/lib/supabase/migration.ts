import { isSupabaseConfigured, supabase } from './client';
import { localDatabase } from '../../data/local/localDatabase';
import { activitiesRepository } from '../../data/repositories/activitiesRepository';
import { projectsRepository } from '../../data/repositories/projectsRepository';
import { resourcesRepository } from '../../data/repositories/resourcesRepository';
import { learningRepository } from '../../data/repositories/learningRepository';
import { activityDraftsRepository } from '../../data/repositories/activityDraftsRepository';
import { settingsRepository } from '../../data/repositories/settingsRepository';
import { 
  mapActivityEntityToRow, 
  mapProjectEntityToRow, 
  mapResourceEntityToRow, 
  mapLearningPathEntityToRow, 
  mapChallengeEntityToRow, 
  mapLeadershipEntityToRow, 
  mapActivityDraftEntityToRow 
} from './mappers';

export interface MigrationReport {
  success: boolean;
  message: string;
  counts: {
    settings: number;
    activities: number;
    projects: number;
    learningPaths: number;
    challenges: number;
    resources: number;
    leadership: number;
    drafts: number;
  };
  errors: string[];
}

export async function migrateLocalToSupabase(): Promise<MigrationReport> {
  const report: MigrationReport = {
    success: false,
    message: '',
    counts: { 
      settings: 0, 
      activities: 0, 
      projects: 0, 
      learningPaths: 0, 
      challenges: 0, 
      resources: 0, 
      leadership: 0, 
      drafts: 0 
    },
    errors: []
  };

  if (!isSupabaseConfigured()) {
    report.message = 'Supabase credentials missing or set to placeholders. Local-first mode active.';
    return report;
  }

  try {
    // 1. Migrate Site Settings
    const settings = settingsRepository.get();
    if (settings) {
      const { error } = await supabase.from('site_settings').upsert({
        key: 'global_config',
        value_json: settings,
        updated_at: new Date().toISOString()
      });
      if (error) {
        report.errors.push(`Site Settings migration error: ${error.message}`);
      } else {
        report.counts.settings = 1;
      }
    }

    // 2. Migrate Activities
    const activities = activitiesRepository.getAll();
    if (activities.length > 0) {
      const rows = activities.map(mapActivityEntityToRow);
      const { error } = await supabase.from('activities').upsert(rows);
      if (error) {
        report.errors.push(`Activities migration error: ${error.message}`);
      } else {
        report.counts.activities = activities.length;
      }
    }

    // 3. Migrate Projects
    const projects = projectsRepository.getAll();
    if (projects.length > 0) {
      const rows = projects.map(mapProjectEntityToRow);
      const { error } = await supabase.from('projects').upsert(rows);
      if (error) {
        report.errors.push(`Projects migration error: ${error.message}`);
      } else {
        report.counts.projects = projects.length;
      }
    }

    // 4. Migrate Learning Paths
    const paths = learningRepository.getAll();
    if (paths.length > 0) {
      const rows = paths.map(mapLearningPathEntityToRow);
      const { error } = await supabase.from('learning_paths').upsert(rows);
      if (error) {
        report.errors.push(`Learning Paths migration error: ${error.message}`);
      } else {
        report.counts.learningPaths = paths.length;
      }
    }

    // 5. Migrate Challenges
    const challenges = localDatabase.getChallenges();
    if (challenges.length > 0) {
      const rows = challenges.map(mapChallengeEntityToRow);
      const { error } = await supabase.from('challenges').upsert(rows);
      if (error) {
        report.errors.push(`Challenges migration error: ${error.message}`);
      } else {
        report.counts.challenges = challenges.length;
      }
    }

    // 6. Migrate Resources
    const resources = resourcesRepository.getAll();
    if (resources.length > 0) {
      const rows = resources.map(mapResourceEntityToRow);
      const { error } = await supabase.from('resources').upsert(rows);
      if (error) {
        report.errors.push(`Resources migration error: ${error.message}`);
      } else {
        report.counts.resources = resources.length;
      }
    }

    // 7. Migrate Leadership
    const leadership = localDatabase.getLeadership();
    if (leadership.length > 0) {
      const rows = leadership.map(mapLeadershipEntityToRow);
      const { error } = await supabase.from('leadership').upsert(rows);
      if (error) {
        report.errors.push(`Leadership migration error: ${error.message}`);
      } else {
        report.counts.leadership = leadership.length;
      }
    }

    // 8. Migrate Activity Drafts
    const drafts = activityDraftsRepository.getAll();
    if (drafts.length > 0) {
      const rows = drafts.map(mapActivityDraftEntityToRow);
      const { error } = await supabase.from('activity_drafts').upsert(rows);
      if (error) {
        report.errors.push(`Activity Drafts migration error: ${error.message}`);
      } else {
        report.counts.drafts = drafts.length;
      }
    }

    report.success = report.errors.length === 0;
    report.message = report.success 
      ? `Successfully migrated local dataset to Supabase (${report.counts.activities} activities, ${report.counts.projects} projects, ${report.counts.resources} resources, ${report.counts.learningPaths} paths, ${report.counts.challenges} challenges).`
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
