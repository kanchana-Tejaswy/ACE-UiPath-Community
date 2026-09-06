import React from 'react';
import { 
  ArrowRight, 
  Calendar, 
  MapPin, 
  Clock, 
  ExternalLink,
  BookOpen,
  Code,
  Trophy,
  Users,
  CheckCircle2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Activity, LearningPath, ProjectShowcase, Challenge, SiteSettings, User } from '../types';

interface Props {
  activities: Activity[];
  learningPaths: LearningPath[];
  projects: ProjectShowcase[];
  challenges: Challenge[];
  settings: SiteSettings;
  currentUser: User;
  onNavigate: (view: string, detailId?: string) => void;
}

export const HomePage: React.FC<Props> = ({
  activities,
  learningPaths,
  projects,
  challenges,
  settings,
  currentUser,
  onNavigate
}) => {
  // Data-driven content resolution
  const heroHeading = settings.heroHeading || 'ACE UiPath Community';
  const heroTagline = settings.heroTagline || 'A student community at ACE Engineering College focused on learning, building and exploring automation.';
  const primaryCtaText = settings.primaryCtaText || 'Explore the Community';
  const primaryCtaLink = settings.primaryCtaLink || 'activities';
  const secondaryCtaText = settings.secondaryCtaText || 'Start Learning';
  const secondaryCtaLink = settings.secondaryCtaLink || 'learn';

  // Statistics from Admin CMS
  const statisticsList = (settings.statistics && settings.statistics.length > 0)
    ? settings.statistics.filter((s) => s.visible !== false).sort((a, b) => a.order - b.order)
    : [
        { id: 's1', title: 'Students Trained', value: '850+', description: 'Workshops across CSE, IT, ECE & allied branches', visible: true, order: 1 },
        { id: 's2', title: 'Automations Built', value: '140+', description: 'Production-ready bots deployed for student and campus needs', visible: true, order: 2 },
        { id: 's3', title: 'UiPath Certifications', value: '95+', description: 'Certified Associate & Specialist developers', visible: true, order: 3 },
        { id: 's4', title: 'Hours Automated', value: '3,800+', description: 'Saved in academic grading and records handling', visible: true, order: 4 }
      ];

  // Helper to render gradient on "Student Community" or "Community"
  const renderHeroHeading = (text: string) => {
    if (text.includes('Student Community')) {
      const parts = text.split('Student Community');
      return (
        <>
          {parts[0]}
          <span style={{
            background: 'linear-gradient(135deg, #FFFFFF 20%, #FA4616 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
          }}>
            Student Community
          </span>
          {parts.slice(1).join('Student Community')}
        </>
      );
    }
    if (text.includes('Community')) {
      const parts = text.split('Community');
      return (
        <>
          {parts[0]}
          <span style={{
            background: 'linear-gradient(135deg, #FFFFFF 20%, #FA4616 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
          }}>
            Community
          </span>
          {parts.slice(1).join('Community')}
        </>
      );
    }
    return text;
  };

  // Featured / Latest Event
  const featuredActivity = (settings.featuredActivityId && activities.find((a) => a.id === settings.featuredActivityId))
    || activities.find((a) => a.isFeatured && a.status === 'Upcoming')
    || activities.find((a) => a.status === 'Upcoming')
    || activities[0];

  // Featured Projects
  const featuredProjects = (settings.featuredProjectIds && settings.featuredProjectIds.length > 0)
    ? settings.featuredProjectIds.map((id) => projects.find((p) => p.id === id)).filter((p): p is ProjectShowcase => Boolean(p))
    : projects.filter((p) => p.status === 'Featured' || p.status === 'Approved').slice(0, 3);

  // Recent highlights (completed activities)
  const recentHighlights = activities.filter((a) => a.id !== featuredActivity?.id).slice(0, 3);

  return (
    <div style={{ paddingBottom: '5rem' }}>
      {/* 1. HERO SECTION */}
      <section style={{
        paddingTop: '4.5rem',
        paddingBottom: '4.5rem',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(250, 70, 22, 0.08) 0%, rgba(11, 11, 11, 0) 70%)',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div className="container">
          <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center' }}>
            {/* Institution Chapter Eyebrow Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(255, 70, 22, 0.08)',
                border: '1px solid rgba(255, 70, 22, 0.25)',
                borderRadius: '9999px',
                padding: '0.4rem 1.05rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: '#FA4616',
                boxShadow: '0 0 12px rgba(255, 70, 22, 0.15)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)'
              }}>
                <ShieldCheck size={14} style={{ color: '#FA4616', flexShrink: 0 }} />
                <span>UiPath Academic Alliance &bull; ACE Engineering College</span>
              </span>
            </div>

            {/* Main Headline */}
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5.5vw, 4rem)',
              lineHeight: 1.1,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#FFFFFF',
              marginBottom: '1.25rem'
            }}>
              {renderHeroHeading(heroHeading)}
            </h1>

            {/* Sub-headline */}
            <p style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              color: '#D1D5DB',
              lineHeight: 1.6,
              maxWidth: '720px',
              margin: '0 auto 2.5rem auto'
            }}>
              {heroTagline}
            </p>

            {/* Primary & Secondary Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => onNavigate(primaryCtaLink)}
                className="btn btn-lg"
                style={{
                  background: '#FA4616',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.975rem',
                  borderRadius: '10px',
                  padding: '0.85rem 1.85rem',
                  boxShadow: '0 4px 14px rgba(250, 70, 22, 0.25)',
                  transition: 'all 0.2s ease',
                  border: '1px solid transparent',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 24px rgba(255, 70, 22, 0.45)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.background = '#FF521D';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(250, 70, 22, 0.25)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = '#FA4616';
                }}
              >
                {primaryCtaText} <ArrowRight size={18} />
              </button>

              <button
                onClick={() => onNavigate(secondaryCtaLink)}
                className="btn btn-lg"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.10)',
                  borderRadius: '10px',
                  padding: '0.85rem 1.85rem',
                  color: '#E5E7EB',
                  fontWeight: 600,
                  fontSize: '0.975rem',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.10)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.20)';
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.10)';
                  e.currentTarget.style.color = '#E5E7EB';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {secondaryCtaText}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COMMUNITY STATISTICS - Card Separation & Divider */}
      <section style={{
        paddingTop: '3.5rem',
        paddingBottom: '3.5rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.10)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(14, 14, 14, 0.65)'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem'
          }}>
            {statisticsList.map((stat) => (
              <div
                key={stat.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.025)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(250, 70, 22, 0.3)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.045)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.025)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div>
                  <div style={{
                    fontSize: 'clamp(2.2rem, 3.2vw, 2.75rem)',
                    fontWeight: 800,
                    color: '#FA4616',
                    lineHeight: 1.1,
                    letterSpacing: '-0.025em',
                    marginBottom: '0.65rem'
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontSize: '0.975rem',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    marginBottom: '0.45rem',
                    letterSpacing: '-0.01em'
                  }}>
                    {stat.title}
                  </div>
                </div>
                <div style={{
                  fontSize: '0.825rem',
                  color: '#9CA3AF',
                  lineHeight: 1.5,
                  marginTop: '0.25rem',
                  wordBreak: 'normal',
                  overflow: 'visible'
                }}>
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. LATEST / UPCOMING SESSION */}
      {featuredActivity && (
        <section className="section-divider">
          <div className="container">
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div className="section-tag">FEATURED COMMUNITY SESSION</div>
                <h2 className="section-title">Latest & Upcoming Activities</h2>
                <p className="section-subtitle">
                  Hands-on learning sessions, industry masterclasses, and technical bootcamps held on campus and online.
                </p>
              </div>

              <button
                onClick={() => onNavigate('activities')}
                className="btn btn-outline btn-sm"
              >
                View Full Timeline <ArrowRight size={14} />
              </button>
            </div>

            {/* Event Feature Layout: Real Visual + Direct Information */}
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: featuredActivity.bannerImage ? 'minmax(300px, 420px) minmax(0, 1fr)' : '1fr',
              gap: '0'
            }} className="featured-event-grid">
              {/* Event Image / Poster */}
              {featuredActivity.bannerImage && (
                <div style={{
                  background: 'var(--bg-tertiary)',
                  minHeight: '300px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  <img
                    src={featuredActivity.bannerImage}
                    alt={featuredActivity.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      maxHeight: '440px',
                      display: 'block'
                    }}
                    onError={(e) => {
                      // Graceful fallback to neutral placeholder
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Event Details */}
              <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-orange">{featuredActivity.category}</span>
                    <span className="badge badge-neutral">{featuredActivity.eventType}</span>
                    <span className={`badge ${featuredActivity.status === 'Upcoming' ? 'badge-green' : 'badge-slate'}`}>
                      {featuredActivity.status}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.85rem' }}>
                    {featuredActivity.title}
                  </h3>

                  <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                    {featuredActivity.summary}
                  </p>

                  {/* Metadata Row: Date, Time, Venue */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '1rem',
                    padding: '1.25rem',
                    background: 'var(--bg-primary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    marginBottom: '1.75rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <Calendar size={18} style={{ color: 'var(--uipath-orange)', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>DATE</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{featuredActivity.date}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <Clock size={18} style={{ color: 'var(--uipath-orange)', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>TIME</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {featuredActivity.timeStart} - {featuredActivity.timeEnd}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <MapPin size={18} style={{ color: 'var(--uipath-orange)', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>VENUE</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{featuredActivity.venue}</div>
                      </div>
                    </div>
                  </div>

                  {/* Speaker info if available */}
                  {featuredActivity.speakers && featuredActivity.speakers.length > 0 && (
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                      Speaker: <strong style={{ color: 'var(--text-primary)' }}>{featuredActivity.speakers[0].name}</strong> ({featuredActivity.speakers[0].roleTitle}, {featuredActivity.speakers[0].organization})
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => onNavigate('activities', featuredActivity.slug)}
                    className="btn btn-primary"
                  >
                    View Session Details <ArrowRight size={16} />
                  </button>

                  {featuredActivity.slidesUrl && (
                    <a
                      href={featuredActivity.slidesUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                    >
                      Session Materials <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. WHAT WE DO - 4 Editorial Pillars (No nested card chaos) */}
      <section className="section-divider" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ maxWidth: '640px', marginBottom: '3rem' }}>
            <div className="section-tag">WHAT WE DO</div>
            <h2 className="section-title">How Our Community Operates</h2>
            <p className="section-subtitle">
              We focus on practical, repeatable engineering practices that prepare students for real automation careers.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2rem'
          }}>
            <div style={{ borderTop: '2px solid var(--uipath-orange)', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <BookOpen size={20} style={{ color: 'var(--uipath-orange)' }} />
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>1. Learn</h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Guided curricular tracks from zero-code StudioX basics to professional enterprise architecture with REFramework.
              </p>
              <button
                onClick={() => onNavigate('learn')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--uipath-orange)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '0.5rem 0',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  marginTop: '0.5rem'
                }}
              >
                Explore Courses <ChevronRight size={14} />
              </button>
            </div>

            <div style={{ borderTop: '2px solid rgba(255, 255, 255, 0.14)', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Code size={20} style={{ color: 'var(--text-primary)' }} />
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>2. Build</h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Students develop working bots that automate campus tasks, university result extraction, and business invoice processing.
              </p>
              <button
                onClick={() => onNavigate('projects')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '0.5rem 0',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  marginTop: '0.5rem'
                }}
              >
                View Student Projects <ChevronRight size={14} />
              </button>
            </div>

            <div style={{ borderTop: '2px solid rgba(255, 255, 255, 0.14)', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Trophy size={20} style={{ color: 'var(--text-primary)' }} />
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>3. Compete</h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Annual hackathons, national automation sprints, and monthly bug bashes with peer evaluation and recognized awards.
              </p>
              <button
                onClick={() => onNavigate('challenges')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '0.5rem 0',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  marginTop: '0.5rem'
                }}
              >
                See Competitions <ChevronRight size={14} />
              </button>
            </div>

            <div style={{ borderTop: '2px solid rgba(255, 255, 255, 0.14)', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Users size={20} style={{ color: 'var(--text-primary)' }} />
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>4. Share</h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Open-source starter templates, slide archives, peer mentoring, and alumni placement guidance for upcoming batches.
              </p>
              <button
                onClick={() => onNavigate('resources')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '0.5rem 0',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  marginTop: '0.5rem'
                }}
              >
                Download Templates <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. STUDENT PROJECTS - Real Student Creations */}
      <section className="section-divider">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="section-tag">STUDENT WORK</div>
              <h2 className="section-title">What Students Are Building</h2>
              <p className="section-subtitle">
                Software robots designed and deployed by ACE Engineering College students to eliminate repetitive digital tasks.
              </p>
            </div>

            <button
              onClick={() => onNavigate('projects')}
              className="btn btn-outline btn-sm"
            >
              Browse All Projects ({projects.length}) <ArrowRight size={14} />
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '1.75rem'
          }}>
            {featuredProjects.map((project) => (
              <div
                key={project.id}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                    {project.uipathToolsUsed.slice(0, 2).map((tool, idx) => (
                      <span key={idx} className="badge badge-slate" style={{ fontSize: '0.7rem' }}>
                        {tool}
                      </span>
                    ))}
                    <span className="badge badge-green" style={{ fontSize: '0.7rem', marginLeft: 'auto' }}>
                      {project.status}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    {project.title}
                  </h4>

                  <div style={{ fontSize: '0.85rem', color: 'var(--uipath-orange)', fontWeight: 600, marginBottom: '0.75rem' }}>
                    Impact: {project.roiMetrics}
                  </div>

                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '1.25rem' }}>
                    {project.problemStatement || project.summary}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {project.authorName}
                    </div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                      {project.authorBranch || 'Engineering Student'}
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('projects', project.slug)}
                    className="btn btn-secondary btn-sm"
                  >
                    View Project <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. COMMUNITY STORY - Institutional Longevity & Purpose */}
      <section className="section-divider" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'center'
          }}>
            <div>
              <div className="section-tag">COMMUNITY HISTORY & PURPOSE</div>
              <h2 className="section-title">
                {settings.communityStoryHeading || 'Building an Engineering Legacy in Robotic Automation'}
              </h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                {settings.communityStoryText || 'Founded under the UiPath Academic Alliance at ACE Engineering College (Ghatkesar, Hyderabad), our community bridges the gap between academic theory and industry automation practice. Guided by dedicated faculty and student champions, we conduct weekly hands-on labs, open-source bot hackathons, and enterprise certification bootcamps.'}
              </p>
              <div style={{
                padding: '1rem 1.25rem',
                borderLeft: '3px solid var(--uipath-orange)',
                background: 'var(--bg-primary)',
                borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                marginBottom: '1.75rem',
                fontSize: '0.9rem',
                color: '#FED7AA'
              }}>
                {settings.communityStoryHighlight || 'Over 850 students trained and 140+ functional automations built for campus and enterprise use cases.'}
              </div>

              <button
                onClick={() => onNavigate('about')}
                className="btn btn-secondary"
              >
                Read Chapter History & Leadership <ArrowRight size={16} />
              </button>
            </div>

            {/* Visual Collage: Community Poster / Real Photos */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              padding: '1.25rem'
            }}>
              <img
                src={settings.communityStoryImageUrl || '/ace-campus.jpg'}
                alt="ACE Engineering College Campus, Ghatkesar, Hyderabad"
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 'var(--radius-md)',
                  display: 'block',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/campus.jpg';
                }}
              />
              <div style={{ padding: '1rem 0.5rem 0.25rem 0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
                ACE Engineering College Campus, Ghatkesar (Hyderabad) — Home of the ACE UiPath Community
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. JOIN THE COMMUNITY CTA */}
      <section style={{
        paddingTop: '5rem',
        paddingBottom: '5rem',
        textAlign: 'center'
      }}>
        <div className="container">
          <div style={{ maxWidth: '650px', margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.5rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Ready to Explore Automation?
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
              Whether you are a first-year student writing your first Excel bot or a senior preparing for enterprise certification, our community has a place for you.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => onNavigate('join')}
                className="btn btn-primary btn-lg"
              >
                Join the Community <ArrowRight size={18} />
              </button>
              <button
                onClick={() => onNavigate('learn')}
                className="btn btn-outline btn-lg"
              >
                Start Learning Academy
              </button>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 860px) {
          .featured-event-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
