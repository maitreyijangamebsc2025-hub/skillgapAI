import React from 'react';
import { Download, FileSpreadsheet, FileText, Printer, CheckCircle2 } from 'lucide-react';
import { AnalysisSummary, CurriculumRecommendation } from '../types/skills';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';

interface ExportToolbarProps {
  summary: AnalysisSummary;
  recommendations: CurriculumRecommendation[];
  isExporting: boolean;
  setIsExporting: (val: boolean) => void;
}

export const ExportToolbar: React.FC<ExportToolbarProps> = ({
  summary,
  recommendations,
  isExporting,
  setIsExporting,
}) => {
  const handleExportCSV = () => {
    exportToCSV(summary.analyzedSkills, summary.extractedSkills as any, summary.alignmentScore);
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    try {
      exportToPDF(summary, recommendations);
    } finally {
      setTimeout(() => setIsExporting(false), 500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-xl mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <h3 className="text-base font-bold text-white">
            Curriculum Intelligence Report Ready
          </h3>
        </div>
        <p className="text-xs text-slate-300 mt-0.5">
          Market Alignment: <strong className="text-emerald-400">{summary.alignmentScore}%</strong> |{' '}
          {summary.coveredSkillsCount} Skills Covered | {summary.gapSkillsCount} Industry Gaps
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          onClick={handleExportPDF}
          disabled={isExporting}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 shadow-md transition cursor-pointer"
        >
          <FileText className="w-4 h-4 text-indigo-600" />
          <span>{isExporting ? 'Generating PDF...' : 'Download PDF Report'}</span>
        </button>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600/80 hover:bg-indigo-600 text-white border border-indigo-400/40 shadow-sm transition cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
          <span>Download Results CSV</span>
        </button>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 transition cursor-pointer"
          title="Print document or Save as PDF via Browser"
        >
          <Printer className="w-4 h-4 text-slate-400" />
          <span className="hidden sm:inline">Print View</span>
        </button>
      </div>
    </div>
  );
};
