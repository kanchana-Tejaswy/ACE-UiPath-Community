import React from 'react';
import { 
  Heart, 
  Github, 
  Linkedin, 
  MessageSquare, 
  Award, 
  FileCode, 
  ExternalLink,
  Layers,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { SiteSettings } from '../types';

interface Props {
  settings: SiteSettings;
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<Props> = ({ settings, onNavigate }) => {
  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-subtle)',
      paddingTop: '4rem',
      paddingBottom: '2.5rem',
      marginTop: '5rem',
      position: 'relative'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '3rem',
          marginBottom: '3.5rem'
        }}>
          {/* Col 1: Identity */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <img
                src="/logo.png"
                alt="ACE UiPath Community"
                style={{ height: '36px', width: 'auto', borderRadius: '4px' }}
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem' }}>
                ACE <span style={{ color: 'var(--uipath-orange)' }}>UiPath</span> Community
              </div>
            </div>

            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '1.25rem', color: 'var(--text-secondary)' }}>
              A student-led technology chapter at ACE Engineering College focused on learning, building, and deploying real automation solutions.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <a
                href={settings.communityGithubUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.45rem', borderRadius: 'var(--radius-sm)' }}
                aria-label="GitHub Repository"
              >
                <Github size={16} />
              </a>
              <a
                href={settings.communityLinkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.45rem', borderRadius: 'var(--radius-sm)' }}
                aria-label="LinkedIn Page"
              >
                <Linkedin size={16} />
              </a>
              <a
                href={settings.communityDiscordUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.45rem', borderRadius: 'var(--radius-sm)' }}
                aria-label="Discord Server"
              >
                <MessageSquare size={16} />
              </a>
            </div>
          </div>

          {/* Col 2: Institutional Memory & Activities */}
          <div>
            <h4 style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Layers size={16} style={{ color: 'var(--uipath-orange)' }} /> Community Pulse
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <li>
                <button onClick={() => onNavigate('activities')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                  Activity Timeline (2022-2026)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('challenges')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                  Active Hackathons & Sprints
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('projects')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                  Student Bot Vault & Packages
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                  Leadership & Chapter History
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: UiPath Learning Academy */}
          <div>
            <h4 style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <BookOpen size={16} style={{ color: 'var(--uipath-orange)' }} /> Learning Academy
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <li>
                <button onClick={() => onNavigate('learn')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                  Citizen Developer (StudioX)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('learn')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                  Associate RPA Developer (Studio)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('learn')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                  Enterprise Architect (REFramework)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('resources')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                  Download Starter .XAML & Cheat Sheets
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: UiPath Academic Alliance Accreditation */}
          <div>
            <h4 style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Award size={16} style={{ color: 'var(--uipath-orange)' }} /> Accreditation
            </h4>
            <div style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="badge badge-orange">UiPath Academic Alliance</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                Partner Chapter ID: <code style={{ color: '#FED7AA' }}>{settings.uipathAllianceId}</code>
              </p>
              <a
                href="https://www.uipath.com/rpa/academic-alliance"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.775rem',
                  color: 'var(--uipath-orange)',
                  fontWeight: 600
                }}
              >
                Official Program Details <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1.75rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.825rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            © {new Date().getFullYear()} ACE UiPath Community. Designed for institutional longevity & student innovation.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <button onClick={() => onNavigate('join')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}>
              Contribute & Mentor
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
