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
        { id: 's1', title: 'Students Trained', value: '950+', description: 'Workshops across CSE, IT, ECE & allied branches', visible: true, order: 1 },
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
      {/* 1. HERO SECTION & INTEGRATED STATS GRID */}
      <section style={{
        paddingTop: '5rem',
        paddingBottom: '5.5rem',
        background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(250, 70, 22, 0.18), transparent 70%)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'relative'
      }}>
        <div className="container" style={{ maxWidth: '1240px' }}>
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

            {/* Primary & Secondary Action Buttons (Equal h-11, text-sm font-medium, rounded-xl) */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Primary CTA */}
              <button
                onClick={() => onNavigate(primaryCtaLink)}
                style={{
                  height: '2.75rem',
                  paddingLeft: '1.5rem',
                  paddingRight: '1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  borderRadius: '0.75rem',
                  background: '#FA4616',
                  color: '#FFFFFF',
                  border: '1px solid transparent',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  transition: 'all 200ms ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#ff5722';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(250, 70, 22, 0.4)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#FA4616';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>{primaryCtaText}</span> <span style={{ fontSize: '1rem', lineHeight: 1 }}>&rarr;</span>
              </button>

              {/* Secondary CTA */}
              <button
                onClick={() => onNavigate(secondaryCtaLink)}
                style={{
                  height: '2.75rem',
                  paddingLeft: '1.5rem',
                  paddingRight: '1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  borderRadius: '0.75rem',
                  background: 'rgba(23, 23, 23, 0.60)',
                  border: '1px solid rgba(64, 64, 64, 0.80)',
                  color: '#E5E5E5',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 200ms ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#262626';
                  e.currentTarget.style.borderColor = '#525252';
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(23, 23, 23, 0.60)';
                  e.currentTarget.style.borderColor = 'rgba(64, 64, 64, 0.80)';
                  e.currentTarget.style.color = '#E5E5E5';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {secondaryCtaText}
              </button>
            </div>
          </div>

          {/* Stats Grid: responsive 4-column layout (grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto px-4 mt-16) */}
          <div
            className="stats-responsive-grid"
            style={{
              maxWidth: '72rem',
              marginLeft: 'auto',
              marginRight: 'auto',
              paddingLeft: '1rem',
              paddingRight: '1rem',
              marginTop: '4rem'
            }}
          >
            {statisticsList.map((stat) => (
              <div
                key={stat.id}
                className="stat-card"
                style={{
                  background: 'rgba(23, 23, 23, 0.40)',
                  border: '1px solid rgba(38, 38, 38, 0.80)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 300ms ease',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#404040';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(38, 38, 38, 0.80)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div>
                  {/* Numbers: text-3xl md:text-4xl font-extrabold text-[#FA4616] tracking-tight */}
                  <div
                    style={{
                      fontSize: 'clamp(1.875rem, 3.2vw, 2.25rem)',
                      fontWeight: 800,
                      color: '#FA4616',
                      letterSpacing: '-0.025em',
                      lineHeight: 1.1
                    }}
                  >
                    {stat.value}
                  </div>
                  {/* Label: text-sm font-semibold text-white mt-2 */}
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    marginTop: '0.5rem',
                    letterSpacing: '-0.01em'
                  }}>
                    {stat.title}
                  </div>
                </div>
                {/* Description: text-xs text-neutral-400 mt-1 leading-relaxed line-clamp-2 */}
                <div style={{
                  fontSize: '0.75rem',
                  color: '#A3A3A3',
                  marginTop: '0.25rem',
                  lineHeight: 1.625,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
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

            {/* Unified Featured Card Wrapper with Soft Ambient Orange Backlight */}
            <div style={{ position: 'relative' }}>
              {/* Soft Ambient Orange Backlight */}
              <div style={{
                position: 'absolute',
                inset: '-12px',
                background: 'radial-gradient(ellipse at 15% 45%, rgba(250, 70, 22, 0.12) 0%, rgba(250, 70, 22, 0.03) 50%, transparent 75%)',
                filter: 'blur(32px)',
                borderRadius: '1.5rem',
                zIndex: 0,
                pointerEvents: 'none'
              }} />

              {/* Main Card Container with Subtle Dark Glassmorphism */}
              <div
                className="featured-event-grid"
                style={{
                  position: 'relative',
                  zIndex: 1,
                  background: 'rgba(23, 23, 23, 0.40)', // bg-neutral-900/40
                  border: '1px solid rgba(255, 255, 255, 0.08)', // border-neutral-800/80
                  borderRadius: '1rem', // rounded-2xl
                  padding: 'clamp(1.5rem, 3.5vw, 2.25rem)', // p-6 md:p-8
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
                  display: 'grid',
                  gridTemplateColumns: featuredActivity.bannerImage ? 'minmax(280px, 420px) minmax(0, 1fr)' : '1fr',
                  gap: 'clamp(1.5rem, 3vw, 2.5rem)',
                  alignItems: 'center'
                }}
              >
                {/* Event Image / Poster with Rounded Border & Aspect Ratio Wrapper */}
                {featuredActivity.bannerImage && (
                  <div style={{
                    borderRadius: '0.75rem', // rounded-xl
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.10)', // border-white/10
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)', // shadow-2xl
                    background: '#141414',
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '16 / 10',
                    maxHeight: '400px',
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
                        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
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
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '0.25rem 0.65rem',
                        borderRadius: '9999px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        background: 'rgba(250, 70, 22, 0.10)',
                        color: '#FB923C', // text-orange-400
                        border: '1px solid rgba(250, 70, 22, 0.20)'
                      }}>
                        {featuredActivity.category || 'COMMUNITY MEETUP'}
                      </span>

                      {/* Event Type Pill */}
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '0.25rem 0.65rem',
                        borderRadius: '9999px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        background: '#262626', // bg-neutral-800
                        color: '#D4D4D4', // text-neutral-300
                        border: '1px solid #404040' // border-neutral-700
                      }}>
                        {featuredActivity.eventType || 'HYBRID'}
                      </span>

                      {/* Status Pill with Pulsing Green Micro-Dot for Upcoming */}
                      <span style={{
                        fontSize: '0.75rem',
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
                        border: featuredActivity.status === 'Upcoming' ? '1px solid rgba(16, 185, 129, 0.20)' : '1px solid rgba(255, 255, 255, 0.10)'
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
                      lineHeight: 1.2,
                      letterSpacing: '-0.02em',
                      marginBottom: '0.75rem'
                    }}>
                      {featuredActivity.title}
                    </h3>

                    <p style={{
                      fontSize: '0.95rem',
                      color: '#D1D5DB', // text-neutral-300
                      lineHeight: 1.6,
                      marginBottom: '1.5rem'
                    }}>
                      {featuredActivity.summary}
                    </p>

                    {/* Event Meta Grid (Date, Time, Venue) - Mini Dashboard */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))',
                      gap: '0.75rem',
                      padding: '1rem 1.15rem',
                      borderRadius: '0.75rem', // rounded-xl
                      background: 'rgba(10, 10, 10, 0.60)', // bg-neutral-950/60
                      border: '1px solid rgba(255, 255, 255, 0.08)', // border-neutral-800/60
                      marginBottom: '1.75rem'
                    }}>
                      {/* DATE */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <Calendar size={18} style={{ color: '#FA4616', flexShrink: 0 }} />
                        <div>
                          <div style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            color: '#9CA3AF', // text-neutral-400
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

                  {/* Actions (Elevated View Details + Add to Calendar Ghost Button) */}
                  <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <button
                      onClick={() => onNavigate('activities', featuredActivity.slug)}
                      style={{
                        background: '#FA4616',
                        color: '#FFFFFF',
                        fontWeight: 500,
                        fontSize: '0.925rem',
                        padding: '0.65rem 1.5rem',
                        borderRadius: '8px',
                        border: '1px solid transparent',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 4px 14px rgba(250, 70, 22, 0.25)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#FF5722';
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(250, 70, 22, 0.4)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#FA4616';
                        e.currentTarget.style.boxShadow = '0 4px 14px rgba(250, 70, 22, 0.25)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      View Session Details <ArrowRight size={16} />
                    </button>

                    <button
                      onClick={() => {
                        const title = encodeURIComponent(featuredActivity.title);
                        const details = encodeURIComponent(featuredActivity.summary || 'ACE UiPath Community Session');
                        const location = encodeURIComponent(featuredActivity.venue || 'ACE Engineering College, Hyderabad');
                        window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`, '_blank', 'noopener,noreferrer');
                      }}
                      style={{
                        background: 'rgba(23, 23, 23, 0.60)',
                        border: '1px solid #404040',
                        borderRadius: '8px',
                        padding: '0.65rem 1rem',
                        fontSize: '0.875rem',
                        color: '#D1D5DB',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#262626';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                        e.currentTarget.style.color = '#FFFFFF';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(23, 23, 23, 0.60)';
                        e.currentTarget.style.borderColor = '#404040';
                        e.currentTarget.style.color = '#D1D5DB';
                        e.currentTarget.style.transform = 'translateY(0)';
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
                        className="btn btn-secondary btn-sm"
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
                {settings.communityStoryHighlight || 'Over 950 students trained and 140+ functional automations built for campus and enterprise use cases.'}
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
