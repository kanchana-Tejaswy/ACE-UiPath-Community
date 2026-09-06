import { UserRole, DraftStatus } from '../types';

export function normalizeRole(role?: string | null): 'STUDENT' | 'CORE_TEAM' | 'ADMIN' {
  if (!role) return 'STUDENT';
  const r = role.toString().trim().toUpperCase().replace(/\s+/g, '_');
  if (r === 'CORETEAM' || r === 'CORE_TEAM') return 'CORE_TEAM';
  if (r === 'ADMIN') return 'ADMIN';
  return 'STUDENT';
}

export const ROLE_HIERARCHY: Record<string, number> = {
  STUDENT: 1,
  Student: 1,
  CORE_TEAM: 2,
  CoreTeam: 2,
  ADMIN: 3,
  Admin: 3
};

export function hasPermission(userRole: UserRole | string, requiredRole: UserRole | string): boolean {
  const userNorm = normalizeRole(userRole);
  const reqNorm = normalizeRole(requiredRole);
  return (ROLE_HIERARCHY[userNorm] || 0) >= (ROLE_HIERARCHY[reqNorm] || 0);
}

// Valid Draft State Machine Transitions
const ALLOWED_TRANSITIONS: Record<DraftStatus, { allowed: DraftStatus[]; requiredRole: UserRole }[]> = {
  DRAFT: [
    { allowed: ['SUBMITTED'], requiredRole: 'CORE_TEAM' }
  ],
  SUBMITTED: [
    { allowed: ['IN_REVIEW', 'CHANGES_REQUESTED', 'APPROVED'], requiredRole: 'ADMIN' }
  ],
  IN_REVIEW: [
    { allowed: ['CHANGES_REQUESTED', 'APPROVED'], requiredRole: 'ADMIN' }
  ],
  CHANGES_REQUESTED: [
    { allowed: ['SUBMITTED'], requiredRole: 'CORE_TEAM' }
  ],
  APPROVED: [
    { allowed: ['PUBLISHED'], requiredRole: 'ADMIN' }
  ],
  PUBLISHED: []
};

export function isValidDraftStatusTransition(
  currentStatus: DraftStatus,
  targetStatus: DraftStatus,
  userRole: UserRole,
  isOwner: boolean = true
): { valid: boolean; reason?: string } {
  if (currentStatus === targetStatus) {
    return { valid: true };
  }

  const normRole = normalizeRole(userRole);

  // Self-approval check: CoreTeam cannot approve or publish drafts
  if (normRole === 'CORE_TEAM' && (targetStatus === 'APPROVED' || targetStatus === 'PUBLISHED')) {
    return { 
      valid: false, 
      reason: 'Core Team members cannot self-approve or publish drafts. Admin review is required.' 
    };
  }

  const rules = ALLOWED_TRANSITIONS[currentStatus] || [];
  for (const rule of rules) {
    if (rule.allowed.includes(targetStatus)) {
      if (hasPermission(normRole, rule.requiredRole)) {
        return { valid: true };
      } else {
        return {
          valid: false,
          reason: `Transitioning draft from ${currentStatus} to ${targetStatus} requires ${rule.requiredRole} role privileges.`
        };
      }
    }
  }

  return {
    valid: false,
    reason: `Invalid draft status transition from "${currentStatus}" to "${targetStatus}".`
  };
}

