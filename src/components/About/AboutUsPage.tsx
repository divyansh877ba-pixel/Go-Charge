import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, ArrowLeft } from 'lucide-react';
import { FoundersSection } from '../LandingPage/FoundersSection';
import { Language } from '../../data/translations';

interface AboutUsPageProps {
  onGoToHome: () => void;
  onGoToMap: () => void;
  onOpenListCharger: () => void;
  onOpenHostDashboard?: () => void;
  lang?: Language;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({
  onGoToHome,
  onGoToMap,
  onOpenListCharger,
  onOpenHostDashboard,
}) => {
  return (
    <div className="w-full min-h-screen bg-[#FAF8F5] dark:bg-[#071715] text-[#14201F] dark:text-[#E4EFEA] overflow-x-hidden transition-colors duration-300">
      
      {/* ── BREADCRUMB / TOP ACTION BAR ── */}
      <div className="max-w-7xl mx-auto pt-24 sm:pt-28 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <button
          onClick={onGoToHome}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E9EFE7] dark:bg-[#0D2422] hover:bg-white dark:hover:bg-[#123633] border border-[#D9DED5] dark:border-[#1E4844] text-xs font-bold text-[#123C3A] dark:text-[#E4EFEA] transition-all cursor-pointer shadow-sm group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-[#19C7B1]" />
          <span>Back to Home</span>
        </button>

        <span className="text-xs font-semibold text-[#6B7280] dark:text-[#94A3B8]">
          Go Charge / <strong className="text-[#123C3A] dark:text-white">About Us</strong>
        </span>
      </div>

      {/* ── SECTION 1: ABOUT GO CHARGE (HERO 2-COLUMN) ── */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Typography */}
          <div className="lg:col-span-6 space-y-4 text-left">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[1.04] text-[#111827] dark:text-white"
            >
              ABOUT<br />GO CHARGE
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="text-2xl sm:text-3xl text-[#E5A93C] dark:text-[#FBBF24] select-none"
              style={{ fontFamily: "'Caveat', cursive, sans-serif" }}
            >
              Powering a Smarter Way Forward.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="text-sm sm:text-base text-[#4B5563] dark:text-[#9CA3AF] leading-relaxed font-normal pt-2"
            >
              Go Charge is building a connected EV charging ecosystem that makes finding and accessing charging infrastructure easier. We connect electric vehicle drivers with available charging opportunities while empowering charger owners to make their infrastructure accessible to more people.
            </motion.p>

            <div className="pt-2">
              <button
                onClick={onGoToMap}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#E5A93C] hover:bg-[#D99B26] text-black font-extrabold text-xs sm:text-sm transition-all shadow-md cursor-pointer"
              >
                <span>Explore Chargers</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: High Quality EV Pedestal Charger Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-6"
          >
            <div className="w-full aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden shadow-xl border border-[#E5E7EB] dark:border-[#1E293B] bg-white dark:bg-[#0D2422]">
              <img
                src="/about/hero-charger.jpg"
                alt="Go Charge EV Charging Station in Community Setting"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── SECTION 2: WHY WE STARTED (2-COLUMN REVERSED) ── */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: EV Driving on Highway towards City Skyline */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 order-2 lg:order-1"
          >
            <div className="w-full aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden shadow-xl border border-[#E5E7EB] dark:border-[#1E293B] bg-white dark:bg-[#0D2422]">
              <img
                src="/about/why-started.jpg"
                alt="Electric vehicle cruising towards urban skyline"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </motion.div>

          {/* Right Column: Mission Text */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-4 text-left">
            <div className="flex items-center gap-2">
              <span className="w-7 h-[3px] bg-[#E5A93C] rounded-full" />
              <span className="text-xs sm:text-sm font-bold text-[#6B7280] dark:text-[#94A3B8]">
                Why We Started
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111827] dark:text-white tracking-tight leading-tight">
              Building the Future of EV Charging.
            </h2>

            <div className="space-y-3.5 text-xs sm:text-sm text-[#4B5563] dark:text-[#9CA3AF] leading-relaxed font-normal">
              <p>
                As electric mobility continues to grow, access to convenient charging infrastructure becomes increasingly important. We believe charging should be easier to discover and more accessible.
              </p>
              <p>
                Go Charge was created with a simple vision: connect EV drivers with charging opportunities and help private charger owners participate in the growing electric mobility ecosystem.
              </p>
              <p>
                We are building a platform where technology, accessibility, and community come together to make EV charging more convenient.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 3: THE PEOPLE BEHIND GO CHARGE (FOUNDER SECTION AS MADE EARLIER) ── */}
      <FoundersSection />

      {/* ── SECTION 4: THE FUTURE IS ELECTRIC. ACCESS SHOULD BE SIMPLE. (WIDE DARK BANNER) ── */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-[#0F1113] dark:bg-[#060D0C] border border-[#23272B] dark:border-[#152320] text-white p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight leading-tight text-white">
                THE FUTURE IS ELECTRIC.<br />
                ACCESS SHOULD BE SIMPLE.
              </h2>
              <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed max-w-xl">
                Our vision is to create a connected charging ecosystem that brings EV drivers, private charger owners, and charging infrastructure together through one accessible platform.
              </p>
            </div>

            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="w-full max-w-md aspect-[16/8] sm:aspect-[16/7] rounded-2xl overflow-hidden shadow-lg border border-white/10 bg-black">
                <img
                  src="/about/ev-plug-banner.jpg"
                  alt="EV Fast charging connector port"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── SECTION 5: WHAT WE'RE BUILDING (3 COLUMNS) ── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-8 sm:mb-10">
          <span className="w-7 h-[3px] bg-[#E5A93C] rounded-full" />
          <h3 className="text-xs sm:text-sm font-extrabold tracking-wider uppercase text-[#111827] dark:text-white">
            WHAT WE'RE BUILDING
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              number: '01',
              title: 'CONNECTED CHARGING',
              desc: 'Helping EV drivers discover charging opportunities around them.',
            },
            {
              number: '02',
              title: 'EMPOWERING OWNERS',
              desc: 'Giving private charger owners an opportunity to make their charging infrastructure accessible.',
            },
            {
              number: '03',
              title: 'SMARTER MOBILITY',
              desc: 'Building technology that supports a more connected electric mobility ecosystem.',
            },
          ].map((item) => (
            <div key={item.number} className="space-y-2">
              <p className="text-xs sm:text-sm font-bold tracking-tight text-[#111827] dark:text-white uppercase">
                <span className="text-[#6B7280] dark:text-[#94A3B8] mr-1.5">{item.number} —</span>
                <span>{item.title}</span>
              </p>
              <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#9CA3AF] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 6: LET'S POWER WHAT'S NEXT (DARK CTA BANNER) ── */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl bg-[#0F1113] dark:bg-[#060D0C] border border-[#23272B] dark:border-[#152320] p-6 sm:p-10 lg:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden shadow-2xl">
          
          {/* Subtle Golden Arc Graphic */}
          <div className="absolute -left-10 -bottom-10 w-44 h-44 rounded-full border border-[#E5A93C]/20 pointer-events-none" />

          {/* Left Text */}
          <div className="relative z-10 space-y-1">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tight text-white">
              LET'S POWER WHAT'S NEXT.
            </h2>
            <p className="text-xs sm:text-sm text-[#9CA3AF]">
              Be part of a more connected electric mobility future.
            </p>
          </div>

          {/* Right Action Buttons */}
          <div className="relative z-10 flex flex-wrap items-center gap-3">
            <button
              onClick={onGoToMap}
              className="px-6 py-3 rounded-full bg-[#E5A93C] hover:bg-[#D99B26] text-black font-extrabold text-xs sm:text-sm transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <span>Explore Chargers</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenListCharger}
              className="px-6 py-3 rounded-full bg-transparent hover:bg-white/10 text-white font-semibold text-xs sm:text-sm border border-white/30 transition-all cursor-pointer"
            >
              <span>Become a Charger Partner</span>
            </button>
          </div>

        </div>
      </section>

      {/* ── SECTION 7: ABOUT US FOOTER (MATCHING REFERENCE) ── */}
      <footer className="mt-14 border-t border-[#E5E7EB] dark:border-[#1E293B] bg-[#0A0D0C] text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
          
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#19C7B1] flex items-center justify-center text-white">
              <Zap className="w-3.5 h-3.5 fill-white" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-white">Go Charge</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#9CA3AF]">
            <button onClick={onGoToHome} className="hover:text-white transition-colors cursor-pointer">
              Home
            </button>
            <button onClick={onGoToMap} className="hover:text-white transition-colors cursor-pointer">
              Chargers
            </button>
            <button className="text-[#E5A93C] font-semibold cursor-default">
              About Us
            </button>
            <button onClick={onOpenListCharger} className="hover:text-white transition-colors cursor-pointer">
              Become a Partner
            </button>
            {onOpenHostDashboard && (
              <button onClick={onOpenHostDashboard} className="hover:text-white transition-colors cursor-pointer">
                Host Portal
              </button>
            )}
          </nav>

          {/* Tagline */}
          <div className="flex items-center gap-1.5 text-xs text-[#E5A93C] font-medium">
            <span>Driving a Greener Tomorrow</span>
            <span>🌿</span>
          </div>

        </div>
      </footer>

    </div>
  );
};
