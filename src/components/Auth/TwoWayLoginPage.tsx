import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, Zap, ArrowRight, ArrowLeft, Mail, Lock, Eye, EyeOff, 
  Smartphone, ShieldCheck, CheckCircle2, AlertCircle, Building2, 
  User, MapPin, Sparkles, Sun, Moon, HelpCircle, Check
} from 'lucide-react';
import { UserRole, AuthUser } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

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
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  
  // Specific to Owner Registration
  const [ownerType, setOwnerType] = useState<'individual' | 'business'>('individual');
  const [businessName, setBusinessName] = useState('');
  const [city, setCity] = useState('New Delhi');
  const [ownsCharger, setOwnsCharger] = useState<boolean>(true);

  // Phone OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otpValues, setOtpValues] = useState(['', '', '', '']);

  // Forgot Password State
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);

  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to persist session and callback
  const saveAndSucceed = (userObj: AuthUser) => {
    try {
      localStorage.setItem('amperway_auth_user', JSON.stringify(userObj));
      localStorage.setItem('amperway_user', JSON.stringify({
        name: userObj.name,
        phone: userObj.phone,
        email: userObj.email,
        role: userObj.role === 'charger_owner' ? 'host' : 'driver'
      }));
    } catch {}
    onSuccess(userObj);
  };

  // 1-Click Demo Fill & Submit Helper
  const handleQuickDemo = async (role: UserRole) => {
    setLoading(true);
    setError(null);
    await new Promise((r) => setTimeout(r, 450));
    setLoading(false);

    if (role === 'charger_owner') {
      const ownerUser: AuthUser = {
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
      saveAndSucceed(ownerUser);
    } else {
      const consumerUser: AuthUser = {
        id: 'usr-consumer-101',
        name: 'Rahul Sharma',
        email: 'rahul.sharma@gocharge.in',
        phone: '+91 98765 43210',
        role: 'consumer',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
        city: 'New Delhi',
        createdAt: '2024-02-15'
      };
      saveAndSucceed(consumerUser);
    }
  };

  // Email/Password Submit Handler
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (authMode === 'signup' && !name.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (authMode === 'signup' && selectedRole === 'charger_owner' && ownerType === 'business' && !businessName.trim()) {
      setError('Please provide your business or commercial entity name.');
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);

    const userObj: AuthUser = {
      id: `usr-${Date.now()}`,
      name: name.trim() || (selectedRole === 'charger_owner' ? 'Go Charge Host' : 'EV Driver'),
      email: email.trim().toLowerCase(),
      phone: phone.trim() ? (phone.startsWith('+91') ? phone : `+91 ${phone}`) : '+91 98765 43210',
      role: selectedRole || 'consumer',
      ownerType: selectedRole === 'charger_owner' ? ownerType : undefined,
      businessName: selectedRole === 'charger_owner' && ownerType === 'business' ? businessName.trim() : undefined,
      city: city.trim(),
      ownsCharger: selectedRole === 'charger_owner' ? ownsCharger : undefined,
      isNewOwner: authMode === 'signup' && selectedRole === 'charger_owner',
      avatarUrl: selectedRole === 'charger_owner'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
      createdAt: new Date().toISOString()
    };

    saveAndSucceed(userObj);
  };

  // Phone OTP Flow Handler
  const handlePhoneSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit Indian phone number.');
      return;
    }
    setError(null);
    setOtpSent(true);
  };

  const handlePhoneVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpValues.join('');
    if (fullOtp.length < 4) {
      setError('Please enter the 4-digit verification code.');
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 450));
    setLoading(false);

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const userObj: AuthUser = {
      id: `usr-otp-${Date.now()}`,
      name: name.trim() || (selectedRole === 'charger_owner' ? 'Go Charge Host' : 'EV Driver'),
      phone: `+91 ${cleanPhone}`,
      email: `${cleanPhone}@gocharge.in`,
      role: selectedRole || 'consumer',
      ownerType: selectedRole === 'charger_owner' ? ownerType : undefined,
      businessName: selectedRole === 'charger_owner' && ownerType === 'business' ? businessName.trim() : undefined,
      city,
      ownsCharger: selectedRole === 'charger_owner' ? ownsCharger : undefined,
      isNewOwner: authMode === 'signup' && selectedRole === 'charger_owner',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
      createdAt: new Date().toISOString()
    };

    saveAndSucceed(userObj);
  };

  // Google Login Simulation Handler
  const handleGoogleAuth = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);

    const googleUser: AuthUser = selectedRole === 'charger_owner'
      ? {
          id: `usr-google-owner-${Date.now()}`,
          name: 'Vikramaditya Singhania (Google)',
          email: 'vikram.singhania@gmail.com',
          phone: '+91 98201 44520',
          role: 'charger_owner',
          ownerType: 'business',
          businessName: 'Singhania Mobility Hubs',
          city: 'New Delhi, Delhi NCR',
          ownsCharger: true,
          isNewOwner: false,
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
          createdAt: new Date().toISOString()
        }
      : {
          id: `usr-google-consumer-${Date.now()}`,
          name: 'Rahul Sharma (Google)',
          email: 'rahul.sharma@gmail.com',
          phone: '+91 98765 43210',
          role: 'consumer',
          city: 'New Delhi',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
          createdAt: new Date().toISOString()
        };

    saveAndSucceed(googleUser);
  };

  // Forgot Password Submit Handler
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) return;
    setForgotMessage(`Password reset link sent to ${forgotEmail}. (Demo simulation: you can continue with any 6-character password).`);
  };

  return (
    <div className="min-h-screen bg-[#F8F7F2] dark:bg-[#071715] text-[#14201F] dark:text-[#E4EFEA] flex flex-col font-sans transition-colors duration-300">
      
      {/* Top Simple Header */}
      <header className="w-full border-b border-[#D9DED5] dark:border-[#1E4844] bg-[#F4F1E8]/90 dark:bg-[#071715]/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-[#19C7B1] flex items-center justify-center text-white shadow-glow-teal-sm group-hover:rotate-12 transition-transform">
            <Zap className="w-4 h-4 fill-white" />
          </div>
          <div className="text-left">
            <span className="font-extrabold text-base tracking-tight text-[#123C3A] dark:text-white leading-none block">
              Go Charge
            </span>
            <span className="text-[9px] font-bold text-[#19C7B1] tracking-wider uppercase">
              Community EV Network
            </span>
          </div>
        </button>

        <div className="flex items-center gap-2">
          {/* Theme switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-full bg-[#E9EFE7] dark:bg-[#0D2422] border border-[#D9DED5] dark:border-[#1E4844] text-[#123C3A] dark:text-white hover:border-[#19C7B1] transition-all cursor-pointer"
          >
            {isDark ? <Sun className="w-4 h-4 text-[#F59E0B]" /> : <Moon className="w-4 h-4 text-[#123C3A]" />}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-1.5 rounded-btn bg-[#E9EFE7] dark:bg-[#0D2422] hover:bg-white dark:hover:bg-[#123633] border border-[#D9DED5] dark:border-[#1E4844] text-xs font-bold text-[#123C3A] dark:text-white transition-all cursor-pointer"
          >
            Back to Platform
          </button>
        </div>
      </header>

      {/* Main Body Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-4xl mx-auto">
          
          <AnimatePresence mode="wait">
            {!selectedRole ? (
              /* ======================================================== */
              /* STEP 1: THE TWO ATTRACTIVE SELECTION CARDS                */
              /* ======================================================== */
              <motion.div
                key="role-selection"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.22 }}
                className="space-y-8 text-center"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#19C7B1]/15 text-[#123C3A] dark:text-[#19C7B1] text-xs font-extrabold mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-[#19C7B1]" />
                    <span>Dual Role Access · Select Your Account Type</span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-[#123C3A] dark:text-white tracking-tight">
                    Welcome to Go Charge
                  </h1>
                  <p className="text-xs sm:text-sm text-[#5E716E] dark:text-[#8FAFA9] max-w-md mx-auto mt-2">
                    Whether you are charging your electric vehicle on the road or hosting charging points for passive revenue, Go Charge connects you.
                  </p>
                </div>

                {/* THE TWO SELECTION CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto">
                  
                  {/* CARD 1 – CONSUMER */}
                  <div
                    onClick={() => {
                      setSelectedRole('consumer');
                      setAuthMode('signin');
                      setError(null);
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
                          Find a Charger
                        </h2>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E9EFE7] dark:bg-[#112D2B] text-[#123C3A] dark:text-[#19C7B1] uppercase tracking-wider">
                          Consumer
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
                  </div>

                  {/* CARD 2 – CHARGER OWNER */}
                  <div
                    onClick={() => {
                      setSelectedRole('charger_owner');
                      setAuthMode('signin');
                      setError(null);
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
                  </div>

                </div>

                {/* Sub links & Quick demo test triggers */}
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
                      Login directly
                    </button>
                  </div>

                  {/* 1-Click Demo Login Shortcuts */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    <span className="text-[11px] font-bold text-[#7A8C89] uppercase tracking-wider">
                      Demo 1-Click:
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQuickDemo('consumer')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Car className="w-3.5 h-3.5" />
                      <span>Test as Consumer (Rahul)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickDemo('charger_owner')}
                      className="px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-bold hover:bg-teal-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Test as Charger Owner (Vikram)</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* ======================================================== */
              /* STEP 2: AUTHENTICATION FORM (CONSUMER OR OWNER)          */
              /* ======================================================== */
              <motion.div
                key="auth-form"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="max-w-lg mx-auto bg-white dark:bg-[#0D2422] rounded-3xl border border-[#D9DED5] dark:border-[#1E4844] shadow-2xl p-6 sm:p-8"
              >
                {/* Back to Role Selection Breadcrumb */}
                <div className="flex items-center justify-between pb-4 border-b border-[#D9DED5] dark:border-[#1E4844] mb-5">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole(null);
                      setError(null);
                      setOtpSent(false);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5E716E] dark:text-[#8FAFA9] hover:text-[#19C7B1] transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Change Account Type</span>
                  </button>

                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                    selectedRole === 'charger_owner'
                      ? 'bg-[#073B35]/10 dark:bg-[#112D2B] text-[#073B35] dark:text-[#19C7B1] border border-[#073B35]/20 dark:border-[#19C7B1]/30'
                      : 'bg-[#19C7B1]/15 text-[#123C3A] dark:text-[#19C7B1] border border-[#19C7B1]/30'
                  }`}>
                    {selectedRole === 'charger_owner' ? '⚡ Charger Owner' : '🚗 EV Consumer'}
                  </span>
                </div>

                {/* Heading & Sign In vs Create Account Toggle */}
                <div className="space-y-3 mb-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#123C3A] dark:text-white tracking-tight">
                      {authMode === 'signin' 
                        ? (selectedRole === 'charger_owner' ? 'Charger Owner Login' : 'Consumer Login')
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
                      onClick={() => {
                        setAuthMode('signin');
                        setError(null);
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
                      onClick={() => {
                        setAuthMode('signup');
                        setError(null);
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

                {/* Error Banner */}
                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Method Switcher: Email/Password vs Phone OTP */}
                <div className="flex items-center justify-center gap-4 mb-4 text-xs font-bold border-b border-[#D9DED5] dark:border-[#1E4844] pb-2">
                  <button
                    type="button"
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
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Rahul Sharma"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8F7F2] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#1E4844] text-xs sm:text-sm text-[#14201F] dark:text-white outline-none focus:border-[#19C7B1] transition-colors"
                          />
                        </div>
                      </div>
                    )}

                    {/* OWNER SPECIFIC REGISTRATION FIELDS (Section 6) */}
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
                              value={businessName}
                              onChange={(e) => setBusinessName(e.target.value)}
                              placeholder="e.g. Singhania EV Infrastructure LLP"
                              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#0D2422] border border-[#D9DED5] dark:border-[#1E4844] text-xs text-[#14201F] dark:text-white outline-none focus:border-[#19C7B1]"
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
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              placeholder="e.g. New Delhi, Bengaluru, Mumbai"
                              className="w-full pl-9 pr-3 py-2 rounded-lg bg-white dark:bg-[#0D2422] border border-[#D9DED5] dark:border-[#1E4844] text-xs text-[#14201F] dark:text-white outline-none focus:border-[#19C7B1]"
                            />
                          </div>
                        </div>

                        {/* Do you already own an EV charger */}
                        <div className="flex items-center justify-between text-xs pt-1">
                          <span className="font-semibold text-[#123C3A] dark:text-[#E4EFEA]">
                            Do you already own an EV charger?
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setOwnsCharger(true)}
                              className={`px-2.5 py-1 rounded-md text-xs font-bold cursor-pointer ${
                                ownsCharger ? 'bg-[#123C3A] text-white' : 'bg-gray-100 text-gray-500'
                              }`}
                            >
                              Yes
                            </button>
                            <button
                              type="button"
                              onClick={() => setOwnsCharger(false)}
                              className={`px-2.5 py-1 rounded-md text-xs font-bold cursor-pointer ${
                                !ownsCharger ? 'bg-[#123C3A] text-white' : 'bg-gray-100 text-gray-500'
                              }`}
                            >
                              No (Planning)
                            </button>
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
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={selectedRole === 'charger_owner' ? 'vikram@gocharge.in' : 'rahul@gocharge.in'}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8F7F2] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#1E4844] text-xs sm:text-sm text-[#14201F] dark:text-white outline-none focus:border-[#19C7B1] transition-colors"
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
                            onClick={() => {
                              setForgotPasswordOpen(true);
                              setForgotEmail(email);
                              setForgotMessage(null);
                            }}
                            className="text-[11px] font-bold text-[#19C7B1] hover:underline cursor-pointer"
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
                          minLength={6}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#F8F7F2] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#1E4844] text-xs sm:text-sm text-[#14201F] dark:text-white outline-none focus:border-[#19C7B1] transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-3 text-[#7A8C89] hover:text-[#123C3A] dark:hover:text-white transition-colors cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm shadow-glow-teal flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        selectedRole === 'charger_owner'
                          ? 'bg-[#073B35] dark:bg-[#18C5B7] hover:bg-[#0A4E46] dark:hover:bg-[#15A896] text-white dark:text-[#071715]'
                          : 'bg-[#19C7B1] hover:bg-[#15A896] text-white'
                      }`}
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
                {/* METHOD B: PHONE OTP FORM (INTEGRATION READINESS)          */}
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
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="e.g. Rahul Sharma"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F7F2] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#1E4844] text-xs sm:text-sm text-[#14201F] dark:text-white outline-none focus:border-[#19C7B1]"
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-xs font-bold text-[#123C3A] dark:text-[#CBDCD6] mb-1.5">
                            Indian Mobile Number *
                          </label>
                          <div className="flex items-center">
                            <span className="px-3.5 py-2.5 bg-[#E9EFE7] dark:bg-[#081B19] border border-r-0 border-[#D9DED5] dark:border-[#1E4844] rounded-l-xl text-xs font-bold text-[#5E716E] dark:text-[#8FAFA9]">
                              +91
                            </span>
                            <input
                              type="tel"
                              required
                              maxLength={10}
                              value={phone}
                              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                              placeholder="98765 43210"
                              className="w-full px-3.5 py-2.5 rounded-r-xl bg-[#F8F7F2] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#1E4844] text-xs sm:text-sm font-bold text-[#14201F] dark:text-white outline-none focus:border-[#19C7B1]"
                            />
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-[#19C7B1]/10 border border-[#19C7B1]/30 flex items-center gap-2 text-[11px] text-[#5E716E] dark:text-[#8FAFA9]">
                          <ShieldCheck className="w-4 h-4 text-[#19C7B1] shrink-0" />
                          <span>Phone OTP architecture is ready. Simulated demo code: any 4 numbers.</span>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3 rounded-xl bg-[#19C7B1] hover:bg-[#15A896] text-white text-xs sm:text-sm font-bold shadow-glow-teal flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>Get One-Time Password</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={handlePhoneVerifyOtp} className="space-y-4">
                        <p className="text-xs text-[#5E716E] dark:text-[#8FAFA9] text-center">
                          Enter the 4-digit verification code sent to <strong className="text-[#123C3A] dark:text-white">+91 {phone}</strong>
                        </p>

                        <div className="flex justify-center gap-2 my-2">
                          {[0, 1, 2, 3].map((idx) => (
                            <input
                              key={idx}
                              type="text"
                              maxLength={1}
                              value={otpValues[idx]}
                              onChange={(e) => {
                                const val = e.target.value;
                                const next = [...otpValues];
                                next[idx] = val;
                                setOtpValues(next);
                                if (val && idx < 3) {
                                  const nextInput = document.getElementById(`phone-otp-${idx + 1}`);
                                  nextInput?.focus();
                                }
                              }}
                              id={`phone-otp-${idx}`}
                              className="w-12 h-12 text-center text-lg font-bold rounded-xl bg-white dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#1E4844] text-[#123C3A] dark:text-white focus:border-[#19C7B1] outline-none"
                            />
                          ))}
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-3 rounded-xl bg-[#19C7B1] hover:bg-[#15A896] text-white text-xs sm:text-sm font-bold shadow-glow-teal flex items-center justify-center gap-2 cursor-pointer"
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

                {/* Google Sign In Integration Readiness */}
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#F8F7F2] dark:bg-[#081B19] hover:bg-[#E9EFE7] dark:hover:bg-[#112D2B] border border-[#D9DED5] dark:border-[#1E4844] text-xs font-bold text-[#14201F] dark:text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Continue with Google (Simulated OAuth)</span>
                </button>

                {/* Quick 1-Click Demo Fill for current role */}
                <div className="pt-4 text-center">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo(selectedRole)}
                    className="text-xs font-bold text-[#19C7B1] hover:underline cursor-pointer inline-flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Quick Fill & Login as Demo {selectedRole === 'charger_owner' ? 'Owner' : 'Consumer'}</span>
                  </button>
                </div>

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
              Enter your registered email address and we will dispatch a demo password recovery link.
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
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@gocharge.in"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F7F2] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#1E4844] text-xs text-[#14201F] dark:text-white outline-none focus:border-[#19C7B1]"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#19C7B1] text-white text-xs font-bold shadow cursor-pointer"
                >
                  Send Recovery Link
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
