import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts';
import { AnalyzedSkill } from '../types/skills';

interface TopDemandBarChartProps {
  skills: AnalyzedSkill[];
  topCount?: number;
  darkMode?: boolean;
  onViewFullMatrix?: () => void;
}

export const TopDemandBarChart: React.FC<TopDemandBarChartProps> = ({
  skills,
  topCount = 15,
  darkMode = false,
  onViewFullMatrix,
}) => {
  const topSkills = skills.slice(0, topCount).map((s) => ({
    name: s.skill,
    demand_pct: s.demand_pct,
    status: s.status,
    category: s.category,
    count: s.count,
    matching_course: s.matching_course,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isCovered = data.status === 'COVERED';

      return (
        <div className="bg-white dark:bg-slate-900 p-3 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 text-xs max-w-xs z-50">
          <div className="flex items-center justify-between gap-3 mb-1.5">
            <span className="font-bold text-slate-900 dark:text-white capitalize text-sm">
              {data.name}
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                isCovered
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
              }`}
            >
              {data.status}
            </span>
          </div>

          <div className="space-y-1 text-slate-600 dark:text-slate-400">
            <div className="flex justify-between">
              <span>Market Demand:</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                {data.demand_pct}%
              </span>
            </div>
            {data.count && (
              <div className="flex justify-between">
                <span>Job Postings:</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                  {data.count.toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Domain:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {data.category}
              </span>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-0.5">Curriculum Status:</span>
              <span className={`text-[11px] font-medium ${isCovered ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {isCovered
                  ? `✓ Taught in ${data.matching_course || 'Curriculum'}`
                  : '✗ Gap: Missing from syllabus'}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-lg border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
      {/* Panel Header */}
      <div className="px-5 py-3.5 bg-slate-50/70 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <span className="font-semibold text-xs tracking-tight text-slate-900 dark:text-white">
          Industry Demand vs Curriculum Coverage
        </span>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600 dark:bg-emerald-500 inline-block"></span>
            Covered
          </span>
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <span className="w-2.5 h-2.5 rounded-xs bg-rose-600 dark:bg-rose-500 inline-block"></span>
            Gap
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="p-5 h-[340px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={topSkills}
            margin={{ top: 15, right: 10, left: -20, bottom: 25 }}
          >
            <CartesianGrid
              strokeDasharray="2 2"
              vertical={false}
              stroke={darkMode ? '#1f2937' : '#f3f4f6'}
            />
            <XAxis
              dataKey="name"
              angle={-35}
              textAnchor="end"
              interval={0}
              height={50}
              tickFormatter={(val: string) => val.charAt(0).toUpperCase() + val.slice(1)}
              tick={{
                fill: darkMode ? '#9ca3af' : '#6b7280',
                fontSize: 10.5,
                fontFamily: 'Geist, sans-serif',
              }}
            />
            <YAxis
              tickFormatter={(v) => `${v}%`}
              domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.15)]}
              tick={{
                fill: darkMode ? '#9ca3af' : '#6b7280',
                fontSize: 10,
                fontFamily: 'Geist Mono, monospace',
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="demand_pct" radius={[3, 3, 0, 0]}>
              {topSkills.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.status === 'COVERED' ? '#059669' : '#dc2626'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Panel Footer */}
      <div className="px-5 py-3 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Detailed Skill Matrix visualization (Top {topCount} skills shown)
        </p>
        {onViewFullMatrix && (
          <button
            onClick={onViewFullMatrix}
            className="px-3 py-1.5 rounded-md text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            Full Data View
          </button>
        )}
      </div>
    </div>
  );
};
