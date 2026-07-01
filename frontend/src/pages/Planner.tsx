import React from "react";
import { useFinance } from "../context/FinanceContext";

const Planner: React.FC = () => {
  const { budgetPlan, handleApplyBudgetPlan, applyingPlan } = useFinance();

  if (!budgetPlan) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-stone-900 rounded-xl border border-dashed border-stone-200 dark:border-stone-800">
        <p className="font-serif font-bold text-stone-700 dark:text-stone-300">No plan data yet</p>
        <p className="text-sm text-stone-450 mt-1">Add transactions and budgets to generate your personalized monthly plan.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-850 dark:text-stone-100">Smart budget planner</h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Based on {budgetPlan.last_month} actuals • Projected savings:{" "}
            <span className={`font-mono font-bold ${budgetPlan.projected_savings >= 0 ? "text-teal-700 dark:text-teal-400" : "text-coral-600 dark:text-coral-400"}`}>
              ₹{budgetPlan.projected_savings?.toLocaleString("en-IN")}
            </span>
          </p>
        </div>
        <button
          onClick={handleApplyBudgetPlan}
          disabled={applyingPlan}
          className="bg-teal-700 hover:bg-teal-800 disabled:bg-teal-400 text-white font-bold py-2.5 px-5 rounded-lg transition-all cursor-pointer flex items-center gap-2 text-sm border-none"
        >
          {applyingPlan && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
          {applyingPlan ? "Applying…" : "Apply plan"}
        </button>
      </div>

      <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-150 dark:border-stone-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 dark:bg-stone-800 border-b border-stone-150 dark:border-stone-700">
                <th className="text-left px-5 py-4 text-[11px] font-bold text-stone-500 uppercase tracking-wider">Category</th>
                <th className="text-right px-5 py-4 text-[11px] font-bold text-stone-500 uppercase tracking-wider">Last month actual</th>
                <th className="text-right px-5 py-4 text-[11px] font-bold text-stone-500 uppercase tracking-wider">Current budget</th>
                <th className="text-right px-5 py-4 text-[11px] font-bold text-stone-500 uppercase tracking-wider">Suggested budget</th>
                <th className="text-left px-5 py-4 text-[11px] font-bold text-stone-500 uppercase tracking-wider">Advice</th>
              </tr>
            </thead>
            <tbody>
              {budgetPlan.plan?.map((item: any, i: number) => (
                <tr key={i} className="border-b border-stone-50 dark:border-stone-800/60 hover:bg-stone-50/60 dark:hover:bg-stone-800/30 transition-colors">
                  <td className="px-5 py-4 font-bold text-stone-800 dark:text-stone-200">{item.category}</td>
                  <td className="px-5 py-4 text-right font-mono text-stone-600 dark:text-stone-400">₹{item.last_month_actual?.toLocaleString("en-IN")}</td>
                  <td className="px-5 py-4 text-right font-mono text-stone-600 dark:text-stone-400">
                    {item.current_budget > 0 ? `₹${item.current_budget?.toLocaleString("en-IN")}` : "—"}
                  </td>
                  <td className="px-5 py-4 text-right font-mono font-bold text-teal-700 dark:text-teal-400">₹{item.suggested_budget?.toLocaleString("en-IN")}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        item.status === "overspent"
                          ? "bg-coral-100 text-coral-700 dark:bg-coral-950/30 dark:text-coral-400"
                          : item.status === "unbudgeted"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                          : "bg-teal-100 text-teal-700 dark:bg-teal-950/30 dark:text-teal-400"
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
