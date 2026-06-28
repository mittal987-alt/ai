import React from "react";
import { useFinance } from "../context/FinanceContext";

const Accounts: React.FC = () => {
  const {
    accounts,
    setAccountModalMode,
    setAccountName,
    setAccountType,
    setAccountBalance,
    setShowAccountModal,
    openEditAccountModal,
    handleAccountDelete,
  } = useFinance();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-850 dark:text-slate-100">💳 Wallets & Accounts</h2>
          <p className="text-xs text-slate-455 dark:text-slate-500 font-medium mt-1">Manage your bank accounts, cards, and wallets.</p>
        </div>
        <button
          onClick={() => {
            setAccountModalMode("add");
            setAccountName("");
            setAccountType("Bank");
            setAccountBalance("0");
            setShowAccountModal(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer border-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Account
        </button>
      </div>

      {accounts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((a: any) => {
            const typeColors: Record<string, string> = {
              Bank: "from-indigo-500 to-blue-600",
              "Credit Card": "from-rose-500 to-pink-600",
              Cash: "from-emerald-500 to-teal-600",
              "UPI Wallet": "from-amber-500 to-orange-600"
            };
            const gradient = typeColors[a.account_type] || "from-slate-500 to-slate-700";
            return (
              <div key={a.id} className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 text-white shadow-lg hover:scale-[1.02] transition-all relative overflow-hidden group`}>
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 transform translate-x-10 -translate-y-10"></div>
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">{a.account_type}</p>
                    <h3 className="text-lg font-black mt-1">{a.name}</h3>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditAccountModal(a)}
                      className="text-white/70 hover:text-white cursor-pointer bg-transparent border-none"
                      title="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.128-1.897L16.863 4.487Z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleAccountDelete(a.id)}
                      className="text-white/70 hover:text-white cursor-pointer bg-transparent border-none"
                      title="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.34 9m-4.72 0-.34-9M9.172 6.857V5.07c0-.704.57-1.286 1.27-1.286h2.46c.7 0 1.27.582 1.27 1.286v1.787M3.75 6a17.9 17.9 0 0 1 16.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold opacity-60 uppercase tracking-wider mb-1">Balance</p>
                  <p className="text-3xl font-black">₹{a.balance?.toLocaleString("en-IN") || 0}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <div className="text-4xl mb-4">💳</div>
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-350">No Accounts Added Yet</h3>
          <p className="text-xs text-slate-455 dark:text-slate-500 mt-1 mb-6 text-center max-w-sm">Add bank accounts, credit cards or wallets to track balances in one place.</p>
          <button
            onClick={() => {
              setAccountModalMode("add");
              setAccountName("");
              setAccountType("Bank");
              setAccountBalance("0");
              setShowAccountModal(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer border-none"
          >
            Add First Account
          </button>
        </div>
      )}
    </div>
  );
};

export default Accounts;
