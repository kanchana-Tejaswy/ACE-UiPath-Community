import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Layers, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  FileText, 
  Video, 
  Image as ImageIcon,
  Plus,
  Clock,
  Send,
  AlertTriangle,
  Trash2,
  Edit3,
  Search,
  Check,
  X,
  FileCode,
  Download
} from 'lucide-react';
import { Activity, ProjectShowcase, User, ActivityDraft, DraftStatus } from '../types';

interface Props {
  activities: Activity[];
  projects: ProjectShowcase[];
  activityDrafts: ActivityDraft[];
  selectedDraftId?: string;
  currentUser: User;
  onSaveActivity: (act: Activity) => void;
  onSaveProject: (proj: ProjectShowcase) => void;
  onSaveDraft: (draft: ActivityDraft) => void;
  onDeleteDraft: (id: string) => void;
  onSubmitDraft: (id: string) => void;
  onNavigate: (view: string, detailId?: string) => void;
}

export const CoreTeamPage: React.FC<Props> = ({
  activities,
  projects,
  activityDrafts,
  selectedDraftId,
  currentUser,
  onSaveActivity,
  onSaveProject,
  onSaveDraft,
  onDeleteDraft,
  onSubmitDraft,
  onNavigate
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingDraft, setEditingDraft] = useState<ActivityDraft | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Autosave status indicator
  const [autosaveStatus, setAutosaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');

  // Quick media attach form state
  const [selectedActivityId, setSelectedActivityId] = useState<string>(activities[0]?.id || '');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'recording' | 'slides' | 'workflow'>('recording');
  const [mediaSaved, setMediaSaved] = useState(false);

  // Resolve selectedDraftId from hash if present
  useEffect(() => {
    if (selectedDraftId) {
      const match = activityDrafts.find((d) => d.id === selectedDraftId);
      if (match) setEditingDraft(match);
    }
  }, [selectedDraftId, activityDrafts]);

  // Compute metrics
  const totalDrafts = activityDrafts.length;
  const submittedCount = activityDrafts.filter((d) => d.status === 'SUBMITTED').length;
  const inReviewCount = activityDrafts.filter((d) => d.status === 'IN_REVIEW' || d.status === 'CHANGES_REQUESTED').length;
  const publishedCount = activityDrafts.filter((d) => d.status === 'PUBLISHED').length;

  const pendingProjects = projects.filter((p) => p.status === 'Pending');

  const filteredDrafts = activityDrafts.filter((d) => {
    if (filterStatus !== 'ALL' && d.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return d.title.toLowerCase().includes(q) || d.summary.toLowerCase().includes(q);
    }
    return true;
  });

  const calculateCompletion = (draft: Partial<ActivityDraft>): number => {
    let score = 0;
    if (draft.title) score += 20;
    if (draft.date) score += 15;
    if (draft.venue) score += 15;
    if (draft.summary) score += 20;
    if (draft.agenda && draft.agenda.length > 0) score += 15;
    if (draft.workflowPackageUrl || draft.slidesUrl || draft.recordingUrl) score += 15;
    return Math.min(100, score);
  };

  const handleCreateNewDraft = () => {
    const newId = `draft_${Date.now()}`;
    const newDraft: ActivityDraft = {
      id: newId,
      slug: `draft-activity-${Date.now()}`,
      title: 'New UiPath Activity Draft',
      category: 'Workshop',
      eventType: 'Offline',
      date: new Date().toISOString().split('T')[0],
      timeStart: '10:00 AM',
      timeEnd: '01:00 PM',
      venue: 'ACE Engineering College - Computer Lab',
      summary: 'Draft summary description for upcoming UiPath session.',
      fullDescriptionMd: '### Overview\nDescribe the activity objectives and hands-on exercises.',
      objectives: ['Master UiPath Studio fundamentals'],
      agenda: [{ time: '10:00 AM', title: 'Introduction', description: 'Welcome and session outline' }],
      uipathTopicsCovered: ['UiPath Studio', 'REFramework'],
      learningOutcomes: ['Build first automation bot'],
      bannerImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
      galleryImages: [],
      speakers: [],
      isFeatured: false,
      status: 'DRAFT',
      createdBy: currentUser.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completionPercentage: 50
    };

    onSaveDraft(newDraft);
    setEditingDraft(newDraft);
    onNavigate('core', newId);
  };

  const handleUpdateDraftField = (field: keyof ActivityDraft, value: any) => {
    if (!editingDraft) return;
    setAutosaveStatus('saving');
    const updated = {
      ...editingDraft,
      [field]: value,
      updatedAt: new Date().toISOString(),
      completionPercentage: calculateCompletion({ ...editingDraft, [field]: value })
    };
    setEditingDraft(updated);
    onSaveDraft(updated);
    setTimeout(() => setAutosaveStatus('saved'), 600);
  };

  const handleSubmitForReview = (draft: ActivityDraft) => {
    if (!draft.title || !draft.summary || !draft.date) {
      alert('Please fill in title, summary, and date before submitting for review.');
      return;
    }
    onSubmitDraft(draft.id);
    setEditingDraft(null);
    onNavigate('core');
  };

  const handleAttachMedia = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedActivity = activities.find((a) => a.id === selectedActivityId) || activities[0];
    if (!mediaUrl.trim() || !selectedActivity) return;

    const updated: Activity = {
      ...selectedActivity,
      recordingUrl: mediaType === 'recording' ? mediaUrl : selectedActivity.recordingUrl,
      slidesUrl: mediaType === 'slides' ? mediaUrl : selectedActivity.slidesUrl,
      workflowPackageUrl: mediaType === 'workflow' ? mediaUrl : selectedActivity.workflowPackageUrl
    };

    onSaveActivity(updated);
    setMediaSaved(true);
    setTimeout(() => setMediaSaved(false), 3000);
    setMediaUrl('');
  };

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
      {/* Workspace Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span className="badge badge-neutral">
            <ShieldCheck size={13} /> Core Team Operational Workspace
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800 }}>
              Activity Staging & Content Governance
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '780px', marginTop: '0.35rem' }}>
              Welcome, {currentUser.name}! Create activity drafts, stage session slides/.XAML starter packages, and submit content for Admin review.
            </p>
          </div>

          <button onClick={handleCreateNewDraft} className="btn btn-primary" style={{ gap: '0.4rem' }}>
            <Plus size={16} /> Create Activity Draft
          </button>
        </div>
      </div>

      {/* Metrics Dashboard Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        marginBottom: '2.5rem'
      }}>
        <div className="glass-card" style={{ padding: '1.25rem', background: 'var(--bg-tertiary)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL DRAFTS</div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>{totalDrafts}</div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', background: 'var(--bg-tertiary)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>SUBMITTED FOR REVIEW</div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>{submittedCount}</div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', background: 'var(--bg-tertiary)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>IN REVIEW / CHANGES</div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#F59E0B', marginTop: '0.2rem' }}>{inReviewCount}</div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', background: 'var(--bg-tertiary)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>PUBLISHED TO SITE</div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#10B981', marginTop: '0.2rem' }}>{publishedCount}</div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      {editingDraft ? (
        /* Multi-step Draft Editor */
        <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span className={`badge ${editingDraft.status === 'SUBMITTED' ? 'badge-neutral' : editingDraft.status === 'CHANGES_REQUESTED' ? 'badge-orange' : 'badge-slate'}`}>
                  {editingDraft.status}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Created by {editingDraft.createdBy}
                </span>
              </div>
              <h2 style={{ fontSize: '1.6rem', marginTop: '0.35rem' }}>Editing Draft: {editingDraft.title}</h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                {autosaveStatus === 'saving' ? <Clock size={14} style={{ color: '#F59E0B' }} /> : <CheckCircle2 size={14} style={{ color: '#10B981' }} />}
                {autosaveStatus === 'saving' ? 'Autosaving...' : 'Saved to Local DB'}
              </span>

              <button
                onClick={() => {
                  setEditingDraft(null);
                  onNavigate('core');
                }}
                className="btn btn-secondary btn-sm"
              >
                Back to Workspace
              </button>
            </div>
          </div>

          {/* Changes Requested Banner */}
          {editingDraft.status === 'CHANGES_REQUESTED' && editingDraft.reviewNotes && (
            <div style={{
              padding: '1.25rem',
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid #F59E0B',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#F59E0B', marginBottom: '0.35rem' }}>
                <AlertTriangle size={18} /> Admin Review Notes & Requested Changes:
              </div>
              <p style={{ fontSize: '0.9rem', color: '#FEF3C7', lineHeight: 1.5 }}>
                {editingDraft.reviewNotes}
              </p>
            </div>
          )}

          {/* Form Fields Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>ACTIVITY TITLE *</label>
              <input
                type="text"
                value={editingDraft.title}
                onChange={(e) => handleUpdateDraftField('title', e.target.value)}
                style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>SLUG (URL KEY) *</label>
              <input
                type="text"
                value={editingDraft.slug}
                onChange={(e) => handleUpdateDraftField('slug', e.target.value)}
                style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>EVENT DATE *</label>
              <input
                type="date"
                value={editingDraft.date}
                onChange={(e) => handleUpdateDraftField('date', e.target.value)}
                style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>VENUE / LOCATION *</label>
              <input
                type="text"
                value={editingDraft.venue}
                onChange={(e) => handleUpdateDraftField('venue', e.target.value)}
                style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>STAGED SLIDES / PDF URL</label>
              <input
                type="url"
                placeholder="https://slides.google.com/..."
                value={editingDraft.slidesUrl || ''}
                onChange={(e) => handleUpdateDraftField('slidesUrl', e.target.value)}
                style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>STAGED .XAML / PACKAGE URL</label>
              <input
                type="url"
                placeholder="https://github.com/.../bot.xaml"
                value={editingDraft.workflowPackageUrl || ''}
                onChange={(e) => handleUpdateDraftField('workflowPackageUrl', e.target.value)}
                style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>SESSION SUMMARY *</label>
            <textarea
              rows={3}
              value={editingDraft.summary}
              onChange={(e) => handleUpdateDraftField('summary', e.target.value)}
              style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem', marginBottom: '1.5rem' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Completion Readiness: <strong style={{ color: '#10B981' }}>{editingDraft.completionPercentage}%</strong>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => handleSubmitForReview(editingDraft)}
                className="btn btn-primary"
                style={{ gap: '0.4rem' }}
              >
                <Send size={16} /> Submit Draft for Admin Review
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Drafts List & Artifact Staging Workspace */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Filters & Search */}
          <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
              {['ALL', 'DRAFT', 'SUBMITTED', 'IN_REVIEW', 'CHANGES_REQUESTED', 'PUBLISHED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  style={{
                    background: filterStatus === st ? 'var(--uipath-orange)' : 'var(--bg-tertiary)',
                    color: filterStatus === st ? '#FFF' : 'var(--text-secondary)',
                    border: filterStatus === st ? '1px solid var(--uipath-orange)' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-full)',
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {st}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', minWidth: '220px' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search drafts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.45rem 0.85rem 0.45rem 2.25rem',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Drafts Cards List */}
          {filteredDrafts.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '3.5rem 2rem', color: 'var(--text-muted)' }}>
              <Layers size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 0.75rem auto' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.35rem' }}>No Activity Drafts Found</h3>
              <p style={{ fontSize: '0.85rem', marginBottom: '1.25rem' }}>Click "+ Create Activity Draft" to start staging a new UiPath workshop or hackathon.</p>
              <button onClick={handleCreateNewDraft} className="btn btn-primary btn-sm">
                + Create Activity Draft
              </button>
            </div>
          ) : (
            <div className="grid-responsive-2">
              {filteredDrafts.map((draft) => (
                <div key={draft.id} className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span className={`badge ${draft.status === 'SUBMITTED' ? 'badge-neutral' : draft.status === 'CHANGES_REQUESTED' ? 'badge-orange' : draft.status === 'PUBLISHED' ? 'badge-green' : 'badge-slate'}`}>
                        {draft.status}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {draft.category} • {draft.date}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>{draft.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                      {draft.summary}
                    </p>

                    {/* Progress Rail */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                        <span>Staging Readiness</span>
                        <span>{draft.completionPercentage}%</span>
                      </div>
                      <div style={{ width: '100%', height: '4px', background: 'var(--bg-secondary)', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ width: `${draft.completionPercentage}%`, height: '100%', background: draft.completionPercentage > 80 ? '#10B981' : 'var(--uipath-orange)' }} />
                      </div>
                    </div>
                  </div>

                  <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      By {draft.createdBy}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => {
                          setEditingDraft(draft);
                          onNavigate('core', draft.id);
                        }}
                        className="btn btn-secondary btn-sm"
                      >
                        <Edit3 size={14} /> Edit
                      </button>

                      <button
                        onClick={() => setDeleteConfirmId(draft.id)}
                        className="btn btn-outline btn-sm"
                        style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: '#EF4444' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Artifact Attachment Panel for Published Activities */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Upload size={18} style={{ color: 'var(--uipath-orange)' }} /> Quick Session Artifact Staging
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Attach recordings, slides, or starter packages to an existing public activity record.
              </p>

              {mediaSaved && (
                <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', borderRadius: 'var(--radius-sm)', color: '#D1FAE5', marginBottom: '1rem', fontSize: '0.85rem' }}>
                  Artifact saved to activity record!
                </div>
              )}

              <form onSubmit={handleAttachMedia} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>PUBLIC ACTIVITY</label>
                  <select
                    value={selectedActivityId}
                    onChange={(e) => setSelectedActivityId(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                  >
                    {activities.map((a) => (
                      <option key={a.id} value={a.id}>{a.title} ({a.date})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>ARTIFACT TYPE</label>
                  <select
                    value={mediaType}
                    onChange={(e) => setMediaType(e.target.value as any)}
                    style={{ width: '100%', padding: '0.6rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                  >
                    <option value="recording">Video Recording URL</option>
                    <option value="slides">Slides Presentation URL</option>
                    <option value="workflow">.XAML / Package Download URL</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>RESOURCE URL</label>
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-sm">
                  Attach Artifact
                </button>
              </form>
            </div>

            {/* Pending Bot Submissions */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} style={{ color: '#34D399' }} /> Review Student Showcase Bots ({pendingProjects.length})
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Approve student-submitted UiPath projects to feature them in the Bot Vault.
              </p>

              {pendingProjects.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <CheckCircle2 size={28} style={{ color: '#10B981', margin: '0 auto 0.5rem auto' }} />
                  All student submissions have been approved!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {pendingProjects.map((p) => (
                    <div key={p.id} style={{ padding: '0.85rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>By {p.authorName} ({p.authorBranch})</div>
                      </div>
                      <button onClick={() => onSaveProject({ ...p, status: 'Approved' })} className="btn btn-primary btn-sm">
                        Approve
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 110, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', padding: '2rem', textAlign: 'center' }}>
            <AlertTriangle size={40} style={{ color: '#EF4444', margin: '0 auto 0.75rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Delete Activity Draft?</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              This action will permanently delete this draft from local storage.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button onClick={() => setDeleteConfirmId(null)} className="btn btn-secondary btn-sm">Cancel</button>
              <button
                onClick={() => {
                  onDeleteDraft(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="btn btn-primary btn-sm"
                style={{ background: '#EF4444', borderColor: '#EF4444' }}
              >
                Delete Draft
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
