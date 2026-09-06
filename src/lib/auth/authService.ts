import { supabase, isSupabaseConfigured } from '../supabase/client';
import { User, UserRole, UserStatus } from '../../types';
import { localDatabase } from '../../data/local/localDatabase';
import { normalizeRole } from '../security';

export interface AuthSession {
  user: User | null;
  isAuthenticated: boolean;
  isCloudAuth: boolean;
}

export const authService = {
  isConfigured: (): boolean => {
    return isSupabaseConfigured();
  },

  getCurrentUser: async (): Promise<User | null> => {
    if (!isSupabaseConfigured()) {
      // Local development mode user resolution
      const currentId = localDatabase.getCurrentUserId();
      const users = localDatabase.getUsers();
      const match = users.find((u) => u.id === currentId) || users[0] || null;
      if (match && match.status === 'INACTIVE') {
        return null;
      }
      return match;
    }

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session?.user) return null;

      const authUser = session.user;

      // Query database user profile
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profile) {
        if (profile.status === 'INACTIVE') {
          // Reject inactive user session
          await supabase.auth.signOut();
          localDatabase.addAuditLog({
            action: 'UNAUTHORIZED_ATTEMPT_BLOCKED',
            entityType: 'User',
            entityId: authUser.id,
            description: `Blocked inactive user session for "${authUser.email}".`,
            performedBy: 'System'
          });
          return null;
        }

        const role = normalizeRole(profile.role) as UserRole;
        return {
          id: profile.id,
          name: profile.name || authUser.email || 'Authenticated User',
          email: profile.email || authUser.email || '',
          role,
          status: (profile.status as UserStatus) || 'ACTIVE',
          avatarUrl: profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          branch: profile.branch || 'CSE',
          graduationYear: profile.graduation_year || 2026,
          createdAt: profile.created_at,
          updatedAt: profile.updated_at
        };
      }

      return {
        id: authUser.id,
        name: authUser.user_metadata?.name || authUser.email || 'Authenticated User',
        email: authUser.email || '',
        role: 'STUDENT',
        status: 'ACTIVE',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        branch: 'CSE',
        graduationYear: 2026
      };
    } catch (err) {
      console.warn('Auth session resolution warning:', err);
      return null;
    }
  },

  signInWithPassword: async (email: string, password: string): Promise<{ user: User | null; error?: string }> => {
    if (!isSupabaseConfigured()) {
      // Local development authentication fallback
      const users = localDatabase.getUsers();
      const match = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (match) {
        if (match.status === 'INACTIVE') {
          localDatabase.addAuditLog({
            action: 'UNAUTHORIZED_ATTEMPT_BLOCKED',
            entityType: 'User',
            entityId: match.id,
            description: `Blocked login attempt for deactivated user "${match.email}".`,
            performedBy: match.name
          });
          return { user: null, error: 'Your account is deactivated. Please contact an administrator.' };
        }
        localDatabase.setCurrentUserId(match.id);
        return { user: match };
      }
      return { user: null, error: 'User email not found in local user registry.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error || !data.user) {
        return { user: null, error: error?.message || 'Authentication failed. Please verify credentials.' };
      }

      const userProfile = await authService.getCurrentUser();
      if (!userProfile) {
        return { user: null, error: 'Account is deactivated or profile record is invalid.' };
      }

      return { user: userProfile };
    } catch (err: any) {
      return { user: null, error: err.message || 'Network authentication error.' };
    }
  },

  signOut: async (): Promise<void> => {
    localDatabase.setCurrentUserId('user_student_1');
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem('ace_uipath_authenticated_session');
    }
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase signout warning:', err);
      }
    }
  },

  resetPasswordForEmail: async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured()) {
      return { success: true }; // Local demo simulation
    }

    try {
      const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/#reset-password` : undefined;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to send password reset request.' };
    }
  },

  updatePassword: async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured()) {
      return { success: true };
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update password.' };
    }
  },

  updateUserRoleInCloud: async (userId: string, role: UserRole): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured()) return { success: true };
    try {
      const normRole = normalizeRole(role);
      const { error } = await supabase
        .from('users')
        .update({ role: normRole, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  updateUserStatusInCloud: async (userId: string, status: UserStatus): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured()) return { success: true };
    try {
      const { error } = await supabase
        .from('users')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
};
