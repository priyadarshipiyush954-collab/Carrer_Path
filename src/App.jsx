import React, { useState } from 'react';
import { jobMarketData } from './data/initialData';
import { Header } from './components/Header';
import { CareerPathsView } from './components/CareerPathsView';
import { SkillMatcher } from './components/SkillMatcher';
import { SkillsMatrixView } from './components/SkillsMatrixView';
import { SalaryBenchmarksView } from './components/SalaryBenchmarksView';
import { CareerCompareModal } from './components/CareerCompareModal';

export const App = () => {
  const [data] = useState(jobMarketData);
  const [activeTab, setActiveTab] = useState('careers');
  const [selectedForCompare, setSelectedForCompare] = useState([
    'Data Scientist',
    'AI Engineer',
  ]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const toggleCompare = (roleName) => {
    setSelectedForCompare((prev) =>
      prev.includes(roleName)
        ? prev.filter((r) => r !== roleName)
        : [...prev, roleName]
    );
  };

  return (
    <div className="min-h-screen relative flex flex-col selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      {/* Colorful Light Ambient Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[32rem] h-[32rem] bg-indigo-200/50 rounded-full blur-3xl mix-blend-multiply" />
        <div className="absolute top-1/4 -right-32 w-[30rem] h-[30rem] bg-pink-200/40 rounded-full blur-3xl mix-blend-multiply" />
        <div className="absolute top-2/3 left-1/4 w-[28rem] h-[28rem] bg-cyan-200/40 rounded-full blur-3xl mix-blend-multiply" />
        <div className="absolute -bottom-32 right-1/4 w-[32rem] h-[32rem] bg-amber-200/40 rounded-full blur-3xl mix-blend-multiply" />
      </div>

      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        careerCount={Object.keys(data.career_paths || {}).length}
        skillCount={(data.required_skills || []).length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'careers' && (
          <CareerPathsView
            careerPaths={data.career_paths}
            allRequiredSkills={data.required_skills}
            selectedForCompare={selectedForCompare}
            toggleCompare={toggleCompare}
            openCompareModal={() => setIsCompareModalOpen(true)}
          />
        )}

        {activeTab === 'matcher' && (
          <SkillMatcher
            careerPaths={data.career_paths}
            allRequiredSkills={data.required_skills}
          />
        )}

        {activeTab === 'skills' && (
          <SkillsMatrixView
            allRequiredSkills={data.required_skills}
            careerPaths={data.career_paths}
          />
        )}

        {activeTab === 'benchmarks' && (
          <SalaryBenchmarksView careerPaths={data.career_paths} />
        )}
      </main>

      {/* Comparison Modal */}
      <CareerCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        selectedRoles={selectedForCompare}
        careerPaths={data.career_paths}
        allRequiredSkills={data.required_skills}
        onRemoveRole={(role) =>
          setSelectedForCompare((prev) => prev.filter((r) => r !== role))
        }
      />

      {/* Footer */}
      <footer className="border-t border-indigo-100 bg-white/80 backdrop-blur-md py-6 mt-12 text-xs text-slate-500 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">
              Tech Career & Job Market Explorer
            </span>
            <span>•</span>
            <span className="text-slate-500">Tech Career Intelligence & Skill Gap Explorer</span>
          </div>

          <div className="flex items-center gap-3 text-slate-500 text-center sm:text-right">
            <span>Career trajectory analysis & predictive compensation benchmarks</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
