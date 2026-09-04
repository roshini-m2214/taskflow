"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Circle,
  Clock3,
  FolderKanban,
  Loader2,
  Star,
  Target,
  TrendingUp,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Task = {
  id: string;
  user_id: string;
  title: string;
  status: "todo" | "in_progress" | "completed";
  priority: "low" | "normal" | "high";
  is_important: boolean;
  project_id: string | null;
  created_at: string;
  updated_at: string;
};

type Project = {
  id: string;
  name: string;
  color: string;
};

const projectColors: Record<string, string> = {
  pink: "bg-pink-500",
  rose: "bg-rose-500",
  fuchsia: "bg-fuchsia-500",
  purple: "bg-purple-500",
};

export default function ProgressPage() {
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  async function loadProgress() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const [tasksResult, projectsResult] = await Promise.all([
      supabase
        .from("tasks")
        .select(
          "id, user_id, title, status, priority, is_important, project_id, created_at, updated_at"
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),

      supabase
        .from("projects")
        .select("id, name, color")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true }),
    ]);

    if (tasksResult.error) {
      console.error("Tasks error:", tasksResult.error);
    }

    if (projectsResult.error) {
      console.error("Projects error:", projectsResult.error);
    }

    setTasks(tasksResult.data ?? []);
    setProjects(projectsResult.data ?? []);
    setLoading(false);
  }

  const stats = useMemo(() => {
    const total = tasks.length;

    const completed = tasks.filter(
      (task) => task.status === "completed"
    ).length;

    const inProgress = tasks.filter(
      (task) => task.status === "in_progress"
    ).length;

    const todo = tasks.filter(
      (task) => task.status === "todo"
    ).length;

    const important = tasks.filter(
      (task) => task.is_important
    ).length;

    const highPriority = tasks.filter(
      (task) => task.priority === "high"
    ).length;

    const completionRate =
      total === 0 ? 0 : Math.round((completed / total) * 100);

    return {
      total,
      completed,
      inProgress,
      todo,
      important,
      highPriority,
      completionRate,
    };
  }, [tasks]);

  const projectStats = useMemo(() => {
    return projects.map((project) => {
      const projectTasks = tasks.filter(
        (task) => task.project_id === project.id
      );

      const completed = projectTasks.filter(
        (task) => task.status === "completed"
      ).length;

      const total = projectTasks.length;

      const percentage =
        total === 0 ? 0 : Math.round((completed / total) * 100);

      return {
        ...project,
        total,
        completed,
        percentage,
      };
    });
  }, [projects, tasks]);

  const recentCompletedTasks = useMemo(() => {
    return tasks
      .filter((task) => task.status === "completed")
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() -
          new Date(a.updated_at).getTime()
      )
      .slice(0, 5);
  }, [tasks]);

  function getProjectName(projectId: string | null) {
    if (!projectId) return "No project";

    return (
      projects.find((project) => project.id === projectId)?.name ??
      "No project"
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-pink-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="font-medium">Loading progress...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-slate-900 relative overflow-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-pink-200/40 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-rose-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-fuchsia-200/30 blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-white/70 text-slate-700 shadow-[0_8px_25px_rgba(236,72,153,0.12)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-500 text-white shadow-[0_8px_20px_rgba(236,72,153,0.28)]">
                  <BarChart3 className="h-5 w-5" />
                </div>

                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    Progress
                  </h1>
                  <p className="text-sm text-slate-500">
                    Track your productivity and task completion
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-2xl border border-pink-100 bg-white/70 px-5 py-2.5 text-sm font-semibold text-pink-600 shadow-[0_8px_25px_rgba(236,72,153,0.10)] backdrop-blur-xl transition hover:bg-white"
          >
            Back to Dashboard
          </button>
        </header>

        {/* Empty state */}
        {stats.total === 0 ? (
          <section className="rounded-[2rem] border border-white/80 bg-white/65 p-10 text-center shadow-[0_20px_60px_rgba(236,72,153,0.12)] backdrop-blur-2xl">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[1.7rem] bg-pink-100 text-pink-500 shadow-[inset_0_2px_8px_rgba(255,255,255,0.9),0_12px_30px_rgba(236,72,153,0.15)]">
              <Target className="h-9 w-9" />
            </div>

            <h2 className="text-2xl font-bold">
              Your progress starts here
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Create your first task and start tracking your productivity.
              Your analytics will appear here automatically.
            </p>

            <button
              onClick={() => router.push("/dashboard")}
              className="mt-6 rounded-2xl bg-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(236,72,153,0.28)] transition hover:-translate-y-0.5 hover:bg-pink-600"
            >
              Create a Task
            </button>
          </section>
        ) : (
          <>
            {/* Main progress card */}
            <section className="mb-6 overflow-hidden rounded-[2rem] border border-white/80 bg-white/65 p-6 shadow-[0_20px_60px_rgba(236,72,153,0.12)] backdrop-blur-2xl sm:p-8">
              <div className="grid gap-8 lg:grid-cols-[1fr_280px] lg:items-center">
                <div>
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-pink-600">
                    <TrendingUp className="h-4 w-4" />
                    Overall Progress
                  </div>

                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    {stats.completionRate}% complete
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    You have completed {stats.completed} of{" "}
                    {stats.total} tasks.
                  </p>

                  <div className="mt-6 h-4 overflow-hidden rounded-full bg-pink-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 transition-all duration-700"
                      style={{
                        width: `${stats.completionRate}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="mx-auto flex h-52 w-52 items-center justify-center rounded-full bg-gradient-to-br from-pink-100 via-white to-rose-100 shadow-[inset_0_3px_15px_rgba(255,255,255,0.9),0_15px_40px_rgba(236,72,153,0.14)]">
                  <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full bg-white/90 shadow-[inset_0_2px_10px_rgba(236,72,153,0.08)]">
                    <span className="text-4xl font-bold text-pink-600">
                      {stats.completionRate}%
                    </span>
                    <span className="mt-1 text-xs font-medium text-slate-400">
                      completed
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Stat cards */}
            <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard
                icon={<Circle className="h-5 w-5" />}
                label="To-do"
                value={stats.todo}
                description="Tasks remaining"
              />

              <StatCard
                icon={<Clock3 className="h-5 w-5" />}
                label="In Progress"
                value={stats.inProgress}
                description="Currently working"
              />

              <StatCard
                icon={<CheckCircle2 className="h-5 w-5" />}
                label="Completed"
                value={stats.completed}
                description="Finished tasks"
              />

              <StatCard
                icon={<Star className="h-5 w-5" />}
                label="Important"
                value={stats.important}
                description="Priority tasks"
              />
            </section>

            {/* Project progress */}
            <section className="mt-6 rounded-[2rem] border border-white/80 bg-white/65 p-6 shadow-[0_20px_60px_rgba(236,72,153,0.10)] backdrop-blur-2xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <FolderKanban className="h-5 w-5 text-pink-500" />
                    <h2 className="text-xl font-bold">
                      Project Progress
                    </h2>
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    See how each project is progressing
                  </p>
                </div>
              </div>

              {projectStats.length === 0 ? (
                <div className="rounded-2xl bg-pink-50/60 p-6 text-center">
                  <p className="text-sm font-medium text-slate-600">
                    You haven't created any projects yet.
                  </p>

                  <button
                    onClick={() => router.push("/projects")}
                    className="mt-3 text-sm font-semibold text-pink-600 hover:text-pink-700"
                  >
                    Create a project →
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {projectStats.map((project) => (
                    <div key={project.id}>
                      <div className="mb-2 flex items-center justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            className={`h-3 w-3 shrink-0 rounded-full ${
                              projectColors[project.color] ??
                              "bg-pink-500"
                            }`}
                          />

                          <span className="truncate text-sm font-semibold text-slate-800">
                            {project.name}
                          </span>
                        </div>

                        <div className="shrink-0 text-right">
                          <span className="text-sm font-bold text-pink-600">
                            {project.percentage}%
                          </span>

                          <span className="ml-2 text-xs text-slate-400">
                            {project.completed}/{project.total}
                          </span>
                        </div>
                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-pink-100">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            projectColors[project.color] ??
                            "bg-pink-500"
                          }`}
                          style={{
                            width: `${project.percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Bottom grid */}
            <section className="mt-6 grid gap-6 lg:grid-cols-2">
              {/* Productivity breakdown */}
              <div className="rounded-[2rem] border border-white/80 bg-white/65 p-6 shadow-[0_20px_60px_rgba(236,72,153,0.10)] backdrop-blur-2xl">
                <div className="mb-6 flex items-center gap-2">
                  <Target className="h-5 w-5 text-pink-500" />
                  <h2 className="text-xl font-bold">
                    Productivity Breakdown
                  </h2>
                </div>

                <div className="space-y-5">
                  <BreakdownRow
                    label="Completed"
                    value={stats.completed}
                    total={stats.total}
                  />

                  <BreakdownRow
                    label="In Progress"
                    value={stats.inProgress}
                    total={stats.total}
                  />

                  <BreakdownRow
                    label="To-do"
                    value={stats.todo}
                    total={stats.total}
                  />

                  <BreakdownRow
                    label="High Priority"
                    value={stats.highPriority}
                    total={stats.total}
                  />
                </div>
              </div>

              {/* Recent completed */}
              <div className="rounded-[2rem] border border-white/80 bg-white/65 p-6 shadow-[0_20px_60px_rgba(236,72,153,0.10)] backdrop-blur-2xl">
                <div className="mb-6 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-pink-500" />
                  <h2 className="text-xl font-bold">
                    Recently Completed
                  </h2>
                </div>

                {recentCompletedTasks.length === 0 ? (
                  <div className="rounded-2xl bg-pink-50/60 p-6 text-center">
                    <p className="text-sm text-slate-500">
                      No completed tasks yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentCompletedTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-3 rounded-2xl border border-pink-100/70 bg-white/70 p-3"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pink-100 text-pink-500">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {task.title}
                          </p>

                          <p className="mt-0.5 truncate text-xs text-slate-400">
                            {getProjectName(task.project_id)}
                          </p>
                        </div>

                        <span className="shrink-0 text-xs font-medium text-pink-500">
                          Done
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-[1.7rem] border border-white/80 bg-white/65 p-5 shadow-[0_15px_40px_rgba(236,72,153,0.09)] backdrop-blur-2xl transition hover:-translate-y-1">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-pink-100 text-pink-500">
        {icon}
      </div>

      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-3xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {description}
      </p>
    </div>
  );
}

function BreakdownRow({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total: number;
}) {
  const percentage =
    total === 0 ? 0 : Math.round((value / total) * 100);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-600">
          {label}
        </span>

        <span className="text-sm font-bold text-slate-800">
          {value}
        </span>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-pink-100">
        <div
          className="h-full rounded-full bg-pink-500 transition-all duration-700"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}