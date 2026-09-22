import React from 'react';
import { Play, ExternalLink, Video } from 'lucide-react';

interface Props {
  youtubeUrl?: string;
  videoUrl?: string;
  videoDuration?: string;
  moduleTitle: string;
  className?: string;
}

function extractYouTubeId(url?: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  const match = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  return match && match[1] ? match[1] : null;
}

export const YouTubeVideoCard: React.FC<Props> = ({
  youtubeUrl,
  videoUrl,
  videoDuration,
  moduleTitle,
  className = ''
}) => {
  const finalUrl = (youtubeUrl || videoUrl || '').trim();
  if (!finalUrl) {
    return null;
  }

  const ytId = extractYouTubeId(finalUrl);
  const thumbnailUrl = ytId
    ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
    : null;

  return (
    <div
      className={`youtube-video-card-section ${className}`}
      style={{
        marginBottom: '2.5rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
        <Video size={18} style={{ color: 'var(--uipath-orange, #FA4616)' }} />
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-primary, #FFFFFF)' }}>
          Video Tutorial
        </h3>
      </div>

      <a
        href={youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        title={`Watch "${moduleTitle}" on YouTube (opens in new tab)`}
        style={{
          display: 'block',
          position: 'relative',
          width: '100%',
          maxWidth: '820px',
          height: '420px',
          borderRadius: 'var(--radius-lg, 14px)',
          overflow: 'hidden',
          textDecoration: 'none',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.45)',
          background: '#0B0D13',
          cursor: 'pointer',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.borderColor = 'var(--uipath-orange, #FA4616)';
          e.currentTarget.style.boxShadow = '0 16px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(250, 70, 22, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
          e.currentTarget.style.boxShadow = '0 12px 36px rgba(0, 0, 0, 0.45)';
        }}
      >
        {/* Background Image / Thumbnail */}
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={moduleTitle}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.75)'
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle at center, rgba(250, 70, 22, 0.15) 0%, #0B0D13 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          />
        )}

        {/* Dark Gradient Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.75) 100%)'
          }}
        />

        {/* Centered Large Play Button Overlay */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '76px',
            height: '76px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FA4616 0%, #D83B0E 100%)',
            boxShadow: '0 8px 28px rgba(250, 70, 22, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            transition: 'transform 0.2s ease'
          }}
          className="video-play-btn"
        >
          <Play size={32} style={{ marginLeft: '4px', fill: '#FFFFFF' }} />
        </div>

        {/* Bottom Bar Info */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            background: 'rgba(11, 13, 19, 0.85)',
            backdropFilter: 'blur(8px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--uipath-orange, #FA4616)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
              Watch on YouTube
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {moduleTitle}
            </div>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8rem',
              color: 'var(--uipath-orange, #FA4616)',
              fontWeight: 600,
              flexShrink: 0
            }}
          >
            <span>Open Video</span>
            <ExternalLink size={14} />
          </div>
        </div>
      </a>
    </div>
  );
};
