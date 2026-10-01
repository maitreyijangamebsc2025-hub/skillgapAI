import React, { useState } from 'react';
import { AnalyzedSkill } from '../types/skills';
import { Flame, Info } from 'lucide-react';

interface GapWordCloudProps {
  gapSkills: AnalyzedSkill[];
  onSelectSkill?: (skillName: string) => void;
  selectedSkill?: string | null;
}

export const GapWordCloud: React.FC<GapWordCloudProps> = ({
  gapSkills,
  onSelectSkill,
  selectedSkill,
}) => {
  const [hoveredSkill, setHoveredSkill] = useState<AnalyzedSkill | null>(null);

  const gaps = gapSkills
    .filter((s) => s.status === 'GAP')
    .sort((a, b) => b.demand_pct - a.demand_pct);

  if (gaps.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xs text-center">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Zero High-Demand Gaps</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          The curriculum fully covers the active market skills at the selected threshold!
        </p>
      </div>
    );
  }

  const maxDemand = Math.max(...gaps.map((g) => g.demand_pct), 1);
  const minDemand = Math.min(...gaps.map((g) => g.demand_pct), 1);

  const getStyleForSkill = (demandPct: number, isSelected: boolean) => {
    const ratio = (demandPct - minDemand) / (maxDemand - minDemand || 1);
    const fontSizeRem = 0.85 + ratio * 0.75;

    let colorClass = 'bg-red-500/10 text-rose-700 dark:text-rose-400 hover:bg-red-500/20';
    if (isSelected) {
      colorClass = 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold';
    }

    return {
      style: { fontSize: `${fontSizeRem}rem` },
      className: colorClass,
    };
  };

  return (
    <div className="rounded-lg border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 block mb-0.5">
            Vocabulary Density
          </span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Missing Skills Word Cloud
          </h3>
        </div>

        <span className="font-mono text-xs font-semibold text-rose-600 dark:text-rose-400">
          {gaps.length} Gaps
        </span>
      </div>

      <div className="p-4 rounded-md bg-slate-50/60 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 min-h-[160px] flex flex-wrap items-center justify-center gap-2">
        {gaps.map((skill) => {
          const isSelected = selectedSkill === skill.skill;
          const { style, className } = getStyleForSkill(skill.demand_pct, isSelected);

          return (
            <button
              key={skill.skill}
              style={style}
              onClick={() => onSelectSkill && onSelectSkill(skill.skill === selectedSkill ? '' : skill.skill)}
              onMouseEnter={() => setHoveredSkill(skill)}
              onMouseLeave={() => setHoveredSkill(null)}
              className={`px-3 py-1 rounded text-xs font-mono font-medium transition cursor-pointer flex items-center gap-1.5 ${className}`}
              title={`${skill.skill}: ${skill.demand_pct}% demand`}
            >
              <span>{skill.skill}</span>
              <span className="text-[10px] opacity-75 font-mono">{skill.demand_pct}%</span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 min-h-[20px] flex items-center">
        {hoveredSkill ? (
          <span className="font-mono">
            {hoveredSkill.skill} &bull; {hoveredSkill.category} &bull; {hoveredSkill.demand_pct}% demand ({hoveredSkill.count?.toLocaleString()} job postings)
          </span>
        ) : (
          <span className="italic text-[11px] text-slate-400">Click any tag to filter the skill table</span>
        )}
      </div>
    </div>
  );
};
