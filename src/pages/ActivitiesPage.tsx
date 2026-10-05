import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Layers, 
  Search, 
  Grid, 
  ListOrdered, 
  Plus, 
  ArrowRight, 
  Download, 
  Sparkles,
  Edit3,
  Trash2,
  Star
} from 'lucide-react';
import { Activity, User } from '../types';
import { hasPermission } from '../lib/security';
import { EventEditorModal } from '../components/EventEditorModal';

interface Props {
  activities: Activity[];
  currentUser: User;
  featuredActivityId?: string;
  onSaveActivity?: (act: Activity) => Promise<any> | void;
  onDeleteActivity?: (id: string) => Promise<any> | void;
  onUpdateSettings?: (settings: any) => Promise<any> | void;
  onNavigate: (view: string, detailId?: string) => void;
}

export const ActivitiesPage: React.FC<Props> = ({
  activities,
  currentUser,
  featuredActivityId,
  onSaveActivity,
  onDeleteActivity,
  onUpdateSettings,
  onNavigate
}) => {
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedMode, setSelectedMode] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('grid');

  // Modal Editing State
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const isEditor = Boolean(currentUser && hasPermission(currentUser.role, 'CORE_TEAM'));

  const handleOpenCreateModal = () => {
    setEditingActivity({
      id: `act_${Date.now()}`,
      slug: `activity-${Date.now()}`,
      title: '',
      category: 'Workshop',
      eventType: 'Offline',
      date: new Date().toISOString().split('T')[0],
      timeStart: '10:00 AM',
      timeEnd: '01:00 PM',
      venue: 'ACE Engineering College',
      summary: '',
      fullDescriptionMd: '',
      objectives: ['Master enterprise robotic process automation', 'Build production bots in UiPath Studio'],
      agenda: [
        { time: '10:00 AM - 10:30 AM', title: 'Welcome & Context', description: 'Overview of enterprise RPA use-case.', speaker: 'Lead Trainer' },
        { time: '10:30 AM - 12:30 PM', title: 'Hands-on Workflow Building', description: 'Live coding in UiPath Studio.', speaker: 'Technical Lead' }
      ],
      uipathTopicsCovered: ['UiPath Studio', 'REFramework'],
      learningOutcomes: ['Deploy working automations with error handling'],
      bannerImage: '/uipath-session-1.png',
      galleryImages: [],
      status: 'Upcoming',
      isFeatured: false,
      registrationUrl: '',
      meetingUrl: '',
      capacity: '',
      targetAudience: '',
      speakers: [{ id: `spk_${Date.now()}`, name: currentUser.name || 'Lead Speaker', roleTitle: 'Lead RPA Trainer', organization: 'ACE UiPath Community', avatarUrl: currentUser.avatarUrl || '/tejaswy.png', linkedinUrl: currentUser.linkedinUrl || '', bio: '' }]
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (act: Activity, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingActivity(act);
    setIsModalOpen(true);
  };

  const handleSaveModal = async (actToSave: Activity, makeFeatured: boolean) => {
    if (onSaveActivity) {
      await onSaveActivity(actToSave);
    }
    if (onUpdateSettings) {
      if (makeFeatured) {
        onUpdateSettings({ featuredActivityId: actToSave.id });
      } else if (featuredActivityId === actToSave.id && !makeFeatured) {
        onUpdateSettings({ featuredActivityId: '' });
      }
    }
    setIsModalOpen(false);
    showToast(`Event "${actToSave.title}" saved successfully!`);
  };

  const handleDelete = async (act: Activity, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to permanently delete the event "${act.title}"?`)) {
      if (onDeleteActivity) {
        await onDeleteActivity(act.id);
        showToast('Event removed.');
      }
    }
  };

  const years = ['ALL', '2026', '2025', '2024', '2023', '2022'];
  const categories = ['ALL', 'Workshop', 'Hackathon', 'Certification', 'Bootcamp', 'Guest Lecture', 'Community Meetup'];
  const modes = ['ALL', 'Offline', 'Online', 'Hybrid'];

  const filteredActivities = activities.filter((act) => {
    if (selectedYear !== 'ALL' && !act.date.startsWith(selectedYear)) return false;
    if (selectedCategory !== 'ALL' && act.category !== selectedCategory) return false;
    if (selectedMode !== 'ALL' && act.eventType !== selectedMode) return false;
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
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 9999,
          background: '#FA4616',
          color: '#FFF',
          padding: '0.85rem 1.5rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 8px 30px rgba(250, 70, 22, 0.4)',
          fontWeight: 600,
          fontSize: '0.9rem'
        }}>
          {toastMsg}
        </div>
      )}

      {/* Header Banner */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
          <div>
            <span className="badge badge-orange" style={{ marginBottom: '0.5rem' }}>
              Institutional Knowledge Archive
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.025em' }}>
              Activity Timeline & Meetups
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* View Mode Toggle */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0.25rem',
              display: 'flex',
              gap: '0.25rem'
            }}>
              <button
                onClick={() => setViewMode('timeline')}
                className={`btn btn-sm ${viewMode === 'timeline' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                title="Timeline View"
              >
                <ListOrdered size={14} /> Timeline
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                title="Grid View"
              >
                <Grid size={14} /> Grid
              </button>
            </div>

            {/* Direct Add Event Button for Admin / Core Team */}
            {isEditor && (
              <button
                onClick={handleOpenCreateModal}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}
              >
                <Plus size={16} /> Add New Event
              </button>
            )}
          </div>
        </div>

        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '780px', lineHeight: 1.6 }}>
          Explore the complete historical journey of the ACE UiPath Community from 2022 to the present. Access slide decks, code packages, speaker profiles, and learning outcomes.
        </p>
      </div>

      {/* Multi-Dimensional Filter Bar */}
      <div className="glass-panel" style={{
        padding: '1.25rem 1.5rem',
        marginBottom: '2.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {/* Search Bar */}
        <div style={{ position: 'relative' }}>
          <Search size={17} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search activities by title, concept (e.g. REFramework, Selectors), speaker, or venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control-dark"
            style={{ paddingLeft: '2.65rem' }}
          />
        </div>

        {/* Filter Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', alignItems: 'center', paddingTop: '0.25rem' }}>
          {/* Year Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Year:</span>
            {years.map((y) => (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                style={{
                  background: selectedYear === y ? 'var(--uipath-orange)' : 'rgba(255, 255, 255, 0.05)',
                  color: selectedYear === y ? '#FFF' : 'var(--text-secondary)',
                  border: selectedYear === y ? '1px solid var(--uipath-orange)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.2rem 0.65rem',
                  fontSize: '0.775rem',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Type:</span>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                style={{
                  background: selectedCategory === c ? 'var(--uipath-orange)' : 'rgba(255, 255, 255, 0.05)',
                  color: selectedCategory === c ? '#FFF' : 'var(--text-secondary)',
                  border: selectedCategory === c ? '1px solid var(--uipath-orange)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.2rem 0.65rem',
                  fontSize: '0.775rem',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Mode:</span>
            {modes.map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMode(m)}
                style={{
                  background: selectedMode === m ? 'var(--uipath-orange)' : 'rgba(255, 255, 255, 0.05)',
                  color: selectedMode === m ? '#FFF' : 'var(--text-secondary)',
                  border: selectedMode === m ? '1px solid var(--uipath-orange)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.2rem 0.65rem',
                  fontSize: '0.775rem',
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Showing <strong style={{ color: 'var(--text-primary)' }}>{filteredActivities.length}</strong> recorded community activities
        </div>
      </div>

      {/* Activities Display (Timeline vs Grid) */}
      {filteredActivities.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Layers size={42} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', fontWeight: 700 }}>No Activities Match Your Filters</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Try resetting the year, type, or search keywords.
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
        /* TIMELINE VIEW */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {filteredActivities.map((act) => (
            <div key={act.id} className="glass-card" style={{ padding: '1.75rem', position: 'relative' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                    <span className="badge badge-orange">{act.category}</span>
                    <span className="badge badge-neutral">{act.eventType}</span>
                    <span className={`badge ${act.status === 'Upcoming' ? 'badge-green' : 'badge-slate'}`}>
                      {act.status === 'Upcoming' && <span className="status-dot-pulse" style={{ marginRight: '0.2rem' }} />}
                      {act.status}
                    </span>
                    {act.id === featuredActivityId && (
                      <span className="badge badge-orange" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Star size={10} /> Homepage Hero
                      </span>
                    )}
                  </div>

                  <h2
                    onClick={() => onNavigate('activity_detail', act.slug)}
                    style={{
                      fontSize: '1.35rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      color: 'var(--text-primary)',
                      transition: 'color var(--transition-fast)',
                      lineHeight: 1.3
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#FA4616')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                  >
                    {act.title}
                  </h2>
                </div>

                {/* Metadata Chips & Quick Admin Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    background: 'rgba(255, 255, 255, 0.04)',
                    padding: '0.45rem 0.8rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar size={13} style={{ color: 'var(--uipath-orange)' }} />
                      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{act.date}</span>
                    </div>
                    <span style={{ opacity: 0.3 }}>|</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={13} style={{ color: 'var(--uipath-orange)' }} />
                      <span>{act.venue}</span>
                    </div>
                  </div>

                  {/* Direct Edit / Delete buttons for Admin / Core Team */}
                  {isEditor && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <button
                        type="button"
                        onClick={(e) => handleOpenEditModal(act, e)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.45rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem' }}
                        title="Edit event details"
                      >
                        <Edit3 size={13} /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(act, e)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.45rem 0.5rem', color: '#EF4444' }}
                        title="Delete event"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <p style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.15rem', color: 'var(--text-secondary)' }}>
                {act.summary}
              </p>

              {/* Topics Covered */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
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
                    <div key={spk.id} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <img
                        src={spk.avatarUrl}
                        alt={spk.name}
                        style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span style={{ color: 'var(--text-secondary)' }}>{spk.name}</span>
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
                      <Download size={13} /> .XAML Kit
                    </a>
                  )}
                  <button
                    onClick={() => onNavigate('activity_detail', act.slug)}
                    className="btn btn-primary btn-sm"
                  >
                    View Details <ArrowRight size={13} />
                  </button>
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
              <div style={{ height: '170px', position: 'relative', overflow: 'hidden' }}>
                <img
                  src={act.bannerImage}
                  alt={act.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '0.65rem', left: '0.65rem', display: 'flex', gap: '0.3rem' }}>
                  <span className="badge badge-orange">{act.category}</span>
                  <span className="badge badge-neutral">{act.eventType}</span>
                </div>

                {isEditor && (
                  <button
                    type="button"
                    onClick={(e) => handleOpenEditModal(act, e)}
                    style={{
                      position: 'absolute',
                      top: '0.65rem',
                      right: '0.65rem',
                      background: 'rgba(0,0,0,0.7)',
                      color: '#FFF',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px',
                      padding: '0.35rem 0.5rem',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <Edit3 size={12} /> Edit
                  </button>
                )}
              </div>

              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    <Calendar size={12} style={{ color: 'var(--uipath-orange)' }} />
                    <span>{act.date}</span>
                    <span>•</span>
                    <span>{act.venue}</span>
                  </div>

                  <h3
                    onClick={() => onNavigate('activity_detail', act.slug)}
                    style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.65rem', cursor: 'pointer', lineHeight: 1.35 }}
                  >
                    {act.title}
                  </h3>

                  <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1.15rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {act.summary}
                  </p>
                </div>

                <div style={{ paddingTop: '0.85rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge badge-slate" style={{ fontSize: '0.675rem' }}>
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

      {/* MODAL: EVENT EDITOR MODAL */}
      <EventEditorModal
        isOpen={isModalOpen}
        activity={editingActivity}
        isFeaturedOnHome={editingActivity ? editingActivity.id === featuredActivityId : false}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModal}
      />
    </div>
  );
};
