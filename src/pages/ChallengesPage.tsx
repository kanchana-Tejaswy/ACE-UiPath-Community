import React, { useState, useEffect } from 'react';
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
  Video,
  Code2,
  BookOpen,
  ExternalLink,
  MessageSquare,
  Play,
  Layers,
  Star,
  Check
} from 'lucide-react';
import { Challenge, User, ChallengeVideoRecording, ChallengeUseCaseTrack, ChallengeReferenceMaterial } from '../types';

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

export const ChallengesPage: React.FC<Props> = ({
  challenges,
  selectedChallengeSlug,
  currentUser,
  onSaveChallenge,
  onNavigate
}) => {
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(() => {
    if (selectedChallengeSlug) {
      const match = challenges.find((c) => c.slug === selectedChallengeSlug || c.id === selectedChallengeSlug);
      if (match) return match.id;
    }
    return challenges[0]?.id || '';
  });
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const [isInvalidSlug, setIsInvalidSlug] = useState<boolean>(false);
  const [activeVideoModal, setActiveVideoModal] = useState<ChallengeVideoRecording | null>(null);

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
        setIsInvalidSlug(true);
      }
    } else {
      setIsInvalidSlug(false);
    }
  }, [selectedChallengeSlug, challenges]);

  // Submission Form State
  const [teamName, setTeamName] = useState('');
  const [members, setMembers] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');

  const activeChallenge = challenges.find((c) => c.id === selectedChallengeId) || challenges[0];

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

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '3rem' }}>
        <span className="badge badge-orange" style={{ marginBottom: '0.5rem' }}>
          Competitive Automation
        </span>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800 }}>
          UiPath Hackathons & Ideathons
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '780px', marginTop: '0.5rem' }}>
          Compete in high-stakes automation challenges, build end-to-end enterprise bots with Starter Templates, access kickoff recordings, win cash prizes & official UiPath vouchers, and get fast-tracked for Core Team recruitment.
        </p>
      </div>

      {/* Invalid Challenge Fallback Banner */}
      {isInvalidSlug && selectedChallengeSlug && (
        <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', marginBottom: '2.5rem', border: '1px solid var(--border-glow)' }}>
          <Trophy size={40} style={{ color: 'var(--uipath-orange)', margin: '0 auto 0.75rem auto' }} />
          <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>Challenge / Hackathon Not Found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.25rem', maxWidth: '540px', margin: '0 auto 1.25rem auto' }}>
            No competitive automation hackathon matches the link "<code style={{ color: '#FED7AA' }}>{selectedChallengeSlug}</code>". Please explore active sprints below.
          </p>
          <button onClick={() => onNavigate && onNavigate('challenges')} className="btn btn-primary btn-sm">
            View Active Hackathons
          </button>
        </div>
      )}

      {/* Challenge Selector Tabs */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2.5rem'
      }}>
        {challenges.map((chal) => {
          const isSelected = chal.id === selectedChallengeId;
          return (
            <div
              key={chal.id}
              onClick={() => {
                setSelectedChallengeId(chal.id);
                if (onNavigate) onNavigate('challenges', chal.slug || chal.id);
              }}
              className="glass-card"
              style={{
                flex: '1 1 300px',
                padding: '1.5rem',
                cursor: 'pointer',
                background: isSelected ? 'var(--bg-surface)' : 'var(--bg-tertiary)',
                borderColor: isSelected ? 'var(--uipath-orange)' : 'var(--border-subtle)',
                boxShadow: isSelected ? 'var(--shadow-glow)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <span className={`badge ${
                    chal.status === 'Active' ? 'badge-orange' : chal.status === 'Upcoming' ? 'badge-blue' : 'badge-slate'
                  }`}>
                    {chal.status}
                  </span>
                  {chal.isFeatured && (
                    <span className="badge badge-orange" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                      <Star size={9} style={{ fill: '#FA4616', marginRight: '2px' }} /> Featured
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {chal.submissionCount} Teams Registered
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.35rem', fontWeight: 700 }}>{chal.title}</h3>
              <p style={{ fontSize: '0.825rem', color: '#FED7AA' }}>Theme: {chal.theme}</p>
            </div>
          );
        })}
      </div>

      {/* Active Challenge Detailed Layout */}
      {activeChallenge && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 380px',
          gap: '2.5rem'
        }} className="challenge-layout">
          {/* Main Challenge Specs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {/* Header Card with Banner Hero */}
            <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
              {activeChallenge.bannerImage && (
                <div style={{ position: 'relative', width: '100%', height: '260px', background: '#000', overflow: 'hidden' }}>
                  <img
                    src={activeChallenge.bannerImage}
                    alt={activeChallenge.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(18, 18, 20, 0.95) 0%, rgba(18, 18, 20, 0.4) 60%, transparent 100%)'
                  }} />
                  <div style={{ position: 'absolute', bottom: '1.5rem', left: '2rem', right: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span className="badge badge-orange">{activeChallenge.category}</span>
                        <span className="badge badge-green">Prize: {activeChallenge.prizePool}</span>
                      </div>
                      <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#FFF', margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                        {activeChallenge.title}
                      </h2>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ padding: '2rem' }}>
                {!activeChallenge.bannerImage && (
                  <>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                      <span className="badge badge-orange">{activeChallenge.category}</span>
                      <span className="badge badge-green">Prize: {activeChallenge.prizePool}</span>
                    </div>
                    <h2 style={{ fontSize: '1.85rem', marginBottom: '1rem' }}>{activeChallenge.title}</h2>
                  </>
                )}

                {/* 3-Column Timeline Summary */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                  gap: '1rem',
                  padding: '1.25rem',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.75rem'
                }}>
                  {activeChallenge.registrationDeadline && (
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>REGISTRATION DEADLINE</div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#FBBF24' }}>
                        {activeChallenge.registrationDeadline} {activeChallenge.registrationDeadlineTime ? `• ${activeChallenge.registrationDeadlineTime}` : ''}
                      </div>
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>HACKATHON START</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#34D399' }}>
                      {activeChallenge.startDate} {activeChallenge.startTime ? `• ${activeChallenge.startTime}` : ''}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>SUBMISSION DEADLINE</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#FA4616' }}>
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

                {/* Markdown Description */}
                <div className="markdown-body" style={{ color: 'var(--text-secondary)', fontSize: '0.975rem' }}>
                  <div dangerouslySetInnerHTML={{
                    __html: activeChallenge.descriptionMd
                      .replace(/### (.*?)\n/g, '<h4 style="color:#FFF;margin:1.25rem 0 0.5rem 0;font-size:1.1rem;font-weight:700">$1</h4>')
                      .replace(/\n/g, '<br/>')
                  }} />
                </div>
              </div>
            </div>

            {/* BOT USE CASES & TRACKS HUB */}
            {activeChallenge.useCases && activeChallenge.useCases.length > 0 && (
              <div className="glass-card" style={{ padding: '2rem' }}>
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
              <div className="glass-card" style={{ padding: '2rem' }}>
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
              <div className="glass-card" style={{ padding: '2rem' }}>
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
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={18} style={{ color: 'var(--uipath-orange)' }} /> Evaluation Criteria & Scoring Rubric
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {activeChallenge.evaluationCriteria.map((crit, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                    <CheckCircle2 size={16} style={{ color: '#10B981', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{crit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rules */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={18} style={{ color: 'var(--uipath-orange)' }} /> Competition Rules & Disqualification Policy
              </h3>
              <div className="markdown-body" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <div dangerouslySetInnerHTML={{
                  __html: activeChallenge.rulesMd.replace(/\n/g, '<br/>')
                }} />
              </div>
            </div>

            {/* Past Winners (if completed) */}
            {activeChallenge.winners && activeChallenge.winners.length > 0 && (
              <div className="glass-card" style={{ padding: '2rem' }}>
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

          {/* Sidebar: Submission Form & Resources */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {activeChallenge.status === 'Active' ? (
              <div className="glass-card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Send size={18} style={{ color: 'var(--uipath-orange)' }} /> Submit Bot Solution
                </h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  Submit your team's UiPath project before the deadline.
                </p>

                {submissionSuccess ? (
                  <div style={{
                    padding: '1.25rem',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid #10B981',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center'
                  }}>
                    <CheckCircle2 size={32} style={{ color: '#10B981', margin: '0 auto 0.5rem auto' }} />
                    <div style={{ fontWeight: 700, color: '#FFF' }}>Submission Received!</div>
                    <p style={{ fontSize: '0.8rem', color: '#D1FAE5', marginTop: '0.25rem' }}>
                      Your team's submission has been logged into the evaluation pipeline.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleChallengeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>TEAM NAME</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Team Automata"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        style={{ width: '100%', padding: '0.6rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>TEAM MEMBERS & ROLL NUMBERS</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul (22ACE05A01), Sneha (22ACE05A02)"
                        value={members}
                        onChange={(e) => setMembers(e.target.value)}
                        style={{ width: '100%', padding: '0.6rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>PROJECT TITLE *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Intelligent Attendance Bot"
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        style={{ width: '100%', padding: '0.6rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>GITHUB REPO OR CLOUD ZIP URL *</label>
                      <input
                        type="url"
                        required
                        placeholder="https://github.com/team/uipath-bot"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        style={{ width: '100%', padding: '0.6rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>3-MIN VIDEO DEMO URL</label>
                      <input
                        type="url"
                        placeholder="https://youtube.com/watch?v=..."
                        value={demoUrl}
                        onChange={(e) => setDemoUrl(e.target.value)}
                        style={{ width: '100%', padding: '0.6rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                      Submit Solution
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

            {/* Problem Statement Starter Pack */}
            {activeChallenge.starterDatasetUrl && (
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>Challenge Starter Pack</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Download the official problem statements, sample invoice datasets, and scoring rubric.
                </p>
                <a
                  href={activeChallenge.starterDatasetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%' }}
                >
                  <Download size={14} /> Download Starter Pack (.PDF)
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .challenge-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
