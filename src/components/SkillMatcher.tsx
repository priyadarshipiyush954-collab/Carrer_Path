import React, { useState } from 'react';
import { CareerPath } from '../types/jobMarket';
import { getRoleSkillMatch, getSkillCategory } from '../data/initialData';
import {
  CheckCircle,
  AlertCircle,
  Sparkles,
  RotateCcw,
  Zap,
  TrendingUp,
  Award,
  Check,
} from 'lucide-react';

interface SkillMatcherProps {
  careerPaths: Record<string, CareerPath>;
  allRequiredSkills: string[];
}

export const SkillMatcher: React.FC<SkillMatcherProps> = ({
  careerPaths,
  allRequiredSkills,
}) => {
  const [userSkills, setUserSkills] = useState<string[]>([
    'Python',
    'SQL',
    'Communication',
  ]);

  const toggleSkill = (skill: string) => {
    setUserSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handlePreset = (presetName: string) => {
    switch (presetName) {
      case 'web':
        setUserSkills(['JavaScript', 'HTML/CSS', 'React', 'Node.js', 'Problem Solving']);
        break;
      case 'data':
        setUserSkills(['Python', 'Data Analysis', 'SQL', 'Critical Thinking']);
        break;
      case 'ai':
        setUserSkills(['Python', 'Machine Learning', 'Deep Learning', 'Artificial Intelligence']);
        break;
      case 'all':
        setUserSkills([...allRequiredSkills]);
        break;
      case 'clear':
        setUserSkills([]);
        break;
      default:
        break;
    }
  };

  // Group all skills by category
  const categories: Record<string, string[]> = {};
  allRequiredSkills.forEach((skill) => {
    const cat = getSkillCategory(skill);
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(skill);
  });

  return (
    <div className="space-y-8">
      {/* Intro banner */}
      <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/50 border border-indigo-800/40 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Real-Time Readiness Calculator
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Personal Tech Career & Skill Gap Analyzer
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl mt-1">
              Select the skills you already know from the master industry dataset. We'll compute your
              instant compatibility score and generate your targeted gap-closing roadmap for each tech career path.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => handlePreset('web')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer transition-colors"
            >
              Web Dev Preset
            </button>
            <button
              onClick={() => handlePreset('data')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer transition-colors"
            >
              Data Science Preset
            </button>
            <button
              onClick={() => handlePreset('ai')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer transition-colors"
            >
              AI Engineer Preset
            </button>
            <button
              onClick={() => handlePreset('clear')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/40 hover:text-rose-300 text-slate-400 border border-slate-700 cursor-pointer transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Skill Checklist (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Your Skills Profile</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300">
                {userSkills.length} of {allRequiredSkills.length} selected
              </span>
            </h3>
            <button
              onClick={() => handlePreset('all')}
              className="text-xs text-indigo-400 hover:underline cursor-pointer"
            >
              Select All
            </button>
          </div>

          <div className="space-y-5">
            {Object.entries(categories).map(([category, skills]) => (
              <div key={category} className="space-y-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  {category}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {skills.map((skill) => {
                    const isSelected = userSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`px-3 py-2 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600/20 border-indigo-500/80 text-white shadow-sm shadow-indigo-500/10'
                            : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                        }`}
                      >
                        <span className="truncate mr-1">{skill}</span>
                        <span
                          className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border ${
                            isSelected
                              ? 'bg-indigo-600 border-indigo-500 text-white'
                              : 'border-slate-700 bg-slate-900'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Career Path Match Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Career Compatibility Rankings</span>
            </h3>
            <span className="text-xs text-slate-400">
              Ranked by % required skills matched
            </span>
          </div>

          {Object.entries(careerPaths)
            .map(([roleName, pathDetails]) => {
              const match = getRoleSkillMatch(pathDetails.required_skills, userSkills);
              return {
                roleName,
                pathDetails,
                match,
              };
            })
            .sort((a, b) => b.match.percentage - a.match.percentage)
            .map(({ roleName, pathDetails, match }) => {
              const getScoreColor = (pct: number) => {
                if (pct === 100) return 'text-emerald-400 from-emerald-500 to-teal-400';
                if (pct >= 50) return 'text-indigo-400 from-indigo-500 to-cyan-400';
                if (pct > 0) return 'text-amber-400 from-amber-500 to-orange-400';
                return 'text-slate-500 from-slate-700 to-slate-800';
              };

              const getStatusBadge = (pct: number) => {
                if (pct === 100) {
                  return {
                    label: 'Ready to Apply / 100% Match',
                    class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
                  };
                }
                if (pct >= 75) {
                  return {
                    label: 'Near Ready (1 skill needed)',
                    class: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
                  };
                }
                if (pct >= 50) {
                  return {
                    label: 'Intermediate Match',
                    class: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
                  };
                }
                if (pct > 0) {
                  return {
                    label: 'Foundation Stage',
                    class: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
                  };
                }
                return {
                  label: 'No Overlap Yet',
                  class: 'bg-slate-800 text-slate-400 border-slate-700',
                };
              };

              const status = getStatusBadge(match.percentage);

              return (
                <div
                  key={roleName}
                  className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-bold text-white">{roleName}</h4>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${status.class}`}
                        >
                          {status.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Salary: <span className="text-emerald-400 font-mono font-medium">{pathDetails.salary_range}</span> • {pathDetails.growth_rate} Growth
                      </p>
                    </div>

                    {/* Big Match Score */}
                    <div className="text-right">
                      <div className="text-3xl font-black tracking-tight text-white flex items-center justify-end gap-1">
                        <span>{match.percentage}%</span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {match.matching.length} / {pathDetails.required_skills.length} skills met
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden mb-4">
                    <div
                      className={`h-full bg-gradient-to-r ${getScoreColor(match.percentage)} transition-all duration-500 rounded-full`}
                      style={{ width: `${match.percentage}%` }}
                    />
                  </div>

                  {/* Skills Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-800/80 text-xs">
                    {/* Matching skills */}
                    <div>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1.5 mb-2">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Skills you have ({match.matching.length})
                      </span>
                      {match.matching.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {match.matching.map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-500 italic">None of the required skills selected yet.</p>
                      )}
                    </div>

                    {/* Missing skills */}
                    <div>
                      <span className="text-amber-400 font-semibold flex items-center gap-1.5 mb-2">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Skills to acquire ({match.missing.length})
                      </span>
                      {match.missing.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {match.missing.map((skill) => (
                            <button
                              key={skill}
                              onClick={() => toggleSkill(skill)}
                              className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium hover:bg-amber-500/20 cursor-pointer transition-colors"
                              title="Click to add to your skills"
                            >
                              + {skill}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span className="text-emerald-400 font-medium flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          All prerequisites satisfied!
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
