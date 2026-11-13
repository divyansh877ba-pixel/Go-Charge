import L from 'leaflet';
import { Station } from '../../types';

export function createStationPinIcon(station: Station, isSelected: boolean = false): L.DivIcon {
  const { status, availablePorts } = station;

  let bgClass = 'bg-[#22C55E] text-white shadow-glow-green';
  let pulseClass = 'pin-pulse-green';
  let badgeBg = 'bg-[#123C3A] text-white';

  if (status === 'busy') {
    bgClass = 'bg-[#7A8C89] text-white';
    pulseClass = '';
    badgeBg = 'bg-[#F4F1E8] text-[#5E716E] border border-[#D9DED5]';
  } else if (status === 'partial') {
    bgClass = 'bg-[#F59E0B] text-white';
    pulseClass = '';
    badgeBg = 'bg-[#123C3A] text-white';
  }

  // Active / Selected pin uses #19C7B1 vibrant teal!
  if (isSelected) {
    bgClass = 'bg-[#19C7B1] text-white shadow-glow-teal';
    pulseClass = 'pin-pulse-teal';
  }

  const size = isSelected ? 46 : 38;
  const activeRing = isSelected ? 'pin-active-ring scale-110' : '';

  const html = `
    <div class="relative flex items-center justify-center cursor-pointer select-none transition-transform duration-300 ${activeRing}">
      <!-- Main Pin Circle -->
      <div class="w-[${size}px] h-[${size}px] rounded-full ${bgClass} ${pulseClass} flex items-center justify-center border-2 border-white shadow-md transition-all duration-300">
        <!-- SVG Lightning Bolt -->
        <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      </div>

      <!-- Port Count Badge: small circle at top right -->
      <div class="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 rounded-full ${badgeBg} font-bold text-[11px] leading-tight flex items-center justify-center shadow-md">
        ${availablePorts}
      </div>

      ${isSelected ? `
        <!-- Directional arrow pointer under pin -->
        <div class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 ${bgClass} border-r-2 border-b-2 border-white"></div>
      ` : ''}
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-ev-pin',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2 - 8],
  });
}

// User location pin in Deep Teal + Vibrant Teal
export function createUserLocationIcon(): L.DivIcon {
  const html = `
    <div class="relative flex items-center justify-center select-none">
      <div class="w-5 h-5 rounded-full bg-[#123C3A] border-2 border-white shadow-lg relative z-10"></div>
      <div class="absolute w-10 h-10 rounded-full bg-[#19C7B1]/40 animate-ping"></div>
      <div class="absolute w-8 h-8 rounded-full bg-[#19C7B1]/25"></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'user-location-pin',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
}
