import { LearningPath } from '../../types';
import { localDatabase } from '../local/localDatabase';

export const learningRepository = {
  getAll: (): LearningPath[] => {
    return localDatabase.getLearningPaths();
  },

  getBySlug: (slug: string): LearningPath | undefined => {
    const paths = localDatabase.getLearningPaths();
    return paths.find((p) => p.slug === slug || p.id === slug);
  },

  save: (path: LearningPath): LearningPath[] => {
    const paths = localDatabase.getLearningPaths();
    const existingIndex = paths.findIndex((p) => p.id === path.id);
    let updated: LearningPath[];
    if (existingIndex >= 0) {
      updated = [...paths];
      updated[existingIndex] = path;
    } else {
      updated = [path, ...paths];
    }
    localDatabase.saveLearningPaths(updated);
    return updated;
  }
};
