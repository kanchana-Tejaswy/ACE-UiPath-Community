import React, { useEffect } from 'react';
import { ShieldCheck, Settings, X, ArrowRight, LogOut, UserCheck } from 'lucide-react';
import { User } from '../types';
import { normalizeRole } from '../lib/security';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSelectCoreMember: () => void;
  onSelectAdministrator: () => void;
  onSignOutToPublic: () => void;
  onNavigate: (view: string) => void;
}

export const CommunityAccessModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectCoreMember,
  onSelectAdministrator,
  onSignOutToPublic,
  onNavigate
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentRole = normalizeRole(currentUser.role);
  const isAuthenticatedInternal = currentRole === 'ADMIN' || currentRole === 'CORE_TEAM';

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 110,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '380px',
          background: '#111111',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          position: 'relative',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Close panel"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
          <h2 style={{ 
            fontSize: '1.15rem', 
            fontWeight: 800, 
            color: '#FFFFFF', 
            letterSpacing: '0.04em', 
            textTransform: 'uppercase',
            margin: '0 0 0.35rem 0'
          }}>
            COMMUNITY ACCESS
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
            Authorized community workspace
          </p>
        </div>

        {/* Body based on session status */}
        {isAuthenticatedInternal ? (
          /* Active Session View */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                background: 'rgba(250, 70, 22, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--uipath-orange)'
              }}>
                <UserCheck size={16} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Active Session ({currentRole === 'ADMIN' ? 'Administrator' : 'Core Member'})
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#FFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentUser.name}
                </div>
              </div>
            </div>

            {/* Direct Workspace Action */}
            {currentRole === 'ADMIN' ? (
              <button
                onClick={() => {
                  onNavigate('admin');
                  onClose();
                }}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'space-between', padding: '0.75rem 1rem' }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Settings size={15} /> Open Admin CMS Dashboard
                </span>
                <ArrowRight size={15} />
              </button>
            ) : (
              <button
                onClick={() => {
                  onNavigate('core');
                  onClose();
                }}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'space-between', padding: '0.75rem 1rem' }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={15} /> Open Core Team Workspace
                </span>
                <ArrowRight size={15} />
              </button>
            )}

            {/* Return to Public Student View / Sign Out */}
            <button
              onClick={() => {
                onSignOutToPublic();
                onClose();
              }}
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'flex-start', gap: '0.5rem', color: '#FCA5A5', padding: '0.7rem 1rem' }}
            >
              <LogOut size={15} /> Return to Public Student View
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                cursor: 'pointer',
                padding: '0.5rem',
                textAlign: 'center'
              }}
            >
              Close
            </button>
          </div>
        ) : (
          /* Public Student View — Gateway Selector */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {/* Option 1: Core Member */}
            <button
              onClick={() => {
                onClose();
                onSelectCoreMember();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.9rem 1.15rem',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: '#FFFFFF',
                fontSize: '0.925rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(250, 70, 22, 0.4)';
                e.currentTarget.style.background = '#181818';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.background = 'var(--bg-tertiary)';
              }}
            >
              <span>Core Member</span>
              <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
            </button>

            {/* Option 2: Administrator */}
            <button
              onClick={() => {
                onClose();
                onSelectAdministrator();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.9rem 1.15rem',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: '#FFFFFF',
                fontSize: '0.925rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(250, 70, 22, 0.4)';
                e.currentTarget.style.background = '#181818';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.background = 'var(--bg-tertiary)';
              }}
            >
              <span>Administrator</span>
              <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
            </button>

            {/* Option 3: Close */}
            <button
              onClick={onClose}
              style={{
                padding: '0.65rem 1rem',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: 'pointer',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
                transition: 'color var(--transition-fast)',
                marginTop: '0.25rem'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
