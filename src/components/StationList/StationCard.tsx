import React from 'react';
import { motion } from 'framer-motion';
import { Station } from '../../types';
import { Zap, Plug, Navigation, ArrowRight, IndianRupee, Star, Heart } from 'lucide-react';
import { calculateDistance, USER_CURRENT_LOCATION } from '../../data/mockStations';

interface StationCardProps {
  station: Station;
  isSelected: boolean;
  onSelect: () => void;
  onViewDetails: () => void;
  onGetDirections: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (station: Station) => void;
}

export const StationCard: React.FC<StationCardProps> = ({
  station,
  isSelected,
  onSelect,
  onViewDetails,
  onGetDirections,
  isFavorite,
  onToggleFavorite
}) => {
  const distance = calculateDistance(
    USER_CURRENT_LOCATION.lat,
    USER_CURRENT_LOCATION.lng,
    station.lat,
    station.lng
  );

  const getStatusBadge = () => {
    switch (station.status) {
      case 'available':
        return (
          <span className="flex items-center gap-1.5 text-xs font-bold text-[#22C55E] tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] shadow-glow-green-sm animate-pulse-subtle"></span>
            AVAILABLE
          </span>
        );
      case 'busy':
        return (
          <span className="flex items-center gap-1.5 text-xs font-bold text-[#7A8C89] dark:text-[#8FAFA9] tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-[#7A8C89] dark:bg-[#8FAFA9]"></span>
            BUSY
          </span>
        );
      case 'partial':
        return (
          <span className="flex items-center gap-1.5 text-xs font-bold text-[#F59E0B] tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
            PARTIAL
          </span>
        );
    }
  };

  return (
    <motion.div
      onClick={onSelect}
      layout
      whileHover={{
        y: -4,
        scale: 1.012,
        boxShadow: isSelected
          ? '0 20px 48px rgba(25,199,177,0.28)'
          : '0 16px 40px rgba(18,60,58,0.14)',
      }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 380, damping: 26 }}
      className={`group relative p-4 rounded-card border cursor-pointer shadow-card-subtle ${
        isSelected
          ? 'bg-white dark:bg-[#0D2422] border-[#19C7B1] border-l-4 border-l-[#19C7B1]'
          : 'bg-[#E9EFE7] dark:bg-[#091F1D] border-[#D9DED5] dark:border-[#183E3A] hover:bg-white dark:hover:bg-[#0D2422] hover:border-l-[#19C7B1] hover:border-[#B8C2B3] dark:hover:border-[#18C5B7]'
      }`}
    >
      {/* Top Header: Status & Distance */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {getStatusBadge()}
          {station.chargerCategory && (
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white dark:bg-[#081B19] text-[#123C3A] dark:text-[#8FAFA9] border border-[#D9DED5] dark:border-[#183E3A]">
              {station.chargerCategory}
            </span>
          )}
          {station.source === 'database' ? (
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#18C5B7]/15 text-[#18C5B7] border border-[#18C5B7]/30">
              ● Live DB
            </span>
          ) : station.isMock ? (
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-300/40">
              Demo Seed
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          {station.verifiedCompatibility && (
            <span className="text-[10px] font-bold text-[#22C55E] flex items-center gap-0.5">
              <span>✓ Verified</span>
            </span>
          )}
          {onToggleFavorite && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(station);
              }}
              aria-label={isFavorite ? `Remove ${station.name} from saved` : `Save ${station.name}`}
              className={`min-w-[32px] min-h-[32px] w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 shadow-sm'
                  : 'bg-white/90 dark:bg-[#081B19]/90 text-[#7A8C89] dark:text-[#7A9E99] hover:text-rose-500 hover:bg-white dark:hover:bg-[#123431] border border-[#D9DED5] dark:border-[#183E3A]'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current text-rose-500' : ''}`} />
            </button>
          )}
          <span className="text-xs font-bold tabular-nums text-[#5E716E] dark:text-[#8FAFA9] group-hover:text-[#19C7B1] transition-colors flex items-center gap-1">
            {distance} km →
          </span>
        </div>
      </div>

      {/* Station Title and Area */}
      <div className="mb-2.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-base text-[#123C3A] dark:text-[#E4EFEA] leading-snug group-hover:text-[#14201F] dark:group-hover:text-white transition-colors">
            {station.name}
          </h3>
          <div className="flex items-center gap-1 text-xs font-bold tabular-nums text-[#123C3A] dark:text-[#E4EFEA] bg-white dark:bg-[#081B19] px-2 py-0.5 rounded-full border border-[#D9DED5] dark:border-[#183E3A] shrink-0">
            <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
            <span>{station.rating}</span>
          </div>
        </div>
        <p className="text-xs text-[#5E716E] dark:text-[#8FAFA9] mt-0.5 truncate font-medium">
          {station.area}
        </p>
      </div>

      {/* Speed & Connectors Row */}
      <div className="space-y-1 py-2 border-y border-[#D9DED5] dark:border-[#183E3A] text-xs">
        <div className="flex items-center gap-1.5 text-[#14201F] dark:text-[#E4EFEA]">
          <Zap className="w-3.5 h-3.5 text-[#19C7B1] shrink-0 fill-current" />
          <span className="font-semibold text-[#123C3A] dark:text-[#E4EFEA] tabular-nums">{station.powerSpeed}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#5E716E] dark:text-[#8FAFA9]">
          <Plug className="w-3.5 h-3.5 text-[#2DBDB5] shrink-0" />
          <span className="font-medium">{station.primaryConnectors.join(' · ')}</span>
        </div>
      </div>

      {/* Ports availability & Pricing */}
      <div className="mt-2.5 mb-3.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span className={`font-bold tabular-nums ${station.availablePorts > 0 ? 'text-[#123C3A] dark:text-[#E4EFEA]' : 'text-[#7A8C89] dark:text-[#7A9E99]'}`}>
            {station.availablePorts}/{station.totalPorts} ports free
          </span>
          {station.is24x7 && (
            <span className="text-[10px] text-[#123C3A] dark:text-[#18C5B7] bg-[#19C7B1]/15 dark:bg-[#18C5B7]/20 px-1.5 py-0.5 rounded-full font-semibold">
              24/7
            </span>
          )}
        </div>
        <div className="text-right">
          <span className="font-bold text-[#123C3A] dark:text-[#18C5B7] tabular-nums">₹{station.pricePerKwh}/kWh</span>
          <span className="text-[#5E716E] dark:text-[#8FAFA9] text-[11px] ml-1 font-medium tabular-nums">· ~₹{station.estimatedFullChargeCost} full</span>
        </div>
      </div>

      {/* Action Buttons Row with 44px min touch target */}
      <div className="flex items-center gap-2 pt-1">
        <motion.button
          whileHover={{ scale: 1.04, backgroundColor: '#2DBDB5', color: '#fff' }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 420, damping: 24 }}
          onClick={(e) => {
            e.stopPropagation();
            onGetDirections();
          }}
          className="flex-1 min-h-[44px] py-2 px-3 rounded-btn bg-white dark:bg-[#081B19] text-[#123C3A] dark:text-[#E4EFEA] border border-[#D9DED5] dark:border-[#183E3A] text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Navigation className="w-3.5 h-3.5 text-[#19C7B1]" />
          <span>Get Directions</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.04, backgroundColor: '#123C3A' }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 420, damping: 24 }}
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails();
          }}
          className="flex-1 min-h-[44px] py-2 px-3 rounded-btn bg-[#19C7B1] text-white border border-[#19C7B1] text-xs font-bold flex items-center justify-center gap-1 shadow-glow-teal-sm cursor-pointer"
        >
          <span>Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </motion.div>
  );
};
