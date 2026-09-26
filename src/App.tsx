import React, { useState } from 'react';
import { jobMarketData } from './data/initialData';
import { JobMarketData, CareerPath } from './types/jobMarket';
import { Header } from './components/Header';
import { CareerPathsView } from './components/CareerPathsView';
import { SkillMatcher } from './components/SkillMatcher';
import { SkillsMatrixView } from './components/SkillsMatrixView';
import { SalaryBenchmarksView } from './components/SalaryBenchmarksView';
import { RawDataViewer } from './components/RawDataViewer';
import { CareerCompareModal } from './components/CareerCompareModal';
import { Briefcase, CheckCircle2 } from 'lucide-react';

export const App: React.FC = () => {
  const [data, setData] = useState<JobMarketData>(jobMarketData);
  const [activeTab, setActiveTab] = useState<string>('careers');
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([
    'Data Scientist',
    'AI Engineer',
  ]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);

  const toggleCompare = (roleName: string) => {
    setSelectedForCompare((prev) =>
      prev.includes(roleName)
        ? prev.filter((r) => r !== roleName)
        : [...prev, roleName]
    );
  };

  const handleAddCareerPath = (roleName: string, path: CareerPath) => {
    setData((prev) => {
      // Also ensure any new skills are added to required_skills if not present
      const updatedRequired = Array.from(
        new Set([...prev.required_skills, ...path.required_skills])
      );
      return {
        required_skills: updatedRequired,
        career_paths: {
          ...prev.career_paths,
          [roleName]: path,
        },
      };
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        careerCount={Object.keys(data.career_paths).length}
        skillCount={data.required_skills.length}
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

        {activeTab === 'data' && (
          <RawDataViewer
            data={data}
            onAddCareerPath={handleAddCareerPath}
          />
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
      <footer className="border-t border-slate-800/80 bg-slate-950/90 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">
              Tech Career & Job Market Explorer
            </span>
            <span>•</span>
            <span>Hackathon 3.0 Dataset</span>
            <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 text-[10px]">
              <CheckCircle2 className="w-2.5 h-2.5" />
              Verified Schema
            </span>
          </div>

          <div className="text-slate-500 text-center sm:text-right">
            <span>Data source: <code className="text-slate-400 font-mono">job_market_data.json</code></span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
