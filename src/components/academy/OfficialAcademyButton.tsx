import React from 'react';
import { ExternalLink, GraduationCap } from 'lucide-react';

interface Props {
  url?: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'glow';
  className?: string;
  style?: React.CSSProperties;
}

export const OfficialAcademyButton: React.FC<Props> = ({
  url,
  label = 'Complete this course on UiPath Academy ↗',
  size = 'md',
  variant = 'glow',
  className = '',
  style = {}
}) => {
  if (!url || !url.trim()) return null;

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: {
      padding: '0.45rem 0.95rem',
      fontSize: '0.8rem',
      gap: '0.45rem',
      borderRadius: 'var(--radius-md, 8px)'
    },
    md: {
      padding: '0.7rem 1.35rem',
      fontSize: '0.9rem',
      gap: '0.55rem',
      borderRadius: 'var(--radius-md, 10px)'
    },
    lg: {
      padding: '0.9rem 1.75rem',
      fontSize: '1rem',
      gap: '0.65rem',
      borderRadius: 'var(--radius-lg, 12px)'
    }
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    glow: {
      background: 'linear-gradient(135deg, #FA4616 0%, #D83B0E 100%)',
      color: '#FFFFFF',
      border: '1px solid rgba(255, 255, 255, 0.25)',
      boxShadow: '0 4px 18px rgba(250, 70, 22, 0.35)',
      fontWeight: 600
    },
    primary: {
      background: 'var(--uipath-orange, #FA4616)',
      color: '#FFFFFF',
      border: 'none',
      fontWeight: 600
    },
    secondary: {
      background: 'rgba(250, 70, 22, 0.12)',
      color: 'var(--uipath-orange, #FA4616)',
      border: '1px solid rgba(250, 70, 22, 0.35)',
      fontWeight: 600
    }
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`official-academy-btn ${className}`}
      title="Opens the official UiPath Academy course in a new browser tab"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap',
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style
      }}
    >
      <GraduationCap size={iconSizes[size]} style={{ flexShrink: 0 }} />
      <span>{label}</span>
      <ExternalLink size={iconSizes[size] - 2} style={{ opacity: 0.85, flexShrink: 0 }} />
    </a>
  );
};
