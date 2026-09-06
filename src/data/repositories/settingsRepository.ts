import { SiteSettings } from '../../types';
import { localDatabase } from '../local/localDatabase';

export const settingsRepository = {
  get: (): SiteSettings => {
    return localDatabase.getSettings();
  },

  update: (partial: Partial<SiteSettings>): SiteSettings => {
    const current = localDatabase.getSettings();
    const updated = { ...current, ...partial };
    localDatabase.saveSettings(updated);
    return updated;
  }
};
