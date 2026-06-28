import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
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

  // New Features States
  const [activeTab, setActiveTab] = useState<"overview" | "goals" | "subscriptions" | "accounts" | "calendar" | "splits" | "tax" | "planner" | "achievements">("overview");
  const [trendsData, setTrendsData] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [detectedSubs, setDetectedSubs] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [splits, setSplits] = useState<any[]>([]);
  const [healthScore, setHealthScore] = useState<any>(null);
  // Feature 1: Alerts
  const [alertsData, setAlertsData] = useState<any>(null);
  const [showAlertsPanel, setShowAlertsPanel] = useState(false);
  // Feature 3: Tax Estimator
  const [taxData, setTaxData] = useState<any>(null);
  // Feature 4: Budget Planner
  const [budgetPlan, setBudgetPlan] = useState<any>(null);
  const [applyingPlan, setApplyingPlan] = useState(false);
  // Feature 5: Net Worth
  const [netWorth, setNetWorth] = useState<any>(null);
  // Feature 6: Payment Reminders
  const [reminders, setReminders] = useState<any[]>([]);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderName, setReminderName] = useState("");
  const [reminderAmount, setReminderAmount] = useState("");
  const [reminderDueDate, setReminderDueDate] = useState(new Date().toISOString().split("T")[0]);
  const [reminderCategory, setReminderCategory] = useState("Others");
  // Feature 7: Auto-Categorize
  const [autoCatResult, setAutoCatResult] = useState<any>(null);
  const [isAutoCatting, setIsAutoCatting] = useState(false);
  // Feature 8: Heatmap
  const [heatmapData, setHeatmapData] = useState<any>(null);
  // Feature 9: Gamification
  const [gamificationData, setGamificationData] = useState<any>(null);

  // Bill Calendar State
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  // Accounts Modal and Form
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [accountModalMode, setAccountModalMode] = useState<"add" | "edit">("add");
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const [accountName, setAccountName] = useState("");
  const [accountType, setAccountType] = useState("Bank");
  const [accountBalance, setAccountBalance] = useState("0");

  // Splits Modal and Form
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [splitDescription, setSplitDescription] = useState("");
  const [splitTotal, setSplitTotal] = useState("");
  const [splitFriend, setSplitFriend] = useState("");
  const [splitOwed, setSplitOwed] = useState("");

  // Savings Goals Modals and Forms
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalModalMode, setGoalModalMode] = useState<"add" | "edit">("add");
  const [selectedGoalId, setSelectedGoalId] = useState<number | null>(null);
  const [goalName, setGoalName] = useState("");
  const [goalTargetAmount, setGoalTargetAmount] = useState("");
  const [goalCurrentAmount, setGoalCurrentAmount] = useState("0");
  const [goalTargetDate, setGoalTargetDate] = useState(new Date().toISOString().split("T")[0]);

  // Subscriptions Modals and Forms
  const [showSubModal, setShowSubModal] = useState(false);
  const [subModalMode, setSubModalMode] = useState<"add" | "edit">("add");
  const [selectedSubId, setSelectedSubId] = useState<number | null>(null);
  const [subName, setSubName] = useState("");
  const [subAmount, setSubAmount] = useState("");
  const [subCategory, setSubCategory] = useState("Others");
  const [subBillingCycle, setSubBillingCycle] = useState("Monthly");
  const [subNextDueDate, setSubNextDueDate] = useState(new Date().toISOString().split("T")[0]);

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
      setTrendsData([]);
      setGoals([]);
      setSubscriptions([]);
      setDetectedSubs([]);
      setAccounts([]);
      setSplits([]);
      setHealthScore(null);
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
        setTrendsData([]);
        setGoals([]);
        setSubscriptions([]);
        setDetectedSubs([]);
        setAccounts([]);
        setSplits([]);
        setHealthScore(null);
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

      // Fetch trends data
      const trendsRes = await fetch("http://127.0.0.1:8000/analytics/trends", { headers });
      if (trendsRes.ok) {
        const trends = await trendsRes.json();
        setTrendsData(trends);
      } else {
        setTrendsData([]);
      }

      // Fetch savings goals
      const goalsRes = await fetch("http://127.0.0.1:8000/goals", { headers });
      if (goalsRes.ok) {
        const goalsData = await goalsRes.json();
        setGoals(goalsData);
      } else {
        setGoals([]);
      }

      // Fetch subscriptions
      const subsRes = await fetch("http://127.0.0.1:8000/subscriptions", { headers });
      if (subsRes.ok) {
        const subsData = await subsRes.json();
        setSubscriptions(subsData);
      } else {
        setSubscriptions([]);
      }

      // Fetch auto-detected subscriptions
      const detectRes = await fetch("http://127.0.0.1:8000/subscriptions/detect", { headers });
      if (detectRes.ok) {
        const detectData = await detectRes.json();
        setDetectedSubs(detectData);
      } else {
        setDetectedSubs([]);
      }

      // Fetch accounts
      const accountsRes = await fetch("http://127.0.0.1:8000/accounts/", { headers });
      if (accountsRes.ok) {
        setAccounts(await accountsRes.json());
      } else {
        setAccounts([]);
      }

      // Fetch splits
      const splitsRes = await fetch("http://127.0.0.1:8000/splits/", { headers });
      if (splitsRes.ok) {
        setSplits(await splitsRes.json());
      } else {
        setSplits([]);
      }

      // Fetch health score
      const healthRes = await fetch("http://127.0.0.1:8000/analytics/health-score", { headers });
      if (healthRes.ok) {
        setHealthScore(await healthRes.json());
      } else {
        setHealthScore(null);
      }

      // Fetch alerts
      const alertsRes = await fetch("http://127.0.0.1:8000/alerts", { headers });
      if (alertsRes.ok) setAlertsData(await alertsRes.json());

      // Fetch tax estimate
      const taxRes = await fetch("http://127.0.0.1:8000/tax/estimate", { headers });
      if (taxRes.ok) setTaxData(await taxRes.json());

      // Fetch budget plan
      const planRes = await fetch("http://127.0.0.1:8000/budget/plan", { headers });
      if (planRes.ok) setBudgetPlan(await planRes.json());

      // Fetch net worth
      const nwRes = await fetch("http://127.0.0.1:8000/networth", { headers });
      if (nwRes.ok) setNetWorth(await nwRes.json());

      // Fetch payment reminders
      const remRes = await fetch("http://127.0.0.1:8000/reminders", { headers });
      if (remRes.ok) setReminders(await remRes.json());
      else setReminders([]);

      // Fetch spending heatmap
      const hmRes = await fetch("http://127.0.0.1:8000/analytics/daily-spend", { headers });
      if (hmRes.ok) setHeatmapData(await hmRes.json());

      // Fetch gamification stats
      const gameRes = await fetch("http://127.0.0.1:8000/gamification/stats", { headers });
      if (gameRes.ok) setGamificationData(await gameRes.json());

    } catch (err) {
      console.error("Error fetching financial data:", err);
      setData({ income: 0, expense: 0, savings: 0, total_transactions: 0 });
      setTransactions([]);
      setInsights({ food: 0, travel: 0, shopping: 0, insights: [] });
      setBudgets([]);
      setTrendsData([]);
      setGoals([]);
      setSubscriptions([]);
      setDetectedSubs([]);
      setAccounts([]);
      setSplits([]);
      setHealthScore(null);
      setAlertsData(null);
      setTaxData(null);
      setBudgetPlan(null);
      setNetWorth(null);
      setReminders([]);
      setHeatmapData(null);
      setGamificationData(null);
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
    setTrendsData([]);
    setGoals([]);
    setSubscriptions([]);
    setDetectedSubs([]);
    setAccounts([]);
    setSplits([]);
    setHealthScore(null);
    setAlertsData(null);
    setTaxData(null);
    setBudgetPlan(null);
    setNetWorth(null);
    setReminders([]);
    setHeatmapData(null);
    setGamificationData(null);
    loadData();
  };

  // Payment Reminder Actions
  const handleReminderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderName || !reminderAmount || !reminderDueDate) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://127.0.0.1:8000/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
        body: JSON.stringify({ name: reminderName, amount: parseFloat(reminderAmount), due_date: reminderDueDate, category: reminderCategory })
      });
      if (res.ok) {
        setShowReminderModal(false);
        setReminderName(""); setReminderAmount(""); setReminderCategory("Others");
        loadData();
      }
    } catch (err) { console.error(err); }
  };

  const handleReminderPay = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://127.0.0.1:8000/reminders/${id}/pay`, {
        method: "PUT",
        headers: { Authorization: token ? `Bearer ${token}` : "" }
      });
      loadData();
    } catch (err) { console.error(err); }
  };

  const handleReminderDelete = async (id: number) => {
    if (!confirm("Delete this reminder?")) return;
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://127.0.0.1:8000/reminders/${id}`, {
        method: "DELETE",
        headers: { Authorization: token ? `Bearer ${token}` : "" }
      });
      loadData();
    } catch (err) { console.error(err); }
  };

  // Auto-Categorize Action
  const handleAutoCategorize = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setIsAutoCatting(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/transactions/auto-categorize", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      setAutoCatResult(result);
      loadData();
    } catch (err) { console.error(err); }
    finally { setIsAutoCatting(false); }
  };

  // Apply Budget Plan Action
  const handleApplyBudgetPlan = async () => {
    if (!budgetPlan || !budgetPlan.plan) return;
    const token = localStorage.getItem("token");
    if (!confirm(`Apply suggested budgets for ${budgetPlan.plan.length} categories? This will create new budget entries.`)) return;
    setApplyingPlan(true);
    try {
      for (const item of budgetPlan.plan) {
        if (item.suggested_budget > 0) {
          await fetch("http://127.0.0.1:8000/budgets", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
            body: JSON.stringify({ category: item.category, amount: item.suggested_budget })
          });
        }
      }
      alert("Budget plan applied successfully!");
      loadData();
    } catch (err) { console.error(err); }
    finally { setApplyingPlan(false); }
  };

  // Savings Goals Actions
  const handleGoalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalName || !goalTargetAmount) return;
    const token = localStorage.getItem("token");
    const payload = {
      name: goalName,
      target_amount: parseFloat(goalTargetAmount),
      current_amount: parseFloat(goalCurrentAmount || "0"),
      target_date: goalTargetDate
    };
    const url = goalModalMode === "add"
      ? "http://127.0.0.1:8000/goals"
      : `http://127.0.0.1:8000/goals/${selectedGoalId}`;
    const method = goalModalMode === "add" ? "POST" : "PUT";
    
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
        setShowGoalModal(false);
        setGoalName("");
        setGoalTargetAmount("");
        setGoalCurrentAmount("0");
        setGoalTargetDate(new Date().toISOString().split("T")[0]);
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoalDelete = async (goalId: number) => {
    if (!confirm("Are you sure you want to delete this savings goal?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://127.0.0.1:8000/goals/${goalId}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : ""
        }
      });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openEditGoalModal = (g: any) => {
    setSelectedGoalId(g.id);
    setGoalName(g.name);
    setGoalTargetAmount(g.target_amount.toString());
    setGoalCurrentAmount(g.current_amount.toString());
    setGoalTargetDate(g.target_date);
    setGoalModalMode("edit");
    setShowGoalModal(true);
  };

  // Subscriptions Actions
  const handleSubSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName || !subAmount || !subNextDueDate) return;
    const token = localStorage.getItem("token");
    const payload = {
      name: subName,
      amount: parseFloat(subAmount),
      category: subCategory,
      billing_cycle: subBillingCycle,
      next_due_date: subNextDueDate
    };
    const url = subModalMode === "add"
      ? "http://127.0.0.1:8000/subscriptions"
      : `http://127.0.0.1:8000/subscriptions/${selectedSubId}`;
    const method = subModalMode === "add" ? "POST" : "PUT";
    
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
        setShowSubModal(false);
        setSubName("");
        setSubAmount("");
        setSubCategory("Others");
        setSubBillingCycle("Monthly");
        setSubNextDueDate(new Date().toISOString().split("T")[0]);
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubDelete = async (subId: number) => {
    if (!confirm("Are you sure you want to remove this subscription?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://127.0.0.1:8000/subscriptions/${subId}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : ""
        }
      });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openEditSubModal = (s: any) => {
    setSelectedSubId(s.id);
    setSubName(s.name);
    setSubAmount(s.amount.toString());
    setSubCategory(s.category);
    setSubBillingCycle(s.billing_cycle);
    setSubNextDueDate(s.next_due_date);
    setSubModalMode("edit");
    setShowSubModal(true);
  };

  const acceptDetectedSub = async (detected: any) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://127.0.0.1:8000/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify(detected)
      });
      if (res.ok) {
        alert(`${detected.name} added to subscriptions successfully!`);
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Accounts Actions
  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountName) return;
    const token = localStorage.getItem("token");
    const payload = { name: accountName, account_type: accountType, balance: parseFloat(accountBalance || "0") };
    const url = accountModalMode === "add"
      ? "http://127.0.0.1:8000/accounts/"
      : `http://127.0.0.1:8000/accounts/${selectedAccountId}`;
    const method = accountModalMode === "add" ? "POST" : "PUT";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowAccountModal(false);
        setAccountName(""); setAccountType("Bank"); setAccountBalance("0");
        loadData();
      }
    } catch (err) { console.error(err); }
  };

  const handleAccountDelete = async (id: number) => {
    if (!confirm("Delete this account?")) return;
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://127.0.0.1:8000/accounts/${id}`, {
        method: "DELETE",
        headers: { Authorization: token ? `Bearer ${token}` : "" }
      });
      loadData();
    } catch (err) { console.error(err); }
  };

  const openEditAccountModal = (a: any) => {
    setSelectedAccountId(a.id);
    setAccountName(a.name);
    setAccountType(a.account_type);
    setAccountBalance(a.balance.toString());
    setAccountModalMode("edit");
    setShowAccountModal(true);
  };

  // Splits Actions
  const handleSplitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!splitDescription || !splitTotal || !splitFriend || !splitOwed) return;
    const token = localStorage.getItem("token");
    const payload = {
      description: splitDescription,
      total_amount: parseFloat(splitTotal),
      friend_name: splitFriend,
      amount_owed: parseFloat(splitOwed)
    };
    try {
      const res = await fetch("http://127.0.0.1:8000/splits/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowSplitModal(false);
        setSplitDescription(""); setSplitTotal(""); setSplitFriend(""); setSplitOwed("");
        loadData();
      }
    } catch (err) { console.error(err); }
  };

  const handleSplitSettle = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://127.0.0.1:8000/splits/${id}/settle`, {
        method: "PUT",
        headers: { Authorization: token ? `Bearer ${token}` : "" }
      });
      loadData();
    } catch (err) { console.error(err); }
  };

  const handleSplitDelete = async (id: number) => {
    if (!confirm("Delete this split record?")) return;
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://127.0.0.1:8000/splits/${id}`, {
        method: "DELETE",
        headers: { Authorization: token ? `Bearer ${token}` : "" }
      });
      loadData();
    } catch (err) { console.error(err); }
  };

  // CSV Export
  const handleCSVExport = () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const url = `http://127.0.0.1:8000/reports/csv`;
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", "finance_report.csv");
    // Add auth by creating a fetch with blob (streaming with auth header)
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.blob())
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        a.href = blobUrl;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch(err => console.error("CSV export error:", err));
  };

  // Calendar Helpers
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
  const getSubscriptionDueDates = () => {
    const dueDays: Record<number, string[]> = {};
    subscriptions.forEach(s => {
      if (s.next_due_date) {
        const d = new Date(s.next_due_date);
        if (d.getFullYear() === calendarMonth.getFullYear() && d.getMonth() === calendarMonth.getMonth()) {
          const day = d.getDate();
          if (!dueDays[day]) dueDays[day] = [];
          dueDays[day].push(s.name);
        }
      }
    });
    return dueDays;
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
                {/* Alerts Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowAlertsPanel(!showAlertsPanel)}
                    className="relative p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-300 cursor-pointer"
                    title="Smart Alerts"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                    </svg>
                    {alertsData && alertsData.critical_count > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">
                        {alertsData.critical_count}
                      </span>
                    )}
                    {alertsData && alertsData.critical_count === 0 && alertsData.warning_count > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                        {alertsData.warning_count}
                      </span>
                    )}
                  </button>
                  {/* Alerts Dropdown Panel */}
                  {showAlertsPanel && alertsData && (
                    <div className="absolute right-0 top-12 w-96 max-h-[480px] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">🔔 Smart Alerts</h3>
                        <button onClick={() => setShowAlertsPanel(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer text-lg leading-none">×</button>
                      </div>
                      <div className="space-y-2">
                        {alertsData.alerts.map((alert: any, i: number) => (
                          <div key={i} className={`p-3 rounded-xl text-xs font-medium border ${
                            alert.type === "critical" ? "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300" :
                            alert.type === "warning" ? "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300" :
                            "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
                          }`}>
                            <p className="font-bold mb-0.5">{alert.icon} {alert.title}</p>
                            <p className="opacity-80">{alert.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
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
        
        {/* Tab Switcher */}
        {userEmail && (
          <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 gap-4 overflow-x-auto whitespace-nowrap scrollbar-none">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "overview"
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                  : "border-transparent text-slate-455 dark:text-slate-500 hover:text-slate-650 dark:hover:text-slate-350"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("goals")}
              className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "goals"
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                  : "border-transparent text-slate-455 dark:text-slate-500 hover:text-slate-655 dark:hover:text-slate-350"
              }`}
            >
              🎯 Savings Goals ({goals.length})
            </button>
            <button
              onClick={() => setActiveTab("subscriptions")}
              className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "subscriptions"
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                  : "border-transparent text-slate-455 dark:text-slate-500 hover:text-slate-655 dark:hover:text-slate-350"
              }`}
            >
              📅 Subscriptions & Bills ({subscriptions.length})
            </button>
            <button
              onClick={() => setActiveTab("accounts")}
              className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "accounts"
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                  : "border-transparent text-slate-455 dark:text-slate-500 hover:text-slate-655 dark:hover:text-slate-350"
              }`}
            >
              💳 Wallets & Accounts ({accounts.length})
            </button>
            <button
              onClick={() => setActiveTab("calendar")}
              className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "calendar"
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                  : "border-transparent text-slate-455 dark:text-slate-500 hover:text-slate-655 dark:hover:text-slate-350"
              }`}
            >
              🗓 Bill Calendar
            </button>
            <button
              onClick={() => setActiveTab("splits")}
              className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "splits"
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                  : "border-transparent text-slate-455 dark:text-slate-500 hover:text-slate-655 dark:hover:text-slate-350"
              }`}
            >
              👥 Shared Bills ({splits.filter(s => !s.is_settled).length})
            </button>
            <button
              onClick={() => setActiveTab("tax")}
              className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "tax"
                  ? "border-amber-500 text-amber-600 dark:text-amber-400 dark:border-amber-400"
                  : "border-transparent text-slate-455 dark:text-slate-500 hover:text-slate-655 dark:hover:text-slate-350"
              }`}
            >
              💸 Tax Estimator
            </button>
            <button
              onClick={() => setActiveTab("planner")}
              className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "planner"
                  ? "border-violet-600 text-violet-600 dark:text-violet-400 dark:border-violet-400"
                  : "border-transparent text-slate-455 dark:text-slate-500 hover:text-slate-655 dark:hover:text-slate-350"
              }`}
            >
              📋 Budget Planner
            </button>
            <button
              onClick={() => setActiveTab("achievements")}
              className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "achievements"
                  ? "border-yellow-500 text-yellow-600 dark:text-yellow-400 dark:border-yellow-400"
                  : "border-transparent text-slate-455 dark:text-slate-500 hover:text-slate-655 dark:hover:text-slate-350"
              }`}
            >
              🏆 Achievements {gamificationData ? `(${gamificationData.earned_badge_count}/${gamificationData.total_badge_count})` : ""}
            </button>
            <div className="ml-auto pb-3 flex items-center">
              <button
                onClick={handleCSVExport}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-650 dark:text-slate-300 text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                title="Export Transactions as CSV"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Export CSV
              </button>
            </div>
          </div>
        )}


        {activeTab === "overview" && (
          <>
            {/* Summary Statistics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          
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

          {/* Net Worth Card */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl border border-transparent shadow-sm p-6 hover:shadow-md hover:scale-[1.01] transition-all">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-85">Net Worth</span>
              <div className="bg-white/20 text-white p-2.5 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.33l-7.5-5-7.5 5V21" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-extrabold">
              ₹{netWorth?.net_worth?.toLocaleString("en-IN") || 0}
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[10px] font-bold opacity-90">Assets: ₹{netWorth?.total_assets?.toLocaleString("en-IN") || 0}</span>
            </div>
          </div>

        </div>

        {/* Financial Health Score Widget */}
        {userEmail && healthScore && (
          <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 rounded-2xl p-6 mb-8 shadow-lg shadow-indigo-200 dark:shadow-none text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white transform translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white transform -translate-x-12 translate-y-12"></div>
            </div>
            <div className="relative flex flex-col md:flex-row items-center gap-8">
              {/* Circular Score */}
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className="relative w-32 h-32">
                  <svg viewBox="0 0 36 36" className="w-32 h-32 rotate-[-90deg]">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3.5" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="white" strokeWidth="3.5" strokeDasharray={`${healthScore.score}, 100`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black">{healthScore.score}</span>
                    <span className="text-[10px] font-bold opacity-70">/ 100</span>
                  </div>
                </div>
                <p className="text-xs font-bold mt-2 opacity-80 uppercase tracking-widest">
                  {healthScore.score >= 80 ? "Excellent 🏆" : healthScore.score >= 60 ? "Good 👍" : healthScore.score >= 40 ? "Fair ⚠️" : "Needs Work 🔴"}
                </p>
              </div>

              {/* Score Breakdown */}
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-xl font-black mb-1">Financial Health Score</h2>
                  <p className="text-xs text-white/70 font-medium">{healthScore.advice}</p>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                    <p className="text-2xl font-black">{healthScore.savings_score}</p>
                    <p className="text-[10px] font-bold opacity-70 mt-0.5">Savings</p>
                    <p className="text-[9px] opacity-50">out of 40</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                    <p className="text-2xl font-black">{healthScore.budget_score}</p>
                    <p className="text-[10px] font-bold opacity-70 mt-0.5">Budget</p>
                    <p className="text-[9px] opacity-50">out of 40</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                    <p className="text-2xl font-black">{healthScore.goals_score}</p>
                    <p className="text-[10px] font-bold opacity-70 mt-0.5">Goals</p>
                    <p className="text-[9px] opacity-50">out of 20</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Monthly Trend Area Chart (Recharts) */}
        {userEmail && trendsData && trendsData.length > 0 && (

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm p-6 mb-8 transition-colors">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2.5">
                <div className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Monthly Cash Flow Trends</h2>
                  <p className="text-xs text-slate-450 dark:text-slate-550">Historical view of your monthly income and expenses</p>
                </div>
              </div>
            </div>
            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <AreaChart
                  data={trendsData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:hidden" />
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" className="hidden dark:block" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                  <Tooltip formatter={(value) => [`₹${value}`, ""]} />
                  <Legend verticalAlign="top" height={36} />
                  <Area name="Income" type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
                  <Area name="Expense" type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

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

        {/* Daily Spending Heatmap & Payment Reminders */}
        {userEmail && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            
            {/* 90-Day Spending Heatmap (2 Columns) */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm p-6 transition-colors">
              {heatmapData && heatmapData.days ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2.5">
                      <div className="bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 p-2 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-sans">90-Day Spending Heatmap</h2>
                        <p className="text-xs text-slate-450 dark:text-slate-550">Track daily spending intensity (last 3 months)</p>
                      </div>
                    </div>
                    <div className="text-right text-xs">
                      <p className="font-bold text-slate-700 dark:text-slate-350">Avg. Daily Spend: ₹{heatmapData.avg_daily_spend?.toLocaleString("en-IN")}</p>
                      <p className="text-slate-450 dark:text-slate-550">Total: ₹{heatmapData.total_spend_90d?.toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                  
                  {/* Heatmap Grid */}
                  <div className="flex flex-col items-center sm:items-start overflow-x-auto pb-2">
                    <div className="flex gap-1">
                      {Array.from({ length: 13 }).map((_, weekIdx) => {
                        const weekDays = heatmapData.days.filter((d: any) => d.week === weekIdx);
                        return (
                          <div key={weekIdx} className="flex flex-col gap-1">
                            {weekIdx === 0 && weekDays.length > 0 && Array.from({ length: weekDays[0].day_of_week }).map((_, padIdx) => (
                              <div key={`pad-${padIdx}`} className="w-3.5 h-3.5 rounded bg-transparent"></div>
                            ))}
                            {weekDays.map((day: any) => {
                              const levelColors = [
                                "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700",
                                "bg-emerald-100 dark:bg-emerald-950/60",
                                "bg-emerald-300 dark:bg-emerald-900/80",
                                "bg-emerald-500 dark:bg-emerald-700",
                                "bg-emerald-700 dark:bg-emerald-500"
                              ];
                              return (
                                <div
                                  key={day.date}
                                  className={`w-3.5 h-3.5 rounded transition-all cursor-pointer ${levelColors[day.level]}`}
                                  title={`${day.date}: ₹${day.amount?.toLocaleString("en-IN")} spent`}
                                ></div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-between w-full mt-4 text-[10px] text-slate-450 dark:text-slate-500 font-bold px-1">
                      <span>90 days ago</span>
                      <div className="flex items-center gap-1">
                        <span>Less</span>
                        <div className="w-2.5 h-2.5 rounded bg-slate-100 dark:bg-slate-800"></div>
                        <div className="w-2.5 h-2.5 rounded bg-emerald-100 dark:bg-emerald-950/60"></div>
                        <div className="w-2.5 h-2.5 rounded bg-emerald-300 dark:bg-emerald-900/80"></div>
                        <div className="w-2.5 h-2.5 rounded bg-emerald-500 dark:bg-emerald-750"></div>
                        <div className="w-2.5 h-2.5 rounded bg-emerald-700 dark:bg-emerald-500"></div>
                        <span>More</span>
                      </div>
                      <span>Today</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 bg-slate-50/50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Loading Heatmap...</p>
                </div>
              )}
            </div>

            {/* Bill Reminders (1 Column) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm p-6 flex flex-col justify-between transition-colors">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-450 p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                    </div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Bill Reminders</h2>
                  </div>
                  <button
                    onClick={() => {
                      setReminderName("");
                      setReminderAmount("");
                      setReminderDueDate(new Date().toISOString().split("T")[0]);
                      setReminderCategory("Others");
                      setShowReminderModal(true);
                    }}
                    className="bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 text-indigo-650 dark:text-indigo-400 text-xs font-bold py-1.5 px-3 rounded-lg transition-all cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
                
                {reminders && reminders.length > 0 ? (
                  <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                    {reminders.map((r: any) => {
                      const urgencyColors: Record<string, string> = {
                        overdue: "bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900 text-rose-700 dark:text-rose-450",
                        urgent: "bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900 text-amber-700 dark:text-amber-400",
                        soon: "bg-indigo-50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900 text-indigo-700 dark:text-indigo-400",
                        ok: "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 text-slate-655 dark:text-slate-350"
                      };
                      const color = urgencyColors[r.urgency] || urgencyColors.ok;
                      
                      return (
                        <div key={r.id} className={`p-3 rounded-xl border flex justify-between items-center text-xs font-medium ${color}`}>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold truncate">{r.name}</p>
                            <p className="opacity-85 font-semibold">₹{r.amount?.toLocaleString("en-IN")} • {r.due_date}</p>
                            <p className="text-[10px] font-bold mt-0.5">
                              {r.is_paid ? (
                                <span className="text-emerald-600 dark:text-emerald-450">✅ Paid</span>
                              ) : r.days_left < 0 ? (
                                <span className="text-rose-600 dark:text-rose-450">⚠️ Overdue by {Math.abs(r.days_left)} days</span>
                              ) : r.days_left === 0 ? (
                                <span className="text-rose-500 font-extrabold animate-pulse">🔥 Due TODAY</span>
                              ) : (
                                <span>⏳ {r.days_left} days remaining</span>
                              )}
                            </p>
                          </div>
                          <div className="flex gap-1.5 ml-2">
                            {!r.is_paid && (
                              <button
                                onClick={() => handleReminderPay(r.id)}
                                className="bg-white/80 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 px-2 py-1 rounded-lg border border-current font-black text-[9px] cursor-pointer"
                                title="Mark Paid"
                              >
                                Pay
                              </button>
                            )}
                            <button
                              onClick={() => handleReminderDelete(r.id)}
                              className="hover:text-rose-600 cursor-pointer p-1 text-slate-400 font-bold"
                              title="Delete"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-50/50 dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">No bill reminders set.</p>
                    <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-0.5">Click Add to get started.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

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
              <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-center sm:justify-end">
                <button
                  onClick={handleAutoCategorize}
                  disabled={isAutoCatting}
                  className="bg-violet-650 hover:bg-violet-700 disabled:bg-violet-400 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer justify-center"
                >
                  {isAutoCatting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Categorizing...
                    </>
                  ) : (
                    <>
                      <span>✨ Auto-Categorize</span>
                    </>
                  )}
                </button>
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
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Add Transaction
                </button>
              </div>
            )}
          </div>

          {/* Auto-Categorize Result Banner */}
          {autoCatResult && (
            <div className="mb-6 bg-violet-50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/60 rounded-xl p-3 flex justify-between items-center text-xs text-violet-850 dark:text-violet-300">
              <span className="font-semibold">✨ {autoCatResult.message}</span>
              <button onClick={() => setAutoCatResult(null)} className="font-bold text-violet-600 dark:text-violet-450 hover:underline cursor-pointer">Dismiss</button>
            </div>
          )}

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
          </>
        )}

        {/* Tab Content 2: Savings Goals */}
        {activeTab === "goals" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-2xl shadow-sm transition-colors">
              <div>
                <h2 className="text-xl font-bold text-slate-850 dark:text-slate-100">🎯 Savings Goals</h2>
                <p className="text-xs text-slate-450 dark:text-slate-500 font-medium mt-1">Plan and track your milestones over time.</p>
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
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
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
                          <p className="text-right text-[10px] text-slate-450 dark:text-slate-500 mt-1.5 font-bold">{percentage.toFixed(0)}% Saved</p>
                        </div>
                      </div>

                      <div className="flex gap-2 border-t border-slate-100 dark:border-slate-850 pt-4">
                        <button
                          onClick={() => openEditGoalModal(g)}
                          className="flex-1 bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-300 text-xs font-bold py-2 rounded-xl transition-all cursor-pointer"
                        >
                          Log Progress / Edit
                        </button>
                        <button
                          onClick={() => handleGoalDelete(g.id)}
                          className="bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 text-rose-600 dark:text-rose-450 text-xs font-bold p-2 rounded-xl border border-rose-100 dark:border-rose-900/60 transition-all cursor-pointer"
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
                <div className="bg-indigo-50 dark:bg-indigo-950/40 p-4 rounded-full text-indigo-650 dark:text-indigo-400 text-2xl mb-4">
                  🎯
                </div>
                <h3 className="text-base font-bold text-slate-700 dark:text-slate-350">No Savings Goals Yet</h3>
                <p className="text-xs text-slate-450 dark:text-slate-500 mt-1 mb-6 text-center max-w-sm">
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
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab Content 3: Subscriptions */}
        {activeTab === "subscriptions" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Subscriptions List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-2xl shadow-sm transition-colors">
                <div>
                  <h2 className="text-xl font-bold text-slate-850 dark:text-slate-100">📅 Registered Subscriptions</h2>
                  <p className="text-xs text-slate-450 dark:text-slate-500 font-medium mt-1">Track recurring expenses and monthly due dates.</p>
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
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
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
                        <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-450 dark:text-slate-550 text-xs font-bold uppercase tracking-wider">
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
                                <p className="text-[10px] text-slate-450 dark:text-slate-500 uppercase font-bold tracking-wider">{s.category}</p>
                              </div>
                            </td>
                            <td className="py-4 text-xs font-bold text-slate-550 dark:text-slate-400">
                              <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">{s.billing_cycle}</span>
                            </td>
                            <td className="py-4 text-xs text-slate-650 dark:text-slate-350">{s.next_due_date}</td>
                            <td className="py-4 text-right pr-6 font-extrabold text-slate-800 dark:text-slate-200">
                              <span className="mr-6">₹{s.amount?.toLocaleString("en-IN") || 0}</span>
                              <span className="inline-flex gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => openEditSubModal(s)}
                                  className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                                  title="Edit Subscription"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.128-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleSubDelete(s.id)}
                                  className="text-slate-400 hover:text-rose-600 cursor-pointer"
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
                  <p className="text-sm text-slate-450 dark:text-slate-550 font-medium">No recurring subscriptions registered yet.</p>
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
                          <p className="text-[10px] text-indigo-650 dark:text-indigo-455 font-extrabold mt-0.5">₹{d.amount}/month</p>
                          <p className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold mt-1">Est. Due: {d.next_due_date}</p>
                        </div>
                        <button
                          onClick={() => acceptDetectedSub(d)}
                          className="bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900 border border-indigo-100 dark:border-indigo-900 text-indigo-650 dark:text-indigo-400 text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer"
                        >
                          + Track
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 bg-slate-50/50 dark:bg-slate-955/10 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                    <p className="text-xs text-slate-550 dark:text-slate-400 font-medium text-center px-4">No recurring patterns detected yet.</p>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-1.5 text-center px-4">Upload more monthly statements to activate automatic detection.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Wallets & Accounts */}
        {activeTab === "accounts" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-2xl shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-slate-850 dark:text-slate-100">💳 Wallets & Accounts</h2>
                <p className="text-xs text-slate-450 dark:text-slate-500 font-medium mt-1">Manage your bank accounts, cards, and wallets.</p>
              </div>
              <button
                onClick={() => { setAccountModalMode("add"); setAccountName(""); setAccountType("Bank"); setAccountBalance("0"); setShowAccountModal(true); }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
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
                    <div key={a.id} className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 text-white shadow-lg hover:scale-[1.02] transition-all relative overflow-hidden`}>
                      <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 transform translate-x-10 -translate-y-10"></div>
                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">{a.account_type}</p>
                          <h3 className="text-lg font-black mt-1">{a.name}</h3>
                        </div>
                        <div className="flex gap-2 opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEditAccountModal(a)} className="text-white/70 hover:text-white cursor-pointer" title="Edit">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.128-1.897L16.863 4.487Z" />
                            </svg>
                          </button>
                          <button onClick={() => handleAccountDelete(a.id)} className="text-white/70 hover:text-white cursor-pointer" title="Delete">
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
                <p className="text-xs text-slate-450 dark:text-slate-500 mt-1 mb-6 text-center max-w-sm">Add bank accounts, credit cards or wallets to track balances in one place.</p>
                <button
                  onClick={() => { setAccountModalMode("add"); setAccountName(""); setAccountType("Bank"); setAccountBalance("0"); setShowAccountModal(true); }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  Add First Account
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab: Bill Calendar */}
        {activeTab === "calendar" && (() => {
          const year = calendarMonth.getFullYear();
          const month = calendarMonth.getMonth();
          const daysInMonth = getDaysInMonth(year, month);
          const firstDay = getFirstDayOfMonth(year, month);
          const dueDates = getSubscriptionDueDates();
          const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          const today = new Date();

          return (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setCalendarMonth(new Date(year, month - 1, 1))}
                      className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 p-2 rounded-xl cursor-pointer transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-slate-600 dark:text-slate-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                      </svg>
                    </button>
                    <h2 className="text-xl font-bold text-slate-850 dark:text-slate-100">
                      {calendarMonth.toLocaleString("default", { month: "long", year: "numeric" })}
                    </h2>
                    <button
                      onClick={() => setCalendarMonth(new Date(year, month + 1, 1))}
                      className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 p-2 rounded-xl cursor-pointer transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-slate-600 dark:text-slate-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-indigo-500 inline-block"></span> Bill Due</span>
                    <span className="flex items-center gap-1.5 ml-4"><span className="w-3 h-3 rounded-full bg-rose-400 inline-block"></span> Today</span>
                  </div>
                </div>

                {/* Day Names */}
                <div className="grid grid-cols-7 mb-2">
                  {dayNames.map(d => (
                    <div key={d} className="text-center text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 py-2">{d}</div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-16 rounded-xl"></div>
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
                    const bills = dueDates[day] || [];
                    return (
                      <div
                        key={day}
                        className={`h-16 rounded-xl border p-1.5 flex flex-col transition-all ${
                          isToday
                            ? "border-rose-400 bg-rose-50 dark:bg-rose-950/20"
                            : bills.length > 0
                            ? "border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950/20"
                            : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900"
                        }`}
                      >
                        <span className={`text-xs font-extrabold ${isToday ? "text-rose-600 dark:text-rose-400" : "text-slate-600 dark:text-slate-400"}`}>{day}</span>
                        <div className="flex flex-col gap-0.5 mt-0.5 overflow-hidden">
                          {bills.slice(0, 2).map((b, idx) => (
                            <span key={idx} className="text-[7px] font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950/60 px-1 rounded truncate">{b}</span>
                          ))}
                          {bills.length > 2 && <span className="text-[7px] text-slate-400">+{bills.length - 2} more</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {subscriptions.length === 0 && (
                <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                  <p className="text-sm text-slate-450 dark:text-slate-550 font-medium">No subscriptions tracked yet. Go to Subscriptions tab to add them.</p>
                </div>
              )}
            </div>
          );
        })()}

        {/* Tab: Shared Bills / Expense Splitter */}
        {activeTab === "splits" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-2xl shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-slate-850 dark:text-slate-100">👥 Shared Bills</h2>
                <p className="text-xs text-slate-450 dark:text-slate-500 font-medium mt-1">
                  Total owed to you: <strong className="text-emerald-600 dark:text-emerald-400">₹{splits.filter(s => !s.is_settled).reduce((sum: number, s: any) => sum + s.amount_owed, 0).toLocaleString("en-IN")}</strong>
                </p>
              </div>
              <button
                onClick={() => { setSplitDescription(""); setSplitTotal(""); setSplitFriend(""); setSplitOwed(""); setShowSplitModal(true); }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
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
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-450 dark:text-slate-550 text-xs font-bold uppercase tracking-wider">
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
                                  className="bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold px-2.5 py-1.5 rounded-lg cursor-pointer transition-all"
                                >
                                  Settle Up
                                </button>
                              )}
                              <button
                                onClick={() => handleSplitDelete(s.id)}
                                className="text-slate-400 hover:text-rose-600 cursor-pointer p-1"
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
                <p className="text-xs text-slate-450 dark:text-slate-500 mt-1 mb-6 text-center max-w-sm">Track shared expenses for dinners, rent, trips, and more.</p>
                <button
                  onClick={() => { setSplitDescription(""); setSplitTotal(""); setSplitFriend(""); setSplitOwed(""); setShowSplitModal(true); }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  Record First Split
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Account Add/Edit Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 max-w-md w-full p-8 relative">
            <button onClick={() => setShowAccountModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 dark:hover:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-855 p-1.5 rounded-lg cursor-pointer bg-transparent border-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                {accountModalMode === "add" ? "Add Account" : "Edit Account"}
              </h3>
              <p className="text-xs text-slate-550 dark:text-slate-450 mt-1">Track balance across your wallets and bank accounts</p>
            </div>
            <form onSubmit={handleAccountSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Account Name</label>
                <input type="text" required value={accountName} onChange={e => setAccountName(e.target.value)} placeholder="e.g. HDFC Savings" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-850 dark:text-slate-100" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Account Type</label>
                  <select value={accountType} onChange={e => setAccountType(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-850 dark:text-slate-100 cursor-pointer">
                    <option value="Bank">Bank</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Cash">Cash</option>
                    <option value="UPI Wallet">UPI Wallet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Balance (₹)</label>
                  <input type="number" value={accountBalance} onChange={e => setAccountBalance(e.target.value)} placeholder="0" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-550 text-slate-850 dark:text-slate-100" />
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md transition-all text-sm mt-4 cursor-pointer">
                {accountModalMode === "add" ? "Add Account" : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Split Expense Modal */}
      {showSplitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 max-w-md w-full p-8 relative">
            <button onClick={() => setShowSplitModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 p-1.5 rounded-lg cursor-pointer bg-transparent border-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Record Split Bill</h3>
              <p className="text-xs text-slate-550 dark:text-slate-450 mt-1">Track shared expenses with friends or housemates</p>
            </div>
            <form onSubmit={handleSplitSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
                <input type="text" required value={splitDescription} onChange={e => setSplitDescription(e.target.value)} placeholder="e.g. Group Dinner at Barbeque Nation" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-850 dark:text-slate-100" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Total Bill (₹)</label>
                  <input type="number" required value={splitTotal} onChange={e => setSplitTotal(e.target.value)} placeholder="2500" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-850 dark:text-slate-100" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Friend's Name</label>
                  <input type="text" required value={splitFriend} onChange={e => setSplitFriend(e.target.value)} placeholder="Rahul" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-850 dark:text-slate-100" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Amount They Owe You (₹)</label>
                <input type="number" required value={splitOwed} onChange={e => setSplitOwed(e.target.value)} placeholder="1250" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-850 dark:text-slate-100" />
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md transition-all text-sm mt-4 cursor-pointer">
                Record Split
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Savings Goal Add/Edit Modal */}
      {showGoalModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 max-w-md w-full p-8 relative overflow-hidden animate-scale-up">
            <button
              onClick={() => setShowGoalModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 dark:hover:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-855 p-1.5 rounded-lg transition-all cursor-pointer animate-none bg-transparent border-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent inline-block">
                {goalModalMode === "add" ? "Create Savings Goal" : "Edit Savings Goal"}
              </h3>
              <p className="text-xs text-slate-550 dark:text-slate-450 font-medium mt-1">
                Define savings targets and track milestone progress
              </p>
            </div>

            <form onSubmit={handleGoalSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Goal Name</label>
                <input
                  type="text"
                  required
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  placeholder="e.g. New Macbook Pro"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-850 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Target Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={goalTargetAmount}
                    onChange={(e) => setGoalTargetAmount(e.target.value)}
                    placeholder="1,50,050"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-550 text-slate-850 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Current Saved (₹)</label>
                  <input
                    type="number"
                    value={goalCurrentAmount}
                    onChange={(e) => setGoalCurrentAmount(e.target.value)}
                    placeholder="15,000"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-550 text-slate-855 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Target Date</label>
                <input
                  type="date"
                  required
                  value={goalTargetDate}
                  onChange={(e) => setGoalTargetDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-850 dark:text-slate-100"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md transition-all text-sm mt-4 flex items-center justify-center cursor-pointer"
              >
                {goalModalMode === "add" ? "Create Goal" : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Subscription Add/Edit Modal */}
      {showSubModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 max-w-md w-full p-8 relative overflow-hidden animate-scale-up">
            <button
              onClick={() => setShowSubModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 dark:hover:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-855 p-1.5 rounded-lg transition-all cursor-pointer animate-none bg-transparent border-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent inline-block">
                {subModalMode === "add" ? "Register Subscription" : "Edit Subscription"}
              </h3>
              <p className="text-xs text-slate-550 dark:text-slate-450 font-medium mt-1">
                Track monthly or yearly recurring bills
              </p>
            </div>

            <form onSubmit={handleSubSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Subscription Name</label>
                <input
                  type="text"
                  required
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  placeholder="e.g. Netflix Premium"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-850 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={subAmount}
                    onChange={(e) => setSubAmount(e.target.value)}
                    placeholder="649.00"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-550 text-slate-850 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Category</label>
                  <select
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-850 dark:text-slate-100 cursor-pointer"
                  >
                    <option value="Entertainment">Entertainment</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Rent">Rent</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Billing Cycle</label>
                  <select
                    value={subBillingCycle}
                    onChange={(e) => setSubBillingCycle(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-550 text-slate-855 dark:text-slate-100 cursor-pointer"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Next Due Date</label>
                  <input
                    type="date"
                    required
                    value={subNextDueDate}
                    onChange={(e) => setSubNextDueDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-555 text-slate-850 dark:text-slate-100"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md transition-all text-sm mt-4 flex items-center justify-center cursor-pointer"
              >
                {subModalMode === "add" ? "Track Subscription" : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

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


      {/* ═══════════════════════════════════════════ */}
      {/* TAX ESTIMATOR TAB */}
      {/* ═══════════════════════════════════════════ */}
      {activeTab === "tax" && (
        <div className="space-y-6 mb-8">
          {taxData ? (
            <>
              {/* Hero Tax Card */}
              <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 rounded-2xl p-6 text-white shadow-lg shadow-orange-200 dark:shadow-none relative overflow-hidden">
                <div className="absolute inset-0 opacity-10"><div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white transform translate-x-16 -translate-y-16"></div></div>
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
            </>
          ) : (
            <div className="text-center py-20 text-slate-400">
              <p className="text-4xl mb-3">💸</p>
              <p className="font-bold text-slate-600 dark:text-slate-400">No income data found</p>
              <p className="text-sm mt-1">Upload statements or add income transactions to estimate your tax.</p>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* BUDGET PLANNER TAB */}
      {/* ═══════════════════════════════════════════ */}
      {activeTab === "planner" && (
        <div className="space-y-6 mb-8">
          {budgetPlan ? (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">📋 Smart Budget Planner</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Based on {budgetPlan.last_month} actuals • Projected savings: <span className={`font-bold ${budgetPlan.projected_savings >= 0 ? "text-emerald-600" : "text-rose-600"}`}>₹{budgetPlan.projected_savings?.toLocaleString("en-IN")}</span></p>
                </div>
                <button
                  onClick={handleApplyBudgetPlan}
                  disabled={applyingPlan}
                  className="bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-bold py-2.5 px-5 rounded-xl shadow-md shadow-violet-200 dark:shadow-none transition-all cursor-pointer flex items-center gap-2 text-sm"
                >
                  {applyingPlan ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : "✅"}
                  {applyingPlan ? "Applying..." : "Apply Plan"}
                </button>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
                        <th className="text-left px-5 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Category</th>
                        <th className="text-right px-5 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Last Month Actual</th>
                        <th className="text-right px-5 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Current Budget</th>
                        <th className="text-right px-5 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Suggested Budget</th>
                        <th className="text-left px-5 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Advice</th>
                      </tr>
                    </thead>
                    <tbody>
                      {budgetPlan.plan?.map((item: any, i: number) => (
                        <tr key={i} className="border-b border-slate-50 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-5 py-4 font-bold text-slate-800 dark:text-slate-200">{item.category}</td>
                          <td className="px-5 py-4 text-right text-slate-600 dark:text-slate-400">₹{item.last_month_actual?.toLocaleString("en-IN")}</td>
                          <td className="px-5 py-4 text-right text-slate-600 dark:text-slate-400">{item.current_budget > 0 ? `₹${item.current_budget?.toLocaleString("en-IN")}` : "—"}</td>
                          <td className="px-5 py-4 text-right font-bold text-violet-600 dark:text-violet-400">₹{item.suggested_budget?.toLocaleString("en-IN")}</td>
                          <td className="px-5 py-4">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                              item.status === "overspent" ? "bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400" :
                              item.status === "unbudgeted" ? "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400" :
                              "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                            }`}>{item.advice}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-slate-400">
              <p className="text-4xl mb-3">📋</p>
              <p className="font-bold text-slate-600 dark:text-slate-400">No plan data yet</p>
              <p className="text-sm mt-1">Add transactions and budgets to generate your personalized monthly plan.</p>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* ACHIEVEMENTS / GAMIFICATION TAB */}
      {/* ═══════════════════════════════════════════ */}
      {activeTab === "achievements" && (
        <div className="space-y-6 mb-8">
          {gamificationData ? (
            <>
              {/* Level & XP Hero */}
              <div className="bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg shadow-amber-200 dark:shadow-none relative overflow-hidden">
                <div className="absolute inset-0 opacity-10"><div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white transform translate-x-20 -translate-y-20"></div></div>
                <div className="relative flex flex-col md:flex-row items-center gap-8">
                  <div className="text-center flex-shrink-0">
                    <p className="text-6xl mb-1">🏆</p>
                    <p className="text-xl font-black">{gamificationData.level}</p>
                    <p className="text-xs opacity-70 font-bold mt-1">{gamificationData.total_xp} XP Total</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span>Progress to Next Level</span>
                      <span>{gamificationData.xp_progress} / {gamificationData.xp_needed} XP</span>
                    </div>
                    <div className="bg-white/20 rounded-full h-4 overflow-hidden">
                      <div className="bg-white h-full rounded-full transition-all duration-700" style={{width: `${gamificationData.progress_pct}%`}}></div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      <div className="bg-white/15 rounded-xl p-3 text-center">
                        <p className="text-2xl font-black">🔥</p>
                        <p className="text-xs font-bold mt-1">{gamificationData.streak_days} Day Streak</p>
                      </div>
                      <div className="bg-white/15 rounded-xl p-3 text-center">
                        <p className="text-2xl font-black">{gamificationData.earned_badge_count}</p>
                        <p className="text-xs font-bold mt-1">Badges Earned</p>
                      </div>
                      <div className="bg-white/15 rounded-xl p-3 text-center">
                        <p className="text-2xl font-black">{gamificationData.stats?.savings_rate_pct}%</p>
                        <p className="text-xs font-bold mt-1">Savings Rate</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Badges Grid */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">🎖️ Badge Collection</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {gamificationData.badges?.map((badge: any) => (
                    <div key={badge.id} className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                      badge.earned
                        ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"
                        : "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 opacity-50 grayscale"
                    }`}>
                      <span className="text-2xl">{badge.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold truncate ${badge.earned ? "text-amber-800 dark:text-amber-300" : "text-slate-500"}`}>{badge.name}</p>
                        <p className="text-xs text-slate-400 truncate">{badge.description}</p>
                        <p className="text-xs font-bold text-amber-500 mt-0.5">+{badge.xp} XP</p>
                      </div>
                      {badge.earned && <span className="text-emerald-500 flex-shrink-0">✅</span>}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-20"><p className="text-4xl mb-3">🏆</p><p className="font-bold text-slate-600 dark:text-slate-400">Start tracking to earn badges!</p></div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* NET WORTH + HEATMAP + REMINDERS inside Overview */}
      {/* These are rendered at the bottom of the Overview tab */}
      {/* ═══════════════════════════════════════════ */}

      {/* Payment Reminder Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 max-w-md w-full p-8 relative">
            <button onClick={() => setShowReminderModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">✕</button>
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-5">⏰ Add Payment Reminder</h3>
            <form onSubmit={handleReminderSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Name</label>
                <input type="text" required value={reminderName} onChange={(e) => setReminderName(e.target.value)} placeholder="e.g. Credit Card Bill" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Amount (₹)</label>
                  <input type="number" step="0.01" required value={reminderAmount} onChange={(e) => setReminderAmount(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Due Date</label>
                  <input type="date" required value={reminderDueDate} onChange={(e) => setReminderDueDate(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
                <select value={reminderCategory} onChange={(e) => setReminderCategory(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100">
                  {["EMI", "Credit Card", "Rent", "Utilities", "Subscription", "Insurance", "Others"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md transition-all text-sm cursor-pointer">Add Reminder</button>
            </form>
          </div>
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