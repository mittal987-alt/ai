import React, { useState, useEffect } from "react";
import { useFinance } from "../context/FinanceContext";

const API = "http://127.0.0.1:8000";

const CATEGORIES = ["Shopping", "Food", "Travel", "Fuel", "UPI", "Cash", "Income", "Utilities", "Entertainment", "Others"];
const FREQUENCIES = ["daily", "weekly", "monthly", "yearly"];

const freq_label: Record<string, string> = {
  daily: "Daily", weekly: "Weekly", monthly: "Monthly", yearly: "Yearly"
};

const RecurringTransactions: React.FC = () => {
  const { userEmail, setShowAuthModal, setAuthMode } = useFinance();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Form state
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Others");
  const [txType, setTxType] = useState("expense");
  const [frequency, setFrequency] = useState("monthly");
  const [nextDate, setNextDate] = useState(new Date().toISOString().split("T")[0]);
  const [isActive, setIsActive] = useState(true);

  const token = () => localStorage.getItem("token");
  const headers = () => ({ Authorization: `Bearer ${token()}`, "Content-Type": "application/json" });

  const load = async () => {
    if (!token()) { setLoading(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/recurring/`, { headers: { Authorization: `Bearer ${token()}` } });
      if (res.ok) setItems(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, [userEmail]);

  const openCreate = () => {
    setEditId(null);
    setDescription(""); setAmount(""); setCategory("Others"); setTxType("expense");
    setFrequency("monthly"); setNextDate(new Date().toISOString().split("T")[0]); setIsActive(true);
    setShowModal(true);
  };

  const openEdit = (item: any) => {
    setEditId(item.id);
    setDescription(item.description); setAmount(String(item.amount));
    setCategory(item.category); setTxType(item.transaction_type);
    setFrequency(item.frequency); setNextDate(item.next_date); setIsActive(item.is_active);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { description, amount: parseFloat(amount), category, transaction_type: txType, frequency, next_date: nextDate, is_active: isActive };
    const url = editId ? `${API}/recurring/${editId}` : `${API}/recurring/`;
    const method = editId ? "PUT" : "POST";
    try {
      const res = await fetch(url, { method, headers: headers(), body: JSON.stringify(payload) });
      if (res.ok) { setShowModal(false); load(); }
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this recurring transaction?")) return;
    try {
      await fetch(`${API}/recurring/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token()}` } });
      load();
    } catch (e) { console.error(e); }
  };

  const handleTrigger = async () => {
    setTriggering(true);
    try {
      const res = await fetch(`${API}/recurring/trigger`, { method: "POST", headers: { Authorization: `Bearer ${token()}` } });
      const data = await res.json();
      alert(`✅ ${data.message}`);
      load();
    } catch (e) { console.error(e); }
    setTriggering(false);
  };

  const typeColors: Record<string, string> = {
    income: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900",
    expense: "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900",
  };
  const freqColors: Record<string, string> = {
    daily: "bg-violet-50 dark:bg-violet-950/30 text-violet-700",
    weekly: "bg-blue-50 dark:bg-blue-950/30 text-blue-700",
    monthly: "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700",
    yearly: "bg-amber-50 dark:bg-amber-950/30 text-amber-700",
  };

  if (!userEmail) return (
    <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
      <p className="text-4xl mb-4">🔄</p>
      <p className="font-bold text-slate-700 dark:text-slate-300 mb-2">Sign in to manage recurring transactions</p>
      <button onClick={() => { setAuthMode("login"); setShowAuthModal(true); }} className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold py-2.5 px-6 rounded-xl border-none cursor-pointer">Sign In</button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-850 dark:text-slate-100">🔄 Recurring Transactions</h2>
          <p className="text-xs text-slate-455 dark:text-slate-500 font-medium mt-1">Auto-schedule income and expenses on a fixed cadence.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleTrigger}
            disabled={triggering}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs font-bold py-2.5 px-4 rounded-xl border-none cursor-pointer flex items-center gap-1.5 transition-all"
          >
            {triggering ? <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "⚡"}
            {triggering ? "Running..." : "Run Due Now"}
          </button>
          <button
            onClick={openCreate}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl border-none cursor-pointer flex items-center gap-1.5 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Add Schedule
          </button>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-16 text-slate-400">Loading…</div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-4xl mb-4">🔄</p>
          <h3 className="font-bold text-slate-700 dark:text-slate-300">No recurring schedules yet</h3>
          <p className="text-xs text-slate-500 mt-1 mb-6">Set up salary auto-log, rent, subscriptions, and more.</p>
          <button onClick={openCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl border-none cursor-pointer">Add First Schedule</button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-455 dark:text-slate-550 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 pl-6">Description</th>
                  <th className="py-4">Frequency</th>
                  <th className="py-4">Category</th>
                  <th className="py-4">Type</th>
                  <th className="py-4">Next Date</th>
                  <th className="py-4 text-right pr-6">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-850">
                {items.map((item) => (
                  <tr key={item.id} className={`hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors group ${!item.is_active ? "opacity-50" : ""}`}>
                    <td className="py-4 pl-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${item.is_active ? "bg-emerald-500" : "bg-slate-300"}`}></div>
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{item.description}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${freqColors[item.frequency] || ""}`}>{freq_label[item.frequency]}</span>
                    </td>
                    <td className="py-4 text-xs text-slate-600 dark:text-slate-400">{item.category}</td>
                    <td className="py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${typeColors[item.transaction_type] || ""}`}>{item.transaction_type}</span>
                    </td>
                    <td className="py-4 text-xs text-slate-600 dark:text-slate-400">{item.next_date}</td>
                    <td className="py-4 pr-6 text-right">
                      <span className={`font-extrabold text-sm ${item.transaction_type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                        {item.transaction_type === "income" ? "+" : "-"}₹{item.amount?.toLocaleString("en-IN")}
                      </span>
                      <span className="inline-flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                        <button onClick={() => openEdit(item)} className="text-slate-400 hover:text-indigo-600 bg-transparent border-none cursor-pointer text-xs">✏️</button>
                        <button onClick={() => handleDelete(item.id)} className="text-slate-400 hover:text-rose-600 bg-transparent border-none cursor-pointer text-xs">✕</button>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 max-w-md w-full p-8 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">✕</button>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">{editId ? "Edit Schedule" : "New Recurring Schedule"}</h3>
              <p className="text-xs text-slate-500 mt-1">Auto-generate transactions on a fixed cadence</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                <input required value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. Monthly Salary" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Amount (₹)</label>
                  <input required type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Type</label>
                  <select value={txType} onChange={e => setTxType(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 cursor-pointer">
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 cursor-pointer">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Frequency</label>
                  <select value={frequency} onChange={e => setFrequency(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 cursor-pointer">
                    {FREQUENCIES.map(f => <option key={f} value={f}>{freq_label[f]}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Next Trigger Date</label>
                <input required type="date" value={nextDate} onChange={e => setNextDate(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="is-active" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="w-4 h-4 accent-indigo-600 cursor-pointer" />
                <label htmlFor="is-active" className="text-sm text-slate-700 dark:text-slate-300 cursor-pointer">Active (will trigger automatically)</label>
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm border-none cursor-pointer transition-all mt-2">
                {editId ? "Save Changes" : "Create Schedule"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecurringTransactions;
