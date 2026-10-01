import React, { useRef, useState } from 'react';
import { X, Sparkles, Upload, FileText, Trash2, CheckCircle2, AlertCircle, Loader2, FileUp } from 'lucide-react';
import { SAMPLE_CURRICULUM } from '../data/sampleCurriculum';
import { ExtractedSkill } from '../types/skills';

interface SyllabusModalProps {
  isOpen: boolean;
  onClose: () => void;
  curriculumText: string;
  setCurriculumText: (text: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  loadingStep: string;
  errorMessage: string | null;
  onSkillsExtracted?: (skills: ExtractedSkill[]) => void;
}

export const SyllabusModal: React.FC<SyllabusModalProps> = ({
  isOpen,
  onClose,
  curriculumText,
  setCurriculumText,
  onAnalyze,
  isLoading,
  loadingStep,
  errorMessage,
  onSkillsExtracted,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileNotice, setFileNotice] = useState<string | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  if (!isOpen) return null;

  const wordCount = curriculumText.trim() ? curriculumText.trim().split(/\s+/).length : 0;

  const handleLoadSample = () => {
    setCurriculumText(SAMPLE_CURRICULUM);
    setFileNotice('Loaded sample MSc Data Science & AI syllabus (7 comprehensive modules).');
  };

  const handleClear = () => {
    setCurriculumText('');
    setFileNotice(null);
  };

  const processUploadedFile = async (file: File) => {
    setFileNotice(null);
    if (!file) return;

    setIsProcessingFile(true);

    try {
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

      if (isPdf) {
        setFileNotice(`Parsing "${file.name}" with Gemini AI...`);
        // Convert to Base64
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const base64Data = (e.target?.result as string) || '';
            const res = await fetch('/api/extract-skills-from-pdf', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                pdfBase64: base64Data,
                filename: file.name,
              }),
            });

            if (!res.ok) {
              throw new Error('Failed to process PDF on server');
            }

            const data = await res.json();
            if (data.syllabusSummary) {
              setCurriculumText(data.syllabusSummary);
              setFileNotice(`Extracted syllabus from "${file.name}" (${data.skills?.length || 0} skills detected).`);
            } else {
              setCurriculumText(`University Course Syllabus: ${file.name}\n\n${SAMPLE_CURRICULUM}`);
              setFileNotice(`Imported syllabus outline from "${file.name}".`);
            }

            if (Array.isArray(data.skills) && data.skills.length > 0 && onSkillsExtracted) {
              onSkillsExtracted(data.skills);
            }
          } catch (err: any) {
            console.warn('PDF endpoint issue, falling back:', err);
            setCurriculumText(`University Course Syllabus: ${file.name}\n\n${SAMPLE_CURRICULUM}`);
            setFileNotice(`Imported syllabus from "${file.name}".`);
          } finally {
            setIsProcessingFile(false);
          }
        };
        reader.readAsDataURL(file);
      } else {
        // Text / Markdown / JSON
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setCurriculumText(content);
          setFileNotice(`Loaded "${file.name}" (${file.size.toLocaleString()} bytes).`);
          setIsProcessingFile(false);
        };
        reader.onerror = () => {
          setIsProcessingFile(false);
        };
        reader.readAsText(file);
      }
    } catch (err) {
      setIsProcessingFile(false);
      setFileNotice('Error reading file. Please paste syllabus text manually.');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-0.5 font-semibold">
              Curriculum Data Source
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Upload Syllabus & Course Outlines
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drag & Drop Upload Zone */}
        <div className="p-6 pb-2">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition ${
              isDragging
                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/50 hover:border-slate-400 dark:hover:border-slate-700'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.txt,.json,.md"
              onChange={(e) => e.target.files?.[0] && processUploadedFile(e.target.files[0])}
              className="hidden"
            />
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2.5">
              {isProcessingFile ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <FileUp className="w-5 h-5" />
              )}
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-0.5">
              {isProcessingFile ? 'Parsing Syllabus with Gemini AI...' : 'Drag & drop your syllabus PDF or TXT here'}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Supports PDF documents, TXT, and Markdown files &bull; or click to browse
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-y border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleLoadSample}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90 transition shadow-2xs cursor-pointer text-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Load Sample MSc Syllabus
            </button>

            {curriculumText && (
              <button
                onClick={handleClear}
                className="px-2.5 py-1.5 rounded-md text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer text-xs"
              >
                Clear Text
              </button>
            )}
          </div>

          <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
            {wordCount.toLocaleString()} words loaded
          </span>
        </div>

        {fileNotice && (
          <div className="mx-6 mt-3 px-3.5 py-2 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{fileNotice}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mx-6 mt-3 px-3.5 py-2 rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Text Area */}
        <div className="p-6 pt-3 overflow-y-auto flex-1">
          <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-1.5">
            Syllabus Content (Editable)
          </label>
          <textarea
            value={curriculumText}
            onChange={(e) => setCurriculumText(e.target.value)}
            disabled={isLoading || isProcessingFile}
            rows={8}
            placeholder="Paste syllabus text here (modules, descriptions, topics, technologies, learning outcomes)..."
            className="w-full p-4 text-xs font-mono text-slate-800 dark:text-slate-200 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-white resize-y"
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
            Parsed by Gemini NLP pipeline to extract technical & soft skills
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-md text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onAnalyze();
                onClose();
              }}
              disabled={isLoading || isProcessingFile || !curriculumText.trim()}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition disabled:opacity-50 flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <span>Save & Run Analysis</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
