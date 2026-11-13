import React, { useState } from 'react';
import { 
  Star, MessageSquare, ThumbsUp, CheckCircle2, 
  Send, CornerDownRight, Car, User, ShieldCheck, Filter 
} from 'lucide-react';
import { HostReview } from '../../types/host';
import { INITIAL_HOST_REVIEWS } from '../../data/mockHostData';

export const ReviewsTab: React.FC = () => {
  const [reviews, setReviews] = useState<HostReview[]>(INITIAL_HOST_REVIEWS);
  const [replyText, setReplyText] = useState<{ [id: string]: string }>({});
  const [replyingId, setReplyingId] = useState<string | null>(null);

  const handleSendReply = (reviewId: string) => {
    const text = replyText[reviewId]?.trim();
    if (!text) return;

    setReviews(prev =>
      prev.map(r => r.id === reviewId ? { ...r, reply: text } : r)
    );
    setReplyingId(null);
    setReplyText(prev => ({ ...prev, [reviewId]: '' }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-[#E4EFEA] tracking-tight">Driver Reviews & Ratings</h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-[#8FAFA9] mt-0.5">
            Verified feedback from EV drivers who have charged at your stations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>100% Verified Drivers</span>
          </span>
        </div>
      </div>

      {/* Ratings Overview Card */}
      <div className="bg-white dark:bg-[#0D2422] rounded-2xl p-6 border border-gray-100 dark:border-[#183E3A] shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Left score (col-span-4) */}
        <div className="md:col-span-4 text-center md:text-left md:border-r md:border-gray-100 dark:md:border-[#183E3A] md:pr-6 space-y-2">
          <div className="text-5xl font-black text-[#073B35] dark:text-[#18C5B7]">4.8</div>
          <div className="flex items-center justify-center md:justify-start gap-1 text-amber-400">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-5 h-5 fill-current" />
            ))}
          </div>
          <p className="text-xs text-gray-500 dark:text-[#8FAFA9]">Based on 133 verified community ratings</p>
          <div className="text-xs font-bold text-[#18C5B7]">94% of drivers recommend your bays</div>
        </div>

        {/* Right Distribution Bars (col-span-8) */}
        <div className="md:col-span-8 space-y-2">
          {[
            { stars: '5 Stars', pct: 82, count: 109 },
            { stars: '4 Stars', pct: 14, count: 19 },
            { stars: '3 Stars', pct: 3, count: 4 },
            { stars: '2 Stars', pct: 1, count: 1 },
            { stars: '1 Star', pct: 0, count: 0 },
          ].map((bar, i) => (
            <div key={i} className="flex items-center gap-3 text-xs">
              <span className="w-14 text-gray-600 dark:text-[#8FAFA9] font-medium">{bar.stars}</span>
              <div className="flex-1 h-2.5 bg-gray-100 dark:bg-[#081B19] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#18C5B7] to-[#073B35] dark:to-[#2FE0D2] rounded-full transition-all duration-300"
                  style={{ width: `${bar.pct}%` }}
                />
              </div>
              <span className="w-10 text-right text-gray-400 dark:text-[#7A9E99] font-mono text-[11px]">{bar.count}</span>
            </div>
          ))}
        </div>

      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white dark:bg-[#0D2422] rounded-2xl p-5 sm:p-6 border border-gray-100 dark:border-[#183E3A] shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#073B35] dark:bg-[#18C5B7] text-white dark:text-[#071715] flex items-center justify-center font-bold text-sm">
                  {rev.author[0]}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-[#E4EFEA]">{rev.author}</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-[#7A9E99]">
                    <span className="flex items-center gap-1">
                      <Car className="w-3.5 h-3.5" />
                      <span>{rev.vehicle}</span>
                    </span>
                    <span>•</span>
                    <span>{rev.chargerName}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-[11px] text-gray-400 dark:text-[#7A9E99]">{rev.date}</span>
              </div>
            </div>

            <p className="text-sm text-gray-700 dark:text-[#CBDCD6] leading-relaxed pt-1">
              "{rev.comment}"
            </p>

            {/* Host Reply if present */}
            {rev.reply ? (
              <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#081B19] border border-gray-200/60 dark:border-[#183E3A] ml-4 sm:ml-8 flex items-start gap-2.5 text-xs">
                <CornerDownRight className="w-4 h-4 text-[#18C5B7] flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-[#073B35] dark:text-[#18C5B7]">Host Response</span>
                  <p className="text-gray-600 dark:text-[#8FAFA9] leading-relaxed">{rev.reply}</p>
                </div>
              </div>
            ) : (
              <div className="pt-2 flex justify-end">
                {replyingId === rev.id ? (
                  <div className="w-full flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="Write your host reply..."
                      value={replyText[rev.id] || ''}
                      onChange={(e) => setReplyText({ ...replyText, [rev.id]: e.target.value })}
                      className="flex-1 px-3.5 py-2 text-xs bg-gray-50 dark:bg-[#081B19] border border-gray-200 dark:border-[#183E3A] text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#18C5B7]"
                    />
                    <button
                      type="button"
                      onClick={() => handleSendReply(rev.id)}
                      className="px-4 py-2 rounded-xl bg-[#073B35] dark:bg-[#18C5B7] text-white dark:text-[#071715] font-bold text-xs hover:bg-[#0a4e47] dark:hover:bg-[#2FE0D2] transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3 h-3 text-[#18C5B7] dark:text-[#071715]" />
                      <span>Reply</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setReplyingId(null)}
                      className="px-3 py-2 rounded-xl text-gray-400 dark:text-[#7A9E99] hover:text-gray-600 dark:hover:text-white text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setReplyingId(rev.id)}
                    className="text-xs font-semibold text-[#18C5B7] hover:text-[#073B35] dark:hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Reply as Host</span>
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
