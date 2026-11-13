import React, { useRef } from 'react';
import { FilterCategory } from '../../types';
import { VehicleModel } from '../../data/vehicles';
import { SlidersHorizontal, X, Zap, ShieldCheck, RotateCcw } from 'lucide-react';

interface FilterBarProps {
  activeFilter: FilterCategory;
  onSelectFilter: (filter: FilterCategory) => void;
  selectedVehicle?: VehicleModel | null;
  onlyCompatible?: boolean;
  onToggleCompatible?: () => void;
  onOpenVehicleModal?: () => void;
  onOpenFilterModal?: () => void;
  onResetFilters?: () => void;
}

const PRIMARY_FILTERS: { label: string; value: FilterCategory }[] = [
  { label: 'All', value: 'All' },
  { label: '4-Wheeler', value: '4-Wheeler' },
  { label: '2-Wheeler', value: '2-Wheeler' },
  { label: 'Available Now', value: 'Available Now' },
  { label: 'DC Fast (50kW+)', value: 'Fast Charge 50kW+' },
  { label: 'AC Charging', value: 'AC' },
  { label: 'CCS2', value: 'CCS2' },
  { label: 'Type-2', value: 'Type-2' },
  { label: 'LECCS (2W)', value: 'LECCS' },
  { label: 'Bharat AC', value: 'Bharat AC' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  activeFilter,
  onSelectFilter,
  selectedVehicle,
  onlyCompatible = false,
  onToggleCompatible,
  onOpenVehicleModal,
  onOpenFilterModal,
  onResetFilters,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasActiveFilters = activeFilter !== 'All' || onlyCompatible;

  return (
    <div className="relative w-full px-3 py-2.5 border-b border-[#D9DED5] dark:border-[#1E4844] bg-[#F4F1E8] dark:bg-[#071715] transition-colors space-y-2">
      
      {/* Top Row: Vehicle Quick Filter Pill & Advanced Filters Trigger */}
      <div className="flex items-center justify-between gap-2">
        {/* Prominent Quick Filter: "Compatible with my vehicle" */}
        {selectedVehicle ? (
          <button
            type="button"
            onClick={onToggleCompatible}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-pill text-xs font-bold transition-all cursor-pointer shadow-sm ${
              onlyCompatible
                ? 'bg-[#19C7B1] text-white shadow-glow-teal-sm'
                : 'bg-white dark:bg-[#0D2422] text-[#123C3A] dark:text-[#E4EFEA] border border-[#D9DED5] dark:border-[#1E4844] hover:border-[#19C7B1]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="truncate max-w-[150px] sm:max-w-none">
              Compatible with {selectedVehicle.brand} {selectedVehicle.model}
            </span>
            {onlyCompatible && <span className="text-[10px] font-black">✓</span>}
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenVehicleModal}
            className="flex items-center gap-1.5 px-3 py-1 rounded-pill bg-[#E9EFE7] dark:bg-[#0D2422] hover:bg-white dark:hover:bg-[#123633] text-[#123C3A] dark:text-[#E4EFEA] border border-[#D9DED5] dark:border-[#1E4844] text-xs font-bold transition-all cursor-pointer shadow-sm group"
          >
            <Zap className="w-3.5 h-3.5 text-[#19C7B1] group-hover:scale-110 transition-transform" />
            <span>⚡ Select Vehicle for Compatible Matching</span>
          </button>
        )}

        {/* Clear All & Advanced Filter buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {hasActiveFilters && onResetFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="text-[11px] font-bold text-[#5E716E] dark:text-[#88ABA6] hover:text-[#19C7B1] flex items-center gap-1 px-2 py-1 rounded-lg transition-colors cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}

          {onOpenFilterModal && (
            <button
              type="button"
              onClick={onOpenFilterModal}
              className="p-1.5 px-2 rounded-lg bg-white dark:bg-[#0D2422] border border-[#D9DED5] dark:border-[#1E4844] text-[11px] font-bold text-[#123C3A] dark:text-white hover:border-[#19C7B1] transition-all flex items-center gap-1 shadow-sm cursor-pointer"
              title="Open full filter dialog"
            >
              <SlidersHorizontal className="w-3 h-3 text-[#19C7B1]" />
              <span className="hidden sm:inline">More Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Scrollable Primary Category Chips */}
      <div
        ref={scrollRef}
        className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-0.5"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {PRIMARY_FILTERS.map((item) => {
          const isActive = activeFilter === item.value;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onSelectFilter(item.value)}
              className={`shrink-0 px-3 py-1 rounded-pill text-xs font-semibold transition-all duration-200 select-none cursor-pointer ${
                isActive
                  ? 'bg-[#123C3A] dark:bg-[#19C7B1] text-white shadow-sm'
                  : 'bg-white dark:bg-[#0D2422] hover:bg-[#E9EFE7] dark:hover:bg-[#123633] text-[#14201F] dark:text-[#E4EFEA] border border-[#D9DED5] dark:border-[#1E4844]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

    </div>
  );
};
