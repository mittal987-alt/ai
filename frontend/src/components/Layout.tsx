import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useFinance } from "../context/FinanceContext";

const Layout: React.FC = () => {
  const {
    theme,
    setTheme,
    isUploading,
    uploadStatement,
    setFile,
    userEmail,
    showAlertsPanel,
    setShowAlertsPanel,
    alertsData,
    handleLogout,
    setAuthMode,
    setAuthError,
    setShowAuthModal,
    goals,
    subscriptions,
    accounts,
    splits,
    gamificationData,
    chatOpen,
    setChatOpen,
    chatMessages,
    chatLoading,
    chatInput,
    setChatInput,
    sendChatMessage,
    showAccountModal,
    setShowAccountModal,
    accountModalMode,
    accountName,
    setAccountName,
    accountType,
    setAccountType,
    accountBalance,
    setAccountBalance,
    handleAccountSubmit,
    showSplitModal,
    setShowSplitModal,
    splitDescription,
    setSplitDescription,
    splitTotal,
    setSplitTotal,
    splitFriend,
    setSplitFriend,
    splitOwed,
    setSplitOwed,
    handleSplitSubmit,
    showGoalModal,
    setShowGoalModal,
    goalModalMode,
    goalName,
    setGoalName,
    goalTargetAmount,
    setGoalTargetAmount,
    goalCurrentAmount,
    setGoalCurrentAmount,
    goalTargetDate,
    setGoalTargetDate,
    handleGoalSubmit,
    showSubModal,
    setShowSubModal,
    subModalMode,
    subName,
    setSubName,
    subAmount,
    setSubAmount,
    subCategory,
    setSubCategory,
    subBillingCycle,
    setSubBillingCycle,
    subNextDueDate,
    setSubNextDueDate,
    handleSubSubmit,
    showTxModal,
    setShowTxModal,
    txModalMode,
    txDescription,
    setTxDescription,
    txAmount,
    setTxAmount,
    txCategory,
    setTxCategory,
    txType,
    setTxType,
    txDate,
    setTxDate,
    handleTxSubmit,
    showAuthModal,
    authMode,
    authName,
    setAuthName,
    authEmail,
    setAuthEmail,
    authPassword,
    setAuthPassword,
    authError,
    isLoadingAuth,
    handleAuthSubmit,
    handleCSVExport,
    showReminderModal,
    setShowReminderModal,
    reminderName,
    setReminderName,
    reminderAmount,
    setReminderAmount,
    reminderDueDate,
    setReminderDueDate,
    reminderCategory,
    setReminderCategory,
    handleReminderSubmit,
  } = useFinance();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans antialiased text-slate-900 dark:text-slate-100 pb-12 transition-colors duration-300">
      {/* Navbar */}
      <nav className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-850 px-6 py-4 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <Link to="/" className="flex items-center gap-3 decoration-transparent">
            <div className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-md shadow-indigo-200 dark:shadow-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h16.5M5.25 7.5h13.5m-12 9a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3m-9 0h9" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Finance AI Coach
              </h1>
              <p className="text-xs text-slate-550 dark:text-slate-400 font-medium">Smart Automated Budgeting</p>
            </div>
          </Link>

          <div className="flex flex-wrap items-center gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2 rounded-xl border border-slate-250 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-655 dark:text-slate-350 cursor-pointer"
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
                className="text-xs text-slate-655 dark:text-slate-300 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-white dark:file:bg-slate-800 file:text-indigo-600 dark:file:text-indigo-400 hover:file:bg-indigo-55 dark:hover:file:bg-slate-750 cursor-pointer max-w-[200px]"
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
                    className="relative p-2 rounded-xl border border-slate-205 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-655 dark:text-slate-300 cursor-pointer"
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
                        <button onClick={() => setShowAlertsPanel(false)} className="text-slate-455 hover:text-slate-655 cursor-pointer text-lg leading-none bg-transparent border-none">×</button>
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
                  className="text-xs text-rose-600 dark:text-rose-455 hover:text-rose-700 dark:hover:text-rose-400 font-bold border border-rose-200 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-955/30 px-3 py-1.5 rounded-xl transition-all cursor-pointer bg-transparent"
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
        {/* Tab Route Switcher */}
        {userEmail && (
          <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 gap-4 overflow-x-auto whitespace-nowrap scrollbar-none">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer decoration-transparent ${
                  isActive
                    ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                    : "border-transparent text-slate-455 dark:text-slate-500 hover:text-slate-650 dark:hover:text-slate-350"
                }`
              }
            >
              Overview
            </NavLink>
            <NavLink
              to="/goals"
              className={({ isActive }) =>
                `pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer decoration-transparent ${
                  isActive
                    ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                    : "border-transparent text-slate-455 dark:text-slate-500 hover:text-slate-655 dark:hover:text-slate-350"
                }`
              }
            >
              🎯 Savings Goals ({goals.length})
            </NavLink>
            <NavLink
              to="/subscriptions"
              className={({ isActive }) =>
                `pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer decoration-transparent ${
                  isActive
                    ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                    : "border-transparent text-slate-455 dark:text-slate-500 hover:text-slate-655 dark:hover:text-slate-350"
                }`
              }
            >
              📅 Subscriptions & Bills ({subscriptions.length})
            </NavLink>
            <NavLink
              to="/accounts"
              className={({ isActive }) =>
                `pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer decoration-transparent ${
                  isActive
                    ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                    : "border-transparent text-slate-455 dark:text-slate-500 hover:text-slate-655 dark:hover:text-slate-350"
                }`
              }
            >
              💳 Wallets & Accounts ({accounts.length})
            </NavLink>
            <NavLink
              to="/calendar"
              className={({ isActive }) =>
                `pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer decoration-transparent ${
                  isActive
                    ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                    : "border-transparent text-slate-455 dark:text-slate-500 hover:text-slate-655 dark:hover:text-slate-350"
                }`
              }
            >
              🗓 Bill Calendar
            </NavLink>
            <NavLink
              to="/splits"
              className={({ isActive }) =>
                `pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer decoration-transparent ${
                  isActive
                    ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                    : "border-transparent text-slate-455 dark:text-slate-500 hover:text-slate-655 dark:hover:text-slate-350"
                }`
              }
            >
              👥 Shared Bills ({splits.filter(s => !s.is_settled).length})
            </NavLink>
            <NavLink
              to="/recurring"
              className={({ isActive }) =>
                `pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer decoration-transparent ${
                  isActive
                    ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400"
                    : "border-transparent text-slate-455 dark:text-slate-500 hover:text-slate-655 dark:hover:text-slate-350"
                }`
              }
            >
              🔄 Auto-Pay
            </NavLink>
            <NavLink
              to="/investments"
              className={({ isActive }) =>
                `pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer decoration-transparent ${
                  isActive
                    ? "border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                    : "border-transparent text-slate-455 dark:text-slate-500 hover:text-slate-655 dark:hover:text-slate-350"
                }`
              }
            >
              📈 Portfolio
            </NavLink>
            <NavLink
              to="/loans"
              className={({ isActive }) =>
                `pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer decoration-transparent ${
                  isActive
                    ? "border-rose-500 text-rose-600 dark:text-rose-400 dark:border-rose-400"
                    : "border-transparent text-slate-455 dark:text-slate-500 hover:text-slate-655 dark:hover:text-slate-350"
                }`
              }
            >
              🏦 Loans
            </NavLink>
            <NavLink
              to="/tax"
              className={({ isActive }) =>
                `pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer decoration-transparent ${
                  isActive
                    ? "border-amber-500 text-amber-600 dark:text-amber-400 dark:border-amber-400"
                    : "border-transparent text-slate-455 dark:text-slate-500 hover:text-slate-655 dark:hover:text-slate-350"
                }`
              }
            >
              💸 Tax Estimator
            </NavLink>
            <NavLink
              to="/planner"
              className={({ isActive }) =>
                `pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer decoration-transparent ${
                  isActive
                    ? "border-violet-600 text-violet-600 dark:text-violet-400 dark:border-violet-400"
                    : "border-transparent text-slate-455 dark:text-slate-500 hover:text-slate-655 dark:hover:text-slate-350"
                }`
              }
            >
              📋 Budget Planner
            </NavLink>
            <NavLink
              to="/achievements"
              className={({ isActive }) =>
                `pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer decoration-transparent ${
                  isActive
                    ? "border-yellow-500 text-yellow-600 dark:text-yellow-400 dark:border-yellow-400"
                    : "border-transparent text-slate-455 dark:text-slate-500 hover:text-slate-655 dark:hover:text-slate-350"
                }`
              }
            >
              🏆 Achievements {gamificationData ? `(${gamificationData.earned_badge_count}/${gamificationData.total_badge_count})` : ""}
            </NavLink>
            <div className="ml-auto pb-3 flex items-center gap-2">
              <button
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = `http://127.0.0.1:8000/report/pdf?email=${userEmail}`;
                  a.click();
                }}
                className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                title="Download Health Report PDF"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                PDF Report
              </button>
              <button
                onClick={handleCSVExport}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-655 dark:text-slate-300 text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer bg-transparent border-none"
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

        <Outlet />
      </div>

      {/* Account Add/Edit Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 max-w-md w-full p-8 relative">
            <button onClick={() => setShowAccountModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-655 dark:hover:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-850 p-1.5 rounded-lg cursor-pointer bg-transparent border-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                {accountModalMode === "add" ? "Add Account" : "Edit Account"}
              </h3>
              <p className="text-xs text-slate-550 dark:text-slate-455 mt-1">Track balance across your wallets and bank accounts</p>
            </div>
            <form onSubmit={handleAccountSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Account Name</label>
                <input type="text" required value={accountName} onChange={e => setAccountName(e.target.value)} placeholder="e.g. HDFC Savings" className="w-full bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-850 dark:text-slate-100" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Account Type</label>
                  <select value={accountType} onChange={e => setAccountType(e.target.value)} className="w-full bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-850 dark:text-slate-100 cursor-pointer">
                    <option value="Bank">Bank</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Cash">Cash</option>
                    <option value="UPI Wallet">UPI Wallet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Balance (₹)</label>
                  <input type="number" value={accountBalance} onChange={e => setAccountBalance(e.target.value)} placeholder="0" className="w-full bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-550 text-slate-850 dark:text-slate-100" />
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
            <button onClick={() => setShowSplitModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-655 p-1.5 rounded-lg cursor-pointer bg-transparent border-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Record Split Bill</h3>
              <p className="text-xs text-slate-550 dark:text-slate-455 mt-1">Track shared expenses with friends or housemates</p>
            </div>
            <form onSubmit={handleSplitSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
                <input type="text" required value={splitDescription} onChange={e => setSplitDescription(e.target.value)} placeholder="e.g. Group Dinner at Barbeque Nation" className="w-full bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-850 dark:text-slate-100" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Total Bill (₹)</label>
                  <input type="number" required value={splitTotal} onChange={e => setSplitTotal(e.target.value)} placeholder="2500" className="w-full bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-850 dark:text-slate-100" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Friend's Name</label>
                  <input type="text" required value={splitFriend} onChange={e => setSplitFriend(e.target.value)} placeholder="Rahul" className="w-full bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-850 dark:text-slate-100" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Amount They Owe You (₹)</label>
                <input type="number" required value={splitOwed} onChange={e => setSplitOwed(e.target.value)} placeholder="1250" className="w-full bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-855 dark:text-slate-100" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 max-w-md w-full p-8 relative overflow-hidden">
            <button
              onClick={() => setShowGoalModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-655 dark:hover:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-855 p-1.5 rounded-lg transition-all cursor-pointer bg-transparent border-none"
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
                  className="w-full bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-850 dark:text-slate-100"
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
                    placeholder="1,50,000"
                    className="w-full bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-550 text-slate-850 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Current Saved (₹)</label>
                  <input
                    type="number"
                    value={goalCurrentAmount}
                    onChange={(e) => setGoalCurrentAmount(e.target.value)}
                    placeholder="15,000"
                    className="w-full bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-555 text-slate-855 dark:text-slate-100"
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
                  className="w-full bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-855 dark:text-slate-100"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 max-w-md w-full p-8 relative overflow-hidden">
            <button
              onClick={() => setShowSubModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-655 dark:hover:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-855 p-1.5 rounded-lg transition-all cursor-pointer bg-transparent border-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent inline-block">
                {subModalMode === "add" ? "Register Subscription" : "Edit Subscription"}
              </h3>
              <p className="text-xs text-slate-550 dark:text-slate-455 font-medium mt-1">
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
                  className="w-full bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-850 dark:text-slate-100"
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
                    className="w-full bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-550 text-slate-850 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Category</label>
                  <select
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    className="w-full bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-850 dark:text-slate-100 cursor-pointer"
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
                    className="w-full bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-555 text-slate-855 dark:text-slate-100 cursor-pointer"
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
                    className="w-full bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-555 text-slate-850 dark:text-slate-100"
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

      {/* Transaction Modal */}
      {showTxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 max-w-md w-full p-8 relative">
            <button onClick={() => setShowTxModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-655 p-1.5 rounded-lg cursor-pointer bg-transparent border-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                {txModalMode === "add" ? "Add Transaction" : "Edit Transaction"}
              </h3>
              <p className="text-xs text-slate-550 dark:text-slate-455 mt-1">Keep track of your income and day-to-day spending</p>
            </div>
            <form onSubmit={handleTxSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
                <input
                  type="text"
                  required
                  value={txDescription}
                  onChange={(e) => setTxDescription(e.target.value)}
                  placeholder="e.g. Swiggy Order"
                  className="w-full bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-850 dark:text-slate-100"
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
                    className="w-full bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-550 text-slate-850 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Date</label>
                  <input
                    type="date"
                    required
                    value={txDate}
                    onChange={(e) => setTxDate(e.target.value)}
                    className="w-full bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-850 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Category</label>
                  <select
                    value={txCategory}
                    onChange={(e) => setTxCategory(e.target.value)}
                    className="w-full bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-850 dark:text-slate-100 cursor-pointer"
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
                    className="w-full bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-555 text-slate-855 dark:text-slate-100 cursor-pointer"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md transition-all text-sm mt-4 flex items-center justify-center cursor-pointer"
              >
                {txModalMode === "add" ? "Create Record" : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 max-w-md w-full p-8 relative overflow-hidden">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-850 p-1.5 rounded-lg transition-all cursor-pointer bg-transparent border-none"
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
              <div className="bg-rose-50 dark:bg-rose-955/20 border border-rose-100 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs font-semibold p-3 rounded-xl mb-4 flex items-center gap-2">
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
                    className="w-full bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
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
                  className="w-full bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
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
                  className="w-full bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                />
              </div>

              <button
                type="submit"
                disabled={isLoadingAuth}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3 rounded-xl shadow-md transition-all text-sm mt-2 flex items-center justify-center cursor-pointer"
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
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-bold transition-all cursor-pointer bg-transparent border-none"
              >
                {authMode === "login" ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reminder Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 max-w-md w-full p-8 relative">
            <button onClick={() => setShowReminderModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-655 p-1.5 rounded-lg cursor-pointer bg-transparent border-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Add Bill Reminder</h3>
              <p className="text-xs text-slate-550 dark:text-slate-455 mt-1">Get notified before your bills are due</p>
            </div>
            <form onSubmit={handleReminderSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Bill / Reminder Name</label>
                <input type="text" required value={reminderName} onChange={e => setReminderName(e.target.value)} placeholder="e.g. Broadband Bill" className="w-full bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-850 dark:text-slate-100" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Amount (₹)</label>
                  <input type="number" required value={reminderAmount} onChange={e => setReminderAmount(e.target.value)} placeholder="999" className="w-full bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-850 dark:text-slate-100" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Category</label>
                  <select value={reminderCategory} onChange={e => setReminderCategory(e.target.value)} className="w-full bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-855 dark:text-slate-100 cursor-pointer">
                    <option value="Rent">Rent</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Due Date</label>
                <input type="date" required value={reminderDueDate} onChange={e => setReminderDueDate(e.target.value)} className="w-full bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-850 dark:text-slate-100" />
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md transition-all text-sm mt-4 cursor-pointer">
                Create Reminder
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
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 duration-200 flex items-center justify-center cursor-pointer border-none"
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
                <button onClick={() => setChatOpen(false)} className="text-white/80 hover:text-white cursor-pointer bg-transparent border-none">
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
                  className="w-full bg-slate-55 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-550 text-slate-800 dark:text-slate-100"
                />
                <button
                  type="submit"
                  disabled={chatLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-3.5 rounded-xl flex items-center justify-center shadow-sm cursor-pointer border-none"
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
    </div>
  );
};

export default Layout;
