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
  Star,
  X,
  RotateCcw,
  Sliders,
  Filter
} from 'lucide-react';
import { Activity, User, SiteSettings } from '../types';
import { hasPermission } from '../lib/security';
import { EventEditorModal } from '../components/EventEditorModal';
import { DEFAULT_ACTIVITY_CATEGORIES, DEFAULT_ACTIVITY_YEARS, DEFAULT_ACTIVITY_MODES } from '../data/initialData';

interface Props {
  activities: Activity[];
  currentUser: User;
  featuredActivityId?: string;
  settings?: SiteSettings;
  onSaveActivity?: (act: Activity) => Promise<any> | void;
  onDeleteActivity?: (id: string) => Promise<any> | void;
  onUpdateSettings?: (settings: any) => Promise<any> | void;
  onNavigate: (view: string, detailId?: string) => void;
}

export const ActivitiesPage: React.FC<Props> = ({
  activities,
  currentUser,
  featuredActivityId,
  settings,
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

  // Filter Management State
  const [isFilterManagerOpen, setIsFilterManagerOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState<'year' | 'category' | 'mode' | null>(null);
  const [quickAddValue, setQuickAddValue] = useState('');

  // Dynamic filter lists from settings or defaults
  const activeYears = (settings?.activityYears && settings.activityYears.length > 0)
    ? settings.activityYears
    : DEFAULT_ACTIVITY_YEARS;

  const activeCategories = (settings?.activityCategories && settings.activityCategories.length > 0)
    ? settings.activityCategories
    : DEFAULT_ACTIVITY_CATEGORIES;

  const activeModes = (settings?.activityModes && settings.activityModes.length > 0)
    ? settings.activityModes
    : DEFAULT_ACTIVITY_MODES;

  const years = ['ALL', ...activeYears];
  const categories = ['ALL', ...activeCategories];
  const modes = ['ALL', ...activeModes];

  // Modal Editing State
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const isEditor = Boolean(currentUser && hasPermission(currentUser.role, 'CORE_TEAM'));

  // Filter Add & Remove Handlers for Admin
  const handleAddFilter = (type: 'year' | 'category' | 'mode', value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (type === 'year') {
      if (!/^\d{4}$/.test(trimmed)) {
        alert('Please enter a valid 4-digit year (e.g. 2027)');
        return;
      }
      if (!activeYears.includes(trimmed)) {
        const updated = [trimmed, ...activeYears].sort((a, b) => Number(b) - Number(a));
        onUpdateSettings?.({ activityYears: updated });
        showToast(`Year filter "${trimmed}" added.`);
      }
    } else if (type === 'category') {
      if (!activeCategories.includes(trimmed)) {
        const updated = [...activeCategories, trimmed];
        onUpdateSettings?.({ activityCategories: updated });
        showToast(`Category filter "${trimmed}" added.`);
      }
    } else if (type === 'mode') {
      if (!activeModes.includes(trimmed)) {
        const updated = [...activeModes, trimmed];
        onUpdateSettings?.({ activityModes: updated });
        showToast(`Mode filter "${trimmed}" added.`);
      }
    }
    setQuickAddType(null);
    setQuickAddValue('');
  };

  const handleRemoveFilter = (type: 'year' | 'category' | 'mode', value: string) => {
    if (type === 'year') {
      if (activeYears.length <= 1) {
        alert('At least one year filter must remain.');
        return;
      }
      const updated = activeYears.filter((y) => y !== value);
      if (selectedYear === value) setSelectedYear('ALL');
      onUpdateSettings?.({ activityYears: updated });
      showToast(`Year filter "${value}" removed.`);
    } else if (type === 'category') {
      if (activeCategories.length <= 1) {
        alert('At least one category filter must remain.');
        return;
      }
      const updated = activeCategories.filter((c) => c !== value);
      if (selectedCategory === value) setSelectedCategory('ALL');
      onUpdateSettings?.({ activityCategories: updated });
      showToast(`Category filter "${value}" removed.`);
    } else if (type === 'mode') {
      if (activeModes.length <= 1) {
        alert('At least one mode filter must remain.');
        return;
      }
      const updated = activeModes.filter((m) => m !== value);
      if (selectedMode === value) setSelectedMode('ALL');
      onUpdateSettings?.({ activityModes: updated });
      showToast(`Mode filter "${value}" removed.`);
    }
  };

  const handleResetFiltersToDefault = () => {
    if (!window.confirm('Reset all timeline filters (years, categories, modes) back to defaults?')) return;
    onUpdateSettings?.({
      activityCategories: DEFAULT_ACTIVITY_CATEGORIES,
      activityYears: DEFAULT_ACTIVITY_YEARS,
      activityModes: DEFAULT_ACTIVITY_MODES
    });
    showToast('Filters reset to defaults.');
  };

  const handleOpenCreateModal = () => {
    const defaultYear = (activeYears && activeYears.length > 0) ? activeYears[0] : '2026';
    const defaultCategory = (activeCategories && activeCategories.length > 0) ? activeCategories[0] : 'Workshop';
    setEditingActivity({
      id: `act_${Date.now()}`,
      slug: `activity-${Date.now()}`,
      title: '',
      category: defaultCategory,
      eventType: 'Offline',
      year: defaultYear,
      date: `${defaultYear}-11-03`,
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

  const filteredActivities = activities.filter((act) => {
    const actYear = act.year || (act.date ? act.date.split('-')[0] : '');
    if (selectedYear !== 'ALL' && actYear !== selectedYear) return false;
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
        padding: 'clamp(1rem, 2.5vw, 1.35rem)',
        marginBottom: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        border: '1px solid var(--border-glow)'
      }}>
        {/* Search Bar */}
        <div style={{ position: 'relative' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              pointerEvents: 'none'
            }}
          />
          <input
            type="text"
            placeholder="Search activities by title, concept (e.g. REFramework, Selectors), speaker, or venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control-dark form-control-with-icon"
            style={{
              width: '100%',
              minHeight: '44px',
              paddingLeft: '2.75rem',
              paddingRight: searchQuery ? '2.5rem' : '1rem',
              boxSizing: 'border-box'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.3rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'color 0.15s ease'
              }}
              title="Clear search"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Filter Dimensions (Year, Type, Mode) */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          paddingTop: '0.65rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          {/* Admin Header with Manage Filters Trigger */}
          {isEditor && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.15rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--uipath-orange)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Sliders size={13} /> Filter Engine Controls (Admin Enabled)
              </span>
              <button
                onClick={() => setIsFilterManagerOpen(true)}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.25rem 0.7rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem', borderColor: 'rgba(250, 70, 22, 0.4)', color: '#FED7AA' }}
                title="Manage, add, or remove filter tags"
              >
                <Sliders size={12} /> Manage All Filters
              </button>
            </div>
          )}

          {/* Year Chips */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            flexWrap: 'wrap'
          }}>
            <span style={{
              minWidth: '50px',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              flexShrink: 0
            }}>
              Year:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
              {years.map((y) => {
                const isSelected = selectedYear === y;
                return (
                  <button
                    key={y}
                    onClick={() => setSelectedYear(y)}
                    style={{
                      background: isSelected ? 'var(--uipath-orange)' : 'rgba(255, 255, 255, 0.04)',
                      color: isSelected ? '#FFF' : 'var(--text-secondary)',
                      border: isSelected ? '1px solid var(--uipath-orange)' : '1px solid rgba(255, 255, 255, 0.08)',
                      boxShadow: isSelected ? '0 2px 8px rgba(250, 70, 22, 0.35)' : 'none',
                      borderRadius: 'var(--radius-full)',
                      padding: '0.28rem 0.75rem',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      lineHeight: 1.3
                    }}
                  >
                    {y}
                  </button>
                );
              })}
              {isEditor && (
                <button
                  type="button"
                  onClick={() => {
                    setQuickAddType(quickAddType === 'year' ? null : 'year');
                    setQuickAddValue('');
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{
                    borderRadius: 'var(--radius-full)',
                    padding: '0.25rem 0.65rem',
                    fontSize: '0.74rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    borderColor: quickAddType === 'year' ? 'var(--uipath-orange)' : 'rgba(255, 255, 255, 0.15)',
                    color: quickAddType === 'year' ? 'var(--uipath-orange)' : '#FED7AA'
                  }}
                  title="Admin: Add new year filter"
                >
                  <Plus size={12} /> Add Year
                </button>
              )}
            </div>
          </div>

          {/* Category / Type Chips */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            flexWrap: 'wrap'
          }}>
            <span style={{
              minWidth: '50px',
              paddingTop: '0.3rem',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              flexShrink: 0
            }}>
              Type:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center', flex: 1 }}>
              {categories.map((c) => {
                const isSelected = selectedCategory === c;
                return (
                  <button
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    style={{
                      background: isSelected ? 'var(--uipath-orange)' : 'rgba(255, 255, 255, 0.04)',
                      color: isSelected ? '#FFF' : 'var(--text-secondary)',
                      border: isSelected ? '1px solid var(--uipath-orange)' : '1px solid rgba(255, 255, 255, 0.08)',
                      boxShadow: isSelected ? '0 2px 8px rgba(250, 70, 22, 0.35)' : 'none',
                      borderRadius: 'var(--radius-full)',
                      padding: '0.28rem 0.75rem',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      lineHeight: 1.3
                    }}
                  >
                    {c}
                  </button>
                );
              })}
              {isEditor && (
                <button
                  type="button"
                  onClick={() => {
                    setQuickAddType(quickAddType === 'category' ? null : 'category');
                    setQuickAddValue('');
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{
                    borderRadius: 'var(--radius-full)',
                    padding: '0.25rem 0.65rem',
                    fontSize: '0.74rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    borderColor: quickAddType === 'category' ? 'var(--uipath-orange)' : 'rgba(255, 255, 255, 0.15)',
                    color: quickAddType === 'category' ? 'var(--uipath-orange)' : '#FED7AA'
                  }}
                  title="Admin: Add new type/category filter"
                >
                  <Plus size={12} /> Add Type
                </button>
              )}
            </div>
          </div>

          {/* Mode Chips */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            flexWrap: 'wrap'
          }}>
            <span style={{
              minWidth: '50px',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              flexShrink: 0
            }}>
              Mode:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
              {modes.map((m) => {
                const isSelected = selectedMode === m;
                return (
                  <button
                    key={m}
                    onClick={() => setSelectedMode(m)}
                    style={{
                      background: isSelected ? 'var(--uipath-orange)' : 'rgba(255, 255, 255, 0.04)',
                      color: isSelected ? '#FFF' : 'var(--text-secondary)',
                      border: isSelected ? '1px solid var(--uipath-orange)' : '1px solid rgba(255, 255, 255, 0.08)',
                      boxShadow: isSelected ? '0 2px 8px rgba(250, 70, 22, 0.35)' : 'none',
                      borderRadius: 'var(--radius-full)',
                      padding: '0.28rem 0.75rem',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      lineHeight: 1.3
                    }}
                  >
                    {m}
                  </button>
                );
              })}
              {isEditor && (
                <button
                  type="button"
                  onClick={() => {
                    setQuickAddType(quickAddType === 'mode' ? null : 'mode');
                    setQuickAddValue('');
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{
                    borderRadius: 'var(--radius-full)',
                    padding: '0.25rem 0.65rem',
                    fontSize: '0.74rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    borderColor: quickAddType === 'mode' ? 'var(--uipath-orange)' : 'rgba(255, 255, 255, 0.15)',
                    color: quickAddType === 'mode' ? 'var(--uipath-orange)' : '#FED7AA'
                  }}
                  title="Admin: Add new delivery mode filter"
                >
                  <Plus size={12} /> Add Mode
                </button>
              )}
            </div>
          </div>

          {/* Quick Add Form Inline Bar */}
          {quickAddType && (
            <div style={{
              background: 'rgba(250, 70, 22, 0.08)',
              border: '1px solid rgba(250, 70, 22, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '0.65rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              flexWrap: 'wrap',
              marginTop: '0.25rem'
            }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#FFF' }}>
                Add New {quickAddType === 'year' ? 'Year' : quickAddType === 'category' ? 'Type / Category' : 'Delivery Mode'} Filter:
              </span>
              <input
                type="text"
                autoFocus
                placeholder={quickAddType === 'year' ? 'e.g., 2027' : quickAddType === 'category' ? 'e.g., Masterclass, Webinar, AMA' : 'e.g., Self-Paced'}
                value={quickAddValue}
                onChange={(e) => setQuickAddValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFilter(quickAddType, quickAddValue);
                  }
                }}
                style={{
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.35rem 0.75rem',
                  color: '#FFF',
                  fontSize: '0.82rem',
                  minWidth: '220px'
                }}
              />
              <button
                type="button"
                onClick={() => handleAddFilter(quickAddType, quickAddValue)}
                className="btn btn-primary btn-sm"
                style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}
              >
                Save Filter
              </button>
              <button
                type="button"
                onClick={() => { setQuickAddType(null); setQuickAddValue(''); }}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>

      {/* Results Count Bar & Reset Action */ }
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
      Showing <strong style={{ color: 'var(--text-primary)' }}>{filteredActivities.length}</strong> recorded community {filteredActivities.length === 1 ? 'activity' : 'activities'}
    </div>
    {(selectedYear !== 'ALL' || selectedCategory !== 'ALL' || selectedMode !== 'ALL' || searchQuery.trim() !== '') && (
      <button
        onClick={() => {
          setSelectedYear('ALL');
          setSelectedCategory('ALL');
          setSelectedMode('ALL');
          setSearchQuery('');
        }}
        className="btn btn-secondary btn-sm"
        style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
      >
        <RotateCcw size={12} /> Reset Filters
      </button>
    )}
  </div>

  {/* Activities Display (Timeline vs Grid) */ }
  {
    filteredActivities.length === 0 ? (
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
    <div className="grid-responsive-3" style={{ alignItems: 'start' }}>
      {filteredActivities.map((act) => (
        <div
          key={act.id}
          className="glass-card hover-glow"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'hidden',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease'
          }}
        >
          {/* Natural Aspect Ratio Poster Container */}
          {act.bannerImage && (
            <div
              onClick={() => onNavigate('activity_detail', act.slug)}
              style={{
                position: 'relative',
                overflow: 'hidden',
                background: 'radial-gradient(circle at 50% 50%, rgba(30, 30, 35, 0.9) 0%, rgba(10, 10, 12, 1) 100%)',
                cursor: 'pointer',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%'
              }}
            >
              <img
                src={act.bannerImage}
                alt={act.title}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '480px',
                  objectFit: 'contain',
                  display: 'block',
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.png';
                }}
              />

              {isEditor && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEditModal(act, e);
                  }}
                  style={{
                    position: 'absolute',
                    top: '0.65rem',
                    right: '0.65rem',
                    background: 'rgba(0,0,0,0.75)',
                    backdropFilter: 'blur(8px)',
                    color: '#FFF',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    padding: '0.35rem 0.55rem',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    zIndex: 2
                  }}
                >
                  <Edit3 size={12} /> Edit
                </button>
              )}
            </div>
          )}

          <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              {/* Category & Status Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.65rem' }}>
                <span className="badge badge-orange" style={{ fontSize: '0.7rem' }}>{act.category}</span>
                <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>{act.eventType}</span>
                <span className={`badge ${act.status === 'Upcoming' ? 'badge-green' : 'badge-slate'}`} style={{ fontSize: '0.7rem' }}>
                  {act.status === 'Upcoming' && <span className="status-dot-pulse" style={{ marginRight: '0.2rem' }} />}
                  {act.status}
                </span>
                {act.id === featuredActivityId && (
                  <span className="badge badge-orange" style={{ fontSize: '0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                    <Star size={9} /> Featured
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                <Calendar size={12} style={{ color: 'var(--uipath-orange)' }} />
                <span>{act.date}</span>
                <span>•</span>
                <MapPin size={12} style={{ color: 'var(--uipath-orange)' }} />
                <span>{act.venue}</span>
              </div>

              <h3
                onClick={() => onNavigate('activity_detail', act.slug)}
                style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.65rem', cursor: 'pointer', lineHeight: 1.35 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FA4616')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
              >
                {act.title}
              </h3>

              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1.15rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {act.summary}
              </p>
            </div>

            <div style={{ paddingTop: '0.85rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="badge badge-slate" style={{ fontSize: '0.675rem' }}>
                {act.uipathTopicsCovered[0] || act.category}
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
  )
  }

  {/* MODAL: EVENT EDITOR MODAL */ }
  <EventEditorModal
    isOpen={isModalOpen}
    activity={editingActivity}
    isFeaturedOnHome={editingActivity ? editingActivity.id === featuredActivityId : false}
    categories={activeCategories}
    years={activeYears}
    modes={activeModes}
    onUpdateCategories={(newCats) => onUpdateSettings?.({ activityCategories: newCats })}
    onUpdateYears={(newYrs) => onUpdateSettings?.({ activityYears: newYrs })}
    onClose={() => setIsModalOpen(false)}
    onSave={handleSaveModal}
  />

  {/* MODAL: MANAGE TIMELINE FILTERS (Admin Full Governance) */ }
  {
    isFilterManagerOpen && (
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '580px',
          background: '#121214',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          color: '#FFF',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sliders size={18} style={{ color: 'var(--uipath-orange)' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Manage Timeline Filters</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsFilterManagerOpen(false)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
            >
              <X size={18} />
            </button>
          </div>

          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            Administrators can add or remove filter values for years, event categories, and delivery modes. Any updates take effect immediately across the public timeline and activity editor.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* SECTION 1: YEARS */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>
                Event Year Filters ({activeYears.length})
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.65rem' }}>
                {activeYears.map((yr) => (
                  <span
                    key={yr}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-full)',
                      padding: '0.25rem 0.65rem',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}
                  >
                    <span>{yr}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFilter('year', yr)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, display: 'flex' }}
                      title={`Remove year ${yr}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              {/* Add Year Input */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="Add Year (e.g., 2027)..."
                  id="newYearModalInput"
                  style={{ flex: 1, padding: '0.45rem 0.75rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', fontSize: '0.825rem' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = (e.target as HTMLInputElement).value;
                      if (val) {
                        handleAddFilter('year', val);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('newYearModalInput') as HTMLInputElement;
                    if (input && input.value) {
                      handleAddFilter('year', input.value);
                      input.value = '';
                    }
                  }}
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: '0.78rem' }}
                >
                  <Plus size={12} /> Add
                </button>
              </div>
            </div>

            {/* SECTION 2: CATEGORIES */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>
                Type / Category Filters ({activeCategories.length})
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.65rem', maxHeight: '140px', overflowY: 'auto' }}>
                {activeCategories.map((cat) => (
                  <span
                    key={cat}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-full)',
                      padding: '0.25rem 0.65rem',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}
                  >
                    <span>{cat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFilter('category', cat)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, display: 'flex' }}
                      title={`Remove category "${cat}"`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              {/* Add Category Input */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Add Category (e.g., Webinar, AMA, Summit)..."
                  id="newCatModalInput"
                  style={{ flex: 1, padding: '0.45rem 0.75rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', fontSize: '0.825rem' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = (e.target as HTMLInputElement).value;
                      if (val) {
                        handleAddFilter('category', val);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('newCatModalInput') as HTMLInputElement;
                    if (input && input.value) {
                      handleAddFilter('category', input.value);
                      input.value = '';
                    }
                  }}
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: '0.78rem' }}
                >
                  <Plus size={12} /> Add
                </button>
              </div>
            </div>

            {/* SECTION 3: MODES */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>
                Delivery Mode Filters ({activeModes.length})
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.65rem' }}>
                {activeModes.map((m) => (
                  <span
                    key={m}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-full)',
                      padding: '0.25rem 0.65rem',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}
                  >
                    <span>{m}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFilter('mode', m)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, display: 'flex' }}
                      title={`Remove mode "${m}"`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              {/* Add Mode Input */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Add Mode (e.g., Self-Paced)..."
                  id="newModeModalInput"
                  style={{ flex: 1, padding: '0.45rem 0.75rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', fontSize: '0.825rem' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = (e.target as HTMLInputElement).value;
                      if (val) {
                        handleAddFilter('mode', val);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('newModeModalInput') as HTMLInputElement;
                    if (input && input.value) {
                      handleAddFilter('mode', input.value);
                      input.value = '';
                    }
                  }}
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: '0.78rem' }}
                >
                  <Plus size={12} /> Add
                </button>
              </div>
            </div>
          </div>

          {/* Modal Actions Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              onClick={handleResetFiltersToDefault}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <RotateCcw size={12} /> Reset to Defaults
            </button>
            <button
              type="button"
              onClick={() => setIsFilterManagerOpen(false)}
              className="btn btn-primary btn-sm"
              style={{ fontSize: '0.825rem' }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    )
  }
    </div >
  );
};
