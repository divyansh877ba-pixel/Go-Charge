import React from 'react';

export const StationCardSkeleton: React.FC = () => {
  return (
    <div 
      className="p-4 rounded-card border border-[#D9DED5] dark:border-[#183E3A] bg-[#E9EFE7]/80 dark:bg-[#091F1D]/80 shadow-card-subtle animate-pulse select-none"
      aria-hidden="true"
    >
      {/* Top Header: Status & Distance */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="w-24 h-4 rounded-full bg-[#D9DED5] dark:bg-[#163834]" />
        <div className="w-14 h-4 rounded bg-[#D9DED5] dark:bg-[#163834]" />
      </div>

      {/* Station Title and Area */}
      <div className="mb-2.5 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <div className="w-3/4 h-5 rounded bg-[#D9DED5] dark:bg-[#163834]" />
          <div className="w-12 h-5 rounded-full bg-[#D9DED5] dark:bg-[#163834] shrink-0" />
        </div>
        <div className="w-1/2 h-3.5 rounded bg-[#D9DED5] dark:bg-[#163834]" />
      </div>

      {/* Speed & Connectors Row */}
      <div className="space-y-1.5 py-2.5 border-y border-[#D9DED5]/80 dark:border-[#183E3A] text-xs">
        <div className="w-40 h-3.5 rounded bg-[#D9DED5] dark:bg-[#163834]" />
        <div className="w-28 h-3.5 rounded bg-[#D9DED5] dark:bg-[#163834]" />
      </div>

      {/* Ports availability & Pricing */}
      <div className="mt-2.5 mb-3.5 flex items-center justify-between">
        <div className="w-28 h-4 rounded bg-[#D9DED5] dark:bg-[#163834]" />
        <div className="w-24 h-4 rounded bg-[#D9DED5] dark:bg-[#163834]" />
      </div>

      {/* Action Buttons Row */}
      <div className="flex items-center gap-2 pt-1">
        <div className="flex-1 min-h-[44px] rounded-btn bg-[#D9DED5] dark:bg-[#163834]" />
        <div className="flex-1 min-h-[44px] rounded-btn bg-[#D9DED5] dark:bg-[#163834]" />
      </div>
    </div>
  );
};
