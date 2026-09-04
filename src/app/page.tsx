"use client";

import Link from "next/link";
import { useState } from "react";

const tasks = [
  {
    title: "Complete project proposal",
    category: "Work",
    status: "In Progress",
    priority: "High",
    date: "Today",
  },
  {
    title: "Review UI designs",
    category: "Design",
    status: "Completed",
    priority: "Medium",
    date: "Today",
  },
  {
    title: "Prepare presentation",
    category: "Work",
    status: "Upcoming",
    priority: "Medium",
    date: "Tomorrow",
  },
];

const features = [
  {
    number: "01",
    title: "Organize everything",
    description:
      "Keep your tasks, projects, deadlines, and priorities organized in one focused workspace.",
    color: "#43AA8B",
  },
  {
    number: "02",
    title: "Stay focused",
    description:
      "Know exactly what needs your attention with clear priorities, statuses, and due dates.",
    color: "#277DA1",
  },
  {
    number: "03",
    title: "Track progress",
    description:
      "See how much you've accomplished and understand where your time and attention go.",
    color: "#F8961E",
  },
];

export default function Home() {
  const [activeTask, setActiveTask] = useState<number | null>(null);

  return (
    <main className="min-h-screen overflow-hidden bg-[#08090D] text-white selection:bg-[#43AA8B]/30">
      {/* Background Glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-300px] h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-[#43AA8B]/10 blur-[150px]" />

        <div className="absolute right-[-220px] top-[400px] h-[600px] w-[600px] rounded-full bg-[#277DA1]/10 blur-[150px]" />

        <div className="absolute left-[-250px] top-[900px] h-[550px] w-[550px] rounded-full bg-[#F3722C]/8 blur-[150px]" />

        <div className="absolute right-[20%] top-[1500px] h-[400px] w-[400px] rounded-full bg-[#90BE6D]/6 blur-[140px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(67,170,139,0.06),transparent_35%)]" />

        <div className="absolute inset-0 opacity-[0.025] [background-image:radial-gradient(rgba(255,255,255,0.8)_0.5px,transparent_0.5px)] [background-size:5px_5px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-white/[0.08] text-sm font-black text-[#08090D] shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_8px_30px_rgba(67,170,139,0.15)] backdrop-blur-xl transition duration-300 group-hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-[#90BE6D] via-[#43AA8B] to-[#277DA1]" />
            <span className="relative">T</span>
          </div>

          <span className="text-xl font-bold tracking-tight">TaskFlow</span>
        </Link>

        <div className="hidden items-center gap-8 text-sm text-white/55 md:flex">
          <a
            href="#features"
            className="transition hover:text-white"
          >
            Features
          </a>

          <a
            href="#preview"
            className="transition hover:text-white"
          >
            Preview
          </a>

          <a
            href="#about"
            className="transition hover:text-white"
          >
            About
          </a>
        </div>

        {/* Authentication */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-full border border-transparent px-4 py-2 text-sm font-medium text-white/65 transition duration-300 hover:border-white/10 hover:bg-white/[0.04] hover:text-white sm:block"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="group relative overflow-hidden rounded-full border border-white/15 bg-[#43AA8B] px-5 py-2.5 text-sm font-semibold text-[#08090D] shadow-[0_8px_30px_rgba(67,170,139,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#90BE6D] hover:shadow-[0_12px_35px_rgba(67,170,139,0.28)]"
          >
            <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
            <span className="relative">Get started</span>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-[#90BE6D] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#43AA8B] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#43AA8B]" />
            </span>

            Simple productivity for busy people
          </div>

          <h1 className="mt-6 text-5xl font-black tracking-[-0.05em] sm:text-6xl lg:text-8xl">
            Get more done.
            <br />

            <span className="bg-gradient-to-r from-[#90BE6D] via-[#43AA8B] to-[#277DA1] bg-clip-text text-transparent">
              Stress less.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-white/50 sm:text-lg">
            TaskFlow gives you a clear, simple workspace to organize your
            tasks, focus on what matters, and make steady progress every day.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="group relative w-full overflow-hidden rounded-full border border-white/15 bg-[#43AA8B] px-7 py-3.5 text-center text-sm font-bold text-[#08090D] shadow-[0_10px_35px_rgba(67,170,139,0.2)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#90BE6D] hover:shadow-[0_15px_45px_rgba(67,170,139,0.3)] sm:w-auto"
            >
              <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
              <span className="relative">Start for free</span>
            </Link>

            <a
              href="#preview"
              className="w-full rounded-full border border-white/10 bg-white/[0.035] px-7 py-3.5 text-center text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.07] sm:w-auto"
            >
              See how it works
            </a>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section
        id="preview"
        className="relative mx-auto max-w-7xl px-6 pb-28 lg:px-8"
      >
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#43AA8B]/5 blur-[120px]" />

        <div className="group relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.045] shadow-[0_40px_100px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.09] via-transparent to-[#43AA8B]/[0.04]" />

          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#43AA8B]/10 blur-[80px]" />

          <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#277DA1]/10 blur-[80px]" />

          {/* Window Header */}
          <div className="relative flex h-14 items-center justify-between border-b border-white/10 bg-white/[0.025] px-5">
            <div className="flex gap-2">
              <span className="h-3 w-3 rounded-full bg-[#F94144] shadow-[0_0_10px_rgba(249,65,68,0.35)]" />
              <span className="h-3 w-3 rounded-full bg-[#F9C74F] shadow-[0_0_10px_rgba(249,199,79,0.35)]" />
              <span className="h-3 w-3 rounded-full bg-[#90BE6D] shadow-[0_0_10px_rgba(144,190,109,0.35)]" />
            </div>

            <div className="hidden rounded-lg border border-white/10 bg-black/10 px-5 py-1.5 text-xs text-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl sm:block">
              app.taskflow.local
            </div>

            <div className="relative h-7 w-7 overflow-hidden rounded-full border border-white/20 bg-gradient-to-br from-[#90BE6D] via-[#43AA8B] to-[#277DA1] shadow-[0_0_20px_rgba(67,170,139,0.2)]" />
          </div>

          <div className="relative grid min-h-[520px] md:grid-cols-[220px_1fr]">
            {/* Sidebar */}
            <aside className="hidden border-r border-white/10 bg-black/10 p-5 backdrop-blur-xl md:block">
              <div className="mb-8">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                  Workspace
                </p>

                <div className="flex items-center gap-3 rounded-xl border border-[#43AA8B]/10 bg-[#43AA8B]/10 px-3 py-2.5 text-sm font-medium text-[#90BE6D] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                  <span>⌂</span>
                  Overview
                </div>

                <div className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/45 transition hover:bg-white/[0.03]">
                  <span>✓</span>
                  My Tasks
                </div>

                <div className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/45 transition hover:bg-white/[0.03]">
                  <span>▦</span>
                  Calendar
                </div>
              </div>

              <div>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                  Projects
                </p>

                <div className="space-y-1">
                  <div className="flex items-center gap-3 px-3 py-2 text-sm text-white/45">
                    <span className="h-2 w-2 rounded-full bg-[#43AA8B] shadow-[0_0_8px_rgba(67,170,139,0.5)]" />
                    Website
                  </div>

                  <div className="flex items-center gap-3 px-3 py-2 text-sm text-white/45">
                    <span className="h-2 w-2 rounded-full bg-[#277DA1] shadow-[0_0_8px_rgba(39,125,161,0.5)]" />
                    Marketing
                  </div>

                  <div className="flex items-center gap-3 px-3 py-2 text-sm text-white/45">
                    <span className="h-2 w-2 rounded-full bg-[#F8961E] shadow-[0_0_8px_rgba(248,150,30,0.5)]" />
                    Personal
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Dashboard */}
            <div className="p-5 sm:p-7 lg:p-9">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                  <p className="text-sm text-white/40">
                    Monday, September 7
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    Good morning, Rosh
                  </h2>
                </div>

                <button
                  type="button"
                  className="group relative w-fit overflow-hidden rounded-xl border border-white/10 bg-[#43AA8B] px-4 py-2.5 text-xs font-bold text-[#08090D] shadow-[0_8px_25px_rgba(67,170,139,0.15)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#90BE6D]"
                >
                  <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
                  <span className="relative">+ New task</span>
                </button>
              </div>

              {/* Stats */}
              <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {[
                  ["12", "Total tasks", "#43AA8B"],
                  ["5", "Completed", "#90BE6D"],
                  ["4", "In progress", "#F9C74F"],
                  ["3", "Upcoming", "#277DA1"],
                ].map(([value, label, color]) => (
                  <div
                    key={label}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:bg-white/[0.055]"
                  >
                    <div
                      className="absolute -right-8 -top-8 h-20 w-20 rounded-full opacity-10 blur-2xl transition duration-300 group-hover:opacity-20"
                      style={{ backgroundColor: color }}
                    />

                    <div
                      className="relative text-2xl font-bold"
                      style={{ color }}
                    >
                      {value}
                    </div>

                    <div className="relative mt-1 text-xs text-white/35">
                      {label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tasks */}
              <div className="mt-7">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">
                    Today&apos;s tasks
                  </h3>

                  <button
                    type="button"
                    className="text-xs text-[#43AA8B] transition hover:text-[#90BE6D]"
                  >
                    View all
                  </button>
                </div>

                <div className="space-y-2">
                  {tasks.map((task, index) => (
                    <button
                      type="button"
                      key={task.title}
                      onClick={() =>
                        setActiveTask(
                          activeTask === index ? null : index
                        )
                      }
                      className={`group relative flex w-full flex-col gap-3 overflow-hidden rounded-2xl border p-4 text-left backdrop-blur-xl transition-all duration-300 sm:flex-row sm:items-center sm:justify-between ${
                        activeTask === index
                          ? "border-[#43AA8B]/40 bg-[#43AA8B]/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_12px_35px_rgba(67,170,139,0.08)]"
                          : "border-white/10 bg-white/[0.025] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.055]"
                      }`}
                    >
                      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                      <div className="relative flex items-start gap-3">
                        <div
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                            task.status === "Completed"
                              ? "border-[#90BE6D] bg-[#90BE6D]/15 shadow-[0_0_12px_rgba(144,190,109,0.15)]"
                              : "border-white/15 bg-white/[0.02]"
                          }`}
                        >
                          {task.status === "Completed" && (
                            <span className="text-[10px] text-[#90BE6D]">
                              ✓
                            </span>
                          )}
                        </div>

                        <div>
                          <div className="text-sm font-medium">
                            {task.title}
                          </div>

                          <div className="mt-1 text-xs text-white/30">
                            {task.category} · {task.date}
                          </div>
                        </div>
                      </div>

                      <div className="relative flex items-center gap-2 pl-8 sm:pl-0">
                        <span
                          className="rounded-full border border-white/5 px-2.5 py-1 text-[10px] font-semibold backdrop-blur-md"
                          style={{
                            background:
                              task.status === "Completed"
                                ? "rgba(144,190,109,0.12)"
                                : task.status === "In Progress"
                                  ? "rgba(249,199,79,0.12)"
                                  : "rgba(87,117,144,0.12)",
                            color:
                              task.status === "Completed"
                                ? "#90BE6D"
                                : task.status === "In Progress"
                                  ? "#F9C74F"
                                  : "#577590",
                          }}
                        >
                          {task.status}
                        </span>

                        <span
                          className="rounded-full border border-white/5 px-2.5 py-1 text-[10px] font-semibold backdrop-blur-md"
                          style={{
                            background:
                              task.priority === "High"
                                ? "rgba(249,65,68,0.12)"
                                : "rgba(249,199,79,0.12)",
                            color:
                              task.priority === "High"
                                ? "#F94144"
                                : "#F9C74F",
                          }}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8"
      >
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#43AA8B]">
            Everything you need
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Productivity without
            <span className="text-white/30"> the complexity.</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.number}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-white/20 hover:bg-white/[0.055] hover:shadow-[0_25px_60px_rgba(0,0,0,0.25)]"
            >
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full opacity-10 blur-3xl transition duration-500 group-hover:scale-125 group-hover:opacity-20"
                style={{ backgroundColor: feature.color }}
              />

              <div
                className="relative text-sm font-bold"
                style={{ color: feature.color }}
              >
                {feature.number}
              </div>

              <h3 className="mt-12 text-xl font-bold">
                {feature.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/40">
                {feature.description}
              </p>

              <div
                className="mt-7 h-px w-12 transition-all duration-500 group-hover:w-20"
                style={{ backgroundColor: feature.color }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* About / CTA */}
      <section
        id="about"
        className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8"
      >
        <div className="relative overflow-hidden rounded-[2rem] border border-[#43AA8B]/15 bg-white/[0.035] px-7 py-16 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_30px_80px_rgba(0,0,0,0.3)] backdrop-blur-2xl sm:px-12">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#43AA8B]/10 blur-[100px]" />

          <div className="pointer-events-none absolute -left-20 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-[#277DA1]/10 blur-[70px]" />

          <div className="pointer-events-none absolute -right-20 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-[#F8961E]/8 blur-[70px]" />

          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#90BE6D]">
              Your next productive day
            </p>

            <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">
              Turn your plans into progress.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-white/45 sm:text-base">
              Build a simple system that helps you focus on your priorities
              instead of constantly trying to remember what comes next.
            </p>

            <Link
              href="/signup"
              className="group relative mt-8 inline-flex overflow-hidden rounded-full border border-white/15 bg-[#43AA8B] px-7 py-3.5 text-sm font-bold text-[#08090D] shadow-[0_10px_35px_rgba(67,170,139,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#90BE6D] hover:shadow-[0_15px_45px_rgba(67,170,139,0.3)]"
            >
              <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
              <span className="relative">
                Create your workspace
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-white/10 px-6 py-8 text-xs text-white/30 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div className="font-semibold text-white/60">
          TaskFlow
        </div>

        <p>© 2026 TaskFlow. Built for better days.</p>

        <div className="flex gap-5">
          <button
            type="button"
            className="transition hover:text-white"
          >
            Privacy
          </button>

          <button
            type="button"
            className="transition hover:text-white"
          >
            Terms
          </button>
        </div>
      </footer>
    </main>
  );
}