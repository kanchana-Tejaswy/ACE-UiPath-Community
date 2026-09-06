import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Download, 
  ThumbsUp, 
  CheckCircle2, 
  Trophy, 
  Layers, 
  GraduationCap, 
  Sparkles, 
  FileCode, 
  Calendar, 
  Activity as ActivityIcon, 
  Filter, 
  Award,
  Clock,
  Sparkle
} from 'lucide-react';
import { AnalyticsEvent, AnalyticsEventType, User, Activity, LearningPath, ProjectShowcase, CommunityResource, Challenge } from '../types';

interface Props {
  analyticsEvents: AnalyticsEvent[];
  users: User[];
  activities: Activity[];
  learningPaths: LearningPath[];
  projects: ProjectShowcase[];
  resources: CommunityResource[];
  challenges: Challenge[];
  completedModuleIds: string[];
}

type TimeFilter = 'TODAY' | 'WEEK' | 'MONTH' | 'ALL';

export const AdminAnalyticsSection: React.FC<Props> = ({
  analyticsEvents = [],
  users = [],
  activities = [],
  learningPaths = [],
  projects = [],
  resources = [],
  challenges = [],
  completedModuleIds = []
}) => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('ALL');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('ALL');

  // Filter events based on time window
  const filteredEvents = useMemo(() => {
    const now = new Date().getTime();
    return analyticsEvents.filter((evt) => {
      const evtTime = new Date(evt.timestamp).getTime();
      const diffDays = (now - evtTime) / (1000 * 60 * 60 * 24);

      let timeMatch = true;
      if (timeFilter === 'TODAY') timeMatch = diffDays <= 1;
      else if (timeFilter === 'WEEK') timeMatch = diffDays <= 7;
      else if (timeFilter === 'MONTH') timeMatch = diffDays <= 30;

      let typeMatch = true;
      if (eventTypeFilter !== 'ALL') {
        typeMatch = evt.eventType === eventTypeFilter;
      }

      return timeMatch && typeMatch;
    });
  }, [analyticsEvents, timeFilter, eventTypeFilter]);

  // Aggregate Community Engagement KPI metrics
  const totalDownloads = useMemo(() => {
    return resources.reduce((acc, r) => acc + (r.downloadCount || 0), 0);
  }, [resources]);

  const totalUpvotes = useMemo(() => {
    return projects.reduce((acc, p) => acc + (p.upvotes || 0), 0);
  }, [projects]);

  const totalModulesCount = useMemo(() => {
    return learningPaths.reduce((acc, path) => acc + (path.modules?.length || 0), 0);
  }, [learningPaths]);

  // Daily Event Trend Data (Last 7 Days) for native SVG chart
  const dailyTrendData = useMemo(() => {
    const days: { dateLabel: string; count: number }[] = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = analyticsEvents.filter((e) => e.timestamp.startsWith(dateStr)).length;
      days.push({
        dateLabel: d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' }),
        count
      });
    }
    return days;
  }, [analyticsEvents]);

  const maxDailyCount = Math.max(...dailyTrendData.map((d) => d.count), 1);

  // Content Performance Intelligence
  const topActivity = useMemo(() => {
    return activities[0] || null;
  }, [activities]);

  const topProject = useMemo(() => {
    if (!projects.length) return null;
    return [...projects].sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))[0];
  }, [projects]);

  const topResource = useMemo(() => {
    if (!resources.length) return null;
    return [...resources].sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0))[0];
  }, [resources]);

  // Community Engagement Leaderboard
  const userEngagementLeaderboard = useMemo(() => {
    return users.map((u) => {
      const uEvents = analyticsEvents.filter((e) => e.userId === u.id);
      const lessons = uEvents.filter((e) => e.eventType === 'LESSON_COMPLETED').length;
      const downloads = uEvents.filter((e) => e.eventType === 'RESOURCE_DOWNLOADED').length;
      const projectViews = uEvents.filter((e) => e.eventType === 'PROJECT_VIEWED' || e.eventType === 'PROJECT_UPVOTED').length;
      const challengePart = uEvents.filter((e) => e.eventType === 'CHALLENGE_SUBMITTED' || e.eventType === 'CHALLENGE_VIEWED').length;
      const totalScore = uEvents.length + lessons * 5 + downloads * 3 + projectViews * 2 + challengePart * 4;

      return {
        user: u,
        eventsCount: uEvents.length,
        lessons,
        downloads,
        projectViews,
        challengePart,
        totalScore
      };
    }).sort((a, b) => b.totalScore - a.totalScore);
  }, [users, analyticsEvents]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header & Controls */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        background: 'var(--bg-secondary)',
        padding: '1.5rem',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-medium)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
            <BarChart3 className="text-orange" size={24} />
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', margin: 0 }}>
              Community Intelligence & Telemetry
            </h2>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
            Real-time telemetry, content engagement insights, and community participation metrics.
          </p>
        </div>

        {/* Time Window Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {(['TODAY', 'WEEK', 'MONTH', 'ALL'] as TimeFilter[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeFilter(tf)}
              className={`btn btn-sm ${timeFilter === tf ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.85rem' }}
            >
              {tf === 'TODAY' && 'Today'}
              {tf === 'WEEK' && 'Last 7 Days'}
              {tf === 'MONTH' && 'Last 30 Days'}
              {tf === 'ALL' && 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Registered Members</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(250, 70, 22, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={16} className="text-orange" />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
            {users.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {users.filter(u => u.status === 'ACTIVE').length} Active Accounts
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Total Recorded Events</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIcon size={16} style={{ color: 'var(--text-primary)' }} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            {filteredEvents.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Telemetry Events Captured
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Resource Downloads</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Download size={16} style={{ color: '#10B981' }} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#10B981' }}>
            {totalDownloads}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Across {resources.length} Vault Assets
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Lessons Completed</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(250, 70, 22, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--uipath-orange)' }} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--uipath-orange)' }}>
            {completedModuleIds.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Out of {totalModulesCount} Modules
          </div>
        </div>
      </div>

      {/* Time-Series Chart Section */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', margin: 0 }}>
              Activity Telemetry Trend (7 Days)
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              Daily recorded interaction volume across public pages and features.
            </p>
          </div>
          <span className="badge badge-orange" style={{ fontSize: '0.75rem' }}>
            <TrendingUp size={12} /> Live Trend
          </span>
        </div>

        {/* Native SVG Bar Chart */}
        <div style={{
          height: '180px',
          display: 'flex',
          alignItems: 'flex-end',
          gap: '1rem',
          paddingTop: '1rem',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          {dailyTrendData.map((item, idx) => {
            const heightPercent = Math.max((item.count / maxDailyCount) * 100, 8);
            return (
              <div 
                key={idx} 
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  height: '100%',
                  justifyContent: 'flex-end'
                }}
              >
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: item.count > 0 ? '#FA4616' : 'var(--text-muted)' }}>
                  {item.count}
                </span>
                <div style={{
                  width: '100%',
                  maxWidth: '36px',
                  height: `${heightPercent}%`,
                  background: item.count > 0 ? 'linear-gradient(180deg, #FA4616 0%, #BA2C07 100%)' : 'var(--bg-tertiary)',
                  borderRadius: '6px 6px 0 0',
                  boxShadow: item.count > 0 ? '0 0 12px rgba(250, 70, 22, 0.3)' : 'none',
                  transition: 'height var(--transition-normal)'
                }} />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  {item.dateLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Performing Content & Leaderboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Intelligence Highlights */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Sparkles className="text-orange" size={20} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', margin: 0 }}>
              Top Performing Content Intelligence
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {topActivity && (
              <div style={{
                background: 'var(--bg-secondary)',
                padding: '1rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem'
              }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(250, 70, 22, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Layers size={20} className="text-orange" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                    Featured Activity
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{topActivity.title}</div>
                </div>
                <span className="badge badge-orange">{topActivity.eventType}</span>
              </div>
            )}

            {topProject && (
              <div style={{
                background: 'var(--bg-secondary)',
                padding: '1rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem'
              }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(250, 70, 22, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkle size={20} style={{ color: 'var(--uipath-orange)' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                    Most Upvoted Bot Showcase
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{topProject.title}</div>
                </div>
                <span className="badge badge-orange" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <ThumbsUp size={12} /> {topProject.upvotes || 0} Upvotes
                </span>
              </div>
            )}

            {topResource && (
              <div style={{
                background: 'var(--bg-secondary)',
                padding: '1rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem'
              }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileCode size={20} style={{ color: '#10B981' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                    Top Resource Download
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{topResource.title}</div>
                </div>
                <span className="badge badge-emerald" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Download size={12} /> {topResource.downloadCount || 0} Downloads
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Community Engagement Leaderboard Table */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Award className="text-orange" size={20} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', margin: 0 }}>
              Community Engagement Leaderboard
            </h3>
          </div>

          {userEngagementLeaderboard.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              No telemetry interactions recorded yet.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textAlign: 'left' }}>
                    <th style={{ padding: '0.5rem' }}>Rank</th>
                    <th style={{ padding: '0.5rem' }}>Student / Member</th>
                    <th style={{ padding: '0.5rem' }}>Lessons</th>
                    <th style={{ padding: '0.5rem' }}>Downloads</th>
                    <th style={{ padding: '0.5rem' }}>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {userEngagementLeaderboard.slice(0, 5).map((item, idx) => (
                    <tr key={item.user.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0.65rem 0.5rem', fontWeight: 700, color: idx === 0 ? '#FA4616' : 'var(--text-primary)' }}>
                        #{idx + 1}
                      </td>
                      <td style={{ padding: '0.65rem 0.5rem' }}>
                        <div style={{ fontWeight: 600 }}>{item.user.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.user.email}</div>
                      </td>
                      <td style={{ padding: '0.65rem 0.5rem' }}>{item.lessons}</td>
                      <td style={{ padding: '0.65rem 0.5rem' }}>{item.downloads}</td>
                      <td style={{ padding: '0.65rem 0.5rem' }}>
                        <span className="badge badge-orange" style={{ fontWeight: 700 }}>
                          {item.totalScore} pts
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Community Discovery Intelligence */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Clock className="text-orange" size={20} />
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', margin: 0 }}>
            Community Discovery Intelligence (Search & AI Metrics)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>TOTAL SEARCH QUERIES</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.2rem' }}>
              {analyticsEvents.filter((e) => e.eventType === 'SEARCH_PERFORMED').length}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Global Command Palette Usage
            </div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>ZERO-RESULT QUERIES</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.2rem', color: '#F87171' }}>
              {analyticsEvents.filter((e) => e.eventType === 'SEARCH_NO_RESULTS').length}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Content Gaps & Opportunities
            </div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>AI ASSISTANT QUESTIONS</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.2rem', color: 'var(--uipath-orange)' }}>
              {analyticsEvents.filter((e) => e.eventType === 'AI_QUESTION_ASKED').length}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Student Prompts Submitted
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
