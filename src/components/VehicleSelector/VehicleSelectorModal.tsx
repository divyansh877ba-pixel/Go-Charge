import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Bike, Car, ArrowRight, ArrowLeft, CheckCircle2, 
  Sparkles, HelpCircle, Zap, Shield, RotateCcw, Info, Search 
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
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const brands = getBrandsByCategory(category);
  const models = selectedBrand ? getModelsByBrand(selectedBrand) : [];

  // Filtered search results across all Indian EV database
  const searchResults = searchQuery.trim()
    ? INDIAN_EV_DATABASE.filter((v) =>
        v.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.connectors.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

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
    <div className="fixed inset-0 z-[2200] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#123C3A]/60 dark:bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-2xl bg-[#FAF8F3] dark:bg-[#0D2422] rounded-t-3xl sm:rounded-2xl border-t sm:border border-[#D9DED5] dark:border-[#1E4844] shadow-2xl overflow-hidden flex flex-col max-h-[92dvh] sm:max-h-[90vh] pb-safe"
      >
        {/* Mobile Swipe / Drag Handle Indicator */}
        <div className="sm:hidden w-full pt-2.5 pb-1 flex justify-center">
          <div className="w-10 h-1 rounded-full bg-[#B8C2B3] dark:bg-[#1E4844]" />
        </div>

        {/* Top Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[#D9DED5] dark:border-[#1E4844] flex items-center justify-between bg-white/70 dark:bg-[#091D1B]/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            {step > 1 && !searchQuery && (
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
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#19C7B1]">
                  {searchQuery ? 'Search Indian EV Catalog' : `Step ${step} of 3`}
                </span>
              </div>
              <h2 className="text-sm sm:text-lg font-bold text-[#123C3A] dark:text-white leading-tight">
                {searchQuery
                  ? `Matching Models (${searchResults.length})`
                  : step === 1
                  ? 'Select Your Vehicle Type'
                  : step === 2
                  ? `Choose Your ${category} Brand & Model`
                  : 'Verified Charger Compatibility'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#5E716E] dark:text-[#88ABA6] hover:text-[#123C3A] dark:hover:text-white hover:bg-[#E9EFE7] dark:hover:bg-[#123633] transition-colors cursor-pointer"
            aria-label="Close vehicle selector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Search Row */}
        <div className="px-4 sm:px-6 py-2 bg-white/50 dark:bg-[#071715]/50 border-b border-[#D9DED5]/80 dark:border-[#1E4844]/80 shrink-0">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-[#19C7B1] absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by model or brand (Nexon, Ather, Ola, Chetak, Curvv...)"
              className="w-full pl-8 sm:pl-9 pr-8 py-2 rounded-xl bg-white dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#1E4844] focus:border-[#19C7B1] text-xs text-[#14201F] dark:text-[#E4EFEA] placeholder-[#7A8C89] dark:placeholder-[#648782] outline-none shadow-inner transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 p-0.5 rounded-full text-[#7A8C89] hover:text-[#123C3A] dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Informational Guidance Notice (hidden if searching) */}
        {!searchQuery && (
          <div className="px-4 sm:px-6 py-2 bg-[#E9EFE7]/80 dark:bg-[#081B19]/80 border-b border-[#D9DED5] dark:border-[#1E4844] flex items-center gap-2 text-[11px] sm:text-xs text-[#5E716E] dark:text-[#8FAFA9] shrink-0">
            <Info className="w-3.5 h-3.5 text-[#19C7B1] shrink-0" />
            <span className="truncate">
              Not sure about connector specs? Select your EV and Go Charge automatically matches verified sockets.
            </span>
          </div>
        )}

        {/* Wizard Body / Search Results */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* SEARCH RESULTS VIEW */}
          {searchQuery ? (
            <div className="space-y-3">
              {searchResults.length === 0 ? (
                <div className="py-10 text-center space-y-2">
                  <p className="text-sm font-bold text-[#123C3A] dark:text-white">
                    No electric vehicles found matching "{searchQuery}"
                  </p>
                  <p className="text-xs text-[#5E716E] dark:text-[#8FAFA9]">
                    Try searching for Tata, Ather, Ola, MG, Mahindra, BYD, TVS, or Chetak.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {searchResults.map((m) => {
                    const isSelected = tempVehicle?.id === m.id;
                    return (
                      <div
                        key={m.id}
                        onClick={() => {
                          setTempVehicle(m);
                          setCategory(m.category);
                          setSelectedBrand(m.brand);
                          setSearchQuery('');
                          setStep(3);
                        }}
                        className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-[#19C7B1]/15 dark:bg-[#19C7B1]/20 border-[#19C7B1] shadow-sm'
                            : 'bg-white dark:bg-[#112D2B] border-[#D9DED5] dark:border-[#1E4844] hover:border-[#19C7B1]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-[#E9EFE7] dark:bg-[#081B19] text-[#19C7B1] flex items-center justify-center shrink-0">
                            {m.category === '4-Wheeler' ? <Car className="w-4 h-4" /> : <Bike className="w-4 h-4" />}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs sm:text-sm font-extrabold text-[#123C3A] dark:text-white truncate">
                              {m.brand} {m.model}
                            </h4>
                            <p className="text-[10px] text-[#5E716E] dark:text-[#8FAFA9] truncate">
                              {m.category} • {m.connectors.join(', ')}
                            </p>
                          </div>
                        </div>

                        {isSelected ? (
                          <CheckCircle2 className="w-4 h-4 text-[#19C7B1] shrink-0" />
                        ) : (
                          <ArrowRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* STEP 1: Two Large Cards (2-Wheeler vs 4-Wheeler) */}
              {step === 1 && (
                <div className="space-y-3.5">
                  <p className="text-xs sm:text-sm text-[#5E716E] dark:text-[#8FAFA9]">
                    Choose your electric vehicle category to filter compatible charging sockets across India:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {/* 2-Wheeler Card */}
                    <button
                      type="button"
                      onClick={() => handleSelectCategory('2-Wheeler')}
                      className="group relative p-4 sm:p-6 rounded-2xl border-2 border-[#D9DED5] dark:border-[#1E4844] hover:border-[#19C7B1] dark:hover:border-[#19C7B1] bg-white dark:bg-[#112D2B] text-left transition-all duration-200 hover:shadow-card-hover cursor-pointer flex flex-col justify-between min-h-[160px] sm:min-h-[220px]"
                    >
                      <div className="flex items-start justify-between">
                        <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-[#E9EFE7] dark:bg-[#081B19] text-[#19C7B1] flex items-center justify-center border border-[#D9DED5] dark:border-[#1E4844] group-hover:scale-105 transition-transform">
                          <Bike className="w-6 h-6 sm:w-7 sm:h-7" />
                        </div>
                        <span className="text-[10px] sm:text-[11px] font-extrabold uppercase px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-pill bg-[#E9EFE7] dark:bg-[#081B19] text-[#123C3A] dark:text-[#88ABA6]">
                          2-Wheeler
                        </span>
                      </div>

                      <div className="my-2 sm:my-3">
                        <h3 className="text-base sm:text-lg font-extrabold text-[#123C3A] dark:text-white group-hover:text-[#19C7B1] transition-colors">
                          Electric 2-Wheeler
                        </h3>
                        <p className="text-[11px] sm:text-xs text-[#5E716E] dark:text-[#8FAFA9] mt-0.5 font-medium">
                          Electric Scooter · Electric Motorcycle
                        </p>
                        <p className="text-[10px] sm:text-[11px] text-[#7A8C89] dark:text-[#648782] mt-1.5">
                          Ather, Ola, TVS, Bajaj Chetak, Hero Vida, Ultraviolette...
                        </p>
                      </div>

                      <div className="pt-2 sm:pt-3 border-t border-[#D9DED5] dark:border-[#1E4844] flex items-center justify-between text-xs font-bold text-[#19C7B1]">
                        <span>Select 2-Wheeler</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>

                    {/* 4-Wheeler Card */}
                    <button
                      type="button"
                      onClick={() => handleSelectCategory('4-Wheeler')}
                      className="group relative p-4 sm:p-6 rounded-2xl border-2 border-[#D9DED5] dark:border-[#1E4844] hover:border-[#19C7B1] dark:hover:border-[#19C7B1] bg-white dark:bg-[#112D2B] text-left transition-all duration-200 hover:shadow-card-hover cursor-pointer flex flex-col justify-between min-h-[160px] sm:min-h-[220px]"
                    >
                      <div className="flex items-start justify-between">
                        <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-[#E9EFE7] dark:bg-[#081B19] text-[#19C7B1] flex items-center justify-center border border-[#D9DED5] dark:border-[#1E4844] group-hover:scale-105 transition-transform">
                          <Car className="w-6 h-6 sm:w-7 sm:h-7" />
                        </div>
                        <span className="text-[10px] sm:text-[11px] font-extrabold uppercase px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-pill bg-[#E9EFE7] dark:bg-[#081B19] text-[#123C3A] dark:text-[#88ABA6]">
                          4-Wheeler
                        </span>
                      </div>

                      <div className="my-2 sm:my-3">
                        <h3 className="text-base sm:text-lg font-extrabold text-[#123C3A] dark:text-white group-hover:text-[#19C7B1] transition-colors">
                          Electric 4-Wheeler
                        </h3>
                        <p className="text-[11px] sm:text-xs text-[#5E716E] dark:text-[#8FAFA9] mt-0.5 font-medium">
                          Electric Car · Electric SUV · Fleet EV
                        </p>
                        <p className="text-[10px] sm:text-[11px] text-[#7A8C89] dark:text-[#648782] mt-1.5">
                          Tata, MG, Mahindra, Hyundai, Kia, BYD, Citroën...
                        </p>
                      </div>

                      <div className="pt-2 sm:pt-3 border-t border-[#D9DED5] dark:border-[#1E4844] flex items-center justify-between text-xs font-bold text-[#19C7B1]">
                        <span>Select 4-Wheeler</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Select Brand and Model */}
              {step === 2 && (
                <div className="space-y-4">
                  {/* Brand Pills */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#5E716E] dark:text-[#8FAFA9] mb-2">
                      1. Select Brand
                    </label>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {brands.map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setSelectedBrand(b)}
                          className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer ${
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 sm:max-h-72 overflow-y-auto pr-1">
                      {models.map((m) => {
                        const isSelected = tempVehicle?.id === m.id;
                        return (
                          <div
                            key={m.id}
                            onClick={() => {
                              setTempVehicle(m);
                              setStep(3);
                            }}
                            className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? 'bg-[#19C7B1]/10 dark:bg-[#19C7B1]/20 border-[#19C7B1] shadow-sm'
                                : 'bg-white dark:bg-[#112D2B] border-[#D9DED5] dark:border-[#1E4844] hover:border-[#19C7B1]'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#E9EFE7] dark:bg-[#081B19] text-[#123C3A] dark:text-[#8FAFA9]">
                                  {m.subType}
                                </span>
                                {m.popular && (
                                  <span className="text-[10px] font-bold text-[#19C7B1] flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" /> Popular
                                  </span>
                                )}
                              </div>
                              <h4 className="text-xs sm:text-sm font-extrabold text-[#123C3A] dark:text-white leading-tight">
                                {m.brand} {m.model}
                              </h4>
                              <p className="text-[11px] text-[#5E716E] dark:text-[#8FAFA9] mt-0.5">
                                Connectors: {m.connectors.join(', ')}
                              </p>
                            </div>

                            <div className="mt-2 pt-2 border-t border-[#D9DED5]/60 dark:border-[#1E4844]/60 flex items-center justify-between text-xs font-bold text-[#19C7B1]">
                              <span>View Compatibility</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Vehicle Specs and Compatibility Display */}
              {step === 3 && tempVehicle && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white dark:bg-[#112D2B] border border-[#D9DED5] dark:border-[#1E4844] shadow-sm">
                    <div className="flex items-center justify-between pb-3 border-b border-[#D9DED5] dark:border-[#1E4844]">
                      <div>
                        <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#19C7B1]/15 text-[#19C7B1]">
                          {tempVehicle.category} · {tempVehicle.subType}
                        </span>
                        <h3 className="text-base sm:text-lg font-black text-[#123C3A] dark:text-white mt-1">
                          {tempVehicle.brand} {tempVehicle.model}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="text-xs font-bold text-[#19C7B1] hover:underline cursor-pointer"
                      >
                        Change Model
                      </button>
                    </div>

                    {/* Compatibility Explanation */}
                    <div className="mt-3.5 pt-1">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#5E716E] dark:text-[#8FAFA9] mb-2">
                        Verified Supported Connectors:
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {tempVehicle.connectors.map((conn) => {
                          const spec = CONNECTOR_SPECS[conn as IndianConnectorType];
                          return (
                            <div
                              key={conn}
                              className="p-2.5 rounded-xl bg-[#F4F1E8] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#1E4844] text-xs space-y-0.5"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-extrabold text-[#123C3A] dark:text-white flex items-center gap-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                                  {conn}
                                </span>
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white dark:bg-[#112D2B] text-[#19C7B1]">
                                  {spec?.category || 'Port'}
                                </span>
                              </div>
                              <p className="text-[10px] text-[#5E716E] dark:text-[#8FAFA9]">
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
                            Go Charge will automatically display only stations compatible with your {tempVehicle.brand} {tempVehicle.model}.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* Bottom Actions */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-[#D9DED5] dark:border-[#1E4844] bg-white/70 dark:bg-[#091D1B]/80 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => handleApply(null)}
            className="text-xs font-semibold text-[#5E716E] dark:text-[#8FAFA9] hover:text-[#123C3A] dark:hover:text-white flex items-center gap-1.5 cursor-pointer order-2 sm:order-1 py-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Vehicle & View All</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto order-1 sm:order-2">
            {step < 3 && tempVehicle && !searchQuery && (
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl border border-[#D9DED5] dark:border-[#1E4844] text-xs font-bold text-[#123C3A] dark:text-white hover:bg-[#E9EFE7] dark:hover:bg-[#123633] transition-colors cursor-pointer"
              >
                Skip to Specs
              </button>
            )}

            <button
              type="button"
              disabled={!tempVehicle}
              onClick={() => handleApply(tempVehicle)}
              className="flex-1 sm:flex-none px-5 sm:px-6 py-2.5 rounded-xl bg-[#19C7B1] hover:bg-[#15A896] text-white text-xs font-bold shadow-glow-teal-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
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