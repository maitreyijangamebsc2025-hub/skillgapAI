import React, { useState } from 'react';
import { AnalyzedSkill, CategoryStat } from '../types/skills';
import { HelpCircle, Sparkles, CheckCircle2, AlertCircle, ArrowUpRight, BookOpen, Layers } from 'lucide-react';

interface ExecutiveSummaryCardsProps {
  score: number;
  rawCoveragePct?: number;
  topN: number;
  coveredCount: number;
  partialCount: number;
  gapCount: number;
  surplusCount: number;
  totalEvaluatedDemand?: number;
  coveredDemandWeight?: number;
  criticalGaps: AnalyzedSkill[];
  categoryStats: CategoryStat[];
  onViewGaps: () => void;
  onViewRecommendations: () => void;
  onFilterSkill: (skill: string) => void;
  isSimulated?: boolean;
  simulationDelta?: number;
  onOpenSimulation?: () => void;
}

export const ExecutiveSummaryCards: React.FC<ExecutiveSummaryCardsProps> = ({
  score,
  rawCoveragePct = 0,
  topN,
  coveredCount,
  partialCount,
  gapCount,
  surplusCount,
  totalEvaluatedDemand = 0,
  coveredDemandWeight = 0,
  onViewGaps,
  isSimulated = false,
  simulationDelta = 0,
  onOpenSimulation,
}) => {
  const [showFormulaTooltip, setShowFormulaTooltip] = useState<boolean>(false);

  return (
    <div className="space-y-4 mb-8">
      {/* 4 Cards Grid: Weighted Score, Covered, Partial, Gap/Surplus */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: DEMAND-WEIGHTED ALIGNMENT SCORE */}
        <div className="relative p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0d1424] text-slate-900 dark:text-white transition-colors shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] tracking-widest uppercase text-slate-500 dark:text-slate-400 font-bold">
                WEIGHTED ALIGNMENT
              </span>
              <button
                onClick={() => setShowFormulaTooltip(!showFormulaTooltip)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
                title="View weighted formula explanation"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400 font-mono">
                {score.toFixed(1)}%
              </span>
              {isSimulated && simulationDelta > 0 && (
                <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                  +{simulationDelta.toFixed(1)}% (Simulated)
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
              Demand-weighted score across top {topN} market skills
            </p>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Raw count coverage: {rawCoveragePct}%</span>
            {onOpenSimulation && (
              <button
                onClick={onOpenSimulation}
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer inline-flex items-center gap-0.5"
              >
                <span>What-If?</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Formula Explanation Popover */}
          {showFormulaTooltip && (
            <div className="absolute top-12 left-0 right-0 sm:-right-24 z-30 p-4 rounded-xl bg-slate-900 text-white text-xs shadow-2xl border border-slate-700 animate-in fade-in">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
                <span className="font-bold text-emerald-400 font-mono text-xs">Demand-Weighted Alignment Formula</span>
                <button
                  onClick={() => setShowFormulaTooltip(false)}
                  className="text-slate-400 hover:text-white text-sm cursor-pointer"
                >
                  &times;
                </button>
              </div>

              {/* Exact Formula Card */}
              <div className="p-3 mb-2.5 rounded-lg bg-slate-800/90 border border-slate-700 font-mono text-xs text-center text-slate-100">
                <div className="font-bold text-emerald-300 mb-1">
                  Alignment Score = [ &Sigma;<sub>i=1..N</sub> (c<sub>i</sub> &times; w<sub>i</sub>) / &Sigma;<sub>i=1..N</sub> w<sub>i</sub> ] &times; 100
                </div>
                <div className="text-[10px] text-slate-400">
                  Exact formula executed in src/utils/skillMatcher.ts
                </div>
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-300 leading-relaxed mb-3">
                <div className="flex items-start gap-1.5">
                  <span className="font-mono text-emerald-400 font-bold shrink-0">N:</span>
                  <span>Evaluated skill pool (Top {topN} in-demand skills by market frequency).</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="font-mono text-emerald-400 font-bold shrink-0">w<sub>i</sub>:</span>
                  <span>Empirical market demand percentage weight of skill <em>i</em>.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="font-mono text-emerald-400 font-bold shrink-0">c<sub>i</sub>:</span>
                  <span>Curriculum depth credit factor:</span>
                </div>
                <div className="pl-4 space-y-0.5 text-[10.5px] font-mono">
                  <div className="text-emerald-300">&bull; c<sub>i</sub> = 1.00 &rarr; COVERED (Depth 3 or 4: practical lab / advanced capstone)</div>
                  <div className="text-amber-300">&bull; c<sub>i</sub> = 0.50 &rarr; PARTIAL (Depth 2: foundational theory / parent-child)</div>
                  <div className="text-amber-300">&bull; c<sub>i</sub> = 0.25 &rarr; PARTIAL (Depth 1: mentioned / related concept)</div>
                  <div className="text-rose-400">&bull; c<sub>i</sub> = 0.00 &rarr; GAP (Depth 0: not taught in curriculum)</div>
                </div>
              </div>

              {/* Live Evaluation Values */}
              <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800 font-mono text-[10px] text-slate-300 flex flex-col gap-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Credited Demand Weight (&Sigma; c<sub>i</sub> &times; w<sub>i</sub>):</span>
                  <span className="font-bold text-emerald-400">{coveredDemandWeight.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Evaluated Demand (&Sigma; w<sub>i</sub>):</span>
                  <span className="font-bold text-slate-200">{totalEvaluatedDemand.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-800 font-bold">
                  <span className="text-emerald-400">Calculated Alignment Score:</span>
                  <span className="text-emerald-400">
                    ({coveredDemandWeight.toFixed(1)} / {totalEvaluatedDemand.toFixed(1)}) &times; 100 = {score.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Card 2: COVERED (Sufficiently Taught) */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0d1424] text-slate-900 dark:text-white transition-colors shadow-xs flex flex-col justify-between">
          <div>
            <div className="font-mono text-[10px] tracking-widest uppercase text-emerald-600 dark:text-emerald-400 font-bold mb-2 flex items-center justify-between">
              <span>COVERED SKILLS</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                Depth 3-4
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-1 font-mono">
              {coveredCount.toString().padStart(2, '0')}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
              Sufficient depth with practical labs or advanced capstones
            </p>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
            &bull; 100% demand weight credit
          </div>
        </div>

        {/* Card 3: PARTIAL (Insufficient Depth / Theory / Related) */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0d1424] text-slate-900 dark:text-white transition-colors shadow-xs flex flex-col justify-between">
          <div>
            <div className="font-mono text-[10px] tracking-widest uppercase text-amber-600 dark:text-amber-400 font-bold mb-2 flex items-center justify-between">
              <span>PARTIAL COVERAGE</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                Depth 1-2
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-amber-600 dark:text-amber-400 mb-1 font-mono">
              {partialCount.toString().padStart(2, '0')}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
              Mentioned, theoretical, or covered via parent/child skill
            </p>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-amber-600 dark:text-amber-400">
            &bull; Proportional depth credit (25%–50%)
          </div>
        </div>

        {/* Card 4: MARKET GAPS & SURPLUS */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0d1424] text-slate-900 dark:text-white transition-colors shadow-xs flex flex-col justify-between">
          <div>
            <div className="font-mono text-[10px] tracking-widest uppercase text-rose-600 dark:text-rose-500 font-bold mb-2 flex items-center justify-between">
              <span>MARKET GAPS</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                Depth 0
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-rose-600 dark:text-rose-500 mb-1 font-mono">
              {gapCount.toString().padStart(2, '0')}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
              High-demand industry skills missing from syllabus
            </p>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Surplus skills: {surplusCount}</span>
            <button onClick={onViewGaps} className="hover:text-blue-500 underline cursor-pointer">
              Review &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
