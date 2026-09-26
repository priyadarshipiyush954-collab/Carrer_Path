import React, { useState } from 'react';
import { CareerPath } from '../types/jobMarket';
import { parseSalary, getSkillCategory } from '../data/initialData';
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

interface CareerPathsViewProps {
  careerPaths: Record<string, CareerPath>;
  allRequiredSkills: string[];
  onSelectRoleForMatcher?: (roleName: string) => void;
  selectedForCompare: string[];
  toggleCompare: (roleName: string) => void;
  openCompareModal: () => void;
}

export const CareerPathsView: React.FC<CareerPathsViewProps> = ({
  careerPaths,
  selectedForCompare,
  toggleCompare,
  openCompareModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [growthFilter, setGrowthFilter] = useState<string>('ALL');
  const [expandedRole, setExpandedRole] = useState<string | null>(null);

  const roleEntries = Object.entries(careerPaths);

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

  const getGrowthBadge = (growth: string) => {
    switch (growth) {
      case 'Very High':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'High':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const roleOverviews: Record<
    string,
    { description: string; typicalDeliverables: string[]; careerTip: string }
  > = {
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
    },
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search roles, required skills (e.g. Python, React), or education..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 whitespace-nowrap">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>Growth:</span>
          </div>
          <select
            value={growthFilter}
            onChange={(e) => setGrowthFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Growth Rates</option>
            <option value="Very High">Very High Growth</option>
            <option value="High">High Growth</option>
            <option value="Medium">Medium Growth</option>
          </select>

          {selectedForCompare.length > 0 && (
            <button
              onClick={openCompareModal}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-md transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
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
          };

          // Scale salary bar relative to max 170k
          const minPercent = Math.min(100, Math.round((salaryInfo.min / 180000) * 100));
          const maxPercent = Math.min(100, Math.round((salaryInfo.max / 180000) * 100));

          return (
            <div
              key={roleName}
              className={`bg-slate-900/70 border rounded-2xl p-6 transition-all duration-200 flex flex-col justify-between ${
                isComparing
                  ? 'border-indigo-500/80 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/40'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header Badge & Title */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {roleName}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
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

                {/* Salary Visualizer */}
                <div className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-800/80 mb-5">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-400 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      Annual Compensation
                    </span>
                    <span className="text-emerald-400 font-semibold font-mono">
                      {details.salary_range}
                    </span>
                  </div>
                  {/* Visual Bar */}
                  <div className="h-2.5 w-full bg-slate-800 rounded-full relative overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full"
                      style={{
                        left: `${minPercent}%`,
                        width: `${Math.max(8, maxPercent - minPercent)}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                    <span>$50k</span>
                    <span>Midpoint: ~${(salaryInfo.average / 1000).toFixed(0)}k</span>
                    <span>$180k+</span>
                  </div>
                </div>

                {/* Required Skills */}
                <div className="mb-5">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="flex items-center gap-1 font-medium">
                      <Layers className="w-3.5 h-3.5 text-indigo-400" />
                      Required Core Skills ({details.required_skills.length})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {details.required_skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800/90 text-slate-200 border border-slate-700/60"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div className="bg-slate-950/40 rounded-xl p-3 border border-slate-800/60 mb-5 text-xs">
                  <div className="flex items-start gap-2 text-slate-300">
                    <GraduationCap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] text-slate-400 block font-medium">
                        Education & Qualifications
                      </span>
                      <span>{details.education}</span>
                    </div>
                  </div>
                </div>

                {/* Collapsible Details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-800 text-xs space-y-3">
                    <div>
                      <h4 className="font-semibold text-slate-200 mb-1.5 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        Core Deliverables
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-slate-400">
                        {overview.typicalDeliverables.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-900/40 text-indigo-300 text-[11px]">
                      <strong>Pro Tip:</strong> {overview.careerTip}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-slate-800/70 flex items-center justify-between gap-2 mt-4">
                <button
                  onClick={() => setExpandedRole(isExpanded ? null : roleName)}
                  className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
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
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1 cursor-pointer ${
                      isComparing
                        ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                  >
                    {isComparing ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-indigo-400" />
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
        <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800">
          <p className="text-slate-400 text-sm">
            No career paths match your search or filter criteria.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setGrowthFilter('ALL');
            }}
            className="mt-3 text-xs text-indigo-400 hover:underline cursor-pointer"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
};
