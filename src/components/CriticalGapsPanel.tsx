import React from 'react';
import { Sparkles, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { AnalyzedSkill } from '../types/skills';

interface CriticalGapsPanelProps {
  criticalGaps: AnalyzedSkill[];
  onFilterSkill: (skill: string) => void;
  onGenerateRecs: () => void;
  onDownloadPDF: () => void;
  onDownloadCSV: () => void;
  isExporting: boolean;
}

export const CriticalGapsPanel: React.FC<CriticalGapsPanelProps> = ({
  criticalGaps,
  onFilterSkill,
  onGenerateRecs,
  onDownloadPDF,
  onDownloadCSV,
  isExporting,
}) => {
  return (
    <div className="flex flex-col gap-5">
      {/* Critical Gaps Panel */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800/90 bg-white dark:bg-[#0d1424] overflow-hidden shadow-xs transition-colors">
        <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
          <span className="font-semibold text-xs tracking-tight text-slate-900 dark:text-white">
            Critical Market Gaps
          </span>
        </div>

        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {criticalGaps.slice(0, 4).map((gap) => (
            <li
              key={gap.skill}
              onClick={() => onFilterSkill(gap.skill)}
              className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition"
            >
              <span className="px-2.5 py-1 rounded text-xs font-semibold uppercase font-mono tracking-tight bg-red-500/10 text-rose-600 dark:text-rose-400">
                {gap.skill}
              </span>
              <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                {gap.demand_pct}% Demand
              </span>
            </li>
          ))}
        </ul>

        <div className="p-3 bg-white dark:bg-[#0d1424] border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onGenerateRecs}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Fixes (5 Suggestions)</span>
          </button>
        </div>
      </div>

      {/* Intelligence Report Export Panel - Styled for both Light and Dark mode */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1424] p-5 text-slate-900 dark:text-white shadow-xs transition-colors">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 block font-semibold">
            Intelligence Report
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800/60">
            PDF &bull; CSV
          </span>
        </div>
        <h4 className="font-bold text-sm text-slate-900 dark:text-white">Accreditation-Oriented Analysis</h4>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 mb-4 leading-relaxed">
          Export standardized evidence, demand-weighted scores, and depth ratings for faculty review and accreditation-oriented curriculum gap analysis.
        </p>

        <div className="flex flex-col gap-2">
          <button
            onClick={onDownloadPDF}
            disabled={isExporting}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 shadow-2xs transition cursor-pointer disabled:opacity-50"
          >
            <FileText className="w-3.5 h-3.5 text-blue-400 dark:text-blue-600" />
            <span>{isExporting ? 'Generating Report...' : 'Download Analysis PDF'}</span>
          </button>

          <button
            onClick={onDownloadCSV}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Download CSV Matrix</span>
          </button>
        </div>
      </div>
    </div>
  );
};
