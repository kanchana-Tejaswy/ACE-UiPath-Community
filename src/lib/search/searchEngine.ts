import { Activity, LearningPath, ProjectShowcase, Challenge, CommunityResource } from '../../types';

export type SearchResultType = 'activity' | 'module' | 'project' | 'challenge' | 'resource';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  description: string;
  score: number;
  matchedFields: string[];
  route: string;
  detailId?: string;
  metadata?: Record<string, any>;
}

export interface SearchFilters {
  contentType?: 'all' | 'activity' | 'module' | 'project' | 'challenge' | 'resource';
  uipathTool?: string;
  category?: string;
}

function normalizeText(text: string): string {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(text: string): string[] {
  const norm = normalizeText(text);
  return norm ? norm.split(' ').filter(Boolean) : [];
}

export function searchContent(
  rawQuery: string,
  filters: SearchFilters = {},
  collections: {
    activities: Activity[];
    learningPaths: LearningPath[];
    projects: ProjectShowcase[];
    challenges: Challenge[];
    resources: CommunityResource[];
  }
): SearchResult[] {
  const queryTokens = tokenize(rawQuery);
  const normalizedQuery = normalizeText(rawQuery);

  if (!normalizedQuery && (!filters.contentType || filters.contentType === 'all')) {
    return [];
  }

  const results: SearchResult[] = [];

  // Helper to score a content item
  const scoreItem = (
    id: string,
    type: SearchResultType,
    title: string,
    description: string,
    tags: string[],
    tools: string[],
    category: string,
    authorOrMeta: string,
    route: string,
    detailId?: string,
    metadata?: Record<string, any>
  ) => {
    // Content type filter check
    if (filters.contentType && filters.contentType !== 'all' && filters.contentType !== type) {
      return;
    }

    // Tool filter check
    if (filters.uipathTool && filters.uipathTool !== 'all') {
      const toolMatch = tools.some((t) => normalizeText(t).includes(normalizeText(filters.uipathTool!)));
      if (!toolMatch) return;
    }

    // Category filter check
    if (filters.category && filters.category !== 'all') {
      if (normalizeText(category) !== normalizeText(filters.category)) return;
    }

    let score = 0;
    const matchedFields: string[] = [];

    const normTitle = normalizeText(title);
    const normDesc = normalizeText(description);
    const normTags = tags.map(normalizeText);
    const normTools = tools.map(normalizeText);
    const normCategory = normalizeText(category);
    const normAuthor = normalizeText(authorOrMeta);

    // Default match if no query string but filters applied
    if (!normalizedQuery) {
      results.push({
        id,
        type,
        title,
        description,
        score: 1,
        matchedFields: ['filter'],
        route,
        detailId,
        metadata
      });
      return;
    }

    // 1. Exact Title Match
    if (normTitle === normalizedQuery) {
      score += 100;
      matchedFields.push('exact_title');
    } else if (normTitle.includes(normalizedQuery)) {
      score += 70;
      matchedFields.push('title_phrase');
    }

    // 2. Token scoring
    queryTokens.forEach((token) => {
      // Title Token Match
      if (normTitle.includes(token)) {
        score += 50;
        if (!matchedFields.includes('title')) matchedFields.push('title');
      }

      // Tool / Tag / Category Match
      const matchesTool = normTools.some((t) => t.includes(token));
      const matchesTag = normTags.some((t) => t.includes(token));
      if (matchesTool || matchesTag || normCategory.includes(token)) {
        score += 30;
        if (!matchedFields.includes('tags_and_tools')) matchedFields.push('tags_and_tools');
      }

      // Description / Summary Token Match
      if (normDesc.includes(token)) {
        score += 10;
        if (!matchedFields.includes('description')) matchedFields.push('description');
      }

      // Author / Metadata Match
      if (normAuthor.includes(token)) {
        score += 5;
        if (!matchedFields.includes('metadata')) matchedFields.push('metadata');
      }
    });

    if (score > 0) {
      results.push({
        id,
        type,
        title,
        description,
        score,
        matchedFields,
        route,
        detailId,
        metadata
      });
    }
  };

  // Search Activities
  collections.activities.forEach((act) => {
    scoreItem(
      act.id,
      'activity',
      act.title,
      act.summary,
      act.learningOutcomes || [],
      act.uipathTopicsCovered || [],
      act.category,
      act.venue || '',
      `#activities/${act.slug}`,
      act.slug,
      { date: act.date, eventType: act.eventType }
    );
  });

  // Search Learning Modules
  collections.learningPaths.forEach((path) => {
    path.modules.forEach((mod) => {
      scoreItem(
        mod.id,
        'module',
        mod.title,
        mod.summary,
        mod.topicsCovered || [],
        [mod.uipathTool],
        path.title,
        mod.level,
        '#learn',
        mod.id,
        { durationMinutes: mod.durationMinutes, level: mod.level, pathTitle: path.title }
      );
    });
  });

  // Search Projects
  collections.projects.forEach((proj) => {
    scoreItem(
      proj.id,
      'project',
      proj.title,
      proj.summary,
      [proj.roiMetrics],
      proj.uipathToolsUsed || [],
      proj.status,
      `${proj.authorName} ${proj.authorBranch || ''}`,
      '#projects',
      proj.id,
      { authorName: proj.authorName, upvotes: proj.upvotes }
    );
  });

  // Search Challenges
  collections.challenges.forEach((chal) => {
    scoreItem(
      chal.id,
      'challenge',
      chal.title,
      chal.description || chal.descriptionMd || '',
      chal.evaluationCriteria || [],
      chal.uipathProduct ? [chal.uipathProduct] : [],
      chal.difficulty || chal.category || '',
      `Prize: ${chal.prizePool}`,
      '#challenges',
      chal.id,
      { difficulty: chal.difficulty, prizePool: chal.prizePool }
    );
  });

  // Search Resources
  collections.resources.forEach((res) => {
    scoreItem(
      res.id,
      'resource',
      res.title,
      res.description,
      res.tags || [],
      [res.uipathVersion],
      res.category,
      res.fileType,
      '#resources',
      res.id,
      { fileType: res.fileType, downloadCount: res.downloadCount }
    );
  });

  // Sort descending by relevance score
  return results.sort((a, b) => b.score - a.score);
}
