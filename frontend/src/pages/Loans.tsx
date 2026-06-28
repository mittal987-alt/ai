import React, { useState, useEffect } from "react";
import { useFinance } from "../context/FinanceContext";

const API = "http://127.0.0.1:8000";

const LOAN_TYPES = ["Home", "Car", "Personal", "Education", "Business", "Gold", "Others"];

const loanTypeEmoji: Record<string, string> = {
  Home: "🏠", Car: "🚗", Personal: "👤", Education: "🎓",
  Business: "💼", Gold: "🥇", Others: "📋"
};
const loanTypeGradient: Record<string, string> = {
  Home: "from-blue-500 to-indigo-600", Car: "from-slate-500 to-slate-700",
  Personal: "from-violet-500 to-purple-600", Education: "from-emerald-500 to-teal-600",
  Business: "from-amber-500 to-orange-600", Gold: "from-yellow-400 to-amber-500",
  Others: "from-pink-500 to-rose-600",
};

function computeEmi(principal: number, rate: number, months: number): number {
  if (rate === 0) return principal / months;
  const r = rate / 12 / 100;
  return principal * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1);
}

const Loans: React.FC = () => {
  const { userEmail, setShowAuthModal, setAuthMode } = useFinance();
  const [loans, setLoans] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showSchedule, setShowSchedule] = useState<any>(null);
  const [editId, setEditId] = useState<number | null>(null);

  // Form
  const [name, setName] = useState("");
  const [loanType, setLoanType] = useState("Personal");
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [outstanding, setOutstanding] = useState("");
  const [lender, setLender] = useState("");
  const [isActive, setIsActive] = useState(true);

  const token = () => localStorage.getItem("token");
  const authHeader = () => ({ Authorization: `Bearer ${token()}`, "Content-Type": "application/json" });

  const load = async () => {
    if (!token()) { setLoading(false); return; }
    setLoading(true);
    try {
      const [lRes, sRes] = await Promise.all([
        fetch(`${API}/loans/`, { headers: { Authorization: `Bearer ${token()}` } }),
        fetch(`${API}/loans/summary`, { headers: { Authorization: `Bearer ${token()}` } }),
      ]);
      if (lRes.ok) setLoans(await lRes.json());
      if (sRes.ok) setSummary(await sRes.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, [userEmail]);

  const computedEmi = () => {
    if (!principal || !rate || !tenure) return 0;
    return computeEmi(parseFloat(principal), parseFloat(rate), parseInt(tenure));
  };

  const openCreate = () => {
    setEditId(null); setName(""); setLoanType("Personal"); setPrincipal(""); setRate(""); setTenure("");
    setStartDate(new Date().toISOString().split("T")[0]); setOutstanding(""); setLender(""); setIsActive(true);
    setShowModal(true);
  };

  const openEdit = (l: any) => {
    setEditId(l.id); setName(l.name); setLoanType(l.loan_type); setPrincipal(String(l.principal_amount));
    setRate(String(l.interest_rate)); setTenure(String(l.tenure_months)); setStartDate(l.start_date);
    setOutstanding(String(l.outstanding_amount)); setLender(l.lender_name || ""); setIsActive(l.is_active);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emi = computedEmi();
    const payload = {
      name, loan_type: loanType,
      principal_amount: parseFloat(principal),
      interest_rate: parseFloat(rate),
      tenure_months: parseInt(tenure),
      start_date: startDate,
      emi_amount: parseFloat(emi.toFixed(2)),
      outstanding_amount: parseFloat(outstanding || principal),
      lender_name: lender || null,
      is_active: isActive,
    };
    const url = editId ? `${API}/loans/${editId}` : `${API}/loans/`;
    const method = editId ? "PUT" : "POST";
    try {
      const res = await fetch(url, { method, headers: authHeader(), body: JSON.stringify(payload) });
      if (res.ok) { setShowModal(false); load(); }
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this loan?")) return;
    await fetch(`${API}/loans/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token()}` } });
    load();
  };

  const loadSchedule = async (id: number) => {
    const res = await fetch(`${API}/loans/${id}/schedule`, { headers: { Authorization: `Bearer ${token()}` } });
    if (res.ok) setShowSchedule(await res.json());
  };

  if (!userEmail) return (
    <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
      <p className="text-4xl mb-4">🏦</p>
      <p className="font-bold text-slate-700 dark:text-slate-300 mb-2">Sign in to track your loans</p>
      <button onClick={() => { setAuthMode("login"); setShowAuthModal(true); }} className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold py-2.5 px-6 rounded-xl border-none cursor-pointer">Sign In</button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-850 dark:text-slate-100">🏦 Loan & EMI Tracker</h2>
          <p className="text-xs text-slate-455 dark:text-slate-500 font-medium mt-1">Track all your loans, EMIs, and amortization schedules.</p>
        </div>
        <button onClick={openCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl border-none cursor-pointer flex items-center gap-1.5 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Add Loan
        </button>
      </div>

      {/* Summary */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Active Loans", value: String(summary.active_loans), color: "text-slate-800 dark:text-slate-200" },
            { label: "Total Outstanding", value: `₹${summary.total_outstanding?.toLocaleString("en-IN")}`, color: "text-rose-600 dark:text-rose-400" },
            { label: "Monthly EMI Burden", value: `₹${summary.monthly_emi_burden?.toLocaleString("en-IN")}`, color: "text-amber-600 dark:text-amber-400" },
            { label: "Paid So Far", value: `₹${summary.total_paid_so_far?.toLocaleString("en-IN")}`, color: "text-emerald-600 dark:text-emerald-400" },
          ].map(c => (
            <div key={c.label} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl p-5 shadow-sm">
              <p className="text-[10px] font-bold text-slate-455 dark:text-slate-500 uppercase tracking-wider mb-1">{c.label}</p>
              <p className={`text-xl font-black ${c.color}`}>{c.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Loan Cards */}
      {loading ? (
        <div className="text-center py-16 text-slate-400">Loading…</div>
      ) : loans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-4xl mb-4">🏦</p>
          <h3 className="font-bold text-slate-700 dark:text-slate-300">No loans tracked yet</h3>
          <p className="text-xs text-slate-500 mt-1 mb-6">Add home, car, personal loans, or credit card debt to monitor repayment progress.</p>
          <button onClick={openCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl border-none cursor-pointer">Add First Loan</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loans.map((loan) => {
            const progress = loan.principal_amount > 0 ? Math.min(((loan.principal_amount - loan.outstanding_amount) / loan.principal_amount) * 100, 100) : 0;
            const gradient = loanTypeGradient[loan.loan_type] || "from-slate-500 to-slate-700";
            return (
              <div key={loan.id} className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white shadow-lg hover:scale-[1.01] transition-all relative overflow-hidden group`}>
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 transform translate-x-8 -translate-y-8" />
                <div className="relative">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-2xl">{loanTypeEmoji[loan.loan_type] || "📋"}</span>
                      <p className="text-[9px] font-bold opacity-60 uppercase tracking-widest mt-1">{loan.loan_type} Loan {!loan.is_active && "· Closed"}</p>
                      <h3 className="font-extrabold text-sm mt-0.5">{loan.name}</h3>
                      {loan.lender_name && <p className="text-[10px] opacity-60 mt-0.5">{loan.lender_name}</p>}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[9px] opacity-60 font-bold">INTEREST RATE</p>
                      <p className="font-black text-lg">{loan.interest_rate}%</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3 mt-4">
                    <div className="flex justify-between text-[10px] opacity-70 mb-1 font-bold">
                      <span>Repaid</span><span>{progress.toFixed(0)}%</span>
                    </div>
                    <div className="bg-white/20 rounded-full h-2">
                      <div className="bg-white rounded-full h-2 transition-all" style={{ width: `${progress}%` }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white/15 rounded-xl p-2.5">
                      <p className="text-[9px] opacity-60 font-bold">EMI/MONTH</p>
                      <p className="font-black text-sm">₹{loan.emi_amount?.toLocaleString("en-IN")}</p>
                    </div>
                    <div className="bg-white/15 rounded-xl p-2.5">
                      <p className="text-[9px] opacity-60 font-bold">OUTSTANDING</p>
                      <p className="font-black text-sm">₹{loan.outstanding_amount?.toLocaleString("en-IN")}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => loadSchedule(loan.id)} className="flex-1 bg-white/20 hover:bg-white/30 text-white text-[10px] font-bold py-1.5 rounded-lg border-none cursor-pointer transition-all">📋 Schedule</button>
                    <button onClick={() => openEdit(loan)} className="bg-white/20 hover:bg-white/30 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg border-none cursor-pointer transition-all">✏️</button>
                    <button onClick={() => handleDelete(loan.id)} className="bg-white/10 hover:bg-rose-500/40 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg border-none cursor-pointer transition-all">✕</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Amortization Schedule Modal */}
      {showSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 w-full max-w-2xl max-h-[85vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">📋 {showSchedule.loan_name} — Amortization</h3>
                <p className="text-xs text-slate-500 mt-0.5">EMI: ₹{showSchedule.emi?.toLocaleString("en-IN")} · Total Interest: ₹{showSchedule.total_interest_outflow?.toLocaleString("en-IN")} · Total Repayment: ₹{showSchedule.total_repayment?.toLocaleString("en-IN")}</p>
              </div>
              <button onClick={() => setShowSchedule(null)} className="text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">✕</button>
            </div>
            <div className="overflow-auto flex-1 p-4">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                    <th className="py-2 px-3 text-left">Month</th>
                    <th className="py-2 px-3 text-right">EMI (₹)</th>
                    <th className="py-2 px-3 text-right">Principal (₹)</th>
                    <th className="py-2 px-3 text-right">Interest (₹)</th>
                    <th className="py-2 px-3 text-right">Balance (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-850">
                  {showSchedule.schedule?.map((row: any) => (
                    <tr key={row.month} className="hover:bg-slate-50 dark:hover:bg-slate-850/30">
                      <td className="py-2 px-3 font-bold text-slate-700 dark:text-slate-300">{row.month}</td>
                      <td className="py-2 px-3 text-right text-slate-600 dark:text-slate-400">{row.emi?.toLocaleFixed ? row.emi.toLocaleString("en-IN") : row.emi}</td>
                      <td className="py-2 px-3 text-right text-indigo-600 dark:text-indigo-400 font-bold">{row.principal_paid?.toLocaleString("en-IN")}</td>
                      <td className="py-2 px-3 text-right text-rose-600 dark:text-rose-400">{row.interest_paid?.toLocaleString("en-IN")}</td>
                      <td className="py-2 px-3 text-right font-bold text-slate-700 dark:text-slate-300">{row.balance?.toLocaleString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 max-w-lg w-full p-8 relative overflow-y-auto max-h-[90vh]">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">✕</button>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">{editId ? "Edit Loan" : "Add New Loan"}</h3>
              <p className="text-xs text-slate-500 mt-1">EMI is auto-calculated from your inputs</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Loan Name</label>
                <input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. HDFC Home Loan" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Loan Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {LOAN_TYPES.map(t => (
                    <button key={t} type="button" onClick={() => setLoanType(t)} className={`text-xs font-bold py-2 px-2 rounded-xl border cursor-pointer transition-all ${loanType === t ? "bg-indigo-600 border-indigo-600 text-white" : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-400"}`}>
                      {loanTypeEmoji[t]} {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Principal (₹)</label>
                  <input required type="number" value={principal} onChange={e => setPrincipal(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Rate (% p.a.)</label>
                  <input required type="number" step="0.01" value={rate} onChange={e => setRate(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tenure (months)</label>
                  <input required type="number" value={tenure} onChange={e => setTenure(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100" />
                </div>
              </div>
              {principal && rate && tenure && (
                <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 rounded-xl p-4 text-center">
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider mb-1">Calculated Monthly EMI</p>
                  <p className="text-2xl font-black text-indigo-700 dark:text-indigo-300">₹{computedEmi().toLocaleString("en-IN", { maximumFractionDigits: 0 })}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Start Date</label>
                  <input required type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Outstanding (₹)</label>
                  <input type="number" value={outstanding} onChange={e => setOutstanding(e.target.value)} placeholder="Leave blank = full principal" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Lender Name</label>
                <input value={lender} onChange={e => setLender(e.target.value)} placeholder="e.g. HDFC Bank, SBI, ICICI" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="active-loan" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="w-4 h-4 accent-indigo-600 cursor-pointer" />
                <label htmlFor="active-loan" className="text-sm text-slate-700 dark:text-slate-300 cursor-pointer">Active (ongoing EMI)</label>
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm border-none cursor-pointer transition-all">
                {editId ? "Save Changes" : "Add Loan"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loans;
