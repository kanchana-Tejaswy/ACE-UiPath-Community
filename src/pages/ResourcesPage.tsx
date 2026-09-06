import React, { useState, useEffect } from 'react';
import { 
  FolderDown, 
  Search, 
  Download, 
  FileCode, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink,
  BookOpen,
  AlertCircle
} from 'lucide-react';
import { CommunityResource, User } from '../types';

interface Props {
  resources: CommunityResource[];
  selectedCategorySlug?: string;
  currentUser: User;
  onSaveResource: (resource: CommunityResource) => void;
  onIncrementDownloads?: (id: string) => void;
  onNavigate?: (view: string, detailId?: string) => void;
}

const getSlugForCategory = (cat: string) => {
  switch (cat) {
    case 'Cheat Sheet': return 'cheatsheets';
    case 'Workflow Template': return 'templates';
    case 'Guide': return 'guides';
    case 'Official Certification': return 'certification';
    default: return undefined;
  }
};

const getCategoryFromSlug = (slug: string) => {
  const clean = slug.toLowerCase().trim();
  if (['cheatsheet', 'cheatsheets'].includes(clean)) return 'Cheat Sheet';
  if (['template', 'templates', 'workflow-template'].includes(clean)) return 'Workflow Template';
  if (['guide', 'guides'].includes(clean)) return 'Guide';
  if (['certification', 'exam', 'exam-questions'].includes(clean)) return 'Official Certification';
  return null;
};

export const ResourcesPage: React.FC<Props> = ({
  resources,
  selectedCategorySlug,
  currentUser,
  onSaveResource,
  onIncrementDownloads,
  onNavigate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [downloadToastId, setDownloadToastId] = useState<string | null>(null);
  const [isInvalidCategory, setIsInvalidCategory] = useState<boolean>(false);

  const categories = ['ALL', 'Cheat Sheet', 'Workflow Template', 'Guide', 'Official Certification'];

  // Sync category state from URL slug
  useEffect(() => {
    if (selectedCategorySlug) {
      const catMatch = getCategoryFromSlug(selectedCategorySlug);
      if (catMatch) {
        setSelectedCategory(catMatch);
        setIsInvalidCategory(false);
      } else {
        setSelectedCategory('ALL');
        setIsInvalidCategory(true);
      }
    } else {
      setSelectedCategory('ALL');
      setIsInvalidCategory(false);
    }
  }, [selectedCategorySlug]);

  const filteredResources = resources.filter((res) => {
    if (selectedCategory !== 'ALL' && res.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = res.title.toLowerCase().includes(q);
      const matchDesc = res.description.toLowerCase().includes(q);
      const matchTag = res.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTag) return false;
    }
    return true;
  });

  const handleDownload = (res: CommunityResource) => {
    if (onIncrementDownloads) {
      onIncrementDownloads(res.id);
    } else {
      const updated = { ...res, downloadCount: res.downloadCount + 1 };
      onSaveResource(updated);
    }

    setDownloadToastId(res.id);
    setTimeout(() => setDownloadToastId(null), 3000);

    if (res.downloadUrl && res.downloadUrl !== '#') {
      window.open(res.downloadUrl, '_blank');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '3rem' }}>
        <span className="badge badge-orange" style={{ marginBottom: '0.5rem' }}>
          Technical Vault
        </span>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800 }}>
          UiPath Resources, Templates & Cheat Sheets
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '780px', marginTop: '0.5rem' }}>
          Curated collection of production REFramework templates, modern selector cheat sheets, LINQ expressions, and official certification preparation question banks.
        </p>
      </div>

      {/* Invalid Category Fallback Banner */}
      {isInvalidCategory && selectedCategorySlug && (
        <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', marginBottom: '2.5rem', border: '1px solid var(--border-glow)' }}>
          <FolderDown size={40} style={{ color: 'var(--uipath-orange)', margin: '0 auto 0.75rem auto' }} />
          <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>Resource Category Not Found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.25rem', maxWidth: '540px', margin: '0 auto 1.25rem auto' }}>
            No resource category matches the link "<code style={{ color: '#FED7AA' }}>{selectedCategorySlug}</code>". Please explore all technical vault assets below.
          </p>
          <button onClick={() => onNavigate && onNavigate('resources')} className="btn btn-primary btn-sm">
            View All Resources
          </button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '2.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: '0.25rem' }}>
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                const targetSlug = getSlugForCategory(cat);
                if (onNavigate) onNavigate('resources', targetSlug);
              }}
              style={{
                background: selectedCategory === cat ? 'var(--uipath-orange)' : 'var(--bg-tertiary)',
                color: selectedCategory === cat ? '#FFF' : 'var(--text-secondary)',
                border: selectedCategory === cat ? '1px solid var(--uipath-orange)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                padding: '0.25rem 0.75rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search templates, LINQ, selectors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.85rem 0.5rem 2.25rem',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Resources Grid */}
      {filteredResources.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <FileCode size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Community Resources Matched Your Query</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Try resetting the category filter or searching for keywords like "LINQ", "REFramework", or "PDF".
          </p>
          <button
            onClick={() => {
              setSelectedCategory('ALL');
              setSearchQuery('');
              if (onNavigate) onNavigate('resources');
            }}
            className="btn btn-secondary btn-sm"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid-responsive-2">
        {filteredResources.map((res) => (
          <div
            key={res.id}
            className="glass-card"
            style={{
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span className="badge badge-orange" style={{ fontSize: '0.7rem' }}>
                  {res.category}
                </span>
                <span className="badge badge-slate" style={{ fontSize: '0.7rem' }}>
                  {res.fileType} • {res.uipathVersion}
                </span>
              </div>

              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', lineHeight: 1.35 }}>
                {res.title}
              </h3>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                {res.description}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                {res.tags.map((tag, idx) => (
                  <span key={idx} className="badge badge-slate" style={{ fontSize: '0.65rem' }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div style={{
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem'
            }}>
              <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                {res.downloadCount} Community Downloads
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {downloadToastId === res.id && (
                  <span className="badge badge-green" style={{ fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <CheckCircle2 size={12} /> Count Saved!
                  </span>
                )}
                <button
                  onClick={() => handleDownload(res)}
                  className="btn btn-primary btn-sm"
                >
                  <Download size={14} /> Download {res.fileType}
                </button>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
};
