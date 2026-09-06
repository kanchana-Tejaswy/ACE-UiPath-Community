import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  GraduationCap,
  MessageSquare
} from 'lucide-react';
import { SiteSettings } from '../types';

interface Props {
  settings: SiteSettings;
  onNavigate: (view: string) => void;
}

export const JoinPage: React.FC<Props> = ({ settings, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'member' | 'core' | 'mentor'>('member');
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Form fields
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [email, setEmail] = useState('');
  const [branch, setBranch] = useState('CSE');
  const [year, setYear] = useState('2nd Year');
  const [experience, setExperience] = useState('Beginner (Just starting with StudioX/Studio)');
  const [statement, setStatement] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setRollNumber('');
      setEmail('');
      setStatement('');
    }, 5000);
  };

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
      <div style={{ maxWidth: '780px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="badge badge-orange" style={{ marginBottom: '0.5rem' }}>
            Get Involved
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, marginBottom: '0.75rem' }}>
            Join the ACE UiPath Movement
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Connect with 850+ automation peers at ACE Engineering College. Choose how you want to contribute to our long-term digital ecosystem.
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-secondary)',
          padding: '0.35rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '2.5rem'
        }}>
          {[
            { id: 'member', label: 'Student Member', icon: Users },
            { id: 'core', label: 'Core Team Application', icon: ShieldCheck },
            { id: 'mentor', label: 'Peer Mentor / Speaker', icon: Sparkles }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  background: isSelected ? 'var(--uipath-orange)' : 'transparent',
                  color: isSelected ? '#FFF' : 'var(--text-secondary)',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Container */}
        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto'
              }}>
                <CheckCircle2 size={36} />
              </div>
              <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>Application Submitted!</h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
                Thank you for applying. The ACE UiPath Core Team will review your profile and reach out via your student email & WhatsApp.
              </p>
              <button onClick={() => onNavigate('activities')} className="btn btn-secondary btn-sm">
                Explore Upcoming Activities
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>FULL NAME *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Reddy"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>COLLEGE ROLL NUMBER *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 23ACE05A42"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>STUDENT EMAIL *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. ananya@aceec.ac.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>BRANCH & YEAR</label>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      style={{ flex: 1, padding: '0.75rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF' }}
                    >
                      <option value="CSE">CSE</option>
                      <option value="IT">IT</option>
                      <option value="Data Science">Data Science / AI</option>
                      <option value="ECE">ECE</option>
                      <option value="EEE">EEE</option>
                      <option value="Mechanical">Mechanical</option>
                      <option value="Civil">Civil</option>
                    </select>

                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      style={{ flex: 1, padding: '0.75rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF' }}
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>CURRENT UIPATH / RPA PROFICIENCY</label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem' }}
                >
                  <option value="Beginner">Beginner (Zero experience, eager to learn)</option>
                  <option value="StudioX">Citizen Developer (Familiar with StudioX / Excel automation)</option>
                  <option value="Studio">Associate Level (Built workflows in UiPath Studio with Selectors)</option>
                  <option value="Advanced">Advanced (Experienced in REFramework, Document Understanding, Orchestrator)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  {activeTab === 'core'
                    ? 'WHY DO YOU WANT TO JOIN THE CORE TEAM & WHAT SKILLS CAN YOU CONTRIBUTE?'
                    : activeTab === 'mentor'
                    ? 'TOPICS YOU WOULD LIKE TO TEACH OR BOT WORKSHOPS YOU PROPOSE'
                    : 'WHAT AUTOMATION PROJECT OR SKILL DO YOU WANT TO LEARN MOST?'}
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share your motivation and goals..."
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFF', marginTop: '0.25rem', resize: 'vertical' }}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '0.75rem' }}>
                <Send size={18} /> Submit Application
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
