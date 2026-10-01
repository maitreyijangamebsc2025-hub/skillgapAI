import React from 'react';
import { Sparkles, Lightbulb, Clock, CheckCircle2, GraduationCap, AlertTriangle, Layers, BookOpen } from 'lucide-react';
import { CurriculumRecommendation } from '../types/skills';

interface AiRecommendationsProps {
  recommendations: CurriculumRecommendation[];
  onGenerate: () => void;
  isLoading: boolean;
  alignmentScore: number;
}

export const AiRecommendations: React.FC<AiRecommendationsProps> = ({
  recommendations,
  onGenerate,
  isLoading,
  alignmentScore,
}) => {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1424] overflow-hidden shadow-xs transition-colors">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-0.5 font-semibold">
            Prescriptive Curriculum Advisory
          </span>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Accreditation-Oriented Curriculum Enhancements
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Data-backed proposals considering market demand, existing coverage, academic level, and realistic faculty implementation effort.
          </p>
        </div>

        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 transition shadow-2xs disabled:opacity-50 cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400 dark:text-blue-600" />
          <span>{isLoading ? 'Synthesizing Roadmap...' : recommendations.length > 0 ? 'Regenerate Proposals' : 'Synthesize 5 AI Recommendations'}</span>
        </button>
      </div>

      {/* Recommendations Cards */}
      {recommendations.length > 0 && (
        <div className="p-5 sm:p-6 space-y-4">
          {recommendations.map((rec, idx) => {
            const isCritical = rec.priority?.toLowerCase() === 'critical';
            const isHigh = rec.priority?.toLowerCase() === 'high';

            return (
              <div
                key={idx}
                className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700 transition"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-md font-mono text-xs font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {rec.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {rec.type}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        isCritical
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                          : isHigh
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-900'
                          : 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-900'
                      }`}
                    >
                      {rec.priority} Priority
                    </span>

                    {rec.academic_level && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-900">
                        <GraduationCap className="w-3 h-3" />
                        {rec.academic_level}
                      </span>
                    )}

                    <span className="flex items-center gap-1 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      <Clock className="w-3 h-3" />
                      {rec.estimated_effort}
                    </span>
                  </div>
                </div>

                {/* Target Skills */}
                <div className="flex flex-wrap items-center gap-1.5 my-2.5">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-tight font-semibold">
                    Target Skills:
                  </span>
                  {rec.target_skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded text-[11px] font-mono capitalize bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* "Why this recommendation?" 4-Step Chain */}
                <div className="my-3.5 p-3.5 rounded-xl bg-blue-50/70 dark:bg-slate-950/70 border border-blue-200/80 dark:border-slate-800 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-600 text-white dark:bg-blue-500">
                      Audit Trace
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Why this recommendation?
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-[11px]">
                    {/* Step 1: Market Demand */}
                    <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                      <div className="flex items-center gap-1.5 mb-1 text-slate-500 dark:text-slate-400 font-mono text-[10px] font-bold uppercase">
                        <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center text-[9px]">1</span>
                        <span>Market Demand</span>
                      </div>
                      <p className="text-slate-800 dark:text-slate-200 leading-snug font-medium">
                        {rec.trace?.marketDemand || `Target skills (${rec.target_skills.slice(0, 3).join(', ')}) represent prioritized market demand in dataset.`}
                      </p>
                    </div>

                    {/* Step 2: Curriculum Gap */}
                    <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                      <div className="flex items-center gap-1.5 mb-1 text-amber-600 dark:text-amber-400 font-mono text-[10px] font-bold uppercase">
                        <span className="w-4 h-4 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center text-[9px]">2</span>
                        <span>Curriculum Gap</span>
                      </div>
                      <p className="text-slate-800 dark:text-slate-200 leading-snug font-medium">
                        {rec.trace?.curriculumGap || `Identified as unaddressed or partial depth (Depth 0–1) in evaluated syllabus.`}
                      </p>
                    </div>

                    {/* Step 3: Evidence */}
                    <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                      <div className="flex items-center gap-1.5 mb-1 text-slate-500 dark:text-slate-400 font-mono text-[10px] font-bold uppercase">
                        <span className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-[9px]">3</span>
                        <span>Audit Evidence</span>
                      </div>
                      <p className="text-slate-800 dark:text-slate-200 leading-snug font-medium">
                        {rec.trace?.evidence || `Curriculum audit indicates theoretical or isolated coverage without production deliverables.`}
                      </p>
                    </div>

                    {/* Step 4: Recommendation */}
                    <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                      <div className="flex items-center gap-1.5 mb-1 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold uppercase">
                        <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[9px]">4</span>
                        <span>Recommendation</span>
                      </div>
                      <p className="text-slate-800 dark:text-slate-200 leading-snug font-medium">
                        {rec.trace?.recommendation || `Implement structured ${rec.type.toLowerCase()} with explicit milestones.`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Rationale & Curriculum Relevance */}
                <div className="space-y-1.5 mb-3 text-xs leading-relaxed">
                  <p className="text-slate-700 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white">Industry Demand Rationale:</strong> {rec.rationale}
                  </p>
                  {rec.curriculum_relevance && (
                    <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                      <strong className="text-slate-800 dark:text-slate-200">Curriculum Fit:</strong> {rec.curriculum_relevance}
                    </p>
                  )}
                  {rec.prerequisites && rec.prerequisites.length > 0 && (
                    <p className="text-slate-600 dark:text-slate-400 text-[11px] font-mono">
                      <strong>Prerequisites:</strong> {rec.prerequisites.join(' &bull; ')}
                    </p>
                  )}
                </div>

                {/* Implementation Steps */}
                {rec.implementation_steps && rec.implementation_steps.length > 0 && (
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400 font-semibold mb-2 block">
                      Implementation Milestones
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {rec.implementation_steps.map((step, sIdx) => (
                        <div
                          key={sIdx}
                          className="p-2.5 rounded-lg bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2"
                        >
                          <span className="font-mono text-[10px] font-bold text-slate-400 shrink-0">
                            0{sIdx + 1}
                          </span>
                          <span className="leading-snug text-[11px]">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Outcome Transparency Disclaimer Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 flex items-start gap-2 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p>
          <strong>Educational Outcome Transparency:</strong> Curriculum enhancements provide structured alignment with empirical tech market demand and mitigate graduate onboarding friction. However, academic institutions should not and cannot claim that adding specific technologies guarantees employment outcomes, starting salaries, or hiring placement.
        </p>
      </div>
    </div>
  );
};
