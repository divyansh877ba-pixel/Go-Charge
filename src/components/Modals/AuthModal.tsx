import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Zap, Smartphone, Mail, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (user: { name: string; phone: string; role: 'driver' | 'host' }) => void;
  onLogin?: (user: { name: string; phone: string; role: 'driver' | 'host' }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onLogin,
}) => {
  const [role, setRole] = useState<'driver' | 'host'>('driver');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileNumber.length >= 10) {
      setOtpStep(true);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const demoUser = {
      name: name.trim() || (role === 'host' ? 'Go Charge Host' : 'EV Driver'),
      phone: `+91 ${mobileNumber}`,
      role
    };
    try {
      localStorage.setItem('amperway_user', JSON.stringify(demoUser));
      localStorage.setItem('gocharge_user', JSON.stringify(demoUser));
    } catch (e) {}

    if (onLogin) {
      onLogin(demoUser);
    } else if (onLoginSuccess) {
      onLoginSuccess(demoUser);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[2300] flex items-center justify-center p-4 bg-[#123C3A]/60 dark:bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        className="relative w-full max-w-md bg-[#FAF8F3] dark:bg-[#0D2422] rounded-2xl border border-[#D9DED5] dark:border-[#1E4844] shadow-2xl p-6 overflow-hidden text-[#14201F] dark:text-[#E4EFEA]"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#D9DED5] dark:border-[#1E4844]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#19C7B1]/15 text-[#19C7B1] flex items-center justify-center">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#123C3A] dark:text-white">
                {otpStep ? 'Verify Phone OTP' : 'Login to Go Charge'}
              </h3>
              <p className="text-[11px] text-[#5E716E] dark:text-[#8FAFA9]">
                {role === 'driver' ? 'Book & discover EV chargers' : 'Manage your listed charging points'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5E716E] dark:text-[#8FAFA9] hover:text-[#123C3A] dark:hover:text-white hover:bg-[#E9EFE7] dark:hover:bg-[#123633] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Toggle */}
        {!otpStep && (
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#E9EFE7] dark:bg-[#081B19] rounded-xl border border-[#D9DED5] dark:border-[#1E4844] my-4 text-xs font-bold">
            <button
              type="button"
              onClick={() => setRole('driver')}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                role === 'driver'
                  ? 'bg-white dark:bg-[#112D2B] text-[#123C3A] dark:text-[#19C7B1] shadow-sm'
                  : 'text-[#5E716E] dark:text-[#88ABA6]'
              }`}
            >
              EV Driver
            </button>
            <button
              type="button"
              onClick={() => setRole('host')}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                role === 'host'
                  ? 'bg-white dark:bg-[#112D2B] text-[#123C3A] dark:text-[#19C7B1] shadow-sm'
                  : 'text-[#5E716E] dark:text-[#88ABA6]'
              }`}
            >
              Charger Host
            </button>
          </div>
        )}

        {!otpStep ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#5E716E] dark:text-[#8FAFA9] mb-1.5">
                Full Name (Optional):
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#1E4844] text-xs text-[#14201F] dark:text-white outline-none focus:border-[#19C7B1]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5E716E] dark:text-[#8FAFA9] mb-1.5">
                Indian Mobile Number:
              </label>
              <div className="flex items-center">
                <span className="px-3 py-2.5 bg-[#E9EFE7] dark:bg-[#081B19] border border-r-0 border-[#D9DED5] dark:border-[#1E4844] rounded-l-xl text-xs font-bold text-[#5E716E] dark:text-[#8FAFA9]">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-r-xl bg-white dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#1E4844] text-xs font-bold text-[#14201F] dark:text-white outline-none focus:border-[#19C7B1]"
                />
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#19C7B1]/10 dark:bg-[#19C7B1]/15 border border-[#19C7B1]/30 flex items-center gap-2 text-[11px] text-[#5E716E] dark:text-[#8FAFA9]">
              <ShieldCheck className="w-4 h-4 text-[#19C7B1] shrink-0" />
              <span>Simulated demo OTP. Any 4-digit code works for testing.</span>
            </div>

            <button
              type="submit"
              disabled={mobileNumber.length < 10}
              className="w-full py-3 rounded-xl bg-[#19C7B1] hover:bg-[#15A896] text-white text-xs font-bold shadow-glow-teal flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
            >
              <span>Get Verification Code</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-xs text-[#5E716E] dark:text-[#8FAFA9]">
              Enter the 4-digit code sent to <strong className="text-[#123C3A] dark:text-white">+91 {mobileNumber}</strong>:
            </p>

            <div className="flex justify-center gap-2 my-2">
              {[0, 1, 2, 3].map((idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={otp[idx]}
                  onChange={(e) => {
                    const val = e.target.value;
                    const next = [...otp];
                    next[idx] = val;
                    setOtp(next);
                    if (val && idx < 3) {
                      const nextInput = document.getElementById(`demo-otp-${idx + 1}`);
                      nextInput?.focus();
                    }
                  }}
                  id={`demo-otp-${idx}`}
                  className="w-12 h-12 text-center text-lg font-bold rounded-xl bg-white dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#1E4844] text-[#123C3A] dark:text-white focus:border-[#19C7B1] outline-none"
                />
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#19C7B1] hover:bg-[#15A896] text-white text-xs font-bold shadow-glow-teal flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify & Continue</span>
            </button>

            <button
              type="button"
              onClick={() => setOtpStep(false)}
              className="w-full text-center text-xs text-[#5E716E] dark:text-[#8FAFA9] hover:underline"
            >
              Change Mobile Number
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
