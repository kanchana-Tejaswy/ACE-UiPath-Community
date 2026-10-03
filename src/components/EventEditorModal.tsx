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
  Tag,
  Calendar,
  Clock,
  BookOpen,
  FileText,
  FileCode,
  Github,
  Film,
  Presentation,
  CheckSquare,
  Youtube,
  ExternalLink
} from 'lucide-react';
import { 
  Activity, 
  ActivityCategory, 
  ActivityEventType, 
  ActivityStatus, 
  ActivitySpeaker, 
  ActivityAgendaItem,
  KnowledgeGraphLink
} from '../types';
import { TechnicalMarkdownRenderer } from './TechnicalMarkdownRenderer';

interface Props {
  isOpen: boolean;
  activity: Activity | null;
  isFeaturedOnHome?: boolean;
  initialTab?: 'overview' | 'media' | 'speakers' | 'agenda' | 'vault';
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
  isFeaturedOnHome = false,
  initialTab = 'overview',
  onClose,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'media' | 'speakers' | 'agenda' | 'vault'>(initialTab);
  const [formData, setFormData] = useState<Activity | null>(null);
  const [isFeatured, setIsFeatured] = useState(false);
  const [uploadTab, setUploadTab] = useState<'dropzone' | 'url'>('dropzone');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imageSpecs, setImageSpecs] = useState<{ width: number; height: number; ratio: string } | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [mdTab, setMdTab] = useState<'write' | 'preview'>('write');

  // New item inputs
  const [newObjective, setNewObjective] = useState('');
  const [newOutcome, setNewOutcome] = useState('');
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  const inspectImageDimensions = (url: string) => {
    if (!url) {
      setImageSpecs(null);
      return;
    }
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

  const processFile = (file: File, target: 'banner' | 'gallery') => {
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
        if (target === 'banner') {
          updateField('bannerImage', result);
          inspectImageDimensions(result);
        } else {
          updateField('galleryImages', [...(formData?.galleryImages || []), result]);
        }
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  // Speaker Entity Management
  const updateSpeaker = (index: number, field: keyof ActivitySpeaker, value: string) => {
    if (!formData?.speakers) return;
    const updated = [...formData.speakers];
    updated[index] = { ...updated[index], [field]: value };
    updateField('speakers', updated);
  };

  const addSpeaker = () => {
    const newSpeaker: ActivitySpeaker = {
      id: `spk_${Date.now()}`,
      name: '',
      roleTitle: 'Speaker / RPA Lead',
      organization: 'ACE UiPath Community',
      avatarUrl: '/tejaswy.png',
      linkedinUrl: '',
      bio: ''
    };
    updateField('speakers', [...(formData?.speakers || []), newSpeaker]);
  };

  const removeSpeaker = (index: number) => {
    if (!formData?.speakers || formData.speakers.length <= 1) return;
    const updated = formData.speakers.filter((_, i) => i !== index);
    updateField('speakers', updated);
  };

  // Agenda Management
  const updateAgendaItem = (index: number, field: keyof ActivityAgendaItem, value: string) => {
    if (!formData?.agenda) return;
    const updated = [...formData.agenda];
    updated[index] = { ...updated[index], [field]: value };
    updateField('agenda', updated);
  };

  const addAgendaItem = () => {
    const newItem: ActivityAgendaItem = {
      time: '10:00 AM - 10:45 AM',
      title: 'Topic Overview & Hands-on Lab',
      description: 'Step-by-step walkthrough in UiPath Studio.',
      speaker: formData?.speakers?.[0]?.name || 'Lead Trainer'
    };
    updateField('agenda', [...(formData?.agenda || []), newItem]);
  };

  const removeAgendaItem = (index: number) => {
    if (!formData?.agenda) return;
    const updated = formData.agenda.filter((_, i) => i !== index);
    updateField('agenda', updated);
  };

  // Objectives & Outcomes
  const addObjective = () => {
    if (!newObjective.trim()) return;
    updateField('objectives', [...(formData?.objectives || []), newObjective.trim()]);
    setNewObjective('');
  };

  const removeObjective = (index: number) => {
    if (!formData?.objectives) return;
    updateField('objectives', formData.objectives.filter((_, i) => i !== index));
  };

  const addOutcome = () => {
    if (!newOutcome.trim()) return;
    updateField('learningOutcomes', [...(formData?.learningOutcomes || []), newOutcome.trim()]);
    setNewOutcome('');
  };

  const removeOutcome = (index: number) => {
    if (!formData?.learningOutcomes) return;
    updateField('learningOutcomes', formData.learningOutcomes.filter((_, i) => i !== index));
  };

  const addGalleryImage = () => {
    if (!newGalleryUrl.trim()) return;
    updateField('galleryImages', [...(formData?.galleryImages || []), newGalleryUrl.trim()]);
    setNewGalleryUrl('');
  };

  const removeGalleryImage = (index: number) => {
    if (!formData?.galleryImages) return;
    updateField('galleryImages', formData.galleryImages.filter((_, i) => i !== index));
  };

  // Knowledge Graph Management
  const updateKnowledgeGraphLink = (index: number, field: keyof KnowledgeGraphLink, value: string) => {
    if (!formData?.knowledgeGraphLinks) return;
    const updated = [...formData.knowledgeGraphLinks];
    updated[index] = { ...updated[index], [field]: value };
    updateField('knowledgeGraphLinks', updated);
  };

  const addKnowledgeGraphLink = () => {
    const newLink: KnowledgeGraphLink = {
      id: `kg_${Date.now()}`,
      category: 'Learning Academy',
      title: 'Track: UiPath Studio Automation',
      subtitle: 'Hands-on workflow patterns',
      targetView: 'learn'
    };
    updateField('knowledgeGraphLinks', [...(formData?.knowledgeGraphLinks || []), newLink]);
  };

  const removeKnowledgeGraphLink = (index: number) => {
    if (!formData?.knowledgeGraphLinks) return;
    const updated = formData.knowledgeGraphLinks.filter((_, i) => i !== index);
    updateField('knowledgeGraphLinks', updated);
  };

  const resetKnowledgeGraphToDefaults = () => {
    updateField('knowledgeGraphLinks', [
      { id: 'kg_1', category: 'Learning Academy', title: 'Track 3: REFramework Architect', subtitle: 'State machines & queues', targetView: 'learn' },
      { id: 'kg_2', category: 'Student Automations', title: 'Grade Extractor Bot', subtitle: 'Saves 45 hrs/semester', targetView: 'projects' },
      { id: 'kg_3', category: 'Resources Vault', title: 'REFramework Production Starter', subtitle: 'Starter template ZIP', targetView: 'resources' }
    ]);
  };

  const handleSubmit = (e?: React.FormEvent | React.MouseEvent) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    if (!formData) return;
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

  // Switch to initialTab whenever modal opens or initialTab changes
  useEffect(() => {
    if (initialTab && isOpen) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // Initialize form when modal opens
  useEffect(() => {
    if (activity) {
      setFormData({
        ...activity,
        speakers: activity.speakers && activity.speakers.length > 0 
          ? activity.speakers 
          : [{ id: `spk_${Date.now()}`, name: '', roleTitle: 'Lead Trainer', organization: 'ACE UiPath Community', avatarUrl: '/tejaswy.png', linkedinUrl: '', bio: '' }],
        agenda: activity.agenda && activity.agenda.length > 0
          ? activity.agenda
          : [
              { time: '10:00 AM - 10:30 AM', title: 'Welcome & Problem Context', description: 'Overview of enterprise RPA use-case.', speaker: 'Lead Speaker' },
              { time: '10:30 AM - 12:30 PM', title: 'Hands-on Workflow Automation', description: 'Live coding and debugging in UiPath Studio.', speaker: 'Technical Trainer' },
              { time: '12:30 PM - 01:00 PM', title: 'Q&A & Certificate Assessment', description: 'Wrap-up, project deployment, and badges.', speaker: 'All Facilitators' }
            ],
        objectives: activity.objectives || ['Master enterprise robotic process automation', 'Build hands-on bots in UiPath Studio'],
        learningOutcomes: activity.learningOutcomes || ['Deploy working automations with error handling', 'Understand UiPath Academic Alliance certification pathways'],
        galleryImages: activity.galleryImages || [],
        knowledgeGraphLinks: activity.knowledgeGraphLinks && activity.knowledgeGraphLinks.length > 0
          ? activity.knowledgeGraphLinks
          : [
              { id: 'kg_1', category: 'Learning Academy', title: 'Track 3: REFramework Architect', subtitle: 'State machines & queues', targetView: 'learn' },
              { id: 'kg_2', category: 'Student Automations', title: 'Grade Extractor Bot', subtitle: 'Saves 45 hrs/semester', targetView: 'projects' },
              { id: 'kg_3', category: 'Resources Vault', title: 'REFramework Production Starter', subtitle: 'Starter template ZIP', targetView: 'resources' }
            ]
      });
      setIsFeatured(isFeaturedOnHome || activity.isFeatured || false);
      setIsDirty(false);
      setUploadError(null);

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

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="max-w-4xl w-full max-h-[92vh] overflow-y-auto bg-[#121214] border border-neutral-800 rounded-2xl shadow-2xl p-6 md:p-8 text-neutral-100 flex flex-col justify-between relative"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 #121214' }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#FA4616]">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                {formData.id.startsWith('act_') && !formData.title ? 'Create New Activity / Meetup' : 'Complete Event & Meetup Editor'}
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Full CMS control over session logistics, media assets, multi-speakers, curriculum agenda, and vault downloads.
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

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 border-b border-neutral-800 pt-3 pb-3">
          {[
            { id: 'overview', label: '1. Logistics & Overview', icon: Calendar },
            { id: 'media', label: '2. Media & Posters', icon: ImageIcon },
            { id: 'speakers', label: `3. Speakers (${formData.speakers?.length || 0})`, icon: User },
            { id: 'agenda', label: '4. Curriculum & Agenda', icon: BookOpen },
            { id: 'vault', label: '5. Post-Event Vault', icon: FileCode }
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isCurrent 
                    ? 'bg-[#FA4616] text-white shadow-md shadow-orange-500/20' 
                    : 'bg-neutral-900/70 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body Form */}
        <form id="event-editor-form" onSubmit={handleSubmit} className="space-y-6 pt-4 pb-2">
          
          {/* TAB 1: OVERVIEW & LOGISTICS */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Event Title <span className="text-[#FA4616]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="e.g., RPA & AI Industry Expert Meetup 2026"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium"
                />
              </div>

              {/* Category, Mode & Status */}
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

              {/* Timing & Logistics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Date (YYYY-MM-DD) <span className="text-[#FA4616]">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => updateField('date', e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-orange-500 transition-all"
                  />
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

              {/* Venue & Capacity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5">
                    <Users size={13} className="text-[#FA4616]" /> Seat Capacity & Target Audience
                  </label>
                  <input
                    type="text"
                    value={formData.capacity || ''}
                    onChange={(e) => updateField('capacity', e.target.value)}
                    placeholder="e.g., 175 Seats / All CSE, IT & Engineering Years"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-sm text-neutral-100 focus:outline-none focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              {/* Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5">
                    <Video size={13} className="text-[#FA4616]" /> Virtual Meeting Stream Link
                  </label>
                  <input
                    type="url"
                    value={formData.meetingUrl || ''}
                    onChange={(e) => updateField('meetingUrl', e.target.value)}
                    placeholder="https://zoom.us/j/... or https://meet.google.com/..."
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              {/* Live YouTube Channel / Recording URL */}
              <div className="bg-neutral-900/50 border border-neutral-800/90 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-200 flex items-center gap-1.5">
                    <Youtube size={15} className="text-red-500" /> Session Recording / Live YouTube Channel Link
                  </label>
                  {formData.recordingUrl && (
                    <a
                      href={formData.recordingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 hover:underline font-medium"
                    >
                      Test Link <ExternalLink size={11} />
                    </a>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-red-500">
                    <Youtube size={16} />
                  </div>
                  <input
                    type="url"
                    value={formData.recordingUrl || ''}
                    onChange={(e) => updateField('recordingUrl', e.target.value)}
                    placeholder="https://youtube.com/live/... or https://youtube.com/watch?v=... or https://youtube.com/@channel"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3.5 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-red-500 transition-all font-mono"
                  />
                </div>
                <p className="text-[11px] text-neutral-400">
                  Provide a YouTube Live stream link, YouTube channel URL, or session video recording. This automatically embeds an interactive video player on the event details page.
                </p>
              </div>

              {/* Featured on Homepage */}
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
          )}

          {/* TAB 2: MEDIA & POSTERS */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              {/* Primary Poster */}
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-4 md:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ImageIcon size={16} className="text-[#FA4616]" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
                      Primary Event Poster / Banner
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-neutral-950 text-neutral-300 border border-neutral-800 rounded-lg px-2.5 py-1">
                    <span className="text-orange-400 font-semibold">Recommended:</span> 1080×1350 px (4:5) or 1920×1080 px (16:9)
                  </span>
                </div>

                <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
                  <button
                    type="button"
                    onClick={() => setUploadTab('dropzone')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${uploadTab === 'dropzone' ? 'bg-[#FA4616]/10 text-orange-400 border border-orange-500/30' : 'text-neutral-400 hover:text-white bg-neutral-900/60'}`}
                  >
                    <UploadCloud size={14} /> Direct File Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadTab('url')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${uploadTab === 'url' ? 'bg-[#FA4616]/10 text-orange-400 border border-orange-500/30' : 'text-neutral-400 hover:text-white bg-neutral-900/60'}`}
                  >
                    <LinkIcon size={14} /> Asset URL / Presets
                  </button>
                </div>

                {uploadTab === 'dropzone' ? (
                  <div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          processFile(e.target.files[0], 'banner');
                        }
                      }} 
                      accept="image/png,image/jpeg,image/jpg,image/webp" 
                      className="hidden" 
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                          processFile(e.dataTransfer.files[0], 'banner');
                        }
                      }}
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                      className={`border-dashed border-2 rounded-xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                        isDragging ? 'border-orange-500 bg-orange-500/10' : 'border-neutral-700 hover:border-orange-500/60 bg-neutral-950/60'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-700/80 flex items-center justify-center text-orange-400">
                        <UploadCloud size={22} />
                      </div>
                      <div className="text-sm font-semibold text-neutral-200">
                        Click to browse or drop event flyer / poster here
                      </div>
                      <div className="text-xs text-neutral-400">Supports PNG, JPG, WebP up to 5MB</div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={formData.bannerImage || ''}
                      onChange={(e) => {
                        updateField('bannerImage', e.target.value);
                        inspectImageDimensions(e.target.value.trim());
                      }}
                      placeholder="https://example.com/poster.jpg or /uipath-session-1.png"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-sm text-neutral-100 font-mono"
                    />
                    <div className="flex flex-wrap gap-2">
                      {PRESET_POSTERS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            updateField('bannerImage', preset.url);
                            inspectImageDimensions(preset.url);
                          }}
                          className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${formData.bannerImage === preset.url ? 'bg-orange-500/20 text-orange-300 border-orange-500/40 font-semibold' : 'bg-neutral-900 text-neutral-300 border-neutral-800'}`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preview */}
                {formData.bannerImage && (
                  <div className="bg-neutral-950 border border-neutral-800/90 rounded-xl p-3.5 flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-32 h-24 sm:w-36 sm:h-24 rounded-lg overflow-hidden border border-neutral-700/80 shrink-0 bg-neutral-900 flex items-center justify-center">
                      <img
                        src={formData.bannerImage}
                        alt="Event Poster Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/uipath-session-1.png'; }}
                      />
                    </div>
                    <div className="flex-1 w-full space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-neutral-300">Live Poster Preview</span>
                        <button
                          type="button"
                          onClick={() => {
                            updateField('bannerImage', '');
                            setImageSpecs(null);
                          }}
                          className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:text-red-300 border border-red-800/40 text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      </div>
                      {imageSpecs && (
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-950/40 border border-emerald-700/30 text-emerald-400 text-xs font-mono">
                          <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                          <span>Detected: {imageSpecs.width} × {imageSpecs.height} px · Ratio {imageSpecs.ratio}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Gallery Images */}
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-4 md:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon size={16} className="text-[#FA4616]" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
                      Event Gallery Photos ({formData.galleryImages?.length || 0})
                    </span>
                  </div>
                  <input
                    type="file"
                    ref={galleryFileInputRef}
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        processFile(e.target.files[0], 'gallery');
                      }
                    }}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => galleryFileInputRef.current?.click()}
                    className="text-xs bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <UploadCloud size={12} /> Upload Photo
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    placeholder="Add photo URL: https://..."
                    className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-neutral-100"
                  />
                  <button
                    type="button"
                    onClick={addGalleryImage}
                    className="btn btn-secondary btn-sm"
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>

                {formData.galleryImages && formData.galleryImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {formData.galleryImages.map((imgUrl, idx) => (
                      <div key={idx} className="relative group rounded-lg overflow-hidden border border-neutral-800 aspect-video bg-neutral-950">
                        <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(idx)}
                          className="absolute top-1 right-1 bg-red-600/80 hover:bg-red-600 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: SPEAKERS & GUESTS */}
          {activeTab === 'speakers' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-200 flex items-center gap-2">
                  <User size={16} className="text-[#FA4616]" /> Speakers, Mentors & Facilitators
                </span>
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
                  <div key={spk.id || idx} className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-3 relative group">
                    <div className="flex items-center justify-between pb-2 border-b border-neutral-800/80">
                      <span className="text-xs font-semibold text-neutral-300">Speaker #{idx + 1}</span>
                      {formData.speakers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSpeaker(idx)}
                          className="text-neutral-400 hover:text-red-400 p-1 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-400 uppercase mb-1">Speaker Name</label>
                        <input
                          type="text"
                          value={spk.name}
                          onChange={(e) => updateSpeaker(idx, 'name', e.target.value)}
                          placeholder="e.g., Kanchana Tejaswy"
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-neutral-100"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-400 uppercase mb-1">Designation & Org</label>
                        <input
                          type="text"
                          value={spk.roleTitle ? `${spk.roleTitle}${spk.organization ? ' • ' + spk.organization : ''}` : spk.organization || ''}
                          onChange={(e) => {
                            const parts = e.target.value.split('•');
                            if (parts.length > 1) {
                              updateSpeaker(idx, 'roleTitle', parts[0].trim());
                              updateSpeaker(idx, 'organization', parts.slice(1).join('•').trim());
                            } else {
                              updateSpeaker(idx, 'roleTitle', e.target.value);
                            }
                          }}
                          placeholder="e.g., Lead RPA Trainer • ACE UiPath Community"
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-neutral-100"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-400 uppercase mb-1">Headshot Avatar URL</label>
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-full border border-neutral-700 overflow-hidden bg-neutral-900 shrink-0 flex items-center justify-center">
                            {spk.avatarUrl ? (
                              <img src={spk.avatarUrl} alt={spk.name || 'Speaker'} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/tejaswy.png'; }} />
                            ) : (
                              <User size={16} className="text-neutral-500" />
                            )}
                          </div>
                          <input
                            type="text"
                            value={spk.avatarUrl || ''}
                            onChange={(e) => updateSpeaker(idx, 'avatarUrl', e.target.value)}
                            placeholder="/tejaswy.png or https://..."
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-400 uppercase mb-1">LinkedIn Profile</label>
                        <div className="relative flex items-center">
                          <div className="absolute left-3 pointer-events-none text-neutral-400"><Linkedin size={14} className="text-[#0A66C2]" /></div>
                          <input
                            type="url"
                            value={spk.linkedinUrl || ''}
                            onChange={(e) => updateSpeaker(idx, 'linkedinUrl', e.target.value)}
                            placeholder="https://linkedin.com/in/username"
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-sm text-neutral-100 text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-400 uppercase mb-1">Short Speaker Bio</label>
                      <input
                        type="text"
                        value={spk.bio || ''}
                        onChange={(e) => updateSpeaker(idx, 'bio', e.target.value)}
                        placeholder="Expertise in UiPath Studio, Document Understanding, and enterprise bot architecture."
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-neutral-100"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CURRICULUM, AGENDA & MARKDOWN */}
          {activeTab === 'agenda' && (
            <div className="space-y-5">
              {/* Executive Summary */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Executive Summary <span className="text-[#FA4616]">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.summary}
                  onChange={(e) => updateField('summary', e.target.value)}
                  placeholder="Brief summary of the session agenda, target automations, and takeaways..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 transition-all resize-none"
                />
              </div>

              {/* Topics Covered */}
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

              {/* Objectives & Outcomes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Objectives */}
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 space-y-2.5">
                  <span className="text-xs font-semibold uppercase text-neutral-300 flex items-center gap-1.5">
                    <CheckSquare size={13} className="text-[#FA4616]" /> Key Objectives
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newObjective}
                      onChange={(e) => setNewObjective(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addObjective(); } }}
                      placeholder="Add an objective..."
                      className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1 text-xs text-neutral-100"
                    />
                    <button type="button" onClick={addObjective} className="btn btn-secondary btn-sm"><Plus size={12} /></button>
                  </div>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {formData.objectives?.map((obj, i) => (
                      <div key={i} className="flex items-center justify-between text-xs bg-neutral-900/60 px-2.5 py-1.5 rounded border border-neutral-850">
                        <span>• {obj}</span>
                        <button type="button" onClick={() => removeObjective(i)} className="text-neutral-400 hover:text-red-400"><Trash2 size={12} /></button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Outcomes */}
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 space-y-2.5">
                  <span className="text-xs font-semibold uppercase text-neutral-300 flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-400" /> Learning Outcomes
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newOutcome}
                      onChange={(e) => setNewOutcome(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addOutcome(); } }}
                      placeholder="Add an outcome..."
                      className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1 text-xs text-neutral-100"
                    />
                    <button type="button" onClick={addOutcome} className="btn btn-secondary btn-sm"><Plus size={12} /></button>
                  </div>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {formData.learningOutcomes?.map((out, i) => (
                      <div key={i} className="flex items-center justify-between text-xs bg-neutral-900/60 px-2.5 py-1.5 rounded border border-neutral-850">
                        <span>• {out}</span>
                        <button type="button" onClick={() => removeOutcome(i)} className="text-neutral-400 hover:text-red-400"><Trash2 size={12} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Agenda Timeline Items */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-200 flex items-center gap-2">
                    <Clock size={15} className="text-[#FA4616]" /> Interactive Session Agenda Timeline
                  </span>
                  <button
                    type="button"
                    onClick={addAgendaItem}
                    className="text-xs bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={12} /> Add Agenda Slot
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.agenda?.map((item, idx) => (
                    <div key={idx} className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={item.time}
                          onChange={(e) => updateAgendaItem(idx, 'time', e.target.value)}
                          placeholder="e.g., 10:00 AM - 10:45 AM"
                          className="w-1/3 bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-xs text-orange-400 font-mono"
                        />
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => updateAgendaItem(idx, 'title', e.target.value)}
                          placeholder="Slot Title / Topic"
                          className="flex-1 bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-xs text-neutral-100 font-semibold"
                        />
                        <button
                          type="button"
                          onClick={() => removeAgendaItem(idx)}
                          className="text-neutral-400 hover:text-red-400 p-1"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={item.description || ''}
                          onChange={(e) => updateAgendaItem(idx, 'description', e.target.value)}
                          placeholder="Brief description of activity..."
                          className="flex-1 bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-xs text-neutral-400"
                        />
                        <input
                          type="text"
                          value={item.speaker || ''}
                          onChange={(e) => updateAgendaItem(idx, 'speaker', e.target.value)}
                          placeholder="Speaker"
                          className="w-1/4 bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-xs text-neutral-300"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Full Description Markdown */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                    <FileText size={13} className="text-[#FA4616]" /> Full Markdown Description & Curriculum Deep-Dive
                  </label>
                  
                  {/* Mode Selector */}
                  <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() => setMdTab('write')}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                        mdTab === 'write' ? 'bg-[#FA4616] text-white shadow-sm' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      Write Markdown
                    </button>
                    <button
                      type="button"
                      onClick={() => setMdTab('preview')}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                        mdTab === 'preview' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      Live Preview
                    </button>
                  </div>
                </div>

                {mdTab === 'write' ? (
                  <div className="space-y-1.5">
                    {/* Quick Format Actions */}
                    <div className="flex flex-wrap items-center gap-1.5 bg-neutral-950 border border-neutral-800/80 rounded-lg px-2.5 py-1.5 text-[11px] text-neutral-400">
                      <span className="text-[10px] text-neutral-500 font-semibold uppercase mr-1">Quick Tools:</span>
                      <button
                        type="button"
                        onClick={() => updateField('fullDescriptionMd', (formData.fullDescriptionMd || '') + '\n\n### Heading Title\n')}
                        className="hover:text-white px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded cursor-pointer"
                      >
                        + Heading
                      </button>
                      <button
                        type="button"
                        onClick={() => updateField('fullDescriptionMd', (formData.fullDescriptionMd || '') + ' **bold text** ')}
                        className="hover:text-white px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded cursor-pointer font-bold"
                      >
                        **B**
                      </button>
                      <button
                        type="button"
                        onClick={() => updateField('fullDescriptionMd', (formData.fullDescriptionMd || '') + '\n- Bullet point 1\n- Bullet point 2\n')}
                        className="hover:text-white px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded cursor-pointer"
                      >
                        • List
                      </button>
                      <button
                        type="button"
                        onClick={() => updateField('fullDescriptionMd', (formData.fullDescriptionMd || '') + '\n1. Step 1\n2. Step 2\n')}
                        className="hover:text-white px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded cursor-pointer"
                      >
                        1. Numbered
                      </button>
                      <button
                        type="button"
                        onClick={() => updateField('fullDescriptionMd', (formData.fullDescriptionMd || '') + '\n```vb\n// UiPath code snippet\n```\n')}
                        className="hover:text-white px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded cursor-pointer"
                      >
                        &lt;/&gt; Code
                      </button>
                      <button
                        type="button"
                        onClick={() => updateField('fullDescriptionMd', (formData.fullDescriptionMd || '') + '\n> [!NOTE]\n> Important session detail or prerequisite here.\n')}
                        className="hover:text-white px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded cursor-pointer"
                      >
                        [!Note]
                      </button>
                    </div>

                    <textarea
                      rows={7}
                      value={formData.fullDescriptionMd || ''}
                      onChange={(e) => updateField('fullDescriptionMd', e.target.value)}
                      placeholder="### About the Session&#10;**RPA Kickstart: Mastering UiPath Basics** is a beginner-friendly session...&#10;&#10;### Curriculum&#10;1. Introduction to RPA & UiPath&#10;- Understand fundamentals of automation&#10;- UiPath Studio workflow setup"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3.5 text-xs text-neutral-100 font-mono leading-relaxed focus:border-[#FA4616] focus:outline-none transition-all"
                    />
                  </div>
                ) : (
                  <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 min-h-[160px] max-h-[350px] overflow-y-auto">
                    <TechnicalMarkdownRenderer content={formData.fullDescriptionMd || ''} />
                  </div>
                )}
              </div>

              {/* Interlinked Community Knowledge Graph Cards */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 md:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-[#FA4616]" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
                      Interlinked Community Knowledge Graph Cards
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={resetKnowledgeGraphToDefaults}
                      className="text-[11px] text-neutral-400 hover:text-neutral-200 bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded-lg cursor-pointer transition-all"
                    >
                      Reset Defaults
                    </button>
                    <button
                      type="button"
                      onClick={addKnowledgeGraphLink}
                      className="text-xs bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer hover:bg-orange-500/20 transition-all font-semibold"
                    >
                      <Plus size={12} /> Add Knowledge Card
                    </button>
                  </div>
                </div>
                <p className="text-xs text-neutral-400">
                  Connect related learning tracks, student automation bots, and resource starters directly to this activity.
                </p>

                <div className="space-y-3">
                  {(!formData.knowledgeGraphLinks || formData.knowledgeGraphLinks.length === 0) ? (
                    <div className="text-center py-4 text-xs text-neutral-500 bg-neutral-900/40 rounded-lg border border-neutral-800">
                      No custom knowledge cards configured. <button type="button" onClick={resetKnowledgeGraphToDefaults} className="text-orange-400 underline">Add default cards</button>
                    </div>
                  ) : (
                    formData.knowledgeGraphLinks.map((kg, kgIdx) => (
                      <div key={kg.id || kgIdx} className="bg-neutral-900 border border-neutral-800 rounded-xl p-3.5 space-y-2.5">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div>
                            <label className="block text-[10px] uppercase font-semibold text-neutral-400 mb-1">Badge / Category</label>
                            <input
                              type="text"
                              value={kg.category}
                              onChange={(e) => updateKnowledgeGraphLink(kgIdx, 'category', e.target.value)}
                              placeholder="e.g., Learning Academy"
                              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-orange-400 font-semibold"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-[10px] uppercase font-semibold text-neutral-400">Card Title</label>
                              <button
                                type="button"
                                onClick={() => removeKnowledgeGraphLink(kgIdx)}
                                className="text-neutral-400 hover:text-red-400 text-xs p-0.5"
                                title="Delete card"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                            <input
                              type="text"
                              value={kg.title}
                              onChange={(e) => updateKnowledgeGraphLink(kgIdx, 'title', e.target.value)}
                              placeholder="e.g., Track 3: REFramework Architect"
                              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-medium"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] uppercase font-semibold text-neutral-400 mb-1">Subtitle / Highlight</label>
                            <input
                              type="text"
                              value={kg.subtitle}
                              onChange={(e) => updateKnowledgeGraphLink(kgIdx, 'subtitle', e.target.value)}
                              placeholder="e.g., State machines & queues"
                              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-300"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-semibold text-neutral-400 mb-1">Target View / Destination</label>
                            <select
                              value={kg.targetView || 'learn'}
                              onChange={(e) => updateKnowledgeGraphLink(kgIdx, 'targetView', e.target.value)}
                              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 font-mono"
                            >
                              <option value="learn">Academy Track (learn)</option>
                              <option value="projects">Projects Showcase (projects)</option>
                              <option value="resources">Resources Vault (resources)</option>
                              <option value="challenges">Hackathons & Challenges (challenges)</option>
                              <option value="blogs">Articles & Blogs (blogs)</option>
                              <option value="join">Join Community (join)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: POST-EVENT VAULT ARTIFACTS */}
          {activeTab === 'vault' && (
            <div className="space-y-4">
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-200 flex items-center gap-2">
                  <FileCode size={16} className="text-[#FA4616]" /> Post-Event Artifacts & Knowledge Vault Links
                </span>
                <p className="text-xs text-neutral-400">
                  Provide direct public access to recordings, slide decks, source repositories, and ready-to-run UiPath workflows.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                        <Youtube size={14} className="text-red-500" /> Session Video Recording / YouTube Live URL
                      </label>
                      {formData.recordingUrl && (
                        <a
                          href={formData.recordingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 hover:underline"
                        >
                          Test <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                    <input
                      type="url"
                      value={formData.recordingUrl || ''}
                      onChange={(e) => updateField('recordingUrl', e.target.value)}
                      placeholder="https://youtube.com/live/... or watch?v=..."
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-neutral-100 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 mb-1 flex items-center gap-1.5">
                      <Presentation size={14} className="text-amber-400" /> Presentation Slides Deck URL
                    </label>
                    <input
                      type="url"
                      value={formData.slidesUrl || ''}
                      onChange={(e) => updateField('slidesUrl', e.target.value)}
                      placeholder="https://docs.google.com/presentation/..."
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-neutral-100 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 mb-1 flex items-center gap-1.5">
                      <Github size={14} className="text-neutral-300" /> GitHub Code Repository URL
                    </label>
                    <input
                      type="url"
                      value={formData.githubUrl || ''}
                      onChange={(e) => updateField('githubUrl', e.target.value)}
                      placeholder="https://github.com/kanchana-Tejaswy/..."
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-neutral-100 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 mb-1 flex items-center gap-1.5">
                      <FileCode size={14} className="text-emerald-400" /> Workflow Package (.xaml / .nupkg / .zip)
                    </label>
                    <input
                      type="url"
                      value={formData.workflowPackageUrl || ''}
                      onChange={(e) => updateField('workflowPackageUrl', e.target.value)}
                      placeholder="https://.../workflow.nupkg or .zip"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-neutral-100 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

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
