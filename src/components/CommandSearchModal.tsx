import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, Layers, GraduationCap, Sparkles, FileCode, Trophy, ArrowRight, Filter } from 'lucide-react';
import { Activity, LearningPath, ProjectShowcase, CommunityResource, Challenge } from '../types';
import { searchContent, SearchResult } from '../lib/search/searchEngine';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activities: Activity[];
  learningPaths: LearningPath[];
  projects: ProjectShowcase[];
  challenges: Challenge[];
  resources: CommunityResource[];
  onNavigate: (view: string, detailId?: string) => void;
  onRecordAnalytics?: (event: { eventType: any; entityType?: string; entityId?: string; metadata?: any }) => void;
}

type FilterChip = 'all' | 'activity' | 'module' | 'project' | 'challenge' | 'resource';

export const CommandSearchModal: React.FC<Props> = ({
  isOpen,
  onClose,
  activities,
  learningPaths,
  projects,
  challenges,
  resources,
  onNavigate,
  onRecordAnalytics
}) => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterChip>('all');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      if (onRecordAnalytics) {
        onRecordAnalytics({ eventType: 'SEARCH_PERFORMED', metadata: { query: 'modal_opened' } });
      }
    } else {
      setQuery('');
      setSelectedIndex(0);
      setActiveFilter('all');
    }
  }, [isOpen]);

  const searchResults: SearchResult[] = useMemo(() => {
    return searchContent(query, { contentType: activeFilter }, {
      activities,
      learningPaths,
      projects,
      challenges,
      resources
    });
  }, [query, activeFilter, activities, learningPaths, projects, challenges, resources]);

  // Reset selected index when query or filter changes
  useEffect(() => {
    setSelectedIndex(0);
    if (query.trim().length >= 3 && searchResults.length === 0 && onRecordAnalytics) {
      onRecordAnalytics({
        eventType: 'SEARCH_NO_RESULTS',
        metadata: { query: query.trim(), filter: activeFilter }
      });
    }
  }, [query, activeFilter, searchResults]);

  const handleSelectResult = (item: SearchResult) => {
    if (onRecordAnalytics) {
      onRecordAnalytics({
        eventType: 'SEARCH_RESULT_OPENED',
        entityType: item.type,
        entityId: item.id,
        metadata: { query: query.trim(), route: item.route }
      });
    }

    if (item.type === 'activity' && item.detailId) {
      onNavigate('activity_detail', item.detailId);
    } else if (item.type === 'module') {
      onNavigate('learn');
    } else if (item.type === 'project') {
      onNavigate('projects');
    } else if (item.type === 'challenge') {
      onNavigate('challenges');
    } else if (item.type === 'resource') {
      onNavigate('resources');
    }
    onClose();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }

      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (searchResults.length > 0 ? (prev + 1) % searchResults.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (searchResults.length > 0 ? (prev - 1 + searchResults.length) % searchResults.length : 0));
      } else if (e.key === 'Enter' && searchResults[selectedIndex]) {
        e.preventDefault();
        handleSelectResult(searchResults[selectedIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, searchResults, selectedIndex]);

  if (!isOpen) return null;

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'activity': return <Layers size={14} className="text-orange" />;
      case 'module': return <GraduationCap size={14} style={{ color: 'var(--uipath-orange)' }} />;
      case 'project': return <Sparkles size={14} style={{ color: '#34D399' }} />;
      case 'challenge': return <Trophy size={14} style={{ color: '#F59E0B' }} />;
      case 'resource': return <FileCode size={14} style={{ color: 'var(--text-secondary)' }} />;
    }
  };

  const getTypeBadge = (type: SearchResult['type']) => {
    switch (type) {
      case 'activity': return <span className="badge badge-orange" style={{ fontSize: '0.65rem' }}>Activity</span>;
      case 'module': return <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>Academy</span>;
      case 'project': return <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>Bot Showcase</span>;
      case 'challenge': return <span className="badge badge-orange" style={{ fontSize: '0.65rem' }}>Hackathon</span>;
      case 'resource': return <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>Resource</span>;
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 110,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '5rem 1.5rem 2rem 1.5rem'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '680px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-glow)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden'
        }}
      >
        {/* Search Input Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <Search size={20} className="text-orange" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type 'REFramework', 'Queues', 'Document Understanding', 'Hackathon'..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '1.05rem',
              fontFamily: 'var(--font-sans)'
            }}
          />
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.2rem'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Filter Chips Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.65rem 1.25rem',
          background: 'var(--bg-primary)',
          borderBottom: '1px solid var(--border-subtle)',
          overflowX: 'auto'
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginRight: '0.25rem' }}>
            <Filter size={12} /> Filter:
          </span>
          {(['all', 'activity', 'module', 'project', 'challenge', 'resource'] as FilterChip[]).map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                background: activeFilter === f ? 'var(--uipath-orange)' : 'var(--bg-tertiary)',
                color: activeFilter === f ? '#FFF' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                padding: '0.25rem 0.65rem',
                fontSize: '0.75rem',
                fontWeight: activeFilter === f ? 600 : 500,
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all var(--transition-fast)'
              }}
            >
              {f === 'all' ? 'All Content' : f === 'activity' ? 'Activities' : f === 'module' ? 'Academy' : f === 'project' ? 'Bots' : f === 'challenge' ? 'Hackathons' : 'Resources'}
            </button>
          ))}
        </div>

        {/* Results Area */}
        <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '0.75rem' }}>
          {searchResults.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
              {query.trim() ? (
                <>
                  <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-primary)' }}>
                    No results found for "{query}"
                  </p>
                  <p style={{ fontSize: '0.8rem', marginTop: '0.35rem' }}>
                    Try searching for "REFramework", "Document Understanding", "StudioX", or "API".
                  </p>
                </>
              ) : (
                <p style={{ margin: 0, fontSize: '0.85rem' }}>
                  Type keywords above or select a filter chip to discover platform content.
                </p>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {searchResults.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={`${item.type}_${item.id}_${idx}`}
                    onClick={() => handleSelectResult(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'var(--bg-tertiary)' : 'transparent',
                      border: isSelected ? '1px solid var(--border-glow)' : '1px solid transparent',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: 1 }}>
                      <div style={{ marginTop: '0.15rem' }}>{getTypeIcon(item.type)}</div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.925rem', color: isSelected ? '#FA4616' : 'var(--text-primary)' }}>
                            {item.title}
                          </span>
                          {getTypeBadge(item.type)}
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ArrowRight size={14} style={{ color: isSelected ? '#FA4616' : 'var(--text-muted)' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div style={{
          padding: '0.65rem 1.25rem',
          background: 'var(--bg-primary)',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span><kbd style={{ background: 'var(--bg-secondary)', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>↑</kbd> <kbd style={{ background: 'var(--bg-secondary)', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>↓</kbd> Navigate</span>
          <span><kbd style={{ background: 'var(--bg-secondary)', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>Enter</kbd> Select</span>
          <span><kbd style={{ background: 'var(--bg-secondary)', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>ESC</kbd> Close</span>
        </div>
      </div>
    </div>
  );
};
