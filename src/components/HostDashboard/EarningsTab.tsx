import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  IndianRupee, TrendingUp, Calendar, ArrowUpRight, CheckCircle2, 
  Clock, AlertCircle, Download, Wallet, CreditCard, Sparkles, Building2
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip 
} from 'recharts';
import { HostTransaction, MonthlyEarningsPoint } from '../../types/host';

interface EarningsTabProps {
  transactions: HostTransaction[];
  monthlyData: MonthlyEarningsPoint[];
  summaryMetrics: {
    totalEarnings: number;
    monthlyEarnings: number;
    pendingPayouts: number;
  };
}

export const EarningsTab: React.FC<EarningsTabProps> = ({
  transactions,
  monthlyData,
  summaryMetrics,
}) => {
  const [filterPeriod, setFilterPeriod] = useState<'6m' | '1y'>('6m');
  const [payoutRequested, setPayoutRequested] = useState(false);

  const handleRequestPayout = () => {
    setPayoutRequested(true);
    setTimeout(() => {
      setPayoutRequested(false);
    }, 4000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.04,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header and Illustrative Data Notice */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#123C3A] dark:text-[#E4EFEA]">Earnings & Financials</h2>
          <p className="text-sm text-gray-500 dark:text-[#8FAFA9] mt-0.5">
            Transparent revenue tracking, session fees, and weekly automated payouts
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-medium">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <span>Demo figures are for mock illustration only</span>
        </div>
      </motion.div>

      {/* Metrics Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="bg-white dark:bg-[#0D2422] rounded-2xl p-5 border border-gray-200/80 dark:border-[#183E3A] shadow-sm relative overflow-hidden cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-[#7A9E99] uppercase tracking-wider">Gross Lifetime</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#123C3A] dark:text-[#E4EFEA] mt-2">
            ₹{summaryMetrics.totalEarnings.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% from last month</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="bg-white dark:bg-[#0D2422] rounded-2xl p-5 border border-gray-200/80 dark:border-[#183E3A] shadow-sm cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-[#7A9E99] uppercase tracking-wider">This Month (Nov)</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-[#19C7B1] dark:text-[#18C5B7] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#123C3A] dark:text-[#E4EFEA] mt-2">
            ₹{summaryMetrics.monthlyEarnings.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-gray-500 dark:text-[#8FAFA9] mt-1">
            Targeting ₹38,000 this month
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="bg-white dark:bg-[#0D2422] rounded-2xl p-5 border border-gray-200/80 dark:border-[#183E3A] shadow-sm cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-[#7A9E99] uppercase tracking-wider">Pending Settlement</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-2">
            ₹{summaryMetrics.pendingPayouts.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-gray-500 dark:text-[#8FAFA9] mt-1">
            Releasing on upcoming Tuesday
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="bg-gradient-to-br from-[#123C3A] to-[#164846] dark:from-[#061B19] dark:to-[#0D2D29] border border-transparent dark:border-[#183E3A] text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Payout Account</span>
              <Wallet className="w-4 h-4 text-[#19C7B1] dark:text-[#18C5B7]" />
            </div>
            <div className="text-sm font-semibold mt-2 text-white">UPI •••• 9821</div>
            <div className="text-xs text-white/70">HDFC Bank Auto-Sweep</div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleRequestPayout}
            disabled={payoutRequested}
            className="mt-3 w-full py-2 px-3 rounded-xl bg-[#19C7B1] dark:bg-[#18C5B7] text-[#123C3A] dark:text-[#071715] font-bold text-xs hover:bg-[#16B29E] dark:hover:bg-[#2FE0D2] transition-all flex items-center justify-center gap-1.5 shadow cursor-pointer disabled:opacity-80"
          >
            {payoutRequested ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-950" />
                <span>Payout Scheduled!</span>
              </>
            ) : (
              <>
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Instant Payout (Demo)</span>
              </>
            )}
          </motion.button>
        </motion.div>
      </motion.div>

      {payoutRequested && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span>Demo payout request processed! ₹{summaryMetrics.pendingPayouts} will be credited to UPI ID •••• 9821 within 2 hours in production.</span>
        </div>
      )}

      {/* Chart Section */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-[#0D2422] rounded-2xl border border-gray-200/80 dark:border-[#183E3A] p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-[#E4EFEA]">Revenue Growth Trend</h3>
            <p className="text-xs text-gray-500 dark:text-[#8FAFA9]">Monthly charging revenue across all your active bays</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 dark:text-[#7A9E99]">Timeframe:</span>
            <div className="p-1 bg-gray-100 dark:bg-[#081B19] rounded-lg flex text-xs font-semibold">
              <button
                type="button"
                onClick={() => setFilterPeriod('6m')}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  filterPeriod === '6m' 
                    ? 'bg-white dark:bg-[#0D2422] shadow text-[#123C3A] dark:text-[#18C5B7]' 
                    : 'text-gray-600 dark:text-[#7A9E99]'
                }`}
              >
                Last 6 Months
              </button>
              <button
                type="button"
                onClick={() => setFilterPeriod('1y')}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  filterPeriod === '1y' 
                    ? 'bg-white dark:bg-[#0D2422] shadow text-[#123C3A] dark:text-[#18C5B7]' 
                    : 'text-gray-600 dark:text-[#7A9E99]'
                }`}
              >
                1 Year
              </button>
            </div>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-64 sm:h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="earningsColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#19C7B1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#19C7B1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:opacity-20" />
              <XAxis 
                dataKey="month" 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: '#8FAFA9', fontSize: 12 }} 
              />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: '#8FAFA9', fontSize: 12 }}
                tickFormatter={(value) => `₹${value / 1000}k`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as MonthlyEarningsPoint;
                    return (
                      <div className="bg-[#123C3A] dark:bg-[#061917] text-white p-3 rounded-xl shadow-xl border dark:border-[#183E3A] text-xs space-y-1">
                        <div className="font-bold text-[#19C7B1] dark:text-[#18C5B7]">{data.month}</div>
                        <div>Revenue: <span className="font-mono font-bold text-white">₹{data.earnings.toLocaleString('en-IN')}</span></div>
                        <div className="text-gray-300 dark:text-gray-400">Sessions: {data.bookings} bookings</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="earnings" 
                stroke="#18C5B7" 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#earningsColor)" 
                isAnimationActive={true}
                animationDuration={650}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Transactions History */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-[#0D2422] rounded-2xl border border-gray-200/80 dark:border-[#183E3A] shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-[#183E3A] flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-[#E4EFEA] text-base">Recent Settlements & Payouts</h3>
            <p className="text-xs text-gray-500 dark:text-[#8FAFA9]">Breakdown of every verified session credit to your account</p>
          </div>
          <button
            type="button"
            onClick={() => alert('Demo CSV export downloaded')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-[#E4EFEA] bg-gray-50 dark:bg-[#081B19] border border-gray-200 dark:border-[#183E3A] rounded-xl hover:bg-gray-100 dark:hover:bg-[#123431] transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-gray-500 dark:text-[#7A9E99]" />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F8F9FA] dark:bg-[#081B19] text-xs font-semibold text-gray-500 dark:text-[#7A9E99] uppercase tracking-wider border-b border-gray-200 dark:border-[#183E3A]">
              <tr>
                <th className="py-3 px-4">Transaction / Booking ID</th>
                <th className="py-3 px-4">Station</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Net Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#163834] text-xs">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50/70 dark:hover:bg-[#123431] transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-gray-900 dark:text-[#E4EFEA]">{tx.id}</span>
                    <span className="block text-[11px] text-gray-400 dark:text-[#7A9E99] font-mono">Ref: {tx.bookingId}</span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-gray-800 dark:text-[#E4EFEA]">
                    {tx.chargerName}
                  </td>
                  <td className="py-3.5 px-4 text-gray-500 dark:text-[#8FAFA9]">
                    {tx.date}
                  </td>
                  <td className="py-3.5 px-4 text-gray-600 dark:text-[#8FAFA9]">
                    {tx.payoutMethod || 'Direct Bank'}
                  </td>
                  <td className="py-3.5 px-4">
                    {tx.status === 'completed' || tx.status === 'settled' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        Settled
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        <Clock className="w-3 h-3" />
                        Pending Payout
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="font-bold text-[#123C3A] dark:text-[#18C5B7] text-sm">
                      +₹{(tx.amount || tx.netPayout || 0).toLocaleString('en-IN')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};
