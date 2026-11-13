import React, { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, ShieldCheck, Wallet, Bell, 
  CheckCircle2, Save, Sparkles, Building2, AlertCircle 
} from 'lucide-react';
import { HostProfile } from '../../types/host';

interface HostProfileTabProps {
  profile: HostProfile;
  onUpdateProfile: (updates: Partial<HostProfile>) => void;
}

export const HostProfileTab: React.FC<HostProfileTabProps> = ({
  profile,
  onUpdateProfile,
}) => {
  const [formData, setFormData] = useState<HostProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#123C3A] dark:text-[#E4EFEA]">Host Profile & Preferences</h2>
          <p className="text-sm text-gray-500 dark:text-[#8FAFA9] mt-0.5">
            Manage your host identity, contact information, automated payouts, and notification preferences
          </p>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#123C3A] hover:bg-[#164846] dark:bg-[#18C5B7] dark:hover:bg-[#2FE0D2] text-white dark:text-[#071715] font-bold text-sm transition-all shadow-sm cursor-pointer"
        >
          <Save className="w-4 h-4 text-[#19C7B1] dark:text-[#071715]" />
          <span>Save Changes</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm font-medium flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span>Host preferences and banking details saved successfully to local state!</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="bg-white dark:bg-[#0D2422] rounded-2xl border border-gray-200/80 dark:border-[#183E3A] p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-gray-100 dark:border-[#183E3A]">
          <div className="relative">
            <img
              src={formData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={formData.name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-[#19C7B1]/30 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shadow">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>

          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-[#E4EFEA]">{formData.name}</h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
                Verified Host
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-[#8FAFA9]">
              Host member since {formData.memberSince} • Delhi NCR Hub
            </p>
            <p className="text-xs text-gray-400 dark:text-[#7A9E99]">
              Avatar URL can be customized below
            </p>
          </div>
        </div>

        {/* Personal Details Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-[#CBDCD6] mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#7A9E99]" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-[#081B19] border border-gray-200 dark:border-[#183E3A] text-gray-900 dark:text-[#E4EFEA] rounded-xl focus:ring-2 focus:ring-[#19C7B1] dark:focus:ring-[#18C5B7] focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-[#CBDCD6] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#7A9E99]" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-[#081B19] border border-gray-200 dark:border-[#183E3A] text-gray-900 dark:text-[#E4EFEA] rounded-xl focus:ring-2 focus:ring-[#19C7B1] dark:focus:ring-[#18C5B7] focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-[#CBDCD6] mb-1.5">
              Mobile Phone
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#7A9E99]" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-[#081B19] border border-gray-200 dark:border-[#183E3A] text-gray-900 dark:text-[#E4EFEA] rounded-xl focus:ring-2 focus:ring-[#19C7B1] dark:focus:ring-[#18C5B7] focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-[#CBDCD6] mb-1.5">
              City / Base Location
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#7A9E99]" />
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-[#081B19] border border-gray-200 dark:border-[#183E3A] text-gray-900 dark:text-[#E4EFEA] rounded-xl focus:ring-2 focus:ring-[#19C7B1] dark:focus:ring-[#18C5B7] focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 dark:text-[#CBDCD6] mb-1.5">
              Avatar Image URL
            </label>
            <input
              type="url"
              value={formData.avatarUrl}
              onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-white dark:bg-[#081B19] border border-gray-200 dark:border-[#183E3A] text-gray-900 dark:text-[#E4EFEA] rounded-xl focus:ring-2 focus:ring-[#19C7B1] dark:focus:ring-[#18C5B7] focus:outline-none"
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      {/* Payout & Banking Settings */}
      <div className="bg-white dark:bg-[#0D2422] rounded-2xl border border-gray-200/80 dark:border-[#183E3A] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-[#123C3A] dark:text-[#18C5B7] flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-[#E4EFEA] text-base">Payout Bank & UPI</h3>
              <p className="text-xs text-gray-500 dark:text-[#8FAFA9]">Where earnings will be deposited weekly</p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-medium border border-blue-200 dark:border-blue-800">
            Mock Mode
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-[#CBDCD6] mb-1.5">
              Primary UPI ID (Instant Payouts)
            </label>
            <input
              type="text"
              value={formData.payoutUpi}
              onChange={(e) => setFormData({ ...formData, payoutUpi: e.target.value })}
              placeholder="e.g. yourname@hdfcbank"
              className="w-full px-4 py-2.5 text-sm bg-white dark:bg-[#081B19] border border-gray-200 dark:border-[#183E3A] text-gray-900 dark:text-[#E4EFEA] rounded-xl focus:ring-2 focus:ring-[#19C7B1] dark:focus:ring-[#18C5B7] focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-[#CBDCD6] mb-1.5">
              Bank Account / Branch Details
            </label>
            <input
              type="text"
              value={formData.payoutBank}
              onChange={(e) => setFormData({ ...formData, payoutBank: e.target.value })}
              placeholder="e.g. HDFC Bank - A/C •••• 4120"
              className="w-full px-4 py-2.5 text-sm bg-white dark:bg-[#081B19] border border-gray-200 dark:border-[#183E3A] text-gray-900 dark:text-[#E4EFEA] rounded-xl focus:ring-2 focus:ring-[#19C7B1] dark:focus:ring-[#18C5B7] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Host Automation & Notifications */}
      <div className="bg-white dark:bg-[#0D2422] rounded-2xl border border-gray-200/80 dark:border-[#183E3A] p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-[#E4EFEA] text-base">Booking Preferences & Alerts</h3>
            <p className="text-xs text-gray-500 dark:text-[#8FAFA9]">Configure how you receive session requests and notifications</p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <label className="flex items-start justify-between gap-4 p-3.5 rounded-xl border border-gray-200 dark:border-[#183E3A] hover:bg-gray-50/70 dark:hover:bg-[#123431] transition-colors cursor-pointer">
            <div>
              <div className="font-semibold text-sm text-gray-900 dark:text-[#E4EFEA]">Auto-Accept Driver Bookings</div>
              <p className="text-xs text-gray-500 dark:text-[#8FAFA9] mt-0.5">
                Automatically confirm bookings when bays are free during your set operating hours.
              </p>
            </div>
            <input
              type="checkbox"
              checked={formData.autoAcceptBookings}
              onChange={(e) => setFormData({ ...formData, autoAcceptBookings: e.target.checked })}
              className="w-5 h-5 rounded text-[#19C7B1] focus:ring-[#19C7B1] mt-0.5 cursor-pointer accent-[#19C7B1]"
            />
          </label>

          <label className="flex items-start justify-between gap-4 p-3.5 rounded-xl border border-gray-200 dark:border-[#183E3A] hover:bg-gray-50/70 dark:hover:bg-[#123431] transition-colors cursor-pointer">
            <div>
              <div className="font-semibold text-sm text-gray-900 dark:text-[#E4EFEA]">Email Session Receipts & Alerts</div>
              <p className="text-xs text-gray-500 dark:text-[#8FAFA9] mt-0.5">
                Get an email summary every time a vehicle starts and finishes charging.
              </p>
            </div>
            <input
              type="checkbox"
              checked={formData.notificationsEmail}
              onChange={(e) => setFormData({ ...formData, notificationsEmail: e.target.checked })}
              className="w-5 h-5 rounded text-[#19C7B1] focus:ring-[#19C7B1] mt-0.5 cursor-pointer accent-[#19C7B1]"
            />
          </label>

          <label className="flex items-start justify-between gap-4 p-3.5 rounded-xl border border-gray-200 dark:border-[#183E3A] hover:bg-gray-50/70 dark:hover:bg-[#123431] transition-colors cursor-pointer">
            <div>
              <div className="font-semibold text-sm text-gray-900 dark:text-[#E4EFEA]">SMS & WhatsApp Arrival Alerts</div>
              <p className="text-xs text-gray-500 dark:text-[#8FAFA9] mt-0.5">
                Real-time ping when the EV driver reaches your gate or driveway.
              </p>
            </div>
            <input
              type="checkbox"
              checked={formData.notificationsSms}
              onChange={(e) => setFormData({ ...formData, notificationsSms: e.target.checked })}
              className="w-5 h-5 rounded text-[#19C7B1] focus:ring-[#19C7B1] mt-0.5 cursor-pointer accent-[#19C7B1]"
            />
          </label>
        </div>
      </div>

      {/* Save Button Bar */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-[#123C3A] hover:bg-[#164846] dark:bg-[#18C5B7] dark:hover:bg-[#2FE0D2] text-white dark:text-[#071715] font-bold text-sm transition-all flex items-center gap-2 shadow-md cursor-pointer"
        >
          <Save className="w-4 h-4 text-[#19C7B1] dark:text-[#071715]" />
          <span>Save Profile Preferences</span>
        </button>
      </div>
    </form>
  );
};
