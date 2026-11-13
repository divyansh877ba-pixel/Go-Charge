import React, { useState, useEffect, useRef } from 'react';
import { Zap, Activity, BatteryCharging, ShieldCheck } from 'lucide-react';

interface HeroEvVisualProps {
  mouseX: number;
  mouseY: number;
}

export const HeroEvVisual: React.FC<HeroEvVisualProps> = ({ mouseX, mouseY }) => {
  // Parallax offsets computed from normalized mouse (-1 to +1)
  const carX = mouseX * -12;
  const carY = mouseY * -7;

  const chargerX = mouseX * -6;
  const chargerY = mouseY * -4;

  const glowX = mouseX * 10;
  const glowY = mouseY * 8;

  return (
    <div className="relative w-full h-[380px] sm:h-[440px] lg:h-[480px] flex items-center justify-center select-none overflow-visible">
      
      {/* 1. Ambient Teal Backlight Glow (Slow breathing + mouse parallax) */}
      <div
        style={{
          transform: `translate3d(${glowX}px, ${glowY}px, 0)`,
          transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[460px] h-[280px] sm:h-[340px] bg-gradient-to-tr from-[#19C7B1]/20 via-[#2DBDB5]/15 to-transparent rounded-full blur-[80px] pointer-events-none ambient-glow-breathe"
      />

      {/* 2. Ground Station Markings & Contact Shadows */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[560px] h-16 pointer-events-none">
        {/* Soft floor shadow */}
        <div className="w-full h-10 bg-[#123C3A]/10 rounded-full blur-xl transform translate-y-3" />
        
        {/* Architectural EV charging bay line */}
        <div className="absolute bottom-2 left-4 right-4 flex items-center justify-between border-b border-[#D9DED5] pb-1 text-[9px] font-bold tracking-widest text-[#5E716E] uppercase">
          <span className="flex items-center gap-1 text-[#19C7B1]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#19C7B1]" />
            BAY 01 · ULTRA-FAST DC
          </span>
          <span className="text-[#123C3A]/60">150 KW CCS2</span>
        </div>
      </div>

      {/* 3. Main Composition: Car + Charger + Cable + Floating Telemetry */}
      <div className="relative w-full max-w-[580px] h-full flex items-center justify-between px-2 sm:px-6">

        {/* ── CHARGER PEDESTAL (Left of Visual / Right of Content) ── */}
        <div
          style={{
            transform: `translate3d(${chargerX}px, ${chargerY}px, 0)`,
            transition: 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
          }}
          className="relative z-20 flex flex-col items-center shrink-0 -mr-6 sm:-mr-8"
        >
          {/* Top Status LED Crown Pulse */}
          <div className="relative flex items-center justify-center mb-1">
            <span className="absolute w-4 h-4 rounded-full bg-[#19C7B1]/40 animate-ping" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#19C7B1] shadow-[0_0_10px_#19C7B1]" />
          </div>

          {/* Pedestal Body */}
          <div className="w-20 sm:w-24 h-64 sm:h-72 rounded-2xl bg-gradient-to-b from-[#123C3A] via-[#1A4543] to-[#0E2E2C] border border-[#19C7B1]/40 shadow-2xl p-2.5 flex flex-col justify-between relative overflow-hidden">
            
            {/* Subtle gloss highlight on pedestal edge */}
            <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-[#19C7B1]/60 to-transparent" />

            {/* Pedestal Brand Cap */}
            <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
              <span className="text-[8px] font-black text-white/90 tracking-wider">GO CHARGE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
            </div>

            {/* Digital Charging Monitor Screen */}
            <div className="bg-[#091C1B] rounded-xl p-2 border border-[#19C7B1]/30 text-white space-y-1.5 shadow-inner">
              <div className="flex items-center justify-between text-[7px] text-[#19C7B1] font-bold uppercase">
                <span className="flex items-center gap-0.5">
                  <Zap className="w-2.5 h-2.5 fill-[#19C7B1]" /> DC FAST
                </span>
                <span className="text-[#22C55E]">ACTIVE</span>
              </div>

              {/* Live kW Rate Display */}
              <div className="text-center py-0.5">
                <p className="text-sm sm:text-base font-black text-white leading-none">
                  68.4 <span className="text-[8px] font-normal text-white/70">kW</span>
                </p>
                <div className="w-full bg-white/10 h-1 rounded-full mt-1 overflow-hidden">
                  <div className="bg-gradient-to-r from-[#2DBDB5] to-[#19C7B1] h-full w-[84%] rounded-full animate-pulse" />
                </div>
              </div>

              {/* SoC Percentage */}
              <div className="flex items-center justify-between text-[8px] text-white/80 font-bold pt-0.5">
                <span>SoC: 84%</span>
                <span className="text-[#19C7B1]">~14 min</span>
              </div>
            </div>

            {/* Lower Cable Connector Dock & Gun Socket */}
            <div className="bg-[#123C3A] rounded-lg p-1.5 border border-white/5 flex items-center justify-between">
              <div className="w-2.5 h-2.5 rounded-full bg-[#19C7B1]/30 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#19C7B1]" />
              </div>
              <span className="text-[7px] font-extrabold text-[#D9DED5] tracking-wider">CCS2 150kW</span>
            </div>

            {/* Base Contact Anchor */}
            <div className="w-full h-2 bg-black/40 rounded-full" />
          </div>

          {/* Pedestal Floor Base Shadow */}
          <div className="w-24 h-3 bg-[#123C3A]/20 rounded-full blur-sm mt-1" />
        </div>

        {/* ── CABLE WITH TRAVELING ELECTRICITY PACKETS ── */}
        <div className="absolute inset-0 pointer-events-none z-30">
          <svg className="w-full h-full" viewBox="0 0 580 480" fill="none" preserveAspectRatio="xMidYMid meet">
            <defs>
              {/* Electric gradient */}
              <linearGradient id="cablePulseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#123C3A" />
                <stop offset="50%" stopColor="#19C7B1" />
                <stop offset="100%" stopColor="#2DBDB5" />
              </linearGradient>

              {/* Glowing energy filter */}
              <filter id="energyGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* 1. Base Rubber Charging Cable Path */}
            <path
              id="chargingCablePath"
              d="M 98,310 C 120,380 200,395 240,325 C 255,295 270,270 286,260"
              stroke="#123C3A"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
              opacity="0.95"
            />

            {/* 2. Inner Illuminated Energy Core Line */}
            <path
              d="M 98,310 C 120,380 200,395 240,325 C 255,295 270,270 286,260"
              stroke="#19C7B1"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
              strokeDasharray="6 14"
              className="animate-pulse"
            />

            {/* 3. Traveling Energy Light Wave (CSS animated SVG dash) */}
            <path
              d="M 98,310 C 120,380 200,395 240,325 C 255,295 270,270 286,260"
              stroke="#FFFFFF"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              strokeDasharray="20 180"
              filter="url(#energyGlow)"
              style={{
                animation: 'cableEnergyFlow 2.4s linear infinite',
              }}
            />

            {/* 4. Car Charging Port Connection Node (Illuminated locking gun) */}
            <g transform="translate(286, 260)">
              <circle cx="0" cy="0" r="7" fill="#123C3A" stroke="#19C7B1" strokeWidth="2" />
              <circle cx="0" cy="0" r="3.5" fill="#22C55E" className="animate-ping" />
              <circle cx="0" cy="0" r="3.5" fill="#19C7B1" />
            </g>
          </svg>
        </div>

        {/* ── MODERN ELECTRIC VEHICLE (Right of Hero) ── */}
        <div
          style={{
            transform: `translate3d(${carX}px, ${carY}px, 0)`,
            transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
          }}
          className="relative z-20 flex-1 ml-4 sm:ml-6 flex items-center justify-end"
        >
          {/* Vector Illustrated Modern Aerodynamic Electric Car */}
          <div className="relative w-full max-w-[430px] sm:max-w-[470px]">
            
            {/* Floating Live Telemetry Badge over Vehicle */}
            <div className="absolute -top-10 right-4 z-40 px-3 py-1.5 rounded-pill bg-white/95 backdrop-blur-md border border-[#D9DED5] shadow-card-hover flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]" />
              </span>
              <span className="text-[10px] font-bold text-[#123C3A] tracking-tight">
                Dispensing 68.4 kW · 84% SoC
              </span>
              <span className="text-[9px] font-extrabold text-[#19C7B1] bg-[#19C7B1]/10 px-1.5 py-0.5 rounded-full">
                FAST
              </span>
            </div>

            <svg
              className="w-full h-auto drop-shadow-xl"
              viewBox="0 0 520 230"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Luxury EV Metallic Body Gradient */}
                <linearGradient id="evBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1B4D4A" />
                  <stop offset="45%" stopColor="#123C3A" />
                  <stop offset="85%" stopColor="#0B2625" />
                  <stop offset="100%" stopColor="#071918" />
                </linearGradient>

                {/* Tinted Panoramic Glass Roof Gradient */}
                <linearGradient id="glassRoofGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#2DBDB5" stopOpacity="0.45" />
                  <stop offset="40%" stopColor="#123C3A" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#061615" stopOpacity="0.95" />
                </linearGradient>

                {/* Aerodynamic Wheel Turbine Gradient */}
                <radialGradient id="wheelRimGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#E9EFE7" />
                  <stop offset="40%" stopColor="#19C7B1" />
                  <stop offset="70%" stopColor="#123C3A" />
                  <stop offset="100%" stopColor="#071918" />
                </radialGradient>

                {/* Specular Light Reflection */}
                <linearGradient id="specularGleam" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                  <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* 1. Car Floor Ground Shadow */}
              <ellipse cx="255" cy="202" rx="230" ry="14" fill="#123C3A" fillOpacity="0.22" filter="blur(6px)" />

              {/* 2. Main Aerodynamic Sleek Chassis Body */}
              <path
                d="M 32,168 
                   C 36,152 50,140 76,134 
                   L 142,122 
                   C 180,82 240,58 316,56 
                   L 396,62 
                   C 440,78 472,112 492,136 
                   C 506,152 510,166 498,176 
                   C 488,184 466,186 446,186 
                   L 390,186 
                   C 384,158 356,138 324,138 
                   C 292,138 266,158 260,186 
                   L 174,186 
                   C 168,158 140,138 108,138 
                   C 76,138 50,158 44,186 
                   L 34,184 
                   C 28,180 28,174 32,168 Z"
                fill="url(#evBodyGrad)"
                stroke="#2DBDB5"
                strokeWidth="1.2"
                strokeOpacity="0.5"
              />

              {/* 3. Aerodynamic Beltline Specular Gleam Highlight */}
              <path
                d="M 52,142 C 140,126 270,120 482,146"
                stroke="url(#specularGleam)"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />

              {/* 4. Tinted Glass Cabin & Canopy Roofline */}
              <path
                d="M 148,120 
                   C 182,86 236,66 304,64 
                   L 378,68 
                   C 416,84 442,110 458,124 
                   L 148,120 Z"
                fill="url(#glassRoofGrad)"
                stroke="#19C7B1"
                strokeWidth="1"
                strokeOpacity="0.3"
              />

              {/* B-Pillar Flush Divider */}
              <line x1="284" y1="64" x2="284" y2="122" stroke="#0E2E2C" strokeWidth="4" />

              {/* Window Interior Silhouette Highlights */}
              <path
                d="M 168,114 C 200,92 238,80 276,78 L 276,116 Z"
                fill="#FFFFFF"
                fillOpacity="0.08"
              />

              {/* 5. Front LED Matrix Lightbar (Continuous Modern Horizon Beam) */}
              <path
                d="M 28,168 C 30,164 38,160 48,158"
                stroke="#19C7B1"
                strokeWidth="3.5"
                strokeLinecap="round"
                filter="url(#energyGlow)"
              />
              <path
                d="M 28,168 C 30,164 38,160 48,158"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              {/* 6. Rear Continuous LED Tail Strip */}
              <path
                d="M 496,146 C 504,152 506,160 502,166"
                stroke="#EF4444"
                strokeWidth="3"
                strokeLinecap="round"
                filter="url(#energyGlow)"
              />

              {/* 7. Front Fender Charge Flap Door (OPEN & ILLUMINATED) */}
              <g transform="translate(68, 128)">
                {/* Motorized Open Cover */}
                <rect x="-4" y="-12" width="16" height="5" rx="2.5" fill="#123C3A" stroke="#19C7B1" strokeWidth="1" transform="rotate(-35)" />
                {/* Illuminated Charge Port Socket Socket Ring */}
                <circle cx="4" cy="4" r="8" fill="#0A2422" stroke="#19C7B1" strokeWidth="1.8" />
                <circle cx="4" cy="4" r="4.5" fill="#19C7B1" fillOpacity="0.3" className="animate-ping" />
                <circle cx="4" cy="4" r="3" fill="#19C7B1" />
              </g>

              {/* 8. Flush Aerodynamic Door Handles with Teal Backlight */}
              <rect x="220" y="132" width="18" height="3" rx="1.5" fill="#2DBDB5" fillOpacity="0.8" />
              <rect x="330" y="134" width="18" height="3" rx="1.5" fill="#2DBDB5" fillOpacity="0.8" />

              {/* 9. Front Aerodynamic Wheel Assembly */}
              <g transform="translate(108, 186)">
                {/* Rubber Tire Outer */}
                <circle cx="0" cy="0" r="34" fill="#0E1E1D" stroke="#123C3A" strokeWidth="3" />
                {/* Alloy Wheel Rim */}
                <circle cx="0" cy="0" r="26" fill="url(#wheelRimGrad)" />
                {/* Modern Directional Turbine Spokes */}
                <circle cx="0" cy="0" r="16" fill="#0B2625" stroke="#19C7B1" strokeWidth="1.5" />
                <path d="M -20,0 L 20,0 M 0,-20 L 0,20 M -14,-14 L 14,14 M -14,14 L 14,-14" stroke="#D9DED5" strokeWidth="1.5" strokeOpacity="0.7" />
                {/* Teal Center Hub Cap */}
                <circle cx="0" cy="0" r="6" fill="#19C7B1" />
              </g>

              {/* 10. Rear Aerodynamic Wheel Assembly */}
              <g transform="translate(324, 186)">
                {/* Rubber Tire Outer */}
                <circle cx="0" cy="0" r="34" fill="#0E1E1D" stroke="#123C3A" strokeWidth="3" />
                {/* Alloy Wheel Rim */}
                <circle cx="0" cy="0" r="26" fill="url(#wheelRimGrad)" />
                {/* Modern Directional Turbine Spokes */}
                <circle cx="0" cy="0" r="16" fill="#0B2625" stroke="#19C7B1" strokeWidth="1.5" />
                <path d="M -20,0 L 20,0 M 0,-20 L 0,20 M -14,-14 L 14,14 M -14,14 L 14,-14" stroke="#D9DED5" strokeWidth="1.5" strokeOpacity="0.7" />
                {/* Teal Center Hub Cap */}
                <circle cx="0" cy="0" r="6" fill="#19C7B1" />
              </g>
            </svg>
          </div>
        </div>

      </div>

    </div>
  );
};
