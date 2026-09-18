import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Video, 
  UploadCloud, 
  Trash2, 
  RefreshCw, 
  Youtube, 
  Github, 
  Download, 
  ExternalLink, 
  Users, 
  Sparkles, 
  Save, 
  Plus, 
  Star, 
  Image as ImageIcon,
  Cpu, 
  Layers, 
  Linkedin, 
  TrendingUp, 
  FileCode, 
  AlertCircle,
  Tag,
  CheckCircle2
} from 'lucide-react';
import { ProjectShowcase } from '../types';

interface Props {
  isOpen: boolean;
  project: ProjectShowcase | null;
  onClose: () => void;
  onSave: (project: ProjectShowcase) => void;
}

const ARCHITECTURE_OPTIONS = [
  'REFramework (Robotic Enterprise Framework)',
  'Linear Sequential Workflow',
  'State Machine',
  'Dispatcher / Performer Model',
  'Attended Assistant'
];

const AUTOMATION_TYPES = [
  'Studio Desktop Automation',
  'Document Understanding (IDP)',
  'API / Web Automation',
  'AI Center Model Integration',
  'Excel & Database Automation',
  'Test Suite Automation'
];

const PRESET_THUMBNAILS = [
  { label: 'Analytics Dashboard', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80' },
  { label: 'Invoice Processing IDP', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80' },
  { label: 'RPA Bot Console', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80' },
  { label: 'AI Machine Learning', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80' }
];

export const ProjectEditorModal: React.FC<Props> = ({
  isOpen,
  project,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<ProjectShowcase | null>(null);
  const [videoTab, setVideoTab] = useState<'url' | 'upload'>('url');
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [newContributorInput, setNewContributorInput] = useState<string>('');
  const [videoUploadError, setVideoUploadError] = useState<string | null>(null);
  const [isDraggingVideo, setIsDraggingVideo] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);

  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (project) {
      setFormData({
        ...project,
        workflowArchitecture: project.workflowArchitecture || ARCHITECTURE_OPTIONS[0],
        automationType: project.automationType || ['Studio Desktop Automation'],
        contributors: project.contributors || [],
        thumbnailUrl: project.thumbnailUrl || project.previewImages?.[0] || PRESET_THUMBNAILS[0].url
      });
      setIsFeatured(project.status === 'Featured');
      setIsDirty(false);
      setVideoUploadError(null);
    }
  }, [project, isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !formData) return null;

  const updateField = <K extends keyof ProjectShowcase>(field: K, value: ProjectShowcase[K]) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
    setIsDirty(true);
  };

  // Helper to parse Video Embed URLs
  const getEmbedUrl = (url?: string): { type: 'youtube' | 'loom' | 'direct' | 'none'; embedUrl: string } => {
    if (!url || !url.trim()) return { type: 'none', embedUrl: '' };
    const trimmed = url.trim();

    // YouTube
    const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch && ytMatch[1]) {
      return { type: 'youtube', embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}` };
    }

    // Loom
    const loomMatch = trimmed.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/);
    if (loomMatch && loomMatch[1]) {
      return { type: 'loom', embedUrl: `https://www.loom.com/embed/${loomMatch[1]}` };
    }

    // Direct Video (mp4, webm, blob, data URL)
    if (trimmed.startsWith('data:video') || trimmed.startsWith('blob:') || /\.(mp4|webm|ogg|mov)($|\?)/i.test(trimmed)) {
      return { type: 'direct', embedUrl: trimmed };
    }

    return { type: 'direct', embedUrl: trimmed };
  };

  const parsedVideo = getEmbedUrl(formData.videoDemoUrl);

  // Video File Processing (Max 50MB)
  const processVideoFile = (file: File) => {
    setVideoUploadError(null);
    const validFormats = ['video/mp4', 'video/webm', 'video/quicktime', 'video/ogg'];
    if (!validFormats.includes(file.type)) {
      setVideoUploadError('Unsupported format. Please upload MP4, WebM, or MOV video.');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setVideoUploadError(`Video too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max allowed is 50MB.`);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    updateField('videoDemoUrl', objectUrl);
  };

  const handleVideoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingVideo(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processVideoFile(e.dataTransfer.files[0]);
    }
  };

  // Thumbnail File Processing
  const processThumbnailFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert('Thumbnail image too large (Max 5MB).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const res = e.target?.result as string;
      if (res) {
        updateField('thumbnailUrl', res);
        updateField('previewImages', [res]);
      }
    };
    reader.readAsDataURL(file);
  };

  // Toggle Automation Type Pill
  const toggleAutomationType = (type: string) => {
    const current = Array.isArray(formData.automationType) 
      ? formData.automationType 
      : formData.automationType ? [formData.automationType] : [];
    
    let updated: string[];
    if (current.includes(type)) {
      updated = current.filter((t) => t !== type);
    } else {
      updated = [...current, type];
    }
    updateField('automationType', updated);
  };

  // Contributors Tag Management
  const handleAddContributor = () => {
    if (!newContributorInput.trim()) return;
    const current = formData.contributors || [];
    if (!current.includes(newContributorInput.trim())) {
      updateField('contributors', [...current, newContributorInput.trim()]);
    }
    setNewContributorInput('');
  };

  const handleRemoveContributor = (index: number) => {
    const current = formData.contributors || [];
    updateField('contributors', current.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Project name is required');
      return;
    }
    if (!formData.authorName.trim()) {
      alert('Lead student name is required');
      return;
    }

    const projectToSave: ProjectShowcase = {
      ...formData,
      status: isFeatured ? 'Featured' : (formData.status === 'Featured' ? 'Approved' : formData.status || 'Approved'),
      slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      previewImages: formData.thumbnailUrl ? [formData.thumbnailUrl] : formData.previewImages
    };

    onSave(projectToSave);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="max-w-3xl w-full max-h-[92vh] overflow-y-auto bg-[#121214] border border-neutral-800 rounded-2xl shadow-2xl p-6 md:p-8 text-neutral-100 flex flex-col justify-between relative"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 #121214' }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-5 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#FA4616]">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                {formData.id.startsWith('proj_') && !formData.title ? 'Create Student Automation Project' : 'Edit Student Project Details'}
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Showcase video demos, architecture blueprints, repository links, and team credits.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl border border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white hover:bg-neutral-800 flex items-center justify-center transition-all cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-6 pt-6 pb-2">
          
          {/* SECTION 1: PROJECT HEADER & TAGLINE */}
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                Project Name / Bot Title <span className="text-[#FA4616]">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="e.g., Enterprise Grade Extractor & Autonomous Result Mailer"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                Tagline / Pitch
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => updateField('tagline', e.target.value)}
                placeholder="e.g., Built with UiPath REFramework & Document Understanding for Examination Cell"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>
          </div>

          {/* SECTION 2: VIDEO DEMO & MEDIA EMBED CONTAINER */}
          <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-4 md:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Video size={16} className="text-[#FA4616]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
                  Project Demo Video & Live Embed
                </span>
              </div>
              <span className="text-[11px] text-neutral-400">
                16:9 Aspect Ratio • YouTube / Loom or Direct MP4 (Max 50MB)
              </span>
            </div>

            {/* Video Segmented Toggle */}
            <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
              <button
                type="button"
                onClick={() => setVideoTab('url')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${videoTab === 'url' ? 'bg-[#FA4616]/10 text-orange-400 border border-orange-500/30' : 'text-neutral-400 hover:text-white bg-neutral-900/60'}`}
              >
                <Youtube size={14} /> YouTube / Loom URL
              </button>
              <button
                type="button"
                onClick={() => setVideoTab('upload')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${videoTab === 'upload' ? 'bg-[#FA4616]/10 text-orange-400 border border-orange-500/30' : 'text-neutral-400 hover:text-white bg-neutral-900/60'}`}
              >
                <UploadCloud size={14} /> Direct Video Upload (MP4/WebM)
              </button>
            </div>

            {/* URL Input */}
            {videoTab === 'url' && (
              <div className="space-y-2">
                <input
                  type="url"
                  value={formData.videoDemoUrl || ''}
                  onChange={(e) => updateField('videoDemoUrl', e.target.value)}
                  placeholder="e.g., https://youtu.be/dQw4w9WgXcQ or https://loom.com/share/..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 transition-all font-mono text-xs"
                />
              </div>
            )}

            {/* Upload Dropzone */}
            {videoTab === 'upload' && (
              <div>
                <input
                  type="file"
                  ref={videoFileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      processVideoFile(e.target.files[0]);
                    }
                  }}
                  accept="video/mp4,video/webm,video/quicktime,video/ogg"
                  className="hidden"
                />
                <div
                  onClick={() => videoFileInputRef.current?.click()}
                  onDrop={handleVideoDrop}
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingVideo(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDraggingVideo(false); }}
                  className={`border-dashed border-2 rounded-xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                    isDraggingVideo 
                      ? 'border-orange-500 bg-orange-500/10' 
                      : 'border-neutral-700 hover:border-orange-500/60 bg-neutral-950/60'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center text-orange-400">
                    <UploadCloud size={22} />
                  </div>
                  <div className="text-sm font-semibold text-neutral-200">
                    Click to browse or drop project demo video here
                  </div>
                  <div className="text-xs text-neutral-400">
                    Supports MP4, WebM, MOV up to 50MB
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {videoUploadError && (
              <div className="flex items-center gap-2 p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">
                <AlertCircle size={14} className="shrink-0" />
                <span>{videoUploadError}</span>
              </div>
            )}

            {/* Live Video Player Preview */}
            {formData.videoDemoUrl && parsedVideo.type !== 'none' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-300">Live Video Preview</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (videoTab === 'upload') {
                          videoFileInputRef.current?.click();
                        } else {
                          updateField('videoDemoUrl', '');
                        }
                      }}
                      className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-750 text-xs flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <RefreshCw size={12} /> Change Video
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('videoDemoUrl', '')}
                      className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/40 text-xs flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden border border-neutral-800 bg-black aspect-video max-h-56 w-full relative flex items-center justify-center shadow-inner">
                  {parsedVideo.type === 'youtube' || parsedVideo.type === 'loom' ? (
                    <iframe
                      src={parsedVideo.embedUrl}
                      title="Project Demo Video"
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={parsedVideo.embedUrl}
                      controls
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Poster / Thumbnail Fallback */}
            <div className="pt-3 border-t border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <ImageIcon size={13} className="text-[#FA4616]" /> Project Poster / Thumbnail Fallback (1280 × 720 px)
                </label>
                <input
                  type="file"
                  ref={thumbnailFileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      processThumbnailFile(e.target.files[0]);
                    }
                  }}
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => thumbnailFileInputRef.current?.click()}
                  className="text-xs text-orange-400 hover:text-orange-300 font-semibold cursor-pointer"
                >
                  Upload Thumbnail File
                </button>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={formData.thumbnailUrl || ''}
                  onChange={(e) => {
                    updateField('thumbnailUrl', e.target.value);
                    updateField('previewImages', [e.target.value]);
                  }}
                  placeholder="https://example.com/thumbnail.jpg"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 transition-all font-mono text-xs"
                />
                {formData.thumbnailUrl && (
                  <div className="w-16 h-10 rounded-lg overflow-hidden border border-neutral-700 bg-neutral-950 shrink-0">
                    <img
                      src={formData.thumbnailUrl}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                {PRESET_THUMBNAILS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      updateField('thumbnailUrl', preset.url);
                      updateField('previewImages', [preset.url]);
                    }}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${formData.thumbnailUrl === preset.url ? 'bg-orange-500/20 text-orange-300 border-orange-500/40 font-semibold' : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700'}`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 3: DETAILED TECHNICAL EXPLANATION & ARCHITECTURE */}
          <div className="space-y-4 bg-neutral-900/40 border border-neutral-800 rounded-xl p-4 md:p-5">
            <div className="flex items-center gap-2">
              <Cpu size={16} className="text-[#FA4616]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
                Technical Architecture & Deep-Dive
              </span>
            </div>

            {/* Architecture Type & ROI in 2-Column */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Workflow Architecture Type
                </label>
                <select
                  value={formData.workflowArchitecture}
                  onChange={(e) => updateField('workflowArchitecture', e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-sm text-neutral-100 focus:outline-none focus:border-orange-500 transition-all cursor-pointer font-medium"
                >
                  {ARCHITECTURE_OPTIONS.map((arch) => (
                    <option key={arch} value={arch}>{arch}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5">
                  <TrendingUp size={13} className="text-[#FA4616]" /> Measured ROI / Business Impact
                </label>
                <input
                  type="text"
                  value={formData.roiMetrics}
                  onChange={(e) => updateField('roiMetrics', e.target.value)}
                  placeholder="e.g., Saves 35 hours/month • 99.8% Accuracy"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-sm text-neutral-100 focus:outline-none focus:border-orange-500 transition-all font-medium text-emerald-400"
                />
              </div>
            </div>

            {/* Package & Automation Type Pills */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
                <Layers size={13} className="text-[#FA4616]" /> Package & Automation Capabilities (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {AUTOMATION_TYPES.map((type) => {
                  const isSelected = Array.isArray(formData.automationType)
                    ? formData.automationType.includes(type)
                    : formData.automationType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleAutomationType(type)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected 
                          ? 'bg-[#FA4616]/20 border-orange-500/50 text-orange-300 font-semibold shadow-sm' 
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                      }`}
                    >
                      {isSelected && <CheckCircle2 size={12} className="text-[#FA4616]" />}
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Problem Statement Box */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                Problem Statement & Friction Solved
              </label>
              <textarea
                rows={2}
                value={formData.problemStatement}
                onChange={(e) => updateField('problemStatement', e.target.value)}
                placeholder="Explain the manual operational friction, repetitive administrative bottleneck, or student process targeted..."
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 transition-all resize-none"
              />
            </div>

            {/* Detailed Solution & How It Works */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Detailed Solution & How It Works
                </label>
                <span className="text-[11px] text-neutral-400 italic">
                  Explain bot workflow steps, triggers, exceptions handling, and decision points.
                </span>
              </div>
              <textarea
                rows={4}
                value={formData.solutionDescription}
                onChange={(e) => updateField('solutionDescription', e.target.value)}
                placeholder="Step 1: Dispatcher reads transactions from Orchestrator queue.&#10;Step 2: Performer opens UiPath Document Understanding model to extract student grades.&#10;Step 3: Handles Business Rule Exceptions vs System Exceptions with automatic retry..."
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 transition-all resize-none font-mono text-xs leading-relaxed"
              />
            </div>

            {/* Tools Used Comma Separated */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5">
                <Tag size={13} className="text-[#FA4616]" /> UiPath Tools & Libraries Used (comma-separated)
              </label>
              <input
                type="text"
                value={formData.uipathToolsUsed.join(', ')}
                onChange={(e) => updateField('uipathToolsUsed', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
                placeholder="UiPath Studio, REFramework, Orchestrator Queues, Document Understanding"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-sm text-neutral-100 focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>
          </div>

          {/* SECTION 4: ARTIFACTS, CODE REPOSITORY & VERIFICATION */}
          <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-4 md:p-5 space-y-3.5">
            <div className="flex items-center gap-2">
              <FileCode size={16} className="text-[#FA4616]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
                Proof-of-Work Links & Repository Artifacts
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* GitHub Repository */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5">
                  <Github size={13} className="text-neutral-300" /> GitHub / Source Repository URL
                </label>
                <input
                  type="url"
                  value={formData.repoUrl || ''}
                  onChange={(e) => updateField('repoUrl', e.target.value)}
                  placeholder="https://github.com/username/project-repo"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 transition-all font-mono text-xs"
                />
              </div>

              {/* UiPath Package / Drive Link */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5">
                  <Download size={13} className="text-[#FA4616]" /> UiPath Package (.nupkg / .xaml) / Drive Link
                </label>
                <input
                  type="url"
                  value={formData.packageDownloadUrl || ''}
                  onChange={(e) => updateField('packageDownloadUrl', e.target.value)}
                  placeholder="https://drive.google.com/... or download URL"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 transition-all font-mono text-xs"
                />
              </div>
            </div>

            {/* Live Demo / Webhook Endpoint */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5">
                <ExternalLink size={13} className="text-[#FA4616]" /> Live Demo / Webhook Endpoint (Optional)
              </label>
              <input
                type="url"
                value={formData.liveDemoUrl || ''}
                onChange={(e) => updateField('liveDemoUrl', e.target.value)}
                placeholder="https://demo.uipath-community-portal.edu or API webhook"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 transition-all font-mono text-xs"
              />
            </div>
          </div>

          {/* SECTION 5: TEAM MEMBERS & CONTRIBUTOR BADGES */}
          <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-4 md:p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-[#FA4616]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
                Team Members & Contributor Badges
              </span>
            </div>

            {/* Lead Student Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Lead Student Name <span className="text-[#FA4616]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.authorName}
                  onChange={(e) => updateField('authorName', e.target.value)}
                  placeholder="e.g., Rahul Varma"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-sm text-neutral-100 focus:outline-none focus:border-orange-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Department / Branch & Batch
                </label>
                <input
                  type="text"
                  value={formData.authorBranch || ''}
                  onChange={(e) => updateField('authorBranch', e.target.value)}
                  placeholder="e.g., Computer Science & Engineering (Class of 2026)"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-sm text-neutral-100 focus:outline-none focus:border-orange-500 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5">
                  <Linkedin size={13} className="text-[#0A66C2]" /> Student LinkedIn Profile
                </label>
                <input
                  type="url"
                  value={formData.authorLinkedin || ''}
                  onChange={(e) => updateField('authorLinkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 transition-all text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5">
                  <ExternalLink size={13} className="text-neutral-400" /> Student Portfolio / Resume URL
                </label>
                <input
                  type="url"
                  value={formData.authorPortfolioUrl || ''}
                  onChange={(e) => updateField('authorPortfolioUrl', e.target.value)}
                  placeholder="https://portfolio.dev or personal site"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 transition-all text-xs font-mono"
                />
              </div>
            </div>

            {/* Multi-Contributor Tags Creator */}
            <div className="pt-2 border-t border-neutral-800/80 space-y-2.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Additional Project Contributors / Co-Developers
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newContributorInput}
                  onChange={(e) => setNewContributorInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddContributor();
                    }
                  }}
                  placeholder="e.g., Teja K. (Co-Dev - CSE 2026)"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 transition-all"
                />
                <button
                  type="button"
                  onClick={handleAddContributor}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-1 border border-neutral-700"
                >
                  <Plus size={14} /> Add Tag
                </button>
              </div>

              {/* Contributor Chips Display */}
              {formData.contributors && formData.contributors.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {formData.contributors.map((contrib, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs font-medium"
                    >
                      <Users size={12} className="text-[#FA4616]" />
                      {contrib}
                      <button
                        type="button"
                        onClick={() => handleRemoveContributor(idx)}
                        className="text-orange-400 hover:text-red-400 ml-1 cursor-pointer"
                        title="Remove contributor"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

        </form>

        {/* STICKY ACTION FOOTER */}
        <div className="sticky bottom-0 bg-[#121214]/95 backdrop-blur-md pt-4 mt-6 border-t border-neutral-800 flex items-center justify-between z-20 pb-1">
          {/* Left Side: Featured Toggle Switch */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={isFeatured}
              onClick={() => {
                setIsFeatured(!isFeatured);
                setIsDirty(true);
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 ${isFeatured ? 'bg-[#FA4616]' : 'bg-neutral-800'}`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${isFeatured ? 'translate-x-5' : 'translate-x-0'}`}
              />
            </button>
            <div className="text-xs">
              <span className="font-semibold text-white flex items-center gap-1">
                <Star size={12} className={isFeatured ? 'fill-orange-500 text-orange-500' : 'text-neutral-400'} />
                Featured on Showcase Roster
              </span>
              <span className="text-neutral-400 block text-[11px]">
                {isFeatured ? 'Pinned on community homepage & top showcase' : 'Standard catalog listing'}
              </span>
            </div>
          </div>

          {/* Right Side: Actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-xl transition-all cursor-pointer border border-transparent"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-[#FA4616] hover:bg-[#ff5722] text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.98]"
            >
              <Save size={16} />
              <span>Save Project</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
