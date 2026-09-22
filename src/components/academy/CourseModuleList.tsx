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
    <div className={`course-module-list ${className}`} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {sortedModules.map((mod, index) => {
        const moduleNumber = String(index + 1).padStart(2, '0');
        const hasVideo = Boolean(mod.youtubeUrl || mod.videoUrl);
        const resourceCount = mod.resources?.length || (mod.starterCodeUrl ? 1 : 0);

        return (
          <div
            key={mod.id}
            onClick={() => onSelectModule(mod)}
            style={{
              padding: '1.25rem 1.5rem',
              background: 'var(--bg-secondary, #131722)',
              border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))',
              borderRadius: 'var(--radius-lg, 12px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.25rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(250, 70, 22, 0.4)';
              e.currentTarget.style.background = 'linear-gradient(90deg, rgba(250, 70, 22, 0.04) 0%, #131722 100%)';
              e.currentTarget.style.transform = 'translateX(4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle, rgba(255, 255, 255, 0.08))';
              e.currentTarget.style.background = 'var(--bg-secondary, #131722)';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            {/* Left: Number index and titles */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1, minWidth: '260px' }}>
              {/* Module Number Index */}
              <div
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono, monospace)',
                  color: 'var(--uipath-orange, #FA4616)',
                  width: '36px',
                  height: '36px',
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

              {/* Title & metadata */}
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: 'var(--text-primary, #FFFFFF)',
                    margin: '0 0 0.25rem 0'
                  }}
                >
                  {mod.title || mod.name}
                </h3>

                <p
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary, #9CA3AF)',
                    lineHeight: 1.4,
                    margin: 0,
                    maxWidth: '700px'
                  }}
                >
                  {mod.description || mod.summary}
                </p>
              </div>
            </div>

            {/* Right: Badges and Action arrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
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
                    fontSize: '0.725rem',
                    color: 'var(--text-muted, #9CA3AF)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <Clock size={12} /> {mod.durationMinutes}m
                </span>
              )}

              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.05)',
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
