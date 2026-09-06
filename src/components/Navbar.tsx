import React, { useState, useRef, useEffect } from 'react';
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
  FileCode,
  ChevronDown
} from 'lucide-react';
import { User } from '../types';

interface Props {
  currentView: string;
  onNavigate: (view: string, detailId?: string) => void;
  currentUser: User;
  onOpenCommunityAccess: () => void;
  onOpenSearch: () => void;
}

interface DropdownItem {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
}

export const Navbar: React.FC<Props> = ({
  currentView,
  onNavigate,
  currentUser: _currentUser,
  onOpenCommunityAccess,
  onOpenSearch
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<'events' | 'resources' | null>(null);
  const [mobileEventsOpen, setMobileEventsOpen] = useState(true);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(true);
  
  const navContainerRef = useRef<HTMLDivElement>(null);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Grouped Navigation Structure
  const eventsItems: DropdownItem[] = [
    { 
      id: 'activities', 
      label: 'Activities & Meetups', 
      description: 'Workshops, hackathons & flagship tech sessions', 
      icon: Layers 
    },
    { 
      id: 'projects', 
      label: 'Student Projects', 
      description: 'Automated workflows & open-source bot showcase', 
      icon: Sparkles 
    },
    { 
      id: 'challenges', 
      label: 'Hackathons & Sprints', 
      description: 'Competitive RPA challenges & problem statements', 
      icon: Trophy 
    }
  ];

  const resourcesItems: DropdownItem[] = [
    { 
      id: 'learn', 
      label: 'Learning Academy', 
      description: 'Structured pathways from Citizen to REFramework Architect', 
      icon: GraduationCap 
    },
    { 
      id: 'resources', 
      label: 'Resources Vault', 
      description: 'Starter kits, cheat sheets, code templates & exam prep', 
      icon: FileCode 
    }
  ];

  const isEventsActive = ['activities', 'projects', 'challenges', 'activity_detail'].includes(currentView);
  const isResourcesActive = ['learn', 'resources'].includes(currentView);
  const isHomeActive = currentView === 'home';
  const isAboutActive = currentView === 'about';

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navContainerRef.current && !navContainerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleMouseEnter = (dropdown: 'events' | 'resources') => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setOpenDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  return (
    <header 
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(10, 10, 10, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}
    >
      <div 
        className="container" 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '4.25rem'
        }}
      >
        {/* Brand Logo - Community Access Gateway */}
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

        {/* Desktop Nav Items - Consolidated Hierarchy */}
        <nav 
          ref={navContainerRef}
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.5rem'
          }} 
          className="desktop-nav"
        >
          {/* 1. Home */}
          <button
            onClick={() => {
              onNavigate('home');
              setOpenDropdown(null);
            }}
            className={`nav-link ${isHomeActive ? 'active' : ''}`}
            style={{
              position: 'relative',
              background: isHomeActive ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
              color: isHomeActive ? '#FFFFFF' : '#9CA3AF',
              border: isHomeActive ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent',
              borderRadius: '8px',
              padding: '0.45rem 0.95rem',
              fontSize: '0.875rem',
              fontWeight: isHomeActive ? 600 : 500,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'color 0.15s ease, background 0.15s ease, border-color 0.15s ease'
            }}
          >
            <span>Home</span>
            {isHomeActive && (
              <span 
                style={{
                  position: 'absolute',
                  bottom: '-1px',
                  left: '25%',
                  right: '25%',
                  height: '2px',
                  background: 'var(--uipath-orange)',
                  borderRadius: '9999px',
                  boxShadow: '0 0 8px rgba(250, 70, 22, 0.9)'
                }}
              />
            )}
          </button>

          {/* 2. Events ▾ Dropdown */}
          <div 
            style={{ position: 'relative' }}
            onMouseEnter={() => handleMouseEnter('events')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => setOpenDropdown(openDropdown === 'events' ? null : 'events')}
              className={`nav-link ${isEventsActive ? 'active' : ''}`}
              style={{
                position: 'relative',
                background: isEventsActive ? 'rgba(255, 255, 255, 0.06)' : openDropdown === 'events' ? 'rgba(255, 255, 255, 0.04)' : 'transparent',
                color: isEventsActive ? '#FFFFFF' : openDropdown === 'events' ? '#FFFFFF' : '#9CA3AF',
                border: isEventsActive ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent',
                borderRadius: '8px',
                padding: '0.45rem 0.95rem',
                fontSize: '0.875rem',
                fontWeight: isEventsActive ? 600 : 500,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'color 0.15s ease, background 0.15s ease, border-color 0.15s ease'
              }}
            >
              <span>Events</span>
              <ChevronDown 
                size={14} 
                style={{
                  transition: 'transform 0.2s ease',
                  transform: openDropdown === 'events' ? 'rotate(180deg)' : 'rotate(0deg)',
                  opacity: 0.75
                }}
              />
              {isEventsActive && (
                <span 
                  style={{
                    position: 'absolute',
                    bottom: '-1px',
                    left: '25%',
                    right: '25%',
                    height: '2px',
                    background: 'var(--uipath-orange)',
                    borderRadius: '9999px',
                    boxShadow: '0 0 8px rgba(250, 70, 22, 0.9)'
                  }}
                />
              )}
            </button>

            {/* Dropdown Menu */}
            {openDropdown === 'events' && (
              <div 
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 0.35rem)',
                  left: 0,
                  width: '310px',
                  background: 'rgba(15, 15, 15, 0.96)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '0.5rem',
                  boxShadow: '0 16px 36px rgba(0, 0, 0, 0.7), 0 0 1px rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  zIndex: 60,
                  animation: 'dropdownFadeIn 0.15s ease-out'
                }}
              >
                {eventsItems.map((item) => {
                  const Icon = item.icon;
                  const isItemActive = currentView === item.id || (item.id === 'activities' && currentView === 'activity_detail');
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        setOpenDropdown(null);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        padding: '0.6rem 0.75rem',
                        borderRadius: '8px',
                        background: isItemActive ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isItemActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isItemActive) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <div 
                        style={{
                          marginTop: '0.15rem',
                          padding: '0.4rem',
                          borderRadius: '6px',
                          background: isItemActive ? 'rgba(250, 70, 22, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                          color: isItemActive ? 'var(--uipath-orange)' : '#9CA3AF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <Icon size={16} />
                      </div>
                      <div>
                        <div style={{ 
                          color: isItemActive ? '#FFFFFF' : '#E5E7EB', 
                          fontSize: '0.85rem', 
                          fontWeight: isItemActive ? 600 : 500,
                          marginBottom: '0.15rem'
                        }}>
                          {item.label}
                        </div>
                        <div style={{ color: '#9CA3AF', fontSize: '0.725rem', lineHeight: '1.3' }}>
                          {item.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. Resources ▾ Dropdown */}
          <div 
            style={{ position: 'relative' }}
            onMouseEnter={() => handleMouseEnter('resources')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => setOpenDropdown(openDropdown === 'resources' ? null : 'resources')}
              className={`nav-link ${isResourcesActive ? 'active' : ''}`}
              style={{
                position: 'relative',
                background: isResourcesActive ? 'rgba(255, 255, 255, 0.06)' : openDropdown === 'resources' ? 'rgba(255, 255, 255, 0.04)' : 'transparent',
                color: isResourcesActive ? '#FFFFFF' : openDropdown === 'resources' ? '#FFFFFF' : '#9CA3AF',
                border: isResourcesActive ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent',
                borderRadius: '8px',
                padding: '0.45rem 0.95rem',
                fontSize: '0.875rem',
                fontWeight: isResourcesActive ? 600 : 500,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'color 0.15s ease, background 0.15s ease, border-color 0.15s ease'
              }}
            >
              <span>Resources</span>
              <ChevronDown 
                size={14} 
                style={{
                  transition: 'transform 0.2s ease',
                  transform: openDropdown === 'resources' ? 'rotate(180deg)' : 'rotate(0deg)',
                  opacity: 0.75
                }}
              />
              {isResourcesActive && (
                <span 
                  style={{
                    position: 'absolute',
                    bottom: '-1px',
                    left: '25%',
                    right: '25%',
                    height: '2px',
                    background: 'var(--uipath-orange)',
                    borderRadius: '9999px',
                    boxShadow: '0 0 8px rgba(250, 70, 22, 0.9)'
                  }}
                />
              )}
            </button>

            {/* Dropdown Menu */}
            {openDropdown === 'resources' && (
              <div 
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 0.35rem)',
                  left: 0,
                  width: '320px',
                  background: 'rgba(15, 15, 15, 0.96)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '0.5rem',
                  boxShadow: '0 16px 36px rgba(0, 0, 0, 0.7), 0 0 1px rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  zIndex: 60,
                  animation: 'dropdownFadeIn 0.15s ease-out'
                }}
              >
                {resourcesItems.map((item) => {
                  const Icon = item.icon;
                  const isItemActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        setOpenDropdown(null);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        padding: '0.6rem 0.75rem',
                        borderRadius: '8px',
                        background: isItemActive ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isItemActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isItemActive) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <div 
                        style={{
                          marginTop: '0.15rem',
                          padding: '0.4rem',
                          borderRadius: '6px',
                          background: isItemActive ? 'rgba(250, 70, 22, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                          color: isItemActive ? 'var(--uipath-orange)' : '#9CA3AF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <Icon size={16} />
                      </div>
                      <div>
                        <div style={{ 
                          color: isItemActive ? '#FFFFFF' : '#E5E7EB', 
                          fontSize: '0.85rem', 
                          fontWeight: isItemActive ? 600 : 500,
                          marginBottom: '0.15rem'
                        }}>
                          {item.label}
                        </div>
                        <div style={{ color: '#9CA3AF', fontSize: '0.725rem', lineHeight: '1.3' }}>
                          {item.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 4. About */}
          <button
            onClick={() => {
              onNavigate('about');
              setOpenDropdown(null);
            }}
            className={`nav-link ${isAboutActive ? 'active' : ''}`}
            style={{
              position: 'relative',
              background: isAboutActive ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
              color: isAboutActive ? '#FFFFFF' : '#9CA3AF',
              border: isAboutActive ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent',
              borderRadius: '8px',
              padding: '0.45rem 0.95rem',
              fontSize: '0.875rem',
              fontWeight: isAboutActive ? 600 : 500,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'color 0.15s ease, background 0.15s ease, border-color 0.15s ease'
            }}
          >
            <span>About</span>
            {isAboutActive && (
              <span 
                style={{
                  position: 'absolute',
                  bottom: '-1px',
                  left: '25%',
                  right: '25%',
                  height: '2px',
                  background: 'var(--uipath-orange)',
                  borderRadius: '9999px',
                  boxShadow: '0 0 8px rgba(250, 70, 22, 0.9)'
                }}
              />
            )}
          </button>
        </nav>

        {/* Right Actions: Toned-down Search, Elevated Join Us, Mobile Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Toned Down Search Pill */}
          <button
            onClick={onOpenSearch}
            className="search-button-pill"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              padding: '0.45rem 0.8rem',
              background: 'rgba(20, 20, 20, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: '#9CA3AF',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Press Ctrl+K to search"
            aria-label="Search community content"
          >
            <Search size={14} style={{ color: '#9CA3AF' }} />
            <span style={{ fontSize: '0.825rem', display: 'none', color: '#9CA3AF' }} className="search-hint">Search</span>
            <kbd 
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '4px',
                padding: '0.1rem 0.35rem',
                fontSize: '0.65rem',
                color: '#9CA3AF',
                fontFamily: 'inherit'
              }}
            >
              Ctrl K
            </kbd>
          </button>

          {/* Elevated Vibrant Join Us Button */}
          <button
            onClick={() => onNavigate('join')}
            className="join-us-elevated-btn desktop-cta"
            style={{
              background: 'var(--uipath-orange)',
              color: '#FFFFFF',
              padding: '0.45rem 1.05rem',
              fontSize: '0.825rem',
              fontWeight: 600,
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(250, 70, 22, 0.2)'
            }}
          >
            Join Us
          </button>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-secondary btn-sm mobile-hamburger"
            style={{ 
              padding: '0.45rem', 
              display: 'flex',
              background: 'rgba(20, 20, 20, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer - Clean Accordion Hierarchy */}
      {mobileMenuOpen && (
        <div 
          style={{
            background: 'rgba(12, 12, 12, 0.98)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            maxHeight: 'calc(100vh - 4.5rem)',
            overflowY: 'auto'
          }}
        >
          {/* Mobile: Home */}
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              background: isHomeActive ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
              color: isHomeActive ? '#FFFFFF' : '#9CA3AF',
              border: isHomeActive ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent',
              fontSize: '0.925rem',
              fontWeight: isHomeActive ? 600 : 500,
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <Compass size={18} style={{ color: isHomeActive ? 'var(--uipath-orange)' : '#9CA3AF' }} />
            <span>Home</span>
          </button>

          {/* Mobile: Events Section */}
          <div style={{ borderRadius: '8px', background: 'rgba(255, 255, 255, 0.02)', padding: '0.25rem' }}>
            <div 
              onClick={() => setMobileEventsOpen(!mobileEventsOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                color: isEventsActive ? '#FFFFFF' : '#9CA3AF',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              <span style={{ textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '0.75rem' }}>Events</span>
              <ChevronDown size={14} style={{ transform: mobileEventsOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
            </div>

            {mobileEventsOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', paddingLeft: '0.5rem', paddingBottom: '0.4rem' }}>
                {eventsItems.map((item) => {
                  const Icon = item.icon;
                  const isItemActive = currentView === item.id || (item.id === 'activities' && currentView === 'activity_detail');
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
                        gap: '0.65rem',
                        padding: '0.6rem 0.75rem',
                        borderRadius: '6px',
                        background: isItemActive ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
                        color: isItemActive ? '#FFFFFF' : '#9CA3AF',
                        border: 'none',
                        fontSize: '0.875rem',
                        fontWeight: isItemActive ? 600 : 450,
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <Icon size={16} style={{ color: isItemActive ? 'var(--uipath-orange)' : '#9CA3AF' }} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Mobile: Resources Section */}
          <div style={{ borderRadius: '8px', background: 'rgba(255, 255, 255, 0.02)', padding: '0.25rem' }}>
            <div 
              onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                color: isResourcesActive ? '#FFFFFF' : '#9CA3AF',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              <span style={{ textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '0.75rem' }}>Resources</span>
              <ChevronDown size={14} style={{ transform: mobileResourcesOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
            </div>

            {mobileResourcesOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', paddingLeft: '0.5rem', paddingBottom: '0.4rem' }}>
                {resourcesItems.map((item) => {
                  const Icon = item.icon;
                  const isItemActive = currentView === item.id;
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
                        gap: '0.65rem',
                        padding: '0.6rem 0.75rem',
                        borderRadius: '6px',
                        background: isItemActive ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
                        color: isItemActive ? '#FFFFFF' : '#9CA3AF',
                        border: 'none',
                        fontSize: '0.875rem',
                        fontWeight: isItemActive ? 600 : 450,
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <Icon size={16} style={{ color: isItemActive ? 'var(--uipath-orange)' : '#9CA3AF' }} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Mobile: About */}
          <button
            onClick={() => {
              onNavigate('about');
              setMobileMenuOpen(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              background: isAboutActive ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
              color: isAboutActive ? '#FFFFFF' : '#9CA3AF',
              border: isAboutActive ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent',
              fontSize: '0.925rem',
              fontWeight: isAboutActive ? 600 : 500,
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <Users size={18} style={{ color: isAboutActive ? 'var(--uipath-orange)' : '#9CA3AF' }} />
            <span>About</span>
          </button>

          <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)', margin: '0.5rem 0' }} />

          {/* Mobile Search CTA */}
          <button
            onClick={() => {
              onOpenSearch();
              setMobileMenuOpen(false);
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              background: 'rgba(20, 20, 20, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#9CA3AF',
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            <Search size={16} /> Search Community (Ctrl+K)
          </button>

          {/* Mobile Join Us CTA */}
          <button
            onClick={() => {
              onNavigate('join');
              setMobileMenuOpen(false);
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              background: 'var(--uipath-orange)',
              color: '#FFFFFF',
              fontWeight: 600,
              border: 'none',
              fontSize: '0.925rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(250, 70, 22, 0.3)'
            }}
          >
            Join ACE UiPath Community
          </button>
        </div>
      )}

      {/* Scoped Dynamic Styles for Transitions and Hover Effects */}
      <style>{`
        @keyframes dropdownFadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .nav-link:hover {
          color: #FFFFFF !important;
          background: rgba(255, 255, 255, 0.04) !important;
        }

        .nav-link.active:hover {
          background: rgba(255, 255, 255, 0.07) !important;
        }

        .search-button-pill:hover {
          border-color: rgba(255, 255, 255, 0.2) !important;
          background: rgba(28, 28, 28, 0.85) !important;
          color: #E5E7EB !important;
        }

        .search-button-pill:hover kbd {
          color: #E5E7EB !important;
          border-color: rgba(255, 255, 255, 0.15) !important;
        }

        .join-us-elevated-btn:hover {
          box-shadow: 0 0 16px rgba(255, 90, 0, 0.35) !important;
          transform: translateY(-1px);
          background: #FF5522 !important;
        }

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
