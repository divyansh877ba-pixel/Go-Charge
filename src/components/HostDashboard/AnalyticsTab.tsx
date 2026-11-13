import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, Zap, Clock, Calendar, 
  MapPin, Activity, ArrowUpRight, BatteryCharging, Filter 
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  Tooltip, CartesianGrid, PieChart, Pie, Cell 
} from 'recharts';

export const AnalyticsTab: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  // Peak Hours Heatmap Data (06:00 to 23:00)
  const HOURLY_UTILIZATION = [
    { hour: '6 AM', occupancy: 18 },
    { hour: '8 AM', occupancy: 76 },
    { hour: '10 AM', occupancy: 92 },
    { hour: '12 PM', occupancy: 65 },
    { hour: '2 PM', occupancy: 58 },
    { hour: '4 PM', occupancy: 82 },
    { hour: '6 PM', occupancy: 96 },
    { hour: '8 PM', occupancy: 88 },
    { hour: '10 PM', occupancy: 44 },
  ];

  // Connector Speed Distribution
  const CONNECTOR_DISTRIBUTION = [
    { name: 'CCS2 60kW DC Fast', value: 58, color: '#18C5B7' },
    { name: 'AC Fast 22kW', value: 28, color: '#2FE0D2' },
    { name: 'Type-2 11kW', value: 14, color: '#64748B' },
  ];

  // Station Comparison Data
  const STATION_METRICS = [
    { name: 'Cyber Park Commercial DC Bay', sessions: 420, energy: 16800, revenue: 82400, uptime: 99.4 },
    { name: 'GreenDrive Residential Fast Hub', sessions: 228, energy: 6200, revenue: 31250, uptime: 98.8 },
    { name: 'EcoStay Boutique Hotel Point', sessions: 86, energy: 1840, revenue: 5600, uptime: 97.2 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-[#E4EFEA] tracking-tight">Analytics & Telemetry</h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-[#8FAFA9] mt-0.5">
            Fleet utilization, peak charging periods, and energy throughput analytics
          </p>
        </div>

        {/* Timeframe Filter Pills */}
        <div className="p-1 bg-white dark:bg-[#081B19] border border-gray-200 dark:border-[#183E3A] rounded-xl flex shadow-sm text-xs font-semibold">
          {(['7d', '30d', '90d'] as const).map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => setTimeRange(tf)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                timeRange === tf
                  ? 'bg-[#073B35] dark:bg-[#18C5B7] text-white dark:text-[#071715] shadow-sm'
                  : 'text-gray-600 dark:text-[#7A9E99] hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tf.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 High Level KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#0D2422] rounded-2xl p-5 border border-gray-100 dark:border-[#183E3A] shadow-sm">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-[#7A9E99] font-semibold uppercase">
            <span>Peak Utilization Window</span>
            <Clock className="w-4 h-4 text-[#18C5B7]" />
          </div>
          <div className="text-2xl font-extrabold text-[#073B35] dark:text-[#E4EFEA] mt-2">6:00 PM – 8:30 PM</div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>96% average bay occupancy</span>
          </p>
        </div>

        <div className="bg-white dark:bg-[#0D2422] rounded-2xl p-5 border border-gray-100 dark:border-[#183E3A] shadow-sm">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-[#7A9E99] font-semibold uppercase">
            <span>Average Session Duration</span>
            <Activity className="w-4 h-4 text-[#18C5B7]" />
          </div>
          <div className="text-2xl font-extrabold text-[#073B35] dark:text-[#E4EFEA] mt-2">38.4 Minutes</div>
          <p className="text-xs text-gray-500 dark:text-[#8FAFA9] mt-1">26.8 kWh avg delivered per session</p>
        </div>

        <div className="bg-white dark:bg-[#0D2422] rounded-2xl p-5 border border-gray-100 dark:border-[#183E3A] shadow-sm">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-[#7A9E99] font-semibold uppercase">
            <span>Network Hardware Uptime</span>
            <BatteryCharging className="w-4 h-4 text-[#18C5B7]" />
          </div>
          <div className="text-2xl font-extrabold text-[#073B35] dark:text-[#E4EFEA] mt-2">99.1%</div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">OCPP 2.0.1 heartbeat active</p>
        </div>
      </div>

      {/* Hourly Occupancy Bar Chart & Speed Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Hourly Chart (col-span-8) */}
        <div className="lg:col-span-8 bg-white dark:bg-[#0D2422] rounded-2xl p-6 border border-gray-100 dark:border-[#183E3A] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-gray-900 dark:text-[#E4EFEA]">Hourly Occupancy Heatmap</h3>
              <p className="text-xs text-gray-400 dark:text-[#7A9E99]">Demand distribution across 24-hour cycles</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#18C5B7]/15 dark:bg-[#18C5B7]/25 text-[#073B35] dark:text-[#18C5B7] font-bold">
              Peak: 96%
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={HOURLY_UTILIZATION} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:opacity-20" />
                <XAxis dataKey="hour" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#8FAFA9' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#8FAFA9' }} tickFormatter={(v) => `${v}%`} />
                <Tooltip 
                  formatter={(val: number) => [`${val}% Occupancy`, 'Demand']}
                  contentStyle={{ backgroundColor: '#073B35', borderRadius: '12px', border: '1px solid #183E3A', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="occupancy" fill="#18C5B7" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Speed Distribution Pie Chart (col-span-4) */}
        <div className="lg:col-span-4 bg-white dark:bg-[#0D2422] rounded-2xl p-6 border border-gray-100 dark:border-[#183E3A] shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-gray-900 dark:text-[#E4EFEA]">Throughput By Speed</h3>
            <p className="text-xs text-gray-400 dark:text-[#7A9E99]">Energy share delivered per connector type</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CONNECTOR_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {CONNECTOR_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [`${v}%`, 'Energy Share']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-[#183E3A] text-xs">
            {CONNECTOR_DISTRIBUTION.map((c, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-600 dark:text-[#8FAFA9]">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span>{c.name}</span>
                </span>
                <span className="font-bold text-[#073B35] dark:text-[#18C5B7]">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Station Performance Comparative Table */}
      <div className="bg-white dark:bg-[#0D2422] rounded-2xl p-6 border border-gray-100 dark:border-[#183E3A] shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-base text-gray-900 dark:text-[#E4EFEA]">Station-By-Station Benchmarking</h3>
          <p className="text-xs text-gray-400 dark:text-[#7A9E99]">Comparative revenue, throughput and operational reliability</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-gray-400 dark:text-[#7A9E99] uppercase font-semibold border-b border-gray-100 dark:border-[#183E3A]">
              <tr>
                <th className="pb-3">Station Name</th>
                <th className="pb-3">Sessions (30D)</th>
                <th className="pb-3">Energy Delivered</th>
                <th className="pb-3">Gross Revenue</th>
                <th className="pb-3 text-right">Hardware Uptime</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#163834]">
              {STATION_METRICS.map((st, i) => (
                <tr key={i} className="hover:bg-gray-50/70 dark:hover:bg-[#123431] transition-colors">
                  <td className="py-3.5 font-bold text-gray-900 dark:text-[#E4EFEA]">{st.name}</td>
                  <td className="py-3.5 text-gray-700 dark:text-[#A3B8B5]">{st.sessions} sessions</td>
                  <td className="py-3.5 font-semibold text-[#073B35] dark:text-[#E4EFEA]">{st.energy.toLocaleString('en-IN')} kWh</td>
                  <td className="py-3.5 font-bold text-[#18C5B7]">₹{st.revenue.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">{st.uptime}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
