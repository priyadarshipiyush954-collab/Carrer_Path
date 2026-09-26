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

  const comparedSkills = Array.from(
    new Set(
      selectedRoles.flatMap((role) => careerPaths[role]?.required_skills || [])
    )
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/90 via-white to-purple-50/80">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Career Path Comparison</span>
              <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                {selectedRoles.length} roles selected
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Side-by-side analysis of skills, compensation, growth, and educational requirements.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-auto p-6 space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-1/4">
                    Dimension
                  </th>
                  {selectedRoles.map((roleName) => (
                    <th key={roleName} className="py-3 px-4 text-base font-bold text-slate-900 w-1/4">
                      <div className="flex items-center justify-between">
                        <span className="text-indigo-950">{roleName}</span>
                        <button
                          onClick={() => onRemoveRole(roleName)}
                          className="text-xs text-slate-400 hover:text-rose-600 cursor-pointer ml-2 p-1"
                          title="Remove from comparison"
                        >
                          ✕
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {/* Salary */}
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-700 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    Salary Range
                  </td>
                  {selectedRoles.map((roleName) => {
                    const info = careerPaths[roleName];
                    const salary = parseSalary(info.salary_range);
                    return (
                      <td key={roleName} className="py-3.5 px-4">
                        <span className="text-emerald-700 font-bold font-mono text-sm block">
                          {info.salary_range}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          Midpoint: ${(salary.average / 1000).toFixed(0)}k/yr
                        </span>
                      </td>
                    );
                  })}
                </tr>

                {/* Growth Rate */}
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-700 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                    Growth Outlook
                  </td>
                  {selectedRoles.map((roleName) => {
                    const info = careerPaths[roleName];
                    return (
                      <td key={roleName} className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {info.growth_rate} Growth
                        </span>
                      </td>
                    );
                  })}
                </tr>

                {/* Education */}
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-700 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-sky-600" />
                    Education Barrier
                  </td>
                  {selectedRoles.map((roleName) => {
                    const info = careerPaths[roleName];
                    return (
                      <td key={roleName} className="py-3.5 px-4 text-slate-700 font-medium">
                        {info.education}
                      </td>
                    );
                  })}
                </tr>

                {/* Skills Summary */}
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-700 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-600" />
                    Required Skills Count
                  </td>
                  {selectedRoles.map((roleName) => {
                    const info = careerPaths[roleName];
                    return (
                      <td key={roleName} className="py-3.5 px-4 text-purple-800 font-bold">
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
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              Skill Requirement Matrix
            </h3>
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="py-2.5 px-4 font-bold">Skill</th>
                    {selectedRoles.map((roleName) => (
                      <th key={roleName} className="py-2.5 px-4 font-bold text-center">
                        {roleName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {comparedSkills.map((skill) => (
                    <tr key={skill} className="hover:bg-indigo-50/40 transition-colors">
                      <td className="py-2.5 px-4 font-semibold text-slate-800">{skill}</td>
                      {selectedRoles.map((roleName) => {
                        const hasSkill = careerPaths[roleName]?.required_skills.includes(skill);
                        return (
                          <td key={roleName} className="py-2.5 px-4 text-center">
                            {hasSkill ? (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </span>
                            ) : (
                              <span className="text-slate-300 font-bold">—</span>
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
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-colors"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
