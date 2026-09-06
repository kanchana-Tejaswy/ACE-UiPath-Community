import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../../types';
import { authService } from './authService';
import { localDatabase } from '../../data/local/localDatabase';
import { supabase, isSupabaseConfigured } from '../supabase/client';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  isCloudAuth: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
  switchDemoRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isCloudAuth = authService.isConfigured();

  const refreshUser = async () => {
    const user = await authService.getCurrentUser();
    setCurrentUser(user);
  };

  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      setIsLoading(true);
      const user = await authService.getCurrentUser();
      if (isMounted) {
        setCurrentUser(user);
        setIsLoading(false);
      }
    }

    initAuth();

    // Set up Supabase auth listener if cloud auth is configured
    if (isSupabaseConfigured()) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!isMounted) return;

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          const user = await authService.getCurrentUser();
          setCurrentUser(user);
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
        } else if (event === 'PASSWORD_RECOVERY') {
          if (typeof window !== 'undefined') {
            window.location.hash = '#reset-password';
          }
        }
      });

      return () => {
        isMounted = false;
        subscription.unsubscribe();
      };
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const result = await authService.signInWithPassword(email, password);
    setIsLoading(false);
    if (result.user) {
      setCurrentUser(result.user);
      localDatabase.addAuditLog({
        action: 'LOGIN_SUCCESS',
        entityType: 'User',
        entityId: result.user.id,
        description: `User "${result.user.name}" (${result.user.role}) logged in successfully via ${isCloudAuth ? 'Supabase Cloud Auth' : 'Local Staging'}.`,
        performedBy: result.user.name
      });
      return { success: true };
    }
    localDatabase.addAuditLog({
      action: 'LOGIN_FAILURE',
      entityType: 'User',
      entityId: email,
      description: `Failed login attempt for email "${email}". Error: ${result.error}`,
      performedBy: 'Guest'
    });
    return { success: false, error: result.error };
  };

  const logout = async (): Promise<void> => {
    const prevName = currentUser?.name || 'User';
    const prevId = currentUser?.id || 'guest';
    await authService.signOut();
    setCurrentUser(null);
    localDatabase.addAuditLog({
      action: 'LOGOUT',
      entityType: 'User',
      entityId: prevId,
      description: `User "${prevName}" logged out.`,
      performedBy: prevName
    });
  };

  const requestPasswordReset = async (email: string): Promise<{ success: boolean; error?: string }> => {
    const res = await authService.resetPasswordForEmail(email);
    if (res.success) {
      localDatabase.addAuditLog({
        action: 'PASSWORD_RESET_REQUESTED',
        entityType: 'User',
        entityId: email,
        description: `Password reset link requested for "${email}".`,
        performedBy: 'Guest'
      });
    }
    return res;
  };

  const updatePassword = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    const res = await authService.updatePassword(newPassword);
    if (res.success && currentUser) {
      localDatabase.addAuditLog({
        action: 'PASSWORD_UPDATED',
        entityType: 'User',
        entityId: currentUser.id,
        description: `Password updated successfully for "${currentUser.email}".`,
        performedBy: currentUser.name
      });
    }
    return res;
  };

  const switchDemoRole = (role: UserRole) => {
    if (isCloudAuth) {
      alert('Role switching is disabled in Supabase Cloud Auth mode. User roles are database-enforced on the server.');
      return;
    }

    const users = localDatabase.getUsers();
    const roleMatch = users.find((u) => u.role === role || u.role.toLowerCase() === role.toLowerCase());
    if (roleMatch) {
      localDatabase.setCurrentUserId(roleMatch.id);
      setCurrentUser(roleMatch);
      window.dispatchEvent(new Event('ace_uipath_db_update'));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        isCloudAuth,
        login,
        logout,
        requestPasswordReset,
        updatePassword,
        refreshUser,
        switchDemoRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
