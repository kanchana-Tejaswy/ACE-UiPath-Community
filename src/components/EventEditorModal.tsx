import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  UploadCloud, 
  Image as ImageIcon, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Linkedin, 
  MapPin, 
  Video, 
  Link as LinkIcon, 
  Users, 
  Sparkles, 
  Plus, 
  Save, 
  Star,
  Tag
} from 'lucide-react';
import { Activity, ActivityCategory, ActivityEventType, ActivityStatus, ActivitySpeaker } from '../types';

interface Props {
  isOpen: boolean;
  activity: Activity | null;
  isFeaturedOnHome: boolean;
  onClose: () => void;
  onSave: (activity: Activity, makeFeatured: boolean) => void;
}

const PRESET_POSTERS = [
  { label: 'Session 1 (UiPath Intro)', url: '/uipath-session-1.png' },
  { label: 'Session 2 (REFramework)', url: '/uipath-session-2.png' },
  { label: 'AI & Automation Banner', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Hackathon Workshop', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80' }
];

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
];

function calculateAspectRatio(width: number, height: number): string {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  const wRatio = width / divisor;
  const hRatio = height / divisor;

  // Approximate to standard ratios if near
  const decimal = width / height;
  if (Math.abs(decimal - 4 / 5) < 0.05) return '4:5 (Portrait Flyer)';
  if (Math.abs(decimal - 16 / 9) < 0.05) return '16:9 (Landscape Banner)';
  if (Math.abs(decimal - 1) < 0.05) return '1:1 (Square)';
  if (Math.abs(decimal - 3 / 2) < 0.05) return '3:2 (Standard)';
  if (Math.abs(decimal - 9 / 16) < 0.05) return '9:16 (Story)';

  return `${wRatio}:${hRatio}`;
}

export const EventEditorModal: React.FC<Props> = ({
  isOpen,
  activity,
  isFeaturedOnHome,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Activity | null>(null);
  const [isFeatured, setIsFeatured] = useState(false);
  const [uploadTab, setUploadTab] = useState<'dropzone' | 'url'>('dropzone');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imageSpecs, setImageSpecs] = useState<{ width: number; height: number; ratio: string } | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form when modal opens
  useEffect(() => {
    if (activity) {
      setFormData({
        ...activity,
        speakers: activity.speakers && activity.speakers.length > 0 
          ? activity.speakers 
          : [{ id: `spk_${Date.now()}`, name: '', roleTitle: '', organization: '', avatarUrl: '', linkedinUrl: '', bio: '' }]
      });
      setIsFeatured(isFeaturedOnHome || activity.isFeatured || false);
      setIsDirty(false);
      setUploadError(null);

      // Check dimensions of existing banner
      if (activity.bannerImage) {
        inspectImageDimensions(activity.bannerImage);
      } else {
        setImageSpecs(null);
      }
    }
  }, [activity, isFeaturedOnHome, isOpen]);

  // Handle Escape Key
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

  const inspectImageDimensions = (url: string) => {
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const ratio = calculateAspectRatio(w, h);
      setImageSpecs({ width: w, height: h, ratio });
      setUploadError(null);
    };
    img.onerror = () => {
      setImageSpecs(null);
    };
    img.src = url;
  };

  const updateField = <K extends keyof Activity>(field: K, value: Activity[K]) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
    setIsDirty(true);
  };

  // Image upload handling
  const processFile = (file: File) => {
    setUploadError(null);
    const validFormats = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validFormats.includes(file.type)) {
      setUploadError('Unsupported format. Please upload PNG, JPG, or WebP.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError(`File too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed is 5MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        updateField('bannerImage', result);
        inspectImageDimensions(result);
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  // Speaker Entity Management
  const updateSpeaker = (index: number, field: keyof ActivitySpeaker, value: string) => {
    if (!formData.speakers) return;
    const updated = [...formData.speakers];
    updated[index] = { ...updated[index], [field]: value };
    updateField('speakers', updated);
  };

  const addSpeaker = () => {
    const newSpeaker: ActivitySpeaker = {
      id: `spk_${Date.now()}`,
      name: '',
      roleTitle: '',
      organization: '',
      avatarUrl: '',
      linkedinUrl: '',
      bio: ''
    };
    updateField('speakers', [...(formData.speakers || []), newSpeaker]);
  };

  const removeSpeaker = (index: number) => {
    if (!formData.speakers || formData.speakers.length <= 1) return;
    const updated = formData.speakers.filter((_, i) => i !== index);
    updateField('speakers', updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Event title is required');
      return;
    }
    if (!formData.date) {
      alert('Event date is required');
      return;
    }

    const activityToSave: Activity = {
      ...formData,
      isFeatured,
      slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    };

    onSave(activityToSave, isFeatured);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-[#121214] border border-neutral-800 rounded-2xl shadow-2xl p-6 md:p-8 text-neutral-100 flex flex-col justify-between relative"
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
                {formData.id.startsWith('act_') && !formData.title ? 'Create New Event / Workshop' : 'Edit Event & Workshop Details'}
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Configure posters, session logistics, speakers, and public registration.
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

        {/* Modal Body Form */}
        <form id="event-editor-form" onSubmit={handleSubmit} className="space-y-6 pt-6 pb-2">
          
          {/* SECTION 1: PRIMARY DETAILS */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                Event Title <span className="text-[#FA4616]">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="e.g., UiPath Studio Masterclass: Enterprise REFramework & Queues"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium"
              />
            </div>

            {/* Category, Mode & Status Synchronized 3-Column Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => updateField('category', e.target.value as ActivityCategory)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-orange-500 transition-all cursor-pointer"
                >
                  <option value="Workshop">Workshop</option>
                  <option value="Community Meetup">Community Meetup</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Bootcamp">Bootcamp</option>
                  <option value="Masterclass">Masterclass</option>
                  <option value="Certification">Certification</option>
                  <option value="Guest Lecture">Guest Lecture</option>
                  <option value="Ideathon">Ideathon</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Mode
                </label>
                <select
                  value={formData.eventType}
                  onChange={(e) => updateField('eventType', e.target.value as ActivityEventType)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-orange-500 transition-all cursor-pointer"
                >
                  <option value="Offline">Offline (In-Person)</option>
                  <option value="Hybrid">Hybrid (Campus + Zoom)</option>
                  <option value="Online">Online (Virtual Stream)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => updateField('status', e.target.value as ActivityStatus)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-orange-500 transition-all cursor-pointer font-medium"
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Ongoing">Ongoing / In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Archived">Archived</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>

            {/* Featured on Homepage Hero Toggle Switch */}
            <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-xl p-3.5 flex items-center justify-between hover:border-neutral-700 transition-all">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isFeatured ? 'bg-orange-500/20 text-[#FA4616]' : 'bg-neutral-800 text-neutral-400'}`}>
                  <Star size={16} className={isFeatured ? 'fill-orange-500 text-orange-500' : ''} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Featured on Homepage</div>
                  <div className="text-xs text-neutral-400">Pin this session as the top hero spotlight on the public landing page</div>
                </div>
              </div>
              
              <button
                type="button"
                role="switch"
                aria-checked={isFeatured}
                onClick={() => {
                  setIsFeatured(!isFeatured);
                  setIsDirty(true);
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-neutral-900 ${isFeatured ? 'bg-[#FA4616]' : 'bg-neutral-800'}`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${isFeatured ? 'translate-x-5' : 'translate-x-0'}`}
                />
              </button>
            </div>
          </div>

          {/* SECTION 2: POSTER & BANNER ASSET MANAGER */}
          <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-4 md:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ImageIcon size={16} className="text-[#FA4616]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
                  Poster & Banner Asset Manager
                </span>
              </div>
              
              {/* Explicit Dimension Guidelines Badge */}
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-neutral-950 text-neutral-300 border border-neutral-800 rounded-lg px-2.5 py-1">
                <span className="text-orange-400 font-semibold">Recommended:</span> 1080×1350 px (4:5) or 1920×1080 px (16:9) • Max 5MB
              </span>
            </div>

            {/* Dual Upload Strategy Tabs */}
            <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
              <button
                type="button"
                onClick={() => setUploadTab('dropzone')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${uploadTab === 'dropzone' ? 'bg-[#FA4616]/10 text-orange-400 border border-orange-500/30' : 'text-neutral-400 hover:text-white bg-neutral-900/60'}`}
              >
                <UploadCloud size={14} /> Direct File Upload / Drag & Drop
              </button>
              <button
                type="button"
                onClick={() => setUploadTab('url')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${uploadTab === 'url' ? 'bg-[#FA4616]/10 text-orange-400 border border-orange-500/30' : 'text-neutral-400 hover:text-white bg-neutral-900/60'}`}
              >
                <LinkIcon size={14} /> Asset URL / Quick Preset
              </button>
            </div>

            {/* Tab 1: Drag & Drop Dropzone */}
            {uploadTab === 'dropzone' && (
              <div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileSelect} 
                  accept="image/png,image/jpeg,image/jpg,image/webp" 
                  className="hidden" 
                />
                
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`border-dashed border-2 rounded-xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                    isDragging 
                      ? 'border-orange-500 bg-orange-500/10' 
                      : 'border-neutral-700 hover:border-orange-500/60 bg-neutral-950/60'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-700/80 flex items-center justify-center text-orange-400 group-hover:scale-105 transition-transform">
                    <UploadCloud size={22} />
                  </div>
                  <div className="text-sm font-semibold text-neutral-200">
                    Click to browse or drop event flyer / banner here
                  </div>
                  <div className="text-xs text-neutral-400">
                    Supports PNG, JPG, WebP up to 5MB
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: URL & Quick Presets */}
            {uploadTab === 'url' && (
              <div className="space-y-3">
                <input
                  type="text"
                  value={formData.bannerImage || ''}
                  onChange={(e) => {
                    updateField('bannerImage', e.target.value);
                    if (e.target.value.trim()) {
                      inspectImageDimensions(e.target.value.trim());
                    } else {
                      setImageSpecs(null);
                    }
                  }}
                  placeholder="https://example.com/poster.jpg or /uipath-session-1.png"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 transition-all font-mono"
                />

                {/* Quick Presets */}
                <div>
                  <div className="text-[11px] font-semibold text-neutral-400 uppercase mb-1.5 tracking-wider">
                    Quick Community Presets
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_POSTERS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          updateField('bannerImage', preset.url);
                          inspectImageDimensions(preset.url);
                        }}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${formData.bannerImage === preset.url ? 'bg-orange-500/20 text-orange-300 border-orange-500/40 font-semibold' : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700'}`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {uploadError && (
              <div className="flex items-center gap-2 p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">
                <AlertCircle size={14} className="shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Live Poster Preview & Exact Dimension Checker */}
            {formData.bannerImage && (
              <div className="bg-neutral-950 border border-neutral-800/90 rounded-xl p-3.5 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-32 h-24 sm:w-36 sm:h-24 rounded-lg overflow-hidden border border-neutral-700/80 shrink-0 bg-neutral-900 flex items-center justify-center">
                  <img
                    src={formData.bannerImage}
                    alt="Event Poster Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/uipath-session-1.png';
                    }}
                  />
                </div>

                <div className="flex-1 w-full space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-neutral-300">Live Poster Preview</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setUploadTab('dropzone');
                          fileInputRef.current?.click();
                        }}
                        className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-750 transition-all text-xs flex items-center gap-1 cursor-pointer"
                        title="Replace Image"
                      >
                        <RefreshCw size={12} /> Replace
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          updateField('bannerImage', '');
                          setImageSpecs(null);
                        }}
                        className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-300 border border-red-800/40 transition-all text-xs flex items-center gap-1 cursor-pointer"
                        title="Remove Image"
                      >
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Dimension Badge */}
                  {imageSpecs ? (
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-950/40 border border-emerald-700/30 text-emerald-400 text-xs font-mono">
                      <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                      <span>
                        Detected: {imageSpecs.width} × {imageSpecs.height} px · Ratio {imageSpecs.ratio}
                      </span>
                    </div>
                  ) : (
                    <div className="text-xs text-neutral-400 italic">
                      Inspecting image dimensions...
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3: LOGISTICS & TIMING */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                Date (YYYY-MM-DD) <span className="text-[#FA4616]">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => updateField('date', e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-orange-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                Start Time
              </label>
              <input
                type="text"
                value={formData.timeStart}
                onChange={(e) => updateField('timeStart', e.target.value)}
                placeholder="10:00 AM"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                End Time
              </label>
              <input
                type="text"
                value={formData.timeEnd}
                onChange={(e) => updateField('timeEnd', e.target.value)}
                placeholder="01:00 PM"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>
          </div>

          {/* SECTION 4: LOCATION, REGISTRATION & CAPACITY CONTROLS */}
          <div className="space-y-3.5 bg-neutral-900/40 border border-neutral-800 rounded-xl p-4 md:p-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5">
                <MapPin size={13} className="text-[#FA4616]" /> Venue / Campus Location
              </label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => updateField('venue', e.target.value)}
                placeholder="e.g., Auditorium B, ACE Engineering College"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-sm text-neutral-100 focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>

            {/* Dedicated Registration, Meeting & Capacity Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-neutral-800/80">
              {/* Registration / RSVP URL */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5">
                  <LinkIcon size={13} className="text-[#FA4616]" /> Registration / RSVP URL
                </label>
                <input
                  type="url"
                  value={formData.registrationUrl || ''}
                  onChange={(e) => updateField('registrationUrl', e.target.value)}
                  placeholder="https://forms.gle/... or https://lu.ma/..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 transition-all"
                />
              </div>

              {/* Virtual Meeting Link */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                    <Video size={13} className="text-[#FA4616]" /> Virtual Meeting Link
                  </label>
                  {(formData.eventType === 'Online' || formData.eventType === 'Hybrid') && (
                    <span className="text-[10px] bg-orange-500/10 text-orange-400 border border-orange-500/20 px-1.5 py-0.5 rounded font-medium">
                      Active for {formData.eventType}
                    </span>
                  )}
                </div>
                <input
                  type="url"
                  value={formData.meetingUrl || ''}
                  onChange={(e) => updateField('meetingUrl', e.target.value)}
                  placeholder="https://zoom.us/j/... or https://meet.google.com/..."
                  className={`w-full bg-neutral-900 border rounded-xl px-3.5 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 transition-all ${
                    formData.eventType === 'Online' || formData.eventType === 'Hybrid'
                      ? 'border-orange-500/40 ring-1 ring-orange-500/20'
                      : 'border-neutral-800'
                  }`}
                />
              </div>
            </div>

            {/* Seat Capacity & Target Audience */}
            <div className="pt-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5">
                <Users size={13} className="text-[#FA4616]" /> Seat Capacity & Target Audience
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={formData.capacity || ''}
                  onChange={(e) => updateField('capacity', e.target.value)}
                  placeholder="e.g., 120 Seats / Unlimited Virtual"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 transition-all"
                />
                <input
                  type="text"
                  value={formData.targetAudience || ''}
                  onChange={(e) => updateField('targetAudience', e.target.value)}
                  placeholder="e.g., Open to CSE, IT, ECE & All Years"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* SECTION 5: COMPLETE SPEAKER & GUEST ENTITY SECTION */}
          <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-4 md:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User size={16} className="text-[#FA4616]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
                  Speaker & Guest Entities
                </span>
              </div>
              <button
                type="button"
                onClick={addSpeaker}
                className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1 cursor-pointer bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-lg transition-all"
              >
                <Plus size={12} /> Add Co-Speaker / Guest
              </button>
            </div>

            <div className="space-y-4">
              {formData.speakers?.map((spk, idx) => (
                <div 
                  key={spk.id || idx}
                  className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-800/80">
                    <span className="text-xs font-semibold text-neutral-300">
                      Speaker {formData.speakers.length > 1 ? `#${idx + 1}` : 'Details'}
                    </span>
                    {formData.speakers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSpeaker(idx)}
                        className="text-neutral-400 hover:text-red-400 p-1 rounded transition-colors cursor-pointer"
                        title="Remove speaker"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  {/* Speaker Multi-Column Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-400 uppercase mb-1">
                        Speaker Full Name
                      </label>
                      <input
                        type="text"
                        value={spk.name}
                        onChange={(e) => updateSpeaker(idx, 'name', e.target.value)}
                        placeholder="e.g., Bhavani Munaga"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-400 uppercase mb-1">
                        Designation & Company / Org
                      </label>
                      <input
                        type="text"
                        value={spk.organization || spk.roleTitle ? `${spk.roleTitle ? spk.roleTitle + ' • ' : ''}${spk.organization}` : ''}
                        onChange={(e) => {
                          const parts = e.target.value.split('•');
                          if (parts.length > 1) {
                            updateSpeaker(idx, 'roleTitle', parts[0].trim());
                            updateSpeaker(idx, 'organization', parts.slice(1).join('•').trim());
                          } else {
                            updateSpeaker(idx, 'organization', e.target.value);
                            updateSpeaker(idx, 'roleTitle', 'Speaker');
                          }
                        }}
                        placeholder="e.g., Senior RPA & AI Developer, UiPath Community Core Member"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Headshot & LinkedIn Link */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* Headshot with 40x40 Live Preview */}
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-400 uppercase mb-1">
                        Speaker Headshot / Avatar URL
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full border border-neutral-700 overflow-hidden bg-neutral-900 shrink-0 flex items-center justify-center">
                          {spk.avatarUrl ? (
                            <img
                              src={spk.avatarUrl}
                              alt={spk.name || 'Speaker'}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = PRESET_AVATARS[0];
                              }}
                            />
                          ) : (
                            <User size={18} className="text-neutral-500" />
                          )}
                        </div>
                        <input
                          type="url"
                          value={spk.avatarUrl || ''}
                          onChange={(e) => updateSpeaker(idx, 'avatarUrl', e.target.value)}
                          placeholder="Avatar URL or preset"
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 transition-all text-xs font-mono"
                        />
                      </div>
                    </div>

                    {/* LinkedIn Profile Link */}
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-400 uppercase mb-1">
                        Speaker LinkedIn Profile
                      </label>
                      <div className="relative flex items-center">
                        <div className="absolute left-3 pointer-events-none text-neutral-400">
                          <Linkedin size={14} className="text-[#0A66C2]" />
                        </div>
                        <input
                          type="url"
                          value={spk.linkedinUrl || ''}
                          onChange={(e) => updateSpeaker(idx, 'linkedinUrl', e.target.value)}
                          placeholder="https://linkedin.com/in/username"
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 transition-all text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 6: EXECUTIVE SUMMARY & TOPICS */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                Executive Summary <span className="text-[#FA4616]">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={formData.summary}
                onChange={(e) => updateField('summary', e.target.value)}
                placeholder="Brief summary of the session agenda, target automations, and takeaways..."
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5">
                <Tag size={13} className="text-[#FA4616]" /> UiPath Topics Covered (comma-separated)
              </label>
              <input
                type="text"
                value={formData.uipathTopicsCovered ? formData.uipathTopicsCovered.join(', ') : ''}
                onChange={(e) => {
                  const topics = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
                  updateField('uipathTopicsCovered', topics);
                }}
                placeholder="UiPath Studio, REFramework, Orchestrator Queues, AI Computer Vision"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>
          </div>

        </form>

        {/* STICKY BOTTOM BAR */}
        <div className="sticky bottom-0 bg-[#121214]/95 backdrop-blur-md pt-4 mt-6 border-t border-neutral-800 flex items-center justify-between z-20 pb-1">
          {/* Left Side: Save Status Indicator */}
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isDirty ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
            <span className="text-xs font-medium text-neutral-300">
              {isDirty ? 'Draft unsaved • Pending modifications' : 'All changes synced'}
            </span>
          </div>

          {/* Right Side: Action Buttons */}
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
              <span>Save & Publish Event</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
