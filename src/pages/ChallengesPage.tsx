import React, { useState, useEffect, useMemo } from 'react';
import { 
  Trophy, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  FileText, 
  Users, 
  Download, 
  Sparkles, 
  Send, 
  Award, 
  ArrowRight,
  ArrowLeft,
  Video,
  Code2,
  BookOpen,
  ExternalLink,
  MessageSquare,
  Play,
  Layers,
  Star,
  Check,
  Grid,
  ListOrdered,
  Search,
  X,
  RotateCcw
} from 'lucide-react';
import { Challenge, User, ChallengeVideoRecording, ChallengeUseCaseTrack, ChallengeReferenceMaterial } from '../types';
import { TechnicalMarkdownRenderer } from '../components/TechnicalMarkdownRenderer';

interface Props {
  challenges: Challenge[];
  selectedChallengeSlug?: string;
  currentUser: User;
  onSaveChallenge: (challenge: Challenge) => void;
  onNavigate?: (view: string, detailId?: string) => void;
}

// Helper to format embed video URLs
function getSafeEmbedUrl(rawUrl: string): string | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim();

  // YouTube match
  const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`;
  }

  // Loom match
  const loomMatch = trimmed.match(/loom\.com\/(?:share|embed)\/([a-f0-9]+)/);
  if (loomMatch && loomMatch[1]) {
    return `https://www.loom.com/embed/${loomMatch[1]}`;
  }

  // Vimeo match
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // Google Drive preview match
  if (trimmed.includes('drive.google.com/file/d/')) {
    const fileIdMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
    }
  }

  if (trimmed.startsWith('https://') || trimmed.startsWith('http://') || trimmed.startsWith('blob:') || trimmed.startsWith('data:')) {
    return trimmed;
  }

  return null;
}

function getCleanExcerpt(rawMd: string | undefined, title: string): string {
  if (!rawMd) return '';
  let text = rawMd.replace(/\\n/g, '\n').replace(/\r\n/g, '\n');
  const lines = text.split('\n').map(l => l.replace(/^#+\s*/, '').trim()).filter(Boolean);
  if (lines.length > 0 && lines[0].toLowerCase() === (title || '').trim().toLowerCase()) {
    lines.shift();
  }
  return lines.join(' ');
}

export const ChallengesPage: React.FC<Props> = ({
  challenges,
  selectedChallengeSlug,
  currentUser,
  onSaveChallenge,
  onNavigate
}) => {
  // Detail vs Catalog View State
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(() => {
    if (selectedChallengeSlug) {
      const match = challenges.find((c) => c.slug === selectedChallengeSlug || c.id === selectedChallengeSlug);
      return match ? match.id : null;
    }
    return null;
  });

  const [isInvalidSlug, setIsInvalidSlug] = useState<boolean>(false);
  const [activeVideoModal, setActiveVideoModal] = useState<ChallengeVideoRecording | null>(null);

  // Catalog Filters State (Identical to ActivitiesPage)
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('grid');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Submission Form State
  const [teamName, setTeamName] = useState('');
  const [members, setMembers] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);

  // Sync selectedChallengeSlug from URL hash
  useEffect(() => {
    if (selectedChallengeSlug) {
      const match = challenges.find(
        (c) => c.slug === selectedChallengeSlug || c.id === selectedChallengeSlug
      );
      if (match) {
        setSelectedChallengeId(match.id);
        setIsInvalidSlug(false);
      } else {
        setSelectedChallengeId(null);
        setIsInvalidSlug(true);
      }
    } else {
      setSelectedChallengeId(null);
      setIsInvalidSlug(false);
    }
  }, [selectedChallengeSlug, challenges]);

  const activeChallenge = useMemo(() => {
    if (!selectedChallengeId) return null;
    return challenges.find((c) => c.id === selectedChallengeId) || null;
  }, [selectedChallengeId, challenges]);

  // Clean redundant markdown title if line 0 is an exact match for the challenge title
  const cleanDescriptionMd = useMemo(() => {
    if (!activeChallenge?.descriptionMd) return '';
    let raw = activeChallenge.descriptionMd.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    if (raw.includes('\\n') && !raw.includes('\n')) {
      raw = raw.replace(/\\n/g, '\n');
    }
    const lines = raw.split('\n');
    if (lines.length > 0 && lines[0].trim().startsWith('#')) {
      const firstLineText = lines[0].replace(/^#+\s*/, '').trim().toLowerCase();
      const titleText = (activeChallenge.title || '').trim().toLowerCase();
      if (firstLineText === titleText) {
        const remaining = lines.slice(1).join('\n').trim();
        if (remaining) return remaining;
      }
    }
    return raw;
  }, [activeChallenge]);

  const handleChallengeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle || !repoUrl) return;

    if (activeChallenge) {
      const updated: Challenge = {
        ...activeChallenge,
        submissionCount: (activeChallenge.submissionCount || 0) + 1
      };
      onSaveChallenge(updated);
      setSubmissionSuccess(true);
      setTimeout(() => setSubmissionSuccess(false), 5000);
      // Reset form
      setTeamName('');
      setMembers('');
      setProjectTitle('');
      setRepoUrl('');
      setDemoUrl('');
    }
  };

  const handleOpenDetail = (chal: Challenge) => {
    setSelectedChallengeId(chal.id);
    if (onNavigate) {
      onNavigate('challenges', chal.slug || chal.id);
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackToCatalog = () => {
    setSelectedChallengeId(null);
    if (onNavigate) {
      onNavigate('challenges');
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Filter lists
  const statuses = ['ALL', 'Active', 'Upcoming', 'Completed'];
  const categories = ['ALL', 'Hackathon', 'Monthly Sprint', 'Ideathon'];

  const filteredChallenges = useMemo(() => {
    return challenges.filter((chal) => {
      if (selectedStatus !== 'ALL' && chal.status !== selectedStatus) return false;
      if (selectedCategory !== 'ALL' && chal.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = chal.title.toLowerCase().includes(q);
        const matchTheme = (chal.theme || '').toLowerCase().includes(q);
        const matchPrize = (chal.prizePool || '').toLowerCase().includes(q);
        const matchTracks = chal.useCases ? chal.useCases.some((u) => u.title.toLowerCase().includes(q) || u.problemBrief.toLowerCase().includes(q)) : false;
        if (!matchTitle && !matchTheme && !matchPrize && !matchTracks) return false;
      }
      return true;
    });
  }, [challenges, selectedStatus, selectedCategory, searchQuery]);

  return (
    <div className="container" style={{ paddingTop: 'clamp(1.75rem, 3.5vw, 3rem)', paddingBottom: 'clamp(3rem, 6vw, 6rem)' }}>
      {/* Invalid Challenge Fallback Banner */}
      {isInvalidSlug && selectedChallengeSlug && (
        <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', marginBottom: '2.5rem', border: '1px solid var(--border-glow)' }}>
          <Trophy size={40} style={{ color: 'var(--uipath-orange)', margin: '0 auto 0.75rem auto' }} />
          <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', fontWeight: 700 }}>Challenge / Hackathon Not Found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.25rem', maxWidth: '540px', margin: '0 auto 1.25rem auto' }}>
            No competitive automation hackathon matches the link "<code style={{ color: '#FED7AA' }}>{selectedChallengeSlug}</code>". Please explore active hackathons & sprints below.
          </p>
          <button onClick={handleBackToCatalog} className="btn btn-primary btn-sm">
            View All Hackathons & Sprints
          </button>
        </div>
      )}

      {/* RENDER DETAIL VIEW IF A CHALLENGE IS SELECTED */}
      {activeChallenge ? (
        <div>
          {/* Detail View Top Navigation Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.75rem'
          }}>
            <button
              onClick={handleBackToCatalog}
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontWeight: 600, padding: '0.5rem 0.95rem' }}
            >
              <ArrowLeft size={15} /> Back to All Hackathons & Sprints
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-orange">{activeChallenge.category}</span>
              <span className={`badge ${
                activeChallenge.status === 'Active' ? 'badge-orange' : activeChallenge.status === 'Upcoming' ? 'badge-blue' : 'badge-slate'
              }`}>
                {activeChallenge.status === 'Active' && <span className="status-dot-pulse" style={{ marginRight: '0.25rem' }} />}
                {activeChallenge.status}
              </span>
              <span className="badge badge-slate" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Users size={12} /> {activeChallenge.submissionCount || 0} Registered Teams
              </span>
            </div>
          </div>

          {/* 4-Step Hackathon Roadmap ("How Hackathons Work") */}
          <div style={{
            marginBottom: '2.5rem',
            padding: 'clamp(1.25rem, 2.5vw, 1.75rem)',
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={16} style={{ color: 'var(--uipath-orange)' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                  How Hackathons Work • 4-Step Roadmap
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                From problem brief to final evaluation
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(250,70,22,0.15)', border: '1px solid rgba(250,70,22,0.4)', color: 'var(--uipath-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>
                  01
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FFF', marginBottom: '0.2rem' }}>
                    Pick Track & Brief
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    Review challenge specifications, problem scope, scoring rubrics & eligibility rules.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.4)', color: '#34D399', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>
                  02
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FFF', marginBottom: '0.2rem' }}>
                    Get Starter Scaffolding
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    Download pre-configured REFramework templates, XAML starter code & sample datasets.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(129,140,248,0.15)', border: '1px solid rgba(129,140,248,0.4)', color: '#818CF8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>
                  03
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FFF', marginBottom: '0.2rem' }}>
                    Build in UiPath Studio
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    Develop workflows with robust Try-Catch error handling, logging & queue management.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.4)', color: '#FBBF24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>
                  04
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FFF', marginBottom: '0.2rem' }}>
                    Submit Bot & Demo
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    Ship your team's GitHub repository link and 3-minute video demo before deadline.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Switcher Between Multiple Challenges */}
          {challenges.length > 1 && (
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  All Competitions ({challenges.length})
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Select a challenge to view specs or submit
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {challenges.map((c) => {
                  const isCurrent = c.id === activeChallenge.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => handleOpenDetail(c)}
                      style={{
                        background: isCurrent ? 'rgba(250, 70, 22, 0.12)' : 'var(--bg-tertiary)',
                        border: isCurrent ? '1px solid var(--uipath-orange)' : '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.65rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        flexShrink: 0,
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Trophy size={14} style={{ color: isCurrent ? 'var(--uipath-orange)' : 'var(--text-muted)' }} />
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: isCurrent ? 700 : 500, color: isCurrent ? '#FFF' : 'var(--text-secondary)' }}>
                          {c.title}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {c.category} • {c.status}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Active Challenge Detailed Layout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 380px',
            gap: '2.5rem',
            alignItems: 'start'
          }} className="challenge-layout">
            {/* Main Challenge Specs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Header Card with Banner Hero */}
              <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border-glow)' }}>
                {activeChallenge.bannerImage ? (
                  <div style={{ position: 'relative', width: '100%', minHeight: '260px', background: '#000', overflow: 'hidden' }}>
                    <img
                      src={activeChallenge.bannerImage}
                      alt={activeChallenge.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(15, 15, 18, 0.98) 0%, rgba(15, 15, 18, 0.6) 50%, rgba(0,0,0,0.3) 100%)'
                    }} />
                    <div style={{ position: 'relative', padding: 'clamp(1.5rem, 3.5vw, 2.5rem)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', minHeight: '260px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center' }}>
                        <span className="badge badge-orange">{activeChallenge.category}</span>
                        <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Trophy size={12} /> Prize: {activeChallenge.prizePool}
                        </span>
                        {activeChallenge.isFeatured && (
                          <span className="badge badge-orange" style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', fontSize: '0.65rem' }}>
                            <Star size={9} /> Featured
                          </span>
                        )}
                      </div>
                      <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.15rem)', fontWeight: 800, color: '#FFF', margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.5)', lineHeight: 1.25 }}>
                        {activeChallenge.title}
                      </h2>
                      {activeChallenge.theme && (
                        <p style={{ fontSize: '0.9rem', color: '#FED7AA', margin: '0.5rem 0 0 0', textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
                          Theme: {activeChallenge.theme}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{
                    padding: 'clamp(1.5rem, 3.5vw, 2.25rem)',
                    background: 'linear-gradient(135deg, rgba(250, 70, 22, 0.12) 0%, rgba(24, 24, 27, 0.95) 45%, rgba(11, 11, 15, 1) 100%)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center' }}>
                      <span className="badge badge-orange">{activeChallenge.category}</span>
                      <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Trophy size={12} /> Prize: {activeChallenge.prizePool}
                      </span>
                      <span className="badge badge-slate" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Users size={12} /> {activeChallenge.submissionCount || 0} Teams Registered
                      </span>
                    </div>
                    <h2 style={{ fontSize: 'clamp(1.4rem, 2.8vw, 2rem)', fontWeight: 800, color: '#FFF', margin: '0 0 0.5rem 0', lineHeight: 1.25 }}>
                      {activeChallenge.title}
                    </h2>
                    {activeChallenge.theme && (
                      <p style={{ fontSize: '0.9rem', color: '#FED7AA', margin: 0 }}>
                        Theme: {activeChallenge.theme}
                      </p>
                    )}
                  </div>
                )}

                <div style={{ padding: 'clamp(1.25rem, 2.5vw, 2rem)' }}>
                  {/* 3-Column Timeline Summary */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                    gap: '1rem',
                    padding: '1.25rem',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    marginBottom: '1.75rem'
                  }}>
                    {activeChallenge.registrationDeadline && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                          <Clock size={12} style={{ color: '#FBBF24' }} /> REGISTRATION DEADLINE
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '0.925rem', color: '#FBBF24' }}>
                          {activeChallenge.registrationDeadline} {activeChallenge.registrationDeadlineTime ? `• ${activeChallenge.registrationDeadlineTime}` : ''}
                        </div>
                      </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                        <Sparkles size={12} style={{ color: '#34D399' }} /> HACKATHON START
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.925rem', color: '#34D399' }}>
                        {activeChallenge.startDate} {activeChallenge.startTime ? `• ${activeChallenge.startTime}` : ''}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                        <Calendar size={12} style={{ color: '#FA4616' }} /> SUBMISSION DEADLINE
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.925rem', color: '#FA4616' }}>
                        {activeChallenge.endDate} {activeChallenge.endTime ? `• ${activeChallenge.endTime}` : ''}
                      </div>
                    </div>
                  </div>

                  {/* External Action CTAs */}
                  {(activeChallenge.registrationUrl || activeChallenge.communityChannelUrl) && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.75rem' }}>
                      {activeChallenge.registrationUrl && (
                        <a
                          href={activeChallenge.registrationUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-primary btn-sm"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                        >
                          <ExternalLink size={14} /> Register on External Portal
                        </a>
                      )}
                      {activeChallenge.communityChannelUrl && (
                        <a
                          href={activeChallenge.communityChannelUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-secondary btn-sm"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#818CF8' }}
                        >
                          <MessageSquare size={14} /> Join Discord / Teams Channel
                        </a>
                      )}
                    </div>
                  )}

                  {/* Prominent Official Starter Kit & Dataset Callout in Main Flow */}
                  {activeChallenge.starterDatasetUrl && (
                    <div style={{
                      padding: '1.25rem 1.5rem',
                      background: 'linear-gradient(135deg, rgba(250, 70, 22, 0.08) 0%, rgba(20, 20, 24, 0.6) 100%)',
                      border: '1px solid rgba(250, 70, 22, 0.25)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      marginBottom: '1.75rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(250,70,22,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--uipath-orange)', flexShrink: 0 }}>
                          <Download size={20} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFF' }}>
                            Official Challenge Starter Kit & Datasets
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            Download sample invoices, problem specifications, and REFramework scaffolding.
                          </div>
                        </div>
                      </div>
                      <a
                        href={activeChallenge.starterDatasetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1.1rem' }}
                      >
                        <Download size={14} /> Download Starter Pack ({activeChallenge.starterDatasetUrl.toLowerCase().includes('.zip') ? '.ZIP' : '.PDF'})
                      </a>
                    </div>
                  )}

                  {/* Challenge Description / Problem Brief */}
                  <div style={{ marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.75rem' }}>
                      <FileText size={16} style={{ color: 'var(--uipath-orange)' }} />
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFF', margin: 0 }}>
                        Challenge Brief & Problem Objective
                      </h3>
                    </div>
                    <TechnicalMarkdownRenderer content={cleanDescriptionMd} />
                  </div>
                </div>
              </div>

              {/* BOT USE CASES & TRACKS HUB */}
              {activeChallenge.useCases && activeChallenge.useCases.length > 0 && (
                <div className="glass-card" style={{ padding: 'clamp(1.25rem, 2.5vw, 2rem)' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Code2 size={20} style={{ color: 'var(--uipath-orange)' }} /> Challenge Tracks & Problem Statements
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                    Choose one of the official competition tracks below. Starter templates include pre-configured REFramework & Document Understanding scaffolding.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {activeChallenge.useCases.map((track, tIdx) => (
                      <div
                        key={track.id || tIdx}
                        style={{
                          padding: '1.5rem',
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: 'var(--radius-md)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className="badge badge-orange" style={{ fontSize: '0.7rem' }}>
                              Track #{tIdx + 1}
                            </span>
                            <span className="badge badge-slate" style={{ fontSize: '0.7rem' }}>
                              {track.difficulty || 'Intermediate'}
                            </span>
                          </div>
                          {track.starterTemplateUrl && (
                            <a
                              href={track.starterTemplateUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                            >
                              <Download size={13} /> Starter Code ({track.starterTemplateType || 'ZIP/XAML'})
                            </a>
                          )}
                        </div>

                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF', marginBottom: '0.5rem' }}>
                          {track.title}
                        </h4>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                          {track.problemBrief}
                        </p>

                        {track.evaluationRubric && (
                          <div style={{ fontSize: '0.8rem', color: '#FED7AA', background: 'rgba(250, 70, 22, 0.08)', padding: '0.6rem 0.85rem', borderRadius: '0.5rem', border: '1px solid rgba(250, 70, 22, 0.2)' }}>
                            <strong>Target KPIs & Scoring:</strong> {track.evaluationRubric}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SESSION RECORDINGS & VIDEO TUTORIALS */}
              {activeChallenge.recordings && activeChallenge.recordings.length > 0 && (
                <div className="glass-card" style={{ padding: 'clamp(1.25rem, 2.5vw, 2rem)' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Video size={20} style={{ color: 'var(--uipath-orange)' }} /> Session Recordings & Video Tutorials
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                    Watch official kickoff sessions, bot architecture walkthroughs, and Q&A workshops.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                    {activeChallenge.recordings.map((rec, rIdx) => {
                      const embed = getSafeEmbedUrl(rec.url);
                      return (
                        <div
                          key={rec.id || rIdx}
                          style={{
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: 'var(--radius-md)',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column'
                          }}
                        >
                          {embed ? (
                            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000' }}>
                              <iframe
                                src={embed}
                                title={rec.title}
                                style={{ width: '100%', height: '100%', border: 0 }}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          ) : (
                            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#171717', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Video size={32} style={{ color: 'var(--text-muted)' }} />
                            </div>
                          )}

                          <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span className="badge badge-orange" style={{ fontSize: '0.65rem' }}>
                                {rec.type}
                              </span>
                              {rec.duration && (
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  {rec.duration}
                                </span>
                              )}
                            </div>
                            <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFF', margin: '0.25rem 0' }}>
                              {rec.title}
                            </h5>
                            {rec.speakerName && (
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                Host: {rec.speakerName}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* REFERENCE MATERIALS & DOCUMENTATION VAULT */}
              {activeChallenge.referenceMaterials && activeChallenge.referenceMaterials.length > 0 && (
                <div className="glass-card" style={{ padding: 'clamp(1.25rem, 2.5vw, 2rem)' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BookOpen size={20} style={{ color: 'var(--uipath-orange)' }} /> Study & Reference Materials Vault
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                    Official developer guides, sample datasets, and cheat sheets curated for this challenge.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {activeChallenge.referenceMaterials.map((mat, mIdx) => (
                      <div
                        key={mat.id || mIdx}
                        style={{
                          padding: '1rem 1.25rem',
                          background: 'var(--bg-tertiary)',
                          borderRadius: 'var(--radius-sm)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '0.75rem'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <span className="badge badge-slate" style={{ fontSize: '0.7rem' }}>
                              {mat.type}
                            </span>
                            <strong style={{ fontSize: '0.95rem', color: '#FFF' }}>{mat.title}</strong>
                          </div>
                          {mat.description && (
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                              {mat.description}
                            </p>
                          )}
                        </div>

                        <a
                          href={mat.url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.75rem' }}
                        >
                          <ExternalLink size={13} /> View Resource
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Evaluation Rubric */}
              {activeChallenge.evaluationCriteria && activeChallenge.evaluationCriteria.length > 0 && (
                <div className="glass-card" style={{ padding: 'clamp(1.25rem, 2.5vw, 2rem)' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Award size={18} style={{ color: 'var(--uipath-orange)' }} /> Evaluation Criteria & Scoring Rubric
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {activeChallenge.evaluationCriteria.map((crit, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.85rem 1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.04)' }}>
                        <CheckCircle2 size={16} style={{ color: '#10B981', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>{crit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rules & Policy */}
              {activeChallenge.rulesMd && (
                <div className="glass-card" style={{ padding: 'clamp(1.25rem, 2.5vw, 2rem)' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={18} style={{ color: 'var(--uipath-orange)' }} /> Competition Rules & Disqualification Policy
                  </h3>
                  <TechnicalMarkdownRenderer content={activeChallenge.rulesMd} />
                </div>
              )}

              {/* Past Winners (if completed) */}
              {activeChallenge.winners && activeChallenge.winners.length > 0 && (
                <div className="glass-card" style={{ padding: 'clamp(1.25rem, 2.5vw, 2rem)' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Trophy size={18} style={{ color: '#F59E0B' }} /> Hall of Hackathon Champions
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {activeChallenge.winners.map((w, wIdx) => (
                      <div key={wIdx} style={{
                        padding: '1.25rem',
                        background: 'rgba(245, 158, 11, 0.08)',
                        border: '1px solid rgba(245, 158, 11, 0.25)',
                        borderRadius: 'var(--radius-md)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                          <span className="badge badge-orange">Rank #{w.rank} • {w.teamName}</span>
                          <span style={{ fontWeight: 700, color: '#F59E0B' }}>{w.prize}</span>
                        </div>
                        <div style={{ fontWeight: 600, fontSize: '1rem', color: '#FFF', marginBottom: '0.25rem' }}>
                          {w.projectTitle}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Team: {w.members.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar: Submission Form & Resources (Sticky on Desktop) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '5.5rem' }}>
              {activeChallenge.status === 'Active' ? (
                <div className="glass-card" style={{ padding: 'clamp(1.25rem, 2.5vw, 1.75rem)', border: '1px solid var(--border-glow)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700 }}>
                      <Send size={18} style={{ color: 'var(--uipath-orange)' }} /> Submit Bot Solution
                    </h3>
                    <span className="badge badge-orange" style={{ fontSize: '0.65rem' }}>Submissions Open</span>
                  </div>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                    Submit your team's UiPath project before the deadline. Only one submission per team is required.
                  </p>

                  {submissionSuccess ? (
                    <div style={{
                      padding: '1.5rem',
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid #10B981',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'center'
                    }}>
                      <CheckCircle2 size={36} style={{ color: '#10B981', margin: '0 auto 0.5rem auto' }} />
                      <div style={{ fontWeight: 700, color: '#FFF', fontSize: '1.05rem' }}>Submission Received!</div>
                      <p style={{ fontSize: '0.825rem', color: '#D1FAE5', marginTop: '0.35rem', lineHeight: 1.5 }}>
                        Your team's bot solution has been registered into the evaluation pipeline. Our jury will review it.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleChallengeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                          TEAM NAME *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Team Automata"
                          value={teamName}
                          onChange={(e) => setTeamName(e.target.value)}
                          style={{ width: '100%', padding: '0.65rem 0.85rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.3rem', fontSize: '0.875rem', boxSizing: 'border-box' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                          TEAM MEMBERS & ROLL NUMBERS *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Rahul (22ACE05A01), Sneha (22ACE05A02)"
                          value={members}
                          onChange={(e) => setMembers(e.target.value)}
                          style={{ width: '100%', padding: '0.65rem 0.85rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.3rem', fontSize: '0.875rem', boxSizing: 'border-box' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                          BOT PROJECT TITLE *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Intelligent Invoice Reconciliation Bot"
                          value={projectTitle}
                          onChange={(e) => setProjectTitle(e.target.value)}
                          style={{ width: '100%', padding: '0.65rem 0.85rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.3rem', fontSize: '0.875rem', boxSizing: 'border-box' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                          GITHUB REPO OR CLOUD ZIP URL *
                        </label>
                        <input
                          type="url"
                          required
                          placeholder="https://github.com/team/uipath-bot"
                          value={repoUrl}
                          onChange={(e) => setRepoUrl(e.target.value)}
                          style={{ width: '100%', padding: '0.65rem 0.85rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.3rem', fontSize: '0.875rem', boxSizing: 'border-box' }}
                        />
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                          Must include Studio project (.xaml files) & README documentation
                        </span>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                          3-MIN VIDEO DEMO URL (OPTIONAL)
                        </label>
                        <input
                          type="url"
                          placeholder="https://youtube.com/watch?v=... or Loom / Drive"
                          value={demoUrl}
                          onChange={(e) => setDemoUrl(e.target.value)}
                          style={{ width: '100%', padding: '0.65rem 0.85rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.3rem', fontSize: '0.875rem', boxSizing: 'border-box' }}
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem' }}
                      >
                        <Send size={15} /> Submit Solution
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                  <Clock size={32} style={{ color: 'var(--text-muted)', margin: '0 auto 0.75rem auto' }} />
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Challenge {activeChallenge.status}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Submissions are closed for this cycle. Stay tuned for the next sprint!
                  </p>
                </div>
              )}

              {/* Problem Statement Starter Pack Shortcut */}
              {activeChallenge.starterDatasetUrl && (
                <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <Download size={15} style={{ color: 'var(--uipath-orange)' }} />
                    <h4 style={{ fontSize: '0.95rem', margin: 0, fontWeight: 700 }}>Challenge Starter Pack</h4>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.45 }}>
                    Download the official problem statements, sample invoice datasets, and scoring rubric.
                  </p>
                  <a
                    href={activeChallenge.starterDatasetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', boxSizing: 'border-box' }}
                  >
                    <Download size={14} /> Download Starter Pack ({activeChallenge.starterDatasetUrl.toLowerCase().includes('.zip') ? '.ZIP' : '.PDF'})
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* CATALOG VIEW (MIRRORS ACTIVITIES PAGE WITH TIMELINE & GRID VIEWS) */
        <div>
          {/* Header Banner */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
              <div>
                <span className="badge badge-orange" style={{ marginBottom: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Trophy size={13} /> Competitive Automation & Hackathons
                </span>
                <h1 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.025em' }}>
                  UiPath Hackathons & Sprints
                </h1>
              </div>

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
            </div>

            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '780px', lineHeight: 1.6 }}>
              Compete in high-stakes automation challenges, build end-to-end enterprise bots with Starter Templates, access kickoff recordings, win cash prizes & official UiPath vouchers, and get fast-tracked for Core Team recruitment.
            </p>
          </div>

          {/* 4-Step Hackathon Roadmap ("How Hackathons Work") */}
          <div style={{
            marginBottom: '2rem',
            padding: 'clamp(1.25rem, 2.5vw, 1.75rem)',
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={16} style={{ color: 'var(--uipath-orange)' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                  How Hackathons Work • 4-Step Roadmap
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                From problem brief to final evaluation
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(250,70,22,0.15)', border: '1px solid rgba(250,70,22,0.4)', color: 'var(--uipath-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>
                  01
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FFF', marginBottom: '0.2rem' }}>
                    Pick Track & Brief
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    Review challenge specifications, problem scope, scoring rubrics & eligibility rules.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.4)', color: '#34D399', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>
                  02
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FFF', marginBottom: '0.2rem' }}>
                    Get Starter Scaffolding
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    Download pre-configured REFramework templates, XAML starter code & sample datasets.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(129,140,248,0.15)', border: '1px solid rgba(129,140,248,0.4)', color: '#818CF8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>
                  03
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FFF', marginBottom: '0.2rem' }}>
                    Build in UiPath Studio
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    Develop workflows with robust Try-Catch error handling, logging & queue management.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.4)', color: '#FBBF24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>
                  04
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FFF', marginBottom: '0.2rem' }}>
                    Submit Bot & Demo
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    Ship your team's GitHub repository link and 3-minute video demo before deadline.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Multi-Dimensional Filter Bar (Identical Layout to ActivitiesPage) */}
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
                placeholder="Search hackathons by title, theme, tracks, or prize..."
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

            {/* Filter Dimensions (Status, Category) */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              paddingTop: '0.65rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
              {/* Status Chips */}
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
                  Status:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
                  {statuses.map((s) => {
                    const isSelected = selectedStatus === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setSelectedStatus(s)}
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
                        {s}
                      </button>
                    );
                  })}
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
                </div>
              </div>
            </div>
          </div>

          {/* Results Count Bar & Reset Action */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Showing <strong style={{ color: 'var(--text-primary)' }}>{filteredChallenges.length}</strong> recorded automation {filteredChallenges.length === 1 ? 'competition' : 'competitions'}
            </div>
            {(selectedStatus !== 'ALL' || selectedCategory !== 'ALL' || searchQuery.trim() !== '') && (
              <button
                onClick={() => {
                  setSelectedStatus('ALL');
                  setSelectedCategory('ALL');
                  setSearchQuery('');
                }}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <RotateCcw size={12} /> Reset Filters
              </button>
            )}
          </div>

          {/* Challenges Display (Timeline vs Grid) */}
          {filteredChallenges.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <Trophy size={42} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', fontWeight: 700 }}>No Hackathons Match Your Filters</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Try resetting the status, category, or search keywords.
              </p>
              <button
                onClick={() => {
                  setSelectedStatus('ALL');
                  setSelectedCategory('ALL');
                  setSearchQuery('');
                }}
                className="btn btn-secondary btn-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'timeline' ? (
            /* TIMELINE VIEW (SAME AS ACTIVITIES TIMELINE) */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              {filteredChallenges.map((chal) => (
                <div key={chal.id} className="glass-card" style={{ padding: '1.75rem', position: 'relative' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                        <span className="badge badge-orange">{chal.category}</span>
                        <span className={`badge ${
                          chal.status === 'Active' ? 'badge-orange' : chal.status === 'Upcoming' ? 'badge-blue' : 'badge-slate'
                        }`}>
                          {chal.status === 'Active' && <span className="status-dot-pulse" style={{ marginRight: '0.2rem' }} />}
                          {chal.status}
                        </span>
                        {chal.prizePool && (
                          <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                            <Trophy size={11} /> {chal.prizePool}
                          </span>
                        )}
                        {chal.isFeatured && (
                          <span className="badge badge-orange" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Star size={10} /> Featured
                          </span>
                        )}
                      </div>

                      <h2
                        onClick={() => handleOpenDetail(chal)}
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
                        {chal.title}
                      </h2>
                      {chal.theme && (
                        <p style={{ fontSize: '0.85rem', color: '#FED7AA', margin: '0.35rem 0 0 0' }}>
                          Theme: {chal.theme}
                        </p>
                      )}
                    </div>

                    {/* Metadata Chips & Registration Info */}
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
                          <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                            {chal.startDate} – {chal.endDate}
                          </span>
                        </div>
                        <span style={{ opacity: 0.3 }}>|</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Users size={13} style={{ color: 'var(--uipath-orange)' }} />
                          <span>{chal.submissionCount || 0} Teams</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {chal.descriptionMd && (
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.15rem', color: 'var(--text-secondary)' }}>
                      {getCleanExcerpt(chal.descriptionMd, chal.title).slice(0, 220)}...
                    </p>
                  )}

                  {/* Tracks Badges */}
                  {chal.useCases && chal.useCases.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                      {chal.useCases.map((track, tIdx) => (
                        <span key={track.id || tIdx} className="badge badge-slate" style={{ fontSize: '0.7rem' }}>
                          Track: {track.title}
                        </span>
                      ))}
                    </div>
                  )}

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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {chal.registrationDeadline && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#FBBF24' }}>
                          <Clock size={13} /> Reg Deadline: {chal.registrationDeadline}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {chal.starterDatasetUrl && (
                        <a
                          href={chal.starterDatasetUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-secondary btn-sm"
                          title="Download Starter Pack"
                        >
                          <Download size={13} /> Starter Pack
                        </a>
                      )}
                      <button
                        onClick={() => handleOpenDetail(chal)}
                        className="btn btn-primary btn-sm"
                      >
                        View Details & Submit Bot <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* GRID VIEW (SAME AS ACTIVITIES GRID) */
            <div className="grid-responsive-3" style={{ alignItems: 'start' }}>
              {filteredChallenges.map((chal) => (
                <div
                  key={chal.id}
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
                  {/* Banner / Poster Header Container */}
                  <div
                    onClick={() => handleOpenDetail(chal)}
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                      background: 'radial-gradient(circle at 50% 50%, rgba(30, 30, 35, 0.9) 0%, rgba(10, 10, 12, 1) 100%)',
                      cursor: 'pointer',
                      borderBottom: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      minHeight: chal.bannerImage ? '180px' : '140px'
                    }}
                  >
                    {chal.bannerImage ? (
                      <img
                        src={chal.bannerImage}
                        alt={chal.title}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                          display: 'block',
                          transition: 'transform 0.3s ease'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/logo.png';
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '140px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, rgba(250, 70, 22, 0.15) 0%, rgba(20, 20, 24, 0.9) 100%)'
                      }}>
                        <Trophy size={48} style={{ color: 'var(--uipath-orange)', opacity: 0.8 }} />
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(10, 10, 12, 0.85) 0%, transparent 60%)'
                    }} />

                    {/* Top Overlay Badges */}
                    <div style={{
                      position: 'absolute',
                      top: '0.65rem',
                      left: '0.65rem',
                      right: '0.65rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      zIndex: 2
                    }}>
                      <span className="badge badge-orange" style={{ fontSize: '0.68rem' }}>
                        {chal.category}
                      </span>
                      <span className={`badge ${
                        chal.status === 'Active' ? 'badge-orange' : chal.status === 'Upcoming' ? 'badge-blue' : 'badge-slate'
                      }`} style={{ fontSize: '0.68rem' }}>
                        {chal.status}
                      </span>
                    </div>
                  </div>

                  <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      {/* Dates & Prize Info */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.35rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Calendar size={12} style={{ color: 'var(--uipath-orange)' }} />
                          <span>{chal.startDate} – {chal.endDate}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>
                          <Users size={12} style={{ color: 'var(--uipath-orange)' }} />
                          <span>{chal.submissionCount || 0} Teams</span>
                        </div>
                      </div>

                      <h3
                        onClick={() => handleOpenDetail(chal)}
                        style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem', cursor: 'pointer', lineHeight: 1.35 }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#FA4616')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                      >
                        {chal.title}
                      </h3>

                      {chal.theme && (
                        <div style={{ fontSize: '0.8rem', color: '#FED7AA', marginBottom: '0.65rem', fontWeight: 500 }}>
                          Theme: {chal.theme}
                        </div>
                      )}

                      <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1.15rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>
                        {chal.descriptionMd ? getCleanExcerpt(chal.descriptionMd, chal.title) : chal.theme}
                      </p>
                    </div>

                    <div style={{ paddingTop: '0.85rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {chal.prizePool ? (
                        <span className="badge badge-green" style={{ fontSize: '0.675rem', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <Trophy size={10} /> {chal.prizePool.split('+')[0].trim()}
                        </span>
                      ) : (
                        <span className="badge badge-slate" style={{ fontSize: '0.675rem' }}>
                          UiPath Hackathon
                        </span>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        {chal.starterDatasetUrl && (
                          <a
                            href={chal.starterDatasetUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.35rem 0.55rem', fontSize: '0.75rem' }}
                            title="Download Starter Pack"
                          >
                            <Download size={12} />
                          </a>
                        )}
                        <button
                          onClick={() => handleOpenDetail(chal)}
                          className="btn btn-primary btn-sm"
                        >
                          Details <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) {
          .challenge-layout {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
};
