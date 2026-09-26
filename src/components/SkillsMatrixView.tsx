import React, { useState } from 'react';
import { CareerPath } from '../types/jobMarket';
import { getSkillCategory } from '../data/initialData';
import { Search, Layers, Briefcase, Filter, Sparkles } from 'lucide-react';

interface SkillsMatrixViewProps {
  allRequiredSkills: string[];
  careerPaths: Record<string, CareerPath>;
}

export const SkillsMatrixView: React.FC<SkillsMatrixViewProps> = ({
  allRequiredSkills,
  careerPaths,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'Languages & Web', 'AI & Data Science', 'Cloud & Systems', 'Soft Skills'];

  const categoryBadgeStyles: Record<string, { bg: string; text: string; border: string }> = {
    'Languages & Web': { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
    'AI & Data Science': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    'Cloud & Systems': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    'Soft Skills': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  };

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

  const skillsInRolesCount = Object.values(skillUsageMap).filter((roles) => roles.length > 0).length;
  const sharedSkills = Object.entries(skillUsageMap).filter(([_, roles]) => roles.length > 1);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/60 border border-indigo-100 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold text-indigo-700 block">Total Cataloged Skills</span>
          <span className="text-3xl font-black text-slate-900 mt-1 block">
            {allRequiredSkills.length} Skills
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block font-medium">
            Master taxonomy from job_market_data.json
          </span>
        </div>

        <div className="bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/60 border border-emerald-100 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold text-emerald-700 block">Mapped Role Prerequisites</span>
          <span className="text-3xl font-black text-emerald-800 mt-1 block">
            {skillsInRolesCount} Skills
          </span>
          <span className="text-[11px] text-emerald-600 mt-1 block font-medium">
            100% aligned with active career paths
          </span>
        </div>

        <div className="bg-gradient-to-br from-purple-50/80 via-white to-pink-50/60 border border-purple-100 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold text-purple-700 block">High-Leverage Cross-Disciplinary</span>
          <span className="text-3xl font-black text-purple-800 mt-1 block">
            {sharedSkills.length} Core Skills
          </span>
          <span className="text-[11px] text-purple-600 mt-1 block font-medium">
            Required across 2+ distinct roles (Python, ML)
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-indigo-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
          <input
            type="text"
            placeholder="Search skills (e.g., Python, React, Cloud, SQL)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200'
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
          const badgeStyle = categoryBadgeStyles[category] || { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };

          return (
            <div
              key={skill}
              className={`p-4 rounded-2xl border bg-white/95 backdrop-blur-sm transition-all shadow-xs hover:shadow-md ${
                isCrossRole
                  ? 'border-indigo-300 ring-1 ring-indigo-100'
                  : 'border-slate-200/90 hover:border-indigo-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                  {skill}
                  {isCrossRole && (
                    <span className="p-0.5 rounded-full bg-indigo-50 text-indigo-600" title="Cross-disciplinary leverage skill">
                      <Sparkles className="w-3.5 h-3.5" />
                    </span>
                  )}
                </h4>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}>
                  {category}
                </span>
              </div>

              {/* Roles using this skill */}
              <div className="mt-3">
                <span className="text-[11px] text-slate-500 font-medium block mb-1.5">
                  {mappedRoles.length > 0 ? (
                    <span className="flex items-center gap-1 text-indigo-900 font-semibold">
                      <Briefcase className="w-3 h-3 text-indigo-500" />
                      Required in {mappedRoles.length} {mappedRoles.length === 1 ? 'Career Track' : 'Career Tracks'}:
                    </span>
                  ) : (
                    <span className="text-slate-400">
                      Broad industry foundation / domain skill
                    </span>
                  )}
                </span>

                {mappedRoles.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {mappedRoles.map((role) => (
                      <span
                        key={role}
                        className={`text-xs px-2.5 py-1 rounded-lg font-semibold border ${
                          isCrossRole
                            ? 'bg-purple-50 text-purple-800 border-purple-200'
                            : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                        }`}
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-slate-500 italic">
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
