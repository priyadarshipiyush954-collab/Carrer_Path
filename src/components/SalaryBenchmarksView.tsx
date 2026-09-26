import React from 'react';
import { CareerPath } from '../types/jobMarket';
import { parseSalary } from '../data/initialData';
import { DollarSign, TrendingUp, GraduationCap, BarChart3, Award } from 'lucide-react';

interface SalaryBenchmarksViewProps {
  careerPaths: Record<string, CareerPath>;
}

export const SalaryBenchmarksView: React.FC<SalaryBenchmarksViewProps> = ({
  careerPaths,
}) => {
  const roleEntries = Object.entries(careerPaths);

  // Maximum benchmark ceiling for bar scaling
  const maxBenchmark = 180000;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-400" />
          <span>Compensation & Growth Trajectory Benchmarks</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
          Comparative earnings potential and trajectory analysis derived from the verified Hackathon 3.0
          job market data across entry levels through senior compensation brackets.
        </p>
      </div>

      {/* Salary Comparison Bars */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-400" />
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
                    <span className="font-bold text-sm text-white">{roleName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      {pathDetails.growth_rate} Growth
                    </span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-slate-400">Min: ${min.toLocaleString()}</span>
                    <span className="text-indigo-400 font-semibold">Avg: ${average.toLocaleString()}</span>
                    <span className="text-emerald-400 font-bold">Max: ${max.toLocaleString()}</span>
                  </div>
                </div>

                {/* Progress bar scale */}
                <div className="h-6 w-full bg-slate-950 rounded-xl relative overflow-hidden border border-slate-800/80 p-0.5">
                  <div
                    className="h-full rounded-lg bg-gradient-to-r from-cyan-600 via-indigo-600 to-emerald-500 flex items-center justify-between px-2 text-[10px] text-white font-mono shadow-inner"
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
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-800/60 font-mono">
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
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Demand & Expansion Velocity</span>
          </h3>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-emerald-400 text-sm">Very High Growth</span>
                <span className="text-xs font-mono text-emerald-300">AI Engineer</span>
              </div>
              <p className="text-xs text-slate-300">
                Exponential market demand fueled by generative AI proliferation, autonomous systems,
                and large language model deployment in enterprise infrastructure.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-indigo-400 text-sm">High Growth</span>
                <span className="text-xs font-mono text-indigo-300">Data Scientist</span>
              </div>
              <p className="text-xs text-slate-300">
                Sustained strong demand across healthcare, fintech, e-commerce, and logistics for
                evidence-based predictive forecasting and machine learning modeling.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-amber-400 text-sm">Medium Growth</span>
                <span className="text-xs font-mono text-amber-300">Web Developer</span>
              </div>
              <p className="text-xs text-slate-300">
                Steady and evergreen baseline demand. Massive job volume, with high premium on full-stack
                proficiency (React + Node.js) and modern web architecture.
              </p>
            </div>
          </div>
        </div>

        {/* Education & Accessibility */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span>Educational Requirements & Barrier to Entry</span>
          </h3>

          <div className="space-y-3">
            {roleEntries.map(([roleName, pathDetails]) => (
              <div
                key={roleName}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-white text-xs">{roleName}</span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {pathDetails.required_skills.length} core skills
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  {pathDetails.education}
                </p>
              </div>
            ))}

            <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-900/40 text-indigo-300 text-xs">
              <strong className="block mb-1">Accessibility Insight:</strong>
              Web Development offers the most flexible entry path with strong recognition of self-taught portfolio work,
              while AI Engineering and Data Science carry higher academic prerequisites in CS or Statistics.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
