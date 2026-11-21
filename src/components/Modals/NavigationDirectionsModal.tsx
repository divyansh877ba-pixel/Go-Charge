import React from 'react';
import { X, Navigation, ExternalLink, Milestone } from 'lucide-react';
import { Station } from '../../types';
import { calculateDistance, USER_CURRENT_LOCATION } from '../../data/mockStations';

interface NavigationDirectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  station: Station;
}

export const NavigationDirectionsModal: React.FC<NavigationDirectionsModalProps> = ({
  isOpen,
  onClose,
  station,
}) => {
  if (!isOpen) return null;

  const distance = calculateDistance(
    USER_CURRENT_LOCATION.lat,
    USER_CURRENT_LOCATION.lng,
    station.lat,
    station.lng
  );

  const durationMin = Math.max(8, Math.round((distance / 24) * 60));

  const steps = [
    { instruction: 'Head North on Shahid Bhagat Singh Rd towards Ballard Estate', dist: '650 m' },
    { instruction: 'Merge onto Eastern Freeway / P D\'Mello Road ramp', dist: '2.4 km' },
    { instruction: 'Take the elevated connector towards destination corridor', dist: `${(distance * 0.6).toFixed(1)} km` },
    { instruction: `Turn right towards ${station.area}`, dist: '800 m' },
    { instruction: `Arrive at ${station.name} charging bay entrance on the left`, dist: '50 m' },
  ];

  return (
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#123C3A]/60 dark:bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md p-5 sm:p-6 rounded-t-3xl sm:rounded-card bg-white dark:bg-[#0D2422] border-t sm:border border-[#D9DED5] dark:border-[#183E3A] shadow-2xl text-[#14201F] dark:text-[#E4EFEA] space-y-4 sm:space-y-5 max-h-[92dvh] overflow-y-auto pb-safe">
        {/* Mobile handle indicator */}
        <div className="w-12 h-1.5 rounded-full bg-[#D9DED5] dark:bg-[#183E3A] mx-auto mb-1 sm:hidden shrink-0" />
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D9DED5] dark:border-[#183E3A]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E9EFE7] dark:bg-[#081B19] text-[#19C7B1] flex items-center justify-center border border-[#D9DED5] dark:border-[#183E3A]">
              <Navigation className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#123C3A] dark:text-[#E4EFEA]">Turn-by-Turn Route</h3>
              <p className="text-[11px] text-[#5E716E] dark:text-[#8FAFA9]">Optimal route with real-time Indian traffic</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5E716E] dark:text-[#8FAFA9] hover:text-[#123C3A] dark:hover:text-white hover:bg-[#E9EFE7] dark:hover:bg-[#123431] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Origin & Destination Bar */}
        <div className="p-3.5 rounded-xl bg-[#E9EFE7] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#183E3A] space-y-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#123C3A] dark:bg-[#18C5B7] shrink-0 shadow-sm" />
            <div className="truncate">
              <p className="text-[10px] text-[#5E716E] dark:text-[#8FAFA9] uppercase font-bold">Start Location</p>
              <p className="font-bold text-[#123C3A] dark:text-[#E4EFEA] truncate">{USER_CURRENT_LOCATION.name}</p>
            </div>
          </div>

          <div className="border-l-2 border-dashed border-[#D9DED5] dark:border-[#183E3A] ml-1 pl-4 py-0.5" />

          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#19C7B1] shrink-0 shadow-glow-teal-sm" />
            <div className="truncate">
              <p className="text-[10px] text-[#19C7B1] uppercase font-bold">Charging Hub</p>
              <p className="font-bold text-[#123C3A] dark:text-[#E4EFEA] truncate">{station.name}</p>
            </div>
          </div>
        </div>

        {/* Route Stats */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-3 rounded-xl bg-[#F4F1E8] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#183E3A]">
            <span className="text-[10px] text-[#5E716E] dark:text-[#8FAFA9] uppercase font-bold">Total Distance</span>
            <p className="text-lg font-black text-[#123C3A] dark:text-[#E4EFEA] mt-0.5">{distance} km</p>
          </div>
          <div className="p-3 rounded-xl bg-[#F4F1E8] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#183E3A]">
            <span className="text-[10px] text-[#5E716E] dark:text-[#8FAFA9] uppercase font-bold">Estimated Time</span>
            <p className="text-lg font-black text-[#19C7B1] mt-0.5">~{durationMin} mins</p>
          </div>
        </div>

        {/* Step-by-step turns */}
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          <span className="text-xs font-bold text-[#123C3A] dark:text-[#E4EFEA]">Turn Instructions:</span>
          {steps.map((st, i) => (
            <div
              key={i}
              className="p-2.5 rounded-lg bg-[#E9EFE7] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#183E3A] text-xs flex items-start gap-2.5"
            >
              <Milestone className="w-3.5 h-3.5 text-[#19C7B1] shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-[#14201F] dark:text-[#E4EFEA] font-medium leading-snug">{st.instruction}</p>
                <span className="text-[10px] text-[#19C7B1] font-bold">{st.dist}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Open in Google Maps */}
        <div className="pt-2">
          <a
            href={`https://www.google.com/maps/dir/?api=1&origin=${USER_CURRENT_LOCATION.lat},${USER_CURRENT_LOCATION.lng}&destination=${station.lat},${station.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-btn bg-[#19C7B1] hover:bg-[#123C3A] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-glow-teal-sm cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Launch Live Navigation in Google Maps</span>
          </a>
        </div>

      </div>
    </div>
  );
};
