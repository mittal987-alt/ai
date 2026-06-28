import React from "react";
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
import { useFinance } from "../context/FinanceContext";

const Overview: React.FC = () => {
  const {
    data,
    transactions,
    insights,
    userEmail,
    budgets,
    setBudgetCategory,
    budgetCategory,
    setBudgetAmount,
    budgetAmount,
    handleBudgetSubmit,
    handleBudgetDelete,
    trendsData,
    netWorth,
    healthScore,
    heatmapData,
    reminders,
    setShowReminderModal,
    handleReminderPay,
    handleReminderDelete,
    filterSearch,
    setFilterSearch,
    filterCategory,
    setFilterCategory,
    filterType,
    setFilterType,
    handleAutoCategorize,
    isAutoCatting,
    autoCatResult,
    setAutoCatResult,
    setTxModalMode,
    setTxDescription,
    setTxAmount,
    setTxCategory,
    setTxType,
    setTxDate,
    setShowTxModal,
    openEditTxModal,
    handleTxDelete,
    filteredTransactions
  } = useFinance();

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

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mb-4"></div>
        <p className="text-slate-650 dark:text-slate-400 font-medium text-lg">Loading Financial Workspace...</p>
      </div>
    );
  }

  return (
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
            <div className="bg-rose-50 dark:bg-rose-955/40 text-rose-600 dark:text-rose-455 p-2.5 rounded-xl">
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
            <div className="bg-sky-50 dark:bg-sky-955/40 text-sky-600 dark:text-sky-450 p-2.5 rounded-xl">
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
            <div className="bg-violet-50 dark:bg-violet-955/40 text-violet-600 dark:text-violet-450 p-2.5 rounded-xl">
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

      {/* Monthly Trend Area Chart */}
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

      {/* Dashboard Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* AI Insights */}
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
              <div className="flex flex-col items-center justify-center py-10 bg-slate-55/50 dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">No insights generated yet.</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 text-center">Upload statements or log entries to trigger analysis.</p>
              </div>
            )}
          </div>
        </div>

        {/* Expense Share */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-6">
              <div className="bg-rose-50 dark:bg-rose-955/40 text-rose-600 dark:text-rose-450 p-2 rounded-lg">
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

                <div className="space-y-2.5">
                  {chartData.map((category, index) => {
                    const totalSpent = insights?.food + insights?.travel + insights?.shopping || 1;
                    const percentage = (category.value / totalSpent) * 100;
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
                              backgroundColor: chartColors[index % chartColors.length],
                              width: `${percentage}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 bg-slate-55/50 dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">No expenditure records.</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Check back once statement is processed.</p>
              </div>
            )}
          </div>
        </div>

        {/* Category Budgets */}
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
                      <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-355">
                        <span className="flex items-center gap-1.5">
                          {b.category}
                          <button
                            onClick={() => handleBudgetDelete(b.id)}
                            className="opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-600 transition-all font-bold ml-1 cursor-pointer bg-transparent border-none"
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
              <div className="flex flex-col items-center justify-center py-10 bg-slate-55/50 dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 mb-6">
                <p className="text-xs text-slate-550 dark:text-slate-400 font-medium">No budgets defined.</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Use the form below to set target limits.</p>
              </div>
            )}

            {userEmail && (
              <form onSubmit={handleBudgetSubmit} className="bg-slate-55 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-xl p-3">
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
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm cursor-pointer transition-all border-none"
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
          {/* 90-Day Spending Heatmap */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm p-6 transition-colors">
            {heatmapData && heatmapData.days ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="bg-amber-50 dark:bg-amber-955/40 text-amber-600 dark:text-amber-400 p-2 rounded-lg">
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
                    <p className="text-slate-455 dark:text-slate-550">Total: ₹{heatmapData.total_spend_90d?.toLocaleString("en-IN")}</p>
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
                  <div className="flex justify-between w-full mt-4 text-[10px] text-slate-455 dark:text-slate-500 font-bold px-1">
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
              <div className="flex flex-col items-center justify-center py-10 bg-slate-55/50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                <p className="text-xs text-slate-550 dark:text-slate-400 font-medium">Loading Heatmap...</p>
              </div>
            )}
          </div>

          {/* Bill Reminders */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm p-6 flex flex-col justify-between transition-colors">
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="bg-rose-50 dark:bg-rose-955/40 text-rose-600 dark:text-rose-450 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Bill Reminders</h2>
                </div>
                <button
                  onClick={() => {
                    setTxDescription("");
                    setTxAmount("");
                    setTxDate(new Date().toISOString().split("T")[0]);
                    setTxCategory("Others");
                    setShowReminderModal(true);
                  }}
                  className="bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 text-indigo-655 dark:text-indigo-400 text-xs font-bold py-1.5 px-3 rounded-lg transition-all cursor-pointer border-none"
                >
                  + Add
                </button>
              </div>
              
              {reminders && reminders.length > 0 ? (
                <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                  {reminders.map((r: any) => {
                    const urgencyColors: Record<string, string> = {
                      overdue: "bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900 text-rose-700 dark:text-rose-455",
                      urgent: "bg-amber-50 dark:bg-amber-955/20 border-amber-100 dark:border-amber-900 text-amber-700 dark:text-amber-400",
                      soon: "bg-indigo-50 dark:bg-indigo-955/20 border-indigo-100 dark:border-indigo-900 text-indigo-700 dark:text-indigo-400",
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
                              <span className="text-rose-600 dark:text-rose-455">⚠️ Overdue by {Math.abs(r.days_left)} days</span>
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
                            className="hover:text-rose-600 cursor-pointer p-1 text-slate-400 font-bold bg-transparent border-none"
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
                <div className="text-center py-12 bg-slate-55/50 dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                  <p className="text-xs text-slate-550 dark:text-slate-400 font-medium">No bill reminders set.</p>
                  <p className="text-[10px] text-slate-450 dark:text-slate-550 mt-0.5">Click Add to get started.</p>
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
              className="bg-slate-55 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-200 w-full sm:w-48"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-slate-55 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-200 cursor-pointer"
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
              className="bg-slate-55 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-200 cursor-pointer"
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
                className="bg-violet-600 hover:bg-violet-750 disabled:bg-violet-400 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer justify-center border-none"
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
              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const token = localStorage.getItem("token");
                  const formData = new FormData();
                  formData.append("file", file);
                  try {
                    const res = await fetch("http://127.0.0.1:8000/import/csv", {
                      method: "POST",
                      headers: { Authorization: `Bearer ${token}` },
                      body: formData,
                    });
                    const data = await res.json();
                    alert(data.message || "Import complete");
                    window.location.reload();
                  } catch (err) {
                    console.error(err);
                    alert("Failed to upload CSV");
                  }
                }}
              />
              <button
                onClick={() => document.getElementById("csv-upload")?.click()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer justify-center border-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
                Import CSV
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
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer justify-center border-none"
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
          <div className="mb-6 bg-violet-50 dark:bg-violet-955/20 border border-violet-100 dark:border-violet-900/60 rounded-xl p-3 flex justify-between items-center text-xs text-violet-850 dark:text-violet-300">
            <span className="font-semibold">✨ {autoCatResult.message}</span>
            <button onClick={() => setAutoCatResult(null)} className="font-bold text-violet-600 dark:text-violet-455 hover:underline cursor-pointer bg-transparent border-none">Dismiss</button>
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
                            ? "bg-amber-50 dark:bg-amber-955/40 text-amber-700 dark:text-amber-400"
                            : t.category === "Shopping"
                            ? "bg-blue-50 dark:bg-blue-955/40 text-blue-700 dark:text-blue-400"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-350"
                        }`}>
                          {t.category}
                        </span>
                      </td>
                      <td className={`py-3.5 text-right pr-4 font-extrabold ${isIncome ? "text-emerald-600 dark:text-emerald-455" : "text-slate-800 dark:text-slate-200"}`}>
                        <span className="mr-4">{isIncome ? "+" : "-"}₹{t.amount?.toLocaleString("en-IN") || 0}</span>
                        
                        {/* Row actions */}
                        {userEmail && (
                          <span className="inline-flex gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openEditTxModal(t)}
                              className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer bg-transparent border-none"
                              title="Edit Record"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.128-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleTxDelete(t.id)}
                              className="text-slate-400 hover:text-rose-600 cursor-pointer bg-transparent border-none"
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
  );
};

export default Overview;
