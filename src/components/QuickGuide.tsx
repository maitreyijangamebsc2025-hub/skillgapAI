import React from 'react';
import { HelpCircle, Sparkles, BookOpen, CheckCircle2, ChevronRight, RefreshCw, Layers } from 'lucide-react';

interface QuickGuideProps {
  onLoadSample: () => void;
  onOpenHowItWorks: () => void;
  hasAnalyzed: boolean;
}

export const QuickGuide: React.FC<QuickGuideProps> = ({
  onLoadSample,
  onOpenHowItWorks,
  hasAnalyzed,
}) => {
  return (
    <div className="bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 rounded-2xl p-4 sm:p-5 mb-6 text-slate-800 dark:text-slate-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-lg bg-indigo-600 text-white">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            How to read this report in 3 simple steps:
          </h3>
        </div>

        <button
          onClick={onOpenHowItWorks}
          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1 self-start md:self-auto"
        >
          <span>Learn about the NLP Pipeline</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-indigo-100/60 dark:border-indigo-900/40">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1">
            <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-[11px]">
              1
            </span>
            <span>Green = Covered</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-snug">
            Skills that your curriculum teaches that have strong hiring market demand (e.g. Python, SQL, Machine Learning).
          </p>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-indigo-100/60 dark:border-indigo-900/40">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1">
            <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 flex items-center justify-center text-[11px]">
              2
            </span>
            <span>Red = Market Gap</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-snug">
            High-demand skills found in job postings (e.g. AWS, Docker, MLOps) that aren't mentioned in your course syllabus.
          </p>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-indigo-100/60 dark:border-indigo-900/40">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1">
            <span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400 flex items-center justify-center text-[11px]">
              3
            </span>
            <span>AI Fixes</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-snug">
            Click <strong>"AI Recommendations"</strong> to get 5 concrete module additions or projects to close those gaps.
          </p>
        </div>
      </div>
    </div>
  );
};
