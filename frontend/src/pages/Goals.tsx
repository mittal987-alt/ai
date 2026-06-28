import React from "react";
import { useFinance } from "../context/FinanceContext";

const Goals: React.FC = () => {
  const {
    goals,
    setGoalModalMode,
    setGoalName,
    setGoalTargetAmount,
    setGoalCurrentAmount,
    setGoalTargetDate,
    setShowGoalModal,
    openEditGoalModal,
    handleGoalDelete,
  } = useFinance();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-2xl shadow-sm transition-colors">
        <div>
          <h2 className="text-xl font-bold text-slate-850 dark:text-slate-100">🎯 Savings Goals</h2>
          <p className="text-xs text-slate-455 dark:text-slate-500 font-medium mt-1">Plan and track your milestones over time.</p>
        </div>
        <button
          onClick={() => {
            setGoalModalMode("add");
            setGoalName("");
            setGoalTargetAmount("");
            setGoalCurrentAmount("0");
            setGoalTargetDate(new Date().toISOString().split("T")[0]);
            setShowGoalModal(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer border-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create Savings Goal
        </button>
      </div>

      {goals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((g) => {
            const percentage = Math.min((g.current_amount / g.target_amount) * 100, 100);
            const isCompleted = g.current_amount >= g.target_amount;
            return (
              <div key={g.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl shadow-sm p-6 hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">{g.name}</h3>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Target Date: {g.target_date}</p>
                    </div>
                    {isCompleted ? (
                      <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        ✓ Completed
                      </span>
                    ) : (
                      <span className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 text-[10px] font-bold px-2.5 py-1 rounded-full">
                        In Progress
                      </span>
                    )}
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                      <span>Progress</span>
                      <span>₹{g.current_amount.toLocaleString("en-IN")} / ₹{g.target_amount.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-850 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-2.5 rounded-full transition-all duration-500 bg-gradient-to-r from-indigo-500 to-violet-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-right text-[10px] text-slate-455 dark:text-slate-500 mt-1.5 font-bold">{percentage.toFixed(0)}% Saved</p>
                  </div>
                </div>

                <div className="flex gap-2 border-t border-slate-100 dark:border-slate-850 pt-4">
                  <button
                    onClick={() => openEditGoalModal(g)}
                    className="flex-1 bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-655 dark:text-slate-300 text-xs font-bold py-2 rounded-xl transition-all cursor-pointer"
                  >
                    Log Progress / Edit
                  </button>
                  <button
                    onClick={() => handleGoalDelete(g.id)}
                    className="bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 text-rose-600 dark:text-rose-455 text-xs font-bold p-2 rounded-xl border border-rose-100 dark:border-rose-900/60 transition-all cursor-pointer"
                    title="Delete Goal"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 transition-colors">
          <div className="bg-indigo-50 dark:bg-indigo-950/40 p-4 rounded-full text-indigo-655 dark:text-indigo-400 text-2xl mb-4">🎯</div>
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-350">No Savings Goals Yet</h3>
          <p className="text-xs text-slate-455 dark:text-slate-500 mt-1 mb-6 text-center max-w-sm">
            Add milestones to track purchases, emergency funds, or investment goals with automated progress reporting.
          </p>
          <button
            onClick={() => {
              setGoalModalMode("add");
              setGoalName("");
              setGoalTargetAmount("");
              setGoalCurrentAmount("0");
              setGoalTargetDate(new Date().toISOString().split("T")[0]);
              setShowGoalModal(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer border-none"
          >
            Get Started
          </button>
        </div>
      )}
    </div>
  );
};

export default Goals;
