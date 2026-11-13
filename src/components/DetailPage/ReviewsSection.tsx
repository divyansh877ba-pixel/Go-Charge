import React from 'react';
import { StationReview } from '../../types';
import { Star } from 'lucide-react';

interface ReviewsSectionProps {
  reviews: StationReview[];
  reviewsCount: number;
  rating: number;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  reviewsCount,
  rating
}) => {
  return (
    <div className="p-5 rounded-card bg-[#E9EFE7] dark:bg-[#0D2422] border border-[#D9DED5] dark:border-[#183E3A] shadow-card-subtle transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-[#123C3A] dark:text-[#E4EFEA] flex items-center gap-2">
            <span>Community Reviews</span>
            <span className="text-xs font-bold text-[#123C3A] dark:text-white flex items-center gap-1 bg-white dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#183E3A] px-2 py-0.5 rounded-full">
              <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
              {rating}
            </span>
          </h3>
          <p className="text-xs text-[#5E716E] dark:text-[#8FAFA9]">
            Verified feedback from EV drivers who charged here
          </p>
        </div>

        <button className="text-xs font-bold text-[#19C7B1] hover:underline transition-colors">
          See all {reviewsCount} reviews →
        </button>
      </div>

      <div className="space-y-3">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-3.5 rounded-xl bg-white dark:bg-[#081B19] border border-[#D9DED5] dark:border-[#183E3A] space-y-2 hover:border-[#19C7B1] transition-colors shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#E9EFE7] dark:bg-[#112D2B] text-xs font-bold text-[#123C3A] dark:text-[#19C7B1] flex items-center justify-center border border-[#D9DED5] dark:border-[#183E3A]">
                  {rev.author.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#123C3A] dark:text-white leading-tight">
                    {rev.author}
                  </p>
                  <p className="text-[10px] text-[#19C7B1] font-semibold">
                    {rev.vehicle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-[#5E716E] dark:text-[#8FAFA9]">
                <div className="flex text-[#F59E0B]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'opacity-25'}`}
                    />
                  ))}
                </div>
                <span className="text-[10px] ml-1">{rev.date}</span>
              </div>
            </div>

            <p className="text-xs text-[#14201F] dark:text-[#E4EFEA] leading-relaxed">
              "{rev.comment}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
