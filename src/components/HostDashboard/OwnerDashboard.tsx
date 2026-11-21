import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, LayoutDashboard, BatteryCharging, CalendarCheck, 
  TrendingUp, User, PlusCircle, ArrowLeft, ShieldCheck, 
  Menu, X, ExternalLink, Bell, Sparkles, HelpCircle,
  BarChart3, Star, Settings, Search, MapPin, ChevronDown, CheckCheck,
  Sun, Moon, LogOut
} from 'lucide-react';
import { 
  HostCharger, 
  HostBooking, 
  HostProfile, 
  DashboardTab, 
  BookingStatus,
  HostNotification 
} from '../../types/host';
import { useTheme } from '../../hooks/useTheme';
import { DashboardOverview } from './DashboardOverview';
import { MyChargersTab } from './MyChargersTab';
import { BookingsTab } from './BookingsTab';
import { EarningsTab } from './EarningsTab';
import { AnalyticsTab } from './AnalyticsTab';
import { ReviewsTab } from './ReviewsTab';
import { SettingsTab } from './SettingsTab';
import { HostProfileTab } from './HostProfileTab';
import { ChargerRegistrationModal } from './ChargerRegistrationModal';
import { ChargerDetailsModal } from './ChargerDetailsModal';
import { EditChargerModal } from './EditChargerModal';
import { NotificationPanel } from './NotificationPanel';
import { INITIAL_HOST_NOTIFICATIONS } from '../../data/mockHostData';

interface OwnerDashboardProps {
  chargers: HostCharger[];
  bookings: HostBooking[];
  transactions: any[];
  profile: HostProfile;
  monthlyEarningsData: any[];
  summaryMetrics: {
    totalChargers: number;
    activeListings: number;
    pendingApproval: number;
    pausedListings: number;
    totalBookings: number;
    totalEarnings: number;
    monthlyEarnings: number;
    pendingPayouts: number;
  };
  onAddCharger: (chargerData: any) => HostCharger;
  onUpdateCharger: (id: string, updates: Partial<HostCharger>) => void;
  onTogglePause: (id: string) => void;
  onDeleteCharger: (id: string) => void;
  onUpdateProfile: (updates: Partial<HostProfile>) => void;
  onUpdateBookingStatus: (id: string, status: BookingStatus) => void;
  onReturnToMap: () => void;
  onGoToConsumerDashboard?: () => void;
  onLogout?: () => void;
  initialTab?: DashboardTab;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  chargers,
  bookings,
  transactions,
  profile,
  monthlyEarningsData,
  summaryMetrics,
  onAddCharger,
  onUpdateCharger,
  onTogglePause,
  onDeleteCharger,
  onUpdateProfile,
  onUpdateBookingStatus,
  onReturnToMap,
  onGoToConsumerDashboard,
  onLogout,
  initialTab = 'overview',
}) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>(initialTab);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [detailsCharger, setDetailsCharger] = useState<HostCharger | null>(null);
  const [editingCharger, setEditingCharger] = useState<HostCharger | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);

  // Theme Hook (Persistent Light / Dark Mode)
  const { isDark, toggleTheme } = useTheme();

  // Header State
  const [selectedLocation, setSelectedLocation] = useState('Delhi NCR');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Notification State
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<HostNotification[]>(INITIAL_HOST_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Main scrollable content reference
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Prevent document-level scrolling while Host Dashboard is active
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleSelectNotification = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Sidebar navigation items matching user requirements:
  // Dashboard, My Chargers, Add Charger, Bookings, Earnings, Analytics, Reviews, Profile, Settings
  const navItems: { id: DashboardTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'chargers', label: 'My Chargers', icon: BatteryCharging, badge: chargers.length },
    { id: 'add', label: 'Add Charger', icon: PlusCircle },
    { id: 'bookings', label: 'Bookings', icon: CalendarCheck, badge: bookings.filter(b => b.status === 'upcoming').length },
    { id: 'earnings', label: 'Earnings', icon: TrendingUp },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleTabSelect = (tab: DashboardTab) => {
    if (tab === 'add') {
      setIsAddModalOpen(true);
    } else {
      setActiveTab(tab);
      mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setMobileSidebarOpen(false);
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'overview':
        return 'Dashboard';
      case 'chargers':
        return 'My Chargers';
      case 'bookings':
        return 'Bookings';
      case 'earnings':
        return 'Earnings & Settlements';
      case 'analytics':
        return 'Analytics & Telemetry';
      case 'reviews':
        return 'Driver Reviews';
      case 'profile':
        return 'Host Profile';
      case 'settings':
        return 'Host Settings';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="host-dashboard-shell h-[100dvh] w-full overflow-hidden flex flex-col font-sans selection:bg-[#18C5B7]/30 text-gray-900 dark:text-[#E4EFEA] bg-[#F8F7F2] dark:bg-[#071715] transition-colors duration-300">
      
      <div className="flex-1 flex w-full h-[100dvh] overflow-hidden">
        
        {/* ======================================================== */}
        {/* 1. LEFT SIDEBAR (DEEP FOREST GREEN #073B35) */}
        {/* Desktop Fixed Sidebar */}
        {/* ======================================================== */}
        <aside className="host-sidebar hidden lg:flex flex-col w-64 bg-[#073B35] dark:bg-[#041D1A] text-white flex-shrink-0 h-[100dvh] border-r border-[#094740] dark:border-[#0E3531] shadow-xl justify-between p-5 sticky top-0 overflow-y-auto overflow-x-hidden overscroll-y-contain transition-colors">
          
          <div className="space-y-6">
            
            {/* Go Charge Brand Logo at Top */}
            <div className="flex items-center gap-3 px-2 py-1">
              <div className="w-9 h-9 rounded-xl bg-[#18C5B7] flex items-center justify-center text-[#073B35] shadow-lg shadow-[#18C5B7]/20 flex-shrink-0">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold tracking-tight text-lg text-white">Go Charge</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#18C5B7]/20 text-[#18C5B7] text-[10px] font-bold uppercase tracking-wider border border-[#18C5B7]/30">
                    Host
                  </span>
                </div>
                <span className="text-[11px] text-[#A3CCC7] font-medium">Community EV Network</span>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleTabSelect(item.id)}
                    className={`relative w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors duration-200 group cursor-pointer ${
                      isActive
                        ? 'text-[#073B35] font-bold'
                        : 'text-[#E0EFEA] hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeHostNavTab"
                        className="absolute inset-0 bg-[#18C5B7] rounded-xl shadow-md shadow-[#18C5B7]/25"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      />
                    )}
                    <div className="relative z-10 flex items-center gap-3">
                      <Icon className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-[#073B35]' : 'text-[#87B8B1] group-hover:text-white'
                      }`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`relative z-10 text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-[#073B35] text-white' : 'bg-white/20 text-[#E0EFEA]'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

          </div>

          {/* Bottom Sidebar: User Pill & Domain Info */}
          <div className="pt-6 border-t border-white/10 space-y-3">
            
            {/* User Profile Card */}
            <div 
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
            >
              <div className="relative">
                <img
                  src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                  alt={profile.name}
                  className="w-9 h-9 rounded-xl object-cover ring-2 ring-[#18C5B7]/50"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#073B35]" />
              </div>
              <div className="min-w-0 flex-1">
                <h5 className="font-bold text-xs text-white truncate group-hover:text-[#18C5B7] transition-colors">
                  {profile.name}
                </h5>
                <p className="text-[11px] text-[#A3CCC7] truncate font-mono">Host ID #4492</p>
              </div>
            </div>

            {/* Back to Driver Map Button */}
            <button
              type="button"
              onClick={onReturnToMap}
              className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all border border-white/10 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#18C5B7]" />
              <span>Back to Driver Map</span>
            </button>

            {/* Consumer Dashboard Button for Dual-Role Switch */}
            {onGoToConsumerDashboard && (
              <button
                type="button"
                onClick={onGoToConsumerDashboard}
                className="w-full py-2 px-3 rounded-xl bg-[#18C5B7]/15 hover:bg-[#18C5B7]/25 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all border border-[#18C5B7]/30 cursor-pointer active:scale-95"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#18C5B7]" />
                <span>Consumer Dashboard</span>
              </button>
            )}

            {/* Owner Logout Button */}
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="w-full py-2 px-3 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all border border-red-500/20 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span>Log Out of Host Account</span>
              </button>
            )}

            {/* Sub-footer pill matching gocharge tag */}
            <div className="text-center pt-1">
              <span className="inline-block px-3 py-1 rounded-full bg-white/5 text-[10px] font-mono text-[#87B8B1]">
                gocharge.in/owner
              </span>
            </div>

          </div>

        </aside>

        {/* ======================================================== */}
        {/* MOBILE SIDEBAR OVERLAY */}
        {/* ======================================================== */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative w-72 bg-[#073B35] text-white p-5 flex flex-col justify-between h-full z-10 shadow-2xl overflow-y-auto max-h-[100dvh] pb-safe">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#18C5B7] flex items-center justify-center text-[#073B35]">
                      <Zap className="w-4 h-4 fill-current" />
                    </div>
                    <span className="font-extrabold text-white text-base">Go Charge Host</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1.5 rounded-lg text-white/70 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleTabSelect(item.id)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                          isActive
                            ? 'bg-[#18C5B7] text-[#073B35] font-bold shadow'
                            : 'text-[#E0EFEA] hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            isActive ? 'bg-[#073B35] text-white' : 'bg-white/20'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-2">
                <button
                  type="button"
                  onClick={onReturnToMap}
                  className="w-full py-2 px-3 rounded-xl bg-white/10 text-white text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-[#18C5B7]" />
                  <span>Return to Driver Map</span>
                </button>

                {onGoToConsumerDashboard && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileSidebarOpen(false);
                      onGoToConsumerDashboard();
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-[#18C5B7]/20 text-white text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-[#18C5B7]" />
                    <span>Consumer Dashboard</span>
                  </button>
                )}

                {onLogout && (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="w-full py-2 px-3 rounded-xl bg-red-500/15 text-red-300 text-xs font-semibold flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-400" />
                    <span>Log Out</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. MAIN CONTENT WRAPPER */}
        {/* Header + Body on Cream / Dark Background */}
        {/* ======================================================== */}
        <div ref={mainContentRef} className="host-main-content flex-1 min-w-0 h-[100dvh] flex flex-col overflow-y-auto overflow-x-hidden overscroll-y-contain">
          
          {/* Top SaaS Header Bar */}
          <header className="sticky top-0 z-30 flex-shrink-0 bg-[#F8F7F2]/90 dark:bg-[#071715]/95 backdrop-blur-md border-b border-gray-200/60 dark:border-[#163835] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 transition-colors">
            
            {/* Left: Mobile hamburger + Heading */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-white dark:bg-[#0E2725] border border-gray-200 dark:border-[#1C4642] text-gray-700 dark:text-gray-200 shadow-sm cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  {getPageTitle()}
                </h1>
              </div>
            </div>

            {/* Right: Controls (Search, Location, Timeframe, Theme Toggle, Notification, Add Charger, Profile) */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Search Chargers Input (hidden on mobile, visible on tablet/desktop) */}
              <div className="hidden md:flex relative items-center w-52 lg:w-64">
                <Search className="w-4 h-4 text-gray-400 dark:text-[#648782] absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search chargers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-white dark:bg-[#0E2725] border border-gray-200 dark:border-[#1C4642] text-gray-900 dark:text-[#D5EAE5] placeholder-gray-400 dark:placeholder-[#648782] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#18C5B7] focus:border-transparent transition-all shadow-sm"
                />
              </div>

              {/* Location Selector (Defaulting to Delhi as requested!) */}
              <div className="relative">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="appearance-none bg-white dark:bg-[#0E2725] border border-gray-200 dark:border-[#1C4642] text-gray-700 dark:text-[#D5EAE5] text-xs font-semibold py-1.5 pl-7 pr-7 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#18C5B7] shadow-sm cursor-pointer"
                >
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Pune">Pune</option>
                </select>
                <MapPin className="w-3.5 h-3.5 text-[#18C5B7] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 dark:text-[#648782] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Timeframe Filter (Matching reference image: "30 days") */}
              <div className="relative hidden sm:block">
                <select
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value as any)}
                  className="appearance-none bg-white dark:bg-[#0E2725] border border-gray-200 dark:border-[#1C4642] text-gray-700 dark:text-[#D5EAE5] text-xs font-semibold py-1.5 pl-3 pr-7 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#18C5B7] shadow-sm cursor-pointer"
                >
                  <option value="7d">7 days</option>
                  <option value="30d">30 days</option>
                  <option value="90d">90 days</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 dark:text-[#648782] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Theme Toggle Button (Light / Dark) */}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-white dark:bg-[#0E2725] border border-gray-200 dark:border-[#1C4642] text-gray-600 dark:text-[#18C5B7] hover:text-gray-900 dark:hover:text-white shadow-sm transition-all cursor-pointer hover:scale-105 active:scale-95"
                title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
                aria-label="Toggle Dark Theme"
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-[#18C5B7] animate-in spin-in-180 duration-300" />
                ) : (
                  <Moon className="w-4 h-4 text-gray-600 hover:text-[#073B35] transition-colors" />
                )}
              </button>

              {/* Notification Bell with Panel Flyout */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="p-2 rounded-xl bg-white dark:bg-[#0E2725] border border-gray-200 dark:border-[#1C4642] text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white shadow-sm relative transition-all cursor-pointer"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#18C5B7] text-[#073B35] font-black text-[9px] flex items-center justify-center shadow">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <NotificationPanel
                  notifications={notifications}
                  isOpen={isNotificationOpen}
                  onClose={() => setIsNotificationOpen(false)}
                  onMarkAllAsRead={handleMarkAllAsRead}
                  onSelectNotification={handleSelectNotification}
                />
              </div>

              {/* Add New Charger Button */}
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#18C5B7] text-[#073B35] font-bold text-xs hover:bg-[#15b2a5] transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Charger</span>
              </button>

              {/* User Avatar with Host Badge */}
              <div 
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-2 pl-1 cursor-pointer group"
                title="View Profile"
              >
                <div className="relative">
                  <img
                    src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={profile.name}
                    className="w-8 h-8 rounded-xl object-cover ring-2 ring-[#18C5B7]/40 shadow-sm"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />
                </div>
              </div>

              {/* Header Logout Button */}
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  title="Log Out of Host Account"
                  className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 transition-all cursor-pointer ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}

            </div>

          </header>

          {/* Main Body View Container */}
          <main className="flex-1 p-3.5 sm:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              >
                {activeTab === 'overview' && (
                  <DashboardOverview
                    chargers={chargers}
                    bookings={bookings}
                    summaryMetrics={summaryMetrics}
                    onNavigateTab={(tab) => setActiveTab(tab)}
                    onOpenAddCharger={() => setIsAddModalOpen(true)}
                    onViewChargerDetails={(charger) => setDetailsCharger(charger)}
                    onTogglePause={onTogglePause}
                    onEditCharger={(charger) => setEditingCharger(charger)}
                    selectedLocation={selectedLocation}
                    selectedTimeframe={selectedTimeframe}
                    onSelectLocation={setSelectedLocation}
                    onSelectTimeframe={setSelectedTimeframe}
                  />
                )}

                {activeTab === 'chargers' && (
                  <MyChargersTab
                    chargers={chargers}
                    onOpenAddCharger={() => setIsAddModalOpen(true)}
                    onViewDetails={(charger) => setDetailsCharger(charger)}
                    onEditCharger={(charger) => setEditingCharger(charger)}
                    onTogglePause={onTogglePause}
                    onDeleteCharger={onDeleteCharger}
                  />
                )}

                {activeTab === 'bookings' && (
                  <BookingsTab
                    bookings={bookings}
                    onUpdateStatus={onUpdateBookingStatus}
                  />
                )}

                {activeTab === 'earnings' && (
                  <EarningsTab
                    transactions={transactions}
                    monthlyData={monthlyEarningsData}
                    summaryMetrics={{
                      totalEarnings: summaryMetrics.totalEarnings,
                      monthlyEarnings: summaryMetrics.monthlyEarnings,
                      pendingPayouts: summaryMetrics.pendingPayouts,
                    }}
                  />
                )}

                {activeTab === 'analytics' && (
                  <AnalyticsTab />
                )}

                {activeTab === 'reviews' && (
                  <ReviewsTab />
                )}

                {activeTab === 'profile' && (
                  <HostProfileTab
                    profile={profile}
                    onUpdateProfile={onUpdateProfile}
                  />
                )}

                {activeTab === 'settings' && (
                  <SettingsTab />
                )}
              </motion.div>
            </AnimatePresence>
          </main>

        </div>

      </div>

      {/* Host Mobile Bottom Navigation (Overview, Chargers, Bookings, Earnings, More) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#073B35]/95 dark:bg-[#071715]/95 backdrop-blur-xl border-t border-white/10 dark:border-[#163835] px-2 py-1 pb-safe flex items-center justify-around shadow-2xl text-[#E0EFEA]">
        {/* Overview */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('overview');
            setMobileMoreOpen(false);
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'overview' && !mobileMoreOpen
              ? 'text-[#18C5B7] font-extrabold'
              : 'text-[#87B8B1] hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Overview</span>
        </button>

        {/* Chargers */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('chargers');
            setMobileMoreOpen(false);
          }}
          className={`flex-1 relative flex flex-col items-center justify-center py-1.5 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'chargers' && !mobileMoreOpen
              ? 'text-[#18C5B7] font-extrabold'
              : 'text-[#87B8B1] hover:text-white'
          }`}
        >
          <div className="relative">
            <BatteryCharging className="w-5 h-5 mb-0.5" />
            {chargers.length > 0 && (
              <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-[#18C5B7] text-[#073B35] text-[9px] font-extrabold flex items-center justify-center">
                {chargers.length}
              </span>
            )}
          </div>
          <span className="text-[10px]">Chargers</span>
        </button>

        {/* Bookings */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('bookings');
            setMobileMoreOpen(false);
          }}
          className={`flex-1 relative flex flex-col items-center justify-center py-1.5 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'bookings' && !mobileMoreOpen
              ? 'text-[#18C5B7] font-extrabold'
              : 'text-[#87B8B1] hover:text-white'
          }`}
        >
          <div className="relative">
            <CalendarCheck className="w-5 h-5 mb-0.5" />
            {bookings.filter(b => b.status === 'upcoming').length > 0 && (
              <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-[#18C5B7] text-[#073B35] text-[9px] font-extrabold flex items-center justify-center">
                {bookings.filter(b => b.status === 'upcoming').length}
              </span>
            )}
          </div>
          <span className="text-[10px]">Bookings</span>
        </button>

        {/* Earnings */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('earnings');
            setMobileMoreOpen(false);
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'earnings' && !mobileMoreOpen
              ? 'text-[#18C5B7] font-extrabold'
              : 'text-[#87B8B1] hover:text-white'
          }`}
        >
          <TrendingUp className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Earnings</span>
        </button>

        {/* More */}
        <button
          type="button"
          onClick={() => setMobileMoreOpen(!mobileMoreOpen)}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 rounded-xl transition-colors cursor-pointer ${
            mobileMoreOpen || activeTab === 'analytics' || activeTab === 'reviews' || activeTab === 'profile' || activeTab === 'settings'
              ? 'text-[#18C5B7] font-extrabold'
              : 'text-[#87B8B1] hover:text-white'
          }`}
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">More</span>
        </button>
      </nav>

      {/* Host "More" Mobile Bottom Sheet */}
      <AnimatePresence>
        {mobileMoreOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex items-end">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileMoreOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative w-full bg-[#073B35] text-white rounded-t-3xl border-t border-white/10 shadow-2xl p-5 pb-safe z-10 max-h-[82dvh] overflow-y-auto"
            >
              <div className="w-12 h-1.5 rounded-full bg-white/20 mx-auto mb-4" />

              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <h3 className="font-extrabold text-sm text-white">Host Operations</h3>
                  <p className="text-[11px] text-[#A3CCC7]">{profile.name} (Host ID #4492)</p>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMoreOpen(false)}
                  className="p-1 rounded-lg text-white/60 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-3 space-y-1.5">
                {/* Add Charger (Authorized Hosts Only) */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMoreOpen(false);
                    setIsAddModalOpen(true);
                  }}
                  className="w-full p-3 rounded-xl bg-[#18C5B7] hover:bg-[#15b2a5] text-[#073B35] flex items-center justify-between text-xs font-black shadow-lg transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <PlusCircle className="w-4 h-4" />
                    <span>List New Charger</span>
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-[#073B35]/20">Host Only</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('analytics');
                    setMobileMoreOpen(false);
                  }}
                  className={`w-full p-3 rounded-xl flex items-center justify-between text-xs font-bold transition-colors cursor-pointer ${
                    activeTab === 'analytics'
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 hover:bg-white/10 text-[#E0EFEA]'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <BarChart3 className="w-4 h-4 text-[#18C5B7]" />
                    <span>Analytics & Telemetry</span>
                  </span>
                  <ChevronDown className="w-4 h-4 -rotate-90 opacity-50" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('reviews');
                    setMobileMoreOpen(false);
                  }}
                  className={`w-full p-3 rounded-xl flex items-center justify-between text-xs font-bold transition-colors cursor-pointer ${
                    activeTab === 'reviews'
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 hover:bg-white/10 text-[#E0EFEA]'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Star className="w-4 h-4 text-[#F59E0B]" />
                    <span>Driver Reviews</span>
                  </span>
                  <ChevronDown className="w-4 h-4 -rotate-90 opacity-50" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('profile');
                    setMobileMoreOpen(false);
                  }}
                  className={`w-full p-3 rounded-xl flex items-center justify-between text-xs font-bold transition-colors cursor-pointer ${
                    activeTab === 'profile'
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 hover:bg-white/10 text-[#E0EFEA]'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-[#18C5B7]" />
                    <span>Host Profile</span>
                  </span>
                  <ChevronDown className="w-4 h-4 -rotate-90 opacity-50" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('settings');
                    setMobileMoreOpen(false);
                  }}
                  className={`w-full p-3 rounded-xl flex items-center justify-between text-xs font-bold transition-colors cursor-pointer ${
                    activeTab === 'settings'
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 hover:bg-white/10 text-[#E0EFEA]'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Settings className="w-4 h-4 text-[#18C5B7]" />
                    <span>Host Settings</span>
                  </span>
                  <ChevronDown className="w-4 h-4 -rotate-90 opacity-50" />
                </button>

                <div className="pt-2 border-t border-white/10 space-y-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMoreOpen(false);
                      onReturnToMap();
                    }}
                    className="w-full p-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white flex items-center justify-between text-xs font-bold transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <ArrowLeft className="w-4 h-4 text-[#18C5B7]" />
                      <span>Back to Driver Map</span>
                    </span>
                  </button>

                  {onGoToConsumerDashboard && (
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMoreOpen(false);
                        onGoToConsumerDashboard();
                      }}
                      className="w-full p-2.5 rounded-xl bg-[#18C5B7]/15 hover:bg-[#18C5B7]/25 text-white border border-[#18C5B7]/30 flex items-center justify-between text-xs font-bold transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5">
                        <LayoutDashboard className="w-4 h-4 text-[#18C5B7]" />
                        <span>Consumer Dashboard</span>
                      </span>
                    </button>
                  )}

                  {onLogout && (
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMoreOpen(false);
                        onLogout();
                      }}
                      className="w-full p-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-200 border border-red-500/20 flex items-center justify-between text-xs font-bold transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5">
                        <LogOut className="w-4 h-4 text-red-400" />
                        <span>Log Out of Host Account</span>
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5-Step Charger Registration Wizard Modal */}
      <ChargerRegistrationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={(data) => {
          onAddCharger(data);
          setActiveTab('chargers');
        }}
      />

      {/* Charger Details Modal */}
      <ChargerDetailsModal
        charger={detailsCharger}
        isOpen={!!detailsCharger}
        onClose={() => setDetailsCharger(null)}
        onEdit={(charger) => {
          setDetailsCharger(null);
          setEditingCharger(charger);
        }}
        onTogglePause={(id) => {
          onTogglePause(id);
          if (detailsCharger && detailsCharger.id === id) {
            setDetailsCharger({
              ...detailsCharger,
              status: detailsCharger.status === 'paused' ? 'active' : 'paused'
            });
          }
        }}
      />

      {/* Edit Charger Modal */}
      <EditChargerModal
        charger={editingCharger}
        isOpen={!!editingCharger}
        onClose={() => setEditingCharger(null)}
        onSave={(id, updates) => {
          onUpdateCharger(id, updates);
        }}
      />

    </div>
  );
};
