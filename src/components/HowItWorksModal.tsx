import React from 'react';
import { X, Cpu, Search, CheckCircle2, Lightbulb, FileText } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      step: '01',
      title: 'Curriculum Ingestion & NLP Extraction',
      desc: 'The syllabus is processed using Gemini NLP. It parses modules and learning outcomes to extract technical tools, frameworks, concepts, and soft skills with their corresponding course attribution.',
    },
    {
      step: '02',
      title: 'Canonical Normalization & Synonym Merging',
      desc: 'Extracted skills undergo lexical normalization: converting to canonical lowercase forms and merging aliases (e.g., "ML" -> "machine learning", "k8s" -> "kubernetes", "sklearn" -> "scikit-learn").',
    },
    {
      step: '03',
      title: 'Rule-Based Semantic Skill Matching & Normalization',
      desc: 'Each market skill from the Kaggle Data Science telemetry distribution is evaluated using heuristic precision tiers: exact canonical match (99% rule conf.), synonym dictionary (96% rule conf.), parent-child concept hierarchies (84% rule conf., e.g. Deep Learning vs. TensorFlow), and related technology mappings (72% rule conf., e.g. SQL vs. Snowflake).',
    },
    {
      step: '04',
      title: 'Four-Tier Classification & Curriculum Depth (0–4)',
      desc: (
        <div className="space-y-1.5 mt-1 text-[11px]">
          <div><strong className="text-emerald-600 dark:text-emerald-400 font-mono">COVERED (Depth 3–4):</strong> Sufficiently taught with practical lab assignments, coding exercises, or advanced capstone deliverables (100% weight credit).</div>
          <div><strong className="text-amber-600 dark:text-amber-400 font-mono">PARTIAL (Depth 1–2):</strong> Mentioned conceptually or theoretical foundational coverage via parent/child relations (proportional 25%–50% weight credit).</div>
          <div><strong className="text-rose-600 dark:text-rose-400 font-mono">GAP (Depth 0):</strong> High-demand industry skill completely unaddressed in current syllabus (0% credit).</div>
          <div><strong className="text-blue-600 dark:text-blue-400 font-mono">SURPLUS:</strong> Taught in curriculum with specialized academic focus but lower empirical frequency in market postings. Acknowledged as valuable academic breadth.</div>
        </div>
      ),
    },
    {
      step: '05',
      title: 'Demand-Weighted Scoring & Version Comparison',
      desc: (
        <div className="space-y-1 text-[11px]">
          <div>Exact scoring formula: <code>Alignment Score = &Sigma;(c_i &times; w_i) / &Sigma;(w_i) &times; 100</code> across top evaluated market skills.</div>
          <div>Allows running "What-If" scenario simulations and comparing curriculum versions to track score changes, added/removed skills, and improved gaps.</div>
        </div>
      ),
    },
    {
      step: '06',
      title: 'Prescriptive AI Curriculum Recommendations & Audit Trace',
      desc: 'Gemini synthesizes gap clusters into 5 structured roadmaps with explicit prerequisites, academic levels, and a transparent audit trace: Market Demand &rarr; Curriculum Gap &rarr; Syllabus Evidence &rarr; Recommendation.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 block mb-0.5">
              Documentation
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-600" />
              How SkillGap AI Works: The NLP Pipeline
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-3">
          {steps.map((item) => (
            <div
              key={item.step}
              className="p-4 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-xs font-bold text-slate-400">
                  {item.step}
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h4>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-6">
                {item.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-md bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
