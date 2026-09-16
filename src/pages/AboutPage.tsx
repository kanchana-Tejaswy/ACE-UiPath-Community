import React, { useState } from 'react';
import { 
  Users, 
  Award, 
  Linkedin, 
  Github, 
  Globe,
  BookOpen, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck,
  Calendar,
  Sparkles,
  Filter
} from 'lucide-react';
import { LeadershipMember, SiteSettings, RosterCategory } from '../types';
import { 
  ROSTER_CATEGORIES, 
  getRosterBadgeConfig, 
  getMemberCategories, 
  getMemberTenure, 
  getMemberInitials, 
  isMemberActive 
} from '../utils/rosterBadges';

interface Props {
  leadership: LeadershipMember[];
  settings: SiteSettings;
  onNavigate: (view: string) => void;
}

export const AboutPage: React.FC<Props> = ({ leadership, settings, onNavigate }) => {
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');
  const sortedLeadership = [...leadership].sort((a, b) => a.orderIndex - b.orderIndex);

  const filteredLeadership = sortedLeadership.filter((member) => {
    if (selectedRoleFilter === 'ALL') return true;
    const categories = getMemberCategories(member);
    return categories.includes(selectedRoleFilter as RosterCategory);
  });

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
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="badge badge-orange" style={{ marginBottom: '0.5rem' }}>Community Stewards</span>
          <h2 style={{ fontSize: '2.2rem' }}>Leadership & Core Team Wall</h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>
            The dedicated students, faculty advisors, and alumni mentors who steer the ACE UiPath Community.
          </p>

          {/* Multi-Role Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setSelectedRoleFilter('ALL')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                selectedRoleFilter === 'ALL'
                  ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
              }`}
            >
              All Stewards ({sortedLeadership.length})
            </button>
            {ROSTER_CATEGORIES.map((role) => {
              const count = sortedLeadership.filter((m) => getMemberCategories(m).includes(role)).length;
              if (count === 0 && selectedRoleFilter !== role) return null;
              const isSelected = selectedRoleFilter === role;
              return (
                <button
                  key={role}
                  onClick={() => setSelectedRoleFilter(role)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                  }`}
                >
                  {role} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {filteredLeadership.length === 0 ? (
          <div className="text-center py-12 bg-neutral-900/30 border border-neutral-850 rounded-2xl">
            <p className="text-neutral-400 text-sm">No stewards found for selected role filter "{selectedRoleFilter}".</p>
            <button
              onClick={() => setSelectedRoleFilter('ALL')}
              className="mt-3 text-xs text-orange-400 hover:underline cursor-pointer"
            >
              Show all stewards
            </button>
          </div>
        ) : (
          <div className="grid-responsive-2">
            {filteredLeadership.map((member) => {
              const active = isMemberActive(member);
              const tenure = getMemberTenure(member);
              const categories = getMemberCategories(member);

              return (
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
                  <div style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '16px',
                    border: '2px solid rgba(250, 70, 22, 0.35)',
                    overflow: 'hidden',
                    backgroundColor: '#262626',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#E5E5E5',
                    fontWeight: 700,
                    fontSize: '1.25rem'
                  }}>
                    {member.avatarUrl ? (
                      <img
                        src={member.avatarUrl}
                        alt={member.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                    ) : (
                      <span>{getMemberInitials(member.name)}</span>
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 700 }}>{member.name}</h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.35rem' }}>
                        {categories.map((cat) => {
                          const badge = getRosterBadgeConfig(cat, active);
                          return (
                            <span 
                              key={cat} 
                              className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${badge.bg} ${badge.text} ${badge.border}`}
                              style={badge.customStyle}
                            >
                              {badge.label}
                            </span>
                          );
                        })}
                        {active ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                            Active
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-neutral-800 text-neutral-400 border border-neutral-700">
                            Alumni
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: 'var(--uipath-orange)', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.4rem' }}>
                      <span>{member.roleTitle}</span>
                      {member.department && (
                        <>
                          <span style={{ color: 'var(--text-muted)' }}>•</span>
                          <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{member.department}</span>
                        </>
                      )}
                      <span style={{ color: 'var(--text-muted)' }}>•</span>
                      <span style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontWeight: 500 }}>{tenure}</span>
                    </div>

                    {member.bio && (
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                        {member.bio}
                      </p>
                    )}

                    {/* Key Contributions */}
                    {member.contributions && member.contributions.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1rem' }}>
                        {member.contributions.map((c, cIdx) => (
                          <div key={cIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                            <CheckCircle2 size={13} style={{ color: '#10B981' }} />
                            <span>{c}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Social Links */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {member.linkedinUrl && (
                        <a
                          href={member.linkedinUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: '#0A66C2', display: 'flex', alignItems: 'center' }}
                          title="LinkedIn"
                        >
                          <Linkedin size={16} />
                        </a>
                      )}
                      {member.githubUrl && (
                        <a
                          href={member.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}
                          title="GitHub"
                        >
                          <Github size={16} />
                        </a>
                      )}
                      {member.uipathProfileUrl && (
                        <a
                          href={member.uipathProfileUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: '#FA4616', display: 'flex', alignItems: 'center' }}
                          title="UiPath Community Profile"
                        >
                          <Globe size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
