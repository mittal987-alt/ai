import React, { useState, useEffect } from "react";
import { useFinance } from "../context/FinanceContext";

const API = "http://127.0.0.1:8000";

const TYPES = ["Stocks", "Mutual Fund", "FD", "PPF", "Gold", "Crypto", "NPS", "Real Estate", "Others"];

const typeEmoji: Record<string, string> = {
  "Stocks": "📈", "Mutual Fund": "🏦", "FD": "🏛️", "PPF": "🏅",
  "Gold": "🥇", "Crypto": "₿", "NPS": "🎯", "Real Estate": "🏠", "Others": "💼"
};
const typeGradient: Record<string, string> = {
  "Stocks": "from-blue-500 to-indigo-600", "Mutual Fund": "from-violet-500 to-purple-600",
  "FD": "from-emerald-500 to-teal-600", "PPF": "from-amber-500 to-orange-600",
  "Gold": "from-yellow-400 to-amber-500", "Crypto": "from-orange-500 to-rose-500",
  "NPS": "from-teal-500 to-cyan-600", "Real Estate": "from-slate-500 to-slate-700", "Others": "from-pink-500 to-rose-600",
};

const Investments: React.FC = () => {
  const { userEmail, setShowAuthModal, setAuthMode } = useFinance();
  const [investments, setInvestments] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [investType, setInvestType] = useState("Stocks");
  const [investedAmount, setInvestedAmount] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [units, setUnits] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");

  const token = () => localStorage.getItem("token");
  const authHeader = () => ({ Authorization: `Bearer ${token()}`, "Content-Type": "application/json" });

  const load = async () => {
    if (!token()) { setLoading(false); return; }
    setLoading(true);
    try {
      const [invRes, sumRes] = await Promise.all([
        fetch(`${API}/investments/`, { headers: { Authorization: `Bearer ${token()}` } }),
        fetch(`${API}/investments/summary`, { headers: { Authorization: `Bearer ${token()}` } }),
      ]);
      if (invRes.ok) setInvestments(await invRes.json());
      if (sumRes.ok) setSummary(await sumRes.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, [userEmail]);

  const openCreate = () => {
    setEditId(null); setName(""); setInvestType("Stocks"); setInvestedAmount(""); setCurrentValue("");
    setUnits(""); setPurchasePrice(""); setCurrentPrice(""); setPurchaseDate(new Date().toISOString().split("T")[0]); setNotes("");
    setShowModal(true);
  };

  const openEdit = (inv: any) => {
    setEditId(inv.id); setName(inv.name); setInvestType(inv.investment_type);
    setInvestedAmount(String(inv.invested_amount)); setCurrentValue(String(inv.current_value));
    setUnits(inv.units ? String(inv.units) : ""); setPurchasePrice(inv.purchase_price ? String(inv.purchase_price) : "");
    setCurrentPrice(inv.current_price ? String(inv.current_price) : "");
    setPurchaseDate(inv.purchase_date); setNotes(inv.notes || "");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name, investment_type: investType,
      invested_amount: parseFloat(investedAmount),
      current_value: parseFloat(currentValue),
      units: units ? parseFloat(units) : null,
      purchase_price: purchasePrice ? parseFloat(purchasePrice) : null,
      current_price: currentPrice ? parseFloat(currentPrice) : null,
      purchase_date: purchaseDate,
      notes: notes || null,
    };
    const url = editId ? `${API}/investments/${editId}` : `${API}/investments/`;
    const method = editId ? "PUT" : "POST";
    try {
      const res = await fetch(url, { method, headers: authHeader(), body: JSON.stringify(payload) });
      if (res.ok) { setShowModal(false); load(); }
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this investment?")) return;
    await fetch(`${API}/investments/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token()}` } });
    load();
  };

  const returnPct = (inv: any) => {
    if (!inv.invested_amount) return 0;
    return ((inv.current_value - inv.invested_amount) / inv.invested_amount * 100);
  };

  if (!userEmail) return (
    <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
      <p className="text-4xl mb-4">📈</p>
      <p className="font-bold text-slate-700 dark:text-slate-300 mb-2">Sign in to track your portfolio</p>
      <button onClick={() => { setAuthMode("login"); setShowAuthModal(true); }} className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold py-2.5 px-6 rounded-xl border-none cursor-pointer">Sign In</button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-850 dark:text-slate-100">📈 Investment Portfolio</h2>
          <p className="text-xs text-slate-455 dark:text-slate-500 font-medium mt-1">Track stocks, mutual funds, FDs, PPF, gold, and more.</p>
        </div>
        <button onClick={openCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl border-none cursor-pointer flex items-center gap-1.5 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Add Investment
        </button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Invested", value: `₹${summary.total_invested?.toLocaleString("en-IN")}`, color: "text-slate-800 dark:text-slate-200" },
            { label: "Current Value", value: `₹${summary.total_current_value?.toLocaleString("en-IN")}`, color: "text-indigo-600 dark:text-indigo-400" },
            { label: "Total P&L", value: `${summary.total_gain_loss >= 0 ? "+" : ""}₹${summary.total_gain_loss?.toLocaleString("en-IN")}`, color: summary.total_gain_loss >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400" },
            { label: "Overall Return", value: `${summary.overall_return_pct >= 0 ? "+" : ""}${summary.overall_return_pct?.toFixed(2)}%`, color: summary.overall_return_pct >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400" },
          ].map(card => (
            <div key={card.label} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl p-5 shadow-sm">
              <p className="text-[10px] font-bold text-slate-455 dark:text-slate-500 uppercase tracking-wider mb-1">{card.label}</p>
              <p className={`text-xl font-black ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Portfolio Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-400">Loading…</div>
      ) : investments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-4xl mb-4">📈</p>
          <h3 className="font-bold text-slate-700 dark:text-slate-300">No investments added yet</h3>
          <p className="text-xs text-slate-500 mt-1 mb-6">Track your full portfolio — stocks, FDs, MFs, gold, crypto, and more.</p>
          <button onClick={openCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl border-none cursor-pointer">Add First Investment</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {investments.map((inv) => {
            const ret = returnPct(inv);
            const gradient = typeGradient[inv.investment_type] || "from-slate-500 to-slate-700";
            return (
              <div key={inv.id} className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white shadow-lg hover:scale-[1.02] transition-all relative overflow-hidden group`}>
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 transform translate-x-8 -translate-y-8" />
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-2xl">{typeEmoji[inv.investment_type] || "💼"}</span>
                    <p className="text-[9px] font-bold opacity-60 uppercase tracking-widest mt-1">{inv.investment_type}</p>
                    <h3 className="font-extrabold text-sm mt-0.5 leading-tight">{inv.name}</h3>
                  </div>
                  <div className={`text-sm font-black px-2 py-1 rounded-xl bg-white/20 ${ret >= 0 ? "text-emerald-200" : "text-rose-200"}`}>
                    {ret >= 0 ? "▲" : "▼"} {Math.abs(ret).toFixed(1)}%
                  </div>
                </div>
                <div className="mt-4 space-y-1">
                  <div className="flex justify-between text-[10px] opacity-70 font-bold uppercase tracking-wider">
                    <span>Invested</span><span>Current</span>
                  </div>
                  <div className="flex justify-between font-black text-base">
                    <span>₹{inv.invested_amount?.toLocaleString("en-IN")}</span>
                    <span>₹{inv.current_value?.toLocaleString("en-IN")}</span>
                  </div>
                </div>
                {inv.units && (
                  <p className="text-[10px] opacity-60 mt-2">{inv.units} units · ₹{inv.current_price || "—"} / unit</p>
                )}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(inv)} className="text-white/70 hover:text-white bg-transparent border-none cursor-pointer text-xs">✏️</button>
                  <button onClick={() => handleDelete(inv.id)} className="text-white/70 hover:text-white bg-transparent border-none cursor-pointer text-xs">✕</button>
                </div>
                <p className="text-[9px] opacity-50 mt-2">Since {inv.purchase_date}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Allocation Breakdown */}
      {summary?.allocation && Object.keys(summary.allocation).length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4">📊 Allocation Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(summary.allocation).map(([type, value]: [string, any]) => {
              const pct = summary.total_current_value > 0 ? (value / summary.total_current_value * 100) : 0;
              return (
                <div key={type} className="flex items-center gap-4">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300 w-32 flex-shrink-0">{typeEmoji[type] || "💼"} {type}</span>
                  <div className="flex-1 bg-slate-100 dark:bg-slate-850 rounded-full h-2.5 overflow-hidden">
                    <div className={`h-2.5 rounded-full bg-gradient-to-r ${typeGradient[type] || "from-slate-400 to-slate-500"}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 w-16 text-right">{pct.toFixed(1)}%</span>
                  <span className="text-xs text-slate-500 dark:text-slate-500 w-28 text-right">₹{value?.toLocaleString("en-IN")}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 max-w-lg w-full p-8 relative overflow-y-auto max-h-[90vh]">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">✕</button>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">{editId ? "Edit Investment" : "Add Investment"}</h3>
              <p className="text-xs text-slate-500 mt-1">Record a new asset in your portfolio</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Name / Ticker</label>
                <input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Reliance Industries, Nifty 50 Index" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {TYPES.map(t => (
                    <button key={t} type="button" onClick={() => setInvestType(t)} className={`text-xs font-bold py-2 px-2 rounded-xl border cursor-pointer transition-all ${investType === t ? "bg-indigo-600 border-indigo-600 text-white" : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-400"}`}>
                      {typeEmoji[t]} {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Invested Amount (₹)</label>
                  <input required type="number" value={investedAmount} onChange={e => setInvestedAmount(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Current Value (₹)</label>
                  <input required type="number" value={currentValue} onChange={e => setCurrentValue(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Units (optional)</label>
                  <input type="number" value={units} onChange={e => setUnits(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Buy Price (₹)</label>
                  <input type="number" value={purchasePrice} onChange={e => setPurchasePrice(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">CMP (₹)</label>
                  <input type="number" value={currentPrice} onChange={e => setCurrentPrice(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Purchase Date</label>
                <input required type="date" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Notes</label>
                <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. SIP of ₹5000/month" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100" />
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm border-none cursor-pointer transition-all">
                {editId ? "Save Changes" : "Add to Portfolio"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Investments;
