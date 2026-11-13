import React from 'react';
import { Car, Bike, CheckCircle2, ShieldCheck, XCircle } from 'lucide-react';
import { INDIAN_EV_DATABASE, VehicleModel, isStationCompatibleWithVehicle } from '../../data/vehicles';
import { Station } from '../../types';

interface CompatibleVehiclesProps {
  station?: Station;
}

export const CompatibleVehicles: React.FC<CompatibleVehiclesProps> = ({ station }) => {
  const stationConnectors = station ? station.primaryConnectors : ['CCS2', 'Type-2'];

  // Test vehicles across 2W and 4W
  const evaluatedVehicles = INDIAN_EV_DATABASE.slice(0, 8).map((v) => {
    const isCompatible = isStationCompatibleWithVehicle(stationConnectors, v);
    return {
      vehicle: v,
      isCompatible,
    };
  });

  return (
    <div className="p-5 rounded-card bg-[#E9EFE7] dark:bg-[#0D2422] border border-[#D9DED5] dark:border-[#183E3A] shadow-card-subtle transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-[#123C3A] dark:text-[#E4EFEA] flex items-center gap-2">
            <span>Verified Vehicle Compatibility</span>
            <ShieldCheck className="w-4 h-4 text-[#19C7B1]" />
          </h3>
          <p className="text-xs text-[#5E716E] dark:text-[#8FAFA9]">
            Hardware connector verified against Indian electric 2-wheelers and 4-wheelers
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {evaluatedVehicles.map(({ vehicle, isCompatible }) => (
          <div
            key={vehicle.id}
            className={`p-3 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
              isCompatible
                ? 'bg-white dark:bg-[#081B19] border-[#D9DED5] dark:border-[#183E3A] hover:border-[#19C7B1]'
                : 'bg-white/60 dark:bg-[#081B19]/50 border-dashed border-[#D9DED5] dark:border-[#183E3A] opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                isCompatible 
                  ? 'bg-[#E9EFE7] dark:bg-[#0D2422] text-[#19C7B1]' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
              }`}>
                {vehicle.category === '4-Wheeler' ? (
                  <Car className="w-4 h-4" />
                ) : (
                  <Bike className="w-4 h-4" />
                )}
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                isCompatible
                  ? 'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/30'
                  : 'text-gray-400 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-800'
              }`}>
                {isCompatible ? '✓ Fits' : 'No Plug'}
              </span>
            </div>

            <div>
              <p className="text-xs font-bold text-[#123C3A] dark:text-[#E4EFEA] leading-tight mb-0.5">
                {vehicle.brand} {vehicle.model.split(' ')[0]}
              </p>
              <p className="text-[10px] text-[#5E716E] dark:text-[#8FAFA9] truncate">
                {vehicle.connectors[0]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
