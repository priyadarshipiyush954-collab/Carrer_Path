import React, { useState } from 'react';
import { parseSalary } from '../data/initialData';
import {
  TrendingUp,
  DollarSign,
  GraduationCap,
  Layers,
  Search,
  SlidersHorizontal,
  ArrowRight,
  Sparkles,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const CareerPathsView = ({
  careerPaths,
  selectedForCompare,
  toggleCompare,
  openCompareModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [growthFilter, setGrowthFilter] = useState('ALL');
  const [expandedRole, setExpandedRole] = useState(null);

  const roleEntries = Object.entries(careerPaths || {});

  const filteredRoles = roleEntries.filter(([roleName, details]) => {
    const matchesSearch =
      roleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      details.required_skills.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      details.education.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGrowth =
      growthFilter === 'ALL' || details.growth_rate === growthFilter;

    return matchesSearch && matchesGrowth;
  });

  const getGrowthBadge = (growth) => {
    switch (growth) {
      case 'Very High':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-xs';
      case 'High':
        return 'bg-sky-50 text-sky-800 border-sky-200 shadow-xs';
      case 'Medium':
        return 'bg-amber-50 text-amber-800 border-amber-200 shadow-xs';
      default:
        return 'bg-purple-50 text-purple-800 border-purple-200 shadow-xs';
    }
  };

  const roleOverviews = {
    'Data Scientist': {
      description:
        'Analyzes massive datasets to extract actionable insights, build predictive models, and optimize strategic decisions across enterprise domains.',
      typicalDeliverables: [
        'Predictive machine learning pipelines',
        'Statistical hypothesis testing & dashboards',
        'Complex SQL queries & data transformation flows',
      ],
      careerTip:
        'Pairs best with strong mathematical reasoning and business domain familiarity.',
      accentColor: 'from-blue-500 to-indigo-600',
    },
    'Web Developer': {
      description:
        'Designs, codes, and maintains responsive, high-performance web applications and services from client user interfaces down to server endpoints.',
      typicalDeliverables: [
        'Single-page applications & interactive interfaces',
        'RESTful & GraphQL backend APIs with Node.js',
        'State management & accessible component architecture',
      ],
      careerTip:
        'Build a public portfolio with deployable live demos on platforms like GitHub.',
      accentColor: 'from-pink-500 to-rose-600',
    },
    'AI Engineer': {
      description:
        'Specializes in developing, deploying, and optimizing modern artificial intelligence and deep neural network models into real-time production systems.',
      typicalDeliverables: [
        'Deep learning architecture design & model tuning',
        'LLM & generative model system integration',
        'Inference performance optimization & GPU pipeline scaling',
      ],
      careerTip:
        'Requires rigorous understanding of PyTorch/TensorFlow, gradient descent, and transformer models.',
      accentColor: 'from-purple-500 to-violet-600',
    },
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-indigo-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
          <input
            type="text"
            placeholder="Search roles, required skills (e.g. Python, React), or education..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50/80 border border-slate-200/90 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium whitespace-nowrap">
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-500" />
            <span>Growth Outlook:</span>
          </div>
          <select
            value={growthFilter}
            onChange={(e) => setGrowthFilter(e.target.value)}
            className="bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white"
          >
            <option value="ALL">All Growth Rates</option>
            <option value="Very High">Very High Growth</option>
            <option value="High">High Growth</option>
            <option value="Medium">Medium Growth</option>
          </select>

          {selectedForCompare.length > 0 && (
            <button
              onClick={openCompareModal}
              className="px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-500/25 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <span>Compare ({selectedForCompare.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {filteredRoles.map(([roleName, details]) => {
          const salaryInfo = parseSalary(details.salary_range);
          const isComparing = selectedForCompare.includes(roleName);
          const isExpanded = expandedRole === roleName;
          const overview = roleOverviews[roleName] || {
            description: `Key career path requiring specialized knowledge in ${details.required_skills.join(', ')}.`,
            typicalDeliverables: ['Production deliverables', 'Collaborative engineering tasks'],
            careerTip: 'Maintain continuous hands-on project experience.',
            accentColor: 'from-indigo-500 to-purple-600',
          };

          const minPercent = Math.min(100, Math.round((salaryInfo.min / 180000) * 100));
          const maxPercent = Math.min(100, Math.round((salaryInfo.max / 180000) * 100));

          return (
            <div
              key={roleName}
              className={`bg-white/95 backdrop-blur-sm border rounded-2xl p-6 transition-all duration-200 flex flex-col justify-between shadow-sm hover:shadow-lg ${
                isComparing
                  ? 'border-indigo-400 ring-2 ring-indigo-200 shadow-indigo-100'
                  : 'border-slate-200/80 hover:border-indigo-200'
              }`}
            >
              <div>
                {/* Header Badge & Title */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                      <span>{roleName}</span>
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {overview.description}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 text-xs font-semibold rounded-full border whitespace-nowrap flex items-center gap-1 ${getGrowthBadge(
                      details.growth_rate
                    )}`}
                  >
                    <TrendingUp className="w-3 h-3" />
                    {details.growth_rate} Growth
                  </span>
                </div>

                {/* Salary Visualizer Box */}
                <div className="bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-sky-50/50 rounded-xl p-3.5 border border-emerald-100/90 mb-5">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-600 flex items-center gap-1 font-medium">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                      Annual Compensation
                    </span>
                    <span className="text-emerald-700 font-bold font-mono">
                      {details.salary_range}
                    </span>
                  </div>
                  {/* Visual Bar */}
                  <div className="h-2.5 w-full bg-slate-200/70 rounded-full relative overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-500 rounded-full shadow-xs"
                      style={{
                        left: `${minPercent}%`,
                        width: `${Math.max(8, maxPercent - minPercent)}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1.5 font-mono">
                    <span>$50k</span>
                    <span className="font-semibold text-emerald-800">Midpoint: ~${(salaryInfo.average / 1000).toFixed(0)}k</span>
                    <span>$180k+</span>
                  </div>
                </div>

                {/* Required Skills */}
                <div className="mb-5">
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                    <span className="flex items-center gap-1 font-semibold text-indigo-900">
                      <Layers className="w-3.5 h-3.5 text-indigo-600" />
                      Required Core Skills ({details.required_skills.length})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {details.required_skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50/80 text-indigo-700 border border-indigo-100 hover:bg-indigo-100/80 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div className="bg-sky-50/70 rounded-xl p-3 border border-sky-100 mb-5 text-xs">
                  <div className="flex items-start gap-2 text-sky-950">
                    <GraduationCap className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] text-sky-700 block font-bold">
                        Education & Qualifications
                      </span>
                      <span className="text-slate-700 font-medium">{details.education}</span>
                    </div>
                  </div>
                </div>

                {/* Collapsible Details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-100 text-xs space-y-3">
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1.5 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        Core Deliverables
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-slate-600">
                        {overview.typicalDeliverables.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-3 rounded-xl bg-purple-50 border border-purple-100 text-purple-900 text-[11px]">
                      <strong className="text-purple-950">Pro Tip:</strong> {overview.careerTip}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 mt-4">
                <button
                  onClick={() => setExpandedRole(isExpanded ? null : roleName)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {isExpanded ? (
                    <>
                      <span>Less details</span>
                      <ChevronUp className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <span>More details</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleCompare(roleName)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1 cursor-pointer ${
                      isComparing
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-300 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {isComparing ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Comparing</span>
                      </>
                    ) : (
                      <span>+ Compare</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRoles.length === 0 && (
        <div className="text-center py-12 bg-white/80 rounded-2xl border border-indigo-100 shadow-sm">
          <p className="text-slate-500 text-sm">
            No career paths match your search or filter criteria.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setGrowthFilter('ALL');
            }}
            className="mt-3 text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
};
