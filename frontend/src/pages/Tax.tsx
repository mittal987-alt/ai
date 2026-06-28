import React from "react";
import { useFinance } from "../context/FinanceContext";

const Tax: React.FC = () => {
  const { taxData } = useFinance();

  if (!taxData) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-3">💸</p>
        <p className="font-bold text-slate-600 dark:text-slate-400">No income data found</p>
        <p className="text-sm mt-1 text-slate-500 dark:text-slate-500">Upload statements or add income transactions to estimate your tax.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-8">
      {/* Hero Tax Card */}
      <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 rounded-2xl p-6 text-white shadow-lg shadow-orange-200 dark:shadow-none relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white transform translate-x-16 -translate-y-16"></div>
        </div>
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          <div className="text-center flex-shrink-0">
            <p className="text-[11px] font-bold opacity-70 uppercase tracking-widest mb-1">Estimated Tax Liability</p>
            <p className="text-5xl font-black">₹{taxData.total_tax_liability?.toLocaleString("en-IN")}</p>
            <p className="text-sm font-bold mt-1 opacity-80">Effective Rate: {taxData.effective_tax_rate}%</p>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-3">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4">
              <p className="text-xs opacity-70 font-bold mb-1">Gross Income</p>
              <p className="text-xl font-black">₹{taxData.gross_income?.toLocaleString("en-IN")}</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4">
              <p className="text-xs opacity-70 font-bold mb-1">Standard Deduction</p>
              <p className="text-xl font-black">₹{taxData.standard_deduction?.toLocaleString("en-IN")}</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4">
              <p className="text-xs opacity-70 font-bold mb-1">Net Taxable Income</p>
              <p className="text-xl font-black">₹{taxData.net_taxable_income?.toLocaleString("en-IN")}</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4">
              <p className="text-xs opacity-70 font-bold mb-1">Rebate 87A</p>
              <p className="text-xl font-black text-emerald-200">₹{taxData.rebate_87A?.toLocaleString("en-IN")}</p>
            </div>
          </div>
        </div>
        <p className="relative text-xs opacity-70 mt-4 font-medium">{taxData.regime}</p>
      </div>

      {/* Slab Breakdown */}
      {taxData.slab_breakdown && taxData.slab_breakdown.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">📊 Tax Slab Breakdown</h2>
          <div className="space-y-3">
            {taxData.slab_breakdown.map((slab: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <div>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{slab.slab}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Income in slab: ₹{slab.income_in_slab?.toLocaleString("en-IN")}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-amber-600 dark:text-amber-400">{slab.rate}</p>
                  <p className="text-sm font-black text-slate-800 dark:text-slate-100">₹{slab.tax?.toLocaleString("en-IN")}</p>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-100 dark:border-amber-900">
              <p className="text-sm font-black text-amber-800 dark:text-amber-300">4% Health & Education Cess</p>
              <p className="text-sm font-black text-amber-800 dark:text-amber-300">₹{taxData.cess_4pct?.toLocaleString("en-IN")}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">💡 Tax Saving Tips</h2>
        <div className="space-y-3">
          {taxData.tips?.map((tip: string, i: number) => (
            <div key={i} className="flex gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900">
              <span className="text-blue-500 text-lg">💡</span>
              <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tax;
