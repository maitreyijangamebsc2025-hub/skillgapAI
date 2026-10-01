import React from 'react';
import { Sparkles, ArrowRight, Lightbulb, Clock, CheckCircle2 } from 'lucide-react';
import { CurriculumRecommendation } from '../types/skills';

interface QuickSuggestionsCardProps {
  recommendations: CurriculumRecommendation[];
  onViewAll: () => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const QuickSuggestionsCard: React.FC<QuickSuggestionsCardProps> = ({
  recommendations,
  onViewAll,
  onGenerate,
  isLoading,
}) => {
  const topSuggestions = recommendations.slice(0, 3);

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1424] p-5 shadow-xs transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>AI Curriculum Suggestions</span>
              <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-100/70 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                5 Roadmaps
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Targeted modules & tooling to eliminate unaddressed market skill gaps
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onGenerate}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            {isLoading ? 'Synthesizing...' : 'Regenerate'}
          </button>
          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition shadow-2xs cursor-pointer"
          >
            <span>View All Roadmaps</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3 top preview cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {topSuggestions.map((item, idx) => {
          const isCritical = item.priority?.toLowerCase() === 'critical';
          const isHigh = item.priority?.toLowerCase() === 'high';

          return (
            <div
              key={idx}
              onClick={onViewAll}
              className="p-3.5 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 hover:border-blue-300 dark:hover:border-blue-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                    {item.type}
                  </span>
                  <span
                    className={`font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      isCritical
                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                        : isHigh
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-900'
                        : 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-900'
                    }`}
                  >
                    {item.priority}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 mb-1.5">
                  {item.title}
                </h4>

                <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {item.rationale}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400">
                <span className="truncate max-w-[150px]">
                  Skills: {item.target_skills?.slice(0, 2).join(', ')}
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-medium">Details &rarr;</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
