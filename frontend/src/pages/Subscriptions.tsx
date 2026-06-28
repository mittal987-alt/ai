import React from "react";
import { useFinance } from "../context/FinanceContext";

const Subscriptions: React.FC = () => {
  const {
    subscriptions,
    detectedSubs,
    setSubModalMode,
    setSubName,
    setSubAmount,
    setSubCategory,
    setSubBillingCycle,
    setSubNextDueDate,
    setShowSubModal,
    openEditSubModal,
    handleSubDelete,
    acceptDetectedSub,
  } = useFinance();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Subscriptions List */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-2xl shadow-sm transition-colors">
          <div>
            <h2 className="text-xl font-bold text-slate-850 dark:text-slate-100">📅 Registered Subscriptions</h2>
            <p className="text-xs text-slate-455 dark:text-slate-500 font-medium mt-1">Track recurring expenses and monthly due dates.</p>
          </div>
          <button
            onClick={() => {
              setSubModalMode("add");
              setSubName("");
              setSubAmount("");
              setSubCategory("Others");
              setSubBillingCycle("Monthly");
              setSubNextDueDate(new Date().toISOString().split("T")[0]);
              setShowSubModal(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer border-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Subscription
          </button>
        </div>

        {subscriptions.length > 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl shadow-sm overflow-hidden transition-colors">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-455 dark:text-slate-550 text-xs font-bold uppercase tracking-wider">
                    <th className="py-4 pl-6">Subscription</th>
                    <th className="py-4">Billing Cycle</th>
                    <th className="py-4">Next Due Date</th>
                    <th className="py-4 text-right pr-6">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-850 text-sm font-medium text-slate-755 dark:text-slate-300">
                  {subscriptions.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors group">
                      <td className="py-4 pl-6">
                        <div>
                          <p className="font-extrabold text-slate-800 dark:text-slate-150">{s.name}</p>
                          <p className="text-[10px] text-slate-455 dark:text-slate-500 uppercase font-bold tracking-wider">{s.category}</p>
                        </div>
                      </td>
                      <td className="py-4 text-xs font-bold text-slate-550 dark:text-slate-400">
                        <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">{s.billing_cycle}</span>
                      </td>
                      <td className="py-4 text-xs text-slate-655 dark:text-slate-350">{s.next_due_date}</td>
                      <td className="py-4 text-right pr-6 font-extrabold text-slate-800 dark:text-slate-200">
                        <span className="mr-6">₹{s.amount?.toLocaleString("en-IN") || 0}</span>
                        <span className="inline-flex gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEditSubModal(s)}
                            className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer bg-transparent border-none"
                            title="Edit Subscription"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.128-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleSubDelete(s.id)}
                            className="text-slate-400 hover:text-rose-600 cursor-pointer bg-transparent border-none"
                            title="Remove Subscription"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.34 9m-4.72 0-.34-9m9.03-3.03a17.902 17.902 0 0 1-1.07 3.5M18.13 6a22.09 22.09 0 0 0-1.85-.3M14.74 9a22.38 22.38 0 0 0-5.48 0M10.5 6.857V5.07c0-.704.57-1.286 1.27-1.286h2.46c.7 0 1.27.582 1.27 1.286v1.787M3.75 6a17.925 17.925 0 0 1 1.07-3.5M6.37 6a22.09 22.09 0 0 1 1.85-.3M6.37 6a22.38 22.38 0 0 1 5.48 0" />
                            </svg>
                          </button>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-850 transition-colors">
            <p className="text-sm text-slate-455 dark:text-slate-550 font-medium">No recurring subscriptions registered yet.</p>
          </div>
        )}
      </div>

      {/* AI Auto-Detection Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-2xl shadow-sm flex flex-col justify-between h-fit transition-colors">
        <div>
          <div className="flex items-center gap-2.5 mb-6">
            <div className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 21l8.982-11.861H13.62l.818-5.096L5.5 15.904h4.313Z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Recurring Suggestions</h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">Auto-detected from transaction history</p>
            </div>
          </div>

          {detectedSubs && detectedSubs.length > 0 ? (
            <div className="space-y-4">
              {detectedSubs.map((d, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-950/50 p-4 border border-slate-100 dark:border-slate-850 rounded-xl flex justify-between items-center transition-all hover:scale-[1.01]">
                  <div>
                    <p className="font-bold text-xs text-slate-750 dark:text-slate-200">{d.name}</p>
                    <p className="text-[10px] text-indigo-655 dark:text-indigo-455 font-extrabold mt-0.5">₹{d.amount}/month</p>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold mt-1">Est. Due: {d.next_due_date}</p>
                  </div>
                  <button
                    onClick={() => acceptDetectedSub(d)}
                    className="bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900 border border-indigo-100 dark:border-indigo-900 text-indigo-655 dark:text-indigo-400 text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer"
                  >
                    + Track
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 bg-slate-55/50 dark:bg-slate-950/30 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">No patterns detected yet.</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 text-center">Add more transactions to enable auto-detection.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
