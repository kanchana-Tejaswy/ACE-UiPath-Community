import React from 'react';
import { 
  ArrowRight, 
  Calendar, 
  CalendarPlus,
  MapPin, 
  Clock, 
  ExternalLink,
  BookOpen,
  Code,
  Trophy,
  Users,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Newspaper,
  GraduationCap,
  Award,
  Sparkles
} from 'lucide-react';
import { Activity, LearningPath, ProjectShowcase, Challenge, SiteSettings, User, Article } from '../types';

interface Props {
  activities: Activity[];
  learningPaths: LearningPath[];
  projects: ProjectShowcase[];
  challenges: Challenge[];
  settings: SiteSettings;
  currentUser: User;
  articles?: Article[];
  onNavigate: (view: string, detailId?: string) => void;
}

export const HomePage: React.FC<Props> = ({
  activities,
  learningPaths,
  projects,
  challenges,
  settings,
  currentUser,
  articles = [],
  onNavigate
}) => {
  // Data-driven content resolution
  const rawHeading = settings.heroHeading || 'ACE UiPath Community';
  const heroHeading = rawHeading.includes('Student Community')
    ? rawHeading.replace('Student Community', 'Community')
    : rawHeading;
  const heroTagline = settings.heroTagline || 'A student community at ACE Engineering College focused on learning, building and exploring automation.';
  const primaryCtaText = settings.primaryCtaText || 'Explore the Community';
  const primaryCtaLink = settings.primaryCtaLink || 'activities';
  const secondaryCtaText = settings.secondaryCtaText || 'Start Learning';
  const secondaryCtaLink = settings.secondaryCtaLink || 'learn';

  // Statistics from Admin CMS
  const statisticsList = (settings.statistics && settings.statistics.length > 0)
    ? settings.statistics.filter((s) => s.visible !== false).sort((a, b) => a.order - b.order)
    : [
        { id: 's1', title: 'Students Trained', value: '950+', description: 'Workshops across CSE, IT, ECE & allied branches', visible: true, order: 1 },
        { id: 's2', title: 'Automations Built', value: '140+', description: 'Production-ready bots deployed for student and campus needs', visible: true, order: 2 },
        { id: 's3', title: 'UiPath Certifications', value: '95+', description: 'Certified Associate & Specialist developers', visible: true, order: 3 },
        { id: 's4', title: 'Hours Automated', value: '3,800+', description: 'Saved in academic grading and records handling', visible: true, order: 4 }
      ];

  const getStatIcon = (index: number) => {
    switch (index % 4) {
      case 0: return <GraduationCap size={18} style={{ color: 'var(--uipath-orange)' }} />;
      case 1: return <Code size={18} style={{ color: 'var(--uipath-orange)' }} />;
      case 2: return <Award size={18} style={{ color: '#FBBF24' }} />;
      case 3: return <Clock size={18} style={{ color: '#34D399' }} />;
      default: return <Sparkles size={18} style={{ color: 'var(--uipath-orange)' }} />;
    }
  };

  // Helper to render gradient on "Community"
  const renderHeroHeading = (text: string) => {
    const cleanText = text.replace('Student Community', 'Community');
    if (cleanText.includes('Community')) {
      const parts = cleanText.split('Community');
      return (
        <>
          {parts[0]}
          <span className="text-gradient-orange">
            Community
          </span>
          {parts.slice(1).join('Community')}
        </>
      );
    }
    return cleanText;
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

  // Featured Technical Publication
  const publiclyVisibleArticles = articles.filter((a) => {
    if (a.status === 'PUBLISHED') return true;
    if (a.status === 'SCHEDULED' && a.scheduledAt && new Date(a.scheduledAt).getTime() <= Date.now()) return true;
    return false;
  });

  const homepageArticle = (settings.featuredArticleId && publiclyVisibleArticles.find((a) => a.id === settings.featuredArticleId))
    || publiclyVisibleArticles.find((a) => a.isFeatured)
    || publiclyVisibleArticles[0]
    || null;

  return (
    <div style={{ paddingBottom: '5rem' }}>
      {/* 1. HERO SECTION & INTEGRATED STATS GRID */}
      <section style={{
        paddingTop: '4.5rem',
        paddingBottom: '4.75rem',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Soft Ambient Breathing Backlight */}
        <div className="hero-ambient-glow" />

        <div className="container" style={{ maxWidth: '1240px', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '920px', margin: '0 auto', textAlign: 'center' }}>
            {/* Institution Chapter Eyebrow Badge */}
            <div className="animate-fade-up stagger-1" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.35rem' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                background: 'rgba(250, 70, 22, 0.08)',
                border: '1px solid rgba(250, 70, 22, 0.26)',
                borderRadius: '9999px',
                padding: '0.4rem 1.15rem',
                fontSize: '0.775rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: '#FA4616',
                boxShadow: '0 2px 12px rgba(250, 70, 22, 0.12)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                transition: 'all 200ms ease'
              }}>
                <span className="status-dot-pulse status-dot-pulse-orange" />
                <span>UiPath Academic Alliance &bull; ACE Engineering College</span>
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="animate-fade-up stagger-2" style={{
              fontSize: 'clamp(2.4rem, 4.8vw, 3.75rem)',
              lineHeight: 1.14,
              fontWeight: 800,
              letterSpacing: '-0.035em',
              color: '#FFFFFF',
              marginBottom: '1.25rem',
              maxWidth: '920px',
              marginLeft: 'auto',
              marginRight: 'auto',
              whiteSpace: 'normal'
            }}>
              {renderHeroHeading(heroHeading)}
            </h1>

            {/* Sub-headline */}
            <p className="animate-fade-up stagger-3" style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
              color: '#D1D5DB',
              lineHeight: 1.68,
              maxWidth: '680px',
              margin: '0 auto 2.35rem auto'
            }}>
              {heroTagline}
            </p>

            {/* Primary & Secondary Action Buttons */}
            <div className="animate-fade-up stagger-4" style={{ display: 'flex', justifyContent: 'center', gap: '0.9rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                onClick={() => onNavigate(primaryCtaLink)}
                className="btn btn-primary btn-lg btn-tactile"
                style={{ minHeight: '46px', padding: '0.8rem 1.75rem' }}
              >
                <span>{primaryCtaText}</span>
                <ArrowRight size={16} style={{ transition: 'transform 150ms ease' }} />
              </button>

              <button
                onClick={() => onNavigate(secondaryCtaLink)}
                className="btn btn-secondary btn-lg btn-tactile"
                style={{ minHeight: '46px', padding: '0.8rem 1.75rem' }}
              >
                {secondaryCtaText}
              </button>
            </div>
          </div>

          {/* Stats Grid: responsive 4-column layout */}
          <div
            className="stats-responsive-grid animate-fade-up stagger-4"
            style={{
              maxWidth: '74rem',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: '3.5rem'
            }}
          >
            {statisticsList.map((stat, idx) => (
              <div
                key={stat.id}
                className="stat-card interactive-card"
                style={{ padding: '1.5rem', borderRadius: '14px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                  <div
                    style={{
                      fontSize: 'clamp(2rem, 3.2vw, 2.4rem)',
                      fontWeight: 800,
                      color: '#FA4616',
                      letterSpacing: '-0.03em',
                      lineHeight: 1,
                      fontVariantNumeric: 'tabular-nums'
                    }}
                  >
                    {stat.value}
                  </div>
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {getStatIcon(idx)}
                  </div>
                </div>

                <div>
                  <div style={{
                    fontSize: '0.925rem',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    letterSpacing: '-0.01em',
                    marginBottom: '0.3rem'
                  }}>
                    {stat.title}
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: '#9CA3AF',
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {stat.description}
                  </div>
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
            <div style={{ marginBottom: '2.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div className="section-tag">FEATURED COMMUNITY SESSION</div>
                <h2 className="section-title">Latest & Upcoming Activities</h2>
                <p className="section-subtitle">
                  Hands-on learning sessions, industry masterclasses, and technical bootcamps held on campus and online.
                </p>
              </div>

              <button
                onClick={() => onNavigate('activities')}
                className="btn btn-outline btn-sm btn-tactile"
              >
                View Full Timeline <ArrowRight size={14} />
              </button>
            </div>

            {/* Unified Featured Card Wrapper with Soft Ambient Orange Backlight */}
            <div style={{ position: 'relative' }}>
              {/* Soft Ambient Orange Backlight */}
              <div style={{
                position: 'absolute',
                inset: '-10px',
                background: 'radial-gradient(ellipse at 15% 45%, rgba(250, 70, 22, 0.09) 0%, rgba(250, 70, 22, 0.02) 50%, transparent 75%)',
                filter: 'blur(30px)',
                borderRadius: '1.5rem',
                zIndex: 0,
                pointerEvents: 'none'
              }} />

              {/* Main Card Container with Subtle Dark Glassmorphism */}
              <div
                className="featured-event-grid interactive-card"
                style={{
                  position: 'relative',
                  zIndex: 1,
                  background: 'rgba(20, 20, 24, 0.65)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '16px',
                  padding: 'clamp(1.5rem, 3.5vw, 2.35rem)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  boxShadow: '0 20px 45px rgba(0, 0, 0, 0.55)',
                  display: 'grid',
                  gridTemplateColumns: featuredActivity.bannerImage ? 'minmax(280px, 420px) minmax(0, 1fr)' : '1fr',
                  gap: 'clamp(1.5rem, 3vw, 2.5rem)',
                  alignItems: 'center'
                }}
              >
                {/* Event Image / Poster with Rounded Border & Aspect Ratio Wrapper */}
                {featuredActivity.bannerImage && (
                  <div style={{
                    borderRadius: '10px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.10)',
                    boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.7)',
                    background: '#141414',
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '16 / 10',
                    maxHeight: '380px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <img
                      src={featuredActivity.bannerImage}
                      alt={featuredActivity.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 240ms cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.02)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/logo.png';
                      }}
                    />
                  </div>
                )}

                {/* Event Details */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    {/* Status Badges & Eyebrow Hierarchy */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                      {/* Category Pill */}
                      <span style={{
                        fontSize: '0.725rem',
                        fontWeight: 600,
                        padding: '0.25rem 0.65rem',
                        borderRadius: '9999px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        background: 'rgba(250, 70, 22, 0.10)',
                        color: '#FB923C',
                        border: '1px solid rgba(250, 70, 22, 0.22)'
                      }}>
                        {featuredActivity.category || 'COMMUNITY MEETUP'}
                      </span>

                      {/* Event Type Pill */}
                      <span style={{
                        fontSize: '0.725rem',
                        fontWeight: 600,
                        padding: '0.25rem 0.65rem',
                        borderRadius: '9999px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        background: 'rgba(255, 255, 255, 0.06)',
                        color: '#D4D4D4',
                        border: '1px solid var(--border-subtle)'
                      }}>
                        {featuredActivity.eventType || 'HYBRID'}
                      </span>

                      {/* Status Pill with Pulsing Green Micro-Dot for Upcoming */}
                      <span style={{
                        fontSize: '0.725rem',
                        fontWeight: 600,
                        padding: '0.25rem 0.65rem',
                        borderRadius: '9999px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        background: featuredActivity.status === 'Upcoming' ? 'rgba(16, 185, 129, 0.10)' : 'rgba(255, 255, 255, 0.05)',
                        color: featuredActivity.status === 'Upcoming' ? '#34D399' : '#9CA3AF',
                        border: featuredActivity.status === 'Upcoming' ? '1px solid rgba(16, 185, 129, 0.22)' : '1px solid rgba(255, 255, 255, 0.10)'
                      }}>
                        {featuredActivity.status === 'Upcoming' && (
                          <span style={{ position: 'relative', display: 'inline-flex', height: '7px', width: '7px' }}>
                            <span style={{
                              position: 'absolute',
                              display: 'inline-flex',
                              height: '100%',
                              width: '100%',
                              borderRadius: '9999px',
                              background: '#10B981',
                              opacity: 0.75,
                              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                            }} />
                            <span style={{
                              position: 'relative',
                              display: 'inline-flex',
                              borderRadius: '9999px',
                              height: '7px',
                              width: '7px',
                              background: '#10B981'
                            }} />
                          </span>
                        )}
                        <span>{featuredActivity.status}</span>
                      </span>
                    </div>

                    <h3 style={{
                      fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      lineHeight: 1.25,
                      letterSpacing: '-0.02em',
                      marginBottom: '0.75rem'
                    }}>
                      {featuredActivity.title}
                    </h3>

                    <p style={{
                      fontSize: '0.95rem',
                      color: '#D1D5DB',
                      lineHeight: 1.6,
                      marginBottom: '1.5rem'
                    }}>
                      {featuredActivity.summary}
                    </p>

                    {/* Event Meta Grid (Date, Time, Venue) */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))',
                      gap: '0.75rem',
                      padding: '1rem 1.15rem',
                      borderRadius: '10px',
                      background: 'rgba(10, 10, 12, 0.65)',
                      border: '1px solid var(--border-subtle)',
                      marginBottom: '1.75rem'
                    }}>
                      {/* DATE */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <Calendar size={18} style={{ color: '#FA4616', flexShrink: 0 }} />
                        <div>
                          <div style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            color: '#9CA3AF',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '0.15rem'
                          }}>
                            DATE
                          </div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#F3F4F6' }}>
                            {featuredActivity.date}
                          </div>
                        </div>
                      </div>

                      {/* TIME */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <Clock size={18} style={{ color: '#FA4616', flexShrink: 0 }} />
                        <div>
                          <div style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            color: '#9CA3AF',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '0.15rem'
                          }}>
                            TIME
                          </div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#F3F4F6' }}>
                            {featuredActivity.timeStart} - {featuredActivity.timeEnd}
                          </div>
                        </div>
                      </div>

                      {/* VENUE */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <MapPin size={18} style={{ color: '#FA4616', flexShrink: 0 }} />
                        <div>
                          <div style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            color: '#9CA3AF',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '0.15rem'
                          }}>
                            VENUE
                          </div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#F3F4F6' }}>
                            {featuredActivity.venue}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <button
                      onClick={() => onNavigate('activities', featuredActivity.slug)}
                      className="btn btn-primary btn-tactile"
                      style={{
                        padding: '0.65rem 1.4rem',
                        fontSize: '0.9rem',
                        borderRadius: '8px'
                      }}
                    >
                      View Session Details <ArrowRight size={15} />
                    </button>

                    {featuredActivity.registrationUrl && (
                      <a
                        href={featuredActivity.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-tactile"
                        style={{
                          background: 'rgba(250, 70, 22, 0.12)',
                          color: '#FB923C',
                          borderColor: 'rgba(250, 70, 22, 0.35)',
                          borderRadius: '8px',
                          padding: '0.65rem 1.15rem',
                          fontSize: '0.875rem',
                          fontWeight: 600
                        }}
                      >
                        <ExternalLink size={15} />
                        <span>Register Now</span>
                      </a>
                    )}

                    <button
                      onClick={() => {
                        const title = encodeURIComponent(featuredActivity.title);
                        const details = encodeURIComponent(featuredActivity.summary || 'ACE UiPath Community Session');
                        const location = encodeURIComponent(featuredActivity.venue || 'ACE Engineering College, Hyderabad');
                        window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`, '_blank', 'noopener,noreferrer');
                      }}
                      className="btn btn-secondary btn-tactile"
                      style={{
                        borderRadius: '8px',
                        padding: '0.65rem 1rem',
                        fontSize: '0.875rem',
                        color: '#D1D5DB'
                      }}
                    >
                      <CalendarPlus size={15} style={{ color: '#FA4616' }} />
                      <span>Add to Calendar</span>
                    </button>

                    {featuredActivity.slidesUrl && (
                      <a
                        href={featuredActivity.slidesUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm btn-tactile"
                        style={{ padding: '0.6rem 0.9rem', borderRadius: '8px', fontSize: '0.85rem' }}
                      >
                        Session Materials <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. WHAT WE DO - 4 Editorial Pillars */}
      <section className="section-divider">
        <div className="container">
          <div style={{ maxWidth: '640px', marginBottom: '2.5rem' }}>
            <div className="section-tag">WHAT WE DO</div>
            <h2 className="section-title">How Our Community Operates</h2>
            <p className="section-subtitle">
              We focus on practical, repeatable engineering practices that prepare students for real automation careers.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem'
          }}>
            <div className="glass-card interactive-card" style={{ padding: '1.75rem', borderRadius: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(250, 70, 22, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--uipath-orange)' }}>
                  <BookOpen size={19} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>1. Learn</h3>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Guided curricular tracks from zero-code StudioX basics to professional enterprise architecture with REFramework.
              </p>
              <button
                onClick={() => onNavigate('learn')}
                className="btn-tactile"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--uipath-orange)',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                Explore Courses <ChevronRight size={14} />
              </button>
            </div>

            <div className="glass-card interactive-card" style={{ padding: '1.75rem', borderRadius: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)' }}>
                  <Code size={19} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>2. Build</h3>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Students develop working bots that automate campus tasks, university result extraction, and business invoice processing.
              </p>
              <button
                onClick={() => onNavigate('projects')}
                className="btn-tactile"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                View Student Projects <ChevronRight size={14} />
              </button>
            </div>

            <div className="glass-card interactive-card" style={{ padding: '1.75rem', borderRadius: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FBBF24' }}>
                  <Trophy size={19} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>3. Compete</h3>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Annual hackathons, national automation sprints, and monthly bug bashes with peer evaluation and recognized awards.
              </p>
              <button
                onClick={() => onNavigate('challenges')}
                className="btn-tactile"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                See Competitions <ChevronRight size={14} />
              </button>
            </div>

            <div className="glass-card interactive-card" style={{ padding: '1.75rem', borderRadius: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34D399' }}>
                  <Users size={19} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>4. Share</h3>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Open-source starter templates, slide archives, peer mentoring, and alumni placement guidance for upcoming batches.
              </p>
              <button
                onClick={() => onNavigate('resources')}
                className="btn-tactile"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
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
              className="btn btn-outline btn-sm btn-tactile"
            >
              Browse All Projects ({projects.length}) <ArrowRight size={14} />
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}>
            {featuredProjects.map((project) => (
              <div
                key={project.id}
                className="glass-card interactive-card"
                style={{
                  padding: '1.75rem',
                  borderRadius: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.85rem', flexWrap: 'wrap' }}>
                    {project.uipathToolsUsed.slice(0, 2).map((tool, idx) => (
                      <span key={idx} className="badge badge-slate" style={{ fontSize: '0.7rem' }}>
                        {tool}
                      </span>
                    ))}
                    <span className="badge badge-green" style={{ fontSize: '0.7rem', marginLeft: 'auto' }}>
                      {project.status}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.45rem', lineHeight: 1.35 }}>
                    {project.title}
                  </h4>

                  <div style={{
                    fontSize: '0.8rem',
                    color: '#FB923C',
                    fontWeight: 600,
                    background: 'rgba(250, 70, 22, 0.08)',
                    border: '1px solid rgba(250, 70, 22, 0.18)',
                    padding: '0.3rem 0.65rem',
                    borderRadius: '6px',
                    display: 'inline-block',
                    marginBottom: '0.85rem',
                    fontVariantNumeric: 'tabular-nums'
                  }}>
                    Impact: {project.roiMetrics}
                  </div>

                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '1.25rem' }}>
                    {project.problemStatement || project.summary}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.95rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {project.authorName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {project.authorBranch || 'Engineering Student'}
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('projects', project.slug)}
                    className="btn btn-secondary btn-sm btn-tactile"
                    style={{ borderRadius: '6px', padding: '0.45rem 0.85rem' }}
                  >
                    View Project <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5B. FEATURED TECHNICAL PUBLICATION */}
      {homepageArticle && (
        <section className="section-divider">
          <div className="container">
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <div className="section-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Newspaper size={13} style={{ color: '#FA4616' }} />
                  <span>COMMUNITY WRITING & RESEARCH</span>
                </div>
                <h2 className="section-title">Featured Technical Publication</h2>
                <p className="section-subtitle">
                  Architectural blueprints, hands-on tutorials, and RPA implementations authored by community leads.
                </p>
              </div>

              <button
                onClick={() => onNavigate('blogs')}
                className="btn btn-outline btn-sm btn-tactile"
              >
                Read All Articles ({articles.length}) <ArrowRight size={14} />
              </button>
            </div>

            <div
              onClick={() => onNavigate('blog_detail', homepageArticle.slug || homepageArticle.id)}
              className="interactive-card"
              style={{
                background: 'rgba(20, 20, 24, 0.65)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: 'pointer',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                boxShadow: '0 16px 36px rgba(0, 0, 0, 0.45)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)'
              }}
            >
              <div style={{ position: 'relative', minHeight: '240px', overflow: 'hidden' }}>
                <img
                  src={homepageArticle.coverImageUrl || homepageArticle.coverImage}
                  alt={homepageArticle.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
                  <span className="badge badge-orange" style={{ fontSize: '0.72rem' }}>
                    {homepageArticle.category}
                  </span>
                </div>
              </div>

              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
                    <span>{new Date(homepageArticle.publishedAt || homepageArticle.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span>•</span>
                    <span>{homepageArticle.readTimeMinutes || 5} min read</span>
                    <span>•</span>
                    <span>{homepageArticle.views || homepageArticle.viewsCount || 0} views</span>
                  </div>

                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.3, marginBottom: '0.75rem' }}>
                    {homepageArticle.title}
                  </h3>

                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                    {homepageArticle.excerpt}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1rem' }}>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                    By <strong style={{ color: '#E5E7EB' }}>{homepageArticle.authorName}</strong> ({homepageArticle.authorRole})
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#FA4616', fontSize: '0.85rem', fontWeight: 600 }}>
                    <span>Read Article</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

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
                {settings.communityStoryHeading || 'Built by Students, Powered by UiPath'}
              </h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                {settings.communityStoryText || 'Founded in 2022 under the department of CSE & IT, the ACE UiPath Community started as a group of 15 students eager to automate routine campus processes. Today, it stands as one of the premier student automation hubs in the region.'}
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
                {settings.communityStoryHighlight || 'Recognized by UiPath Academic Alliance with 450+ students trained and 38 software bots deployed across college administration.'}
              </div>

              <button
                onClick={() => onNavigate('about')}
                className="btn btn-secondary btn-tactile"
              >
                Read Chapter History & Leadership <ArrowRight size={16} />
              </button>
            </div>

            {/* Visual Collage: Community Poster / Real Photos */}
            <div className="interactive-card" style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              overflow: 'hidden',
              padding: '1.25rem'
            }}>
              <img
                src={settings.communityStoryImageUrl || '/ace-campus.jpg'}
                alt="ACE Engineering College Campus, Ghatkesar, Hyderabad"
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '10px',
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
        paddingTop: '5.5rem',
        paddingBottom: '5.5rem',
        textAlign: 'center'
      }}>
        <div className="container">
          <div style={{ maxWidth: '650px', margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.5rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem', letterSpacing: '-0.025em' }}>
              Ready to Explore Automation?
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '2.25rem' }}>
              Whether you are a first-year student writing your first Excel bot or a senior preparing for enterprise certification, our community has a place for you.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <a
                href="https://www.linkedin.com/company/ace-uipath-community/?viewAsMember=true"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg btn-tactile"
              >
                Join the Community <ArrowRight size={18} />
              </a>
              <button
                onClick={() => onNavigate('learn')}
                className="btn btn-outline btn-lg btn-tactile"
              >
                Start Learning Academy
              </button>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .stats-responsive-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1.5rem;
        }
        @media (max-width: 900px) {
          .stats-responsive-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 1rem !important;
          }
        }
        @media (max-width: 480px) {
          .stats-responsive-grid {
            grid-template-columns: 1fr !important;
            gap: 0.875rem !important;
          }
        }
        @media (max-width: 860px) {
          .featured-event-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

