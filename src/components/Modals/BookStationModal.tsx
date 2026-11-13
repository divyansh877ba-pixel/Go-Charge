import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Clock, Zap, IndianRupee, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';
import { Station, Connector } from '../../types';

interface BookStationModalProps {
  isOpen: boolean;
  onClose: () => void;
  station: Station;
  onBookingConfirmed?: (booking: any) => void;
}

export const BookStationModal: React.FC<BookStationModalProps> = ({
  isOpen,
  onClose,
  station,
  onBookingConfirmed,
}) => {
  const [selectedConnector, setSelectedConnector] = useState<Connector>(station.connectors[0] || null);
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [startTime, setStartTime] = useState<'Now' | 'In 15 Mins' | 'In 30 Mins'>('Now');
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!isOpen) return null;

  const estimatedUnitsKwh = Math.round(((selectedConnector?.powerKw || 30) * (durationMinutes / 60)) * 10) / 10;
  const estimatedEnergyCost = Math.round(estimatedUnitsKwh * station.pricePerKwh);
  const totalCost = Math.max(station.minSessionFee, estimatedEnergyCost);

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmed(true);
    const newBooking = {
      id: `bk-${Date.now().toString().slice(-5)}`,
      stationId: station.id,
      stationName: station.name,
      connectorType: selectedConnector?.type || 'CCS2',
      durationMinutes,
      totalCost,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    if (onBookingConfirmed) onBookingConfirmed(newBooking);
    setTimeout(() => {
      setIsConfirmed(false);
      onClose();
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-[2300] flex items-center justify-center p-4 bg-[#123C3A]/60 dark:bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-md bg-[#FAF8F3] dark:bg-[#0D2422] rounded-2xl border border-[#D9DED5] dark:border-[#1E4844] shadow-2xl p-5 sm:p-6 text-[#14201F] dark:text-[#E4EFEA] space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#D9DED5] dark:border-[#1E4844]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#19C7B1]/15 text-[#19C7B1] flex items-center justify-center">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#123C3A] dark:text-white">Reserve Charging Bay</h3>
              <p className="text-[11px] text-[#5E716E] dark:text-[#8FAFA9]">{station.name}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5E716E] dark:text-[#8FAFA9] hover:text-[#123C3A] dark:hover:text-white hover:bg-[#E9EFE7] dark:hover:bg-[#123633] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Disclaimer Banner */}
        <div className="p-2.5 rounded-xl bg-[#19C7B1]/10 dark:bg-[#19C7B1]/15 border border-[#19C7B1]/30 flex items-center gap-2 text-[11px] text-[#123C3A] dark:text-[#8FAFA9]">
          <ShieldAlert className="w-4 h-4 text-[#19C7B1] shrink-0" />
          <span>Interactive Demo: Reserve a bay slot for testing without live payments.</span>
        </div>

        {!isConfirmed ? (
          <form onSubmit={handleConfirm} className="space-y-4">
            {/* Step 1: Connector Choice */}
            <div>
              <label className="block text-xs font-bold text-[#5E716E] dark:text-[#8FAFA9] mb-1.5">
                1. Select Charging Bay:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {station.connectors.map((c) => {
                  const isSelected = selectedConnector?.id === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedConnector(c)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#19C7B1]/15 dark:bg-[#19C7B1]/20 border-[#19C7B1] text-[#123C3A] dark:text-white font-bold shadow-sm'
                          : 'bg-white dark:bg-[#112D2B] border-[#D9DED5] dark:border-[#1E4844] text-[#14201F] dark:text-[#E4EFEA]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">{c.type}</span>
                        <span className="text-[10px] text-[#19C7B1]">{c.powerKw}kW</span>
                      </div>
                      <p className="text-[10px] text-[#5E716E] dark:text-[#8FAFA9] mt-0.5">Bay #{c.portNumber} · {c.speedType}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Duration */}
            <div>
              <label className="block text-xs font-bold text-[#5E716E] dark:text-[#8FAFA9] mb-1.5">
                2. Charging Duration:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDurationMinutes(mins)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      durationMinutes === mins
                        ? 'bg-[#19C7B1] text-white border-[#19C7B1]'
                        : 'bg-white dark:bg-[#112D2B] border-[#D9DED5] dark:border-[#1E4844] text-[#123C3A] dark:text-white'
                    }`}
                  >
                    {mins} Minutes
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Estimated Calculation */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#112D2B] border border-[#D9DED5] dark:border-[#1E4844] space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[#5E716E] dark:text-[#8FAFA9]">
                <span>Rate per kWh:</span>
                <span className="font-bold text-[#123C3A] dark:text-white">₹{station.pricePerKwh}</span>
              </div>
              <div className="flex items-center justify-between text-[#5E716E] dark:text-[#8FAFA9]">
                <span>Estimated Energy:</span>
                <span className="font-bold text-[#123C3A] dark:text-white">~{estimatedUnitsKwh} kWh</span>
              </div>
              <div className="pt-2 border-t border-[#D9DED5] dark:border-[#1E4844] flex items-center justify-between text-sm font-extrabold text-[#123C3A] dark:text-[#19C7B1]">
                <span>Estimated Total:</span>
                <span>₹{totalCost}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#19C7B1] hover:bg-[#15A896] text-white font-extrabold text-xs shadow-glow-teal flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Reservation (Demo)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <div className="p-6 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/40 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-[#22C55E] mx-auto animate-bounce" />
            <h4 className="text-sm font-extrabold text-[#123C3A] dark:text-white">Bay Reserved Successfully!</h4>
            <p className="text-xs text-[#5E716E] dark:text-[#8FAFA9]">
              Bay #{selectedConnector?.portNumber || 1} has been reserved for your EV at {station.name}. You have 15 minutes to arrive.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
