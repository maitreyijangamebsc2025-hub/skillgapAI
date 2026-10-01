import React from 'react';
import { LayoutDashboard, Table, Lightbulb, BarChart3, HelpCircle } from 'lucide-react';

export type ActiveTab = 'overview' | 'comparison' | 'recommendations' | 'deepdive';

interface DashboardNavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  gapCount: number;
  coveredCount: number;
  recommendationsCount: number;
}

export const DashboardNavigation: React.FC<DashboardNavigationProps> = ({
  activeTab,
  setActiveTab,
  gapCount,
  coveredCount,
  recommendationsCount,
}) => {
  const tabs = [
    {
      id: 'overview' as ActiveTab,
      label: 'Summary & Key Charts',
      desc: 'Alignment gauge & top skills comparison',
      icon: <LayoutDashboard className="w-4 h-4" />,
      badge: null,
    },
    {
      id: 'comparison' as ActiveTab,
      label: 'Full Skill Matrix',
      desc: 'Filterable table & course mapping',
      icon: <Table className="w-4 h-4" />,
      badge: `${coveredCount} taught / ${gapCount} gaps`,
    },
    {
      id: 'recommendations' as ActiveTab,
      label: 'AI Action Plan',
      desc: '5 concrete curriculum updates',
      icon: <Lightbulb className="w-4 h-4" />,
      badge: recommendationsCount > 0 ? `${recommendationsCount} steps` : 'Recommended',
    },
    {
      id: 'deepdive' as ActiveTab,
      label: 'Domain Radar & Word Cloud',
      desc: 'Category breakdown & gap cloud',
      icon: <BarChart3 className="w-4 h-4" />,
      badge: null,
    },
  ];

  return (
    <div className="border-b border-slate-200 dark:border-slate-800 mb-6">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
