import { LeadershipMember, RosterCategory } from '../types';

export const ROSTER_CATEGORIES: RosterCategory[] = [
  'Faculty Advisor',
  'Current Core Lead',
  'Technical Lead',
  'Domain Lead',
  'Alumni Mentor',
  'Honorary Member'
];

export interface BadgeConfig {
  badgeClass: string;
  label: string;
  roleColor?: string;
  bg: string;
  text: string;
  border: string;
  customStyle?: React.CSSProperties;
}

/**
 * Centralized mapping from roster category and active state to visual badge styling.
 */
export function getRosterBadgeConfig(category?: string, isActive = true): BadgeConfig {
  const normCategory = (category || 'Current Core Lead').trim();

  // If explicitly inactive and a student/chapter lead, visually reflect alumni/former status
  if (!isActive && normCategory !== 'Faculty Advisor' && normCategory !== 'Honorary Member') {
    if (normCategory === 'Alumni Mentor' || normCategory === 'Alumni') {
      return {
        badgeClass: 'badge badge-slate',
        label: normCategory,
        roleColor: '#9CA3AF',
        bg: 'bg-neutral-800',
        text: 'text-neutral-400',
        border: 'border-neutral-700'
      };
    }
    return {
      badgeClass: 'badge badge-slate',
      label: `${normCategory} (Former)`,
      roleColor: '#9CA3AF',
      bg: 'bg-neutral-800',
      text: 'text-neutral-400',
      border: 'border-neutral-700'
    };
  }

  switch (normCategory) {
    case 'Faculty Advisor':
      return {
        badgeClass: 'badge badge-neutral',
        label: 'Faculty Advisor',
        roleColor: '#C084FC',
        bg: 'bg-purple-950/60',
        text: 'text-purple-300',
        border: 'border-purple-800/60',
        customStyle: {
          background: 'rgba(168, 85, 247, 0.12)',
          color: '#C084FC',
          border: '1px solid rgba(168, 85, 247, 0.28)'
        }
      };

    case 'Current Core Lead':
      return {
        badgeClass: 'badge badge-orange',
        label: 'Current Core Lead',
        roleColor: '#FA4616',
        bg: 'bg-orange-950/60',
        text: 'text-orange-400',
        border: 'border-orange-800/60'
      };

    case 'Technical Lead':
      return {
        badgeClass: 'badge badge-green',
        label: 'Technical Lead',
        roleColor: '#34D399',
        bg: 'bg-emerald-950/60',
        text: 'text-emerald-400',
        border: 'border-emerald-800/60'
      };

    case 'Domain Lead':
      return {
        badgeClass: 'badge badge-neutral',
        label: 'Domain Lead',
        roleColor: '#60A5FA',
        bg: 'bg-blue-950/60',
        text: 'text-blue-400',
        border: 'border-blue-800/60',
        customStyle: {
          background: 'rgba(59, 130, 246, 0.1)',
          color: '#60A5FA',
          border: '1px solid rgba(59, 130, 246, 0.25)'
        }
      };

    case 'Alumni Mentor':
    case 'Alumni':
      return {
        badgeClass: 'badge badge-slate',
        label: normCategory === 'Alumni' ? 'Alumni' : 'Alumni Mentor',
        roleColor: '#9CA3AF',
        bg: 'bg-neutral-800',
        text: 'text-neutral-400',
        border: 'border-neutral-700'
      };

    case 'Honorary Member':
      return {
        badgeClass: 'badge badge-neutral',
        label: 'Honorary Member',
        roleColor: '#FBBF24',
        bg: 'bg-amber-950/60',
        text: 'text-amber-400',
        border: 'border-amber-800/60',
        customStyle: {
          background: 'rgba(245, 158, 11, 0.12)',
          color: '#FBBF24',
          border: '1px solid rgba(245, 158, 11, 0.28)'
        }
      };

    case 'Community Lead':
      return {
        badgeClass: 'badge badge-orange',
        label: 'Community Lead',
        roleColor: '#FA4616',
        bg: 'bg-orange-950/60',
        text: 'text-orange-400',
        border: 'border-orange-800/60'
      };

    default:
      return {
        badgeClass: 'badge badge-neutral',
        label: normCategory,
        roleColor: 'var(--text-secondary)',
        bg: 'bg-neutral-800',
        text: 'text-neutral-300',
        border: 'border-neutral-700'
      };
  }
}

/**
 * Returns whether a member is currently serving / active.
 */
export function isMemberActive(member: Partial<LeadershipMember>): boolean {
  if (member.isActive !== undefined) {
    return Boolean(member.isActive);
  }
  if (member.category === 'Alumni' || member.category === 'Alumni Mentor') {
    return false;
  }
  if (member.academicYear?.includes('Present')) {
    return true;
  }
  return true;
}

/**
 * Formats a clean tenure string: e.g. "2024 - Present" or "2022 - 2024".
 */
export function getMemberTenure(member: Partial<LeadershipMember>): string {
  const active = isMemberActive(member);
  if (member.startYear) {
    if (active) {
      return `${member.startYear} - Present`;
    }
    return `${member.startYear} - ${member.endYear || 'Past'}`;
  }
  if (member.academicYear) {
    return member.academicYear;
  }
  return active ? `${new Date().getFullYear()} - Present` : 'Alumni';
}

/**
 * Returns initials from full name for avatar placeholder fallback.
 */
export function getMemberInitials(name?: string): string {
  if (!name || !name.trim()) return 'UI';
  // Strip academic titles like Dr., Prof., etc.
  const cleaned = name.replace(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s+/i, '').trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
