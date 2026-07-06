import React, { useState } from "react";
import { useFinance } from "../context/FinanceContext";

const API = "http://127.0.0.1:8000";

const Settings: React.FC = () => {
  const { userEmail, theme, setTheme, handleLogout, showToast, confirmAction } = useFinance();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const token = () => localStorage.getItem("token");

  // NOTE: these two endpoints (PUT /profile/password and DELETE /profile)
  // do not exist in the backend yet — see the note in the danger zone below.
  // Both are wired up and ready to go the moment they're added.
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    if (newPassword !== confirmPassword) {
      showToast("New passwords don't match.", "error");
      return;
    }
    setSavingPassword(true);
    try {
      const res = await fetch(`${API}/profile/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });
      if (res.ok) {
        showToast("Password updated.", "success");
        setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      } else if (res.status === 404) {
        showToast("Password change isn't wired up on the backend yet.", "error");
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.detail || "Failed to update password.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Couldn't reach the backend.", "error");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    const ok = await confirmAction("Delete your account permanently? This cannot be undone.");
    if (!ok) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API}/profile`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token()}` },
      });
      if (res.ok) {
        showToast("Account deleted.", "info");
        handleLogout();
      } else if (res.status === 404) {
        showToast("Account deletion isn't wired up on the backend yet.", "error");
      } else {
        showToast("Failed to delete account.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Couldn't reach the backend.", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-white dark:bg-stone-900 border border-stone-150 dark:border-stone-800 p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-serif font-bold text-stone-850 dark:text-stone-100">Settings</h2>
        <p className="text-xs text-stone-450 dark:text-stone-500 font-medium mt-1">Your account and app preferences.</p>
      </div>

      {/* Profile */}
      <div className="bg-white dark:bg-stone-900 border border-stone-150 dark:border-stone-800 rounded-xl shadow-sm p-6">
        <h3 className="text-base font-serif font-bold text-stone-850 dark:text-stone-100 mb-4">Profile</h3>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-teal-700 text-white flex items-center justify-center text-lg font-bold shrink-0">
            {userEmail ? userEmail.slice(0, 1).toUpperCase() : "?"}
          </div>
          <div>
            <p className="text-sm font-bold text-stone-800 dark:text-stone-100">{userEmail}</p>
            <p className="text-xs text-stone-450">Signed in</p>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white dark:bg-stone-900 border border-stone-150 dark:border-stone-800 rounded-xl shadow-sm p-6">
        <h3 className="text-base font-serif font-bold text-stone-850 dark:text-stone-100 mb-4">Preferences</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-stone-700 dark:text-stone-300">Theme</p>
            <p className="text-xs text-stone-450">Currently {theme === "light" ? "light" : "dark"} mode</p>
          </div>
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-750 text-stone-600 dark:text-stone-300 text-xs font-bold py-2 px-4 rounded-lg transition-all cursor-pointer border-none"
          >
            Switch to {theme === "light" ? "dark" : "light"}
          </button>
        </div>
      </div>

      {/* Change password */}
      <div className="bg-white dark:bg-stone-900 border border-stone-150 dark:border-stone-800 rounded-xl shadow-sm p-6">
        <h3 className="text-base font-serif font-bold text-stone-850 dark:text-stone-100 mb-1">Change password</h3>
        <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 rounded-lg px-3 py-2 mb-4">
          The backend endpoint for this doesn't exist yet — this form is ready to go, it just needs <code>PUT /profile/password</code> added server-side.
        </p>
        <form onSubmit={handleChangePassword} className="space-y-3">
          <input
            type="password"
            required
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="modal-input"
          />
          <input
            type="password"
            required
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="modal-input"
          />
          <input
            type="password"
            required
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="modal-input"
          />
          <button
            type="submit"
            disabled={savingPassword}
            className="bg-teal-700 hover:bg-teal-800 disabled:bg-teal-400 text-white text-sm font-bold py-2.5 px-5 rounded-lg transition-all cursor-pointer border-none"
          >
            {savingPassword ? "Saving…" : "Update password"}
          </button>
        </form>
      </div>

      {/* Danger zone */}
      <div className="bg-white dark:bg-stone-900 border border-coral-200 dark:border-coral-900 rounded-xl shadow-sm p-6">
        <h3 className="text-base font-serif font-bold text-coral-700 dark:text-coral-400 mb-1">Danger zone</h3>
        <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 rounded-lg px-3 py-2 mb-4">
          The backend endpoint for this doesn't exist yet either — needs <code>DELETE /profile</code> added server-side.
        </p>
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
          Deleting your account permanently removes your login and cannot be undone. Your financial data on this device isn't automatically wiped.
        </p>
        <button
          onClick={handleDeleteAccount}
          disabled={deleting}
          className="bg-coral-600 hover:bg-coral-700 disabled:bg-coral-300 text-white text-sm font-bold py-2.5 px-5 rounded-lg transition-all cursor-pointer border-none"
        >
          {deleting ? "Deleting…" : "Delete my account"}
        </button>
      </div>
    </div>
  );
};

export default Settings;
