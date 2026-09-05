"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

      if (loginError) {
        setError(loginError.message);
        return;
      }

      if (!data.user) {
        setError("Login failed. Please try again.");
        return;
      }

      const params = new URLSearchParams(
        window.location.search
      );

      const redirectPath =
        params.get("redirect");

      const safeRedirect =
        redirectPath &&
        redirectPath.startsWith("/") &&
        !redirectPath.startsWith("//")
          ? redirectPath
          : "/dashboard";

      router.push(safeRedirect);
      router.refresh();
    } catch (err) {
      console.error("Login error:", err);
      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError(
        "Enter your email address first."
      );
      return;
    }

    setLoading(true);

    try {
      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(
          trimmedEmail,
          {
            redirectTo: `${window.location.origin}/reset-password`,
          }
        );

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setError(
        "Password reset instructions have been sent to your email."
      );
    } catch (err) {
      console.error(
        "Password reset error:",
        err
      );

      setError(
        "Unable to send password reset email."
      );
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

            Task
            <span className="text-pink-500">
              Flow
            </span>

          </span>

        </Link>

        {/* Signup */}

        <Link
          href="/signup"
          className="px-5 py-2.5 rounded-full bg-white/55 backdrop-blur-2xl border border-white/80 shadow-sm text-sm font-semibold text-gray-800 hover:bg-white/75 hover:-translate-y-0.5 transition-all"
        >
          Sign up
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
                  Welcome back
                </span>

              </div>

              {/* Heading */}

              <h1 className="text-5xl xl:text-6xl font-bold tracking-tight text-gray-900 leading-[1.05]">

                Get things
                <br />

                <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                  done.
                </span>{" "}

                beautifully.

              </h1>

              {/* Description */}

              <p className="mt-6 text-lg leading-8 text-gray-600 max-w-md">

                Sign in to your TaskFlow workspace and continue
                turning your ideas into meaningful progress.

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
              LOGIN CARD
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

                      Task
                      <span className="text-pink-500">
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
                      Sign in
                    </span>

                  </div>

                  <h2 className="text-3xl font-bold text-gray-900">
                    Welcome back
                  </h2>

                  <p className="mt-2 text-gray-500">
                    Sign in to continue to TaskFlow.
                  </p>

                </div>

                {/* =================================
                    ERROR / MESSAGE
                ================================= */}

                {error && (
                  <div className="mb-5 rounded-2xl bg-pink-50/80 backdrop-blur-xl border border-pink-200 px-4 py-3 text-sm text-pink-600">

                    {error}

                  </div>
                )}

                {/* =================================
                    FORM
                ================================= */}

                <form
                  onSubmit={handleLogin}
                  className="space-y-5"
                >

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
                        setEmail(
                          e.target.value
                        )
                      }
                      placeholder="you@example.com"
                      autoComplete="email"
                      disabled={loading}
                      className="w-full h-12 px-4 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/90 outline-none text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-pink-300/60 focus:border-pink-300 focus:bg-white/75 transition-all disabled:opacity-60"
                    />

                  </div>

                  {/* PASSWORD */}

                  <div>

                    <div className="flex items-center justify-between mb-2">

                      <label
                        htmlFor="password"
                        className="block text-sm font-semibold text-gray-700"
                      >
                        Password
                      </label>

                      <button
                        type="button"
                        onClick={
                          handleForgotPassword
                        }
                        disabled={loading}
                        className="text-sm font-semibold text-pink-500 hover:text-pink-600 transition disabled:opacity-50"
                      >
                        Forgot password?
                      </button>

                    </div>

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
                          setPassword(
                            e.target.value
                          )
                        }
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        disabled={loading}
                        className="w-full h-12 px-4 pr-14 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/90 outline-none text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-pink-300/60 focus:border-pink-300 focus:bg-white/75 transition-all disabled:opacity-60"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            !showPassword
                          )
                        }
                        disabled={loading}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500 transition"
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPassword
                          ? "◉"
                          : "◌"}
                      </button>

                    </div>

                  </div>

                  {/* =================================
                      REMEMBER ME
                  ================================= */}

                  <div className="flex items-center gap-3">

                    <button
                      type="button"
                      onClick={() =>
                        setRememberMe(
                          !rememberMe
                        )
                      }
                      disabled={loading}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                        rememberMe
                          ? "bg-pink-500 border-pink-500 shadow-sm shadow-pink-500/20"
                          : "bg-white/60 border-gray-300"
                      }`}
                      aria-label="Remember me"
                    >

                      {rememberMe && (
                        <span className="text-white text-xs font-bold">
                          ✓
                        </span>
                      )}

                    </button>

                    <span className="text-sm text-gray-600">
                      Remember me
                    </span>

                  </div>

                  {/* =================================
                      SIGN IN BUTTON
                  ================================= */}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold shadow-lg shadow-pink-500/20 hover:shadow-xl hover:shadow-pink-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >

                    {loading
                      ? "Signing in..."
                      : "Sign in"}

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
                    SIGNUP
                ================================= */}

                <p className="text-center text-sm text-gray-500 mt-7">

                  Don&apos;t have an account?{" "}

                  <Link
                    href="/signup"
                    className="font-semibold text-pink-500 hover:text-pink-600 transition"
                  >
                    Create account
                  </Link>

                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}