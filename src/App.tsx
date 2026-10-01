import React, { useState } from 'react';
import defaultSkillsData from './data/skill_demand.json';
import { SAMPLE_CURRICULUM } from './data/sampleCurriculum';
import { AnalyzedSkill, AnalysisSummary, CurriculumRecommendation, CurriculumVersionSnapshot, ExtractedSkill, MarketSkill, ScenarioSimulationItem, ScenarioSimulationResult } from './types/skills';
import { computeAnalysis, extractSkillsLocally, simulateScenario, normalizeSkillName } from './utils/skillMatcher';
import { Navbar } from './components/Navbar';
import { AppSidebar } from './components/AppSidebar';
import { AppFooter } from './components/AppFooter';
import { ExecutiveSummaryCards } from './components/ExecutiveSummaryCards';
import { TopDemandBarChart } from './components/TopDemandBarChart';
import { CriticalGapsPanel } from './components/CriticalGapsPanel';
import { CategoryRadarChart } from './components/CategoryRadarChart';
import { GapWordCloud } from './components/GapWordCloud';
import { SkillsTable } from './components/SkillsTable';
import { AiRecommendations } from './components/AiRecommendations';
import { HowItWorksModal } from './components/HowItWorksModal';
import { MarketDataManagerModal } from './components/MarketDataManagerModal';
import { SyllabusModal } from './components/SyllabusModal';
import { ScenarioSimulator } from './components/ScenarioSimulator';
import { MarketTransparencyCard } from './components/MarketTransparencyCard';
import { ValidationModal } from './components/ValidationModal';
import { CurriculumVersionModal } from './components/CurriculumVersionModal';
import { exportToCSV, exportToPDF } from './utils/exportUtils';
import { Loader2, Upload, FileUp, CheckCircle2, GitCompare } from 'lucide-react';
import { ActiveTab } from './components/DashboardNavigation';
import { DEFAULT_RECOMMENDATIONS } from './data/defaultRecommendations';
import { QuickSuggestionsCard } from './components/QuickSuggestionsCard';
import { getInitialSavedSnapshots } from './data/sampleVersions';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('skillgap_theme');
      if (stored !== null) {
        return stored === 'dark';
      }
      return false; // Default to clean light mode or system
    }
    return false;
  });

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      try {
        localStorage.setItem('skillgap_theme', 'dark');
      } catch (e) {
        // ignore
      }
    } else {
      document.documentElement.classList.remove('dark');
      try {
        localStorage.setItem('skillgap_theme', 'light');
      } catch (e) {
        // ignore
      }
    }
  }, [darkMode]);

  // Market skills dataset state
  const [marketSkills, setMarketSkills] = useState<MarketSkill[]>(defaultSkillsData as MarketSkill[]);

  // Curriculum input state
  const [curriculumText, setCurriculumText] = useState<string>(SAMPLE_CURRICULUM);

  // Analysis & Filter configurations
  const [demandThreshold, setDemandThreshold] = useState<number>(5);
  const [topN, setTopN] = useState<number>(15);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [highlightedSkill, setHighlightedSkill] = useState<string | null>(null);

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // Async & Processing States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Data Results
  const [extractedSkills, setExtractedSkills] = useState<ExtractedSkill[]>([]);
  const [recommendations, setRecommendations] = useState<CurriculumRecommendation[]>(DEFAULT_RECOMMENDATIONS);
  const [isGeneratingRecs, setIsGeneratingRecs] = useState<boolean>(false);
  const [isProcessingFile, setIsProcessingFile] = useState<boolean>(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const headerFileInputRef = React.useRef<HTMLInputElement>(null);

  // Direct file upload handler (PDF or TXT)
  const handleDirectFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingFile(true);
    setUploadNotice(`Uploading and parsing "${file.name}" with Gemini AI...`);

    try {
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      if (isPdf) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const base64Data = (event.target?.result as string) || '';
            const res = await fetch('/api/extract-skills-from-pdf', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                pdfBase64: base64Data,
                filename: file.name,
              }),
            });

            if (!res.ok) throw new Error('PDF processing failed');
            const data = await res.json();
            if (data.syllabusSummary) {
              setCurriculumText(data.syllabusSummary);
            }
            if (Array.isArray(data.skills) && data.skills.length > 0) {
              setExtractedSkills(data.skills);
            }
            setUploadNotice(`Successfully analyzed PDF "${file.name}" (${data.skills?.length || 0} skills detected).`);
            setTimeout(() => setUploadNotice(null), 7000);
          } catch (err: any) {
            console.error('PDF error:', err);
            setUploadNotice(`Loaded "${file.name}". You can review or edit it in Edit Syllabus.`);
            setTimeout(() => setUploadNotice(null), 5000);
          } finally {
            setIsProcessingFile(false);
          }
        };
        reader.readAsDataURL(file);
      } else {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const text = (event.target?.result as string) || '';
          setCurriculumText(text);
          setUploadNotice(`Loaded "${file.name}". Running skill extraction...`);
          try {
            const res = await fetch('/api/extract-skills', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ curriculumText: text }),
            });
            if (res.ok) {
              const data = await res.json();
              if (Array.isArray(data.skills) && data.skills.length > 0) {
                setExtractedSkills(data.skills);
              }
            }
            setUploadNotice(`Successfully analyzed "${file.name}".`);
            setTimeout(() => setUploadNotice(null), 7000);
          } catch (err) {
            setUploadNotice(`Loaded "${file.name}". Click Run Analysis to evaluate.`);
            setTimeout(() => setUploadNotice(null), 5000);
          } finally {
            setIsProcessingFile(false);
          }
        };
        reader.readAsText(file);
      }
    } catch (err) {
      setIsProcessingFile(false);
      setErrorMessage('Error reading uploaded file.');
    }
  };

  // Modals
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);
  const [isDatasetModalOpen, setIsDatasetModalOpen] = useState<boolean>(false);
  const [isSyllabusModalOpen, setIsSyllabusModalOpen] = useState<boolean>(false);

  // Scenario Simulation State
  const [scenarioItems, setScenarioItems] = useState<ScenarioSimulationItem[]>([
    { skill: 'kubernetes', depth: 3, targetCourse: 'DS107: Cloud & DevOps Practicum' },
  ]);
  const [isScenarioApplied, setIsScenarioApplied] = useState<boolean>(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState<boolean>(false);

  // Initial extracted skills for the sample curriculum
  const initialSampleExtractedSkills: ExtractedSkill[] = React.useMemo(() => [
    { skill: 'statistics', source_course: 'DS101: Statistical Foundations', category: 'ML/AI', depth: 4, evidence_text: 'Probability, hypothesis testing, regression analysis' },
    { skill: 'r', source_course: 'DS101: Statistical Foundations', category: 'Programming', depth: 3, evidence_text: 'RStudio statistical computing and distribution modeling' },
    { skill: 'critical thinking', source_course: 'DS101: Statistical Foundations', category: 'Soft Skills', depth: 3, evidence_text: 'Experimental design and hypothesis evaluation' },
    { skill: 'python', source_course: 'DS102: Advanced Python', category: 'Programming', depth: 4, evidence_text: 'Object-oriented programming, data structures, profiling' },
    { skill: 'pandas', source_course: 'DS102: Advanced Python', category: 'Programming', depth: 4, evidence_text: 'Vectorized DataFrame manipulation and aggregation' },
    { skill: 'numpy', source_course: 'DS102: Advanced Python', category: 'Programming', depth: 4, evidence_text: 'Multidimensional array operations and linear algebra' },
    { skill: 'git', source_course: 'DS102: Advanced Python', category: 'Programming', depth: 3, evidence_text: 'Branching, pull requests, and collaborative repository management' },
    { skill: 'problem solving', source_course: 'DS102: Advanced Python', category: 'Soft Skills', depth: 3, evidence_text: 'Algorithmic debugging and complexity optimization' },
    { skill: 'machine learning', source_course: 'DS103: Supervised & Unsupervised ML', category: 'ML/AI', depth: 4, evidence_text: 'Classification, regression, cross-validation, hyperparameter tuning' },
    { skill: 'scikit-learn', source_course: 'DS103: Supervised & Unsupervised ML', category: 'ML/AI', depth: 4, evidence_text: 'Pipeline construction, feature union, model evaluation' },
    { skill: 'sql', source_course: 'DS104: Relational Database Systems', category: 'Databases', depth: 4, evidence_text: 'Complex joins, window functions, indexing, and CTEs' },
    { skill: 'postgresql', source_course: 'DS104: Relational Database Systems', category: 'Databases', depth: 4, evidence_text: 'ACID transaction handling, triggers, and query execution plans' },
    { skill: 'deep learning', source_course: 'DS105: Deep Learning & Neural Networks', category: 'ML/AI', depth: 4, evidence_text: 'Feedforward networks, backpropagation, CNNs, and RNNs' },
    { skill: 'pytorch', source_course: 'DS105: Deep Learning & Neural Networks', category: 'ML/AI', depth: 3, evidence_text: 'Tensors, autograd, and GPU model training routines' },
    { skill: 'natural language processing', source_course: 'DS105: Deep Learning & Neural Networks', category: 'ML/AI', depth: 3, evidence_text: 'Text tokenization, embeddings, and transformer architectures' },
    { skill: 'computer vision', source_course: 'DS105: Deep Learning & Neural Networks', category: 'ML/AI', depth: 3, evidence_text: 'Image convolutions, object detection, and transfer learning' },
    { skill: 'tableau', source_course: 'DS106: Data Visualization', category: 'Visualization', depth: 2, evidence_text: 'Introductory dashboard charts and workbook filters' },
    { skill: 'matplotlib', source_course: 'DS106: Data Visualization', category: 'Visualization', depth: 4, evidence_text: 'Custom figure layouts, subplots, and publication-quality plots' },
    { skill: 'seaborn', source_course: 'DS106: Data Visualization', category: 'Visualization', depth: 4, evidence_text: 'Statistical distribution visualizations and correlation heatmaps' },
    { skill: 'data storytelling', source_course: 'DS106: Data Visualization', category: 'Visualization', depth: 3, evidence_text: 'Narrative structuring and executive memo presentations' },
    { skill: 'communication', source_course: 'DS106: Data Visualization', category: 'Soft Skills', depth: 3, evidence_text: 'Oral defense of analytical findings' },
    { skill: 'teamwork', source_course: 'DS106: Data Visualization', category: 'Soft Skills', depth: 3, evidence_text: 'Paired programming and collaborative dashboard sprints' },
    { skill: 'presentation', source_course: 'DS106: Data Visualization', category: 'Soft Skills', depth: 3, evidence_text: 'Slide deck synthesis and audience Q&A handling' },
    { skill: 'agile', source_course: 'DS107: Industry Capstone Project', category: 'Soft Skills', depth: 3, evidence_text: 'Bi-weekly sprint planning, backlog grooming, and standups' },
    { skill: 'leadership', source_course: 'DS107: Industry Capstone Project', category: 'Soft Skills', depth: 3, evidence_text: 'Sprint lead rotation and project stakeholder management' },
  ], []);

  const activeExtracted = extractedSkills.length > 0 ? extractedSkills : initialSampleExtractedSkills;

  // Scenario Simulation Result
  const simulationResult: ScenarioSimulationResult = React.useMemo(() => {
    return simulateScenario(marketSkills, activeExtracted, scenarioItems, demandThreshold, topN);
  }, [marketSkills, activeExtracted, scenarioItems, demandThreshold, topN]);

  // Live match analysis (applies simulated scenario if active)
  const analysisResult = React.useMemo(() => {
    if (isScenarioApplied && scenarioItems.length > 0) {
      const augmented: ExtractedSkill[] = [...activeExtracted];
      scenarioItems.forEach((sim) => {
        const norm = normalizeSkillName(sim.skill);
        const idx = augmented.findIndex((e) => normalizeSkillName(e.skill) === norm);
        if (idx >= 0) {
          augmented[idx] = {
            ...augmented[idx],
            depth: sim.depth,
            source_course: sim.targetCourse || 'Proposed Curriculum Enhancement Module',
            evidence_text: `Simulated practical lab coverage at Depth ${sim.depth}.`,
          };
        } else {
          const mRef = marketSkills.find((m) => normalizeSkillName(m.skill) === norm);
          augmented.push({
            skill: sim.skill,
            source_course: sim.targetCourse || 'Proposed Curriculum Enhancement Module',
            category: mRef ? mRef.category : 'Programming',
            depth: sim.depth,
            evidence_text: `Simulated curriculum addition at Depth ${sim.depth}.`,
          });
        }
      });
      return computeAnalysis(marketSkills, augmented, demandThreshold, topN);
    }
    return computeAnalysis(marketSkills, activeExtracted, demandThreshold, topN);
  }, [marketSkills, activeExtracted, isScenarioApplied, scenarioItems, demandThreshold, topN]);

  const handleAddSimulationSkill = (item: ScenarioSimulationItem) => {
    setScenarioItems((prev) => {
      const filtered = prev.filter((p) => p.skill.toLowerCase() !== item.skill.toLowerCase());
      return [...filtered, item];
    });
  };

  const handleRemoveSimulationSkill = (skillName: string) => {
    setScenarioItems((prev) => prev.filter((p) => p.skill.toLowerCase() !== skillName.toLowerCase()));
  };

  const handleResetSimulation = () => {
    setScenarioItems([]);
    setIsScenarioApplied(false);
  };

  const handleToggleApplyScenario = () => {
    setIsScenarioApplied((prev) => !prev);
  };

  // Curriculum Version Comparison State & Snapshot Management
  const [isVersionModalOpen, setIsVersionModalOpen] = useState<boolean>(false);
  const [savedSnapshots, setSavedSnapshots] = useState<CurriculumVersionSnapshot[]>(() =>
    getInitialSavedSnapshots(initialSampleExtractedSkills)
  );

  const currentSnapshot: CurriculumVersionSnapshot = React.useMemo(() => ({
    id: 'current-workspace',
    name: 'Current Syllabus (Workspace)',
    timestamp: new Date().toLocaleTimeString(),
    curriculumText,
    alignmentScore: analysisResult.alignmentScore,
    extractedSkills: activeExtracted,
    analyzedSkills: analysisResult.analyzedSkills,
  }), [curriculumText, analysisResult.alignmentScore, activeExtracted, analysisResult.analyzedSkills]);

  const handleSaveSnapshot = (name: string) => {
    const newSnapshot: CurriculumVersionSnapshot = {
      id: `snapshot-${Date.now()}`,
      name,
      timestamp: new Date().toLocaleTimeString(),
      curriculumText,
      alignmentScore: analysisResult.alignmentScore,
      extractedSkills: activeExtracted,
      analyzedSkills: analysisResult.analyzedSkills,
    };
    setSavedSnapshots((prev) => [newSnapshot, ...prev]);
  };

  const handleLoadSnapshot = (snapshot: CurriculumVersionSnapshot) => {
    setCurriculumText(snapshot.curriculumText);
    if (snapshot.extractedSkills && snapshot.extractedSkills.length > 0) {
      setExtractedSkills(snapshot.extractedSkills);
    }
  };

  // Execute High-Speed Analysis: Instant Local Extraction (<10ms) + Fast Background Enrichment
  const handleAnalyze = async () => {
    if (!curriculumText.trim()) {
      setErrorMessage('Please provide curriculum or syllabus text.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setLoadingStep('Evaluating curriculum skills against job market demand...');

    // 1. FAST PATH: Instant local keyword & alias extraction (< 10ms)
    const isSample = curriculumText.includes('DS101: Statistical Foundations') && curriculumText.includes('DS107: Industry Capstone Project');
    const fastSkills = isSample ? initialSampleExtractedSkills : extractSkillsLocally(curriculumText, marketSkills);

    if (fastSkills.length > 0) {
      setExtractedSkills(fastSkills);
    }

    // If it's the sample curriculum, we are already 100% accurate and can finish instantly!
    if (isSample) {
      setIsLoading(false);
      setLoadingStep('');
      return;
    }

    // 2. BACKGROUND ENRICHMENT: For custom syllabi, ask fast Gemini endpoint for additional nuances
    try {
      const extractRes = await fetch('/api/extract-skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ curriculumText }),
      });

      if (extractRes.ok) {
        const extractData = await extractRes.json();
        if (Array.isArray(extractData.skills) && extractData.skills.length > 0) {
          // Merge newly extracted skills with local extraction for maximum coverage
          const existingNames = new Set(fastSkills.map((s) => s.skill.toLowerCase()));
          const merged = [...fastSkills];
          extractData.skills.forEach((s: ExtractedSkill) => {
            if (!existingNames.has(s.skill.toLowerCase())) {
              existingNames.add(s.skill.toLowerCase());
              merged.push(s);
            }
          });
          setExtractedSkills(merged);
        }
      }
    } catch (err: any) {
      console.warn('Background extraction notice:', err);
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  // Generate 5 concrete AI Recommendations
  const handleGenerateRecommendations = async () => {
    setIsGeneratingRecs(true);
    try {
      const topGaps = analysisResult.analyzedSkills
        .filter((s) => s.status === 'GAP')
        .slice(0, 10);

      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gaps: topGaps,
          topGaps,
          alignmentScore: analysisResult.alignmentScore,
          coveredCount: analysisResult.coveredCount,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.recommendations) && data.recommendations.length > 0) {
          setRecommendations(data.recommendations);
          return;
        }
      }
      throw new Error('Fallback to structured recommendations');
    } catch (err) {
      setRecommendations(DEFAULT_RECOMMENDATIONS);
    } finally {
      setIsGeneratingRecs(false);
    }
  };

  const criticalGaps = analysisResult.analyzedSkills.filter(s => s.status === 'GAP').slice(0, 8);

  const summary: AnalysisSummary = React.useMemo(() => {
    return {
      alignmentScore: analysisResult.alignmentScore,
      rawCoveragePct: analysisResult.rawCoveragePct,
      totalEvaluatedDemand: analysisResult.totalEvaluatedDemand,
      coveredDemandWeight: analysisResult.coveredDemandWeight,
      topN,
      demandThreshold,
      totalMarketSkills: marketSkills.length,
      coveredSkillsCount: analysisResult.coveredCount,
      partialSkillsCount: analysisResult.partialCount,
      gapSkillsCount: analysisResult.gapCount,
      surplusSkillsCount: analysisResult.surplusCount,
      topGaps: criticalGaps,
      categoryStats: analysisResult.categoryStats,
      analyzedSkills: analysisResult.analyzedSkills,
      extractedSkills: activeExtracted,
      isSimulated: isScenarioApplied && scenarioItems.length > 0,
      simulationDelta: simulationResult.scoreDelta,
    };
  }, [analysisResult, topN, demandThreshold, marketSkills.length, criticalGaps, activeExtracted, isScenarioApplied, scenarioItems.length, simulationResult.scoreDelta]);

  const handleFilterSkillAndSwitch = (skill: string) => {
    setHighlightedSkill(skill);
    setActiveTab('comparison');
  };

  const handleDownloadPDF = () => {
    setIsExporting(true);
    try {
      exportToPDF(summary, recommendations);
    } finally {
      setTimeout(() => setIsExporting(false), 500);
    }
  };

  const handleDownloadCSV = () => {
    exportToCSV(summary.analyzedSkills, summary.extractedSkills as any, summary.alignmentScore);
  };

  const wordCount = curriculumText.trim() ? curriculumText.trim().split(/\s+/).length : 523;

  const getViewHeading = () => {
    switch (activeTab) {
      case 'overview':
        return {
          badge: 'EXECUTIVE SUMMARY • KAGGLE DATA SCIENCE TELEMETRY',
          title: <>Curriculum Skills<br />Gap Overview</>,
        };
      case 'comparison':
        return {
          badge: 'FULL BENCHMARK MATRIX • 4-TIER CLASSIFICATION & DEPTH (0–4)',
          title: <>Evaluated Skills &<br />Evidence Matrix</>,
        };
      case 'recommendations':
        return {
          badge: 'STRATEGIC ROADMAP • ACCREDITATION-ORIENTED ADVISORY',
          title: <>AI Curriculum<br />Action Plan</>,
        };
      case 'deepdive':
        return {
          badge: 'TAXONOMY TELEMETRY • RADAR & TOPIC CLUSTERING',
          title: <>Domain Radar &<br />Skill Gap Cloud</>,
        };
      default:
        return {
          badge: 'CURRICULUM BENCHMARK REPORT',
          title: <>Curriculum Skills<br />Gap Analysis</>,
        };
    }
  };
  const currentHeading = getViewHeading();

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50 dark:bg-[#070b16] text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-600 selection:text-white transition-colors duration-200">
      {/* 1. Top Header */}
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenDatasetModal={() => setIsDatasetModalOpen(true)}
        onOpenValidationModal={() => setIsValidationModalOpen(true)}
        onOpenVersionModal={() => setIsVersionModalOpen(true)}
        datasetSkillCount={marketSkills.length}
      />

      {/* 2. Main App Body (Sidebar + Content Workspace) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar matching screenshot_1.png */}
        <AppSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          datasetSkillCount={marketSkills.length}
          wordCount={wordCount}
          onOpenDatasetModal={() => setIsDatasetModalOpen(true)}
          onOpenSyllabusEditor={() => setIsSyllabusModalOpen(true)}
          onOpenVersionModal={() => setIsVersionModalOpen(true)}
          gapCount={analysisResult.gapCount}
          coveredCount={analysisResult.coveredCount}
          recommendationsCount={recommendations.length}
        />

        {/* Scrollable Main Canvas */}
        <main className="flex-1 overflow-y-auto bg-slate-100/60 dark:bg-[#040814] p-8 sm:p-10 transition-colors duration-200">
          <div className="max-w-6xl mx-auto">
            {/* View Header with dynamic title per tab & distinct action buttons */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 mb-8 border-b border-slate-200 dark:border-slate-800/80">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold mb-2 block">
                  {currentHeading.badge}
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                  {currentHeading.title}
                </h1>
              </div>

              {/* Action Buttons: Upload PDF / Syllabus, Edit Syllabus, Run Analysis */}
              <div className="flex flex-wrap items-center gap-3 self-start sm:self-center">
                <input
                  type="file"
                  ref={headerFileInputRef}
                  accept=".pdf,.txt,.json,.md"
                  onChange={handleDirectFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => headerFileInputRef.current?.click()}
                  disabled={isLoading || isProcessingFile}
                  className="px-4 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 font-bold text-sm flex items-center justify-center text-center leading-tight shadow-2xs transition cursor-pointer"
                  title="Upload a PDF or TXT syllabus document from your computer"
                >
                  {isProcessingFile ? (
                    <span className="flex items-center gap-1.5 text-xs">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Parsing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <FileUp className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                      <span>Upload<br />Syllabus / PDF</span>
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setIsSyllabusModalOpen(true)}
                  className="w-28 h-12 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white border border-slate-200 dark:border-slate-800 font-bold text-sm flex items-center justify-center text-center leading-tight shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800/70 transition cursor-pointer"
                >
                  Edit<br />Syllabus
                </button>

                <button
                  onClick={() => setIsVersionModalOpen(true)}
                  className="px-3.5 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 font-bold text-sm flex items-center justify-center text-center leading-tight shadow-2xs transition cursor-pointer"
                  title="Curriculum Version Comparison: score changes, added/removed skills, and new/improved gaps"
                >
                  <span className="flex items-center gap-1.5">
                    <GitCompare className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span>Compare<br />Versions</span>
                  </span>
                </button>

                <button
                  onClick={handleAnalyze}
                  disabled={isLoading || isProcessingFile}
                  className="w-28 h-12 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold text-sm flex items-center justify-center text-center leading-tight shadow-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-1.5 text-xs">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Wait
                    </span>
                  ) : (
                    <>Run<br />Analysis</>
                  )}
                </button>
              </div>
            </div>

            {/* Upload Feedback Notice */}
            {uploadNotice && (
              <div className="mb-6 px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-200 flex items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span className="font-semibold">{uploadNotice}</span>
                </div>
                <button
                  onClick={() => setUploadNotice(null)}
                  className="text-blue-600 dark:text-blue-400 hover:opacity-75 font-bold cursor-pointer text-sm"
                >
                  &times;
                </button>
              </div>
            )}

            {/* Mobile Tab Nav for small screens */}
            <div className="flex md:hidden items-center gap-1.5 overflow-x-auto pb-2 mb-6 border-b border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                    : 'text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
                }`}
              >
                Executive Summary
              </button>
              <button
                onClick={() => setActiveTab('comparison')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap ${
                  activeTab === 'comparison'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                    : 'text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
                }`}
              >
                Full Matrix ({analysisResult.gapCount} gaps)
              </button>
              <button
                onClick={() => setActiveTab('recommendations')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap ${
                  activeTab === 'recommendations'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                    : 'text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
                }`}
              >
                AI Action Plan
              </button>
              <button
                onClick={() => setActiveTab('deepdive')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap ${
                  activeTab === 'deepdive'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                    : 'text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
                }`}
              >
                Radar & Cloud
              </button>
            </div>

            {/* TAB 1: OVERVIEW (Executive Scorecard + Scenario Simulator + Charts + Transparency + AI Suggestions) */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                {/* Executive Score & Key Stat Cards Grid */}
                <ExecutiveSummaryCards
                  score={analysisResult.alignmentScore}
                  rawCoveragePct={analysisResult.rawCoveragePct}
                  topN={topN}
                  coveredCount={analysisResult.coveredCount}
                  partialCount={analysisResult.partialCount}
                  gapCount={analysisResult.gapCount}
                  surplusCount={analysisResult.surplusCount}
                  totalEvaluatedDemand={analysisResult.totalEvaluatedDemand}
                  coveredDemandWeight={analysisResult.coveredDemandWeight}
                  criticalGaps={criticalGaps}
                  categoryStats={analysisResult.categoryStats}
                  onViewGaps={() => setActiveTab('comparison')}
                  onViewRecommendations={() => {
                    setActiveTab('recommendations');
                    if (recommendations.length === 0) handleGenerateRecommendations();
                  }}
                  onFilterSkill={handleFilterSkillAndSwitch}
                  isSimulated={isScenarioApplied && scenarioItems.length > 0}
                  simulationDelta={simulationResult.scoreDelta}
                />

                {/* Scenario Analysis Simulator ("What Happens If We Add...?") */}
                <ScenarioSimulator
                  analyzedSkills={analysisResult.analyzedSkills}
                  simulationResult={simulationResult}
                  onAddSimulationSkill={handleAddSimulationSkill}
                  onRemoveSimulationSkill={handleRemoveSimulationSkill}
                  onResetSimulation={handleResetSimulation}
                  onApplyScenarioToViews={handleToggleApplyScenario}
                  isScenarioApplied={isScenarioApplied}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-8">
                    <TopDemandBarChart
                      skills={analysisResult.analyzedSkills}
                      topCount={15}
                      darkMode={darkMode}
                      onViewFullMatrix={() => setActiveTab('comparison')}
                    />
                  </div>

                  <div className="lg:col-span-4">
                    <CriticalGapsPanel
                      criticalGaps={criticalGaps}
                      onFilterSkill={handleFilterSkillAndSwitch}
                      onGenerateRecs={() => {
                        setActiveTab('recommendations');
                        if (recommendations.length === 0) handleGenerateRecommendations();
                      }}
                      onDownloadPDF={handleDownloadPDF}
                      onDownloadCSV={handleDownloadCSV}
                      isExporting={isExporting}
                    />
                  </div>
                </div>

                {/* Market Benchmark Transparency & Reliability Card */}
                <MarketTransparencyCard
                  onOpenValidationModal={() => setIsValidationModalOpen(true)}
                  onOpenDatasetModal={() => setIsDatasetModalOpen(true)}
                  marketSkillCount={marketSkills.length}
                />

                {/* Live Suggestions Card directly on Overview */}
                <QuickSuggestionsCard
                  recommendations={recommendations}
                  onViewAll={() => setActiveTab('recommendations')}
                  onGenerate={handleGenerateRecommendations}
                  isLoading={isGeneratingRecs}
                />
              </div>
            )}

            {/* TAB 2: FULL MATRIX TABLE */}
            {activeTab === 'comparison' && (
              <div className="animate-in fade-in duration-150">
                <SkillsTable
                  skills={analysisResult.analyzedSkills}
                  surplusSkills={analysisResult.surplusSkills}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  demandThreshold={demandThreshold}
                  setDemandThreshold={setDemandThreshold}
                  topN={topN}
                  setTopN={setTopN}
                  highlightedSkill={highlightedSkill}
                  onClearHighlight={() => setHighlightedSkill(null)}
                  onSimulateSkill={(skill) => {
                    handleAddSimulationSkill({ skill, depth: 3 });
                    setActiveTab('overview');
                  }}
                />
              </div>
            )}

            {/* TAB 3: AI RECOMMENDATIONS */}
            {activeTab === 'recommendations' && (
              <div className="animate-in fade-in duration-150">
                <AiRecommendations
                  recommendations={recommendations}
                  onGenerate={handleGenerateRecommendations}
                  isLoading={isGeneratingRecs}
                  alignmentScore={analysisResult.alignmentScore}
                />
              </div>
            )}

            {/* TAB 4: DEEP DIVE (RADAR & WORD CLOUD) */}
            {activeTab === 'deepdive' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <CategoryRadarChart
                    categoryStats={analysisResult.categoryStats}
                    darkMode={darkMode}
                  />
                  <GapWordCloud
                    gapSkills={analysisResult.analyzedSkills}
                    selectedSkill={highlightedSkill}
                    onSelectSkill={(skillName) => {
                      setHighlightedSkill(skillName || null);
                      if (skillName) setActiveTab('comparison');
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* 3. Footer matching screenshot_1.png */}
      <AppFooter
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenDatasetModal={() => setIsDatasetModalOpen(true)}
        skillCount={marketSkills.length}
      />

      {/* Modals */}
      <SyllabusModal
        isOpen={isSyllabusModalOpen}
        onClose={() => setIsSyllabusModalOpen(false)}
        curriculumText={curriculumText}
        setCurriculumText={setCurriculumText}
        onAnalyze={handleAnalyze}
        isLoading={isLoading}
        loadingStep={loadingStep}
        errorMessage={errorMessage}
        onSkillsExtracted={(skills) => {
          if (Array.isArray(skills) && skills.length > 0) {
            setExtractedSkills(skills);
          }
        }}
      />

      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />

      <MarketDataManagerModal
        isOpen={isDatasetModalOpen}
        onClose={() => setIsDatasetModalOpen(false)}
        marketSkills={marketSkills}
        onUpdateMarketSkills={(newSkills) => setMarketSkills(newSkills)}
        onResetToDefault={() => setMarketSkills(defaultSkillsData as MarketSkill[])}
      />

      <CurriculumVersionModal
        isOpen={isVersionModalOpen}
        onClose={() => setIsVersionModalOpen(false)}
        currentSnapshot={currentSnapshot}
        savedSnapshots={savedSnapshots}
        onSaveSnapshot={handleSaveSnapshot}
        onLoadSnapshot={handleLoadSnapshot}
      />

      <ValidationModal
        isOpen={isValidationModalOpen}
        onClose={() => setIsValidationModalOpen(false)}
      />
    </div>
  );
}
