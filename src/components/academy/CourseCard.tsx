import React from 'react';
import { 
  GraduationCap, 
  Clock, 
  Zap, 
  Code, 
  Cpu, 
  Sparkles, 
  Layers, 
  ArrowRight, 
  BookOpen
} from 'lucide-react';
import { LearningPath } from '../../types';
import { OfficialAcademyButton } from './OfficialAcademyButton';

interface Props {
  course: LearningPath;
  onOpenCourse: (course: LearningPath) => void;
  className?: string;
}

const getCourseIcon = (iconName?: string) => {
  switch (iconName) {
    case 'Zap': return Zap;
    case 'Code': return Code;
    case 'Cpu': return Cpu;
    case 'Sparkles': return Sparkles;
    case 'Layers': return Layers;
    case 'GraduationCap':
    default: return GraduationCap;
  }
};

const getLevelBadgeClass = (level?: string) => {
  switch (level) {
    case 'Beginner': return 'badge-green';
    case 'Intermediate': return 'badge-neutral';
    case 'Advanced': return 'badge-orange';
    case 'Specialist': return 'badge-purple';
    default: return 'badge-slate';
  }
};

export const CourseCard: React.FC<Props> = ({
  course,
  onOpenCourse,
  className = ''
}) => {
  const Icon = getCourseIcon(course.iconName);
  const totalModules = course.modules?.length || 0;

  return (
    <div
      className={`glass-card course-card ${className}`}
      style={{
        padding: '1.75rem',
        borderRadius: 'var(--radius-lg, 14px)',
        background: 'var(--bg-secondary, #131722)',
        border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.1))',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer'
      }}
      onClick={() => onOpenCourse(course)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.borderColor = 'rgba(250, 70, 22, 0.45)';
        e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(250, 70, 22, 0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border-subtle, rgba(255, 255, 255, 0.1))';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div>
        {/* Top badges and icon row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', gap: '0.5rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(250, 70, 22, 0.18) 0%, rgba(250, 70, 22, 0.05) 100%)',
              border: '1px solid rgba(250, 70, 22, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--uipath-orange, #FA4616)'
            }}
          >
            <Icon size={22} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            {course.badgeText && (
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: '#FED7AA',
                  background: 'rgba(250, 70, 22, 0.15)',
                  border: '1px solid rgba(250, 70, 22, 0.3)',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '999px'
                }}
              >
                {course.badgeText}
              </span>
            )}
            {course.level && (
              <span className={`badge ${getLevelBadgeClass(course.level)}`} style={{ fontSize: '0.7rem' }}>
                {course.level}
              </span>
            )}
          </div>
        </div>

        {/* Course Title */}
        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--text-primary, #FFFFFF)',
            marginBottom: '0.5rem',
            lineHeight: 1.3
          }}
        >
          {course.title || course.name}
        </h3>

        {/* Course Description */}
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary, #D1D5DB)',
            lineHeight: 1.5,
            marginBottom: '1.25rem'
          }}
        >
          {course.description || course.tagline}
        </p>
      </div>

      <div>
        {/* Meta details: hours & module count */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.775rem',
            color: 'var(--text-muted, #9CA3AF)',
            marginBottom: '0.85rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))'
          }}
        >
          {course.estimatedHours ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={13} /> {course.estimatedHours} Hours
            </span>
          ) : (
            <span />
          )}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <BookOpen size={13} /> {totalModules} {totalModules === 1 ? 'Module' : 'Modules'}
          </span>
        </div>

        {/* Actions row: Official UiPath link & Explore Button */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            gap: '0.5rem', 
            flexWrap: 'wrap'
          }} 
          onClick={(e) => e.stopPropagation()}
        >
          {course.officialAcademyUrl ? (
            <OfficialAcademyButton
              url={course.officialAcademyUrl}
              label="Official Course"
              size="sm"
              variant="secondary"
            />
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={() => onOpenCourse(course)}
            style={{
              background: 'transparent',
              color: 'var(--uipath-orange, #FA4616)',
              border: '1px solid rgba(250, 70, 22, 0.3)',
              borderRadius: 'var(--radius-sm, 6px)',
              padding: '0.45rem 0.85rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--uipath-orange, #FA4616)';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--uipath-orange, #FA4616)';
            }}
          >
            <span>View Modules</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
