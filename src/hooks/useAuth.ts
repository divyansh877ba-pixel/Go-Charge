import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { fetchProfile, upsertProfile, getUserPermissions, createHostOrganization } from '../lib/supabaseService';

export type UserRole = 'consumer' | 'charger_owner';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  // Specific to Charger Owners
  ownerType?: 'individual' | 'business';
  businessName?: string;
  city?: string;
  ownsCharger?: boolean;
  isNewOwner?: boolean;
  createdAt: string;
}

/**
 * Normalizes Supabase Auth error messages with special handling for rate limits.
 */
export function formatAuthErrorMessage(error: any): string {
  if (!error) return 'An unexpected error occurred. Please try again.';
  const msg = typeof error === 'string' ? error : error.message || '';
  const lower = msg.toLowerCase();

  if (
    lower.includes('rate limit') ||
    lower.includes('over_email_send_rate_limit') ||
    error.status === 429
  ) {
    return 'Email rate limit reached: Supabase limits email dispatch frequency for anti-spam protection. Please wait a few minutes before requesting another confirmation email, or check your spam/junk folder.';
  }

  if (lower.includes('user already registered')) {
    return 'This email address is already registered. If you have not verified your email yet, please use the resend confirmation option, or sign in.';
  }

  return msg;
}

export function useAuth() {
  // Supabase session is the single source of truth; initialize as null
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Synchronize authenticated user with Supabase profiles and permissions
  const syncSupabaseProfile = useCallback(async (sessionUser: any): Promise<AuthUser> => {
    const meta = sessionUser.user_metadata || {};
    const existingProfile = await fetchProfile(sessionUser.id);

    const fullName = existingProfile?.full_name || meta.full_name || meta.name || sessionUser.email?.split('@')[0] || 'EV Driver';
    const avatarUrl = existingProfile?.avatar_url || meta.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80';
    const state = existingProfile?.state || meta.city || 'Delhi';

    // Verify application permissions and organization membership directly from database
    const perms = await getUserPermissions(sessionUser.id);
    const role: UserRole = perms.role;

    // If profile didn't exist in Supabase profiles table, safely create it now
    if (!existingProfile) {
      await upsertProfile({
        id: sessionUser.id,
        email: sessionUser.email,
        full_name: fullName,
        avatar_url: avatarUrl,
        state,
      });
    }

    const authUser: AuthUser = {
      id: sessionUser.id,
      name: fullName,
      email: sessionUser.email || '',
      phone: sessionUser.phone || meta.phone || '+91 98765 43210',
      role,
      ownerType: meta.owner_type || meta.ownerType || 'individual',
      businessName: perms.organizationName || meta.business_name || meta.businessName,
      city: state,
      ownsCharger: perms.isHost || meta.ownsCharger,
      isNewOwner: perms.isHost && !perms.hasStations,
      avatarUrl,
      createdAt: sessionUser.created_at || new Date().toISOString(),
    };

    return authUser;
  }, []);

  // Listen to Supabase Auth State Changes & Init Session
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        const { data: { session }, error: sessionErr } = await supabase.auth.getSession();
        if (sessionErr) {
          console.warn('Supabase getSession error:', sessionErr.message);
        }

        if (session?.user && isMounted) {
          // Cryptographically verify the session with the Supabase Auth server
          const { data: { user: verifiedUser }, error: userErr } = await supabase.auth.getUser();
          if (verifiedUser && !userErr && isMounted) {
            const authUser = await syncSupabaseProfile(verifiedUser);
            if (isMounted) {
              setUser(authUser);
            }
          } else if (isMounted) {
            setUser(null);
          }
        } else if (isMounted) {
          setUser(null);
        }
      } catch (err) {
        console.warn('Supabase auth initialization error:', err);
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initAuth();

    // Subscribe to auth state updates
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') && session?.user) {
        const authUser = await syncSupabaseProfile(session.user);
        if (isMounted) {
          setUser(authUser);
          setLoading(false);
        }
      } else if (event === 'SIGNED_OUT') {
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [syncSupabaseProfile]);

  // Real Supabase Login with Email & Password
  const login = useCallback(async (
    emailInput: string,
    passwordInput: string
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);

    const cleanEmail = emailInput.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setLoading(false);
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!passwordInput || passwordInput.length < 6) {
      setLoading(false);
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: passwordInput,
      });

      if (error) {
        setLoading(false);
        // Generic, privacy-preserving error message as specified by security requirements
        return {
          success: false,
          error: "Unable to sign in. Your email or password may be incorrect. If you don't have an account, please create one.",
        };
      }

      if (data.user) {
        const authUser = await syncSupabaseProfile(data.user);
        setUser(authUser);
      }

      setLoading(false);
      return { success: true };
    } catch {
      setLoading(false);
      return {
        success: false,
        error: "Unable to sign in. Your email or password may be incorrect. If you don't have an account, please create one.",
      };
    }
  }, [syncSupabaseProfile]);

  // Real Supabase Registration with Email & Password
  const register = useCallback(async (params: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role?: UserRole;
    ownerType?: 'individual' | 'business';
    businessName?: string;
    city?: string;
  }): Promise<{ success: boolean; emailConfirmationRequired?: boolean; error?: string; message?: string }> => {
    setLoading(true);

    const cleanEmail = params.email.trim().toLowerCase();
    const cleanName = params.fullName.trim();

    if (!cleanName || cleanName.length < 2) {
      setLoading(false);
      return { success: false, error: 'Please enter your full name.' };
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setLoading(false);
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!params.password || params.password.length < 6) {
      setLoading(false);
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }
    if (params.password !== params.confirmPassword) {
      setLoading(false);
      return { success: false, error: 'Passwords do not match. Please verify your password.' };
    }
    if (params.role === 'charger_owner' && params.ownerType === 'business' && !params.businessName?.trim()) {
      setLoading(false);
      return { success: false, error: 'Please enter your business or commercial entity name.' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: params.password,
        options: {
          data: {
            full_name: cleanName,
            name: cleanName,
            role: params.role || 'consumer',
            owner_type: params.ownerType || 'individual',
            business_name: params.businessName?.trim() || undefined,
            city: params.city?.trim() || 'New Delhi',
          },
        },
      });

      if (error) {
        setLoading(false);
        return { success: false, error: formatAuthErrorMessage(error) };
      }

      if (data.user) {
        // If email confirmation is required, session will be null
        if (!data.session) {
          setLoading(false);
          return {
            success: true,
            emailConfirmationRequired: true,
            message: `Account created successfully! A confirmation link has been sent to ${cleanEmail}. Please check your inbox and verify your email address before signing in.`,
          };
        }

        // Active session established: provision profile and organization
        await upsertProfile({
          id: data.user.id,
          email: cleanEmail,
          full_name: cleanName,
          state: params.city?.trim() || 'New Delhi',
          avatar_url: params.role === 'charger_owner'
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80'
            : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
        });

        if (params.role === 'charger_owner' && params.businessName?.trim()) {
          await createHostOrganization(params.businessName.trim());
        }

        const authUser = await syncSupabaseProfile(data.user);
        setUser(authUser);
        setLoading(false);
        return { success: true, emailConfirmationRequired: false };
      }

      setLoading(false);
      return { success: false, error: 'Registration failed. Please try again.' };
    } catch (err: any) {
      setLoading(false);
      return { success: false, error: formatAuthErrorMessage(err) };
    }
  }, [syncSupabaseProfile]);

  // Resend Email Verification with Rate Limit Handling & Cooldown Safety
  const resendVerificationEmail = useCallback(async (emailInput: string): Promise<{ success: boolean; error?: string; isRateLimited?: boolean }> => {
    setLoading(true);
    const cleanEmail = emailInput.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setLoading(false);
      return { success: false, error: 'Please enter a valid email address.' };
    }

    try {
      const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined;
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: cleanEmail,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      setLoading(false);
      if (error) {
        const isRateLimited = error.message?.toLowerCase().includes('rate limit') || 
                              error.message?.toLowerCase().includes('over_email_send_rate_limit') ||
                              (error as any).status === 429;
        return {
          success: false,
          error: formatAuthErrorMessage(error),
          isRateLimited,
        };
      }

      return { success: true };
    } catch (err: any) {
      setLoading(false);
      return {
        success: false,
        error: formatAuthErrorMessage(err),
        isRateLimited: true,
      };
    }
  }, []);

  // Real Supabase Logout
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Supabase signOut error:', err);
    } finally {
      setUser(null);
      setLoading(false);
    }
  }, []);

  // Real Supabase Password Reset Request
  const resetPassword = useCallback(async (emailInput: string): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    try {
      const cleanEmail = emailInput.trim().toLowerCase();
      const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined;
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: redirectUrl,
      });
      setLoading(false);
      if (error) {
        return { success: false, message: formatAuthErrorMessage(error) };
      }
      return {
        success: true,
        message: `If an account is associated with ${cleanEmail}, password reset instructions have been sent to that inbox.`,
      };
    } catch (err: any) {
      setLoading(false);
      return { success: false, message: formatAuthErrorMessage(err) };
    }
  }, []);

  return {
    user,
    setUser,
    isAuthenticated: Boolean(user),
    isConsumer: user?.role === 'consumer',
    isOwner: user?.role === 'charger_owner',
    loading,
    login,
    register,
    resendVerificationEmail,
    logout,
    resetPassword,
  };
}
