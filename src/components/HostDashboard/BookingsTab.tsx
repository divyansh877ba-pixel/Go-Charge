import React, { useState } from 'react';
import { 
  CalendarCheck, Clock, Search, Filter, CheckCircle2, XCircle, 
  Car, User, Phone, Zap, AlertCircle, ArrowUpRight, IndianRupee 
} from 'lucide-react';
import { HostBooking, BookingStatus } from '../../types/host';

interface BookingsTabProps {
  bookings: HostBooking[];
  onUpdateStatus: (id: string, status: BookingStatus) => void;
}

export const BookingsTab: React.FC<BookingsTabProps> = ({
  bookings,
  onUpdateStatus
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | BookingStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<HostBooking | null>(null);

  const filteredBookings = bookings.filter((b) => {
    if (filterStatus !== 'all' && b.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCustomer = b.customerName.toLowerCase().includes(q);
      const matchVehicle = b.vehicleModel.toLowerCase().includes(q);
      const matchCharger = b.chargerName.toLowerCase().includes(q);
      const matchPhone = b.customerPhone.includes(q);
      if (!matchCustomer && !matchVehicle && !matchCharger && !matchPhone) return false;
    }
    return true;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'upcoming':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
            Upcoming
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <XCircle className="w-3.5 h-3.5" />
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Demo Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#123C3A] dark:text-[#E4EFEA]">Bookings Management</h2>
          <p className="text-sm text-gray-500 dark:text-[#8FAFA9] mt-0.5">
            Manage charging sessions reserved by EV drivers at your stations
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#19C7B1]/10 text-[#123C3A] dark:text-[#18C5B7] text-xs font-medium border border-[#19C7B1]/30 dark:border-[#18C5B7]/30">
          <AlertCircle className="w-3.5 h-3.5 text-[#19C7B1] dark:text-[#18C5B7]" />
          <span>Interactive Demo Data</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Status Tabs */}
        <div className="flex items-center p-1 bg-gray-100/80 dark:bg-[#081B19] rounded-xl border border-gray-200 dark:border-[#183E3A] text-xs font-medium overflow-x-auto no-scrollbar">
          {(['all', 'upcoming', 'completed', 'cancelled'] as const).map((status) => {
            const count = status === 'all' 
              ? bookings.length 
              : bookings.filter((b) => b.status === status).length;
            const active = filterStatus === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-2 rounded-lg capitalize whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  active
                    ? 'bg-white dark:bg-[#0D2422] text-[#123C3A] dark:text-[#18C5B7] shadow-sm font-semibold'
                    : 'text-gray-600 dark:text-[#7A9E99] hover:text-gray-900 dark:hover:text-[#E4EFEA]'
                }`}
              >
                <span>{status === 'all' ? 'All Bookings' : status}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  active 
                    ? 'bg-[#123C3A] dark:bg-[#18C5B7] text-white dark:text-[#071715]' 
                    : 'bg-gray-200 dark:bg-[#14322F] text-gray-700 dark:text-[#A3B8B5]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#7A9E99]" />
          <input
            type="text"
            placeholder="Search by driver name, vehicle, or charger..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-[#0D2422] border border-gray-200 dark:border-[#183E3A] text-gray-900 dark:text-[#E4EFEA] placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#19C7B1] dark:focus:ring-[#18C5B7] focus:border-transparent transition-shadow"
          />
        </div>
      </div>

      {/* Bookings Content */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white dark:bg-[#0D2422] rounded-2xl border border-dashed border-gray-300 dark:border-[#183E3A] p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-[#081B19] flex items-center justify-center mx-auto mb-3 text-gray-400 dark:text-[#7A9E99]">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-gray-800 dark:text-[#E4EFEA]">No bookings found</h3>
          <p className="text-xs text-gray-500 dark:text-[#8FAFA9] mt-1 max-w-sm mx-auto">
            {searchQuery.trim()
              ? `No bookings match "${searchQuery}". Try clearing search or switching status.`
              : `There are currently no ${filterStatus !== 'all' ? filterStatus : ''} bookings registered.`}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white dark:bg-[#0D2422] rounded-2xl border border-gray-200/80 dark:border-[#183E3A] shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F8F9FA] dark:bg-[#081B19] border-b border-gray-200 dark:border-[#183E3A] text-xs font-semibold text-gray-600 dark:text-[#7A9E99] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Driver & Vehicle</th>
                  <th className="py-3.5 px-4">Station</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Energy / Duration</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#163834]">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/70 dark:hover:bg-[#123431] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-gray-900 dark:text-[#E4EFEA]">{b.customerName}</div>
                      <div className="text-xs text-gray-500 dark:text-[#8FAFA9] flex items-center gap-1.5 mt-0.5">
                        <Car className="w-3 h-3 text-gray-400 dark:text-[#7A9E99]" />
                        <span>{b.vehicleModel}</span>
                        <span>•</span>
                        <span className="font-mono">{b.customerPhone}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-gray-800 dark:text-[#E4EFEA]">{b.chargerName}</div>
                      <div className="text-xs text-gray-500 dark:text-[#7A9E99] font-mono">ID: {b.id}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-gray-800 dark:text-[#CBDCD6] flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400 dark:text-[#7A9E99]" />
                        <span>{b.dateTime}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-gray-800 dark:text-[#E4EFEA] flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-[#19C7B1] dark:text-[#18C5B7]" />
                        <span>{b.energyKwh || b.estimatedKwh || 0} kWh</span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-[#8FAFA9]">{b.durationMinutes} mins slot</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#123C3A] dark:text-[#18C5B7] flex items-center">
                        <IndianRupee className="w-3.5 h-3.5" />
                        <span>{b.amount || b.totalAmount || 0}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(b.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {b.status === 'upcoming' && (
                          <>
                            <button
                              type="button"
                              onClick={() => onUpdateStatus(b.id, 'completed')}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 transition-colors"
                              title="Mark session as completed"
                            >
                              Complete
                            </button>
                            <button
                              type="button"
                              onClick={() => onUpdateStatus(b.id, 'cancelled')}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 transition-colors"
                              title="Cancel booking"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {b.status === 'completed' && (
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium px-2 py-1 bg-emerald-50 dark:bg-emerald-950/40 rounded-md">
                            Paid & Verified
                          </span>
                        )}
                        {b.status === 'cancelled' && (
                          <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                            Cancelled
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile & Tablet Card View */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-3">
            {filteredBookings.map((b) => (
              <div
                key={b.id}
                className="bg-white dark:bg-[#0D2422] rounded-2xl border border-gray-200 dark:border-[#183E3A] p-4 shadow-sm hover:shadow-md transition-shadow space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-[#E4EFEA] text-sm">{b.customerName}</h3>
                    <p className="text-xs text-gray-500 dark:text-[#8FAFA9] flex items-center gap-1 mt-0.5">
                      <Car className="w-3 h-3 text-gray-400 dark:text-[#7A9E99]" />
                      <span>{b.vehicleModel}</span>
                    </p>
                  </div>
                  {getStatusBadge(b.status)}
                </div>

                <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#081B19] border border-transparent dark:border-[#183E3A] text-xs space-y-1.5">
                  <div className="flex justify-between text-gray-600 dark:text-[#8FAFA9]">
                    <span className="text-gray-400 dark:text-[#7A9E99]">Station:</span>
                    <span className="font-medium text-gray-800 dark:text-[#E4EFEA] text-right">{b.chargerName}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-[#8FAFA9]">
                    <span className="text-gray-400 dark:text-[#7A9E99]">Date/Time:</span>
                    <span className="font-medium text-gray-800 dark:text-[#CBDCD6]">{b.dateTime}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-[#8FAFA9]">
                    <span className="text-gray-400 dark:text-[#7A9E99]">Energy & Duration:</span>
                    <span className="font-medium text-gray-800 dark:text-[#E4EFEA]">{b.energyKwh || b.estimatedKwh || 0} kWh ({b.durationMinutes}m)</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-gray-200 dark:border-[#183E3A] font-bold">
                    <span className="text-gray-600 dark:text-[#8FAFA9]">Total Payout:</span>
                    <span className="text-[#123C3A] dark:text-[#18C5B7] text-sm flex items-center">
                      <IndianRupee className="w-3.5 h-3.5" />
                      {b.amount || b.totalAmount || 0}
                    </span>
                  </div>
                </div>

                {/* Mobile action bar */}
                {b.status === 'upcoming' ? (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => onUpdateStatus(b.id, 'completed')}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors text-center"
                    >
                      Mark Completed
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateStatus(b.id, 'cancelled')}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors text-center"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-1 text-xs text-gray-500 dark:text-[#8FAFA9] font-medium">
                    {b.status === 'completed' ? 'Session successfully settled' : 'Booking was cancelled'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
