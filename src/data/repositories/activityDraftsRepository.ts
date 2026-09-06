import { ActivityDraft, DraftStatus } from '../../types';
import { localDatabase } from '../local/localDatabase';

export const activityDraftsRepository = {
  getAll: (): ActivityDraft[] => {
    return localDatabase.getActivityDrafts();
  },

  getById: (id: string): ActivityDraft | undefined => {
    return localDatabase.getActivityDrafts().find((d) => d.id === id);
  },

  save: (draft: ActivityDraft): ActivityDraft[] => {
    const drafts = localDatabase.getActivityDrafts();
    const existingIndex = drafts.findIndex((d) => d.id === draft.id);
    let updated: ActivityDraft[];
    if (existingIndex >= 0) {
      updated = [...drafts];
      updated[existingIndex] = { ...draft, updatedAt: new Date().toISOString() };
    } else {
      updated = [{ ...draft, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...drafts];
    }
    localDatabase.saveActivityDrafts(updated);
    return updated;
  },

  delete: (id: string): ActivityDraft[] => {
    const drafts = localDatabase.getActivityDrafts();
    const updated = drafts.filter((d) => d.id !== id);
    localDatabase.saveActivityDrafts(updated);
    return updated;
  },

  updateStatus: (id: string, status: DraftStatus, notes?: string): ActivityDraft[] => {
    const drafts = localDatabase.getActivityDrafts();
    const index = drafts.findIndex((d) => d.id === id);
    if (index >= 0) {
      const updated = [...drafts];
      const now = new Date().toISOString();
      updated[index] = {
        ...updated[index],
        status,
        updatedAt: now,
        ...(status === 'SUBMITTED' ? { submittedAt: now } : {}),
        ...(status === 'APPROVED' || status === 'CHANGES_REQUESTED' || status === 'PUBLISHED' ? { reviewedAt: now } : {}),
        ...(notes ? { reviewNotes: notes } : {})
      };
      localDatabase.saveActivityDrafts(updated);
      return updated;
    }
    return drafts;
  }
};
