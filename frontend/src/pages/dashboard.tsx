import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [insights, setInsights] = useState<any>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Authentication UI Modal State
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authName, setAuthName] = useState<string>("");
  const [authEmail, setAuthEmail] = useState<string>("");
  const [authPassword, setAuthPassword] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(false);

  const chartColors = ["#10B981", "#3B82F6", "#F59E0B", "#8B5CF6"];

  const chartData = [
    {
      name: "Food",
      value: insights?.food || 0
    },
    {
      name: "Travel",
      value: insights?.travel || 0
    },
    {
      name: "Shopping",
      value: insights?.shopping || 0
    }
  ].filter(item => item.value > 0);

  const loadData = () => {
    fetch("http://127.0.0.1:8000/dashboard")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Error fetching dashboard data:", err));

    fetch("http://127.0.0.1:8000/transactions")
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch((err) => console.error("Error fetching transactions:", err));

    fetch("http://127.0.0.1:8000/insights")
      .then((res) => res.json())
      .then((data) => setInsights(data))
      .catch((err) => console.error("Error fetching insights:", err));
  };

  const checkUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUserEmail(null);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        setUserEmail(result.email);
      } else {
        // Token might be expired or invalid
        localStorage.removeItem("token");
        setUserEmail(null);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    loadData();
    checkUserProfile();
  }, []);

  const uploadStatement = async () => {
    if (!file) {
      alert("Please select a PDF file");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first to upload a statement.");
      setAuthMode("login");
      setShowAuthModal(true);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setIsUploading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/upload-statement",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData,
        }
      );

      const result = await response.json();
      setIsUploading(false);

      if (result.success) {
        alert(`Statement uploaded successfully! Saved ${result.transactions_saved} transactions.`);
        setFile(null);
        // Clear file input
        const fileInput = document.getElementById("file-upload-input") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        loadData();
      } else {
        alert(result.message || "Statement parsing/upload failed.");
      }
    } catch (error) {
      console.error(error);
      setIsUploading(false);
      alert("Upload failed. Make sure the backend server is running.");
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsLoadingAuth(true);

    try {
      if (authMode === "signup") {
        const response = await fetch("http://127.0.0.1:8000/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: authName, email: authEmail, password: authPassword }),
        });
        const data = await response.json();

        if (response.ok) {
          // Signup successful, switch to login
          setAuthMode("login");
          alert("Account created successfully! Please log in.");
        } else {
          setAuthError(data.detail || "Signup failed");
        }
      } else {
        const response = await fetch("http://127.0.0.1:8000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: authEmail, password: authPassword }),
        });
        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("token", data.access_token);
          setUserEmail(authEmail);
          setShowAuthModal(false);
          // Clear credentials
          setAuthPassword("");
          setAuthName("");
          alert("Logged in successfully!");
          loadData();
        } else {
          setAuthError(data.detail || "Invalid credentials");
        }
      }
    } catch (error) {
      console.error(error);
      setAuthError("Failed to connect to the authentication server");
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserEmail(null);
    alert("Logged out successfully.");
  };

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mb-4"></div>
        <p className="text-slate-600 font-medium text-lg">Loading Financial Workspace...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900 pb-12">
      {/* Navbar */}
      <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-md shadow-indigo-200">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h16.5M5.25 7.5h13.5m-12 9a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3m-9 0h9" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Finance AI Coach
              </h1>
              <p className="text-xs text-slate-500 font-medium">Smart Automated Budgeting</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Upload Statement Area */}
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
              <input
                id="file-upload-input"
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setFile(e.target.files[0]);
                  }
                }}
                className="text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-white file:text-indigo-600 hover:file:bg-indigo-50 cursor-pointer max-w-[200px]"
              />
              <button
                onClick={uploadStatement}
                disabled={isUploading}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-bold py-1.5 px-4 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
              >
                {isUploading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Parsing...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                    Upload Statement
                  </>
                )}
              </button>
            </div>

            {/* Authentication Header Widget */}
            {userEmail ? (
              <div className="flex items-center gap-3">
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-1.5 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs font-semibold text-indigo-700 max-w-[150px] truncate" title={userEmail}>
                    {userEmail}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs text-rose-600 hover:text-rose-700 font-bold border border-rose-200 hover:bg-rose-50 px-3 py-1.5 rounded-xl transition-all"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthMode("login");
                  setAuthError("");
                  setShowAuthModal(true);
                }}
                className="bg-white hover:bg-slate-50 text-indigo-600 text-xs font-bold border border-slate-200 shadow-sm py-2 px-4 rounded-xl transition-all flex items-center gap-1.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        
        {/* Summary Statistics Grid (Unified 4-columns Row) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Income Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md hover:scale-[1.01] transition-all">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Income</span>
              <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.28m5.94 2.28-2.28 5.941" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-800">
              ₹{data.income?.toLocaleString("en-IN") || 0}
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-emerald-500 text-xs font-bold">Total earnings</span>
            </div>
          </div>

          {/* Expense Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md hover:scale-[1.01] transition-all">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Expenses</span>
              <div className="bg-rose-50 text-rose-600 p-2.5 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6 9 12.75l4.306-4.307a11.95 11.95 0 0 1 5.814 5.519l2.74 1.22m0 0-5.94 2.281m5.94-2.28-2.28 5.941" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-800">
              ₹{data.expense?.toLocaleString("en-IN") || 0}
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-rose-500 text-xs font-bold">Total spending</span>
            </div>
          </div>

          {/* Savings Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md hover:scale-[1.01] transition-all">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Net Savings</span>
              <div className="bg-sky-50 text-sky-600 p-2.5 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-800">
              ₹{data.savings?.toLocaleString("en-IN") || 0}
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-sky-500 text-xs font-bold">Remaining balance</span>
            </div>
          </div>

          {/* Transactions Count Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md hover:scale-[1.01] transition-all">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Transactions</span>
              <div className="bg-violet-50 text-violet-600 p-2.5 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.007 8.25H3.75v-.008h.008V15Zm-.008 3h.008v.008H3.75V18Z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-800">
              {transactions.length}
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-violet-500 text-xs font-bold">Processed records</span>
            </div>
          </div>

        </div>

        {/* Dashboard Middle Section (2-Column Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* AI Insights (Left side, 2-span on large screen) */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="bg-indigo-50 text-indigo-600 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 21l8.982-11.861H13.62l.818-5.096L5.5 15.904h4.313Z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-slate-800">AI Coach Insights</h2>
            </div>

            {insights && insights.insights && insights.insights.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {insights.insights.map((item: string, index: number) => {
                  const isWarning = item.includes("⚠") || item.toLowerCase().includes("high") || item.toLowerCase().includes("limit");
                  return (
                    <div
                      key={index}
                      className={`flex gap-3 p-4 rounded-xl border transition-all ${
                        isWarning
                          ? "bg-amber-50/50 border-amber-100/80 text-amber-900"
                          : "bg-emerald-50/40 border-emerald-100/60 text-emerald-900"
                      }`}
                    >
                      <div className="mt-0.5">
                        {isWarning ? (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-amber-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-emerald-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold leading-relaxed">
                          {item.replace("⚠ ", "").replace("✅ ", "")}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <p className="text-sm text-slate-500 font-medium">No insights generated yet.</p>
                <p className="text-xs text-slate-400 mt-1">Upload a statements PDF to generate AI insights.</p>
              </div>
            )}
          </div>

          {/* Expense Breakdown & Chart (Right side, 1-span) */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-6">
                <div className="bg-rose-50 text-rose-600 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-slate-800">Expense Share</h2>
              </div>

              {chartData.length > 0 ? (
                <>
                  <div style={{ width: "100%", height: 180 }} className="relative flex justify-center items-center mb-4">
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={chartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={75}
                          innerRadius={50}
                          paddingAngle={3}
                        >
                          {chartData.map((_entry, index) => (
                            <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`₹${value}`, "Spent"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Spending Breakdown Badges */}
                  <div className="space-y-2.5">
                    {chartData.map((category, index) => {
                      const percentage = (category.value / (insights?.food + insights?.travel + insights?.shopping || 1)) * 100;
                      return (
                        <div key={category.name} className="flex flex-col gap-1">
                          <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: chartColors[index % chartColors.length] }}></span>
                              {category.name}
                            </span>
                            <span>₹{category.value?.toLocaleString("en-IN")} ({percentage.toFixed(0)}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5">
                            <div
                              className="h-1.5 rounded-full transition-all"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: chartColors[index % chartColors.length]
                              }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-sm text-slate-500 font-medium">No expenditure records.</p>
                  <p className="text-xs text-slate-400 mt-1">Check back once statement is processed.</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Transactions Table Section */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2.5">
              <div className="bg-indigo-50 text-indigo-600 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-slate-800">Recent Transactions</h2>
            </div>
            <span className="bg-indigo-50 text-indigo-700 text-xs font-extrabold px-3 py-1 rounded-full">
              {transactions.length} total
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="pb-3 pl-4">Description</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3 text-right pr-4">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-700">
                {transactions.length > 0 ? (
                  transactions.map((t) => {
                    const isIncome = t.transaction_type === "income" || t.category === "Income";
                    return (
                      <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 pl-4 font-semibold text-slate-800">{t.description}</td>
                        <td className="py-3.5">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            isIncome
                              ? "bg-emerald-50 text-emerald-700"
                              : t.category === "Food"
                              ? "bg-emerald-50 text-emerald-700"
                              : t.category === "Travel"
                              ? "bg-amber-50 text-amber-700"
                              : t.category === "Shopping"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-slate-100 text-slate-700"
                          }`}>
                            {t.category}
                          </span>
                        </td>
                        <td className={`py-3.5 text-right pr-4 font-extrabold ${isIncome ? "text-emerald-600" : "text-slate-800"}`}>
                          {isIncome ? "+" : "-"}₹{t.amount?.toLocaleString("en-IN") || 0}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center py-10 text-slate-400 font-medium">
                      No transaction records found. Try uploading a PDF statement.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Sleek Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full p-8 relative overflow-hidden animate-scale-up">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent inline-block">
                {authMode === "login" ? "Welcome Back" : "Create Account"}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                {authMode === "login" ? "Sign in to access your financial dashboard" : "Sign up to track and plan your budget"}
              </p>
            </div>

            {authError && (
              <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold p-3 rounded-xl mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-rose-500 flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === "signup" && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-slate-55 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-55 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-55 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isLoadingAuth}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3 rounded-xl shadow-md shadow-indigo-100 hover:shadow-lg transition-all text-sm mt-2 flex items-center justify-center"
              >
                {isLoadingAuth ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : authMode === "login" ? (
                  "Sign In"
                ) : (
                  "Register Account"
                )}
              </button>
            </form>

            <div className="text-center mt-6">
              <button
                onClick={() => {
                  setAuthMode(authMode === "login" ? "signup" : "login");
                  setAuthError("");
                }}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-bold transition-all"
              >
                {authMode === "login" ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;