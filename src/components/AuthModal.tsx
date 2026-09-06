import React, { useState, useEffect } from 'react';
import { ShieldCheck, Mail, Lock, LogIn, X, AlertCircle, CheckCircle2, KeyRound, ArrowLeft } from 'lucide-react';
import { useAuth } from '../lib/auth/AuthContext';
import { UserRole } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'LOGIN' | 'FORGOT_PASSWORD' | 'RESET_PASSWORD';
  targetRole?: 'CORE_TEAM' | 'ADMIN';
  onAuthSuccess?: (role: UserRole) => void;
}

export const AuthModal: React.FC<Props> = ({ 
  isOpen, 
  onClose, 
  initialView = 'LOGIN',
  targetRole,
  onAuthSuccess
}) => {
  const { login, isCloudAuth, switchDemoRole, requestPasswordReset, updatePassword } = useAuth();
  const [viewMode, setViewMode] = useState<'LOGIN' | 'FORGOT_PASSWORD' | 'RESET_PASSWORD'>(initialView);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Development-only check: Strictly restricted to non-production local development
  const isDevEnvironment = Boolean(import.meta.env.DEV) && !isCloudAuth;

  useEffect(() => {
    setViewMode(initialView);
    if (isOpen) {
      if (isDevEnvironment) {
        if (targetRole === 'CORE_TEAM') {
          setEmail('techlead@aceec.ac.in');
          setPassword('demo1234');
        } else if (targetRole === 'ADMIN') {
          setEmail('admin@aceec.ac.in');
          setPassword('demo1234');
        } else {
          setEmail('');
          setPassword('');
        }
      } else {
        // In production or cloud auth, inputs are strictly blank for real credentials
        setEmail('');
        setPassword('');
      }
    }
  }, [initialView, isOpen, targetRole, isDevEnvironment]);

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

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const res = await login(email, password);
    setIsSubmitting(false);
    if (res.success) {
      if (onAuthSuccess && targetRole) {
        onAuthSuccess(targetRole);
      }
      onClose();
    } else {
      setErrorMessage(res.error || 'Invalid credentials or deactivated account.');
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const res = await requestPasswordReset(email);
    setIsSubmitting(false);
    if (res.success) {
      setSuccessMessage('Password recovery link dispatched. Please check your inbox.');
    } else {
      setErrorMessage(res.error || 'Failed to request password reset link.');
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const res = await updatePassword(newPassword);
    setIsSubmitting(false);
    if (res.success) {
      setSuccessMessage('Your password has been successfully reset! You may now sign in.');
      setTimeout(() => {
        setViewMode('LOGIN');
        setSuccessMessage(null);
      }, 2000);
    } else {
      setErrorMessage(res.error || 'Failed to update password. Recovery token may be expired.');
    }
  };

  const handleQuickDemoSelect = (role: UserRole, demoEmail: string) => {
    if (isCloudAuth) {
      switchDemoRole(role);
    } else {
      setEmail(demoEmail);
      setPassword('demo1234');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 120,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '450px',
        padding: '2.5rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-glow)',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            right: '1.25rem',
            top: '1.25rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '0.25rem'
          }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '54px', height: '54px', background: 'rgba(250, 70, 22, 0.15)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--uipath-orange)' }}>
            {viewMode === 'LOGIN' ? (
              <ShieldCheck size={28} style={{ color: 'var(--uipath-orange)' }} />
            ) : (
              <KeyRound size={28} style={{ color: 'var(--uipath-orange)' }} />
            )}
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFF' }}>
            {viewMode === 'LOGIN' && (
              targetRole === 'ADMIN'
                ? 'Administrator Authentication'
                : targetRole === 'CORE_TEAM'
                ? 'Core Member Authentication'
                : 'Community Sign In'
            )}
            {viewMode === 'FORGOT_PASSWORD' && 'Recover Password'}
            {viewMode === 'RESET_PASSWORD' && 'Set New Password'}
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
            {targetRole === 'ADMIN'
              ? 'Authorized governance access for ACE UiPath Community administrators'
              : targetRole === 'CORE_TEAM'
              ? 'Operational staging & workflow access for Core Team leads'
              : 'ACE UiPath Community Digital Operating System'}
          </p>
        </div>

        {/* Alert Messages */}
        {errorMessage && (
          <div style={{
            padding: '0.85rem',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #EF4444',
            borderRadius: 'var(--radius-sm)',
            color: '#FCA5A5',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} /> {errorMessage}
          </div>
        )}

        {successMessage && (
          <div style={{
            padding: '0.85rem',
            background: 'rgba(34, 197, 94, 0.15)',
            border: '1px solid #22C55E',
            borderRadius: 'var(--radius-sm)',
            color: '#86EFAC',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} /> {successMessage}
          </div>
        )}

        {/* VIEW MODE 1: LOGIN FORM */}
        {viewMode === 'LOGIN' && (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Email Address
              </label>
              <div style={{ position: 'relative', marginTop: '0.35rem' }}>
                <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  required
                  placeholder="user@aceuipath.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    color: '#FFF',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => { setViewMode('FORGOT_PASSWORD'); setErrorMessage(null); setSuccessMessage(null); }}
                  style={{ background: 'none', border: 'none', color: 'var(--uipath-orange)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: 'relative', marginTop: '0.35rem' }}>
                <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    color: '#FFF',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem', gap: '0.4rem', justifyContent: 'center' }}
            >
              {isSubmitting ? (
                'Authenticating...'
              ) : (
                <>
                  <LogIn size={16} /> {targetRole === 'ADMIN' ? 'Sign In as Administrator' : targetRole === 'CORE_TEAM' ? 'Sign In as Core Member' : 'Sign In to Community'}
                </>
              )}
            </button>
          </form>
        )}

        {/* VIEW MODE 2: FORGOT PASSWORD */}
        {viewMode === 'FORGOT_PASSWORD' && (
          <form onSubmit={handleForgotPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Account Email Address
              </label>
              <div style={{ position: 'relative', marginTop: '0.35rem' }}>
                <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  required
                  placeholder="registered@aceuipath.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    color: '#FFF',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem', gap: '0.4rem', justifyContent: 'center' }}
            >
              {isSubmitting ? 'Sending Request...' : 'Send Password Recovery Email'}
            </button>

            <button
              type="button"
              onClick={() => { setViewMode('LOGIN'); setErrorMessage(null); setSuccessMessage(null); }}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'center', marginTop: '0.5rem' }}
            >
              <ArrowLeft size={14} /> Back to Sign In
            </button>
          </form>
        )}

        {/* VIEW MODE 3: RESET PASSWORD */}
        {viewMode === 'RESET_PASSWORD' && (
          <form onSubmit={handleResetPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                New Password
              </label>
              <div style={{ position: 'relative', marginTop: '0.35rem' }}>
                <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    color: '#FFF',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Confirm New Password
              </label>
              <div style={{ position: 'relative', marginTop: '0.35rem' }}>
                <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  required
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    color: '#FFF',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem', gap: '0.4rem', justifyContent: 'center' }}
            >
              {isSubmitting ? 'Updating Password...' : 'Save New Password'}
            </button>
          </form>
        )}

        {/* Development-Only Account Helper: NEVER rendered in production builds */}
        {isDevEnvironment && (
          <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'center', marginBottom: '0.75rem' }}>
              DEVELOPMENT ENVIRONMENT HELPER
            </div>
            {targetRole === 'ADMIN' ? (
              <button
                type="button"
                onClick={() => handleQuickDemoSelect('Admin', 'admin@aceec.ac.in')}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', fontSize: '0.8rem', padding: '0.5rem', justifyContent: 'center' }}
              >
                Use Local Administrator Credentials
              </button>
            ) : targetRole === 'CORE_TEAM' ? (
              <button
                type="button"
                onClick={() => handleQuickDemoSelect('CoreTeam', 'techlead@aceec.ac.in')}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', fontSize: '0.8rem', padding: '0.5rem', justifyContent: 'center' }}
              >
                Use Local Core Member Credentials
              </button>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => handleQuickDemoSelect('CoreTeam', 'techlead@aceec.ac.in')}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', padding: '0.4rem 0.25rem' }}
                >
                  Core Member
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoSelect('Admin', 'admin@aceec.ac.in')}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', padding: '0.4rem 0.25rem' }}
                >
                  Administrator
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
