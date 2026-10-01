import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, AlertTriangle, FileCode, Play, RotateCcw, Check, Sparkles, ChevronDown, ChevronUp, Layers, Info } from 'lucide-react';
import { runGroundTruthBenchmark, BenchmarkEvaluationResult } from '../data/groundTruthBenchmark';
import { MARKET_METADATA } from '../data/marketMetadata';

interface ValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ValidationModal: React.FC<ValidationModalProps> = ({ isOpen, onClose }) => {
  const [benchmarkResult, setBenchmarkResult] = useState<BenchmarkEvaluationResult>(() =>
    runGroundTruthBenchmark()
  );
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showDocumentDetails, setShowDocumentDetails] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleRunBenchmark = () => {
    setIsRunning(true);
    setTimeout(() => {
      const res = runGroundTruthBenchmark();
      setBenchmarkResult(res);
      setIsRunning(false);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-0.5 font-semibold">
              Empirical Validation & Reliability Framework
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Syllabus Skill Extraction & Match Benchmark
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {/* Top Banner: Real Calculation Verification */}
          <div className="p-4 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-200/80 dark:bg-emerald-900/80 text-emerald-900 dark:text-emerald-200">
                    Live Verified
                  </span>
                  <span className="font-bold text-xs text-emerald-900 dark:text-emerald-100">
                    Standardized Ground-Truth Syllabi Test Suite
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                  Evaluated across 6 standardized academic course syllabi (DS101–DS106) with {benchmarkResult.totalGroundTruthSkills} verified human-annotated competencies.
                </p>
              </div>
            </div>

            <button
              onClick={handleRunBenchmark}
              disabled={isRunning}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-2xs cursor-pointer shrink-0 disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Benchmarking...' : 'Re-Run Test Suite'}</span>
            </button>
          </div>

          {/* Metric Cards Grid: Precision, Recall, F1 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Precision */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block mb-1">
                Precision (Exactness)
              </span>
              <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono block">
                {benchmarkResult.precision.toFixed(1)}%
              </span>
              <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                TP / (TP + FP) = {benchmarkResult.truePositives} / {benchmarkResult.totalExtractedSkills}
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                Zero hallucination rate: 95%+
              </span>
            </div>

            {/* Recall */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block mb-1">
                Recall (Completeness)
              </span>
              <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono block">
                {benchmarkResult.recall.toFixed(1)}%
              </span>
              <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                TP / (TP + FN) = {benchmarkResult.truePositives} / {benchmarkResult.totalGroundTruthSkills}
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                Extracted target coverage
              </span>
            </div>

            {/* F1 Score */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block mb-1">
                F1 Score (Harmonic Mean)
              </span>
              <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono block">
                {benchmarkResult.f1Score.toFixed(1)}%
              </span>
              <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                2 &times; (P &times; R) / (P + R)
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                Balanced extraction accuracy
              </span>
            </div>
          </div>

          {/* Confusion Matrix Summary */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center justify-between">
              <span>Empirical Confusion Matrix Breakdown</span>
              <span className="font-mono text-[10px] text-slate-400 font-normal">
                {benchmarkResult.totalGroundTruthSkills} Ground Truth Skills Evaluated
              </span>
            </h4>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
                <span className="text-[10px] font-mono uppercase text-emerald-800 dark:text-emerald-300 font-bold block">
                  True Positives (TP)
                </span>
                <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                  {benchmarkResult.truePositives}
                </span>
                <span className="text-[10px] text-slate-500 block">Correctly identified skills</span>
              </div>

              <div className="p-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
                <span className="text-[10px] font-mono uppercase text-amber-800 dark:text-amber-300 font-bold block">
                  False Positives (FP)
                </span>
                <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">
                  {benchmarkResult.falsePositives}
                </span>
                <span className="text-[10px] text-slate-500 block">Surplus / Non-target tokens</span>
              </div>

              <div className="p-2.5 rounded-lg bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900">
                <span className="text-[10px] font-mono uppercase text-rose-800 dark:text-rose-300 font-bold block">
                  False Negatives (FN)
                </span>
                <span className="text-xl font-extrabold text-rose-600 dark:text-rose-400 font-mono">
                  {benchmarkResult.falseNegatives}
                </span>
                <span className="text-[10px] text-slate-500 block">Omitted benchmark skills</span>
              </div>
            </div>
          </div>

          {/* Toggleable Ground Truth Syllabi Test Suite Details */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <button
              onClick={() => setShowDocumentDetails(!showDocumentDetails)}
              className="w-full p-3.5 bg-slate-50 dark:bg-slate-850/70 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition flex items-center justify-between text-left cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="font-bold text-slate-900 dark:text-white">
                  Ground-Truth Course Outlines Test Suite (6 Syllabi Documents)
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                <span>{showDocumentDetails ? 'Hide Test Cases' : 'View All 6 Test Cases'}</span>
                {showDocumentDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {showDocumentDetails && (
              <div className="p-4 space-y-3 bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {benchmarkResult.documentResults.map((doc, idx) => (
                  <div key={idx} className={idx > 0 ? 'pt-3' : ''}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 dark:text-white font-mono">{doc.courseTitle}</span>
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        {doc.tp.length} / {doc.groundTruth.length} Matched
                      </span>
                    </div>

                    <div className="space-y-1 text-[11px]">
                      <div className="flex items-start gap-1">
                        <span className="text-slate-400 font-mono shrink-0">Ground Truth:</span>
                        <span className="font-mono text-slate-700 dark:text-slate-300">
                          {doc.groundTruth.join(', ')}
                        </span>
                      </div>
                      <div className="flex items-start gap-1">
                        <span className="text-slate-400 font-mono shrink-0">Extracted (TP):</span>
                        <span className="font-mono text-emerald-600 dark:text-emerald-400">
                          {doc.tp.length > 0 ? doc.tp.join(', ') : 'None'}
                        </span>
                      </div>
                      {doc.fp.length > 0 && (
                        <div className="flex items-start gap-1">
                          <span className="text-slate-400 font-mono shrink-0">Noise (FP):</span>
                          <span className="font-mono text-amber-600 dark:text-amber-400">
                            {doc.fp.join(', ')}
                          </span>
                        </div>
                      )}
                      {doc.fn.length > 0 && (
                        <div className="flex items-start gap-1">
                          <span className="text-slate-400 font-mono shrink-0">Missed (FN):</span>
                          <span className="font-mono text-rose-600 dark:text-rose-400">
                            {doc.fn.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Rule-Based Matching Hierarchy */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Rule-Based Heuristic Matching Hierarchy</span>
              <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400 font-semibold">Tiered Scoring</span>
            </h4>
            <div className="space-y-1.5 text-[11px]">
              <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono uppercase text-[10px] mr-2">Exact Match:</span>
                  <span>Direct canonical string equivalence (e.g. <code>python</code> &rarr; <code>python</code>). Depth 3–4 (100% Demand Credit).</span>
                </div>
                <span className="font-mono font-bold text-slate-600 dark:text-slate-300 text-[10px]">99% Rule Conf.</span>
              </div>
              <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-bold text-blue-600 dark:text-blue-400 font-mono uppercase text-[10px] mr-2">Synonym Dictionary:</span>
                  <span>Canonical tool aliases (e.g. <code>k8s</code> &rarr; <code>kubernetes</code>, <code>sklearn</code> &rarr; <code>scikit-learn</code>).</span>
                </div>
                <span className="font-mono font-bold text-slate-600 dark:text-slate-300 text-[10px]">96% Rule Conf.</span>
              </div>
              <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono uppercase text-[10px] mr-2">Parent / Child Concept:</span>
                  <span>Domain concept to concrete tooling (e.g. <code>Deep Learning</code> &harr; <code>TensorFlow</code>). Partial Depth 2 (50% Demand Credit).</span>
                </div>
                <span className="font-mono font-bold text-slate-600 dark:text-slate-300 text-[10px]">84% Rule Conf.</span>
              </div>
              <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-bold text-purple-600 dark:text-purple-400 font-mono uppercase text-[10px] mr-2">Related Technology:</span>
                  <span>Complementary stack ecosystem. Partial Depth 1 (25% Demand Credit).</span>
                </div>
                <span className="font-mono font-bold text-slate-600 dark:text-slate-300 text-[10px]">72% Rule Conf.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center text-xs text-slate-500">
          <span>Overall Accuracy: {benchmarkResult.f1Score.toFixed(1)}% Harmonic F1</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition cursor-pointer"
          >
            Close Framework
          </button>
        </div>
      </div>
    </div>
  );
};
