import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, 
  Clock, 
  Search, 
  BookOpen, 
  Sparkles
} from 'lucide-react';
import { LearningPath, LearningModule } from '../types';
import { OfficialAcademyButton } from '../components/academy/OfficialAcademyButton';
import { YouTubeVideoCard } from '../components/academy/YouTubeVideoCard';
import { ModuleResourcesList } from '../components/academy/ModuleResourcesList';
import { ModuleNavigation } from '../components/academy/ModuleNavigation';
import { CourseModuleList } from '../components/academy/CourseModuleList';
import { CourseCard } from '../components/academy/CourseCard';
import { AcademyBreadcrumbs } from '../components/academy/AcademyBreadcrumbs';

interface Props {
  learningPaths: LearningPath[];
  selectedModuleSlug?: string;
  onNavigate: (view: string, detailId?: string) => void;
}

export const LearnPage: React.FC<Props> = ({
  learningPaths = [],
  selectedModuleSlug,
  onNavigate
}) => {
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // --------------------------------------------------------------------------
  // ROUTING & STATE RESOLUTION
  // Hierarchy: Learning Academy -> Course -> Module -> Content
  // --------------------------------------------------------------------------
  const resolvedState = useMemo(() => {
    if (!selectedModuleSlug || selectedModuleSlug === 'all') {
      return { viewType: 'catalog' as const, activeCourse: null, activeModule: null };
    }

    const cleanSlug = selectedModuleSlug.trim().toLowerCase();

    // 1. Check for /:courseSlug/:moduleSlug route
    if (cleanSlug.includes('/')) {
      const [cSlug, mSlug] = cleanSlug.split('/');
      const course = learningPaths.find(
        (p) => (p.slug && p.slug.toLowerCase() === cSlug) || p.id.toLowerCase() === cSlug
      );
      if (course) {
        const module = (course.modules || []).find(
          (m) => (m.slug && m.slug.toLowerCase() === mSlug) || m.id.toLowerCase() === mSlug
        );
        if (module) {
          return { viewType: 'module' as const, activeCourse: course, activeModule: module };
        }
        return { viewType: 'course' as const, activeCourse: course, activeModule: null };
      }
    }

    // 2. Check for direct course slug match
    const directCourseMatch = learningPaths.find(
      (p) => (p.slug && p.slug.toLowerCase() === cleanSlug) || p.id.toLowerCase() === cleanSlug
    );
    if (directCourseMatch) {
      return { viewType: 'course' as const, activeCourse: directCourseMatch, activeModule: null };
    }

    // 3. Fallback: Check if cleanSlug matches a module directly inside any course
    for (const course of learningPaths) {
      const directModuleMatch = (course.modules || []).find(
        (m) => (m.slug && m.slug.toLowerCase() === cleanSlug) || m.id.toLowerCase() === cleanSlug
      );
      if (directModuleMatch) {
        return { viewType: 'module' as const, activeCourse: course, activeModule: directModuleMatch };
      }
    }

    return { viewType: 'catalog' as const, activeCourse: null, activeModule: null };
  }, [selectedModuleSlug, learningPaths]);

  const { viewType, activeCourse, activeModule } = resolvedState;

  // Navigation helpers
  const handleOpenCourse = (course: LearningPath) => {
    const slug = course.slug || course.id;
    onNavigate('learn', slug);
  };

  const handleOpenModule = (course: LearningPath, module: LearningModule) => {
    const courseSlug = course.slug || course.id;
    const moduleSlug = module.slug || module.id;
    onNavigate('learn', `${courseSlug}/${moduleSlug}`);
  };

  // Filtered courses for catalog view
  const filteredCourses = useMemo(() => {
    return learningPaths.filter((c) => {
      if (c.isPublished === false) return false;
      if (levelFilter !== 'ALL' && c.level && c.level.toUpperCase() !== levelFilter.toUpperCase()) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = (c.title || c.name || '').toLowerCase().includes(q);
        const matchesDesc = (c.description || c.tagline || '').toLowerCase().includes(q);
        const matchesModules = (c.modules || []).some(
          (m) => (m.title || m.name || '').toLowerCase().includes(q) || (m.description || m.summary || '').toLowerCase().includes(q)
        );
        if (!matchesTitle && !matchesDesc && !matchesModules) return false;
      }
      return true;
    });
  }, [learningPaths, levelFilter, searchQuery]);

  // --------------------------------------------------------------------------
  // 1. MODULE PAGE (Focused Entirely on Learning Resources)
  // --------------------------------------------------------------------------
  if (viewType === 'module' && activeCourse && activeModule) {
    const sortedModules = [...(activeCourse.modules || [])].sort(
      (a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)
    );
    const moduleIndex = sortedModules.findIndex((m) => m.id === activeModule.id);
    const moduleNumber = moduleIndex >= 0 ? String(moduleIndex + 1).padStart(2, '0') : '01';
    const previousModule = moduleIndex > 0 ? sortedModules[moduleIndex - 1] : undefined;
    const nextModule = moduleIndex < sortedModules.length - 1 ? sortedModules[moduleIndex + 1] : undefined;

    // Official course link (module-specific or fallback to course)
    const officialUrl = activeModule.officialAcademyUrl || activeModule.officialResourceUrl || activeCourse.officialAcademyUrl;
    const youtubeUrl = activeModule.youtubeUrl || activeModule.videoUrl;
    const moduleDescription = activeModule.description || activeModule.summary || activeModule.contentMd;

    return (
      <div className="container academy-module-view" style={{ paddingTop: '2rem', paddingBottom: '6rem' }}>
        {/* Breadcrumb Navigation */}
        <AcademyBreadcrumbs
          courseTitle={activeCourse.title || activeCourse.name || 'Course'}
          courseSlug={activeCourse.slug || activeCourse.id}
          moduleTitle={`Module ${moduleNumber}: ${activeModule.title || activeModule.name}`}
          onNavigate={onNavigate}
        />

        {/* Module Header Card */}
        <div
          style={{
            background: 'var(--bg-secondary, #131722)',
            border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.1))',
            borderRadius: 'var(--radius-lg, 16px)',
            padding: '2.5rem',
            marginBottom: '2rem',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.35)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ flex: 1, minWidth: '280px' }}>
              {/* Course & Module Index Tag */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--uipath-orange, #FA4616)',
                    background: 'rgba(250, 70, 22, 0.12)',
                    border: '1px solid rgba(250, 70, 22, 0.3)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '999px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}
                >
                  {activeCourse.title || activeCourse.name}
                </span>

                <span className="badge badge-slate" style={{ fontSize: '0.75rem' }}>
                  Module {moduleNumber} of {String(sortedModules.length).padStart(2, '0')}
                </span>

                {activeModule.durationMinutes && (
                  <span className="badge badge-neutral" style={{ fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={12} /> {activeModule.durationMinutes} mins
                  </span>
                )}
              </div>

              {/* Module Name */}
              <h1
                style={{
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
                  fontWeight: 800,
                  color: 'var(--text-primary, #FFFFFF)',
                  margin: '0 0 0.5rem 0',
                  lineHeight: 1.25
                }}
              >
                Module {moduleNumber} — {activeModule.title || activeModule.name}
              </h1>
            </div>

            {/* Official UiPath Academy Link Button */}
            {officialUrl && (
              <OfficialAcademyButton
                url={officialUrl}
                label="Complete this course on UiPath Academy ↗"
                size="lg"
                variant="glow"
              />
            )}
          </div>
        </div>

        {/* 1. MODULE DESCRIPTION (About this module) */}
        {moduleDescription && (
          <div
            style={{
              background: 'var(--bg-secondary, #131722)',
              border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))',
              borderRadius: 'var(--radius-lg, 14px)',
              padding: '2rem 2.25rem',
              marginBottom: '2rem',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '0.65rem' }}>
              <Sparkles size={18} style={{ color: 'var(--uipath-orange, #FA4616)' }} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-primary, #FFFFFF)' }}>
                About this module
              </h2>
            </div>

            <div
              style={{
                fontSize: '1rem',
                color: 'var(--text-secondary, #D1D5DB)',
                lineHeight: 1.7,
                whiteSpace: 'pre-line'
              }}
            >
              {moduleDescription}
            </div>
          </div>
        )}

        {/* 2. YOUTUBE VIDEO SECTION (Rendered only if YouTube URL is configured) */}
        {youtubeUrl && (
          <div style={{ marginBottom: '2rem' }}>
            <YouTubeVideoCard
              videoUrl={youtubeUrl}
              videoDuration={activeModule.videoDuration}
              moduleTitle={activeModule.title || activeModule.name || 'Module Video'}
            />
          </div>
        )}

        {/* 3. TEMPLATES & RESOURCES SECTION (Rendered only if resources exist) */}
        <div style={{ marginBottom: '2rem' }}>
          <ModuleResourcesList
            resources={activeModule.resources}
            starterCodeUrl={activeModule.starterCodeUrl}
          />
        </div>

        {/* 4. BROWSING NAVIGATION */}
        <ModuleNavigation
          courseTitle={activeCourse.title || activeCourse.name || 'Course'}
          courseSlug={activeCourse.slug || activeCourse.id}
          currentModule={activeModule}
          previousModule={previousModule}
          nextModule={nextModule}
          onNavigateModule={(mod) => handleOpenModule(activeCourse, mod)}
          onBackToCourse={() => handleOpenCourse(activeCourse)}
        />
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 2. COURSE PAGE (Course Header + Ordered Modules List, No Progress Bars)
  // --------------------------------------------------------------------------
  if (viewType === 'course' && activeCourse) {
    const totalModules = activeCourse.modules?.length || 0;

    return (
      <div className="container academy-course-view" style={{ paddingTop: '2rem', paddingBottom: '6rem' }}>
        {/* Breadcrumbs */}
        <AcademyBreadcrumbs
          courseTitle={activeCourse.title || activeCourse.name || 'Course'}
          courseSlug={activeCourse.slug || activeCourse.id}
          onNavigate={onNavigate}
        />

        {/* Course Header Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(28, 14, 8, 0.95) 0%, rgba(13, 17, 26, 0.95) 100%)',
            border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.12))',
            borderRadius: 'var(--radius-lg, 16px)',
            padding: '2.5rem',
            marginBottom: '2.5rem',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
              {/* Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                {activeCourse.badgeText && (
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#FED7AA',
                      background: 'rgba(250, 70, 22, 0.2)',
                      border: '1px solid rgba(250, 70, 22, 0.4)',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '999px'
                    }}
                  >
                    {activeCourse.badgeText}
                  </span>
                )}
                {activeCourse.level && <span className="badge badge-orange">{activeCourse.level}</span>}
                {activeCourse.estimatedHours ? <span className="badge badge-slate">{activeCourse.estimatedHours} Hours</span> : null}
                <span className="badge badge-neutral">{totalModules} {totalModules === 1 ? 'Module' : 'Modules'}</span>
              </div>

              {/* Course Name */}
              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, color: 'var(--text-primary, #FFFFFF)', margin: '0 0 0.85rem 0', lineHeight: 1.2 }}>
                {activeCourse.title || activeCourse.name}
              </h1>

              {/* Course Description */}
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary, #D1D5DB)', lineHeight: 1.6, maxWidth: '800px', margin: 0 }}>
                {activeCourse.description || activeCourse.tagline}
              </p>
            </div>

            {/* Official Academy Button (Admin Controlled) */}
            {activeCourse.officialAcademyUrl && (
              <OfficialAcademyButton
                url={activeCourse.officialAcademyUrl}
                label="Complete this course on UiPath Academy ↗"
                size="lg"
                variant="glow"
              />
            )}
          </div>
        </div>

        {/* Modules Section Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--uipath-orange, #FA4616)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
            CURRICULUM
          </div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary, #FFFFFF)', margin: 0 }}>
            Modules
          </h2>
        </div>

        {/* Ordered Modules List */}
        <CourseModuleList
          modules={activeCourse.modules || []}
          onSelectModule={(mod) => handleOpenModule(activeCourse, mod)}
        />
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 3. LEARNING ACADEMY LANDING PAGE (Pure Structured Digital Library)
  // --------------------------------------------------------------------------
  return (
    <div className="container academy-landing-page" style={{ paddingTop: '2.5rem', paddingBottom: '6rem' }}>
      {/* Library Hero Header */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <span className="badge badge-orange" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700 }}>
            <GraduationCap size={14} /> Learning Academy Library
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted, #9CA3AF)' }}>
            • ACE Engineering College Student Chapter
          </span>
        </div>

        <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1rem', lineHeight: 1.15 }}>
          Explore UiPath Automation Courses
        </h1>

        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary, #D1D5DB)', maxWidth: '800px', lineHeight: 1.6, margin: 0 }}>
          Structured learning roadmaps from foundational RPA to advanced Agentic AI Automation. Browse our curated modules, download starter templates, and access official certification training.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'All Courses' },
            { id: 'BEGINNER', label: 'Beginner' },
            { id: 'INTERMEDIATE', label: 'Intermediate' },
            { id: 'ADVANCED', label: 'Advanced' },
            { id: 'SPECIALIST', label: 'Agentic & Specialist' }
          ].map((item) => {
            const isActive = levelFilter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setLevelFilter(item.id)}
                style={{
                  background: isActive ? 'var(--uipath-orange, #FA4616)' : 'var(--bg-secondary, #131722)',
                  color: isActive ? '#FFFFFF' : 'var(--text-secondary, #D1D5DB)',
                  border: `1px solid ${isActive ? 'transparent' : 'var(--border-subtle, rgba(255, 255, 255, 0.1))'}`,
                  borderRadius: 'var(--radius-md, 8px)',
                  padding: '0.45rem 0.95rem',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div style={{ position: 'relative', minWidth: '260px' }}>
          <Search size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted, #9CA3AF)' }} />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.85rem 0.5rem 2.25rem',
              background: 'var(--bg-secondary, #131722)',
              border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.1))',
              borderRadius: 'var(--radius-md, 8px)',
              color: 'var(--text-primary, #FFFFFF)',
              fontSize: '0.85rem'
            }}
          />
        </div>
      </div>

      {/* Courses Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.75rem',
          marginBottom: '4rem'
        }}
      >
        {filteredCourses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onOpenCourse={handleOpenCourse}
          />
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            background: 'var(--bg-secondary, #131722)',
            borderRadius: 'var(--radius-lg, 14px)',
            border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.1))'
          }}
        >
          <GraduationCap size={48} style={{ color: 'var(--text-muted, #9CA3AF)', marginBottom: '1rem', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary, #FFFFFF)', marginBottom: '0.5rem' }}>
            No Courses Found
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary, #9CA3AF)', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
            No courses match the selected filters or search terms.
          </p>
          <button
            type="button"
            onClick={() => {
              setLevelFilter('ALL');
              setSearchQuery('');
            }}
            className="btn btn-secondary btn-sm"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
