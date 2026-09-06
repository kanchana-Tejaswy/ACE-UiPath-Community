import { Activity } from '../../types';
import { localDatabase } from '../local/localDatabase';

export const activitiesRepository = {
  getAll: (): Activity[] => {
    return localDatabase.getActivities();
  },

  getBySlug: (slug: string): Activity | undefined => {
    const activities = localDatabase.getActivities();
    return activities.find((a) => a.slug === slug || a.id === slug);
  },

  save: (activity: Activity): Activity[] => {
    const activities = localDatabase.getActivities();
    const existingIndex = activities.findIndex((a) => a.id === activity.id);
    let updated: Activity[];
    if (existingIndex >= 0) {
      updated = [...activities];
      updated[existingIndex] = activity;
    } else {
      updated = [activity, ...activities];
    }
    localDatabase.saveActivities(updated);
    return updated;
  },

  delete: (id: string): Activity[] => {
    const activities = localDatabase.getActivities();
    const updated = activities.filter((a) => a.id !== id);
    localDatabase.saveActivities(updated);
    return updated;
  }
};
