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
    color: "#f94144",
  },
  {
    number: "02",
    title: "Stay focused",
    description:
      "Know exactly what needs your attention with clear priorities, statuses, and due dates.",
    color: "#f3722c",
  },
  {
    number: "03",
    title: "Track progress",
    description:
      "See how much you've accomplished and understand where your time and attention go.",
    color: "#d946ef",
  },
];

export default function Home() {
  const [activeTask, setActiveTask] = useState<number | null>(null);

  return (
    <main className="min-h-screen overflow-hidden bg-[#fff0f5] text-[#321923] selection:bg-[#f94144]/20">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">

        {/* Main baby-pink glow */}
        <div className="absolute left-1/2 top-[-300px] h-[750px] w-[750px] -translate-x-1/2 rounded-full bg-[#f9a8d4]/35 blur-[160px]" />

        {/* Coral glow */}
        <div className="absolute right-[-250px] top-[300px] h-[650px] w-[650px] rounded-full bg-[#f94144]/10 blur-[160px]" />

        {/* Peach glow */}
        <div className="absolute left-[-250px] top-[850px] h-[650px] w-[650px] rounded-full bg-[#f3722c]/10 blur-[160px]" />

        {/* Purple-pink glow */}
        <div className="absolute right-[10%] top-[1450px] h-[500px] w-[500px] rounded-full bg-[#d946ef]/10 blur-[150px]" />

        {/* White light */}
        <div className="absolute left-[20%] top-[500px] h-[450px] w-[450px] rounded-full bg-white/60 blur-[140px]" />

        {/* Soft radial light */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.95),transparent_42%)]" />

        {/* Very subtle texture */}
        <div className="absolute inset-0 opacity-[0.025] [background-image:radial-gradient(rgba(90,40,60,0.5)_0.5px,transparent_0.5px)] [background-size:5px_5px]" />

      </div>

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="relative z-50 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">

        {/* Logo */}

        <Link
          href="/"
          className="group flex items-center gap-3"
        >

          <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/80 bg-white/50 text-sm font-black text-white shadow-[inset_0_1px_2px_rgba(255,255,255,0.95),0_10px_30px_rgba(249,65,68,0.18)] backdrop-blur-xl transition duration-300 group-hover:scale-105">

            <div className="absolute inset-0 bg-gradient-to-br from-[#f94144] via-[#f3722c] to-[#d946ef]" />

            <span className="relative">
              T
            </span>

          </div>

          <span className="text-xl font-bold tracking-tight text-[#321923]">
            TaskFlow
          </span>

        </Link>

        {/* Navigation */}

        <div className="hidden items-center gap-9 text-sm font-medium text-[#765866] md:flex">

          <a
            href="#features"
            className="transition hover:text-[#f94144]"
          >
            Features
          </a>

          <a
            href="#preview"
            className="transition hover:text-[#f94144]"
          >
            Preview
          </a>

          <a
            href="#about"
            className="transition hover:text-[#f94144]"
          >
            About
          </a>

        </div>

        {/* Authentication */}

        <div className="flex items-center gap-3">

          <Link
            href="/login"
            className="hidden rounded-full border border-transparent px-4 py-2 text-sm font-semibold text-[#765866] transition duration-300 hover:border-white/80 hover:bg-white/45 hover:text-[#321923] sm:block"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="group relative overflow-hidden rounded-full border border-white/70 bg-gradient-to-r from-[#f94144] to-[#f3722c] px-5 py-2.5 text-sm font-bold text-white shadow-[0_10px_30px_rgba(249,65,68,0.25),inset_0_1px_2px_rgba(255,255,255,0.4)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(249,65,68,0.35)]"
          >

            <span className="absolute inset-0 -translate-x-full bg-white/25 transition-transform duration-500 group-hover:translate-x-full" />

            <span className="relative">
              Get started
            </span>

          </Link>

        </div>

      </nav>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-8 lg:pb-28 lg:pt-24">

        <div className="mx-auto max-w-4xl text-center">

          {/* Badge */}

          <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/55 px-4 py-2 text-sm font-medium text-[#c63b50] shadow-[inset_0_1px_2px_rgba(255,255,255,0.95),0_8px_30px_rgba(249,65,68,0.08)] backdrop-blur-xl">

            <span className="relative flex h-2 w-2">

              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#f94144] opacity-50" />

              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#f94144]" />

            </span>

            Simple productivity for busy people

          </div>

          {/* Heading */}

          <h1 className="mt-7 text-5xl font-black tracking-[-0.05em] text-[#321923] sm:text-6xl lg:text-8xl">

            Get more done.

            <br />

            <span className="bg-gradient-to-r from-[#f94144] via-[#f3722c] to-[#d946ef] bg-clip-text text-transparent">
              Stress less.
            </span>

          </h1>

          {/* Description */}

          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-[#765866] sm:text-lg">

            TaskFlow gives you a clear, simple workspace to organize your
            tasks, focus on what matters, and make steady progress every day.

          </p>

          {/* CTA */}

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">

            <Link
              href="/signup"
              className="group relative w-full overflow-hidden rounded-full border border-white/70 bg-gradient-to-r from-[#f94144] to-[#f3722c] px-7 py-3.5 text-center text-sm font-bold text-white shadow-[0_12px_35px_rgba(249,65,68,0.25),inset_0_1px_2px_rgba(255,255,255,0.4)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(249,65,68,0.35)] sm:w-auto"
            >

              <span className="absolute inset-0 -translate-x-full bg-white/25 transition-transform duration-500 group-hover:translate-x-full" />

              <span className="relative">
                Start for free
              </span>

            </Link>

            <a
              href="#preview"
              className="w-full rounded-full border border-white/85 bg-white/50 px-7 py-3.5 text-center text-sm font-semibold text-[#4b2935] shadow-[inset_0_1px_2px_rgba(255,255,255,0.95),0_8px_25px_rgba(130,70,90,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/70 hover:shadow-[0_12px_30px_rgba(130,70,90,0.12)] sm:w-auto"
            >
              See how it works
            </a>

          </div>

        </div>

      </section>

      {/* =====================================================
          DASHBOARD PREVIEW
      ===================================================== */}

      <section
        id="preview"
        className="relative mx-auto max-w-7xl px-6 pb-28 lg:px-8"
      >

        {/* Ambient glow */}

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[75%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f94144]/10 blur-[130px]" />

        {/* Main glass window */}

        <div className="group relative overflow-hidden rounded-[2rem] border border-white/85 bg-white/50 shadow-[0_35px_100px_rgba(120,60,80,0.16),inset_0_1px_2px_rgba(255,255,255,0.95)] backdrop-blur-2xl">

          {/* Glass highlight */}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/75 via-white/25 to-[#f94144]/5" />

          {/* Pink glow */}

          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#f94144]/12 blur-[90px]" />

          {/* Purple glow */}

          <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#d946ef]/10 blur-[90px]" />

          {/* Window Header */}

          <div className="relative flex h-14 items-center justify-between border-b border-white/75 bg-white/40 px-5">

            <div className="flex gap-2">

              <span className="h-3 w-3 rounded-full bg-[#f94144] shadow-[0_0_10px_rgba(249,65,68,0.25)]" />

              <span className="h-3 w-3 rounded-full bg-[#f3722c] shadow-[0_0_10px_rgba(243,114,44,0.25)]" />

              <span className="h-3 w-3 rounded-full bg-[#d946ef] shadow-[0_0_10px_rgba(217,70,239,0.25)]" />

            </div>

            <div className="hidden rounded-lg border border-white/75 bg-white/45 px-5 py-1.5 text-xs text-[#8b6874] shadow-[inset_0_1px_2px_rgba(255,255,255,0.9)] backdrop-blur-xl sm:block">
              app.taskflow.local
            </div>

            <div className="relative h-7 w-7 overflow-hidden rounded-full border border-white/80 bg-gradient-to-br from-[#f94144] via-[#f3722c] to-[#d946ef] shadow-[0_0_20px_rgba(249,65,68,0.2)]" />

          </div>

          {/* Dashboard */}

          <div className="relative grid min-h-[520px] md:grid-cols-[220px_1fr]">

            {/* Sidebar */}

            <aside className="hidden border-r border-white/70 bg-white/25 p-5 backdrop-blur-xl md:block">

              <div className="mb-8">

                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9c7783]">
                  Workspace
                </p>

                <div className="flex items-center gap-3 rounded-xl border border-[#f94144]/15 bg-[#f94144]/10 px-3 py-2.5 text-sm font-semibold text-[#d83c50] shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]">
                  <span>⌂</span>
                  Overview
                </div>

                <div className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#896b77] transition hover:bg-white/50">
                  <span>✓</span>
                  My Tasks
                </div>

                <div className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#896b77] transition hover:bg-white/50">
                  <span>▦</span>
                  Calendar
                </div>

              </div>

              <div>

                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9c7783]">
                  Projects
                </p>

                <div className="space-y-1">

                  <div className="flex items-center gap-3 px-3 py-2 text-sm text-[#896b77]">
                    <span className="h-2 w-2 rounded-full bg-[#f94144]" />
                    Website
                  </div>

                  <div className="flex items-center gap-3 px-3 py-2 text-sm text-[#896b77]">
                    <span className="h-2 w-2 rounded-full bg-[#f3722c]" />
                    Marketing
                  </div>

                  <div className="flex items-center gap-3 px-3 py-2 text-sm text-[#896b77]">
                    <span className="h-2 w-2 rounded-full bg-[#d946ef]" />
                    Personal
                  </div>

                </div>

              </div>

            </aside>

            {/* Main Dashboard */}

            <div className="p-5 sm:p-7 lg:p-9">

              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                <div>

                  <p className="text-sm text-[#9a7783]">
                    Monday, September 7
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-[#321923]">
                    Good morning, Rosh
                  </h2>

                </div>

                <button
                  type="button"
                  className="group relative w-fit overflow-hidden rounded-xl border border-white/75 bg-gradient-to-r from-[#f94144] to-[#f3722c] px-4 py-2.5 text-xs font-bold text-white shadow-[0_8px_25px_rgba(249,65,68,0.2)] transition duration-300 hover:-translate-y-0.5"
                >

                  <span className="absolute inset-0 -translate-x-full bg-white/25 transition-transform duration-500 group-hover:translate-x-full" />

                  <span className="relative">
                    + New task
                  </span>

                </button>

              </div>

              {/* Stats */}

              <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">

                {[
                  ["12", "Total tasks", "#f94144"],
                  ["5", "Completed", "#f3722c"],
                  ["4", "In progress", "#fb7185"],
                  ["3", "Upcoming", "#d946ef"],
                ].map(([value, label, color]) => (

                  <div
                    key={label}
                    className="group relative overflow-hidden rounded-2xl border border-white/75 bg-white/45 p-4 shadow-[inset_0_1px_2px_rgba(255,255,255,0.85),0_8px_20px_rgba(120,60,80,0.06)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:bg-white/65"
                  >

                    <div
                      className="absolute -right-8 -top-8 h-20 w-20 rounded-full opacity-10 blur-2xl transition duration-300 group-hover:opacity-20"
                      style={{
                        backgroundColor: color,
                      }}
                    />

                    <div
                      className="relative text-2xl font-bold"
                      style={{
                        color,
                      }}
                    >
                      {value}
                    </div>

                    <div className="relative mt-1 text-xs text-[#987581]">
                      {label}
                    </div>

                  </div>

                ))}

              </div>

              {/* Tasks */}

              <div className="mt-7">

                <div className="mb-3 flex items-center justify-between">

                  <h3 className="text-sm font-semibold text-[#321923]">
                    Today&apos;s tasks
                  </h3>

                  <button
                    type="button"
                    className="text-xs font-semibold text-[#f94144] transition hover:text-[#d83c50]"
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
                          ? "border-[#f94144]/30 bg-[#f94144]/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.85),0_12px_30px_rgba(249,65,68,0.08)]"
                          : "border-white/75 bg-white/40 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)] hover:-translate-y-0.5 hover:bg-white/65"
                      }`}
                    >

                      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                      <div className="relative flex items-start gap-3">

                        <div
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                            task.status === "Completed"
                              ? "border-[#f94144]/40 bg-[#f94144]/15"
                              : "border-[#d7b7c2] bg-white/50"
                          }`}
                        >

                          {task.status === "Completed" && (
                            <span className="text-[10px] font-bold text-[#f94144]">
                              ✓
                            </span>
                          )}

                        </div>

                        <div>

                          <div className="text-sm font-semibold text-[#432631]">
                            {task.title}
                          </div>

                          <div className="mt-1 text-xs text-[#987581]">
                            {task.category} · {task.date}
                          </div>

                        </div>

                      </div>

                      <div className="relative flex items-center gap-2 pl-8 sm:pl-0">

                        <span
                          className="rounded-full border border-white/75 px-2.5 py-1 text-[10px] font-semibold backdrop-blur-md"
                          style={{
                            background:
                              task.status === "Completed"
                                ? "rgba(249,65,68,0.10)"
                                : task.status === "In Progress"
                                  ? "rgba(243,114,44,0.10)"
                                  : "rgba(217,70,239,0.10)",
                            color:
                              task.status === "Completed"
                                ? "#d83c50"
                                : task.status === "In Progress"
                                  ? "#d85c26"
                                  : "#b832c5",
                          }}
                        >
                          {task.status}
                        </span>

                        <span
                          className="rounded-full border border-white/75 px-2.5 py-1 text-[10px] font-semibold backdrop-blur-md"
                          style={{
                            background:
                              task.priority === "High"
                                ? "rgba(249,65,68,0.10)"
                                : "rgba(243,114,44,0.10)",
                            color:
                              task.priority === "High"
                                ? "#d83c50"
                                : "#d85c26",
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

      {/* =====================================================
          FEATURES
      ===================================================== */}

      <section
        id="features"
        className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8"
      >

        <div className="max-w-2xl">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f94144]">
            Everything you need
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#321923] sm:text-5xl">

            Productivity without{" "}

            <span className="text-[#9d7b87]">
              the complexity.
            </span>

          </h2>

        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">

          {features.map((feature) => (

            <div
              key={feature.number}
              className="group relative overflow-hidden rounded-3xl border border-white/80 bg-white/50 p-7 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_15px_40px_rgba(120,60,80,0.08)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:bg-white/70 hover:shadow-[0_25px_60px_rgba(120,60,80,0.12)]"
            >

              <div
                className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full opacity-10 blur-3xl transition duration-500 group-hover:scale-125 group-hover:opacity-20"
                style={{
                  backgroundColor: feature.color,
                }}
              />

              <div
                className="relative text-sm font-bold"
                style={{
                  color: feature.color,
                }}
              >
                {feature.number}
              </div>

              <h3 className="mt-12 text-xl font-bold text-[#321923]">
                {feature.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#80626e]">
                {feature.description}
              </p>

              <div
                className="mt-7 h-1 w-12 rounded-full transition-all duration-500 group-hover:w-20"
                style={{
                  backgroundColor: feature.color,
                }}
              />

            </div>

          ))}

        </div>

      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section
        id="about"
        className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8"
      >

        <div className="relative overflow-hidden rounded-[2rem] border border-white/85 bg-white/50 px-7 py-16 text-center shadow-[inset_0_1px_2px_rgba(255,255,255,0.95),0_30px_80px_rgba(120,60,80,0.12)] backdrop-blur-2xl sm:px-12">

          {/* Center glow */}

          <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f94144]/10 blur-[100px]" />

          {/* Left glow */}

          <div className="pointer-events-none absolute -left-20 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-[#f3722c]/10 blur-[70px]" />

          {/* Right glow */}

          <div className="pointer-events-none absolute -right-20 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-[#d946ef]/10 blur-[70px]" />

          <div className="relative">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f94144]">
              Your next productive day
            </p>

            <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-black tracking-tight text-[#321923] sm:text-6xl">
              Turn your plans into progress.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-[#80626e] sm:text-base">
              Build a simple system that helps you focus on your priorities
              instead of constantly trying to remember what comes next.
            </p>

            <Link
              href="/signup"
              className="group relative mt-8 inline-flex overflow-hidden rounded-full border border-white/75 bg-gradient-to-r from-[#f94144] to-[#f3722c] px-7 py-3.5 text-sm font-bold text-white shadow-[0_12px_35px_rgba(249,65,68,0.22),inset_0_1px_2px_rgba(255,255,255,0.4)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(249,65,68,0.32)]"
            >

              <span className="absolute inset-0 -translate-x-full bg-white/25 transition-transform duration-500 group-hover:translate-x-full" />

              <span className="relative">
                Create your workspace
              </span>

            </Link>

          </div>

        </div>

      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-[#d8b8c4]/50 px-6 py-8 text-xs text-[#987581] sm:flex-row sm:items-center sm:justify-between lg:px-8">

        <div className="font-semibold text-[#5b3744]">
          TaskFlow
        </div>

        <p>
          © 2026 TaskFlow. Built for better days.
        </p>

        <div className="flex gap-5">

          <button
            type="button"
            className="transition hover:text-[#f94144]"
          >
            Privacy
          </button>

          <button
            type="button"
            className="transition hover:text-[#f94144]"
          >
            Terms
          </button>

        </div>

      </footer>

    </main>
  );
}