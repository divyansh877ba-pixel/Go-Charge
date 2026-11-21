import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Phone, MessageSquare, ShieldCheck, Clock, User, CheckCircle2, Building2 } from 'lucide-react';
import { Station } from '../../types';

interface ContactHostModalProps {
  isOpen: boolean;
  onClose: () => void;
  station: Station;
}

export const ContactHostModal: React.FC<ContactHostModalProps> = ({
  isOpen,
  onClose,
  station,
}) => {
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const host = station.hostInfo || {
    name: station.operator || 'Go Charge Community Host',
    type: (station.chargerCategory === 'Home' ? 'Verified Private Host' : 'Commercial Operator') as any,
    phone: '+91 98101 23456',
    rating: station.rating,
    memberSince: '2023',
    responseRate: '98%',
    verifiedElectrical: true
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-[2300] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#123C3A]/60 dark:bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="relative w-full max-w-md bg-[#FAF8F3] dark:bg-[#0D2422] rounded-t-3xl sm:rounded-2xl border-t sm:border border-[#D9DED5] dark:border-[#1E4844] shadow-2xl p-5 sm:p-6 text-[#14201F] dark:text-[#E4EFEA] space-y-4 max-h-[92dvh] overflow-y-auto pb-safe"
      >
        {/* Mobile handle indicator */}
        <div className="w-12 h-1.5 rounded-full bg-[#D9DED5] dark:bg-[#1E4844] mx-auto mb-1 sm:hidden shrink-0" />

        <div className="flex items-center justify-between pb-3 border-b border-[#D9DED5] dark:border-[#1E4844]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#19C7B1]/15 text-[#19C7B1] flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#123C3A] dark:text-white">Contact Station Host</h3>
              <p className="text-[11px] text-[#5E716E] dark:text-[#8FAFA9]">{station.name}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5E716E] dark:text-[#8FAFA9] hover:text-[#123C3A] dark:hover:text-white hover:bg-[#E9EFE7] dark:hover:bg-[#123633] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Host Profile Info Card */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#112D2B] border border-[#D9DED5] dark:border-[#1E4844] space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-bold text-[#123C3A] dark:text-white">{host.name}</h4>
              <p className="text-[11px] text-[#19C7B1] font-semibold">{host.type}</p>
              <p className="text-[10px] text-[#5E716E] dark:text-[#8FAFA9] mt-0.5">
                Host on Go Charge since {host.memberSince} · {host.rating} ★ rating
              </p>
            </div>
            {host.verifiedElectrical && (
              <span className="text-[10px] font-bold text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> CEA Verified
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#D9DED5] dark:border-[#1E4844] text-[11px]">
            <div>
              <span className="text-[#5E716E] dark:text-[#8FAFA9]">Response Rate:</span>
              <p className="font-bold text-[#123C3A] dark:text-white">{host.responseRate}</p>
            </div>
            <div>
              <span className="text-[#5E716E] dark:text-[#8FAFA9]">Typical Reply:</span>
              <p className="font-bold text-[#123C3A] dark:text-white">Within 5 minutes</p>
            </div>
          </div>
        </div>

        {/* Action: Call Host */}
        <div className="flex items-center gap-2">
          <a
            href={`tel:${host.phone || '+919810123456'}`}
            className="flex-1 py-2.5 px-3 rounded-xl bg-white dark:bg-[#112D2B] hover:bg-[#E9EFE7] dark:hover:bg-[#163836] border border-[#D9DED5] dark:border-[#1E4844] text-[#123C3A] dark:text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Phone className="w-3.5 h-3.5 text-[#19C7B1]" />
            <span>Call Host ({host.phone || '+91 98101 23456'})</span>
          </a>
        </div>

        {/* Message Host Form */}
        {!sent ? (
          <form onSubmit={handleSend} className="space-y-3">
            <label className="block text-xs font-bold text-[#5E716E] dark:text-[#8FAFA9]">
              Or send an instant in-app message:
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi, is the Type-2 socket free for the next 45 minutes? Arriving in 10 mins..."
              className="w-full p-3 rounded-xl bg-white dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#1E4844] text-xs text-[#14201F] dark:text-white outline-none focus:border-[#19C7B1]"
            />

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#19C7B1] hover:bg-[#15A896] text-white font-bold text-xs shadow-glow-teal-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Send Message to Host</span>
            </button>
          </form>
        ) : (
          <div className="p-4 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/40 text-center space-y-1">
            <CheckCircle2 className="w-6 h-6 text-[#22C55E] mx-auto" />
            <p className="text-xs font-bold text-[#123C3A] dark:text-white">Message Delivered to Host!</p>
            <p className="text-[11px] text-[#5E716E] dark:text-[#8FAFA9]">The host has been notified on Go Charge.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
