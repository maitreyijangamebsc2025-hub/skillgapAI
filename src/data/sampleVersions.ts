import { CurriculumVersionSnapshot, ExtractedSkill, MarketSkill } from '../types/skills';
import { SAMPLE_CURRICULUM } from './sampleCurriculum';
import { computeAnalysis } from '../utils/skillMatcher';
import defaultSkillsData from './skill_demand.json';

export const MODERN_CLOUD_CURRICULUM_TEXT = `${SAMPLE_CURRICULUM}

Module 8: DS108 - Cloud Infrastructure & Container Orchestration
Credits: 4
Description: Production enterprise engineering for scalable machine learning systems.
Topics Covered:
- Amazon Web Services (AWS) ecosystem: EC2, S3, SageMaker, Lambda, and IAM security
- Containerization best practices with Docker, multi-stage builds, and microservices
- Cluster orchestration and deployment using Kubernetes and Helm charts
- Cloud database services and serverless data ingestion pipelines

Module 9: DS109 - MLOps, CI/CD & Distributed Computing
Credits: 3
Description: Continuous integration, model monitoring, and big data processing in industry.
Topics Covered:
- Continuous Integration & Deployment (CI/CD) pipelines with GitHub Actions
- Distributed data processing and streaming using Apache Spark and PySpark
- Model registry, experiment tracking, and artifact versioning using MLflow
- Production REST API serving with FastAPI and load testing`;

export const LEGACY_STATS_CURRICULUM_TEXT = `Bachelor of Science in Applied Statistics (Legacy Curriculum v1.0)
Department of Mathematical Sciences (2018-2021)

Module 1: STAT101 - Elementary Probability & Descriptive Statistics
- Measures of central tendency, dispersion, and graphical displays
- Probability axioms, conditional probability, Bayes theorem
- Discrete and continuous random variables

Module 2: STAT201 - Inferential Statistics & Hypothesis Testing
- Normal, t, Chi-square, and F distributions
- Estimation, confidence intervals, p-values, two-sample tests, ANOVA
- Computing statistical summaries and plots with R programming and RStudio

Module 3: STAT301 - Linear Models & Regression Analysis
- Simple and multiple linear regression, correlation analysis
- Model diagnostics, residual analysis, multicollinearity
- Basic introduction to SAS and SPSS statistical software

Module 4: STAT401 - Database Fundamentals
- Introduction to relational databases and structured query language (SQL)
- Simple queries, joins, and database queries in MySQL

Module 5: STAT402 - Business Reporting & Data Presentation
- Data visualization charts in Tableau and PowerPoint presentation techniques
- Written communication and technical reporting for stakeholders`;

export const getInitialSavedSnapshots = (
  initialSampleExtractedSkills: ExtractedSkill[]
): CurriculumVersionSnapshot[] => {
  const marketSkills = defaultSkillsData as MarketSkill[];

  // 1. Baseline Reference: 58.4%
  const baselineAnalysis = computeAnalysis(marketSkills, initialSampleExtractedSkills, 5, 15);
  const baselineSnapshot: CurriculumVersionSnapshot = {
    id: 'baseline-msc-reference',
    name: 'Baseline Reference: MSc Data Science',
    timestamp: 'Standard Benchmark',
    curriculumText: SAMPLE_CURRICULUM,
    alignmentScore: baselineAnalysis.alignmentScore,
    extractedSkills: initialSampleExtractedSkills,
    analyzedSkills: baselineAnalysis.analyzedSkills,
  };

  // 2. Modernized Cloud & MLOps v2.0
  const modernExtractedSkills: ExtractedSkill[] = [
    ...initialSampleExtractedSkills,
    {
      skill: 'aws',
      source_course: 'DS108: Cloud Infrastructure & Container Orchestration',
      category: 'Cloud',
      depth: 3,
      evidence_text: 'Amazon Web Services (AWS) ecosystem: EC2, S3, SageMaker, Lambda',
    },
    {
      skill: 'docker',
      source_course: 'DS108: Cloud Infrastructure & Container Orchestration',
      category: 'Cloud',
      depth: 4,
      evidence_text: 'Containerization best practices with Docker and multi-stage builds',
    },
    {
      skill: 'kubernetes',
      source_course: 'DS108: Cloud Infrastructure & Container Orchestration',
      category: 'Cloud',
      depth: 3,
      evidence_text: 'Cluster orchestration and deployment using Kubernetes',
    },
    {
      skill: 'ci/cd',
      source_course: 'DS109: MLOps, CI/CD & Distributed Computing',
      category: 'Cloud',
      depth: 3,
      evidence_text: 'Continuous Integration & Deployment (CI/CD) pipelines with GitHub Actions',
    },
    {
      skill: 'spark',
      source_course: 'DS109: MLOps, CI/CD & Distributed Computing',
      category: 'Databases',
      depth: 3,
      evidence_text: 'Distributed data processing and streaming using Apache Spark',
    },
  ];
  const modernAnalysis = computeAnalysis(marketSkills, modernExtractedSkills, 5, 15);
  const modernSnapshot: CurriculumVersionSnapshot = {
    id: 'cloud-mlops-v2',
    name: 'v2.0: Cloud & Modern MLOps Enhanced',
    timestamp: 'Industry Recommendation',
    curriculumText: MODERN_CLOUD_CURRICULUM_TEXT,
    alignmentScore: modernAnalysis.alignmentScore,
    extractedSkills: modernExtractedSkills,
    analyzedSkills: modernAnalysis.analyzedSkills,
  };

  // 3. Legacy Statistics v1.0
  const legacyExtractedSkills: ExtractedSkill[] = [
    { skill: 'statistics', source_course: 'STAT101 & STAT201', category: 'ML/AI', depth: 3, evidence_text: 'Probability, hypothesis testing, distributions' },
    { skill: 'r', source_course: 'STAT201: Inferential Statistics', category: 'Programming', depth: 3, evidence_text: 'Statistical computing in RStudio' },
    { skill: 'critical thinking', source_course: 'STAT201: Inferential Statistics', category: 'Soft Skills', depth: 3, evidence_text: 'Experimental design' },
    { skill: 'sql', source_course: 'STAT401: Database Fundamentals', category: 'Databases', depth: 2, evidence_text: 'Introductory queries and simple joins in MySQL' },
    { skill: 'tableau', source_course: 'STAT402: Business Reporting', category: 'Visualization', depth: 2, evidence_text: 'Basic reporting and chart creation' },
    { skill: 'communication', source_course: 'STAT402: Business Reporting', category: 'Soft Skills', depth: 3, evidence_text: 'Written and oral presentations' },
    { skill: 'presentation', source_course: 'STAT402: Business Reporting', category: 'Soft Skills', depth: 3, evidence_text: 'Stakeholder slide decks' },
  ];
  const legacyAnalysis = computeAnalysis(marketSkills, legacyExtractedSkills, 5, 15);
  const legacySnapshot: CurriculumVersionSnapshot = {
    id: 'legacy-stats-v1',
    name: 'v1.0: Traditional Statistics Syllabus (Legacy)',
    timestamp: 'Historical Baseline',
    curriculumText: LEGACY_STATS_CURRICULUM_TEXT,
    alignmentScore: legacyAnalysis.alignmentScore,
    extractedSkills: legacyExtractedSkills,
    analyzedSkills: legacyAnalysis.analyzedSkills,
  };

  return [baselineSnapshot, modernSnapshot, legacySnapshot];
};
