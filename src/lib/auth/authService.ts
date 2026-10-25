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
    if (isSupabaseConfigured()) {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (!error && session?.user) {
          const authUser = session.user;
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .single();

          if (profile) {
            if (profile.status === 'INACTIVE') {
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

            const emailLower = (profile.email || authUser.email || '').toLowerCase().trim();
            let role: UserRole = 'STUDENT';
            if (emailLower === 'mail2tejaswy@gmail.com' || emailLower === 'admin@aceec.ac.in') {
              role = 'ADMIN';
            } else if (emailLower === 'techlead@aceec.ac.in') {
              role = 'CORE_TEAM';
            } else {
              role = normalizeRole(profile.role) as UserRole;
            }

            const isLeadAdmin = role === 'ADMIN' || emailLower.includes('tejaswy');
            const defaultName = emailLower === 'mail2tejaswy@gmail.com' ? 'K.Tejaswy' : (emailLower === 'admin@aceec.ac.in' ? 'System Administrator' : (emailLower === 'techlead@aceec.ac.in' ? 'Rohit Varma' : 'Community Member'));
            const userObj: User = {
              id: profile.id,
              name: profile.name || defaultName,
              email: profile.email || authUser.email || '',
              role,
              status: (profile.status as UserStatus) || 'ACTIVE',
              avatarUrl: profile.avatar_url || (isLeadAdmin ? '/tejaswy.png' : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'),
              branch: profile.branch || 'CSE',
              graduationYear: profile.graduation_year || 2026,
              createdAt: profile.created_at,
              updatedAt: profile.updated_at
            };
            localDatabase.setCurrentUserId(userObj.id);
            return userObj;
          }

          // Fallback inference if user row not yet synced to Supabase 'users' table
          const emailLower = (authUser.email || '').toLowerCase().trim();
          const localUsers = localDatabase.getUsers();
          const matchedLocal = localUsers.find((u) => u.email.toLowerCase() === emailLower);

          let inferredRole: UserRole = 'STUDENT';
          if (emailLower === 'mail2tejaswy@gmail.com' || emailLower === 'admin@aceec.ac.in') {
            inferredRole = 'ADMIN';
          } else if (emailLower === 'techlead@aceec.ac.in') {
            inferredRole = 'CORE_TEAM';
          } else if (matchedLocal) {
            inferredRole = normalizeRole(matchedLocal.role) as UserRole;
          }

          const isLeadAdmin = inferredRole === 'ADMIN' || emailLower.includes('tejaswy');
          const defaultName = emailLower === 'mail2tejaswy@gmail.com' ? 'K.Tejaswy' : (emailLower === 'admin@aceec.ac.in' ? 'System Administrator' : (emailLower === 'techlead@aceec.ac.in' ? 'Rohit Varma' : 'Authenticated User'));
          const fallbackUser: User = {
            id: authUser.id,
            name: authUser.user_metadata?.name || matchedLocal?.name || defaultName,
            email: authUser.email || '',
            role: inferredRole,
            status: 'ACTIVE',
            avatarUrl: matchedLocal?.avatarUrl || (isLeadAdmin ? '/tejaswy.png' : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'),
            branch: matchedLocal?.branch || 'CSE',
            graduationYear: matchedLocal?.graduationYear || 2026
          };
          localDatabase.setCurrentUserId(fallbackUser.id);
          return fallbackUser;
        }
      } catch (err) {
        console.warn('Auth session resolution warning:', err);
      }
    }

    // Local/session storage fallback for offline / unconfigured state
    const currentId = localDatabase.getCurrentUserId();
    const users = localDatabase.getUsers();
    const match = users.find((u) => u.id === currentId) || users[0] || null;
    if (match && match.status === 'INACTIVE') {
      return null;
    }
    return match;
  },

  signInWithPassword: async (email: string, password: string): Promise<{ user: User | null; error?: string }> => {
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!isSupabaseConfigured()) {
      // Local development authentication fallback
      const users = localDatabase.getUsers();
      const match = users.find((u) => u.email.toLowerCase() === cleanEmail.toLowerCase());
      
      const adminMatch = !match && (cleanEmail.toLowerCase() === 'admin@aceec.ac.in' || cleanEmail.toLowerCase() === 'mail2tejaswy@gmail.com')
        ? users.find((u) => normalizeRole(u.role) === 'ADMIN')
        : null;

      const targetUser = match || adminMatch;

      if (targetUser) {
        if (targetUser.status === 'INACTIVE') {
          localDatabase.addAuditLog({
            action: 'UNAUTHORIZED_ATTEMPT_BLOCKED',
            entityType: 'User',
            entityId: targetUser.id,
            description: `Blocked login attempt for deactivated user "${targetUser.email}".`,
            performedBy: targetUser.name
          });
          return { user: null, error: 'Your account is deactivated. Please contact an administrator.' };
        }

        const expectedPassword = localDatabase.getUserPassword(targetUser.email);
        if (import.meta.env.PROD && normalizeRole(targetUser.role) === 'ADMIN') {
          return { user: null, error: 'Administrator sign in requires live Supabase authentication in production.' };
        }
        if (cleanPassword !== expectedPassword) {
          return { user: null, error: 'Incorrect password. Please verify and try again.' };
        }

        localDatabase.setCurrentUserId(targetUser.id);
        return { user: targetUser };
      }
      return { user: null, error: 'User email not found in user registry.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword
      });

      if (error || !data.user) {
        return { user: null, error: error?.message || 'Authentication failed. Please verify credentials.' };
      }

      const userProfile = await authService.getCurrentUser();
      if (!userProfile) {
        return { user: null, error: 'Account is deactivated or profile record is invalid.' };
      }

      localDatabase.setCurrentUserId(userProfile.id);
      return { user: userProfile };
    } catch (err: any) {
      console.error('Supabase cloud authentication exception:', err);
      return { user: null, error: err?.message || 'Network authentication error.' };
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
    const cleanPassword = newPassword.trim();
    if (!isSupabaseConfigured()) {
      const currentId = localDatabase.getCurrentUserId();
      const users = localDatabase.getUsers();
      const match = users.find((u) => u.id === currentId);
      if (match) {
        localDatabase.setUserPassword(match.email, cleanPassword);
      }
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
      // 1. Primary: Use dedicated administrative RPC
      const { error: rpcError } = await supabase.rpc('admin_update_user_role', {
        target_user_id: userId,
        new_role: normRole
      });
      if (!rpcError) return { success: true };

      // 2. Fallback to direct update if RPC is not yet applied
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
      // 1. Primary: Use dedicated administrative RPC
      const { error: rpcError } = await supabase.rpc('admin_update_user_status', {
        target_user_id: userId,
        new_status: status
      });
      if (!rpcError) return { success: true };

      // 2. Fallback to direct update if RPC is not yet applied
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
