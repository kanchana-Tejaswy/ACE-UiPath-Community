import { AnalyticsEvent, AnalyticsEventType } from '../../types';
import { localDatabase } from '../local/localDatabase';

export const analyticsRepository = {
  recordEvent: (event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): AnalyticsEvent[] => {
    localDatabase.addAnalyticsEvent(event);
    return localDatabase.getAnalyticsEvents();
  },

  getEvents: (): AnalyticsEvent[] => {
    return localDatabase.getAnalyticsEvents();
  },

  getEventsByType: (type: AnalyticsEventType): AnalyticsEvent[] => {
    const events = localDatabase.getAnalyticsEvents();
    return events.filter((e) => e.eventType === type);
  },

  getEventsByDateRange: (startDate: string, endDate: string): AnalyticsEvent[] => {
    const events = localDatabase.getAnalyticsEvents();
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    return events.filter((e) => {
      const t = new Date(e.timestamp).getTime();
      return t >= start && t <= end;
    });
  },

  getEntityAnalytics: (entityId: string): AnalyticsEvent[] => {
    const events = localDatabase.getAnalyticsEvents();
    return events.filter((e) => e.entityId === entityId);
  },

  getUserActivitySummary: (userId?: string): Record<string, number> => {
    const events = localDatabase.getAnalyticsEvents();
    const userEvents = userId ? events.filter((e) => e.userId === userId) : events;
    const summary: Record<string, number> = {};

    userEvents.forEach((e) => {
      summary[e.eventType] = (summary[e.eventType] || 0) + 1;
    });

    return summary;
  }
};
