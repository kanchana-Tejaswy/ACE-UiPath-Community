import { CommunityResource } from '../../types';
import { localDatabase } from '../local/localDatabase';

export const resourcesRepository = {
  getAll: (): CommunityResource[] => {
    return localDatabase.getResources();
  },

  save: (res: CommunityResource): CommunityResource[] => {
    const resources = localDatabase.getResources();
    const existingIndex = resources.findIndex((r) => r.id === res.id);
    let updated: CommunityResource[];
    if (existingIndex >= 0) {
      updated = [...resources];
      updated[existingIndex] = res;
    } else {
      updated = [res, ...resources];
    }
    localDatabase.saveResources(updated);
    return updated;
  },

  delete: (id: string): CommunityResource[] => {
    const resources = localDatabase.getResources();
    const updated = resources.filter((r) => r.id !== id);
    localDatabase.saveResources(updated);
    return updated;
  },

  incrementDownloads: (id: string): CommunityResource[] => {
    const resources = localDatabase.getResources();
    const index = resources.findIndex((r) => r.id === id);
    if (index >= 0) {
      const updated = [...resources];
      updated[index] = { ...updated[index], downloadCount: updated[index].downloadCount + 1 };
      localDatabase.saveResources(updated);
      return updated;
    }
    return resources;
  }
};
