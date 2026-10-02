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
  Check,
  Linkedin,
  Edit3,
  Trash2,
  Youtube
} from 'lucide-react';
import { Activity, User } from '../types';
import { hasPermission } from '../lib/security';
import { EventEditorModal } from '../components/EventEditorModal';

interface Props {
  slug: string;
  activities: Activity[];
  currentUser: User;
  featuredActivityId?: string;
  onSaveActivity?: (act: Activity) => Promise<any> | void;
  onDeleteActivity?: (id: string) => Promise<any> | void;
  onUpdateSettings?: (settings: any) => Promise<any> | void;
  onNavigate: (view: string, detailId?: string) => void;
}

function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|live\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube-nocookie.com/embed/${match[2]}` : null;
}

export const ActivityDetailPage: React.FC<Props> = ({
  slug,
  activities,
  currentUser,
  featuredActivityId,
  onSaveActivity,
  onDeleteActivity,
  onUpdateSettings,
  onNavigate
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorInitialTab, setEditorInitialTab] = useState<'overview' | 'media' | 'speakers' | 'agenda' | 'vault'>('overview');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const isEditor = Boolean(currentUser && hasPermission(currentUser.role, 'CORE_TEAM'));

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

  const handleDeleteCurrentActivity = async () => {
    if (window.confirm(`Are you sure you want to permanently delete "${activity.title}"? This cannot be undone.`)) {
      if (onDeleteActivity) {
        await onDeleteActivity(activity.id);
        showToast('Event deleted successfully.');
        setTimeout(() => {
          onNavigate('activities');
        }, 600);
      }
    }
  };

  const youtubeEmbedUrl = getYouTubeEmbedUrl(activity.recordingUrl);

  const knowledgeLinks = (activity.knowledgeGraphLinks && activity.knowledgeGraphLinks.length > 0)
    ? activity.knowledgeGraphLinks
    : [
        { id: 'kg_1', category: 'Learning Academy', title: 'Track 3: REFramework Architect', subtitle: 'State machines & queues', targetView: 'learn' },
        { id: 'kg_2', category: 'Student Automations', title: 'Grade Extractor Bot', subtitle: 'Saves 45 hrs/semester', targetView: 'projects' },
        { id: 'kg_3', category: 'Resources Vault', title: 'REFramework Production Starter', subtitle: 'Starter template ZIP', targetView: 'resources' }
      ];

  return (
    <div style={{ paddingBottom: '6rem', position: 'relative' }}>
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 9999,
          background: 'rgba(26, 32, 44, 0.95)',
          border: '1px solid var(--uipath-orange)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          color: '#FFF',
          padding: '0.85rem 1.4rem',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          fontWeight: 600,
          fontSize: '0.9rem',
          animation: 'fadeInUp 0.25s ease-out'
        }}>
          <Check size={16} style={{ color: '#10B981' }} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Back Button Bar & Admin Controls */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', padding: '1rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <button
            onClick={() => onNavigate('activities')}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <ArrowLeft size={16} /> Back to Activity Timeline
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleCopyLink}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              {copiedLink ? <Check size={14} style={{ color: '#10B981' }} /> : <Share2 size={14} />}
              <span>{copiedLink ? 'Link Copied' : 'Share Archive'}</span>
            </button>

            {isEditor && (
              <>
                <button
                  onClick={() => {
                    setEditorInitialTab('overview');
                    setIsEditorOpen(true);
                  }}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'linear-gradient(135deg, var(--uipath-orange) 0%, #EA580C 100%)', boxShadow: '0 2px 10px rgba(250, 70, 22, 0.3)' }}
                >
                  <Edit3 size={14} />
                  <span>Edit This Event</span>
                </button>

                <button
                  onClick={handleDeleteCurrentActivity}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                  title="Delete this event"
                >
                  <Trash2 size={14} />
                </button>
              </>
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
              {activity.recordingUrl && (
                <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.3)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Youtube size={12} /> Recording Available
                </span>
              )}
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

              {(activity.capacity || activity.targetAudience) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--uipath-orange-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--uipath-orange)' }}>
                    <Users size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Capacity & Audience</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                      {activity.capacity || ''}{activity.capacity && activity.targetAudience ? ' • ' : ''}{activity.targetAudience || ''}
                    </div>
                  </div>
                </div>
              )}
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
            
            {/* EMBEDDED YOUTUBE RECORDING / LIVE STREAM (If provided) */}
            {youtubeEmbedUrl && (
              <div className="glass-card" style={{ padding: '1.75rem', background: 'rgba(239, 68, 68, 0.03)', borderColor: 'rgba(239, 68, 68, 0.25)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#FFF', margin: 0 }}>
                    <Youtube size={22} style={{ color: '#EF4444' }} />
                    <span>Session Video Recording & Live Broadcast</span>
                  </h3>
                  <a
                    href={activity.recordingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                  >
                    <span>Open on YouTube</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px', background: '#000', border: '1px solid var(--border-subtle)', boxShadow: '0 12px 36px rgba(0,0,0,0.5)' }}>
                  <iframe
                    src={youtubeEmbedUrl}
                    title={activity.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                  />
                </div>
              </div>
            )}

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
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                          <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                            {spk.name}
                          </div>
                          {spk.linkedinUrl && (
                            <a
                              href={spk.linkedinUrl}
                              target="_blank"
                              rel="noreferrer"
                              style={{ color: '#0A66C2', display: 'inline-flex', alignItems: 'center', padding: '0.2rem' }}
                              title="LinkedIn Profile"
                            >
                              <Linkedin size={16} />
                            </a>
                          )}
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', margin: 0 }}>
                  <BookOpen size={18} style={{ color: 'var(--uipath-orange)' }} /> Interlinked Community Knowledge Graph
                </h3>
                {isEditor && (
                  <button
                    onClick={() => {
                      setEditorInitialTab('agenda');
                      setIsEditorOpen(true);
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', borderColor: 'rgba(250, 70, 22, 0.4)', color: 'var(--uipath-orange)' }}
                  >
                    <Edit3 size={13} />
                    <span>Edit Knowledge Graph</span>
                  </button>
                )}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                Explore connected learning modules, student bots built using concepts from this activity, and resources:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                {knowledgeLinks.map((kg, i) => (
                  <div
                    key={kg.id || i}
                    onClick={() => {
                      if (kg.targetView) {
                        onNavigate(kg.targetView, kg.targetIdOrUrl);
                      }
                    }}
                    className="glass-card hover-glow"
                    style={{
                      padding: '1.15rem',
                      background: 'var(--bg-tertiary)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <span className={`badge ${
                        kg.category.toLowerCase().includes('academy') || kg.category.toLowerCase().includes('learn')
                          ? 'badge-orange'
                          : kg.category.toLowerCase().includes('automation') || kg.category.toLowerCase().includes('project')
                          ? 'badge-neutral'
                          : 'badge-slate'
                      }`} style={{ marginBottom: '0.5rem', fontSize: '0.675rem' }}>
                        {kg.category}
                      </span>
                      <div style={{ fontWeight: 600, fontSize: '0.925rem', color: '#FFF', lineHeight: 1.3 }}>
                        {kg.title}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>{kg.subtitle}</span>
                      <ExternalLink size={12} style={{ opacity: 0.6 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar: Registration & Downloadable Artifacts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* 1. Registration / Virtual Meeting / Live Stream Card */}
            {(activity.registrationUrl || activity.meetingUrl || activity.recordingUrl || activity.status === 'Upcoming') && (
              <div className="glass-card" style={{ padding: '1.75rem', background: 'rgba(250, 70, 22, 0.04)', borderColor: 'rgba(250, 70, 22, 0.25)' }}>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#FFF' }}>
                  <ExternalLink size={18} style={{ color: '#FA4616' }} /> Session Participation
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                  {activity.status === 'Upcoming' ? 'Register your seat or connect to the virtual stream for this session.' : 'Direct access links for this community session.'}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {activity.registrationUrl && (
                    <a
                      href={activity.registrationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      <ExternalLink size={16} />
                      <span>Register / RSVP for Event</span>
                    </a>
                  )}

                  {activity.meetingUrl && (
                    <a
                      href={activity.meetingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary"
                      style={{ width: '100%', justifyContent: 'center', borderColor: 'rgba(250, 70, 22, 0.3)' }}
                    >
                      <Video size={16} style={{ color: '#FA4616' }} />
                      <span>Join Virtual Meeting</span>
                    </a>
                  )}

                  {activity.recordingUrl && (
                    <a
                      href={activity.recordingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary"
                      style={{ width: '100%', justifyContent: 'center', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#EF4444', background: 'rgba(239, 68, 68, 0.06)' }}
                    >
                      <Youtube size={16} />
                      <span>Watch Live / Recording</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* 2. Downloadable Artifacts Vault */}
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

      {/* In-Place Event Editor Modal */}
      {isEditor && (
        <EventEditorModal
          isOpen={isEditorOpen}
          activity={activity}
          isFeaturedOnHome={activity ? activity.id === featuredActivityId : false}
          initialTab={editorInitialTab}
          onClose={() => setIsEditorOpen(false)}
          onSave={async (savedAct: Activity, makeFeatured: boolean) => {
            if (onSaveActivity) {
              await onSaveActivity(savedAct);
            }
            if (onUpdateSettings) {
              if (makeFeatured) {
                await onUpdateSettings({ featuredActivityId: savedAct.id });
              } else if (featuredActivityId === savedAct.id && !makeFeatured) {
                await onUpdateSettings({ featuredActivityId: '' });
              }
            }
            setIsEditorOpen(false);
            showToast('Event updated successfully!');
            if (savedAct.slug && savedAct.slug !== slug) {
              onNavigate('activity_detail', savedAct.slug);
            }
          }}
        />
      )}

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
