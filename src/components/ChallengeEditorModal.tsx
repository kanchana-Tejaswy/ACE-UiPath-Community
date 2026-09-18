import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  UploadCloud, 
  Image as ImageIcon, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Video, 
  Link as LinkIcon, 
  Sparkles, 
  Plus, 
  Save, 
  Star, 
  Tag, 
  Calendar, 
  Clock, 
  FileText, 
  Award, 
  Code2, 
  BookOpen, 
  ExternalLink, 
  Youtube, 
  MessageSquare, 
  Trophy, 
  Download,
  Layers,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { 
  Challenge, 
  ChallengeVideoRecording, 
  ChallengeUseCaseTrack, 
  ChallengeReferenceMaterial 
} from '../types';

interface Props {
  isOpen: boolean;
  challenge: Challenge | null;
  onClose: () => void;
  onSave: (challenge: Challenge, makeFeatured?: boolean) => void;
}

const PRESET_BANNERS = [
  { label: 'Enterprise Hackathon 2026', url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1920&auto=format&fit=crop&q=80' },
  { label: 'Autonomous Bots Sprint', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1920&auto=format&fit=crop&q=80' },
  { label: 'AI & Document Understanding', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&auto=format&fit=crop&q=80' },
  { label: 'Campus Innovation Ideathon', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1920&auto=format&fit=crop&q=80' }
];

const VIDEO_TYPE_OPTIONS: ChallengeVideoRecording['type'][] = [
  'Kickoff Recording',
  'Bot Tutorial Walkthrough',
  'AMA / Q&A Session',
  'Closing & Demos'
];

const RESOURCE_TYPE_OPTIONS: ChallengeReferenceMaterial['type'][] = [
  'PDF Guide',
  'API Docs',
  'Cheat Sheet',
  'Sample Dataset (CSV/XLSX)'
];

const CATEGORY_OPTIONS = ['Hackathon', 'Monthly Sprint', 'Ideathon', 'Bug Bash'] as const;
const STATUS_OPTIONS = ['Draft', 'Upcoming', 'Active', 'Judging', 'Completed', 'Archived'] as const;
const DIFFICULTY_OPTIONS = ['Beginner', 'Intermediate', 'Advanced'] as const;

function calculateAspectRatio(width: number, height: number): string {
  const decimal = width / height;
  if (Math.abs(decimal - 16 / 9) < 0.08) return '16:9 (Landscape Banner)';
  if (Math.abs(decimal - 4 / 3) < 0.08) return '4:3 (Standard)';
  if (Math.abs(decimal - 1) < 0.05) return '1:1 (Square)';
  if (Math.abs(decimal - 4 / 5) < 0.05) return '4:5 (Portrait)';
  return `${width} × ${height} px`;
}

// Helper to format embed video URLs
function getSafeEmbedUrl(rawUrl: string): string | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim();

  // YouTube match
  const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`;
  }

  // Loom match
  const loomMatch = trimmed.match(/loom\.com\/(?:share|embed)\/([a-f0-9]+)/);
  if (loomMatch && loomMatch[1]) {
    return `https://www.loom.com/embed/${loomMatch[1]}`;
  }

  // Vimeo match
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // Google Drive preview match
  if (trimmed.includes('drive.google.com/file/d/')) {
    const fileIdMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
    }
  }

  if (trimmed.startsWith('https://') || trimmed.startsWith('http://') || trimmed.startsWith('blob:') || trimmed.startsWith('data:')) {
    return trimmed;
  }

  return null;
}

export const ChallengeEditorModal: React.FC<Props> = ({
  isOpen,
  challenge,
  onClose,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'useCases' | 'recordings' | 'materials'>('overview');
  const [formData, setFormData] = useState<Challenge | null>(null);
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [bannerUploadTab, setBannerUploadTab] = useState<'dropzone' | 'url'>('dropzone');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imageSpecs, setImageSpecs] = useState<{ width: number; height: number; ratio: string } | null>(null);
  const [isDirty, setIsDirty] = useState<boolean>(false);

  const bannerFileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form
  useEffect(() => {
    if (challenge) {
      setFormData({
        ...challenge,
        bannerImage: challenge.bannerImage || PRESET_BANNERS[0].url,
        startTime: challenge.startTime || '09:00',
        endTime: challenge.endTime || '18:00',
        registrationDeadline: challenge.registrationDeadline || challenge.startDate || '',
        registrationDeadlineTime: challenge.registrationDeadlineTime || '23:59',
        registrationUrl: challenge.registrationUrl || '',
        communityChannelUrl: challenge.communityChannelUrl || '',
        evaluationCriteria: challenge.evaluationCriteria && challenge.evaluationCriteria.length > 0
          ? challenge.evaluationCriteria
          : ['Business Value & Practical ROI (30%)', 'UiPath Architecture & REFramework (30%)', 'Robust Exception Handling (20%)', 'Documentation & Clean Code (20%)'],
        recordings: challenge.recordings || [],
        useCases: challenge.useCases || [],
        referenceMaterials: challenge.referenceMaterials || []
      });
      setIsFeatured(Boolean(challenge.isFeatured));
      setIsDirty(false);
      setUploadError(null);

      if (challenge.bannerImage) {
        inspectBannerDimensions(challenge.bannerImage);
      } else {
        setImageSpecs(null);
      }
    }
  }, [challenge, isOpen]);

  // Handle ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDirty]);

  const inspectBannerDimensions = (url: string) => {
    if (!url) {
      setImageSpecs(null);
      return;
    }
    const img = new Image();
    img.onload = () => {
      setImageSpecs({
        width: img.naturalWidth,
        height: img.naturalHeight,
        ratio: calculateAspectRatio(img.naturalWidth, img.naturalHeight)
      });
    };
    img.onerror = () => {
      setImageSpecs(null);
    };
    img.src = url;
  };

  const handleFileUpload = (file: File) => {
    setUploadError(null);

    // Validate size: 5MB
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size exceeds 5MB limit. Please upload a compressed PNG, JPG, or WebP.');
      return;
    }

    // Validate type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Unsupported image format. Please upload PNG, JPG, or WebP.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result && formData) {
        setFormData({ ...formData, bannerImage: result });
        inspectBannerDimensions(result);
        setIsDirty(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleCloseModal = () => {
    if (isDirty) {
      if (window.confirm('You have unsaved changes. Are you sure you want to discard them?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !formData.title.trim()) {
      alert('Please enter a hackathon title.');
      return;
    }

    const payload: Challenge = {
      ...formData,
      title: formData.title.trim(),
      slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      isFeatured: isFeatured
    };

    onSave(payload, isFeatured);
  };

  if (!isOpen || !formData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 md:p-6 overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#121214] border border-neutral-800 rounded-2xl shadow-2xl text-neutral-100 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between border-b border-neutral-800/80 px-6 py-4 bg-neutral-900/50 backdrop-blur-sm rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-[#FA4616]">
              <Trophy size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {formData.id.startsWith('chal_') && !formData.title ? 'Create Competition / Hackathon' : 'Competition Command Center'}
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  UiPath CMS
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Configure visual banners, competition tracks, problem statements, recordings, and submission rubrics.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCloseModal}
            className="text-neutral-400 hover:text-white p-1.5 rounded-lg hover:bg-neutral-800 transition-colors"
            title="Close modal (Esc)"
          >
            <X size={20} />
          </button>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex border-b border-neutral-800 bg-[#151518] px-6 gap-2 overflow-x-auto select-none">
          {[
            { id: 'overview', label: 'Overview & Dates', icon: Calendar, count: null },
            { id: 'useCases', label: 'Bot Use Cases & Tracks', icon: Code2, count: formData.useCases?.length || 0 },
            { id: 'recordings', label: 'Recordings & Tutorials', icon: Video, count: formData.recordings?.length || 0 },
            { id: 'materials', label: 'Reference Materials', icon: BookOpen, count: formData.referenceMaterials?.length || 0 }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-3.5 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-[#FA4616] text-white bg-neutral-800/30'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/20'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-[#FA4616]' : 'text-neutral-400'} />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-orange-500/20 text-orange-400' : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {/* TAB 1: OVERVIEW & DATES */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* 1. HACKATHON MEDIA & VISUAL IDENTITY (POSTER/BANNER ASSET MANAGER) */}
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ImageIcon size={18} className="text-[#FA4616]" />
                    <h3 className="text-sm font-bold text-neutral-100 uppercase tracking-wider">
                      Hackathon Banner & Visual Identity
                    </h3>
                  </div>
                  {/* Guideline spec tag */}
                  <span className="text-[11px] font-medium text-orange-300/90 bg-orange-950/40 border border-orange-800/40 rounded-full px-2.5 py-0.5 flex items-center gap-1.5">
                    <Sparkles size={12} className="text-orange-400" />
                    Recommended: 1920 × 1080 px (16:9 Landscape Banner) • PNG, JPG, WebP (Max 5MB)
                  </span>
                </div>

                {/* Banner Upload / URL Tab Selector */}
                <div className="flex gap-2 border-b border-neutral-800 pb-2">
                  <button
                    type="button"
                    onClick={() => setBannerUploadTab('dropzone')}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      bannerUploadTab === 'dropzone'
                        ? 'bg-neutral-800 text-white'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Direct Upload / Dropzone
                  </button>
                  <button
                    type="button"
                    onClick={() => setBannerUploadTab('url')}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      bannerUploadTab === 'url'
                        ? 'bg-neutral-800 text-white'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Direct Image URL & Presets
                  </button>
                </div>

                {/* Error Banner */}
                {uploadError && (
                  <div className="flex items-center gap-2 p-3 bg-red-950/40 border border-red-800/50 rounded-lg text-red-300 text-xs">
                    <AlertCircle size={16} className="text-red-400 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {/* Direct Dropzone */}
                {bannerUploadTab === 'dropzone' && (
                  <div>
                    <input
                      ref={bannerFileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          handleFileUpload(e.target.files[0]);
                        }
                      }}
                    />
                    <div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={() => bannerFileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                        isDragging
                          ? 'border-orange-500 bg-orange-500/10'
                          : 'border-neutral-700/80 hover:border-orange-500/60 bg-neutral-950/60'
                      }`}
                    >
                      <UploadCloud size={32} className="mx-auto text-neutral-400 mb-2" />
                      <p className="text-xs font-semibold text-neutral-200">
                        Drag and drop your 16:9 banner here, or <span className="text-orange-400 underline">browse files</span>
                      </p>
                      <p className="text-[11px] text-neutral-500 mt-1">
                        High resolution landscape graphic for hackathon cards and event hero showcase.
                      </p>
                    </div>
                  </div>
                )}

                {/* Direct Image URL & Presets */}
                {bannerUploadTab === 'url' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-neutral-300 block mb-1">
                        BANNER IMAGE URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={formData.bannerImage || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData({ ...formData, bannerImage: val });
                          inspectBannerDimensions(val);
                          setIsDirty(true);
                        }}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-orange-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1.5">
                        Or Pick a High-Res Tech Preset:
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {PRESET_BANNERS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, bannerImage: preset.url });
                              inspectBannerDimensions(preset.url);
                              setIsDirty(true);
                            }}
                            className={`p-2 rounded-lg border text-left text-xs transition-all ${
                              formData.bannerImage === preset.url
                                ? 'bg-orange-500/10 border-orange-500 text-orange-400 font-semibold'
                                : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                            }`}
                          >
                            <span className="line-clamp-1">{preset.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Live Preview Card */}
                {formData.bannerImage && (
                  <div className="border border-neutral-800 bg-neutral-950/80 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs text-neutral-400 pb-1 border-b border-neutral-900">
                      <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-emerald-400" />
                        Live Banner Preview
                      </span>
                      {imageSpecs && (
                        <span className="font-mono text-[11px] text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                          {imageSpecs.ratio} ({imageSpecs.width} × {imageSpecs.height} px)
                        </span>
                      )}
                    </div>

                    <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-neutral-800 bg-black/60 group">
                      <img
                        src={formData.bannerImage}
                        alt="Banner Preview"
                        className="w-full h-full object-cover"
                        onError={() => setUploadError('Image failed to load. Please verify URL.')}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => bannerFileInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg bg-neutral-900/90 hover:bg-neutral-900 text-white text-xs font-semibold flex items-center gap-1.5 border border-neutral-700 shadow"
                        >
                          <RefreshCw size={13} /> Replace
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, bannerImage: '' });
                            setImageSpecs(null);
                            setIsDirty(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-red-950/90 hover:bg-red-900 text-red-200 text-xs font-semibold flex items-center gap-1.5 border border-red-800 shadow"
                        >
                          <Trash2 size={13} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. BASIC METADATA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    HACKATHON / CHALLENGE TITLE *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., ACE UiPath Enterprise Automation Hackathon 2026"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-500 focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    THEME / TRACK FOCUS
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Intelligent Campus & Industry 4.0 Autonomous Bots"
                    value={formData.theme}
                    onChange={(e) => {
                      setFormData({ ...formData, theme: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    CATEGORY
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      setFormData({ ...formData, category: e.target.value as any });
                      setIsDirty(true);
                    }}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:border-orange-500 focus:outline-none"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    PRIZE POOL & REWARDS
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., ₹25,000 + UiPath Official Vouchers & Fast-Track Core Placement"
                    value={formData.prizePool}
                    onChange={(e) => {
                      setFormData({ ...formData, prizePool: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    COMPETITION STATUS
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => {
                      setFormData({ ...formData, status: e.target.value as any });
                      setIsDirty(true);
                    }}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:border-orange-500 focus:outline-none"
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 3. TIMELINE, DATES & REGISTRATION MANAGEMENT (3-COLUMN GRID) */}
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
                  <Clock size={18} className="text-[#FA4616]" />
                  <h3 className="text-sm font-bold text-neutral-100 uppercase tracking-wider">
                    Timeline, Dates & Registration Management
                  </h3>
                </div>

                {/* 3-Column Grid for Dates & Times */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Column 1: Registration Deadline */}
                  <div className="bg-neutral-950/80 border border-neutral-800/80 rounded-xl p-3.5 space-y-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                      <Calendar size={14} />
                      <span>1. Registration Deadline</span>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-neutral-400 block mb-1">DATE</label>
                      <input
                        type="date"
                        value={formData.registrationDeadline || ''}
                        onChange={(e) => {
                          setFormData({ ...formData, registrationDeadline: e.target.value });
                          setIsDirty(true);
                        }}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-neutral-400 block mb-1">TIME</label>
                      <input
                        type="time"
                        value={formData.registrationDeadlineTime || '23:59'}
                        onChange={(e) => {
                          setFormData({ ...formData, registrationDeadlineTime: e.target.value });
                          setIsDirty(true);
                        }}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Column 2: Hackathon Start Date & Time */}
                  <div className="bg-neutral-950/80 border border-neutral-800/80 rounded-xl p-3.5 space-y-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                      <Calendar size={14} />
                      <span>2. Hackathon Kickoff</span>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-neutral-400 block mb-1">START DATE *</label>
                      <input
                        type="date"
                        required
                        value={formData.startDate}
                        onChange={(e) => {
                          setFormData({ ...formData, startDate: e.target.value });
                          setIsDirty(true);
                        }}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-neutral-400 block mb-1">START TIME</label>
                      <input
                        type="time"
                        value={formData.startTime || '09:00'}
                        onChange={(e) => {
                          setFormData({ ...formData, startTime: e.target.value });
                          setIsDirty(true);
                        }}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Column 3: Submission Deadline */}
                  <div className="bg-neutral-950/80 border border-neutral-800/80 rounded-xl p-3.5 space-y-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
                      <Calendar size={14} />
                      <span>3. Submission Deadline</span>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-neutral-400 block mb-1">END DATE *</label>
                      <input
                        type="date"
                        required
                        value={formData.endDate}
                        onChange={(e) => {
                          setFormData({ ...formData, endDate: e.target.value });
                          setIsDirty(true);
                        }}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-neutral-400 block mb-1">END TIME</label>
                      <input
                        type="time"
                        value={formData.endTime || '18:00'}
                        onChange={(e) => {
                          setFormData({ ...formData, endTime: e.target.value });
                          setIsDirty(true);
                        }}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* External Links: Registration & Discord */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5 mb-1">
                      <ExternalLink size={13} className="text-orange-400" />
                      EXTERNAL REGISTRATION LINK (UNSTOP, DEVFOLIO, GOOGLE FORM)
                    </label>
                    <input
                      type="url"
                      placeholder="https://unstop.com/hackathons/ace-uipath-2026"
                      value={formData.registrationUrl || ''}
                      onChange={(e) => {
                        setFormData({ ...formData, registrationUrl: e.target.value });
                        setIsDirty(true);
                      }}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-orange-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-neutral-500 mt-1 block">
                      Direct students to an external registration portal if applicable.
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5 mb-1">
                      <MessageSquare size={13} className="text-indigo-400" />
                      DISCORD / TEAMS PARTICIPANT CHANNEL LINK
                    </label>
                    <input
                      type="url"
                      placeholder="https://discord.gg/ace-uipath-community"
                      value={formData.communityChannelUrl || ''}
                      onChange={(e) => {
                        setFormData({ ...formData, communityChannelUrl: e.target.value });
                        setIsDirty(true);
                      }}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-orange-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-neutral-500 mt-1 block">
                      Dedicated communication channel for announcements, team formation & mentoring.
                    </span>
                  </div>
                </div>
              </div>

              {/* 4. OBJECTIVES, RULES & CRITERIA */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    CHALLENGE OBJECTIVE & BRIEF (MARKDOWN)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="### Challenge Objective&#10;Build a real-world enterprise bot..."
                    value={formData.descriptionMd}
                    onChange={(e) => {
                      setFormData({ ...formData, descriptionMd: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-white placeholder-neutral-500 focus:border-orange-500 focus:outline-none font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">
                      COMPETITION RULES & POLICY (MARKDOWN)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="1. Teams can comprise 1 to 4 students...&#10;2. Workflows must use UiPath Studio..."
                      value={formData.rulesMd}
                      onChange={(e) => {
                        setFormData({ ...formData, rulesMd: e.target.value });
                        setIsDirty(true);
                      }}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-white placeholder-neutral-500 focus:border-orange-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">
                      EVALUATION CRITERIA & RUBRIC (ONE PER LINE)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Business Value & ROI (30%)&#10;Architecture & REFramework (30%)&#10;Exception Handling (20%)&#10;Documentation & Clean Code (20%)"
                      value={formData.evaluationCriteria?.join('\n') || ''}
                      onChange={(e) => {
                        const list = e.target.value.split('\n').filter((item) => item.trim());
                        setFormData({ ...formData, evaluationCriteria: list });
                        setIsDirty(true);
                      }}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-white placeholder-neutral-500 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BOT USE CASES & STARTER TEMPLATES HUB */}
          {activeTab === 'useCases' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-neutral-100 uppercase tracking-wider flex items-center gap-2">
                    <Code2 size={18} className="text-[#FA4616]" />
                    Challenge Problem Statements & Bot Use Cases Hub
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Define distinct hackathon tracks, problem briefs, evaluation KPIs, and starter code scaffolding (.XAML / .ZIP / GitHub).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newTrack: ChallengeUseCaseTrack = {
                      id: `uc_${Date.now()}`,
                      title: '',
                      problemBrief: '',
                      evaluationRubric: 'Accuracy > 95%, Exception Handling, Speed',
                      starterTemplateUrl: '',
                      starterTemplateType: 'ZIP',
                      difficulty: 'Intermediate'
                    };
                    setFormData({
                      ...formData,
                      useCases: [...(formData.useCases || []), newTrack]
                    });
                    setIsDirty(true);
                  }}
                  className="px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 text-[#FA4616] border border-orange-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus size={14} /> Add Use Case Track
                </button>
              </div>

              {/* Use Cases List */}
              {(!formData.useCases || formData.useCases.length === 0) ? (
                <div className="text-center py-10 bg-neutral-950/40 border border-dashed border-neutral-800 rounded-xl">
                  <Code2 size={36} className="mx-auto text-neutral-600 mb-2" />
                  <p className="text-sm font-semibold text-neutral-300">No Track Problem Statements Added</p>
                  <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                    Click "+ Add Use Case Track" above to provide specific student automation challenges like "Invoice Reconciliation" or "HR Bot".
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.useCases.map((uc, index) => (
                    <div
                      key={uc.id || index}
                      className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 md:p-5 space-y-4 relative group"
                    >
                      <div className="flex items-center justify-between gap-2 border-b border-neutral-800/80 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-orange-500/10 text-orange-400 font-bold text-xs flex items-center justify-center border border-orange-500/20">
                            {index + 1}
                          </span>
                          <span className="text-xs font-bold text-white uppercase tracking-wider">
                            Track #{index + 1}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = formData.useCases?.filter((_, i) => i !== index);
                            setFormData({ ...formData, useCases: updated });
                            setIsDirty(true);
                          }}
                          className="text-neutral-500 hover:text-red-400 p-1 rounded transition-colors"
                          title="Delete track"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-2">
                          <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                            TRACK TITLE / BOT NAME *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g., Invoice Extraction with Document Understanding"
                            value={uc.title}
                            onChange={(e) => {
                              const updated = [...(formData.useCases || [])];
                              updated[index] = { ...updated[index], title: e.target.value };
                              setFormData({ ...formData, useCases: updated });
                              setIsDirty(true);
                            }}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                            TRACK DIFFICULTY
                          </label>
                          <select
                            value={uc.difficulty || 'Intermediate'}
                            onChange={(e) => {
                              const updated = [...(formData.useCases || [])];
                              updated[index] = { ...updated[index], difficulty: e.target.value as any };
                              setFormData({ ...formData, useCases: updated });
                              setIsDirty(true);
                            }}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                          >
                            {DIFFICULTY_OPTIONS.map((diff) => (
                              <option key={diff} value={diff}>{diff}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                          PROBLEM BRIEF & SPECIFICATIONS (MARKDOWN)
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Describe the end-to-end business problem, inputs (PDF/Excel), and expected outputs..."
                          value={uc.problemBrief}
                          onChange={(e) => {
                            const updated = [...(formData.useCases || [])];
                            updated[index] = { ...updated[index], problemBrief: e.target.value };
                            setFormData({ ...formData, useCases: updated });
                            setIsDirty(true);
                          }}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:border-orange-500 focus:outline-none font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                            EVALUATION RUBRIC & KPIS
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., Accuracy > 95%, Exception Handling, Speed < 30s"
                            value={uc.evaluationRubric}
                            onChange={(e) => {
                              const updated = [...(formData.useCases || [])];
                              updated[index] = { ...updated[index], evaluationRubric: e.target.value };
                              setFormData({ ...formData, useCases: updated });
                              setIsDirty(true);
                            }}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                            STARTER TEMPLATE URL (.XAML / .ZIP / GITHUB)
                          </label>
                          <input
                            type="url"
                            placeholder="https://github.com/... or https://.../Starter.zip"
                            value={uc.starterTemplateUrl || ''}
                            onChange={(e) => {
                              const updated = [...(formData.useCases || [])];
                              updated[index] = { ...updated[index], starterTemplateUrl: e.target.value };
                              setFormData({ ...formData, useCases: updated });
                              setIsDirty(true);
                            }}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SESSION RECORDINGS & VIDEO TUTORIALS */}
          {activeTab === 'recordings' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-neutral-100 uppercase tracking-wider flex items-center gap-2">
                    <Video size={18} className="text-[#FA4616]" />
                    Session Recordings & Video Tutorials
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Embed kickoff livestreams, starter bot walkthroughs, AMA recordings, and demo videos with live preview players.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newRec: ChallengeVideoRecording = {
                      id: `rec_${Date.now()}`,
                      title: '',
                      type: 'Kickoff Recording',
                      url: '',
                      duration: '',
                      speakerName: ''
                    };
                    setFormData({
                      ...formData,
                      recordings: [...(formData.recordings || []), newRec]
                    });
                    setIsDirty(true);
                  }}
                  className="px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 text-[#FA4616] border border-orange-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus size={14} /> Add Recording / Video
                </button>
              </div>

              {/* Recordings List */}
              {(!formData.recordings || formData.recordings.length === 0) ? (
                <div className="text-center py-10 bg-neutral-950/40 border border-dashed border-neutral-800 rounded-xl">
                  <Video size={36} className="mx-auto text-neutral-600 mb-2" />
                  <p className="text-sm font-semibold text-neutral-300">No Video Recordings Added</p>
                  <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                    Add YouTube, Loom, Vimeo, or Google Drive walkthrough videos to guide students through the hackathon.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {formData.recordings.map((rec, index) => {
                    const embedUrl = getSafeEmbedUrl(rec.url);
                    return (
                      <div
                        key={rec.id || index}
                        className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 md:p-5 space-y-4"
                      >
                        <div className="flex items-center justify-between gap-2 border-b border-neutral-800/80 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-orange-500/10 text-orange-400 font-bold text-xs flex items-center justify-center border border-orange-500/20">
                              {index + 1}
                            </span>
                            <span className="text-xs font-bold text-white uppercase tracking-wider">
                              Video Item #{index + 1}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = formData.recordings?.filter((_, i) => i !== index);
                              setFormData({ ...formData, recordings: updated });
                              setIsDirty(true);
                            }}
                            className="text-neutral-500 hover:text-red-400 p-1 rounded transition-colors"
                            title="Delete video"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                              VIDEO TITLE *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g., Hackathon Kickoff & Problem Statement Breakdown"
                              value={rec.title}
                              onChange={(e) => {
                                const updated = [...(formData.recordings || [])];
                                updated[index] = { ...updated[index], title: e.target.value };
                                setFormData({ ...formData, recordings: updated });
                                setIsDirty(true);
                              }}
                              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                              VIDEO TYPE / CATEGORY
                            </label>
                            <select
                              value={rec.type}
                              onChange={(e) => {
                                const updated = [...(formData.recordings || [])];
                                updated[index] = { ...updated[index], type: e.target.value as any };
                                setFormData({ ...formData, recordings: updated });
                                setIsDirty(true);
                              }}
                              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                            >
                              {VIDEO_TYPE_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="md:col-span-2">
                            <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                              VIDEO EMBED URL (YOUTUBE, LOOM, VIMEO, DRIVE)
                            </label>
                            <input
                              type="url"
                              placeholder="https://www.youtube.com/watch?v=... or Loom / Drive share link"
                              value={rec.url}
                              onChange={(e) => {
                                const updated = [...(formData.recordings || [])];
                                updated[index] = { ...updated[index], url: e.target.value };
                                setFormData({ ...formData, recordings: updated });
                                setIsDirty(true);
                              }}
                              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none font-mono"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                              ESTIMATED DURATION
                            </label>
                            <input
                              type="text"
                              placeholder="e.g., 45 mins"
                              value={rec.duration || ''}
                              onChange={(e) => {
                                const updated = [...(formData.recordings || [])];
                                updated[index] = { ...updated[index], duration: e.target.value };
                                setFormData({ ...formData, recordings: updated });
                                setIsDirty(true);
                              }}
                              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Inline Video Player Preview */}
                        {embedUrl && (
                          <div className="border border-neutral-800 bg-black/60 rounded-xl p-3 space-y-2">
                            <div className="flex items-center justify-between text-[11px] text-neutral-400">
                              <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
                                <Youtube size={14} className="text-red-500" />
                                Inline Player Preview
                              </span>
                              <span className="text-emerald-400 font-medium">Valid embed source</span>
                            </div>
                            <div className="relative aspect-video w-full max-h-56 rounded-lg overflow-hidden border border-neutral-800 bg-black">
                              <iframe
                                src={embedUrl}
                                title={rec.title || 'Video Player'}
                                className="w-full h-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: REFERENCE MATERIALS & DOCUMENTATION VAULT */}
          {activeTab === 'materials' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-neutral-100 uppercase tracking-wider flex items-center gap-2">
                    <BookOpen size={18} className="text-[#FA4616]" />
                    Curated Study & Reference Materials Vault
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Attach official documentation, sample CSV/XLSX datasets, architectural cheat sheets, and starter kits.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newMat: ChallengeReferenceMaterial = {
                      id: `ref_${Date.now()}`,
                      title: '',
                      type: 'PDF Guide',
                      url: '',
                      description: ''
                    };
                    setFormData({
                      ...formData,
                      referenceMaterials: [...(formData.referenceMaterials || []), newMat]
                    });
                    setIsDirty(true);
                  }}
                  className="px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 text-[#FA4616] border border-orange-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus size={14} /> Add Reference Item
                </button>
              </div>

              {/* Reference Materials List */}
              {(!formData.referenceMaterials || formData.referenceMaterials.length === 0) ? (
                <div className="text-center py-10 bg-neutral-950/40 border border-dashed border-neutral-800 rounded-xl">
                  <BookOpen size={36} className="mx-auto text-neutral-600 mb-2" />
                  <p className="text-sm font-semibold text-neutral-300">No Reference Materials Added</p>
                  <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                    Provide student participants with datasets, API specifications, and cheat sheets to accelerate development.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.referenceMaterials.map((mat, index) => (
                    <div
                      key={mat.id || index}
                      className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between gap-2 border-b border-neutral-800/80 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-orange-500/10 text-orange-400 font-bold text-xs flex items-center justify-center border border-orange-500/20">
                            {index + 1}
                          </span>
                          <span className="text-xs font-bold text-white uppercase tracking-wider">
                            Resource #{index + 1}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = formData.referenceMaterials?.filter((_, i) => i !== index);
                            setFormData({ ...formData, referenceMaterials: updated });
                            setIsDirty(true);
                          }}
                          className="text-neutral-500 hover:text-red-400 p-1 rounded transition-colors"
                          title="Delete material"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-2">
                          <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                            RESOURCE TITLE *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g., UiPath Action Center Official Integration Guide"
                            value={mat.title}
                            onChange={(e) => {
                              const updated = [...(formData.referenceMaterials || [])];
                              updated[index] = { ...updated[index], title: e.target.value };
                              setFormData({ ...formData, referenceMaterials: updated });
                              setIsDirty(true);
                            }}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                            RESOURCE TYPE
                          </label>
                          <select
                            value={mat.type}
                            onChange={(e) => {
                              const updated = [...(formData.referenceMaterials || [])];
                              updated[index] = { ...updated[index], type: e.target.value as any };
                              setFormData({ ...formData, referenceMaterials: updated });
                              setIsDirty(true);
                            }}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                          >
                            {RESOURCE_TYPE_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                            DOWNLOAD / EXTERNAL URL *
                          </label>
                          <input
                            type="url"
                            required
                            placeholder="https://docs.uipath.com/... or cloud download link"
                            value={mat.url}
                            onChange={(e) => {
                              const updated = [...(formData.referenceMaterials || [])];
                              updated[index] = { ...updated[index], url: e.target.value };
                              setFormData({ ...formData, referenceMaterials: updated });
                              setIsDirty(true);
                            }}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                            BRIEF DESCRIPTION / NOTE
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., Anonymized multi-vendor invoice PDFs for IDP pipeline testing."
                            value={mat.description || ''}
                            onChange={(e) => {
                              const updated = [...(formData.referenceMaterials || [])];
                              updated[index] = { ...updated[index], description: e.target.value };
                              setFormData({ ...formData, referenceMaterials: updated });
                              setIsDirty(true);
                            }}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STICKY FOOTER */}
          <div className="sticky -bottom-6 md:-bottom-8 -mx-6 md:-mx-8 p-4 md:px-8 bg-[#121214]/95 border-t border-neutral-800 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 z-20">
            {/* Left Controls: Featured Switch + Status Badge */}
            <div className="flex items-center gap-4 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => {
                    setIsFeatured(e.target.checked);
                    setIsDirty(true);
                  }}
                  className="w-4 h-4 rounded text-[#FA4616] focus:ring-orange-500 focus:ring-offset-neutral-900 bg-neutral-900 border-neutral-700"
                />
                <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                  <Star size={13} className={isFeatured ? 'text-[#FA4616] fill-[#FA4616]' : 'text-neutral-400'} />
                  Featured on Homepage
                </span>
              </label>

              {/* Status pill preview */}
              <div className="flex items-center gap-1.5 text-xs text-neutral-400 border-l border-neutral-800 pl-4">
                <span>Status:</span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  formData.status === 'Active'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : formData.status === 'Upcoming'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : formData.status === 'Judging'
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : formData.status === 'Draft'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : formData.status === 'Archived'
                    ? 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                    : 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                }`}>
                  {formData.status}
                </span>
              </div>
            </div>

            {/* Right Buttons: Cancel + Primary Save */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="bg-[#FA4616] hover:bg-[#ff5722] text-white font-semibold text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Save size={15} /> Save Hackathon Details
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
