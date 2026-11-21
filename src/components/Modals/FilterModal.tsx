import React from 'react';
import { X, SlidersHorizontal, Check, RefreshCw, Zap, ShieldCheck, Bike, Car, Clock, IndianRupee } from 'lucide-react';
import { FilterCategory } from '../../types';
import { VehicleModel } from '../../data/vehicles';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeFilter: FilterCategory;
  onSelectFilter: (f: FilterCategory) => void;
  onReset: () => void;
  selectedVehicle?: VehicleModel | null;
  onlyCompatible?: boolean;
  onToggleCompatible?: () => void;
  onOpenVehicleModal?: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  activeFilter,
  onSelectFilter,
  onReset,
  selectedVehicle,
  onlyCompatible = false,
  onToggleCompatible,
  onOpenVehicleModal,
}) => {
  if (!isOpen) return null;

  const categories: { label: string; value: FilterCategory; desc: string; icon: any }[] = [
    { label: 'All Stations', value: 'All', desc: 'Verified stations across all Indian cities and highways', icon: Zap },
    { label: '4-Wheelers Only', value: '4-Wheeler', desc: 'Electric cars & SUVs (CCS2 & Type-2)', icon: Car },
    { label: '2-Wheelers Only', value: '2-Wheeler', desc: 'Electric scooters & bikes (LECCS, Bharat AC, Ola)', icon: Bike },
    { label: 'DC Fast Charging (50kW+)', value: 'Fast Charge 50kW+', desc: 'High-speed fast charging (10%–80% under 45 mins)', icon: Zap },
    { label: 'AC Charging (Normal/Fast)', value: 'AC', desc: 'Destination wallboxes (3.3kW to 22kW AC)', icon: Zap },
    { label: 'CCS2 Connectors', value: 'CCS2', desc: 'Universal Indian 4W DC standard (Tata, MG, Mahindra, etc.)', icon: Zap },
    { label: 'Type-2 Connectors', value: 'Type-2', desc: 'Standard European & Indian AC plug', icon: Zap },
    { label: 'LECCS / Type 7 (2W)', value: 'LECCS', desc: 'BIS national standard for Ather, Hero Vida & 2-wheelers', icon: Bike },
    { label: 'Bharat AC-001', value: 'Bharat AC', desc: '3-port community standard AC charging (societies & homes)', icon: Zap },
    { label: 'Available Now', value: 'Available Now', desc: 'Only show stations with free bays right this moment', icon: Clock },
  ];

  return (
    <div className="fixed inset-0 z-[2200] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#123C3A]/60 dark:bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg p-4 sm:p-6 rounded-t-3xl sm:rounded-2xl bg-[#FAF8F3] dark:bg-[#0D2422] border-t sm:border border-[#D9DED5] dark:border-[#1E4844] shadow-2xl text-[#14201F] dark:text-[#E4EFEA] space-y-3 sm:space-y-4 max-h-[92dvh] sm:max-h-[90vh] flex flex-col pb-safe sm:pb-6">
        
        {/* Mobile Swipe Handle Indicator */}
        <div className="sm:hidden w-full pt-1 pb-1 flex justify-center shrink-0">
          <div className="w-10 h-1 rounded-full bg-[#B8C2B3] dark:bg-[#1E4844]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D9DED5] dark:border-[#1E4844] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#19C7B1]/15 text-[#19C7B1] flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#123C3A] dark:text-white">Smart Charger Filters</h3>
              <p className="text-[11px] text-[#5E716E] dark:text-[#8FAFA9]">Customize by vehicle compatibility, plug and speed</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5E716E] dark:text-[#8FAFA9] hover:text-[#123C3A] dark:hover:text-white hover:bg-[#E9EFE7] dark:hover:bg-[#123633] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vehicle Quick Switch Card */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-[#112D2B] border border-[#D9DED5] dark:border-[#1E4844] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-[#123C3A] dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#19C7B1]" />
              Vehicle Compatibility Filter
            </span>
            {selectedVehicle && onOpenVehicleModal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenVehicleModal();
                }}
                className="text-[11px] font-bold text-[#19C7B1] hover:underline cursor-pointer"
              >
                Change Vehicle
              </button>
            )}
          </div>

          {selectedVehicle ? (
            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-xs font-bold text-[#123C3A] dark:text-white">
                  {selectedVehicle.brand} {selectedVehicle.model}
                </p>
                <p className="text-[11px] text-[#5E716E] dark:text-[#8FAFA9]">
                  Connectors: {selectedVehicle.connectors.join(', ')}
                </p>
              </div>

              {onToggleCompatible && (
                <button
                  type="button"
                  onClick={onToggleCompatible}
                  className={`px-3 py-1.5 rounded-pill text-xs font-bold transition-all cursor-pointer ${
                    onlyCompatible
                      ? 'bg-[#19C7B1] text-white shadow-glow-teal-sm'
                      : 'bg-[#E9EFE7] dark:bg-[#081B19] text-[#5E716E] dark:text-[#88ABA6]'
                  }`}
                >
                  {onlyCompatible ? '✓ Only Compatible' : 'Show All'}
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-[#5E716E] dark:text-[#8FAFA9]">
                No vehicle selected. Selecting your vehicle eliminates connector guesswork.
              </p>
              {onOpenVehicleModal && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenVehicleModal();
                  }}
                  className="px-3 py-1.5 rounded-pill bg-[#19C7B1] text-white text-xs font-bold shadow-sm cursor-pointer whitespace-nowrap"
                >
                  Select EV
                </button>
              )}
            </div>
          )}
        </div>

        {/* Options List with Progressive Disclosure */}
        <div className="space-y-2 overflow-y-auto pr-1 flex-1">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5E716E] dark:text-[#8FAFA9]">
            Filter By Plug Standard & Charging Speed:
          </label>
          {categories.map((opt) => {
            const isSelected = activeFilter === opt.value;
            return (
              <div
                key={opt.value}
                onClick={() => {
                  onSelectFilter(opt.value);
                  onClose();
                }}
                className={`p-3 rounded-xl border cursor-pointer transition-all duration-150 flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#19C7B1]/15 dark:bg-[#19C7B1]/20 border-[#19C7B1] text-[#123C3A] dark:text-[#19C7B1] font-bold shadow-sm'
                    : 'bg-white dark:bg-[#112D2B] border-[#D9DED5] dark:border-[#1E4844] hover:bg-[#F4F1E8] dark:hover:bg-[#163836] text-[#14201F] dark:text-[#E4EFEA]'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'bg-[#19C7B1] text-white' : 'bg-[#E9EFE7] dark:bg-[#081B19] text-[#19C7B1]'
                  }`}>
                    <opt.icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold leading-tight">{opt.label}</p>
                    <p className="text-[10px] text-[#5E716E] dark:text-[#8FAFA9] mt-0.5">{opt.desc}</p>
                  </div>
                </div>
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-[#19C7B1] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="pt-3 border-t border-[#D9DED5] dark:border-[#1E4844] flex items-center justify-between">
          <button
            onClick={() => {
              onReset();
              onClose();
            }}
            className="text-xs font-bold text-[#5E716E] dark:text-[#8FAFA9] hover:text-[#19C7B1] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#19C7B1]" />
            <span>Reset to All</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#19C7B1] hover:bg-[#15A896] text-white text-xs font-bold shadow-glow-teal-sm cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
