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
  ArrowRight
} from 'lucide-react';
import { Challenge, User } from '../types';

interface Props {
  challenges: Challenge[];
  selectedChallengeSlug?: string;
  currentUser: User;
  onSaveChallenge: (challenge: Challenge) => void;
  onNavigate?: (view: string, detailId?: string) => void;
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
        submissionCount: activeChallenge.submissionCount + 1
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
          Compete in high-stakes automation challenges, build end-to-end bots under time constraints, win cash prizes & official UiPath vouchers, and get fast-tracked for Core Team recruitment.
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
                boxShadow: isSelected ? 'var(--shadow-glow)' : 'none'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className={`badge ${chal.status === 'Active' ? 'badge-orange' : 'badge-slate'}`}>
                  {chal.status}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {chal.submissionCount} Teams Registered
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.35rem' }}>{chal.title}</h3>
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
            {/* Header Card */}
            <div className="glass-panel" style={{ padding: '2.5rem' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                <span className="badge badge-orange">{activeChallenge.category}</span>
                <span className="badge badge-green">Prize: {activeChallenge.prizePool}</span>
              </div>

              <h2 style={{ fontSize: '1.85rem', marginBottom: '1rem' }}>{activeChallenge.title}</h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1rem',
                padding: '1.25rem',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.75rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>START DATE</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{activeChallenge.startDate}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>SUBMISSION DEADLINE</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#FA4616' }}>{activeChallenge.endDate}</div>
                </div>
              </div>

              {/* Markdown Description */}
              <div className="markdown-body" style={{ color: 'var(--text-secondary)', fontSize: '0.975rem' }}>
                <div dangerouslySetInnerHTML={{
                  __html: activeChallenge.descriptionMd
                    .replace(/### (.*?)\n/g, '<h4 style="color:#FFF;margin:1.25rem 0 0.5rem 0;font-size:1.1rem">$1</h4>')
                    .replace(/\n/g, '<br/>')
                }} />
              </div>
            </div>

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
