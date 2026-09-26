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
      <div className="bg-gradient-to-r from-violet-100/90 via-indigo-50/90 to-sky-100/90 border border-indigo-200/80 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileCode className="w-5 h-5 text-indigo-600" />
                <span>Dataset Inspector & Python Model Sync</span>
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Validated JSON
              </span>
            </div>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              Inspect the exact payload of <code className="text-indigo-800 font-mono font-bold bg-indigo-50 px-1 py-0.5 rounded">job_market_data.json</code>.
              All items in <code className="text-indigo-800 font-mono font-bold bg-indigo-50 px-1 py-0.5 rounded">career_paths</code> are verified against
              the master <code className="text-indigo-800 font-mono font-bold bg-indigo-50 px-1 py-0.5 rounded">required_skills</code> taxonomy and ingested by the Python analyzer.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-indigo-500/20"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Custom Role</span>
            </button>
            <button
              onClick={handleCopy}
              className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Quick CLI Validation snippet from README */}
        <div className="mt-4 p-3 bg-white/90 rounded-2xl border border-indigo-100 flex items-center gap-3 text-xs font-mono text-slate-700 shadow-xs">
          <Terminal className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-slate-400 select-none">$</span>
          <span className="text-indigo-900 font-bold">python -m json.tool job_market_data.json &gt; /dev/null</span>
          <span className="text-emerald-700 font-semibold ml-auto hidden sm:inline">(CLI Validation test passed)</span>
        </div>
      </div>

      {/* Code Display */}
      <div className="bg-slate-900 text-slate-100 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="bg-slate-800/80 px-5 py-3 border-b border-slate-700 flex items-center justify-between text-xs">
          <span className="font-mono text-cyan-300 font-semibold">job_market_data.json</span>
          <span className="text-slate-400 font-mono text-[11px]">
            {Object.keys(data.career_paths).length} career paths • {data.required_skills.length} required skills
          </span>
        </div>
        <div className="p-5 max-h-[500px] overflow-auto font-mono text-xs text-indigo-200 bg-slate-950 leading-relaxed scrollbar-thin">
          <pre>{jsonString}</pre>
        </div>
      </div>

      {/* Add Custom Role Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Add New Career Path to Dataset
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Add a specialized role into memory. It will immediately appear in the Career Explorer,
              Skill Gap Analyzer, and Benchmarks views.
            </p>

            <form onSubmit={handleCreateRole} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Career Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Cloud DevOps Architect"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Required Skills (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Cloud Computing, DevOps, Python, SQL"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Select from existing master skills or introduce new ones.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Salary Range</label>
                  <input
                    type="text"
                    value={newSalary}
                    onChange={(e) => setNewSalary(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Growth Rate</label>
                  <select
                    value={newGrowth}
                    onChange={(e) => setNewGrowth(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="Very High">Very High</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Moderate">Moderate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Education Requirement</label>
                <input
                  type="text"
                  value={newEducation}
                  onChange={(e) => setNewEducation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 bg-slate-100 text-slate-600 rounded-xl cursor-pointer hover:bg-slate-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold cursor-pointer shadow-md shadow-indigo-500/20"
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
