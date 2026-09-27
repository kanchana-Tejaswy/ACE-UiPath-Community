import React from 'react';
import { Clock, FileCode, ChevronRight, Video } from 'lucide-react';
import { LearningModule } from '../../types';

interface Props {
  modules: LearningModule[];
  onSelectModule: (module: LearningModule) => void;
  className?: string;
}

export const CourseModuleList: React.FC<Props> = ({
  modules = [],
  onSelectModule,
  className = ''
}) => {
  const sortedModules = [...modules].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

  if (sortedModules.length === 0) {
    return (
      <div
        style={{
          padding: '3rem 2rem',
          textAlign: 'center',
          background: 'var(--bg-secondary, #131722)',
          borderRadius: 'var(--radius-lg, 14px)',
          border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.1))',
          color: 'var(--text-muted, #9CA3AF)'
        }}
      >
        <p style={{ margin: 0, fontSize: '0.95rem' }}>No modules have been published for this course yet.</p>
      </div>
    );
  }

  return (
    <div className={`course-module-list ${className}`} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
      {sortedModules.map((mod, index) => {
        const moduleNumber = String(index + 1).padStart(2, '0');
        const hasVideo = Boolean(mod.youtubeUrl || mod.videoUrl);
        const resourceCount = mod.resources?.length || (mod.starterCodeUrl ? 1 : 0);

        return (
          <div
            key={mod.id}
            onClick={() => onSelectModule(mod)}
            style={{
              padding: '0.85rem 1.25rem',
              background: 'var(--bg-secondary, #131722)',
              border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))',
              borderRadius: 'var(--radius-lg, 12px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              position: 'relative',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(250, 70, 22, 0.4)';
              e.currentTarget.style.background = 'linear-gradient(90deg, rgba(250, 70, 22, 0.06) 0%, rgba(19, 23, 34, 0.98) 100%)';
              e.currentTarget.style.transform = 'translateX(4px)';
              e.currentTarget.style.boxShadow = '0 6px 20px -2px rgba(0, 0, 0, 0.4), 0 0 16px -2px rgba(250, 70, 22, 0.15)';
              const chevron = e.currentTarget.querySelector('.module-arrow-icon') as HTMLElement | null;
              if (chevron) {
                chevron.style.color = '#FA4616';
                chevron.style.transform = 'translateX(2px)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle, rgba(255, 255, 255, 0.08))';
              e.currentTarget.style.background = 'var(--bg-secondary, #131722)';
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
              const chevron = e.currentTarget.querySelector('.module-arrow-icon') as HTMLElement | null;
              if (chevron) {
                chevron.style.color = 'var(--text-muted, #9CA3AF)';
                chevron.style.transform = 'translateX(0)';
              }
            }}
          >
            {/* Left: Module index badge and primary title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0 }}>
              {/* Module Number Index */}
              <div
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono, monospace)',
                  color: 'var(--uipath-orange, #FA4616)',
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  background: 'rgba(250, 70, 22, 0.12)',
                  border: '1px solid rgba(250, 70, 22, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {moduleNumber}
              </div>

              {/* Title Heading */}
              <h3
                style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'var(--text-primary, #FFFFFF)',
                  margin: 0,
                  lineHeight: 1.35,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word'
                }}
              >
                {mod.title || mod.name}
              </h3>
            </div>

            {/* Right: Meta indicators (video, resources, duration) and navigational arrow icon */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
              {hasVideo && (
                <span
                  style={{
                    fontSize: '0.725rem',
                    fontWeight: 600,
                    color: '#60A5FA',
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.25)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <Video size={12} /> Video
                </span>
              )}

              {resourceCount > 0 && (
                <span
                  style={{
                    fontSize: '0.725rem',
                    fontWeight: 600,
                    color: '#FED7AA',
                    background: 'rgba(250, 70, 22, 0.1)',
                    border: '1px solid rgba(250, 70, 22, 0.25)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <FileCode size={12} /> {resourceCount} {resourceCount === 1 ? 'Resource' : 'Resources'}
                </span>
              )}

              {mod.durationMinutes && (
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: 'var(--text-secondary, #9CA3AF)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    padding: '0.25rem 0.55rem',
                    borderRadius: '6px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <Clock size={12} /> {mod.durationMinutes}m
                </span>
              )}

              <div
                className="module-arrow-icon"
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted, #9CA3AF)',
                  transition: 'all 0.15s ease'
                }}
              >
                <ChevronRight size={16} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
