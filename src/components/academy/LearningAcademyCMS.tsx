import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Plus, 
  Edit3, 
  Trash2, 
  Copy, 
  ArrowUp, 
  ArrowDown, 
  ChevronUp, 
  ChevronDown, 
  Eye, 
  EyeOff, 
  ExternalLink, 
  Youtube, 
  FileCode, 
  FileArchive, 
  FileText, 
  Link as LinkIcon, 
  Save, 
  X, 
  Search, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Clock,
  ChevronRight
} from 'lucide-react';
import { LearningPath, LearningModule, ModuleResource } from '../../types';

interface Props {
  learningPaths: LearningPath[];
  onSaveLearningPath?: (path: LearningPath) => void | Promise<any>;
  onDeleteLearningPath?: (id: string) => void | Promise<any>;
  onNavigate: (view: string, detailId?: string) => void;
  showToast: (msg: string) => void;
}

export const LearningAcademyCMS: React.FC<Props> = ({
  learningPaths = [],
  onSaveLearningPath,
  onDeleteLearningPath,
  onNavigate,
  showToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCourseIds, setExpandedCourseIds] = useState<string[]>(() => 
    learningPaths.map(p => p.id)
  );

  // Modals state
  const [editingCourse, setEditingCourse] = useState<Partial<LearningPath> | null>(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  
  const [editingModule, setEditingModule] = useState<{
    courseId: string;
    module: Partial<LearningModule>;
    isNew: boolean;
  } | null>(null);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);

  // Sorted courses by orderIndex
  const sortedCourses = useMemo(() => {
    return [...learningPaths].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
  }, [learningPaths]);

  // Total statistics
  const totalModulesCount = useMemo(() => {
    return learningPaths.reduce((acc, c) => acc + (c.modules?.length || 0), 0);
  }, [learningPaths]);

  // Filtered courses based on search
  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return sortedCourses;
    const q = searchQuery.toLowerCase();
    return sortedCourses.filter(course => {
      const matchCourseTitle = (course.title || course.name || '').toLowerCase().includes(q);
      const matchCourseDesc = (course.description || course.tagline || '').toLowerCase().includes(q);
      const matchModules = (course.modules || []).some(m => 
        (m.title || m.name || '').toLowerCase().includes(q) || 
        (m.description || m.summary || '').toLowerCase().includes(q)
      );
      return matchCourseTitle || matchCourseDesc || matchModules;
    });
  }, [sortedCourses, searchQuery]);

  // Expand / Collapse controls
  const toggleCourseExpand = (courseId: string) => {
    setExpandedCourseIds(prev => 
      prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]
    );
  };

  const handleExpandAll = () => {
    setExpandedCourseIds(learningPaths.map(p => p.id));
  };

  const handleCollapseAll = () => {
    setExpandedCourseIds([]);
  };

  // --------------------------------------------------------------------------
  // COURSE CRUD OPERATIONS
  // --------------------------------------------------------------------------
  const handleOpenCourseModal = (course?: LearningPath) => {
    if (course) {
      setEditingCourse({ ...course });
    } else {
      setEditingCourse({
        id: `path_${Date.now()}`,
        slug: '',
        title: '',
        tagline: '',
        level: 'Beginner',
        targetAudience: 'Engineering students across all branches',
        estimatedHours: 12,
        iconName: 'GraduationCap',
        badgeText: 'Certification Track',
        officialAcademyUrl: 'https://academy.uipath.com',
        description: '',
        overviewMd: '',
        orderIndex: learningPaths.length + 1,
        isPublished: true,
        modules: []
      });
    }
    setIsCourseModalOpen(true);
  };

  const handleSaveCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse || !editingCourse.title?.trim()) {
      showToast('Please enter a course title.');
      return;
    }
    const finalSlug = editingCourse.slug?.trim() || 
      editingCourse.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const courseToSave: LearningPath = {
      id: editingCourse.id || `path_${Date.now()}`,
      slug: finalSlug,
      title: editingCourse.title.trim(),
      name: editingCourse.title.trim(),
      tagline: editingCourse.tagline?.trim() || '',
      level: editingCourse.level || 'Beginner',
      targetAudience: editingCourse.targetAudience?.trim() || '',
      estimatedHours: Number(editingCourse.estimatedHours) || 10,
      iconName: editingCourse.iconName || 'GraduationCap',
      badgeText: editingCourse.badgeText?.trim() || undefined,
      officialAcademyUrl: editingCourse.officialAcademyUrl?.trim() || undefined,
      description: editingCourse.description?.trim() || '',
      overviewMd: editingCourse.overviewMd || '',
      orderIndex: Number(editingCourse.orderIndex) || 1,
      isPublished: editingCourse.isPublished !== false,
      modules: editingCourse.modules || []
    };

    if (onSaveLearningPath) {
      await onSaveLearningPath(courseToSave);
    }
    setIsCourseModalOpen(false);
    showToast(`Course "${courseToSave.title}" saved successfully.`);
  };

  const handleDeleteCourse = async (course: LearningPath) => {
    const modCount = course.modules?.length || 0;
    const confirmText = modCount > 0 
      ? `Delete course "${course.title || course.name}" and all ${modCount} modules inside it? This cannot be undone.`
      : `Delete course "${course.title || course.name}"?`;
    
    if (!window.confirm(confirmText)) return;
    if (onDeleteLearningPath) {
      await onDeleteLearningPath(course.id);
      showToast(`Course "${course.title || course.name}" deleted.`);
    }
  };

  const handleDuplicateCourse = async (course: LearningPath) => {
    const newId = `path_${Date.now()}`;
    const newTitle = `${course.title || course.name} (Copy)`;
    const newSlug = `${course.slug || course.id}-copy-${Date.now().toString().slice(-4)}`;
    
    const duplicatedModules: LearningModule[] = (course.modules || []).map((m, idx) => ({
      ...m,
      id: `mod_${Date.now()}_${idx}`,
      courseId: newId,
      slug: `${m.slug || m.id}-copy-${idx + 1}`,
      title: m.title || m.name || `Module ${idx + 1}`,
      resources: m.resources ? m.resources.map((r, rIdx) => ({ ...r, id: `res_${Date.now()}_${rIdx}` })) : []
    }));

    const duplicatedCourse: LearningPath = {
      ...course,
      id: newId,
      title: newTitle,
      name: newTitle,
      slug: newSlug,
      orderIndex: learningPaths.length + 1,
      modules: duplicatedModules
    };

    if (onSaveLearningPath) {
      await onSaveLearningPath(duplicatedCourse);
      showToast(`Duplicated course created: "${newTitle}"`);
    }
  };

  const handleToggleCoursePublish = async (course: LearningPath) => {
    const updated: LearningPath = {
      ...course,
      isPublished: course.isPublished === false ? true : false
    };
    if (onSaveLearningPath) {
      await onSaveLearningPath(updated);
      showToast(`Course "${course.title}" is now ${updated.isPublished ? 'Published' : 'Unpublished'}.`);
    }
  };

  const handleReorderCourse = async (courseId: string, direction: 'up' | 'down') => {
    const index = sortedCourses.findIndex(c => c.id === courseId);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sortedCourses.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const currentCourse = sortedCourses[index];
    const targetCourse = sortedCourses[targetIndex];

    const currentOrder = currentCourse.orderIndex || index + 1;
    const targetOrder = targetCourse.orderIndex || targetIndex + 1;

    // Swap order indices
    const updatedCurrent: LearningPath = { ...currentCourse, orderIndex: targetOrder };
    const updatedTarget: LearningPath = { ...targetCourse, orderIndex: currentOrder };

    if (onSaveLearningPath) {
      await onSaveLearningPath(updatedCurrent);
      await onSaveLearningPath(updatedTarget);
      showToast(`Course order updated.`);
    }
  };

  // --------------------------------------------------------------------------
  // MODULE CRUD OPERATIONS
  // --------------------------------------------------------------------------
  const handleOpenModuleModal = (courseId: string, mod?: LearningModule) => {
    const course = learningPaths.find(p => p.id === courseId);
    const existingCount = course?.modules?.length || 0;
    if (mod) {
      setEditingModule({
        courseId,
        module: { 
          ...mod,
          resources: mod.resources ? [...mod.resources] : []
        },
        isNew: false
      });
    } else {
      setEditingModule({
        courseId,
        module: {
          id: `mod_${Date.now()}`,
          slug: '',
          title: '',
          name: '',
          description: '',
          summary: '',
          durationMinutes: 45,
          level: (course?.level as any) || 'Beginner',
          uipathTool: 'Studio',
          officialAcademyUrl: course?.officialAcademyUrl || '',
          youtubeUrl: '',
          resources: [],
          orderIndex: existingCount + 1,
          isPublished: true
        },
        isNew: true
      });
    }
    setIsModuleModalOpen(true);
  };

  const handleSaveModuleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModule || !editingModule.module.title?.trim()) {
      showToast('Please enter a module title.');
      return;
    }
    const course = learningPaths.find(p => p.id === editingModule.courseId);
    if (!course) return;

    const rawTitle = editingModule.module.title.trim();
    const modSlug = editingModule.module.slug?.trim() || 
      rawTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const desc = editingModule.module.description?.trim() || editingModule.module.summary?.trim() || '';
    
    const savedMod: LearningModule = {
      id: editingModule.module.id || `mod_${Date.now()}`,
      courseId: editingModule.courseId,
      slug: modSlug,
      title: rawTitle,
      name: rawTitle,
      description: desc,
      summary: desc,
      contentMd: desc,
      durationMinutes: Number(editingModule.module.durationMinutes) || 30,
      level: editingModule.module.level || 'Beginner',
      uipathTool: editingModule.module.uipathTool || 'Studio',
      officialAcademyUrl: editingModule.module.officialAcademyUrl?.trim() || undefined,
      officialResourceUrl: editingModule.module.officialAcademyUrl?.trim() || undefined,
      youtubeUrl: editingModule.module.youtubeUrl?.trim() || undefined,
      videoUrl: editingModule.module.youtubeUrl?.trim() || undefined,
      videoDuration: editingModule.module.videoDuration?.trim() || undefined,
      starterCodeUrl: editingModule.module.starterCodeUrl?.trim() || undefined,
      resources: (editingModule.module.resources || []).filter(r => r.title.trim() && r.url.trim()),
      orderIndex: Number(editingModule.module.orderIndex) || 1,
      isPublished: editingModule.module.isPublished !== false
    };

    let updatedModules = [...(course.modules || [])];
    const existingIndex = updatedModules.findIndex(m => m.id === savedMod.id);
    if (existingIndex >= 0) {
      updatedModules[existingIndex] = savedMod;
    } else {
      updatedModules.push(savedMod);
    }
    updatedModules.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

    const updatedCourse: LearningPath = {
      ...course,
      modules: updatedModules
    };

    if (onSaveLearningPath) {
      await onSaveLearningPath(updatedCourse);
    }
    setIsModuleModalOpen(false);
    showToast(`Module "${savedMod.title}" saved.`);
  };

  const handleDeleteModule = async (courseId: string, moduleId: string) => {
    const course = learningPaths.find(p => p.id === courseId);
    if (!course) return;
    const targetMod = (course.modules || []).find(m => m.id === moduleId);
    if (!window.confirm(`Delete module "${targetMod?.title || targetMod?.name || 'this module'}"?`)) return;

    const updatedModules = (course.modules || []).filter(m => m.id !== moduleId);
    const updatedCourse: LearningPath = {
      ...course,
      modules: updatedModules
    };
    if (onSaveLearningPath) {
      await onSaveLearningPath(updatedCourse);
    }
    showToast('Module deleted successfully.');
  };

  const handleDuplicateModule = async (courseId: string, mod: LearningModule) => {
    const course = learningPaths.find(p => p.id === courseId);
    if (!course) return;

    const currentModules = course.modules || [];
    const newId = `mod_${Date.now()}`;
    const newTitle = `${mod.title || mod.name} (Copy)`;
    const newSlug = `${mod.slug || mod.id}-copy-${Date.now().toString().slice(-4)}`;

    const duplicatedMod: LearningModule = {
      ...mod,
      id: newId,
      title: newTitle,
      name: newTitle,
      slug: newSlug,
      orderIndex: currentModules.length + 1,
      resources: mod.resources ? mod.resources.map((r, rIdx) => ({ ...r, id: `res_${Date.now()}_${rIdx}` })) : []
    };

    const updatedCourse: LearningPath = {
      ...course,
      modules: [...currentModules, duplicatedMod]
    };

    if (onSaveLearningPath) {
      await onSaveLearningPath(updatedCourse);
      showToast(`Duplicated module: "${newTitle}"`);
    }
  };

  const handleToggleModulePublish = async (courseId: string, mod: LearningModule) => {
    const course = learningPaths.find(p => p.id === courseId);
    if (!course) return;

    const updatedModules = (course.modules || []).map(m => {
      if (m.id === mod.id) {
        return { ...m, isPublished: m.isPublished === false ? true : false };
      }
      return m;
    });

    const updatedCourse: LearningPath = {
      ...course,
      modules: updatedModules
    };

    if (onSaveLearningPath) {
      await onSaveLearningPath(updatedCourse);
      showToast(`Module "${mod.title}" is now ${mod.isPublished === false ? 'Published' : 'Unpublished'}.`);
    }
  };

  const handleReorderModule = async (courseId: string, moduleId: string, direction: 'up' | 'down') => {
    const course = learningPaths.find(p => p.id === courseId);
    if (!course || !course.modules || course.modules.length <= 1) return;

    const sortedMods = [...course.modules].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
    const index = sortedMods.findIndex(m => m.id === moduleId);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sortedMods.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const currentMod = sortedMods[index];
    const targetMod = sortedMods[targetIndex];

    const currentOrder = currentMod.orderIndex || index + 1;
    const targetOrder = targetMod.orderIndex || targetIndex + 1;

    sortedMods[index] = { ...currentMod, orderIndex: targetOrder };
    sortedMods[targetIndex] = { ...targetMod, orderIndex: currentOrder };
    sortedMods.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

    const updatedCourse: LearningPath = {
      ...course,
      modules: sortedMods
    };

    if (onSaveLearningPath) {
      await onSaveLearningPath(updatedCourse);
      showToast('Module position updated.');
    }
  };

  // Helper to extract YouTube video ID for thumbnail preview in editor
  const getYouTubeId = (url?: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  return (
    <div className="learning-academy-cms" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. NOTION-INSPIRED TOP CONTROL BAR */}
      <div 
        style={{ 
          background: 'var(--bg-secondary, #131722)', 
          border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.1))',
          borderRadius: 'var(--radius-lg, 14px)',
          padding: '1.5rem 1.75rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
              <div 
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(250, 70, 22, 0.15)',
                  border: '1px solid rgba(250, 70, 22, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--uipath-orange, #FA4616)'
                }}
              >
                <GraduationCap size={20} />
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary, #FFFFFF)', margin: 0 }}>
                Learning Academy Content Manager
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary, #9CA3AF)', margin: 0, maxWidth: '720px', lineHeight: 1.5 }}>
              Hierarchical Notion-style curriculum control. Manage Courses (Parent Pages), Modules (Subpages), Official UiPath Academy links, YouTube videos, and downloadable practice templates.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => handleOpenCourseModal()}
              className="btn btn-primary"
              style={{ gap: '0.45rem', padding: '0.55rem 1.15rem', fontSize: '0.875rem' }}
            >
              <Plus size={16} /> Add New Course
            </button>
          </div>
        </div>

        {/* Status Metrics & Search / Filter Controls */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginTop: '1.25rem', 
            paddingTop: '1rem', 
            borderTop: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          {/* Quick Metrics */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span 
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#FED7AA',
                background: 'rgba(250, 70, 22, 0.12)',
                border: '1px solid rgba(250, 70, 22, 0.25)',
                padding: '0.25rem 0.65rem',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Layers size={13} /> {learningPaths.length} Courses
            </span>

            <span 
              style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--text-secondary, #9CA3AF)',
                background: 'var(--bg-primary, #0B0E14)',
                border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.1))',
                padding: '0.25rem 0.65rem',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <BookOpen size={13} /> {totalModulesCount} Subpage Modules
            </span>

            <div style={{ display: 'flex', gap: '0.35rem', marginLeft: '0.5rem' }}>
              <button
                type="button"
                onClick={handleExpandAll}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted, #9CA3AF)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  padding: '0.2rem 0.4rem',
                  borderRadius: '4px'
                }}
                className="hover-underline"
              >
                Expand All
              </button>
              <span style={{ color: 'var(--border-subtle, rgba(255,255,255,0.1))' }}>|</span>
              <button
                type="button"
                onClick={handleCollapseAll}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted, #9CA3AF)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  padding: '0.2rem 0.4rem',
                  borderRadius: '4px'
                }}
                className="hover-underline"
              >
                Collapse All
              </button>
            </div>
          </div>

          {/* Quick Search */}
          <div style={{ position: 'relative', minWidth: '260px' }}>
            <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted, #9CA3AF)' }} />
            <input
              type="text"
              placeholder="Filter courses or modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.75rem 0.45rem 2.2rem',
                background: 'var(--bg-primary, #0B0E14)',
                border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.1))',
                borderRadius: '8px',
                color: '#FFF',
                fontSize: '0.825rem',
                outline: 'none'
              }}
            />
          </div>
        </div>
      </div>

      {/* 2. HIERARCHICAL COURSE -> MODULE OUTLINE TREE */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filteredCourses.length === 0 ? (
          <div 
            style={{ 
              padding: '3.5rem 2rem', 
              textAlign: 'center', 
              background: 'var(--bg-secondary, #131722)', 
              borderRadius: 'var(--radius-lg, 14px)',
              border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))',
              color: 'var(--text-muted, #9CA3AF)'
            }}
          >
            <GraduationCap size={42} style={{ margin: '0 auto 0.75rem auto', opacity: 0.4 }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFF', marginBottom: '0.35rem' }}>
              {searchQuery ? 'No Courses or Modules match your search' : 'No Academy Courses Found'}
            </h3>
            <p style={{ fontSize: '0.85rem', maxWidth: '420px', margin: '0 auto 1.25rem auto' }}>
              {searchQuery ? 'Try searching for a different keyword or clear the search filter.' : 'Click "+ Add New Course" above to create your first certification roadmap.'}
            </p>
            {searchQuery ? (
              <button 
                type="button" 
                onClick={() => setSearchQuery('')} 
                className="btn btn-secondary btn-sm"
              >
                Clear Search
              </button>
            ) : (
              <button 
                type="button" 
                onClick={() => handleOpenCourseModal()} 
                className="btn btn-primary btn-sm"
              >
                <Plus size={14} /> Create First Course
              </button>
            )}
          </div>
        ) : (
          filteredCourses.map((course, cIdx) => {
            const isExpanded = expandedCourseIds.includes(course.id);
            const courseModules = [...(course.modules || [])].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
            const isFirst = cIdx === 0;
            const isLast = cIdx === filteredCourses.length - 1;

            return (
              <div
                key={course.id}
                style={{
                  background: 'var(--bg-secondary, #131722)',
                  border: isExpanded ? '1px solid rgba(250, 70, 22, 0.35)' : '1px solid var(--border-subtle, rgba(255, 255, 255, 0.09))',
                  borderRadius: 'var(--radius-lg, 14px)',
                  boxShadow: isExpanded ? '0 8px 24px rgba(0, 0, 0, 0.3)' : '0 2px 10px rgba(0, 0, 0, 0.15)',
                  transition: 'all 0.2s ease',
                  overflow: 'hidden'
                }}
              >
                {/* Course Header Bar */}
                <div
                  style={{
                    padding: '1.25rem 1.5rem',
                    background: isExpanded ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    borderBottom: isExpanded ? '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))' : 'none'
                  }}
                >
                  {/* Left: Expand toggle, Level, Order & Title */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: '300px' }}>
                    <button
                      type="button"
                      onClick={() => toggleCourseExpand(course.id)}
                      title={isExpanded ? 'Collapse course modules' : 'Expand course modules'}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: isExpanded ? 'rgba(250, 70, 22, 0.15)' : 'var(--bg-primary, #0B0E14)',
                        border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.1))',
                        color: isExpanded ? 'var(--uipath-orange, #FA4616)' : 'var(--text-muted, #9CA3AF)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                        <span 
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            color: 'var(--uipath-orange, #FA4616)',
                            background: 'rgba(250, 70, 22, 0.12)',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '4px',
                            textTransform: 'uppercase'
                          }}
                        >
                          Course #{cIdx + 1}
                        </span>

                        <span className="badge badge-orange" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
                          {course.level || 'Beginner'}
                        </span>

                        {course.badgeText && (
                          <span 
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              color: '#FED7AA',
                              background: 'rgba(250, 70, 22, 0.15)',
                              padding: '0.15rem 0.5rem',
                              borderRadius: '4px'
                            }}
                          >
                            {course.badgeText}
                          </span>
                        )}

                        {course.estimatedHours && (
                          <span className="badge badge-slate" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
                            <Clock size={11} style={{ marginRight: '0.2rem' }} /> {course.estimatedHours}h
                          </span>
                        )}

                        <span className="badge badge-neutral" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
                          {courseModules.length} {courseModules.length === 1 ? 'Module' : 'Modules'}
                        </span>

                        {/* Interactive 1-click publish toggle badge */}
                        <button
                          type="button"
                          onClick={() => handleToggleCoursePublish(course)}
                          title="Click to toggle publish status"
                          style={{
                            border: 'none',
                            background: course.isPublished !== false ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: course.isPublished !== false ? '#4ADE80' : '#F87171',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '0.15rem 0.55rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          {course.isPublished !== false ? (
                            <>
                              <Eye size={11} /> Published
                            </>
                          ) : (
                            <>
                              <EyeOff size={11} /> Unpublished
                            </>
                          )}
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <h3 
                          onClick={() => toggleCourseExpand(course.id)}
                          style={{ 
                            fontSize: '1.15rem', 
                            fontWeight: 700, 
                            color: 'var(--text-primary, #FFFFFF)', 
                            margin: 0,
                            cursor: 'pointer'
                          }}
                          className="hover-orange"
                        >
                          {course.title || course.name}
                        </h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #9CA3AF)', fontFamily: 'monospace' }}>
                          /{course.slug || course.id}
                        </span>
                      </div>

                      {course.description && (
                        <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary, #9CA3AF)', margin: '0.25rem 0 0 0', lineHeight: 1.4 }}>
                          {course.description}
                        </p>
                      )}

                      {/* Official UiPath Link Badge */}
                      {course.officialAcademyUrl && (
                        <div style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted, #9CA3AF)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span>Official Academy:</span>
                          <a
                            href={course.officialAcademyUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: 'var(--uipath-orange, #FA4616)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                          >
                            {course.officialAcademyUrl.replace(/^https?:\/\//, '').slice(0, 45)}... <ExternalLink size={11} />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions Bar (Reorder, Duplicate, Preview, Edit, Delete, + Add Module) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {/* Move Up / Down */}
                    <div style={{ display: 'flex', background: 'var(--bg-primary, #0B0E14)', borderRadius: '8px', border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.1))', padding: '0.15rem' }}>
                      <button
                        type="button"
                        disabled={isFirst}
                        onClick={() => handleReorderCourse(course.id, 'up')}
                        title="Move Course Up"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: isFirst ? 'var(--text-muted, #4B5563)' : 'var(--text-secondary, #D1D5DB)',
                          cursor: isFirst ? 'not-allowed' : 'pointer',
                          padding: '0.3rem 0.45rem',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        disabled={isLast}
                        onClick={() => handleReorderCourse(course.id, 'down')}
                        title="Move Course Down"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: isLast ? 'var(--text-muted, #4B5563)' : 'var(--text-secondary, #D1D5DB)',
                          cursor: isLast ? 'not-allowed' : 'pointer',
                          padding: '0.3rem 0.45rem',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>

                    {/* Preview Student Course Page */}
                    <button
                      type="button"
                      onClick={() => onNavigate('learn', course.slug || course.id)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.4rem 0.65rem', fontSize: '0.78rem', gap: '0.3rem' }}
                      title="Open student-facing Course page"
                    >
                      <Eye size={13} /> Preview
                    </button>

                    {/* Duplicate Course */}
                    <button
                      type="button"
                      onClick={() => handleDuplicateCourse(course)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.4rem 0.65rem', fontSize: '0.78rem' }}
                      title="Duplicate Course & Modules"
                    >
                      <Copy size={13} />
                    </button>

                    {/* Edit Course Settings */}
                    <button
                      type="button"
                      onClick={() => handleOpenCourseModal(course)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem', gap: '0.3rem' }}
                      title="Edit Course Settings"
                    >
                      <Edit3 size={13} /> Edit
                    </button>

                    {/* Delete Course */}
                    <button
                      type="button"
                      onClick={() => handleDeleteCourse(course)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.4rem 0.65rem', fontSize: '0.78rem', color: '#EF4444' }}
                      title="Delete Course"
                    >
                      <Trash2 size={13} />
                    </button>

                    {/* + Add Module Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenModuleModal(course.id)}
                      className="btn btn-primary btn-sm"
                      style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem', gap: '0.3rem' }}
                    >
                      <Plus size={13} /> Add Module
                    </button>
                  </div>
                </div>

                {/* 3. SUBPAGE MODULES (Rendered when course is expanded) */}
                {isExpanded && (
                  <div style={{ padding: '1.25rem 1.5rem', background: 'var(--bg-primary, #0B0E14)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted, #9CA3AF)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <BookOpen size={13} style={{ color: 'var(--uipath-orange, #FA4616)' }} />
                        Subpage Modules ({courseModules.length})
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenModuleModal(course.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--uipath-orange, #FA4616)',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}
                      >
                        <Plus size={13} /> + Add Module to this Course
                      </button>
                    </div>

                    {courseModules.length === 0 ? (
                      <div
                        style={{
                          padding: '2rem 1.5rem',
                          textAlign: 'center',
                          background: 'var(--bg-secondary, #131722)',
                          borderRadius: '10px',
                          border: '1px dashed var(--border-subtle, rgba(255, 255, 255, 0.1))',
                          color: 'var(--text-muted, #9CA3AF)'
                        }}
                      >
                        <BookOpen size={28} style={{ margin: '0 auto 0.5rem auto', opacity: 0.4 }} />
                        <p style={{ fontSize: '0.85rem', margin: '0 0 0.75rem 0' }}>
                          No learning modules added yet for this course.
                        </p>
                        <button
                          type="button"
                          onClick={() => handleOpenModuleModal(course.id)}
                          className="btn btn-primary btn-sm"
                          style={{ fontSize: '0.78rem' }}
                        >
                          <Plus size={13} /> Create Module 01
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        {courseModules.map((m, mIdx) => {
                          const isModFirst = mIdx === 0;
                          const isModLast = mIdx === courseModules.length - 1;
                          const modNumber = String(mIdx + 1).padStart(2, '0');
                          const hasVideo = Boolean(m.youtubeUrl || m.videoUrl);
                          const resourceCount = (m.resources?.length || (m.starterCodeUrl ? 1 : 0));
                          const hasOfficialUrl = Boolean(m.officialAcademyUrl || m.officialResourceUrl);

                          return (
                            <div
                              key={m.id}
                              style={{
                                padding: '0.9rem 1.15rem',
                                background: 'var(--bg-secondary, #131722)',
                                borderRadius: '10px',
                                border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '1rem',
                                flexWrap: 'wrap',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              {/* Left: Index badge, Module Title, Metadata badges */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: '260px' }}>
                                <span
                                  style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '8px',
                                    background: 'rgba(250, 70, 22, 0.12)',
                                    border: '1px solid rgba(250, 70, 22, 0.25)',
                                    color: 'var(--uipath-orange, #FA4616)',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                  }}
                                >
                                  {modNumber}
                                </span>

                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    <span 
                                      onClick={() => handleOpenModuleModal(course.id, m)}
                                      style={{ fontWeight: 600, fontSize: '0.925rem', color: 'var(--text-primary, #FFFFFF)', cursor: 'pointer' }}
                                      className="hover-orange"
                                    >
                                      {m.title || m.name}
                                    </span>
                                    <span style={{ fontSize: '0.725rem', color: 'var(--text-muted, #9CA3AF)', fontFamily: 'monospace' }}>
                                      /{m.slug || m.id}
                                    </span>
                                  </div>

                                  {/* Badges row */}
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                                    {m.durationMinutes && (
                                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted, #9CA3AF)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                                        <Clock size={11} /> {m.durationMinutes}m
                                      </span>
                                    )}

                                    {hasVideo && (
                                      <span 
                                        style={{ 
                                          fontSize: '0.68rem', 
                                          color: '#60A5FA', 
                                          background: 'rgba(59, 130, 246, 0.12)', 
                                          padding: '0.1rem 0.4rem', 
                                          borderRadius: '4px',
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '0.25rem'
                                        }}
                                      >
                                        <Youtube size={11} /> YouTube Video
                                      </span>
                                    )}

                                    {resourceCount > 0 && (
                                      <span 
                                        style={{ 
                                          fontSize: '0.68rem', 
                                          color: '#34D399', 
                                          background: 'rgba(16, 185, 129, 0.12)', 
                                          padding: '0.1rem 0.4rem', 
                                          borderRadius: '4px',
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '0.25rem'
                                        }}
                                      >
                                        <FileCode size={11} /> {resourceCount} {resourceCount === 1 ? 'Resource' : 'Resources'}
                                      </span>
                                    )}

                                    {hasOfficialUrl && (
                                      <span 
                                        style={{ 
                                          fontSize: '0.68rem', 
                                          color: '#FED7AA', 
                                          background: 'rgba(250, 70, 22, 0.12)', 
                                          padding: '0.1rem 0.4rem', 
                                          borderRadius: '4px',
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '0.25rem'
                                        }}
                                      >
                                        <ExternalLink size={10} /> Official Link
                                      </span>
                                    )}

                                    {/* 1-click module publish toggle */}
                                    <button
                                      type="button"
                                      onClick={() => handleToggleModulePublish(course.id, m)}
                                      title="Toggle module publication"
                                      style={{
                                        border: 'none',
                                        background: m.isPublished !== false ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                                        color: m.isPublished !== false ? '#4ADE80' : '#F87171',
                                        fontSize: '0.68rem',
                                        fontWeight: 600,
                                        padding: '0.1rem 0.4rem',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.2rem'
                                      }}
                                    >
                                      {m.isPublished !== false ? 'Published' : 'Hidden'}
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* Right: Actions (Move, Duplicate, Preview, Edit, Delete) */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                {/* Move Up / Down */}
                                <div style={{ display: 'flex', background: 'var(--bg-primary, #0B0E14)', borderRadius: '6px', border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))', padding: '0.1rem' }}>
                                  <button
                                    type="button"
                                    disabled={isModFirst}
                                    onClick={() => handleReorderModule(course.id, m.id, 'up')}
                                    title="Move Module Up"
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: isModFirst ? 'var(--text-muted, #4B5563)' : 'var(--text-secondary, #D1D5DB)',
                                      cursor: isModFirst ? 'not-allowed' : 'pointer',
                                      padding: '0.25rem 0.35rem',
                                      borderRadius: '3px',
                                      display: 'flex',
                                      alignItems: 'center'
                                    }}
                                  >
                                    <ArrowUp size={12} />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={isModLast}
                                    onClick={() => handleReorderModule(course.id, m.id, 'down')}
                                    title="Move Module Down"
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: isModLast ? 'var(--text-muted, #4B5563)' : 'var(--text-secondary, #D1D5DB)',
                                      cursor: isModLast ? 'not-allowed' : 'pointer',
                                      padding: '0.25rem 0.35rem',
                                      borderRadius: '3px',
                                      display: 'flex',
                                      alignItems: 'center'
                                    }}
                                  >
                                    <ArrowDown size={12} />
                                  </button>
                                </div>

                                {/* Preview Module Student View */}
                                <button
                                  type="button"
                                  onClick={() => onNavigate('learn', `${course.slug || course.id}/${m.slug || m.id}`)}
                                  className="btn btn-secondary btn-sm"
                                  style={{ padding: '0.3rem 0.55rem', fontSize: '0.75rem', gap: '0.25rem' }}
                                  title="Preview module in Learning Academy student view"
                                >
                                  <Eye size={12} /> Preview
                                </button>

                                {/* Duplicate Module */}
                                <button
                                  type="button"
                                  onClick={() => handleDuplicateModule(course.id, m)}
                                  className="btn btn-secondary btn-sm"
                                  style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                                  title="Duplicate Module"
                                >
                                  <Copy size={12} />
                                </button>

                                {/* Edit Module */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenModuleModal(course.id, m)}
                                  className="btn btn-secondary btn-sm"
                                  style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', gap: '0.25rem' }}
                                  title="Edit Module"
                                >
                                  <Edit3 size={12} /> Edit
                                </button>

                                {/* Delete Module */}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteModule(course.id, m.id)}
                                  className="btn btn-secondary btn-sm"
                                  style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem', color: '#EF4444' }}
                                  title="Delete Module"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* 3. MODAL: CREATE / EDIT COURSE */}
      {/* ---------------------------------------------------------------------- */}
      {isCourseModalOpen && editingCourse && (
        <div 
          className="modal-overlay" 
          style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(0,0,0,0.85)', 
            backdropFilter: 'blur(6px)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 1000, 
            padding: '1rem' 
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsCourseModalOpen(false);
          }}
        >
          <div 
            className="modal-content glass-panel" 
            style={{ 
              maxWidth: '680px', 
              width: '100%', 
              maxHeight: '90vh', 
              overflowY: 'auto', 
              padding: '2rem', 
              borderRadius: 'var(--radius-lg, 16px)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.1))', paddingBottom: '0.85rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#FFF' }}>
                <GraduationCap size={20} style={{ color: 'var(--uipath-orange, #FA4616)' }} />
                {editingCourse.title ? `Edit Course: ${editingCourse.title}` : 'Create New Academy Course'}
              </h3>
              <button
                type="button"
                onClick={() => setIsCourseModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted, #9CA3AF)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCourseSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary, #D1D5DB)', marginBottom: '0.35rem' }}>
                  Course Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingCourse.title || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                  placeholder="e.g. UiPath Associate Developer"
                  className="input-field"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary, #D1D5DB)', marginBottom: '0.35rem' }}>
                    Course Slug (URL identifier)
                  </label>
                  <input
                    type="text"
                    value={editingCourse.slug || ''}
                    onChange={(e) => setEditingCourse({ ...editingCourse, slug: e.target.value })}
                    placeholder="e.g. uipath-associate-developer"
                    className="input-field"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary, #D1D5DB)', marginBottom: '0.35rem' }}>
                    Difficulty Level
                  </label>
                  <select
                    value={editingCourse.level || 'Beginner'}
                    onChange={(e) => setEditingCourse({ ...editingCourse, level: e.target.value as any })}
                    className="input-field"
                    style={{ width: '100%' }}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Specialist">Specialist / Agentic</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary, #D1D5DB)', marginBottom: '0.35rem' }}>
                    Estimated Hours
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={editingCourse.estimatedHours || 10}
                    onChange={(e) => setEditingCourse({ ...editingCourse, estimatedHours: parseInt(e.target.value) || 1 })}
                    className="input-field"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary, #D1D5DB)', marginBottom: '0.35rem' }}>
                    Display Order Position
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={editingCourse.orderIndex || 1}
                    onChange={(e) => setEditingCourse({ ...editingCourse, orderIndex: parseInt(e.target.value) || 1 })}
                    className="input-field"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary, #D1D5DB)', marginBottom: '0.35rem' }}>
                  Badge Text (Optional)
                </label>
                <input
                  type="text"
                  value={editingCourse.badgeText || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, badgeText: e.target.value })}
                  placeholder="e.g. UiPath Certified Track or Foundational"
                  className="input-field"
                  style={{ width: '100%' }}
                />
              </div>

              {/* Official UiPath Link (Admin Controlled) */}
              <div style={{ background: 'var(--bg-secondary, #131722)', padding: '1rem', borderRadius: 'var(--radius-md, 10px)', border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.1))' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--uipath-orange, #FA4616)', marginBottom: '0.35rem' }}>
                  Official UiPath Academy Course URL ↗
                </label>
                <input
                  type="url"
                  value={editingCourse.officialAcademyUrl || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, officialAcademyUrl: e.target.value })}
                  placeholder="https://academy.uipath.com/learning-plans/..."
                  className="input-field"
                  style={{ width: '100%' }}
                />
                <span style={{ fontSize: '0.725rem', color: 'var(--text-muted, #9CA3AF)', marginTop: '0.35rem', display: 'block', lineHeight: 1.4 }}>
                  Destination for the student-facing <strong>"Complete this course on UiPath Academy ↗"</strong> button. Opens in a new tab when clicked.
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary, #D1D5DB)', marginBottom: '0.35rem' }}>
                  Course Description / Overview
                </label>
                <textarea
                  rows={3}
                  value={editingCourse.description || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                  placeholder="Comprehensive description of the course and what students will achieve..."
                  className="input-field"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="courseIsPublished"
                  checked={editingCourse.isPublished !== false}
                  onChange={(e) => setEditingCourse({ ...editingCourse, isPublished: e.target.checked })}
                  style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                />
                <label htmlFor="courseIsPublished" style={{ fontSize: '0.85rem', color: 'var(--text-primary, #FFFFFF)', cursor: 'pointer', fontWeight: 500 }}>
                  Publish this Course (Visible on Learning Academy landing page)
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))', paddingTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  style={{ gap: '0.4rem' }}
                >
                  <Save size={15} /> Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* 4. MODAL: CREATE / EDIT MODULE */}
      {/* ---------------------------------------------------------------------- */}
      {isModuleModalOpen && editingModule && (
        <div 
          className="modal-overlay" 
          style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(0,0,0,0.85)', 
            backdropFilter: 'blur(6px)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 1000, 
            padding: '1rem' 
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModuleModalOpen(false);
          }}
        >
          <div 
            className="modal-content glass-panel" 
            style={{ 
              maxWidth: '780px', 
              width: '100%', 
              maxHeight: '90vh', 
              overflowY: 'auto', 
              padding: '2rem', 
              borderRadius: 'var(--radius-lg, 16px)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.1))', paddingBottom: '0.85rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#FFF' }}>
                <BookOpen size={20} style={{ color: 'var(--uipath-orange, #FA4616)' }} />
                {editingModule.isNew ? 'Add Module to Course' : `Edit Module: ${editingModule.module.title || ''}`}
              </h3>
              <button
                type="button"
                onClick={() => setIsModuleModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted, #9CA3AF)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveModuleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary, #D1D5DB)', marginBottom: '0.35rem' }}>
                  Module Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingModule.module.title || ''}
                  onChange={(e) => setEditingModule({ ...editingModule, module: { ...editingModule.module, title: e.target.value } })}
                  placeholder="e.g. Introduction to RPA"
                  className="input-field"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary, #D1D5DB)', marginBottom: '0.35rem' }}>
                    Module Slug
                  </label>
                  <input
                    type="text"
                    value={editingModule.module.slug || ''}
                    onChange={(e) => setEditingModule({ ...editingModule, module: { ...editingModule.module, slug: e.target.value } })}
                    placeholder="e.g. introduction-to-rpa"
                    className="input-field"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary, #D1D5DB)', marginBottom: '0.35rem' }}>
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min={5}
                    value={editingModule.module.durationMinutes || 30}
                    onChange={(e) => setEditingModule({ ...editingModule, module: { ...editingModule.module, durationMinutes: parseInt(e.target.value) || 15 } })}
                    className="input-field"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary, #D1D5DB)', marginBottom: '0.35rem' }}>
                    Display Order Position
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={editingModule.module.orderIndex || 1}
                    onChange={(e) => setEditingModule({ ...editingModule, module: { ...editingModule.module, orderIndex: parseInt(e.target.value) || 1 } })}
                    className="input-field"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary, #D1D5DB)', marginBottom: '0.35rem' }}>
                  Module Description (About this module) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingModule.module.description || editingModule.module.summary || ''}
                  onChange={(e) => setEditingModule({ ...editingModule, module: { ...editingModule.module, description: e.target.value, summary: e.target.value } })}
                  placeholder="Student-friendly explanation of what will be learned in this module..."
                  className="input-field"
                  style={{ width: '100%' }}
                />
              </div>

              {/* Official UiPath Link for this module */}
              <div style={{ background: 'var(--bg-secondary, #131722)', padding: '1rem', borderRadius: 'var(--radius-md, 10px)', border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.1))' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--uipath-orange, #FA4616)', marginBottom: '0.35rem' }}>
                  Official UiPath Academy URL for this Module ↗ (Optional)
                </label>
                <input
                  type="url"
                  value={editingModule.module.officialAcademyUrl || ''}
                  onChange={(e) => setEditingModule({ ...editingModule, module: { ...editingModule.module, officialAcademyUrl: e.target.value } })}
                  placeholder="https://academy.uipath.com/courses/..."
                  className="input-field"
                  style={{ width: '100%' }}
                />
                <span style={{ fontSize: '0.725rem', color: 'var(--text-muted, #9CA3AF)', marginTop: '0.25rem', display: 'block' }}>
                  If omitted, automatically falls back to the parent course's official UiPath Academy URL.
                </span>
              </div>

              {/* YouTube Video Section */}
              <div style={{ background: 'var(--bg-secondary, #131722)', padding: '1rem', borderRadius: 'var(--radius-md, 10px)', border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.1))', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--uipath-orange, #FA4616)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Youtube size={14} /> YouTube Video
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary, #D1D5DB)', marginBottom: '0.25rem' }}>
                      YouTube Video URL
                    </label>
                    <input
                      type="url"
                      value={editingModule.module.youtubeUrl || editingModule.module.videoUrl || ''}
                      onChange={(e) => setEditingModule({ ...editingModule, module: { ...editingModule.module, youtubeUrl: e.target.value, videoUrl: e.target.value } })}
                      placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                      className="input-field"
                      style={{ width: '100%', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary, #D1D5DB)', marginBottom: '0.25rem' }}>
                      Duration Label (Optional)
                    </label>
                    <input
                      type="text"
                      value={editingModule.module.videoDuration || ''}
                      onChange={(e) => setEditingModule({ ...editingModule, module: { ...editingModule.module, videoDuration: e.target.value } })}
                      placeholder="e.g. 15 mins"
                      className="input-field"
                      style={{ width: '100%', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                {/* YouTube Thumbnail Preview */}
                {editingModule.module.youtubeUrl && getYouTubeId(editingModule.module.youtubeUrl) && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-primary, #0B0E14)', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))' }}>
                    <img
                      src={`https://img.youtube.com/vi/${getYouTubeId(editingModule.module.youtubeUrl)}/mqdefault.jpg`}
                      alt="YouTube Thumbnail Preview"
                      style={{ width: '90px', height: '52px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#4ADE80' }}>
                        ✓ YouTube Video Detected
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted, #9CA3AF)' }}>
                        Thumbnail and play action will render in student view.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Templates & Resources Section */}
              <div style={{ background: 'var(--bg-secondary, #131722)', padding: '1.25rem', borderRadius: 'var(--radius-md, 10px)', border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.1))', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--uipath-orange, #FA4616)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <FileCode size={14} /> Templates & Downloadable Resources
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const curResources = editingModule.module.resources || [];
                      setEditingModule({
                        ...editingModule,
                        module: {
                          ...editingModule.module,
                          resources: [
                            ...curResources,
                            {
                              id: `res_${Date.now()}`,
                              title: '',
                              type: 'xaml',
                              url: '',
                              description: ''
                            }
                          ]
                        }
                      });
                    }}
                    style={{
                      background: 'rgba(250, 70, 22, 0.15)',
                      border: '1px solid rgba(250, 70, 22, 0.3)',
                      color: 'var(--uipath-orange, #FA4616)',
                      borderRadius: '6px',
                      padding: '0.25rem 0.65rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <Plus size={12} /> Add Resource
                  </button>
                </div>

                {(!editingModule.module.resources || editingModule.module.resources.length === 0) ? (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted, #9CA3AF)', margin: 0 }}>
                    No resources added. Click "+ Add Resource" to attach XAML workflows, PDF guides, ZIP files, code templates, or external links.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {editingModule.module.resources.map((res, rIdx) => {
                      const isResFirst = rIdx === 0;
                      const isResLast = rIdx === (editingModule.module.resources?.length || 1) - 1;

                      return (
                        <div
                          key={res.id || rIdx}
                          style={{
                            background: 'var(--bg-primary, #0B0E14)',
                            border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))',
                            borderRadius: '8px',
                            padding: '0.85rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.6rem'
                          }}
                        >
                          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto auto', gap: '0.5rem', alignItems: 'center' }}>
                            <input
                              type="text"
                              required
                              placeholder="Resource Title (e.g. Starter_Workflow.xaml)"
                              value={res.title}
                              onChange={(e) => {
                                const updated = [...(editingModule.module.resources || [])];
                                updated[rIdx] = { ...updated[rIdx], title: e.target.value };
                                setEditingModule({ ...editingModule, module: { ...editingModule.module, resources: updated } });
                              }}
                              className="input-field"
                              style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
                            />

                            <select
                              value={res.type}
                              onChange={(e) => {
                                const updated = [...(editingModule.module.resources || [])];
                                updated[rIdx] = { ...updated[rIdx], type: e.target.value };
                                setEditingModule({ ...editingModule, module: { ...editingModule.module, resources: updated } });
                              }}
                              className="input-field"
                              style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
                            >
                              <option value="xaml">.XAML Workflow</option>
                              <option value="zip">.ZIP Archive</option>
                              <option value="pdf">.PDF Document</option>
                              <option value="link">External Link</option>
                              <option value="code">Source Code / Template</option>
                              <option value="other">Other Resource</option>
                            </select>

                            {/* Reorder Resource buttons */}
                            <div style={{ display: 'flex', gap: '0.15rem' }}>
                              <button
                                type="button"
                                disabled={isResFirst}
                                onClick={() => {
                                  if (isResFirst) return;
                                  const updated = [...(editingModule.module.resources || [])];
                                  const temp = updated[rIdx];
                                  updated[rIdx] = updated[rIdx - 1];
                                  updated[rIdx - 1] = temp;
                                  setEditingModule({ ...editingModule, module: { ...editingModule.module, resources: updated } });
                                }}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: isResFirst ? '#4B5563' : '#9CA3AF',
                                  cursor: isResFirst ? 'not-allowed' : 'pointer',
                                  padding: '0.2rem'
                                }}
                                title="Move Up"
                              >
                                <ArrowUp size={12} />
                              </button>
                              <button
                                type="button"
                                disabled={isResLast}
                                onClick={() => {
                                  if (isResLast) return;
                                  const updated = [...(editingModule.module.resources || [])];
                                  const temp = updated[rIdx];
                                  updated[rIdx] = updated[rIdx + 1];
                                  updated[rIdx + 1] = temp;
                                  setEditingModule({ ...editingModule, module: { ...editingModule.module, resources: updated } });
                                }}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: isResLast ? '#4B5563' : '#9CA3AF',
                                  cursor: isResLast ? 'not-allowed' : 'pointer',
                                  padding: '0.2rem'
                                }}
                                title="Move Down"
                              >
                                <ArrowDown size={12} />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                const updated = (editingModule.module.resources || []).filter((_, i) => i !== rIdx);
                                setEditingModule({ ...editingModule, module: { ...editingModule.module, resources: updated } });
                              }}
                              className="btn btn-secondary btn-sm"
                              style={{ color: '#EF4444', padding: '0.35rem 0.45rem' }}
                              title="Remove Resource"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.5rem' }}>
                            <input
                              type="url"
                              required
                              placeholder="Resource Download / Access URL (e.g. https://...)"
                              value={res.url}
                              onChange={(e) => {
                                const updated = [...(editingModule.module.resources || [])];
                                updated[rIdx] = { ...updated[rIdx], url: e.target.value };
                                setEditingModule({ ...editingModule, module: { ...editingModule.module, resources: updated } });
                              }}
                              className="input-field"
                              style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
                            />

                            <input
                              type="text"
                              placeholder="Optional description / note"
                              value={res.description || ''}
                              onChange={(e) => {
                                const updated = [...(editingModule.module.resources || [])];
                                updated[rIdx] = { ...updated[rIdx], description: e.target.value };
                                setEditingModule({ ...editingModule, module: { ...editingModule.module, resources: updated } });
                              }}
                              className="input-field"
                              style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="moduleIsPublished"
                  checked={editingModule.module.isPublished !== false}
                  onChange={(e) => setEditingModule({ ...editingModule, module: { ...editingModule.module, isPublished: e.target.checked } })}
                  style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                />
                <label htmlFor="moduleIsPublished" style={{ fontSize: '0.85rem', color: 'var(--text-primary, #FFFFFF)', cursor: 'pointer', fontWeight: 500 }}>
                  Publish this Module (Visible to students)
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))', paddingTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModuleModalOpen(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  style={{ gap: '0.4rem' }}
                >
                  <Save size={15} /> Save Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
