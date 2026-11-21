import React, { useState } from 'react';
import { 
  Search, MapPin, Bike, Car, ChevronDown, 
  ArrowRight, Check, Sparkles, LocateFixed, Shield, X 
} from 'lucide-react';
import { VehicleModel, INDIAN_EV_DATABASE } from '../../data/vehicles';

interface VehicleHeroWidgetProps {
  onSearch: (query: string, vehicle: VehicleModel | null) => void;
  onOpenVehicleModal: () => void;
  selectedVehicle: VehicleModel | null;
  onSelectVehicle: (vehicle: VehicleModel | null) => void;
  onDetectLocation: () => void;
  isLocating?: boolean;
}

export const VehicleHeroWidget: React.FC<VehicleHeroWidgetProps> = ({
  onSearch,
  onOpenVehicleModal,
  selectedVehicle,
  onSelectVehicle,
  onDetectLocation,
  isLocating = false,
}) => {
  const [locationInput, setLocationInput] = useState('');
  const [vehicleTab, setVehicleTab] = useState<'4-Wheeler' | '2-Wheeler'>(selectedVehicle?.category || '4-Wheeler');

  // Quick popular vehicle options for desktop view
  const popularVehicles = INDIAN_EV_DATABASE.filter(
    (v) => v.category === vehicleTab && v.popular
  ).slice(0, 4);

  // Fallback vehicle for current tab if none selected
  const activeVehicle = selectedVehicle?.category === vehicleTab 
    ? selectedVehicle 
    : (popularVehicles[0] || selectedVehicle);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(locationInput, selectedVehicle);
  };

  const POPULAR_CITIES = ['Delhi NCR', 'Bengaluru', 'Mumbai', 'Pune', 'Hyderabad'];

  return (
    <div className="w-full max-w-2xl bg-white/95 dark:bg-[#0D2422]/95 backdrop-blur-xl rounded-2xl border border-[#D9DED5] dark:border-[#1E4844] shadow-2xl p-3.5 sm:p-6 transition-all duration-300">
      
      {/* 2W / 4W Category Toggle */}
      <div className="flex items-center justify-between mb-3 sm:mb-4 pb-2.5 sm:pb-3 border-b border-[#D9DED5]/70 dark:border-[#1E4844]/70">
        <div className="flex items-center gap-1 sm:gap-2 p-1 bg-[#F4F1E8] dark:bg-[#081B19] rounded-xl border border-[#D9DED5] dark:border-[#1E4844]">
          <button
            type="button"
            onClick={() => {
              setVehicleTab('4-Wheeler');
              if (selectedVehicle?.category !== '4-Wheeler') {
                const default4W = INDIAN_EV_DATABASE.find(v => v.id === 'tata-nexon-ev') || null;
                onSelectVehicle(default4W);
              }
            }}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
              vehicleTab === '4-Wheeler'
                ? 'bg-white dark:bg-[#112D2B] text-[#123C3A] dark:text-[#19C7B1] shadow-sm'
                : 'text-[#5E716E] dark:text-[#88ABA6] hover:text-[#123C3A] dark:hover:text-white'
            }`}
          >
            <Car className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#19C7B1]" />
            <span>4-Wheeler<span className="hidden sm:inline"> (Car / SUV)</span></span>
          </button>

          <button
            type="button"
            onClick={() => {
              setVehicleTab('2-Wheeler');
              if (selectedVehicle?.category !== '2-Wheeler') {
                const default2W = INDIAN_EV_DATABASE.find(v => v.id === 'ather-450x') || null;
                onSelectVehicle(default2W);
              }
            }}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
              vehicleTab === '2-Wheeler'
                ? 'bg-white dark:bg-[#112D2B] text-[#123C3A] dark:text-[#19C7B1] shadow-sm'
                : 'text-[#5E716E] dark:text-[#88ABA6] hover:text-[#123C3A] dark:hover:text-white'
            }`}
          >
            <Bike className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#19C7B1]" />
            <span>2-Wheeler<span className="hidden sm:inline"> (Scooter / Bike)</span></span>
          </button>
        </div>

        <button
          type="button"
          onClick={onOpenVehicleModal}
          className="text-xs font-bold text-[#19C7B1] hover:underline flex items-center gap-1 cursor-pointer py-1"
        >
          <span>All Models</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        
        {/* MOBILE VIEW (< sm): Compact Vehicle Card with Prominent Change Action */}
        <div className="sm:hidden">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5E716E] dark:text-[#8FAFA9] mb-1">
            Selected Vehicle:
          </label>
          <div 
            onClick={onOpenVehicleModal}
            className="p-2.5 rounded-xl bg-[#F4F1E8] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#1E4844] hover:border-[#19C7B1] flex items-center justify-between gap-2.5 cursor-pointer transition-all shadow-sm group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#19C7B1]/15 text-[#19C7B1] flex items-center justify-center shrink-0">
                {vehicleTab === '4-Wheeler' ? <Car className="w-4 h-4" /> : <Bike className="w-4 h-4" />}
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-xs text-[#123C3A] dark:text-white truncate">
                  {activeVehicle ? `${activeVehicle.brand} ${activeVehicle.model}` : 'Select your EV'}
                </p>
                <p className="text-[10px] text-[#5E716E] dark:text-[#8FAFA9] truncate">
                  {activeVehicle ? `Uses ${activeVehicle.connectors.join(', ')}` : 'Auto-filters matching sockets'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenVehicleModal();
              }}
              className="px-2.5 py-1.5 rounded-lg bg-[#19C7B1]/15 hover:bg-[#19C7B1]/25 text-[#123C3A] dark:text-[#19C7B1] text-xs font-bold shrink-0 border border-[#19C7B1]/30 transition-all cursor-pointer"
            >
              Change
            </button>
          </div>
        </div>

        {/* DESKTOP VIEW (>= sm): Preserved Popular Grid Selector */}
        <div className="hidden sm:block">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5E716E] dark:text-[#8FAFA9] mb-1.5">
            Select Your Vehicle:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {popularVehicles.map((v) => {
              const isSelected = selectedVehicle?.id === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => onSelectVehicle(v)}
                  className={`p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#19C7B1]/15 dark:bg-[#19C7B1]/20 border-[#19C7B1] text-[#123C3A] dark:text-[#19C7B1] font-bold shadow-sm'
                      : 'bg-[#F4F1E8]/70 dark:bg-[#081B19]/70 border-[#D9DED5] dark:border-[#1E4844] text-[#14201F] dark:text-[#E4EFEA] hover:border-[#19C7B1]'
                  }`}
                >
                  <p className="text-xs font-bold truncate leading-tight">{v.brand}</p>
                  <p className="text-[10px] text-[#5E716E] dark:text-[#8FAFA9] truncate mt-0.5">{v.model}</p>
                </button>
              );
            })}
          </div>

          {/* Selected Vehicle Compatibility Feedback (Desktop) */}
          {selectedVehicle && (
            <div className="mt-2.5 p-2.5 rounded-xl bg-[#F4F1E8] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#1E4844] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#19C7B1] shrink-0" />
                <div>
                  <span className="font-extrabold text-[#123C3A] dark:text-white">
                    {selectedVehicle.brand} {selectedVehicle.model}
                  </span>
                  <span className="text-[#5E716E] dark:text-[#8FAFA9] ml-1.5">
                    • Uses {selectedVehicle.connectors.join(', ')}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenVehicleModal}
                className="text-[11px] font-bold text-[#19C7B1] hover:underline shrink-0 cursor-pointer"
              >
                Change
              </button>
            </div>
          )}
        </div>

        {/* Location Input & GPS Button */}
        <div>
          <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#5E716E] dark:text-[#8FAFA9] mb-1 sm:mb-1.5">
            Location:
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 min-w-0">
              <div className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-[#5E716E] dark:text-[#8FAFA9] pointer-events-none">
                <MapPin className="w-4 h-4 text-[#19C7B1]" />
              </div>
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Enter city, area or PIN code"
                className="w-full pl-9 sm:pl-10 pr-8 py-2.5 sm:py-3 rounded-xl bg-[#F4F1E8] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#1E4844] focus:border-[#19C7B1] focus:ring-2 focus:ring-[#19C7B1]/20 outline-none text-xs sm:text-sm text-[#14201F] dark:text-[#E4EFEA] placeholder-[#7A8C89] dark:placeholder-[#648782] transition-all"
              />
              {locationInput && (
                <button
                  type="button"
                  onClick={() => setLocationInput('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#7A8C89] hover:text-[#123C3A] dark:hover:text-white cursor-pointer"
                  title="Clear location"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={onDetectLocation}
              disabled={isLocating}
              className="h-10 sm:h-11 px-3 sm:px-3.5 rounded-xl bg-[#E9EFE7] dark:bg-[#081B19] hover:bg-white dark:hover:bg-[#112D2B] border border-[#D9DED5] dark:border-[#1E4844] text-[11px] sm:text-xs font-bold text-[#123C3A] dark:text-white hover:text-[#19C7B1] transition-all flex items-center gap-1.5 shadow-sm shrink-0 active:scale-95 cursor-pointer disabled:opacity-50"
              title="Detect current location"
            >
              <LocateFixed className={`w-3.5 h-3.5 text-[#19C7B1] ${isLocating ? 'animate-spin' : ''}`} />
              <span className="hidden xs:inline">{isLocating ? 'Locating...' : 'Near Me'}</span>
            </button>
          </div>

          {/* Accessible Quick Region Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1.5 text-[10px] sm:text-[11px]">
            <span className="text-[#7A8C89] dark:text-[#648782] shrink-0 font-medium">Quick:</span>
            {POPULAR_CITIES.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setLocationInput(city)}
                className={`px-2 py-0.5 rounded-md border shrink-0 transition-colors cursor-pointer ${
                  locationInput === city
                    ? 'bg-[#19C7B1]/20 border-[#19C7B1] text-[#123C3A] dark:text-[#19C7B1] font-bold'
                    : 'bg-[#F4F1E8] dark:bg-[#081B19] border-[#D9DED5] dark:border-[#1E4844] text-[#5E716E] dark:text-[#8FAFA9] hover:text-[#19C7B1] hover:border-[#19C7B1]'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          type="submit"
          className="w-full min-h-[46px] py-3 px-6 rounded-xl bg-[#19C7B1] hover:bg-[#15A896] active:scale-[0.99] text-white text-xs sm:text-sm font-extrabold shadow-glow-teal flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Search className="w-4 h-4" />
          <span>Find Compatible Chargers</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </form>
    </div>
  );
};
