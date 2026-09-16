import React, { useState, useRef } from 'react';
import { 
  Settings, 
  Layers, 
  Trophy, 
  FileCode, 
  Plus, 
  Edit3, 
  Trash2, 
  Download, 
  CheckCircle2, 
  Save, 
  X,
  LayoutDashboard,
  Shield,
  Search,
  BookOpen,
  Users,
  BarChart3,
  Calendar,
  Sparkles,
  AlertTriangle,
  Megaphone,
  History,
  Eye,
  EyeOff,
  Star,
  ExternalLink,
  Newspaper,
  Upload,
  Linkedin,
  Github,
  Globe,
  Loader2
} from 'lucide-react';

import { 
  Activity, 
  LearningPath, 
  ProjectShowcase, 
  Challenge, 
  CommunityResource, 
  SiteSettings, 
  User,
  UserRole,
  UserStatus,
  ActivityDraft,
  DraftStatus,
  AnalyticsEvent,
  CommunityStatistic,
  Announcement,
  TimelineMilestone,
  LeadershipMember,
  RosterCategory,
  Article
} from '../types';

import { 
  ROSTER_CATEGORIES, 
  getRosterBadgeConfig, 
  getMemberCategories,
  getMemberTenure, 
  getMemberInitials, 
  isMemberActive 
} from '../utils/rosterBadges';
import { uploadMemberAvatarImage } from '../lib/supabase/services';

import { UserManagementSection } from '../components/UserManagementSection';
import { AdminAnalyticsSection } from '../components/AdminAnalyticsSection';

interface Props {
  activities: Activity[];
  learningPaths: LearningPath[];
  projects: ProjectShowcase[];
  challenges: Challenge[];
  resources: CommunityResource[];
  articles?: Article[];
  leadership?: LeadershipMember[];
  activityDrafts?: ActivityDraft[];
  users?: User[];
  analyticsEvents?: AnalyticsEvent[];
  completedModuleIds?: string[];
  settings: SiteSettings;
  currentUser: User;
  onSaveActivity: (act: Activity) => void;
  onDeleteActivity: (id: string) => void;
  onSaveProject: (proj: ProjectShowcase) => void;
  onDeleteProject: (id: string) => void;
  onSaveChallenge: (chal: Challenge) => void;
  onDeleteChallenge?: (id: string) => void;
  onSaveResource: (res: CommunityResource) => void;
  onDeleteResource: (id: string) => void;
  onSaveLeadership?: (member: LeadershipMember) => Promise<{ success: boolean; error?: string }> | Promise<boolean> | void;
  onDeleteLeadership?: (id: string) => Promise<{ success: boolean; error?: string }> | Promise<boolean> | void;
  onSaveLearningPath?: (path: LearningPath) => void;
  onDeleteLearningPath?: (id: string) => void;
  onSaveStatistic?: (stat: CommunityStatistic) => void;
  onDeleteStatistic?: (id: string) => void;
  onSaveAnnouncement?: (ann: Announcement) => void;
  onDeleteAnnouncement?: (id: string) => void;
  onSaveTimelineMilestone?: (milestone: TimelineMilestone) => void;
  onDeleteTimelineMilestone?: (id: string) => void;
  onSaveArticle?: (art: Article) => void;
  onDeleteArticle?: (id: string) => void;
  onReviewDraft?: (id: string, status: DraftStatus, notes?: string) => void;
  onPublishDraft?: (id: string) => void;
  onUpdateUserRole?: (userId: string, role: UserRole) => void;
  onUpdateUserStatus?: (userId: string, status: UserStatus) => void;
  onUpdateSettings: (newSettings: Partial<SiteSettings>) => void;
  onResetData: () => void;
  onExportJson: () => string;
  onImportJson: (json: string) => { success: boolean; error?: string };
  onNavigate: (view: string, detailId?: string) => void;
}

export const AdminPage: React.FC<Props> = ({
  activities,
  learningPaths,
  projects,
  challenges,
  resources,
  leadership = [],
  activityDrafts = [],
  users = [],
  analyticsEvents = [],
  completedModuleIds = [],
  settings,
  currentUser,
  onSaveActivity,
  onDeleteActivity,
  onSaveProject,
  onDeleteProject,
  onSaveChallenge,
  onDeleteChallenge,
  onSaveResource,
  onDeleteResource,
  onSaveLeadership,
  onDeleteLeadership,
  onSaveLearningPath,
  onDeleteLearningPath,
  onSaveStatistic,
  onDeleteStatistic,
  onSaveAnnouncement,
  onDeleteAnnouncement,
  onSaveTimelineMilestone,
  onDeleteTimelineMilestone,
  onSaveArticle,
  onDeleteArticle,
  onReviewDraft,
  onPublishDraft,
  onUpdateUserRole,
  onUpdateUserStatus,
  onUpdateSettings,
  onResetData,
  onExportJson,
  onImportJson,
  onNavigate,
  articles = []
}) => {
  const [activeTab, setActiveTab] = useState<
    'homepage' | 'statistics' | 'events' | 'projects' | 'learning' | 'blogs' | 'hackathons' | 'resources' | 'timeline' | 'team' | 'announcements' | 'review_queue' | 'users' | 'analytics' | 'backup'
  >('homepage');

  const [articleFilter, setArticleFilter] = useState<'ALL' | 'PUBLISHED' | 'SCHEDULED' | 'DRAFT'>('ALL');
  const [articleSearch, setArticleSearch] = useState('');

  // Success toast state
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // 1. HOMEPAGE FORM STATE
  const [heroHeading, setHeroHeading] = useState(settings.heroHeading || 'ACE UiPath Community');
  const [heroTagline, setHeroTagline] = useState(settings.heroTagline || 'A student community at ACE Engineering College focused on learning, building and exploring automation.');
  const [heroSubheadline, setHeroSubheadline] = useState(settings.heroSubheadline || '');
  const [primaryCtaText, setPrimaryCtaText] = useState(settings.primaryCtaText || 'Explore the Community');
  const [primaryCtaLink, setPrimaryCtaLink] = useState(settings.primaryCtaLink || 'activities');
  const [secondaryCtaText, setSecondaryCtaText] = useState(settings.secondaryCtaText || 'Start Learning');
  const [secondaryCtaLink, setSecondaryCtaLink] = useState(settings.secondaryCtaLink || 'learn');
  const [featuredActivityId, setFeaturedActivityId] = useState(settings.featuredActivityId || activities[0]?.id || '');
  const [storyHeading, setStoryHeading] = useState(settings.communityStoryHeading || 'Built by Students, Powered by UiPath');
  const [storyText, setStoryText] = useState(settings.communityStoryText || '');
  const [storyHighlight, setStoryHighlight] = useState(settings.communityStoryHighlight || '');
  const [storyImageUrl, setStoryImageUrl] = useState(settings.communityStoryImageUrl || '/ace-campus.jpg');
  const [allianceId, setAllianceId] = useState(settings.uipathAllianceId || '');
  const [communityEmail, setCommunityEmail] = useState(settings.communityEmail || 'uipath.community@aceec.ac.in');

  const handleSaveHomepage = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      heroHeading,
      heroTagline,
      heroSubheadline,
      primaryCtaText,
      primaryCtaLink,
      secondaryCtaText,
      secondaryCtaLink,
      featuredActivityId,
      communityStoryHeading: storyHeading,
      communityStoryText: storyText,
      communityStoryHighlight: storyHighlight,
      communityStoryImageUrl: storyImageUrl,
      uipathAllianceId: allianceId,
      communityEmail
    });
    showToast('Homepage content saved successfully! Changes are live.');
  };

  // 2. STATISTICS STATE & MODAL
  const currentStatistics = settings.statistics || [
    { id: 'stat_1', title: 'Students Trained', value: '950+', description: 'Workshops across branches', visible: true, order: 1 },
    { id: 'stat_2', title: 'Automations Built', value: '140+', description: 'Real bots deployed for campus needs', visible: true, order: 2 },
    { id: 'stat_3', title: 'UiPath Certifications', value: '95+', description: 'Certified Associate developers', visible: true, order: 3 },
    { id: 'stat_4', title: 'Hours Automated', value: '3,800+', description: 'Saved in academic tasks', visible: true, order: 4 }
  ];

  const [editingStat, setEditingStat] = useState<CommunityStatistic | null>(null);
  const [isStatModalOpen, setIsStatModalOpen] = useState(false);

  const handleOpenStatModal = (stat?: CommunityStatistic) => {
    if (stat) {
      setEditingStat(stat);
    } else {
      setEditingStat({
        id: `stat_${Date.now()}`,
        title: '',
        value: '',
        description: '',
        visible: true,
        order: currentStatistics.length + 1
      });
    }
    setIsStatModalOpen(true);
  };

  const handleSaveStatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStat || !editingStat.title || !editingStat.value) return;
    if (onSaveStatistic) {
      onSaveStatistic(editingStat);
    } else {
      const idx = currentStatistics.findIndex((s) => s.id === editingStat.id);
      let updated: CommunityStatistic[];
      if (idx >= 0) {
        updated = [...currentStatistics];
        updated[idx] = editingStat;
      } else {
        updated = [...currentStatistics, editingStat];
      }
      onUpdateSettings({ statistics: updated });
    }
    setIsStatModalOpen(false);
    showToast(`Statistic "${editingStat.title}" updated.`);
  };

  const handleDeleteStat = (id: string) => {
    if (onDeleteStatistic) {
      onDeleteStatistic(id);
    } else {
      const updated = currentStatistics.filter((s) => s.id !== id);
      onUpdateSettings({ statistics: updated });
    }
    showToast('Statistic removed.');
  };

  // 3. EVENTS / ACTIVITIES STATE & MODAL
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  const handleOpenActivityModal = (act?: Activity) => {
    if (act) {
      setEditingActivity(act);
    } else {
      setEditingActivity({
        id: `act_${Date.now()}`,
        slug: `activity-${Date.now()}`,
        title: '',
        category: 'Workshop',
        eventType: 'Offline',
        date: new Date().toISOString().split('T')[0],
        timeStart: '10:00 AM',
        timeEnd: '01:00 PM',
        venue: 'ACE Engineering College',
        summary: '',
        fullDescriptionMd: '',
        objectives: [],
        agenda: [],
        uipathTopicsCovered: ['UiPath Studio'],
        learningOutcomes: [],
        bannerImage: '/uipath-session-1.png',
        galleryImages: [],
        status: 'Upcoming',
        isFeatured: false,
        speakers: [{ id: `spk_${Date.now()}`, name: '', roleTitle: '', organization: '', avatarUrl: '', bio: '' }]
      });
    }
    setIsActivityModalOpen(true);
  };

  const handleSaveActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingActivity || !editingActivity.title || !editingActivity.date) return;
    const actToSave: Activity = {
      ...editingActivity,
      slug: editingActivity.slug || editingActivity.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };
    onSaveActivity(actToSave);
    setIsActivityModalOpen(false);
    showToast(`Event "${actToSave.title}" saved.`);
  };

  // 4. PROJECTS STATE & MODAL
  const [editingProject, setEditingProject] = useState<ProjectShowcase | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const handleOpenProjectModal = (proj?: ProjectShowcase) => {
    if (proj) {
      setEditingProject(proj);
    } else {
      setEditingProject({
        id: `proj_${Date.now()}`,
        slug: `project-${Date.now()}`,
        title: '',
        tagline: '',
        summary: '',
        problemStatement: '',
        solutionDescription: '',
        uipathToolsUsed: ['UiPath Studio'],
        roiMetrics: 'Saves 20 hours/month',
        previewImages: [],
        authorName: '',
        authorBranch: 'Computer Science',
        status: 'Approved',
        downloadCount: 0,
        upvotes: 0,
        createdAt: new Date().toISOString().split('T')[0]
      });
    }
    setIsProjectModalOpen(true);
  };

  const handleSaveProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.title || !editingProject.authorName) return;
    const projToSave: ProjectShowcase = {
      ...editingProject,
      slug: editingProject.slug || editingProject.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };
    onSaveProject(projToSave);
    setIsProjectModalOpen(false);
    showToast(`Project "${projToSave.title}" saved.`);
  };

  // 5. TIMELINE MILESTONES STATE & MODAL
  const currentTimeline = settings.timelineMilestones || [];
  const [editingMilestone, setEditingMilestone] = useState<TimelineMilestone | null>(null);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);

  const handleOpenMilestoneModal = (milestone?: TimelineMilestone) => {
    if (milestone) {
      setEditingMilestone(milestone);
    } else {
      setEditingMilestone({
        id: `tm_${Date.now()}`,
        year: '2026',
        title: '',
        category: 'Milestone',
        description: '',
        imageUrl: '',
        date: '',
        order: currentTimeline.length + 1
      });
    }
    setIsMilestoneModalOpen(true);
  };

  const handleSaveMilestoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMilestone || !editingMilestone.title || !editingMilestone.year) return;
    if (onSaveTimelineMilestone) {
      onSaveTimelineMilestone(editingMilestone);
    } else {
      const idx = currentTimeline.findIndex((m) => m.id === editingMilestone.id);
      let updated: TimelineMilestone[];
      if (idx >= 0) {
        updated = [...currentTimeline];
        updated[idx] = editingMilestone;
      } else {
        updated = [...currentTimeline, editingMilestone];
      }
      onUpdateSettings({ timelineMilestones: updated });
    }
    setIsMilestoneModalOpen(false);
    showToast(`Timeline milestone for ${editingMilestone.year} saved.`);
  };

  const handleDeleteMilestone = (id: string) => {
    if (onDeleteTimelineMilestone) {
      onDeleteTimelineMilestone(id);
    } else {
      const updated = currentTimeline.filter((m) => m.id !== id);
      onUpdateSettings({ timelineMilestones: updated });
    }
    showToast('Milestone removed.');
  };

  // 6. ANNOUNCEMENTS STATE & MODAL
  const currentAnnouncements = settings.announcements || [];
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);

  const handleOpenAnnouncementModal = (ann?: Announcement) => {
    if (ann) {
      setEditingAnnouncement(ann);
    } else {
      setEditingAnnouncement({
        id: `ann_${Date.now()}`,
        title: '',
        message: '',
        date: new Date().toISOString().split('T')[0],
        link: 'activities',
        isActive: true
      });
    }
    setIsAnnouncementModalOpen(true);
  };

  const handleSaveAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnnouncement || !editingAnnouncement.title || !editingAnnouncement.message) return;
    if (onSaveAnnouncement) {
      onSaveAnnouncement(editingAnnouncement);
    } else {
      const idx = currentAnnouncements.findIndex((a) => a.id === editingAnnouncement.id);
      let updated: Announcement[];
      if (idx >= 0) {
        updated = [...currentAnnouncements];
        updated[idx] = editingAnnouncement;
      } else {
        updated = [editingAnnouncement, ...currentAnnouncements];
      }
      onUpdateSettings({ announcements: updated });
    }
    setIsAnnouncementModalOpen(false);
    showToast(`Announcement "${editingAnnouncement.title}" saved.`);
  };

  const handleDeleteAnnouncement = (id: string) => {
    if (onDeleteAnnouncement) {
      onDeleteAnnouncement(id);
    } else {
      const updated = currentAnnouncements.filter((a) => a.id !== id);
      onUpdateSettings({ announcements: updated });
    }
    showToast('Announcement deleted.');
  };

  // 7. TEAM / LEADERSHIP STATE & MODAL
  const [editingMember, setEditingMember] = useState<LeadershipMember | null>(null);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isSavingMember, setIsSavingMember] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenMemberModal = (member?: LeadershipMember) => {
    setSelectedAvatarFile(null);
    setAvatarPreviewUrl(null);
    setAvatarError(null);

    if (member) {
      const isAlum = member.category === 'Alumni Mentor' || (member.category as string) === 'Alumni';
      const parsedStart = member.startYear ?? (member.academicYear ? parseInt(member.academicYear.split('-')[0]) || new Date().getFullYear() : new Date().getFullYear());
      const parsedEnd = member.endYear ?? (member.academicYear && !member.academicYear.toLowerCase().includes('present') ? parseInt(member.academicYear.split('-')[1]) || undefined : undefined);
      const activeState = member.isActive ?? (!isAlum && (member.academicYear ? member.academicYear.toLowerCase().includes('present') : true));
      
      const roles = getMemberCategories(member);

      setEditingMember({
        ...member,
        category: roles[0] || 'Core Team Member',
        rosterCategories: roles,
        startYear: parsedStart,
        endYear: parsedEnd,
        isActive: activeState,
        department: member.department || '',
        uipathProfileUrl: member.uipathProfileUrl || '',
        bio: member.bio || '',
        avatarUrl: member.avatarUrl || ''
      });
    } else {
      const currentYear = new Date().getFullYear();
      setEditingMember({
        id: `ldr_${Date.now()}`,
        name: '',
        roleTitle: '',
        category: 'Core Team Member',
        rosterCategories: ['Core Team Member'],
        department: '',
        startYear: currentYear,
        endYear: undefined,
        isActive: true,
        academicYear: `${currentYear} - Present`,
        avatarUrl: '',
        linkedinUrl: '',
        githubUrl: '',
        uipathProfileUrl: '',
        bio: '',
        contributions: [],
        orderIndex: leadership.length + 1
      });
    }
    setIsMemberModalOpen(true);
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setAvatarError('Image size exceeds 10MB limit.');
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setAvatarError('Only JPG, PNG, WebP, GIF, or SVG images are supported.');
      return;
    }

    setSelectedAvatarFile(file);
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreviewUrl(objectUrl);
    setAvatarError(null);
    if (avatarFileInputRef.current) {
      avatarFileInputRef.current.value = '';
    }
  };

  const handleRemoveAvatar = () => {
    setSelectedAvatarFile(null);
    setAvatarPreviewUrl(null);
    if (editingMember) {
      setEditingMember({ ...editingMember, avatarUrl: '' });
    }
    setAvatarError(null);
  };

  const handleSaveMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember || !editingMember.name.trim() || !editingMember.roleTitle.trim()) {
      showToast('Please enter member name and role title.');
      return;
    }

    const roles = getMemberCategories(editingMember);
    if (!roles || roles.length === 0) {
      showToast('Please select at least one roster role / designation.');
      return;
    }

    if (editingMember.bio && editingMember.bio.length > 250) {
      showToast('Bio cannot exceed 250 characters.');
      return;
    }

    const start = editingMember.startYear || new Date().getFullYear();
    const isActive = editingMember.isActive ?? true;
    const computedAcademicYear = isActive
      ? `${start} - Present`
      : `${start} - ${editingMember.endYear || start}`;

    let finalAvatarUrl = editingMember.avatarUrl?.trim() || '';

    // If a new local image was selected, upload to Supabase Storage before database write
    if (selectedAvatarFile) {
      setIsSavingMember(true);
      setAvatarUploading(true);
      setAvatarError(null);
      try {
        const uploadRes = await uploadMemberAvatarImage(selectedAvatarFile, editingMember.id);
        if (uploadRes.error || !uploadRes.url) {
          const err = uploadRes.error || 'Failed to upload photo to Supabase storage.';
          setAvatarError(err);
          showToast(err);
          setIsSavingMember(false);
          setAvatarUploading(false);
          return;
        }
        finalAvatarUrl = uploadRes.url;
      } catch (uploadErr: any) {
        const err = uploadErr?.message || 'Error occurred during image upload.';
        setAvatarError(err);
        showToast(err);
        setIsSavingMember(false);
        setAvatarUploading(false);
        return;
      } finally {
        setAvatarUploading(false);
      }
    } else {
      // Disallow non-persistent transient URLs
      if (finalAvatarUrl.startsWith('blob:') || finalAvatarUrl.startsWith('data:') || finalAvatarUrl.startsWith('file:')) {
        finalAvatarUrl = '';
      }
    }

    const memberToSave: LeadershipMember = {
      ...editingMember,
      name: editingMember.name.trim(),
      roleTitle: editingMember.roleTitle.trim(),
      category: roles[0],
      rosterCategories: roles,
      department: editingMember.department?.trim() || undefined,
      startYear: start,
      endYear: isActive ? undefined : (editingMember.endYear || start),
      isActive,
      academicYear: computedAcademicYear,
      avatarUrl: finalAvatarUrl,
      bio: editingMember.bio?.trim() || '',
      linkedinUrl: editingMember.linkedinUrl?.trim() || undefined,
      githubUrl: editingMember.githubUrl?.trim() || undefined,
      uipathProfileUrl: editingMember.uipathProfileUrl?.trim() || undefined
    };

    if (onSaveLeadership) {
      setIsSavingMember(true);
      try {
        const res = await onSaveLeadership(memberToSave);
        if (res && typeof res === 'object' && 'success' in res && !res.success) {
          showToast(res.error || 'Failed to save team member to Supabase.');
          return;
        }
        setSelectedAvatarFile(null);
        setAvatarPreviewUrl(null);
        setIsMemberModalOpen(false);
        showToast(`Team member "${memberToSave.name}" saved.`);
      } catch (err: any) {
        showToast(err?.message || 'Error occurred while saving team member.');
      } finally {
        setIsSavingMember(false);
      }
    }
  };

  // 8. HACKATHONS STATE & MODAL
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);

  const handleOpenChallengeModal = (chal?: Challenge) => {
    if (chal) {
      setEditingChallenge(chal);
    } else {
      setEditingChallenge({
        id: `chal_${Date.now()}`,
        slug: `hackathon-${Date.now()}`,
        title: '',
        theme: '',
        category: 'Hackathon',
        status: 'Active',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        prizePool: '₹25,000 + Vouchers',
        descriptionMd: '',
        rulesMd: '',
        evaluationCriteria: ['Innovation', 'Technical Depth', 'Presentation'],
        submissionCount: 0
      });
    }
    setIsChallengeModalOpen(true);
  };

  const handleSaveChallengeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingChallenge || !editingChallenge.title) return;
    onSaveChallenge({
      ...editingChallenge,
      slug: editingChallenge.slug || editingChallenge.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    });
    setIsChallengeModalOpen(false);
    showToast(`Hackathon "${editingChallenge.title}" saved.`);
  };

  // BACKUP & RESTORE
  const [backupJsonString, setBackupJsonString] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleDownloadBackupFile = () => {
    const json = onExportJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ace_uipath_content_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Database backup downloaded.');
  };

  const handleRestoreBackup = () => {
    if (!backupJsonString.trim()) return;
    const result = onImportJson(backupJsonString);
    if (result.success) {
      setImportStatus('Backup successfully restored! Reloading data...');
      showToast('Database successfully restored from JSON snapshot.');
      setBackupJsonString('');
    } else {
      setImportStatus(`Import Error: ${result.error}`);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '6rem' }}>
      {/* Toast Notification */}
      {saveSuccessMsg && (
        <div style={{
          position: 'fixed',
          top: '5rem',
          right: '2rem',
          zIndex: 100,
          background: '#059669',
          color: '#FFFFFF',
          padding: '0.85rem 1.5rem',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          boxShadow: 'var(--shadow-md)',
          fontWeight: 600,
          fontSize: '0.9rem'
        }}>
          <CheckCircle2 size={18} />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-orange">ACE Community Management</span>
            <span className="badge badge-slate">Admin Access Only</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 800 }}>
            Content Management System (CMS)
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Manage public website text, community statistics, events, student projects, hackathons, and timeline history.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => onNavigate('home')}
            className="btn btn-secondary btn-sm"
          >
            <Eye size={14} /> View Public Website
          </button>
        </div>
      </div>

      {/* Admin Layout: Left Navigation + Main Form / Content Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px minmax(0, 1fr)', gap: '1.75rem' }} className="admin-layout">
        {/* Navigation Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0.5rem 0.5rem 0.25rem 0.5rem' }}>
            PUBLIC CONTENT
          </div>

          {[
            { id: 'homepage', label: 'Homepage Content', icon: LayoutDashboard },
            { id: 'statistics', label: `Statistics (${currentStatistics.length})`, icon: BarChart3 },
            { id: 'events', label: `Events & Meetups (${activities.length})`, icon: Calendar },
            { id: 'projects', label: `Student Projects (${projects.length})`, icon: Trophy },
            { id: 'learning', label: `Learning Tracks (${learningPaths.length})`, icon: BookOpen },
            { id: 'blogs', label: `Blogs & Articles (${articles.length})`, icon: Newspaper },
            { id: 'hackathons', label: `Hackathons (${challenges.length})`, icon: Trophy },
            { id: 'resources', label: `Resources Vault (${resources.length})`, icon: FileCode },
            { id: 'timeline', label: `Timeline & History (${currentTimeline.length})`, icon: History },
            { id: 'team', label: `Team & People (${leadership.length})`, icon: Users },
            { id: 'announcements', label: `Announcements (${currentAnnouncements.length})`, icon: Megaphone }
          ].map((item) => {
            const Icon = item.icon;
            const isCurrent = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: isCurrent ? '0.75rem' : 'var(--radius-sm)',
                  background: isCurrent ? '#FA4616' : 'var(--bg-secondary)',
                  color: isCurrent ? '#FFFFFF' : 'var(--text-secondary)',
                  border: isCurrent ? 'none' : '1px solid var(--border-subtle)',
                  fontWeight: isCurrent ? 500 : 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '1rem 0.5rem 0.25rem 0.5rem' }}>
            SYSTEM & GOVERNANCE
          </div>

          {[
            { id: 'review_queue', label: 'Core Team Reviews', icon: Shield },
            { id: 'users', label: 'User Roles', icon: Users },
            { id: 'analytics', label: 'Analytics Telemetry', icon: BarChart3 },
            { id: 'backup', label: 'Disaster Recovery JSON', icon: Download }
          ].map((item) => {
            const Icon = item.icon;
            const isCurrent = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  background: isCurrent ? 'var(--uipath-orange)' : 'var(--bg-secondary)',
                  color: isCurrent ? '#FFFFFF' : 'var(--text-secondary)',
                  border: isCurrent ? 'none' : '1px solid var(--border-subtle)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Workspace */}
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
          
          {/* TAB 1: HOMEPAGE CMS */}
          {activeTab === 'homepage' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Homepage Content Settings</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Edit the public headline, introduction, primary call-to-actions, and featured session.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveHomepage} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>MAIN HERO HEADLINE</label>
                  <input
                    type="text"
                    required
                    value={heroHeading}
                    onChange={(e) => setHeroHeading(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.35rem', fontSize: '0.95rem' }}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Displays prominently at the top of the homepage.</span>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>HERO SUB-HEADLINE / COMMUNITY MISSION</label>
                  <textarea
                    rows={3}
                    required
                    value={heroTagline}
                    onChange={(e) => setHeroTagline(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.35rem', fontSize: '0.95rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>PRIMARY BUTTON TEXT</label>
                    <input
                      type="text"
                      value={primaryCtaText}
                      onChange={(e) => setPrimaryCtaText(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.35rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>PRIMARY BUTTON TARGET PAGE</label>
                    <select
                      value={primaryCtaLink}
                      onChange={(e) => setPrimaryCtaLink(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.35rem' }}
                    >
                      <option value="activities">Timeline & Activities</option>
                      <option value="learn">Learning Academy</option>
                      <option value="projects">Student Projects</option>
                      <option value="challenges">Hackathons</option>
                      <option value="join">Join Community</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>SECONDARY BUTTON TEXT</label>
                    <input
                      type="text"
                      value={secondaryCtaText}
                      onChange={(e) => setSecondaryCtaText(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.35rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>SECONDARY BUTTON TARGET PAGE</label>
                    <select
                      value={secondaryCtaLink}
                      onChange={(e) => setSecondaryCtaLink(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.35rem' }}
                    >
                      <option value="learn">Learning Academy</option>
                      <option value="activities">Timeline & Activities</option>
                      <option value="projects">Student Projects</option>
                      <option value="about">About & Legacy</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>FEATURED EVENT ON HOMEPAGE</label>
                  <select
                    value={featuredActivityId}
                    onChange={(e) => setFeaturedActivityId(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.35rem' }}
                  >
                    {activities.map((act) => (
                      <option key={act.id} value={act.id}>
                        {act.title} ({act.date}) - [{act.status}]
                      </option>
                    ))}
                  </select>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>This event is displayed with its visual poster on the homepage.</span>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Community Story Section</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>STORY SECTION HEADING</label>
                      <input
                        type="text"
                        value={storyHeading}
                        onChange={(e) => setStoryHeading(e.target.value)}
                        style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>STORY TEXT</label>
                      <textarea
                        rows={3}
                        value={storyText}
                        onChange={(e) => setStoryText(e.target.value)}
                        style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>HIGHLIGHT BOX TEXT</label>
                      <input
                        type="text"
                        value={storyHighlight}
                        onChange={(e) => setStoryHighlight(e.target.value)}
                        style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>STORY IMAGE URL (Campus / Community Visual)</label>
                      <input
                        type="text"
                        value={storyImageUrl}
                        onChange={(e) => setStoryImageUrl(e.target.value)}
                        placeholder="/ace-campus.jpg"
                        style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ paddingTop: '1rem' }}>
                  <button type="submit" className="btn btn-primary">
                    <Save size={16} /> Save Homepage Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: COMMUNITY STATISTICS CMS */}
          {activeTab === 'statistics' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Community Statistics</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Edit public counters. Do not hardcode numbers—modify real community values here.
                  </p>
                </div>
                <button
                  onClick={() => handleOpenStatModal()}
                  className="btn btn-primary btn-sm"
                >
                  <Plus size={14} /> Add Statistic
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {currentStatistics.map((stat) => (
                  <div
                    key={stat.id}
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--uipath-orange)' }}>
                          {stat.value}
                        </span>
                        <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                          {stat.title}
                        </strong>
                        {stat.visible === false && (
                          <span className="badge badge-slate" style={{ fontSize: '0.65rem' }}>Hidden</span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {stat.description}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleOpenStatModal(stat)}
                        className="btn btn-secondary btn-sm"
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteStat(stat.id)}
                        className="btn btn-secondary btn-sm"
                        style={{ color: '#EF4444' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: EVENTS & ACTIVITIES CMS */}
          {activeTab === 'events' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Events & Community Sessions</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Manage upcoming and archived workshops, expert meetups, and hackathons.
                  </p>
                </div>
                <button
                  onClick={() => handleOpenActivityModal()}
                  className="btn btn-primary btn-sm"
                >
                  <Plus size={14} /> Create Event
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {activities.map((act) => (
                  <div
                    key={act.id}
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '1rem'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        <span className="badge badge-orange">{act.category}</span>
                        <span className="badge badge-neutral">{act.eventType}</span>
                        <span className={`badge ${act.status === 'Upcoming' ? 'badge-green' : 'badge-slate'}`}>{act.status}</span>
                        {act.id === featuredActivityId && (
                          <span className="badge badge-orange" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                            <Star size={10} /> Homepage Featured
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                        {act.title}
                      </h3>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Date: {act.date} • Venue: {act.venue} • Speaker: {act.speakers?.[0]?.name || 'Community Leader'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => {
                          setFeaturedActivityId(act.id);
                          onUpdateSettings({ featuredActivityId: act.id });
                          showToast(`"${act.title}" set as homepage featured event.`);
                        }}
                        className="btn btn-secondary btn-sm"
                      >
                        Feature on Home
                      </button>
                      <button
                        onClick={() => handleOpenActivityModal(act)}
                        className="btn btn-secondary btn-sm"
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete event "${act.title}"?`)) {
                            onDeleteActivity(act.id);
                            showToast('Event removed.');
                          }
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ color: '#EF4444' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: STUDENT PROJECTS CMS */}
          {activeTab === 'projects' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Student Projects Management</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Add and curate real automations developed by students and teams.
                  </p>
                </div>
                <button
                  onClick={() => handleOpenProjectModal()}
                  className="btn btn-primary btn-sm"
                >
                  <Plus size={14} /> Add Project
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '1rem'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span className="badge badge-orange">{proj.uipathToolsUsed[0]}</span>
                        <span className="badge badge-green">{proj.status}</span>
                        <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>{proj.title}</strong>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Author: <strong>{proj.authorName}</strong> ({proj.authorBranch || 'Student'}) • Impact: {proj.roiMetrics}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleOpenProjectModal(proj)}
                        className="btn btn-secondary btn-sm"
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete project "${proj.title}"?`)) {
                            onDeleteProject(proj.id);
                            showToast('Project deleted.');
                          }
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ color: '#EF4444' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: LEARNING TRACKS CMS */}
          {activeTab === 'learning' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Learning Tracks & Modules</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Manage educational curricula and practical student starter templates.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {learningPaths.map((path) => (
                  <div key={path.id} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="badge badge-orange">{path.level}</span>
                        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>{path.title}</h3>
                      </div>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{path.modules.length} Modules</span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{path.description}</p>
                    
                    <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>INCLUDED MODULES</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {path.modules.map((m) => (
                          <div key={m.id} style={{ fontSize: '0.85rem', color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between' }}>
                            <span>• {m.title} ({m.durationMinutes} mins)</span>
                            <span style={{ color: 'var(--text-muted)' }}>{m.uipathTool}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5B: BLOGS & ARTICLES CMS */}
          {activeTab === 'blogs' && (
            <div>
              {/* Top bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Newspaper size={24} style={{ color: '#FA4616' }} />
                    Blogs & Technical Articles
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    Create, curate, schedule, and publish technical guides, architectural deep dives, and community write-ups.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('article_editor', 'new')}
                  style={{
                    background: '#FA4616',
                    color: '#FFFFFF',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    padding: '0.55rem 1.15rem',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 14px rgba(250, 70, 22, 0.25)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Plus size={16} />
                  <span>+ Create Article</span>
                </button>
              </div>

              {/* Filters & Search Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {(['ALL', 'PUBLISHED', 'SCHEDULED', 'DRAFT'] as const).map((filterVal) => {
                    const count = filterVal === 'ALL'
                      ? articles.length
                      : articles.filter(a => a.status === filterVal).length;
                    const isActive = articleFilter === filterVal;
                    return (
                      <button
                        key={filterVal}
                        type="button"
                        onClick={() => setArticleFilter(filterVal)}
                        style={{
                          background: isActive ? 'rgba(250, 70, 22, 0.15)' : 'var(--bg-primary)',
                          color: isActive ? '#FA4616' : 'var(--text-secondary)',
                          border: `1px solid ${isActive ? 'rgba(250, 70, 22, 0.35)' : 'var(--border-subtle)'}`,
                          borderRadius: '0.5rem',
                          padding: '0.35rem 0.75rem',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        {filterVal === 'ALL' ? 'All' : filterVal.charAt(0) + filterVal.slice(1).toLowerCase()} ({count})
                      </button>
                    );
                  })}
                </div>

                <div style={{ position: 'relative', minWidth: '240px' }}>
                  <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={articleSearch}
                    onChange={(e) => setArticleSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.45rem 0.75rem 0.45rem 2.2rem',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '0.5rem',
                      color: '#FFF',
                      fontSize: '0.82rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Article Cards List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {articles
                  .filter((art) => {
                    if (articleFilter !== 'ALL' && art.status !== articleFilter) return false;
                    if (articleSearch.trim()) {
                      const q = articleSearch.toLowerCase();
                      return (
                        art.title.toLowerCase().includes(q) ||
                        art.excerpt.toLowerCase().includes(q) ||
                        art.authorName.toLowerCase().includes(q) ||
                        art.category.toLowerCase().includes(q)
                      );
                    }
                    return true;
                  })
                  .map((art) => {
                    const isPublished = art.status === 'PUBLISHED';
                    const isScheduled = art.status === 'SCHEDULED';
                    const isDraft = art.status === 'DRAFT';

                    return (
                      <div
                        key={art.id}
                        style={{
                          background: 'rgba(23, 23, 23, 0.5)',
                          border: '1px solid #262626',
                          borderRadius: '1rem',
                          padding: '1.25rem',
                          transition: 'border-color 0.2s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.75rem'
                        }}
                      >
                        {/* Badges & Meta top row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <span className="badge badge-orange" style={{ fontSize: '0.7rem' }}>
                              {art.category}
                            </span>

                            {/* Status badge */}
                            {isPublished && (
                              <span
                                style={{
                                  fontSize: '0.7rem',
                                  fontWeight: 600,
                                  color: '#34D399',
                                  background: 'rgba(16, 185, 129, 0.12)',
                                  border: '1px solid rgba(52, 211, 153, 0.3)',
                                  padding: '0.15rem 0.55rem',
                                  borderRadius: '999px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.3rem'
                                }}
                              >
                                <CheckCircle2 size={11} /> Published
                              </span>
                            )}
                            {isScheduled && (
                              <span
                                style={{
                                  fontSize: '0.7rem',
                                  fontWeight: 600,
                                  color: '#60A5FA',
                                  background: 'rgba(59, 130, 246, 0.12)',
                                  border: '1px solid rgba(96, 165, 250, 0.3)',
                                  padding: '0.15rem 0.55rem',
                                  borderRadius: '999px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.3rem'
                                }}
                              >
                                <Calendar size={11} /> Scheduled ({art.scheduledAt ? new Date(art.scheduledAt).toLocaleDateString() : 'Pending'})
                              </span>
                            )}
                            {isDraft && (
                              <span
                                style={{
                                  fontSize: '0.7rem',
                                  fontWeight: 600,
                                  color: '#FBBF24',
                                  background: 'rgba(245, 158, 11, 0.12)',
                                  border: '1px solid rgba(251, 191, 36, 0.3)',
                                  padding: '0.15rem 0.55rem',
                                  borderRadius: '999px'
                                }}
                              >
                                Draft
                              </span>
                            )}

                            {/* Homepage Featured Badge */}
                            {art.isFeatured && (
                              <span
                                style={{
                                  fontSize: '0.7rem',
                                  fontWeight: 700,
                                  color: '#FA4616',
                                  background: 'rgba(250, 70, 22, 0.15)',
                                  border: '1px solid rgba(250, 70, 22, 0.35)',
                                  padding: '0.15rem 0.6rem',
                                  borderRadius: '999px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem'
                                }}
                              >
                                <Star size={11} style={{ fill: '#FA4616' }} /> HOMEPAGE FEATURED
                              </span>
                            )}
                          </div>

                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {art.views || art.viewsCount || 0} views • {art.readTimeMinutes || 5} min read
                          </div>
                        </div>

                        {/* Title & Excerpt */}
                        <div>
                          <h3
                            onClick={() => onNavigate('article_editor', art.slug || art.id)}
                            style={{
                              fontSize: '1.15rem',
                              fontWeight: 700,
                              color: '#FFFFFF',
                              cursor: 'pointer',
                              margin: 0,
                              marginBottom: '0.35rem'
                            }}
                          >
                            {art.title}
                          </h3>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                            {art.excerpt}
                          </p>
                        </div>

                        {/* Author, Date, and Actions row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            By <strong style={{ color: '#E5E7EB' }}>{art.authorName}</strong> ({art.authorRole}) • {new Date(art.publishedAt || art.createdAt).toLocaleDateString()}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {/* Feature toggle */}
                            <button
                              type="button"
                              onClick={() => {
                                if (onSaveArticle) {
                                  onSaveArticle({
                                    ...art,
                                    isFeatured: !art.isFeatured
                                  });
                                  showToast(art.isFeatured ? 'Article unfeatured from homepage' : 'Article set as Homepage Featured');
                                }
                              }}
                              className="btn btn-secondary btn-sm"
                              style={{
                                fontSize: '0.75rem',
                                color: art.isFeatured ? '#FA4616' : 'var(--text-secondary)',
                                borderColor: art.isFeatured ? 'rgba(250, 70, 22, 0.4)' : undefined
                              }}
                              title="Toggle Homepage Feature"
                            >
                              <Star size={13} style={{ fill: art.isFeatured ? '#FA4616' : 'none' }} />
                              <span>{art.isFeatured ? 'Featured' : 'Feature on Home'}</span>
                            </button>

                            {/* View Live */}
                            {(isPublished || isScheduled) && (
                              <button
                                type="button"
                                onClick={() => onNavigate('blog_detail', art.slug || art.id)}
                                className="btn btn-secondary btn-sm"
                                style={{ fontSize: '0.75rem' }}
                                title="View Public Article"
                              >
                                <ExternalLink size={13} />
                                <span>View</span>
                              </button>
                            )}

                            {/* Edit */}
                            <button
                              type="button"
                              onClick={() => onNavigate('article_editor', art.slug || art.id)}
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: '0.75rem' }}
                              title="Edit Article"
                            >
                              <Edit3 size={13} />
                              <span>Edit</span>
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete article "${art.title}"? This cannot be undone.`)) {
                                  if (onDeleteArticle) {
                                    onDeleteArticle(art.id);
                                    showToast('Article deleted.');
                                  }
                                }
                              }}
                              className="btn btn-secondary btn-sm"
                              style={{ color: '#EF4444', fontSize: '0.75rem' }}
                              title="Delete Article"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                {articles.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', borderRadius: '1rem', border: '1px dashed var(--border-subtle)' }}>
                    <Newspaper size={36} style={{ color: 'var(--text-muted)', margin: '0 auto 0.75rem', opacity: 0.5 }} />
                    <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#FFF', margin: '0 0 0.25rem' }}>No articles yet</p>
                    <p style={{ fontSize: '0.82rem', margin: '0 0 1rem' }}>Create your first technical article or guide for the ACE UiPath Community.</p>
                    <button
                      type="button"
                      onClick={() => onNavigate('article_editor', 'new')}
                      className="btn btn-primary btn-sm"
                    >
                      <Plus size={14} /> Create Article
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: HACKATHONS CMS */}
          {activeTab === 'hackathons' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Hackathons & Automation Sprints</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Configure annual campus competitions, timelines, and prize pools.
                  </p>
                </div>
                <button
                  onClick={() => handleOpenChallengeModal()}
                  className="btn btn-primary btn-sm"
                >
                  <Plus size={14} /> Add Hackathon
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {challenges.map((chal) => (
                  <div
                    key={chal.id}
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        <span className="badge badge-green">{chal.status}</span>
                        <span className="badge badge-neutral">{chal.category}</span>
                        <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>{chal.title}</strong>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Dates: {chal.startDate} to {chal.endDate} • Prize Pool: {chal.prizePool}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleOpenChallengeModal(chal)}
                        className="btn btn-secondary btn-sm"
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                      {onDeleteChallenge && (
                        <button
                          onClick={() => {
                            if (confirm(`Delete hackathon "${chal.title}"?`)) {
                              onDeleteChallenge(chal.id);
                              showToast('Hackathon removed.');
                            }
                          }}
                          className="btn btn-secondary btn-sm"
                          style={{ color: '#EF4444' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: RESOURCES VAULT CMS */}
          {activeTab === 'resources' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Resources & Templates Vault</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Downloadable starter workflows, cheat sheets, and architectural guides.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {resources.map((res) => (
                  <div
                    key={res.id}
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span className="badge badge-orange">{res.fileType}</span>
                        <span className="badge badge-slate">{res.category}</span>
                        <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>{res.title}</strong>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {res.description} • Downloads: {res.downloadCount}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`Delete resource "${res.title}"?`)) {
                          onDeleteResource(res.id);
                          showToast('Resource deleted.');
                        }
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ color: '#EF4444' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: COMMUNITY TIMELINE CMS */}
          {activeTab === 'timeline' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Community Timeline & History</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Record yearly milestones from 2022 to present. Real history of the ACE chapter.
                  </p>
                </div>
                <button
                  onClick={() => handleOpenMilestoneModal()}
                  className="btn btn-primary btn-sm"
                >
                  <Plus size={14} /> Add Milestone
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {currentTimeline.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--uipath-orange)' }}>{m.year}</span>
                        <span className="badge badge-slate">{m.category}</span>
                        <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>{m.title}</strong>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{m.description}</p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleOpenMilestoneModal(m)}
                        className="btn btn-secondary btn-sm"
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteMilestone(m.id)}
                        className="btn btn-secondary btn-sm"
                        style={{ color: '#EF4444' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: TEAM & LEADERSHIP CMS */}
          {activeTab === 'team' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Team & Leadership Roster</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Manage faculty advisors, student chapter leads, and alumni mentors.
                  </p>
                </div>
                <button
                  onClick={() => handleOpenMemberModal()}
                  className="btn btn-primary btn-sm"
                >
                  <Plus size={14} /> Add Member
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {leadership.map((mem) => {
                  const badge = getRosterBadgeConfig(mem.category);
                  const active = isMemberActive(mem);
                  const tenure = getMemberTenure(mem);
                  return (
                    <div
                      key={mem.id}
                      style={{
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                      }}
                      className="sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                          width: '52px',
                          height: '52px',
                          borderRadius: '50%',
                          border: '2px solid rgba(250, 70, 22, 0.35)',
                          overflow: 'hidden',
                          backgroundColor: '#262626',
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#E5E5E5',
                          fontWeight: 700,
                          fontSize: '1.1rem'
                        }}>
                          {mem.avatarUrl ? (
                            <img
                              src={mem.avatarUrl}
                              alt={mem.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                            />
                          ) : (
                            <span>{getMemberInitials(mem.name)}</span>
                          )}
                        </div>
                        <div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                            <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>{mem.name}</strong>
                            {getMemberCategories(mem).map((cat) => {
                              const badge = getRosterBadgeConfig(cat, active);
                              return (
                                <span
                                  key={cat}
                                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium border ${badge.bg} ${badge.text} ${badge.border}`}
                                  style={badge.customStyle}
                                >
                                  {badge.label}
                                </span>
                              );
                            })}
                            {active ? (
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-950/70 text-emerald-400 border border-emerald-800/60">
                                Active Lead
                              </span>
                            ) : (
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-neutral-800 text-neutral-400 border border-neutral-700">
                                Alumni / Former
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ color: '#FA4616', fontWeight: 600 }}>{mem.roleTitle}</span>
                            {mem.department && (
                              <>
                                <span>•</span>
                                <span>{mem.department}</span>
                              </>
                            )}
                            <span>•</span>
                            <span style={{ fontFamily: 'monospace' }}>{tenure}</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-end' }}>
                        {mem.linkedinUrl && (
                          <a
                            href={mem.linkedinUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.4rem 0.6rem' }}
                            title="LinkedIn Profile"
                          >
                            <Linkedin size={13} style={{ color: '#0A66C2' }} />
                          </a>
                        )}
                        {mem.githubUrl && (
                          <a
                            href={mem.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.4rem 0.6rem' }}
                            title="GitHub Profile"
                          >
                            <Github size={13} />
                          </a>
                        )}
                        {mem.uipathProfileUrl && (
                          <a
                            href={mem.uipathProfileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.4rem 0.6rem' }}
                            title="UiPath Profile"
                          >
                            <Globe size={13} style={{ color: '#FA4616' }} />
                          </a>
                        )}
                        <button
                          onClick={() => handleOpenMemberModal(mem)}
                          className="btn btn-secondary btn-sm"
                        >
                          <Edit3 size={14} /> Edit
                        </button>
                        {onDeleteLeadership && (
                          <button
                            onClick={async () => {
                              if (confirm(`Remove "${mem.name}" from team?`)) {
                                const res = await onDeleteLeadership(mem.id);
                                if (res && typeof res === 'object' && 'success' in res && !res.success) {
                                  showToast(res.error || 'Failed to remove team member.');
                                  return;
                                }
                                showToast('Member removed.');
                              }
                            }}
                            className="btn btn-secondary btn-sm"
                            style={{ color: '#EF4444' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 10: ANNOUNCEMENTS CMS */}
          {activeTab === 'announcements' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Marquee & Top Announcements</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Create broadcast announcements that appear on the public banner bar.
                  </p>
                </div>
                <button
                  onClick={() => handleOpenAnnouncementModal()}
                  className="btn btn-primary btn-sm"
                >
                  <Plus size={14} /> New Announcement
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {currentAnnouncements.map((ann) => (
                  <div
                    key={ann.id}
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span className={`badge ${ann.isActive ? 'badge-green' : 'badge-slate'}`}>
                          {ann.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>{ann.title}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({ann.date})</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{ann.message}</p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleOpenAnnouncementModal(ann)}
                        className="btn btn-secondary btn-sm"
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAnnouncement(ann.id)}
                        className="btn btn-secondary btn-sm"
                        style={{ color: '#EF4444' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 11: REVIEW QUEUE */}
          {activeTab === 'review_queue' && (
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>Core Team Draft Submissions</h2>
              {activityDrafts.filter((d) => d.status !== 'DRAFT').length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  <Shield size={36} style={{ color: '#10B981', margin: '0 auto 0.5rem auto' }} />
                  <div style={{ fontWeight: 600, color: '#FFF' }}>All drafts reviewed</div>
                  <p style={{ fontSize: '0.85rem' }}>No pending Core Team submissions currently awaiting admin approval.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {activityDrafts.filter((d) => d.status !== 'DRAFT').map((draft) => (
                    <div key={draft.id} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span className="badge badge-orange">{draft.status}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Created by {draft.createdBy}</span>
                      </div>
                      <h4 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>{draft.title}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{draft.summary}</p>
                      
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        {onPublishDraft && (
                          <button
                            onClick={() => {
                              onPublishDraft(draft.id);
                              showToast(`Draft "${draft.title}" published to public timeline!`);
                            }}
                            className="btn btn-primary btn-sm"
                          >
                            <CheckCircle2 size={14} /> Publish to Timeline
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 12: USER MANAGEMENT */}
          {activeTab === 'users' && (
            <UserManagementSection
              users={users}
              currentUser={currentUser}
              onUpdateRole={(userId, role) => {
                if (onUpdateUserRole) onUpdateUserRole(userId, role);
                showToast('User role updated.');
              }}
              onUpdateStatus={(userId, status) => {
                if (onUpdateUserStatus) onUpdateUserStatus(userId, status);
                showToast('User status updated.');
              }}
            />
          )}

          {/* TAB 13: ANALYTICS */}
          {activeTab === 'analytics' && (
            <AdminAnalyticsSection
              analyticsEvents={analyticsEvents}
              users={users}
              activities={activities}
              learningPaths={learningPaths}
              projects={projects}
              resources={resources}
              challenges={challenges}
              completedModuleIds={completedModuleIds}
            />
          )}

          {/* TAB 14: BACKUP & RECOVERY */}
          {activeTab === 'backup' && (
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>Disaster Recovery & JSON Backup</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Export a full snapshot of all community content (settings, activities, projects, statistics, timeline) or restore from an existing JSON file.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Export Full Database Snapshot</h3>
                  <button onClick={handleDownloadBackupFile} className="btn btn-primary btn-sm">
                    <Download size={14} /> Download Backup JSON
                  </button>
                </div>

                <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Restore Snapshot</h3>
                  <textarea
                    rows={4}
                    placeholder="Paste exported backup JSON here..."
                    value={backupJsonString}
                    onChange={(e) => setBackupJsonString(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', fontSize: '0.85rem', marginBottom: '0.75rem' }}
                  />
                  {importStatus && (
                    <div style={{ fontSize: '0.85rem', color: importStatus.includes('Error') ? '#EF4444' : '#10B981', marginBottom: '0.75rem' }}>
                      {importStatus}
                    </div>
                  )}
                  <button onClick={handleRestoreBackup} className="btn btn-secondary btn-sm">
                    Restore from JSON
                  </button>
                </div>

                <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#F87171', marginBottom: '0.5rem' }}>Factory Reset</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Reset all local data back to the default ACE community seed state.
                  </p>
                  <button
                    onClick={() => {
                      if (confirm('Reset all community content to default seed data? This cannot be undone.')) {
                        onResetData();
                        showToast('Database reset to defaults.');
                      }
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ color: '#F87171' }}
                  >
                    Reset to Default Data
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* MODAL: EDIT STATISTIC */}
      {isStatModalOpen && editingStat && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 110, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ width: '100%', maxWidth: '480px', background: 'var(--bg-secondary)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#FFF' }}>{editingStat.id.startsWith('stat_') ? 'Edit Statistic' : 'Add Statistic'}</h3>
              <button onClick={() => setIsStatModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveStatSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>TITLE (e.g. Students Trained)</label>
                <input
                  type="text"
                  required
                  value={editingStat.title}
                  onChange={(e) => setEditingStat({ ...editingStat, title: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>VALUE (e.g. 950+)</label>
                <input
                  type="text"
                  required
                  value={editingStat.value}
                  onChange={(e) => setEditingStat({ ...editingStat, value: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>DESCRIPTION / SUBTEXT</label>
                <input
                  type="text"
                  value={editingStat.description}
                  onChange={(e) => setEditingStat({ ...editingStat, description: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="statVisible"
                  checked={editingStat.visible !== false}
                  onChange={(e) => setEditingStat({ ...editingStat, visible: e.target.checked })}
                />
                <label htmlFor="statVisible" style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>Visible on Homepage</label>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsStatModalOpen(false)} className="btn btn-secondary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save Statistic</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT EVENT */}
      {isActivityModalOpen && editingActivity && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 110, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', overflowY: 'auto' }}>
          <div style={{ width: '100%', maxWidth: '640px', background: 'var(--bg-secondary)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#FFF' }}>Event / Workshop Details</h3>
              <button onClick={() => setIsActivityModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveActivitySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>EVENT TITLE *</label>
                <input
                  type="text"
                  required
                  value={editingActivity.title}
                  onChange={(e) => setEditingActivity({ ...editingActivity, title: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>CATEGORY</label>
                  <select
                    value={editingActivity.category}
                    onChange={(e) => setEditingActivity({ ...editingActivity, category: e.target.value as any })}
                    style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="Community Meetup">Community Meetup</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Bootcamp">Bootcamp</option>
                    <option value="Certification">Certification</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>MODE</label>
                  <select
                    value={editingActivity.eventType}
                    onChange={(e) => setEditingActivity({ ...editingActivity, eventType: e.target.value as any })}
                    style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                  >
                    <option value="Offline">Offline</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Online">Online</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>STATUS</label>
                  <select
                    value={editingActivity.status}
                    onChange={(e) => setEditingActivity({ ...editingActivity, status: e.target.value as any })}
                    style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>DATE (YYYY-MM-DD) *</label>
                  <input
                    type="date"
                    required
                    value={editingActivity.date}
                    onChange={(e) => setEditingActivity({ ...editingActivity, date: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>START TIME</label>
                  <input
                    type="text"
                    value={editingActivity.timeStart}
                    onChange={(e) => setEditingActivity({ ...editingActivity, timeStart: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>END TIME</label>
                  <input
                    type="text"
                    value={editingActivity.timeEnd}
                    onChange={(e) => setEditingActivity({ ...editingActivity, timeEnd: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>VENUE / LOCATION</label>
                <input
                  type="text"
                  value={editingActivity.venue}
                  onChange={(e) => setEditingActivity({ ...editingActivity, venue: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>EXECUTIVE SUMMARY *</label>
                <textarea
                  rows={2}
                  required
                  value={editingActivity.summary}
                  onChange={(e) => setEditingActivity({ ...editingActivity, summary: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>BANNER IMAGE / POSTER URL</label>
                <input
                  type="text"
                  value={editingActivity.bannerImage || ''}
                  onChange={(e) => setEditingActivity({ ...editingActivity, bannerImage: e.target.value })}
                  placeholder="/uipath-session-1.png or image URL"
                  style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Tip: You can use `/uipath-session-1.png` or `/uipath-session-2.png` for real session posters!</span>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>SPEAKER NAME</label>
                <input
                  type="text"
                  value={editingActivity.speakers?.[0]?.name || ''}
                  onChange={(e) => {
                    const spk = editingActivity.speakers?.[0] || { id: 'spk_1', name: '', roleTitle: '', organization: '', avatarUrl: '', bio: '' };
                    setEditingActivity({
                      ...editingActivity,
                      speakers: [{ ...spk, name: e.target.value }]
                    });
                  }}
                  style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsActivityModalOpen(false)} className="btn btn-secondary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save Event</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PROJECT */}
      {isProjectModalOpen && editingProject && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 110, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ width: '100%', maxWidth: '540px', background: 'var(--bg-secondary)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#FFF' }}>Student Project Details</h3>
              <button onClick={() => setIsProjectModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveProjectSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>PROJECT NAME *</label>
                <input
                  type="text"
                  required
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>STUDENT / TEAM NAME *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.authorName}
                    onChange={(e) => setEditingProject({ ...editingProject, authorName: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>DEPARTMENT / BRANCH</label>
                  <input
                    type="text"
                    value={editingProject.authorBranch || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, authorBranch: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>TOOLS USED (comma-separated)</label>
                <input
                  type="text"
                  value={editingProject.uipathToolsUsed.join(', ')}
                  onChange={(e) => setEditingProject({ ...editingProject, uipathToolsUsed: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                  style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>WHAT IT SOLVES / PROBLEM STATEMENT</label>
                <textarea
                  rows={2}
                  value={editingProject.problemStatement}
                  onChange={(e) => setEditingProject({ ...editingProject, problemStatement: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>IMPACT / ROI METRIC (e.g. Saves 30 hours/month)</label>
                <input
                  type="text"
                  value={editingProject.roiMetrics}
                  onChange={(e) => setEditingProject({ ...editingProject, roiMetrics: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsProjectModalOpen(false)} className="btn btn-secondary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT TIMELINE MILESTONE */}
      {isMilestoneModalOpen && editingMilestone && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 110, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ width: '100%', maxWidth: '480px', background: 'var(--bg-secondary)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#FFF' }}>Timeline Milestone</h3>
              <button onClick={() => setIsMilestoneModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveMilestoneSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>YEAR *</label>
                  <input
                    type="text"
                    required
                    value={editingMilestone.year}
                    onChange={(e) => setEditingMilestone({ ...editingMilestone, year: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>TITLE *</label>
                  <input
                    type="text"
                    required
                    value={editingMilestone.title}
                    onChange={(e) => setEditingMilestone({ ...editingMilestone, title: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>CATEGORY</label>
                <input
                  type="text"
                  value={editingMilestone.category}
                  onChange={(e) => setEditingMilestone({ ...editingMilestone, category: e.target.value })}
                  placeholder="Foundation, Milestone, Infrastructure..."
                  style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>DESCRIPTION</label>
                <textarea
                  rows={3}
                  required
                  value={editingMilestone.description}
                  onChange={(e) => setEditingMilestone({ ...editingMilestone, description: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsMilestoneModalOpen(false)} className="btn btn-secondary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save Milestone</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT ANNOUNCEMENT */}
      {isAnnouncementModalOpen && editingAnnouncement && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 110, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ width: '100%', maxWidth: '480px', background: 'var(--bg-secondary)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#FFF' }}>Announcement Banner</h3>
              <button onClick={() => setIsAnnouncementModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveAnnouncementSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>TITLE *</label>
                <input
                  type="text"
                  required
                  value={editingAnnouncement.title}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>MESSAGE *</label>
                <textarea
                  rows={2}
                  required
                  value={editingAnnouncement.message}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, message: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="annActive"
                  checked={editingAnnouncement.isActive}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, isActive: e.target.checked })}
                />
                <label htmlFor="annActive" style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>Active (Broadcast in Header)</label>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsAnnouncementModalOpen(false)} className="btn btn-secondary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save Announcement</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT HACKATHON */}
      {isChallengeModalOpen && editingChallenge && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 110, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ width: '100%', maxWidth: '520px', background: 'var(--bg-secondary)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#FFF' }}>Hackathon / Challenge</h3>
              <button onClick={() => setIsChallengeModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveChallengeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>HACKATHON TITLE *</label>
                <input
                  type="text"
                  required
                  value={editingChallenge.title}
                  onChange={(e) => setEditingChallenge({ ...editingChallenge, title: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>THEME</label>
                <input
                  type="text"
                  value={editingChallenge.theme}
                  onChange={(e) => setEditingChallenge({ ...editingChallenge, theme: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>PRIZE POOL</label>
                  <input
                    type="text"
                    value={editingChallenge.prizePool}
                    onChange={(e) => setEditingChallenge({ ...editingChallenge, prizePool: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>STATUS</label>
                  <select
                    value={editingChallenge.status}
                    onChange={(e) => setEditingChallenge({ ...editingChallenge, status: e.target.value as any })}
                    style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Active">Active</option>
                    <option value="Judging">Judging</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsChallengeModalOpen(false)} className="btn btn-secondary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save Hackathon</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT/CREATE TEAM MEMBER */}
      {isMemberModalOpen && editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#121214] border border-neutral-800 rounded-2xl shadow-2xl p-6 md:p-8 text-neutral-100">
            {/* Close Button (✕) */}
            <button
              type="button"
              onClick={() => setIsMemberModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white text-lg p-1 rounded-lg hover:bg-neutral-800 transition-colors"
              aria-label="Close dialog"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="mb-6 pr-8">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#FA4616]"></span>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {editingMember.name ? `Edit Member: ${editingMember.name}` : 'Add Leadership Member'}
                </h3>
              </div>
              <p className="text-xs text-neutral-400">
                Configure member profile, tenure, department, leadership role, and social presence.
              </p>
            </div>

            <form onSubmit={handleSaveMemberSubmit}>
              {/* Section 1: Avatar & Profile Photo */}
              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-850 mb-5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Avatar & Profile Photo
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
                  {/* Circular Preview Image */}
                  <div className="w-16 h-16 rounded-full object-cover border border-neutral-700 bg-neutral-800 flex-shrink-0 flex items-center justify-center text-neutral-300 font-bold text-lg overflow-hidden">
                    {(avatarPreviewUrl || (editingMember.avatarUrl && !editingMember.avatarUrl.startsWith('blob:'))) ? (
                      <img
                        src={avatarPreviewUrl || editingMember.avatarUrl}
                        alt={editingMember.name || 'Avatar Preview'}
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <span>{getMemberInitials(editingMember.name)}</span>
                    )}
                  </div>

                  {/* Image URL input & Action buttons */}
                  <div className="flex-1 w-full space-y-2.5">
                    <input
                      type="url"
                      value={avatarPreviewUrl ? '(New image selected from computer)' : (editingMember.avatarUrl || '')}
                      onChange={(e) => {
                        if (!avatarPreviewUrl) {
                          setEditingMember({ ...editingMember, avatarUrl: e.target.value });
                        }
                      }}
                      disabled={!!avatarPreviewUrl}
                      placeholder="Paste image URL (https://...)"
                      className="w-full bg-neutral-900 border border-neutral-850 rounded-xl px-3.5 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all disabled:opacity-60"
                    />

                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        ref={avatarFileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                        className="hidden"
                        onChange={handleAvatarFileChange}
                      />
                      <button
                        type="button"
                        onClick={() => avatarFileInputRef.current?.click()}
                        className="text-xs px-3 py-1.5 bg-neutral-850 hover:bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-300 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Upload size={13} className="text-orange-500" />
                        <span>{selectedAvatarFile ? 'Change Photo' : 'Choose Photo'}</span>
                      </button>

                      {selectedAvatarFile && (
                        <span className="text-xs text-neutral-400 font-mono truncate max-w-[150px]">
                          {selectedAvatarFile.name}
                        </span>
                      )}

                      {(avatarPreviewUrl || editingMember.avatarUrl) && (
                        <button
                          type="button"
                          onClick={handleRemoveAvatar}
                          className="text-xs px-3 py-1.5 bg-neutral-850 hover:bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-300 hover:text-red-300 transition-colors cursor-pointer"
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>

                    {avatarError && (
                      <p className="text-xs text-red-400">{avatarError}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 2: Name, Role & Department */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Full Name <span className="text-[#FA4616]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMember.name}
                    onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                    placeholder="e.g. Aditi Sharma"
                    className="w-full bg-neutral-900 border border-neutral-850 rounded-xl px-3.5 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Role Title <span className="text-[#FA4616]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMember.roleTitle}
                    onChange={(e) => setEditingMember({ ...editingMember, roleTitle: e.target.value })}
                    placeholder="e.g. Chapter President, Technical Lead"
                    className="w-full bg-neutral-900 border border-neutral-850 rounded-xl px-3.5 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Department / Batch / Roll No.
                </label>
                <input
                  type="text"
                  value={editingMember.department || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, department: e.target.value })}
                  placeholder="e.g. CSE - 2024 Batch"
                  className="w-full bg-neutral-900 border border-neutral-850 rounded-xl px-3.5 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                />
              </div>

              {/* Roster Roles / Designations Multi-Select Pills */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Roster Roles / Designations <span className="text-[#FA4616]">*</span>
                  </label>
                  <span className="text-xs text-neutral-500 font-mono">
                    {getMemberCategories(editingMember).length} selected
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 p-3 bg-neutral-900/60 border border-neutral-850 rounded-xl">
                  {ROSTER_CATEGORIES.map((role) => {
                    const currentSelected = getMemberCategories(editingMember);
                    const isSelected = currentSelected.includes(role);
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => {
                          let updated: RosterCategory[];
                          if (isSelected) {
                            updated = currentSelected.filter((c) => c !== role);
                          } else {
                            updated = [...currentSelected, role];
                          }
                          setEditingMember({
                            ...editingMember,
                            category: updated[0] || role,
                            rosterCategories: updated
                          });
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-orange-950/40 border-orange-500 text-orange-400 shadow-sm shadow-orange-500/10 font-semibold'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700 hover:bg-neutral-850'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] ${isSelected ? 'bg-orange-500 text-black font-bold' : 'border border-neutral-700 text-transparent'}`}>
                          ✓
                        </span>
                        <span>{role}</span>
                      </button>
                    );
                  })}
                </div>
                {getMemberCategories(editingMember).length === 0 && (
                  <p className="text-xs text-red-400 mt-1.5">At least one roster role / designation is required.</p>
                )}
              </div>

              {/* Section 3: Tenure Controls & Status Switch */}
              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-850 space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-neutral-200">Currently Serving / Active Lead</span>
                    <p className="text-xs text-neutral-400 mt-0.5">Toggle off for alumni, former leads, or completed tenures</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingMember.isActive ?? true}
                      onChange={(e) => {
                        const active = e.target.checked;
                        setEditingMember({
                          ...editingMember,
                          isActive: active,
                          endYear: active ? undefined : (editingMember.endYear || new Date().getFullYear())
                        });
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-neutral-850">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                      Start Year
                    </label>
                    <input
                      type="number"
                      min="2015"
                      max="2035"
                      value={editingMember.startYear || new Date().getFullYear()}
                      onChange={(e) => setEditingMember({ ...editingMember, startYear: parseInt(e.target.value) || new Date().getFullYear() })}
                      className="w-full bg-neutral-900 border border-neutral-850 rounded-xl px-3.5 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                      End Year {editingMember.isActive ? '(Active)' : ''}
                    </label>
                    <input
                      type="number"
                      min="2015"
                      max="2035"
                      disabled={editingMember.isActive ?? true}
                      value={editingMember.isActive ? '' : (editingMember.endYear || new Date().getFullYear())}
                      onChange={(e) => setEditingMember({ ...editingMember, endYear: parseInt(e.target.value) || undefined })}
                      placeholder={editingMember.isActive ? 'Present' : 'e.g. 2024'}
                      className="w-full bg-neutral-900 border border-neutral-850 rounded-xl px-3.5 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-neutral-400 font-medium">Tenure Preview:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-neutral-850 border border-neutral-800 px-2.5 py-1 rounded-md text-orange-400">
                      {editingMember.startYear || new Date().getFullYear()} - {(editingMember.isActive ?? true) ? 'Present' : (editingMember.endYear || new Date().getFullYear())}
                    </span>
                    {(editingMember.isActive ?? true) ? (
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-950/70 text-emerald-400 border border-emerald-800/60">
                        Active Lead
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700">
                        Alumni / Former
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 4: Social Profiles */}
              <div className="space-y-3 mb-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Social & Professional Profiles
                </label>

                <div className="relative flex items-center">
                  <div className="absolute left-3.5 pointer-events-none text-neutral-400 flex items-center">
                    <Linkedin size={16} className="text-[#0A66C2]" />
                  </div>
                  <input
                    type="url"
                    value={editingMember.linkedinUrl || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, linkedinUrl: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full bg-neutral-900 border border-neutral-850 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  />
                </div>

                <div className="relative flex items-center">
                  <div className="absolute left-3.5 pointer-events-none text-neutral-400 flex items-center">
                    <Github size={16} className="text-neutral-300" />
                  </div>
                  <input
                    type="url"
                    value={editingMember.githubUrl || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, githubUrl: e.target.value })}
                    placeholder="https://github.com/username"
                    className="w-full bg-neutral-900 border border-neutral-850 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  />
                </div>

                <div className="relative flex items-center">
                  <div className="absolute left-3.5 pointer-events-none text-neutral-400 flex items-center">
                    <Globe size={16} className="text-[#FA4616]" />
                  </div>
                  <input
                    type="url"
                    value={editingMember.uipathProfileUrl || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, uipathProfileUrl: e.target.value })}
                    placeholder="https://forum.uipath.com/u/username (UiPath Forum Profile)"
                    className="w-full bg-neutral-900 border border-neutral-850 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  />
                </div>
              </div>

              {/* Section 5: Short Bio */}
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Short Bio
                  </label>
                  <span className={`text-xs font-mono ${((editingMember.bio || '').length > 250) ? 'text-red-400 font-bold' : 'text-neutral-500'}`}>
                    {(editingMember.bio || '').length}/250
                  </span>
                </div>
                <textarea
                  rows={3}
                  maxLength={250}
                  value={editingMember.bio || ''}
                  onChange={(e) => {
                    if (e.target.value.length <= 250) {
                      setEditingMember({ ...editingMember, bio: e.target.value });
                    }
                  }}
                  placeholder="Brief summary of contributions, interests, and community role (max 250 characters)..."
                  className="w-full bg-neutral-900 border border-neutral-850 rounded-xl px-3.5 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all resize-none"
                />
              </div>

              {/* Sticky Action Footer */}
              <div className="pt-5 mt-6 border-t border-neutral-850 flex items-center justify-end gap-3 sticky bottom-0 bg-[#121214] pb-1 z-10">
                <button
                  type="button"
                  onClick={() => setIsMemberModalOpen(false)}
                  className="px-4 py-2 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-xl transition-all cursor-pointer border border-transparent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingMember || avatarUploading}
                  className="px-5 py-2 text-sm font-semibold bg-[#FA4616] hover:bg-[#ff5722] text-white rounded-xl shadow-lg shadow-orange-500/20 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={16} />
                  <span>{isSavingMember ? 'Saving...' : 'Save Member'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
