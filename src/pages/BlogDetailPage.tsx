import React, { useEffect, useState, useMemo } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Share2,
  Check,
  Tag,
  Sparkles,
  ArrowRight,
  Edit3,
  Bookmark,
  ShieldCheck,
  Newspaper
} from 'lucide-react';
import { Article, User } from '../types';
import { TechnicalMarkdownRenderer } from '../components/TechnicalMarkdownRenderer';

interface Props {
  slugOrId: string;
  articles: Article[];
  currentUser?: User | null;
  onNavigate: (view: string, detailId?: string) => void;
  onIncrementViews?: (articleId: string) => void;
}

export const BlogDetailPage: React.FC<Props> = ({
  slugOrId,
  articles,
  currentUser,
  onNavigate,
  onIncrementViews
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  // Find article by slug or id
  const article = useMemo(() => {
    return articles.find((a) => a.slug === slugOrId || a.id === slugOrId) || null;
  }, [articles, slugOrId]);

  const isPrivileged = Boolean(currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'CORE_TEAM'));

  // Public eligibility: PUBLISHED or SCHEDULED whose time has passed
  const isPubliclyAvailable = useMemo(() => {
    if (!article) return false;
    if (article.status === 'PUBLISHED' || !article.status) return true;
    if (article.status === 'SCHEDULED' && article.scheduledAt) {
      return new Date(article.scheduledAt).getTime() <= Date.now();
    }
    return false;
  }, [article]);

  const canViewArticle = Boolean(article && (isPubliclyAvailable || isPrivileged));

  // View count increment with sessionStorage de-duplication (only for publicly available articles)
  useEffect(() => {
    if (!article || !onIncrementViews || !isPubliclyAvailable) return;

    const storageKey = `ace_article_viewed_${article.id}`;
    if (!sessionStorage.getItem(storageKey)) {
      sessionStorage.setItem(storageKey, 'true');
      onIncrementViews(article.id);
    }
  }, [article?.id, isPubliclyAvailable, onIncrementViews]);

  // Scroll to top on mount / article change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slugOrId]);

  // Share / Copy Link handler
  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Find related articles (only publicly visible articles, excluding current)
  const relatedArticles = useMemo(() => {
    if (!article) return [];
    return articles
      .filter((a) => a.id !== article.id && (
        a.status === 'PUBLISHED' || 
        (a.status === 'SCHEDULED' && a.scheduledAt && new Date(a.scheduledAt).getTime() <= Date.now())
      ))
      .sort((a, b) => {
        if (a.category === article.category && b.category !== article.category) return -1;
        if (b.category === article.category && a.category !== article.category) return 1;
        return (b.views || b.viewsCount || 0) - (a.views || a.viewsCount || 0);
      })
      .slice(0, 3);
  }, [articles, article]);

  // If article not found or unauthorized draft
  if (!article || !canViewArticle) {
    return (
      <div className="page-container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <Newspaper size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1.25rem', opacity: 0.5 }} />
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFF', marginBottom: '0.5rem' }}>
          Article Not Available
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '460px', margin: '0 auto 1.5rem' }}>
          This article is currently unpublished, scheduled for future release, or has been archived.
        </p>
        <button
          onClick={() => onNavigate('blogs')}
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <ArrowLeft size={16} /> Return to All Articles
        </button>
      </div>
    );
  }

  const canEdit = isPrivileged;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '6rem' }}>
      {/* READING HEADER & BREADCRUMB */}
      <div
        style={{
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(255, 255, 255, 0.015)',
          padding: '1.25rem 0'
        }}
      >
        <div
          style={{
            maxWidth: '860px',
            margin: '0 auto',
            padding: '0 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <button
            onClick={() => onNavigate('blogs')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '0.88rem',
              fontWeight: 500,
              cursor: 'pointer',
              padding: 0
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to All Articles</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {canEdit && (
              <button
                onClick={() => onNavigate('article_editor', article.slug || article.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                <Edit3 size={14} />
                <span>Edit Article</span>
              </button>
            )}

            <button
              onClick={handleCopyLink}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: copiedLink ? '#10B981' : 'var(--text-secondary)',
                padding: '0.4rem 0.8rem',
                borderRadius: '0.375rem',
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              {copiedLink ? <Check size={14} /> : <Share2 size={14} />}
              <span>{copiedLink ? 'Copied Link' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* PRIVILEGED PREVIEW BANNER */}
      {isPrivileged && !isPubliclyAvailable && (
        <div style={{ maxWidth: '860px', margin: '1.25rem auto 0', padding: '0 1.5rem' }}>
          <div
            style={{
              padding: '0.85rem 1.25rem',
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: '0.625rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <ShieldCheck size={18} style={{ color: '#F59E0B', flexShrink: 0 }} />
              <span style={{ fontSize: '0.84rem', color: '#FCD34D', fontWeight: 600 }}>
                Privileged Preview: This article is currently {article.status}. It is hidden from public and student visitors.
              </span>
            </div>
            <button
              onClick={() => onNavigate('article_editor', article.slug || article.id)}
              style={{
                fontSize: '0.78rem',
                padding: '0.35rem 0.75rem',
                flexShrink: 0,
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#FCD34D',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '0.375rem',
                cursor: 'pointer'
              }}
            >
              Edit Article
            </button>
          </div>
        </div>
      )}

      {/* ARTICLE HERO & METADATA */}
      <header
        style={{
          maxWidth: '860px',
          margin: '0 auto',
          padding: '2.5rem 1.5rem 1.5rem 1.5rem'
        }}
      >
        {/* Category Badge & Meta tags */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          <span className="badge badge-orange" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
            {article.category}
          </span>

          {article.isFeatured && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                background: 'rgba(250, 70, 22, 0.15)',
                color: '#FA4616',
                border: '1px solid rgba(250, 70, 22, 0.3)',
                padding: '0.2rem 0.6rem',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: 700
              }}
            >
              <Sparkles size={11} /> FEATURED
            </span>
          )}

          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Published {new Date(article.publishedAt || article.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: 'clamp(2.1rem, 4.5vw, 3rem)',
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: '-0.025em',
            color: '#FFFFFF',
            marginBottom: '1.5rem'
          }}
        >
          {article.title}
        </h1>

        {/* Excerpt */}
        {article.excerpt && (
          <p
            style={{
              fontSize: '1.18rem',
              lineHeight: 1.65,
              color: 'var(--text-secondary)',
              borderLeft: '3px solid #FA4616',
              paddingLeft: '1.25rem',
              margin: '0 0 2rem 0',
              fontStyle: 'normal'
            }}
          >
            {article.excerpt}
          </p>
        )}

        {/* Author Card & Reading Metrics */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '1.15rem 0',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          {/* Author */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {article.authorAvatar ? (
              <img
                src={article.authorAvatar}
                alt={article.authorName}
                style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'rgba(250, 70, 22, 0.15)',
                  color: '#FA4616',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '1.1rem'
                }}
              >
                {article.authorName.charAt(0)}
              </div>
            )}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span style={{ fontSize: '0.98rem', fontWeight: 600, color: '#FFF' }}>
                  {article.authorName}
                </span>
                <span title="Verified ACE Author"><ShieldCheck size={14} style={{ color: '#FA4616' }} /></span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {article.authorRole}
              </div>
            </div>
          </div>

          {/* Reading metrics */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={14} />
              <span>{article.readTimeMinutes || 5} min read</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Eye size={14} />
              <span>{article.views || article.viewsCount || 0} views</span>
            </div>
          </div>
        </div>
      </header>

      {/* COVER BANNER */}
      {(article.coverImageUrl || article.coverImage) && (
        <div style={{ maxWidth: '860px', margin: '0 auto 2.5rem auto', padding: '0 1.5rem' }}>
          <div
            style={{
              position: 'relative',
              borderRadius: '1rem',
              overflow: 'hidden',
              boxShadow: '0 16px 36px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <img
              src={article.coverImageUrl || article.coverImage}
              alt={article.title}
              style={{ width: '100%', maxHeight: '420px', objectFit: 'cover', display: 'block' }}
            />
          </div>
        </div>
      )}

      {/* ARTICLE MAIN CONTENT */}
      <main
        style={{
          maxWidth: '860px',
          margin: '0 auto',
          padding: '0 1.5rem'
        }}
      >
        <TechnicalMarkdownRenderer content={article.content} />

        {/* TAGS ROW */}
        {article.tags && article.tags.length > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap',
              marginTop: '3.5rem',
              paddingTop: '1.75rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <Tag size={15} style={{ color: 'var(--text-muted)' }} />
            {article.tags.map((tag: string) => (
              <span
                key={tag}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: 'var(--text-secondary)',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: 500
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* AUTHOR BIO CARD */}
        <section
          style={{
            marginTop: '3rem',
            background: 'rgba(23, 23, 23, 0.6)',
            border: '1px solid #262626',
            borderRadius: '1.25rem',
            padding: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            flexWrap: 'wrap'
          }}
        >
          {article.authorAvatar ? (
            <img
              src={article.authorAvatar}
              alt={article.authorName}
              style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(250, 70, 22, 0.15)',
                color: '#FA4616',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1.4rem'
              }}
            >
              {article.authorName.charAt(0)}
            </div>
          )}

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF' }}>
                Written by {article.authorName}
              </span>
              <span className="badge badge-orange" style={{ fontSize: '0.65rem' }}>
                ACE Author
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              {article.authorRole} at ACE UiPath Community. Dedicated to mentoring engineering students in robotic process automation, intelligent agents, and enterprise software architecture.
            </p>
          </div>
        </section>

        {/* RELATED ARTICLES SECTION */}
        {relatedArticles.length > 0 && (
          <section style={{ marginTop: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#FFF', margin: 0 }}>
                  Recommended Articles
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
                  Continue exploring technical write-ups and automation tutorials.
                </p>
              </div>

              <button
                onClick={() => onNavigate('blogs')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#FA4616',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <span>View All</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.25rem'
              }}
            >
              {relatedArticles.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onNavigate('blog_detail', rel.slug || rel.id)}
                  style={{
                    background: 'rgba(23, 23, 23, 0.5)',
                    border: '1px solid #262626',
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  className="card-hover-border"
                >
                  <div style={{ height: '120px', overflow: 'hidden' }}>
                    <img
                      src={rel.coverImageUrl || rel.coverImage}
                      alt={rel.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                        <span className="badge badge-orange" style={{ fontSize: '0.65rem' }}>
                          {rel.category}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {rel.readTimeMinutes || 5} min
                        </span>
                      </div>
                      <h4
                        style={{
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          color: '#FFF',
                          lineHeight: 1.35,
                          margin: 0,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {rel.title}
                      </h4>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
                      By {rel.authorName}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
