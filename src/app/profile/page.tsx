"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Mail,
  Save,
  LogOut,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      router.push("/login");
      return;
    }

    setEmail(user.email || "");
    setFullName(
      user.user_metadata?.full_name || ""
    );

    setLoading(false);
  }

  async function saveProfile() {
    if (!fullName.trim()) {
      setMessage("Please enter your name.");
      return;
    }

    setSaving(true);
    setMessage("");

    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: fullName.trim(),
      },
    });

    if (error) {
      setMessage(error.message);
      setSaving(false);
      return;
    }

    setMessage("Profile updated successfully.");
    setSaving(false);
  }

  async function changePassword() {
    if (!newPassword) {
      setMessage("Please enter a new password.");
      return;
    }

    if (newPassword.length < 8) {
      setMessage(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setSaving(true);
    setMessage("");

    const { error } =
      await supabase.auth.updateUser({
        password: newPassword,
      });

    if (error) {
      setMessage(error.message);
      setSaving(false);
      return;
    }

    setNewPassword("");
    setConfirmPassword("");

    setMessage(
      "Password changed successfully."
    );

    setSaving(false);
  }

  async function logout() {
    await supabase.auth.signOut();

    router.push("/login");
    router.refresh();
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-300 via-pink-400 to-rose-500 shadow-[inset_4px_4px_10px_rgba(255,255,255,0.65),inset_-5px_-5px_12px_rgba(190,24,93,0.25),0_15px_30px_rgba(236,72,153,0.25)] flex items-center justify-center mx-auto mb-4">
            <User className="w-7 h-7 text-white" />
          </div>

          <p className="text-slate-500 font-medium">
            Loading profile...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-white text-slate-800">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-pink-200/50 blur-3xl" />

        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-rose-200/45 blur-3xl" />

        <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] rounded-full bg-fuchsia-100/50 blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() =>
                router.push("/dashboard")
              }
              className="w-11 h-11 rounded-2xl bg-white/70 border border-white/90 backdrop-blur-xl flex items-center justify-center text-slate-500 hover:text-pink-500 hover:bg-white transition shadow-[0_10px_25px_rgba(190,24,93,0.08)]"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Profile & Settings
              </h1>

              <p className="text-slate-400 mt-1">
                Manage your TaskFlow account.
              </p>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className="mb-6 rounded-2xl border border-pink-100 bg-pink-50/80 px-4 py-3 flex items-center gap-3 text-sm text-pink-600">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              {message}
            </div>
          )}

          <div className="grid lg:grid-cols-[280px_1fr] gap-6">
            {/* Profile Card */}
            <div className="rounded-[32px] border border-white/80 bg-white/60 backdrop-blur-2xl p-6 shadow-[0_25px_70px_rgba(190,24,93,0.1),inset_0_1px_0_rgba(255,255,255,0.9)] h-fit">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-[30px] bg-gradient-to-br from-pink-300 via-pink-400 to-rose-500 flex items-center justify-center text-white text-3xl font-bold shadow-[inset_6px_6px_14px_rgba(255,255,255,0.55),inset_-7px_-7px_15px_rgba(190,24,93,0.25),0_18px_35px_rgba(236,72,153,0.22)]">
                  {fullName
                    ? fullName
                        .charAt(0)
                        .toUpperCase()
                    : "U"}
                </div>

                <h2 className="font-bold text-xl mt-5">
                  {fullName || "Your Name"}
                </h2>

                <p className="text-sm text-slate-400 mt-1 break-all">
                  {email}
                </p>

                <div className="mt-5 px-4 py-2 rounded-full bg-pink-50 border border-pink-100 text-xs font-semibold text-pink-500">
                  TaskFlow User
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-6">
              {/* Personal Information */}
              <section className="rounded-[32px] border border-white/80 bg-white/60 backdrop-blur-2xl p-6 md:p-8 shadow-[0_25px_70px_rgba(190,24,93,0.1),inset_0_1px_0_rgba(255,255,255,0.9)]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 rounded-2xl bg-pink-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-pink-500" />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold">
                      Personal Information
                    </h2>

                    <p className="text-sm text-slate-400">
                      Update your profile details.
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Full Name
                    </label>

                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400" />

                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) =>
                          setFullName(
                            e.target.value
                          )
                        }
                        placeholder="Enter your name"
                        className="w-full rounded-2xl border border-pink-100 bg-white px-11 py-3.5 outline-none focus:ring-2 focus:ring-pink-200 transition"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />

                      <input
                        type="email"
                        value={email}
                        disabled
                        className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-11 py-3.5 outline-none text-slate-400 cursor-not-allowed"
                      />
                    </div>

                    <p className="text-xs text-slate-400 mt-2">
                      Your email address cannot be
                      changed here.
                    </p>
                  </div>

                  <button
                    onClick={saveProfile}
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-400 to-rose-500 text-white font-semibold shadow-[inset_2px_2px_6px_rgba(255,255,255,0.4),inset_-3px_-3px_8px_rgba(190,24,93,0.2),0_12px_25px_rgba(236,72,153,0.2)] hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />

                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </div>
              </section>

              {/* Password */}
              <section className="rounded-[32px] border border-white/80 bg-white/60 backdrop-blur-2xl p-6 md:p-8 shadow-[0_25px_70px_rgba(190,24,93,0.1),inset_0_1px_0_rgba(255,255,255,0.9)]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 rounded-2xl bg-pink-100 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-pink-500" />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold">
                      Password
                    </h2>

                    <p className="text-sm text-slate-400">
                      Change your account password.
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      New Password
                    </label>

                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) =>
                        setNewPassword(
                          e.target.value
                        )
                      }
                      placeholder="Minimum 8 characters"
                      className="w-full rounded-2xl border border-pink-100 bg-white px-4 py-3.5 outline-none focus:ring-2 focus:ring-pink-200 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Confirm New Password
                    </label>

                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(
                          e.target.value
                        )
                      }
                      placeholder="Re-enter your password"
                      className="w-full rounded-2xl border border-pink-100 bg-white px-4 py-3.5 outline-none focus:ring-2 focus:ring-pink-200 transition"
                    />
                  </div>

                  <button
                    onClick={changePassword}
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white border border-pink-100 text-pink-500 font-semibold hover:bg-pink-50 transition disabled:opacity-50"
                  >
                    <Lock className="w-4 h-4" />

                    {saving
                      ? "Updating..."
                      : "Change Password"}
                  </button>
                </div>
              </section>

              {/* Logout */}
              <section className="rounded-[32px] border border-red-100 bg-white/60 backdrop-blur-2xl p-6 md:p-8 shadow-[0_20px_50px_rgba(190,24,93,0.06)]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="font-bold">
                      Sign out
                    </h2>

                    <p className="text-sm text-slate-400 mt-1">
                      Sign out of your TaskFlow account
                      on this device.
                    </p>
                  </div>

                  <button
                    onClick={logout}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-red-50 border border-red-100 text-red-500 font-semibold hover:bg-red-100 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}