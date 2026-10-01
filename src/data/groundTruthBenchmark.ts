import { ExtractedSkill, MarketSkill } from '../types/skills';
import { extractSkillsLocally, normalizeSkillName } from '../utils/skillMatcher';
import defaultSkillsData from './skill_demand.json';

export interface GroundTruthDocument {
  id: string;
  courseTitle: string;
  syllabusExcerpt: string;
  groundTruthSkills: string[];
}

export const GROUND_TRUTH_BENCHMARK_SET: GroundTruthDocument[] = [
  {
    id: 'gt-ds101',
    courseTitle: 'DS101: Statistical Foundations & Computing',
    syllabusExcerpt:
      'Probability distributions, hypothesis testing, regression analysis. Practical statistical computing using R programming and RStudio. Emphasis on critical thinking, experimental design, and statistical data modeling.',
    groundTruthSkills: ['statistics', 'r', 'critical thinking'],
  },
  {
    id: 'gt-ds102',
    courseTitle: 'DS102: Advanced Python & Data Engineering',
    syllabusExcerpt:
      'Object-oriented Python programming, data structures, profiling. Exploratory data analysis using Pandas dataframes and series. Numerical computing and matrix operations with NumPy. Version control workflows using Git and GitHub. Algorithmic problem solving.',
    groundTruthSkills: ['python', 'pandas', 'numpy', 'git', 'problem solving'],
  },
  {
    id: 'gt-ds103',
    courseTitle: 'DS103: Supervised & Unsupervised Machine Learning',
    syllabusExcerpt:
      'Mathematical foundations of machine learning algorithms. Decision trees, random forests, and gradient boosting. Supervised learning pipelines with scikit-learn. Model evaluation using cross-validation and ROC-AUC curves.',
    groundTruthSkills: ['machine learning', 'scikit-learn'],
  },
  {
    id: 'gt-ds104',
    courseTitle: 'DS104: Enterprise Relational Databases & SQL',
    syllabusExcerpt:
      'Relational database architecture and ACID transactions. Advanced SQL querying with window functions, complex joins, and common table expressions. Database administration and query plans using PostgreSQL.',
    groundTruthSkills: ['sql', 'postgresql'],
  },
  {
    id: 'gt-ds105',
    courseTitle: 'DS105: Deep Learning, NLP & Computer Vision',
    syllabusExcerpt:
      'Deep learning neural network architectures, backpropagation, and loss functions. Deep learning model development with PyTorch and GPU acceleration. Transformer architectures for natural language processing (NLP). Convolutional neural networks for computer vision image recognition.',
    groundTruthSkills: ['deep learning', 'pytorch', 'natural language processing', 'computer vision'],
  },
  {
    id: 'gt-ds106',
    courseTitle: 'DS106: Data Visualization & Executive Storytelling',
    syllabusExcerpt:
      'Principles of statistical visualization and narrative design. Interactive dashboard development with Tableau. Custom publication-quality plotting using Matplotlib and statistical distribution plots in Seaborn. Technical communication and oral presentation of findings.',
    groundTruthSkills: ['tableau', 'matplotlib', 'seaborn', 'data storytelling', 'communication', 'presentation'],
  },
];

export interface BenchmarkEvaluationResult {
  totalGroundTruthSkills: number;
  totalExtractedSkills: number;
  truePositives: number;
  falsePositives: number;
  falseNegatives: number;
  precision: number;
  recall: number;
  f1Score: number;
  documentResults: {
    courseTitle: string;
    groundTruth: string[];
    extracted: string[];
    tp: string[];
    fp: string[];
    fn: string[];
  }[];
}

/**
 * Runs the deterministic extraction engine against the 6 standardized ground truth syllabi
 * and calculates exact Precision, Recall, and F1 Score metrics.
 */
export function runGroundTruthBenchmark(
  marketSkills: MarketSkill[] = defaultSkillsData as MarketSkill[]
): BenchmarkEvaluationResult {
  let tpCount = 0;
  let fpCount = 0;
  let fnCount = 0;

  const docResults = GROUND_TRUTH_BENCHMARK_SET.map((doc) => {
    const extractedList = extractSkillsLocally(doc.syllabusExcerpt, marketSkills);
    const extractedNames = Array.from(new Set(extractedList.map((e) => normalizeSkillName(e.skill))));
    const groundTruthNames = Array.from(new Set(doc.groundTruthSkills.map((s) => normalizeSkillName(s))));

    const tp: string[] = [];
    const fp: string[] = [];
    const fn: string[] = [];

    extractedNames.forEach((ex) => {
      if (groundTruthNames.includes(ex)) {
        tp.push(ex);
      } else {
        fp.push(ex);
      }
    });

    groundTruthNames.forEach((gt) => {
      if (!extractedNames.includes(gt)) {
        fn.push(gt);
      }
    });

    tpCount += tp.length;
    fpCount += fp.length;
    fnCount += fn.length;

    return {
      courseTitle: doc.courseTitle,
      groundTruth: groundTruthNames,
      extracted: extractedNames,
      tp,
      fp,
      fn,
    };
  });

  const precision = tpCount + fpCount > 0 ? (tpCount / (tpCount + fpCount)) * 100 : 0;
  const recall = tpCount + fnCount > 0 ? (tpCount / (tpCount + fnCount)) * 100 : 0;
  const f1Score =
    precision + recall > 0 ? (2 * (precision * recall)) / (precision + recall) : 0;

  return {
    totalGroundTruthSkills: tpCount + fnCount,
    totalExtractedSkills: tpCount + fpCount,
    truePositives: tpCount,
    falsePositives: fpCount,
    falseNegatives: fnCount,
    precision: Math.round(precision * 10) / 10,
    recall: Math.round(recall * 10) / 10,
    f1Score: Math.round(f1Score * 10) / 10,
    documentResults: docResults,
  };
}
