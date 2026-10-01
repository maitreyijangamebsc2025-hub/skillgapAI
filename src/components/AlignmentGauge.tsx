import React from 'react';
import { Target, CheckCircle2, AlertTriangle, Layers, TrendingUp } from 'lucide-react';

interface AlignmentGaugeProps {
  score: number;
  topN: number;
  coveredInTopN: number;
  totalMarketSkills: number;
  coveredCount: number;
  gapCount: number;
  surplusCount: number;
}

export const AlignmentGauge: React.FC<AlignmentGaugeProps> = ({
  score,
  topN,
  coveredInTopN,
  totalMarketSkills,
  coveredCount,
  gapCount,
  surplusCount,
}) => {
  // SVG gauge calculations
  // Arc from 180 to 0 degrees (radius = 80, center = (100, 95))
  const radius = 75;
  const circumference = Math.PI * radius; // Half circle length ~ 235.6
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let scoreColor = '#10b981'; // emerald
  let scoreClass = 'text-emerald-500';
  let badgeText = 'Strong Market Alignment';
  let badgeBg = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';

  if (score < 50) {
    scoreColor = '#ef4444'; // rose/red
    scoreClass = 'text-rose-500';
    badgeText = 'Critical Industry Gaps';
    badgeBg = 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800';
  } else if (score < 75) {
    scoreColor = '#f59e0b'; // amber
    scoreClass = 'text-amber-500';
    badgeText = 'Moderate Market Alignment';
    badgeBg = 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm flex flex-col justify-between transition-colors">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-500" />
            Overall Market Alignment Score
          </h3>
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badgeBg}`}>
            {badgeText}
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Percentage of top-{topN} industry skills covered by the curriculum.
        </p>
      </div>

      {/* Large Gauge Graphic */}
      <div className="relative flex flex-col items-center justify-center my-3">
        <svg viewBox="0 0 200 120" className="w-56 h-36">
          {/* Background Track */}
          <path
            d="M 25 100 A 75 75 0 0 1 175 100"
            fill="none"
            stroke="currentColor"
            className="text-slate-100 dark:text-slate-800"
            strokeWidth="16"
            strokeLinecap="round"
          />
          {/* Progress Arc */}
          <path
            d="M 25 100 A 75 75 0 0 1 175 100"
            fill="none"
            stroke={scoreColor}
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Score Text */}
        <div className="absolute top-[52px] flex flex-col items-center">
          <span className={`text-4xl sm:text-5xl font-black tracking-tight ${scoreClass}`}>
            {score}%
          </span>
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            {coveredInTopN} of {topN} Top Skills
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Covered</div>
          <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">
            {coveredCount}
          </div>
          <div className="text-[9px] text-slate-400">skills taught</div>
        </div>

        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Gaps</div>
          <div className="text-base font-bold text-rose-600 dark:text-rose-400">
            {gapCount}
          </div>
          <div className="text-[9px] text-slate-400">missing skills</div>
        </div>

        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Surplus</div>
          <div className="text-base font-bold text-amber-600 dark:text-amber-400">
            {surplusCount}
          </div>
          <div className="text-[9px] text-slate-400">niche/curriculum</div>
        </div>
      </div>
    </div>
  );
};
