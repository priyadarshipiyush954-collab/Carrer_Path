import React, { useState } from 'react';
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

export const SkillMatcher = ({
  careerPaths,
  allRequiredSkills,
}) => {
  const [userSkills, setUserSkills] = useState([
    'Python',
    'SQL',
    'Communication',
  ]);

  const toggleSkill = (skill) => {
    setUserSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handlePreset = (presetName) => {
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

  // Group all skills by category with customized colors
  const categories = {
    'Languages & Web': {
      skills: [],
      bgBadge: 'bg-sky-50',
      textBadge: 'text-sky-700',
      borderBadge: 'border-sky-200',
    },
    'AI & Data Science': {
      skills: [],
      bgBadge: 'bg-purple-50',
      textBadge: 'text-purple-700',
      borderBadge: 'border-purple-200',
    },
    'Cloud & Systems': {
      skills: [],
      bgBadge: 'bg-amber-50',
      textBadge: 'text-amber-700',
      borderBadge: 'border-amber-200',
    },
    'Soft Skills': {
      skills: [],
      bgBadge: 'bg-emerald-50',
      textBadge: 'text-emerald-700',
      borderBadge: 'border-emerald-200',
    },
  };

  allRequiredSkills.forEach((skill) => {
    const cat = getSkillCategory(skill);
    if (!categories[cat]) {
      categories[cat] = {
        skills: [],
        bgBadge: 'bg-slate-50',
        textBadge: 'text-slate-700',
        borderBadge: 'border-slate-200',
      };
    }
    categories[cat].skills.push(skill);
  });

  return (
    <div className="space-y-8">
      {/* Intro banner */}
      <div className="bg-gradient-to-r from-violet-100/90 via-indigo-50/90 to-sky-100/90 border border-indigo-200/80 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white text-indigo-700 border border-indigo-200/80 mb-2 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Real-Time Readiness Calculator
            </span>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Personal Tech Career & Skill Gap Analyzer
            </h2>
            <p className="text-xs md:text-sm text-slate-600 max-w-2xl mt-1 leading-relaxed">
              Select the skills you already possess from the verified industry taxonomy. We'll compute your
              instant compatibility score and display targeted gap-closing recommendations.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => handlePreset('web')}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-sky-50 text-sky-800 font-semibold border border-sky-200 cursor-pointer transition-all shadow-xs"
            >
              Web Dev Preset
            </button>
            <button
              onClick={() => handlePreset('data')}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-indigo-50 text-indigo-800 font-semibold border border-indigo-200 cursor-pointer transition-all shadow-xs"
            >
              Data Science Preset
            </button>
            <button
              onClick={() => handlePreset('ai')}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-purple-50 text-purple-800 font-semibold border border-purple-200 cursor-pointer transition-all shadow-xs"
            >
              AI Engineer Preset
            </button>
            <button
              onClick={() => handlePreset('clear')}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 hover:text-rose-700 text-slate-600 font-semibold border border-slate-200 cursor-pointer transition-all shadow-xs flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Skill Checklist (5 cols) */}
        <div className="lg:col-span-5 bg-white/95 backdrop-blur-sm border border-slate-200/90 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Your Skills Profile</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {userSkills.length} of {allRequiredSkills.length} selected
              </span>
            </h3>
            <button
              onClick={() => handlePreset('all')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
            >
              Select All
            </button>
          </div>

          <div className="space-y-5">
            {Object.entries(categories).map(([category, meta]) => (
              <div key={category} className="space-y-2">
                <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md inline-block ${meta.bgBadge} ${meta.textBadge} border ${meta.borderBadge}`}>
                  {category}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {meta.skills.map((skill) => {
                    const isSelected = userSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`px-3 py-2 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 border-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                            : 'bg-slate-50/80 hover:bg-slate-100/80 border-slate-200/90 text-slate-700'
                        }`}
                      >
                        <span className="truncate mr-1 font-medium">{skill}</span>
                        <span
                          className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
                            isSelected
                              ? 'bg-white text-indigo-600 border-white'
                              : 'border-slate-300 bg-white'
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
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Career Compatibility Rankings</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">
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
              const getScoreGradient = (pct) => {
                if (pct === 100) return 'from-emerald-400 via-teal-400 to-green-500';
                if (pct >= 50) return 'from-indigo-500 via-purple-500 to-pink-500';
                if (pct > 0) return 'from-amber-400 via-orange-400 to-amber-500';
                return 'from-slate-300 to-slate-400';
              };

              const getStatusBadge = (pct) => {
                if (pct === 100) {
                  return {
                    label: 'Ready to Apply / 100% Match',
                    class: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                  };
                }
                if (pct >= 75) {
                  return {
                    label: 'Near Ready (1 skill needed)',
                    class: 'bg-indigo-50 text-indigo-800 border-indigo-200',
                  };
                }
                if (pct >= 50) {
                  return {
                    label: 'Intermediate Match',
                    class: 'bg-sky-50 text-sky-800 border-sky-200',
                  };
                }
                if (pct > 0) {
                  return {
                    label: 'Foundation Stage',
                    class: 'bg-amber-50 text-amber-800 border-amber-200',
                  };
                }
                return {
                  label: 'No Overlap Yet',
                  class: 'bg-slate-100 text-slate-600 border-slate-200',
                };
              };

              const status = getStatusBadge(match.percentage);

              return (
                <div
                  key={roleName}
                  className="bg-white/95 backdrop-blur-sm border border-slate-200/90 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-md transition-all shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-bold text-slate-900">{roleName}</h4>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full border font-bold ${status.class}`}
                        >
                          {status.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Salary: <span className="text-emerald-700 font-mono font-bold">{pathDetails.salary_range}</span> • {pathDetails.growth_rate} Growth
                      </p>
                    </div>

                    {/* Big Match Score */}
                    <div className="text-right">
                      <div className="text-3xl font-black tracking-tight text-slate-900 flex items-center justify-end gap-1">
                        <span>{match.percentage}%</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {match.matching.length} / {pathDetails.required_skills.length} skills met
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden mb-4 border border-slate-200/60">
                    <div
                      className={`h-full bg-gradient-to-r ${getScoreGradient(match.percentage)} transition-all duration-500 rounded-full shadow-xs`}
                      style={{ width: `${match.percentage}%` }}
                    />
                  </div>

                  {/* Skills Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs">
                    {/* Matching skills */}
                    <div>
                      <span className="text-emerald-700 font-bold flex items-center gap-1.5 mb-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        Skills you have ({match.matching.length})
                      </span>
                      {match.matching.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {match.matching.map((skill) => (
                            <span
                              key={skill}
                              className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-400 italic">None of the required skills selected yet.</p>
                      )}
                    </div>

                    {/* Missing skills */}
                    <div>
                      <span className="text-amber-700 font-bold flex items-center gap-1.5 mb-2">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        Skills to acquire ({match.missing.length})
                      </span>
                      {match.missing.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {match.missing.map((skill) => (
                            <button
                              key={skill}
                              onClick={() => toggleSkill(skill)}
                              className="px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-semibold hover:bg-amber-100 cursor-pointer transition-colors shadow-xs"
                              title="Click to add to your skills"
                            >
                              + {skill}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
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
