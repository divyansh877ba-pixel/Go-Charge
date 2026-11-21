import React, { useState } from 'react';
import { motion, PanInfo, useDragControls } from 'framer-motion';
import { Station, SortOption } from '../../types';
import { StationCard } from '../StationList/StationCard';
import { ChevronUp, ChevronDown, Minimize2 } from 'lucide-react';

interface BottomSheetPanelProps {
  stations: Station[];
  selectedStation: Station | null;
  onSelectStation: (station: Station) => void;
  onViewStationDetails: (station: Station) => void;
  onGetDirections: (station: Station) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  isFavorite?: (id: string) => boolean;
  onToggleFavorite?: (station: Station) => void;
}

type SheetState = 'peek' | 'half' | 'full';

export const BottomSheetPanel: React.FC<BottomSheetPanelProps> = ({
  stations,
  selectedStation,
  onSelectStation,
  onViewStationDetails,
  onGetDirections,
  sortOption,
  onSortChange,
  isFavorite,
  onToggleFavorite,
}) => {
  const [sheetState, setSheetState] = useState<SheetState>('peek');
  const dragControls = useDragControls();

  const getHeightStyle = () => {
    switch (sheetState) {
      case 'peek':
        return 'h-[195px] max-h-[195px]';
      case 'half':
        return 'h-[52dvh] max-h-[52dvh]';
      case 'full':
        return 'h-[88dvh] max-h-[88dvh]';
    }
  };

  const cycleSheetState = () => {
    if (sheetState === 'peek') setSheetState('half');
    else if (sheetState === 'half') setSheetState('full');
    else setSheetState('peek');
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y < -40 || info.velocity.y < -300) {
      if (sheetState === 'peek') setSheetState('half');
      else if (sheetState === 'half') setSheetState('full');
    } else if (info.offset.y > 40 || info.velocity.y > 300) {
      if (sheetState === 'full') setSheetState('half');
      else if (sheetState === 'half') setSheetState('peek');
    }
  };

  return (
    <motion.div
      drag="y"
      dragListener={false}
      dragControls={dragControls}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.12}
      onDragEnd={handleDragEnd}
      className={`fixed bottom-0 left-0 right-0 z-40 bg-[#F4F1E8]/98 dark:bg-[#071715]/98 backdrop-blur-2xl rounded-t-3xl border-t border-[#D9DED5] dark:border-[#183E3A] shadow-2xl flex flex-col transition-all duration-300 ease-out md:hidden pb-safe ${getHeightStyle()}`}
    >
      {/* Drag Handle Bar with Dedicated Drag Listener: Restricting drag to handle so cards scroll normally */}
      <div 
        onPointerDown={(e) => dragControls.start(e)}
        onClick={cycleSheetState}
        style={{ touchAction: 'none' }}
        className="w-full pt-3 pb-2 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing select-none shrink-0"
      >
        <div className="w-12 h-1.5 rounded-full bg-[#B8C2B3] dark:bg-[#183E3A] mb-1.5" />
        <div className="flex items-center justify-between w-full px-4 text-xs text-[#5E716E] dark:text-[#8FAFA9]">
          <span className="font-bold text-[#123C3A] dark:text-[#E4EFEA] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
            {stations.length} stations nearby
          </span>

          <div className="flex items-center gap-1">
            <span className="text-[11px] capitalize text-[#19C7B1] font-bold">
              {sheetState === 'peek' ? 'Swipe Up' : sheetState}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (sheetState === 'full') setSheetState('half');
                else if (sheetState === 'half') setSheetState('peek');
                else setSheetState('half');
              }}
              aria-label={sheetState === 'peek' ? 'Expand station list' : 'Collapse station list'}
              className="min-w-[40px] min-h-[40px] flex items-center justify-center text-[#5E716E] dark:text-[#8FAFA9] hover:text-[#123C3A] dark:hover:text-white transition-colors cursor-pointer"
            >
              {sheetState === 'full' ? (
                <Minimize2 className="w-4 h-4 text-[#5E716E] dark:text-[#8FAFA9]" />
              ) : sheetState === 'half' ? (
                <ChevronDown className="w-4 h-4 text-[#5E716E] dark:text-[#8FAFA9]" />
              ) : (
                <ChevronUp className="w-4 h-4 text-[#5E716E] dark:text-[#8FAFA9]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* When in peek mode: show selected station or first station card in horizontal preview */}
      {sheetState === 'peek' ? (
        <div className="px-4 py-1 overflow-x-auto flex gap-3 no-scrollbar flex-1 min-h-0">
          {(selectedStation ? [selectedStation] : stations.slice(0, 3)).map((st) => (
            <div key={st.id} className="min-w-[280px] w-full">
              <StationCard
                station={st}
                isSelected={selectedStation?.id === st.id}
                onSelect={() => onSelectStation(st)}
                onViewDetails={() => onViewStationDetails(st)}
                onGetDirections={() => onGetDirections(st)}
                isFavorite={isFavorite ? isFavorite(st.id) : false}
                onToggleFavorite={onToggleFavorite}
              />
            </div>
          ))}
        </div>
      ) : (
        /* Half or Full mode: scrollable list with sort options */
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          <div className="px-4 py-2 border-b border-[#D9DED5] dark:border-[#183E3A] flex items-center justify-between shrink-0 bg-[#E9EFE7] dark:bg-[#081B19]">
            <span className="text-xs font-semibold text-[#5E716E] dark:text-[#8FAFA9]">Sorted by {sortOption}</span>
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="px-2 py-1 rounded bg-white dark:bg-[#0D2422] text-xs font-bold text-[#123C3A] dark:text-[#E4EFEA] border border-[#D9DED5] dark:border-[#183E3A] outline-none cursor-pointer"
            >
              <option value="distance" className="dark:bg-[#0D2422]">Distance</option>
              <option value="rating" className="dark:bg-[#0D2422]">Rating</option>
              <option value="price" className="dark:bg-[#0D2422]">Price</option>
              <option value="speed" className="dark:bg-[#0D2422]">Speed</option>
            </select>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 overscroll-contain">
            {stations.map((st) => (
              <StationCard
                key={st.id}
                station={st}
                isSelected={selectedStation?.id === st.id}
                onSelect={() => onSelectStation(st)}
                onViewDetails={() => onViewStationDetails(st)}
                onGetDirections={() => onGetDirections(st)}
                isFavorite={isFavorite ? isFavorite(st.id) : false}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};