import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck } from 'lucide-react';

interface Founder {
  name: string;
  role: string;
  bio: string;
  photo: string;
  alt: string;
}

const FOUNDERS: Founder[] = [
  {
    name: 'DIVYAM DWIVEDI',
    role: 'CEO & Founder',
    bio: 'Leading the vision, product direction, and overall growth of Go Charge, with a focus on building a connected and accessible EV charging ecosystem.',
    photo: '/founders/divyam-dwivedi.jpg',
    alt: 'Divyam Dwivedi — CEO & Founder of Go Charge',
  },
  {
    name: 'DIVYANSH BAJPAI',
    role: 'Co-Founder & Partner',
    bio: "Working alongside the founder to shape Go Charge's technology, platform development, and long-term product vision.",
    photo: '/founders/divyansh-bajpai.jpg',
    alt: 'Divyansh Bajpai — Co-Founder & Partner of Go Charge',
  },
];

export const FoundersSection: React.FC = () => {
  return (
    <section id="founders" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* ── Section Header ── */}
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#111827] dark:text-white uppercase"
        >
          THE PEOPLE BEHIND GO CHARGE
        </motion.h2>

        {/* Yellow Handwritten Subtitle as made earlier */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.12 }}
          className="text-2xl sm:text-3xl font-medium text-[#E5A93C] dark:text-[#FBBF24] mt-1 select-none"
          style={{ fontFamily: "'Caveat', cursive, sans-serif" }}
        >
          Two Minds. One Vision.
        </motion.p>
      </div>

      {/* ── Founder Cards Grid: Divyam First then Divyansh (Vertical Cards) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto items-stretch">
        {FOUNDERS.map((founder, i) => (
          <motion.div
            key={founder.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.12 }}
            whileHover={{
              y: -6,
              scale: 1.015,
              boxShadow: '0 24px 50px rgba(0, 0, 0, 0.45)',
            }}
            className="group relative flex flex-col h-full rounded-[28px] overflow-hidden bg-[#0A0D0C] border border-[#1C2624] hover:border-[#E5A93C]/50 transition-all duration-300 shadow-xl"
          >
            {/* Top Portrait Container (55-60% of card) */}
            <div className="p-4 sm:p-5 pb-0">
              <div className="relative w-full aspect-[4/5] rounded-[20px] overflow-hidden bg-white flex items-center justify-center">
                <img
                  src={founder.photo}
                  alt={founder.alt}
                  className="w-full h-full object-cover object-top grayscale contrast-[1.08] brightness-[1.02] transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="eager"
                />
              </div>
            </div>

            {/* Bottom Information Area (Dark Black Background) */}
            <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 bg-[#0A0D0C]">
              <div>
                {/* Founder Name in White */}
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white transition-colors">
                  {founder.name}
                </h3>

                {/* Designation in Yellow */}
                <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#E5A93C] dark:text-[#FBBF24] mt-1.5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E5A93C] dark:bg-[#FBBF24] animate-pulse" />
                  <span>{founder.role}</span>
                </p>

                {/* Professional Introduction in clean contrast light grey */}
                <p className="text-xs sm:text-sm text-[#D1D5DB] leading-relaxed mt-4 font-normal">
                  "{founder.bio}"
                </p>
              </div>

              {/* Subtitle Footer Bar */}
              <div className="pt-5 mt-5 border-t border-[#1C2624] flex items-center justify-between text-[11px] text-[#9CA3AF]">
                <span className="flex items-center gap-1.5 text-[#19C7B1] font-semibold">
                  <Zap className="w-3.5 h-3.5 fill-[#19C7B1]" />
                  <span>Go Charge Core</span>
                </span>
                <span className="text-[#6B7280]">Verified Leadership</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
