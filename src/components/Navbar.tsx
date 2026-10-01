import React from 'react';
import { Sun, Moon, BookOpen, GitCompare, Shield } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenHowItWorks: () => void;
  onOpenDatasetModal: () => void;
  onOpenValidationModal?: () => void;
  onOpenVersionModal?: () => void;
  datasetSkillCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleDarkMode,
  onOpenHowItWorks,
  onOpenDatasetModal,
  onOpenValidationModal,
  onOpenVersionModal,
  datasetSkillCount,
}) => {
  return (
    <header className="h-16 shrink-0 bg-white dark:bg-[#080d19] border-b border-slate-200 dark:border-slate-800/80 px-4 sm:px-6 flex items-center justify-between z-40 text-slate-900 dark:text-white transition-colors duration-200">
      {/* Brand: Rounded square icon with bar chart + SkillGap AI + NLP v2.4 badge */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-slate-950 dark:bg-white flex items-center justify-center text-white dark:text-slate-950 shadow-sm transition-colors">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v16a2 2 0 0 0 2 2h16" />
            <path d="M18 17V9" />
            <path d="M13 17V5" />
            <path d="M8 17v-3" />
          </svg>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
            SkillGap AI
          </span>
          <span className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700/60">
            Weighted V2.5
          </span>
        </div>
      </div>

      {/* Right actions: Market Benchmark + Compare Versions + Validation + How it works + theme toggle */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        <button
          onClick={onOpenDatasetModal}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800/80 transition cursor-pointer"
          title="Market Demand Benchmark Dataset (Kaggle Job Telemetry)"
        >
          <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 hidden xs:inline" />
          <span>Market Benchmark</span>
          <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-blue-200/70 dark:bg-blue-900/80 text-blue-800 dark:text-blue-200 font-bold">
            {datasetSkillCount}
          </span>
        </button>

        {onOpenVersionModal && (
          <button
            onClick={onOpenVersionModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800/80 transition cursor-pointer"
            title="Curriculum Version Comparison & History"
          >
            <GitCompare className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Compare Versions</span>
          </button>
        )}

        {onOpenValidationModal && (
          <button
            onClick={onOpenValidationModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#0f172a] hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/70 transition cursor-pointer"
            title="Rule-Based Extraction & Matching Validation Framework"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>Validation</span>
          </button>
        )}

        <button
          onClick={onOpenHowItWorks}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-[#0f172a] hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/70 transition cursor-pointer"
        >
          <span>How it works</span>
        </button>

        {/* Light / Dark Mode Toggle Button */}
        <button
          onClick={onToggleDarkMode}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700/70 bg-slate-100 dark:bg-[#0f172a] text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer shadow-2xs text-xs font-semibold"
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
