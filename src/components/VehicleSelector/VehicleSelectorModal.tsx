import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Bike, Car, ArrowRight, ArrowLeft, CheckCircle2, 
  Sparkles, HelpCircle, Zap, Shield, RotateCcw, Info
} from 'lucide-react';
import { 
  INDIAN_EV_DATABASE, 
  VehicleModel, 
  VehicleCategory, 
  getBrandsByCategory, 
  getModelsByBrand, 
  CONNECTOR_SPECS,
  IndianConnectorType
} from '../../data/vehicles';

interface VehicleSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVehicle: VehicleModel | null;
  onSelectVehicle: (vehicle: VehicleModel | null) => void;
  onApplyFilter?: () => void;
}

export const VehicleSelectorModal: React.FC<VehicleSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedVehicle,
  onSelectVehicle,
  onApplyFilter,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(selectedVehicle ? 3 : 1);
  const [category, setCategory] = useState<VehicleCategory>(selectedVehicle?.category || '4-Wheeler');
  const [selectedBrand, setSelectedBrand] = useState<string>(selectedVehicle?.brand || '');
  const [tempVehicle, setTempVehicle] = useState<VehicleModel | null>(selectedVehicle);

  if (!isOpen) return null;

  const brands = getBrandsByCategory(category);
  const models = selectedBrand ? getModelsByBrand(selectedBrand) : [];

  const handleSelectCategory = (cat: VehicleCategory) => {
    setCategory(cat);
    const catBrands = getBrandsByCategory(cat);
    setSelectedBrand(catBrands[0] || '');
    setStep(2);
  };

  const handleApply = (v: VehicleModel | null) => {
    onSelectVehicle(v);
    if (onApplyFilter) {
      onApplyFilter();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[2200] flex items-center justify-center p-3 sm:p-4 bg-[#123C3A]/60 dark:bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-2xl bg-[#FAF8F3] dark:bg-[#0D2422] rounded-2xl border border-[#D9DED5] dark:border-[#1E4844] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Top Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#D9DED5] dark:border-[#1E4844] flex items-center justify-between bg-white/70 dark:bg-[#091D1B]/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev - 1) as any)}
                className="p-1.5 rounded-lg text-[#5E716E] dark:text-[#88ABA6] hover:bg-[#E9EFE7] dark:hover:bg-[#123633] transition-colors cursor-pointer"
                title="Go back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#19C7B1] shadow-glow-teal-sm"></span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#19C7B1]">
                  Step {step} of 3
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#123C3A] dark:text-white leading-tight">
                {step === 1 && 'Select Your Vehicle Type'}
                {step === 2 && `Choose Your ${category} Brand & Model`}
                {step === 3 && 'Verified Charger Compatibility'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#5E716E] dark:text-[#88ABA6] hover:text-[#123C3A] dark:hover:text-white hover:bg-[#E9EFE7] dark:hover:bg-[#123633] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational Guidance Notice for First-Timers */}
        <div className="px-5 sm:px-6 py-2.5 bg-[#E9EFE7]/80 dark:bg-[#081B19]/80 border-b border-[#D9DED5] dark:border-[#1E4844] flex items-center gap-2 text-xs text-[#5E716E] dark:text-[#8FAFA9]">
          <Info className="w-4 h-4 text-[#19C7B1] shrink-0" />
          <span>
            Not sure which connector you need? Select your model and Go Charge will automatically show only matching chargers.
          </span>
        </div>

        {/* Wizard Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* STEP 1: Two Large Cards (2-Wheeler vs 4-Wheeler) */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-[#5E716E] dark:text-[#8FAFA9]">
                Choose your electric vehicle category to filter compatible charging sockets across India:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 2-Wheeler Card */}
                <button
                  type="button"
                  onClick={() => handleSelectCategory('2-Wheeler')}
                  className="group relative p-6 rounded-2xl border-2 border-[#D9DED5] dark:border-[#1E4844] hover:border-[#19C7B1] dark:hover:border-[#19C7B1] bg-white dark:bg-[#112D2B] text-left transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between min-h-[220px]"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-[#E9EFE7] dark:bg-[#081B19] text-[#19C7B1] flex items-center justify-center border border-[#D9DED5] dark:border-[#1E4844] group-hover:scale-105 transition-transform">
                      <Bike className="w-7 h-7" />
                    </div>
                    <span className="text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-pill bg-[#E9EFE7] dark:bg-[#081B19] text-[#123C3A] dark:text-[#88ABA6]">
                      2-Wheeler
                    </span>
                  </div>

                  <div className="my-3">
                    <h3 className="text-lg font-extrabold text-[#123C3A] dark:text-white group-hover:text-[#19C7B1] transition-colors">
                      Electric 2-Wheeler
                    </h3>
                    <p className="text-xs text-[#5E716E] dark:text-[#8FAFA9] mt-1 font-medium leading-relaxed">
                      Electric Scooter · Electric Motorcycle
                    </p>
                    <p className="text-[11px] text-[#7A8C89] dark:text-[#648782] mt-2">
                      Ather, Ola, TVS, Bajaj Chetak, Hero Vida, Ultraviolette, Revolt...
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#D9DED5] dark:border-[#1E4844] flex items-center justify-between text-xs font-bold text-[#19C7B1]">
                    <span>Select 2-Wheeler</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* 4-Wheeler Card */}
                <button
                  type="button"
                  onClick={() => handleSelectCategory('4-Wheeler')}
                  className="group relative p-6 rounded-2xl border-2 border-[#D9DED5] dark:border-[#1E4844] hover:border-[#19C7B1] dark:hover:border-[#19C7B1] bg-white dark:bg-[#112D2B] text-left transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between min-h-[220px]"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-[#E9EFE7] dark:bg-[#081B19] text-[#19C7B1] flex items-center justify-center border border-[#D9DED5] dark:border-[#1E4844] group-hover:scale-105 transition-transform">
                      <Car className="w-7 h-7" />
                    </div>
                    <span className="text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-pill bg-[#E9EFE7] dark:bg-[#081B19] text-[#123C3A] dark:text-[#88ABA6]">
                      4-Wheeler
                    </span>
                  </div>

                  <div className="my-3">
                    <h3 className="text-lg font-extrabold text-[#123C3A] dark:text-white group-hover:text-[#19C7B1] transition-colors">
                      Electric 4-Wheeler
                    </h3>
                    <p className="text-xs text-[#5E716E] dark:text-[#8FAFA9] mt-1 font-medium leading-relaxed">
                      Electric Car · Electric SUV · Fleet EV
                    </p>
                    <p className="text-[11px] text-[#7A8C89] dark:text-[#648782] mt-2">
                      Tata, MG, Mahindra, Hyundai, Kia, BYD, Citroën...
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#D9DED5] dark:border-[#1E4844] flex items-center justify-between text-xs font-bold text-[#19C7B1]">
                    <span>Select 4-Wheeler</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Select Brand and Model */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Brand Pills */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5E716E] dark:text-[#8FAFA9] mb-2">
                  1. Select Brand
                </label>
                <div className="flex flex-wrap gap-2">
                  {brands.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setSelectedBrand(b)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer ${
                        selectedBrand === b
                          ? 'bg-[#19C7B1] text-white border-[#19C7B1] shadow-glow-teal-sm'
                          : 'bg-white dark:bg-[#112D2B] text-[#123C3A] dark:text-white border-[#D9DED5] dark:border-[#1E4844] hover:border-[#19C7B1]'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Models Grid */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5E716E] dark:text-[#8FAFA9] mb-2">
                  2. Select {selectedBrand} Model
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                  {models.map((m) => {
                    const isSelected = tempVehicle?.id === m.id;
                    return (
                      <div
                        key={m.id}
                        onClick={() => {
                          setTempVehicle(m);
                          setStep(3);
                        }}
                        className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#19C7B1]/10 dark:bg-[#19C7B1]/20 border-[#19C7B1] shadow-sm'
                            : 'bg-white dark:bg-[#112D2B] border-[#D9DED5] dark:border-[#1E4844] hover:border-[#19C7B1]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#E9EFE7] dark:bg-[#081B19] text-[#123C3A] dark:text-[#8FAFA9]">
                              {m.subType}
                            </span>
                            {m.popular && (
                              <span className="text-[10px] font-bold text-[#19C7B1] flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> Popular
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-extrabold text-[#123C3A] dark:text-white leading-tight">
                            {m.brand} {m.model}
                          </h4>
                          <p className="text-[11px] text-[#5E716E] dark:text-[#8FAFA9] mt-1">
                            {m.connectorDescription}
                          </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-[#D9DED5]/60 dark:border-[#1E4844]/60 flex items-center justify-between text-[11px]">
                          <span className="text-[#7A8C89] dark:text-[#648782]">
                            Est. {m.realRangeKm} km range
                          </span>
                          <span className="font-bold text-[#19C7B1] flex items-center gap-1">
                            Select <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Automatically Determined Connector & Confirmation */}
          {step === 3 && tempVehicle && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-white dark:bg-[#112D2B] border border-[#D9DED5] dark:border-[#1E4844] shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#19C7B1]/15 text-[#19C7B1] flex items-center justify-center">
                      {tempVehicle.category === '4-Wheeler' ? (
                        <Car className="w-6 h-6" />
                      ) : (
                        <Bike className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#E9EFE7] dark:bg-[#081B19] text-[#123C3A] dark:text-[#8FAFA9]">
                        {tempVehicle.category} · {tempVehicle.subType}
                      </span>
                      <h3 className="text-lg font-extrabold text-[#123C3A] dark:text-white mt-0.5">
                        {tempVehicle.brand} {tempVehicle.model}
                      </h3>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs font-bold text-[#19C7B1] hover:underline"
                  >
                    Change Model
                  </button>
                </div>

                {/* Compatibility Explanation */}
                <div className="mt-4 pt-4 border-t border-[#D9DED5] dark:border-[#1E4844]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#5E716E] dark:text-[#8FAFA9] mb-2.5">
                    Verified Supported Connectors:
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {tempVehicle.connectors.map((conn) => {
                      const spec = CONNECTOR_SPECS[conn as IndianConnectorType];
                      return (
                        <div
                          key={conn}
                          className="p-3 rounded-xl bg-[#F4F1E8] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#1E4844] text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-[#123C3A] dark:text-white flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                              {conn}
                            </span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white dark:bg-[#112D2B] text-[#19C7B1]">
                              {spec?.category || 'Charging Port'}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#5E716E] dark:text-[#8FAFA9]">
                            {spec?.typicalPower || 'Standard power'}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-3 p-3 rounded-xl bg-[#19C7B1]/10 dark:bg-[#19C7B1]/15 border border-[#19C7B1]/30 flex items-start gap-2.5 text-xs text-[#123C3A] dark:text-[#E4EFEA]">
                    <Shield className="w-4 h-4 text-[#19C7B1] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Automatic Smart Matching Active</p>
                      <p className="text-[11px] text-[#5E716E] dark:text-[#8FAFA9] mt-0.5">
                        Go Charge will automatically display only stations compatible with your {tempVehicle.brand} {tempVehicle.model}. No technical guesswork required.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="px-5 sm:px-6 py-4 border-t border-[#D9DED5] dark:border-[#1E4844] bg-white/70 dark:bg-[#091D1B]/80 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => handleApply(null)}
            className="text-xs font-semibold text-[#5E716E] dark:text-[#8FAFA9] hover:text-[#123C3A] dark:hover:text-white flex items-center gap-1.5 cursor-pointer order-2 sm:order-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Vehicle & View All Stations</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto order-1 sm:order-2">
            {step < 3 && tempVehicle && (
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-[#D9DED5] dark:border-[#1E4844] text-xs font-bold text-[#123C3A] dark:text-white hover:bg-[#E9EFE7] dark:hover:bg-[#123633] transition-colors"
              >
                Skip to Specs
              </button>
            )}

            <button
              type="button"
              disabled={!tempVehicle}
              onClick={() => handleApply(tempVehicle)}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#19C7B1] hover:bg-[#15A896] text-white text-xs font-bold shadow-glow-teal-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <span>Apply & Find Compatible Chargers</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
