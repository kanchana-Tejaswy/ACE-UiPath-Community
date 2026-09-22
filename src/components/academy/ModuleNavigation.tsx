import React from 'react';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { LearningModule } from '../../types';

interface Props {
  courseTitle: string;
  courseSlug: string;
  currentModule: LearningModule;
  previousModule?: LearningModule;
  nextModule?: LearningModule;
  onNavigateModule: (module: LearningModule) => void;
  onBackToCourse: () => void;
  className?: string;
}

export const ModuleNavigation: React.FC<Props> = ({
  courseTitle,
  courseSlug,
  currentModule,
  previousModule,
  nextModule,
  onNavigateModule,
  onBackToCourse,
  className = ''
}) => {
  return (
    <div
      className={`module-navigation ${className}`}
      style={{
        marginTop: '3rem',
        paddingTop: '2rem',
        borderTop: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.1))',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}
    >
      {/* Back to Course Action */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          background: 'var(--bg-secondary, #131722)',
          padding: '1rem 1.5rem',
          borderRadius: 'var(--radius-lg, 12px)',
          border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))'
        }}
      >
        <button
          type="button"
          onClick={onBackToCourse}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary, #D1D5DB)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '0.4rem 0.6rem',
            borderRadius: '6px',
            transition: 'color 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#FA4616')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary, #D1D5DB)')}
        >
          <BookOpen size={16} style={{ color: 'var(--uipath-orange, #FA4616)' }} />
          <span>← Back to {courseTitle}</span>
        </button>
      </div>

      {/* Prev / Next Pagination Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem'
        }}
      >
        {/* Previous Module Card */}
        {previousModule ? (
          <button
            type="button"
            onClick={() => onNavigateModule(previousModule)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1.25rem',
              background: 'var(--bg-secondary, #131722)',
              border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.1))',
              borderRadius: 'var(--radius-lg, 12px)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease',
              width: '100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(250, 70, 22, 0.4)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle, rgba(255, 255, 255, 0.1))';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted, #9CA3AF)',
                flexShrink: 0
              }}
            >
              <ArrowLeft size={18} />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted, #9CA3AF)', textTransform: 'uppercase' }}>
                Previous Module
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary, #FFFFFF)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {previousModule.title || previousModule.name}
              </div>
            </div>
          </button>
        ) : (
          <div />
        )}

        {/* Next Module Card */}
        {nextModule && (
          <button
            type="button"
            onClick={() => onNavigateModule(nextModule)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              padding: '1.25rem',
              background: 'linear-gradient(135deg, rgba(250, 70, 22, 0.08) 0%, rgba(19, 23, 34, 0.95) 100%)',
              border: '1px solid rgba(250, 70, 22, 0.3)',
              borderRadius: 'var(--radius-lg, 12px)',
              cursor: 'pointer',
              textAlign: 'right',
              transition: 'all 0.2s ease',
              width: '100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--uipath-orange, #FA4616)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(250, 70, 22, 0.3)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ overflow: 'hidden', textAlign: 'left', flex: 1 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--uipath-orange, #FA4616)', textTransform: 'uppercase' }}>
                Next Module
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary, #FFFFFF)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {nextModule.title || nextModule.name}
              </div>
            </div>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'rgba(250, 70, 22, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--uipath-orange, #FA4616)',
                flexShrink: 0
              }}
            >
              <ArrowRight size={18} />
            </div>
          </button>
        )}
      </div>
    </div>
  );
};
