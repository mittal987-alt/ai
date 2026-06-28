import React from "react";
import { useFinance } from "../context/FinanceContext";

const Planner: React.FC = () => {
  const { budgetPlan, handleApplyBudgetPlan, applyingPlan } = useFinance();

  if (!budgetPlan) {
    return (
      <div className="text-center py-20 text-slate-400">
        <p className="text-4xl mb-3">📋</p>
        <p className="font-bold text-slate-600 dark:text-slate-400">No plan data yet</p>
        <p className="text-sm mt-1">Add transactions and budgets to generate your personalized monthly plan.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">📋 Smart Budget Planner</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Based on {budgetPlan.last_month} actuals • Projected savings:{" "}
            <span className={`font-bold ${budgetPlan.projected_savings >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              ₹{budgetPlan.projected_savings?.toLocaleString("en-IN")}
            </span>
          </p>
        </div>
        <button
          onClick={handleApplyBudgetPlan}
          disabled={applyingPlan}
          className="bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-bold py-2.5 px-5 rounded-xl shadow-md shadow-violet-200 dark:shadow-none transition-all cursor-pointer flex items-center gap-2 text-sm border-none"
        >
          {applyingPlan ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : "✅"}
          {applyingPlan ? "Applying..." : "Apply Plan"}
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
                <th className="text-left px-5 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Category</th>
                <th className="text-right px-5 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Last Month Actual</th>
                <th className="text-right px-5 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Current Budget</th>
                <th className="text-right px-5 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Suggested Budget</th>
                <th className="text-left px-5 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Advice</th>
              </tr>
            </thead>
            <tbody>
              {budgetPlan.plan?.map((item: any, i: number) => (
                <tr key={i} className="border-b border-slate-50 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-4 font-bold text-slate-800 dark:text-slate-200">{item.category}</td>
                  <td className="px-5 py-4 text-right text-slate-600 dark:text-slate-400">₹{item.last_month_actual?.toLocaleString("en-IN")}</td>
                  <td className="px-5 py-4 text-right text-slate-600 dark:text-slate-400">
                    {item.current_budget > 0 ? `₹${item.current_budget?.toLocaleString("en-IN")}` : "—"}
                  </td>
                  <td className="px-5 py-4 text-right font-bold text-violet-600 dark:text-violet-400">₹{item.suggested_budget?.toLocaleString("en-IN")}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        item.status === "overspent"
                          ? "bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400"
                          : item.status === "unbudgeted"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                      }`}
                    >
                      {item.advice}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Planner;
