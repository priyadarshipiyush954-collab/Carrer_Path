import React from 'react';
import { Briefcase, CheckCircle2, Sparkles, Terminal } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  careerCount: number;
  skillCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  careerCount,
  skillCount,
}) => {
  const navItems = [
    { id: 'careers', label: 'Career Paths' },
    { id: 'matcher', label: 'Skill Gap Analyzer' },
    { id: 'skills', label: 'In-Demand Skills' },
    { id: 'benchmarks', label: 'Market Benchmarks' },
    { id: 'data', label: 'Dataset & Schema' },
  ];

  return (
    <header className="border-b border-indigo-100/90 bg-white/85 backdrop-blur-md sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md shadow-indigo-500/25 text-white font-bold ring-2 ring-indigo-100">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 bg-clip-text">
                  Tech Career & Job Market Explorer
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center gap-1 shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Aligned Dataset
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Hackathon 3.0 Market Intelligence • {careerCount} Career Paths • {skillCount} In-Demand Skills
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 text-white shadow-sm shadow-indigo-500/30'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-white/80'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};
