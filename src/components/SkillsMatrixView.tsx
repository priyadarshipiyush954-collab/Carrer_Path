import React, { useState } from 'react';
import { CareerPath } from '../types/jobMarket';
import { getSkillCategory } from '../data/initialData';
import { Search, Layers, Briefcase, Filter, ArrowUpRight } from 'lucide-react';

interface SkillsMatrixViewProps {
  allRequiredSkills: string[];
  careerPaths: Record<string, CareerPath>;
  onSelectRoleTab?: (roleName: string) => void;
}

export const SkillsMatrixView: React.FC<SkillsMatrixViewProps> = ({
  allRequiredSkills,
  careerPaths,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'Languages & Web', 'AI & Data Science', 'Cloud & Systems', 'Soft Skills'];

  // Map each skill to the career paths that require it
  const skillUsageMap: Record<string, string[]> = {};
  allRequiredSkills.forEach((skill) => {
    skillUsageMap[skill] = [];
    Object.entries(careerPaths).forEach(([roleName, pathDetails]) => {
      if (pathDetails.required_skills.includes(skill)) {
        skillUsageMap[skill].push(roleName);
      }
    });
  });

  const filteredSkills = allRequiredSkills.filter((skill) => {
    const matchesSearch = skill.toLowerCase().includes(searchQuery.toLowerCase());
    const cat = getSkillCategory(skill);
    const matchesCategory = selectedCategory === 'ALL' || cat === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate statistics
  const skillsInRolesCount = Object.values(skillUsageMap).filter((roles) => roles.length > 0).length;
  const sharedSkills = Object.entries(skillUsageMap).filter(([_, roles]) => roles.length > 1);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block">Total Cataloged Skills</span>
          <span className="text-2xl font-bold text-white mt-1 block">
            {allRequiredSkills.length} Skills
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Master list from job_market_data.json
          </span>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block">Mapped Role Prerequisites</span>
          <span className="text-2xl font-bold text-emerald-400 mt-1 block">
            {skillsInRolesCount} Skills
          </span>
          <span className="text-[11px] text-emerald-500/80 mt-1 block">
            100% aligned with active career paths
          </span>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block">High-Leverage Cross-Disciplinary</span>
          <span className="text-2xl font-bold text-indigo-400 mt-1 block">
            {sharedSkills.length} Core Skills
          </span>
          <span className="text-[11px] text-indigo-300/80 mt-1 block">
            Required across 2+ distinct roles (Python, ML)
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search skills (e.g., Python, React, Cloud, SQL)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => {
          const category = getSkillCategory(skill);
          const mappedRoles = skillUsageMap[skill] || [];
          const isCrossRole = mappedRoles.length > 1;

          return (
            <div
              key={skill}
              className={`p-4 rounded-xl border bg-slate-900/70 transition-all ${
                isCrossRole
                  ? 'border-indigo-500/40 shadow-sm shadow-indigo-500/5'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                  {skill}
                </h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  {category}
                </span>
              </div>

              {/* Roles using this skill */}
              <div className="mt-3">
                <span className="text-[11px] text-slate-400 block mb-1.5">
                  {mappedRoles.length > 0 ? (
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3 text-indigo-400" />
                      Required in {mappedRoles.length} {mappedRoles.length === 1 ? 'Career' : 'Careers'}:
                    </span>
                  ) : (
                    <span className="text-slate-500">
                      Broad industry foundation / domain skill
                    </span>
                  )}
                </span>

                {mappedRoles.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {mappedRoles.map((role) => (
                      <span
                        key={role}
                        className={`text-xs px-2.5 py-1 rounded-md font-medium border ${
                          isCrossRole
                            ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                            : 'bg-slate-800 text-slate-200 border-slate-700'
                        }`}
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic">
                    Universal technical & collaborative competency
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
