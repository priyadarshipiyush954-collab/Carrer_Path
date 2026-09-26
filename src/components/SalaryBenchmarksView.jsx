import React from 'react';
import { parseSalary } from '../data/initialData';
import { DollarSign, TrendingUp, GraduationCap, BarChart3 } from 'lucide-react';

export const SalaryBenchmarksView = ({
  careerPaths,
}) => {
  const roleEntries = Object.entries(careerPaths || {});
  const maxBenchmark = 180000;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-violet-100/90 via-indigo-50/90 to-sky-100/90 border border-indigo-200/80 rounded-3xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-600" />
          <span>Compensation & Growth Trajectory Benchmarks</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          Comparative earnings potential and trajectory analysis derived from verified tech
          job market data across entry levels through senior compensation brackets.
        </p>
      </div>

      {/* Salary Comparison Bars */}
      <div className="bg-white/95 backdrop-blur-sm border border-slate-200/90 rounded-2xl p-6 space-y-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-600" />
          <span>Annual Base Salary Ranges (USD)</span>
        </h3>

        <div className="space-y-6">
          {roleEntries.map(([roleName, pathDetails]) => {
            const { min, max, average } = parseSalary(pathDetails.salary_range);
            const minPercent = (min / maxBenchmark) * 100;
            const maxPercent = (max / maxBenchmark) * 100;
            const widthPercent = maxPercent - minPercent;

            return (
              <div key={roleName} className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{roleName}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {pathDetails.growth_rate} Growth
                    </span>
                  </div>
                  <div className="flex items-center gap-3 font-mono font-medium">
                    <span className="text-slate-500">Min: ${min.toLocaleString()}</span>
                    <span className="text-indigo-600 font-bold">Avg: ${average.toLocaleString()}</span>
                    <span className="text-emerald-700 font-bold">Max: ${max.toLocaleString()}</span>
                  </div>
                </div>

                {/* Progress bar scale */}
                <div className="h-6 w-full bg-slate-100 rounded-xl relative overflow-hidden border border-slate-200 p-0.5 shadow-inner">
                  <div
                    className="h-full rounded-lg bg-gradient-to-r from-sky-400 via-indigo-500 to-emerald-400 flex items-center justify-between px-2.5 text-[10px] text-white font-mono font-bold shadow-xs"
                    style={{
                      marginLeft: `${minPercent}%`,
                      width: `${Math.max(12, widthPercent)}%`,
                    }}
                  >
                    <span>${(min / 1000).toFixed(0)}k</span>
                    <span>${(max / 1000).toFixed(0)}k</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-100 font-mono font-medium">
          <span>$0k</span>
          <span>$50k</span>
          <span>$100k</span>
          <span>$150k</span>
          <span>$180k+</span>
        </div>
      </div>

      {/* Grid of Dimensions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Growth Rate Matrix */}
        <div className="bg-white/95 backdrop-blur-sm border border-slate-200/90 rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Demand & Expansion Velocity</span>
          </h3>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-emerald-800 text-sm">Very High Growth</span>
                <span className="text-xs font-mono font-bold text-emerald-700">AI Engineer</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Exponential market demand fueled by generative AI proliferation, autonomous systems,
                and large language model deployment in enterprise infrastructure.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sky-800 text-sm">High Growth</span>
                <span className="text-xs font-mono font-bold text-sky-700">Data Scientist</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Sustained strong demand across healthcare, fintech, e-commerce, and logistics for
                evidence-based predictive forecasting and machine learning modeling.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-amber-800 text-sm">Medium Growth</span>
                <span className="text-xs font-mono font-bold text-amber-700">Web Developer</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Steady and evergreen baseline demand. Massive job volume, with high premium on full-stack
                proficiency (React + Node.js) and modern web architecture.
              </p>
            </div>
          </div>
        </div>

        {/* Education & Accessibility */}
        <div className="bg-white/95 backdrop-blur-sm border border-slate-200/90 rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-sky-600" />
            <span>Educational Requirements & Barrier to Entry</span>
          </h3>

          <div className="space-y-3">
            {roleEntries.map(([roleName, pathDetails]) => (
              <div
                key={roleName}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900 text-xs">{roleName}</span>
                  <span className="text-[11px] text-slate-500 font-mono font-semibold">
                    {pathDetails.required_skills.length} core skills
                  </span>
                </div>
                <p className="text-xs text-slate-700 font-medium">
                  {pathDetails.education}
                </p>
              </div>
            ))}

            <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs leading-relaxed shadow-xs">
              <strong className="block mb-1 text-purple-950">Accessibility Insight:</strong>
              Web Development offers the most flexible entry path with strong recognition of self-taught portfolio work,
              while AI Engineering and Data Science carry higher academic prerequisites in CS or Statistics.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
