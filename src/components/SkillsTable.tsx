import React, { useState } from 'react';
import { AnalyzedSkill, DepthLevel, DEPTH_LABELS, MatchType, SkillStatus } from '../types/skills';
import { Search, ArrowUpDown, CheckCircle2, AlertCircle, AlertTriangle, BookOpen, Sparkles, Shield, Info } from 'lucide-react';

interface SkillsTableProps {
  skills: AnalyzedSkill[];
  surplusSkills: AnalyzedSkill[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  demandThreshold: number;
  setDemandThreshold: (val: number) => void;
  topN: number;
  setTopN: (val: number) => void;
  highlightedSkill?: string | null;
  onClearHighlight?: () => void;
  onSimulateSkill?: (skill: string) => void;
}

export const SkillsTable: React.FC<SkillsTableProps> = ({
  skills,
  surplusSkills,
  selectedCategory,
  setSelectedCategory,
  demandThreshold,
  setDemandThreshold,
  topN,
  setTopN,
  highlightedSkill,
  onClearHighlight,
  onSimulateSkill,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | SkillStatus>('ALL');
  const [depthFilter, setDepthFilter] = useState<'ALL' | DepthLevel>('ALL');
  const [sortField, setSortField] = useState<'demand' | 'skill' | 'status' | 'depth' | 'confidence'>('demand');
  const [sortAsc, setSortAsc] = useState(false);

  const categories = ['ALL', 'Programming', 'Cloud', 'ML/AI', 'Databases', 'Visualization', 'Soft Skills'];

  const combinedList = [...skills, ...surplusSkills];

  const filtered = combinedList.filter((item) => {
    if (highlightedSkill && item.skill.toLowerCase() !== highlightedSkill.toLowerCase()) {
      return false;
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchSkill = item.skill.toLowerCase().includes(q);
      const matchCourse = item.matching_course?.toLowerCase().includes(q);
      const matchEvidence = item.evidence?.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      if (!matchSkill && !matchCourse && !matchEvidence && !matchCat) return false;
    }

    if (selectedCategory !== 'ALL' && item.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }

    if (statusFilter !== 'ALL' && item.status !== statusFilter) {
      return false;
    }

    if (depthFilter !== 'ALL' && item.depth !== depthFilter) {
      return false;
    }

    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortField === 'demand') {
      return sortAsc ? a.demand_pct - b.demand_pct : b.demand_pct - a.demand_pct;
    }
    if (sortField === 'skill') {
      return sortAsc ? a.skill.localeCompare(b.skill) : b.skill.localeCompare(a.skill);
    }
    if (sortField === 'status') {
      return sortAsc ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status);
    }
    if (sortField === 'depth') {
      return sortAsc ? a.depth - b.depth : b.depth - a.depth;
    }
    if (sortField === 'confidence') {
      return sortAsc ? a.confidence - b.confidence : b.confidence - a.confidence;
    }
    return 0;
  });

  const toggleSort = (field: 'demand' | 'skill' | 'status' | 'depth' | 'confidence') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const coveredCount = skills.filter((s) => s.status === 'COVERED').length;
  const partialCount = skills.filter((s) => s.status === 'PARTIAL').length;
  const gapCount = skills.filter((s) => s.status === 'GAP').length;
  const surplusCount = surplusSkills.length;

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1424] shadow-xs overflow-hidden transition-colors">
      {/* Header and Controls */}
      <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-0.5 font-semibold">
            Comprehensive Curriculum Audit Matrix
          </span>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Market Skill Evaluation & Syllabus Evidence
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Evaluates market demand, curriculum depth (0–4 scale), semantic match classification, and audit evidence.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
            <span className="font-mono text-[11px] uppercase text-slate-500 dark:text-slate-400 font-semibold">
              Demand Cutoff:
            </span>
            <input
              type="range"
              min="1"
              max="25"
              step="1"
              value={demandThreshold}
              onChange={(e) => setDemandThreshold(Number(e.target.value))}
              className="w-16 accent-slate-900 dark:accent-white cursor-pointer"
            />
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              &ge;{demandThreshold}%
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search skill, evidence, or course code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-white"
          />
        </div>

        {/* 4 Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition text-xs ${
              statusFilter === 'ALL'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xs'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            All Skills ({combinedList.length})
          </button>

          <button
            onClick={() => setStatusFilter('COVERED')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition text-xs flex items-center gap-1.5 ${
              statusFilter === 'COVERED'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
            }`}
            title="Sufficiently taught in curriculum (Depth 3 or 4)"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Covered ({coveredCount})</span>
          </button>

          <button
            onClick={() => setStatusFilter('PARTIAL')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition text-xs flex items-center gap-1.5 ${
              statusFilter === 'PARTIAL'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 hover:bg-amber-100'
            }`}
            title="Mentioned or theoretical depth, or covered via parent/child skill (Depth 1 or 2)"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Partial ({partialCount})</span>
          </button>

          <button
            onClick={() => setStatusFilter('GAP')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition text-xs flex items-center gap-1.5 ${
              statusFilter === 'GAP'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100'
            }`}
            title="Relevant industry skill not taught in curriculum (Depth 0)"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Gaps ({gapCount})</span>
          </button>

          <button
            onClick={() => setStatusFilter('SURPLUS')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition text-xs flex items-center gap-1.5 ${
              statusFilter === 'SURPLUS'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100'
            }`}
            title="Taught in syllabus with low market representation in current dataset (specialized breadth)"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Surplus ({surplusCount})</span>
          </button>
        </div>
      </div>

      {/* Domain & Depth Pills bar */}
      <div className="px-5 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-semibold mr-1 shrink-0">
            Domain:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Depth Filter */}
        <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500 dark:text-slate-400">
          <span className="uppercase font-semibold mr-1">Depth:</span>
          {(['ALL', 0, 1, 2, 3, 4] as const).map((d) => (
            <button
              key={String(d)}
              onClick={() => setDepthFilter(d as any)}
              className={`px-2 py-0.5 rounded transition cursor-pointer ${
                depthFilter === d
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {d === 'ALL' ? 'All' : `D${d}`}
            </button>
          ))}
        </div>

        {highlightedSkill && (
          <button
            onClick={onClearHighlight}
            className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-900 flex items-center gap-1 cursor-pointer"
          >
            <span>Filter: "{highlightedSkill}"</span>
            <span className="font-bold">&times;</span>
          </button>
        )}
      </div>

      {/* The Matrix Table */}
      <div className="overflow-x-auto max-h-[600px]">
        <table className="w-full text-left text-xs">
          <thead className="sticky top-0 z-10 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-xs text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th
                onClick={() => toggleSort('skill')}
                className="py-3 px-4 cursor-pointer hover:text-slate-950 dark:hover:text-white transition"
              >
                <div className="flex items-center gap-1.5">
                  <span>Industry Skill & Match Type</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-3">Domain</th>
              <th
                onClick={() => toggleSort('demand')}
                className="py-3 px-3 cursor-pointer hover:text-slate-950 dark:hover:text-white transition text-right"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Demand %</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('status')}
                className="py-3 px-3 cursor-pointer hover:text-slate-950 dark:hover:text-white transition text-center"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span>Status</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('depth')}
                className="py-3 px-3 cursor-pointer hover:text-slate-950 dark:hover:text-white transition text-center"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span>Depth (0–4)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('confidence')}
                className="py-3 px-3 cursor-pointer hover:text-slate-950 dark:hover:text-white transition text-center"
                title="Rule-based matching confidence: heuristic precision score (not a statistical probability)"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span>Rule Conf.</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4 min-w-[240px]">Audit Evidence & Source Course</th>
              <th className="py-3 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-slate-400 font-mono text-xs">
                  No skills match your search or filter criteria.
                </td>
              </tr>
            ) : (
              sorted.map((item, idx) => {
                const isCovered = item.status === 'COVERED';
                const isPartial = item.status === 'PARTIAL';
                const isGap = item.status === 'GAP';
                const isSurplus = item.status === 'SURPLUS';

                return (
                  <tr
                    key={`${item.skill}-${idx}`}
                    className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition ${
                      highlightedSkill?.toLowerCase() === item.skill.toLowerCase() ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                    }`}
                  >
                    {/* Skill Name & Match Type */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white capitalize">
                          {item.skill}
                        </span>
                        <span
                          className={`font-mono text-[9px] uppercase px-1.5 py-0.5 rounded font-semibold ${
                            item.match_type === 'EXACT'
                              ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                              : item.match_type === 'SYNONYM'
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                              : item.match_type === 'PARENT_CHILD'
                              ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                              : item.match_type === 'RELATED'
                              ? 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                              : 'bg-slate-50 text-slate-400 dark:bg-slate-900 dark:text-slate-500'
                          }`}
                        >
                          {item.match_type === 'PARENT_CHILD' ? 'Parent/Child' : item.match_type}
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3">
                      <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                        {item.category}
                      </span>
                    </td>

                    {/* Demand % */}
                    <td className="py-3 px-3 text-right">
                      <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                        {item.demand_pct > 0 ? `${item.demand_pct}%` : '<1%'}
                      </span>
                    </td>

                    {/* 4 Status Classification */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase ${
                          isCovered
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : isPartial
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                            : isGap
                            ? 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                            : 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    {/* Curriculum Depth (0 to 4 Scale) */}
                    <td className="py-3 px-3 text-center">
                      <div className="inline-flex flex-col items-center">
                        <div className="flex items-center gap-0.5 mb-0.5">
                          {[1, 2, 3, 4].map((step) => (
                            <div
                              key={step}
                              className={`w-2 h-2 rounded-xs ${
                                item.depth >= step
                                  ? item.depth >= 3
                                    ? 'bg-emerald-500'
                                    : 'bg-amber-500'
                                  : 'bg-slate-200 dark:bg-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-mono text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                          {item.depth} &bull; {item.depth_label}
                        </span>
                      </div>
                    </td>

                    {/* Confidence */}
                    <td className="py-3 px-3 text-center">
                      <span className="font-mono font-semibold text-[11px] text-slate-700 dark:text-slate-300">
                        {item.confidence}%
                      </span>
                    </td>

                    {/* Evidence & Course Attribution */}
                    <td className="py-3 px-4 text-xs text-slate-700 dark:text-slate-300">
                      <p className="line-clamp-2 leading-relaxed text-[11px] text-slate-600 dark:text-slate-400">
                        {item.evidence}
                      </p>
                      {item.matching_course && (
                        <span className="font-mono text-[10px] font-semibold text-blue-600 dark:text-blue-400 mt-0.5 block truncate">
                          Course: {item.matching_course}
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-3 text-center">
                      {(isGap || isPartial) && onSimulateSkill && (
                        <button
                          onClick={() => onSimulateSkill(item.skill)}
                          className="px-2 py-1 rounded text-[10px] font-mono font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:hover:bg-indigo-900 dark:text-indigo-300 transition cursor-pointer"
                          title="Simulate adding or deepening this skill"
                        >
                          + Simulate
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span>
          Showing {sorted.length} of {combinedList.length} total evaluated items
        </span>
        <span className="italic">
          SURPLUS skills enrich academic breadth and should not be characterized as unnecessary.
        </span>
      </div>
    </div>
  );
};
