import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Station, Connector } from '../../types';
import { 
  ArrowLeft, MapPin, Star, Zap, IndianRupee, Clock, 
  ExternalLink, Navigation, Share2, Heart, CheckCircle2, 
  Shield, Check, Phone, MessageSquare, Building2, User, ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { AvailabilityChart } from './AvailabilityChart';
import { CompatibleVehicles } from './CompatibleVehicles';
import { ReviewsSection } from './ReviewsSection';
import { ContactHostModal } from '../Modals/ContactHostModal';
import { BookStationModal } from '../Modals/BookStationModal';
import { VehicleModel, isStationCompatibleWithVehicle } from '../../data/vehicles';

interface StationDetailPageProps {
  station: Station;
  onBack: () => void;
  onGetDirections: (station: Station) => void;
  onStartCharging: (station: Station, connector: Connector) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (station: Station) => void;
  selectedVehicle?: VehicleModel | null;
  onOpenVehicleModal?: () => void;
}

export const StationDetailPage: React.FC<StationDetailPageProps> = ({
  station,
  onBack,
  onGetDirections,
  onStartCharging,
  isFavorite: externalIsFavorite,
  onToggleFavorite: externalOnToggleFavorite,
  selectedVehicle,
  onOpenVehicleModal,
}) => {
  const [internalBookmarked, setInternalBookmarked] = useState(false);
  const [isContactHostOpen, setIsContactHostOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const isBookmarked = externalIsFavorite !== undefined ? externalIsFavorite : internalBookmarked;

  const handleToggleBookmark = () => {
    if (externalOnToggleFavorite) {
      externalOnToggleFavorite(station);
    } else {
      setInternalBookmarked(!internalBookmarked);
    }
  };

  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const getStatusPill = () => {
    if (station.status === 'available') {
      return (
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-pill bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] font-bold text-xs sm:text-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] shadow-glow-green-sm animate-pulse-subtle" />
          <span>{station.availablePorts} of {station.totalPorts} ports available</span>
        </div>
      );
    } else if (station.status === 'busy') {
      return (
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-pill bg-[#7A8C89]/15 border border-[#D9DED5] dark:border-[#183E3A] text-[#5E716E] dark:text-[#8FAFA9] font-bold text-xs sm:text-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-[#7A8C89]" />
          <span>All {station.totalPorts} ports in use</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-pill bg-[#F59E0B]/15 border border-[#F59E0B]/30 text-[#D97706] font-bold text-xs sm:text-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
          <span>{station.availablePorts} of {station.totalPorts} ports available</span>
        </div>
      );
    }
  };

  const firstAvailableConnector = station.connectors.find(c => c.status === 'free') || station.connectors[0];

  const host = station.hostInfo || {
    name: station.operator || 'Go Charge Host',
    type: (station.chargerCategory === 'Home' ? 'Verified Private Host' : 'Commercial Operator') as any,
    phone: '+91 98101 23456',
    rating: station.rating,
    memberSince: '2023',
    responseRate: '98%',
    verifiedElectrical: true
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.04,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="relative min-h-screen bg-[#F4F1E8] dark:bg-[#071715] pb-28 text-[#14201F] dark:text-[#E4EFEA] transition-colors">
      
      {/* Top Sticky Navigation Bar */}
      <div className="sticky top-0 z-30 pt-safe px-4 sm:px-8 py-3.5 bg-[#F4F1E8]/95 dark:bg-[#071715]/95 backdrop-blur-md border-b border-[#D9DED5] dark:border-[#183E3A] flex items-center justify-between">
        <button
          onClick={onBack}
          className="min-h-[44px] flex items-center gap-2 px-3.5 py-2 rounded-pill bg-[#E9EFE7] dark:bg-[#0D2422] hover:bg-white dark:hover:bg-[#123431] border border-[#D9DED5] dark:border-[#183E3A] text-xs sm:text-sm font-semibold text-[#123C3A] dark:text-[#E4EFEA] transition-colors group shadow-card-subtle cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#19C7B1] group-hover:-translate-x-1 transition-transform" />
          <span>Back to Stations</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsContactHostOpen(true)}
            className="hidden sm:flex min-h-[44px] items-center gap-1.5 px-3 py-2 rounded-btn bg-[#E9EFE7] dark:bg-[#0D2422] hover:bg-white dark:hover:bg-[#123431] border border-[#D9DED5] dark:border-[#183E3A] text-xs font-bold text-[#123C3A] dark:text-white transition-colors cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-[#19C7B1]" />
            <span>Contact Host</span>
          </button>

          <button
            onClick={handleToggleBookmark}
            title={isBookmarked ? "Remove Bookmark" : "Bookmark Station"}
            aria-label={isBookmarked ? "Remove Bookmark" : "Bookmark Station"}
            className="min-w-[44px] min-h-[44px] p-2.5 rounded-btn bg-[#E9EFE7] dark:bg-[#0D2422] hover:bg-white dark:hover:bg-[#123431] border border-[#D9DED5] dark:border-[#183E3A] text-[#123C3A] dark:text-[#E4EFEA] transition-colors shadow-sm flex items-center justify-center cursor-pointer"
          >
            <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-[#19C7B1] text-[#19C7B1]' : 'text-[#5E716E] dark:text-[#7A9E99]'}`} />
          </button>

          <button
            onClick={handleShare}
            title="Share Station"
            aria-label="Share Station Link"
            className="min-w-[44px] min-h-[44px] p-2.5 rounded-btn bg-[#E9EFE7] dark:bg-[#0D2422] hover:bg-white dark:hover:bg-[#123431] border border-[#D9DED5] dark:border-[#183E3A] text-[#123C3A] dark:text-[#E4EFEA] transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            {copiedLink ? <Check className="w-4 h-4 text-[#19C7B1]" /> : <Share2 className="w-4 h-4 text-[#5E716E] dark:text-[#7A9E99]" />}
            {copiedLink && <span className="text-xs text-[#19C7B1] hidden sm:inline font-semibold">Copied!</span>}
          </button>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-6"
      >
        
        {/* HERO SECTION */}
        <motion.div variants={itemVariants} className="p-6 rounded-card bg-[#E9EFE7] dark:bg-[#0D2422] border border-[#D9DED5] dark:border-[#183E3A] shadow-card-subtle relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#19C7B1]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#5E716E] dark:text-[#8FAFA9] mb-1.5">
                <span className="text-[#123C3A] dark:text-[#18C5B7]">{station.operator}</span>
                <span>•</span>
                {station.chargerCategory && (
                  <span className="px-2 py-0.5 rounded-full bg-white dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#183E3A] font-bold text-[#123C3A] dark:text-[#19C7B1]">
                    {station.chargerCategory}
                  </span>
                )}
                <span>•</span>
                <span>ID: {station.id}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#123C3A] dark:text-[#E4EFEA]">
                {station.name}
              </h1>
            </div>

            <div className="shrink-0">
              {getStatusPill()}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-[#5E716E] dark:text-[#8FAFA9] mb-4">
            <div className="flex items-center gap-1.5 text-[#123C3A] dark:text-[#E4EFEA] font-medium">
              <MapPin className="w-4 h-4 text-[#19C7B1] shrink-0" />
              <span>{station.area}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1 text-[#123C3A] dark:text-[#E4EFEA] font-bold">
              <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
              <span>{station.rating}</span>
              <span className="text-[#5E716E] dark:text-[#8FAFA9] font-normal">({station.reviewsCount} reviews)</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1 text-[#123C3A] dark:text-[#18C5B7]">
              <Shield className="w-3.5 h-3.5 text-[#19C7B1]" />
              <span>Verified Hardware</span>
            </div>
          </div>

          {/* Amenities Pills */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-[#D9DED5] dark:border-[#183E3A]">
            {station.amenities.map((item) => (
              <span
                key={item}
                className="px-2.5 py-1 rounded-pill bg-white dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#183E3A] text-[11px] font-semibold text-[#123C3A] dark:text-[#E4EFEA] flex items-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-3 h-3 text-[#19C7B1]" />
                {item}
              </span>
            ))}
          </div>
        </motion.div>

        {/* VEHICLE COMPATIBILITY ALERT */}
        {selectedVehicle && (
          (() => {
            const isComp = isStationCompatibleWithVehicle(station.primaryConnectors, selectedVehicle);
            return (
              <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
                isComp
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isComp ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                  }`}>
                    {isComp ? <ShieldCheck className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold flex items-center gap-2">
                      <span>{selectedVehicle.brand} {selectedVehicle.model}</span>
                      <span className="text-xs font-normal opacity-80">({selectedVehicle.subType})</span>
                    </h4>
                    <p className="text-xs opacity-90">
                      {isComp 
                        ? `100% Compatible with this station. Your vehicle uses ${selectedVehicle.connectors.join(', ')}.`
                        : `May not be compatible. Your vehicle uses ${selectedVehicle.connectors.join(', ')}, but this station provides ${station.primaryConnectors.join(', ')}.`
                      }
                    </p>
                  </div>
                </div>

                {onOpenVehicleModal && (
                  <button
                    type="button"
                    onClick={onOpenVehicleModal}
                    className="shrink-0 text-xs font-bold underline hover:opacity-80 cursor-pointer"
                  >
                    Change Vehicle
                  </button>
                )}
              </div>
            );
          })()
        )}

        {/* HOST PROFILE & COMMUNITY TRUST SECTION */}
        <div className="p-5 rounded-card bg-[#E9EFE7] dark:bg-[#0D2422] border border-[#D9DED5] dark:border-[#183E3A] shadow-card-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#19C7B1]/15 text-[#19C7B1] flex items-center justify-center font-black text-lg border border-[#19C7B1]/30">
              {host.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-[#123C3A] dark:text-white">{host.name}</h4>
                <span className="text-[10px] font-bold text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> CEA Certified
                </span>
              </div>
              <p className="text-xs text-[#5E716E] dark:text-[#8FAFA9] mt-0.5">
                {host.type} · Host Rating {host.rating} ★ · {host.responseRate} response rate
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsContactHostOpen(true)}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-white dark:bg-[#081B19] hover:bg-[#E9EFE7] dark:hover:bg-[#123633] border border-[#D9DED5] dark:border-[#183E3A] text-xs font-bold text-[#123C3A] dark:text-white flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-[#19C7B1]" />
              <span>Contact Host</span>
            </button>

            <button
              type="button"
              onClick={() => setIsBookModalOpen(true)}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#19C7B1] hover:bg-[#15A896] text-white text-xs font-bold shadow-glow-teal-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Book Bay (Demo)</span>
            </button>
          </div>
        </div>

        {/* INFO CARDS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="p-4 rounded-card bg-[#E9EFE7] dark:bg-[#0D2422] border border-[#D9DED5] dark:border-[#183E3A] shadow-card-subtle flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-[#5E716E] dark:text-[#8FAFA9] mb-3">
              <span className="font-bold uppercase tracking-wider text-[11px] text-[#123C3A] dark:text-[#E4EFEA]">⚡ Speed</span>
              <span className="w-7 h-7 rounded-lg bg-white dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#183E3A] text-[#19C7B1] flex items-center justify-center shadow-sm">
                <Zap className="w-4 h-4 fill-current" />
              </span>
            </div>
            <div>
              <p className="text-lg font-extrabold text-[#123C3A] dark:text-[#E4EFEA] leading-tight">
                {station.powerSpeed}
              </p>
              <p className="text-xs text-[#5E716E] dark:text-[#8FAFA9] mt-1 font-medium">
                ~0-80% in 45 min
              </p>
            </div>
          </div>

          <div className="p-4 rounded-card bg-[#E9EFE7] dark:bg-[#0D2422] border border-[#D9DED5] dark:border-[#183E3A] shadow-card-subtle flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-[#5E716E] dark:text-[#8FAFA9] mb-3">
              <span className="font-bold uppercase tracking-wider text-[11px] text-[#123C3A] dark:text-[#E4EFEA]">💰 Price</span>
              <span className="w-7 h-7 rounded-lg bg-white dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#183E3A] text-[#19C7B1] flex items-center justify-center shadow-sm">
                <IndianRupee className="w-4 h-4" />
              </span>
            </div>
            <div>
              <p className="text-lg font-extrabold text-[#123C3A] dark:text-[#18C5B7] leading-tight">
                ₹{station.pricePerKwh} per kWh
              </p>
              <p className="text-xs text-[#5E716E] dark:text-[#8FAFA9] mt-1 font-medium">
                Min ₹{station.minSessionFee} session fee
              </p>
            </div>
          </div>

          <div className="p-4 rounded-card bg-[#E9EFE7] dark:bg-[#0D2422] border border-[#D9DED5] dark:border-[#183E3A] shadow-card-subtle flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-[#5E716E] dark:text-[#8FAFA9] mb-3">
              <span className="font-bold uppercase tracking-wider text-[11px] text-[#123C3A] dark:text-[#E4EFEA]">⏰ Hours</span>
              <span className="w-7 h-7 rounded-lg bg-white dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#183E3A] text-[#19C7B1] flex items-center justify-center shadow-sm">
                <Clock className="w-4 h-4" />
              </span>
            </div>
            <div>
              <p className="text-lg font-extrabold text-[#123C3A] dark:text-[#E4EFEA] leading-tight">
                {station.hours}
              </p>
              <p className="text-xs text-[#5E716E] dark:text-[#8FAFA9] mt-1 font-medium">
                Open to all verified EV users
              </p>
            </div>
          </div>
        </div>

        {/* CONNECTORS SECTION */}
        <div className="p-5 rounded-card bg-[#E9EFE7] dark:bg-[#0D2422] border border-[#D9DED5] dark:border-[#183E3A] shadow-card-subtle">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#123C3A] dark:text-[#E4EFEA]">
                Available Connectors
              </h3>
              <p className="text-xs text-[#5E716E] dark:text-[#8FAFA9]">
                Select an open plug bay to initiate fast charging
              </p>
            </div>
            <span className="text-xs font-bold text-[#22C55E]">
              {station.availablePorts} of {station.connectors.length} Free
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {station.connectors.map((connector) => {
              const isFree = connector.status === 'free';
              return (
                <div
                  key={connector.id}
                  className={`p-4 rounded-card border transition-all duration-300 flex flex-col justify-between ${
                    isFree
                      ? 'bg-white dark:bg-[#081B19] border-[#19C7B1] shadow-card-hover'
                      : 'bg-[#F4F1E8] dark:bg-[#0A1F1D] border-[#D9DED5] dark:border-[#183E3A] opacity-85'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    {isFree ? (
                      <span className="px-2.5 py-1 rounded-pill bg-[#22C55E]/15 text-[#22C55E] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse-subtle" />
                        FREE (Bay #{connector.portNumber})
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-pill bg-[#7A8C89]/15 text-[#5E716E] dark:text-[#8FAFA9] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#7A8C89]" />
                        IN USE (Bay #{connector.portNumber})
                      </span>
                    )}

                    <span className="text-xs font-medium text-[#5E716E] dark:text-[#8FAFA9]">
                      {connector.speedType}
                    </span>
                  </div>

                  <div className="my-2">
                    <p className="text-xl font-extrabold text-[#123C3A] dark:text-[#E4EFEA] tracking-tight">
                      {connector.type}
                    </p>
                    <p className="text-sm font-bold text-[#19C7B1]">
                      {connector.powerKw} kW
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#D9DED5] dark:border-[#183E3A] flex items-center justify-between">
                    {isFree ? (
                      <button
                        onClick={() => onStartCharging(station, connector)}
                        className="w-full py-2 rounded-btn bg-[#19C7B1] hover:bg-[#123C3A] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-glow-teal-sm cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>Select & Charge</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-[#5E716E] dark:text-[#8FAFA9] font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#7A8C89]" />
                        est. free in {connector.estimatedFreeInMin || 20} min
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COMPATIBLE VEHICLES SECTION WITH DYNAMIC COMPATIBILITY */}
        <CompatibleVehicles station={station} />

        {/* LIVE AVAILABILITY CHART */}
        <AvailabilityChart />

        {/* LOCATION SECTION */}
        <div className="p-5 rounded-card bg-[#E9EFE7] dark:bg-[#0D2422] border border-[#D9DED5] dark:border-[#183E3A] shadow-card-subtle space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#123C3A] dark:text-[#E4EFEA] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#19C7B1]" />
              <span>Location & Access</span>
            </h3>
            <p className="text-xs text-[#5E716E] dark:text-[#8FAFA9]">
              Exact geographic pin and gate entry guidance
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#183E3A] text-xs text-[#14201F] dark:text-[#E4EFEA] flex items-start gap-2.5 shadow-sm">
            <MapPin className="w-4 h-4 text-[#19C7B1] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#123C3A] dark:text-[#E4EFEA] mb-0.5">{station.fullAddress}</p>
              <p className="text-[#5E716E] dark:text-[#8FAFA9]">Coordinates: {station.lat.toFixed(4)}° N, {station.lng.toFixed(4)}° E</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${station.lat},${station.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 py-2.5 px-4 rounded-btn bg-white dark:bg-[#081B19] hover:bg-[#E9EFE7] dark:hover:bg-[#123431] border border-[#D9DED5] dark:border-[#183E3A] text-xs font-bold text-[#123C3A] dark:text-[#E4EFEA] flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <ExternalLink className="w-4 h-4 text-[#19C7B1]" />
              <span>Open in Google Maps</span>
            </a>

            <button
              onClick={() => onGetDirections(station)}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-btn bg-[#19C7B1] hover:bg-[#123C3A] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-glow-teal-sm cursor-pointer"
            >
              <Navigation className="w-4 h-4 fill-white" />
              <span>Get Directions</span>
            </button>
          </div>
        </div>

        {/* REVIEWS SECTION */}
        <ReviewsSection
          reviews={station.reviews}
          reviewsCount={station.reviewsCount}
          rating={station.rating}
        />

      </motion.div>

      {/* STICKY BOTTOM BAR */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.28, delay: 0.1 }}
        className="fixed bottom-0 left-0 right-0 z-40 bg-[#F4F1E8]/95 dark:bg-[#071715]/95 backdrop-blur-xl border-t border-[#D9DED5] dark:border-[#183E3A] px-4 sm:px-8 py-3.5 pb-safe shadow-card-hover"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2.5 sm:gap-4">
          <div className="flex flex-col min-w-0 shrink">
            <div className="flex items-baseline gap-1">
              <span className="text-lg sm:text-2xl font-black text-[#123C3A] dark:text-[#E4EFEA] tabular-nums">₹{station.pricePerKwh}</span>
              <span className="text-xs text-[#5E716E] dark:text-[#8FAFA9] font-medium">/ kWh</span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-[#5E716E] dark:text-[#8FAFA9] tabular-nums truncate">
              Min fee ₹{station.minSessionFee} · ~₹{station.estimatedFullChargeCost} for 80%
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={() => setIsContactHostOpen(true)}
              className="hidden sm:flex min-h-[44px] items-center gap-1.5 px-3.5 py-2.5 rounded-btn bg-white dark:bg-[#0D2422] hover:bg-[#E9EFE7] dark:hover:bg-[#163834] border border-[#D9DED5] dark:border-[#183E3A] text-xs font-bold text-[#123C3A] dark:text-[#E4EFEA] transition-colors shadow-sm cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-[#19C7B1]" />
              <span>Contact Host</span>
            </button>

            <button
              onClick={() => setIsBookModalOpen(true)}
              className="min-h-[42px] sm:min-h-[44px] px-2.5 sm:px-6 py-2 sm:py-2.5 rounded-btn bg-white dark:bg-[#0D2422] hover:bg-[#E9EFE7] dark:hover:bg-[#163834] border border-[#19C7B1] text-xs font-bold text-[#123C3A] dark:text-[#19C7B1] transition-colors shadow-sm cursor-pointer whitespace-nowrap"
            >
              <span className="hidden xs:inline">Book Bay (Demo)</span>
              <span className="xs:hidden">Book Bay</span>
            </button>

            <button
              onClick={() => onStartCharging(station, firstAvailableConnector)}
              className="min-h-[42px] sm:min-h-[44px] px-3.5 sm:px-8 py-2 sm:py-3 rounded-btn bg-[#19C7B1] hover:bg-[#123C3A] text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 transition-all duration-300 shadow-glow-teal active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <Zap className="w-4 h-4 fill-current shrink-0" />
              <span>Start Charging</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Modals */}
      <ContactHostModal
        isOpen={isContactHostOpen}
        onClose={() => setIsContactHostOpen(false)}
        station={station}
      />

      <BookStationModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        station={station}
      />

    </div>
  );
};
