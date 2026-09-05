"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
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

    const { data, error: loginError } =
      await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      setError("Unable to sign in. Please try again.");
      setLoading(false);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const redirectPath = params.get("redirect");

    const safeRedirect =
      redirectPath &&
      redirectPath.startsWith("/") &&
      !redirectPath.startsWith("//")
        ? redirectPath
        : "/dashboard";

    router.push(safeRedirect);
    router.refresh();

    setLoading(false);
  }

  async function handleGoogleLogin() {
    setError("");
    setLoading(true);

    const { error: googleError } =
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

    if (googleError) {
      console.error("Google sign-in error:", googleError);

      setError(
        googleError.message ||
          "Unable to sign in with Google. Please try again."
      );

      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    setError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Enter your email address first.");
      return;
    }

    setLoading(true);

    const { error: resetError } =
      await supabase.auth.resetPasswordForEmail(
        trimmedEmail,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setError(
      "Password reset instructions have been sent to your email."
    );

    setLoading(false);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fff0f5] text-gray-900">
      <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-pink-300/30 blur-3xl" />

      <div className="absolute -right-40 top-1/4 h-[500px] w-[500px] rounded-full bg-rose-300/25 blur-3xl" />

      <div className="absolute -bottom-40 left-1/4 h-[500px] w-[500px] rounded-full bg-fuchsia-200/25 blur-3xl" />

      <nav className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-10 lg:px-16">
        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-white/60 shadow-lg backdrop-blur-xl">
            <div className="h-6 w-6 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 shadow-lg shadow-pink-500/30" />
          </div>

          <span className="text-2xl font-bold tracking-tight">
            Task<span className="text-pink-500">Flow</span>
          </span>
        </Link>

        <Link
          href="/signup"
          className="rounded-full border border-white/80 bg-white/60 px-5 py-2.5 text-sm font-semibold text-gray-800 shadow-sm backdrop-blur-xl transition hover:bg-white/80"
        >
          Sign up
        </Link>
      </nav>

      <section className="relative z-10 flex min-h-[calc(100vh-100px)] items-center justify-center px-5 py-10">
        <div className="grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div className="hidden lg:block">
            <div className="max-w-lg">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/55 px-4 py-2 shadow-sm backdrop-blur-xl">
                <span className="h-2.5 w-2.5 rounded-full bg-pink-500" />

                <span className="text-sm font-medium text-gray-700">
                  Welcome back
                </span>
              </div>

              <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-gray-900 xl:text-6xl">
                Get things
                <br />

                <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                  done.
                </span>{" "}
                beautifully.
              </h1>

              <p className="mt-6 max-w-md text-lg leading-8 text-gray-600">
                Sign in to your TaskFlow workspace and continue
                turning your ideas into meaningful progress.
              </p>

              <div className="mt-10 flex items-center gap-5">
                <div className="flex h-20 w-20 rotate-[-8deg] items-center justify-center rounded-[28px] border border-white/80 bg-white/55 shadow-lg backdrop-blur-xl">
                  <div className="h-11 w-11 rounded-[17px] bg-gradient-to-br from-pink-400 to-rose-500 shadow-lg shadow-pink-500/25" />
                </div>

                <div className="flex h-20 w-20 translate-y-4 rotate-[7deg] items-center justify-center rounded-[28px] border border-white/80 bg-white/55 shadow-lg backdrop-blur-xl">
                  <div className="h-11 w-11 rounded-full bg-gradient-to-br from-pink-300 to-fuchsia-500 shadow-lg shadow-pink-500/25" />
                </div>

                <div className="flex h-20 w-20 rotate-[-4deg] items-center justify-center rounded-[28px] border border-white/80 bg-white/55 shadow-lg backdrop-blur-xl">
                  <div className="h-11 w-11 rotate-12 rounded-[17px] bg-gradient-to-br from-rose-400 to-pink-500 shadow-lg shadow-pink-500/25" />
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-md">
            <div className="rounded-[34px] border border-white/80 bg-white/55 p-7 shadow-[0_30px_100px_rgba(236,72,153,0.15)] backdrop-blur-3xl sm:p-9">
              <div className="mb-7 flex justify-center lg:hidden">
                <Link
                  href="/"
                  className="flex items-center gap-3"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-white/65 shadow-lg backdrop-blur-xl">
                    <div className="h-6 w-6 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500" />
                  </div>

                  <span className="text-2xl font-bold">
                    Task<span className="text-pink-500">Flow</span>
                  </span>
                </Link>
              </div>

              <div className="mb-7">
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-pink-500" />

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

              {error && (
                <div className="mb-5 rounded-2xl border border-pink-200 bg-pink-50/80 px-4 py-3 text-sm text-pink-600">
                  {error}
                </div>
              )}

              <form
                onSubmit={handleLogin}
                className="space-y-5"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-gray-700"
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
                    className="h-12 w-full rounded-2xl border border-white/90 bg-white/60 px-4 text-gray-900 outline-none backdrop-blur-xl transition-all placeholder:text-gray-400 focus:border-pink-300 focus:bg-white/75 focus:ring-2 focus:ring-pink-300/60 disabled:opacity-60"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Password
                    </label>

                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      disabled={loading}
                      className="text-sm font-semibold text-pink-500 transition hover:text-pink-600 disabled:opacity-50"
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
                        setPassword(e.target.value)
                      }
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      disabled={loading}
                      className="h-12 w-full rounded-2xl border border-white/90 bg-white/60 px-4 pr-12 text-gray-900 outline-none backdrop-blur-xl transition-all placeholder:text-gray-400 focus:border-pink-300 focus:bg-white/75 focus:ring-2 focus:ring-pink-300/60 disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (current) => !current
                        )
                      }
                      disabled={loading}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 transition hover:text-pink-500 disabled:opacity-50"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setRememberMe(
                        (current) => !current
                      )
                    }
                    disabled={loading}
                    aria-pressed={rememberMe}
                    aria-label="Remember me"
                    className={`flex h-5 w-5 items-center justify-center rounded-md border transition ${
                      rememberMe
                        ? "border-pink-500 bg-pink-500"
                        : "border-gray-300 bg-white/60"
                    }`}
                  >
                    {rememberMe && (
                      <span className="text-xs font-bold text-white">
                        ✓
                      </span>
                    )}
                  </button>

                  <span className="text-sm text-gray-600">
                    Remember me
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-full rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 font-semibold text-white shadow-lg shadow-pink-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-pink-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Signing in..."
                    : "Sign in"}
                </button>
              </form>

              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-pink-200/60" />

                <span className="text-xs font-medium text-gray-400">
                  OR
                </span>

                <div className="h-px flex-1 bg-pink-200/60" />
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={handleGoogleLogin}
                className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-white/90 bg-white/60 font-semibold text-gray-700 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:bg-white/80 disabled:opacity-60"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-base font-bold shadow-sm">
                  G
                </span>

                Continue with Google
              </button>

              <p className="mt-7 text-center text-sm text-gray-500">
                Don&apos;t have an account?{" "}

                <Link
                  href="/signup"
                  className="font-semibold text-pink-500 transition hover:text-pink-600"
                >
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}