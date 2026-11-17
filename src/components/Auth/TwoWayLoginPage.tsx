import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, Zap, ArrowRight, ArrowLeft, Mail, Lock, Eye, EyeOff, 
  Smartphone, ShieldCheck, CheckCircle2, AlertCircle, Building2, 
  User, MapPin, Sun, Moon, HelpCircle, Check, UserPlus, Clock, Send, RefreshCw
} from 'lucide-react';
import { UserRole, AuthUser } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { supabase } from '../../lib/supabase';
import { fetchProfile, upsertProfile, getUserPermissions, createHostOrganization } from '../../lib/supabaseService';

interface TwoWayLoginPageProps {
  onSuccess: (user: AuthUser) => void;
  onCancel: () => void;
  initialRole?: UserRole | null;
  initialMode?: 'signin' | 'signup';
  returnUrl?: string;
}

export const TwoWayLoginPage: React.FC<TwoWayLoginPageProps> = ({
  onSuccess,
  onCancel,
  initialRole = null,
  initialMode = 'signin',
  returnUrl,
}) => {
  const { isDark, toggleTheme } = useTheme();

  // Step 1: Role Selection ('role-select') vs Step 2: Auth Form ('auth-form')
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(initialRole);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(initialMode);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  
  // Specific to Owner Registration
  const [ownerType, setOwnerType] = useState<'individual' | 'business'>('individual');
  const [businessName, setBusinessName] = useState('');
  const [city, setCity] = useState('New Delhi');
  const [ownsCharger, setOwnsCharger] = useState<boolean>(true);

  // Phone OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);

  // Resend Email Confirmation State (with 60-second cooldown)
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const [resendLoading, setResendLoading] = useState<boolean>(false);

  // Forgot Password State (with cooldown)
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);
  const [forgotCooldown, setForgotCooldown] = useState<number>(0);

  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Restore Resend Cooldown from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('gocharge_resend_cooldown');
      if (stored) {
        const remaining = Math.ceil((parseInt(stored, 10) - Date.now()) / 1000);
        if (remaining > 0) {
          setResendCooldown(remaining);
        } else {
          sessionStorage.removeItem('gocharge_resend_cooldown');
        }
      }
    } catch {}
  }, []);

  // Cooldown countdown tick (solely updates local integer, no network requests)
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          try {
            sessionStorage.removeItem('gocharge_resend_cooldown');
          } catch {}
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Forgot Password cooldown tick
  useEffect(() => {
    if (forgotCooldown <= 0) return;
    const timer = setInterval(() => {
      setForgotCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [forgotCooldown]);

  // Dedicated Resend Confirmation Email Handler with 60s cooldown
  const handleResendConfirmation = async () => {
    if (resendLoading || resendCooldown > 0) return;

    const targetEmail = (pendingVerificationEmail || email).trim().toLowerCase();
    if (!targetEmail || !targetEmail.includes('@')) {
      setError('Please provide a valid email address to resend the verification email.');
      return;
    }

    setResendLoading(true);
    setError(null);

    try {
      const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined;
      const { error: resendErr } = await supabase.auth.resend({
        type: 'signup',
        email: targetEmail,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      setResendLoading(false);

      if (resendErr) {
        const lowerMsg = (resendErr.message || '').toLowerCase();
        const isRateLimited = lowerMsg.includes('rate limit') || 
                              lowerMsg.includes('over_email_send_rate_limit') ||
                              (resendErr as any).status === 429;
        if (isRateLimited) {
          // Enforce cooldown so user cannot spam further
          setResendCooldown(60);
          try {
            sessionStorage.setItem('gocharge_resend_cooldown', (Date.now() + 60000).toString());
          } catch {}
          setError('Email rate limit reached: Supabase limits email dispatch frequency for anti-spam protection. Please wait a few minutes before requesting another confirmation email, or check your spam/junk folder.');
        } else {
          setError(resendErr.message);
        }
        return;
      }

      // Success: initiate 60s cooldown
      setResendCooldown(60);
      try {
        sessionStorage.setItem('gocharge_resend_cooldown', (Date.now() + 60000).toString());
      } catch {}
      setSuccessNotice(`Verification email resent to ${targetEmail}! Please check your inbox and spam folder.`);
      setError(null);
    } catch (err: any) {
      setResendLoading(false);
      setError(err.message || 'Failed to dispatch verification email.');
    }
  };

  // Email/Password Submit Handler with Supabase Auth
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent duplicate form submissions while a request is in progress
    if (loading) return;

    setError(null);
    setSuccessNotice(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (authMode === 'signup') {
      if (!name.trim() || name.trim().length < 2) {
        setError('Please provide your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please verify your password.');
        return;
      }
      if (selectedRole === 'charger_owner' && ownerType === 'business' && !businessName.trim()) {
        setError('Please provide your business or commercial entity name.');
        return;
      }
    }

    setLoading(true);

    try {
      if (authMode === 'signin') {
        // STRICT: Never calls signUp() during login
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (authError || !authData.user) {
          setLoading(false);
          const lowerMsg = (authError?.message || '').toLowerCase();

          // Explicit detection of unconfirmed email
          if (lowerMsg.includes('email not confirmed')) {
            setPendingVerificationEmail(cleanEmail);
            setError('Email verification pending: Your account has been registered, but your email address has not been confirmed yet. Please verify your email using the link sent to your inbox, or request a new one below.');
            return;
          }

          // Privacy-preserving generic error per security requirements
          setError("Unable to sign in. Your email or password may be incorrect. If you don't have an account, please create one.");
          return;
        }

        // Verify authenticated user with Supabase server
        const { data: { user: verifiedUser } } = await supabase.auth.getUser();
        const activeUser = verifiedUser || authData.user;

        const profile = await fetchProfile(activeUser.id);
        const perms = await getUserPermissions(activeUser.id);
        const meta = activeUser.user_metadata || {};
        const fullName = profile?.full_name || meta.full_name || meta.name || cleanEmail.split('@')[0];

        // Resolve active role strictly based on user intent and verified database authorization
        let resolvedRole: UserRole = 'consumer';
        if (selectedRole === 'charger_owner') {
          if (perms.isHost) {
            resolvedRole = 'charger_owner';
          } else {
            setLoading(false);
            setError('Access Denied: This account is registered as an EV Driver (Consumer) and does not have host management privileges. Please sign in as an EV Driver or register as a Charger Owner.');
            return;
          }
        } else if (selectedRole === 'consumer') {
          resolvedRole = 'consumer';
        } else {
          resolvedRole = perms.isHost ? 'charger_owner' : 'consumer';
        }

        const userObj: AuthUser = {
          id: activeUser.id,
          name: fullName,
          email: activeUser.email || cleanEmail,
          phone: activeUser.phone || meta.phone || '+91 98765 43210',
          role: resolvedRole,
          isHost: perms.isHost,
          isConsumer: true,
          canSwitchRoles: perms.isHost,
          organizationId: perms.organizationId,
          organizationRole: perms.organizationRole,
          ownerType: meta.owner_type || meta.ownerType || ownerType,
          businessName: perms.organizationName || meta.business_name || meta.businessName || businessName,
          city: profile?.state || city,
          ownsCharger: perms.isHost || meta.ownsCharger,
          isNewOwner: perms.isHost && !perms.hasStations,
          avatarUrl: profile?.avatar_url || meta.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
          createdAt: activeUser.created_at || new Date().toISOString(),
        };

        setLoading(false);
        onSuccess(userObj);
        return;
      } else {
        // Sign Up with Supabase Auth (deliberate single user submission)
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: name.trim(),
              name: name.trim(),
              phone: phone.trim() ? (phone.startsWith('+91') ? phone : `+91 ${phone}`) : '',
              role: selectedRole || 'consumer',
              owner_type: selectedRole === 'charger_owner' ? ownerType : undefined,
              business_name: selectedRole === 'charger_owner' && ownerType === 'business' ? businessName.trim() : undefined,
              city: city.trim(),
              ownsCharger: selectedRole === 'charger_owner' ? ownsCharger : undefined,
            },
          },
        });

        if (authError) {
          setLoading(false);
          const lowerMsg = (authError.message || '').toLowerCase();

          // Handle rate limit error gracefully
          if (lowerMsg.includes('rate limit') || lowerMsg.includes('over_email_send_rate_limit') || (authError as any).status === 429) {
            setPendingVerificationEmail(cleanEmail);
            setError('Email rate limit reached: Supabase limits email dispatch frequency for anti-spam protection. Please wait a few minutes before trying again, or check your spam/junk folder for previous verification emails.');
            return;
          }

          if (lowerMsg.includes('already registered')) {
            setPendingVerificationEmail(cleanEmail);
            setError('This email address is already registered. If you have not verified your email yet, click the resend confirmation button below, or switch to Sign In.');
            return;
          }

          setError(authError.message);
          return;
        }

        if (authData.user) {
          // If email confirmation is enabled, session is null
          if (!authData.session) {
            setLoading(false);
            setPendingVerificationEmail(cleanEmail);
            // Start 60s cooldown
            setResendCooldown(60);
            try {
              sessionStorage.setItem('gocharge_resend_cooldown', (Date.now() + 60000).toString());
            } catch {}
            setSuccessNotice(`Account registered successfully! A confirmation link has been sent to ${cleanEmail}. Please verify your email before signing in.`);
            setAuthMode('signin');
            return;
          }

          // Active session: provision profile in public.profiles
          await upsertProfile({
            id: authData.user.id,
            email: cleanEmail,
            full_name: name.trim(),
            avatar_url: selectedRole === 'charger_owner'
              ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80'
              : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
            state: city.trim(),
          });

          if (selectedRole === 'charger_owner' && ownerType === 'business' && businessName.trim()) {
            await createHostOrganization(businessName.trim());
          }

          const perms = await getUserPermissions(authData.user.id);
          const isHost = selectedRole === 'charger_owner' || perms.isHost;

          const userObj: AuthUser = {
            id: authData.user.id,
            name: name.trim(),
            email: cleanEmail,
            phone: phone.trim() ? (phone.startsWith('+91') ? phone : `+91 ${phone}`) : '+91 98765 43210',
            role: selectedRole || perms.role,
            isHost,
            isConsumer: true,
            canSwitchRoles: isHost,
            organizationId: perms.organizationId,
            organizationRole: perms.organizationRole,
            ownerType: selectedRole === 'charger_owner' ? ownerType : undefined,
            businessName: selectedRole === 'charger_owner' && ownerType === 'business' ? businessName.trim() : undefined,
            city: city.trim(),
            ownsCharger: selectedRole === 'charger_owner' ? ownsCharger : undefined,
            isNewOwner: selectedRole === 'charger_owner',
            avatarUrl: selectedRole === 'charger_owner'
              ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80'
              : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
            createdAt: authData.user.created_at || new Date().toISOString(),
          };

          setLoading(false);
          onSuccess(userObj);
          return;
        }
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Authentication error.');
    }
  };

  // Phone OTP Flow via Supabase Auth
  const handlePhoneSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit Indian phone number.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fullPhone = `+91${cleanPhone}`;
      const { error: otpErr } = await supabase.auth.signInWithOtp({
        phone: fullPhone,
        options: {
          data: {
            role: selectedRole || 'consumer',
            full_name: name.trim() || undefined,
          },
        },
      });

      setLoading(false);

      if (otpErr) {
        setError(otpErr.message);
        return;
      }

      setOtpSent(true);
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Failed to dispatch verification SMS.');
    }
  };

  const handlePhoneVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const otp = otpValues.join('');
    if (otp.length < 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const cleanPhone = `+91${phone.replace(/\D/g, '')}`;
      const { data: authData, error: verifyErr } = await supabase.auth.verifyOtp({
        phone: cleanPhone,
        token: otp,
        type: 'sms',
      });

      if (verifyErr || !authData.user) {
        setLoading(false);
        setError(verifyErr?.message || 'Invalid or expired verification code.');
        return;
      }

      const profile = await fetchProfile(authData.user.id);
      const perms = await getUserPermissions(authData.user.id);
      const meta = authData.user.user_metadata || {};
      const fullName = profile?.full_name || meta.full_name || name.trim() || 'EV Driver';

      if (!profile) {
        await upsertProfile({
          id: authData.user.id,
          email: authData.user.email || null,
          full_name: fullName,
          state: city,
        });
      }

      // Resolve active role strictly based on user intent and verified database authorization
      let resolvedRole: UserRole = 'consumer';
      if (selectedRole === 'charger_owner') {
        if (perms.isHost) {
          resolvedRole = 'charger_owner';
        } else {
          setLoading(false);
          setError('Access Denied: This account is registered as an EV Driver (Consumer) and does not have host management privileges. Please sign in as an EV Driver or register as a Charger Owner.');
          return;
        }
      } else if (selectedRole === 'consumer') {
        resolvedRole = 'consumer';
      } else {
        resolvedRole = perms.isHost ? 'charger_owner' : 'consumer';
      }

      const userObj: AuthUser = {
        id: authData.user.id,
        name: fullName,
        email: authData.user.email || `${cleanPhone}@gocharge.in`,
        phone: cleanPhone,
        role: resolvedRole,
        isHost: perms.isHost,
        isConsumer: true,
        canSwitchRoles: perms.isHost,
        organizationId: perms.organizationId,
        organizationRole: perms.organizationRole,
        ownerType: selectedRole === 'charger_owner' ? ownerType : undefined,
        businessName: selectedRole === 'charger_owner' && ownerType === 'business' ? businessName.trim() : undefined,
        city,
        ownsCharger: selectedRole === 'charger_owner' ? ownsCharger : undefined,
        isNewOwner: false,
        avatarUrl: profile?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
        createdAt: authData.user.created_at || new Date().toISOString(),
      };

      setLoading(false);
      onSuccess(userObj);
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Verification failed.');
    }
  };

  // Google OAuth Handler with Supabase Auth
  const handleGoogleAuth = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
          queryParams: { role: selectedRole || 'consumer' },
        },
      });

      if (googleError) {
        const lower = googleError.message.toLowerCase();
        if (lower.includes('unsupported provider') || lower.includes('not enabled')) {
          setError('Google Sign-In is not currently configured in the Supabase Dashboard. Please sign in with your email & password, or phone number.');
        } else {
          setError(googleError.message);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password Submit Handler with 60s cooldown
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || forgotCooldown > 0) return;

    if (!forgotEmail || !forgotEmail.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    setLoading(true);
    try {
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(forgotEmail.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/login`,
      });
      setLoading(false);
      if (resetErr) {
        const lower = resetErr.message.toLowerCase();
        if (lower.includes('rate limit') || lower.includes('over_email_send_rate_limit') || (resetErr as any).status === 429) {
          setError('Email rate limit reached: Please wait a few minutes before requesting another password reset email.');
          setForgotCooldown(60);
        } else {
          setError(resetErr.message);
        }
      } else {
        setForgotCooldown(60);
        setForgotMessage(`If an account is associated with ${forgotEmail.trim()}, password recovery instructions have been sent.`);
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Failed to dispatch password recovery email.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1E8] dark:bg-[#071715] flex flex-col justify-between text-[#14201F] dark:text-[#E4EFEA] transition-colors duration-300 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#19C7B1]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#073B35]/20 dark:bg-[#19C7B1]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between relative z-10">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-xs font-bold text-[#5E716E] dark:text-[#8FAFA9] hover:text-[#123C3A] dark:hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Go Charge</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-white dark:bg-[#0D2422] border border-[#D9DED5] dark:border-[#1E4844] text-[#5E716E] dark:text-[#8FAFA9] hover:text-[#123C3A] dark:hover:text-white transition-all cursor-pointer shadow-sm"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10 py-8">
        <div className="w-full max-w-4xl">

          <AnimatePresence mode="wait">
            {/* ======================================================== */}
            {/* STEP 1: DUAL-ROLE ONBOARDING SELECTION                   */}
            {/* ======================================================== */}
            {!selectedRole ? (
              <motion.div
                key="role-select"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="space-y-8"
              >
                {/* Heading */}
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#19C7B1]/10 text-[#073B35] dark:text-[#19C7B1] text-xs font-extrabold tracking-wide uppercase">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Supabase Secured Identity</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#123C3A] dark:text-white">
                    Choose Your Go Charge Portal
                  </h1>
                  <p className="text-sm text-[#5E716E] dark:text-[#8FAFA9]">
                    Select whether you want to discover EV charging stations or host and monetize your own charging points.
                  </p>
                </div>

                {/* 2 Big Choice Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  
                  {/* CARD 1 – CONSUMER */}
                  <motion.div
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      setSelectedRole('consumer');
                      setAuthMode('signin');
                      setError(null);
                      setSuccessNotice(null);
                    }}
                    className="group relative p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#0D2422] border-2 border-[#D9DED5] dark:border-[#1E4844] hover:border-[#19C7B1] dark:hover:border-[#19C7B1] shadow-card-subtle hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#19C7B1]/10 rounded-full blur-2xl group-hover:scale-150 transition-transform pointer-events-none" />

                    <div>
                      {/* Icon */}
                      <div className="w-14 h-14 rounded-2xl bg-[#19C7B1]/15 text-[#19C7B1] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-sm">
                        <Car className="w-7 h-7" />
                      </div>

                      {/* Heading */}
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <h2 className="text-xl font-extrabold text-[#123C3A] dark:text-white group-hover:text-[#19C7B1] transition-colors">
                          Find & Charge
                        </h2>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#19C7B1]/10 text-[#073B35] dark:text-[#19C7B1] uppercase tracking-wider">
                          EV Driver
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-[#5E716E] dark:text-[#8FAFA9] leading-relaxed mb-6">
                        Discover compatible EV charging stations, check live availability, filter by connector, and book charging slots seamlessly.
                      </p>
                    </div>

                    {/* Button */}
                    <div>
                      <button
                        type="button"
                        className="w-full py-3 px-4 rounded-xl bg-[#19C7B1] hover:bg-[#15A896] text-white text-xs sm:text-sm font-bold shadow-glow-teal-sm flex items-center justify-center gap-2 transition-all cursor-pointer group-hover:gap-3"
                      >
                        <span>Continue as Consumer</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>

                  {/* CARD 2 – CHARGER OWNER */}
                  <motion.div
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      setSelectedRole('charger_owner');
                      setAuthMode('signin');
                      setError(null);
                      setSuccessNotice(null);
                    }}
                    className="group relative p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#0D2422] border-2 border-[#D9DED5] dark:border-[#1E4844] hover:border-[#123C3A] dark:hover:border-[#19C7B1] shadow-card-subtle hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#073B35]/10 dark:bg-[#19C7B1]/10 rounded-full blur-2xl group-hover:scale-150 transition-transform pointer-events-none" />

                    <div>
                      {/* Icon */}
                      <div className="w-14 h-14 rounded-2xl bg-[#073B35]/10 dark:bg-[#19C7B1]/15 text-[#073B35] dark:text-[#19C7B1] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-sm">
                        <Zap className="w-7 h-7 fill-current" />
                      </div>

                      {/* Heading */}
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <h2 className="text-xl font-extrabold text-[#123C3A] dark:text-white group-hover:text-[#19C7B1] transition-colors">
                          Manage Your Chargers
                        </h2>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#073B35]/10 dark:bg-[#112D2B] text-[#073B35] dark:text-[#19C7B1] uppercase tracking-wider">
                          Host / Owner
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-[#5E716E] dark:text-[#8FAFA9] leading-relaxed mb-6">
                        List your residential, commercial, or public charging points, manage live driver bookings, configure availability, and track automated earnings.
                      </p>
                    </div>

                    {/* Button */}
                    <div>
                      <button
                        type="button"
                        className="w-full py-3 px-4 rounded-xl bg-[#073B35] dark:bg-[#18C5B7] hover:bg-[#0A4E46] dark:hover:bg-[#15A896] text-white dark:text-[#071715] text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer group-hover:gap-3"
                      >
                        <span>Continue as Charger Owner</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>

                </div>

                {/* Sub links */}
                <div className="pt-2 flex flex-col items-center justify-center gap-3">
                  <div className="flex items-center gap-2 text-xs text-[#5E716E] dark:text-[#8FAFA9]">
                    <span>Already familiar with the platform?</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRole('consumer');
                        setAuthMode('signin');
                      }}
                      className="text-[#19C7B1] font-bold hover:underline cursor-pointer"
                    >
                      Sign In directly
                    </button>
                  </div>
                </div>

              </motion.div>
            ) : (
              /* ======================================================== */
              /* STEP 2: SUPABASE AUTHENTICATION FORM                     */
              /* ======================================================== */
              <motion.div
                key="auth-form"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.24, ease: "easeOut" }}
                className="max-w-md mx-auto bg-white dark:bg-[#0D2422] rounded-3xl border border-[#D9DED5] dark:border-[#1E4844] shadow-card-hover p-6 sm:p-8"
              >
                
                {/* Back to Role Selection */}
                <div className="flex items-center justify-between mb-5">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole(null);
                      setError(null);
                      setSuccessNotice(null);
                    }}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#5E716E] dark:text-[#8FAFA9] hover:text-[#123C3A] dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Switch Portal</span>
                  </button>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    selectedRole === 'charger_owner'
                      ? 'bg-[#073B35]/10 dark:bg-[#112D2B] text-[#073B35] dark:text-[#19C7B1]'
                      : 'bg-[#19C7B1]/10 text-[#073B35] dark:text-[#19C7B1]'
                  }`}>
                    {selectedRole === 'charger_owner' ? 'Host Portal' : 'Driver Portal'}
                  </span>
                </div>

                {/* Portal Title & Tabs */}
                <div className="mb-6 space-y-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#123C3A] dark:text-white">
                      {authMode === 'signin' 
                        ? (selectedRole === 'charger_owner' ? 'Charger Owner Sign In' : 'Consumer Sign In')
                        : (selectedRole === 'charger_owner' ? 'Register as Charger Owner' : 'Create Consumer Account')}
                    </h2>
                    <p className="text-xs text-[#5E716E] dark:text-[#8FAFA9] mt-0.5">
                      {selectedRole === 'charger_owner'
                        ? 'Manage your charging infrastructure, bookings & payouts'
                        : 'Discover stations, reserve slots & track charging sessions'}
                    </p>
                  </div>

                  {/* Mode Tabs */}
                  <div className="grid grid-cols-2 p-1 bg-[#E9EFE7] dark:bg-[#081B19] rounded-xl border border-[#D9DED5] dark:border-[#1E4844] text-xs font-bold">
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => {
                        setAuthMode('signin');
                        setError(null);
                        setSuccessNotice(null);
                        setOtpSent(false);
                      }}
                      className={`py-2 rounded-lg transition-all cursor-pointer ${
                        authMode === 'signin'
                          ? 'bg-white dark:bg-[#112D2B] text-[#123C3A] dark:text-white shadow-sm'
                          : 'text-[#5E716E] dark:text-[#88ABA6]'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => {
                        setAuthMode('signup');
                        setError(null);
                        setSuccessNotice(null);
                        setOtpSent(false);
                      }}
                      className={`py-2 rounded-lg transition-all cursor-pointer ${
                        authMode === 'signup'
                          ? 'bg-white dark:bg-[#112D2B] text-[#123C3A] dark:text-white shadow-sm'
                          : 'text-[#5E716E] dark:text-[#88ABA6]'
                      }`}
                    >
                      Create Account
                    </button>
                  </div>
                </div>

                {/* Success Banner */}
                {successNotice && (
                  <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                    <div>{successNotice}</div>
                  </div>
                )}

                {/* Resend Confirmation Email Widget (visible when verification is pending or rate-limited) */}
                {(pendingVerificationEmail || successNotice || (error && error.toLowerCase().includes('verification pending'))) && (
                  <div className="mb-4 p-3.5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs space-y-2.5">
                    <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200 font-bold">
                      <Mail className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>Email Confirmation Required</span>
                    </div>
                    <p className="text-[11px] text-amber-700 dark:text-amber-300 leading-relaxed">
                      Didn't receive the email? Check your spam/junk folder or request another confirmation link below.
                    </p>
                    <div className="flex items-center justify-between pt-1 border-t border-amber-200/60 dark:border-amber-900/40">
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium truncate max-w-[180px]">
                        {pendingVerificationEmail || email}
                      </span>
                      <button
                        type="button"
                        disabled={resendLoading || resendCooldown > 0}
                        onClick={handleResendConfirmation}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                          resendCooldown > 0 || resendLoading
                            ? 'bg-amber-200/60 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 cursor-not-allowed opacity-80'
                            : 'bg-amber-600 hover:bg-amber-700 text-white'
                        }`}
                      >
                        {resendLoading ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            <span>Sending...</span>
                          </>
                        ) : resendCooldown > 0 ? (
                          <>
                            <Clock className="w-3.5 h-3.5" />
                            <span>Resend in {resendCooldown}s</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Resend Email</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Error Banner with helpful options */}
                {error && (
                  <div className="mb-4 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs font-semibold space-y-2.5">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                      <span className="leading-relaxed">{error}</span>
                    </div>

                    {authMode === 'signin' && !error.toLowerCase().includes('verification pending') && (
                      <div className="flex items-center gap-3 pt-1 border-t border-rose-200/60 dark:border-rose-900/60 text-[11px]">
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode('signup');
                            setError(null);
                          }}
                          className="font-bold text-rose-900 dark:text-rose-300 underline hover:text-[#19C7B1] transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <UserPlus className="w-3 h-3" />
                          <span>Create Account</span>
                        </button>
                        <span>•</span>
                        <button
                          type="button"
                          onClick={() => {
                            setForgotPasswordOpen(true);
                            setForgotEmail(email);
                            setForgotMessage(null);
                          }}
                          className="font-bold text-rose-900 dark:text-rose-300 underline hover:text-[#19C7B1] transition-colors cursor-pointer"
                        >
                          Forgot Password?
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Method Switcher: Email/Password vs Phone OTP */}
                <div className="flex items-center justify-center gap-4 mb-4 text-xs font-bold border-b border-[#D9DED5] dark:border-[#1E4844] pb-2">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      setAuthMethod('email');
                      setOtpSent(false);
                      setError(null);
                    }}
                    className={`flex items-center gap-1.5 pb-1 border-b-2 transition-colors cursor-pointer ${
                      authMethod === 'email'
                        ? 'border-[#19C7B1] text-[#123C3A] dark:text-[#19C7B1]'
                        : 'border-transparent text-[#7A8C89] dark:text-[#7A9E99]'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email & Password</span>
                  </button>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      setAuthMethod('phone');
                      setError(null);
                    }}
                    className={`flex items-center gap-1.5 pb-1 border-b-2 transition-colors cursor-pointer ${
                      authMethod === 'phone'
                        ? 'border-[#19C7B1] text-[#123C3A] dark:text-[#19C7B1]'
                        : 'border-transparent text-[#7A8C89] dark:text-[#7A9E99]'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Phone OTP</span>
                  </button>
                </div>

                {/* ======================================================== */}
                {/* METHOD A: EMAIL & PASSWORD FORM                          */}
                {/* ======================================================== */}
                {authMethod === 'email' && (
                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    
                    {/* Full Name for Sign Up */}
                    {authMode === 'signup' && (
                      <div>
                        <label className="block text-xs font-bold text-[#123C3A] dark:text-[#CBDCD6] mb-1.5">
                          Full Name *
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-[#7A8C89] absolute left-3.5 top-3 pointer-events-none" />
                          <input
                            type="text"
                            required
                            disabled={loading}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Rahul Sharma"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8F7F2] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#1E4844] text-xs sm:text-sm text-[#14201F] dark:text-white outline-none focus:border-[#19C7B1] transition-colors disabled:opacity-60"
                          />
                        </div>
                      </div>
                    )}

                    {/* OWNER SPECIFIC REGISTRATION FIELDS */}
                    {authMode === 'signup' && selectedRole === 'charger_owner' && (
                      <div className="p-3.5 rounded-2xl bg-[#E9EFE7]/80 dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#1E4844] space-y-3.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#123C3A] dark:text-[#19C7B1]">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>Owner Onboarding Details</span>
                        </div>

                        {/* Owner Type */}
                        <div>
                          <label className="block text-[11px] font-bold text-[#5E716E] dark:text-[#8FAFA9] mb-1">
                            Owner Type
                          </label>
                          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                            <button
                              type="button"
                              disabled={loading}
                              onClick={() => setOwnerType('individual')}
                              className={`py-1.5 rounded-lg border transition-all cursor-pointer ${
                                ownerType === 'individual'
                                  ? 'bg-[#19C7B1] text-white border-[#19C7B1]'
                                  : 'bg-white dark:bg-[#0D2422] text-[#5E716E] border-[#D9DED5] dark:border-[#1E4844]'
                              }`}
                            >
                              Individual Host
                            </button>
                            <button
                              type="button"
                              disabled={loading}
                              onClick={() => setOwnerType('business')}
                              className={`py-1.5 rounded-lg border transition-all cursor-pointer ${
                                ownerType === 'business'
                                  ? 'bg-[#19C7B1] text-white border-[#19C7B1]'
                                  : 'bg-white dark:bg-[#0D2422] text-[#5E716E] border-[#D9DED5] dark:border-[#1E4844]'
                              }`}
                            >
                              Business / Commercial
                            </button>
                          </div>
                        </div>

                        {/* Business Name if commercial */}
                        {ownerType === 'business' && (
                          <div>
                            <label className="block text-[11px] font-bold text-[#5E716E] dark:text-[#8FAFA9] mb-1">
                              Business / Company Name *
                            </label>
                            <input
                              type="text"
                              required
                              disabled={loading}
                              value={businessName}
                              onChange={(e) => setBusinessName(e.target.value)}
                              placeholder="e.g. Singhania EV Infrastructure LLP"
                              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#0D2422] border border-[#D9DED5] dark:border-[#1E4844] text-xs text-[#14201F] dark:text-white outline-none focus:border-[#19C7B1] disabled:opacity-60"
                            />
                          </div>
                        )}

                        {/* City */}
                        <div>
                          <label className="block text-[11px] font-bold text-[#5E716E] dark:text-[#8FAFA9] mb-1">
                            City / Primary Location
                          </label>
                          <div className="relative">
                            <MapPin className="w-3.5 h-3.5 text-[#7A8C89] absolute left-3 top-2.5 pointer-events-none" />
                            <input
                              type="text"
                              disabled={loading}
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              placeholder="e.g. New Delhi, Bengaluru, Mumbai"
                              className="w-full pl-9 pr-3 py-2 rounded-lg bg-white dark:bg-[#0D2422] border border-[#D9DED5] dark:border-[#1E4844] text-xs text-[#14201F] dark:text-white outline-none focus:border-[#19C7B1] disabled:opacity-60"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Email Input */}
                    <div>
                      <label className="block text-xs font-bold text-[#123C3A] dark:text-[#CBDCD6] mb-1.5">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#7A8C89] absolute left-3.5 top-3 pointer-events-none" />
                        <input
                          type="email"
                          required
                          disabled={loading}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8F7F2] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#1E4844] text-xs sm:text-sm text-[#14201F] dark:text-white outline-none focus:border-[#19C7B1] transition-colors disabled:opacity-60"
                        />
                      </div>
                    </div>

                    {/* Password Input with Visibility Toggle */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-[#123C3A] dark:text-[#CBDCD6]">
                          Password *
                        </label>
                        {authMode === 'signin' && (
                          <button
                            type="button"
                            disabled={loading}
                            onClick={() => {
                              setForgotPasswordOpen(true);
                              setForgotEmail(email);
                              setForgotMessage(null);
                            }}
                            className="text-[11px] font-bold text-[#19C7B1] hover:underline cursor-pointer disabled:opacity-50"
                          >
                            Forgot password?
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[#7A8C89] absolute left-3.5 top-3 pointer-events-none" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          disabled={loading}
                          minLength={6}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#F8F7F2] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#1E4844] text-xs sm:text-sm text-[#14201F] dark:text-white outline-none focus:border-[#19C7B1] transition-colors disabled:opacity-60"
                        />
                        <button
                          type="button"
                          disabled={loading}
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-3 text-[#7A8C89] hover:text-[#123C3A] dark:hover:text-white transition-colors cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password for Sign Up */}
                    {authMode === 'signup' && (
                      <div>
                        <label className="block text-xs font-bold text-[#123C3A] dark:text-[#CBDCD6] mb-1.5">
                          Confirm Password *
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-[#7A8C89] absolute left-3.5 top-3 pointer-events-none" />
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            disabled={loading}
                            minLength={6}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#F8F7F2] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#1E4844] text-xs sm:text-sm text-[#14201F] dark:text-white outline-none focus:border-[#19C7B1] transition-colors disabled:opacity-60"
                          />
                          <button
                            type="button"
                            disabled={loading}
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3.5 top-3 text-[#7A8C89] hover:text-[#123C3A] dark:hover:text-white transition-colors cursor-pointer"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm shadow-glow-teal flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        loading
                          ? 'opacity-70 cursor-not-allowed bg-[#7A8C89]'
                          : selectedRole === 'charger_owner'
                          ? 'bg-[#073B35] dark:bg-[#18C5B7] hover:bg-[#0A4E46] dark:hover:bg-[#15A896] text-white dark:text-[#071715]'
                          : 'bg-[#19C7B1] hover:bg-[#15A896] text-white'
                      }`}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>{authMode === 'signin' ? 'Authenticating...' : 'Registering Account...'}</span>
                        </div>
                      ) : (
                        <>
                          <span>
                            {authMode === 'signin'
                              ? (selectedRole === 'charger_owner' ? 'Sign In as Charger Owner' : 'Sign In as Consumer')
                              : (selectedRole === 'charger_owner' ? 'Register & Open Owner Dashboard' : 'Register & Start Charging')}
                          </span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* ======================================================== */}
                {/* METHOD B: PHONE OTP FORM                                 */}
                {/* ======================================================== */}
                {authMethod === 'phone' && (
                  <div>
                    {!otpSent ? (
                      <form onSubmit={handlePhoneSendOtp} className="space-y-4">
                        {authMode === 'signup' && (
                          <div>
                            <label className="block text-xs font-bold text-[#123C3A] dark:text-[#CBDCD6] mb-1.5">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              required
                              disabled={loading}
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="e.g. Rahul Sharma"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F7F2] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#1E4844] text-xs sm:text-sm text-[#14201F] dark:text-white outline-none focus:border-[#19C7B1] disabled:opacity-60"
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-xs font-bold text-[#123C3A] dark:text-[#CBDCD6] mb-1.5">
                            Mobile Number *
                          </label>
                          <div className="flex items-center">
                            <span className="px-3.5 py-2.5 bg-[#E9EFE7] dark:bg-[#081B19] border border-r-0 border-[#D9DED5] dark:border-[#1E4844] rounded-l-xl text-xs font-bold text-[#5E716E] dark:text-[#8FAFA9]">
                              +91
                            </span>
                            <input
                              type="tel"
                              required
                              disabled={loading}
                              maxLength={10}
                              value={phone}
                              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                              placeholder="98765 43210"
                              className="w-full px-3.5 py-2.5 rounded-r-xl bg-[#F8F7F2] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#1E4844] text-xs sm:text-sm font-bold text-[#14201F] dark:text-white outline-none focus:border-[#19C7B1] disabled:opacity-60"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-3 rounded-xl bg-[#19C7B1] hover:bg-[#15A896] text-white text-xs sm:text-sm font-bold shadow-glow-teal flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Sending Code...</span>
                            </div>
                          ) : (
                            <>
                              <span>Send Verification Code</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={handlePhoneVerifyOtp} className="space-y-4">
                        <p className="text-xs text-[#5E716E] dark:text-[#8FAFA9] text-center">
                          Enter the 6-digit code sent to <strong className="text-[#123C3A] dark:text-white">+91 {phone}</strong>
                        </p>

                        <div className="flex justify-center gap-2 my-2">
                          {[0, 1, 2, 3, 4, 5].map((idx) => (
                            <input
                              key={idx}
                              type="text"
                              disabled={loading}
                              maxLength={1}
                              value={otpValues[idx]}
                              onChange={(e) => {
                                const val = e.target.value;
                                const next = [...otpValues];
                                next[idx] = val;
                                setOtpValues(next);
                                if (val && idx < 5) {
                                  const nextInput = document.getElementById(`phone-otp-${idx + 1}`);
                                  nextInput?.focus();
                                }
                              }}
                              id={`phone-otp-${idx}`}
                              className="w-10 h-12 text-center text-base font-bold rounded-xl bg-white dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#1E4844] text-[#123C3A] dark:text-white focus:border-[#19C7B1] outline-none disabled:opacity-60"
                            />
                          ))}
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-3 rounded-xl bg-[#19C7B1] hover:bg-[#15A896] text-white text-xs sm:text-sm font-bold shadow-glow-teal flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Verify & Proceed to Dashboard</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          disabled={loading}
                          onClick={() => setOtpSent(false)}
                          className="w-full text-center text-xs text-[#5E716E] dark:text-[#8FAFA9] hover:underline cursor-pointer"
                        >
                          Edit phone number
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* Divider */}
                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#D9DED5] dark:border-[#1E4844]" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase font-bold text-[#7A8C89]">
                    <span className="bg-white dark:bg-[#0D2422] px-3">or continue with</span>
                  </div>
                </div>

                {/* Google Sign In */}
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#F8F7F2] dark:bg-[#081B19] hover:bg-[#E9EFE7] dark:hover:bg-[#112D2B] border border-[#D9DED5] dark:border-[#1E4844] text-xs font-bold text-[#14201F] dark:text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-60"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>

      {/* Forgot Password Modal */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-[#0D2422] rounded-2xl border border-[#D9DED5] dark:border-[#1E4844] shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-extrabold text-[#123C3A] dark:text-white">
              Reset Your Password
            </h3>
            <p className="text-xs text-[#5E716E] dark:text-[#8FAFA9]">
              Enter your registered email address and Supabase Auth will send you a password recovery link.
            </p>

            {forgotMessage ? (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                {forgotMessage}
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  disabled={loading || forgotCooldown > 0}
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F7F2] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#1E4844] text-xs text-[#14201F] dark:text-white outline-none focus:border-[#19C7B1] disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={loading || forgotCooldown > 0}
                  className="w-full py-2.5 rounded-xl bg-[#19C7B1] text-white text-xs font-bold shadow cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  {loading ? (
                    'Sending...'
                  ) : forgotCooldown > 0 ? (
                    <>
                      <Clock className="w-3.5 h-3.5" />
                      <span>Request available in {forgotCooldown}s</span>
                    </>
                  ) : (
                    'Send Recovery Link'
                  )}
                </button>
              </form>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setForgotPasswordOpen(false)}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-[#112D2B] text-xs font-bold text-gray-700 dark:text-white cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
