import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Save,
  Send,
  Calendar,
  Eye,
  Edit3,
  Columns,
  Image as ImageIcon,
  X,
  Check,
  AlertCircle,
  Clock,
  FileText,
  Trash2,
  Upload,
  Link2,
  Bold,
  Italic,
  Code,
  List,
  ListOrdered,
  Table,
  Sparkles,
  Info,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { Article, ArticleCategory, ArticleStatus, User, ARTICLE_CATEGORIES, BannerAspectRatio } from '../types';
import { 
  normalizeBannerAspectRatio, 
  BANNER_ASPECT_RATIO_OPTIONS, 
  getBannerContainerStyle, 
  getBannerImageStyle,
  getBannerContainerClasses,
  getBannerImageClasses
} from '../utils/bannerRatio';
import { TechnicalMarkdownRenderer } from '../components/TechnicalMarkdownRenderer';

interface Props {
  currentUser: User;
  articleId?: string | null;
  articles: Article[];
  onSaveArticle: (article: Article) => void;
  onNavigate: (view: string, detailId?: string) => void;
  onUploadCover?: (file: File) => Promise<string | null>;
}

const DEFAULT_MARKDOWN_TEMPLATE = `# Overview

Provide a technical introduction to the problem, the business context, and what engineers will build.

## Architecture & Prerequisites

* UiPath Studio (Modern Experience)
* .NET 8 / C# runtime
* UiPath Orchestrator Community Instance

\`\`\`csharp
// Example: C# Invoke Code snippet
Console.WriteLine("Initializing UiPath Dispatcher process...");
\`\`\`

> [!NOTE]
> Ensure that you configure your Orchestrator credentials in Assets before running.

## Implementation Steps

1. Define Orchestrator Queue structure
2. Initialize transaction states
3. Implement robust exception handling`;

const PRESET_COVERS = [
  {
    name: 'UiPath Studio & Automation',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Enterprise Architecture & Cloud',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'AI Agents & Machine Learning',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Cybernetic Automation Grid',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80'
  }
];

export const ArticleEditorPage: React.FC<Props> = ({
  currentUser,
  articleId,
  articles,
  onSaveArticle,
  onNavigate,
  onUploadCover
}) => {
  // Authorization check: only ADMIN or CORE_TEAM
  const isAuthorized = currentUser.role === 'ADMIN' || currentUser.role === 'CORE_TEAM';

  // Find existing article if editing
  const existingArticle = articleId ? articles.find((a) => a.id === articleId || a.slug === articleId) : null;

  // Form states
  const [title, setTitle] = useState(existingArticle?.title || '');
  const [slug, setSlug] = useState(existingArticle?.slug || '');
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(Boolean(existingArticle?.slug));
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const [category, setCategory] = useState<ArticleCategory>(existingArticle?.category || 'Tutorial');
  const [authorName, setAuthorName] = useState(existingArticle?.authorName || currentUser.name || 'ACE Core Team');
  const [authorRole, setAuthorRole] = useState(
    existingArticle?.authorRole || (currentUser.role === 'ADMIN' ? 'Community Lead & Architect' : 'ACE Core Team Member')
  );
  const [authorAvatar, setAuthorAvatar] = useState(existingArticle?.authorAvatar || currentUser.avatarUrl || '');
  const [coverImageUrl, setCoverImageUrl] = useState(existingArticle?.coverImageUrl || PRESET_COVERS[0].url);
  const [aspectRatio, setAspectRatio] = useState<BannerAspectRatio>(
    normalizeBannerAspectRatio(existingArticle?.coverBanner?.aspectRatio || existingArticle?.aspectRatio)
  );
  const [excerpt, setExcerpt] = useState(existingArticle?.excerpt || '');
  const [content, setContent] = useState(
    existingArticle?.content ||
      `# Overview\n\nProvide a technical introduction to the problem, the business context, and what engineers will build.\n\n## Architecture & Prerequisites\n\n* UiPath Studio (Modern Experience)\n* .NET 8 / C# runtime\n* UiPath Orchestrator Community Instance\n\n\`\`\`csharp\n// Example: C# Invoke Code snippet\nConsole.WriteLine("Initializing UiPath Dispatcher process...");\n\`\`\`\n\n> [!NOTE]\n> Ensure that you configure your Orchestrator credentials in Assets before running.\n\n## Implementation Steps\n\n1. Define Orchestrator Queue structure\n2. Initialize transaction states\n3. Implement robust exception handling`
  );
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(existingArticle?.tags || ['UiPath', 'RPA', 'Automation']);
  const [isFeatured, setIsFeatured] = useState(existingArticle?.isFeatured || false);

  // Editor layout: 'split' | 'edit' | 'preview'
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronize form state when editing article loads or when articleId changes
  useEffect(() => {
    if (existingArticle) {
      setTitle(existingArticle.title || '');
      setSlug(existingArticle.slug || '');
      setIsSlugManuallyEdited(Boolean(existingArticle.slug));
      setCategory(existingArticle.category || 'Tutorial');
      setAuthorName(existingArticle.authorName || currentUser.name || 'ACE Core Team');
      setAuthorRole(existingArticle.authorRole || (currentUser.role === 'ADMIN' ? 'Community Lead & Architect' : 'ACE Core Team Member'));
      setAuthorAvatar(existingArticle.authorAvatar || currentUser.avatarUrl || '');
      setCoverImageUrl(existingArticle.coverImageUrl || existingArticle.coverImage || PRESET_COVERS[0].url);
      setAspectRatio(normalizeBannerAspectRatio(existingArticle.coverBanner?.aspectRatio || existingArticle.aspectRatio));
      setExcerpt(existingArticle.excerpt || '');
      setContent(existingArticle.content || DEFAULT_MARKDOWN_TEMPLATE);
      setTags(existingArticle.tags || ['UiPath', 'RPA', 'Automation']);
      setIsFeatured(Boolean(existingArticle.isFeatured));
      setIsDirty(false);
    } else if (!articleId) {
      setTitle('');
      setSlug('');
      setIsSlugManuallyEdited(false);
      setCategory('Tutorial');
      setAuthorName(currentUser.name || 'ACE Core Team');
      setAuthorRole(currentUser.role === 'ADMIN' ? 'Community Lead & Architect' : 'ACE Core Team Member');
      setAuthorAvatar(currentUser.avatarUrl || '');
      setCoverImageUrl(PRESET_COVERS[0].url);
      setAspectRatio('default');
      setExcerpt('');
      setContent(DEFAULT_MARKDOWN_TEMPLATE);
      setTags(['UiPath', 'RPA', 'Automation']);
      setIsFeatured(false);
      setIsDirty(false);
    }
  }, [articleId, existingArticle?.id]);

  // Schedule modal state
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');

  // Preset covers dropdown
  const [showPresetPicker, setShowPresetPicker] = useState(false);

  // Textarea ref for inserting formatting
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-generate slug from title if not manually customized
  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    setIsDirty(true);
    if (!isSlugManuallyEdited) {
      setSlug(slugify(newTitle));
    }
  };

  const handleSlugChange = (newSlug: string) => {
    setSlug(slugify(newSlug));
    setIsSlugManuallyEdited(true);
    setIsDirty(true);
  };

  // Check if slug is unique
  const isSlugUnique = !articles.some(
    (a) => a.slug === slug && a.id !== existingArticle?.id
  );

  // Word count and read time
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  // Warn before leaving if dirty
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Insert markdown at cursor
  const insertMarkdown = (before: string, after: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || defaultText;
    const replacement = before + selectedText + after;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);
    setIsDirty(true);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  // Handle local image upload
  const handleImageFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // If custom upload handler passed
    if (onUploadCover) {
      try {
        const uploadedUrl = await onUploadCover(file);
        if (uploadedUrl) {
          setCoverImageUrl(uploadedUrl);
          setIsDirty(true);
          return;
        }
      } catch (err) {
        console.error('Error in onUploadCover:', err);
      }
    }

    // Fallback to FileReader base64
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCoverImageUrl(reader.result);
        setIsDirty(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddTag = () => {
    const clean = tagInput.trim().replace(/^#/, '');
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
      setTagInput('');
      setIsDirty(true);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
    setIsDirty(true);
  };

  // Toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Validation
  const validate = (): string | null => {
    if (!title.trim()) return 'Please provide an article title.';
    if (!slug.trim()) return 'Please provide a valid URL slug.';
    if (!isSlugUnique) return 'This URL slug is already taken by another article. Please customize it.';
    if (!excerpt.trim()) return 'Please provide a brief excerpt summarizing the article.';
    if (!content.trim()) return 'Article content cannot be empty.';
    return null;
  };

  // Save handler
  const handleSave = (targetStatus: ArticleStatus, scheduledTimestamp?: string) => {
    const error = validate();
    if (error) {
      showToast(error);
      return;
    }

    setIsSaving(true);
    const now = new Date().toISOString();

    const articleToSave: Article = {
      id: existingArticle?.id || `art_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      slug: slug.trim(),
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      coverImage: coverImageUrl || PRESET_COVERS[0].url,
      coverImageUrl: coverImageUrl || PRESET_COVERS[0].url,
      aspectRatio,
      coverBanner: {
        url: coverImageUrl || PRESET_COVERS[0].url,
        aspectRatio
      },
      category,
      tags,
      authorName: authorName.trim() || currentUser.name,
      authorRole: authorRole.trim() || 'ACE Core Team',
      authorAvatar: authorAvatar || currentUser.avatarUrl,
      authorId: currentUser.id,
      status: targetStatus,
      publishedAt: targetStatus === 'PUBLISHED' ? (existingArticle?.publishedAt || now) : undefined,
      scheduledAt: targetStatus === 'SCHEDULED' ? scheduledTimestamp : undefined,
      createdAt: existingArticle?.createdAt || now,
      updatedAt: now,
      readTimeMinutes,
      views: existingArticle?.views || existingArticle?.viewsCount || 0,
      viewsCount: existingArticle?.viewsCount || existingArticle?.views || 0,
      isFeatured
    };

    try {
      onSaveArticle(articleToSave);
      setIsDirty(false);
      setIsScheduleModalOpen(false);

      if (targetStatus === 'PUBLISHED') {
        showToast('Article published successfully!');
        setTimeout(() => onNavigate('blog_detail', articleToSave.slug), 800);
      } else if (targetStatus === 'SCHEDULED') {
        showToast(`Article scheduled for ${new Date(scheduledTimestamp!).toLocaleString()}!`);
        setTimeout(() => onNavigate('admin'), 800);
      } else {
        showToast('Draft saved successfully!');
      }
    } catch (err) {
      console.error('Failed to save article:', err);
      showToast('Failed to save article. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Unauthorized view
  if (!isAuthorized) {
    return (
      <div style={{ maxWidth: '600px', margin: '6rem auto', textAlign: 'center', padding: '2rem' }}>
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '1rem',
            padding: '2.5rem 2rem'
          }}
        >
          <AlertCircle size={48} style={{ color: '#EF4444', margin: '0 auto 1.25rem' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#FFF', marginBottom: '0.75rem' }}>
            Access Restricted
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Only Administrators and ACE Core Team members are authorized to create or edit technical publications.
          </p>
          <button
            onClick={() => onNavigate('blogs')}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ArrowLeft size={16} /> Return to Articles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '1.5rem',
            right: '1.5rem',
            zIndex: 9999,
            background: '#1F2937',
            color: '#FFF',
            border: '1px solid #FA4616',
            borderRadius: '0.75rem',
            padding: '0.75rem 1.25rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontSize: '0.88rem',
            fontWeight: 500
          }}
        >
          <Sparkles size={16} style={{ color: '#FA4616' }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP BAR: Sticky Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(13, 14, 18, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '0.75rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}
      >
        {/* Left: Back & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            type="button"
            onClick={() => {
              if (isDirty && !window.confirm('You have unsaved changes. Are you sure you want to exit?')) {
                return;
              }
              onNavigate('admin');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              padding: '0.45rem 0.85rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.84rem',
              transition: 'all 0.15s ease'
            }}
          >
            <ArrowLeft size={15} />
            <span>Admin</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '0.2rem 0.6rem',
                borderRadius: '999px',
                background:
                  existingArticle?.status === 'PUBLISHED'
                    ? 'rgba(16, 185, 129, 0.15)'
                    : existingArticle?.status === 'SCHEDULED'
                    ? 'rgba(59, 130, 246, 0.15)'
                    : 'rgba(255, 255, 255, 0.08)',
                color:
                  existingArticle?.status === 'PUBLISHED'
                    ? '#34D399'
                    : existingArticle?.status === 'SCHEDULED'
                    ? '#60A5FA'
                    : 'var(--text-secondary)',
                border: '1px solid ' + (
                  existingArticle?.status === 'PUBLISHED'
                    ? 'rgba(52, 211, 153, 0.3)'
                    : existingArticle?.status === 'SCHEDULED'
                    ? 'rgba(96, 165, 250, 0.3)'
                    : 'rgba(255, 255, 255, 0.1)'
                )
              }}
            >
              {existingArticle?.status || 'NEW DRAFT'}
            </span>

            {isDirty && (
              <span style={{ fontSize: '0.75rem', color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F59E0B' }} />
                Unsaved changes
              </span>
            )}
          </div>
        </div>

        {/* Center: Word count & Read time */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}
          className="editor-stats-bar"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <FileText size={14} />
            <span>{wordCount} words</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Clock size={14} />
            <span>{readTimeMinutes} min read</span>
          </div>
        </div>

        {/* Right: View Mode & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* View Mode Toggle */}
          <div
            style={{
              display: 'flex',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '0.5rem',
              padding: '2px'
            }}
          >
            <button
              type="button"
              onClick={() => setViewMode('edit')}
              style={{
                background: viewMode === 'edit' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                color: viewMode === 'edit' ? '#FFF' : 'var(--text-secondary)',
                border: 'none',
                padding: '0.35rem 0.65rem',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
              title="Editor only"
            >
              <Edit3 size={13} />
              <span>Write</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('split')}
              style={{
                background: viewMode === 'split' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                color: viewMode === 'split' ? '#FFF' : 'var(--text-secondary)',
                border: 'none',
                padding: '0.35rem 0.65rem',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
              title="Split View"
            >
              <Columns size={13} />
              <span>Split</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              style={{
                background: viewMode === 'preview' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                color: viewMode === 'preview' ? '#FFF' : 'var(--text-secondary)',
                border: 'none',
                padding: '0.35rem 0.65rem',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
              title="Preview mode"
            >
              <Eye size={13} />
              <span>Preview</span>
            </button>
          </div>

          {/* Save Draft */}
          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSave('DRAFT')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              padding: '0.45rem 0.85rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.84rem',
              fontWeight: 500
            }}
          >
            <Save size={14} />
            <span>Save Draft</span>
          </button>

          {/* Schedule */}
          <button
            type="button"
            disabled={isSaving}
            onClick={() => setIsScheduleModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'var(--bg-secondary)',
              color: '#60A5FA',
              border: '1px solid rgba(96, 165, 250, 0.3)',
              padding: '0.45rem 0.85rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.84rem',
              fontWeight: 500
            }}
          >
            <Calendar size={14} />
            <span>Schedule...</span>
          </button>

          {/* Publish Now */}
          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSave('PUBLISHED')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: '#FA4616',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.45rem 1.15rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.84rem',
              fontWeight: 600,
              boxShadow: '0 4px 14px rgba(250, 70, 22, 0.35)'
            }}
          >
            <Send size={14} />
            <span>Publish Now</span>
          </button>
        </div>
      </header>

      {/* SCHEDULE MODAL */}
      {isScheduleModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
          onClick={() => setIsScheduleModalOpen(false)}
        >
          <div
            style={{
              background: '#16181D',
              border: '1px solid var(--border-subtle)',
              borderRadius: '1rem',
              width: '100%',
              maxWidth: '440px',
              padding: '1.75rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Calendar size={20} style={{ color: '#60A5FA' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFF', margin: 0 }}>Schedule Publication</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Specify the date and time when this article should automatically go live for all community members and public visitors.
            </p>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                Publication Date & Time
              </label>
              <input
                type="datetime-local"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '0.5rem',
                  color: '#FFF',
                  fontSize: '0.92rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="btn btn-secondary btn-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!scheduleDate}
                onClick={() => {
                  if (!scheduleDate) return;
                  const dateObj = new Date(scheduleDate);
                  if (isNaN(dateObj.getTime())) {
                    showToast('Please enter a valid date and time.');
                    return;
                  }
                  handleSave('SCHEDULED', dateObj.toISOString());
                }}
                className="btn btn-primary btn-sm"
                style={{ background: '#3B82F6', border: 'none' }}
              >
                Confirm Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          maxWidth: viewMode === 'split' ? '100%' : '1080px',
          width: '100%',
          margin: '0 auto',
          padding: '1.5rem'
        }}
      >
        {/* METADATA FORM PANEL */}
        <section
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}
        >
          {/* Cover Image Uploader & Preview */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Cover Banner
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowPresetPicker(!showPresetPicker)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Sparkles size={12} style={{ color: '#FA4616' }} />
                  <span>Choose Preset</span>
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageFileSelect}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Upload size={12} />
                  <span>Upload Image</span>
                </button>
              </div>
            </div>

            {/* Presets Grid Dropdown */}
            {showPresetPicker && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '0.75rem',
                  padding: '1rem',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '0.75rem',
                  marginBottom: '1rem'
                }}
              >
                {PRESET_COVERS.map((preset, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setCoverImageUrl(preset.url);
                      setShowPresetPicker(false);
                      setIsDirty(true);
                    }}
                    style={{
                      cursor: 'pointer',
                      borderRadius: '0.5rem',
                      overflow: 'hidden',
                      border: coverImageUrl === preset.url ? '2px solid #FA4616' : '1px solid var(--border-subtle)',
                      transition: 'transform 0.15s ease'
                    }}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      style={{ width: '100%', height: '80px', objectFit: 'cover' }}
                    />
                    <div style={{ padding: '0.4rem 0.6rem', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                      {preset.name}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Aspect Ratio Control */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.6rem',
                padding: '0.5rem 0.75rem',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '0.5rem',
                marginBottom: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Aspect Ratio:
                </span>
                <div style={{ display: 'inline-flex', background: 'rgba(0, 0, 0, 0.45)', borderRadius: '0.375rem', padding: '2px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  {BANNER_ASPECT_RATIO_OPTIONS.map((opt) => {
                    const isActive = aspectRatio === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setAspectRatio(opt.id);
                          setIsDirty(true);
                        }}
                        title={opt.description}
                        style={{
                          padding: '0.25rem 0.65rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.72rem',
                          fontWeight: isActive ? 700 : 500,
                          color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                          background: isActive ? '#FA4616' : 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          boxShadow: isActive ? '0 1px 4px rgba(250, 70, 22, 0.4)' : 'none'
                        }}
                      >
                        <span>{opt.label}</span>
                        <span style={{ opacity: isActive ? 0.9 : 0.6, fontSize: '0.65rem' }}>({opt.ratioBadge})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {aspectRatio !== 'default' && (
                <button
                  type="button"
                  onClick={() => {
                    setAspectRatio('default');
                    setIsDirty(true);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#FA4616',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: '0.2rem 0.4rem'
                  }}
                >
                  Reset to Default
                </button>
              )}
            </div>

            {/* Cover Banner Dynamic Preview */}
            <div
              className={`relative overflow-hidden rounded-xl border border-white/10 bg-[#0F1117] transition-all duration-300 ${
                aspectRatio === 'default'
                  ? 'aspect-[4/1] min-h-[140px]'
                  : aspectRatio === '21/9'
                  ? 'aspect-[21/9]'
                  : aspectRatio === '16/9'
                  ? 'aspect-video'
                  : 'h-auto max-h-[420px]'
              }`}
              style={{
                position: 'relative',
                borderRadius: '0.75rem',
                overflow: 'hidden',
                border: '1px solid var(--border-subtle)',
                background: '#0F1117',
                ...(aspectRatio === 'default'
                  ? { aspectRatio: '4 / 1', minHeight: '140px', width: '100%' }
                  : aspectRatio === '21/9'
                  ? { aspectRatio: '21 / 9', width: '100%' }
                  : aspectRatio === '16/9'
                  ? { aspectRatio: '16 / 9', width: '100%' }
                  : { height: 'auto', maxHeight: '420px', width: '100%' })
              }}
            >
              <img
                src={coverImageUrl}
                alt="Article Cover"
                className={aspectRatio === 'auto' ? 'w-full h-auto max-h-[420px] object-contain' : 'w-full h-full object-cover'}
                style={{
                  width: '100%',
                  height: aspectRatio === 'auto' ? 'auto' : '100%',
                  maxHeight: aspectRatio === 'auto' ? '420px' : undefined,
                  objectFit: aspectRatio === 'auto' ? 'contain' : 'cover',
                  display: 'block',
                  margin: aspectRatio === 'auto' ? '0 auto' : undefined
                }}
                onError={() => setCoverImageUrl(PRESET_COVERS[0].url)}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  pointerEvents: 'none'
                }}
              >
                <div style={{ display: 'flex', gap: '0.5rem', pointerEvents: 'auto' }}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      background: 'rgba(0,0,0,0.65)',
                      backdropFilter: 'blur(6px)',
                      color: '#FFF',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '0.375rem',
                      padding: '0.35rem 0.75rem',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    Replace Banner
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCoverImageUrl('');
                      setIsDirty(true);
                    }}
                    style={{
                      background: 'rgba(239, 68, 68, 0.2)',
                      backdropFilter: 'blur(6px)',
                      color: '#EF4444',
                      border: '1px solid rgba(239,68,68,0.3)',
                      borderRadius: '0.375rem',
                      padding: '0.35rem 0.75rem',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    Reset
                  </button>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.65)', fontWeight: 600, background: 'rgba(0,0,0,0.4)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                  Ratio: {aspectRatio}
                </div>
              </div>
            </div>
          </div>

          {/* Title Input */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
              Article Title
            </label>
            <input
              type="text"
              placeholder="e.g. Mastering UiPath REFramework: A Complete Architectural Guide..."
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                fontSize: '1.35rem',
                fontWeight: 700,
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '0.625rem',
                color: '#FFF',
                outline: 'none'
              }}
            />
          </div>

          {/* Slug & Category Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            {/* Slug */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Permalink Slug
                </label>
                <button
                  type="button"
                  onClick={() => setIsEditingSlug(!isEditingSlug)}
                  style={{ background: 'transparent', border: 'none', color: '#FA4616', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  {isEditingSlug ? 'Done' : 'Customize'}
                </button>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'var(--bg-primary)',
                  border: `1px solid ${!isSlugUnique ? '#EF4444' : 'var(--border-subtle)'}`,
                  borderRadius: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  gap: '0.35rem'
                }}
              >
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/blogs/</span>
                <input
                  type="text"
                  readOnly={!isEditingSlug}
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    color: isEditingSlug ? '#FFF' : 'var(--text-secondary)',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
                {slug && (
                  isSlugUnique ? (
                    <span title="Slug is available"><Check size={14} style={{ color: '#10B981' }} /></span>
                  ) : (
                    <span title="Slug is already used"><AlertCircle size={14} style={{ color: '#EF4444' }} /></span>
                  )
                )}
              </div>
              {!isSlugUnique && (
                <span style={{ fontSize: '0.72rem', color: '#EF4444', marginTop: '0.25rem', display: 'block' }}>
                  This slug is already in use. Please modify it to make it unique.
                </span>
              )}
            </div>

            {/* Category */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value as ArticleCategory);
                  setIsDirty(true);
                }}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '0.5rem',
                  color: '#FFF',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              >
                {ARTICLE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Author info & Homepage Feature toggle */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                Author Name
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => {
                  setAuthorName(e.target.value);
                  setIsDirty(true);
                }}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '0.5rem',
                  color: '#FFF',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                Author Role / Title
              </label>
              <input
                type="text"
                value={authorRole}
                onChange={(e) => {
                  setAuthorRole(e.target.value);
                  setIsDirty(true);
                }}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '0.5rem',
                  color: '#FFF',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                Homepage Feature
              </label>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  height: '38px',
                  cursor: 'pointer',
                  fontSize: '0.84rem',
                  color: isFeatured ? '#FA4616' : 'var(--text-secondary)'
                }}
              >
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => {
                    setIsFeatured(e.target.checked);
                    setIsDirty(true);
                  }}
                  style={{ accentColor: '#FA4616', width: '16px', height: '16px' }}
                />
                <span>Set as Homepage Featured</span>
              </label>
            </div>
          </div>

          {/* Excerpt */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Excerpt / Meta Summary
              </label>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {excerpt.length} characters (ideal: 120-200)
              </span>
            </div>
            <textarea
              rows={2}
              placeholder="A concise, high-impact 1-3 sentence summary of the architectural pattern, tutorial, or case study..."
              value={excerpt}
              onChange={(e) => {
                setExcerpt(e.target.value);
                setIsDirty(true);
              }}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '0.5rem',
                color: '#FFF',
                fontSize: '0.88rem',
                lineHeight: 1.5,
                outline: 'none'
              }}
            />
          </div>

          {/* Tags */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
              Topics & Tags
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
              {tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: 'rgba(250, 70, 22, 0.12)',
                    color: '#FA4616',
                    border: '1px solid rgba(250, 70, 22, 0.25)',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 500
                  }}
                >
                  <span>#{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}

              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <input
                  type="text"
                  placeholder="Add tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '999px',
                    padding: '0.2rem 0.65rem',
                    color: '#FFF',
                    fontSize: '0.75rem',
                    width: '110px',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '999px',
                    fontSize: '0.72rem',
                    cursor: 'pointer'
                  }}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* TECHNICAL MARKDOWN EDITOR & PREVIEW SECTION */}
        <section
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid var(--border-subtle)',
            borderRadius: '1rem',
            overflow: 'hidden',
            background: '#0D0E12'
          }}
        >
          {/* FORMATTING TOOLBAR */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.55rem 1rem',
              background: 'rgba(255, 255, 255, 0.03)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <button
              type="button"
              onClick={() => insertMarkdown('## ', '', 'Heading 2')}
              style={toolbarBtnStyle}
              title="Heading 2"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('### ', '', 'Heading 3')}
              style={toolbarBtnStyle}
              title="Heading 3"
            >
              H3
            </button>
            <div style={toolbarDividerStyle} />

            <button
              type="button"
              onClick={() => insertMarkdown('**', '**', 'bold text')}
              style={toolbarBtnStyle}
              title="Bold"
            >
              <Bold size={14} />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('*', '*', 'italic text')}
              style={toolbarBtnStyle}
              title="Italic"
            >
              <Italic size={14} />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('`', '`', 'inlineCode')}
              style={toolbarBtnStyle}
              title="Inline Code"
            >
              <Code size={14} />
            </button>
            <div style={toolbarDividerStyle} />

            <button
              type="button"
              onClick={() => insertMarkdown('```csharp\n// Code block\n', '\n```\n', 'Console.WriteLine("UiPath");')}
              style={{ ...toolbarBtnStyle, color: '#FA4616' }}
              title="C# Code Block"
            >
              <Code size={14} /> C#
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('```xml\n<!-- XAML Workflow -->\n', '\n```\n', '<Activity mc:Ignorable="sap sap2010" />')}
              style={{ ...toolbarBtnStyle, color: '#F59E0B' }}
              title="XAML / XML Block"
            >
              <Code size={14} /> XAML
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('```json\n', '\n```\n', '{\n  "status": "Success"\n}')}
              style={{ ...toolbarBtnStyle, color: '#34D399' }}
              title="JSON Block"
            >
              <Code size={14} /> JSON
            </button>
            <div style={toolbarDividerStyle} />

            <button
              type="button"
              onClick={() => insertMarkdown('> [!NOTE]\n> ', '\n', 'Important architectural note for developers.')}
              style={toolbarBtnStyle}
              title="Callout Note"
            >
              <Info size={14} /> Note
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('- ', '', 'List item')}
              style={toolbarBtnStyle}
              title="Bullet List"
            >
              <List size={14} />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('1. ', '', 'Step item')}
              style={toolbarBtnStyle}
              title="Numbered List"
            >
              <ListOrdered size={14} />
            </button>
            <button
              type="button"
              onClick={() =>
                insertMarkdown(
                  '\n| Component | Responsibility | Tech |\n|---|---|---|\n| Dispatcher | Queue Population | UiPath Studio |\n| Performer | Process Automation | UiPath Robot |\n\n'
                )
              }
              style={toolbarBtnStyle}
              title="Table"
            >
              <Table size={14} />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('[', '](https://docs.uipath.com)', 'Documentation Link')}
              style={toolbarBtnStyle}
              title="Link"
            >
              <Link2 size={14} />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('\n---\n\n')}
              style={toolbarBtnStyle}
              title="Horizontal Divider"
            >
              ―
            </button>
          </div>

          {/* EDIT & PREVIEW PANES */}
          <div
            style={{
              flex: 1,
              display: 'grid',
              gridTemplateColumns: viewMode === 'split' ? '1fr 1fr' : '1fr',
              minHeight: '520px'
            }}
          >
            {/* WRITE PANE */}
            {(viewMode === 'edit' || viewMode === 'split') && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderRight: viewMode === 'split' ? '1px solid rgba(255, 255, 255, 0.08)' : 'none'
                }}
              >
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="Write in Markdown... Use # for headings, ``` for syntax-highlighted code blocks, and > [!NOTE] for callout boxes."
                  style={{
                    flex: 1,
                    width: '100%',
                    height: '100%',
                    padding: '1.25rem',
                    background: 'transparent',
                    border: 'none',
                    color: '#E5E7EB',
                    fontFamily: 'var(--font-mono, "JetBrains Mono", Consolas, Menlo, monospace)',
                    fontSize: '0.92rem',
                    lineHeight: 1.7,
                    resize: 'none',
                    outline: 'none'
                  }}
                />
              </div>
            )}

            {/* PREVIEW PANE */}
            {(viewMode === 'preview' || viewMode === 'split') && (
              <div
                style={{
                  padding: '1.5rem',
                  overflowY: 'auto',
                  background: 'rgba(255, 255, 255, 0.015)'
                }}
              >
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                  {coverImageUrl && (
                    <div
                      className={`relative overflow-hidden rounded-xl border border-white/10 bg-[#0F1117] transition-all duration-300 ${
                        aspectRatio === 'default'
                          ? 'aspect-[4/1] min-h-[140px]'
                          : aspectRatio === '21/9'
                          ? 'aspect-[21/9]'
                          : aspectRatio === '16/9'
                          ? 'aspect-video'
                          : 'h-auto max-h-[420px]'
                      }`}
                      style={{
                        position: 'relative',
                        borderRadius: '0.75rem',
                        overflow: 'hidden',
                        border: '1px solid var(--border-subtle)',
                        background: '#0F1117',
                        marginBottom: '1.5rem',
                        ...(aspectRatio === 'default'
                          ? { aspectRatio: '4 / 1', minHeight: '140px', width: '100%' }
                          : aspectRatio === '21/9'
                          ? { aspectRatio: '21 / 9', width: '100%' }
                          : aspectRatio === '16/9'
                          ? { aspectRatio: '16 / 9', width: '100%' }
                          : { height: 'auto', maxHeight: '420px', width: '100%' })
                      }}
                    >
                      <img
                        src={coverImageUrl}
                        alt={title || 'Article Cover'}
                        className={aspectRatio === 'auto' ? 'w-full h-auto max-h-[420px] object-contain' : 'w-full h-full object-cover'}
                        style={{
                          width: '100%',
                          height: aspectRatio === 'auto' ? 'auto' : '100%',
                          maxHeight: aspectRatio === 'auto' ? '420px' : undefined,
                          objectFit: aspectRatio === 'auto' ? 'contain' : 'cover',
                          display: 'block',
                          margin: aspectRatio === 'auto' ? '0 auto' : undefined
                        }}
                      />
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
                    <span className="badge badge-orange" style={{ fontSize: '0.72rem' }}>
                      {category}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {readTimeMinutes} min read • By {authorName}
                    </span>
                  </div>

                  <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFF', marginBottom: '1.25rem', lineHeight: 1.25 }}>
                    {title || 'Article Title Preview'}
                  </h1>

                  {excerpt && (
                    <p
                      style={{
                        fontSize: '1.05rem',
                        color: 'var(--text-secondary)',
                        fontStyle: 'italic',
                        marginBottom: '2rem',
                        lineHeight: 1.6,
                        borderLeft: '2px solid rgba(255, 255, 255, 0.2)',
                        paddingLeft: '1rem'
                      }}
                    >
                      {excerpt}
                    </p>
                  )}

                  <TechnicalMarkdownRenderer content={content} />
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

const toolbarBtnStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: 'var(--text-secondary)',
  padding: '0.3rem 0.5rem',
  borderRadius: '0.375rem',
  cursor: 'pointer',
  fontSize: '0.78rem',
  fontWeight: 600,
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem',
  transition: 'background 0.15s ease'
};

const toolbarDividerStyle: React.CSSProperties = {
  width: '1px',
  height: '16px',
  background: 'rgba(255, 255, 255, 0.1)',
  margin: '0 0.25rem'
};
