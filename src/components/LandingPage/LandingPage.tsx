import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, MapPin, Star, ArrowRight, ShieldCheck, 
  CheckCircle2, Compass, Plug, 
  IndianRupee, Navigation, Smartphone, Activity, 
  TrendingUp, Users, Building2, Home, Car, Bike, Sparkles, HelpCircle, ShieldAlert
} from 'lucide-react';
import { VehicleMarquee } from './VehicleMarquee';
import { CountUp } from '../UI/CountUp';
import { HeroEvVisual } from '../Hero/HeroEvVisual';
import { VehicleHeroWidget } from '../VehicleSelector/VehicleHeroWidget';
import { VehicleModel, CONNECTOR_SPECS } from '../../data/vehicles';
import { Language, TRANSLATIONS } from '../../data/translations';

interface LandingPageProps {
  onGoToMap: () => void;
  onOpenListCharger?: () => void;
  onOpenHostDashboard?: () => void;
  onNavigateToAbout?: () => void;
  selectedVehicle: VehicleModel | null;
  onSelectVehicle: (vehicle: VehicleModel | null) => void;
  onOpenVehicleModal: () => void;
  onSearchWithVehicle: (query: string, vehicle: VehicleModel | null) => void;
  onDetectLocation: () => void;
  isLocating?: boolean;
  lang?: Language;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGoToMap,
  onOpenListCharger,
  onOpenHostDashboard,
  onNavigateToAbout,
  selectedVehicle,
  onSelectVehicle,
  onOpenVehicleModal,
  onSearchWithVehicle,
  onDetectLocation,
  isLocating = false,
  lang = 'en',
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setMousePos({ x, y });
  };

  const handleHeroMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <div className="w-full bg-[#F4F1E8] dark:bg-[#071715] text-[#14201F] dark:text-[#E4EFEA] overflow-x-hidden transition-colors duration-300">
      
      {/* ── HERO SECTION: DISCOVER COMPATIBLE CHARGERS INSTANTLY ── */}
      <section 
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="relative pt-4 sm:pt-10 lg:pt-14 pb-12 sm:pb-20 px-3 sm:px-6 lg:px-8 overflow-hidden bg-[#F4F1E8] dark:bg-[#071715] transition-colors"
      >
        {/* Subtle Ambient Backlight Glow behind Hero */}
        <div className="absolute top-1/3 left-1/2 w-[600px] h-[350px] bg-[#19C7B1]/15 dark:bg-[#19C7B1]/10 rounded-full blur-[140px] pointer-events-none ambient-glow-breathe" />

        <div className="relative max-w-7xl mx-auto z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            
            {/* Left Column: Headline, Supporting Text, and Vehicle Search Widget */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-3.5 sm:space-y-5">
              
              {/* Top Tag Pill */}
              <motion.div 
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:py-1.5 rounded-pill bg-[#E9EFE7] dark:bg-[#0D2422] border border-[#D9DED5] dark:border-[#1E4844] text-[11px] sm:text-xs font-bold text-[#123C3A] dark:text-[#E4EFEA] shadow-card-subtle"
              >
                <span className="w-2 h-2 rounded-full bg-[#19C7B1] animate-ping" />
                <span className="text-[#19C7B1]">Go Charge Community Network</span>
                <span className="text-[#5E716E] dark:text-[#88ABA6] hidden sm:inline">• India-Wide Verified</span>
              </motion.div>

              {/* Exact Requested Master Headline */}
              <motion.h1 
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
                className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] sm:leading-[1.08] text-[#123C3A] dark:text-white"
              >
                {t.heroHeadline}
              </motion.h1>

              {/* Exact Requested Supporting Text */}
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.2, ease: "easeOut" }}
                className="max-w-2xl mx-auto lg:mx-0 text-xs sm:text-base lg:text-lg text-[#5E716E] dark:text-[#8FAFA9] leading-relaxed font-medium"
              >
                {t.heroSubtext}
              </motion.p>

              {/* Vehicle-First Search & Discovery Widget */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.3, ease: "easeOut" }}
                className="pt-1 sm:pt-2"
              >
                <VehicleHeroWidget
                  onSearch={onSearchWithVehicle}
                  onOpenVehicleModal={onOpenVehicleModal}
                  selectedVehicle={selectedVehicle}
                  onSelectVehicle={onSelectVehicle}
                  onDetectLocation={onDetectLocation}
                  isLocating={isLocating}
                />
              </motion.div>

              {/* Quick Secondary CTA row */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1 text-xs text-[#5E716E] dark:text-[#8FAFA9]">
                <button
                  type="button"
                  onClick={onOpenHostDashboard}
                  className="font-bold text-[#19C7B1] hover:underline flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Have a home or commercial charger?</span>
                  <strong className="underline">Host Portal →</strong>
                </button>
              </div>

            </div>

            {/* Right Column: Hero EV Visual (Car + Pedestal + Traveling Energy Flow) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="lg:col-span-5 flex justify-center items-center relative"
            >
              <HeroEvVisual mouseX={mousePos.x} mouseY={mousePos.y} />
            </motion.div>

          </div>

        </div>
      </section>

      {/* ── METRICS & TRUST COUNTER ── */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-6">
          {[
            { end: 850, suffix: '+', label: 'Verified Charging Bays', icon: Zap },
            { end: 28, suffix: '+', label: 'States & Cities Covered', icon: MapPin },
            { end: 18500, suffix: '+', label: 'EV Drivers Connected', icon: Users },
            { end: 99, suffix: '%', label: 'Connector Compatibility Rate', icon: ShieldCheck },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="p-5 sm:p-6 rounded-card bg-[#E9EFE7] dark:bg-[#0D2422] border border-[#D9DED5] dark:border-[#1E4844] hover:border-[#19C7B1] transition-all duration-300 shadow-card-subtle flex flex-col justify-between"
            >
              <div className="w-9 h-9 rounded-xl bg-white dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#1E4844] flex items-center justify-center mb-3 shadow-sm">
                <stat.icon className="w-4 h-4 text-[#19C7B1]" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black tracking-tight text-[#123C3A] dark:text-white mb-0.5">
                  <CountUp end={stat.end} suffix={stat.suffix} />
                </p>
                <p className="text-xs text-[#5E716E] dark:text-[#8FAFA9] font-semibold">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── VEHICLE LOGO MARQUEE (Ather, Ola, Tata, MG, TVS, etc.) ── */}
      <VehicleMarquee />

      {/* ── HOW IT WORKS: COMMUNITY EV EXPERIENCE ── */}
      <section id="how-it-works" className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#123C3A] dark:text-[#19C7B1] bg-[#E9EFE7] dark:bg-[#0D2422] px-3 py-1 rounded-full border border-[#D9DED5] dark:border-[#1E4844]">
            As Simple As Booking A Cab
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#123C3A] dark:text-white mt-3">
            How Go Charge Works
          </h2>
          <p className="text-xs sm:text-sm text-[#5E716E] dark:text-[#8FAFA9] mt-2 font-medium">
            Find nearby chargers or monetize your personal charging point with complete peace of mind.
          </p>
        </div>

        {/* 4 Steps Flow */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {[
            {
              step: '01',
              title: 'Identify Your EV',
              desc: 'Select 2-Wheeler or 4-Wheeler (Ather, Ola, Tata, MG, Mahindra, TVS). We match connector types automatically.',
              icon: Bike,
            },
            {
              step: '02',
              title: 'Explore Live Map',
              desc: 'Browse verified home chargers, societies, offices, and fast highway plazas across Indian cities.',
              icon: MapPin,
            },
            {
              step: '03',
              title: 'One-Click Directions',
              desc: 'Get exact coordinates, entry gate instructions, and verified port availability status.',
              icon: Navigation,
            },
            {
              step: '04',
              title: 'Plug In & Charge',
              desc: 'Arrive at the charging bay, scan or plug in, and charge without technical confusion.',
              icon: Zap,
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className="p-5 sm:p-6 rounded-card bg-white dark:bg-[#0D2422] border border-[#D9DED5] dark:border-[#1E4844] hover:border-[#19C7B1] transition-all shadow-card-subtle flex flex-col items-center text-center group"
            >
              <div className="relative w-14 h-14 rounded-2xl bg-[#E9EFE7] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#1E4844] flex items-center justify-center text-[#19C7B1] mb-4 group-hover:scale-105 transition-transform">
                <item.icon className="w-6 h-6" />
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#123C3A] text-[10px] font-bold text-white flex items-center justify-center">
                  {item.step}
                </span>
              </div>
              <h3 className="text-base font-bold text-[#123C3A] dark:text-white mb-1.5">
                {item.title}
              </h3>
              <p className="text-xs text-[#5E716E] dark:text-[#8FAFA9] leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── INDIA EV CHARGING STANDARDS GUIDE (CLARITY FOR FIRST-TIME USERS) ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[#E9EFE7]/60 dark:bg-[#0A1F1D] rounded-3xl border border-[#D9DED5] dark:border-[#1E4844] my-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#123C3A] dark:text-[#19C7B1] bg-white dark:bg-[#081B19] px-3 py-1 rounded-full border border-[#D9DED5] dark:border-[#1E4844]">
            India EV Knowledge Base
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#123C3A] dark:text-white mt-3">
            Demystifying Charging Standards in India
          </h2>
          <p className="text-xs sm:text-sm text-[#5E716E] dark:text-[#8FAFA9] mt-2">
            No jargon. Here is how your vehicle connects to Indian charging infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'CCS2 (DC Fast)',
              vehicleType: '4-Wheelers (Cars & SUVs)',
              desc: 'The official national DC fast-charging standard for Tata, MG, Mahindra, Hyundai, BYD, and Kia electric cars.',
              power: '25 kW – 150 kW DC',
              badge: '4W Standard',
            },
            {
              title: 'Type 2 (AC Normal)',
              vehicleType: '4W Cars & Select 2W',
              desc: 'Universal AC destination plug for slow and fast AC charging (home wallboxes, malls, tech parks, TVS X).',
              power: '3.3 kW – 22 kW AC',
              badge: 'Universal AC',
            },
            {
              title: 'LECCS / Type 7',
              vehicleType: '2-Wheelers (BIS Approved)',
              desc: 'Indian Bureau of Standards official connector for Ather Energy, Hero Vida and interoperable two-wheelers.',
              power: '3.3 kW – 12 kW DC/AC',
              badge: '2W National Standard',
            },
            {
              title: 'Bharat AC-001 / 16A',
              vehicleType: '2W, 3W & Community Sockets',
              desc: 'Universal 3-pin heavy-duty charging sockets found in societies, homes, and private community stations.',
              power: '2.5 kW – 3.3 kW AC',
              badge: 'Community & Society',
            },
          ].map((std, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white dark:bg-[#0D2422] border border-[#D9DED5] dark:border-[#1E4844] shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#E9EFE7] dark:bg-[#081B19] text-[#123C3A] dark:text-[#19C7B1]">
                    {std.badge}
                  </span>
                  <span className="text-[10px] font-bold text-[#19C7B1]">
                    {std.power}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-[#123C3A] dark:text-white mt-1">
                  {std.title}
                </h3>
                <p className="text-[11px] font-bold text-[#19C7B1] mb-2">
                  {std.vehicleType}
                </p>
                <p className="text-xs text-[#5E716E] dark:text-[#8FAFA9] leading-relaxed">
                  {std.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOR CHARGER OWNERS: MONETIZE YOUR INFRASTRUCTURE ── */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          
          <div className="space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#123C3A] dark:text-[#19C7B1] bg-[#E9EFE7] dark:bg-[#0D2422] px-3 py-1 rounded-full border border-[#D9DED5] dark:border-[#1E4844]">
              For Private & Commercial Owners
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#123C3A] dark:text-white leading-tight">
              List Your Charger. Earn From Idle Space.
            </h2>
            <p className="text-sm sm:text-base text-[#5E716E] dark:text-[#8FAFA9] leading-relaxed">
              Whether you have a 3.3kW home wallbox, an apartment parking slot, an office tech park bay, or a commercial plaza, Go Charge connects you with trusted EV drivers.
            </p>

            <div className="space-y-3 pt-1">
              {[
                'Homes & Villas: Share your private AC charger during working hours',
                'Society RWAs: Monetize common parking charging points for residents & guests',
                'Offices & Tech Parks: Offer reliable charging for employees & visitors',
                'Shops & Cafés: Attract high-value EV customers while they charge',
              ].map((pt, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#14201F] dark:text-[#E4EFEA] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#19C7B1] shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>

            {/* Electrical Safety Compliance Note */}
            <div className="p-3.5 rounded-xl bg-[#F4F1E8] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#1E4844] flex items-start gap-2.5 text-xs text-[#5E716E] dark:text-[#8FAFA9]">
              <ShieldCheck className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
              <span>
                <strong>Safety & Compliance First:</strong> All Go Charge listed hosts must have proper MCB/RCCB earthing and adhere to Central Electricity Authority (CEA) guidelines.
              </span>
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-3">
              {onOpenHostDashboard && (
                <button
                  type="button"
                  onClick={onOpenHostDashboard}
                  className="px-6 py-3 rounded-xl bg-[#19C7B1] hover:bg-[#15A896] text-white font-bold text-xs sm:text-sm shadow-glow-teal flex items-center gap-2 cursor-pointer transition-all"
                >
                  <span>Go-Charge Host Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Interactive Demonstration Earnings & Host Card */}
          <div 
            onClick={onOpenHostDashboard}
            className="p-6 rounded-2xl bg-white dark:bg-[#0D2422] border border-[#D9DED5] dark:border-[#1E4844] shadow-card-hover space-y-4 cursor-pointer hover:-translate-y-1 transition-transform"
            title="Click to explore Host Portal"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#D9DED5] dark:border-[#1E4844]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#19C7B1]/15 text-[#19C7B1] flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#123C3A] dark:text-white">Anand's Hauz Khas EV Point</h4>
                  <p className="text-[11px] text-[#5E716E] dark:text-[#8FAFA9]">Verified Private Host · South Delhi</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                Host Active
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-[#F4F1E8] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#1E4844]">
                <span className="text-[10px] font-semibold text-[#5E716E] dark:text-[#8FAFA9]">Monthly Demo Earnings</span>
                <p className="text-xl font-extrabold text-[#123C3A] dark:text-[#19C7B1] mt-0.5">₹18,450</p>
                <span className="text-[10px] text-[#22C55E] font-bold">↑ +24% this month</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F4F1E8] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#1E4844]">
                <span className="text-[10px] font-semibold text-[#5E716E] dark:text-[#8FAFA9]">Sessions Completed</span>
                <p className="text-xl font-extrabold text-[#123C3A] dark:text-white mt-0.5">74</p>
                <span className="text-[10px] text-[#19C7B1] font-bold">5.0 Star Host Rating</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#F4F1E8] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#1E4844] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#19C7B1]" />
                <span className="font-bold text-[#123C3A] dark:text-white">Gun 1 (7.4 kW Type 2 AC)</span>
              </div>
              <span className="text-[11px] font-bold text-[#22C55E]">Available Now</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#D9DED5] dark:border-[#163835] bg-[#E9EFE7] dark:bg-[#061413] text-[#14201F] dark:text-[#E4EFEA] pt-12 pb-10 px-4 sm:px-6 lg:px-8 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#D9DED5] dark:border-[#1E4844]">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#19C7B1] flex items-center justify-center text-white shadow-glow-teal-sm">
                <Zap className="w-4 h-4 fill-white" />
              </div>
              <span className="font-extrabold text-lg text-[#123C3A] dark:text-white">Go Charge</span>
            </div>
            <p className="text-xs text-[#5E716E] dark:text-[#8FAFA9] max-w-sm">
              India's community-driven EV charging network. Making finding and booking a charger as easy as booking a cab.
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-xs font-semibold text-[#5E716E] dark:text-[#88ABA6]">
            <button onClick={onGoToMap} className="hover:text-[#19C7B1] transition-colors">
              Find Chargers
            </button>
            {onOpenHostDashboard && (
              <button onClick={onOpenHostDashboard} className="hover:text-[#19C7B1] transition-colors">
                Host Portal
              </button>
            )}
            <a href="#how-it-works" className="hover:text-[#19C7B1] transition-colors">
              How It Works
            </a>
            {onNavigateToAbout && (
              <button onClick={onNavigateToAbout} className="hover:text-[#19C7B1] transition-colors">
                About Us
              </button>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5E716E] dark:text-[#8FAFA9]">
          <p>© {new Date().getFullYear()} Go Charge Technologies India. All rights reserved.</p>
          <p className="flex items-center gap-1 text-[#19C7B1] font-semibold">
            <span>Powering India's Electric Future</span>
            <Zap className="w-3.5 h-3.5 fill-current" />
          </p>
        </div>
      </footer>

    </div>
  );
};
