import React, { useState } from 'react';
import { Megaphone, ArrowRight, X } from 'lucide-react';
import { SiteSettings } from '../types';

interface Props {
  settings: SiteSettings;
  onNavigate: (view: string) => void;
}

export const AnnouncementBar: React.FC<Props> = ({ settings, onNavigate }) => {
  const [isDismissed, setIsDismissed] = useState(false);

  const activeAnnouncement = settings.announcements?.find((a) => a.isActive);
  const message = activeAnnouncement ? activeAnnouncement.message : settings.announcementTicker;
  const targetLink = activeAnnouncement?.link || 'activities';

  if (!settings.isAnnouncementActive || !message || isDismissed) return null;

  return (
    <div style={{
      background: '#0D0D0D',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '0.45rem 2.5rem',
      fontSize: '0.8rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      zIndex: 40,
      minHeight: '2rem'
    }}>
      {/* Centered Content Container */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.65rem',
        textAlign: 'center',
        maxWidth: '100%',
        overflow: 'hidden'
      }}>
        {/* Signature UiPath Orange BULLETIN badge */}
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.3rem',
          background: 'rgba(250, 70, 22, 0.15)',
          border: '1px solid rgba(250, 70, 22, 0.35)',
          color: '#FA4616',
          borderRadius: '9999px',
          padding: '0.12rem 0.5rem',
          fontSize: '0.675rem',
          fontWeight: 700,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          flexShrink: 0
        }}>
          <Megaphone size={11} /> BULLETIN
        </span>

        {/* Crisp Neutral / Off-White Body Text */}
        <span style={{
          color: '#E5E7EB',
          fontWeight: 450,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontSize: '0.8rem'
        }}>
          {message}
        </span>

        {/* Signature UiPath Orange Link */}
        <button 
          onClick={() => onNavigate(targetLink)}
          style={{
            background: 'none',
            border: 'none',
            color: '#FA4616',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.2rem',
            fontSize: '0.785rem',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '0.1rem 0.3rem',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            transition: 'opacity 0.15s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.8'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
        >
          View Details <ArrowRight size={11} />
        </button>
      </div>

      {/* Far Right Subtle Dismiss Icon with Clean Hover Fade */}
      <button
        onClick={() => setIsDismissed(true)}
        aria-label="Dismiss announcement"
        style={{
          position: 'absolute',
          right: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          color: '#9CA3AF',
          cursor: 'pointer',
          padding: '0.35rem',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color 0.15s ease, background 0.15s ease',
          opacity: 0.8
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#FFFFFF';
          e.currentTarget.style.opacity = '1';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#9CA3AF';
          e.currentTarget.style.opacity = '0.8';
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
};
