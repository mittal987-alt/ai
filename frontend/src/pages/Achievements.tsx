import React from "react";
import { useFinance } from "../context/FinanceContext";

const Achievements: React.FC = () => {
  const { gamificationData } = useFinance();

  if (!gamificationData) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-3">🏆</p>
        <p className="font-bold text-slate-600 dark:text-slate-400">Start tracking to earn badges!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-8">
      {/* Level & XP Hero */}
      <div className="bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg shadow-amber-200 dark:shadow-none relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white transform translate-x-20 -translate-y-20"></div>
        </div>
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
              <div
                className="bg-white h-full rounded-full transition-all duration-700"
                style={{ width: `${gamificationData.progress_pct}%` }}
              ></div>
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
            <div
              key={badge.id}
              className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                badge.earned
                  ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"
                  : "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 opacity-50 grayscale"
              }`}
            >
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
    </div>
  );
};

export default Achievements;
