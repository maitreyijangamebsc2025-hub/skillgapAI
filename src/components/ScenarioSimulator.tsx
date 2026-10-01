import React, { useState } from 'react';
import { Sparkles, Plus, Trash2, ArrowRight, CheckCircle2, RotateCcw, HelpCircle, Layers } from 'lucide-react';
import { AnalyzedSkill, DepthLevel, DEPTH_LABELS, ScenarioSimulationItem, ScenarioSimulationResult } from '../types/skills';

interface ScenarioSimulatorProps {
  analyzedSkills: AnalyzedSkill[];
  simulationResult: ScenarioSimulationResult;
  onAddSimulationSkill: (item: ScenarioSimulationItem) => void;
  onRemoveSimulationSkill: (skillName: string) => void;
  onResetSimulation: () => void;
  onApplyScenarioToViews: () => void;
  isScenarioApplied: boolean;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({
  analyzedSkills,
  simulationResult,
  onAddSimulationSkill,
  onRemoveSimulationSkill,
  onResetSimulation,
  onApplyScenarioToViews,
  isScenarioApplied,
}) => {
  // Available skills to simulate: GAP or PARTIAL skills
  const candidateSkills = analyzedSkills
    .filter((s) => s.status === 'GAP' || s.status === 'PARTIAL')
    .sort((a, b) => b.demand_pct - a.demand_pct);

  const [selectedSkill, setSelectedSkill] = useState<string>(
    candidateSkills.find((s) => s.skill.toLowerCase() === 'kubernetes')?.skill || candidateSkills[0]?.skill || ''
  );
  const [selectedDepth, setSelectedDepth] = useState<DepthLevel>(3);
  const [selectedModule, setSelectedModule] = useState<string>('DS107: Cloud & DevOps Lab Practicum');

  const handleAdd = () => {
    if (!selectedSkill) return;
    onAddSimulationSkill({
      skill: selectedSkill,
      depth: selectedDepth,
      targetCourse: selectedModule,
    });
  };

  const presetSimulations = [
    { label: '+ Add Kubernetes (Depth 3)', skill: 'kubernetes', depth: 3 as DepthLevel, module: 'DS107: Cloud & DevOps Lab' },
    { label: '+ Add AWS Cloud (Depth 3)', skill: 'aws', depth: 3 as DepthLevel, module: 'DS102: Advanced Python & Cloud' },
    { label: '+ Add Snowflake (Depth 3)', skill: 'snowflake', depth: 3 as DepthLevel, module: 'DS104: Cloud Warehousing' },
    { label: '+ Add Docker (Depth 3)', skill: 'docker', depth: 3 as DepthLevel, module: 'DS103: Containerized MLOps' },
  ];

  return (
    <div className="rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/30 dark:from-indigo-950/20 dark:via-[#090d1a] dark:to-slate-900/40 p-6 shadow-xs transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-indigo-100 dark:border-indigo-900/40 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
              <Sparkles className="w-3 h-3" />
              Scenario Analysis & Simulation
            </span>
            {isScenarioApplied && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800">
                Simulation Active on Views
              </span>
            )}
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Curriculum Enhancement Simulator ("What Happens If We Add...?")
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Test the impact of adding unaddressed market skills on your Demand-Weighted Alignment Score before modifying accreditation documents.
          </p>
        </div>

        {/* Live Score Comparison Badge */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/60 shadow-2xs shrink-0">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">Baseline</span>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 font-mono">
              {simulationResult.baselineScore.toFixed(1)}%
            </span>
          </div>

          <ArrowRight className="w-4 h-4 text-indigo-400 shrink-0" />

          <div>
            <span className="text-[10px] font-mono uppercase text-indigo-600 dark:text-indigo-400 block font-semibold">Simulated</span>
            <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 font-mono">
              {simulationResult.simulatedScore.toFixed(1)}%
            </span>
          </div>

          <div className="pl-2 border-l border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-mono uppercase text-emerald-600 dark:text-emerald-400 block font-semibold">Delta</span>
            <span
              className={`text-xs font-bold font-mono px-1.5 py-0.5 rounded ${
                simulationResult.scoreDelta > 0
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {simulationResult.scoreDelta > 0 ? `+${simulationResult.scoreDelta.toFixed(1)}%` : '0.0%'}
            </span>
          </div>
        </div>
      </div>

      {/* Simulator Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-4">
        <div className="sm:col-span-5">
          <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Skill to Add or Deepen
          </label>
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="w-full text-xs font-semibold px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {candidateSkills.map((c) => (
              <option key={c.skill} value={c.skill}>
                {c.skill} ({c.demand_pct}% demand &bull; Current: {c.status} &bull; Depth {c.depth})
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3">
          <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Simulated Depth
          </label>
          <select
            value={selectedDepth}
            onChange={(e) => setSelectedDepth(Number(e.target.value) as DepthLevel)}
            className="w-full text-xs font-semibold px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value={1}>Depth 1: Mentioned (25% credit)</option>
            <option value={2}>Depth 2: Theory (50% credit)</option>
            <option value={3}>Depth 3: Practical/project (100% credit)</option>
            <option value={4}>Depth 4: Advanced (100% credit)</option>
          </select>
        </div>

        <div className="sm:col-span-4 flex items-end">
          <button
            onClick={handleAdd}
            disabled={!selectedSkill}
            className="w-full py-2 px-3 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Simulate Skill Addition</span>
          </button>
        </div>
      </div>

      {/* Preset Fast-Click Simulations */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-semibold mr-1">
          Quick Scenarios:
        </span>
        {presetSimulations.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => {
              onAddSimulationSkill({
                skill: preset.skill,
                depth: preset.depth,
                targetCourse: preset.module,
              });
            }}
            className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Active Simulated Changes List */}
      {simulationResult.addedSkills.length > 0 && (
        <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/60 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span>Active Scenario Additions ({simulationResult.addedSkills.length} skills simulated)</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onApplyScenarioToViews}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                  isScenarioApplied
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-2xs'
                }`}
              >
                {isScenarioApplied ? 'Simulation Active (Click to Revert)' : 'Apply to Dashboard Views'}
              </button>
              <button
                onClick={onResetSimulation}
                className="px-2 py-1 rounded text-xs font-medium text-slate-500 hover:text-rose-600 transition flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {simulationResult.addedSkills.map((sim, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200"
              >
                <span className="font-bold">{sim.skill}</span>
                <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400">
                  Depth {sim.depth} ({DEPTH_LABELS[sim.depth]})
                </span>
                <button
                  onClick={() => onRemoveSimulationSkill(sim.skill)}
                  className="hover:text-rose-600 p-0.5 transition cursor-pointer"
                  title="Remove this simulation"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Methodology Disclaimer */}
      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
        * Note: Simulated Scenarios calculate hypothetical curriculum enhancements using the identical demand-weighted formula &Sigma;(c<sub>i</sub> &times; w<sub>i</sub>) / &Sigma;(w<sub>i</sub>). Actual student learning outcomes depend on syllabus delivery and faculty assessment.
      </p>
    </div>
  );
};
