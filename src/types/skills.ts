export interface MarketSkill {
  skill: string;
  count: number;
  demand_pct: number;
  category: string;
}

export interface ExtractedSkill {
  skill: string;
  source_course: string;
  category: string;
  depth?: DepthLevel;
  evidence_text?: string;
}

// 4 Classifications
export type SkillStatus = 'COVERED' | 'PARTIAL' | 'GAP' | 'SURPLUS';

// Curriculum Depth Scale: 0 to 4
export type DepthLevel = 0 | 1 | 2 | 3 | 4;

export const DEPTH_LABELS: Record<DepthLevel, string> = {
  0: 'Not covered',
  1: 'Mentioned',
  2: 'Theory',
  3: 'Practical/project',
  4: 'Advanced',
};

// Semantic Match Types
export type MatchType = 'EXACT' | 'SYNONYM' | 'PARENT_CHILD' | 'RELATED' | 'NONE';

export interface AnalyzedSkill {
  skill: string;
  demand_pct: number;
  count?: number;
  category: string;
  status: SkillStatus;
  depth: DepthLevel;
  depth_label: string;
  confidence: number; // 0 to 100
  match_type: MatchType;
  evidence: string;
  matching_course?: string;
  matched_curriculum_skill?: string;
  is_simulated?: boolean;
}

export interface CategoryStat {
  category: string;
  totalMarket: number;
  covered: number;
  partial: number;
  gap: number;
  coveragePct: number;
  demandWeightedCoveragePct: number;
}

export interface RecommendationTrace {
  marketDemand: string;      // e.g. "AWS (27.4% demand), Azure (19.0% demand), Docker (16.9% demand)"
  curriculumGap: string;     // e.g. "GAP / PARTIAL (Depth 0–1 in evaluated syllabus)"
  evidence: string;          // e.g. "DS101–DS106 focus on local compute; no cloud deployment pipelines detected"
  recommendation: string;    // e.g. "Introduce 3-week Cloud Computing practicum with AWS/Azure sandboxes in DS102"
}

export interface CurriculumRecommendation {
  title: string;
  type: 'New Module' | 'Tool Integration' | 'Project / Capstone' | 'Pedagogical Update';
  priority: 'High' | 'Medium' | 'Critical';
  target_skills: string[];
  rationale: string;
  prerequisites: string[];
  academic_level: 'Undergraduate' | 'Graduate / MSc' | 'Continuing Education';
  curriculum_relevance: string;
  implementation_steps: string[];
  estimated_effort: string;
  disclaimer: string;
  trace?: RecommendationTrace;
}

export interface ScenarioSimulationItem {
  skill: string;
  depth: DepthLevel;
  targetCourse?: string;
}

export interface ScenarioSimulationResult {
  baselineScore: number;
  simulatedScore: number;
  scoreDelta: number;
  addedSkills: ScenarioSimulationItem[];
  isActive: boolean;
}

export interface MarketMetadata {
  datasetSource: string;
  postingCount: number | null;
  postingCountLabel: string;
  datasetPeriod: string;
  geography: string;
  lastUpdated: string;
  proxyDisclaimer: string;
}

export interface EvaluationMetrics {
  hasLabelledBenchmark: boolean;
  statusLabel: string;
  precision: number | null;
  recall: number | null;
  f1Score: number | null;
  truePositives: number | null;
  falsePositives: number | null;
  falseNegatives: number | null;
  groundTruthSampleCount: number | null;
  evaluationNotes: string;
}

// Curriculum Version Comparison Types
export interface CurriculumVersionSnapshot {
  id: string;
  name: string;
  timestamp: string;
  curriculumText: string;
  alignmentScore: number;
  extractedSkills: ExtractedSkill[];
  analyzedSkills: AnalyzedSkill[];
}

export interface SkillDiffItem {
  skill: string;
  category: string;
  demand_pct: number;
  oldStatus?: SkillStatus;
  newStatus?: SkillStatus;
  oldDepth?: DepthLevel;
  newDepth?: DepthLevel;
  changeType: 'ADDED' | 'REMOVED' | 'IMPROVED' | 'REGRESSED' | 'UNCHANGED';
  detail: string;
}

export interface VersionComparisonResult {
  versionA: CurriculumVersionSnapshot;
  versionB: CurriculumVersionSnapshot;
  scoreA: number;
  scoreB: number;
  scoreDelta: number;
  addedSkills: SkillDiffItem[];
  removedSkills: SkillDiffItem[];
  improvedGaps: SkillDiffItem[];
  newGaps: SkillDiffItem[];
}

export interface AnalysisSummary {
  alignmentScore: number; // Demand-weighted: Σ(c_i * w_i) / Σ(w_i) * 100
  rawCoveragePct: number; // Simple count-based ratio for reference
  totalEvaluatedDemand: number;
  coveredDemandWeight: number;
  topN: number;
  demandThreshold: number;
  totalMarketSkills: number;
  coveredSkillsCount: number;
  partialSkillsCount: number;
  gapSkillsCount: number;
  surplusSkillsCount: number;
  topGaps: AnalyzedSkill[];
  categoryStats: CategoryStat[];
  analyzedSkills: AnalyzedSkill[];
  extractedSkills: ExtractedSkill[];
  isSimulated?: boolean;
  simulationDelta?: number;
}
