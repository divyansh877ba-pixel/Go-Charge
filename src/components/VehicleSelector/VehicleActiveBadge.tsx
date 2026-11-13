import React from 'react';
import { Car, Bike, X, RefreshCw, ShieldCheck, Filter } from 'lucide-react';
import { VehicleModel } from '../../data/vehicles';

interface VehicleActiveBadgeProps {
  vehicle: VehicleModel | null;
  onlyCompatible: boolean;
  onToggleCompatible: () => void;
  onOpenVehicleModal: () => void;
  onClearVehicle: () => void;
}

export const VehicleActiveBadge: React.FC<VehicleActiveBadgeProps> = ({
  vehicle,
  onlyCompatible,
  onToggleCompatible,
  onOpenVehicleModal,
  onClearVehicle,
}) => {
  if (!vehicle) {
    return (
      <button
        type="button"
        onClick={onOpenVehicleModal}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-pill bg-[#E9EFE7] dark:bg-[#0D2422] hover:bg-white dark:hover:bg-[#123633] border border-[#D9DED5] dark:border-[#1E4844] hover:border-[#19C7B1] text-xs font-semibold text-[#123C3A] dark:text-[#E4EFEA] transition-all cursor-pointer shadow-sm group"
      >
        <span className="w-2 h-2 rounded-full bg-[#19C7B1] group-hover:scale-125 transition-transform"></span>
        <span>Select your EV for verified matching</span>
        <span className="text-[10px] text-[#19C7B1] font-bold underline">Select</span>
      </button>
    );
  }

  return (
    <div className="inline-flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-white/80 dark:bg-[#0D2422]/90 backdrop-blur-md border border-[#D9DED5] dark:border-[#1E4844] shadow-sm text-xs">
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#E9EFE7] dark:bg-[#081B19] text-[#123C3A] dark:text-[#E4EFEA]">
        {vehicle.category === '4-Wheeler' ? (
          <Car className="w-3.5 h-3.5 text-[#19C7B1]" />
        ) : (
          <Bike className="w-3.5 h-3.5 text-[#19C7B1]" />
        )}
        <span className="font-extrabold truncate max-w-[140px] sm:max-w-none">
          {vehicle.brand} {vehicle.model}
        </span>
        <span className="text-[10px] text-[#5E716E] dark:text-[#88ABA6] hidden sm:inline">
          ({vehicle.connectors.join(', ')})
        </span>
      </div>

      <button
        type="button"
        onClick={onToggleCompatible}
        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
          onlyCompatible
            ? 'bg-[#19C7B1] text-white shadow-glow-teal-sm'
            : 'bg-[#F4F1E8] dark:bg-[#081B19] text-[#5E716E] dark:text-[#88ABA6] hover:text-[#123C3A] dark:hover:text-white'
        }`}
        title={onlyCompatible ? "Showing only compatible stations" : "Showing all stations"}
      >
        {onlyCompatible ? '✓ Compatible Only' : 'Show All Stations'}
      </button>

      <button
        type="button"
        onClick={onOpenVehicleModal}
        className="px-2 py-1 text-[11px] font-semibold text-[#5E716E] dark:text-[#88ABA6] hover:text-[#19C7B1] transition-colors cursor-pointer"
        title="Change Vehicle"
      >
        Change
      </button>

      <button
        type="button"
        onClick={onClearVehicle}
        className="p-1 rounded-md text-[#5E716E] dark:text-[#88ABA6] hover:text-red-500 hover:bg-[#F4F1E8] dark:hover:bg-[#123633] transition-colors cursor-pointer"
        title="Remove Vehicle Filter"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};
