import React from 'react';
import { 
  Bell, CheckCircle2, Clock, Zap, IndianRupee, 
  AlertCircle, X, CheckCheck 
} from 'lucide-react';
import { HostNotification } from '../../types/host';

interface NotificationPanelProps {
  notifications: HostNotification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onSelectNotification: (id: string) => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkAllAsRead,
  onSelectNotification,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: HostNotification['type']) => {
    switch (type) {
      case 'booking':
        return <Clock className="w-4 h-4 text-blue-500 dark:text-blue-400" />;
      case 'payout':
        return <IndianRupee className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />;
      case 'charger':
        return <Zap className="w-4 h-4 text-[#18C5B7]" />;
      case 'alert':
        return <AlertCircle className="w-4 h-4 text-amber-500 dark:text-amber-400" />;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/20 dark:bg-black/50 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* Flyout Dropdown */}
      <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 bg-white dark:bg-[#0D2422] rounded-2xl shadow-2xl border border-gray-100 dark:border-[#1C4642] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
        
        {/* Header */}
        <div className="p-4 bg-gray-50/80 dark:bg-[#091D1B] border-b border-gray-100 dark:border-[#163B37] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#073B35] dark:text-[#18C5B7]" />
            <h4 className="font-bold text-sm text-gray-900 dark:text-white">Notifications</h4>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#18C5B7] text-[#073B35] font-black text-[10px]">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllAsRead}
                className="text-[11px] font-semibold text-[#18C5B7] hover:underline transition-colors flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark read</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#153B37] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-gray-50 dark:divide-[#143B37]">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-400 dark:text-gray-500">
              No recent notifications
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => onSelectNotification(n.id)}
                className={`p-3.5 flex items-start gap-3 hover:bg-gray-50/80 dark:hover:bg-[#091D1B] transition-colors cursor-pointer ${
                  !n.read ? 'bg-[#18C5B7]/5 dark:bg-[#18C5B7]/10' : ''
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-[#071715] flex items-center justify-center flex-shrink-0 mt-0.5">
                  {getIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h5 className={`text-xs font-bold truncate ${!n.read ? 'text-[#073B35] dark:text-[#18C5B7]' : 'text-gray-800 dark:text-gray-200'}`}>
                      {n.title}
                    </h5>
                    <span className="text-[10px] text-gray-400 dark:text-[#7A9E99] font-mono flex-shrink-0">{n.time}</span>
                  </div>
                  <p className="text-[11px] text-gray-600 dark:text-[#88ABA6] mt-0.5 leading-snug">
                    {n.message}
                  </p>
                </div>

                {!n.read && (
                  <span className="w-2 h-2 rounded-full bg-[#18C5B7] shadow-[0_0_6px_rgba(24,197,183,0.7)] flex-shrink-0 mt-2" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 bg-gray-50 dark:bg-[#091D1B] text-center border-t border-gray-100 dark:border-[#163B37] text-[11px] text-gray-400 dark:text-[#7A9E99] font-medium">
          Automated Go Charge Host Alerts
        </div>

      </div>
    </>
  );
};
