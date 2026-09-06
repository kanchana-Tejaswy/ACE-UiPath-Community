import React from 'react';
import { Megaphone, ArrowRight } from 'lucide-react';
import { SiteSettings } from '../types';

interface Props {
  settings: SiteSettings;
  onNavigate: (view: string) => void;
}

export const AnnouncementBar: React.FC<Props> = ({ settings, onNavigate }) => {
  const activeAnnouncement = settings.announcements?.find((a) => a.isActive);
  const message = activeAnnouncement ? activeAnnouncement.message : settings.announcementTicker;
  const targetLink = activeAnnouncement?.link || 'activities';

  if (!settings.isAnnouncementActive || !message) return null;

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '0.45rem 1rem',
      fontSize: '0.8rem',
      color: '#FED7AA',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      position: 'relative',
      zIndex: 40
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        <span className="badge badge-orange" style={{ padding: '0.15rem 0.45rem', fontSize: '0.65rem' }}>
          <Megaphone size={11} /> BULLETIN
        </span>
        <span style={{ fontWeight: 500 }}>{message}</span>
      </div>
      <button 
        onClick={() => onNavigate(targetLink)}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--uipath-orange)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.2rem',
          fontSize: '0.775rem',
          fontWeight: 600,
          cursor: 'pointer',
          padding: '0.15rem 0.4rem',
          whiteSpace: 'nowrap'
        }}
      >
        View Details <ArrowRight size={11} />
      </button>
    </div>
  );
};
