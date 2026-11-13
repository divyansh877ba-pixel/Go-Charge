import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Search, MapPin, SlidersHorizontal, PlusCircle, 
  Menu, X, ArrowRight, Sun, Moon, Globe, User, LogIn, LogOut, LayoutDashboard, Shield
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { Language, TRANSLATIONS } from '../data/translations';
import { VehicleModel } from '../data/vehicles';
import { AuthUser } from '../hooks/useAuth';

export type AppView = 'map' | 'about' | 'login' | 'consumer-dashboard' | 'owner-dashboard';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  onOpenListCharger: () => void;
  onOpenFilterModal: () => void;
  onLocateUser: () => void;
  totalStations: number;
  searchInputRef?: React.RefObject<HTMLInputElement>;
  selectedVehicle?: VehicleModel | null;
  onOpenVehicleModal?: () => void;
  onOpenAuthModal?: () => void;
  currentUser?: { name: string; phone?: string; role?: 'driver' | 'host' | 'consumer' | 'charger_owner'; email?: string } | null;
  authUser?: AuthUser | null;
  onLogout?: () => void;
  lang?: Language;
  onToggleLang?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  activeView,
  setActiveView,
  onOpenListCharger,
  onOpenFilterModal,
  onLocateUser,
  searchInputRef,
  selectedVehicle,
  onOpenVehicleModal,
  onOpenAuthModal,
  currentUser,
  authUser,
  onLogout,
  lang = 'en',
  onToggleLang,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, isDark, toggleTheme } = useTheme();

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // Resolve user info from authUser (preferred) or currentUser
  const user = authUser || (currentUser ? {
    name: currentUser.name,
    email: currentUser.email || '',
    phone: currentUser.phone || '',
    role: currentUser.role === 'host' ? 'charger_owner' : 'consumer'
  } : null);

  const isConsumer = user?.role === 'consumer';
  const isOwner = user?.role === 'charger_owner';

  // Platform-appropriate keyboard shortcut hint (Ctrl+K or ⌘K)
  const isMac = typeof window !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);
  const shortcutHint = isMac ? '⌘K' : 'Ctrl+K';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (view: AppView, sectionId?: string) => {
    setActiveView(view);
    setMobileMenuOpen(false);
    if (sectionId && typeof window !== 'undefined') {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  };

  const handleAuthButtonClick = () => {
    if (user) {
      if (isOwner) {
        handleNavClick('owner-dashboard');
      } else {
        handleNavClick('consumer-dashboard');
      }
    } else {
      if (onOpenAuthModal) {
        onOpenAuthModal();
      } else {
        handleNavClick('login');
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[1100] w-full transition-all duration-300 ease-in-out ${
        isScrolled
          ? 'bg-[#F4F1E8]/95 dark:bg-[#071715]/95 backdrop-blur-xl border-b border-[#D9DED5] dark:border-[#163835] shadow-card-subtle py-2 sm:py-2.5'
          : 'bg-[#F4F1E8]/90 dark:bg-[#071715]/90 backdrop-blur-md border-b border-[#D9DED5]/80 dark:border-[#163835]/80 py-2.5 sm:py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Brand Logo & Navigation */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-5 shrink-0">
          <button 
            type="button"
            onClick={() => handleNavClick('about')}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-pill bg-[#E9EFE7] dark:bg-[#0D2422] hover:bg-white dark:hover:bg-[#123633] border border-[#D9DED5] dark:border-[#1E4844] hover:border-[#18C5B7] transition-all duration-200 shadow-sm group cursor-pointer"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#18C5B7] flex items-center justify-center text-white shadow-glow-teal-sm group-hover:rotate-12 transition-transform">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <div className="text-left">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-[#123C3A] dark:text-white group-hover:text-[#18C5B7] transition-colors leading-none block">
                Go Charge
              </span>
              <span className="text-[9px] font-bold text-[#18C5B7] tracking-wider uppercase hidden sm:block">
                Community EV
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center bg-[#E9EFE7]/80 dark:bg-[#0D2422]/80 backdrop-blur-md border border-[#D9DED5] dark:border-[#1E4844] rounded-pill p-1 shadow-sm text-xs font-bold">
            <button
              type="button"
              onClick={() => handleNavClick('map')}
              className={`px-3 py-1.5 rounded-pill transition-all duration-200 cursor-pointer ${
                activeView === 'map'
                  ? 'bg-[#18C5B7] text-white shadow-glow-teal-sm'
                  : 'text-[#5E716E] dark:text-[#88ABA6] hover:text-[#123C3A] dark:hover:text-white'
              }`}
            >
              {t.findChargers}
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('about', 'how-it-works')}
              className="px-3 py-1.5 rounded-pill text-[#5E716E] dark:text-[#88ABA6] hover:text-[#123C3A] dark:hover:text-white transition-all cursor-pointer"
            >
              {t.howItWorks}
            </button>

            {/* If Consumer is logged in, show Consumer Dashboard link */}
            {isConsumer && (
              <button
                type="button"
                onClick={() => handleNavClick('consumer-dashboard')}
                className={`px-3 py-1.5 rounded-pill transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'consumer-dashboard'
                    ? 'bg-[#18C5B7] text-white shadow-glow-teal-sm'
                    : 'text-[#123C3A] dark:text-[#18C5B7] hover:text-[#18C5B7]'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>My Dashboard</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenListCharger}
              className="px-3 py-1.5 rounded-pill text-[#123C3A] dark:text-[#18C5B7] hover:text-[#18C5B7] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#18C5B7]" />
              <span>{t.listYourCharger}</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('owner-dashboard')}
              className={`px-3 py-1.5 rounded-pill transition-all duration-200 cursor-pointer ${
                activeView === 'owner-dashboard'
                  ? 'bg-[#18C5B7] text-white shadow-glow-teal-sm'
                  : 'text-[#5E716E] dark:text-[#88ABA6] hover:text-[#123C3A] dark:hover:text-white'
              }`}
            >
              {t.hostPortal}
            </button>
          </nav>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-xs sm:max-w-md mx-1 sm:mx-3">
          <div className={`relative flex items-center w-full transition-all duration-200 rounded-pill ${
            isSearchFocused ? 'shadow-glow-teal-sm ring-2 ring-[#18C5B7]/30' : 'hover:shadow-card-subtle'
          }`}>
            <div className={`absolute left-3 transition-colors pointer-events-none ${
              isSearchFocused ? 'text-[#18C5B7]' : 'text-[#5E716E] dark:text-[#88ABA6]'
            }`}>
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (activeView !== 'map' && e.target.value.trim().length > 0) {
                  setActiveView('map');
                }
              }}
              placeholder={t.searchPlaceholder}
              className={`w-full pl-9 sm:pl-10 pr-16 sm:pr-20 py-2 sm:py-2.5 rounded-pill bg-white dark:bg-[#0D2422] text-[#14201F] dark:text-[#E4EFEA] placeholder-[#7A8C89] dark:placeholder-[#648782] text-xs sm:text-sm border transition-all duration-200 outline-none ${
                isSearchFocused 
                  ? 'border-[#18C5B7]' 
                  : 'border-[#D9DED5] dark:border-[#1E4844] hover:border-[#18C5B7]/60'
              }`}
            />
            <div className="absolute right-2 flex items-center gap-1">
              {!isSearchFocused && !searchQuery && (
                <kbd
                  aria-hidden="true"
                  className="hidden md:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-[#7A8C89] dark:text-[#648782] bg-[#E9EFE7] dark:bg-[#081B19] rounded border border-[#D9DED5] dark:border-[#1E4844] select-none pointer-events-none"
                >
                  {shortcutHint}
                </kbd>
              )}
              <button
                type="button"
                onClick={() => {
                  if (activeView !== 'map') setActiveView('map');
                  onLocateUser();
                }}
                title={t.useMyLocation}
                className="p-1 rounded-full text-[#5E716E] dark:text-[#88ABA6] hover:text-[#18C5B7] hover:bg-[#E9EFE7] dark:hover:bg-[#123633] active:scale-95 transition-all cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Action Controls: THEME TOGGLE + ACTIONS + AUTH */}
        <div className="flex items-center gap-1.5 sm:gap-2">

          {/* 1. Language Toggle (EN / HI) */}
          {onToggleLang && (
            <button
              type="button"
              onClick={onToggleLang}
              title={lang === 'en' ? 'हिंदी में बदलें' : 'Switch to English'}
              className="px-2 sm:px-2.5 py-1.5 rounded-pill bg-[#E9EFE7] dark:bg-[#0D2422] hover:bg-white dark:hover:bg-[#123633] border border-[#D9DED5] dark:border-[#1E4844] text-[11px] font-bold text-[#123C3A] dark:text-white transition-all cursor-pointer flex items-center gap-1 shadow-sm"
            >
              <Globe className="w-3 h-3 text-[#18C5B7]" />
              <span>{lang === 'en' ? 'हिंदी' : 'EN'}</span>
            </button>
          )}

          {/* 2. THEME SWITCHER BUTTON */}
          <button
            type="button"
            onClick={toggleTheme}
            id="theme-toggle-btn"
            aria-label={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
            title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
            className="min-w-[36px] sm:min-w-[40px] h-9 sm:h-10 px-2 sm:px-3 rounded-pill bg-[#E9EFE7] dark:bg-[#0D2422] hover:bg-white dark:hover:bg-[#123633] border-2 border-[#18C5B7]/40 dark:border-[#18C5B7] hover:border-[#18C5B7] text-[#123C3A] dark:text-white transition-all duration-200 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B] animate-in spin-in-180 duration-300 shrink-0" />
            ) : (
              <Moon className="w-4 h-4 text-[#123C3A] fill-[#123C3A] shrink-0" />
            )}
            <span className="text-[11px] font-extrabold hidden md:inline">
              {isDark ? 'Light' : 'Dark'}
            </span>
          </button>

          {/* 3. Filter button (quick drawer trigger) */}
          <button
            type="button"
            onClick={onOpenFilterModal}
            title="Filters (Shortcut: F)"
            className="p-2 sm:px-2.5 sm:py-2 rounded-btn bg-[#E9EFE7] dark:bg-[#0D2422] hover:bg-white dark:hover:bg-[#123633] border border-[#D9DED5] dark:border-[#1E4844] text-[#123C3A] dark:text-white transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#18C5B7]" />
            <span className="hidden xl:inline text-xs font-bold">{t.filters}</span>
          </button>

          {/* 4. Login / User Menu Button */}
          {user ? (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleAuthButtonClick}
                className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-pill bg-white dark:bg-[#0D2422] hover:bg-[#E9EFE7] dark:hover:bg-[#123633] border border-[#D9DED5] dark:border-[#1E4844] shadow-sm transition-all cursor-pointer"
                title={`Open ${isOwner ? 'Owner Dashboard' : 'Consumer Dashboard'}`}
              >
                <div className="w-6 h-6 rounded-full bg-[#18C5B7]/20 flex items-center justify-center text-[#18C5B7] font-bold text-xs">
                  {user.name.charAt(0)}
                </div>
                <div className="hidden sm:block text-left">
                  <span className="text-xs font-bold text-[#123C3A] dark:text-white block leading-none truncate max-w-[80px]">
                    {user.name.split(' ')[0]}
                  </span>
                  <span className="text-[9px] font-extrabold text-[#18C5B7] uppercase tracking-wider block">
                    {isOwner ? 'Host' : 'Consumer'}
                  </span>
                </div>
              </button>

              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  title="Log Out"
                  className="p-2 rounded-full hover:bg-red-500/10 text-red-600 dark:text-red-400 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAuthButtonClick}
              className="flex items-center gap-1.5 px-3 py-2 rounded-btn bg-[#18C5B7] hover:bg-[#15A896] text-white text-xs font-extrabold shadow-glow-teal-sm transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t.login}</span>
            </button>
          )}

          {/* 5. Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="lg:hidden p-2 rounded-btn bg-[#E9EFE7] dark:bg-[#0D2422] border border-[#D9DED5] dark:border-[#1E4844] text-[#123C3A] dark:text-white transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="lg:hidden border-t border-[#D9DED5] dark:border-[#1E4844] bg-[#F4F1E8]/98 dark:bg-[#071715]/98 backdrop-blur-2xl px-5 py-4 space-y-3 shadow-2xl"
          >
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleNavClick('map')}
                className={`w-full px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  activeView === 'map'
                    ? 'bg-[#18C5B7] text-white shadow-glow-teal-sm'
                    : 'bg-[#E9EFE7] dark:bg-[#0D2422] text-[#123C3A] dark:text-white'
                }`}
              >
                <span>{t.findChargers} (Live Map)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('about', 'how-it-works')}
                className="w-full px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between bg-[#E9EFE7] dark:bg-[#0D2422] text-[#123C3A] dark:text-white transition-colors cursor-pointer"
              >
                <span>{t.howItWorks}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {isConsumer && (
                <button
                  type="button"
                  onClick={() => handleNavClick('consumer-dashboard')}
                  className={`w-full px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    activeView === 'consumer-dashboard'
                      ? 'bg-[#18C5B7] text-white shadow-glow-teal-sm'
                      : 'bg-[#E9EFE7] dark:bg-[#0D2422] text-[#123C3A] dark:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>My Consumer Dashboard</span>
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenListCharger();
                }}
                className="w-full px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between bg-[#18C5B7]/15 text-[#18C5B7] border border-[#18C5B7]/30 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4" />
                  {t.listYourCharger}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('owner-dashboard')}
                className={`w-full px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  activeView === 'owner-dashboard'
                    ? 'bg-[#18C5B7] text-white shadow-glow-teal-sm'
                    : 'bg-[#E9EFE7] dark:bg-[#0D2422] text-[#123C3A] dark:text-white'
                }`}
              >
                <span>{t.hostPortal}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {user ? (
                <div className="pt-2 border-t border-[#D9DED5] dark:border-[#1E4844] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#18C5B7]/20 flex items-center justify-center text-[#18C5B7] font-bold text-xs">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#123C3A] dark:text-white block">{user.name}</span>
                      <span className="text-[10px] text-[#18C5B7] uppercase font-bold">{isOwner ? 'Host' : 'Consumer'}</span>
                    </div>
                  </div>
                  {onLogout && (
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onLogout();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-600 text-xs font-bold"
                    >
                      Log Out
                    </button>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleAuthButtonClick();
                  }}
                  className="w-full px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between bg-[#18C5B7] text-white shadow-glow-teal-sm transition-colors cursor-pointer"
                >
                  <span>{t.login}</span>
                  <LogIn className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
