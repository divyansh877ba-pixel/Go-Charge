import { useState, useEffect, useCallback } from 'react';

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

const STORAGE_KEY = 'amperway_auth_user';

export const DEMO_CONSUMER_USER: AuthUser = {
  id: 'usr-consumer-101',
  name: 'Rahul Sharma',
  email: 'rahul.sharma@gocharge.in',
  phone: '+91 98765 43210',
  role: 'consumer',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
  city: 'New Delhi',
  createdAt: '2024-02-15'
};

export const DEMO_OWNER_USER: AuthUser = {
  id: 'usr-owner-202',
  name: 'Vikramaditya Singhania',
  email: 'vikram.singhania@gocharge.in',
  phone: '+91 98201 44520',
  role: 'charger_owner',
  ownerType: 'business',
  businessName: 'Singhania EV Hubs',
  city: 'New Delhi, Delhi NCR',
  ownsCharger: true,
  isNewOwner: false,
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
  createdAt: '2024-01-10'
};

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      // Also check legacy storage for seamless migration
      const legacy = localStorage.getItem('amperway_user');
      if (legacy) {
        const parsed = JSON.parse(legacy);
        return {
          id: 'usr-migrated-1',
          name: parsed.name || 'EV Driver',
          email: parsed.email || 'driver@gocharge.in',
          phone: parsed.phone || '+91 98765 43210',
          role: parsed.role === 'host' ? 'charger_owner' : 'consumer',
          createdAt: new Date().toISOString()
        };
      }
      return null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        // Keep legacy key in sync for any backward compatibility
        localStorage.setItem('amperway_user', JSON.stringify({
          name: user.name,
          phone: user.phone,
          email: user.email,
          role: user.role === 'charger_owner' ? 'host' : 'driver'
        }));
      } else {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem('amperway_user');
      }
    } catch (e) {
      console.warn('Failed to sync user to localStorage:', e);
    }
  }, [user]);

  // Sync from other components/storage updates
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        if (e.newValue) {
          try {
            setUser(JSON.parse(e.newValue));
          } catch {}
        } else {
          setUser(null);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = useCallback(async (
    emailOrPhone: string,
    password: string,
    role: UserRole
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    // Simulate network latency (400ms)
    await new Promise((resolve) => setTimeout(resolve, 400));
    setLoading(false);

    if (!emailOrPhone.trim()) {
      return { success: false, error: 'Please enter your email or phone number.' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    // Role-tailored mock authentication
    let authenticatedUser: AuthUser;
    if (role === 'charger_owner') {
      authenticatedUser = {
        ...DEMO_OWNER_USER,
        email: emailOrPhone.includes('@') ? emailOrPhone : DEMO_OWNER_USER.email,
        phone: !emailOrPhone.includes('@') ? emailOrPhone : DEMO_OWNER_USER.phone,
      };
    } else {
      authenticatedUser = {
        ...DEMO_CONSUMER_USER,
        email: emailOrPhone.includes('@') ? emailOrPhone : DEMO_CONSUMER_USER.email,
        phone: !emailOrPhone.includes('@') ? emailOrPhone : DEMO_CONSUMER_USER.phone,
      };
    }

    setUser(authenticatedUser);
    return { success: true };
  }, []);

  const register = useCallback(async (
    data: Partial<AuthUser> & { password?: string; ownsCharger?: boolean }
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(false);

    if (!data.name?.trim()) {
      return { success: false, error: 'Please enter your full name.' };
    }
    if (!data.email?.trim() || !data.email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!data.phone?.trim() || data.phone.replace(/\D/g, '').length < 10) {
      return { success: false, error: 'Please enter a valid 10-digit mobile number.' };
    }

    const newUser: AuthUser = {
      id: `usr-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim().startsWith('+91') ? data.phone.trim() : `+91 ${data.phone.trim().replace(/^0+/, '')}`,
      role: data.role || 'consumer',
      ownerType: data.ownerType || 'individual',
      businessName: data.businessName,
      city: data.city || 'New Delhi',
      ownsCharger: data.ownsCharger ?? (data.role === 'charger_owner' ? false : undefined),
      isNewOwner: data.role === 'charger_owner',
      avatarUrl: data.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
      createdAt: new Date().toISOString()
    };

    setUser(newUser);
    return { success: true };
  }, []);

  const loginWithGoogle = useCallback(async (role: UserRole): Promise<{ success: boolean }> => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setLoading(false);

    const googleUser: AuthUser = role === 'charger_owner'
      ? {
          ...DEMO_OWNER_USER,
          email: 'vikram.google@gocharge.in',
          name: 'Vikramaditya Singhania (Google)',
        }
      : {
          ...DEMO_CONSUMER_USER,
          email: 'rahul.google@gocharge.in',
          name: 'Rahul Sharma (Google)',
        };

    setUser(googleUser);
    return { success: true };
  }, []);

  const verifyPhoneOtp = useCallback(async (
    phone: string,
    otp: string,
    role: UserRole,
    name?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setLoading(false);

    if (otp.length < 4) {
      return { success: false, error: 'Please enter the complete 4-digit verification code.' };
    }

    const otpUser: AuthUser = {
      id: `usr-otp-${Date.now()}`,
      name: name?.trim() || (role === 'charger_owner' ? 'Go Charge Host' : 'EV Driver'),
      phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
      email: `${phone.replace(/\D/g, '')}@gocharge.in`,
      role,
      createdAt: new Date().toISOString()
    };

    setUser(otpUser);
    return { success: true };
  }, []);

  const quickDemoLogin = useCallback((role: UserRole) => {
    if (role === 'charger_owner') {
      setUser(DEMO_OWNER_USER);
    } else {
      setUser(DEMO_CONSUMER_USER);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('amperway_user');
    } catch {}
  }, []);

  const resetPassword = useCallback(async (email: string): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(false);
    return {
      success: true,
      message: `Password reset instructions have been sent to ${email}. (Demo simulation - check console or continue with test password)`
    };
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
    loginWithGoogle,
    verifyPhoneOtp,
    quickDemoLogin,
    logout,
    resetPassword,
  };
}
