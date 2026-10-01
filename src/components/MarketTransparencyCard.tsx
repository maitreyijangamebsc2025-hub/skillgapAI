import React from 'react';
import { Database, Calendar, MapPin, Info, ShieldCheck } from 'lucide-react';
import { MARKET_METADATA } from '../data/marketMetadata';

interface MarketTransparencyCardProps {
  onOpenValidationModal: () => void;
  onOpenDatasetModal?: () => void;
  marketSkillCount?: number;
}

export const MarketTransparencyCard: React.FC<MarketTransparencyCardProps> = ({
  onOpenValidationModal,
  onOpenDatasetModal,
  marketSkillCount = 43,
}) => {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1424] p-5 shadow-xs transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
            Market Benchmark Transparency & Dataset Scope
          </h4>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {onOpenDatasetModal && (
            <button
              onClick={onOpenDatasetModal}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Explore / Edit Benchmark ({marketSkillCount} Skills)</span>
            </button>
          )}
          <button
            onClick={onOpenValidationModal}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Validation & Rules</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-3">
        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">Dataset Source</span>
          <span className="font-bold text-slate-800 dark:text-slate-200 truncate block" title={MARKET_METADATA.datasetSource}>
            Kaggle DS Telemetry
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">Posting Count</span>
          <span className="font-bold text-emerald-700 dark:text-emerald-400 block truncate" title="94,890 aggregated job postings in telemetry index">
            {MARKET_METADATA.postingCountLabel}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">Collection Period</span>
          <span className="font-bold text-slate-800 dark:text-slate-200 block truncate" title={MARKET_METADATA.datasetPeriod}>
            {MARKET_METADATA.datasetPeriod}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">Geography</span>
          <span className="font-bold text-slate-800 dark:text-slate-200 block truncate" title={MARKET_METADATA.geography}>
            {MARKET_METADATA.geography}
          </span>
        </div>
      </div>

      <div className="flex items-start gap-2 p-2.5 rounded-lg bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 text-[11px] text-blue-900 dark:text-blue-200 leading-relaxed">
        <Info className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <p>
          <strong>Empirical Market Proxy:</strong> {MARKET_METADATA.proxyDisclaimer} Evaluated scope: 43 normalized market skill profiles from <code>skill_demand.json</code>.
        </p>
      </div>
    </div>
  );
};
