import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, ArrowRight, LogOut, CheckCircle2, Car, Zap, X } from 'lucide-react';
import { AuthUser, UserRole } from '../../hooks/useAuth';

interface RoleGuardModalProps {
  isOpen: boolean;
  currentUser: AuthUser;
  requiredRole: UserRole;
  onSwitchAccount: () => void;
  onGoToOwnDashboard: () => void;
  onClose: () => void;
}

export const RoleGuardModal: React.FC<RoleGuardModalProps> = ({
  isOpen,
  currentUser,
  requiredRole,
  onSwitchAccount,
  onGoToOwnDashboard,
  onClose,
}) => {
  if (!isOpen) return null;

  const isRequiringOwner = requiredRole === 'charger_owner';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white dark:bg-[#0E2725] rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-[#D9DED5] dark:border-[#1E4844] relative"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Banner */}
          <div className="p-6 pb-4 bg-gradient-to-br from-[#073B35] to-[#0A4D46] text-white">
            <div className="w-12 h-12 rounded-2xl bg-[#18C5B7]/20 flex items-center justify-center text-[#18C5B7] mb-3">
              <ShieldAlert className="w-6 h-6 text-[#18C5B7]" />
            </div>
            <h3 className="text-xl font-extrabold tracking-tight">
              {isRequiringOwner ? 'Host Access Required' : 'Consumer Portal Access'}
            </h3>
            <p className="text-xs text-[#B4D7D2] mt-1">
              Role-based session restriction
            </p>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#F8F7F2] dark:bg-[#071715] border border-[#D9DED5] dark:border-[#163835]">
              <span className="text-[#7A8C89] block mb-1">Currently Signed In As:</span>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#18C5B7]/20 flex items-center justify-center text-[#18C5B7] font-bold">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#123C3A] dark:text-white leading-tight">
                    {currentUser.name}
                  </h4>
                  <span className="text-[10px] font-mono font-bold text-[#18C5B7] uppercase tracking-wider">
                    Role: {currentUser.role.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-gray-600 dark:text-[#A3CCC7] leading-relaxed">
              {isRequiringOwner ? (
                <>
                  The <strong className="text-[#123C3A] dark:text-white">Charger Owner Dashboard</strong> contains sensitive financial earnings, hardware telemetry, and host booking settings reserved for listed hosts.
                </>
              ) : (
                <>
                  The <strong className="text-[#123C3A] dark:text-white">Consumer Dashboard</strong> is designed for EV drivers managing vehicles and charging reservations.
                </>
              )}
            </p>

            <div className="pt-3 space-y-2.5">
              {/* Primary: Go to user's proper dashboard */}
              <button
                type="button"
                onClick={onGoToOwnDashboard}
                className="w-full py-3 px-4 rounded-2xl bg-[#18C5B7] hover:bg-[#15A896] text-[#071715] font-extrabold text-xs flex items-center justify-center gap-2 shadow-glow-teal-sm transition-all cursor-pointer"
              >
                {isRequiringOwner ? (
                  <>
                    <Car className="w-4 h-4" />
                    <span>Go to My Consumer Dashboard</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Return to Owner Dashboard</span>
                  </>
                )}
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Secondary: Switch Account / Sign in with required role */}
              <button
                type="button"
                onClick={onSwitchAccount}
                className="w-full py-2.5 px-4 rounded-2xl bg-[#E9EFE7] dark:bg-[#071715] hover:bg-[#D9DED5] dark:hover:bg-[#123633] text-[#123C3A] dark:text-white font-bold text-xs flex items-center justify-center gap-2 border border-[#D9DED5] dark:border-[#1E4844] transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-red-500" />
                <span>
                  Switch Account ({isRequiringOwner ? 'Login as Owner' : 'Login as Consumer'})
                </span>
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
