import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Layers, 
  Search, 
  Filter, 
  Grid, 
  ListOrdered, 
  Plus, 
  ArrowRight, 
  Download, 
  Video, 
  FileText,
  Sparkles
} from 'lucide-react';
import { Activity, User } from '../types';

interface Props {
  activities: Activity[];
  currentUser: User;
  onNavigate: (view: string, detailId?: string) => void;
}

export const ActivitiesPage: React.FC<Props> = ({
  activities,
  currentUser,
  onNavigate
}) => {
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedMode, setSelectedMode] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('timeline');

  const years = ['ALL', '2026', '2025', '2024', '2023', '2022'];
  const categories = ['ALL', 'Workshop', 'Hackathon', 'Certification', 'Bootcamp', 'Guest Lecture'];
  const modes = ['ALL', 'Offline', 'Online', 'Hybrid'];

  const filteredActivities = activities.filter((act) => {
    // Year filter
    if (selectedYear !== 'ALL' && !act.date.startsWith(selectedYear)) return false;
    // Category filter
    if (selectedCategory !== 'ALL' && act.category !== selectedCategory) return false;
    // Mode filter
    if (selectedMode !== 'ALL' && act.eventType !== selectedMode) return false;
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = act.title.toLowerCase().includes(q);
      const matchSummary = act.summary.toLowerCase().includes(q);
      const matchTopic = act.uipathTopicsCovered.some((t) => t.toLowerCase().includes(q));
      const matchVenue = act.venue.toLowerCase().includes(q);
      if (!matchTitle && !matchSummary && !matchTopic && !matchVenue) return false;
    }
    return true;
  });

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
      {/* Header Banner */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <span className="badge badge-orange" style={{ marginBottom: '0.5rem' }}>
              Institutional Knowledge Archive
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800 }}>
              Activity Timeline & Institutional Memory
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* View Mode Toggle */}
            <div style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0.25rem',
              display: 'flex',
              gap: '0.25rem'
            }}>
              <button
                onClick={() => setViewMode('timeline')}
                className={`btn btn-sm ${viewMode === 'timeline' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.35rem 0.65rem' }}
                title="Timeline View"
              >
                <ListOrdered size={16} /> Timeline
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.35rem 0.65rem' }}
                title="Grid View"
              >
                <Grid size={16} /> Grid
              </button>
            </div>

            {(currentUser.role === 'ADMIN' || currentUser.role === 'CORE_TEAM') && (
              <button
                onClick={() => onNavigate('admin')}
                className="btn btn-primary btn-sm"
              >
                <Plus size={16} /> Draft Activity
              </button>
            )}
          </div>
        </div>

        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '800px' }}>
          Explore the complete historical journey of the ACE UiPath Community from 2022 to the present. Access slide decks, code packages, speaker profiles, and learning outcomes for every masterclass and hackathon.
        </p>
      </div>

      {/* Multi-Dimensional Filter Bar */}
      <div className="glass-panel" style={{
        padding: '1.5rem',
        marginBottom: '3rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        {/* Search Bar */}
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by title, UiPath concept (e.g. REFramework, Selectors, OCR), speaker, or venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.75rem',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: '0.95rem',
              outline: 'none'
            }}
          />
        </div>

        {/* Filter Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
          {/* Year Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Year:</span>
            {years.map((y) => (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                style={{
                  background: selectedYear === y ? 'var(--uipath-orange)' : 'var(--bg-tertiary)',
                  color: selectedYear === y ? '#FFF' : 'var(--text-secondary)',
                  border: selectedYear === y ? '1px solid var(--uipath-orange)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.25rem 0.75rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {y}
              </button>
            ))}
          </div>

          {/* Category Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Type:</span>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                style={{
                  background: selectedCategory === c ? 'var(--uipath-orange)' : 'var(--bg-tertiary)',
                  color: selectedCategory === c ? '#FFF' : 'var(--text-secondary)',
                  border: selectedCategory === c ? '1px solid var(--uipath-orange)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.25rem 0.75rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Mode Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Mode:</span>
            {modes.map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMode(m)}
                style={{
                  background: selectedMode === m ? 'var(--uipath-orange)' : 'var(--bg-tertiary)',
                  color: selectedMode === m ? '#FFF' : 'var(--text-secondary)',
                  border: selectedMode === m ? '1px solid var(--uipath-orange)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.25rem 0.75rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Showing <strong style={{ color: 'var(--text-primary)' }}>{filteredActivities.length}</strong> activities recorded in the ACE institutional memory
        </div>
      </div>

      {/* Activities Display (Timeline vs Grid) */}
      {filteredActivities.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Layers size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Activities Matched Your Filters</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Try resetting the year, category, or search query.
          </p>
          <button
            onClick={() => {
              setSelectedYear('ALL');
              setSelectedCategory('ALL');
              setSelectedMode('ALL');
              setSearchQuery('');
            }}
            className="btn btn-secondary btn-sm"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'timeline' ? (
        /* TIMELINE VIEW (Laser-Rail) */
        <div className="timeline-rail" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {filteredActivities.map((act) => (
            <div key={act.id} style={{ position: 'relative' }}>
              <div className="timeline-node" />
              
              <div className="glass-card" style={{ padding: '2rem', marginLeft: '0.5rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span className="badge badge-orange">{act.category}</span>
                      <span className="badge badge-neutral">{act.eventType}</span>
                      <span className={`badge ${act.status === 'Upcoming' ? 'badge-green' : 'badge-slate'}`}>
                        {act.status}
                      </span>
                    </div>

                    <h2
                      onClick={() => onNavigate('activity_detail', act.slug)}
                      style={{
                        fontSize: '1.45rem',
                        cursor: 'pointer',
                        color: 'var(--text-primary)',
                        transition: 'color var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#FA4616')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                    >
                      {act.title}
                    </h2>
                  </div>

                  {/* Metadata Chips */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    background: 'var(--bg-tertiary)',
                    padding: '0.5rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar size={14} style={{ color: 'var(--uipath-orange)' }} />
                      <span>{act.date}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={14} style={{ color: 'var(--uipath-orange)' }} />
                      <span>{act.venue}</span>
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1.25rem', color: 'var(--text-secondary)' }}>
                  {act.summary}
                </p>

                {/* Topics Covered */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                  {act.uipathTopicsCovered.map((topic, tIdx) => (
                    <span key={tIdx} className="badge badge-slate" style={{ fontSize: '0.7rem' }}>
                      {topic}
                    </span>
                  ))}
                </div>

                {/* Action Row */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    {act.speakers.map((spk) => (
                      <div key={spk.id} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <img
                          src={spk.avatarUrl}
                          alt={spk.name}
                          style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <span>{spk.name}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {act.workflowPackageUrl && (
                      <a
                        href={act.workflowPackageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary btn-sm"
                        title="Download .xaml starter kit"
                      >
                        <Download size={14} /> .XAML Kit
                      </a>
                    )}
                    <button
                      onClick={() => onNavigate('activity_detail', act.slug)}
                      className="btn btn-primary btn-sm"
                    >
                      View Full Archive <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid-responsive-3">
          {filteredActivities.map((act) => (
            <div key={act.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
              <div style={{ height: '180px', position: 'relative', overflow: 'hidden' }}>
                <img
                  src={act.bannerImage}
                  alt={act.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', display: 'flex', gap: '0.35rem' }}>
                  <span className="badge badge-orange">{act.category}</span>
                  <span className="badge badge-neutral">{act.eventType}</span>
                </div>
              </div>

              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.775rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    <Calendar size={13} style={{ color: 'var(--uipath-orange)' }} />
                    <span>{act.date}</span>
                    <span>•</span>
                    <span>{act.venue}</span>
                  </div>

                  <h3
                    onClick={() => onNavigate('activity_detail', act.slug)}
                    style={{ fontSize: '1.15rem', marginBottom: '0.75rem', cursor: 'pointer', lineHeight: 1.35 }}
                  >
                    {act.title}
                  </h3>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineClamp: 2, overflow: 'hidden' }}>
                    {act.summary}
                  </p>
                </div>

                <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge badge-slate" style={{ fontSize: '0.65rem' }}>
                    {act.uipathTopicsCovered[0]}
                  </span>
                  <button
                    onClick={() => onNavigate('activity_detail', act.slug)}
                    className="btn btn-primary btn-sm"
                  >
                    Details <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
