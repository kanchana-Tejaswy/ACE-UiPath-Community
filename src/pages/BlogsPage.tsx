import React, { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  Calendar,
  Clock,
  Eye,
  ArrowRight,
  Filter,
  Sparkles,
  Newspaper,
  User as UserIcon,
  Tag,
  Star,
  Edit3
} from 'lucide-react';
import { Article, ArticleCategory, User, ARTICLE_CATEGORIES } from '../types';

interface Props {
  articles: Article[];
  currentUser?: User | null;
  onNavigate: (view: string, detailId?: string) => void;
}

const CATEGORIES = ARTICLE_CATEGORIES;

type SortOption = 'latest' | 'oldest' | 'popular';

export const BlogsPage: React.FC<Props> = ({ articles, currentUser, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('latest');

  // Filter only published or past-scheduled articles
  const now = new Date();
  const visibleArticles = useMemo(() => {
    return articles.filter((a) => {
      if (a.status === 'PUBLISHED') return true;
      if (a.status === 'SCHEDULED' && a.scheduledAt && new Date(a.scheduledAt) <= now) return true;
      // If user is ADMIN or CORE_TEAM, also let them view draft/scheduled preview if needed
      return false;
    });
  }, [articles, now]);

  // Determine the featured hero article
  const featuredArticle = useMemo(() => {
    const explicitlyFeatured = visibleArticles.find((a) => a.isFeatured);
    if (explicitlyFeatured) return explicitlyFeatured;
    return visibleArticles[0] || null;
  }, [visibleArticles]);

  // Filter and sort remaining articles
  const filteredArticles = useMemo(() => {
    let result = visibleArticles;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.authorName.toLowerCase().includes(q) ||
          (a.tags || []).some((t: string) => t.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter((a) => a.category === selectedCategory);
    }

    // Sorting
    return [...result].sort((a, b) => {
      if (sortBy === 'popular') {
        return (b.views || b.viewsCount || 0) - (a.views || a.viewsCount || 0);
      }
      const dateA = new Date(a.publishedAt || a.createdAt).getTime();
      const dateB = new Date(b.publishedAt || b.createdAt).getTime();
      if (sortBy === 'oldest') {
        return dateA - dateB;
      }
      return dateB - dateA;
    });
  }, [visibleArticles, searchQuery, selectedCategory, sortBy]);

  const canCreate = currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'CORE_TEAM');

  return (
    <div className="page-container" style={{ paddingBottom: '6rem' }}>
      {/* HEADER SECTION */}
      <section style={{ marginBottom: '3rem', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.35rem 0.85rem',
                borderRadius: '999px',
                background: 'rgba(250, 70, 22, 0.1)',
                border: '1px solid rgba(250, 70, 22, 0.25)',
                color: '#FA4616',
                fontSize: '0.8rem',
                fontWeight: 600,
                marginBottom: '1rem'
              }}
            >
              <Newspaper size={14} />
              <span>TECHNICAL PUBLICATIONS & ENGINEERING BLOG</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                fontWeight: 800,
                letterSpacing: '-0.025em',
                lineHeight: 1.15,
                color: '#FFFFFF',
                marginBottom: '0.75rem'
              }}
            >
              Blogs & Technical Articles
            </h1>

            <p
              style={{
                fontSize: '1.05rem',
                color: 'var(--text-secondary)',
                maxWidth: '680px',
                lineHeight: 1.6,
                margin: 0
              }}
            >
              Architectural blueprints, practical implementation tutorials, and enterprise automation deep dives authored by ACE UiPath Community leaders and students.
            </p>
          </div>

          {canCreate && (
            <button
              onClick={() => onNavigate('article_editor', 'new')}
              className="btn btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#FA4616',
                boxShadow: '0 4px 14px rgba(250, 70, 22, 0.3)'
              }}
            >
              <span>+ Write Article</span>
            </button>
          )}
        </div>
      </section>

      {/* FEATURED SPOTLIGHT HERO (if articles exist) */}
      {featuredArticle && !searchQuery && selectedCategory === 'All' && (
        <section style={{ marginBottom: '3.5rem' }}>
          <div
            onClick={() => onNavigate('blog_detail', featuredArticle.slug || featuredArticle.id)}
            style={{
              background: 'linear-gradient(180deg, rgba(23, 23, 23, 0.7) 0%, rgba(15, 15, 15, 0.9) 100%)',
              border: '1px solid #262626',
              borderRadius: '1.25rem',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)'
            }}
            className="card-hover-border"
          >
            {/* Left/Top: Cover Image */}
            <div style={{ position: 'relative', minHeight: '280px', overflow: 'hidden' }}>
              <img
                src={featuredArticle.coverImageUrl || featuredArticle.coverImage}
                alt={featuredArticle.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  background: '#0D0F14',
                  transition: 'transform 0.4s ease'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to right, rgba(0,0,0,0.4) 0%, transparent 60%)'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  display: 'flex',
                  gap: '0.5rem'
                }}
              >
                <span
                  style={{
                    background: '#FA4616',
                    color: '#FFF',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.25rem 0.65rem',
                    borderRadius: '999px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
                  }}
                >
                  <Star size={11} style={{ fill: '#FFF' }} /> FEATURED PUBLICATION
                </span>
                <span className="badge badge-neutral" style={{ fontSize: '0.72rem', backdropFilter: 'blur(6px)' }}>
                  {featuredArticle.category}
                </span>
              </div>
            </div>

            {/* Right/Bottom: Content */}
            <div
              style={{
                padding: '2.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    marginBottom: '0.75rem'
                  }}
                >
                  <span>{new Date(featuredArticle.publishedAt || featuredArticle.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span>•</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={13} /> {featuredArticle.readTimeMinutes || 5} min read
                  </span>
                  <span>•</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Eye size={13} /> {featuredArticle.views || featuredArticle.viewsCount || 0} views
                  </span>
                </div>

                <h2
                  style={{
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    lineHeight: 1.3,
                    marginBottom: '1rem',
                    letterSpacing: '-0.015em'
                  }}
                >
                  {featuredArticle.title}
                </h2>

                <p
                  style={{
                    fontSize: '0.95rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.65,
                    marginBottom: '1.5rem'
                  }}
                >
                  {featuredArticle.excerpt}
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingTop: '1.25rem',
                  marginTop: '1rem',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {featuredArticle.authorAvatar ? (
                    <img
                      src={featuredArticle.authorAvatar}
                      alt={featuredArticle.authorName}
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'rgba(250, 70, 22, 0.15)',
                        color: '#FA4616',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.85rem'
                      }}
                    >
                      {featuredArticle.authorName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#FFF' }}>
                      {featuredArticle.authorName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {featuredArticle.authorRole}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  {canCreate && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('article_editor', featuredArticle.slug || featuredArticle.id);
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#FFFFFF',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '0.375rem',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      title="Edit this article"
                    >
                      <Edit3 size={13} />
                      <span>Edit Article</span>
                    </button>
                  )}

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      color: '#FA4616',
                      fontSize: '0.88rem',
                      fontWeight: 600
                    }}
                  >
                    <span>Read Article</span>
                    <ArrowRight size={15} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FILTER CONTROLS & SEARCH */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '1.25rem'
          }}
        >
          {/* Category Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedCategory('All')}
              style={{
                padding: '0.45rem 0.95rem',
                borderRadius: '999px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: selectedCategory === 'All' ? '#FA4616' : 'var(--bg-secondary)',
                color: selectedCategory === 'All' ? '#FFFFFF' : 'var(--text-secondary)',
                border: selectedCategory === 'All' ? 'none' : '1px solid var(--border-subtle)',
                transition: 'all 0.15s ease'
              }}
            >
              All Topics ({visibleArticles.length})
            </button>

            {CATEGORIES.map((cat) => {
              const count = visibleArticles.filter((a) => a.category === cat).length;
              if (count === 0 && selectedCategory !== cat) return null;
              const isSelected = selectedCategory === cat;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '0.45rem 0.95rem',
                    borderRadius: '999px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: isSelected ? '#FA4616' : 'var(--bg-secondary)',
                    color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                    border: isSelected ? 'none' : '1px solid var(--border-subtle)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Search & Sort Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', width: '240px' }}>
              <Search
                size={14}
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }}
              />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem 0.5rem 2.2rem',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '0.5rem',
                  color: '#FFF',
                  fontSize: '0.82rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              style={{
                padding: '0.5rem 0.85rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '0.5rem',
                color: 'var(--text-secondary)',
                fontSize: '0.82rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="latest">Latest First</option>
              <option value="popular">Most Popular</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </section>

      {/* ARTICLE GRID */}
      <section>
        {filteredArticles.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.75rem'
            }}
          >
            {filteredArticles.map((art) => (
              <article
                key={art.id}
                onClick={() => onNavigate('blog_detail', art.slug || art.id)}
                style={{
                  background: 'rgba(23, 23, 23, 0.5)',
                  border: '1px solid #262626',
                  borderRadius: '1.25rem',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease'
                }}
                className="card-hover-border"
              >
                {/* Cover Banner */}
                <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                  <img
                    src={art.coverImageUrl || art.coverImage}
                    alt={art.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      background: '#0D0F14'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '0.75rem',
                      left: '0.75rem'
                    }}
                  >
                    <span className="badge badge-orange" style={{ fontSize: '0.7rem' }}>
                      {art.category}
                    </span>
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '0.75rem',
                      right: '0.75rem',
                      background: 'rgba(0, 0, 0, 0.7)',
                      backdropFilter: 'blur(4px)',
                      color: '#E5E7EB',
                      fontSize: '0.72rem',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '0.375rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <Clock size={11} />
                    <span>{art.readTimeMinutes || 5} min</span>
                  </div>
                </div>

                {/* Body */}
                <div
                  style={{
                    padding: '1.25rem',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: '1.15rem',
                        fontWeight: 700,
                        color: '#FFFFFF',
                        lineHeight: 1.4,
                        marginBottom: '0.5rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {art.title}
                    </h3>

                    <p
                      style={{
                        fontSize: '0.86rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.55,
                        marginBottom: '1rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {art.excerpt}
                    </p>
                  </div>

                  {/* Footer metadata */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                      paddingTop: '0.85rem',
                      fontSize: '0.78rem',
                      color: 'var(--text-muted)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {art.authorAvatar ? (
                        <img
                          src={art.authorAvatar}
                          alt={art.authorName}
                          style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: 'rgba(250, 70, 22, 0.15)',
                            color: '#FA4616',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.72rem'
                          }}
                        >
                          {art.authorName.charAt(0)}
                        </div>
                      )}
                      <span style={{ color: '#E5E7EB', fontWeight: 500 }}>{art.authorName}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      {canCreate && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate('article_editor', art.slug || art.id);
                          }}
                          style={{
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.18)',
                            color: '#F3F4F6',
                            borderRadius: '0.375rem',
                            padding: '0.2rem 0.5rem',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            transition: 'all 0.15s ease'
                          }}
                          title="Edit this article"
                        >
                          <Edit3 size={11} />
                          <span>Edit</span>
                        </button>
                      )}
                      <span>{new Date(art.publishedAt || art.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                      <span>•</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Eye size={12} /> {art.views || art.viewsCount || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 1.5rem',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '1.25rem',
              border: '1px dashed var(--border-subtle)'
            }}
          >
            <Newspaper size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem', opacity: 0.6 }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFF', marginBottom: '0.35rem' }}>
              No articles found
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 1.25rem' }}>
              {searchQuery || selectedCategory !== 'All'
                ? 'Try adjusting your search criteria or choosing a different category.'
                : 'No published articles yet. Check back soon!'}
            </p>
            {(searchQuery || selectedCategory !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="btn btn-secondary btn-sm"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
