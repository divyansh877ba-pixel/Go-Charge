import React, { useState } from 'react';
import { 
  X, Zap, MapPin, Clock, IndianRupee, ShieldCheck, 
  Edit3, Calendar, CheckCircle2, AlertCircle, Trash2, Power 
} from 'lucide-react';
import { HostCharger, ListingStatus } from '../../types/host';

interface ChargerDetailsModalProps {
  charger: HostCharger | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (charger: HostCharger) => void;
  onTogglePause: (id: string) => void;
}

export const ChargerDetailsModal: React.FC<ChargerDetailsModalProps> = ({
  charger,
  isOpen,
  onClose,
  onEdit,
  onTogglePause
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!isOpen || !charger) return null;

  const images = charger.images && charger.images.length > 0 
    ? charger.images 
    : ['https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-[#0D2422] rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-[#183E3A] my-8 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Bar */}
        <div className="relative h-48 sm:h-64 bg-gray-900">
          <img
            src={images[activeImageIndex] || images[0]}
            alt={charger.name}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 backdrop-blur-sm transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top category & status badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#123C3A]/90 text-[#19C7B1] backdrop-blur-sm">
              {charger.category}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm ${
              charger.status === 'active'
                ? 'bg-emerald-500/90 text-white'
                : charger.status === 'paused'
                ? 'bg-amber-500/90 text-white'
                : 'bg-blue-500/90 text-white'
            }`}>
              {charger.status.toUpperCase()}
            </span>
          </div>

          {/* Title & Specs on Image Overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h2 className="text-xl sm:text-2xl font-bold">{charger.name}</h2>
            <div className="flex items-center gap-3 text-xs text-white/90 mt-1">
              <span className="flex items-center gap-1 font-semibold text-[#19C7B1]">
                <Zap className="w-3.5 h-3.5" />
                {charger.capacityKw} kW • {charger.connectorType}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-white/70" />
                {charger.city}, {charger.state}
              </span>
            </div>
          </div>
        </div>

        {/* Thumbnail gallery if multiple */}
        {images.length > 1 && (
          <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-[#081B19] border-b border-gray-100 dark:border-[#183E3A] overflow-x-auto">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                  activeImageIndex === idx ? 'border-[#19C7B1] ring-2 ring-[#19C7B1]/30' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 dark:text-[#7A9E99] uppercase tracking-wider">Host Description</h4>
            <p className="text-sm text-gray-700 dark:text-[#CBDCD6] mt-1 leading-relaxed">
              {charger.description || 'Verified private charger bay available on Go Charge community host network.'}
            </p>
          </div>

          {/* Key specs grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-gray-50 dark:bg-[#081B19] border border-gray-100 dark:border-[#183E3A]">
              <div className="text-[11px] text-gray-400 dark:text-[#7A9E99] font-medium">Tariff</div>
              <div className="text-base font-bold text-[#123C3A] dark:text-[#18C5B7] flex items-center mt-0.5">
                <IndianRupee className="w-3.5 h-3.5" />
                <span>{charger.pricePerKwh}/kWh</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-gray-50 dark:bg-[#081B19] border border-gray-100 dark:border-[#183E3A]">
              <div className="text-[11px] text-gray-400 dark:text-[#7A9E99] font-medium">Min Duration</div>
              <div className="text-base font-bold text-gray-800 dark:text-[#E4EFEA] mt-0.5">
                {charger.minDurationMinutes} mins
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-gray-50 dark:bg-[#081B19] border border-gray-100 dark:border-[#183E3A]">
              <div className="text-[11px] text-gray-400 dark:text-[#7A9E99] font-medium">Availability</div>
              <div className="text-base font-bold text-gray-800 dark:text-[#E4EFEA] mt-0.5">
                {charger.is24x7 ? '24/7 All Day' : `${charger.openingTime} - ${charger.closingTime}`}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-gray-50 dark:bg-[#081B19] border border-gray-100 dark:border-[#183E3A]">
              <div className="text-[11px] text-gray-400 dark:text-[#7A9E99] font-medium">Total Earned</div>
              <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 flex items-center mt-0.5">
                <IndianRupee className="w-3.5 h-3.5" />
                <span>{(charger.totalEarnings || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Address & GPS */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#081B19] border border-gray-100 dark:border-[#183E3A] space-y-2">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#19C7B1] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-gray-800 dark:text-[#E4EFEA]">Physical Address</div>
                <div className="text-xs text-gray-600 dark:text-[#8FAFA9] mt-0.5">
                  {charger.address}, {charger.city}, {charger.state} — {charger.pincode}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-[#7A9E99] pt-2 border-t border-gray-200/60 dark:border-[#183E3A] font-mono">
              <span>Lat: {charger.lat.toFixed(5)}</span>
              <span>•</span>
              <span>Lng: {charger.lng.toFixed(5)}</span>
              <span className="text-emerald-600 dark:text-emerald-400 ml-auto font-sans font-semibold text-[11px] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                GPS Verified
              </span>
            </div>
          </div>

          {/* Days available chips */}
          <div>
            <div className="text-xs font-semibold text-gray-400 dark:text-[#7A9E99] uppercase tracking-wider mb-2">Operational Days</div>
            <div className="flex flex-wrap gap-1.5">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                const isAvail = charger.availableDays.includes(day);
                return (
                  <span
                    key={day}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                      isAvail 
                        ? 'bg-[#123C3A] dark:bg-[#18C5B7] text-white dark:text-[#071715]' 
                        : 'bg-gray-100 dark:bg-[#081B19] text-gray-400 dark:text-[#5E716E] line-through'
                    }`}
                  >
                    {day}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 bg-gray-50 dark:bg-[#081B19] border-t border-gray-100 dark:border-[#183E3A] flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              onTogglePause(charger.id);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              charger.status === 'paused'
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{charger.status === 'paused' ? 'Resume Listing' : 'Pause Listing'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(charger);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#123C3A] hover:bg-[#164846] dark:bg-[#18C5B7] dark:hover:bg-[#2FE0D2] text-white dark:text-[#071715] transition-colors flex items-center gap-1.5 shadow cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#19C7B1] dark:text-[#071715]" />
              <span>Edit Details</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#0D2422] border border-gray-200 dark:border-[#183E3A] text-gray-700 dark:text-[#E4EFEA] hover:bg-gray-100 dark:hover:bg-[#123431] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
