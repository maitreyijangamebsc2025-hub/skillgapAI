import { CurriculumRecommendation } from '../types/skills';

export const DEFAULT_RECOMMENDATIONS: CurriculumRecommendation[] = [
  {
    title: 'Cloud & Distributed Computing Module (AWS & Azure)',
    type: 'New Module',
    priority: 'Critical',
    target_skills: ['aws', 'cloud', 'azure', 'docker'],
    rationale:
      'Cloud infrastructure (AWS at 27.4% and Azure at 19.0% empirical demand) represents the single largest employability alignment gap. While the curriculum currently teaches advanced Python and relational databases, it lacks deployment pipelines.',
    curriculum_relevance:
      'Integrates seamlessly into DS102 (Advanced Python) or DS107 (Capstone), extending theoretical programming into production cloud architecture.',
    prerequisites: ['DS102 (Advanced Python)', 'Basic Command-Line Navigation / Linux Bash'],
    academic_level: 'Graduate / MSc',
    implementation_steps: [
      'Embed a 3-week Cloud Computing practicum into DS102 covering AWS S3 object stores, EC2 compute instances, and serverless execution.',
      'Provide students with AWS Academy or Azure for Students sandbox credits for hands-on lab deployments.',
      'Assign a capstone milestone requiring students to serve a trained scikit-learn model behind an API Gateway endpoint.',
    ],
    estimated_effort: '3-4 weeks module design & cloud lab setup',
    disclaimer:
      'Note: Curriculum enhancements improve market skill alignment and reduce initial onboarding friction, but do not guarantee specific employment outcomes or hiring placement.',
    trace: {
      marketDemand: 'AWS (27.4% demand) and Azure (19.0% demand) rank in the top 10 market requirements.',
      curriculumGap: 'GAP (Depth 0) — Cloud infrastructure is unaddressed in the current syllabus.',
      evidence: 'DS101–DS106 focus exclusively on local workstation environments and localhost databases.',
      recommendation: 'Add a 3-week Cloud Computing practicum with AWS S3/EC2 sandbox environments into DS102.',
    },
  },
  {
    title: 'Containerization & Microservices with Docker & Kubernetes',
    type: 'Tool Integration',
    priority: 'Critical',
    target_skills: ['docker', 'kubernetes', 'ci/cd', 'git'],
    rationale:
      'Over 16.9% of market postings require containerization and 11.6% require Kubernetes. Academic submissions isolated strictly to Jupyter notebooks experience friction in modern engineering environments where containerized microservices are standard.',
    curriculum_relevance:
      'Directly elevates DS103 (Machine Learning) and DS105 (Deep Learning) model deployment deliverables.',
    prerequisites: ['Git Version Control', 'Python Environment Management (pip/venv)'],
    academic_level: 'Graduate / MSc',
    implementation_steps: [
      'Incorporate Dockerfile creation and multi-stage container builds in DS103 for model reproducibility.',
      'Replace raw code script submissions with containerized microservice evaluations using GitHub Actions CI/CD.',
      'Demonstrate basic Kubernetes deployment manifests for scalable inference in the DS107 Capstone.',
    ],
    estimated_effort: '2 weeks lab tutorial rollout',
    disclaimer:
      'Note: Curriculum enhancements improve market skill alignment and reduce initial onboarding friction, but do not guarantee specific employment outcomes or hiring placement.',
    trace: {
      marketDemand: 'Docker (16.9% demand) and Kubernetes (11.6% demand) are critical production requirements.',
      curriculumGap: 'GAP (Depth 0) — Containerization and cluster orchestration are completely omitted.',
      evidence: 'Syllabus relies solely on local Conda/pip environments without containerized isolation.',
      recommendation: 'Embed Docker containerization into DS103 and introduce Kubernetes manifests in DS107.',
    },
  },
  {
    title: 'Modern Data Stack & Cloud Warehousing (Snowflake & Spark)',
    type: 'New Module',
    priority: 'High',
    target_skills: ['snowflake', 'spark', 'big data', 'sql'],
    rationale:
      'Relational PostgreSQL alone covers traditional transaction storage but leaves modern columnar analytics unaddressed. Snowflake (11.1%) and Apache Spark (16.3%) dominate big-data engineering pipelines.',
    curriculum_relevance:
      'Builds naturally on the foundational database concepts taught in DS104 (Relational Databases).',
    prerequisites: ['DS104 (Relational Databases / SQL Queries)'],
    academic_level: 'Graduate / MSc',
    implementation_steps: [
      'Upgrade DS104 to contrast transactional RDBMS indexing against Snowflake columnar warehousing and clustering.',
      'Introduce PySpark on distributed clusters (Databricks Community Edition) for datasets exceeding 10GB.',
      'Implement real-world ELT pipeline assignments connecting raw cloud storage to warehouse dimensional models.',
    ],
    estimated_effort: '1 semester course curriculum enhancement',
    disclaimer:
      'Note: Curriculum enhancements improve market skill alignment and reduce initial onboarding friction, but do not guarantee specific employment outcomes or hiring placement.',
    trace: {
      marketDemand: 'Spark (16.3% demand) and Snowflake (11.1% demand) represent high-volume analytical demand.',
      curriculumGap: 'GAP / PARTIAL (Depth 1) — Traditional SQL is taught, but distributed and columnar systems are absent.',
      evidence: 'DS104 teaches single-node PostgreSQL queries, lacking exposure to distributed query execution.',
      recommendation: 'Extend DS104 with Snowflake cloud warehousing and PySpark distributed data transformations.',
    },
  },
  {
    title: 'End-to-End MLOps & Experiment Tracking (MLflow / Weights & Biases)',
    type: 'Project / Capstone',
    priority: 'High',
    target_skills: ['mlops', 'ci/cd', 'docker', 'git'],
    rationale:
      'Industry hiring teams increasingly prioritize candidates who understand data drift, experiment versioning, and automated retraining over pure algorithmic hyperparameter tuning.',
    curriculum_relevance:
      'Enhances the DS107 Industry Capstone Project evaluation criteria with production standards.',
    prerequisites: ['DS103 (Supervised & Unsupervised ML)', 'DS105 (Deep Learning)'],
    academic_level: 'Graduate / MSc',
    implementation_steps: [
      'Mandate MLflow experiment tracking and hyperparameter logging in all DS103 and DS105 student project submissions.',
      'Add a dedicated lecture on data validation, concept drift monitoring, and automated performance degradation alerts.',
      'Require an MLOps architecture diagram and automated pipeline execution in the DS107 Capstone final evaluation.',
    ],
    estimated_effort: '2-3 weeks capstone rubric update',
    disclaimer:
      'Note: Curriculum enhancements improve market skill alignment and reduce initial onboarding friction, but do not guarantee specific employment outcomes or hiring placement.',
    trace: {
      marketDemand: 'MLOps (8.9% demand) and CI/CD (8.2% demand) are fast-growing engineering prerequisites.',
      curriculumGap: 'GAP (Depth 0) — Model monitoring, lifecycle management, and CI/CD are absent.',
      evidence: 'DS103 & DS105 end at model training with no experiment logging, registry, or drift checks.',
      recommendation: 'Require MLflow tracking in DS103/DS105 and CI/CD automated test pipelines in Capstone.',
    },
  },
  {
    title: 'Executive Dashboards & Business Intelligence (Power BI / Tableau)',
    type: 'Pedagogical Update',
    priority: 'Medium',
    target_skills: ['power bi', 'tableau', 'data storytelling', 'presentation'],
    rationale:
      'Tableau (25.3% demand) and Power BI (22.1% demand) dominate corporate business reporting. While DS106 currently teaches Matplotlib and Seaborn, executive stakeholders require interactive business dashboards.',
    curriculum_relevance:
      'Direct pedagogical expansion of DS106 (Data Visualization & Storytelling).',
    prerequisites: ['DS106 (Data Visualization Fundamentals)', 'Basic Data Cleaning in Pandas'],
    academic_level: 'Graduate / MSc',
    implementation_steps: [
      'Expand DS106 beyond Matplotlib/Seaborn to include Power BI DAX expressions and interactive dashboard design.',
      'Partner with industry guest lecturers to host an executive dashboard presentation workshop.',
      'Require students to deliver interactive dashboard deliverables alongside executive summary memos.',
    ],
    estimated_effort: 'Integrated into existing 14-week DS106 syllabus',
    disclaimer:
      'Note: Curriculum enhancements improve market skill alignment and reduce initial onboarding friction, but do not guarantee specific employment outcomes or hiring placement.',
    trace: {
      marketDemand: 'Tableau (25.3% demand) and Power BI (22.1% demand) represent nearly half of analytics jobs.',
      curriculumGap: 'PARTIAL (Depth 1–2) — Static code libraries (Matplotlib, Seaborn) are covered, but BI suites are omitted.',
      evidence: 'DS106 covers script-based charts, but students produce zero interactive BI executive artifacts.',
      recommendation: 'Incorporate Tableau and Power BI DAX labs with an executive presentation deliverable in DS106.',
    },
  },
];
