import React, { useState } from 'react';
import { 
  X, Zap, MapPin, IndianRupee, Image as ImageIcon, CheckCircle2, 
  ArrowRight, ArrowLeft, Trash2, Plus, Sparkles, AlertCircle, Clock, ShieldCheck
} from 'lucide-react';
import { ChargerCategory, HostConnectorType, HostCharger } from '../../types/host';
import { LocationPinPicker } from './LocationPinPicker';
import { SAMPLE_CHARGER_PRESETS } from '../../data/mockHostData';

interface ChargerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newCharger: Omit<HostCharger, 'id' | 'createdAt' | 'totalBookings' | 'totalEarnings' | 'rating' | 'reviewsCount'>) => void;
}

export const ChargerRegistrationModal: React.FC<ChargerRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  // Wizard Step State (1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form Fields - Step 1: Charger Information
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ChargerCategory>('Home');
  const [connectorType, setConnectorType] = useState<HostConnectorType>('CCS2');
  const [capacityKw, setCapacityKw] = useState<number>(22);
  const [description, setDescription] = useState('');

  // Form Fields - Step 2: Location
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('New Delhi');
  const [state, setState] = useState('Delhi');
  const [pincode, setPincode] = useState('110001');
  const [lat, setLat] = useState<number>(28.6139);
  const [lng, setLng] = useState<number>(77.2090);

  // Form Fields - Step 3: Pricing & Timing
  const [pricePerKwh, setPricePerKwh] = useState<number>(18);
  const [minDurationMinutes, setMinDurationMinutes] = useState<number>(30);
  const [is24x7, setIs24x7] = useState<boolean>(true);
  const [openingTime, setOpeningTime] = useState<string>('06:00');
  const [closingTime, setClosingTime] = useState<string>('23:00');
  const [availableDays, setAvailableDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);

  // Form Fields - Step 4: Photos
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80'
  ]);
  const [isUploading, setIsUploading] = useState(false);

  // Step 5: Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Available days toggle helper
  const toggleDay = (day: string) => {
    if (availableDays.includes(day)) {
      if (availableDays.length > 1) {
        setAvailableDays(availableDays.filter((d) => d !== day));
      }
    } else {
      setAvailableDays([...availableDays, day]);
    }
  };

  // Image Upload handler
  const handleImageFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newImageUrls: string[] = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          newImageUrls.push(uploadEvent.target.result as string);
          if (newImageUrls.length === files.length) {
            setImages((prev) => [...prev, ...newImageUrls]);
            setIsUploading(false);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addPresetImage = (url: string) => {
    if (!images.includes(url)) {
      setImages((prev) => [...prev, url]);
    }
  };

  const validateStep = (step: number) => {
    setErrorMsg(null);
    if (step === 1) {
      if (!name.trim()) {
        setErrorMsg('Please enter a descriptive name for your charger listing.');
        return false;
      }
      if (!capacityKw || capacityKw <= 0) {
        setErrorMsg('Please enter valid charging power capacity (kW).');
        return false;
      }
      if (!description.trim()) {
        setErrorMsg('Please add brief parking or access instructions.');
        return false;
      }
    } else if (step === 2) {
      if (!address.trim()) {
        setErrorMsg('Please enter the street address or building.');
        return false;
      }
      if (!city.trim() || !pincode.trim()) {
        setErrorMsg('Please fill in the city and PIN code.');
        return false;
      }
    } else if (step === 3) {
      if (pricePerKwh <= 0) {
        setErrorMsg('Please specify a tariff in ₹ / kWh.');
        return false;
      }
    } else if (step === 4) {
      if (images.length === 0) {
        setErrorMsg('Please add at least one photo of your charging setup.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handleBack = () => {
    setErrorMsg(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4)) {
      return;
    }

    setIsSubmitting(true);

    const chargerData: Omit<HostCharger, 'id' | 'createdAt' | 'totalBookings' | 'totalEarnings' | 'rating' | 'reviewsCount'> = {
      name: name.trim(),
      category,
      connectorType,
      capacityKw: Number(capacityKw) || 22,
      description: description.trim(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      lat,
      lng,
      pricePerKwh: Number(pricePerKwh) || 18,
      minDurationMinutes: Number(minDurationMinutes) || 30,
      availableDays,
      openingTime: is24x7 ? '00:00' : openingTime,
      closingTime: is24x7 ? '23:59' : closingTime,
      is24x7,
      images,
      status: 'pending'
    };

    onSubmit(chargerData);
    setIsSuccess(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center p-0 sm:p-5 bg-[#123C3A]/65 dark:bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0D2422] rounded-t-3xl sm:rounded-card border-t sm:border border-[#D9DED5] dark:border-[#183E3A] shadow-2xl overflow-hidden flex flex-col max-h-[92dvh] sm:max-h-[90vh] pb-safe sm:pb-0 text-[#14201F] dark:text-[#E4EFEA]">
        
        {/* Mobile Swipe / Drag Handle Indicator */}
        <div className="sm:hidden w-full pt-2.5 pb-1 flex justify-center shrink-0">
          <div className="w-10 h-1 rounded-full bg-[#B8C2B3] dark:bg-[#183E3A]" />
        </div>

        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-[#E9EFE7] dark:bg-[#081B19] border-b border-[#D9DED5] dark:border-[#183E3A] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#19C7B1]/20 text-[#19C7B1] flex items-center justify-center border border-[#19C7B1]/40 shadow-glow-teal-sm shrink-0">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-[#123C3A] dark:text-[#E4EFEA] leading-tight">
                List Your Charger on Go Charge
              </h2>
              <p className="text-[11px] sm:text-xs text-[#5E716E] dark:text-[#8FAFA9]">
                Step {currentStep} of 5 · Guided Community Onboarding
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-[#5E716E] dark:text-[#8FAFA9] hover:text-[#123C3A] dark:hover:text-white hover:bg-white/80 dark:hover:bg-[#123431] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-Step Animated Progress Bar */}
        <div className="w-full bg-[#D9DED5] dark:bg-[#183E3A] h-1.5 shrink-0">
          <div
            className="bg-[#19C7B1] dark:bg-[#18C5B7] h-1.5 transition-all duration-300"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>

        {/* Step Indicator Tabs */}
        <div className="px-5 sm:px-6 py-2.5 bg-white dark:bg-[#081B19] border-b border-[#D9DED5] dark:border-[#183E3A] hidden sm:flex items-center justify-between text-xs font-bold text-[#5E716E] dark:text-[#8FAFA9] shrink-0">
          {[
            { num: 1, label: 'Charger Info' },
            { num: 2, label: 'Location & Map' },
            { num: 3, label: 'Pricing & Hours' },
            { num: 4, label: 'Photos' },
            { num: 5, label: 'Review' }
          ].map((s) => (
            <button
              key={s.num}
              type="button"
              onClick={() => s.num < currentStep && setCurrentStep(s.num)}
              disabled={s.num > currentStep}
              className={`flex items-center gap-1.5 transition-colors ${
                currentStep === s.num
                  ? 'text-[#123C3A] dark:text-[#18C5B7] font-extrabold'
                  : s.num < currentStep
                  ? 'text-[#19C7B1] dark:text-[#18C5B7] cursor-pointer'
                  : 'text-[#B8C2B3] dark:text-[#5E716E] cursor-not-allowed'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                currentStep === s.num
                  ? 'bg-[#19C7B1] dark:bg-[#18C5B7] text-white dark:text-[#071715] shadow-glow-teal-sm'
                  : s.num < currentStep
                  ? 'bg-[#19C7B1]/20 text-[#19C7B1] dark:text-[#18C5B7]'
                  : 'bg-[#E9EFE7] dark:bg-[#14322F] text-[#7A8C89] dark:text-[#A3B8B5]'
              }`}>
                {s.num < currentStep ? '✓' : s.num}
              </span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Form Body */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-4 sm:space-y-5">
          
          {/* Error Alert Pill */}
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Celebration Overlay */}
          {isSuccess ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#22C55E]/15 text-[#22C55E] flex items-center justify-center border border-[#22C55E]/30 animate-bounce">
                <CheckCircle2 className="w-10 h-10 fill-current text-white" />
              </div>
              <h3 className="text-xl font-extrabold text-[#123C3A] dark:text-[#E4EFEA]">
                Listing Submitted for Verification!
              </h3>
              <p className="text-sm text-[#5E716E] dark:text-[#8FAFA9] max-w-md">
                Your charger <strong>"{name}"</strong> has been saved to your Host Dashboard under <em>Pending Approval</em>. You can now manage bookings, pricing, and availability.
              </p>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E9EFE7] dark:bg-[#081B19] border border-transparent dark:border-[#183E3A] text-xs font-bold text-[#123C3A] dark:text-[#18C5B7]">
                <ShieldCheck className="w-4 h-4 text-[#19C7B1]" />
                <span>Go Charge Host Verification in Progress</span>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: Charger Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#123C3A] dark:text-[#CBDCD6] mb-1.5">
                      Charger Title / Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. GreenDrive Residential Fast Hub or Cyber Park DC Bay"
                      className="w-full px-3.5 py-2.5 rounded-btn bg-[#F4F1E8] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#183E3A] focus:border-[#19C7B1] dark:focus:border-[#18C5B7] focus:bg-white dark:focus:bg-[#0D2422] text-[#123C3A] dark:text-[#E4EFEA] placeholder-gray-400 dark:placeholder-gray-500 text-xs sm:text-sm outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Category Selection */}
                    <div>
                      <label className="block text-xs font-bold text-[#123C3A] dark:text-[#CBDCD6] mb-1.5">
                        Charger Category *
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                        {[
                          { cat: 'Home' as ChargerCategory, label: 'Home' },
                          { cat: 'Private Parking' as ChargerCategory, label: 'Parking' },
                          { cat: 'Office' as ChargerCategory, label: 'Office' },
                          { cat: 'Commercial' as ChargerCategory, label: 'Commercial' },
                          { cat: 'Society' as ChargerCategory, label: 'Society' },
                          { cat: 'Dedicated Plaza' as ChargerCategory, label: 'EV Plaza' }
                        ].map((item) => (
                          <button
                            key={item.cat}
                            type="button"
                            onClick={() => setCategory(item.cat)}
                            className={`py-1.5 px-2 text-center rounded-lg border text-[11px] font-bold transition-all cursor-pointer ${
                              category === item.cat
                                ? 'bg-[#123C3A] dark:bg-[#18C5B7] text-white dark:text-[#071715] border-[#123C3A] dark:border-[#18C5B7] shadow-sm'
                                : 'bg-[#F4F1E8] dark:bg-[#081B19] text-[#5E716E] dark:text-[#8FAFA9] border-[#D9DED5] dark:border-[#183E3A] hover:bg-white dark:hover:bg-[#123431]'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Capacity (kW) */}
                    <div>
                      <label className="block text-xs font-bold text-[#123C3A] dark:text-[#CBDCD6] mb-1.5">
                        Charging Capacity (kW) *
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="3"
                          max="350"
                          value={capacityKw}
                          onChange={(e) => setCapacityKw(Number(e.target.value))}
                          className="w-full px-3.5 py-2 rounded-btn bg-[#F4F1E8] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#183E3A] focus:border-[#19C7B1] dark:focus:border-[#18C5B7] focus:bg-white dark:focus:bg-[#0D2422] text-[#123C3A] dark:text-[#E4EFEA] text-xs sm:text-sm outline-none font-bold tabular-nums"
                        />
                        <span className="absolute right-3.5 top-2.5 text-xs text-[#5E716E] dark:text-[#7A9E99] font-bold">
                          {capacityKw >= 50 ? 'DC Fast' : 'AC Fast'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Connector Type */}
                  <div>
                    <label className="block text-xs font-bold text-[#123C3A] dark:text-[#CBDCD6] mb-1.5">
                      Connector Type *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { type: 'CCS2' as HostConnectorType, label: 'CCS2 (4W DC Fast)' },
                        { type: 'Type-2' as HostConnectorType, label: 'Type 2 AC (Universal)' },
                        { type: 'LECCS' as HostConnectorType, label: 'LECCS (Ather/Vida 2W)' },
                        { type: 'Bharat AC-001' as HostConnectorType, label: 'Bharat AC-001 (3-Pin)' },
                        { type: 'Bharat DC-001' as HostConnectorType, label: 'Bharat DC-001 (15kW)' },
                        { type: '16A 3-Pin' as HostConnectorType, label: '16A 3-Pin Heavy Socket' },
                        { type: 'GB/T' as HostConnectorType, label: 'GB/T Fast DC' },
                        { type: 'Other' as HostConnectorType, label: 'Other Verified Gun' },
                      ].map((item) => (
                        <button
                          key={item.type}
                          type="button"
                          onClick={() => setConnectorType(item.type)}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                            connectorType === item.type
                              ? 'bg-[#19C7B1] dark:bg-[#18C5B7] text-white dark:text-[#071715] border-[#19C7B1] dark:border-[#18C5B7] shadow-glow-teal-sm'
                              : 'bg-[#F4F1E8] dark:bg-[#081B19] text-[#123C3A] dark:text-[#E4EFEA] border-[#D9DED5] dark:border-[#183E3A] hover:bg-white dark:hover:bg-[#123431]'
                          }`}
                        >
                          <p className="font-extrabold text-xs">{item.type}</p>
                          <p className="text-[10px] opacity-80 mt-0.5 truncate">
                            {item.label}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-bold text-[#123C3A] dark:text-[#CBDCD6] mb-1.5">
                      Charger Description & Access Instructions *
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Explain parking location (e.g. basement P2, driveway), amenities nearby (cafés, restrooms), security gate instructions, or RFID requirements."
                      className="w-full p-3 rounded-btn bg-[#F4F1E8] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#183E3A] focus:border-[#19C7B1] dark:focus:border-[#18C5B7] focus:bg-white dark:focus:bg-[#0D2422] text-[#123C3A] dark:text-[#E4EFEA] placeholder-gray-400 dark:placeholder-gray-500 text-xs outline-none transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: Location & Interactive Map Pin Picker */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#123C3A] dark:text-[#CBDCD6] mb-1.5">
                      Street Address & Building / Landmark *
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House/Plot No., Street, Landmark, Area"
                      className="w-full px-3.5 py-2.5 rounded-btn bg-[#F4F1E8] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#183E3A] focus:border-[#19C7B1] dark:focus:border-[#18C5B7] focus:bg-white dark:focus:bg-[#0D2422] text-[#123C3A] dark:text-[#E4EFEA] placeholder-gray-400 dark:placeholder-gray-500 text-xs sm:text-sm outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#123C3A] dark:text-[#CBDCD6] mb-1.5">
                        City *
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. New Delhi"
                        className="w-full px-3 py-2 rounded-btn bg-[#F4F1E8] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#183E3A] focus:border-[#19C7B1] dark:focus:border-[#18C5B7] focus:bg-white dark:focus:bg-[#0D2422] text-[#123C3A] dark:text-[#E4EFEA] text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#123C3A] dark:text-[#CBDCD6] mb-1.5">
                        State *
                      </label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="e.g. Delhi"
                        className="w-full px-3 py-2 rounded-btn bg-[#F4F1E8] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#183E3A] focus:border-[#19C7B1] dark:focus:border-[#18C5B7] focus:bg-white dark:focus:bg-[#0D2422] text-[#123C3A] dark:text-[#E4EFEA] text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#123C3A] dark:text-[#CBDCD6] mb-1.5">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="e.g. 110001"
                        className="w-full px-3 py-2 rounded-btn bg-[#F4F1E8] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#183E3A] focus:border-[#19C7B1] dark:focus:border-[#18C5B7] focus:bg-white dark:focus:bg-[#0D2422] text-[#123C3A] dark:text-[#E4EFEA] text-xs outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* Interactive OpenFreeMap Pin Picker */}
                  <LocationPinPicker
                    lat={lat}
                    lng={lng}
                    city={city}
                    onChange={(newLat, newLng) => {
                      setLat(newLat);
                      setLng(newLng);
                    }}
                  />
                </div>
              )}

              {/* STEP 3: Pricing & Timing */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Price per kWh */}
                    <div>
                      <label className="block text-xs font-bold text-[#123C3A] dark:text-[#CBDCD6] mb-1.5">
                        Price per kWh (₹) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-2.5 text-[#5E716E] dark:text-[#7A9E99] font-bold text-xs">₹</span>
                        <input
                          type="number"
                          min="8"
                          max="50"
                          value={pricePerKwh}
                          onChange={(e) => setPricePerKwh(Number(e.target.value))}
                          className="w-full pl-8 pr-3.5 py-2 rounded-btn bg-[#F4F1E8] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#183E3A] focus:border-[#19C7B1] dark:focus:border-[#18C5B7] focus:bg-white dark:focus:bg-[#0D2422] text-[#123C3A] dark:text-[#E4EFEA] text-xs sm:text-sm font-bold tabular-nums outline-none"
                        />
                      </div>
                      <p className="text-[11px] text-[#5E716E] dark:text-[#8FAFA9] mt-1">
                        Est. revenue for full 40kWh charge: ~₹{pricePerKwh * 40}
                      </p>
                    </div>

                    {/* Minimum Duration */}
                    <div>
                      <label className="block text-xs font-bold text-[#123C3A] dark:text-[#CBDCD6] mb-1.5">
                        Minimum Booking Duration *
                      </label>
                      <select
                        value={minDurationMinutes}
                        onChange={(e) => setMinDurationMinutes(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-btn bg-[#F4F1E8] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#183E3A] focus:border-[#19C7B1] dark:focus:border-[#18C5B7] text-[#123C3A] dark:text-[#E4EFEA] text-xs font-bold outline-none cursor-pointer"
                      >
                        <option value={15} className="dark:bg-[#0D2422]">15 Minutes (Quick Top-up)</option>
                        <option value={30} className="dark:bg-[#0D2422]">30 Minutes (Recommended)</option>
                        <option value={45} className="dark:bg-[#0D2422]">45 Minutes</option>
                        <option value={60} className="dark:bg-[#0D2422]">1 Hour Minimum</option>
                      </select>
                    </div>
                  </div>

                  {/* 24/7 Availability Toggle */}
                  <div className="p-3.5 rounded-xl bg-[#E9EFE7] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#183E3A] flex items-center justify-between">
                    <div>
                      <p className="text-xs font-extrabold text-[#123C3A] dark:text-[#E4EFEA]">24/7 Non-stop Availability</p>
                      <p className="text-[11px] text-[#5E716E] dark:text-[#8FAFA9]">Allow drivers to book anytime of the day or night</p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={is24x7}
                      onClick={() => setIs24x7(!is24x7)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        is24x7 ? 'bg-[#19C7B1] dark:bg-[#18C5B7]' : 'bg-[#B8C2B3] dark:bg-[#183E3A]'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                          is24x7 ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Operating Hours (if not 24x7) */}
                  {!is24x7 && (
                    <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-white dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#183E3A]">
                      <div>
                        <label className="block text-[11px] font-bold text-[#5E716E] dark:text-[#7A9E99] mb-1">Opens at</label>
                        <input
                          type="time"
                          value={openingTime}
                          onChange={(e) => setOpeningTime(e.target.value)}
                          className="w-full px-3 py-1.5 rounded bg-[#F4F1E8] dark:bg-[#0D2422] border border-[#D9DED5] dark:border-[#183E3A] text-xs font-bold text-[#123C3A] dark:text-[#E4EFEA] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#5E716E] dark:text-[#7A9E99] mb-1">Closes at</label>
                        <input
                          type="time"
                          value={closingTime}
                          onChange={(e) => setClosingTime(e.target.value)}
                          className="w-full px-3 py-1.5 rounded bg-[#F4F1E8] dark:bg-[#0D2422] border border-[#D9DED5] dark:border-[#183E3A] text-xs font-bold text-[#123C3A] dark:text-[#E4EFEA] outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Available Days */}
                  <div>
                    <label className="block text-xs font-bold text-[#123C3A] dark:text-[#CBDCD6] mb-1.5">
                      Available Days of the Week
                    </label>
                    <div className="grid grid-cols-7 gap-1 sm:gap-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                        const isSelected = availableDays.includes(day);
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => toggleDay(day)}
                            className={`py-2 text-center rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#123C3A] dark:bg-[#18C5B7] text-white dark:text-[#071715] border-[#123C3A] dark:border-[#183E3A] shadow-sm'
                                : 'bg-[#F4F1E8] dark:bg-[#081B19] text-[#5E716E] dark:text-[#7A9E99] border-[#D9DED5] dark:border-[#183E3A] hover:bg-white dark:hover:bg-[#123431]'
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Charger Photos */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  {/* Image Upload Drop Area */}
                  <label className="relative border-2 border-dashed border-[#19C7B1]/60 hover:border-[#19C7B1] bg-[#E9EFE7]/50 dark:bg-[#081B19]/50 hover:bg-[#E9EFE7] dark:hover:bg-[#081B19] rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageFiles}
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-full bg-white dark:bg-[#0D2422] text-[#19C7B1] dark:text-[#18C5B7] flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-[#123C3A] dark:text-[#E4EFEA]">
                      {isUploading ? 'Processing images...' : 'Click or drag & drop to upload photos'}
                    </p>
                    <p className="text-[11px] text-[#5E716E] dark:text-[#8FAFA9] mt-0.5">
                      Upload photos showing the charger unit, socket, parking bay, and driveway access
                    </p>
                  </label>

                  {/* Uploaded Images Preview Grid */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-[#123C3A] dark:text-[#E4EFEA] mb-2">
                      <span>Selected Photos ({images.length})</span>
                      <span className="text-[11px] text-[#5E716E] dark:text-[#8FAFA9]">First photo is the cover photo</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {images.map((imgUrl, idx) => (
                        <div key={idx} className="relative group rounded-xl overflow-hidden border border-[#D9DED5] dark:border-[#183E3A] aspect-video bg-[#E9EFE7] dark:bg-[#081B19]">
                          <img
                            src={imgUrl}
                            alt={`Charger preview ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {idx === 0 && (
                            <span className="absolute top-1.5 left-1.5 bg-[#123C3A] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                              Cover
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-white/90 dark:bg-[#0D2422]/90 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center shadow-md opacity-90 group-hover:opacity-100 transition-all cursor-pointer"
                            title="Remove Photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 1-Click Sample Preset Photos */}
                  <div className="p-3 rounded-xl bg-[#F4F1E8] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#183E3A]">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#123C3A] dark:text-[#E4EFEA] mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#19C7B1] dark:text-[#18C5B7]" />
                      <span>Or Choose from Professional EV Charger Presets:</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {SAMPLE_CHARGER_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => addPresetImage(preset.url)}
                          className="relative rounded-lg overflow-hidden border border-[#D9DED5] dark:border-[#183E3A] text-left hover:border-[#19C7B1] dark:hover:border-[#18C5B7] transition-all group aspect-video cursor-pointer"
                        >
                          <img
                            src={preset.url}
                            alt={preset.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-1.5 flex flex-col justify-end">
                            <span className="text-[10px] font-bold text-white leading-tight truncate">
                              + {preset.tag}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Review & Final Submission */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#E9EFE7] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#183E3A] flex items-center gap-3">
                    <img
                      src={images[0] || SAMPLE_CHARGER_PRESETS[0].url}
                      alt="Cover Preview"
                      className="w-16 h-16 rounded-lg object-cover border border-[#D9DED5] dark:border-[#183E3A] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-[#19C7B1] text-white text-[10px] font-bold uppercase">
                          {category}
                        </span>
                        <span className="text-xs text-[#5E716E] dark:text-[#8FAFA9] font-bold">
                          {capacityKw} kW · {connectorType}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-sm text-[#123C3A] dark:text-[#E4EFEA] truncate mt-0.5">{name}</h4>
                      <p className="text-xs text-[#5E716E] dark:text-[#8FAFA9] truncate">{address}, {city}, {state} {pincode}</p>
                    </div>
                  </div>

                  {/* Structured Summary Cards with Jump-to-Edit */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    
                    {/* Box 1: Hardware Specs */}
                    <div className="p-3 rounded-xl border border-[#D9DED5] dark:border-[#183E3A] bg-white dark:bg-[#081B19] space-y-1">
                      <div className="flex items-center justify-between pb-1 border-b border-[#D9DED5] dark:border-[#183E3A]">
                        <span className="font-bold text-[#123C3A] dark:text-[#E4EFEA]">Hardware Specs</span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className="text-[11px] font-bold text-[#19C7B1] dark:text-[#18C5B7] hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                      <p className="text-[#5E716E] dark:text-[#8FAFA9]">Category: <strong className="text-[#123C3A] dark:text-[#E4EFEA]">{category}</strong></p>
                      <p className="text-[#5E716E] dark:text-[#8FAFA9]">Plug Standard: <strong className="text-[#123C3A] dark:text-[#E4EFEA]">{connectorType}</strong></p>
                      <p className="text-[#5E716E] dark:text-[#8FAFA9]">Max Power: <strong className="text-[#123C3A] dark:text-[#E4EFEA]">{capacityKw} kW ({capacityKw >= 50 ? 'DC Fast' : 'AC Fast'})</strong></p>
                    </div>

                    {/* Box 2: Location Details */}
                    <div className="p-3 rounded-xl border border-[#D9DED5] dark:border-[#183E3A] bg-white dark:bg-[#081B19] space-y-1">
                      <div className="flex items-center justify-between pb-1 border-b border-[#D9DED5] dark:border-[#183E3A]">
                        <span className="font-bold text-[#123C3A] dark:text-[#E4EFEA]">Location Details</span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(2)}
                          className="text-[11px] font-bold text-[#19C7B1] dark:text-[#18C5B7] hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                      <p className="text-[#5E716E] dark:text-[#8FAFA9]">City / State: <strong className="text-[#123C3A] dark:text-[#E4EFEA]">{city}, {state}</strong></p>
                      <p className="text-[#5E716E] dark:text-[#8FAFA9]">Coordinates: <strong className="text-[#123C3A] dark:text-[#E4EFEA] font-mono">{lat.toFixed(4)}, {lng.toFixed(4)}</strong></p>
                      <p className="text-[#5E716E] dark:text-[#8FAFA9]">PIN Code: <strong className="text-[#123C3A] dark:text-[#E4EFEA]">{pincode}</strong></p>
                    </div>

                    {/* Box 3: Pricing & Timing */}
                    <div className="p-3 rounded-xl border border-[#D9DED5] dark:border-[#183E3A] bg-white dark:bg-[#081B19] space-y-1">
                      <div className="flex items-center justify-between pb-1 border-b border-[#D9DED5] dark:border-[#183E3A]">
                        <span className="font-bold text-[#123C3A] dark:text-[#E4EFEA]">Tariff & Availability</span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(3)}
                          className="text-[11px] font-bold text-[#19C7B1] dark:text-[#18C5B7] hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                      <p className="text-[#5E716E] dark:text-[#8FAFA9]">Tariff: <strong className="text-[#123C3A] dark:text-[#E4EFEA]">₹{pricePerKwh} / kWh</strong></p>
                      <p className="text-[#5E716E] dark:text-[#8FAFA9]">Operating: <strong className="text-[#123C3A] dark:text-[#E4EFEA]">{is24x7 ? '24/7 All Hours' : `${openingTime} – ${closingTime}`}</strong></p>
                      <p className="text-[#5E716E] dark:text-[#8FAFA9]">Active Days: <strong className="text-[#123C3A] dark:text-[#E4EFEA]">{availableDays.join(', ')}</strong></p>
                    </div>

                    {/* Box 4: Photos */}
                    <div className="p-3 rounded-xl border border-[#D9DED5] dark:border-[#183E3A] bg-white dark:bg-[#081B19] space-y-1">
                      <div className="flex items-center justify-between pb-1 border-b border-[#D9DED5] dark:border-[#183E3A]">
                        <span className="font-bold text-[#123C3A] dark:text-[#E4EFEA]">Uploaded Photos ({images.length})</span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(4)}
                          className="text-[11px] font-bold text-[#19C7B1] dark:text-[#18C5B7] hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="flex gap-1.5 pt-1 overflow-x-auto">
                        {images.slice(0, 4).map((img, i) => (
                          <img key={i} src={img} alt="Thumbnail" className="w-10 h-10 rounded object-cover border border-[#D9DED5] dark:border-[#183E3A]" />
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Verification Note */}
                  <div className="p-3.5 rounded-xl bg-[#F4F1E8] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#183E3A] text-xs text-[#5E716E] dark:text-[#8FAFA9] space-y-1">
                    <p className="font-bold text-[#123C3A] dark:text-[#E4EFEA] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#19C7B1] dark:text-[#18C5B7]" />
                      <span>Host Verification Guarantee</span>
                    </p>
                    <p className="text-[11px]">
                      By listing your charger on Go Charge, you agree to maintain hardware safety standards and allow booked drivers safe driveway/parking access during your designated hours.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* Modal Footer Controls */}
        {!isSuccess && (
          <div className="px-5 sm:px-6 py-3.5 bg-[#E9EFE7] dark:bg-[#081B19] border-t border-[#D9DED5] dark:border-[#183E3A] flex items-center justify-between gap-3">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="min-h-[44px] px-4 py-2 rounded-btn bg-white dark:bg-[#0D2422] hover:bg-[#D9DED5] dark:hover:bg-[#163834] border border-[#D9DED5] dark:border-[#183E3A] text-xs font-bold text-[#123C3A] dark:text-[#E4EFEA] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] px-4 py-2 rounded-btn bg-white dark:bg-[#0D2422] hover:bg-[#D9DED5] dark:hover:bg-[#163834] border border-[#D9DED5] dark:border-[#183E3A] text-xs font-bold text-[#5E716E] dark:text-[#8FAFA9] transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="min-h-[44px] px-5 py-2 rounded-btn bg-[#19C7B1] hover:bg-[#123C3A] dark:bg-[#18C5B7] dark:hover:bg-[#2FE0D2] text-white dark:text-[#071715] text-xs font-bold flex items-center gap-1.5 transition-all shadow-glow-teal-sm cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="min-h-[44px] px-6 py-2 rounded-btn bg-[#19C7B1] hover:bg-[#123C3A] dark:bg-[#18C5B7] dark:hover:bg-[#2FE0D2] text-white dark:text-[#071715] text-xs font-extrabold flex items-center gap-2 transition-all shadow-glow-teal-sm disabled:opacity-60 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>{isSubmitting ? 'Submitting Charger...' : 'Submit Charger for Verification'}</span>
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
