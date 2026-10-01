import React, { useState } from 'react';
import { X, GitCompare, ArrowRight, Plus, Trash2, CheckCircle2, AlertCircle, AlertTriangle, ArrowUpRight, ArrowDownRight, Layers, BookmarkPlus, Calendar } from 'lucide-react';
import {
  CurriculumVersionSnapshot,
  VersionComparisonResult,
} from '../types/skills';
import { compareCurriculumVersions } from '../utils/skillMatcher';

interface CurriculumVersionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSnapshot: CurriculumVersionSnapshot;
  savedSnapshots: CurriculumVersionSnapshot[];
  onSaveSnapshot: (name: string) => void;
  onLoadSnapshot: (snapshot: CurriculumVersionSnapshot) => void;
}

export const CurriculumVersionModal: React.FC<CurriculumVersionModalProps> = ({
  isOpen,
  onClose,
  currentSnapshot,
  savedSnapshots,
  onSaveSnapshot,
  onLoadSnapshot,
}) => {
  if (!isOpen) return null;

  // Combine available versions (current + all saved snapshots)
  const allVersions: CurriculumVersionSnapshot[] = [
    currentSnapshot,
    ...savedSnapshots.filter((s) => s.id !== currentSnapshot.id),
  ];

  // Default: Compare baseline against modern version (or 2nd snapshot/current) so diffs appear immediately
  const defaultVersionA = savedSnapshots.find((s) => s.id === 'baseline-msc-reference')?.id || savedSnapshots[0]?.id || currentSnapshot.id;
  const defaultVersionB = savedSnapshots.find((s) => s.id === 'cloud-mlops-v2')?.id || (savedSnapshots.length > 1 ? savedSnapshots[1].id : currentSnapshot.id);

  const [versionAId, setVersionAId] = useState<string>(defaultVersionA);
  const [versionBId, setVersionBId] = useState<string>(defaultVersionB);

  const [activeDiffTab, setActiveDiffTab] = useState<'all' | 'improved' | 'added' | 'removed' | 'regressed'>('all');
  const [newSnapshotName, setNewSnapshotName] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const versionA = allVersions.find((v) => v.id === versionAId) || allVersions[0];
  const versionB = allVersions.find((v) => v.id === versionBId) || currentSnapshot;

  const comparison: VersionComparisonResult = compareCurriculumVersions(versionA, versionB);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSnapshotName.trim()) return;
    onSaveSnapshot(newSnapshotName.trim());
    setNewSnapshotName('');
    setIsSaving(false);
  };

  const isScorePositive = comparison.scoreDelta > 0;
  const isScoreNeutral = comparison.scoreDelta === 0;

  const hasNoDiffs =
    comparison.improvedGaps.length === 0 &&
    comparison.addedSkills.length === 0 &&
    comparison.removedSkills.length === 0 &&
    comparison.newGaps.length === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                Version Control & Curriculum Diff
              </span>
              <span className="px-2 py-0.2 rounded text-[10px] font-mono font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                Audited Comparison
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
              <GitCompare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Curriculum Version Comparison
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
            {/* Version Selector Bar & Score Delta Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase font-bold text-slate-400 mb-1">
                    Baseline (Version A)
                  </label>
                  <select
                    value={versionAId}
                    onChange={(e) => setVersionAId(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold text-xs"
                  >
                    {allVersions.map((v) => (
                      <option key={`a-${v.id}`} value={v.id}>
                        {v.name} ({v.alignmentScore.toFixed(1)}%)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="self-end pb-1.5 hidden sm:block">
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase font-bold text-slate-400 mb-1">
                    Target (Version B)
                  </label>
                  <select
                    value={versionBId}
                    onChange={(e) => setVersionBId(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold text-xs"
                  >
                    {allVersions.map((v) => (
                      <option key={`b-${v.id}`} value={v.id}>
                        {v.name} ({v.alignmentScore.toFixed(1)}%)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Score Delta Display */}
              <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs">
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">Baseline</span>
                  <span className="text-base font-extrabold text-slate-700 dark:text-slate-300 font-mono">
                    {comparison.scoreA.toFixed(1)}%
                  </span>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

                <div className="text-left">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">Target</span>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
                    {comparison.scoreB.toFixed(1)}%
                  </span>
                </div>

                <div className="pl-3 border-l border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">Score Delta</span>
                  <div className="flex items-center gap-1">
                    {isScorePositive ? (
                      <ArrowUpRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : !isScoreNeutral ? (
                      <ArrowDownRight className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    ) : null}
                    <span
                      className={`font-mono font-bold text-sm ${
                        isScorePositive
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : isScoreNeutral
                          ? 'text-slate-500'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {isScorePositive ? `+${comparison.scoreDelta.toFixed(1)}%` : `${comparison.scoreDelta.toFixed(1)}%`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Comparison Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/70 dark:border-slate-800 text-[11px]">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Quick Compare:</span>
              {allVersions.some((v) => v.id === 'baseline-msc-reference') && allVersions.some((v) => v.id === 'cloud-mlops-v2') && (
                <button
                  type="button"
                  onClick={() => {
                    setVersionAId('baseline-msc-reference');
                    setVersionBId('cloud-mlops-v2');
                  }}
                  className={`px-2.5 py-1 rounded font-semibold transition cursor-pointer ${
                    versionAId === 'baseline-msc-reference' && versionBId === 'cloud-mlops-v2'
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50'
                  }`}
                >
                  Baseline vs. Modernized v2.0
                </button>
              )}
              {allVersions.some((v) => v.id === 'legacy-stats-v1') && (
                <button
                  type="button"
                  onClick={() => {
                    setVersionAId('legacy-stats-v1');
                    setVersionBId(currentSnapshot.id);
                  }}
                  className={`px-2.5 py-1 rounded font-semibold transition cursor-pointer ${
                    versionAId === 'legacy-stats-v1' && versionBId === currentSnapshot.id
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-2xs'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  Legacy v1.0 vs. Current Workspace
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setVersionAId('baseline-msc-reference');
                  setVersionBId(currentSnapshot.id);
                }}
                className={`px-2.5 py-1 rounded font-semibold transition cursor-pointer ${
                  versionAId === 'baseline-msc-reference' && versionBId === currentSnapshot.id
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-2xs'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                Baseline vs. Current Workspace
              </button>
            </div>
          </div>

          {/* Quick Stats Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <button
              onClick={() => setActiveDiffTab('improved')}
              className={`p-3 rounded-lg border text-left transition cursor-pointer ${
                activeDiffTab === 'improved'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700'
                  : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <span className="text-[10px] font-mono uppercase text-emerald-700 dark:text-emerald-300 font-bold block">
                Improved Gaps
              </span>
              <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                {comparison.improvedGaps.length}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                Upgraded depth or status
              </span>
            </button>

            <button
              onClick={() => setActiveDiffTab('added')}
              className={`p-3 rounded-lg border text-left transition cursor-pointer ${
                activeDiffTab === 'added'
                  ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700'
                  : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <span className="text-[10px] font-mono uppercase text-blue-700 dark:text-blue-300 font-bold block">
                Added Skills
              </span>
              <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">
                {comparison.addedSkills.length}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                New taught concepts
              </span>
            </button>

            <button
              onClick={() => setActiveDiffTab('removed')}
              className={`p-3 rounded-lg border text-left transition cursor-pointer ${
                activeDiffTab === 'removed'
                  ? 'bg-slate-100 dark:bg-slate-800 border-slate-400 dark:border-slate-600'
                  : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <span className="text-[10px] font-mono uppercase text-slate-600 dark:text-slate-400 font-bold block">
                Removed Skills
              </span>
              <span className="text-xl font-extrabold text-slate-700 dark:text-slate-300 font-mono">
                {comparison.removedSkills.length}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                Omitted in target syllabus
              </span>
            </button>

            <button
              onClick={() => setActiveDiffTab('regressed')}
              className={`p-3 rounded-lg border text-left transition cursor-pointer ${
                activeDiffTab === 'regressed'
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700'
                  : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <span className="text-[10px] font-mono uppercase text-rose-700 dark:text-rose-300 font-bold block">
                New / Regressed Gaps
              </span>
              <span className="text-xl font-extrabold text-rose-600 dark:text-rose-400 font-mono">
                {comparison.newGaps.length}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                Downgraded coverage
              </span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveDiffTab('all')}
                className={`px-3 py-1 rounded-md text-xs font-semibold ${
                  activeDiffTab === 'all'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                All Changes
              </button>
              <button
                onClick={() => setActiveDiffTab('improved')}
                className={`px-3 py-1 rounded-md text-xs font-semibold ${
                  activeDiffTab === 'improved'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Improved ({comparison.improvedGaps.length})
              </button>
              <button
                onClick={() => setActiveDiffTab('added')}
                className={`px-3 py-1 rounded-md text-xs font-semibold ${
                  activeDiffTab === 'added'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Added ({comparison.addedSkills.length})
              </button>
              <button
                onClick={() => setActiveDiffTab('removed')}
                className={`px-3 py-1 rounded-md text-xs font-semibold ${
                  activeDiffTab === 'removed'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Removed ({comparison.removedSkills.length})
              </button>
              <button
                onClick={() => setActiveDiffTab('regressed')}
                className={`px-3 py-1 rounded-md text-xs font-semibold ${
                  activeDiffTab === 'regressed'
                    ? 'bg-rose-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Regressed ({comparison.newGaps.length})
              </button>
            </div>

            <span className="font-mono text-[11px] text-slate-400">
              Formula: &Sigma;(c<sub>i</sub> &times; w<sub>i</sub>) / &Sigma;(w<sub>i</sub>) &times; 100
            </span>
          </div>

          {/* Diff Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-850/80 border-b border-slate-200 dark:border-slate-800 text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400">
                  <th className="py-2.5 px-3">Skill</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-right">Demand %</th>
                  <th className="py-2.5 px-3 text-center">Change Type</th>
                  <th className="py-2.5 px-3">Transition / Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {/* 1. Improved */}
                {(activeDiffTab === 'all' || activeDiffTab === 'improved') &&
                  comparison.improvedGaps.map((item, idx) => (
                    <tr key={`imp-${idx}`} className="hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20">
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white capitalize">{item.skill}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">{item.category}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold">{item.demand_pct}%</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          IMPROVED
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">{item.detail}</td>
                    </tr>
                  ))}

                {/* 2. Added */}
                {(activeDiffTab === 'all' || activeDiffTab === 'added') &&
                  comparison.addedSkills.map((item, idx) => (
                    <tr key={`add-${idx}`} className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20">
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white capitalize">{item.skill}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">{item.category}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold">
                        {item.demand_pct > 0 ? `${item.demand_pct}%` : 'Niche'}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                          ADDED
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">{item.detail}</td>
                    </tr>
                  ))}

                {/* 3. Removed */}
                {(activeDiffTab === 'all' || activeDiffTab === 'removed') &&
                  comparison.removedSkills.map((item, idx) => (
                    <tr key={`rem-${idx}`} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 opacity-75">
                      <td className="py-2.5 px-3 font-bold text-slate-700 dark:text-slate-300 line-through capitalize">
                        {item.skill}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">{item.category}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold">
                        {item.demand_pct > 0 ? `${item.demand_pct}%` : 'Niche'}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          REMOVED
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">{item.detail}</td>
                    </tr>
                  ))}

                {/* 4. Regressed */}
                {(activeDiffTab === 'all' || activeDiffTab === 'regressed') &&
                  comparison.newGaps.map((item, idx) => (
                    <tr key={`reg-${idx}`} className="hover:bg-rose-50/40 dark:hover:bg-rose-950/20">
                      <td className="py-2.5 px-3 font-bold text-rose-700 dark:text-rose-400 capitalize">{item.skill}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">{item.category}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold">{item.demand_pct}%</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                          REGRESSED
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-rose-700 dark:text-rose-300">{item.detail}</td>
                    </tr>
                  ))}

                {hasNoDiffs && (
                    <tr>
                      <td colSpan={5} className="py-10 px-4 text-center">
                        <div className="max-w-md mx-auto space-y-2.5">
                          <div className="inline-flex p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                            <GitCompare className="w-5 h-5" />
                          </div>
                          <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                            No Skill Differences Detected Between Selected Versions
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                            {versionA.id === versionB.id
                              ? `Both Version A and Version B are set to "${versionA.name}" (identical).`
                              : `Both versions currently teach the exact same set of skills at identical depth levels.`}
                          </p>
                          <div className="pt-2 flex flex-wrap justify-center gap-2">
                            {allVersions.some((v) => v.id === 'cloud-mlops-v2') && (
                              <button
                                type="button"
                                onClick={() => {
                                  setVersionAId('baseline-msc-reference');
                                  setVersionBId('cloud-mlops-v2');
                                }}
                                className="px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition cursor-pointer"
                              >
                                Compare vs. Modernized v2.0
                              </button>
                            )}
                            {allVersions.some((v) => v.id === 'legacy-stats-v1') && (
                              <button
                                type="button"
                                onClick={() => {
                                  setVersionAId('legacy-stats-v1');
                                  setVersionBId('baseline-msc-reference');
                                }}
                                className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 transition cursor-pointer"
                              >
                                Compare Legacy vs. Baseline
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>

          {/* Save Snapshot Section */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h5 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <BookmarkPlus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Save Current Curriculum as a Version Snapshot</span>
              </h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Save the current syllabus and analysis state so you can compare future revisions against it.
              </p>
            </div>

            {isSaving ? (
              <form onSubmit={handleSave} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. Version 2.0 (Added Cloud Lab)"
                  value={newSnapshotName}
                  onChange={(e) => setNewSnapshotName(e.target.value)}
                  autoFocus
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!newSnapshotName.trim()}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsSaving(false)}
                  className="px-2 py-1.5 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsSaving(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-950 hover:opacity-90 transition cursor-pointer self-start sm:self-auto shrink-0"
              >
                + Snapshot Current State
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            {savedSnapshots.length} saved snapshot(s) available for comparison
          </div>

          <div className="flex items-center gap-2">
            {versionAId !== currentSnapshot.id && (
              <button
                onClick={() => {
                  onLoadSnapshot(versionA);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Restore Version A to Workspace
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition cursor-pointer"
            >
              Close Comparison
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
