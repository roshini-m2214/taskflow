"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    // Validation
    if (!trimmedName) {
      setError("Please enter your full name.");
      return;
    }

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: signupError } =
        await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              full_name: trimmedName,
            },
          },
        });

      if (signupError) {
        setError(signupError.message);
        return;
      }

      if (!data.user) {
        setError(
          "Account could not be created. Please try again."
        );
        return;
      }

      setSuccess(
        "Account created successfully! Please check your email to verify your account."
      );

      // Clear form after successful signup
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Signup error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fff1f7] relative overflow-hidden text-gray-900">

      {/* =========================================
          LIQUID GLASS BACKGROUND
      ========================================= */}

      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-pink-300/35 rounded-full blur-3xl" />

      <div className="absolute top-1/4 -right-40 w-[500px] h-[500px] bg-rose-300/30 rounded-full blur-3xl" />

      <div className="absolute -bottom-40 left-1/4 w-[500px] h-[500px] bg-pink-200/30 rounded-full blur-3xl" />

      <div className="absolute top-1/2 left-1/2 w-[350px] h-[350px] bg-fuchsia-200/20 rounded-full blur-3xl" />

      {/* Floating glass shapes */}

      <div className="absolute top-24 right-[18%] w-20 h-20 rounded-[28px] bg-white/20 backdrop-blur-xl border border-white/40 rotate-12" />

      <div className="absolute bottom-24 left-[12%] w-28 h-28 rounded-full bg-white/20 backdrop-blur-xl border border-white/40" />

      {/* =========================================
          NAVBAR
      ========================================= */}

      <nav className="relative z-10 flex items-center justify-between px-6 sm:px-10 lg:px-16 py-6">

        {/* Logo */}

        <Link
          href="/"
          className="flex items-center gap-3 group"
        >

          <div className="w-11 h-11 rounded-2xl bg-white/55 backdrop-blur-2xl border border-white/80 shadow-[0_10px_30px_rgba(236,72,153,0.12)] flex items-center justify-center transition group-hover:scale-105">

            <div className="relative w-6 h-6 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 shadow-lg shadow-pink-500/30">

              <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white/70 blur-[1px]" />

            </div>

          </div>

          <span className="text-2xl font-bold tracking-tight text-gray-900">

            Task<span className="text-pink-500">Flow</span>

          </span>

        </Link>

        {/* Login */}

        <Link
          href="/login"
          className="px-5 py-2.5 rounded-full bg-white/55 backdrop-blur-2xl border border-white/80 shadow-sm text-sm font-semibold text-gray-800 hover:bg-white/75 hover:-translate-y-0.5 transition-all"
        >
          Log in
        </Link>

      </nav>

      {/* =========================================
          MAIN
      ========================================= */}

      <section className="relative z-10 min-h-[calc(100vh-100px)] flex items-center justify-center px-5 py-10">

        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">

          {/* =====================================
              LEFT CONTENT
          ===================================== */}

          <div className="hidden lg:block">

            <div className="max-w-lg">

              {/* Badge */}

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-2xl border border-white/80 shadow-sm mb-7">

                <span className="relative flex w-2.5 h-2.5">

                  <span className="absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-60 animate-ping" />

                  <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-pink-500" />

                </span>

                <span className="text-sm font-medium text-gray-700">
                  Start organizing today
                </span>

              </div>

              {/* Heading */}

              <h1 className="text-5xl xl:text-6xl font-bold tracking-tight text-gray-900 leading-[1.05]">

                Turn your
                <br />

                <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                  ideas
                </span>{" "}

                into action.

              </h1>

              {/* Description */}

              <p className="mt-6 text-lg leading-8 text-gray-600 max-w-md">

                Create your TaskFlow account and bring your tasks,
                projects, and team workflow together in one beautiful
                workspace.

              </p>

              {/* =================================
                  JELLY / CLAY GLASS ICONS
              ================================= */}

              <div className="mt-11 flex items-center gap-5">

                {/* Jelly 1 */}

                <div className="w-20 h-20 rounded-[28px] bg-white/50 backdrop-blur-2xl border border-white/80 shadow-[0_15px_35px_rgba(236,72,153,0.12)] rotate-[-8deg] flex items-center justify-center">

                  <div className="relative w-11 h-11 rounded-[17px] bg-gradient-to-br from-pink-400 to-rose-500 shadow-lg shadow-pink-500/25">

                    <div className="absolute top-2 left-2 w-3 h-2 rounded-full bg-white/50 blur-[1px]" />

                  </div>

                </div>

                {/* Jelly 2 */}

                <div className="w-20 h-20 rounded-[28px] bg-white/50 backdrop-blur-2xl border border-white/80 shadow-[0_15px_35px_rgba(236,72,153,0.12)] translate-y-4 rotate-[7deg] flex items-center justify-center">

                  <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-pink-300 to-fuchsia-500 shadow-lg shadow-pink-500/25">

                    <div className="absolute top-2 left-2 w-3 h-2 rounded-full bg-white/50 blur-[1px]" />

                  </div>

                </div>

                {/* Jelly 3 */}

                <div className="w-20 h-20 rounded-[28px] bg-white/50 backdrop-blur-2xl border border-white/80 shadow-[0_15px_35px_rgba(236,72,153,0.12)] rotate-[-4deg] flex items-center justify-center">

                  <div className="relative w-11 h-11 rounded-[17px] bg-gradient-to-br from-rose-400 to-pink-500 shadow-lg shadow-pink-500/25 rotate-12">

                    <div className="absolute top-2 left-2 w-3 h-2 rounded-full bg-white/50 blur-[1px]" />

                  </div>

                </div>

              </div>

              {/* =================================
                  STATS
              ================================= */}

              <div className="mt-12 flex gap-10">

                <div>

                  <p className="text-2xl font-bold text-gray-900">
                    Simple
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Easy to use
                  </p>

                </div>

                <div>

                  <p className="text-2xl font-bold text-gray-900">
                    Focused
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Stay productive
                  </p>

                </div>

                <div>

                  <p className="text-2xl font-bold text-gray-900">
                    Secure
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Your workspace
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* =====================================
              SIGNUP CARD
          ===================================== */}

          <div className="w-full max-w-md mx-auto">

            <div className="relative rounded-[34px] bg-white/50 backdrop-blur-3xl border border-white/80 shadow-[0_30px_100px_rgba(236,72,153,0.14)] p-7 sm:p-9 overflow-hidden">

              {/* Glass shine */}

              <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-pink-200/25 blur-3xl pointer-events-none" />

              <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-rose-200/20 blur-3xl pointer-events-none" />

              <div className="relative z-10">

                {/* =================================
                    MOBILE LOGO
                ================================= */}

                <div className="lg:hidden flex justify-center mb-7">

                  <Link
                    href="/"
                    className="flex items-center gap-3"
                  >

                    <div className="w-11 h-11 rounded-2xl bg-white/65 backdrop-blur-xl border border-white/80 shadow-lg flex items-center justify-center">

                      <div className="relative w-6 h-6 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 shadow-md">

                        <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white/60" />

                      </div>

                    </div>

                    <span className="text-2xl font-bold text-gray-900">

                      Task<span className="text-pink-500">
                        Flow
                      </span>

                    </span>

                  </Link>

                </div>

                {/* =================================
                    HEADING
                ================================= */}

                <div className="mb-7">

                  <div className="inline-flex items-center gap-2 mb-3">

                    <span className="w-2 h-2 rounded-full bg-pink-500" />

                    <span className="text-xs font-bold uppercase tracking-wider text-pink-500">
                      Create account
                    </span>

                  </div>

                  <h2 className="text-3xl font-bold text-gray-900">
                    Create your account
                  </h2>

                  <p className="mt-2 text-gray-500">
                    Start managing your work with TaskFlow.
                  </p>

                </div>

                {/* =================================
                    ERROR
                ================================= */}

                {error && (

                  <div className="mb-5 rounded-2xl bg-pink-50/80 backdrop-blur-xl border border-pink-200 px-4 py-3 text-sm text-pink-600">

                    {error}

                  </div>

                )}

                {/* =================================
                    SUCCESS
                ================================= */}

                {success && (

                  <div className="mb-5 rounded-2xl bg-pink-50/80 backdrop-blur-xl border border-pink-200 px-4 py-3 text-sm text-pink-600">

                    <div className="flex items-start gap-3">

                      <div className="w-6 h-6 rounded-full bg-pink-500 text-white flex items-center justify-center text-xs flex-shrink-0">
                        ✓
                      </div>

                      <span>
                        {success}
                      </span>

                    </div>

                  </div>

                )}

                {/* =================================
                    FORM
                ================================= */}

                <form
                  onSubmit={handleSignup}
                  className="space-y-5"
                >

                  {/* NAME */}

                  <div>

                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Full name
                    </label>

                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      placeholder="Enter your name"
                      autoComplete="name"
                      disabled={loading}
                      className="w-full h-12 px-4 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/90 outline-none text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-pink-300/60 focus:border-pink-300 focus:bg-white/75 transition-all disabled:opacity-60"
                    />

                  </div>

                  {/* EMAIL */}

                  <div>

                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Email address
                    </label>

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      placeholder="you@example.com"
                      autoComplete="email"
                      disabled={loading}
                      className="w-full h-12 px-4 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/90 outline-none text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-pink-300/60 focus:border-pink-300 focus:bg-white/75 transition-all disabled:opacity-60"
                    />

                  </div>

                  {/* PASSWORD */}

                  <div>

                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Password
                    </label>

                    <div className="relative">

                      <input
                        id="password"
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        value={password}
                        onChange={(e) =>
                          setPassword(e.target.value)
                        }
                        placeholder="At least 8 characters"
                        autoComplete="new-password"
                        disabled={loading}
                        className="w-full h-12 px-4 pr-14 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/90 outline-none text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-pink-300/60 focus:border-pink-300 focus:bg-white/75 transition-all disabled:opacity-60"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                        disabled={loading}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500 transition"
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPassword ? "◉" : "◌"}
                      </button>

                    </div>

                  </div>

                  {/* CONFIRM PASSWORD */}

                  <div>

                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Confirm password
                    </label>

                    <div className="relative">

                      <input
                        id="confirmPassword"
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        value={confirmPassword}
                        onChange={(e) =>
                          setConfirmPassword(
                            e.target.value
                          )
                        }
                        placeholder="Enter your password again"
                        autoComplete="new-password"
                        disabled={loading}
                        className="w-full h-12 px-4 pr-14 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/90 outline-none text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-pink-300/60 focus:border-pink-300 focus:bg-white/75 transition-all disabled:opacity-60"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword
                          )
                        }
                        disabled={loading}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500 transition"
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showConfirmPassword
                          ? "◉"
                          : "◌"}
                      </button>

                    </div>

                  </div>

                  {/* =================================
                      PASSWORD REQUIREMENT
                  ================================= */}

                  <div className="rounded-2xl bg-white/40 backdrop-blur-xl border border-white/70 px-4 py-3">

                    <p className="text-xs font-semibold text-gray-600 mb-2">
                      Password requirements
                    </p>

                    <div className="flex items-center gap-2">

                      <span
                        className={`w-2 h-2 rounded-full ${
                          password.length >= 8
                            ? "bg-pink-500"
                            : "bg-gray-300"
                        }`}
                      />

                      <span className="text-xs text-gray-500">
                        At least 8 characters
                      </span>

                    </div>

                  </div>

                  {/* =================================
                      SUBMIT
                  ================================= */}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold shadow-lg shadow-pink-500/20 hover:shadow-xl hover:shadow-pink-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >

                    {loading
                      ? "Creating account..."
                      : "Create account"}

                  </button>

                </form>

                {/* =================================
                    DIVIDER
                ================================= */}

                <div className="flex items-center gap-4 my-6">

                  <div className="h-px flex-1 bg-pink-200/60" />

                  <span className="text-xs font-medium text-gray-400">
                    OR
                  </span>

                  <div className="h-px flex-1 bg-pink-200/60" />

                </div>

                {/* =================================
                    GOOGLE
                ================================= */}

                <button
                  type="button"
                  disabled={loading}
                  className="w-full h-12 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/90 text-gray-700 font-semibold hover:bg-white/80 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 disabled:opacity-60"
                >

                  <span className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shadow-sm text-base font-bold">
                    G
                  </span>

                  Continue with Google

                </button>

                {/* =================================
                    LOGIN
                ================================= */}

                <p className="text-center text-sm text-gray-500 mt-7">

                  Already have an account?{" "}

                  <Link
                    href="/login"
                    className="font-semibold text-pink-500 hover:text-pink-600 transition"
                  >
                    Log in
                  </Link>

                </p>

                {/* =================================
                    TERMS
                ================================= */}

                <p className="text-center text-xs text-gray-400 mt-5 leading-5">

                  By creating an account, you agree to our{" "}

                  <span className="text-pink-400">
                    Terms of Service
                  </span>{" "}

                  and{" "}

                  <span className="text-pink-400">
                    Privacy Policy
                  </span>
                  .

                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}