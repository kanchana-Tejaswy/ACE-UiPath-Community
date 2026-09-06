import { Activity, LearningPath, ProjectShowcase, Challenge, CommunityResource } from '../../types';

export interface RelatedContentItem {
  id: string;
  type: 'activity' | 'module' | 'project' | 'challenge' | 'resource';
  title: string;
  categoryOrTool: string;
  reason: string;
}

export function findRelatedContent(
  targetToolOrTag: string,
  collections: {
    activities: Activity[];
    learningPaths: LearningPath[];
    projects: ProjectShowcase[];
    challenges: Challenge[];
    resources: CommunityResource[];
  },
  excludeId?: string
): RelatedContentItem[] {
  const normTarget = (targetToolOrTag || '').toLowerCase().trim();
  if (!normTarget) return [];

  const items: RelatedContentItem[] = [];

  // Match Activities
  collections.activities.forEach((act) => {
    if (act.id === excludeId) return;
    const matchesTopic = act.uipathTopicsCovered.some((t) => t.toLowerCase().includes(normTarget));
    const matchesCategory = act.category.toLowerCase().includes(normTarget);
    if (matchesTopic || matchesCategory) {
      items.push({
        id: act.id,
        type: 'activity',
        title: act.title,
        categoryOrTool: act.category,
        reason: `Related activity on ${act.category}`
      });
    }
  });

  // Match Learning Modules
  collections.learningPaths.forEach((path) => {
    path.modules.forEach((mod) => {
      if (mod.id === excludeId) return;
      const matchesTool = mod.uipathTool.toLowerCase().includes(normTarget);
      const matchesTopic = mod.topicsCovered ? mod.topicsCovered.some((t) => t.toLowerCase().includes(normTarget)) : false;
      if (matchesTool || matchesTopic) {
        items.push({
          id: mod.id,
          type: 'module',
          title: mod.title,
          categoryOrTool: mod.uipathTool,
          reason: `Academy module covering ${mod.uipathTool}`
        });
      }
    });
  });

  // Match Resources
  collections.resources.forEach((res) => {
    if (res.id === excludeId) return;
    const matchesTag = res.tags.some((t) => t.toLowerCase().includes(normTarget));
    const matchesCat = res.category.toLowerCase().includes(normTarget);
    if (matchesTag || matchesCat) {
      items.push({
        id: res.id,
        type: 'resource',
        title: res.title,
        categoryOrTool: res.category,
        reason: `Downloadable resource template`
      });
    }
  });

  return items.slice(0, 5);
}
