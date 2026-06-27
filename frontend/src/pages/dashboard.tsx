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

  // Budgets state
  const [budgets, setBudgets] = useState<any[]>([]);
  const [budgetCategory, setBudgetCategory] = useState("Food");
  const [budgetAmount, setBudgetAmount] = useState("");

  // AI Chatbot state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([
    {
      sender: "ai",
      text: "Hello! I am your AI Financial Coach. Ask me anything about your budgets, transactions, or saving habits!"
    }
  ]);

  // Transaction CRUD state
  const [showTxModal, setShowTxModal] = useState(false);
  const [txModalMode, setTxModalMode] = useState<"add" | "edit">("add");
  const [selectedTxId, setSelectedTxId] = useState<number | null>(null);
  const [txDescription, setTxDescription] = useState("");
  const [txAmount, setTxAmount] = useState("");
  const [txCategory, setTxCategory] = useState("Shopping");
  const [txType, setTxType] = useState("expense");
  const [txDate, setTxDate] = useState(new Date().toISOString().split("T")[0]);

  // Transaction Filters state
  const [filterSearch, setFilterSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterType, setFilterType] = useState("All");

  // Theme state
  const [theme, setTheme] = useState<"light" | "dark">("light");

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

  const loadData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setData({ income: 0, expense: 0, savings: 0, total_transactions: 0 });
      setTransactions([]);
      setInsights({ food: 0, travel: 0, shopping: 0, insights: [] });
      setBudgets([]);
      return;
    }

    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`
    };

    try {
      const dashboardRes = await fetch("http://127.0.0.1:8000/dashboard", { headers });
      if (dashboardRes.ok) {
        const dashboardData = await dashboardRes.json();
        setData(dashboardData);
      } else if (dashboardRes.status === 401) {
        localStorage.removeItem("token");
        setUserEmail(null);
        setData({ income: 0, expense: 0, savings: 0, total_transactions: 0 });
        setTransactions([]);
        setInsights({ food: 0, travel: 0, shopping: 0, insights: [] });
        setBudgets([]);
        return;
      }

      const txRes = await fetch("http://127.0.0.1:8000/transactions", { headers });
      if (txRes.ok) {
        const txData = await txRes.json();
        setTransactions(txData);
      } else {
        setTransactions([]);
      }

      const insightsRes = await fetch("http://127.0.0.1:8000/insights", { headers });
      if (insightsRes.ok) {
        const insightsData = await insightsRes.json();
        setInsights(insightsData);
      } else {
        setInsights({ food: 0, travel: 0, shopping: 0, insights: [] });
      }

      const budgetsRes = await fetch("http://127.0.0.1:8000/budgets", { headers });
      if (budgetsRes.ok) {
        const budgetsData = await budgetsRes.json();
        setBudgets(budgetsData);
      } else {
        setBudgets([]);
      }
    } catch (err) {
      console.error("Error fetching financial data:", err);
      setData({ income: 0, expense: 0, savings: 0, total_transactions: 0 });
      setTransactions([]);
      setInsights({ food: 0, travel: 0, shopping: 0, insights: [] });
      setBudgets([]);
    }
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
    
    // Load local storage theme configuration
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

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
    loadData();
  };

  // Budgets Forms
  const handleBudgetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!budgetAmount || parseFloat(budgetAmount) <= 0) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://127.0.0.1:8000/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify({ category: budgetCategory, amount: parseFloat(budgetAmount) })
      });
      if (res.ok) {
        alert("Budget target saved successfully!");
        setBudgetAmount("");
        loadData();
      }
    } catch (err) {
      console.error("Error setting budget:", err);
    }
  };

  const handleBudgetDelete = async (budgetId: number) => {
    if (!confirm("Are you sure you want to delete this budget target?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://127.0.0.1:8000/budgets/${budgetId}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : ""
        }
      });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error("Error deleting budget:", err);
    }
  };

  // Chatbot Actions
  const sendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setChatLoading(true);

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { sender: "ai", text: data.response }]);
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, { sender: "ai", text: "Sorry, I encountered an issue connecting to the AI Coach." }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Transaction CRUD Actions
  const handleTxSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txDescription || !txAmount) return;

    const payload = {
      description: txDescription,
      amount: parseFloat(txAmount),
      category: txCategory,
      transaction_type: txType,
      transaction_date: txDate
    };

    const token = localStorage.getItem("token");
    const url = txModalMode === "add" 
      ? "http://127.0.0.1:8000/transactions"
      : `http://127.0.0.1:8000/transactions/${selectedTxId}`;
    const method = txModalMode === "add" ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert(`Transaction ${txModalMode === "add" ? "added" : "updated"} successfully!`);
        setShowTxModal(false);
        setTxDescription("");
        setTxAmount("");
        setTxCategory("Shopping");
        setTxType("expense");
        setTxDate(new Date().toISOString().split("T")[0]);
        loadData();
      }
    } catch (err) {
      console.error("Error submitting transaction:", err);
    }
  };

  const handleTxDelete = async (txId: number) => {
    if (!confirm("Are you sure you want to delete this transaction record?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://127.0.0.1:8000/transactions/${txId}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : ""
        }
      });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error("Error deleting transaction:", err);
    }
  };

  const openEditTxModal = (tx: any) => {
    setSelectedTxId(tx.id);
    setTxDescription(tx.description);
    setTxAmount(tx.amount.toString());
    setTxCategory(tx.category);
    setTxType(tx.transaction_type);
    setTxDate(tx.transaction_date);
    setTxModalMode("edit");
    setShowTxModal(true);
  };

  // Client-side filtering of transactions list
  const filteredTransactions = transactions.filter(t => {
    const matchSearch = t.description.toLowerCase().includes(filterSearch.toLowerCase());
    const matchCategory = filterCategory === "All" || t.category === filterCategory;
    const matchType = filterType === "All" || t.transaction_type === filterType;
    return matchSearch && matchCategory && matchType;
  });

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mb-4"></div>
        <p className="text-slate-650 dark:text-slate-400 font-medium text-lg">Loading Financial Workspace...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans antialiased text-slate-900 dark:text-slate-100 pb-12 transition-colors duration-300">
      {/* Navbar */}
      <nav className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-850 px-6 py-4 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-md shadow-indigo-200 dark:shadow-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h16.5M5.25 7.5h13.5m-12 9a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3m-9 0h9" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Finance AI Coach
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Smart Automated Budgeting</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2 rounded-xl border border-slate-250 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-350 cursor-pointer"
              title="Toggle theme"
            >
              {theme === "light" ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4.5 h-4.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4.5 h-4.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M9.75 15h4.5m-4.5-6h4.5m-7.364-3.636 1.591 1.591m8.546 8.546 1.591 1.591M3 12h2.25m13.5 0H21M5.757 18.243l1.591-1.591m8.546-8.546 1.591-1.591M12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z" />
                </svg>
              )}
            </button>

            {/* Upload Statement Area */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <input
                id="file-upload-input"
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setFile(e.target.files[0]);
                  }
                }}
                className="text-xs text-slate-650 dark:text-slate-300 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-white dark:file:bg-slate-800 file:text-indigo-600 dark:file:text-indigo-400 hover:file:bg-indigo-50 dark:hover:file:bg-slate-750 cursor-pointer max-w-[200px]"
              />
              <button
                onClick={uploadStatement}
                disabled={isUploading}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-bold py-1.5 px-4 rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
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
                <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 rounded-xl px-3 py-1.5 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 max-w-[150px] truncate" title={userEmail}>
                    {userEmail}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs text-rose-600 dark:text-rose-450 hover:text-rose-700 dark:hover:text-rose-400 font-bold border border-rose-200 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950/30 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
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
                className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-slate-200 dark:border-slate-800 shadow-sm py-2 px-4 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
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
        
        {/* Summary Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Income Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm p-6 hover:shadow-md hover:scale-[1.01] transition-all">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Income</span>
              <div className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-450 p-2.5 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.28m5.94 2.28-2.28 5.941" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
              ₹{data.income?.toLocaleString("en-IN") || 0}
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-emerald-500 dark:text-emerald-400 text-xs font-bold">Total earnings</span>
            </div>
          </div>

          {/* Expense Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm p-6 hover:shadow-md hover:scale-[1.01] transition-all">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Expenses</span>
              <div className="bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-450 p-2.5 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6 9 12.75l4.306-4.307a11.95 11.95 0 0 1 5.814 5.519l2.74 1.22m0 0-5.94 2.281m5.94-2.28-2.28 5.941" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
              ₹{data.expense?.toLocaleString("en-IN") || 0}
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-rose-500 dark:text-rose-400 text-xs font-bold">Total spending</span>
            </div>
          </div>

          {/* Savings Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm p-6 hover:shadow-md hover:scale-[1.01] transition-all">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Net Savings</span>
              <div className="bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-450 p-2.5 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
              ₹{data.savings?.toLocaleString("en-IN") || 0}
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-sky-500 dark:text-sky-400 text-xs font-bold">Remaining balance</span>
            </div>
          </div>

          {/* Transactions Count Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm p-6 hover:shadow-md hover:scale-[1.01] transition-all">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Transactions</span>
              <div className="bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-450 p-2.5 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.007 8.25H3.75v-.008h.008V15Zm-.008 3h.008v.008H3.75V18Z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
              {transactions.length}
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-violet-500 dark:text-violet-400 text-xs font-bold">Processed records</span>
            </div>
          </div>

        </div>

        {/* Dashboard Middle Section (3-Column Layout: Insights, Expense Share, Budgets) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* AI Insights (Left side, Column 1) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-6">
                <div className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 21l8.982-11.861H13.62l.818-5.096L5.5 15.904h4.313Z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">AI Coach Insights</h2>
              </div>

              {insights && insights.insights && insights.insights.length > 0 ? (
                <div className="space-y-4">
                  {insights.insights.map((item: string, index: number) => {
                    const isWarning = item.includes("⚠") || item.toLowerCase().includes("high") || item.toLowerCase().includes("limit");
                    return (
                      <div
                        key={index}
                        className={`flex gap-3 p-4 rounded-xl border transition-all ${
                          isWarning
                            ? "bg-amber-50/50 dark:bg-amber-950/20 border-amber-100/80 dark:border-amber-900/40 text-amber-900 dark:text-amber-300"
                            : "bg-emerald-50/40 dark:bg-emerald-950/10 border-emerald-100/60 dark:border-emerald-900/30 text-emerald-900 dark:text-emerald-300"
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
                <div className="flex flex-col items-center justify-center py-10 bg-slate-50/50 dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">No insights generated yet.</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 text-center">Upload statements or log entries to trigger analysis.</p>
                </div>
              )}
            </div>
          </div>

          {/* Expense Share & Chart (Middle column, Column 2) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-6">
                <div className="bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-450 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Expense Share</h2>
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
                          <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: chartColors[index % chartColors.length] }}></span>
                              {category.name}
                            </span>
                            <span>₹{category.value?.toLocaleString("en-IN")} ({percentage.toFixed(0)}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-850 rounded-full h-1.5">
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
                <div className="flex flex-col items-center justify-center py-16 bg-slate-50/50 dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">No expenditure records.</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Check back once statement is processed.</p>
                </div>
              )}
            </div>
          </div>

          {/* Category Budgets Card (Right side, Column 3) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-6">
                <div className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-450 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Category Budgets</h2>
              </div>

              {budgets.length > 0 ? (
                <div className="space-y-4 mb-6">
                  {budgets.map((b) => {
                    const categorySpent = transactions
                      .filter(t => t.category === b.category && t.transaction_type === "expense")
                      .reduce((sum, t) => sum + t.amount, 0);
                    const percentage = Math.min((categorySpent / b.amount) * 100, 100);
                    const isExceeded = categorySpent > b.amount;
                    const isClose = categorySpent > b.amount * 0.8 && !isExceeded;
                    
                    return (
                      <div key={b.id} className="group flex flex-col gap-1">
                        <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-350">
                          <span className="flex items-center gap-1.5">
                            {b.category}
                            <button
                              onClick={() => handleBudgetDelete(b.id)}
                              className="opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-600 transition-all font-bold ml-1 cursor-pointer"
                              title="Delete Budget"
                            >
                              ✕
                            </button>
                          </span>
                          <span>
                            ₹{categorySpent.toLocaleString("en-IN")} / ₹{b.amount.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-850 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              isExceeded 
                                ? "bg-rose-500" 
                                : isClose 
                                ? "bg-amber-500" 
                                : "bg-emerald-500"
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 bg-slate-50/50 dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 mb-6">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">No budgets defined.</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Use the form below to set target limits.</p>
                </div>
              )}

              {userEmail && (
                <form onSubmit={handleBudgetSubmit} className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-xl p-3">
                  <p className="text-xs font-extrabold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Set Category Budget</p>
                  <div className="flex gap-2">
                    <select
                      value={budgetCategory}
                      onChange={(e) => setBudgetCategory(e.target.value)}
                      className="text-xs w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1.5 focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-200 cursor-pointer"
                    >
                      <option value="Food">Food</option>
                      <option value="Travel">Travel</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Fuel">Fuel</option>
                      <option value="UPI">UPI</option>
                      <option value="Cash">Cash</option>
                      <option value="Income">Income</option>
                      <option value="Others">Others</option>
                    </select>
                    <input
                      type="number"
                      required
                      value={budgetAmount}
                      onChange={(e) => setBudgetAmount(e.target.value)}
                      placeholder="Amount"
                      className="text-xs w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1.5 focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-200"
                    />
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm cursor-pointer transition-all"
                    >
                      Save
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* Transactions Table Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm p-6 transition-colors">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2.5">
              <div className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Transaction History</h2>
            </div>
            <span className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-extrabold px-3 py-1 rounded-full">
              {filteredTransactions.length} of {transactions.length} total
            </span>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search descriptions..."
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-200 w-full sm:w-48"
              />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="Income">Income</option>
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Shopping">Shopping</option>
                <option value="Fuel">Fuel</option>
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
                <option value="Others">Others</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                <option value="All">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            
            {userEmail && (
              <button
                onClick={() => {
                  setTxModalMode("add");
                  setTxDescription("");
                  setTxAmount("");
                  setTxCategory("Shopping");
                  setTxType("expense");
                  setTxDate(new Date().toISOString().split("T")[0]);
                  setShowTxModal(true);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer w-full sm:w-auto justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add Transaction
              </button>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="pb-3 pl-4">Date</th>
                  <th className="pb-3">Description</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3 text-right pr-4">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-850 text-sm font-medium text-slate-755 dark:text-slate-300">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((t) => {
                    const isIncome = t.transaction_type === "income" || t.category === "Income";
                    return (
                      <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors group">
                        <td className="py-3.5 pl-4 text-xs text-slate-550 dark:text-slate-400">{t.transaction_date}</td>
                        <td className="py-3.5 font-semibold text-slate-800 dark:text-slate-200">{t.description}</td>
                        <td className="py-3.5">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            isIncome
                              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400"
                              : t.category === "Food"
                              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400"
                              : t.category === "Travel"
                              ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400"
                              : t.category === "Shopping"
                              ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-350"
                          }`}>
                            {t.category}
                          </span>
                        </td>
                        <td className={`py-3.5 text-right pr-4 font-extrabold ${isIncome ? "text-emerald-600 dark:text-emerald-450" : "text-slate-800 dark:text-slate-200"}`}>
                          <span className="mr-4">{isIncome ? "+" : "-"}₹{t.amount?.toLocaleString("en-IN") || 0}</span>
                          
                          {/* Row actions */}
                          {userEmail && (
                            <span className="inline-flex gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => openEditTxModal(t)}
                                className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                                title="Edit Record"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.128-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleTxDelete(t.id)}
                                className="text-slate-400 hover:text-rose-600 cursor-pointer"
                                title="Delete Record"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.34 9m-4.72 0-.34-9m9.03-3.03a17.902 17.902 0 0 1-1.07 3.5M18.13 6a22.09 22.09 0 0 0-1.85-.3M14.74 9a22.38 22.38 0 0 0-5.48 0M10.5 6.857V5.07c0-.704.57-1.286 1.27-1.286h2.46c.7 0 1.27.582 1.27 1.286v1.787M3.75 6a17.925 17.925 0 0 1 1.07-3.5M6.37 6a22.09 22.09 0 0 1 1.85-.3M6.37 6a22.38 22.38 0 0 1 5.48 0" />
                                </svg>
                              </button>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-10 text-slate-400 dark:text-slate-500 font-medium">
                      No matching transaction records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Floating Chatbot Bubble & Widget */}
      {userEmail && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 duration-200 flex items-center justify-center cursor-pointer"
          >
            {chatOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0Zm4.5 0a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0Zm4.5 0a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              </svg>
            )}
          </button>

          {chatOpen && (
            <div className="absolute bottom-16 right-0 w-80 md:w-96 h-[450px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-scale-up">
              <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-4 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="font-extrabold text-sm">Finance AI Coach</span>
                </div>
                <button onClick={() => setChatOpen(false)} className="text-white/80 hover:text-white cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-950/20 text-xs">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${
                        msg.sender === "user"
                          ? "bg-indigo-600 text-white rounded-tr-none"
                          : "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none"
                      }`}
                    >
                      <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl rounded-tl-none p-3 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce delay-75"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce delay-150"></span>
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={sendChatMessage} className="p-3 border-t border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2">
                <input
                  type="text"
                  required
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask Coach about your expenses..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-550 text-slate-800 dark:text-slate-100"
                />
                <button
                  type="submit"
                  disabled={chatLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-3.5 rounded-xl flex items-center justify-center shadow-sm cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                  </svg>
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Transaction Add/Edit Modal */}
      {showTxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 max-w-md w-full p-8 relative overflow-hidden animate-scale-up">
            <button
              onClick={() => setShowTxModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850 p-1.5 rounded-lg transition-all cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent inline-block font-sans">
                {txModalMode === "add" ? "Add Transaction" : "Edit Transaction"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                {txModalMode === "add" ? "Record a new financial entry manually" : "Modify existing transaction details"}
              </p>
            </div>

            <form onSubmit={handleTxSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
                <input
                  type="text"
                  required
                  value={txDescription}
                  onChange={(e) => setTxDescription(e.target.value)}
                  placeholder="e.g. Grocery Store"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-850 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Amount (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    placeholder="250.00"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-850 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Date</label>
                  <input
                    type="date"
                    required
                    value={txDate}
                    onChange={(e) => setTxDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-850 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Category</label>
                  <select
                    value={txCategory}
                    onChange={(e) => setTxCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-850 dark:text-slate-100 cursor-pointer"
                  >
                    <option value="Shopping">Shopping</option>
                    <option value="Food">Food</option>
                    <option value="Travel">Travel</option>
                    <option value="Fuel">Fuel</option>
                    <option value="UPI">UPI</option>
                    <option value="Cash">Cash</option>
                    <option value="Income">Income</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Type</label>
                  <select
                    value={txType}
                    onChange={(e) => setTxType(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-855 dark:text-slate-100 cursor-pointer"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all text-sm mt-4 flex items-center justify-center cursor-pointer"
              >
                {txModalMode === "add" ? "Create Record" : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Sleek Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 max-w-md w-full p-8 relative overflow-hidden animate-scale-up">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-850 p-1.5 rounded-lg transition-all cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent inline-block font-sans">
                {authMode === "login" ? "Welcome Back" : "Create Account"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                {authMode === "login" ? "Sign in to access your financial dashboard" : "Sign up to track and plan your budget"}
              </p>
            </div>

            {authError && (
              <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs font-semibold p-3 rounded-xl mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-rose-500 flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === "signup" && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                />
              </div>

              <button
                type="submit"
                disabled={isLoadingAuth}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3 rounded-xl shadow-md shadow-indigo-100 hover:shadow-lg transition-all text-sm mt-2 flex items-center justify-center cursor-pointer"
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
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-bold transition-all cursor-pointer"
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