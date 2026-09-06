import {
  Activity,
  LearningPath,
  ProjectShowcase,
  Challenge,
  CommunityResource,
  LeadershipMember,
  SiteSettings,
  User,
  AuditLogEntry,
  AnalyticsEvent,
  ActivityDraft
} from '../../types';
import {
  INITIAL_ACTIVITIES,
  INITIAL_LEARNING_PATHS,
  INITIAL_PROJECTS,
  INITIAL_CHALLENGES,
  INITIAL_RESOURCES,
  INITIAL_LEADERSHIP,
  INITIAL_SETTINGS,
  INITIAL_USERS
} from '../initialData';

const STORAGE_KEYS = {
  ACTIVITIES: 'ace_uipath_activities_v2',
  LEARNING_PATHS: 'ace_uipath_learning_paths_v2',
  PROJECTS: 'ace_uipath_projects_v2',
  CHALLENGES: 'ace_uipath_challenges_v2',
  RESOURCES: 'ace_uipath_resources_v2',
  LEADERSHIP: 'ace_uipath_leadership_v2',
  SETTINGS: 'ace_uipath_settings_v2',
  USERS: 'ace_uipath_users_v2',
  CURRENT_USER_ID: 'ace_uipath_current_user_id_v2',
  AUDIT_LOGS: 'ace_uipath_audit_logs_v2',
  COMPLETED_MODULES: 'ace_uipath_completed_modules_v2',
  ACTIVITY_DRAFTS: 'ace_uipath_activity_drafts_v2',
  ANALYTICS_EVENTS: 'ace_uipath_analytics_events_v2'
};

const MAX_ANALYTICS_EVENTS = 500;

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

export const localDatabase = {
  getActivities: (): Activity[] => getItem(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES),
  saveActivities: (data: Activity[]): void => setItem(STORAGE_KEYS.ACTIVITIES, data),

  getLearningPaths: (): LearningPath[] => getItem(STORAGE_KEYS.LEARNING_PATHS, INITIAL_LEARNING_PATHS),
  saveLearningPaths: (data: LearningPath[]): void => setItem(STORAGE_KEYS.LEARNING_PATHS, data),

  getProjects: (): ProjectShowcase[] => getItem(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS),
  saveProjects: (data: ProjectShowcase[]): void => setItem(STORAGE_KEYS.PROJECTS, data),

  getChallenges: (): Challenge[] => getItem(STORAGE_KEYS.CHALLENGES, INITIAL_CHALLENGES),
  saveChallenges: (data: Challenge[]): void => setItem(STORAGE_KEYS.CHALLENGES, data),

  getResources: (): CommunityResource[] => getItem(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES),
  saveResources: (data: CommunityResource[]): void => setItem(STORAGE_KEYS.RESOURCES, data),

  getLeadership: (): LeadershipMember[] => getItem(STORAGE_KEYS.LEADERSHIP, INITIAL_LEADERSHIP),
  saveLeadership: (data: LeadershipMember[]): void => setItem(STORAGE_KEYS.LEADERSHIP, data),

  getSettings: (): SiteSettings => {
    const loaded = getItem<SiteSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    return {
      ...INITIAL_SETTINGS,
      ...loaded,
      statistics: loaded?.statistics && loaded.statistics.length > 0 ? loaded.statistics : INITIAL_SETTINGS.statistics,
      announcements: loaded?.announcements && loaded.announcements.length > 0 ? loaded.announcements : INITIAL_SETTINGS.announcements,
      timelineMilestones: loaded?.timelineMilestones && loaded.timelineMilestones.length > 0 ? loaded.timelineMilestones : INITIAL_SETTINGS.timelineMilestones
    };
  },
  saveSettings: (data: SiteSettings): void => setItem(STORAGE_KEYS.SETTINGS, data),

  getUsers: (): User[] => getItem(STORAGE_KEYS.USERS, INITIAL_USERS),
  saveUsers: (data: User[]): void => setItem(STORAGE_KEYS.USERS, data),

  getCurrentUserId: (): string => {
    if (typeof window !== 'undefined') {
      const authSession = window.sessionStorage.getItem('ace_uipath_authenticated_session');
      if (!authSession) {
        return 'user_student_1';
      }
      return authSession;
    }
    return getItem(STORAGE_KEYS.CURRENT_USER_ID, 'user_student_1');
  },
  saveCurrentUserId: (id: string): void => {
    setItem(STORAGE_KEYS.CURRENT_USER_ID, id);
    if (typeof window !== 'undefined') {
      if (id === 'user_student_1') {
        window.sessionStorage.removeItem('ace_uipath_authenticated_session');
      } else {
        window.sessionStorage.setItem('ace_uipath_authenticated_session', id);
      }
    }
  },
  setCurrentUserId: (id: string): void => {
    setItem(STORAGE_KEYS.CURRENT_USER_ID, id);
    if (typeof window !== 'undefined') {
      if (id === 'user_student_1') {
        window.sessionStorage.removeItem('ace_uipath_authenticated_session');
      } else {
        window.sessionStorage.setItem('ace_uipath_authenticated_session', id);
      }
    }
  },

  getAuditLogs: (): AuditLogEntry[] => getItem(STORAGE_KEYS.AUDIT_LOGS, []),
  saveAuditLogs: (data: AuditLogEntry[]): void => setItem(STORAGE_KEYS.AUDIT_LOGS, data),

  getActivityDrafts: (): ActivityDraft[] => getItem(STORAGE_KEYS.ACTIVITY_DRAFTS, [
    {
      id: 'draft_1',
      slug: 'uipath-document-understanding-masterclass',
      title: 'UiPath Document Understanding & Intelligent OCR Masterclass',
      category: 'Workshop',
      eventType: 'Hybrid',
      date: '2026-09-15',
      timeStart: '10:00 AM',
      timeEnd: '01:00 PM',
      venue: 'RPA Innovation Center Lab 304',
      summary: 'Deep dive into taxonomy configuration, ML extractors, and human-in-the-loop Action Center validation for invoice automation.',
      fullDescriptionMd: '### Overview\nLearn end-to-end intelligent document processing using UiPath Document Understanding.',
      objectives: ['Build custom taxonomy', 'Configure ML Extractor', 'Integrate Action Center'],
      agenda: [{ time: '10:00 AM', title: 'Taxonomy Setup', description: 'Defining fields and document types' }],
      uipathTopicsCovered: ['UiPath Studio', 'Document Understanding', 'Action Center'],
      learningOutcomes: ['Deploy invoice extractors', 'Handle unreadable PDFs'],
      bannerImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
      galleryImages: [],
      speakers: [{ id: 'spk_1', name: 'Vikram Sharma', roleTitle: 'Automation Architect', organization: 'ACE UiPath Club', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', bio: 'Lead student automator' }],
      isFeatured: false,
      status: 'SUBMITTED',
      createdBy: 'Vikram Sharma (Core Lead)',
      createdAt: '2026-08-30T10:00:00Z',
      updatedAt: '2026-08-31T14:30:00Z',
      submittedAt: '2026-08-31T14:30:00Z',
      completionPercentage: 90
    }
  ]),
  saveActivityDrafts: (data: ActivityDraft[]): void => setItem(STORAGE_KEYS.ACTIVITY_DRAFTS, data),

  getCompletedModules: (): string[] => getItem(STORAGE_KEYS.COMPLETED_MODULES, ['mod_1_1', 'mod_1_2']),
  toggleModuleCompletion: (moduleId: string): string[] => {
    const current = getItem<string[]>(STORAGE_KEYS.COMPLETED_MODULES, ['mod_1_1', 'mod_1_2']);
    const exists = current.includes(moduleId);
    const updated = exists ? current.filter((id) => id !== moduleId) : [...current, moduleId];
    setItem(STORAGE_KEYS.COMPLETED_MODULES, updated);
    return updated;
  },
  addAuditLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry[] => {
    const logs = getItem<AuditLogEntry[]>(STORAGE_KEYS.AUDIT_LOGS, []);
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString()
    };
    const updated = [newEntry, ...logs].slice(0, 100);
    setItem(STORAGE_KEYS.AUDIT_LOGS, updated);
    return updated;
  },

  getAnalyticsEvents: (): AnalyticsEvent[] => getItem(STORAGE_KEYS.ANALYTICS_EVENTS, []),
  saveAnalyticsEvents: (data: AnalyticsEvent[]): void => setItem(STORAGE_KEYS.ANALYTICS_EVENTS, data.slice(0, MAX_ANALYTICS_EVENTS)),
  addAnalyticsEvent: (event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): AnalyticsEvent => {
    const events = getItem<AnalyticsEvent[]>(STORAGE_KEYS.ANALYTICS_EVENTS, []);
    const newEvent: AnalyticsEvent = {
      ...event,
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString()
    };
    const updated = [newEvent, ...events].slice(0, MAX_ANALYTICS_EVENTS);
    setItem(STORAGE_KEYS.ANALYTICS_EVENTS, updated);
    return newEvent;
  },

  resetAll: (): void => {
    setItem(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
    setItem(STORAGE_KEYS.LEARNING_PATHS, INITIAL_LEARNING_PATHS);
    setItem(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    setItem(STORAGE_KEYS.CHALLENGES, INITIAL_CHALLENGES);
    setItem(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
    setItem(STORAGE_KEYS.LEADERSHIP, INITIAL_LEADERSHIP);
    setItem(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    setItem(STORAGE_KEYS.USERS, INITIAL_USERS);
    setItem(STORAGE_KEYS.CURRENT_USER_ID, 'user_student_1');
    setItem(STORAGE_KEYS.AUDIT_LOGS, []);
  }
};
