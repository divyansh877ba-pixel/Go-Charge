import React, { useState, useEffect } from 'react';
import { Station, SortOption } from '../../types';
import { StationCard } from './StationCard';
import { StationCardSkeleton } from './StationCardSkeleton';
import { Bell, BellRing, ArrowUpDown, Check, AlertCircle } from 'lucide-react';

interface StationListProps {
  stations: Station[];
  selectedStation: Station | null;
  onSelectStation: (station: Station) => void;
  onViewStationDetails: (station: Station) => void;
  onGetDirections: (station: Station) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  isLoading?: boolean;
  isFavorite?: (id: string) => boolean;
  onToggleFavorite?: (station: Station) => void;
}

export const StationList: React.FC<StationListProps> = ({
  stations,
  selectedStation,
  onSelectStation,
  onViewStationDetails,
  onGetDirections,
  sortOption,
  onSortChange,
  isLoading = false,
  isFavorite,
  onToggleFavorite
}) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // 1. Skeleton Loader: Only display when loading takes longer than 300ms
  const [showSkeleton, setShowSkeleton] = useState(false);
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      timer = setTimeout(() => setShowSkeleton(true), 300);
    } else {
      setShowSkeleton(false);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

  const handleToggleNotifications = () => {
    const nextState = !notificationsEnabled;
    setNotificationsEnabled(nextState);
    if (nextState) {
      setNotificationToast("Availability alerts enabled for nearby chargers!");
      setTimeout(() => setNotificationToast(null), 3000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F4F1E8] dark:bg-[#071715] border-l border-[#D9DED5] dark:border-[#183E3A] transition-colors">
      
      {/* Station List Header & Sort Dropdown */}
      <div className="px-4 py-3 border-b border-[#D9DED5] dark:border-[#183E3A] bg-[#E9EFE7] dark:bg-[#081B19] backdrop-blur-md flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-sm font-bold text-[#123C3A] dark:text-[#E4EFEA] flex items-center gap-1.5">
            <span>{stations.length} stations</span>
            <span className="text-[#5E716E] dark:text-[#8FAFA9] font-medium text-xs">· Sorted by {sortOption}</span>
          </h2>
          <p className="text-[11px] text-[#5E716E] dark:text-[#8FAFA9]">Real-time telemetry updated just now</p>
        </div>

        {/* Sort Select */}
        <div className="relative flex items-center">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#5E716E] dark:text-[#7A9E99] absolute left-2.5 pointer-events-none" />
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="pl-8 pr-3 py-1.5 rounded-btn bg-white dark:bg-[#0D2422] text-xs font-semibold text-[#123C3A] dark:text-[#E4EFEA] border border-[#D9DED5] dark:border-[#183E3A] hover:border-[#19C7B1] focus:border-[#19C7B1] outline-none transition-colors cursor-pointer capitalize shadow-sm"
          >
            <option value="distance" className="dark:bg-[#0D2422]">Distance</option>
            <option value="rating" className="dark:bg-[#0D2422]">Rating</option>
            <option value="price" className="dark:bg-[#0D2422]">Price (Low to High)</option>
            <option value="speed" className="dark:bg-[#0D2422]">Speed (Fastest)</option>
          </select>
        </div>
      </div>

      {/* Station Cards Scrollable Container */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
        {showSkeleton ? (
          <>
            <StationCardSkeleton />
            <StationCardSkeleton />
            <StationCardSkeleton />
          </>
        ) : stations.length === 0 ? (
          <div className="py-16 text-center text-[#5E716E] dark:text-[#8FAFA9] flex flex-col items-center justify-center">
            <AlertCircle className="w-10 h-10 mb-2 text-[#7A8C89] dark:text-[#5E716E]" />
            <p className="text-sm font-bold text-[#123C3A] dark:text-[#E4EFEA]">No stations match this filter</p>
            <p className="text-xs text-[#5E716E] dark:text-[#8FAFA9] mt-1 max-w-xs text-pretty">
              Try selecting "All" or removing specific connector and vehicle filters.
            </p>
          </div>
        ) : (
          stations.map((station) => (
            <StationCard
              key={station.id}
              station={station}
              isSelected={selectedStation?.id === station.id}
              onSelect={() => onSelectStation(station)}
              onViewDetails={() => onViewStationDetails(station)}
              onGetDirections={() => onGetDirections(station)}
              isFavorite={isFavorite ? isFavorite(station.id) : false}
              onToggleFavorite={onToggleFavorite}
            />
          ))
        )}
      </div>

      {/* Toast Notification Alert */}
      {notificationToast && (
        <div className="mx-3.5 mb-2 p-2.5 rounded-lg bg-[#19C7B1]/15 border border-[#19C7B1] text-[#123C3A] dark:text-[#18C5B7] text-xs font-semibold flex items-center gap-2 animate-pulse-subtle">
          <Check className="w-4 h-4 text-[#19C7B1] shrink-0" />
          <span>{notificationToast}</span>
        </div>
      )}

      {/* BOTTOM: Sticky CTA */}
      <div className="p-3.5 border-t border-[#D9DED5] dark:border-[#183E3A] bg-[#E9EFE7] dark:bg-[#081B19] backdrop-blur-md shrink-0">
        <div className="flex items-center justify-between p-3 rounded-card bg-white dark:bg-[#0D2422] border border-[#D9DED5] dark:border-[#183E3A] shadow-card-subtle">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              notificationsEnabled 
                ? 'bg-[#19C7B1]/20 text-[#123C3A] dark:text-[#18C5B7]' 
                : 'bg-[#E9EFE7] dark:bg-[#14322F] text-[#5E716E] dark:text-[#8FAFA9]'
            }`}>
              {notificationsEnabled ? (
                <BellRing className="w-4 h-4 text-[#19C7B1] animate-bounce" />
              ) : (
                <Bell className="w-4 h-4 text-[#5E716E] dark:text-[#8FAFA9]" />
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-[#123C3A] dark:text-[#E4EFEA]">
                Enable Notifications
              </p>
              <p className="text-[11px] text-[#5E716E] dark:text-[#8FAFA9]">
                Alert me when a port frees up
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={handleToggleNotifications}
            role="switch"
            aria-checked={notificationsEnabled}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              notificationsEnabled ? 'bg-[#19C7B1]' : 'bg-[#D9DED5] dark:bg-[#183E3A]'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

    </div>
  );
};
