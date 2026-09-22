import React from 'react';
import { ChevronRight, Home, GraduationCap, BookOpen, FileText } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  icon?: React.ElementType;
  isActive?: boolean;
}

interface Props {
  courseTitle?: string;
  courseSlug?: string;
  moduleTitle?: string;
  onNavigate: (view: string, detailId?: string) => void;
  className?: string;
}

export const AcademyBreadcrumbs: React.FC<Props> = ({
  courseTitle,
  courseSlug,
  moduleTitle,
  onNavigate,
  className = ''
}) => {
  const items: BreadcrumbItem[] = [
    {
      label: 'Learning Academy',
      icon: GraduationCap,
      onClick: () => onNavigate('learn')
    }
  ];

  if (courseTitle) {
    items.push({
      label: courseTitle,
      icon: BookOpen,
      onClick: moduleTitle && courseSlug ? () => onNavigate('learn', courseSlug) : undefined,
      isActive: !moduleTitle
    });
  }

  if (moduleTitle) {
    items.push({
      label: moduleTitle,
      icon: FileText,
      isActive: true
    });
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={`academy-breadcrumbs ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.4rem',
        fontSize: '0.85rem',
        color: 'var(--text-muted, #9CA3AF)',
        marginBottom: '1.5rem',
        padding: '0.5rem 0'
      }}
    >
      {items.map((item, index) => {
        const Icon = item.icon || (index === 0 ? Home : undefined);
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight
                size={14}
                style={{
                  color: 'var(--border-subtle, rgba(255, 255, 255, 0.2))',
                  flexShrink: 0
                }}
              />
            )}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              {Icon && (
                <Icon
                  size={14}
                  style={{
                    color: item.isActive ? 'var(--uipath-orange, #FA4616)' : 'inherit',
                    flexShrink: 0
                  }}
                />
              )}
              {item.onClick && !isLast ? (
                <button
                  type="button"
                  onClick={item.onClick}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: 'var(--text-secondary, #D1D5DB)',
                    cursor: 'pointer',
                    fontSize: 'inherit',
                    fontWeight: 500,
                    textDecoration: 'none',
                    transition: 'color 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FA4616')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary, #D1D5DB)')}
                >
                  {item.label}
                </button>
              ) : (
                <span
                  style={{
                    color: item.isActive ? 'var(--text-primary, #FFFFFF)' : 'var(--text-muted, #9CA3AF)',
                    fontWeight: item.isActive ? 600 : 400,
                    maxWidth: '300px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  title={item.label}
                >
                  {item.label}
                </span>
              )}
            </div>
          </React.Fragment>
        );
      })}
    </nav>
  );
};
