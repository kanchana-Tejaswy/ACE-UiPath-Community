import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  Download, 
  ThumbsUp, 
  Github, 
  ExternalLink, 
  Plus, 
  X, 
  CheckCircle2, 
  Layers, 
  TrendingUp,
  Cpu
} from 'lucide-react';
import { ProjectShowcase, User } from '../types';

interface Props {
  projects: ProjectShowcase[];
  selectedProjectSlug?: string;
  currentUser: User;
  onSaveProject: (project: ProjectShowcase) => void;
  onUpvoteProject: (id: string) => void;
  onNavigate?: (view: string, detailId?: string) => void;
}

export const ProjectsPage: React.FC<Props> = ({
  projects,
  selectedProjectSlug,
  currentUser,
  onSaveProject,
  onUpvoteProject,
  onNavigate
}) => {
  const [selectedTool, setSelectedTool] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeProject, setActiveProject] = useState<ProjectShowcase | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [isInvalidSlug, setIsInvalidSlug] = useState<boolean>(false);
  const [upvotedIds, setUpvotedIds] = useState<Set<string>>(new Set());
  const [submitSuccessToast, setSubmitSuccessToast] = useState<string | null>(null);

  const handleUpvote = (id: string) => {
    onUpvoteProject(id);
    setUpvotedIds((prev) => new Set(prev).add(id));
  };

  // Sync selectedProjectSlug from URL with activeProject modal
  useEffect(() => {
    if (selectedProjectSlug) {
      const match = projects.find(
        (p) => p.slug === selectedProjectSlug || p.id === selectedProjectSlug
      );
      if (match) {
        setActiveProject(match);
        setIsInvalidSlug(false);
      } else {
        setActiveProject(null);
        setIsInvalidSlug(true);
      }
    } else {
      setActiveProject(null);
      setIsInvalidSlug(false);
    }
  }, [selectedProjectSlug, projects]);

  // Keyboard Escape listener to close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeProject) {
          setActiveProject(null);
          if (onNavigate) onNavigate('projects');
        }
        if (isSubmitModalOpen) {
          setIsSubmitModalOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeProject, isSubmitModalOpen, onNavigate]);

  // New Submission State
  const [newTitle, setNewTitle] = useState('');
  const [newTagline, setNewTagline] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newProblem, setNewProblem] = useState('');
  const [newSolution, setNewSolution] = useState('');
  const [newTools, setNewTools] = useState('UiPath Studio, REFramework');
  const [newRoi, setNewRoi] = useState('Saves 20 hours / month');
  const [newRepo, setNewRepo] = useState('');
  const [newDownload, setNewDownload] = useState('');

  const tools = ['ALL', 'UiPath Studio', 'StudioX', 'REFramework', 'Document Understanding', 'AI Center', 'Orchestrator'];

  const filteredProjects = projects.filter((p) => {
    if (selectedTool !== 'ALL' && !p.uipathToolsUsed.some((t) => t.toLowerCase().includes(selectedTool.toLowerCase()))) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchSummary = p.summary.toLowerCase().includes(q);
      const matchAuthor = p.authorName.toLowerCase().includes(q);
      if (!matchTitle && !matchSummary && !matchAuthor) return false;
    }
    return true;
  });

  const handleSubmitBot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) return;

    const newProj: ProjectShowcase = {
      id: `proj_${Date.now()}`,
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: newTitle,
      tagline: newTagline || 'Built by ACE UiPath Student Innovator',
      summary: newSummary,
      problemStatement: newProblem || 'Manual operational friction in departmental workflow.',
      solutionDescription: newSolution || 'Automated robotic workflow using UiPath enterprise practices.',
      uipathToolsUsed: newTools.split(',').map((t) => t.trim()),
      roiMetrics: newRoi,
      repoUrl: newRepo || undefined,
      packageDownloadUrl: newDownload || undefined,
      previewImages: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80'],
      authorName: currentUser.name,
      authorRollNumber: currentUser.rollNumber,
      authorBranch: currentUser.branch,
      authorLinkedin: currentUser.linkedinUrl,
      status: currentUser.role === 'ADMIN' ? 'Approved' : 'Pending',
      downloadCount: 1,
      upvotes: 1,
      createdAt: new Date().toISOString().split('T')[0]
    };

    onSaveProject(newProj);
    setIsSubmitModalOpen(false);
    setSubmitSuccessToast(`Bot "${newTitle}" submitted successfully! ${currentUser.role === 'ADMIN' ? 'Published live.' : 'Submitted for review.'}`);
    setTimeout(() => setSubmitSuccessToast(null), 4000);
    // Reset form
    setNewTitle('');
    setNewTagline('');
    setNewSummary('');
    setNewProblem('');
    setNewSolution('');
  };

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '3rem' }}>
        <div>
          <span className="badge badge-green" style={{ marginBottom: '0.5rem' }}>
            Production Bots & Automations
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800 }}>
            Student Automations Showcase & Bot Vault
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '780px', marginTop: '0.5rem' }}>
            Explore intelligent bots built by ACE students solving real campus problems. Download packaged workflows, inspect architecture diagrams, or submit your own bot.
          </p>
        </div>

        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="btn btn-primary"
        >
          <Plus size={16} /> Submit Your Bot
        </button>
      </div>

      {/* Invalid Project Slug Fallback Banner */}
      {isInvalidSlug && selectedProjectSlug && (
        <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', marginBottom: '2.5rem', border: '1px solid var(--border-glow)' }}>
          <Sparkles size={40} style={{ color: 'var(--uipath-orange)', margin: '0 auto 0.75rem auto' }} />
          <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>Project Showcase Not Found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.25rem', maxWidth: '540px', margin: '0 auto 1.25rem auto' }}>
            No student automation bot matches the link "<code style={{ color: '#FED7AA' }}>{selectedProjectSlug}</code>". Explore our official bot showcase below.
          </p>
          <button onClick={() => onNavigate && onNavigate('projects')} className="btn btn-primary btn-sm">
            View All Showcase Bots
          </button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '2.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Tool Filter Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: '0.25rem' }}>
            Technology:
          </span>
          {tools.map((tool) => (
            <button
              key={tool}
              onClick={() => setSelectedTool(tool)}
              style={{
                background: selectedTool === tool ? 'var(--uipath-orange)' : 'var(--bg-tertiary)',
                color: selectedTool === tool ? '#FFF' : 'var(--text-secondary)',
                border: selectedTool === tool ? '1px solid var(--uipath-orange)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                padding: '0.25rem 0.75rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              {tool}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search bots, authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.85rem 0.5rem 2.25rem',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Cpu size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Automation Bots Matched Your Filters</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Try resetting the technology filter chip or searching for a different term like "REFramework" or "PDF".
          </p>
          <button
            onClick={() => {
              setSelectedTool('ALL');
              setSearchQuery('');
            }}
            className="btn btn-secondary btn-sm"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid-responsive-3">
        {filteredProjects.map((proj) => (
          <div
            key={proj.id}
            className="glass-card"
            style={{
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span className="badge badge-orange" style={{ fontSize: '0.65rem' }}>
                  {proj.uipathToolsUsed[0]}
                </span>
                <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>
                  {proj.status}
                </span>
              </div>

              <h3
                onClick={() => onNavigate ? onNavigate('projects', proj.slug || proj.id) : setActiveProject(proj)}
                style={{ fontSize: '1.2rem', marginBottom: '0.4rem', cursor: 'pointer', lineHeight: 1.35 }}
              >
                {proj.title}
              </h3>

              <div style={{ fontSize: '0.8rem', color: 'var(--uipath-orange)', fontWeight: 600, marginBottom: '0.75rem' }}>
                {proj.tagline}
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                {proj.summary}
              </p>

              {/* ROI Impact Badge */}
              <div style={{
                padding: '0.65rem 0.85rem',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                color: '#34D399',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                marginBottom: '1.25rem'
              }}>
                <TrendingUp size={14} />
                <span>{proj.roiMetrics}</span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                {proj.uipathToolsUsed.map((t, idx) => (
                  <span key={idx} className="badge badge-slate" style={{ fontSize: '0.65rem' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div style={{
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                By <strong style={{ color: 'var(--text-primary)' }}>{proj.authorName}</strong>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => handleUpvote(proj.id)}
                  className="btn btn-secondary btn-sm"
                  style={{
                    padding: '0.35rem 0.65rem',
                    gap: '0.3rem',
                    background: upvotedIds.has(proj.id) ? 'var(--uipath-orange-subtle)' : undefined,
                    color: upvotedIds.has(proj.id) ? 'var(--uipath-orange)' : undefined,
                    borderColor: upvotedIds.has(proj.id) ? 'var(--border-glow)' : undefined
                  }}
                  title="Upvote this bot"
                >
                  <ThumbsUp size={13} fill={upvotedIds.has(proj.id) ? 'var(--uipath-orange)' : 'none'} /> {proj.upvotes}
                </button>
                <button
                  onClick={() => onNavigate ? onNavigate('projects', proj.slug || proj.id) : setActiveProject(proj)}
                  className="btn btn-outline btn-sm"
                  style={{ padding: '0.35rem 0.65rem' }}
                >
                  Inspect Bot
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Project Deep-Dive Modal */}
      {activeProject && (
        <div
          onClick={() => onNavigate ? onNavigate('projects') : setActiveProject(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '750px',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-medium)',
              padding: '2.5rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <span className="badge badge-orange" style={{ marginBottom: '0.5rem' }}>
                  {activeProject.uipathToolsUsed.join(' • ')}
                </span>
                <h2 style={{ fontSize: '1.65rem' }}>{activeProject.title}</h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--uipath-orange)' }}>{activeProject.tagline}</p>
              </div>
              <button
                onClick={() => onNavigate ? onNavigate('projects') : setActiveProject(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <h4 style={{ fontSize: '0.95rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  Problem Statement
                </h4>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {activeProject.problemStatement}
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '0.95rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  UiPath Solution Architecture
                </h4>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {activeProject.solutionDescription}
                </p>
              </div>

              <div style={{
                padding: '1rem',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <TrendingUp size={20} style={{ color: '#10B981' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>MEASURED BUSINESS ROI</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#34D399' }}>{activeProject.roiMetrics}</div>
                </div>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Author: <strong style={{ color: '#FFF' }}>{activeProject.authorName}</strong> {activeProject.authorRollNumber && `(${activeProject.authorRollNumber})`} • {activeProject.authorBranch}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
              {activeProject.packageDownloadUrl && (
                <a
                  href={activeProject.packageDownloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                >
                  <Download size={16} /> Download .NUPKG Package
                </a>
              )}
              {activeProject.repoUrl && (
                <a
                  href={activeProject.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                >
                  <Github size={16} /> Inspect GitHub Repo
                </a>
              )}
              <button
                onClick={() => handleUpvote(activeProject.id)}
                className="btn btn-secondary"
                style={{
                  background: upvotedIds.has(activeProject.id) ? 'var(--uipath-orange-subtle)' : undefined,
                  color: upvotedIds.has(activeProject.id) ? 'var(--uipath-orange)' : undefined,
                  borderColor: upvotedIds.has(activeProject.id) ? 'var(--border-glow)' : undefined
                }}
              >
                <ThumbsUp size={16} fill={upvotedIds.has(activeProject.id) ? 'var(--uipath-orange)' : 'none'} /> Upvote Bot ({activeProject.upvotes})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Your Bot Modal */}
      {isSubmitModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '620px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-medium)',
            padding: '2.25rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem' }}>Submit Your UiPath Automation</h3>
                <p style={{ fontSize: '0.85rem' }}>Showcase your bot in the ACE institutional vault.</p>
              </div>
              <button onClick={() => setIsSubmitModalOpen(false)} className="btn btn-secondary btn-sm" style={{ padding: '0.35rem' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitBot} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>BOT TITLE *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Automated Faculty Workload Allocator"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>ONE-LINE SUMMARY *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ingests Excel timetables and generates timetable conflict matrices"
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>UIPATH TOOLS & CONCEPTS USED</label>
                <input
                  type="text"
                  placeholder="e.g. UiPath Studio, REFramework, Orchestrator Queues"
                  value={newTools}
                  onChange={(e) => setNewTools(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>MEASURED ROI / TIME SAVED</label>
                <input
                  type="text"
                  placeholder="e.g. Saves 30 manual hours per semester"
                  value={newRoi}
                  onChange={(e) => setNewRoi(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>GITHUB REPO LINK</label>
                <input
                  type="url"
                  placeholder="https://github.com/username/project"
                  value={newRepo}
                  onChange={(e) => setNewRepo(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsSubmitModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit for Showcase Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Submission Success Toast */}
      {submitSuccessToast && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 1000,
          background: 'var(--bg-surface)',
          border: '1px solid var(--accent-emerald)',
          color: 'var(--text-primary)',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          fontWeight: 600,
          fontSize: '0.875rem'
        }}>
          <CheckCircle2 size={18} style={{ color: 'var(--accent-emerald)' }} />
          <span>{submitSuccessToast}</span>
        </div>
      )}
    </div>
  );
};
