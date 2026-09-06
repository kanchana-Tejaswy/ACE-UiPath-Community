import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowLeft, 
  Download, 
  Video, 
  FileText, 
  Github, 
  Award, 
  Share2, 
  CheckCircle2, 
  Users, 
  ExternalLink,
  BookOpen,
  Image as ImageIcon,
  Check
} from 'lucide-react';
import { Activity, User } from '../types';

interface Props {
  slug: string;
  activities: Activity[];
  currentUser: User;
  onNavigate: (view: string, detailId?: string) => void;
}

export const ActivityDetailPage: React.FC<Props> = ({
  slug,
  activities,
  currentUser,
  onNavigate
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number | null>(null);

  const activity = activities.find((a) => a.slug === slug || a.id === slug);

  if (!activity) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <div className="glass-panel" style={{ padding: '3rem 2rem' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--uipath-orange-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--uipath-orange)', margin: '0 auto 1.5rem auto' }}>
            <BookOpen size={32} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>Activity Record Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
            The requested activity <code style={{ color: '#FED7AA' }}>"{slug}"</code> does not exist or may have been archived under a different slug in the institutional knowledge base.
          </p>
          <button onClick={() => onNavigate('activities')} className="btn btn-primary">
            <ArrowLeft size={16} /> Return to Activity Timeline
          </button>
        </div>
      </div>
    );
  }

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div style={{ paddingBottom: '6rem' }}>
      {/* Back Button Bar */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', padding: '1rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => onNavigate('activities')}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <ArrowLeft size={16} /> Back to Activity Timeline
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={handleCopyLink}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              {copiedLink ? <Check size={14} style={{ color: '#10B981' }} /> : <Share2 size={14} />}
              <span>{copiedLink ? 'Link Copied' : 'Share Archive'}</span>
            </button>

            {currentUser.role === 'ADMIN' && (
              <button
                onClick={() => onNavigate('admin')}
                className="btn btn-primary btn-sm"
              >
                Edit in Admin CMS
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hero Header Section */}
      <section style={{
        position: 'relative',
        paddingTop: '3.5rem',
        paddingBottom: '3.5rem',
        background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div className="container">
          <div style={{ maxWidth: '960px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <span className="badge badge-orange">{activity.category}</span>
              <span className="badge badge-neutral">{activity.eventType} Mode</span>
              <span className={`badge ${activity.status === 'Upcoming' ? 'badge-green' : 'badge-slate'}`}>
                {activity.status}
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              lineHeight: 1.2,
              marginBottom: '1.5rem',
              fontWeight: 800
            }}>
              {activity.title}
            </h1>

            <p style={{
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: '2rem'
            }}>
              {activity.summary}
            </p>

            {/* Key Metadata Matrix */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              padding: '1.25rem',
              background: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--uipath-orange-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--uipath-orange)' }}>
                  <Calendar size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Session Date</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{activity.date}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--uipath-orange-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--uipath-orange)' }}>
                  <Clock size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Session Time</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{activity.timeStart} - {activity.timeEnd}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--uipath-orange-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--uipath-orange)' }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Venue / Stream</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{activity.venue}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout (2 Columns: Body & Artifacts Sidebar) */}
      <div className="container" style={{ marginTop: '3.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 340px',
          gap: '3rem'
        }} className="detail-layout">
          {/* Main Body */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {/* 1. OBJECTIVES & UIPATH TOPICS */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={18} style={{ color: 'var(--uipath-orange)' }} /> Session Objectives
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' }}>
                {activity.objectives.map((obj, oIdx) => (
                  <div key={oIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                    <CheckCircle2 size={18} style={{ color: '#10B981', flexShrink: 0, marginTop: '0.15rem' }} />
                    <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{obj}</span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.65rem' }}>
                  UiPath Technologies Covered:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {activity.uipathTopicsCovered.map((topic, tIdx) => (
                    <span key={tIdx} className="badge badge-orange">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. WHAT HAPPENED (Detailed Description) */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Technical Deep-Dive & Summary</h3>
              <div className="markdown-body" style={{ color: 'var(--text-secondary)', fontSize: '0.975rem' }}>
                <div dangerouslySetInnerHTML={{ __html: activity.fullDescriptionMd.replace(/### (.*?)\n/g, '<h4 style="color:#FFF;margin:1rem 0 0.5rem 0;font-size:1.1rem">$1</h4>').replace(/\n/g, '<br/>') }} />
              </div>
            </div>

            {/* 3. MINUTE-BY-MINUTE AGENDA */}
            {activity.agenda && activity.agenda.length > 0 && (
              <div className="glass-card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={18} style={{ color: 'var(--uipath-orange)' }} /> Session Agenda
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {activity.agenda.map((item, aIdx) => (
                    <div
                      key={aIdx}
                      style={{
                        display: 'flex',
                        gap: '1.25rem',
                        padding: '1rem',
                        background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-md)',
                        borderLeft: '3px solid var(--uipath-orange)'
                      }}
                    >
                      <div style={{ minWidth: '130px', fontSize: '0.825rem', fontWeight: 600, color: 'var(--uipath-orange)' }}>
                        {item.time}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                          {item.title}
                        </div>
                        {item.description && (
                          <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                            {item.description}
                          </div>
                        )}
                        {item.speaker && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            Speaker: <strong>{item.speaker}</strong>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. SPEAKERS & MENTORS */}
            {activity.speakers && activity.speakers.length > 0 && (
              <div className="glass-card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={18} style={{ color: 'var(--uipath-orange)' }} /> Speakers & Session Mentors
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                  {activity.speakers.map((spk) => (
                    <div
                      key={spk.id}
                      style={{
                        padding: '1.25rem',
                        background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        gap: '1rem'
                      }}
                    >
                      <img
                        src={spk.avatarUrl}
                        alt={spk.name}
                        style={{ width: '56px', height: '56px', borderRadius: '12px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                          {spk.name}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--uipath-orange)', marginBottom: '0.25rem' }}>
                          {spk.roleTitle}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                          {spk.organization}
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                          {spk.bio}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. PHOTO GALLERY & MOMENTS */}
            {activity.galleryImages && activity.galleryImages.length > 0 && (
              <div className="glass-card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ImageIcon size={18} style={{ color: 'var(--uipath-orange)' }} /> Activity Photo Gallery
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  {activity.galleryImages.map((imgUrl, iIdx) => (
                    <div
                      key={iIdx}
                      onClick={() => setActiveGalleryIndex(iIdx)}
                      style={{
                        height: '150px',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: '1px solid var(--border-subtle)',
                        transition: 'all var(--transition-smooth)'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--uipath-orange)')}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                    >
                      <img src={imgUrl} alt={`Moment ${iIdx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. ACHIEVEMENTS & RECOGNITIONS */}
            {activity.achievements && activity.achievements.length > 0 && (
              <div className="glass-card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={18} style={{ color: '#F59E0B' }} /> Student Recognition & Awards
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {activity.achievements.map((ach) => (
                    <div
                      key={ach.id}
                      style={{
                        padding: '1.25rem',
                        background: 'rgba(245, 158, 11, 0.08)',
                        border: '1px solid rgba(245, 158, 11, 0.25)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <span className="badge badge-orange">{ach.badgeType}</span>
                          <span style={{ fontWeight: 700, fontSize: '1rem', color: '#FED7AA' }}>{ach.title}</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          Awarded to: <strong style={{ color: '#FFF' }}>{ach.recipientName}</strong> {ach.rollNumber && `(${ach.rollNumber})`}
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                          {ach.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. CONNECTED COMMUNITY KNOWLEDGE GRAPH */}
            <div className="glass-card" style={{ padding: '2rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                <BookOpen size={18} style={{ color: 'var(--uipath-orange)' }} /> Interlinked Community Knowledge Graph
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                Explore connected learning modules, student bots built using concepts from this activity, and resources:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div
                  onClick={() => onNavigate('learn')}
                  style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}
                >
                  <span className="badge badge-orange" style={{ marginBottom: '0.4rem', fontSize: '0.65rem' }}>Learning Academy</span>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#FFF' }}>Track 3: REFramework Architect</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>State machines & queues</div>
                </div>

                <div
                  onClick={() => onNavigate('projects')}
                  style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}
                >
                  <span className="badge badge-neutral" style={{ marginBottom: '0.4rem', fontSize: '0.65rem' }}>Student Automations</span>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#FFF' }}>Grade Extractor Bot</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Saves 45 hrs/semester</div>
                </div>

                <div
                  onClick={() => onNavigate('resources')}
                  style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}
                >
                  <span className="badge badge-slate" style={{ marginBottom: '0.4rem', fontSize: '0.65rem' }}>Resources Vault</span>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#FFF' }}>REFramework Production Starter</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Starter template ZIP</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: Downloadable Artifacts Vault */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-card" style={{ padding: '1.75rem', position: 'sticky', top: '5.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Download size={18} style={{ color: 'var(--uipath-orange)' }} /> Download Artifacts
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {!activity.workflowPackageUrl && !activity.slidesUrl && !activity.recordingUrl && !activity.githubUrl && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, padding: '0.5rem 0' }}>
                    No downloadable artifacts or video links were published for this session.
                  </div>
                )}

                {activity.workflowPackageUrl && (
                  <a
                    href={activity.workflowPackageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'flex-start' }}
                  >
                    <Download size={16} />
                    <span>Download .XAML / Package</span>
                  </a>
                )}

                {activity.slidesUrl && (
                  <a
                    href={activity.slidesUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary"
                    style={{ width: '100%', justifyContent: 'flex-start' }}
                  >
                    <FileText size={16} />
                    <span>Session Presentation Deck</span>
                  </a>
                )}

                {activity.recordingUrl && (
                  <a
                    href={activity.recordingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary"
                    style={{ width: '100%', justifyContent: 'flex-start' }}
                  >
                    <Video size={16} />
                    <span>Watch Video Recording</span>
                  </a>
                )}

                {activity.githubUrl && (
                  <a
                    href={activity.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary"
                    style={{ width: '100%', justifyContent: 'flex-start' }}
                  >
                    <Github size={16} />
                    <span>GitHub Code Repository</span>
                  </a>
                )}
              </div>

              <div style={{
                marginTop: '1.75rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '0.775rem',
                color: 'var(--text-muted)',
                lineHeight: 1.5
              }}>
                Institutional Memory Record ID:<br />
                <code style={{ color: '#FED7AA' }}>{activity.id}</code>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .detail-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
