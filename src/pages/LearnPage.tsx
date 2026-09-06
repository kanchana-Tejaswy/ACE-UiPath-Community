import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Clock, 
  Zap, 
  Code, 
  Cpu, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  Download, 
  PlayCircle,
  FileCode,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { LearningPath, LearningModule } from '../types';

interface Props {
  learningPaths: LearningPath[];
  selectedModuleSlug?: string;
  completedModuleIds?: string[];
  onToggleModuleCompletion?: (moduleId: string) => void;
  onNavigate: (view: string, detailId?: string) => void;
}

export const LearnPage: React.FC<Props> = ({
  learningPaths,
  selectedModuleSlug,
  completedModuleIds = [],
  onToggleModuleCompletion,
  onNavigate
}) => {
  // Find track and module matching selectedModuleSlug if provided
  let initialPath = learningPaths[0];
  let initialModule = learningPaths[0]?.modules[0];
  let isInvalidSlug = false;

  if (selectedModuleSlug) {
    let found = false;
    for (const path of learningPaths) {
      if (path.slug === selectedModuleSlug || path.id === selectedModuleSlug) {
        initialPath = path;
        initialModule = path.modules[0];
        found = true;
        break;
      }
      const modMatch = path.modules.find((m) => m.slug === selectedModuleSlug || m.id === selectedModuleSlug);
      if (modMatch) {
        initialPath = path;
        initialModule = modMatch;
        found = true;
        break;
      }
    }
    if (!found) {
      isInvalidSlug = true;
    }
  }

  const [selectedPathId, setSelectedPathId] = useState<string>(initialPath?.id || '');
  const [selectedModuleId, setSelectedModuleId] = useState<string>(initialModule?.id || '');

  // Keep state in sync if selectedModuleSlug changes
  useEffect(() => {
    if (selectedModuleSlug) {
      for (const path of learningPaths) {
        if (path.slug === selectedModuleSlug || path.id === selectedModuleSlug) {
          setSelectedPathId(path.id);
          if (path.modules.length > 0) setSelectedModuleId(path.modules[0].id);
          return;
        }
        const modMatch = path.modules.find((m) => m.slug === selectedModuleSlug || m.id === selectedModuleSlug);
        if (modMatch) {
          setSelectedPathId(path.id);
          setSelectedModuleId(modMatch.id);
          return;
        }
      }
    }
  }, [selectedModuleSlug, learningPaths]);

  const activePath = learningPaths.find((p) => p.id === selectedPathId) || learningPaths[0];
  const activeModule = activePath?.modules.find((m) => m.id === selectedModuleId) || activePath?.modules[0];

  const getPathIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return Zap;
      case 'Code': return Code;
      case 'Cpu': return Cpu;
      default: return Sparkles;
    }
  };

  const renderMarkdown = (md: string) => {
    if (!md) return '';
    
    // 1. Extract fenced code blocks with language support
    const codeBlocks: string[] = [];
    let processed = md.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (_, lang, code) => {
      const escapedCode = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      const isXml = lang.toLowerCase() === 'xml' || lang.toLowerCase() === 'xaml';
      const isCs = lang.toLowerCase() === 'csharp' || lang.toLowerCase() === 'c#';
      const borderColor = isCs ? 'rgba(255, 255, 255, 0.12)' : isXml ? 'rgba(250, 70, 22, 0.35)' : 'var(--border-subtle)';
      const textColor = isCs ? '#E5E7EB' : isXml ? '#FDBA74' : 'var(--text-primary)';
      const blockHtml = `<pre style="background:#111111;border:1px solid ${borderColor};padding:1.15rem;border-radius:8px;overflow-x:auto;margin:1.25rem 0;font-family:var(--font-mono);font-size:0.875rem;line-height:1.5;color:${textColor}"><code>${escapedCode.trim()}</code></pre>`;
      const idx = codeBlocks.length;
      codeBlocks.push(blockHtml);
      return `__CODE_BLOCK_${idx}__`;
    });

    // 2. Headings
    processed = processed.replace(/^# (.*$)/gim, '<h3 style="color:#FFF;margin-top:1.5rem;margin-bottom:0.75rem;font-size:1.35rem;font-weight:700;">$1</h3>');
    processed = processed.replace(/^## (.*$)/gim, '<h4 style="color:#FFF;margin-top:1.25rem;margin-bottom:0.6rem;font-size:1.15rem;font-weight:600;">$1</h4>');
    processed = processed.replace(/^### (.*$)/gim, '<h5 style="color:#FED7AA;margin-top:1.25rem;margin-bottom:0.5rem;font-size:1.05rem;font-weight:600;">$1</h5>');

    // 3. Bold & inline code
    processed = processed.replace(/\\*\\*(.*?)\\*\\*/g, '<strong style="color:var(--text-primary);font-weight:600;">$1</strong>');
    processed = processed.replace(/`([^`]+)`/g, '<code style="background:#1A1A1A;color:#FDBA74;padding:2px 6px;border-radius:4px;font-size:0.875em;border:1px solid var(--border-subtle);">$1</code>');

    // 4. Split into blocks by double newlines for paragraphs and lists
    const blocks = processed.split(/\\n\\s*\\n/);
    const renderedBlocks = blocks.map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('__CODE_BLOCK_') || trimmed.startsWith('<h3') || trimmed.startsWith('<h4') || trimmed.startsWith('<h5')) {
        return trimmed;
      }
      const lines = trimmed.split('\\n');
      const isList = lines.every(l => /^\\s*([*\\-]|\d+\\.)\\s+/.test(l));
      if (isList) {
        const listItems = lines.map(l => {
          const itemText = l.replace(/^\\s*([*\\-]|\d+\\.)\\s+/, '');
          return `<li style="margin-bottom:0.4rem;color:var(--text-secondary);">${itemText}</li>`;
        }).join('');
        return `<ul style="margin:0.75rem 0 1.25rem 1.5rem;list-style-type:disc;">${listItems}</ul>`;
      }
      return `<p style="margin-bottom:1rem;line-height:1.75;color:var(--text-secondary);">${trimmed.replace(/\\n/g, ' ')}</p>`;
    });

    let finalHtml = renderedBlocks.join('\\n');

    // 5. Reinsert code blocks
    codeBlocks.forEach((blockHtml, idx) => {
      finalHtml = finalHtml.replace(`__CODE_BLOCK_${idx}__`, blockHtml);
    });

    return finalHtml;
  };

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '3rem' }}>
        <span className="badge badge-orange" style={{ marginBottom: '0.5rem' }}>
          UiPath Student Academy
        </span>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, marginBottom: '1rem' }}>
          Structured UiPath Automation Roadmaps
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '820px' }}>
          Zero-to-hero learning curricula curated specifically for engineering students. Select a track, master enterprise RPA concepts, and download starter `.XAML` workflows.
        </p>
      </div>

      {/* "Where should I start?" Guidance Section */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        marginBottom: '2.5rem'
      }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--uipath-orange)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
          RECOMMENDED STARTING POINT
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
          Where should you start?
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1rem'
        }}>
          <div
            onClick={() => {
              const p = learningPaths.find((lp) => lp.level === 'Beginner') || learningPaths[0];
              if (p) {
                setSelectedPathId(p.id);
                if (p.modules.length > 0) setSelectedModuleId(p.modules[0].id);
              }
            }}
            style={{
              padding: '1.25rem',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-green">New to automation?</span>
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              Beginner: StudioX Track
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              No complex coding needed. Automate Excel, Gmail, and routine desktop tasks.
            </p>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--uipath-orange)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              Start Beginner Track <ArrowRight size={13} />
            </span>
          </div>

          <div
            onClick={() => {
              const p = learningPaths.find((lp) => lp.level === 'Intermediate') || learningPaths[1] || learningPaths[0];
              if (p) {
                setSelectedPathId(p.id);
                if (p.modules.length > 0) setSelectedModuleId(p.modules[0].id);
              }
            }}
            style={{
              padding: '1.25rem',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-neutral">Know the basics?</span>
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              Intermediate: Studio & Queues
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Master modern selectors, UI automation, and Orchestrator transactions.
            </p>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--uipath-orange)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              Continue Intermediate <ArrowRight size={13} />
            </span>
          </div>

          <div
            onClick={() => {
              const p = learningPaths.find((lp) => lp.level === 'Advanced' || lp.level === 'Specialist') || learningPaths[2] || learningPaths[0];
              if (p) {
                setSelectedPathId(p.id);
                if (p.modules.length > 0) setSelectedModuleId(p.modules[0].id);
              }
            }}
            style={{
              padding: '1.25rem',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-orange">Ready for enterprise?</span>
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              Advanced: REFramework & AI
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Build transactional State Machines, Document Understanding ML, and scalable bots.
            </p>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#FDBA74', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              Open Architect Track <ArrowRight size={13} />
            </span>
          </div>
        </div>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem',
        marginBottom: '2.5rem'
      }}>
        {learningPaths.map((path) => {
          const Icon = getPathIcon(path.iconName);
          const isSelected = path.id === selectedPathId;
          const completedCount = path.modules.filter((m) => completedModuleIds.includes(m.id)).length;
          const progressPercent = path.modules.length > 0 ? Math.round((completedCount / path.modules.length) * 100) : 0;

          return (
            <div
              key={path.id}
              onClick={() => {
                setSelectedPathId(path.id);
                if (path.modules.length > 0) {
                  setSelectedModuleId(path.modules[0].id);
                  const targetSlug = path.modules[0].slug || path.modules[0].id;
                  onNavigate('learn', targetSlug);
                } else {
                  onNavigate('learn', path.slug || path.id);
                }
              }}
              className="glass-card"
              style={{
                padding: '1.25rem',
                cursor: 'pointer',
                background: isSelected ? 'var(--bg-surface)' : 'var(--bg-tertiary)',
                borderColor: isSelected ? 'var(--uipath-orange)' : 'var(--border-subtle)',
                boxShadow: isSelected ? 'var(--shadow-glow)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: isSelected ? 'var(--uipath-orange)' : 'var(--bg-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isSelected ? '#FFFFFF' : 'var(--uipath-orange)'
                }}>
                  <Icon size={18} />
                </div>
                <span className="badge badge-slate" style={{ fontSize: '0.65rem' }}>
                  {path.level}
                </span>
              </div>

              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                {path.title}
              </h4>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                {path.estimatedHours} Hours • {completedCount}/{path.modules.length} Completed ({progressPercent}%)
              </div>

              {/* Progress Rail */}
              <div style={{ width: '100%', height: '4px', background: 'var(--bg-secondary)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--uipath-orange)', transition: 'width var(--transition-smooth)' }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Track & Module Workspace (2 Columns: Module List & Active Content) */}
      {activePath && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '320px minmax(0, 1fr)',
          gap: '2rem'
        }} className="learn-workspace">
          {/* Module Nav Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Track Modules</h3>
                <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                  Target: {activePath.targetAudience}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {activePath.modules.map((mod, mIdx) => {
                  const isModSelected = mod.id === activeModule?.id;
                  return (
                    <div
                      key={mod.id}
                      onClick={() => {
                        setSelectedModuleId(mod.id);
                        onNavigate('learn', mod.slug || mod.id);
                      }}
                      style={{
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        background: isModSelected ? 'var(--uipath-orange-subtle)' : 'var(--bg-tertiary)',
                        border: isModSelected ? '1px solid var(--uipath-orange)' : '1px solid transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <span style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          background: isModSelected ? 'var(--uipath-orange)' : 'var(--bg-surface)',
                          color: isModSelected ? '#FFF' : 'var(--text-muted)',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {mIdx + 1}
                        </span>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem', color: isModSelected ? '#FFF' : 'var(--text-primary)' }}>
                            {mod.title.split(':')[1] || mod.title}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            {mod.durationMinutes} mins • {mod.uipathTool}
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={14} style={{ color: isModSelected ? 'var(--uipath-orange)' : 'var(--text-muted)' }} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Official Certification Card */}
            <div className="glass-panel" style={{ padding: '1.25rem', background: 'linear-gradient(135deg, rgba(28, 10, 4, 0.8) 0%, rgba(13, 15, 22, 0.9) 100%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <GraduationCap size={16} style={{ color: 'var(--uipath-orange)' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FED7AA' }}>UiPath Certification</span>
              </div>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
                Completing this track prepares you for the official <strong>UiPath Certified Professional (UiRPA)</strong> exam.
              </p>
              <button onClick={() => onNavigate('resources')} className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                View Mock Exam Papers
              </button>
            </div>
          </div>

          {/* Active Module Lesson Reader */}
          {activeModule && (
            <div className="glass-panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Module Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <span className="badge badge-orange">{activeModule.uipathTool}</span>
                    <span className="badge badge-neutral">{activeModule.level}</span>
                    <span className="badge badge-slate">{activeModule.durationMinutes} Minutes</span>
                    {completedModuleIds.includes(activeModule.id) && (
                      <span className="badge badge-green">Completed</span>
                    )}
                  </div>
                  <h2 style={{ fontSize: '1.85rem', marginBottom: '0.75rem' }}>{activeModule.title}</h2>
                  <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>{activeModule.summary}</p>
                </div>

                <button
                  onClick={() => onToggleModuleCompletion && onToggleModuleCompletion(activeModule.id)}
                  className={`btn ${completedModuleIds.includes(activeModule.id) ? 'btn-secondary' : 'btn-primary'}`}
                  style={{ gap: '0.4rem' }}
                >
                  <CheckCircle2 size={16} style={{ color: completedModuleIds.includes(activeModule.id) ? '#10B981' : '#FFF' }} />
                  <span>{completedModuleIds.includes(activeModule.id) ? 'Marked Complete' : 'Mark Lesson Complete'}</span>
                </button>
              </div>

              {/* Starter Code Download Action */}
              {activeModule.starterCodeUrl && (
                <div style={{
                  padding: '1.25rem',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <FileCode size={24} style={{ color: 'var(--uipath-orange)' }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Starter Workflow Project (.XAML)</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pre-configured skeleton ready to open in UiPath Studio</div>
                    </div>
                  </div>
                  <a
                    href={activeModule.starterCodeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary btn-sm"
                  >
                    <Download size={14} /> Download Starter .XAML
                  </a>
                </div>
              )}

              {/* Lesson Markdown Content */}
              <div className="markdown-body" style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7 }}>
                <div dangerouslySetInnerHTML={{
                  __html: renderMarkdown(activeModule.contentMd)
                }} />
              </div>

              {/* Practice Exercise */}
              {activeModule.practiceExerciseMd && (
                <div style={{
                  padding: '1.5rem',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <h4 style={{ color: '#34D399', fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={16} /> Hands-on Practice Lab
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {activeModule.practiceExerciseMd}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .learn-workspace {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
