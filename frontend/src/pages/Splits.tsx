import React from "react";
import { useFinance } from "../context/FinanceContext";

const Splits: React.FC = () => {
  const {
    splits,
    setSplitDescription,
    setSplitTotal,
    setSplitFriend,
    setSplitOwed,
    setShowSplitModal,
    handleSplitSettle,
    handleSplitDelete,
  } = useFinance();

  const totalOwed = splits
    .filter((s: any) => !s.is_settled)
    .reduce((sum: number, s: any) => sum + s.amount_owed, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-850 dark:text-slate-100">👥 Shared Bills</h2>
          <p className="text-xs text-slate-455 dark:text-slate-500 font-medium mt-1">
            Total owed to you:{" "}
            <strong className="text-emerald-600 dark:text-emerald-400">
              ₹{totalOwed.toLocaleString("en-IN")}
            </strong>
          </p>
        </div>
        <button
          onClick={() => {
            setSplitDescription("");
            setSplitTotal("");
            setSplitFriend("");
            setSplitOwed("");
            setShowSplitModal(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer border-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Record Split
        </button>
      </div>

      {splits.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-455 dark:text-slate-550 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 pl-6">Description</th>
                  <th className="py-4">Friend</th>
                  <th className="py-4">Total Bill</th>
                  <th className="py-4">They Owe</th>
                  <th className="py-4 text-center">Status</th>
                  <th className="py-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-850">
                {splits.map((s: any) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors">
                    <td className="py-4 pl-6 font-semibold text-slate-800 dark:text-slate-200 text-sm">{s.description}</td>
                    <td className="py-4 text-sm font-bold text-slate-600 dark:text-slate-350">{s.friend_name}</td>
                    <td className="py-4 text-sm text-slate-550 dark:text-slate-400">₹{s.total_amount?.toLocaleString("en-IN")}</td>
                    <td className="py-4 font-extrabold text-indigo-600 dark:text-indigo-400 text-sm">₹{s.amount_owed?.toLocaleString("en-IN")}</td>
                    <td className="py-4 text-center">
                      {s.is_settled ? (
                        <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full">✓ Settled</span>
                      ) : (
                        <span className="bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-full">Pending</span>
                      )}
                    </td>
                    <td className="py-4 pr-6 text-right">
                      <div className="flex justify-end gap-2">
                        {!s.is_settled && (
                          <button
                            onClick={() => handleSplitSettle(s.id)}
                            className="bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold px-2.5 py-1.5 rounded-lg cursor-pointer transition-all border-none"
                          >
                            Settle Up
                          </button>
                        )}
                        <button
                          onClick={() => handleSplitDelete(s.id)}
                          className="text-slate-400 hover:text-rose-600 cursor-pointer p-1 bg-transparent border-none"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.34 9m-4.72 0-.34-9M9.172 6.857V5.07c0-.704.57-1.286 1.27-1.286h2.46c.7 0 1.27.582 1.27 1.286v1.787M3.75 6a17.9 17.9 0 0 1 16.5 0" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <div className="text-4xl mb-4">👥</div>
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-350">No Splits Recorded</h3>
          <p className="text-xs text-slate-455 dark:text-slate-500 mt-1 mb-6 text-center max-w-sm">Track shared expenses for dinners, rent, trips, and more.</p>
          <button
            onClick={() => {
              setSplitDescription("");
              setSplitTotal("");
              setSplitFriend("");
              setSplitOwed("");
              setShowSplitModal(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer border-none"
          >
            Record First Split
          </button>
        </div>
      )}
    </div>
  );
};

export default Splits;
