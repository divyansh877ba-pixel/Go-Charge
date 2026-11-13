import React, { useState } from 'react';
import { 
  Zap, CalendarCheck, IndianRupee, Clock, ArrowRight, 
  CheckCircle2, PlusCircle, AlertCircle, ShieldCheck, ChevronRight,
  TrendingUp, TrendingDown, PiggyBank, Wallet, BatteryCharging,
  Car, Eye, Edit3, Pause, Play, Sparkles, Filter, MoreVertical
} from 'lucide-react';
import { 
  HostCharger, HostBooking, DashboardTab, MetricTrendPoint, LiveChargingSession 
} from '../../types/host';
import { 
  MOCK_CHARGERS_STATUS_BREAKDOWN, 
  MOCK_METRIC_TREND_30D, 
  MOCK_METRIC_TREND_7D, 
  MOCK_METRIC_TREND_90D,
  MOCK_LIVE_SESSION 
} from '../../data/mockHostData';

interface DashboardOverviewProps {
  chargers: HostCharger[];
  bookings: HostBooking[];
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
  onNavigateTab: (tab: DashboardTab) => void;
  onOpenAddCharger: () => void;
  onViewChargerDetails: (charger: HostCharger) => void;
  onTogglePause?: (id: string) => void;
  onEditCharger?: (charger: HostCharger) => void;
  selectedLocation: string;
  selectedTimeframe: '7d' | '30d' | '90d';
  onSelectLocation?: (loc: string) => void;
  onSelectTimeframe?: (tf: '7d' | '30d' | '90d') => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  chargers,
  bookings,
  summaryMetrics,
  onNavigateTab,
  onOpenAddCharger,
  onViewChargerDetails,
  onTogglePause,
  onEditCharger,
  selectedLocation,
  selectedTimeframe,
  onSelectLocation,
  onSelectTimeframe,
}) => {
  // Metric toggle matching the reference image's bottom card [ Sessions | Energy | Revenue | Cost ]
  const [activeMetricTab, setActiveMetricTab] = useState<'sessions' | 'energy' | 'revenue' | 'cost'>('energy');
  const [hoveredPoint, setHoveredPoint] = useState<MetricTrendPoint | null>(null);
  const [liveSessionState, setLiveSessionState] = useState<LiveChargingSession>(MOCK_LIVE_SESSION);

  // Select dataset based on timeframe
  const currentTrendData = selectedTimeframe === '7d' 
    ? MOCK_METRIC_TREND_7D 
    : selectedTimeframe === '90d' 
    ? MOCK_METRIC_TREND_90D 
    : MOCK_METRIC_TREND_30D;

  // Find max value in dataset for proportional bar scaling
  const maxValue = Math.max(...currentTrendData.map(d => d[activeMetricTab]), 1);

  // Recent bookings preview
  const recentBookings = bookings.slice(0, 4);

  // Formatter for metrics
  const formatMetricValue = (val: number, metric: 'sessions' | 'energy' | 'revenue' | 'cost') => {
    switch (metric) {
      case 'sessions':
        return `${val} sessions`;
      case 'energy':
        return `${val} kWh`;
      case 'revenue':
        return `₹${val.toLocaleString('en-IN')}`;
      case 'cost':
        return `₹${val.toLocaleString('en-IN')}`;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* ======================================================== */}
      {/* 1. TOP SECTION: CHARGERS STATUS CHART (LEFT) + 4 KPI CARDS (RIGHT) */}
      {/* Exactly replicating the top layout of the reference image */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* LEFT: Chargers Status Pill Bar Card (col-span-5) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0D2422] rounded-2xl p-6 border border-gray-100 dark:border-[#183E3A] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_25px_-2px_rgba(0,0,0,0.35)] flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Chargers</h2>
              <p className="text-xs text-gray-400 dark:text-[#7A9E99] mt-0.5">Real-time port operational states</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#18C5B7]/10 dark:bg-[#18C5B7]/20 text-[#073B35] dark:text-[#18C5B7] font-bold text-xs border border-[#18C5B7]/30">
              52 Total Ports
            </span>
          </div>

          {/* Status Bars Container */}
          <div className="flex items-end justify-between gap-2 sm:gap-3 h-52 pt-4 px-1">
            {MOCK_CHARGERS_STATUS_BREAKDOWN.map((item, idx) => {
              // Calculate relative height percentage (max count is 21)
              const maxCount = 21;
              const heightPercent = Math.max(Math.round((item.count / maxCount) * 100), 12);
              const isHighlight = item.label === 'Available' || item.label === 'Charging';

              return (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group">
                  {/* Count above bar */}
                  <span className={`text-xs font-bold mb-1.5 transition-transform duration-200 group-hover:-translate-y-0.5 ${
                    isHighlight ? 'text-[#073B35] dark:text-[#18C5B7]' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {item.count}
                  </span>

                  {/* Vertical Pill Bar with smooth rounded corners */}
                  <div className="w-full flex justify-center h-36 items-end">
                    <div
                      style={{ 
                        height: `${heightPercent}%`,
                      }}
                      className={`w-full max-w-[34px] rounded-t-xl rounded-b-md transition-all duration-300 group-hover:opacity-90 ${
                        isHighlight 
                          ? 'bg-[#18C5B7] shadow-[0_4px_14px_rgba(24,197,183,0.35)]' 
                          : 'bg-[#94A3B8] dark:bg-[#2C4845]'
                      }`}
                      title={`${item.label}: ${item.count} ports`}
                    />
                  </div>

                  {/* Label below bar */}
                  <span className="text-[10px] sm:text-[11px] font-medium text-gray-500 dark:text-[#7A9E99] text-center mt-2 leading-tight truncate w-full">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-4 mt-2 border-t border-gray-100 dark:border-[#183E3A] flex items-center justify-between text-xs text-gray-500 dark:text-[#7A9E99]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#18C5B7] animate-pulse" />
              <span>36 Online & Active (69%)</span>
            </span>
            <button
              type="button"
              onClick={() => onNavigateTab('chargers')}
              className="text-[#18C5B7] hover:underline font-bold transition-colors cursor-pointer"
            >
              View Grid →
            </button>
          </div>
        </div>

        {/* RIGHT: 2x2 Grid of Four KPI Cards (col-span-7) */}
        {/* Replicating Sessions, Revenue, Energy, Cost */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Card 1: Sessions */}
          <div className="bg-white dark:bg-[#0D2422] rounded-2xl p-5 border border-gray-100 dark:border-[#183E3A] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_25px_-2px_rgba(0,0,0,0.35)] flex flex-col justify-between hover:border-[#18C5B7]/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-600 dark:text-[#88ABA6]">Sessions</span>
              <div className="w-10 h-10 rounded-full bg-[#18C5B7]/15 dark:bg-[#18C5B7]/20 flex items-center justify-center text-[#18C5B7]">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="my-3">
              <div className="text-3xl font-extrabold text-[#073B35] dark:text-white tracking-tight">734</div>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-[#18C5B7]">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+2.5% vs previous 30 days</span>
            </div>
          </div>

          {/* Card 2: Revenue */}
          <div className="bg-white dark:bg-[#0D2422] rounded-2xl p-5 border border-gray-100 dark:border-[#183E3A] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_25px_-2px_rgba(0,0,0,0.35)] flex flex-col justify-between hover:border-[#18C5B7]/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-600 dark:text-[#88ABA6]">Revenue</span>
              <div className="w-10 h-10 rounded-full bg-[#18C5B7]/15 dark:bg-[#18C5B7]/20 flex items-center justify-center text-[#18C5B7]">
                <PiggyBank className="w-5 h-5" />
              </div>
            </div>
            <div className="my-3">
              <div className="text-3xl font-extrabold text-[#073B35] dark:text-white tracking-tight">₹1,44,251</div>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-[#18C5B7]">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+9.1% vs previous 30 days</span>
            </div>
          </div>

          {/* Card 3: Energy */}
          <div className="bg-white dark:bg-[#0D2422] rounded-2xl p-5 border border-gray-100 dark:border-[#183E3A] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_25px_-2px_rgba(0,0,0,0.35)] flex flex-col justify-between hover:border-[#18C5B7]/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-600 dark:text-[#88ABA6]">Energy</span>
              <div className="w-10 h-10 rounded-full bg-[#18C5B7]/15 dark:bg-[#18C5B7]/20 flex items-center justify-center text-[#18C5B7]">
                <Zap className="w-5 h-5" />
              </div>
            </div>
            <div className="my-3">
              <div className="text-3xl font-extrabold text-[#073B35] dark:text-white tracking-tight">1,234 kWh</div>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>-6.9% vs previous 30 days</span>
            </div>
          </div>

          {/* Card 4: Cost */}
          <div className="bg-white dark:bg-[#0D2422] rounded-2xl p-5 border border-gray-100 dark:border-[#183E3A] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_25px_-2px_rgba(0,0,0,0.35)] flex flex-col justify-between hover:border-[#18C5B7]/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-600 dark:text-[#88ABA6]">Cost</span>
              <div className="w-10 h-10 rounded-full bg-[#18C5B7]/15 dark:bg-[#18C5B7]/20 flex items-center justify-center text-[#18C5B7]">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <div className="my-3">
              <div className="text-3xl font-extrabold text-[#073B35] dark:text-white tracking-tight">₹24,266</div>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-[#18C5B7]">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+2.5% vs previous 30 days</span>
            </div>
          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* 2. MAIN BOTTOM SECTION: INTERACTIVE METRIC TREND CHART */}
      {/* Exactly replicating the large bottom card in the reference image */}
      {/* ======================================================== */}
      <div className="bg-white dark:bg-[#0D2422] rounded-2xl p-6 border border-gray-100 dark:border-[#183E3A] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_25px_-2px_rgba(0,0,0,0.35)] space-y-6 transition-colors">
        
        {/* Metric Selector Pills matching reference image */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="inline-flex p-1 bg-gray-100 dark:bg-[#081B19] rounded-full border border-gray-200 dark:border-[#143B37]">
            {(['sessions', 'energy', 'revenue', 'cost'] as const).map((metric) => {
              const isActive = activeMetricTab === metric;
              return (
                <button
                  key={metric}
                  type="button"
                  onClick={() => setActiveMetricTab(metric)}
                  className={`px-4 sm:px-5 py-1.5 rounded-full text-xs sm:text-sm font-semibold capitalize transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-[#18C5B7] text-[#073B35] dark:text-[#06201D] shadow-sm font-bold'
                      : 'text-gray-500 dark:text-[#7A9E99] hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {metric}
                </button>
              );
            })}
          </div>

          {/* Quick Summary Pill & Legend */}
          <div className="flex items-center gap-4 text-xs">
            {hoveredPoint ? (
              <div className="px-3 py-1 rounded-xl bg-[#073B35] dark:bg-[#163834] text-white font-mono font-bold text-xs flex items-center gap-2 shadow border border-white/10">
                <span>Day {hoveredPoint.label}:</span>
                <span className="text-[#18C5B7]">{formatMetricValue(hoveredPoint[activeMetricTab], activeMetricTab)}</span>
              </div>
            ) : (
              <span className="text-gray-400 dark:text-[#7A9E99]">
                Hover over bars to inspect daily metrics
              </span>
            )}

            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-[#7A9E99]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#18C5B7] shadow-[0_0_8px_rgba(24,197,183,0.5)]" />
              <span className="font-medium capitalize">{activeMetricTab} Trend</span>
            </div>
          </div>
        </div>

        {/* Tall Rounded Pill Bar Chart matching reference image (30 columns) */}
        <div className="relative pt-6 pb-2">
          
          {/* Y-Axis Grid Lines and Labels */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-gray-400 dark:text-[#648782] font-mono pb-6 pr-2">
            <div className="border-b border-gray-100 dark:border-[#143B37] w-full flex justify-between">
              <span>{activeMetricTab === 'revenue' || activeMetricTab === 'cost' ? `₹${Math.round(maxValue)}` : Math.round(maxValue)}</span>
            </div>
            <div className="border-b border-gray-100 dark:border-[#143B37] w-full flex justify-between">
              <span>{activeMetricTab === 'revenue' || activeMetricTab === 'cost' ? `₹${Math.round(maxValue * 0.66)}` : Math.round(maxValue * 0.66)}</span>
            </div>
            <div className="border-b border-gray-100 dark:border-[#143B37] w-full flex justify-between">
              <span>{activeMetricTab === 'revenue' || activeMetricTab === 'cost' ? `₹${Math.round(maxValue * 0.33)}` : Math.round(maxValue * 0.33)}</span>
            </div>
            <div className="border-b border-gray-100 dark:border-[#143B37] w-full flex justify-between">
              <span>0</span>
            </div>
          </div>

          {/* 30 Bar Columns Container */}
          <div className="h-56 sm:h-64 flex items-end justify-between gap-1 sm:gap-2 px-6 pt-4 relative z-10">
            {currentTrendData.map((pt, i) => {
              const val = pt[activeMetricTab];
              const heightPercent = Math.max(Math.round((val / maxValue) * 100), 6);
              const isHovered = hoveredPoint?.day === pt.day;

              return (
                <div
                  key={i}
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer"
                >
                  {/* Tall vertical rounded pill bar */}
                  <div className="w-full flex justify-center items-end h-full">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full max-w-[14px] sm:max-w-[20px] rounded-full transition-all duration-300 ${
                        isHovered 
                          ? 'bg-[#073B35] dark:bg-white shadow-lg scale-y-105' 
                          : 'bg-[#18C5B7] hover:bg-[#15b2a5] dark:hover:bg-[#2fe0d2] shadow-[0_0_10px_rgba(24,197,183,0.2)]'
                      }`}
                    />
                  </div>

                  {/* X-Axis Number (1, 2, 3 ... 30) */}
                  <span className={`text-[9px] sm:text-[11px] font-mono mt-2 transition-colors ${
                    isHovered ? 'text-[#073B35] dark:text-[#18C5B7] font-bold' : 'text-gray-400 dark:text-[#648782]'
                  }`}>
                    {pt.label}
                  </span>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* 3. ADDITIONAL KEY SAAS MODULES: LIVE CHARGING + MY CHARGERS */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Live Charging Session Widget (col-span-6) */}
        <div className="lg:col-span-6 bg-white dark:bg-[#0D2422] rounded-2xl p-6 border border-gray-100 dark:border-[#183E3A] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_25px_-2px_rgba(0,0,0,0.35)] space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#18C5B7] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#18C5B7]"></span>
              </span>
              <h3 className="font-bold text-base text-gray-900 dark:text-white">Live Charging Session</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
              Active Gun Telemetry
            </span>
          </div>

          <div className="p-4 rounded-xl bg-gray-50/80 dark:bg-[#091D1B] border border-gray-100 dark:border-[#143935] flex flex-col sm:flex-row items-center gap-4">
            <img
              src={liveSessionState.chargerImage}
              alt={liveSessionState.chargerName}
              className="w-full sm:w-24 h-24 rounded-xl object-cover shadow-sm flex-shrink-0"
            />
            <div className="flex-1 w-full space-y-1.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-[#073B35] dark:text-[#18C5B7]">{liveSessionState.chargerName}</h4>
                <span className="text-xs font-mono font-bold text-[#18C5B7]">{liveSessionState.powerKw} kW DC</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-[#7A9E99] flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-gray-400 dark:text-[#648782]" />
                <span>{liveSessionState.vehicleModel}</span>
                <span>•</span>
                <span className="font-mono">{liveSessionState.licensePlate}</span>
              </p>

              {/* Live Battery Progress Bar */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-500 dark:text-[#7A9E99]">State of Charge</span>
                  <span className="text-[#073B35] dark:text-white">{liveSessionState.batteryPercentage}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-200 dark:bg-[#163834] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#18C5B7] to-[#073B35] dark:to-[#2fe0d2] rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(24,197,183,0.5)]"
                    style={{ width: `${liveSessionState.batteryPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Session Telemetry Numbers */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#091D1B] border border-gray-100 dark:border-[#143935]">
              <span className="text-[10px] text-gray-400 dark:text-[#7A9E99] uppercase font-semibold">Remaining</span>
              <p className="font-bold text-xs sm:text-sm text-gray-800 dark:text-gray-200 mt-0.5">{liveSessionState.estRemainingMinutes} mins</p>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#091D1B] border border-gray-100 dark:border-[#143935]">
              <span className="text-[10px] text-gray-400 dark:text-[#7A9E99] uppercase font-semibold">Delivered</span>
              <p className="font-bold text-xs sm:text-sm text-[#073B35] dark:text-[#18C5B7] mt-0.5">{liveSessionState.currentKwhDelivered} kWh</p>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#091D1B] border border-gray-100 dark:border-[#143935]">
              <span className="text-[10px] text-gray-400 dark:text-[#7A9E99] uppercase font-semibold">Session Revenue</span>
              <p className="font-bold text-xs sm:text-sm text-[#18C5B7] mt-0.5">₹{liveSessionState.currentEarnings.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* My Chargers Quick Snapshot (col-span-6) */}
        <div className="lg:col-span-6 bg-white dark:bg-[#0D2422] rounded-2xl p-6 border border-gray-100 dark:border-[#183E3A] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_25px_-2px_rgba(0,0,0,0.35)] space-y-4 flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-gray-900 dark:text-white">My Chargers</h3>
              <p className="text-xs text-gray-400 dark:text-[#7A9E99]">Quick status & bay management</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('chargers')}
              className="text-xs font-bold text-[#18C5B7] hover:underline flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Manage All ({chargers.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {chargers.slice(0, 3).map((ch) => (
              <div
                key={ch.id}
                className="p-3 rounded-xl border border-gray-100 dark:border-[#183E3A] hover:border-gray-200 dark:hover:border-[#225550] transition-all flex items-center justify-between gap-3 bg-white dark:bg-[#0A1F1D]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={ch.images[0] || 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=150&q=80'}
                    alt={ch.name}
                    className="w-11 h-11 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h5 className="font-bold text-xs text-gray-900 dark:text-white truncate">{ch.name}</h5>
                    <p className="text-[11px] text-gray-400 dark:text-[#7A9E99] truncate">
                      {ch.capacityKw} kW • {ch.connectorType} • ₹{ch.pricePerKwh}/kWh
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    ch.status === 'active'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : ch.status === 'paused'
                      ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                  }`}>
                    {ch.status.toUpperCase()}
                  </span>

                  <button
                    type="button"
                    onClick={() => onViewChargerDetails(ch)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-[#073B35] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#153B37] transition-colors cursor-pointer"
                    title="View Station Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {onTogglePause && (
                    <button
                      type="button"
                      onClick={() => onTogglePause(ch.id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        ch.status === 'paused'
                          ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                          : 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                      }`}
                      title={ch.status === 'paused' ? 'Resume Listing' : 'Pause Listing'}
                    >
                      {ch.status === 'paused' ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onOpenAddCharger}
              className="w-full py-2.5 rounded-xl border border-dashed border-[#18C5B7] text-[#073B35] dark:text-[#18C5B7] hover:bg-[#18C5B7]/10 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-[#18C5B7]" />
              <span>Register Another Charger Bay</span>
            </button>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 4. RECENT BOOKINGS & EARNINGS GOAL SUMMARY */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Recent Bookings Feed (col-span-8) */}
        <div className="lg:col-span-8 bg-white dark:bg-[#0D2422] rounded-2xl p-6 border border-gray-100 dark:border-[#183E3A] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_25px_-2px_rgba(0,0,0,0.35)] space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-gray-900 dark:text-white">Recent Driver Bookings</h3>
              <p className="text-xs text-gray-400 dark:text-[#7A9E99]">Incoming and completed driver sessions</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('bookings')}
              className="text-xs font-bold text-[#18C5B7] hover:underline flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View All Bookings ({bookings.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-gray-400 dark:text-[#7A9E99] uppercase font-semibold border-b border-gray-100 dark:border-[#183E3A]">
                <tr>
                  <th className="pb-2.5 font-medium">Driver & Vehicle</th>
                  <th className="pb-2.5 font-medium">Station</th>
                  <th className="pb-2.5 font-medium">Slot Time</th>
                  <th className="pb-2.5 font-medium">Energy / Duration</th>
                  <th className="pb-2.5 font-medium">Amount</th>
                  <th className="pb-2.5 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-[#143834]">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/60 dark:hover:bg-[#091D1B] transition-colors">
                    <td className="py-3">
                      <div className="font-bold text-gray-900 dark:text-white">{b.customerName}</div>
                      <div className="text-[11px] text-gray-400 dark:text-[#7A9E99]">{b.vehicleModel}</div>
                    </td>
                    <td className="py-3 text-gray-700 dark:text-gray-300 font-medium truncate max-w-[140px]">
                      {b.chargerName}
                    </td>
                    <td className="py-3 text-gray-500 dark:text-[#7A9E99] font-mono text-[11px]">
                      {b.dateTime}
                    </td>
                    <td className="py-3 text-gray-600 dark:text-gray-300">
                      <span className="font-bold text-gray-800 dark:text-white">{b.energyKwh || b.estimatedKwh || 0} kWh</span> ({b.durationMinutes}m)
                    </td>
                    <td className="py-3 font-bold text-[#073B35] dark:text-[#18C5B7]">
                      ₹{b.amount || b.totalAmount || 0}
                    </td>
                    <td className="py-3 text-right">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        b.status === 'upcoming'
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                          : b.status === 'completed'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                      }`}>
                        {b.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly Earnings Target & Goal Card (col-span-4) */}
        <div className="lg:col-span-4 bg-white dark:bg-[#0D2422] rounded-2xl p-6 border border-gray-100 dark:border-[#183E3A] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_25px_-2px_rgba(0,0,0,0.35)] space-y-4 flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 dark:text-[#7A9E99] uppercase tracking-wider">Monthly Target</span>
              <span className="text-xs font-bold text-[#18C5B7]">69% Achieved</span>
            </div>
            <div className="text-2xl font-extrabold text-[#073B35] dark:text-white mt-1">₹31,200 <span className="text-sm font-normal text-gray-400 dark:text-[#648782]">/ ₹45,000</span></div>
            
            {/* Progress bar */}
            <div className="w-full h-3 bg-gray-100 dark:bg-[#163834] rounded-full mt-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#18C5B7] to-[#073B35] dark:to-[#2fe0d2] rounded-full shadow-[0_0_8px_rgba(24,197,183,0.4)]"
                style={{ width: '69%' }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-[#7A9E99] mt-2">
              On track to exceed target with 14 more operating days remaining in November.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#073B35] dark:bg-[#082320] text-white space-y-2 border border-transparent dark:border-[#153D39]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-300 font-semibold">Next Settlement</span>
              <span className="font-mono text-[11px] text-white/80">05 Nov 2024</span>
            </div>
            <div className="text-xl font-black text-white">₹8,266.00</div>
            <p className="text-[11px] text-white/70">Auto-sweeping into HDFC Bank A/c •••• 8842</p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('earnings')}
            className="w-full py-2.5 rounded-xl bg-gray-50 dark:bg-[#091D1B] hover:bg-gray-100 dark:hover:bg-[#112E2A] text-[#073B35] dark:text-[#18C5B7] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-gray-200 dark:border-[#183E3A] cursor-pointer"
          >
            <span>Open Financials & Settlements</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#18C5B7]" />
          </button>
        </div>

      </div>

    </div>
  );
};
