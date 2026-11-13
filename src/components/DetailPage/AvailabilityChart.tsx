import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ReferenceLine,
} from 'recharts';

interface AvailabilityDataPoint {
  hour: string;
  hourNumber: number;
  occupancyPercent: number;
  isFree: boolean;
  statusLabel: string;
}

const GENERATE_24H_DATA = (): AvailabilityDataPoint[] => {
  const hours = [
    { h: '12 AM', occ: 15 },
    { h: '2 AM', occ: 10 },
    { h: '4 AM', occ: 10 },
    { h: '6 AM', occ: 25 },
    { h: '8 AM', occ: 60 },
    { h: '10 AM', occ: 85 },
    { h: '12 PM', occ: 90 },
    { h: '2 PM', occ: 70 },
    { h: '4 PM', occ: 65 },
    { h: '6 PM', occ: 95 },
    { h: '8 PM', occ: 80 },
    { h: '10 PM', occ: 40 },
  ];

  return hours.map((item, idx) => ({
    hour: item.h,
    hourNumber: idx * 2,
    occupancyPercent: item.occ,
    isFree: item.occ < 65,
    statusLabel: item.occ >= 65 ? 'Usually Busy' : 'Usually Free'
  }));
};

export const AvailabilityChart: React.FC = () => {
  const data = GENERATE_24H_DATA();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload as AvailabilityDataPoint;
      return (
        <div className="bg-white dark:bg-[#0D2422] border border-[#D9DED5] dark:border-[#1E4844] p-2.5 rounded-xl shadow-lg text-xs">
          <p className="font-bold text-[#123C3A] dark:text-white">{item.hour}</p>
          <p className={`font-semibold flex items-center gap-1.5 mt-0.5 ${item.isFree ? 'text-[#22C55E]' : 'text-[#7A8C89] dark:text-[#8FAFA9]'}`}>
            <span className={`w-2 h-2 rounded-full ${item.isFree ? 'bg-[#22C55E]' : 'bg-[#7A8C89]'}`} />
            {item.statusLabel} ({item.occupancyPercent}% capacity)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-5 rounded-card bg-[#E9EFE7] dark:bg-[#0D2422] border border-[#D9DED5] dark:border-[#183E3A] shadow-card-subtle transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-base font-bold text-[#123C3A] dark:text-[#E4EFEA] flex items-center gap-2">
            <span>Best time to visit</span>
            <span className="text-xs font-bold text-[#19C7B1] bg-white dark:bg-[#081B19] px-2 py-0.5 rounded-full border border-[#D9DED5] dark:border-[#183E3A]">
              Live Trend
            </span>
          </h3>
          <p className="text-xs text-[#5E716E] dark:text-[#8FAFA9]">
            Historical occupancy graph based on verified telemetry
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#22C55E]" />
            <span className="text-[#123C3A] dark:text-[#E4EFEA]">Free (&lt;65%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#7A8C89]" />
            <span className="text-[#5E716E] dark:text-[#8FAFA9]">Busy</span>
          </div>
        </div>
      </div>

      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <XAxis
              dataKey="hour"
              stroke="#5E716E"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#88ABA6', opacity: 0.3 }}
            />
            <YAxis
              stroke="#5E716E"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#88ABA6', opacity: 0.3 }}
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(25, 199, 177, 0.08)' }} />
            <ReferenceLine y={65} stroke="#7A8C89" strokeDasharray="3 3" opacity={0.6} />
            <Bar dataKey="occupancyPercent" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isFree ? '#22C55E' : '#7A8C89'}
                  fillOpacity={0.9}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 pt-3 border-t border-[#D9DED5] dark:border-[#183E3A] flex items-center justify-between text-xs text-[#5E716E] dark:text-[#8FAFA9]">
        <span>⚡ Quickest slots: <b className="text-[#123C3A] dark:text-[#18C5B7]">Early mornings (6-8 AM) & Late nights (after 10 PM)</b></span>
        <span className="text-[#19C7B1] font-bold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#19C7B1] animate-ping" />
          Optimal now
        </span>
      </div>
    </div>
  );
};
