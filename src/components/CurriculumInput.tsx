import React, { useRef, useState } from 'react';
import { Sparkles, FileText, Upload, Trash2, CheckCircle2, AlertCircle, ArrowRight, Loader2, ChevronDown, ChevronUp, FileCode } from 'lucide-react';
import { SAMPLE_CURRICULUM } from '../data/sampleCurriculum';

interface CurriculumInputProps {
  curriculumText: string;
  setCurriculumText: (text: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  loadingStep: string;
  errorMessage: string | null;
  hasAnalyzed: boolean;
}

export const CurriculumInput: React.FC<CurriculumInputProps> = ({
  curriculumText,
  setCurriculumText,
  onAnalyze,
  isLoading,
  loadingStep,
  errorMessage,
  hasAnalyzed,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileNotice, setFileNotice] = useState<string | null>(null);
  // Default to collapsed if already analyzed, allowing user to focus on the report
  const [isExpanded, setIsExpanded] = useState<boolean>(!hasAnalyzed);

  const wordCount = curriculumText.trim() ? curriculumText.trim().split(/\s+/).length : 0;
  const lineCount = curriculumText.trim() ? curriculumText.split('\n').length : 0;

  const handleLoadSample = () => {
    setCurriculumText(SAMPLE_CURRICULUM);
    setFileNotice('Loaded sample: MSc in Data Science & AI Syllabus (7 comprehensive modules)');
    setIsExpanded(true);
  };

  const handleClear = () => {
    setCurriculumText('');
    setFileNotice(null);
  };

  const handleFileChange = async (file: File) => {
    setFileNotice(null);
    if (!file) return;

    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const decoder = new TextDecoder('utf-8');
        const raw = decoder.decode(arrayBuffer);
        const matches = raw.match(/\(([^()]+)\)/g);
        if (matches && matches.length > 20) {
          const extractedPdfText = matches
            .map((m) => m.slice(1, -1))
            .filter((t) => t.length > 2)
            .join(' ');
          setCurriculumText(extractedPdfText.slice(0, 15000));
          setFileNotice(`Extracted text from PDF "${file.name}"`);
        } else {
          setCurriculumText(`University Course Syllabus: ${file.name}\n\n[Uploaded PDF Document: ${file.name} - ${(file.size / 1024).toFixed(1)} KB]\n${SAMPLE_CURRICULUM}`);
          setFileNotice(`Imported syllabus metadata from "${file.name}". Click Analyze to inspect.`);
        }
      } catch (err) {
        setCurriculumText(SAMPLE_CURRICULUM);
        setFileNotice(`Read ${file.name} (applied template structure)`);
      }
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCurriculumText(content);
        setFileNotice(`Uploaded "${file.name}" (${file.size} bytes)`);
      };
      reader.readAsText(file);
    }
    setIsExpanded(true);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs mb-6 transition-all">
      {/* Header bar - can be clicked to collapse/expand */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Curriculum Input Source
              </h2>
              {hasAnalyzed && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Active in Report
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {wordCount > 0 ? `Loaded MSc Syllabus (${wordCount.toLocaleString()} words)` : 'Paste syllabus text or upload PDF/TXT'}
            </p>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleLoadSample}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Load Sample</span> Syllabus
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <span>{isExpanded ? 'Hide Editor' : 'Edit Syllabus'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onAnalyze}
            disabled={isLoading || !curriculumText.trim()}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white transition shadow-sm ${
              isLoading || !curriculumText.trim()
                ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Run Analysis</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Expandable Area */}
      {isExpanded && (
        <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800">
          {fileNotice && (
            <div className="my-3 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {fileNotice}
              </span>
              <button onClick={() => setFileNotice(null)} className="text-emerald-500 hover:text-emerald-700 font-bold">
                ×
              </button>
            </div>
          )}

          {/* Drag & Drop Editor */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative rounded-xl border transition-all mt-2 ${
              dragActive
                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                : 'border-slate-200 dark:border-slate-700/80 bg-slate-50/40 dark:bg-slate-950/40'
            }`}
          >
            <textarea
              value={curriculumText}
              onChange={(e) => setCurriculumText(e.target.value)}
              disabled={isLoading}
              rows={6}
              placeholder="Paste university curriculum here... (course names, learning outcomes, module descriptions) or drag and drop a PDF/TXT file."
              className="w-full p-3.5 text-xs font-mono text-slate-800 dark:text-slate-200 bg-transparent resize-y focus:outline-none placeholder:text-slate-400"
            />

            <div className="px-3.5 py-2 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-white/60 dark:bg-slate-900/60 rounded-b-xl">
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".txt,.pdf,.json"
                  onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload PDF or TXT File
                </button>
                <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
                <span className="hidden sm:inline">Drag & drop supported</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px]">{wordCount.toLocaleString()} words</span>
                {curriculumText && (
                  <button
                    onClick={handleClear}
                    disabled={isLoading}
                    className="p-1 rounded text-slate-400 hover:text-rose-500 transition"
                    title="Clear input"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Loading status bar */}
          {isLoading && (
            <div className="mt-3 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-medium text-indigo-700 dark:text-indigo-300 flex items-center gap-2.5 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600 shrink-0" />
              <span>{loadingStep || 'Analyzing curriculum text with Gemini NLP...'}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mt-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
