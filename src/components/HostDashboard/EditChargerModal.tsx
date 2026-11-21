import React, { useState, useEffect } from 'react';
import { 
  X, Save, Zap, IndianRupee, Clock, CheckCircle2, 
  AlertCircle, ShieldCheck 
} from 'lucide-react';
import { HostCharger, ListingStatus } from '../../types/host';

interface EditChargerModalProps {
  charger: HostCharger | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<HostCharger>) => void;
}

export const EditChargerModal: React.FC<EditChargerModalProps> = ({
  charger,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<HostCharger>>({});

  useEffect(() => {
    if (charger) {
      setFormData({
        name: charger.name,
        description: charger.description,
        pricePerKwh: charger.pricePerKwh,
        minDurationMinutes: charger.minDurationMinutes,
        is24x7: charger.is24x7,
        openingTime: charger.openingTime,
        closingTime: charger.closingTime,
        status: charger.status,
        availableDays: charger.availableDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      });
    }
  }, [charger]);

  if (!isOpen || !charger) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(charger.id, formData);
    onClose();
  };

  const toggleDay = (day: string) => {
    const current = formData.availableDays || [];
    if (current.includes(day)) {
      if (current.length === 1) return; // Keep at least one
      setFormData({ ...formData, availableDays: current.filter((d) => d !== day) });
    } else {
      setFormData({ ...formData, availableDays: [...current, day] });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-[#0D2422] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border-t sm:border border-gray-100 dark:border-[#183E3A] flex flex-col max-h-[92dvh] sm:max-h-[85vh] pb-safe sm:pb-0 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Mobile Swipe Handle Indicator */}
        <div className="sm:hidden w-full pt-2.5 pb-1 flex justify-center shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-[#183E3A]" />
        </div>

        <div className="px-5 sm:px-6 py-4 bg-[#123C3A] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#19C7B1]/20 flex items-center justify-center text-[#19C7B1]">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base">Edit Charger Listing</h3>
              <p className="text-xs text-white/70">Update pricing, operational hours & availability</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 flex-1 overflow-y-auto">
          {/* Charger Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-[#CBDCD6] mb-1.5">
              Charger Display Name
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#081B19] border border-gray-200 dark:border-[#183E3A] text-gray-900 dark:text-[#E4EFEA] rounded-xl focus:ring-2 focus:ring-[#19C7B1] dark:focus:ring-[#18C5B7] focus:outline-none"
              required
            />
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-[#CBDCD6] mb-1.5">
              Listing Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['active', 'paused', 'pending'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setFormData({ ...formData, status: st })}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold capitalize border transition-all cursor-pointer ${
                    formData.status === st
                      ? 'bg-[#123C3A] dark:bg-[#18C5B7] text-white dark:text-[#071715] border-[#123C3A] dark:border-[#18C5B7] shadow-sm'
                      : 'bg-gray-50 dark:bg-[#081B19] text-gray-600 dark:text-[#8FAFA9] border-gray-200 dark:border-[#183E3A] hover:bg-gray-100 dark:hover:bg-[#123431]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing & Min Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-[#CBDCD6] mb-1.5">
                Tariff (₹ / kWh)
              </label>
              <div className="relative">
                <IndianRupee className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#7A9E99]" />
                <input
                  type="number"
                  min="5"
                  max="100"
                  step="0.5"
                  value={formData.pricePerKwh || 16}
                  onChange={(e) => setFormData({ ...formData, pricePerKwh: parseFloat(e.target.value) || 16 })}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-[#081B19] border border-gray-200 dark:border-[#183E3A] text-gray-900 dark:text-[#E4EFEA] rounded-xl focus:ring-2 focus:ring-[#19C7B1] dark:focus:ring-[#18C5B7] focus:outline-none font-bold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-[#CBDCD6] mb-1.5">
                Min Duration (Mins)
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#7A9E99]" />
                <select
                  value={formData.minDurationMinutes || 30}
                  onChange={(e) => setFormData({ ...formData, minDurationMinutes: parseInt(e.target.value, 10) })}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-[#081B19] border border-gray-200 dark:border-[#183E3A] text-gray-900 dark:text-[#E4EFEA] rounded-xl focus:ring-2 focus:ring-[#19C7B1] dark:focus:ring-[#18C5B7] focus:outline-none"
                >
                  <option value={15}>15 mins</option>
                  <option value={30}>30 mins</option>
                  <option value={45}>45 mins</option>
                  <option value={60}>60 mins</option>
                </select>
              </div>
            </div>
          </div>

          {/* 24/7 Availability Toggle */}
          <div className="p-3.5 rounded-xl border border-gray-200 dark:border-[#183E3A] bg-gray-50 dark:bg-[#081B19] flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-gray-900 dark:text-[#E4EFEA]">24/7 All-Day Access</div>
              <div className="text-[11px] text-gray-500 dark:text-[#8FAFA9]">Enable round-the-clock driver bookings</div>
            </div>
            <input
              type="checkbox"
              checked={formData.is24x7 || false}
              onChange={(e) => setFormData({ ...formData, is24x7: e.target.checked })}
              className="w-5 h-5 rounded text-[#19C7B1] focus:ring-[#19C7B1] cursor-pointer accent-[#19C7B1]"
            />
          </div>

          {!formData.is24x7 && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-[#CBDCD6] mb-1">
                  Opening Time
                </label>
                <input
                  type="time"
                  value={formData.openingTime || '06:00'}
                  onChange={(e) => setFormData({ ...formData, openingTime: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm bg-white dark:bg-[#081B19] border border-gray-200 dark:border-[#183E3A] text-gray-900 dark:text-[#E4EFEA] rounded-xl focus:ring-2 focus:ring-[#19C7B1] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-[#CBDCD6] mb-1">
                  Closing Time
                </label>
                <input
                  type="time"
                  value={formData.closingTime || '22:00'}
                  onChange={(e) => setFormData({ ...formData, closingTime: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm bg-white dark:bg-[#081B19] border border-gray-200 dark:border-[#183E3A] text-gray-900 dark:text-[#E4EFEA] rounded-xl focus:ring-2 focus:ring-[#19C7B1] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Available Days */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-[#CBDCD6] mb-1.5">
              Available Days of Week
            </label>
            <div className="flex flex-wrap gap-1.5">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                const isSelected = (formData.availableDays || []).includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      isSelected 
                        ? 'bg-[#123C3A] dark:bg-[#18C5B7] text-white dark:text-[#071715]' 
                        : 'bg-gray-100 dark:bg-[#081B19] text-gray-500 dark:text-[#7A9E99] hover:bg-gray-200 dark:hover:bg-[#163834]'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-[#CBDCD6] mb-1.5">
              Host Notes / Directions
            </label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#081B19] border border-gray-200 dark:border-[#183E3A] text-gray-900 dark:text-[#E4EFEA] rounded-xl focus:ring-2 focus:ring-[#19C7B1] dark:focus:ring-[#18C5B7] focus:outline-none"
              placeholder="e.g. Ring doorbell at gate 2 or mention Go Charge booking to guard."
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-[#183E3A]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-[#E4EFEA] bg-gray-100 dark:bg-[#081B19] rounded-xl hover:bg-gray-200 dark:hover:bg-[#163834] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white dark:text-[#071715] bg-[#123C3A] hover:bg-[#164846] dark:bg-[#18C5B7] dark:hover:bg-[#2FE0D2] rounded-xl transition-colors flex items-center gap-1.5 shadow cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-[#19C7B1] dark:text-[#071715]" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
