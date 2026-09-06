import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Search, 
  Users, 
  Sparkles, 
  Layers, 
  GraduationCap, 
  Compass, 
  Trophy, 
  FileCode 
} from 'lucide-react';
import { User } from '../types';

interface Props {
  currentView: string;
  onNavigate: (view: string, detailId?: string) => void;
  currentUser: User;
  onOpenCommunityAccess: () => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<Props> = ({
  currentView,
  onNavigate,
  currentUser: _currentUser,
  onOpenCommunityAccess,
  onOpenSearch
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'activities', label: 'Activities', icon: Layers },
    { id: 'learn', label: 'Learning Academy', icon: GraduationCap },
    { id: 'projects', label: 'Projects', icon: Sparkles },
    { id: 'challenges', label: 'Hackathons', icon: Trophy },
    { id: 'resources', label: 'Resources', icon: FileCode },
    { id: 'about', label: 'About', icon: Users }
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(11, 11, 11, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-subtle)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '4.25rem'
      }}>
        {/* Brand Logo - Discreet Gateway for Internal Community Access */}
        <div 
          onClick={onOpenCommunityAccess}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpenCommunityAccess();
            }
          }}
          title="ACE UiPath Community"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.85rem', 
            cursor: 'pointer',
            userSelect: 'none',
            outline: 'none',
            padding: '0.35rem 0.5rem',
            marginLeft: '-0.5rem',
            borderRadius: 'var(--radius-md)',
            transition: 'background var(--transition-fast)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <img
            src="/logo.png"
            alt="ACE UiPath Community"
            style={{
              height: '36px',
              width: 'auto',
              borderRadius: '6px',
              objectFit: 'contain'
            }}
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.02em', color: '#FFF' }}>
                ACE
              </span>
              <span style={{ 
                color: 'var(--uipath-orange)',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.05rem'
              }}>
                UiPath
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                COMMUNITY
              </span>
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
              ACE ENGINEERING COLLEGE
            </div>
          </div>
        </div>

        {/* Desktop Nav Items - Public Visitor Focus */}
        <nav style={{
          display: 'none',
          alignItems: 'center',
          gap: '0.35rem'
        }} className="desktop-nav">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                style={{
                  background: isActive ? 'rgba(250, 70, 22, 0.12)' : 'transparent',
                  color: isActive ? '#FA4616' : 'var(--text-secondary)',
                  border: isActive ? '1px solid rgba(250, 70, 22, 0.3)' : '1px solid transparent',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Search, Join Us, Mobile Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Quick Search */}
          <button
            onClick={onOpenSearch}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.45rem 0.85rem' }}
            title="Press Ctrl+K to search"
            aria-label="Search community content"
          >
            <Search size={14} />
            <span style={{ fontSize: '0.825rem', display: 'none' }} className="search-hint">Search</span>
            <kbd style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '4px',
              padding: '0.1rem 0.35rem',
              fontSize: '0.65rem',
              color: 'var(--text-muted)'
            }}>
              Ctrl K
            </kbd>
          </button>

          {/* Public Join CTA */}
          <button
            onClick={() => onNavigate('join')}
            className="btn btn-primary btn-sm desktop-cta"
            style={{ padding: '0.45rem 1rem', fontSize: '0.825rem', fontWeight: 600 }}
          >
            Join Us
          </button>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-secondary btn-sm mobile-hamburger"
            style={{ padding: '0.45rem', display: 'flex' }}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown - Clean Public Focus */}
      {mobileMenuOpen && (
        <div style={{
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-medium)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'var(--uipath-orange-subtle)' : 'transparent',
                  color: isActive ? '#FA4616' : 'var(--text-primary)',
                  border: isActive ? '1px solid var(--border-glow)' : 'none',
                  fontSize: '0.95rem',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}

          <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '0.5rem 0' }} />

          <button
            onClick={() => {
              onOpenSearch();
              setMobileMenuOpen(false);
            }}
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'flex-start', gap: '0.65rem' }}
          >
            <Search size={16} /> Search Community (Ctrl+K)
          </button>

          <button
            onClick={() => {
              onNavigate('join');
              setMobileMenuOpen(false);
            }}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'flex-start', gap: '0.65rem' }}
          >
            <Users size={16} /> Join ACE UiPath Community
          </button>
        </div>
      )}

      <style>{`
        @media (min-width: 960px) {
          .desktop-nav { display: flex !important; }
          .desktop-cta { display: inline-flex !important; }
          .search-hint { display: inline !important; }
          .mobile-hamburger { display: none !important; }
        }
      `}</style>
    </header>
  );
};
