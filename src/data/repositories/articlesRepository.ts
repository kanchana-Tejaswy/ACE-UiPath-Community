import { Article } from '../../types';
import { localDatabase } from '../local/localDatabase';

export const articlesRepository = {
  getAll: (): Article[] => {
    return localDatabase.getArticles();
  },

  getBySlug: (slug: string): Article | undefined => {
    const articles = localDatabase.getArticles();
    return articles.find((a) => a.slug === slug || a.id === slug);
  },

  save: (article: Article): Article[] => {
    const articles = localDatabase.getArticles();
    const existingIndex = articles.findIndex((a) => a.id === article.id);
    let updated: Article[];

    // If this article is marked as featured, cleanly handle any previous featured article
    const preparedArticle = { ...article };
    if (preparedArticle.isFeatured) {
      const sanitized = articles.map((a) => (a.id === preparedArticle.id ? preparedArticle : { ...a, isFeatured: false }));
      if (existingIndex >= 0) {
        updated = sanitized;
      } else {
        updated = [preparedArticle, ...sanitized];
      }
    } else {
      if (existingIndex >= 0) {
        updated = [...articles];
        updated[existingIndex] = preparedArticle;
      } else {
        updated = [preparedArticle, ...articles];
      }
    }

    localDatabase.saveArticles(updated);
    return updated;
  },

  delete: (id: string): Article[] => {
    const articles = localDatabase.getArticles();
    const updated = articles.filter((a) => a.id !== id);
    localDatabase.saveArticles(updated);
    return updated;
  },

  incrementViews: (id: string): Article[] => {
    const articles = localDatabase.getArticles();
    const updated = articles.map((a) => {
      if (a.id === id) {
        return { ...a, views: (a.views || 0) + 1 };
      }
      return a;
    });
    localDatabase.saveArticles(updated);
    return updated;
  }
};
