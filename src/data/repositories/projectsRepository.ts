import { ProjectShowcase } from '../../types';
import { localDatabase } from '../local/localDatabase';

export const projectsRepository = {
  getAll: (): ProjectShowcase[] => {
    return localDatabase.getProjects();
  },

  getBySlug: (slug: string): ProjectShowcase | undefined => {
    const projects = localDatabase.getProjects();
    return projects.find((p) => p.slug === slug || p.id === slug);
  },

  save: (project: ProjectShowcase): ProjectShowcase[] => {
    const projects = localDatabase.getProjects();
    const existingIndex = projects.findIndex((p) => p.id === project.id);
    let updated: ProjectShowcase[];
    if (existingIndex >= 0) {
      updated = [...projects];
      updated[existingIndex] = project;
    } else {
      updated = [project, ...projects];
    }
    localDatabase.saveProjects(updated);
    return updated;
  },

  delete: (id: string): ProjectShowcase[] => {
    const projects = localDatabase.getProjects();
    const updated = projects.filter((p) => p.id !== id);
    localDatabase.saveProjects(updated);
    return updated;
  },

  upvote: (id: string): ProjectShowcase[] => {
    const projects = localDatabase.getProjects();
    const updated = projects.map((p) => (p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p));
    localDatabase.saveProjects(updated);
    return updated;
  }
};
