import { LeadershipMember, RosterCategory } from '../types';

export const ROSTER_CATEGORIES: RosterCategory[] = [
  'Student Developer Champion',
  'Core Team Member',
  'Trainer / Technical Lead',
  'Domain Lead',
  'Faculty Advisor',
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
 * Normalizes legacy or aliased category strings to official 7 roster roles.
 */
export function normalizeRosterCategory(category?: string): RosterCategory {
  const norm = (category || 'Core Team Member').trim();
  switch (norm) {
    case 'Student Developer Champion':
      return 'Student Developer Champion';
    case 'Core Team Member':
    case 'Current Core Lead':
    case 'Community Lead':
      return 'Core Team Member';
    case 'Trainer / Technical Lead':
    case 'Technical Lead':
      return 'Trainer / Technical Lead';
    case 'Domain Lead':
      return 'Domain Lead';
    case 'Faculty Advisor':
      return 'Faculty Advisor';
    case 'Alumni Mentor':
    case 'Alumni':
      return 'Alumni Mentor';
    case 'Honorary Member':
      return 'Honorary Member';
    default:
      return (ROSTER_CATEGORIES.includes(norm as RosterCategory) ? norm : 'Core Team Member') as RosterCategory;
  }
}

/**
 * Returns all active roster categories for a member, with fallback handling for legacy single-category records.
 */
export function getMemberCategories(member: Partial<LeadershipMember>): RosterCategory[] {
  if (Array.isArray(member.rosterCategories) && member.rosterCategories.length > 0) {
    const valid = member.rosterCategories
      .map((c) => normalizeRosterCategory(c))
      .filter(Boolean);
    if (valid.length > 0) {
      // De-duplicate while preserving order
      return Array.from(new Set(valid));
    }
  }
  if (member.category) {
    return [normalizeRosterCategory(member.category)];
  }
  return ['Core Team Member'];
}

/**
 * Centralized mapping from roster category and active state to visual badge styling.
 */
export function getRosterBadgeConfig(category?: string, isActive = true): BadgeConfig {
  const normCategory = normalizeRosterCategory(category);

  // If explicitly inactive and a student/chapter lead, visually reflect alumni/former status
  if (!isActive && normCategory !== 'Faculty Advisor' && normCategory !== 'Honorary Member') {
    if (normCategory === 'Alumni Mentor') {
      return {
        badgeClass: 'badge badge-slate',
        label: 'Alumni Mentor',
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
    case 'Student Developer Champion':
      return {
        badgeClass: 'badge badge-cyan',
        label: 'Student Developer Champion',
        roleColor: '#38BDF8',
        bg: 'bg-sky-950/60',
        text: 'text-sky-400',
        border: 'border-sky-800/60',
        customStyle: {
          background: 'rgba(56, 189, 248, 0.12)',
          color: '#38BDF8',
          border: '1px solid rgba(56, 189, 248, 0.28)'
        }
      };

    case 'Core Team Member':
      return {
        badgeClass: 'badge badge-orange',
        label: 'Core Team Member',
        roleColor: '#FA4616',
        bg: 'bg-orange-950/60',
        text: 'text-orange-400',
        border: 'border-orange-800/60'
      };

    case 'Trainer / Technical Lead':
      return {
        badgeClass: 'badge badge-green',
        label: 'Trainer / Technical Lead',
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

    case 'Alumni Mentor':
      return {
        badgeClass: 'badge badge-slate',
        label: 'Alumni Mentor',
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
  const categories = getMemberCategories(member);
  if (categories.length === 1 && categories[0] === 'Alumni Mentor') {
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
