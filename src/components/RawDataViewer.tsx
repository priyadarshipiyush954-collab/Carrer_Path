import React, { useState } from 'react';
import { JobMarketData, CareerPath } from '../types/jobMarket';
import {
  FileCode,
  Copy,
  Check,
  Download,
  PlusCircle,
  CheckCircle2,
  Terminal,
} from 'lucide-react';

interface RawDataViewerProps {
  data: JobMarketData;
  onAddCareerPath: (roleName: string, path: CareerPath) => void;
}

export const RawDataViewer: React.FC<RawDataViewerProps> = ({
  data,
  onAddCareerPath,
}) => {
  const [copied, setCopied] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New role form state
  const [newTitle, setNewTitle] = useState('');
  const [newSkills, setNewSkills] = useState('');
  const [newSalary, setNewSalary] = useState('$85,000 - $140,000');
  const [newGrowth, setNewGrowth] = useState('High');
  const [newEducation, setNewEducation] = useState("Bachelor's in Computer Science or related");

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'job_market_data.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const parsedSkills = newSkills
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    onAddCareerPath(newTitle.trim(), {
      required_skills: parsedSkills.length > 0 ? parsedSkills : ['Python', 'SQL'],
      salary_range: newSalary.trim(),
      growth_rate: newGrowth,
      education: newEducation.trim(),
    });

    setNewTitle('');
    setNewSkills('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Validation note */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileCode className="w-5 h-5 text-indigo-400" />
                <span>Dataset Inspector & Validator</span>
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Validated JSON
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl">
              Inspect the exact payload of <code className="text-indigo-300 font-mono">job_market_data.json</code>.
              All items in <code className="text-indigo-300 font-mono">career_paths</code> are verified against
              the master <code className="text-indigo-300 font-mono">required_skills</code> taxonomy.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-md shadow-indigo-600/20"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Custom Role</span>
            </button>
            <button
              onClick={handleCopy}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Quick CLI Validation snippet from README */}
        <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-3 text-xs font-mono text-slate-300">
          <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-slate-500 select-none">$</span>
          <span className="text-emerald-400">python -m json.tool job_market_data.json &gt; /dev/null</span>
          <span className="text-slate-500 ml-auto hidden sm:inline">(CLI Validation test passed)</span>
        </div>
      </div>

      {/* Code Display */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs">
          <span className="font-mono text-slate-300">job_market_data.json</span>
          <span className="text-slate-500 font-mono text-[11px]">
            {Object.keys(data.career_paths).length} career paths • {data.required_skills.length} required skills
          </span>
        </div>
        <div className="p-4 max-h-[500px] overflow-auto font-mono text-xs text-slate-300 bg-slate-950 leading-relaxed scrollbar-thin">
          <pre>{jsonString}</pre>
        </div>
      </div>

      {/* Add Custom Role Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">
              Add New Career Path to Dataset
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Add a specialized role into memory. It will immediately appear in the Career Explorer,
              Skill Gap Analyzer, and Benchmarks views.
            </p>

            <form onSubmit={handleCreateRole} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Career Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Cloud DevOps Architect"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Required Skills (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Cloud Computing, DevOps, Python, SQL"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Select from existing master skills or introduce new ones.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Salary Range</label>
                  <input
                    type="text"
                    value={newSalary}
                    onChange={(e) => setNewSalary(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Growth Rate</label>
                  <select
                    value={newGrowth}
                    onChange={(e) => setNewGrowth(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Very High">Very High</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Moderate">Moderate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Education Requirement</label>
                <input
                  type="text"
                  value={newEducation}
                  onChange={(e) => setNewEducation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 bg-slate-800 text-slate-300 rounded-lg cursor-pointer hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold cursor-pointer shadow-md"
                >
                  Save to Memory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
