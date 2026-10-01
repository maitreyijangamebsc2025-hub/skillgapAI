import React from 'react';
import {
  LayoutGrid,
  Table2,
  Lightbulb,
  Radar,
  Database,
  FileText,
  GitCompare,
} from 'lucide-react';
import { ActiveTab } from './DashboardNavigation';

interface AppSidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  datasetSkillCount: number;
  wordCount: number;
  onOpenDatasetModal: () => void;
  onOpenSyllabusEditor: () => void;
  onOpenVersionModal?: () => void;
  gapCount: number;
  coveredCount: number;
  recommendationsCount: number;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  activeTab,
  setActiveTab,
  datasetSkillCount,
  wordCount,
  onOpenDatasetModal,
  onOpenSyllabusEditor,
  onOpenVersionModal,
  gapCount,
}) => {
  return (
    <aside className="w-64 shrink-0 bg-white dark:bg-[#080d1a] border-r border-slate-200 dark:border-slate-800/80 p-5 flex flex-col justify-between overflow-y-auto text-slate-700 dark:text-slate-300 hidden md:flex transition-colors duration-200">
      <div className="space-y-7">
        {/* Navigation Group 1: ANALYSIS VIEWS */}
        <div>
          <span className="font-mono text-[10px] tracking-widest uppercase text-slate-400 dark:text-slate-500 font-bold mb-3 block px-2">
            ANALYSIS VIEWS
          </span>
          <nav className="space-y-1.5">
            {/* Active item: High contrast pill */}
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <LayoutGrid className="w-4 h-4 opacity-90" />
              <span>Executive Summary</span>
            </button>

            <button
              onClick={() => setActiveTab('comparison')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'comparison'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Table2 className="w-4 h-4 opacity-80" />
                <span>Full Skill Matrix</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                activeTab === 'comparison'
                  ? 'bg-slate-800 text-slate-200 dark:bg-slate-200 dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}>
                {gapCount || 9} gaps
              </span>
            </button>

            <button
              onClick={() => setActiveTab('recommendations')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'recommendations'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Lightbulb className="w-4 h-4 opacity-80" />
              <span>AI Action Plan</span>
            </button>

            <button
              onClick={() => setActiveTab('deepdive')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'deepdive'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Radar className="w-4 h-4 opacity-80" />
              <span>Radar & Word Cloud</span>
            </button>
          </nav>
        </div>

        {/* Navigation Group 2: CONFIG & DATA */}
        <div>
          <span className="font-mono text-[10px] tracking-widest uppercase text-slate-400 dark:text-slate-500 font-bold mb-3 block px-2">
            CONFIG & DATA
          </span>
          <nav className="space-y-1.5">
            <button
              onClick={onOpenDatasetModal}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Database className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                <span>Market Demand</span>
              </div>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                {datasetSkillCount || 42}
              </span>
            </button>

            <button
              onClick={onOpenSyllabusEditor}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                <span>Curriculum Text</span>
              </div>
              <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                {wordCount > 0 ? `${wordCount}w` : '523w'}
              </span>
            </button>

            {onOpenVersionModal && (
              <button
                onClick={onOpenVersionModal}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <GitCompare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Version Compare</span>
                </div>
                <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold">
                  Diff
                </span>
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Subtle indicator at sidebar bottom */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800/60 text-[11px] font-mono text-slate-500 flex items-center justify-between">
        <span>NLP Engine</span>
        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Ready
        </span>
      </div>
    </aside>
  );
};
