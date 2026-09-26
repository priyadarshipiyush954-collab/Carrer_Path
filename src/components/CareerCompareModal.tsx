import React from 'react';
import { CareerPath } from '../types/jobMarket';
import { parseSalary } from '../data/initialData';
import { X, Check, DollarSign, TrendingUp, GraduationCap, Layers } from 'lucide-react';

interface CareerCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRoles: string[];
  careerPaths: Record<string, CareerPath>;
  allRequiredSkills: string[];
  onRemoveRole: (role: string) => void;
}

export const CareerCompareModal: React.FC<CareerCompareModalProps> = ({
  isOpen,
  onClose,
  selectedRoles,
  careerPaths,
  allRequiredSkills,
  onRemoveRole,
}) => {
  if (!isOpen || selectedRoles.length === 0) return null;

  // Identify all skills required by the selected roles
  const comparedSkills = Array.from(
    new Set(
      selectedRoles.flatMap((role) => careerPaths[role]?.required_skills || [])
    )
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Career Path Comparison</span>
              <span className="text-xs font-normal text-slate-400">
                ({selectedRoles.length} roles selected)
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Side-by-side analysis of skills, compensation, growth, and educational requirements.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-auto p-6 space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="py-3 px-4 text-xs font-semibold text-slate-400 w-1/4">
                    Dimension
                  </th>
                  {selectedRoles.map((roleName) => (
                    <th key={roleName} className="py-3 px-4 text-base font-bold text-white w-1/4">
                      <div className="flex items-center justify-between">
                        <span>{roleName}</span>
                        <button
                          onClick={() => onRemoveRole(roleName)}
                          className="text-xs text-slate-500 hover:text-rose-400 cursor-pointer ml-2"
                          title="Remove from comparison"
                        >
                          ✕
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {/* Salary */}
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-300 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    Salary Range
                  </td>
                  {selectedRoles.map((roleName) => {
                    const info = careerPaths[roleName];
                    const salary = parseSalary(info.salary_range);
                    return (
                      <td key={roleName} className="py-3.5 px-4">
                        <span className="text-emerald-400 font-semibold font-mono text-sm block">
                          {info.salary_range}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Midpoint: ${(salary.average / 1000).toFixed(0)}k/yr
                        </span>
                      </td>
                    );
                  })}
                </tr>

                {/* Growth Rate */}
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-300 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-400" />
                    Growth Outlook
                  </td>
                  {selectedRoles.map((roleName) => {
                    const info = careerPaths[roleName];
                    return (
                      <td key={roleName} className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-indigo-300 border border-slate-700">
                          {info.growth_rate} Growth
                        </span>
                      </td>
                    );
                  })}
                </tr>

                {/* Education */}
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-300 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-cyan-400" />
                    Education Barrier
                  </td>
                  {selectedRoles.map((roleName) => {
                    const info = careerPaths[roleName];
                    return (
                      <td key={roleName} className="py-3.5 px-4 text-slate-300">
                        {info.education}
                      </td>
                    );
                  })}
                </tr>

                {/* Skills Summary */}
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-300 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    Required Skills Count
                  </td>
                  {selectedRoles.map((roleName) => {
                    const info = careerPaths[roleName];
                    return (
                      <td key={roleName} className="py-3.5 px-4 text-slate-300 font-semibold">
                        {info.required_skills.length} Skills
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Skill Breakdown Matrix */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              Skill Requirement Matrix
            </h3>
            <div className="border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-950 text-slate-400">
                  <tr>
                    <th className="py-2.5 px-4 font-medium">Skill</th>
                    {selectedRoles.map((roleName) => (
                      <th key={roleName} className="py-2.5 px-4 font-medium text-center">
                        {roleName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {comparedSkills.map((skill) => (
                    <tr key={skill} className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-4 font-medium text-slate-200">{skill}</td>
                      {selectedRoles.map((roleName) => {
                        const hasSkill = careerPaths[roleName]?.required_skills.includes(skill);
                        return (
                          <td key={roleName} className="py-2.5 px-4 text-center">
                            {hasSkill ? (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400">
                                <Check className="w-3.5 h-3.5" />
                              </span>
                            ) : (
                              <span className="text-slate-600">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
