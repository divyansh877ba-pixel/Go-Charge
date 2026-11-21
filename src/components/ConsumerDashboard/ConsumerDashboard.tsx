import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Car, BatteryCharging, CalendarCheck, Heart, User, 
  Settings, MapPin, Plus, ArrowRight, CheckCircle2, XCircle, 
  Clock, ShieldCheck, Navigation, LogOut, Sun, Moon, 
  Sparkles, ChevronRight, Phone, QrCode, Trash2, 
  Check, ArrowLeft, Fuel, Info, LayoutDashboard, Menu, X, MoreHorizontal
} from 'lucide-react';
import { AuthUser } from '../../hooks/useAuth';
import { Station, Connector } from '../../types';
import { VehicleModel, INDIAN_EV_DATABASE, CONNECTOR_SPECS } from '../../data/vehicles';
import { useTheme } from '../../hooks/useTheme';
import { fetchUserVehicles, addUserVehicle, deleteUserVehicle, fetchReservations } from '../../lib/supabaseService';

export type ConsumerTab = 'overview' | 'bookings' | 'saved' | 'vehicles' | 'profile' | 'settings';

export interface ConsumerBooking {
  id: string;
  stationId: string;
  stationName: string;
  stationAddress: string;
  connectorType: string;
  connectorPower: string;
  dateTime: string;
  durationMinutes: number;
  energyKwh: number;
  amount: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  otpCode: string;
  vehicleModel: string;
  createdAt: string;
}

const INITIAL_CONSUMER_BOOKINGS: ConsumerBooking[] = [
  {
    id: 'bk-cons-101',
    stationId: '1',
    stationName: 'GreenDrive Residential Fast Hub',
    stationAddress: 'B-4/12, Safdarjung Enclave, New Delhi',
    connectorType: 'CCS2',
    connectorPower: '22 kW AC Fast',
    dateTime: 'Today, 2:30 PM – 4:00 PM',
    durationMinutes: 90,
    energyKwh: 28.5,
    amount: 456,
    status: 'upcoming',
    otpCode: '4829',
    vehicleModel: 'Tata Nexon EV Max',
    createdAt: '2024-11-02T04:30:00Z'
  },
  {
    id: 'bk-cons-102',
    stationId: '2',
    stationName: 'Cyber Park Commercial DC Bay',
    stationAddress: 'DLF Cyber City, Tower C Bay, Gurugram',
    connectorType: 'CCS2',
    connectorPower: '60 kW DC Ultra-Fast',
    dateTime: 'Tomorrow, 11:00 AM – 11:45 AM',
    durationMinutes: 45,
    energyKwh: 34.0,
    amount: 646,
    status: 'upcoming',
    otpCode: '7193',
    vehicleModel: 'Tata Nexon EV Max',
    createdAt: '2024-11-03T05:15:00Z'
  },
  {
    id: 'bk-cons-103',
    stationId: '3',
    stationName: 'AeroCity Fast Charging Plaza',
    stationAddress: 'Asset 5B, Worldmark 2, Aerocity, New Delhi',
    connectorType: 'CCS2',
    connectorPower: '50 kW DC Fast',
    dateTime: '28 Oct 2024, 4:15 PM – 5:00 PM',
    durationMinutes: 45,
    energyKwh: 31.8,
    amount: 540,
    status: 'completed',
    otpCode: '9041',
    vehicleModel: 'Tata Nexon EV Max',
    createdAt: '2024-10-28T10:45:00Z'
  },
  {
    id: 'bk-cons-104',
    stationId: '4',
    stationName: 'Connaught Place Central Hub',
    stationAddress: 'Radial Road 4, Inner Circle, New Delhi',
    connectorType: 'Type-2',
    connectorPower: '11 kW AC',
    dateTime: '15 Oct 2024, 1:00 PM – 2:30 PM',
    durationMinutes: 90,
    energyKwh: 16.5,
    amount: 280,
    status: 'cancelled',
    otpCode: '3152',
    vehicleModel: 'Tata Nexon EV Max',
    createdAt: '2024-10-15T07:30:00Z'
  }
];

interface ConsumerDashboardProps {
  user: AuthUser;
  onLogout: () => void;
  onGoToMap: () => void;
  onSelectStationDetails?: (station: Station) => void;
  onGetDirections?: (station: Station) => void;
  onStartCharging?: (station: Station, connector: Connector) => void;
  stations: Station[];
  favorites: string[];
  onToggleFavorite: (station: Station | string) => void;
  selectedVehicle: VehicleModel | null;
  onSelectVehicle: (vehicle: VehicleModel | null) => void;
  initialTab?: ConsumerTab;
  onSwitchToHostDashboard?: () => void;
}

export const ConsumerDashboard: React.FC<ConsumerDashboardProps> = ({
  user,
  onLogout,
  onGoToMap,
  onSelectStationDetails,
  onGetDirections,
  stations,
  favorites,
  onToggleFavorite,
  selectedVehicle,
  onSelectVehicle,
  initialTab = 'overview',
  onSwitchToHostDashboard,
}) => {
  const [activeTab, setActiveTab] = useState<ConsumerTab>(initialTab);
  const [bookings, setBookings] = useState<ConsumerBooking[]>(() => {
    try {
      const saved = localStorage.getItem('amperway_consumer_bookings');
      return saved ? JSON.parse(saved) : INITIAL_CONSUMER_BOOKINGS;
    } catch {
      return INITIAL_CONSUMER_BOOKINGS;
    }
  });

  // Saved vehicles list
  const [savedVehicles, setSavedVehicles] = useState<VehicleModel[]>(() => {
    try {
      const saved = localStorage.getItem('amperway_saved_vehicles_list');
      if (saved) return JSON.parse(saved);
      // Default to Tata Nexon EV Max and Ather 450X if available
      const nexon = INDIAN_EV_DATABASE.find(v => v.id.includes('nexon')) || INDIAN_EV_DATABASE[0];
      const ather = INDIAN_EV_DATABASE.find(v => v.id.includes('ather')) || INDIAN_EV_DATABASE[1];
      return [nexon, ather].filter(Boolean);
    } catch {
      return [INDIAN_EV_DATABASE[0]];
    }
  });

  // State for adding vehicle modal
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [vehicleCategoryFilter, setVehicleCategoryFilter] = useState<'4-Wheeler' | '2-Wheeler'>('4-Wheeler');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  
  // State for booking details modal
  const [selectedBookingDetails, setSelectedBookingDetails] = useState<ConsumerBooking | null>(null);

  // Booking status filter in bookings tab
  const [bookingFilter, setBookingFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');

  // Mobile More bottom sheet toggle
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const { isDark, toggleTheme } = useTheme();

  // Synchronize vehicles and reservations with Supabase database
  useEffect(() => {
    if (!user?.id) return;
    let isMounted = true;

    async function loadSupabaseUserData() {
      // 1. Fetch real vehicles from Supabase
      const dbVehicles = await fetchUserVehicles();
      if (isMounted && dbVehicles && dbVehicles.length > 0) {
        const mapped = dbVehicles.map((dbV) => {
          const match = INDIAN_EV_DATABASE.find(
            (iv) =>
              iv.model.toLowerCase() === dbV.model.toLowerCase() ||
              iv.brand.toLowerCase() === dbV.make.toLowerCase()
          );
          if (match) {
            return { ...match, id: dbV.id };
          }
          return {
            id: dbV.id,
            brand: dbV.make,
            model: dbV.model,
            category: '4-Wheeler' as const,
            subType: 'Electric Car' as const,
            connectors: ['CCS2' as const],
            fastChargingSupport: true,
            maxAcKw: 7.2,
            maxDcKw: 50,
            batteryKwh: dbV.battery_capacity_kwh || 40.5,
            realRangeKm: 312,
            connectorDescription: 'CCS2 Type 2 Indian standard',
          };
        });
        setSavedVehicles(mapped);
      }

      // 2. Fetch reservations from Supabase
      const dbReservations = await fetchReservations();
      if (isMounted && dbReservations && dbReservations.length > 0) {
        const mappedBookings: ConsumerBooking[] = dbReservations.map((r, idx) => ({
          id: r.id,
          stationId: r.station_id || 'st-default',
          stationName: 'Go Charge Station',
          stationAddress: 'Delhi NCR Hub',
          connectorType: 'CCS2 Fast Charger',
          connectorPower: '60 kW',
          dateTime: r.start_at || new Date().toISOString(),
          durationMinutes: 45,
          energyKwh: 34.2,
          amount: 580,
          status: (r.status as any) || 'upcoming',
          otpCode: `${1000 + idx}`,
          vehicleModel: 'My EV',
          createdAt: r.created_at || new Date().toISOString(),
        }));
        setBookings((prev) => {
          const ids = new Set(mappedBookings.map((mb) => mb.id));
          return [...mappedBookings, ...prev.filter((pb) => !ids.has(pb.id))];
        });
      }
    }

    loadSupabaseUserData();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  // Save bookings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('amperway_consumer_bookings', JSON.stringify(bookings));
    } catch (e) {
      console.warn('Could not persist consumer bookings:', e);
    }
  }, [bookings]);

  // Save vehicles list to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('amperway_saved_vehicles_list', JSON.stringify(savedVehicles));
    } catch (e) {
      console.warn('Could not persist saved vehicles list:', e);
    }
  }, [savedVehicles]);

  const handleCancelBooking = (bookingId: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
    if (selectedBookingDetails?.id === bookingId) {
      setSelectedBookingDetails(prev => prev ? { ...prev, status: 'cancelled' } : null);
    }
  };

  const handleAddVehicleToGarage = async (vehicle: VehicleModel) => {
    if (!savedVehicles.some(v => v.id === vehicle.id)) {
      setSavedVehicles(prev => [...prev, vehicle]);
    }
    onSelectVehicle(vehicle);
    setIsAddVehicleOpen(false);

    // Persist to Supabase if user is logged in
    if (user?.id) {
      const dbRecord = await addUserVehicle(vehicle);
      if (dbRecord) {
        setSavedVehicles(prev => prev.map(v => v.id === vehicle.id ? { ...v, id: dbRecord.id } : v));
      }
    }
  };

  const handleRemoveVehicle = async (vehicleId: string) => {
    const updated = savedVehicles.filter(v => v.id !== vehicleId);
    setSavedVehicles(updated);
    if (selectedVehicle?.id === vehicleId) {
      onSelectVehicle(updated.length > 0 ? updated[0] : null);
    }

    // Delete from Supabase if user is logged in
    if (user?.id) {
      await deleteUserVehicle(vehicleId);
    }
  };

  // Find saved stations from ID array
  const savedStationsList = stations.filter(st => favorites.includes(st.id));

  // Compute stats
  const upcomingBookings = bookings.filter(b => b.status === 'upcoming');
  const nextBooking = upcomingBookings[0] || null;
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const totalKwhCharged = completedBookings.reduce((acc, curr) => acc + curr.energyKwh, 92.4);
  const carbonOffsetKg = Math.round(totalKwhCharged * 0.82);

  // Filtered vehicles for picker modal
  const availableBrands = Array.from(new Set(
    INDIAN_EV_DATABASE
      .filter(v => v.category === vehicleCategoryFilter)
      .map(v => v.brand)
  ));

  const filteredVehiclesList = INDIAN_EV_DATABASE.filter(v => {
    if (v.category !== vehicleCategoryFilter) return false;
    if (selectedBrand !== 'All' && v.brand !== selectedBrand) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8F7F2] dark:bg-[#071715] text-[#123C3A] dark:text-[#E0EFEA] transition-colors duration-300 flex flex-col">
      {/* 1. TOP CONSUMER NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-[#F8F7F2]/95 dark:bg-[#071715]/95 backdrop-blur-md border-b border-[#D9DED5] dark:border-[#163835] px-4 sm:px-8 py-3 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Logo & Tag */}
          <div className="flex items-center gap-3">
            <button
              onClick={onGoToMap}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-pill bg-[#E9EFE7] dark:bg-[#0D2422] hover:bg-white dark:hover:bg-[#123633] border border-[#D9DED5] dark:border-[#1E4844] transition-all group cursor-pointer shadow-sm"
            >
              <div className="w-8 h-8 rounded-full bg-[#18C5B7] flex items-center justify-center text-white shadow-glow-teal-sm group-hover:rotate-12 transition-transform">
                <Zap className="w-4 h-4 fill-white" />
              </div>
              <div className="text-left">
                <span className="font-extrabold text-base tracking-tight text-[#123C3A] dark:text-white group-hover:text-[#18C5B7] transition-colors leading-none block">
                  Go Charge
                </span>
                <span className="text-[10px] font-bold text-[#18C5B7] tracking-wider uppercase">
                  Consumer Portal
                </span>
              </div>
            </button>

            {/* Quick Map Link */}
            <button
              onClick={onGoToMap}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-pill bg-[#18C5B7]/10 dark:bg-[#18C5B7]/15 hover:bg-[#18C5B7]/25 text-[#123C3A] dark:text-[#18C5B7] border border-[#18C5B7]/30 text-xs font-bold transition-all cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#18C5B7]" />
              <span>Explore Live Map</span>
            </button>

            {/* Dual-role Host Portal Shortcut */}
            {onSwitchToHostDashboard && (
              <button
                type="button"
                onClick={onSwitchToHostDashboard}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-pill bg-[#18C5B7] hover:bg-[#15A896] text-white text-xs font-bold transition-all shadow-glow-teal-sm cursor-pointer active:scale-95"
                title="Switch to Host Dashboard"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Host Portal</span>
              </button>
            )}
          </div>

          {/* Right Controls: Active Vehicle Pill, Theme Toggle, User Badge, Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Active Vehicle Quick Switcher */}
            {selectedVehicle ? (
              <button
                onClick={() => setActiveTab('vehicles')}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-pill bg-white dark:bg-[#0D2422] border border-[#D9DED5] dark:border-[#1E4844] text-xs font-semibold hover:border-[#18C5B7] transition-all shadow-sm cursor-pointer"
                title="Change or Manage Vehicles"
              >
                <Car className="w-3.5 h-3.5 text-[#18C5B7]" />
                <span className="max-w-[130px] truncate">{selectedVehicle.brand} {selectedVehicle.model}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#18C5B7]/15 text-[#18C5B7] font-bold">
                  {selectedVehicle.connectors[0]}
                </span>
              </button>
            ) : (
              <button
                onClick={() => setIsAddVehicleOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-pill bg-white dark:bg-[#0D2422] border border-dashed border-[#18C5B7] text-[#18C5B7] text-xs font-bold hover:bg-[#18C5B7]/10 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Vehicle</span>
              </button>
            )}

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="p-2 sm:px-3 sm:py-1.5 rounded-pill bg-[#E9EFE7] dark:bg-[#0D2422] hover:bg-white dark:hover:bg-[#123633] border border-[#D9DED5] dark:border-[#1E4844] text-[#123C3A] dark:text-white transition-all shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
              ) : (
                <Moon className="w-4 h-4 text-[#123C3A] fill-[#123C3A]" />
              )}
              <span className="text-xs font-bold hidden md:inline">{isDark ? 'Light' : 'Dark'}</span>
            </button>

            {/* User Profile Badge */}
            <div className="flex items-center gap-2 pl-2 border-l border-[#D9DED5] dark:border-[#1E4844]">
              <div className="relative">
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-[#18C5B7]/40"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#071715]" />
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-[#123C3A] dark:text-white leading-tight">{user.name}</p>
                <span className="text-[10px] font-semibold text-[#18C5B7] uppercase tracking-wider">
                  Consumer
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                title="Log Out"
                className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 transition-all cursor-pointer ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* 2. TAB NAVIGATION BAR (Desktop >= md) */}
      <div className="hidden md:block bg-[#EFECE3] dark:bg-[#0B1E1C] border-b border-[#D9DED5] dark:border-[#163835] px-4 sm:px-8 py-2 sticky top-[57px] z-30 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar gap-2 sm:gap-4">
          <nav className="flex items-center gap-1.5 sm:gap-2">
            {[
              { id: 'overview' as ConsumerTab, label: 'Overview', icon: Zap },
              { id: 'bookings' as ConsumerTab, label: 'My Bookings', icon: CalendarCheck, badge: upcomingBookings.length },
              { id: 'saved' as ConsumerTab, label: 'Saved Chargers', icon: Heart, badge: savedStationsList.length },
              { id: 'vehicles' as ConsumerTab, label: 'My Vehicles', icon: Car, badge: savedVehicles.length },
              { id: 'profile' as ConsumerTab, label: 'Profile', icon: User },
              { id: 'settings' as ConsumerTab, label: 'Settings', icon: Settings },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-pill font-bold text-xs transition-colors whitespace-nowrap cursor-pointer z-10 ${
                    isActive
                      ? 'text-white'
                      : 'bg-white/60 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 text-[#4E615E] dark:text-[#9EC4BD]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeConsumerTabPill"
                      className="absolute inset-0 rounded-pill bg-[#18C5B7] shadow-glow-teal-sm -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                      isActive ? 'bg-[#073B35] text-white' : 'bg-[#18C5B7]/20 text-[#123C3A] dark:text-[#18C5B7]'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick CTA to Map */}
          <button
            onClick={onGoToMap}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-pill bg-[#073B35] dark:bg-[#18C5B7] text-white dark:text-[#071715] text-xs font-extrabold hover:opacity-90 transition-all shadow-sm shrink-0 cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Find Chargers</span>
          </button>
        </div>
      </div>

      {/* 3. MAIN DASHBOARD CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3.5 sm:px-8 py-5 sm:py-8 pb-24 md:pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* ======================================================== */}
            {/* TAB 1: OVERVIEW */}
            {/* ======================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#073B35] to-[#0A4D46] text-white p-6 sm:p-8 shadow-card-subtle">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#18C5B7_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-xs font-semibold text-[#18C5B7] mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Welcome back, {user.name.split(' ')[0]}!</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    Ready to Charge Your EV Today?
                  </h1>
                  <p className="mt-2 text-sm text-[#B4D7D2] max-w-xl">
                    Discover 4,800+ high-speed fast chargers across India, manage your vehicle compatibility, and track your charging sessions seamlessly.
                  </p>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <button
                    onClick={onGoToMap}
                    className="px-5 py-3 rounded-2xl bg-[#18C5B7] hover:bg-[#15A896] text-[#071715] font-extrabold text-sm flex items-center gap-2 shadow-glow-teal-sm transition-all cursor-pointer active:scale-95"
                  >
                    <MapPin className="w-4 h-4 fill-current" />
                    <span>Find Nearby Chargers</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsAddVehicleOpen(true)}
                    className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm flex items-center gap-2 border border-white/20 transition-all cursor-pointer"
                  >
                    <Car className="w-4 h-4" />
                    <span>Add Vehicle</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm flex items-center gap-2 border border-white/20 transition-all cursor-pointer"
                  >
                    <CalendarCheck className="w-4 h-4" />
                    <span>View Bookings</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Key Metric Highlights */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white dark:bg-[#0E2725] rounded-2xl p-5 border border-[#D9DED5] dark:border-[#1E4844] shadow-sm">
                <div className="flex items-center justify-between text-[#7A8C89] dark:text-[#88ABA6] mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Upcoming Slots</span>
                  <div className="w-8 h-8 rounded-xl bg-[#18C5B7]/10 flex items-center justify-center text-[#18C5B7]">
                    <CalendarCheck className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#123C3A] dark:text-white">
                  {upcomingBookings.length}
                </div>
                <p className="text-[11px] text-[#7A8C89] dark:text-[#88ABA6] mt-1">
                  {upcomingBookings.length > 0 ? 'Next slot scheduled today' : 'No upcoming bookings'}
                </p>
              </div>

              <div className="bg-white dark:bg-[#0E2725] rounded-2xl p-5 border border-[#D9DED5] dark:border-[#1E4844] shadow-sm">
                <div className="flex items-center justify-between text-[#7A8C89] dark:text-[#88ABA6] mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">My Garage</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Car className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#123C3A] dark:text-white">
                  {savedVehicles.length}
                </div>
                <p className="text-[11px] text-[#7A8C89] dark:text-[#88ABA6] mt-1">
                  Active: {selectedVehicle?.model || 'None selected'}
                </p>
              </div>

              <div className="bg-white dark:bg-[#0E2725] rounded-2xl p-5 border border-[#D9DED5] dark:border-[#1E4844] shadow-sm">
                <div className="flex items-center justify-between text-[#7A8C89] dark:text-[#88ABA6] mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Saved Chargers</span>
                  <div className="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                    <Heart className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#123C3A] dark:text-white">
                  {savedStationsList.length}
                </div>
                <p className="text-[11px] text-[#7A8C89] dark:text-[#88ABA6] mt-1">
                  Bookmarked charging spots
                </p>
              </div>

              <div className="bg-white dark:bg-[#0E2725] rounded-2xl p-5 border border-[#D9DED5] dark:border-[#1E4844] shadow-sm">
                <div className="flex items-center justify-between text-[#7A8C89] dark:text-[#88ABA6] mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Clean Energy</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <BatteryCharging className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#123C3A] dark:text-white">
                  {totalKwhCharged.toFixed(1)} <span className="text-sm font-bold text-[#7A8C89]">kWh</span>
                </div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                  🌱 ~{carbonOffsetKg} kg CO₂ saved
                </p>
              </div>

            </div>

            {/* Next Upcoming Booking Card (Prominent) */}
            {nextBooking && (
              <div className="bg-white dark:bg-[#0E2725] rounded-3xl p-6 border-2 border-[#18C5B7]/40 shadow-card-subtle">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D9DED5] dark:border-[#1E4844]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#18C5B7]/15 flex items-center justify-center text-[#18C5B7]">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-extrabold text-[#18C5B7] uppercase tracking-wider">
                        Next Upcoming Session
                      </span>
                      <h3 className="text-lg font-bold text-[#123C3A] dark:text-white">
                        {nextBooking.stationName}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
                      Confirmed Slot
                    </span>
                    <button
                      onClick={() => setSelectedBookingDetails(nextBooking)}
                      className="text-xs font-bold text-[#18C5B7] hover:underline cursor-pointer"
                    >
                      View Pass & QR
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  <div>
                    <span className="text-xs text-[#7A8C89] dark:text-[#88ABA6]">Scheduled Slot</span>
                    <p className="font-bold text-sm text-[#123C3A] dark:text-white mt-0.5">
                      {nextBooking.dateTime}
                    </p>
                    <p className="text-xs text-[#7A8C89]">{nextBooking.durationMinutes} mins slot duration</p>
                  </div>

                  <div>
                    <span className="text-xs text-[#7A8C89] dark:text-[#88ABA6]">Connector & Power</span>
                    <p className="font-bold text-sm text-[#123C3A] dark:text-white mt-0.5">
                      {nextBooking.connectorType} · {nextBooking.connectorPower}
                    </p>
                    <p className="text-xs text-[#7A8C89]">For {nextBooking.vehicleModel}</p>
                  </div>

                  <div className="flex items-center sm:justify-end gap-3 pt-2 sm:pt-0">
                    <button
                      onClick={() => setSelectedBookingDetails(nextBooking)}
                      className="px-4 py-2.5 rounded-xl bg-[#18C5B7] hover:bg-[#15A896] text-white text-xs font-extrabold flex items-center gap-2 shadow-glow-teal-sm transition-all cursor-pointer"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>Unlock Pass (OTP: {nextBooking.otpCode})</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Two-Column Layout: Active Vehicle Showcase + Saved Stations Quick Strip */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left: Active Vehicle Card */}
              <div className="bg-white dark:bg-[#0E2725] rounded-3xl p-6 border border-[#D9DED5] dark:border-[#1E4844] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Car className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-sm text-[#123C3A] dark:text-white">Active EV in Garage</h4>
                    </div>
                    <button
                      onClick={() => setActiveTab('vehicles')}
                      className="text-xs font-bold text-[#18C5B7] hover:underline cursor-pointer"
                    >
                      Manage Vehicles
                    </button>
                  </div>

                  {selectedVehicle ? (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-[#F8F7F2] dark:bg-[#071715] border border-[#D9DED5] dark:border-[#163835]">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-[#18C5B7] uppercase tracking-wider">
                              {selectedVehicle.category} · {selectedVehicle.subType}
                            </span>
                            <h3 className="text-lg font-extrabold text-[#123C3A] dark:text-white">
                              {selectedVehicle.brand} {selectedVehicle.model}
                            </h3>
                          </div>
                          <span className="px-2.5 py-1 rounded-full bg-[#18C5B7]/15 text-[#18C5B7] text-[11px] font-mono font-bold">
                            {selectedVehicle.batteryKwh} kWh
                          </span>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-white dark:bg-[#0E2725] p-2.5 rounded-xl">
                            <span className="text-[#7A8C89] text-[11px]">Real Range</span>
                            <p className="font-bold text-[#123C3A] dark:text-white">~{selectedVehicle.realRangeKm} km</p>
                          </div>
                          <div className="bg-white dark:bg-[#0E2725] p-2.5 rounded-xl">
                            <span className="text-[#7A8C89] text-[11px]">Fast Charging</span>
                            <p className="font-bold text-[#123C3A] dark:text-white">Up to {selectedVehicle.maxDcKw} kW</p>
                          </div>
                        </div>

                        <div className="mt-3">
                          <span className="text-[11px] text-[#7A8C89] block mb-1">Supported Charging Standards:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedVehicle.connectors.map(conn => (
                              <span
                                key={conn}
                                className="px-2 py-0.5 rounded-md bg-[#18C5B7]/15 text-[#18C5B7] text-[10px] font-mono font-bold"
                              >
                                {conn}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Car className="w-12 h-12 text-[#7A8C89] mx-auto mb-2 opacity-50" />
                      <p className="text-sm font-bold text-[#123C3A] dark:text-white">No Vehicle Selected</p>
                      <p className="text-xs text-[#7A8C89] mt-1 mb-4">
                        Add your EV model to automatically filter compatible charging stations.
                      </p>
                      <button
                        onClick={() => setIsAddVehicleOpen(true)}
                        className="px-4 py-2 rounded-xl bg-[#18C5B7] text-white text-xs font-bold cursor-pointer"
                      >
                        Select Vehicle
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-[#D9DED5] dark:border-[#1E4844] flex items-center justify-between text-xs">
                  <span className="text-[#7A8C89]">Filter map to compatible stations</span>
                  <button
                    onClick={onGoToMap}
                    className="font-bold text-[#18C5B7] flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span>Find Compatible Ports</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Right: Saved Stations Quick View */}
              <div className="bg-white dark:bg-[#0E2725] rounded-3xl p-6 border border-[#D9DED5] dark:border-[#1E4844] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                        <Heart className="w-4 h-4 fill-current" />
                      </div>
                      <h4 className="font-bold text-sm text-[#123C3A] dark:text-white">Saved Stations</h4>
                    </div>
                    <button
                      onClick={() => setActiveTab('saved')}
                      className="text-xs font-bold text-[#18C5B7] hover:underline cursor-pointer"
                    >
                      View All ({savedStationsList.length})
                    </button>
                  </div>

                  {savedStationsList.length > 0 ? (
                    <div className="space-y-3">
                      {savedStationsList.slice(0, 3).map(st => (
                        <div
                          key={st.id}
                          className="flex items-center justify-between p-3 rounded-2xl bg-[#F8F7F2] dark:bg-[#071715] border border-[#D9DED5] dark:border-[#163835] hover:border-[#18C5B7] transition-all"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-[#18C5B7]/15 flex items-center justify-center text-[#18C5B7] shrink-0 font-bold text-xs">
                              <Zap className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <h5 className="font-bold text-xs text-[#123C3A] dark:text-white truncate">
                                {st.name}
                              </h5>
                              <p className="text-[11px] text-[#7A8C89] truncate">{st.fullAddress || st.area}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs font-extrabold text-[#123C3A] dark:text-white">
                              ₹{st.pricePerKwh}/kWh
                            </span>
                            <button
                              onClick={() => onSelectStationDetails?.(st)}
                              className="p-1.5 rounded-lg bg-white dark:bg-[#0E2725] text-[#18C5B7] border border-[#D9DED5] dark:border-[#1E4844] hover:bg-[#18C5B7] hover:text-white transition-all cursor-pointer"
                              title="Station Details"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Heart className="w-10 h-10 text-[#7A8C89] mx-auto mb-2 opacity-50" />
                      <p className="text-sm font-bold text-[#123C3A] dark:text-white">No Saved Stations Yet</p>
                      <p className="text-xs text-[#7A8C89] mt-1 mb-4">
                        Tap the heart icon on any station in the map to save it here for quick access.
                      </p>
                      <button
                        onClick={onGoToMap}
                        className="px-4 py-2 rounded-xl bg-[#18C5B7] text-white text-xs font-bold cursor-pointer"
                      >
                        Explore Stations
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-[#D9DED5] dark:border-[#1E4844] flex items-center justify-between text-xs">
                  <span className="text-[#7A8C89]">Need to plan a road trip?</span>
                  <button
                    onClick={onGoToMap}
                    className="font-bold text-[#18C5B7] flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span>Open Live Map</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: MY BOOKINGS */}
        {/* ======================================================== */}
        {activeTab === 'bookings' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Header & Status Filter Pills */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-[#123C3A] dark:text-white">My Charging Bookings</h2>
                <p className="text-xs text-[#7A8C89] mt-0.5">
                  Track upcoming charging slots, active sessions, and past receipts.
                </p>
              </div>

              <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-[#0E2725] rounded-pill border border-[#D9DED5] dark:border-[#1E4844] shadow-sm text-xs font-bold">
                {(['all', 'upcoming', 'completed', 'cancelled'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setBookingFilter(f)}
                    className={`px-3 py-1.5 rounded-pill capitalize transition-all cursor-pointer ${
                      bookingFilter === f
                        ? 'bg-[#18C5B7] text-white shadow-glow-teal-sm'
                        : 'text-[#5E716E] dark:text-[#88ABA6] hover:text-[#123C3A] dark:hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Bookings List */}
            {bookings
              .filter(b => bookingFilter === 'all' || b.status === bookingFilter)
              .length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookings
                  .filter(b => bookingFilter === 'all' || b.status === bookingFilter)
                  .map(booking => {
                    const isUpcoming = booking.status === 'upcoming';
                    const isCompleted = booking.status === 'completed';

                    return (
                      <div
                        key={booking.id}
                        className="bg-white dark:bg-[#0E2725] rounded-3xl p-5 border border-[#D9DED5] dark:border-[#1E4844] shadow-sm flex flex-col justify-between hover:border-[#18C5B7] transition-all"
                      >
                        <div>
                          {/* Top row: Status badge & Booking ID */}
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                              isUpcoming
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                : isCompleted
                                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                                : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                            }`}>
                              {booking.status}
                            </span>
                            <span className="text-[11px] font-mono text-[#7A8C89]">
                              ID: #{booking.id.toUpperCase()}
                            </span>
                          </div>

                          <h3 className="font-bold text-base text-[#123C3A] dark:text-white">
                            {booking.stationName}
                          </h3>
                          <p className="text-xs text-[#7A8C89] mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#18C5B7]" />
                            <span className="truncate">{booking.stationAddress}</span>
                          </p>

                          <div className="mt-4 p-3 rounded-2xl bg-[#F8F7F2] dark:bg-[#071715] border border-[#D9DED5] dark:border-[#163835] space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-[#7A8C89]">Scheduled Time</span>
                              <span className="font-bold text-[#123C3A] dark:text-white">{booking.dateTime}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[#7A8C89]">Connector</span>
                              <span className="font-mono font-bold text-[#18C5B7]">{booking.connectorType} ({booking.connectorPower})</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[#7A8C89]">Est. Energy / Amount</span>
                              <span className="font-bold text-[#123C3A] dark:text-white">~{booking.energyKwh} kWh (₹{booking.amount})</span>
                            </div>
                            {isUpcoming && (
                              <div className="pt-2 border-t border-[#D9DED5] dark:border-[#163835] flex items-center justify-between">
                                <span className="font-bold text-[#18C5B7] flex items-center gap-1">
                                  <QrCode className="w-3.5 h-3.5" />
                                  Unlock OTP
                                </span>
                                <span className="font-mono font-black text-sm text-[#123C3A] dark:text-white bg-white dark:bg-[#0E2725] px-2 py-0.5 rounded border border-[#18C5B7]/40 tracking-wider">
                                  {booking.otpCode}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-5 pt-4 border-t border-[#D9DED5] dark:border-[#1E4844] flex items-center justify-between gap-2">
                          <button
                            onClick={() => setSelectedBookingDetails(booking)}
                            className="px-3 py-2 rounded-xl bg-[#E9EFE7] dark:bg-[#071715] hover:bg-[#18C5B7] hover:text-white text-[#123C3A] dark:text-white text-xs font-bold transition-all cursor-pointer"
                          >
                            Pass Details
                          </button>

                          <div className="flex items-center gap-2">
                            {isUpcoming && (
                              <button
                                onClick={() => handleCancelBooking(booking.id)}
                                className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold transition-all cursor-pointer"
                              >
                                Cancel Slot
                              </button>
                            )}

                            <button
                              onClick={() => {
                                const st = stations.find(s => s.id === booking.stationId);
                                if (st) onGetDirections?.(st);
                                else onGoToMap();
                              }}
                              className="px-3 py-2 rounded-xl bg-[#18C5B7] hover:bg-[#15A896] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-glow-teal-sm transition-all cursor-pointer"
                            >
                              <Navigation className="w-3.5 h-3.5" />
                              <span>Navigate</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-[#0E2725] rounded-3xl border border-[#D9DED5] dark:border-[#1E4844]">
                <CalendarCheck className="w-12 h-12 text-[#7A8C89] mx-auto mb-3 opacity-40" />
                <h3 className="text-lg font-bold text-[#123C3A] dark:text-white">No Bookings Found</h3>
                <p className="text-xs text-[#7A8C89] mt-1 mb-5">
                  You don't have any {bookingFilter !== 'all' ? bookingFilter : ''} bookings at the moment.
                </p>
                <button
                  onClick={onGoToMap}
                  className="px-5 py-2.5 rounded-pill bg-[#18C5B7] hover:bg-[#15A896] text-white text-xs font-extrabold shadow-glow-teal-sm cursor-pointer"
                >
                  Find Stations to Book
                </button>
              </div>
            )}

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: SAVED CHARGERS */}
        {/* ======================================================== */}
        {activeTab === 'saved' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-[#123C3A] dark:text-white">Saved Charging Stations</h2>
                <p className="text-xs text-[#7A8C89] mt-0.5">
                  Bookmarked EV chargers for your daily commute and frequent trips.
                </p>
              </div>

              <button
                onClick={onGoToMap}
                className="px-4 py-2 rounded-pill bg-[#18C5B7] text-white font-bold text-xs flex items-center gap-1.5 shadow-glow-teal-sm cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Explore & Save More</span>
              </button>
            </div>

            {savedStationsList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {savedStationsList.map(st => (
                  <div
                    key={st.id}
                    className="bg-white dark:bg-[#0E2725] rounded-3xl overflow-hidden border border-[#D9DED5] dark:border-[#1E4844] shadow-sm flex flex-col justify-between group hover:border-[#18C5B7] transition-all"
                  >
                    <div>
                      {/* Station Image Thumbnail */}
                      <div className="relative h-44 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img
                          src={st.photos?.[0] || 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=600&q=80'}
                          alt={st.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        {/* Remove favorite button */}
                        <button
                          onClick={() => onToggleFavorite(st)}
                          title="Remove from saved"
                          className="absolute top-3 right-3 p-2 rounded-full bg-black/40 hover:bg-black/60 text-rose-500 backdrop-blur-md transition-all cursor-pointer"
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>

                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                          <span className="font-extrabold text-sm drop-shadow">₹{st.pricePerKwh} / kWh</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            st.status === 'available' ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}>
                            {st.status}
                          </span>
                        </div>
                      </div>

                      {/* Station Details */}
                      <div className="p-4">
                        <h4 className="font-bold text-base text-[#123C3A] dark:text-white line-clamp-1">
                          {st.name}
                        </h4>
                        <p className="text-xs text-[#7A8C89] mt-1 flex items-center gap-1 line-clamp-1">
                          <MapPin className="w-3.5 h-3.5 text-[#18C5B7] shrink-0" />
                          <span>{st.fullAddress || st.area}</span>
                        </p>

                        {/* Connector tags */}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {st.connectors.map(c => (
                            <span
                              key={c.type}
                              className="px-2 py-0.5 rounded-md bg-[#18C5B7]/10 text-[#18C5B7] text-[10px] font-mono font-bold"
                            >
                              {c.type} ({c.powerKw} kW)
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className="p-4 pt-0 flex items-center justify-between gap-2 border-t border-[#D9DED5]/50 dark:border-[#1E4844]/50 mt-2">
                      <button
                        onClick={() => onSelectStationDetails?.(st)}
                        className="px-3 py-2 rounded-xl bg-[#E9EFE7] dark:bg-[#071715] hover:bg-[#18C5B7] hover:text-white text-xs font-bold text-[#123C3A] dark:text-white transition-all cursor-pointer"
                      >
                        Details
                      </button>

                      <button
                        onClick={() => onGetDirections?.(st)}
                        className="px-3 py-2 rounded-xl bg-[#18C5B7] hover:bg-[#15A896] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-glow-teal-sm transition-all cursor-pointer"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Navigate</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-[#0E2725] rounded-3xl border border-[#D9DED5] dark:border-[#1E4844]">
                <Heart className="w-12 h-12 text-[#7A8C89] mx-auto mb-3 opacity-40" />
                <h3 className="text-lg font-bold text-[#123C3A] dark:text-white">No Saved Chargers Yet</h3>
                <p className="text-xs text-[#7A8C89] mt-1 mb-5 max-w-sm mx-auto">
                  Save your favorite stations near your home, workplace or frequent routes to check availability in one tap.
                </p>
                <button
                  onClick={onGoToMap}
                  className="px-5 py-2.5 rounded-pill bg-[#18C5B7] hover:bg-[#15A896] text-white text-xs font-extrabold shadow-glow-teal-sm cursor-pointer"
                >
                  Browse Map
                </button>
              </div>
            )}

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: MY VEHICLES (GARAGE) */}
        {/* ======================================================== */}
        {activeTab === 'vehicles' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-[#123C3A] dark:text-white">My Electric Vehicles</h2>
                <p className="text-xs text-[#7A8C89] mt-0.5">
                  Store your electric cars and scooters to automatically identify compatible fast chargers.
                </p>
              </div>

              <button
                onClick={() => setIsAddVehicleOpen(true)}
                className="px-4 py-2.5 rounded-pill bg-[#18C5B7] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-glow-teal-sm cursor-pointer self-start sm:self-auto active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Electric Vehicle</span>
              </button>
            </div>

            {/* Vehicles Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {savedVehicles.map(v => {
                const isSelected = selectedVehicle?.id === v.id;

                return (
                  <div
                    key={v.id}
                    className={`bg-white dark:bg-[#0E2725] rounded-3xl p-6 border transition-all relative ${
                      isSelected
                        ? 'border-2 border-[#18C5B7] shadow-glow-teal-sm'
                        : 'border-[#D9DED5] dark:border-[#1E4844] shadow-sm'
                    }`}
                  >
                    {/* Top Row: Type badge + Default/Active pill */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#18C5B7]/15 text-[#18C5B7] text-[10px] font-bold uppercase tracking-wider">
                        {v.category} · {v.subType}
                      </span>

                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                          <Check className="w-3 h-3" />
                          <span>Active on Map</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => onSelectVehicle(v)}
                          className="text-[11px] font-bold text-[#18C5B7] hover:underline cursor-pointer"
                        >
                          Set as Active
                        </button>
                      )}
                    </div>

                    <h3 className="text-xl font-extrabold text-[#123C3A] dark:text-white">
                      {v.brand} {v.model}
                    </h3>
                    <p className="text-xs text-[#7A8C89] mt-0.5">
                      {v.connectorDescription}
                    </p>

                    {/* Stats Matrix */}
                    <div className="mt-4 grid grid-cols-3 gap-2.5 text-xs text-center">
                      <div className="p-3 rounded-2xl bg-[#F8F7F2] dark:bg-[#071715] border border-[#D9DED5] dark:border-[#163835]">
                        <span className="text-[10px] text-[#7A8C89] uppercase tracking-wider block">Battery</span>
                        <span className="font-extrabold text-sm text-[#123C3A] dark:text-white font-mono mt-0.5 block">
                          {v.batteryKwh} kWh
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-[#F8F7F2] dark:bg-[#071715] border border-[#D9DED5] dark:border-[#163835]">
                        <span className="text-[10px] text-[#7A8C89] uppercase tracking-wider block">Real Range</span>
                        <span className="font-extrabold text-sm text-[#123C3A] dark:text-white font-mono mt-0.5 block">
                          ~{v.realRangeKm} km
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-[#F8F7F2] dark:bg-[#071715] border border-[#D9DED5] dark:border-[#163835]">
                        <span className="text-[10px] text-[#7A8C89] uppercase tracking-wider block">Max DC Power</span>
                        <span className="font-extrabold text-sm text-[#18C5B7] font-mono mt-0.5 block">
                          {v.maxDcKw} kW
                        </span>
                      </div>
                    </div>

                    {/* Compatible Connectors */}
                    <div className="mt-4">
                      <span className="text-[11px] font-bold text-[#7A8C89] block mb-1.5">
                        Compatible Indian Standards:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {v.connectors.map(c => {
                          const spec = CONNECTOR_SPECS[c];
                          return (
                            <span
                              key={c}
                              title={spec?.fullName}
                              className="px-2.5 py-1 rounded-lg bg-[#E9EFE7] dark:bg-[#071715] border border-[#D9DED5] dark:border-[#1E4844] text-[#123C3A] dark:text-[#18C5B7] font-mono text-[11px] font-bold"
                            >
                              {c}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-5 pt-4 border-t border-[#D9DED5] dark:border-[#1E4844] flex items-center justify-between">
                      <button
                        onClick={() => handleRemoveVehicle(v.id)}
                        className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Vehicle</span>
                      </button>

                      <button
                        onClick={() => {
                          onSelectVehicle(v);
                          onGoToMap();
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-[#18C5B7] hover:bg-[#15A896] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-glow-teal-sm cursor-pointer"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Filter Map For This EV</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: PROFILE */}
        {/* ======================================================== */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-2xl font-extrabold text-[#123C3A] dark:text-white">Consumer Account Profile</h2>
              <p className="text-xs text-[#7A8C89] mt-0.5">
                Manage your Go Charge account credentials, contact numbers, and preferences.
              </p>
            </div>

            <div className="bg-white dark:bg-[#0E2725] rounded-3xl p-6 sm:p-8 border border-[#D9DED5] dark:border-[#1E4844] shadow-sm space-y-6">
              
              <div className="flex items-center gap-4">
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80'}
                  alt={user.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#18C5B7]"
                />
                <div>
                  <h3 className="text-xl font-bold text-[#123C3A] dark:text-white">{user.name}</h3>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#18C5B7]/15 text-[#18C5B7] text-xs font-bold uppercase tracking-wider mt-1">
                    Role: {user.role.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#F8F7F2] dark:bg-[#071715] border border-[#D9DED5] dark:border-[#163835]">
                  <span className="text-[#7A8C89] block mb-0.5">Full Name</span>
                  <p className="font-bold text-sm text-[#123C3A] dark:text-white">{user.name}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F8F7F2] dark:bg-[#071715] border border-[#D9DED5] dark:border-[#163835]">
                  <span className="text-[#7A8C89] block mb-0.5">Email Address</span>
                  <p className="font-bold text-sm text-[#123C3A] dark:text-white">{user.email}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F8F7F2] dark:bg-[#071715] border border-[#D9DED5] dark:border-[#163835]">
                  <span className="text-[#7A8C89] block mb-0.5">Phone Number</span>
                  <p className="font-bold text-sm text-[#123C3A] dark:text-white">{user.phone}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F8F7F2] dark:bg-[#071715] border border-[#D9DED5] dark:border-[#163835]">
                  <span className="text-[#7A8C89] block mb-0.5">Primary City</span>
                  <p className="font-bold text-sm text-[#123C3A] dark:text-white">{user.city || 'New Delhi, Delhi NCR'}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Prototype Role-Based Architecture Notice</span>
                  <p className="mt-0.5 leading-relaxed">
                    This account is currently authenticated under the Consumer role. You have full access to EV search, compatibility filtering, booking reservations, and garage management. To manage host charging hardware, log in as a Charger Owner.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#D9DED5] dark:border-[#1E4844] flex items-center justify-between">
                <button
                  onClick={onLogout}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out of Consumer Account</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: SETTINGS */}
        {/* ======================================================== */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-2xl font-extrabold text-[#123C3A] dark:text-white">Preferences & Settings</h2>
              <p className="text-xs text-[#7A8C89] mt-0.5">
                Customize your interface theme, notifications, and charging habits.
              </p>
            </div>

            <div className="bg-white dark:bg-[#0E2725] rounded-3xl p-6 sm:p-8 border border-[#D9DED5] dark:border-[#1E4844] shadow-sm space-y-6">
              
              {/* Theme Settings */}
              <div className="flex items-center justify-between pb-5 border-b border-[#D9DED5] dark:border-[#163835]">
                <div>
                  <h4 className="font-bold text-sm text-[#123C3A] dark:text-white">Interface Theme</h4>
                  <p className="text-xs text-[#7A8C89]">Switch between Cream/Forest Green Light mode and Deep Dark mode.</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="px-4 py-2 rounded-xl bg-[#E9EFE7] dark:bg-[#071715] hover:bg-[#18C5B7] hover:text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                >
                  {isDark ? <Sun className="w-4 h-4 text-[#F59E0B]" /> : <Moon className="w-4 h-4 text-[#123C3A]" />}
                  <span>{isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
                </button>
              </div>

              {/* Notification Preferences */}
              <div className="space-y-3 pb-5 border-b border-[#D9DED5] dark:border-[#163835]">
                <h4 className="font-bold text-sm text-[#123C3A] dark:text-white">Notification Alerts</h4>
                
                <label className="flex items-center justify-between text-xs cursor-pointer">
                  <span>SMS alert 15 mins before booking begins</span>
                  <input type="checkbox" defaultChecked className="accent-[#18C5B7] w-4 h-4" />
                </label>

                <label className="flex items-center justify-between text-xs cursor-pointer">
                  <span>Push notification when charging finishes</span>
                  <input type="checkbox" defaultChecked className="accent-[#18C5B7] w-4 h-4" />
                </label>

                <label className="flex items-center justify-between text-xs cursor-pointer">
                  <span>Price drop alerts on saved chargers</span>
                  <input type="checkbox" defaultChecked className="accent-[#18C5B7] w-4 h-4" />
                </label>
              </div>

              {/* Clear Local Cache */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <h4 className="font-bold text-sm text-[#123C3A] dark:text-white">Reset Demo Session</h4>
                  <p className="text-xs text-[#7A8C89]">Restore initial demo bookings and clear temporary state.</p>
                </div>
                <button
                  onClick={() => {
                    localStorage.removeItem('amperway_consumer_bookings');
                    setBookings(INITIAL_CONSUMER_BOOKINGS);
                  }}
                  className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 text-xs font-bold transition-all cursor-pointer"
                >
                  Reset Bookings
                </button>
              </div>

            </div>
          </div>
        )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* ======================================================== */}
      {/* MODAL 1: ADD VEHICLE TO GARAGE */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isAddVehicleOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-[#0E2725] rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-[#D9DED5] dark:border-[#1E4844]"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-[#D9DED5] dark:border-[#1E4844] flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#123C3A] dark:text-white">
                    Add Electric Vehicle to Garage
                  </h3>
                  <p className="text-xs text-[#7A8C89] mt-0.5">
                    Select your EV model from the national database.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddVehicleOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Category Selector: 4-Wheeler Car vs 2-Wheeler Scooter */}
              <div className="px-6 pt-4 pb-2 border-b border-[#D9DED5] dark:border-[#1E4844] flex items-center gap-3">
                <button
                  onClick={() => {
                    setVehicleCategoryFilter('4-Wheeler');
                    setSelectedBrand('All');
                  }}
                  className={`flex-1 py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    vehicleCategoryFilter === '4-Wheeler'
                      ? 'bg-[#18C5B7] text-white shadow-glow-teal-sm'
                      : 'bg-[#F8F7F2] dark:bg-[#071715] text-[#5E716E] dark:text-[#88ABA6]'
                  }`}
                >
                  <Car className="w-4 h-4" />
                  <span>Electric Car / SUV (4W)</span>
                </button>

                <button
                  onClick={() => {
                    setVehicleCategoryFilter('2-Wheeler');
                    setSelectedBrand('All');
                  }}
                  className={`flex-1 py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    vehicleCategoryFilter === '2-Wheeler'
                      ? 'bg-[#18C5B7] text-white shadow-glow-teal-sm'
                      : 'bg-[#F8F7F2] dark:bg-[#071715] text-[#5E716E] dark:text-[#88ABA6]'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>Electric Scooter / Bike (2W)</span>
                </button>
              </div>

              {/* Brand Filter Pills */}
              <div className="px-6 py-3 border-b border-[#D9DED5] dark:border-[#1E4844] flex items-center gap-2 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setSelectedBrand('All')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedBrand === 'All'
                      ? 'bg-[#073B35] text-white'
                      : 'bg-[#F8F7F2] dark:bg-[#071715] text-[#7A8C89]'
                  }`}
                >
                  All Brands
                </button>
                {availableBrands.map(b => (
                  <button
                    key={b}
                    onClick={() => setSelectedBrand(b)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      selectedBrand === b
                        ? 'bg-[#073B35] text-white'
                        : 'bg-[#F8F7F2] dark:bg-[#071715] text-[#7A8C89]'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>

              {/* Models List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {filteredVehiclesList.map(vehicle => {
                  const alreadySaved = savedVehicles.some(v => v.id === vehicle.id);

                  return (
                    <div
                      key={vehicle.id}
                      className="p-4 rounded-2xl bg-[#F8F7F2] dark:bg-[#071715] border border-[#D9DED5] dark:border-[#163835] hover:border-[#18C5B7] transition-all flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-[#18C5B7] uppercase tracking-wider">
                            {vehicle.brand}
                          </span>
                          <span className="text-[10px] text-[#7A8C89]">· {vehicle.subType}</span>
                        </div>
                        <h4 className="font-bold text-sm text-[#123C3A] dark:text-white">
                          {vehicle.model}
                        </h4>
                        <div className="mt-1 flex items-center gap-2 text-xs text-[#7A8C89]">
                          <span>{vehicle.batteryKwh} kWh</span>
                          <span>·</span>
                          <span>~{vehicle.realRangeKm} km</span>
                          <span>·</span>
                          <span className="font-mono text-[#18C5B7]">{vehicle.connectors.join(', ')}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddVehicleToGarage(vehicle)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                          alreadySaved
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-[#18C5B7] hover:bg-[#15A896] text-white shadow-glow-teal-sm'
                        }`}
                      >
                        {alreadySaved ? 'In Garage' : 'Add to Garage'}
                      </button>
                    </div>
                  );
                })}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL 2: BOOKING PASS & QR DETAILS */}
      {/* ======================================================== */}
      <AnimatePresence>
        {selectedBookingDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-[#0E2725] rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-[#D9DED5] dark:border-[#1E4844]"
            >
              {/* Header */}
              <div className="bg-[#073B35] text-white p-6 relative">
                <button
                  onClick={() => setSelectedBookingDetails(null)}
                  className="absolute top-4 right-4 text-white/70 hover:text-white p-1 cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-[#18C5B7] text-[10px] font-bold uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Go Charge Charging Pass</span>
                </div>
                <h3 className="text-lg font-bold">{selectedBookingDetails.stationName}</h3>
                <p className="text-xs text-[#A3CCC7] mt-0.5">{selectedBookingDetails.stationAddress}</p>
              </div>

              {/* Pass Content */}
              <div className="p-6 space-y-5">
                {/* QR Code and OTP Section */}
                <div className="text-center p-5 rounded-2xl bg-[#F8F7F2] dark:bg-[#071715] border-2 border-dashed border-[#18C5B7]/40">
                  <div className="w-24 h-24 mx-auto bg-white dark:bg-[#0E2725] p-2 rounded-xl shadow-sm flex items-center justify-center">
                    <QrCode className="w-20 h-20 text-[#123C3A] dark:text-[#18C5B7]" />
                  </div>
                  <p className="text-xs text-[#7A8C89] mt-3">Scan at charger scanner or enter OTP code:</p>
                  <div className="mt-1 inline-block px-4 py-1.5 rounded-xl bg-[#18C5B7]/15 border border-[#18C5B7]/30 text-xl font-mono font-black text-[#123C3A] dark:text-[#18C5B7] tracking-widest">
                    {selectedBookingDetails.otpCode}
                  </div>
                </div>

                {/* Slot Details */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-[#D9DED5] dark:border-[#163835]">
                    <span className="text-[#7A8C89]">Slot Time:</span>
                    <span className="font-bold text-[#123C3A] dark:text-white">{selectedBookingDetails.dateTime}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#D9DED5] dark:border-[#163835]">
                    <span className="text-[#7A8C89]">Connector:</span>
                    <span className="font-bold text-[#123C3A] dark:text-white">{selectedBookingDetails.connectorType} ({selectedBookingDetails.connectorPower})</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#D9DED5] dark:border-[#163835]">
                    <span className="text-[#7A8C89]">Registered EV:</span>
                    <span className="font-bold text-[#123C3A] dark:text-white">{selectedBookingDetails.vehicleModel}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-[#7A8C89]">Estimated Amount:</span>
                    <span className="font-bold text-[#18C5B7]">₹{selectedBookingDetails.amount}</span>
                  </div>
                </div>

                {/* Modal Footer Buttons */}
                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedBookingDetails(null);
                      const st = stations.find(s => s.id === selectedBookingDetails.stationId);
                      if (st) onGetDirections?.(st);
                      else onGoToMap();
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-[#18C5B7] hover:bg-[#15A896] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-glow-teal-sm cursor-pointer"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Get Directions</span>
                  </button>

                  <button
                    onClick={() => setSelectedBookingDetails(null)}
                    className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. MOBILE BOTTOM NAVIGATION (Home, Explore, Bookings, Garage, More) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F8F7F2]/98 dark:bg-[#071715]/98 backdrop-blur-xl border-t border-[#D9DED5] dark:border-[#163835] px-2 py-1 pb-safe flex items-center justify-around shadow-2xl">
        {/* Home */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('overview');
            setMoreMenuOpen(false);
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'overview' && !moreMenuOpen
              ? 'text-[#18C5B7] font-extrabold'
              : 'text-[#5E716E] dark:text-[#88ABA6]'
          }`}
        >
          <Zap className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Home</span>
        </button>

        {/* Explore */}
        <button
          type="button"
          onClick={() => {
            setMoreMenuOpen(false);
            onGoToMap();
          }}
          className="flex-1 flex flex-col items-center justify-center py-1.5 rounded-xl text-[#5E716E] dark:text-[#88ABA6] hover:text-[#18C5B7] transition-colors cursor-pointer"
        >
          <MapPin className="w-5 h-5 mb-0.5 text-[#18C5B7]" />
          <span className="text-[10px]">Explore</span>
        </button>

        {/* Bookings */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('bookings');
            setMoreMenuOpen(false);
          }}
          className={`flex-1 relative flex flex-col items-center justify-center py-1.5 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'bookings' && !moreMenuOpen
              ? 'text-[#18C5B7] font-extrabold'
              : 'text-[#5E716E] dark:text-[#88ABA6]'
          }`}
        >
          <div className="relative">
            <CalendarCheck className="w-5 h-5 mb-0.5" />
            {upcomingBookings.length > 0 && (
              <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-[#18C5B7] text-[#071715] text-[9px] font-extrabold flex items-center justify-center">
                {upcomingBookings.length}
              </span>
            )}
          </div>
          <span className="text-[10px]">Bookings</span>
        </button>

        {/* Garage */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('vehicles');
            setMoreMenuOpen(false);
          }}
          className={`flex-1 relative flex flex-col items-center justify-center py-1.5 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'vehicles' && !moreMenuOpen
              ? 'text-[#18C5B7] font-extrabold'
              : 'text-[#5E716E] dark:text-[#88ABA6]'
          }`}
        >
          <div className="relative">
            <Car className="w-5 h-5 mb-0.5" />
            {savedVehicles.length > 0 && (
              <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-[#18C5B7] text-[#071715] text-[9px] font-extrabold flex items-center justify-center">
                {savedVehicles.length}
              </span>
            )}
          </div>
          <span className="text-[10px]">Garage</span>
        </button>

        {/* More */}
        <button
          type="button"
          onClick={() => setMoreMenuOpen(!moreMenuOpen)}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 rounded-xl transition-colors cursor-pointer ${
            moreMenuOpen || activeTab === 'saved' || activeTab === 'profile' || activeTab === 'settings'
              ? 'text-[#18C5B7] font-extrabold'
              : 'text-[#5E716E] dark:text-[#88ABA6]'
          }`}
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">More</span>
        </button>
      </nav>

      {/* 5. "MORE" MOBILE BOTTOM SHEET */}
      <AnimatePresence>
        {moreMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex items-end">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMoreMenuOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative w-full bg-[#F4F1E8] dark:bg-[#0D2422] rounded-t-3xl border-t border-[#D9DED5] dark:border-[#1E4844] shadow-2xl p-5 pb-safe z-10 max-h-[80dvh] overflow-y-auto"
            >
              <div className="w-12 h-1.5 rounded-full bg-[#B8C2B3] dark:bg-[#1E4844] mx-auto mb-4" />

              <div className="flex items-center justify-between pb-3 border-b border-[#D9DED5] dark:border-[#1E4844]">
                <div>
                  <h3 className="font-extrabold text-sm text-[#123C3A] dark:text-white">More Options</h3>
                  <p className="text-[11px] text-[#5E716E] dark:text-[#8FAFA9]">{user.name} ({user.email || 'Consumer'})</p>
                </div>
                <button
                  type="button"
                  onClick={() => setMoreMenuOpen(false)}
                  className="p-1 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-3 space-y-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('saved');
                    setMoreMenuOpen(false);
                  }}
                  className={`w-full p-3 rounded-xl flex items-center justify-between text-xs font-bold transition-colors cursor-pointer ${
                    activeTab === 'saved'
                      ? 'bg-[#18C5B7] text-white shadow-glow-teal-sm'
                      : 'bg-white dark:bg-[#081B19] text-[#123C3A] dark:text-white border border-[#D9DED5] dark:border-[#1E4844]'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>Saved Chargers</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20">{savedStationsList.length}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('profile');
                    setMoreMenuOpen(false);
                  }}
                  className={`w-full p-3 rounded-xl flex items-center justify-between text-xs font-bold transition-colors cursor-pointer ${
                    activeTab === 'profile'
                      ? 'bg-[#18C5B7] text-white shadow-glow-teal-sm'
                      : 'bg-white dark:bg-[#081B19] text-[#123C3A] dark:text-white border border-[#D9DED5] dark:border-[#1E4844]'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-[#18C5B7]" />
                    <span>My Profile</span>
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('settings');
                    setMoreMenuOpen(false);
                  }}
                  className={`w-full p-3 rounded-xl flex items-center justify-between text-xs font-bold transition-colors cursor-pointer ${
                    activeTab === 'settings'
                      ? 'bg-[#18C5B7] text-white shadow-glow-teal-sm'
                      : 'bg-white dark:bg-[#081B19] text-[#123C3A] dark:text-white border border-[#D9DED5] dark:border-[#1E4844]'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Settings className="w-4 h-4 text-[#18C5B7]" />
                    <span>Account Settings</span>
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>

                {onSwitchToHostDashboard && (
                  <button
                    type="button"
                    onClick={() => {
                      setMoreMenuOpen(false);
                      onSwitchToHostDashboard();
                    }}
                    className="w-full p-3 rounded-xl bg-[#18C5B7]/15 hover:bg-[#18C5B7]/25 text-[#123C3A] dark:text-[#18C5B7] border border-[#18C5B7]/30 flex items-center justify-between text-xs font-bold transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <LayoutDashboard className="w-4 h-4 text-[#18C5B7]" />
                      <span>Switch to Host Portal</span>
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {onLogout && (
                  <button
                    type="button"
                    onClick={() => {
                      setMoreMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 flex items-center justify-between text-xs font-bold transition-colors cursor-pointer mt-2"
                  >
                    <span className="flex items-center gap-2.5">
                      <LogOut className="w-4 h-4" />
                      <span>Log Out of Go Charge</span>
                    </span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
