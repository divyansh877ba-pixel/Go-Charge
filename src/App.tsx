import React, { useState, useMemo, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Station, FilterCategory, SortOption, Connector } from './types';
import { MOCK_STATIONS, calculateDistance, USER_CURRENT_LOCATION } from './data/mockStations';
import { Navbar } from './components/Navbar';
import { ChargingMap } from './components/Map/ChargingMap';
import { FilterBar } from './components/StationList/FilterBar';
import { StationList } from './components/StationList/StationList';
import { StationDetailPage } from './components/DetailPage/StationDetailPage';
import { LandingPage } from './components/LandingPage/LandingPage';
import { AboutUsPage } from './components/About/AboutUsPage';
import { ChargingSessionModal } from './components/Modals/ChargingSessionModal';
import { NavigationDirectionsModal } from './components/Modals/NavigationDirectionsModal';
import { FilterModal } from './components/Modals/FilterModal';
import { BottomSheetPanel } from './components/Mobile/BottomSheetPanel';
import { UndoToast } from './components/UI/UndoToast';
import { useFavorites } from './hooks/useFavorites';
import { useHostMarketplace } from './hooks/useHostMarketplace';
import { OwnerDashboard } from './components/HostDashboard/OwnerDashboard';
import { VehicleSelectorModal } from './components/VehicleSelector/VehicleSelectorModal';
import { TwoWayLoginPage } from './components/Auth/TwoWayLoginPage';
import { ConsumerDashboard } from './components/ConsumerDashboard/ConsumerDashboard';
import { RoleGuardModal } from './components/Auth/RoleGuardModal';
import { useAuth, UserRole, AuthUser } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';
import { AppView } from './components/Navbar';
import { VehicleModel, isStationCompatibleWithVehicle } from './data/vehicles';
import { Language } from './data/translations';
import { Navigation, Zap } from 'lucide-react';
import { fetchStations } from './lib/supabaseService';

export function App() {
  useTheme();
  const [stations, setStations] = useState<Station[]>(MOCK_STATIONS);

  // Load real stations from Supabase database
  useEffect(() => {
    let isMounted = true;
    async function loadDbStations() {
      const dbStations = await fetchStations();
      if (isMounted && dbStations && dbStations.length > 0) {
        setStations((prev) => {
          const dbIds = new Set(dbStations.map((s) => s.id));
          return [...dbStations, ...prev.filter((s) => !dbIds.has(s.id))];
        });
      }
    }
    loadDbStations();
    return () => {
      isMounted = false;
    };
  }, []);
  
  // Two-Way Role-Based Auth Architecture
  const {
    user: authUser,
    setUser: setAuthUser,
    logout: authLogout,
    loading: authLoading
  } = useAuth();

  // Role Mismatch Modal State
  const [roleGuardMismatch, setRoleGuardMismatch] = useState<{
    requiredRole: UserRole;
  } | null>(null);

  // Pre-selected role when navigating to login
  const [loginInitialRole, setLoginInitialRole] = useState<UserRole | null>(null);

  // URL-aware Initial Active View
  const [activeView, setActiveView] = useState<AppView>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('/owner-dashboard') || path.includes('/owner/dashboard') || hash.includes('#owner-dashboard')) {
        return 'owner-dashboard';
      }
      if (path.includes('/consumer') || hash.includes('#consumer-dashboard')) {
        return 'consumer-dashboard';
      }
      if (path.includes('/login') || path.includes('/auth') || hash.includes('#login')) {
        return 'login';
      }
      if (path === '/map' || hash === '#map') {
        return 'map';
      }
      if (path.includes('/about') || hash.includes('#about')) {
        return 'about';
      }
    }
    return 'home';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('All');
  const [sortOption, setSortOption] = useState<SortOption>('distance');
  
  // Requirement 6: Opening the map must NOT automatically open a charger popup
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [detailStation, setDetailStation] = useState<Station | null>(null);

  // Vehicle Discovery & Personalization State (Requirement 3 & 10)
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleModel | null>(() => {
    try {
      const saved = localStorage.getItem('amperway_vehicle');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [onlyCompatible, setOnlyCompatible] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('amperway_only_compatible');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // Language State (Requirement 13)
  const [lang, setLang] = useState<Language>(() => {
    try {
      return (localStorage.getItem('amperway_lang') as Language) || 'en';
    } catch {
      return 'en';
    }
  });

  // Geolocation locating indicator
  const [isLocating, setIsLocating] = useState(false);

  // Modals state
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [directionsStation, setDirectionsStation] = useState<Station | null>(null);
  const [chargingSessionData, setChargingSessionData] = useState<{
    station: Station;
    connector: Connector;
  } | null>(null);

  // Host Marketplace State & Actions (Frontend with LocalStorage Persistence)
  const {
    chargers: hostChargers,
    bookings: hostBookings,
    transactions: hostTransactions,
    profile: hostProfile,
    monthlyEarningsData: hostMonthlyEarnings,
    summaryMetrics: hostSummaryMetrics,
    addCharger: handleAddHostCharger,
    updateCharger: handleUpdateHostCharger,
    toggleChargerPause: handleToggleHostChargerPause,
    deleteCharger: handleDeleteHostCharger,
    updateProfile: handleUpdateHostProfile,
    updateBookingStatus: handleUpdateHostBookingStatus,
    convertToStation,
  } = useHostMarketplace();

  // Optimistic Updates & Undo Toasts (synced with Supabase favorites)
  const { favorites, isFavorite, toggleFavorite, undoToast, dismissUndoToast } = useFavorites(authUser?.id);

  // Search input ref for keyboard shortcut (Ctrl+K)
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Stale-While-Revalidate live indicator
  const [isRevalidating, setIsRevalidating] = useState(false);

  // View Transitions API helper
  const transitionView = (updateFn: () => void) => {
    if (
      typeof document !== 'undefined' &&
      'startViewTransition' in document &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      (document as any).startViewTransition(updateFn);
    } else {
      updateFn();
    }
  };

  const resolveViewFromUrl = (): AppView => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('/owner-dashboard') || path.includes('/owner/dashboard') || hash.includes('#owner-dashboard')) {
        return 'owner-dashboard';
      }
      if (path.includes('/consumer') || hash.includes('#consumer-dashboard')) {
        return 'consumer-dashboard';
      }
      if (path.includes('/login') || path.includes('/auth') || hash.includes('#login')) {
        return 'login';
      }
      if (path === '/map' || hash === '#map') {
        return 'map';
      }
      if (path.includes('/about') || hash.includes('#about')) {
        return 'about';
      }
    }
    return 'home';
  };

  const handleSetActiveView = (view: AppView, forceUrl?: string) => {
    // Role protection checks:
    if (view === 'owner-dashboard') {
      if (!authUser) {
        setLoginInitialRole('charger_owner');
        view = 'login';
      } else if (!authUser.isHost && authUser.role !== 'charger_owner') {
        setRoleGuardMismatch({ requiredRole: 'charger_owner' });
        return;
      } else if (authUser.role !== 'charger_owner') {
        setAuthUser({ ...authUser, role: 'charger_owner' });
      }
    } else if (view === 'consumer-dashboard') {
      if (!authUser) {
        setLoginInitialRole('consumer');
        view = 'login';
      } else if (authUser.role !== 'consumer') {
        setAuthUser({ ...authUser, role: 'consumer' });
      }
    }

    transitionView(() => {
      setActiveView(view);
      if (typeof window !== 'undefined') {
        let targetPath = '/';
        if (forceUrl) {
          targetPath = forceUrl;
        } else if (view === 'owner-dashboard') {
          targetPath = '/owner-dashboard';
        } else if (view === 'consumer-dashboard') {
          targetPath = '/consumer/dashboard';
        } else if (view === 'login') {
          targetPath = '/login';
        } else if (view === 'map') {
          targetPath = '/map';
        } else if (view === 'about') {
          targetPath = '/about';
        } else if (view === 'home') {
          targetPath = '/';
        }
        if (window.location.pathname !== targetPath) {
          window.history.pushState({ view }, '', targetPath);
        }
      }
    });
  };

  // Sync browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const targetView = resolveViewFromUrl();
      setActiveView(targetView);
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const handleAuthSuccess = (loggedUser: AuthUser) => {
    setAuthUser(loggedUser);
    setLoginInitialRole(null);
    setRoleGuardMismatch(null);

    const targetView: AppView = loggedUser.role === 'charger_owner' ? 'owner-dashboard' : 'consumer-dashboard';
    const targetPath = loggedUser.role === 'charger_owner' ? '/owner-dashboard' : '/consumer/dashboard';

    transitionView(() => {
      setActiveView(targetView);
      if (typeof window !== 'undefined') {
        window.history.pushState({ view: targetView }, '', targetPath);
      }
    });
  };

  // Enforce Dashboard Route Protection for unauthenticated visitors and role mismatches
  useEffect(() => {
    if (authLoading) return;
    if (!authUser && (activeView === 'owner-dashboard' || activeView === 'consumer-dashboard')) {
      handleSetActiveView('login', '/login');
    } else if (authUser && activeView === 'owner-dashboard') {
      const isAuthorizedHost = Boolean(authUser.isHost || authUser.role === 'charger_owner');
      if (!isAuthorizedHost) {
        // Consumers cannot access owner dashboard; redirect to consumer dashboard and show RoleGuard
        setRoleGuardMismatch({ requiredRole: 'charger_owner' });
        handleSetActiveView('consumer-dashboard', '/consumer/dashboard');
      }
    }
  }, [authLoading, authUser, activeView]);

  const handleLogout = async () => {
    await authLogout();
    setRoleGuardMismatch(null);
    handleSetActiveView('login', '/login');
  };

  const handleOpenDetailStation = (st: Station) => {
    transitionView(() => setDetailStation(st));
  };

  const handleCloseDetailStation = () => {
    transitionView(() => setDetailStation(null));
  };

  // Vehicle Selection Handler (Persisted)
  const handleSelectVehicle = (vehicle: VehicleModel | null) => {
    setSelectedVehicle(vehicle);
    if (vehicle) {
      setOnlyCompatible(true);
      try {
        localStorage.setItem('amperway_vehicle', JSON.stringify(vehicle));
        localStorage.setItem('amperway_only_compatible', 'true');
      } catch (e) {
        console.error(e);
      }
    } else {
      setOnlyCompatible(false);
      try {
        localStorage.removeItem('amperway_vehicle');
        localStorage.removeItem('amperway_only_compatible');
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleToggleCompatible = () => {
    setOnlyCompatible((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('amperway_only_compatible', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const handleToggleLang = () => {
    const next = lang === 'en' ? 'hi' : 'en';
    setLang(next);
    try {
      localStorage.setItem('amperway_lang', next);
    } catch (e) {
      console.error(e);
    }
  };


  const handleSearchWithVehicle = (query: string, vehicle: VehicleModel | null) => {
    if (vehicle) {
      handleSelectVehicle(vehicle);
    }
    if (query) {
      setSearchQuery(query);
    }
    handleSetActiveView('map');
  };

  const handleDetectLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          handleSetActiveView('map');
        },
        () => {
          // Fallback to Delhi default
          setIsLocating(false);
          handleSetActiveView('map');
        },
        { timeout: 5000 }
      );
    } else {
      setIsLocating(false);
      handleSetActiveView('map');
    }
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      // Escape: dismiss modals or detail view
      if (e.key === 'Escape') {
        if (chargingSessionData) {
          setChargingSessionData(null);
        } else if (directionsStation) {
          setDirectionsStation(null);
        } else if (isVehicleModalOpen) {
          setIsVehicleModalOpen(false);
        } else if (isFilterModalOpen) {
          setIsFilterModalOpen(false);
        } else if (detailStation) {
          handleCloseDetailStation();
        }
        return;
      }

      // Ctrl+K / Cmd+K or '/' to focus search
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (!isInput && e.key === '/')) {
        e.preventDefault();
        if (activeView !== 'map') {
          transitionView(() => setActiveView('map'));
        }
        if (detailStation) {
          transitionView(() => setDetailStation(null));
        }
        setTimeout(() => {
          searchInputRef.current?.focus();
          searchInputRef.current?.select();
        }, 50);
        return;
      }

      // 'f' or 'F' to toggle filters when not typing
      if (!isInput && (e.key === 'f' || e.key === 'F')) {
        e.preventDefault();
        setIsFilterModalOpen((prev) => !prev);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    chargingSessionData,
    directionsStation,
    isVehicleModalOpen,
    isFilterModalOpen,
    detailStation,
    activeView,
  ]);

  // Stale-While-Revalidate: Revalidate discovery data on window focus and reconnect
  useEffect(() => {
    const revalidateDiscovery = () => {
      setIsRevalidating(true);
      const timer = setTimeout(() => {
        setIsRevalidating(false);
      }, 700);
      return () => clearTimeout(timer);
    };

    window.addEventListener('focus', revalidateDiscovery);
    window.addEventListener('online', revalidateDiscovery);
    return () => {
      window.removeEventListener('focus', revalidateDiscovery);
      window.removeEventListener('online', revalidateDiscovery);
    };
  }, []);

  // Filter and Search Logic
  const filteredStations = useMemo(() => {
    return stations
      .filter((station) => {
        // 1. Text Search Filter (name, area, city, pincode, operator, fullAddress, or connectors)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = station.name.toLowerCase().includes(q);
          const matchArea = station.area.toLowerCase().includes(q);
          const matchCity = station.city?.toLowerCase().includes(q) || false;
          const matchPincode = station.pincode?.includes(q) || false;
          const matchOperator = station.operator.toLowerCase().includes(q);
          const matchAddress = station.fullAddress.toLowerCase().includes(q);
          const matchConnectors = station.primaryConnectors.some((c) =>
            c.toLowerCase().includes(q)
          );
          if (!matchName && !matchArea && !matchCity && !matchPincode && !matchOperator && !matchAddress && !matchConnectors) {
            return false;
          }
        }

        // 2. Vehicle Compatibility Filter (When enabled and a vehicle is selected)
        if (onlyCompatible && selectedVehicle) {
          const isComp = isStationCompatibleWithVehicle(station.primaryConnectors, selectedVehicle);
          if (!isComp) return false;
        }

        // 3. Category Filter
        switch (activeFilter) {
          case 'All':
            return true;
          case 'Compatible with my vehicle':
            if (selectedVehicle) {
              return isStationCompatibleWithVehicle(station.primaryConnectors, selectedVehicle);
            }
            return true;
          case '4-Wheeler':
            return station.vehicleTypes.includes('4-Wheeler');
          case '2-Wheeler':
            return station.vehicleTypes.includes('2-Wheeler');
          case 'AC':
            return (
              station.powerSpeed.toLowerCase().includes('ac') ||
              station.primaryConnectors.some((c) => c.includes('Type-2') || c.includes('Bharat AC') || c.includes('16A'))
            );
          case 'DC':
            return (
              station.powerSpeed.toLowerCase().includes('dc') ||
              station.primaryConnectors.some((c) => c.includes('CCS2') || c.includes('LECCS') || c.includes('Hypercharger') || c.includes('Bharat DC'))
            );
          case 'Type-2':
            return station.primaryConnectors.includes('Type-2');
          case 'CCS2':
            return station.primaryConnectors.includes('CCS2');
          case 'Bharat AC':
            return station.primaryConnectors.some((c) => c.toLowerCase().includes('bharat ac'));
          case 'LECCS':
            return station.primaryConnectors.some((c) => c.toUpperCase().includes('LECCS') || c.includes('Type 7') || c.includes('Hypercharger'));
          case 'Fast Charge 50kW+':
            return (
              station.connectors.some((c) => c.powerKw >= 50) ||
              station.powerSpeed.includes('50 kW') ||
              station.powerSpeed.includes('60 kW') ||
              station.powerSpeed.includes('120 kW') ||
              station.powerSpeed.includes('150 kW')
            );
          case 'Available Now':
            return station.status === 'available' || station.availablePorts > 0;
          default:
            return true;
        }
      })
      .sort((a, b) => {
        if (sortOption === 'distance') {
          const distA = calculateDistance(
            USER_CURRENT_LOCATION.lat,
            USER_CURRENT_LOCATION.lng,
            a.lat,
            a.lng
          );
          const distB = calculateDistance(
            USER_CURRENT_LOCATION.lat,
            USER_CURRENT_LOCATION.lng,
            b.lat,
            b.lng
          );
          return distA - distB;
        } else if (sortOption === 'rating') {
          return b.rating - a.rating;
        } else if (sortOption === 'price') {
          return a.pricePerKwh - b.pricePerKwh;
        } else if (sortOption === 'speed') {
          const maxPowerA = Math.max(...a.connectors.map((c) => c.powerKw));
          const maxPowerB = Math.max(...b.connectors.map((c) => c.powerKw));
          return maxPowerB - maxPowerA;
        }
        return 0;
      });
  }, [stations, searchQuery, activeFilter, sortOption, onlyCompatible, selectedVehicle]);

  const handleAddNewStation = (newStation: Station) => {
    setStations((prev) => [newStation, ...prev]);
    setSelectedStation(newStation);
  };

  // Sync Host Chargers to Customer Discovery Stations
  useEffect(() => {
    if (hostChargers && hostChargers.length > 0) {
      setStations((prev) => {
        const existingIds = new Set(prev.map((s) => s.id));
        const newStationsFromHost = hostChargers
          .filter((c) => !existingIds.has(c.id) && c.status === 'active')
          .map((c) => convertToStation(c));
        return newStationsFromHost.length > 0 ? [...newStationsFromHost, ...prev] : prev;
      });
    }
  }, [hostChargers, convertToStation]);

  const handleLocateUser = () => {
    if (filteredStations.length > 0) {
      setSelectedStation(filteredStations[0]);
    }
  };

  const currentViewKey = detailStation ? `detail-${detailStation.id}` : activeView;

  // Premium cubic-bezier page motion specification
  const pageMotion = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: -6, transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <div className={`relative min-h-screen bg-[#F4F1E8] dark:bg-[#071715] text-[#14201F] dark:text-[#E4EFEA] font-sans transition-colors duration-300 ${
      activeView === 'owner-dashboard' && authUser?.role === 'charger_owner' ? 'h-[100dvh] overflow-hidden' : 'overflow-x-hidden'
    }`}>

      {/* Sticky Top Navbar (Interactive & elevated above map/controls) */}
      {!detailStation && activeView !== 'owner-dashboard' && activeView !== 'consumer-dashboard' && activeView !== 'login' && (
        <Navbar
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            if (activeView !== 'map' && q.trim().length > 0) {
              handleSetActiveView('map');
            }
            if (q.trim().length >= 2) {
              const matched = stations.find(s => 
                s.name.toLowerCase().includes(q.toLowerCase()) ||
                s.area.toLowerCase().includes(q.toLowerCase()) ||
                s.fullAddress.toLowerCase().includes(q.toLowerCase())
              );
              if (matched) {
                setSelectedStation(matched);
              }
            }
          }}
          activeView={activeView}
          setActiveView={handleSetActiveView}
          onOpenFilterModal={() => setIsFilterModalOpen(true)}
          onLocateUser={handleLocateUser}
          totalStations={stations.length}
          searchInputRef={searchInputRef}
          selectedVehicle={selectedVehicle}
          onOpenVehicleModal={() => setIsVehicleModalOpen(true)}
          onOpenAuthModal={() => handleSetActiveView('login')}
          authUser={authUser}
          onLogout={handleLogout}
          lang={lang}
          onToggleLang={handleToggleLang}
        />
      )}

      {/* Page Transitions Orchestrator */}
      {authLoading ? (
        <div className="min-h-screen bg-[#F4F1E8] dark:bg-[#071715] flex flex-col items-center justify-center text-[#123C3A] dark:text-[#E4EFEA] gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#19C7B1]/20 flex items-center justify-center animate-pulse">
            <Zap className="w-6 h-6 text-[#19C7B1]" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-extrabold tracking-tight">Go Charge</span>
            <span className="text-xs text-[#5E716E] dark:text-[#8FAFA9]">Verifying Supabase session...</span>
          </div>
        </div>
      ) : (
        <AnimatePresence mode="wait">
        {detailStation ? (
          <motion.div
            key={currentViewKey}
            variants={pageMotion}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <StationDetailPage
              station={detailStation}
              onBack={handleCloseDetailStation}
              onGetDirections={(st) => setDirectionsStation(st)}
              onStartCharging={(st, conn) => setChargingSessionData({ station: st, connector: conn })}
              isFavorite={isFavorite(detailStation.id)}
              onToggleFavorite={toggleFavorite}
              selectedVehicle={selectedVehicle}
              onOpenVehicleModal={() => setIsVehicleModalOpen(true)}
            />
          </motion.div>
        ) : activeView === 'login' ? (
          <motion.div
            key="login-view"
            variants={pageMotion}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <TwoWayLoginPage
              initialRole={loginInitialRole}
              onSuccess={handleAuthSuccess}
              onCancel={() => handleSetActiveView('home')}
            />
          </motion.div>
        ) : activeView === 'consumer-dashboard' ? (
          <motion.div
            key="consumer-dashboard-view"
            variants={pageMotion}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {authUser ? (
              <ConsumerDashboard
                user={authUser}
                onLogout={handleLogout}
                onGoToMap={() => handleSetActiveView('map')}
                onSelectStationDetails={handleOpenDetailStation}
                onGetDirections={(st) => setDirectionsStation(st)}
                onStartCharging={(st, conn) => setChargingSessionData({ station: st, connector: conn })}
                stations={stations}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                selectedVehicle={selectedVehicle}
                onSelectVehicle={handleSelectVehicle}
                onSwitchToHostDashboard={authUser.isHost ? () => handleSetActiveView('owner-dashboard', '/owner-dashboard') : undefined}
              />
            ) : (
              <TwoWayLoginPage
                initialRole="consumer"
                onSuccess={handleAuthSuccess}
                onCancel={() => handleSetActiveView('home')}
              />
            )}
          </motion.div>
        ) : activeView === 'owner-dashboard' ? (
          <motion.div
            key="owner-dashboard-view"
            variants={pageMotion}
            initial="initial"
            animate="animate"
            exit="exit"
            className={authUser && (authUser.isHost || authUser.role === 'charger_owner') ? "h-[100dvh] w-full overflow-hidden" : ""}
          >
            {authUser && (authUser.isHost || authUser.role === 'charger_owner') ? (
              <OwnerDashboard
                chargers={hostChargers}
                bookings={hostBookings}
                transactions={hostTransactions}
                profile={hostProfile}
                monthlyEarningsData={hostMonthlyEarnings}
                summaryMetrics={hostSummaryMetrics}
                onAddCharger={handleAddHostCharger}
                onUpdateCharger={handleUpdateHostCharger}
                onTogglePause={handleToggleHostChargerPause}
                onDeleteCharger={handleDeleteHostCharger}
                onUpdateProfile={handleUpdateHostProfile}
                onUpdateBookingStatus={handleUpdateHostBookingStatus}
                onReturnToMap={() => handleSetActiveView('map')}
                onGoToConsumerDashboard={() => handleSetActiveView('consumer-dashboard', '/consumer/dashboard')}
                onLogout={handleLogout}
              />
            ) : (
              <TwoWayLoginPage
                initialRole="charger_owner"
                onSuccess={handleAuthSuccess}
                onCancel={() => handleSetActiveView('home')}
              />
            )}
          </motion.div>
        ) : activeView === 'about' ? (
          <motion.div
            key="about-view"
            variants={pageMotion}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <AboutUsPage
              onGoToHome={() => handleSetActiveView('home')}
              onGoToMap={() => handleSetActiveView('map')}
              onOpenHostDashboard={() => handleSetActiveView('owner-dashboard')}
              lang={lang}
            />
          </motion.div>
        ) : activeView === 'home' ? (
          <motion.div
            key="home-view"
            variants={pageMotion}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="pt-16 sm:pt-20">
              <LandingPage
                onGoToMap={() => handleSetActiveView('map')}
                onOpenHostDashboard={() => handleSetActiveView('owner-dashboard')}
                onNavigateToAbout={() => handleSetActiveView('about')}
                selectedVehicle={selectedVehicle}
                onSelectVehicle={handleSelectVehicle}
                onOpenVehicleModal={() => setIsVehicleModalOpen(true)}
                onSearchWithVehicle={handleSearchWithVehicle}
                onDetectLocation={handleDetectLocation}
                isLocating={isLocating}
                lang={lang}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="map-view"
            variants={pageMotion}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col h-[100dvh] w-full overflow-hidden"
          >
            {/* Main Layout Container */}
            <div className="flex-1 flex flex-col md:flex-row pt-[56px] sm:pt-[70px] h-[calc(100dvh-56px)] sm:h-[calc(100dvh-70px)] overflow-hidden relative">
              
              {/* Map Section */}
              <div className="relative w-full md:w-[65%] h-full">
                <ChargingMap
                  stations={filteredStations}
                  selectedStation={selectedStation}
                  onSelectStation={(st) => setSelectedStation(st)}
                  onViewStationDetails={handleOpenDetailStation}
                  onGetDirections={(st) => setDirectionsStation(st)}
                />

                {/* Mobile "Navigate" FAB Button */}
                {selectedStation && (
                  <button
                    onClick={() => setDirectionsStation(selectedStation)}
                    className="md:hidden fixed bottom-52 right-4 z-40 px-3.5 py-2.5 rounded-pill bg-[#19C7B1] hover:bg-[#123C3A] text-white font-bold text-xs shadow-glow-teal flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                  >
                    <Navigation className="w-4 h-4 fill-white" />
                    <span>Navigate ({calculateDistance(USER_CURRENT_LOCATION.lat, USER_CURRENT_LOCATION.lng, selectedStation.lat, selectedStation.lng)} km)</span>
                  </button>
                )}
              </div>

              {/* 35% Sidebar / Panel (Desktop) */}
              <div className="hidden md:flex md:w-[35%] h-full flex-col bg-[#F4F1E8] dark:bg-[#071715] border-l border-[#D9DED5] dark:border-[#163835] z-20 transition-colors">
                {/* TOP: Filter Bar */}
                <FilterBar
                  activeFilter={activeFilter}
                  onSelectFilter={setActiveFilter}
                  selectedVehicle={selectedVehicle}
                  onlyCompatible={onlyCompatible}
                  onToggleCompatible={handleToggleCompatible}
                  onOpenVehicleModal={() => setIsVehicleModalOpen(true)}
                  onOpenFilterModal={() => setIsFilterModalOpen(true)}
                  onResetFilters={() => {
                    setActiveFilter('All');
                    setOnlyCompatible(false);
                  }}
                />

                {/* MIDDLE: Station List & BOTTOM: Sticky CTA */}
                <div className="flex-1 overflow-hidden">
                  <StationList
                    stations={filteredStations}
                    selectedStation={selectedStation}
                    onSelectStation={(st) => setSelectedStation(st)}
                    onViewStationDetails={handleOpenDetailStation}
                    onGetDirections={(st) => setDirectionsStation(st)}
                    sortOption={sortOption}
                    onSortChange={setSortOption}
                    isFavorite={isFavorite}
                    onToggleFavorite={toggleFavorite}
                    isLoading={isRevalidating}
                  />
                </div>
              </div>

              {/* Mobile Bottom Sheet Panel */}
              <BottomSheetPanel
                stations={filteredStations}
                selectedStation={selectedStation}
                onSelectStation={(st) => setSelectedStation(st)}
                onViewStationDetails={handleOpenDetailStation}
                onGetDirections={(st) => setDirectionsStation(st)}
                sortOption={sortOption}
                onSortChange={setSortOption}
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
              />

            </div>

          </motion.div>
        )}
      </AnimatePresence>
      )}

      {/* Vehicle Selection Modal (3 Steps) */}
      <VehicleSelectorModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        selectedVehicle={selectedVehicle}
        onSelectVehicle={handleSelectVehicle}
        onApplyFilter={() => {
          setIsVehicleModalOpen(false);
          if (activeView !== 'map') {
            handleSetActiveView('map');
          }
        }}
      />


      {/* Role-Based Guard Mismatch Interceptor Modal */}
      {roleGuardMismatch && authUser && (
        <RoleGuardModal
          isOpen={Boolean(roleGuardMismatch)}
          currentUser={authUser}
          requiredRole={roleGuardMismatch.requiredRole}
          onSwitchAccount={() => {
            const req = roleGuardMismatch.requiredRole;
            setRoleGuardMismatch(null);
            authLogout();
            setLoginInitialRole(req);
            handleSetActiveView('login');
          }}
          onGoToOwnDashboard={() => {
            const ownView = authUser.role === 'charger_owner' ? 'owner-dashboard' : 'consumer-dashboard';
            setRoleGuardMismatch(null);
            handleSetActiveView(ownView);
          }}
          onClose={() => {
            setRoleGuardMismatch(null);
          }}
        />
      )}

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        activeFilter={activeFilter}
        onSelectFilter={setActiveFilter}
        onReset={() => {
          setActiveFilter('All');
          setOnlyCompatible(false);
        }}
        selectedVehicle={selectedVehicle}
        onlyCompatible={onlyCompatible}
        onToggleCompatible={handleToggleCompatible}
        onOpenVehicleModal={() => setIsVehicleModalOpen(true)}
      />

      {directionsStation && (
        <NavigationDirectionsModal
          isOpen={Boolean(directionsStation)}
          onClose={() => setDirectionsStation(null)}
          station={directionsStation}
        />
      )}

      {chargingSessionData && (
        <ChargingSessionModal
          isOpen={Boolean(chargingSessionData)}
          onClose={() => setChargingSessionData(null)}
          station={chargingSessionData.station}
          connector={chargingSessionData.connector}
        />
      )}

      {/* Accessible Undo Toast Notification (role="status") */}
      <UndoToast toast={undoToast} onDismiss={dismissUndoToast} />

    </div>
  );
}

export default App;
