import React, { useState, useRef } from 'react';
import { X, Upload, Download, RefreshCw, CheckCircle, AlertCircle, FileJson, Search, Plus, Trash2, Edit2, Check } from 'lucide-react';
import { MarketSkill } from '../types/skills';

interface MarketDataManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  marketSkills: MarketSkill[];
  onUpdateMarketSkills: (newSkills: MarketSkill[]) => void;
  onResetToDefault: () => void;
}

export const MarketDataManagerModal: React.FC<MarketDataManagerModalProps> = ({
  isOpen,
  onClose,
  marketSkills,
  onUpdateMarketSkills,
  onResetToDefault,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New skill form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Programming');
  const [newSkillDemand, setNewSkillDemand] = useState('15.0');
  const [newSkillCount, setNewSkillCount] = useState('1200');

  // Inline editing state
  const [editingSkillName, setEditingSkillName] = useState<string | null>(null);
  const [editingDemandVal, setEditingDemandVal] = useState<string>('');

  if (!isOpen) return null;

  const categories = ['ALL', 'Programming', 'Cloud', 'ML/AI', 'Databases', 'Visualization', 'Soft Skills'];

  const filtered = marketSkills.filter((s) => {
    const matchSearch =
      s.skill.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = categoryFilter === 'ALL' || s.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchSearch && matchCat;
  });

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const normName = newSkillName.trim().toLowerCase();
    if (!normName) {
      setErrorMsg('Skill name cannot be empty.');
      return;
    }

    const demandNum = parseFloat(newSkillDemand);
    if (isNaN(demandNum) || demandNum <= 0 || demandNum > 100) {
      setErrorMsg('Demand percentage must be a number between 0.1 and 100.');
      return;
    }

    const countNum = parseInt(newSkillCount, 10) || Math.round(demandNum * 80);

    const existingIdx = marketSkills.findIndex((s) => s.skill.toLowerCase() === normName);
    let updated: MarketSkill[];
    if (existingIdx >= 0) {
      updated = [...marketSkills];
      updated[existingIdx] = {
        ...updated[existingIdx],
        category: newSkillCategory,
        demand_pct: demandNum,
        count: countNum,
      };
      setSuccessMsg(`Updated benchmark demand for existing skill "${normName}".`);
    } else {
      updated = [
        {
          skill: normName,
          category: newSkillCategory,
          demand_pct: demandNum,
          count: countNum,
        },
        ...marketSkills,
      ];
      setSuccessMsg(`Added "${normName}" (${demandNum}% market demand) to benchmark dataset.`);
    }

    onUpdateMarketSkills(updated);
    setNewSkillName('');
    setShowAddForm(false);
  };

  const handleDeleteSkill = (skillToDelete: string) => {
    const updated = marketSkills.filter((s) => s.skill.toLowerCase() !== skillToDelete.toLowerCase());
    onUpdateMarketSkills(updated);
    setSuccessMsg(`Removed "${skillToDelete}" from active benchmark skills.`);
  };

  const handleSaveInlineDemand = (skillName: string) => {
    const num = parseFloat(editingDemandVal);
    if (isNaN(num) || num < 0 || num > 100) {
      setErrorMsg('Please enter a valid percentage between 0 and 100.');
      return;
    }

    const updated = marketSkills.map((s) =>
      s.skill.toLowerCase() === skillName.toLowerCase() ? { ...s, demand_pct: Math.round(num * 10) / 10 } : s
    );
    onUpdateMarketSkills(updated);
    setEditingSkillName(null);
    setSuccessMsg(`Updated "${skillName}" demand to ${num}%.`);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);

        if (!Array.isArray(parsed) || parsed.length === 0) {
          throw new Error('JSON must be a non-empty array of skill objects.');
        }

        const validSkills: MarketSkill[] = [];
        for (let i = 0; i < parsed.length; i++) {
          const item = parsed[i];
          if (!item.skill || typeof item.skill !== 'string') {
            throw new Error(`Item at index ${i} is missing valid "skill" string.`);
          }
          validSkills.push({
            skill: item.skill.toLowerCase().trim(),
            count: typeof item.count === 'number' ? item.count : 1000,
            demand_pct: typeof item.demand_pct === 'number' ? item.demand_pct : parseFloat(item.demand_pct) || 5.0,
            category: item.category || 'General',
          });
        }

        onUpdateMarketSkills(validSkills);
        setSuccessMsg(`Successfully imported ${validSkills.length} market skills from "${file.name}"!`);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (err: any) {
        setErrorMsg(err.message || 'Invalid JSON file. Please ensure it follows the Kaggle dataset structure.');
      }
    };
    reader.onerror = () => {
      setErrorMsg('Failed to read the uploaded file.');
    };
    reader.readAsText(file);
  };

  const handleDownloadJSON = () => {
    const jsonStr = JSON.stringify(marketSkills, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skill_demand_${marketSkills.length}_skills.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 block mb-0.5 font-semibold">
              Market Benchmark Dataset
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileJson className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Kaggle Job Postings & Skills Demand ({marketSkills.length} active skills)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-850/60 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 transition shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddForm ? 'Cancel Add' : 'Add Benchmark Skill'}</span>
            </button>

            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
              id="market-json-upload"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-slate-950 text-white dark:bg-white dark:text-slate-950 hover:opacity-90 transition shadow-2xs cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Custom JSON
            </button>

            <button
              onClick={handleDownloadJSON}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Export JSON
            </button>

            <button
              onClick={() => {
                onResetToDefault();
                setSuccessMsg('Reset to built-in Kaggle 42 Data Science skills.');
                setErrorMsg(null);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Default
            </button>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'ALL' ? 'All Categories' : c}
                </option>
              ))}
            </select>

            <div className="relative w-44 sm:w-52">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-white"
              />
            </div>
          </div>
        </div>

        {/* Add Skill Inline Form */}
        {showAddForm && (
          <form
            onSubmit={handleAddSkill}
            className="p-4 bg-blue-50/70 dark:bg-blue-950/40 border-b border-blue-200 dark:border-blue-900/60 animate-in fade-in"
          >
            <div className="flex flex-col sm:flex-row items-center gap-3 text-xs">
              <div className="flex-1 w-full sm:w-auto">
                <label className="block text-[10px] font-mono uppercase text-slate-500 font-bold mb-1">
                  Skill Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. rust, airflow, snowflake"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  autoFocus
                />
              </div>

              <div className="w-full sm:w-36">
                <label className="block text-[10px] font-mono uppercase text-slate-500 font-bold mb-1">
                  Category
                </label>
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  <option value="Programming">Programming</option>
                  <option value="Cloud">Cloud</option>
                  <option value="ML/AI">ML/AI</option>
                  <option value="Databases">Databases</option>
                  <option value="Visualization">Visualization</option>
                  <option value="Soft Skills">Soft Skills</option>
                </select>
              </div>

              <div className="w-full sm:w-28">
                <label className="block text-[10px] font-mono uppercase text-slate-500 font-bold mb-1">
                  Demand %
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="100"
                  value={newSkillDemand}
                  onChange={(e) => setNewSkillDemand(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="w-full sm:w-28">
                <label className="block text-[10px] font-mono uppercase text-slate-500 font-bold mb-1">
                  Job Postings
                </label>
                <input
                  type="number"
                  value={newSkillCount}
                  onChange={(e) => setNewSkillCount(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="self-end pt-4 sm:pt-0 flex items-center gap-2">
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer"
                >
                  Save Skill
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-2.5 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Alerts */}
        {errorMsg && (
          <div className="mx-6 mt-3 p-3 rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg(null)} className="text-slate-400 hover:text-slate-600">
              &times;
            </button>
          </div>
        )}
        {successMsg && (
          <div className="mx-6 mt-3 p-3 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-700 dark:text-emerald-300 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg(null)} className="text-slate-400 hover:text-slate-600">
              &times;
            </button>
          </div>
        )}

        {/* Skills list table */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800 font-mono text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Skill</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-right">Demand %</th>
                  <th className="py-2.5 px-3 text-right">Job Postings</th>
                  <th className="py-2.5 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((item, idx) => {
                  const isEditingThis = editingSkillName === item.skill;

                  return (
                    <tr key={`${item.skill}-${idx}`} className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition">
                      <td className="py-2 px-3 text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                      <td className="py-2 px-3 font-semibold text-slate-900 dark:text-white capitalize">
                        {item.skill}
                      </td>
                      <td className="py-2 px-3">
                        <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-semibold text-slate-900 dark:text-slate-100">
                        {isEditingThis ? (
                          <div className="inline-flex items-center gap-1 justify-end">
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              max="100"
                              value={editingDemandVal}
                              onChange={(e) => setEditingDemandVal(e.target.value)}
                              className="w-16 px-1.5 py-0.5 text-right text-xs rounded border border-blue-500 bg-white dark:bg-slate-900 font-mono"
                              autoFocus
                            />
                            <span>%</span>
                            <button
                              onClick={() => handleSaveInlineDemand(item.skill)}
                              className="p-1 rounded text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                              title="Save"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingSkillName(null)}
                              className="p-1 rounded text-slate-400 hover:text-slate-600"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span
                            onClick={() => {
                              setEditingSkillName(item.skill);
                              setEditingDemandVal(String(item.demand_pct));
                            }}
                            className="hover:underline cursor-pointer"
                            title="Click to edit demand %"
                          >
                            {item.demand_pct}%
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-right text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                        {item.count ? item.count.toLocaleString() : 'N/A'}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => {
                              setEditingSkillName(item.skill);
                              setEditingDemandVal(String(item.demand_pct));
                            }}
                            className="p-1 rounded text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
                            title="Edit Demand %"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSkill(item.skill)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition"
                            title="Remove from benchmark"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
          <span>Showing {filtered.length} of {marketSkills.length} benchmark skills</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-bold rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

