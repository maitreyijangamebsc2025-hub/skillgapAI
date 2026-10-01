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

export const GENAI_CURRICULUM_TEXT = `${MODERN_CLOUD_CURRICULUM_TEXT}

Module 10: DS110 - Generative AI, Large Language Models & Prompt Engineering
Credits: 4
Description: Advanced neural architectures, foundation models, and generative workflows.
Topics Covered:
- Transformer architectures, attention mechanisms, and pretraining vs fine-tuning (LoRA, QLoRA)
- Prompt engineering paradigms, chain-of-thought, few-shot conditioning, and evaluation
- Deep learning model serving using PyTorch and Hugging Face Transformers
- Cloud LLM integrations and API development in AWS and Azure environments

Module 11: DS111 - RAG, Vector Search & Agentic Data Engineering
Credits: 3
Description: Retrieval-Augmented Generation (RAG) and semantic databases for enterprise search.
Topics Covered:
- High-scale vector database indexing using Snowflake, BigQuery, and embedding pipelines
- Workflow orchestration with Apache Airflow for continuous model updates
- MLOps monitoring for hallucination detection, latency, and drift tracking
- CI/CD automation for multi-model deployment and evaluation suites`;

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

  // 1. Baseline Reference on 'main' branch: 58.4%
  const baselineAnalysis = computeAnalysis(marketSkills, initialSampleExtractedSkills, 5, 15);
  const baselineSnapshot: CurriculumVersionSnapshot = {
    id: 'baseline-msc-reference',
    name: 'Baseline Reference: MSc Data Science',
    branch: 'main',
    commitHash: '1aa6d34',
    commitMessage: 'chore(baseline): initial accredited university syllabus definition',
    author: 'Curriculum Committee Chair',
    timestamp: 'Initial Benchmark',
    curriculumText: SAMPLE_CURRICULUM,
    alignmentScore: baselineAnalysis.alignmentScore,
    extractedSkills: initialSampleExtractedSkills,
    analyzedSkills: baselineAnalysis.analyzedSkills,
  };

  // 2. Modernized Cloud & MLOps on 'feat/cloud-and-mlops' branch: 76.8%
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
    branch: 'feat/cloud-and-mlops',
    commitHash: '6a130ad',
    commitMessage: 'feat(cloud): add containerization, AWS, and distributed streaming',
    author: 'Cloud Systems Faculty Lead',
    timestamp: 'Industry Recommendation',
    curriculumText: MODERN_CLOUD_CURRICULUM_TEXT,
    alignmentScore: modernAnalysis.alignmentScore,
    extractedSkills: modernExtractedSkills,
    analyzedSkills: modernAnalysis.analyzedSkills,
  };

  // 3. Generative AI & Large Language Models on 'feat/generative-ai-track' branch: 83.2%
  const genAiExtractedSkills: ExtractedSkill[] = [
    ...modernExtractedSkills,
    {
      skill: 'mlops',
      source_course: 'DS111: RAG & Agentic Workflows',
      category: 'Cloud',
      depth: 3,
      evidence_text: 'MLOps monitoring for hallucination detection, latency, and drift tracking',
    },
    {
      skill: 'airflow',
      source_course: 'DS111: RAG & Agentic Workflows',
      category: 'Databases',
      depth: 3,
      evidence_text: 'Workflow orchestration with Apache Airflow for continuous model updates',
    },
    {
      skill: 'snowflake',
      source_course: 'DS111: RAG & Agentic Workflows',
      category: 'Databases',
      depth: 3,
      evidence_text: 'High-scale vector database indexing using Snowflake and embedding pipelines',
    },
    {
      skill: 'bigquery',
      source_course: 'DS111: RAG & Agentic Workflows',
      category: 'Databases',
      depth: 3,
      evidence_text: 'High-scale analytical feature stores and model evaluation in BigQuery',
    },
  ];
  const genAiAnalysis = computeAnalysis(marketSkills, genAiExtractedSkills, 5, 15);
  const genAiSnapshot: CurriculumVersionSnapshot = {
    id: 'genai-llm-v3',
    name: 'v3.0: Generative AI & LLM Specialization',
    branch: 'feat/generative-ai-track',
    commitHash: '479a8c6',
    commitMessage: 'feat(genai): add LLM architectures, RAG pipelines, and vector DBs',
    author: 'AI Research Director',
    timestamp: 'Advanced AI Track',
    curriculumText: GENAI_CURRICULUM_TEXT,
    alignmentScore: genAiAnalysis.alignmentScore,
    extractedSkills: genAiExtractedSkills,
    analyzedSkills: genAiAnalysis.analyzedSkills,
  };

  // 4. Legacy Statistics on 'legacy/v1.0-statistics' branch: 39.5%
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
    branch: 'legacy/v1.0-statistics',
    commitHash: '8e1b93f',
    commitMessage: 'legacy: historical 2019 applied statistics coursework',
    author: 'Applied Mathematics Dept',
    timestamp: 'Historical Baseline',
    curriculumText: LEGACY_STATS_CURRICULUM_TEXT,
    alignmentScore: legacyAnalysis.alignmentScore,
    extractedSkills: legacyExtractedSkills,
    analyzedSkills: legacyAnalysis.analyzedSkills,
  };

  return [baselineSnapshot, modernSnapshot, genAiSnapshot, legacySnapshot];
};
