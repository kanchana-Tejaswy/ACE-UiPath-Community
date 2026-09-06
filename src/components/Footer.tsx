import React from 'react';
import { 
  Github, 
  Linkedin, 
  MessageSquare, 
  Award, 
  ExternalLink,
  Layers,
  BookOpen
} from 'lucide-react';
import { SiteSettings } from '../types';

interface Props {
  settings: SiteSettings;
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<Props> = ({ settings, onNavigate }) => {
  return (
    <footer 
      style={{
        background: '#0B0B0B',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        paddingTop: '4rem',
        paddingBottom: '2.5rem',
        marginTop: '5rem',
        position: 'relative'
      }}
    >
      <div className="container">
        {/* Main 4-Column Aligned Grid */}
        <div className="footer-grid">
          {/* Col 1: Identity & Socials (1.3fr) */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <img
                src="/logo.png"
                alt="ACE UiPath Community"
                style={{ height: '36px', width: 'auto', borderRadius: '6px', objectFit: 'contain' }}
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.01em', color: '#FFFFFF' }}>
                ACE <span style={{ color: 'var(--uipath-orange)' }}>UiPath</span> Community
              </div>
            </div>

            <p style={{ 
              fontSize: '0.875rem', 
              lineHeight: '1.625', 
              marginBottom: '1.5rem', 
              color: '#A3A3A3',
              maxWidth: '20rem' 
            }}>
              A student-led technology chapter at ACE Engineering College focused on learning, building, and deploying real automation solutions.
            </p>

            {/* Softened Social Icon Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <a
                href={settings.communityGithubUrl}
                target="_blank"
                rel="noreferrer"
                className="footer-social-btn"
                aria-label="GitHub Repository"
                title="GitHub"
              >
                <Github size={16} />
              </a>
              <a
                href={settings.communityLinkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="footer-social-btn"
                aria-label="LinkedIn Page"
                title="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a
                href={settings.communityDiscordUrl}
                target="_blank"
                rel="noreferrer"
                className="footer-social-btn"
                aria-label="Community Discussions & Discord"
                title="Discord Community"
              >
                <MessageSquare size={16} />
              </a>
            </div>
          </div>

          {/* Col 2: Community Pulse (1fr) */}
          <div>
            <h4 style={{ 
              fontSize: '0.75rem', 
              fontWeight: 600, 
              letterSpacing: '0.08em', 
              textTransform: 'uppercase', 
              color: '#A3A3A3', 
              marginBottom: '1.25rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.45rem' 
            }}>
              <Layers size={14} style={{ color: 'var(--uipath-orange)' }} /> COMMUNITY PULSE
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <li>
                <button onClick={() => onNavigate('activities')} className="footer-nav-link">
                  Activity Timeline (2022-2026)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('challenges')} className="footer-nav-link">
                  Active Hackathons & Sprints
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('projects')} className="footer-nav-link">
                  Student Bot Vault & Packages
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="footer-nav-link">
                  Leadership & Chapter History
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Learning Academy (1.1fr) */}
          <div>
            <h4 style={{ 
              fontSize: '0.75rem', 
              fontWeight: 600, 
              letterSpacing: '0.08em', 
              textTransform: 'uppercase', 
              color: '#A3A3A3', 
              marginBottom: '1.25rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.45rem' 
            }}>
              <BookOpen size={14} style={{ color: 'var(--uipath-orange)' }} /> LEARNING ACADEMY
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <li>
                <button onClick={() => onNavigate('learn')} className="footer-nav-link">
                  Citizen Developer (StudioX)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('learn')} className="footer-nav-link">
                  Associate RPA Developer (Studio)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('learn')} className="footer-nav-link">
                  Enterprise Architect (REFramework)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('resources')} className="footer-nav-link">
                  Download Starter .XAML & Cheat Sheets
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Accreditation Inset Glass Card (1.2fr) */}
          <div>
            <h4 style={{ 
              fontSize: '0.75rem', 
              fontWeight: 600, 
              letterSpacing: '0.08em', 
              textTransform: 'uppercase', 
              color: '#A3A3A3', 
              marginBottom: '1.25rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.45rem' 
            }}>
              <Award size={14} style={{ color: 'var(--uipath-orange)' }} /> ACCREDITATION
            </h4>
            <div 
              style={{
                background: 'rgba(20, 20, 20, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '1.15rem',
                backdropFilter: 'blur(8px)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
                <span className="badge badge-orange" style={{ fontSize: '0.7rem', padding: '0.2rem 0.55rem' }}>
                  UiPath Academic Alliance
                </span>
              </div>
              <div style={{ marginBottom: '0.85rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#737373', marginBottom: '0.25rem' }}>
                  Partner Chapter ID:
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '4px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#D4D4D4',
                  display: 'inline-block',
                  letterSpacing: '0.02em'
                }}>
                  {settings.uipathAllianceId || 'ACE-UIPATH-EDU-ALLIANCE-9421'}
                </div>
              </div>
              <a
                href="https://www.uipath.com/rpa/academic-alliance"
                target="_blank"
                rel="noreferrer"
                className="footer-program-link"
              >
                <span>Official Program Details</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Baseline Sub-Footer */}
        <div 
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '1.75rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.8125rem',
            color: '#737373'
          }}
          className="footer-bottom-bar"
        >
          <div>
            © {new Date().getFullYear()} ACE UiPath Community. Designed for institutional longevity & student innovation.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <button 
              onClick={() => onNavigate('join')} 
              className="footer-sublink"
            >
              Contribute & Mentor
            </button>
            <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.15)' }} />
            <button 
              onClick={() => onNavigate('about')} 
              className="footer-sublink"
            >
              About Chapter
            </button>
            <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.15)' }} />
            <a 
              href="https://www.uipath.com" 
              target="_blank" 
              rel="noreferrer" 
              className="footer-sublink"
            >
              UiPath Alliance
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 1.3fr 1fr 1.1fr 1.2fr;
          gap: 3rem;
          margin-bottom: 3.5rem;
        }

        .footer-social-btn {
          padding: 0.5rem;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(20, 20, 20, 0.5);
          color: #9CA3AF;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .footer-social-btn:hover {
          color: #FFFFFF;
          border-color: rgba(255, 255, 255, 0.2);
          background: rgba(30, 30, 30, 0.8);
          transform: translateY(-1px);
        }

        .footer-nav-link {
          background: none;
          border: none;
          color: #A3A3A3;
          font-size: 0.875rem;
          line-height: 1.5;
          cursor: pointer;
          text-align: left;
          padding: 0;
          transition: color 0.15s ease;
        }

        .footer-nav-link:hover {
          color: #FFFFFF;
        }

        .footer-program-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.775rem;
          color: #A3A3A3;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .footer-program-link:hover {
          color: var(--uipath-orange);
        }

        .footer-sublink {
          background: none;
          border: none;
          color: #737373;
          cursor: pointer;
          font-size: 0.8125rem;
          padding: 0;
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .footer-sublink:hover {
          color: #E5E7EB;
        }

        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 2.5rem;
          }
        }

        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 2.25rem;
          }
          .footer-bottom-bar {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </footer>
  );
};
