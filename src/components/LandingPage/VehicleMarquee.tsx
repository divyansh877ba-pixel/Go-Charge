import React from 'react';
import { Zap } from 'lucide-react';

const INDIAN_EVS = [
  'Tata Nexon EV',
  'Ather 450X',
  'Ola S1 Pro',
  'MG ZS EV',
  'Mahindra XUV400',
  'Hero Vida V1',
  'TVS iQube',
  'Tata Punch EV',
  'Hyundai Ioniq 5',
  'Bajaj Chetak',
  'Kia EV6',
  'BYD Atto 3',
  'MG Comet EV',
  'Ultraviolette F77',
];

export const VehicleMarquee: React.FC = () => {
  return (
    <div className="w-full py-6 sm:py-8 overflow-hidden bg-[#E9EFE7] dark:bg-[#0A1F1D] border-y border-[#D9DED5] dark:border-[#1E4844] select-none transition-colors">
      <div className="max-w-7xl mx-auto px-4 mb-3 text-center">
        <span className="text-[11px] font-bold tracking-widest text-[#5E716E] dark:text-[#88ABA6] uppercase">
          Universal Compatibility · 2-Wheelers & 4-Wheelers Across India
        </span>
      </div>

      <div className="relative flex overflow-x-hidden">
        {/* Edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#E9EFE7] dark:from-[#0A1F1D] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#E9EFE7] dark:from-[#0A1F1D] to-transparent z-10 pointer-events-none" />

        <div className="flex shrink-0 items-center gap-4 sm:gap-6 animate-marquee whitespace-nowrap">
          {INDIAN_EVS.concat(INDIAN_EVS).map((name, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-pill bg-white dark:bg-[#112D2B] border border-[#D9DED5] dark:border-[#1E4844] hover:border-[#19C7B1] text-[#123C3A] dark:text-white hover:text-[#19C7B1] transition-colors shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 text-[#19C7B1]" />
              <span className="text-xs font-bold tracking-wide">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
