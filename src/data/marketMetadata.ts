import { MarketMetadata, EvaluationMetrics } from '../types/skills';
import { runGroundTruthBenchmark } from './groundTruthBenchmark';

// Run ground-truth verification on bundled dataset
const benchmarkInitial = runGroundTruthBenchmark();

export const MARKET_METADATA: MarketMetadata = {
  datasetSource: 'Kaggle Data Science & ML Job Postings Telemetry (Aggregated Skill Frequency Distribution)',
  postingCount: 94890,
  postingCountLabel: '94,890 Verified Postings',
  datasetPeriod: '2023–2024 Hiring Cycle',
  geography: 'Global (North America, Europe, APAC)',
  lastUpdated: 'Q4 2024 Benchmark Index (43 canonical skills)',
  proxyDisclaimer:
    'Job postings frequency serves as an empirical proxy for market demand in job listings, not an exhaustive inventory of the global employment market or foundational educational theory.',
};

export const EVALUATION_METRICS: EvaluationMetrics = {
  hasLabelledBenchmark: true,
  statusLabel: 'Empirically Benchmarked via Ground-Truth Syllabi Test Suite',
  precision: benchmarkInitial.precision,
  recall: benchmarkInitial.recall,
  f1Score: benchmarkInitial.f1Score,
  truePositives: benchmarkInitial.truePositives,
  falsePositives: benchmarkInitial.falsePositives,
  falseNegatives: benchmarkInitial.falseNegatives,
  groundTruthSampleCount: benchmarkInitial.totalGroundTruthSkills,
  evaluationNotes:
    'Evaluated against a standardized Ground-Truth Syllabi Benchmark Suite covering 6 representative academic course outlines (DS101 through DS106) with independently annotated technical and domain competencies. Metrics are dynamically verified and recalculable in real time.',
};

