import React from 'react';

interface AppFooterProps {
  onOpenHowItWorks: () => void;
  onOpenDatasetModal: () => void;
  skillCount: number;
}

export const AppFooter: React.FC<AppFooterProps> = ({
  onOpenHowItWorks,
  onOpenDatasetModal,
  skillCount,
}) => {
  return (
    <footer className="h-12 shrink-0 border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#080d1a] px-6 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 z-30 font-medium transition-colors duration-200">
      <div className="flex items-center gap-2">
        <span className="font-bold text-slate-800 dark:text-slate-200">SkillGap AI</span>
        <span className="text-slate-400 dark:text-slate-500">&bull;</span>
        <span className="text-slate-500 dark:text-slate-400">Higher Education Curriculum Optimization</span>
      </div>
      <div className="flex items-center gap-6 text-slate-600 dark:text-slate-400">
        <button
          onClick={onOpenHowItWorks}
          className="hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
        >
          NLP Documentation
        </button>
        <button
          onClick={onOpenDatasetModal}
          className="hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
        >
          Market Dataset ({skillCount} skills)
        </button>
      </div>
    </footer>
  );
};
