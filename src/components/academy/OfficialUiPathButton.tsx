import React from 'react';
import { ExternalLink, GraduationCap } from 'lucide-react';

interface Props {
  url?: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline' | 'glow';
  className?: string;
  style?: React.CSSProperties;
}

export const OfficialUiPathButton: React.FC<Props> = ({
  url,
  label = 'Learn on UiPath Academy',
  size = 'md',
  variant = 'glow',
  className = '',
  style = {}
}) => {
  if (!url) return null;

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: {
      padding: '0.45rem 0.85rem',
      fontSize: '0.78rem',
      gap: '0.4rem',
      borderRadius: 'var(--radius-sm, 6px)'
    },
    md: {
      padding: '0.65rem 1.15rem',
      fontSize: '0.875rem',
      gap: '0.5rem',
      borderRadius: 'var(--radius-md, 8px)'
    },
    lg: {
      padding: '0.85rem 1.5rem',
      fontSize: '1rem',
      gap: '0.65rem',
      borderRadius: 'var(--radius-lg, 10px)'
    }
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    glow: {
      background: 'linear-gradient(135deg, #FA4616 0%, #D83B0E 100%)',
      color: '#FFFFFF',
      border: '1px solid rgba(255, 255, 255, 0.25)',
      boxShadow: '0 4px 16px rgba(250, 70, 22, 0.35)',
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
      border: '1px solid rgba(250, 70, 22, 0.3)',
      fontWeight: 600
    },
    outline: {
      background: 'transparent',
      color: 'var(--text-primary, #FFFFFF)',
      border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.15))',
      fontWeight: 500
    }
  };

  const iconSizes = {
    sm: 13,
    md: 15,
    lg: 18
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`official-uipath-btn ${className}`}
      title="Opens official UiPath learning material in a new tab"
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
