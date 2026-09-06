import { Activity, LearningPath, ProjectShowcase, Challenge, CommunityResource, AnalyticsEvent } from '../../types';

export interface RecommendationItem {
  id: string;
  type: 'activity' | 'module' | 'project' | 'challenge' | 'resource';
  title: string;
  subtitle: string;
  reason: string;
  score: number;
  route: string;
  detailId?: string;
}

export interface RecommendationSet {
  continueLearning?: RecommendationItem;
  recommendedForYou: RecommendationItem[];
  basedOnActivity: RecommendationItem[];
  usefulResources: RecommendationItem[];
}

export function generateRecommendations(
  completedModuleIds: string[] = [],
  analyticsEvents: AnalyticsEvent[] = [],
  collections: {
    activities: Activity[];
    learningPaths: LearningPath[];
    projects: ProjectShowcase[];
    challenges: Challenge[];
    resources: CommunityResource[];
  }
): RecommendationSet {
  // Extract recent user interests from telemetry
  const recentToolInterests = new Set<string>();
  analyticsEvents.slice(0, 30).forEach((evt) => {
    if (evt.metadata?.uipathTool) recentToolInterests.add(evt.metadata.uipathTool.toLowerCase());
    if (evt.entityType === 'LearningModule') recentToolInterests.add('reframework');
  });

  if (recentToolInterests.size === 0) {
    recentToolInterests.add('reframework');
    recentToolInterests.add('studio');
  }

  // 1. Continue Learning: Find next uncompleted module
  let continueLearning: RecommendationItem | undefined;
  for (const path of collections.learningPaths) {
    for (const mod of path.modules) {
      if (!completedModuleIds.includes(mod.id)) {
        continueLearning = {
          id: mod.id,
          type: 'module',
          title: mod.title,
          subtitle: `${path.title} • ${mod.durationMinutes} mins`,
          reason: `Next uncompleted module in ${path.title}`,
          score: 100,
          route: '#learn',
          detailId: mod.id
        };
        break;
      }
    }
    if (continueLearning) break;
  }

  // 2. Recommended For You: Score uncompleted modules
  const recommendedForYou: RecommendationItem[] = [];
  collections.learningPaths.forEach((path) => {
    path.modules.forEach((mod) => {
      if (completedModuleIds.includes(mod.id)) return;
      let score = 10;
      const isInterested = Array.from(recentToolInterests).some((t) => mod.uipathTool.toLowerCase().includes(t));
      if (isInterested) score += 15;
      if (mod.level === 'Intermediate' || mod.level === 'Advanced') score += 5;

      recommendedForYou.push({
        id: mod.id,
        type: 'module',
        title: mod.title,
        subtitle: `${path.title} • ${mod.uipathTool}`,
        reason: isInterested ? `Recommended based on your interest in ${mod.uipathTool}` : `Popular Academy module`,
        score,
        route: '#learn',
        detailId: mod.id
      });
    });
  });

  recommendedForYou.sort((a, b) => b.score - a.score);

  // 3. Based on Activity: Upcoming/Featured activities
  const basedOnActivity: RecommendationItem[] = collections.activities.map((act) => ({
    id: act.id,
    type: 'activity' as const,
    title: act.title,
    subtitle: `${act.category} • ${act.date}`,
    reason: act.isFeatured ? 'Featured institutional activity' : `Upcoming community ${act.category}`,
    score: act.isFeatured ? 50 : 20,
    route: `#activities/${act.slug}`,
    detailId: act.slug
  })).sort((a, b) => b.score - a.score);

  // 4. Useful Resources: Resource templates
  const usefulResources: RecommendationItem[] = collections.resources.map((res) => ({
    id: res.id,
    type: 'resource' as const,
    title: res.title,
    subtitle: `${res.category} • ${res.fileType}`,
    reason: `${res.downloadCount || 0} community downloads`,
    score: res.downloadCount || 0,
    route: '#resources',
    detailId: res.id
  })).sort((a, b) => b.score - a.score);

  return {
    continueLearning,
    recommendedForYou: recommendedForYou.slice(0, 3),
    basedOnActivity: basedOnActivity.slice(0, 3),
    usefulResources: usefulResources.slice(0, 3)
  };
}
