import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from 'recharts';
import { CategoryStat } from '../types/skills';

interface CategoryRadarChartProps {
  categoryStats: CategoryStat[];
  darkMode?: boolean;
}

export const CategoryRadarChart: React.FC<CategoryRadarChartProps> = ({
  categoryStats,
  darkMode = false,
}) => {
  const radarData = categoryStats.map((item) => ({
    category: item.category,
    coverage: item.coveragePct,
    total: item.totalMarket,
    covered: item.covered,
    gap: item.gap,
    fullMark: 100,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-900 p-3 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 text-xs z-50">
          <div className="font-bold text-slate-900 dark:text-white text-sm mb-1">
            {data.category} Domain
          </div>
          <div className="space-y-1 text-slate-600 dark:text-slate-400">
            <div className="flex justify-between gap-4">
              <span>Curriculum Coverage:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {data.coverage}%
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Skills Covered:</span>
              <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                {data.covered} of {data.total}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Domain Gaps:</span>
              <span className="font-mono font-semibold text-rose-600 dark:text-rose-400">
                {data.gap}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-lg border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 block mb-0.5">
            Domain Distribution
          </span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Category Coverage Radar
          </h3>
        </div>
        <span className="font-mono text-xs text-slate-400">6 Competency Pillars</span>
      </div>

      <div className="h-64 w-full my-auto">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
            <PolarGrid stroke={darkMode ? '#1f2937' : '#f3f4f6'} />
            <PolarAngleAxis
              dataKey="category"
              tick={{
                fill: darkMode ? '#d1d5db' : '#374151',
                fontSize: 10.5,
                fontWeight: 600,
                fontFamily: 'Geist, sans-serif',
              }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{
                fill: darkMode ? '#9ca3af' : '#6b7280',
                fontSize: 9,
                fontFamily: 'Geist Mono, monospace',
              }}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Radar
              name="Coverage %"
              dataKey="coverage"
              stroke="#2563eb"
              fill="#2563eb"
              fillOpacity={0.25}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono">
        {categoryStats.map((c) => (
          <div
            key={c.category}
            className="p-1.5 rounded bg-slate-50 dark:bg-slate-850 flex items-center justify-between text-slate-700 dark:text-slate-300"
          >
            <span className="truncate">{c.category}:</span>
            <span
              className={`font-bold ml-1 ${
                c.coveragePct >= 70
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : c.coveragePct >= 40
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {c.coveragePct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
