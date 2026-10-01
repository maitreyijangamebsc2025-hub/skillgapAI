import React, { useState } from 'react';
import {
  X,
  GitCompare,
  GitBranch,
  GitCommit,
  ArrowRight,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  BookmarkPlus,
  Calendar,
  HelpCircle,
  Check,
  Code2,
  FileText,
  RotateCcw,
} from 'lucide-react';
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
  onSaveSnapshot: (name: string, branch?: string, commitMessage?: string, baseSnapshotId?: string) => void;
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

  // Active top-level tab: 'diff' | 'branches' | 'howItWorks'
  const [modalTab, setModalTab] = useState<'diff' | 'branches' | 'howItWorks'>('diff');

  // Combine available versions (current workspace + all saved snapshots)
  const allVersions: CurriculumVersionSnapshot[] = [
    { ...currentSnapshot, branch: 'workspace/current' },
    ...savedSnapshots.filter((s) => s.id !== currentSnapshot.id),
  ];

  // Default: Compare baseline against modern version
  const defaultVersionA =
    savedSnapshots.find((s) => s.id === 'baseline-msc-reference')?.id ||
    savedSnapshots[0]?.id ||
    currentSnapshot.id;
  const defaultVersionB =
    savedSnapshots.find((s) => s.id === 'cloud-mlops-v2')?.id ||
    (savedSnapshots.length > 1 ? savedSnapshots[1].id : currentSnapshot.id);

  const [versionAId, setVersionAId] = useState<string>(defaultVersionA);
  const [versionBId, setVersionBId] = useState<string>(defaultVersionB);

  const [activeDiffTab, setActiveDiffTab] = useState<'all' | 'improved' | 'added' | 'removed' | 'regressed'>('all');

  // New Branch Form State
  const [newBranchName, setNewBranchName] = useState<string>('');
  const [newVersionName, setNewVersionName] = useState<string>('');
  const [newCommitMessage, setNewCommitMessage] = useState<string>('');
  const [baseBranchId, setBaseBranchId] = useState<string>(defaultVersionA);
  const [branchSuccessMsg, setBranchSuccessMsg] = useState<string | null>(null);

  const versionA = allVersions.find((v) => v.id === versionAId) || allVersions[0];
  const versionB = allVersions.find((v) => v.id === versionBId) || currentSnapshot;

  const comparison: VersionComparisonResult = compareCurriculumVersions(versionA, versionB);

  const isScorePositive = comparison.scoreDelta > 0;
  const isScoreNeutral = comparison.scoreDelta === 0;

  const hasNoDiffs =
    comparison.improvedGaps.length === 0 &&
    comparison.addedSkills.length === 0 &&
    comparison.removedSkills.length === 0 &&
    comparison.newGaps.length === 0;

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanBranch = newBranchName.trim().toLowerCase().replace(/\s+/g, '-');
    if (!cleanBranch) return;

    const displayName = newVersionName.trim() || `Branch: ${cleanBranch}`;
    const commitMsg = newCommitMessage.trim() || `Create curriculum branch ${cleanBranch}`;

    onSaveSnapshot(displayName, cleanBranch, commitMsg, baseBranchId);

    setBranchSuccessMsg(`Successfully created branch "${cleanBranch}"!`);
    setNewBranchName('');
    setNewVersionName('');
    setNewCommitMessage('');
    setTimeout(() => setBranchSuccessMsg(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                Curriculum Version Control & Diff Engine
              </span>
              <span className="px-2 py-0.2 rounded text-[10px] font-mono font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                Multi-Branch Enabled
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
              <GitCompare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Curriculum Version Comparison & Branches</span>
            </h3>
          </div>

          {/* Top Tabs: Diff vs Branches vs How It Works */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <div className="flex items-center p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
              <button
                onClick={() => setModalTab('diff')}
                className={`px-3 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
                  modalTab === 'diff'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span>Diff & Changes</span>
              </button>

              <button
                onClick={() => setModalTab('branches')}
                className={`px-3 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
                  modalTab === 'branches'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>Branches ({allVersions.length})</span>
              </button>

              <button
                onClick={() => setModalTab('howItWorks')}
                className={`px-3 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
                  modalTab === 'howItWorks'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>How Diff Works</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {/* TAB 1: DIFF & COMPARISON */}
          {modalTab === 'diff' && (
            <div className="space-y-6">
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
                            [{v.branch || 'main'}] {v.name} ({v.alignmentScore.toFixed(1)}%)
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
                            [{v.branch || 'main'}] {v.name} ({v.alignmentScore.toFixed(1)}%)
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
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Quick Presets:</span>
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
                      Baseline vs. feat/cloud-and-mlops
                    </button>
                  )}
                  {allVersions.some((v) => v.id === 'genai-llm-v3') && (
                    <button
                      type="button"
                      onClick={() => {
                        setVersionAId('baseline-msc-reference');
                        setVersionBId('genai-llm-v3');
                      }}
                      className={`px-2.5 py-1 rounded font-semibold transition cursor-pointer ${
                        versionAId === 'baseline-msc-reference' && versionBId === 'genai-llm-v3'
                          ? 'bg-indigo-600 text-white shadow-2xs'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50'
                      }`}
                    >
                      Baseline vs. feat/generative-ai-track
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
                      legacy/v1.0 vs. Current Workspace
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Stats Summary Tabs */}
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

              {/* Filter Tabs Bar */}
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

                <button
                  onClick={() => setModalTab('howItWorks')}
                  className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>How diff is calculated &rarr;</span>
                </button>
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
                                : `Both versions teach identical skills at matching depth levels.`}
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
                                  Compare vs. feat/cloud-and-mlops
                                </button>
                              )}
                              {allVersions.some((v) => v.id === 'genai-llm-v3') && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setVersionAId('baseline-msc-reference');
                                    setVersionBId('genai-llm-v3');
                                  }}
                                  className="px-3 py-1 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer"
                                >
                                  Compare vs. feat/generative-ai-track
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
            </div>
          )}

          {/* TAB 2: BRANCHES EXPLORER & CREATOR */}
          {modalTab === 'branches' && (
            <div className="space-y-6">
              {/* Branch Success Alert */}
              {branchSuccessMsg && (
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{branchSuccessMsg}</span>
                </div>
              )}

              {/* Create New Branch Form */}
              <div className="p-5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/20 space-y-4">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                    Create New Curriculum Branch
                  </h4>
                  <span className="font-mono text-[10px] text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 font-semibold">
                    git branch &amp; snapshot
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Fork from an existing branch or snapshot current workspace to test alternative curriculum pathways (e.g. specialized industry electives or accreditation variants).
                </p>

                <form onSubmit={handleCreateBranch} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-slate-500 mb-1">
                        Branch Name (Slug)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. feat/fintech-risk-analytics"
                        value={newBranchName}
                        onChange={(e) => setNewBranchName(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-xs"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-slate-500 mb-1">
                        Display Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. v2.1: FinTech & Quantitative Risk Track"
                        value={newVersionName}
                        onChange={(e) => setNewVersionName(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-slate-500 mb-1">
                        Base From
                      </label>
                      <select
                        value={baseBranchId}
                        onChange={(e) => setBaseBranchId(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                      >
                        {allVersions.map((v) => (
                          <option key={v.id} value={v.id}>
                            [{v.branch || 'main'}] {v.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase font-bold text-slate-500 mb-1">
                      Commit Message / Change Summary
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. feat(fintech): introduce quantitative modeling, stochastic calculus, and time-series"
                      value={newCommitMessage}
                      onChange={(e) => setNewCommitMessage(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                    />
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      disabled={!newBranchName.trim()}
                      className="px-4 py-2 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create Branch &amp; Snapshot</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Active Branches Table */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs flex items-center justify-between">
                  <span>Available Curriculum Branches</span>
                  <span className="font-mono text-[10px] text-slate-400 font-normal">
                    {allVersions.length} Active Tracks
                  </span>
                </h4>

                <div className="grid grid-cols-1 gap-3">
                  {allVersions.map((branch) => {
                    const isMain = branch.branch === 'main';
                    const isWorkspace = branch.id === currentSnapshot.id;

                    return (
                      <div
                        key={branch.id}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700 transition space-y-2.5"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400">
                              <GitBranch className="w-4 h-4" />
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 dark:text-white font-mono text-xs">
                                  {branch.branch || 'main'}
                                </span>
                                {isMain && (
                                  <span className="px-2 py-0.2 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                    DEFAULT
                                  </span>
                                )}
                                {isWorkspace && (
                                  <span className="px-2 py-0.2 rounded text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                                    CURRENT WORKSPACE
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                {branch.name}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">
                                Alignment Score
                              </span>
                              <span className="font-mono font-bold text-sm text-indigo-600 dark:text-indigo-400">
                                {branch.alignmentScore.toFixed(1)}%
                              </span>
                            </div>

                            <button
                              onClick={() => {
                                setVersionAId('baseline-msc-reference');
                                setVersionBId(branch.id);
                                setModalTab('diff');
                              }}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 transition cursor-pointer"
                            >
                              Diff vs Main
                            </button>

                            {!isWorkspace && (
                              <button
                                onClick={() => {
                                  onLoadSnapshot(branch);
                                  onClose();
                                }}
                                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition cursor-pointer"
                              >
                                Checkout
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Commit metadata line */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[10.5px] font-mono text-slate-400">
                          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                            <GitCommit className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-slate-900 dark:text-white font-semibold">{branch.commitHash || 'c8b21ef'}</span>
                            <span>&bull;</span>
                            <span className="italic">{branch.commitMessage || 'Curriculum revision update'}</span>
                          </div>
                          <span>Skills taught: {branch.extractedSkills.length}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HOW DIFF WORKS (EXPLAINER) */}
          {modalTab === 'howItWorks' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60">
                <h4 className="font-bold text-blue-950 dark:text-blue-100 text-xs flex items-center gap-2 mb-1">
                  <Code2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>The 4 Stages of the Curriculum Diff Engine</span>
                </h4>
                <p className="text-[11px] text-blue-900/80 dark:text-blue-200/80">
                  Unlike plain text diff engines (e.g. <code>git diff</code>), SkillGap AI calculates semantic curriculum diffs across four mathematical dimensions: skill set membership, Bloom&apos;s depth levels, gap status transitions, and demand-weighted alignment impact.
                </p>
              </div>

              {/* 4 Steps Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Step 1 */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center font-mono font-bold text-xs">
                      1
                    </span>
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                      Canonical Skill Set Extraction
                    </h5>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Syllabi $A$ and $B$ are parsed. Technical aliases and synonyms are normalized into canonical lowercase keys, producing discrete skill sets:
                  </p>
                  <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-850 font-mono text-[10.5px] text-slate-700 dark:text-slate-300">
                    S<sub>A</sub> = &#123; python, sql, r, ... &#125;<br />
                    S<sub>B</sub> = &#123; python, sql, aws, docker, ... &#125;
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-mono font-bold text-xs">
                      2
                    </span>
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                      Symmetric Set Difference
                    </h5>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Calculates newly added competencies and omitted technologies between the two versions:
                  </p>
                  <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-850 font-mono text-[10.5px] text-slate-700 dark:text-slate-300">
                    Added = S<sub>B</sub> \ S<sub>A</sub> (e.g. aws, docker, k8s)<br />
                    Removed = S<sub>A</sub> \ S<sub>B</sub> (e.g. spss, sas)
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-mono font-bold text-xs">
                      3
                    </span>
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                      Bloom Depth Transition Delta
                    </h5>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    For intersecting skills $S_A \cap S_B$, compares curriculum depth levels ($0 \dots 4$):
                  </p>
                  <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-850 font-mono text-[10.5px] text-slate-700 dark:text-slate-300">
                    &Delta;Depth = Depth<sub>B</sub> - Depth<sub>A</sub><br />
                    Upgrades &rarr; <span className="text-emerald-600 font-bold">IMPROVED</span> (e.g. Depth 2 &rarr; 4)<br />
                    Downgrades &rarr; <span className="text-rose-600 font-bold">REGRESSED</span>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-mono font-bold text-xs">
                      4
                    </span>
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                      Demand-Weighted Alignment Delta
                    </h5>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Quantifies the net percentage score impact closing the job market demand gap:
                  </p>
                  <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-850 font-mono text-[10.5px] text-indigo-700 dark:text-indigo-300">
                    &Delta;Score = AlignmentScore<sub>B</sub> - AlignmentScore<sub>A</sub><br />
                    Currently: {comparison.scoreB.toFixed(1)}% - {comparison.scoreA.toFixed(1)}% = {comparison.scoreDelta > 0 ? `+${comparison.scoreDelta.toFixed(1)}%` : `${comparison.scoreDelta.toFixed(1)}%`}
                  </div>
                </div>
              </div>

              {/* Back to comparison button */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">
                    Ready to evaluate your branches?
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Compare any two branches to see live skill deltas and score impacts.
                  </span>
                </div>
                <button
                  onClick={() => setModalTab('diff')}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition cursor-pointer"
                >
                  Return to Diff Table
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            {allVersions.length} branch(es) available &bull; Active diff: [{versionA.branch || 'main'}] &rarr; [{versionB.branch || 'target'}]
          </div>

          <div className="flex items-center gap-2">
            {modalTab === 'diff' && versionAId !== currentSnapshot.id && (
              <button
                onClick={() => {
                  onLoadSnapshot(versionA);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Checkout [{versionA.branch || 'A'}] to Workspace
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
