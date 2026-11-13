import React, { useState } from 'react';
import { 
  Settings, Shield, Zap, Bell, CheckCircle2, 
  Save, Key, Smartphone, Clock, AlertTriangle,
  Sun, Moon, Palette
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const SettingsTab: React.FC = () => {
  const { theme, setTheme, isDark, toggleTheme } = useTheme();
  const [autoAccept, setAutoAccept] = useState(true);
  const [gracePeriod, setGracePeriod] = useState(15);
  const [idleFee, setIdleFee] = useState(5);
  const [smartLoadBalancing, setSmartLoadBalancing] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Host SaaS Settings</h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-[#7A9E99] mt-0.5">
            Operational rules, appearance theme, OCPP hardware telemetry and alert preferences
          </p>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-[#073B35] dark:bg-[#18C5B7] text-white dark:text-[#073B35] font-bold text-xs sm:text-sm hover:bg-[#0a4e47] dark:hover:bg-[#15b2a5] transition-all flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <Save className="w-4 h-4 text-[#18C5B7] dark:text-[#073B35]" />
          <span>Save Settings</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Host operational parameters updated successfully!</span>
        </div>
      )}

      {/* Appearance & Theme Section */}
      <div className="bg-white dark:bg-[#0D2422] rounded-2xl p-6 border border-gray-100 dark:border-[#183E3A] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] space-y-4 transition-colors">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#18C5B7]/15 dark:bg-[#18C5B7]/25 text-[#18C5B7] flex items-center justify-center">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white">Interface Appearance</h3>
            <p className="text-xs text-gray-400 dark:text-[#7A9E99]">Customize the dashboard color theme</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Light Theme Card */}
          <div
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-3.5 ${
              theme === 'light'
                ? 'border-[#18C5B7] bg-[#18C5B7]/5 shadow-sm'
                : 'border-gray-200 dark:border-[#163B37] hover:border-gray-300 dark:hover:border-[#1F4E49]'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <span>Light Theme</span>
                {theme === 'light' && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#18C5B7] text-[#073B35]">Active</span>}
              </h4>
              <p className="text-[11px] text-gray-500 dark:text-[#7A9E99] mt-0.5">Classic cream background (#F8F7F2) with teal accents</p>
            </div>
          </div>

          {/* Dark Theme Card */}
          <div
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-3.5 ${
              theme === 'dark'
                ? 'border-[#18C5B7] bg-[#18C5B7]/10 shadow-sm'
                : 'border-gray-200 dark:border-[#163B37] hover:border-gray-300 dark:hover:border-[#1F4E49]'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#073B35] text-[#18C5B7] flex items-center justify-center flex-shrink-0 border border-[#18C5B7]/30">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <span>Dark Theme</span>
                {theme === 'dark' && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#18C5B7] text-[#073B35]">Active</span>}
              </h4>
              <p className="text-[11px] text-gray-500 dark:text-[#7A9E99] mt-0.5">Deep midnight teal (#081917) optimized for low-light environments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Rules */}
      <div className="bg-white dark:bg-[#0D2422] rounded-2xl p-6 border border-gray-100 dark:border-[#183E3A] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] space-y-4 transition-colors">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#18C5B7]/15 dark:bg-[#18C5B7]/25 text-[#18C5B7] flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white">Bay Access & Booking Rules</h3>
            <p className="text-xs text-gray-400 dark:text-[#7A9E99]">Rules applied when EV drivers reserve charging slots</p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <label className="flex items-start justify-between gap-4 p-3.5 rounded-xl border border-gray-200 dark:border-[#183E3A] hover:bg-gray-50/70 dark:hover:bg-[#091D1B] transition-colors cursor-pointer">
            <div>
              <div className="font-semibold text-sm text-gray-900 dark:text-white">Instant Auto-Accept Bookings</div>
              <p className="text-xs text-gray-500 dark:text-[#7A9E99] mt-0.5">
                Automatically confirm driver bookings when the requested bay is unoccupied during operational hours.
              </p>
            </div>
            <input
              type="checkbox"
              checked={autoAccept}
              onChange={(e) => setAutoAccept(e.target.checked)}
              className="w-5 h-5 rounded text-[#18C5B7] focus:ring-[#18C5B7] accent-[#18C5B7] cursor-pointer mt-0.5"
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Arrival Grace Period (Minutes)
              </label>
              <select
                value={gracePeriod}
                onChange={(e) => setGracePeriod(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-[#0E2725] border border-gray-200 dark:border-[#1C4642] text-gray-900 dark:text-[#D5EAE5] rounded-xl focus:ring-2 focus:ring-[#18C5B7] focus:outline-none"
              >
                <option value={10}>10 minutes grace</option>
                <option value={15}>15 minutes grace (Recommended)</option>
                <option value={20}>20 minutes grace</option>
                <option value={30}>30 minutes grace</option>
              </select>
              <p className="text-[11px] text-gray-400 dark:text-[#648782] mt-1">Slot is automatically released if driver doesn't arrive.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Post-Charge Idle Fee (₹ / min)
              </label>
              <input
                type="number"
                min="0"
                max="25"
                value={idleFee}
                onChange={(e) => setIdleFee(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-[#0E2725] border border-gray-200 dark:border-[#1C4642] text-gray-900 dark:text-[#D5EAE5] rounded-xl focus:ring-2 focus:ring-[#18C5B7] focus:outline-none font-bold"
              />
              <p className="text-[11px] text-gray-400 dark:text-[#648782] mt-1">Applies 10 minutes after vehicle battery hits 100%.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hardware & Telemetry */}
      <div className="bg-white dark:bg-[#0D2422] rounded-2xl p-6 border border-gray-100 dark:border-[#183E3A] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] space-y-4 transition-colors">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#073B35] text-[#18C5B7] flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white">Hardware & OCPP 2.0.1 Telemetry</h3>
            <p className="text-xs text-gray-400 dark:text-[#7A9E99]">Connection string for smart chargers & EVSE cloud integration</p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              OCPP WebSocket Endpoint
            </label>
            <input
              type="text"
              readOnly
              value="wss://ocpp.gocharge.in/v2/host-hub-4492"
              className="w-full px-3.5 py-2.5 text-xs bg-gray-50 dark:bg-[#071715] border border-gray-200 dark:border-[#1C4642] text-gray-600 dark:text-[#18C5B7] font-mono select-all rounded-xl"
            />
          </div>

          <label className="flex items-start justify-between gap-4 p-3.5 rounded-xl border border-gray-200 dark:border-[#183E3A] hover:bg-gray-50/70 dark:hover:bg-[#091D1B] transition-colors cursor-pointer">
            <div>
              <div className="font-semibold text-sm text-gray-900 dark:text-white">Automated Smart Load Balancing</div>
              <p className="text-xs text-gray-500 dark:text-[#7A9E99] mt-0.5">
                Dynamic power throttling to keep total draw under your sanctioned building transformer threshold.
              </p>
            </div>
            <input
              type="checkbox"
              checked={smartLoadBalancing}
              onChange={(e) => setSmartLoadBalancing(e.target.checked)}
              className="w-5 h-5 rounded text-[#18C5B7] focus:ring-[#18C5B7] accent-[#18C5B7] cursor-pointer mt-0.5"
            />
          </label>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white dark:bg-[#0D2422] rounded-2xl p-6 border border-gray-100 dark:border-[#183E3A] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] space-y-4 transition-colors">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-300 flex items-center justify-center">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white">Instant Alert Channels</h3>
            <p className="text-xs text-gray-400 dark:text-[#7A9E99]">Where you receive session begins, completions, and payouts</p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <label className="flex items-start justify-between gap-4 p-3.5 rounded-xl border border-gray-200 dark:border-[#183E3A] hover:bg-gray-50/70 dark:hover:bg-[#091D1B] transition-colors cursor-pointer">
            <div>
              <div className="font-semibold text-sm text-gray-900 dark:text-white">WhatsApp Live Pings</div>
              <p className="text-xs text-gray-500 dark:text-[#7A9E99] mt-0.5">Instant message when an EV driver arrives at your gate.</p>
            </div>
            <input
              type="checkbox"
              checked={whatsappAlerts}
              onChange={(e) => setWhatsappAlerts(e.target.checked)}
              className="w-5 h-5 rounded text-[#18C5B7] focus:ring-[#18C5B7] accent-[#18C5B7] cursor-pointer mt-0.5"
            />
          </label>

          <label className="flex items-start justify-between gap-4 p-3.5 rounded-xl border border-gray-200 dark:border-[#183E3A] hover:bg-gray-50/70 dark:hover:bg-[#091D1B] transition-colors cursor-pointer">
            <div>
              <div className="font-semibold text-sm text-gray-900 dark:text-white">Daily Revenue Summary Email</div>
              <p className="text-xs text-gray-500 dark:text-[#7A9E99] mt-0.5">Daily midnight email digest with energy delivered and gross revenue.</p>
            </div>
            <input
              type="checkbox"
              checked={emailDigest}
              onChange={(e) => setEmailDigest(e.target.checked)}
              className="w-5 h-5 rounded text-[#18C5B7] focus:ring-[#18C5B7] accent-[#18C5B7] cursor-pointer mt-0.5"
            />
          </label>
        </div>
      </div>

    </form>
  );
};
