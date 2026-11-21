import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, BatteryCharging, CheckCircle2, AlertOctagon, IndianRupee, Clock, Activity } from 'lucide-react';
import { Station, Connector } from '../../types';

interface ChargingSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  station: Station;
  connector: Connector;
}

export const ChargingSessionModal: React.FC<ChargingSessionModalProps> = ({
  isOpen,
  onClose,
  station,
  connector,
}) => {
  const [batteryPercent, setBatteryPercent] = useState(32);
  const [energyDelivered, setEnergyDelivered] = useState(4.2);
  const [elapsedSeconds, setElapsedSeconds] = useState(128);
  const [currentPowerKw, setCurrentPowerKw] = useState(48.6);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!isOpen || isCompleted) return;

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
      setEnergyDelivered((prev) => +(prev + 0.035).toFixed(2));
      setCurrentPowerKw(+(connector.powerKw * 0.94 + (Math.random() - 0.5) * 1.5).toFixed(1));
      
      setBatteryPercent((prev) => {
        if (prev >= 95) return prev;
        return +(prev + 0.15).toFixed(1);
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isCompleted, connector]);

  if (!isOpen) return null;

  const cost = Math.max(station.minSessionFee, Math.round(energyDelivered * station.pricePerKwh));
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const handleStopCharging = () => {
    setIsCompleted(true);
  };

  const handleFinish = () => {
    setIsCompleted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#123C3A]/60 dark:bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md p-4 sm:p-6 rounded-t-3xl sm:rounded-card bg-white dark:bg-[#0D2422] border-t sm:border border-[#D9DED5] dark:border-[#183E3A] shadow-2xl text-[#14201F] dark:text-[#E4EFEA] space-y-4 sm:space-y-6 pb-safe sm:pb-6 max-h-[92dvh] overflow-y-auto"
      >
        {/* Mobile Swipe Handle Indicator */}
        <div className="sm:hidden w-full pt-1 pb-1 flex justify-center">
          <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-[#183E3A]" />
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D9DED5] dark:border-[#183E3A]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E9EFE7] dark:bg-[#081B19] text-[#19C7B1] flex items-center justify-center animate-pulse-subtle border border-[#D9DED5] dark:border-[#183E3A]">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#123C3A] dark:text-[#E4EFEA]">
                {isCompleted ? 'Charging Completed' : 'Active Charging Session'}
              </h3>
              <p className="text-[11px] text-[#5E716E] dark:text-[#8FAFA9]">
                {station.name} · Bay #{connector.portNumber}
              </p>
            </div>
          </div>

          {!isCompleted && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#5E716E] dark:text-[#8FAFA9] hover:text-[#123C3A] dark:hover:text-white hover:bg-[#E9EFE7] dark:hover:bg-[#123431] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {isCompleted ? (
          /* Receipt / Summary */
          <div className="space-y-5 text-center py-2">
            <div className="w-16 h-16 rounded-full bg-[#22C55E]/15 text-[#22C55E] flex items-center justify-center mx-auto shadow-glow-green">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-xl font-extrabold text-[#123C3A] dark:text-[#E4EFEA]">Session Successful</h4>
              <p className="text-xs text-[#5E716E] dark:text-[#8FAFA9] mt-1 font-medium">
                Your electric vehicle received {energyDelivered} kWh
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#E9EFE7] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#183E3A] space-y-2.5 text-xs text-left">
              <div className="flex justify-between text-[#5E716E] dark:text-[#8FAFA9]">
                <span>Connector</span>
                <span className="text-[#123C3A] dark:text-[#E4EFEA] font-bold">{connector.type} ({connector.powerKw} kW)</span>
              </div>
              <div className="flex justify-between text-[#5E716E] dark:text-[#8FAFA9]">
                <span>Time Duration</span>
                <span className="text-[#123C3A] dark:text-[#E4EFEA] font-bold">{timeFormatted}</span>
              </div>
              <div className="flex justify-between text-[#5E716E] dark:text-[#8FAFA9]">
                <span>Energy Dispensed</span>
                <span className="text-[#19C7B1] font-bold">{energyDelivered} kWh</span>
              </div>
              <div className="flex justify-between text-[#5E716E] dark:text-[#8FAFA9]">
                <span>Tariff Rate</span>
                <span className="text-[#123C3A] dark:text-[#E4EFEA] font-bold">₹{station.pricePerKwh} / kWh</span>
              </div>
              <div className="pt-2 border-t border-[#D9DED5] dark:border-[#183E3A] flex justify-between text-sm font-extrabold text-[#123C3A] dark:text-[#E4EFEA]">
                <span>Total Amount Paid</span>
                <span className="text-[#19C7B1]">₹{cost}</span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3 rounded-btn bg-[#19C7B1] hover:bg-[#123C3A] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-glow-teal-sm cursor-pointer"
            >
              Done & Release Connector
            </button>
          </div>
        ) : (
          /* Live Charging In Progress */
          <div className="space-y-6">
            
            {/* Battery Circular / Progress Ring Preview */}
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-36 h-36 transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="54"
                    className="stroke-[#D9DED5] dark:stroke-[#183E3A]"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="54"
                    stroke="#19C7B1"
                    strokeWidth="8"
                    strokeDasharray="339.29"
                    strokeDashoffset={339.29 - (Math.min(100, Math.max(0, batteryPercent)) / 100) * 339.29}
                    strokeLinecap="round"
                    fill="transparent"
                    style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <BatteryCharging className="w-6 h-6 text-[#19C7B1] mb-1 animate-pulse" />
                  <span className="text-2xl font-black text-[#123C3A] dark:text-[#E4EFEA] tabular-nums">
                    {Math.floor(batteryPercent)}%
                  </span>
                  <span className="text-[10px] text-[#5E716E] dark:text-[#8FAFA9] font-semibold">SoC</span>
                </div>
              </div>

              <p className="text-xs font-bold text-[#19C7B1] mt-3 flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#19C7B1] animate-ping" />
                Dispensing DC Ultra Fast Power
              </p>
            </div>

            {/* Metrics Grid with Tabular Numbers */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 rounded-xl bg-[#E9EFE7] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#183E3A]">
                <span className="text-[10px] text-[#5E716E] dark:text-[#8FAFA9] uppercase font-bold">Speed</span>
                <p className="text-sm font-black text-[#123C3A] dark:text-[#E4EFEA] mt-0.5 tabular-nums">{currentPowerKw} kW</p>
              </div>

              <div className="p-3 rounded-xl bg-[#E9EFE7] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#183E3A]">
                <span className="text-[10px] text-[#5E716E] dark:text-[#8FAFA9] uppercase font-bold">Delivered</span>
                <p className="text-sm font-black text-[#19C7B1] mt-0.5 tabular-nums">{energyDelivered} kWh</p>
              </div>

              <div className="p-3 rounded-xl bg-[#E9EFE7] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#183E3A]">
                <span className="text-[10px] text-[#5E716E] dark:text-[#8FAFA9] uppercase font-bold">Time</span>
                <p className="text-sm font-black text-[#123C3A] dark:text-[#E4EFEA] mt-0.5 tabular-nums">{timeFormatted}</p>
              </div>
            </div>

            {/* Live Cost estimation */}
            <div className="p-3 rounded-xl bg-[#E9EFE7] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#183E3A] flex items-center justify-between text-xs">
              <span className="text-[#5E716E] dark:text-[#8FAFA9] font-medium">Current Session Charge:</span>
              <span className="text-base font-black text-[#123C3A] dark:text-[#18C5B7] tabular-nums">₹{cost}</span>
            </div>

            {/* Stop Charging Button */}
            <button
              onClick={handleStopCharging}
              className="w-full py-3 rounded-btn bg-[#123C3A] dark:bg-[#18C5B7] hover:bg-[#0E2E2C] dark:hover:bg-[#2FE0D2] text-white dark:text-[#071715] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-card-subtle cursor-pointer"
            >
              <AlertOctagon className="w-4 h-4 text-[#19C7B1] dark:text-[#071715]" />
              <span>Stop Charging & Unplug</span>
            </button>
          </div>
        )}

      </motion.div>
    </div>
  );
};
