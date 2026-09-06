import React from 'react';
import { X, ShieldCheck, Users, Settings, Check } from 'lucide-react';
import { User, UserRole } from '../types';
import { normalizeRole } from '../lib/security';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSelectRole: (role: UserRole) => void;
}

export const RoleSwitcherModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectRole
}) => {
  if (!isOpen) return null;

  const roles: { role: UserRole; title: string; desc: string; icon: any; color: string; badge: string }[] = [
    {
      role: 'STUDENT',
      title: 'Public / Student Experience',
      desc: 'Frictionless exploration: browse all historical activities, download .XAML workflows, study learning tracks, submit bots, and register for hackathons.',
      icon: Users,
      color: 'var(--text-secondary)',
      badge: 'badge-slate'
    },
    {
      role: 'CORE_TEAM',
      title: 'Core Team Organizer',
      desc: 'Community operations: draft new workshop activities, upload event photos & video links, stage study materials, and review showcase submissions.',
      icon: ShieldCheck,
      color: 'var(--text-primary)',
      badge: 'badge-neutral'
    },
    {
      role: 'ADMIN',
      title: 'System Administrator (Ecosystem OS)',
      desc: 'Complete zero-code CMS ownership: publish/delete activities, edit hero and announcements, manage learning tracks, approve bots, and export JSON backups.',
      icon: Settings,
      color: '#FA4616',
      badge: 'badge-orange'
    }
  ];

  const activeNorm = normalizeRole(currentUser.role);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '560px',
        padding: '2rem',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-medium)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Role-Based Experience Switcher</h3>
            <p style={{ fontSize: '0.85rem' }}>Experience the platform from any of the 3 primary architectural tiers.</p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.35rem' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {roles.map((r) => {
            const Icon = r.icon;
            const isSelected = activeNorm === r.role;
            return (
              <div
                key={r.role}
                onClick={() => {
                  onSelectRole(r.role);
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'var(--uipath-orange-subtle)' : 'var(--bg-tertiary)',
                  border: isSelected ? '1px solid var(--uipath-orange)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  background: isSelected ? 'var(--uipath-orange)' : 'var(--bg-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isSelected ? '#FFFFFF' : r.color,
                  flexShrink: 0
                }}>
                  <Icon size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{r.title}</div>
                    {isSelected && (
                      <span className="badge badge-orange" style={{ fontSize: '0.7rem' }}>
                        <Check size={12} /> Active Tier
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
                    {r.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '1.75rem', textAlign: 'right' }}>
          <button onClick={onClose} className="btn btn-secondary btn-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
