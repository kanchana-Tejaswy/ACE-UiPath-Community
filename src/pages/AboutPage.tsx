import React from 'react';
import { 
  Users, 
  Award, 
  Linkedin, 
  Github, 
  BookOpen, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck,
  Calendar,
  Sparkles
} from 'lucide-react';
import { LeadershipMember, SiteSettings } from '../types';

interface Props {
  leadership: LeadershipMember[];
  settings: SiteSettings;
  onNavigate: (view: string) => void;
}

export const AboutPage: React.FC<Props> = ({ leadership, settings, onNavigate }) => {
  const sortedLeadership = [...leadership].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
      {/* Header */}
      <div style={{ maxWidth: '850px', marginBottom: '3.5rem' }}>
        <span className="badge badge-orange" style={{ marginBottom: '0.5rem' }}>
          Institutional Legacy & Leadership
        </span>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, marginBottom: '1rem' }}>
          The Story of ACE UiPath Community
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Founded at ACE Engineering College, our mission is to cultivate world-class automation engineers, bridge academia with Fortune-500 enterprise RPA practices, and maintain a permanent institutional repository of student innovations.
        </p>
      </div>

      {/* History & Foundation Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        marginBottom: '4.5rem'
      }}>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
            The Genesis (2022)
          </h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
            Recognizing the exponential rise of Robotic Process Automation in Fortune 500 enterprises, student visionary Siddharth Rao and faculty mentor Dr. S. K. Murthy established the ACE UiPath Student Chapter in 2022.
          </p>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            What began as an informal 20-student study circle quickly evolved into a campus-wide center of excellence, securing official recognition from the <strong>UiPath Academic Alliance</strong>.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
            Scaling to Enterprise Impact (2024-2026)
          </h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
            Under the leadership of Kanchana Tejaswy and Rohit Varma, the community transitioned from basic script training to building real-world enterprise automations.
          </p>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Students engineered bots that automate college result calculations, Koha LMS library fines, and medical prescription parsing, saving thousands of faculty hours.
          </p>
        </div>
      </div>

      {/* UiPath Academic Alliance MoU Box */}
      <div className="glass-panel" style={{
        padding: '2.5rem',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        marginBottom: '4.5rem'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '2rem' }}>
          <div style={{ maxWidth: '680px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Award size={18} style={{ color: 'var(--uipath-orange)' }} />
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#FED7AA' }}>OFFICIAL ACCREDITATION</span>
            </div>
            <h3 style={{ fontSize: '1.65rem', marginBottom: '0.75rem' }}>UiPath Academic Alliance Educator Partner</h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              ACE Engineering College is an official member of the global UiPath Academic Alliance. Our curriculum aligns directly with the official <strong>UiPath Certified Associate & Advanced RPA Developer</strong> blueprints.
            </p>
          </div>

          <div>
            <div style={{
              background: 'var(--bg-secondary)',
              padding: '1.25rem 1.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ALLIANCE PARTNER ID</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1rem', color: '#FA4616', marginTop: '0.25rem' }}>
                {settings.uipathAllianceId}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leadership Directory */}
      <div style={{ marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="badge badge-orange" style={{ marginBottom: '0.5rem' }}>Community Stewards</span>
          <h2 style={{ fontSize: '2.2rem' }}>Leadership & Core Team Wall</h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>
            The dedicated students, faculty advisors, and alumni mentors who steer the ACE UiPath Community.
          </p>
        </div>

        <div className="grid-responsive-2">
          {sortedLeadership.map((member) => (
            <div
              key={member.id}
              className="glass-card"
              style={{
                padding: '2rem',
                display: 'flex',
                gap: '1.5rem',
                alignItems: 'flex-start'
              }}
            >
              <img
                src={member.avatarUrl}
                alt={member.name}
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '16px',
                  objectFit: 'cover',
                  border: '1px solid var(--border-subtle)',
                  flexShrink: 0
                }}
              />

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>{member.name}</h3>
                  <span className="badge badge-slate" style={{ fontSize: '0.65rem' }}>
                    {member.academicYear}
                  </span>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--uipath-orange)', fontWeight: 600, marginBottom: '0.5rem' }}>
                  {member.roleTitle}
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  {member.bio}
                </p>

                {/* Key Contributions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1rem' }}>
                  {member.contributions.map((c, cIdx) => (
                    <div key={cIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                      <CheckCircle2 size={13} style={{ color: '#10B981' }} />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>

                {/* Social Links */}
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  {member.linkedinUrl && (
                    <a
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                    >
                      <Linkedin size={13} /> LinkedIn
                    </a>
                  )}
                  {member.githubUrl && (
                    <a
                      href={member.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                    >
                      <Github size={13} /> GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
