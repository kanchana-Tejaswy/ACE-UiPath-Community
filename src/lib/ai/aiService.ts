import { Activity, LearningPath, ProjectShowcase, Challenge, CommunityResource } from '../../types';
import { searchContent, SearchResult } from '../search/searchEngine';

export interface AISource {
  id: string;
  type: string;
  title: string;
  route: string;
}

export interface AIResponse {
  answer: string;
  sources: AISource[];
  mode: 'LOCAL_KNOWLEDGE' | 'CLOUD_AI';
}

export const aiService = {
  isConfigured: (): boolean => {
    return typeof window !== 'undefined' && !!(window as any).VITE_AI_API_KEY;
  },

  askQuestion: async (
    question: string,
    collections: {
      activities: Activity[];
      learningPaths: LearningPath[];
      projects: ProjectShowcase[];
      challenges: Challenge[];
      resources: CommunityResource[];
    }
  ): Promise<AIResponse> => {
    const rawQ = question.trim().toLowerCase();
    if (!rawQ) {
      return {
        answer: 'Hello! I am the ACE Community Assistant. How can I help you explore UiPath learning modules, activities, or resources today?',
        sources: [],
        mode: 'LOCAL_KNOWLEDGE'
      };
    }

    // 1. Context Retrieval Pipeline: Search platform content using searchEngine
    const searchResults = searchContent(rawQ, {}, collections);

    const sources: AISource[] = searchResults.slice(0, 3).map((r) => ({
      id: r.id,
      type: r.type,
      title: r.title,
      route: r.route
    }));

    // 2. Deterministic Local Knowledge Mode fallback
    if (searchResults.length > 0) {
      const topMatch = searchResults[0];
      let answerText = `Based on the ACE Community Knowledge Base, I found relevant items matching your question:\n\n`;

      searchResults.slice(0, 3).forEach((item, i) => {
        answerText += `${i + 1}. **${item.title}** (${item.type.toUpperCase()})\n   ${item.description}\n\n`;
      });

      if (rawQ.includes('start') || rawQ.includes('begin') || rawQ.includes('learn')) {
        answerText += `💡 **Recommendation:** We recommend starting with **${topMatch.title}** and working through the hands-on exercises in the Learning Academy.`;
      } else if (rawQ.includes('resource') || rawQ.includes('download') || rawQ.includes('template')) {
        answerText += `📦 **Resource Tip:** You can download production templates and cheat sheets directly from the Resources Vault.`;
      } else {
        answerText += `You can explore these directly using the clickable source links below.`;
      }

      return {
        answer: answerText,
        sources,
        mode: 'LOCAL_KNOWLEDGE'
      };
    }

    // 3. Fallback when no platform content matches query
    return {
      answer: `I couldn't find specific content matching "${question}" in the ACE Community knowledge base.\n\nHere are general tips for UiPath automation:\n- Master **REFramework** (Robotic Enterprise Framework) for enterprise queue handling.\n- Use **Studio 2024.x** for advanced Modern Design Experience.\n- Check out the **UiPath Academic Alliance** materials on official docs.uipath.com.`,
      sources: [],
      mode: 'LOCAL_KNOWLEDGE'
    };
  }
};
