import React from 'react';
import { Download, FileCode, FileText, FolderArchive, ExternalLink, Paperclip, CheckSquare } from 'lucide-react';
import { ModuleResource } from '../../types';

interface Props {
  resources?: ModuleResource[];
  starterCodeUrl?: string;
  practiceExerciseMd?: string;
  className?: string;
}

const getResourceIcon = (type: string) => {
  const t = (type || '').toLowerCase();
  if (t.includes('xaml') || t.includes('code')) return FileCode;
  if (t.includes('pdf') || t.includes('doc')) return FileText;
  if (t.includes('zip') || t.includes('nupkg') || t.includes('archive')) return FolderArchive;
  if (t.includes('link') || t.includes('url')) return ExternalLink;
  return Paperclip;
};

const getResourceBadge = (type: string) => {
  const t = (type || '').toUpperCase();
  if (t.includes('XAML')) return 'XAML Workflow';
  if (t.includes('PDF')) return 'PDF Guide';
  if (t.includes('ZIP')) return 'ZIP Archive';
  if (t.includes('LINK')) return 'External Link';
  return t || 'Resource';
};

export const ModuleResourcesList: React.FC<Props> = ({
  resources = [],
  starterCodeUrl,
  practiceExerciseMd,
  className = ''
}) => {
  // Aggregate items
  const items: ModuleResource[] = [...(resources || [])];

  // If starterCodeUrl is provided and not already in items
  if (starterCodeUrl && !items.some(r => r.url === starterCodeUrl)) {
    items.unshift({
      id: 'res_starter_xaml',
      title: 'Starter Workflow Package (.XAML)',
      type: 'xaml',
      url: starterCodeUrl,
      description: 'Pre-configured workflow template ready to open in UiPath Studio'
    });
  }

  // If no resources and no practice exercise, do not show empty container
  if (items.length === 0 && !practiceExerciseMd) {
    return null;
  }

  return (
    <div className={`module-resources-section ${className}`} style={{ marginBottom: '2.5rem' }}>
      {items.length > 0 && (
        <div style={{ marginBottom: practiceExerciseMd ? '2rem' : 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <FolderArchive size={18} style={{ color: 'var(--uipath-orange, #FA4616)' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-primary, #FFFFFF)' }}>
              Templates & Resources
            </h3>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1rem'
            }}
          >
            {items.map((res) => {
              const Icon = getResourceIcon(res.type);
              const isExternal = res.type.toLowerCase().includes('link');

              return (
                <div
                  key={res.id}
                  style={{
                    background: 'var(--bg-secondary, #131722)',
                    border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.1))',
                    borderRadius: 'var(--radius-lg, 12px)',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--uipath-orange, #FA4616)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle, rgba(255, 255, 255, 0.1))';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '8px',
                        background: 'rgba(250, 70, 22, 0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--uipath-orange, #FA4616)',
                        flexShrink: 0
                      }}
                    >
                      <Icon size={20} />
                    </div>

                    <div style={{ minWidth: 0, flex: 1 }}>
                      <span
                        style={{
                          fontSize: '0.675rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: '#FED7AA',
                          background: 'rgba(250, 70, 22, 0.15)',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                          display: 'inline-block',
                          marginBottom: '0.35rem'
                        }}
                      >
                        {getResourceBadge(res.type)}
                      </span>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary, #FFFFFF)', margin: '0 0 0.25rem 0', lineHeight: 1.3 }}>
                        {res.title}
                      </h4>
                      {res.description && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary, #9CA3AF)', margin: 0, lineHeight: 1.4 }}>
                          {res.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      textDecoration: 'none',
                      fontSize: '0.825rem'
                    }}
                  >
                    {isExternal ? <ExternalLink size={14} /> : <Download size={14} />}
                    <span>{isExternal ? 'Open Resource' : 'Download File'}</span>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Optional Practice Exercise Challenge */}
      {practiceExerciseMd && (
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.05)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: 'var(--radius-lg, 12px)',
            padding: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
            <CheckSquare size={18} style={{ color: '#34D399' }} />
            <h4 style={{ color: '#34D399', fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
              Hands-on Practice Exercise
            </h4>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary, #D1D5DB)', lineHeight: 1.6, margin: 0 }}>
            {practiceExerciseMd}
          </p>
        </div>
      )}
    </div>
  );
};
