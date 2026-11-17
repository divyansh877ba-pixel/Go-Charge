import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Plus, Eye, Edit3, Pause, Play, Trash2, 
  MapPin, CheckCircle2, Clock, AlertCircle, Search, Filter, ShieldAlert
} from 'lucide-react';
import { HostCharger, ListingStatus } from '../../types/host';

interface MyChargersTabProps {
  chargers: HostCharger[];
  onOpenAddCharger: () => void;
  onViewDetails: (charger: HostCharger) => void;
  onEditCharger: (charger: HostCharger) => void;
  onTogglePause: (id: string) => void;
  onDeleteCharger: (id: string) => void;
}

export const MyChargersTab: React.FC<MyChargersTabProps> = ({
  chargers,
  onOpenAddCharger,
  onViewDetails,
  onEditCharger,
  onTogglePause,
  onDeleteCharger
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | ListingStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredChargers = chargers.filter((c) => {
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchCity = c.city.toLowerCase().includes(q);
      const matchCategory = c.category.toLowerCase().includes(q);
      const matchConnector = c.connectorType.toLowerCase().includes(q);
      if (!matchName && !matchCity && !matchCategory && !matchConnector) return false;
    }
    return true;
  });

  const chargerToDelete = chargers.find((c) => c.id === deleteConfirmId);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
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
    <div className="space-y-6">
      
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#123C3A] dark:text-[#E4EFEA]">
            My EV Chargers
          </h1>
          <p className="text-xs text-[#5E716E] dark:text-[#8FAFA9]">
            Manage hardware specs, tariff rates, and live operational status
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddCharger}
          className="min-h-[44px] px-4 py-2.5 rounded-btn bg-[#19C7B1] hover:bg-[#123C3A] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-glow-teal-sm cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Charger</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-[#0D2422] border border-[#D9DED5] dark:border-[#183E3A] shadow-sm">
        
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: `All (${chargers.length})` },
            { id: 'active', label: `Active (${chargers.filter((c) => c.status === 'active').length})` },
            { id: 'pending', label: `Pending (${chargers.filter((c) => c.status === 'pending').length})` },
            { id: 'paused', label: `Paused (${chargers.filter((c) => c.status === 'paused').length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterStatus(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                filterStatus === tab.id
                  ? 'bg-[#123C3A] text-white dark:bg-[#18C5B7] dark:text-[#071715] shadow-sm'
                  : 'bg-[#F4F1E8] text-[#5E716E] hover:text-[#123C3A] dark:bg-[#081B19] dark:text-[#7A9E99] dark:hover:text-[#E4EFEA]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#5E716E] dark:text-[#7A9E99] absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, city or plug..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#F4F1E8] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#183E3A] text-[#123C3A] dark:text-[#E4EFEA] placeholder-[#5E716E]/60 dark:placeholder-[#7A9E99]/60 focus:border-[#19C7B1] dark:focus:border-[#18C5B7] focus:bg-white dark:focus:bg-[#0D2422] text-xs outline-none transition-colors"
          />
        </div>
      </div>

      {/* Chargers Grid */}
      {filteredChargers.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-white dark:bg-[#0D2422] border border-[#D9DED5] dark:border-[#183E3A] p-6 space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#E9EFE7] dark:bg-[#081B19] text-[#5E716E] dark:text-[#7A9E99] flex items-center justify-center mx-auto">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#123C3A] dark:text-[#E4EFEA]">No Chargers Found</h3>
          <p className="text-xs text-[#5E716E] dark:text-[#8FAFA9] max-w-sm mx-auto">
            {searchQuery
              ? `No chargers matched "${searchQuery}". Try searching for another city or connector.`
              : 'You have no chargers in this category. Click below to add your first charging point.'}
          </p>
          <button
            type="button"
            onClick={onOpenAddCharger}
            className="px-4 py-2 rounded-btn bg-[#19C7B1] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-glow-teal-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>List Your Charger</span>
          </button>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filteredChargers.map((charger) => {
            const isPaused = charger.status === 'paused';
            return (
              <motion.div
                key={charger.id}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="rounded-2xl bg-white dark:bg-[#0D2422] border border-[#D9DED5] dark:border-[#183E3A] hover:border-[#19C7B1] dark:hover:border-[#18C5B7] shadow-sm hover:shadow-card-subtle transition-all overflow-hidden flex flex-col justify-between"
              >
                {/* Image Cover with Status Badges */}
                <div className="relative aspect-video bg-[#E9EFE7] dark:bg-[#081B19] overflow-hidden">
                  <img
                    src={charger.images[0]}
                    alt={charger.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md shadow-md ${
                      charger.status === 'active'
                        ? 'bg-emerald-500/90 text-white'
                        : charger.status === 'pending'
                        ? 'bg-amber-500/90 text-white'
                        : 'bg-stone-700/90 text-white'
                    }`}>
                      {charger.status === 'active' ? 'Active' : charger.status === 'pending' ? 'Pending Approval' : 'Paused'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-bold backdrop-blur-md">
                      {charger.category}
                    </span>
                  </div>

                  {/* Tariff Tag Top Right */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/95 dark:bg-[#071715]/95 text-[#123C3A] dark:text-[#18C5B7] border border-transparent dark:border-[#183E3A] font-extrabold text-xs shadow-md tabular-nums">
                    ₹{charger.pricePerKwh}/kWh
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-sm text-[#123C3A] dark:text-[#E4EFEA] leading-snug line-clamp-1">
                      {charger.name}
                    </h3>
                    <p className="text-xs text-[#5E716E] dark:text-[#8FAFA9] flex items-center gap-1 mt-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#19C7B1] dark:text-[#18C5B7] shrink-0" />
                      <span className="truncate">{charger.address}, {charger.city}</span>
                    </p>
                  </div>

                  {/* Hardware & Timing Row */}
                  <div className="p-2.5 rounded-xl bg-[#F4F1E8] dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#183E3A] grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-[#5E716E] dark:text-[#7A9E99] font-medium block">Power & Gun</span>
                      <span className="font-bold text-[#123C3A] dark:text-[#E4EFEA] flex items-center gap-1">
                        <Zap className="w-3 h-3 text-[#19C7B1] dark:text-[#18C5B7] fill-current" />
                        {charger.capacityKw} kW · {charger.connectorType}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#5E716E] dark:text-[#7A9E99] font-medium block">Availability</span>
                      <span className="font-bold text-[#123C3A] dark:text-[#E4EFEA] truncate block">
                        {charger.is24x7 ? '24/7 Access' : `${charger.openingTime} – ${charger.closingTime}`}
                      </span>
                    </div>
                  </div>

                  {/* Bookings & Earnings summary */}
                  <div className="flex items-center justify-between text-xs text-[#5E716E] dark:text-[#8FAFA9] pt-1 border-t border-[#D9DED5] dark:border-[#183E3A]">
                    <span>Bookings: <strong className="text-[#123C3A] dark:text-[#18C5B7] tabular-nums">{charger.totalBookings}</strong></span>
                    <span>Total: <strong className="text-[#123C3A] dark:text-[#18C5B7] tabular-nums">₹{charger.totalEarnings.toLocaleString('en-IN')}</strong></span>
                  </div>

                  {/* Actions Row */}
                  <div className="pt-2 border-t border-[#D9DED5] dark:border-[#183E3A] grid grid-cols-4 gap-1.5">
                    <button
                      type="button"
                      onClick={() => onViewDetails(charger)}
                      className="min-h-[40px] px-2 rounded-btn bg-[#E9EFE7] hover:bg-[#D9DED5] text-[#123C3A] dark:bg-[#081B19] dark:hover:bg-[#163834] dark:text-[#E4EFEA] border border-transparent dark:border-[#183E3A] text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      title="View Full Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Details</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onEditCharger(charger)}
                      className="min-h-[40px] px-2 rounded-btn bg-[#E9EFE7] hover:bg-[#D9DED5] text-[#123C3A] dark:bg-[#081B19] dark:hover:bg-[#163834] dark:text-[#E4EFEA] border border-transparent dark:border-[#183E3A] text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      title="Edit Details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onTogglePause(charger.id)}
                      className={`min-h-[40px] px-2 rounded-btn border text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                        isPaused
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                          : 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                      }`}
                      title={isPaused ? 'Resume Listing' : 'Pause Listing'}
                    >
                      {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
                      <span className="hidden sm:inline">{isPaused ? 'Resume' : 'Pause'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(charger.id)}
                      className="min-h-[40px] px-2 rounded-btn bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 dark:border-rose-900/60 dark:text-rose-300 text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      title="Delete Listing"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Confirmation Modal for Destructive Delete Action */}
      <AnimatePresence>
        {deleteConfirmId && chargerToDelete && (
          <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4 bg-[#123C3A]/70 dark:bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md bg-white dark:bg-[#0D2422] rounded-2xl border border-[#D9DED5] dark:border-[#183E3A] shadow-2xl p-6 space-y-4 text-[#14201F] dark:text-[#E4EFEA]"
            >
              <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-6 h-6" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-base font-extrabold text-[#123C3A] dark:text-[#E4EFEA]">
                  Delete Charger Listing?
                </h3>
                <p className="text-xs text-[#5E716E] dark:text-[#8FAFA9]">
                  Are you sure you want to remove <strong>"{chargerToDelete.name}"</strong>? This will permanently delete the port listing and cancel upcoming driver reservations.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(null)}
                  className="min-h-[44px] py-2.5 px-4 rounded-btn bg-[#E9EFE7] hover:bg-[#D9DED5] text-xs font-bold text-[#123C3A] dark:bg-[#081B19] dark:hover:bg-[#163834] dark:text-[#E4EFEA] border border-transparent dark:border-[#183E3A] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteCharger(chargerToDelete.id);
                    setDeleteConfirmId(null);
                  }}
                  className="min-h-[44px] py-2.5 px-4 rounded-btn bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
