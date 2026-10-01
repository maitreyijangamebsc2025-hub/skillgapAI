import {
  AnalyzedSkill,
  CategoryStat,
  CurriculumRecommendation,
  CurriculumVersionSnapshot,
  DepthLevel,
  DEPTH_LABELS,
  ExtractedSkill,
  MarketSkill,
  MatchType,
  ScenarioSimulationItem,
  ScenarioSimulationResult,
  SkillDiffItem,
  SkillStatus,
  VersionComparisonResult,
} from '../types/skills';

// 1. Exact canonical acronym / synonym dictionary (identical tool / exact alias)
export const TRUE_SYNONYMS: Record<string, string> = {
  k8s: 'kubernetes',
  k8: 'kubernetes',
  sklearn: 'scikit-learn',
  postgres: 'postgresql',
  powerbi: 'power bi',
  bi: 'power bi',
  'continuous integration': 'ci/cd',
  ci: 'ci/cd',
  cd: 'ci/cd',
  devops: 'ci/cd',
  'r programming': 'r',
  rstudio: 'r',
  'r-lang': 'r',
  py: 'python',
  python3: 'python',
  'machine learning': 'ml',
  ml: 'machine learning',
  'natural language processing': 'nlp',
  nlp: 'natural language processing',
  'computer vision': 'cv',
  cv: 'computer vision',
  'data visualization': 'data storytelling',
  'visual storytelling': 'data storytelling',
  scrum: 'agile',
  kanban: 'agile',
  github: 'git',
  'git/github': 'git',
  bash: 'linux',
  shell: 'linux',
  unix: 'linux',
  'analytical thinking': 'critical thinking',
  'public speaking': 'presentation',
  'oral presentation': 'presentation',
  'team collaboration': 'teamwork',
  collaboration: 'teamwork',
  'problem-solving': 'problem solving',
};

// 2. Parent-Child Hierarchies
// (Avoid treating things like Deep Learning = TensorFlow, AWS = AWS S3, or Relational DB = PostgreSQL as exact matches)
export interface SkillRelationship {
  parent: string;
  child: string;
}

export const PARENT_CHILD_RELATIONS: SkillRelationship[] = [
  // Cloud infrastructure parent & child services
  { parent: 'aws', child: 'aws s3' },
  { parent: 'aws', child: 'aws ec2' },
  { parent: 'aws', child: 'aws lambda' },
  { parent: 'aws', child: 'amazon web services' },
  { parent: 'azure', child: 'microsoft azure' },
  { parent: 'azure', child: 'azure ml' },
  { parent: 'gcp', child: 'google cloud' },
  { parent: 'gcp', child: 'google cloud platform' },
  { parent: 'cloud', child: 'aws' },
  { parent: 'cloud', child: 'azure' },
  { parent: 'cloud', child: 'gcp' },
  // AI / Deep Learning parent & specific framework/model child
  { parent: 'deep learning', child: 'tensorflow' },
  { parent: 'deep learning', child: 'pytorch' },
  { parent: 'deep learning', child: 'keras' },
  { parent: 'deep learning', child: 'neural networks' },
  { parent: 'deep learning', child: 'cnn' },
  { parent: 'deep learning', child: 'rnn' },
  { parent: 'machine learning', child: 'deep learning' },
  { parent: 'machine learning', child: 'scikit-learn' },
  // Databases & Storage
  { parent: 'relational database', child: 'postgresql' },
  { parent: 'relational database', child: 'mysql' },
  { parent: 'relational database', child: 'sqlite' },
  { parent: 'nosql', child: 'mongodb' },
  { parent: 'big data', child: 'spark' },
  { parent: 'big data', child: 'hadoop' },
  // Analytics
  { parent: 'statistics', child: 'probability' },
  { parent: 'statistics', child: 'hypothesis testing' },
  { parent: 'statistics', child: 'inferential statistics' },
  { parent: 'data visualization', child: 'tableau' },
  { parent: 'data visualization', child: 'power bi' },
  { parent: 'data visualization', child: 'matplotlib' },
  { parent: 'data visualization', child: 'seaborn' },
];

// 3. Related Skills (Sister technologies, complementary concepts)
// (e.g. SQL is related to PostgreSQL and Snowflake, Docker is related to Kubernetes)
export const RELATED_SKILLS_MAP: Record<string, string[]> = {
  sql: ['postgresql', 'mysql', 'snowflake', 'sqlite', 'relational database'],
  postgresql: ['sql', 'relational database', 'databases'],
  snowflake: ['sql', 'big data', 'cloud warehousing', 'spark'],
  docker: ['kubernetes', 'ci/cd', 'containerization'],
  kubernetes: ['docker', 'ci/cd', 'cloud', 'devops'],
  aws: ['azure', 'gcp', 'cloud', 'docker'],
  azure: ['aws', 'gcp', 'cloud'],
  spark: ['big data', 'python', 'sql', 'hadoop'],
  tensorflow: ['pytorch', 'deep learning', 'keras'],
  pytorch: ['tensorflow', 'deep learning'],
  'power bi': ['tableau', 'data visualization', 'dashboards', 'sql'],
  tableau: ['power bi', 'data visualization', 'dashboards'],
  git: ['ci/cd', 'github', 'agile'],
  mlops: ['docker', 'kubernetes', 'ci/cd', 'machine learning', 'git'],
};

export function normalizeSkillName(name: string): string {
  const clean = name.toLowerCase().trim().replace(/['"]/g, '');
  return TRUE_SYNONYMS[clean] || clean;
}

export interface MatchEvaluation {
  matchType: MatchType;
  matchedCurriculumSkill: string;
  matchingCourse: string;
  depth: DepthLevel;
  confidence: number;
  evidence: string;
}

/**
 * Rule-based semantic skill evaluator.
 * Evaluates market skill against syllabus extracted skills using heuristic tiers:
 * - EXACT match (99% rule-based confidence, depth 3-4)
 * - SYNONYM match (96% rule-based confidence, depth 3-4)
 * - PARENT_CHILD match (84% rule-based confidence, depth 2, classified as PARTIAL)
 * - RELATED match (72% rule-based confidence, depth 1, classified as PARTIAL)
 * - NONE (98% rule-based confidence of GAP, depth 0)
 * Note: Confidence scores reflect rule-based heuristic precision, not statistical probabilities.
 */
export function evaluateSkillAgainstCurriculum(
  marketSkillName: string,
  curriculumSkills: ExtractedSkill[]
): MatchEvaluation {
  const normMarket = normalizeSkillName(marketSkillName);

  // 1. EXACT Match Check
  for (const c of curriculumSkills) {
    const normCurr = normalizeSkillName(c.skill);
    if (normCurr === normMarket) {
      // Determine depth based on course attribution and syllabus hints
      const depth: DepthLevel = c.depth ?? (
        c.source_course.toLowerCase().includes('advanced') || c.source_course.toLowerCase().includes('capstone')
          ? 4
          : 3
      );
      return {
        matchType: 'EXACT',
        matchedCurriculumSkill: c.skill,
        matchingCourse: c.source_course,
        depth,
        confidence: 99,
        evidence: `Directly taught in ${c.source_course} (${c.evidence_text || 'Core topic coverage with practical exercises'}).`,
      };
    }
  }

  // 2. SYNONYM Match Check
  for (const c of curriculumSkills) {
    const normCurr = normalizeSkillName(c.skill);
    if (TRUE_SYNONYMS[normCurr] === normMarket || TRUE_SYNONYMS[normMarket] === normCurr) {
      const depth: DepthLevel = c.depth ?? 3;
      return {
        matchType: 'SYNONYM',
        matchedCurriculumSkill: c.skill,
        matchingCourse: c.source_course,
        depth,
        confidence: 96,
        evidence: `Taught in ${c.source_course} under industry alias "${c.skill}".`,
      };
    }
  }

  // 3. PARENT / CHILD Check
  // Check if curriculum teaches parent or child concept
  for (const rel of PARENT_CHILD_RELATIONS) {
    // Case A: Market skill is child (e.g. postgresql), curriculum has parent (e.g. relational database)
    if (normalizeSkillName(rel.child) === normMarket) {
      const matchingParent = curriculumSkills.find((c) => normalizeSkillName(c.skill) === normalizeSkillName(rel.parent));
      if (matchingParent) {
        return {
          matchType: 'PARENT_CHILD',
          matchedCurriculumSkill: matchingParent.skill,
          matchingCourse: matchingParent.source_course,
          depth: 2, // Theory / foundational depth
          confidence: 84,
          evidence: `Foundational parent concept "${matchingParent.skill}" covered in ${matchingParent.source_course}; specific practical implementation of ${marketSkillName} not explicitly demonstrated.`,
        };
      }
    }

    // Case B: Market skill is parent (e.g. AWS or Deep Learning), curriculum teaches specific child (e.g. AWS S3 or PyTorch)
    if (normalizeSkillName(rel.parent) === normMarket) {
      const matchingChild = curriculumSkills.find((c) => normalizeSkillName(c.skill) === normalizeSkillName(rel.child));
      if (matchingChild) {
        return {
          matchType: 'PARENT_CHILD',
          matchedCurriculumSkill: matchingChild.skill,
          matchingCourse: matchingChild.source_course,
          depth: 2, // Partial depth
          confidence: 86,
          evidence: `Component technology "${matchingChild.skill}" taught in ${matchingChild.source_course}, providing partial coverage of the broader ${marketSkillName} ecosystem.`,
        };
      }
    }
  }

  // 4. RELATED Skill Check
  // (e.g. SQL taught in DS104 gives partial related conceptual grounding for Snowflake, but not full practical depth)
  if (RELATED_SKILLS_MAP[normMarket]) {
    const relatedTerms = RELATED_SKILLS_MAP[normMarket];
    for (const term of relatedTerms) {
      const matchingRelated = curriculumSkills.find((c) => normalizeSkillName(c.skill) === normalizeSkillName(term));
      if (matchingRelated) {
        return {
          matchType: 'RELATED',
          matchedCurriculumSkill: matchingRelated.skill,
          matchingCourse: matchingRelated.source_course,
          depth: 1, // Mentioned / related grounding
          confidence: 72,
          evidence: `Related technology "${matchingRelated.skill}" covered in ${matchingRelated.source_course}; however, ${marketSkillName} has distinct architectural requirements not addressed.`,
        };
      }
    }
  }

  // 5. NO MATCH (GAP)
  return {
    matchType: 'NONE',
    matchedCurriculumSkill: '',
    matchingCourse: '',
    depth: 0,
    confidence: 98,
    evidence: 'No matching curriculum content detected.',
  };
}

export interface MatchResult {
  analyzedSkills: AnalyzedSkill[];
  surplusSkills: AnalyzedSkill[];
  alignmentScore: number; // Demand-Weighted Alignment Score
  rawCoveragePct: number; // Simple count-based ratio
  totalEvaluatedDemand: number;
  coveredDemandWeight: number;
  coveredCount: number;
  partialCount: number;
  gapCount: number;
  surplusCount: number;
  categoryStats: CategoryStat[];
}

/**
 * Computes the complete curriculum alignment analysis using:
 * 1. Demand-Weighted Alignment Score:
 *    Σ (c_i * w_i) / Σ (w_i) * 100
 *    where:
 *      w_i = market demand percentage of evaluated skill i
 *      c_i = 1.0 if COVERED (depth 3 or 4)
 *      c_i = 0.5 if PARTIAL (depth 1 or 2)
 *      c_i = 0.0 if GAP (depth 0)
 * 2. 4-tier Classification: COVERED, PARTIAL, GAP, SURPLUS.
 * 3. Curriculum Depth rating (0 to 4).
 * 4. Transparent evidence & deterministic confidence.
 */
export function computeAnalysis(
  marketSkills: MarketSkill[],
  extractedSkills: ExtractedSkill[],
  demandThreshold: number = 5,
  topN: number = 15
): MatchResult {
  // Sort market skills by demand percentage descending
  const sortedMarket = [...marketSkills].sort((a, b) => b.demand_pct - a.demand_pct);

  const matchedExtractedSet = new Set<string>();

  const analyzedMarketSkills: AnalyzedSkill[] = sortedMarket.map((mSkill) => {
    const evaluation = evaluateSkillAgainstCurriculum(mSkill.skill, extractedSkills);

    let status: SkillStatus;
    if (evaluation.depth >= 3 && (evaluation.matchType === 'EXACT' || evaluation.matchType === 'SYNONYM')) {
      status = 'COVERED';
    } else if (evaluation.depth >= 1) {
      status = 'PARTIAL';
    } else {
      status = 'GAP';
    }

    if (evaluation.matchedCurriculumSkill) {
      matchedExtractedSet.add(normalizeSkillName(evaluation.matchedCurriculumSkill));
    }

    return {
      skill: mSkill.skill,
      demand_pct: mSkill.demand_pct,
      count: mSkill.count,
      category: mSkill.category,
      status,
      depth: evaluation.depth,
      depth_label: DEPTH_LABELS[evaluation.depth],
      confidence: evaluation.confidence,
      match_type: evaluation.matchType,
      evidence: evaluation.evidence,
      matching_course: evaluation.matchingCourse || undefined,
      matched_curriculum_skill: evaluation.matchedCurriculumSkill || undefined,
    };
  });

  // Identify SURPLUS curriculum skills
  // (taught in curriculum but currently low market representation in this empirical dataset)
  // CRITICAL: NEVER describe SURPLUS as unnecessary.
  const surplusFromCurriculum: AnalyzedSkill[] = [];
  extractedSkills.forEach((ext) => {
    const norm = normalizeSkillName(ext.skill);
    const inMarket = sortedMarket.find((m) => normalizeSkillName(m.skill) === norm);

    if (!inMarket || inMarket.demand_pct < demandThreshold) {
      const depth: DepthLevel = ext.depth ?? 3;
      surplusFromCurriculum.push({
        skill: ext.skill,
        demand_pct: inMarket ? inMarket.demand_pct : 0,
        count: inMarket ? inMarket.count : 0,
        category: ext.category || 'Other',
        status: 'SURPLUS',
        depth,
        depth_label: DEPTH_LABELS[depth],
        confidence: 95,
        match_type: 'EXACT',
        evidence: `Taught in ${ext.source_course}. Provides specialized academic breadth with niche market representation in this dataset.`,
        matching_course: ext.source_course,
        matched_curriculum_skill: ext.skill,
      });
    }
  });

  // Evaluated pool: Top N in-demand skills (or threshold set)
  const evaluatedSkills = analyzedMarketSkills.slice(0, Math.min(topN, analyzedMarketSkills.length));

  // Compute Demand-Weighted Alignment Score:
  // Σ (c_i * w_i) / Σ (w_i) * 100
  let totalEvaluatedDemand = 0;
  let coveredDemandWeight = 0;
  let coveredCountInTopN = 0;

  evaluatedSkills.forEach((s) => {
    const w = s.demand_pct;
    totalEvaluatedDemand += w;

    if (s.status === 'COVERED') {
      // 100% credit for adequately covered skills (depth 3 or 4)
      coveredDemandWeight += w * 1.0;
      coveredCountInTopN += 1;
    } else if (s.status === 'PARTIAL') {
      // Proportional partial depth credit: Depth 2 = 50%, Depth 1 = 25%
      const creditFactor = s.depth === 2 ? 0.5 : 0.25;
      coveredDemandWeight += w * creditFactor;
    }
    // GAP contributes 0.0
  });

  const alignmentScore =
    totalEvaluatedDemand > 0
      ? Math.round((coveredDemandWeight / totalEvaluatedDemand) * 1000) / 10
      : 0;

  const rawCoveragePct =
    evaluatedSkills.length > 0
      ? Math.round((coveredCountInTopN / evaluatedSkills.length) * 100)
      : 0;

  // Category statistics with both count and demand-weighted coverage
  const categories = ['Programming', 'Cloud', 'ML/AI', 'Databases', 'Visualization', 'Soft Skills'];
  const categoryStats: CategoryStat[] = categories.map((cat) => {
    const inCat = analyzedMarketSkills.filter((s) => s.category.toLowerCase() === cat.toLowerCase());
    const totalMarket = inCat.length;
    const covered = inCat.filter((s) => s.status === 'COVERED').length;
    const partial = inCat.filter((s) => s.status === 'PARTIAL').length;
    const gap = inCat.filter((s) => s.status === 'GAP').length;

    let catTotalWeight = 0;
    let catCoveredWeight = 0;
    inCat.forEach((s) => {
      catTotalWeight += s.demand_pct;
      if (s.status === 'COVERED') catCoveredWeight += s.demand_pct;
      else if (s.status === 'PARTIAL') catCoveredWeight += s.demand_pct * (s.depth === 2 ? 0.5 : 0.25);
    });

    const coveragePct = totalMarket > 0 ? Math.round((covered / totalMarket) * 100) : 0;
    const demandWeightedCoveragePct =
      catTotalWeight > 0 ? Math.round((catCoveredWeight / catTotalWeight) * 100) : 0;

    return {
      category: cat,
      totalMarket,
      covered,
      partial,
      gap,
      coveragePct,
      demandWeightedCoveragePct,
    };
  });

  const coveredCount = analyzedMarketSkills.filter((s) => s.status === 'COVERED').length;
  const partialCount = analyzedMarketSkills.filter((s) => s.status === 'PARTIAL').length;
  const gapCount = analyzedMarketSkills.filter((s) => s.status === 'GAP').length;
  const surplusCount = surplusFromCurriculum.length;

  return {
    analyzedSkills: analyzedMarketSkills,
    surplusSkills: surplusFromCurriculum,
    alignmentScore,
    rawCoveragePct,
    totalEvaluatedDemand: Math.round(totalEvaluatedDemand * 10) / 10,
    coveredDemandWeight: Math.round(coveredDemandWeight * 10) / 10,
    coveredCount,
    partialCount,
    gapCount,
    surplusCount,
    categoryStats,
  };
}

/**
 * Scenario Analysis Simulator:
 * "What happens if we add Kubernetes?"
 * Recalculates the exact demand-weighted alignment score when specific skills
 * are added or deepened to a given target depth.
 */
export function simulateScenario(
  baseMarketSkills: MarketSkill[],
  baseExtractedSkills: ExtractedSkill[],
  scenarioItems: ScenarioSimulationItem[],
  demandThreshold: number = 5,
  topN: number = 15
): ScenarioSimulationResult {
  // Baseline calculation
  const baselineResult = computeAnalysis(baseMarketSkills, baseExtractedSkills, demandThreshold, topN);

  // Augmented extracted skills list
  const simulatedExtracted: ExtractedSkill[] = [...baseExtractedSkills];

  scenarioItems.forEach((simItem) => {
    const normSim = normalizeSkillName(simItem.skill);
    const existingIdx = simulatedExtracted.findIndex((e) => normalizeSkillName(e.skill) === normSim);

    const simulatedCourse = simItem.targetCourse || 'Proposed Curriculum Enhancement Module';
    const marketRef = baseMarketSkills.find((m) => normalizeSkillName(m.skill) === normSim);

    if (existingIdx >= 0) {
      simulatedExtracted[existingIdx] = {
        ...simulatedExtracted[existingIdx],
        depth: simItem.depth,
        source_course: simulatedCourse,
        evidence_text: `Simulated practical lab coverage at Depth ${simItem.depth} (${DEPTH_LABELS[simItem.depth]}).`,
      };
    } else {
      simulatedExtracted.push({
        skill: simItem.skill,
        source_course: simulatedCourse,
        category: marketRef ? marketRef.category : 'Programming',
        depth: simItem.depth,
        evidence_text: `Simulated curriculum addition at Depth ${simItem.depth} (${DEPTH_LABELS[simItem.depth]}).`,
      });
    }
  });

  const simulatedResult = computeAnalysis(baseMarketSkills, simulatedExtracted, demandThreshold, topN);

  const scoreDelta = Math.round((simulatedResult.alignmentScore - baselineResult.alignmentScore) * 10) / 10;

  return {
    baselineScore: baselineResult.alignmentScore,
    simulatedScore: simulatedResult.alignmentScore,
    scoreDelta,
    addedSkills: scenarioItems,
    isActive: scenarioItems.length > 0,
  };
}

/**
 * Ultra-fast local NLP skill extractor (< 5ms) that scans syllabus text
 * for all known market skills and relationships with depth inference.
 */
export function extractSkillsLocally(text: string, marketSkills: MarketSkill[]): ExtractedSkill[] {
  const lower = text.toLowerCase();
  const extracted: ExtractedSkill[] = [];
  const foundSet = new Set<string>();

  const lines = text.split('\n');

  marketSkills.forEach((m) => {
    const skillNorm = normalizeSkillName(m.skill);
    if (foundSet.has(skillNorm)) return;

    const escaped = m.skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');

    if (regex.test(lower) || lower.includes(m.skill.toLowerCase())) {
      let sourceCourse = 'Curriculum Core';
      let evidenceText = 'Taught in syllabus';
      let depth: DepthLevel = 3;

      for (const line of lines) {
        if (regex.test(line) || line.toLowerCase().includes(m.skill.toLowerCase())) {
          const matchCourse = line.match(/(DS\d+|Course\s*\d+|Module\s*\d+|Unit\s*\d+|[A-Z]{2,}\s*\d+[^:]*):/i);
          if (matchCourse) {
            sourceCourse = matchCourse[0].replace(':', '').trim();
          } else if (line.trim().length < 60 && line.includes(':')) {
            sourceCourse = line.split(':')[0].trim();
          }

          evidenceText = line.trim().slice(0, 140);

          // Infer depth from course context
          const lineLower = line.toLowerCase();
          if (lineLower.includes('advanced') || lineLower.includes('capstone') || lineLower.includes('production')) {
            depth = 4;
          } else if (lineLower.includes('lab') || lineLower.includes('project') || lineLower.includes('implementation')) {
            depth = 3;
          } else if (lineLower.includes('overview') || lineLower.includes('concept') || lineLower.includes('theory')) {
            depth = 2;
          } else if (lineLower.includes('intro') || lineLower.includes('mentioned')) {
            depth = 1;
          }
          break;
        }
      }

      foundSet.add(skillNorm);
      extracted.push({
        skill: skillNorm,
        source_course: sourceCourse,
        category: m.category,
        depth,
        evidence_text: evidenceText,
      });
    }
  });

  return extracted;
}

/**
 * Compares two curriculum versions (Version A vs. Version B) and generates
 * deterministic diff analytics:
 * - Score changes (Delta)
 * - Added skills
 * - Removed skills
 * - Improved Gaps (e.g., GAP -> PARTIAL/COVERED or depth increase)
 * - New / Regressed Gaps (e.g., COVERED -> GAP or depth decrease)
 */
export function compareCurriculumVersions(
  versionA: CurriculumVersionSnapshot,
  versionB: CurriculumVersionSnapshot
): VersionComparisonResult {
  const scoreA = versionA.alignmentScore;
  const scoreB = versionB.alignmentScore;
  const scoreDelta = Math.round((scoreB - scoreA) * 10) / 10;

  const mapA = new Map<string, AnalyzedSkill>();
  versionA.analyzedSkills.forEach((s) => mapA.set(normalizeSkillName(s.skill), s));

  const mapB = new Map<string, AnalyzedSkill>();
  versionB.analyzedSkills.forEach((s) => mapB.set(normalizeSkillName(s.skill), s));

  const addedSkills: SkillDiffItem[] = [];
  const removedSkills: SkillDiffItem[] = [];
  const improvedGaps: SkillDiffItem[] = [];
  const newGaps: SkillDiffItem[] = [];

  const extNamesA = new Set(versionA.extractedSkills.map((e) => normalizeSkillName(e.skill)));
  const extNamesB = new Set(versionB.extractedSkills.map((e) => normalizeSkillName(e.skill)));

  // Identify added skills in Version B
  versionB.extractedSkills.forEach((extB) => {
    const norm = normalizeSkillName(extB.skill);
    if (!extNamesA.has(norm)) {
      const analyzed = mapB.get(norm);
      addedSkills.push({
        skill: extB.skill,
        category: extB.category || analyzed?.category || 'Curriculum',
        demand_pct: analyzed?.demand_pct || 0,
        newStatus: analyzed?.status || 'COVERED',
        newDepth: extB.depth ?? 3,
        changeType: 'ADDED',
        detail: `New skill added in course ${extB.source_course}`,
      });
    }
  });

  // Identify removed skills from Version A
  versionA.extractedSkills.forEach((extA) => {
    const norm = normalizeSkillName(extA.skill);
    if (!extNamesB.has(norm)) {
      const analyzed = mapA.get(norm);
      removedSkills.push({
        skill: extA.skill,
        category: extA.category || analyzed?.category || 'Curriculum',
        demand_pct: analyzed?.demand_pct || 0,
        oldStatus: analyzed?.status || 'COVERED',
        oldDepth: extA.depth ?? 3,
        changeType: 'REMOVED',
        detail: `Omitted in Version B (previously in ${extA.source_course})`,
      });
    }
  });

  // Compare skill status & depth changes across all evaluated skills
  mapB.forEach((skillB, norm) => {
    const skillA = mapA.get(norm);
    if (skillA) {
      const depthB = skillB.depth ?? 0;
      const depthA = skillA.depth ?? 0;

      // Status rank: COVERED = 3, PARTIAL = 2, SURPLUS = 2, GAP = 1
      const getRank = (st: string) => (st === 'COVERED' ? 3 : st === 'PARTIAL' ? 2 : st === 'SURPLUS' ? 2 : 1);
      const rankA = getRank(skillA.status);
      const rankB = getRank(skillB.status);

      if (rankB > rankA || depthB > depthA) {
        improvedGaps.push({
          skill: skillB.skill,
          category: skillB.category,
          demand_pct: skillB.demand_pct,
          oldStatus: skillA.status,
          newStatus: skillB.status,
          oldDepth: skillA.depth,
          newDepth: skillB.depth,
          changeType: 'IMPROVED',
          detail: `Upgraded from ${skillA.status} (Depth ${skillA.depth}) → ${skillB.status} (Depth ${skillB.depth})`,
        });
      } else if (rankB < rankA || depthB < depthA) {
        newGaps.push({
          skill: skillB.skill,
          category: skillB.category,
          demand_pct: skillB.demand_pct,
          oldStatus: skillA.status,
          newStatus: skillB.status,
          oldDepth: skillA.depth,
          newDepth: skillB.depth,
          changeType: 'REGRESSED',
          detail: `Regressed from ${skillA.status} (Depth ${skillA.depth}) → ${skillB.status} (Depth ${skillB.depth})`,
        });
      }
    }
  });

  return {
    versionA,
    versionB,
    scoreA,
    scoreB,
    scoreDelta,
    addedSkills,
    removedSkills,
    improvedGaps,
    newGaps,
  };
}
