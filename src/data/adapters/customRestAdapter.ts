import { DataAdapter } from './dataAdapter';
import { localAdapter } from './localAdapter';
import {
  Activity,
  LearningPath,
  ProjectShowcase,
  Challenge,
  CommunityResource,
  LeadershipMember,
  SiteSettings,
  AuditLogEntry,
  ActivityDraft,
  DraftStatus,
  AnalyticsEvent,
  AnalyticsEventType,
  Article
} from '../../types';

const API_BASE = (typeof window !== 'undefined' && (window as any).VITE_API_BASE_URL) || '/api';

export const customRestAdapter: DataAdapter = {
  isCloudConnected: () => {
    return typeof window !== 'undefined' && Boolean((window as any).VITE_API_BASE_URL || (window as any).VITE_DATA_PROVIDER === 'rest');
  },

  // Activities
  getActivities: async (): Promise<Activity[]> => {
    try {
      const res = await fetch(`${API_BASE}/activities`);
      if (!res.ok) throw new Error('REST API activities fetch failed');
      const json = await res.json();
      return json.data || [];
    } catch {
      return localAdapter.getActivities();
    }
  },

  saveActivity: async (activity: Activity): Promise<Activity[]> => {
    try {
      const res = await fetch(`${API_BASE}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activity)
      });
      if (!res.ok) throw new Error('REST API save activity failed');
      const json = await res.json();
      return json.data || [];
    } catch {
      return localAdapter.saveActivity(activity);
    }
  },

  deleteActivity: async (id: string): Promise<Activity[]> => {
    try {
      const res = await fetch(`${API_BASE}/activities/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('REST API delete activity failed');
      const json = await res.json();
      return json.data || [];
    } catch {
      return localAdapter.deleteActivity(id);
    }
  },

  // Projects
  getProjects: async (): Promise<ProjectShowcase[]> => {
    try {
      const res = await fetch(`${API_BASE}/projects`);
      if (!res.ok) throw new Error('REST API projects fetch failed');
      const json = await res.json();
      return json.data || [];
    } catch {
      return localAdapter.getProjects();
    }
  },

  saveProject: async (project: ProjectShowcase): Promise<ProjectShowcase[]> => {
    try {
      const res = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
      });
      if (!res.ok) throw new Error('REST API save project failed');
      const json = await res.json();
      return json.data || [];
    } catch {
      return localAdapter.saveProject(project);
    }
  },

  deleteProject: async (id: string): Promise<ProjectShowcase[]> => {
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('REST API delete project failed');
      const json = await res.json();
      return json.data || [];
    } catch {
      return localAdapter.deleteProject(id);
    }
  },

  upvoteProject: async (id: string): Promise<ProjectShowcase[]> => {
    try {
      const res = await fetch(`${API_BASE}/projects/${id}/upvote`, { method: 'POST' });
      if (!res.ok) throw new Error('REST API upvote project failed');
      const json = await res.json();
      return json.data || [];
    } catch {
      return localAdapter.upvoteProject(id);
    }
  },

  // Learning
  getLearningPaths: async (): Promise<LearningPath[]> => {
    try {
      const res = await fetch(`${API_BASE}/learning-paths`);
      if (!res.ok) throw new Error('REST API learning paths fetch failed');
      const json = await res.json();
      return json.data || [];
    } catch {
      return localAdapter.getLearningPaths();
    }
  },

  getCompletedModules: async (): Promise<string[]> => {
    try {
      const res = await fetch(`${API_BASE}/learning-progress`);
      if (!res.ok) throw new Error('REST API learning progress fetch failed');
      const json = await res.json();
      return json.data || [];
    } catch {
      return localAdapter.getCompletedModules();
    }
  },

  toggleModuleCompletion: async (moduleId: string): Promise<string[]> => {
    try {
      const res = await fetch(`${API_BASE}/learning-progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId })
      });
      if (!res.ok) throw new Error('REST API toggle module completion failed');
      const json = await res.json();
      return json.data || [];
    } catch {
      return localAdapter.toggleModuleCompletion(moduleId);
    }
  },

  // Resources
  getResources: async (): Promise<CommunityResource[]> => {
    try {
      const res = await fetch(`${API_BASE}/resources`);
      if (!res.ok) throw new Error('REST API resources fetch failed');
      const json = await res.json();
      return json.data || [];
    } catch {
      return localAdapter.getResources();
    }
  },

  saveResource: async (resource: CommunityResource): Promise<CommunityResource[]> => {
    try {
      const res = await fetch(`${API_BASE}/resources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resource)
      });
      if (!res.ok) throw new Error('REST API save resource failed');
      const json = await res.json();
      return json.data || [];
    } catch {
      return localAdapter.saveResource(resource);
    }
  },

  deleteResource: async (id: string): Promise<CommunityResource[]> => {
    try {
      const res = await fetch(`${API_BASE}/resources/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('REST API delete resource failed');
      const json = await res.json();
      return json.data || [];
    } catch {
      return localAdapter.deleteResource(id);
    }
  },

  incrementResourceDownloads: async (id: string): Promise<CommunityResource[]> => {
    try {
      const res = await fetch(`${API_BASE}/resources/${id}/download`, { method: 'POST' });
      if (!res.ok) throw new Error('REST API increment downloads failed');
      const json = await res.json();
      return json.data || [];
    } catch {
      return localAdapter.incrementResourceDownloads(id);
    }
  },

  // Activity Drafts
  getActivityDrafts: async (): Promise<ActivityDraft[]> => {
    try {
      const res = await fetch(`${API_BASE}/activity-drafts`);
      if (!res.ok) throw new Error('REST API drafts fetch failed');
      const json = await res.json();
      return json.data || [];
    } catch {
      return localAdapter.getActivityDrafts();
    }
  },

  saveActivityDraft: async (draft: ActivityDraft): Promise<ActivityDraft[]> => {
    try {
      const res = await fetch(`${API_BASE}/activity-drafts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft)
      });
      if (!res.ok) throw new Error('REST API save draft failed');
      const json = await res.json();
      return json.data || [];
    } catch {
      return localAdapter.saveActivityDraft(draft);
    }
  },

  deleteActivityDraft: async (id: string): Promise<ActivityDraft[]> => {
    try {
      const res = await fetch(`${API_BASE}/activity-drafts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('REST API delete draft failed');
      const json = await res.json();
      return json.data || [];
    } catch {
      return localAdapter.deleteActivityDraft(id);
    }
  },

  updateDraftStatus: async (id: string, status: DraftStatus, notes?: string): Promise<ActivityDraft[]> => {
    try {
      const res = await fetch(`${API_BASE}/activity-drafts/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes })
      });
      if (!res.ok) throw new Error('REST API update draft status failed');
      const json = await res.json();
      return json.data || [];
    } catch {
      return localAdapter.updateDraftStatus(id, status, notes);
    }
  },

  // Articles & Technical Write-ups
  getArticles: async (): Promise<Article[]> => {
    try {
      const res = await fetch(`${API_BASE}/articles`);
      if (!res.ok) throw new Error('REST API articles fetch failed');
      const json = await res.json();
      return json.data || [];
    } catch {
      return localAdapter.getArticles();
    }
  },

  saveArticle: async (article: Article): Promise<Article[]> => {
    try {
      const res = await fetch(`${API_BASE}/articles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article)
      });
      if (!res.ok) throw new Error('REST API save article failed');
      const json = await res.json();
      return json.data || [];
    } catch {
      return localAdapter.saveArticle(article);
    }
  },

  deleteArticle: async (id: string): Promise<Article[]> => {
    try {
      const res = await fetch(`${API_BASE}/articles/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('REST API delete article failed');
      const json = await res.json();
      return json.data || [];
    } catch {
      return localAdapter.deleteArticle(id);
    }
  },

  incrementArticleViews: async (id: string): Promise<Article[]> => {
    try {
      const res = await fetch(`${API_BASE}/articles/${id}/views`, { method: 'POST' });
      if (!res.ok) throw new Error('REST API increment views failed');
      const json = await res.json();
      return json.data || [];
    } catch {
      return localAdapter.incrementArticleViews(id);
    }
  },

  // Settings & System
  getSettings: async (): Promise<SiteSettings> => {
    try {
      const res = await fetch(`${API_BASE}/settings`);
      if (!res.ok) throw new Error('REST API settings fetch failed');
      const json = await res.json();
      return json.data || localAdapter.getSettings();
    } catch {
      return localAdapter.getSettings();
    }
  },

  updateSettings: async (newSettings: Partial<SiteSettings>): Promise<SiteSettings> => {
    try {
      const res = await fetch(`${API_BASE}/settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      if (!res.ok) throw new Error('REST API update settings failed');
      const json = await res.json();
      return json.data || localAdapter.getSettings();
    } catch {
      return localAdapter.updateSettings(newSettings);
    }
  },

  getAuditLogs: async (): Promise<AuditLogEntry[]> => {
    try {
      const res = await fetch(`${API_BASE}/audit-logs`);
      if (!res.ok) throw new Error('REST API audit logs fetch failed');
      const json = await res.json();
      return json.data || [];
    } catch {
      return localAdapter.getAuditLogs();
    }
  },

  addAuditLog: async (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<AuditLogEntry[]> => {
    try {
      const res = await fetch(`${API_BASE}/audit-logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
      if (!res.ok) throw new Error('REST API add audit log failed');
      const json = await res.json();
      return json.data || [];
    } catch {
      return localAdapter.addAuditLog(entry);
    }
  },

  // Product Analytics & Telemetry
  getAnalyticsEvents: async (): Promise<AnalyticsEvent[]> => {
    try {
      const res = await fetch(`${API_BASE}/analytics-events`);
      if (!res.ok) throw new Error('REST API analytics fetch failed');
      const json = await res.json();
      return json.data || [];
    } catch {
      return localAdapter.getAnalyticsEvents();
    }
  },

  recordAnalyticsEvent: async (event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): Promise<AnalyticsEvent[]> => {
    try {
      const res = await fetch(`${API_BASE}/analytics-events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });
      if (!res.ok) throw new Error('REST API record analytics failed');
      const json = await res.json();
      return json.data || [];
    } catch {
      return localAdapter.recordAnalyticsEvent(event);
    }
  },

  getEventsByType: async (type: AnalyticsEventType): Promise<AnalyticsEvent[]> => {
    try {
      const res = await fetch(`${API_BASE}/analytics-events?type=${type}`);
      if (!res.ok) throw new Error('REST API analytics type fetch failed');
      const json = await res.json();
      return json.data || [];
    } catch {
      return localAdapter.getEventsByType(type);
    }
  },

  // Learning Paths Mutations
  saveLearningPath: async (path: LearningPath): Promise<LearningPath[]> => {
    try {
      const res = await fetch(`${API_BASE}/learning-paths`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(path)
      });
      if (!res.ok) throw new Error('REST API save learning path failed');
      const json = await res.json();
      return json.data || [];
    } catch {
      return localAdapter.saveLearningPath(path);
    }
  },

  deleteLearningPath: async (id: string): Promise<LearningPath[]> => {
    try {
      const res = await fetch(`${API_BASE}/learning-paths/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('REST API delete learning path failed');
      const json = await res.json();
      return json.data || [];
    } catch {
      return localAdapter.deleteLearningPath(id);
    }
  },

  // Challenges
  getChallenges: async (): Promise<Challenge[]> => {
    try {
      const res = await fetch(`${API_BASE}/challenges`);
      if (!res.ok) throw new Error('REST API challenges fetch failed');
      const json = await res.json();
      return json.data || [];
    } catch {
      return localAdapter.getChallenges();
    }
  },

  saveChallenge: async (challenge: Challenge): Promise<Challenge[]> => {
    try {
      const res = await fetch(`${API_BASE}/challenges`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(challenge)
      });
      if (!res.ok) throw new Error('REST API save challenge failed');
      const json = await res.json();
      return json.data || [];
    } catch {
      return localAdapter.saveChallenge(challenge);
    }
  },

  deleteChallenge: async (id: string): Promise<Challenge[]> => {
    try {
      const res = await fetch(`${API_BASE}/challenges/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('REST API delete challenge failed');
      const json = await res.json();
      return json.data || [];
    } catch {
      return localAdapter.deleteChallenge(id);
    }
  },

  // Leadership
  getLeadership: async (): Promise<LeadershipMember[]> => {
    try {
      const res = await fetch(`${API_BASE}/leadership`);
      if (!res.ok) throw new Error('REST API leadership fetch failed');
      const json = await res.json();
      return json.data || [];
    } catch {
      return localAdapter.getLeadership();
    }
  },

  saveLeadership: async (member: LeadershipMember): Promise<LeadershipMember[]> => {
    try {
      const res = await fetch(`${API_BASE}/leadership`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(member)
      });
      if (!res.ok) throw new Error('REST API save leadership failed');
      const json = await res.json();
      return json.data || [];
    } catch {
      return localAdapter.saveLeadership(member);
    }
  },

  deleteLeadership: async (id: string): Promise<LeadershipMember[]> => {
    try {
      const res = await fetch(`${API_BASE}/leadership/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('REST API delete leadership failed');
      const json = await res.json();
      return json.data || [];
    } catch {
      return localAdapter.deleteLeadership(id);
    }
  }
};
