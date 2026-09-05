"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FolderKanban,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  ArrowLeft,
  CheckCircle2,
  Circle,
  ListTodo,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type Project = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  color: string;
  created_at: string;
  updated_at: string;
};

type Task = {
  id: string;
  user_id: string;
  project_id: string | null;
  title: string;
  status: "todo" | "in_progress" | "completed";
  priority: "low" | "normal" | "high";
  due_date: string | null;
  is_important: boolean;
};

const projectColors = [
  {
    name: "Pink",
    value: "pink",
    gradient:
      "from-pink-300 via-pink-400 to-rose-500",
    soft: "bg-pink-50",
    text: "text-pink-500",
  },
  {
    name: "Rose",
    value: "rose",
    gradient:
      "from-rose-300 via-rose-400 to-pink-500",
    soft: "bg-rose-50",
    text: "text-rose-500",
  },
  {
    name: "Fuchsia",
    value: "fuchsia",
    gradient:
      "from-fuchsia-300 via-fuchsia-400 to-pink-500",
    soft: "bg-fuchsia-50",
    text: "text-fuchsia-500",
  },
  {
    name: "Purple",
    value: "purple",
    gradient:
      "from-purple-300 via-purple-400 to-fuchsia-500",
    soft: "bg-purple-50",
    text: "text-purple-500",
  },
];

export default function ProjectsPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [selectedProject, setSelectedProject] =
    useState<Project | null>(null);

  const [saving, setSaving] = useState(false);

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] =
    useState("");
  const [projectColor, setProjectColor] =
    useState("pink");

  useEffect(() => {
    let cancelled = false;

    const loadProjects = async () => {
      setLoading(true);

      const {
        data: { user: currentUser },
        error: userError,
      } = await supabase.auth.getUser();

      if (cancelled) {
        return;
      }

      if (userError || !currentUser) {
        router.push("/login");
        return;
      }

      setUser(currentUser);

      const [
        { data: projectData, error: projectError },
        { data: taskData, error: taskError },
      ] = await Promise.all([
        supabase
          .from("projects")
          .select("*")
          .eq("user_id", currentUser.id)
          .order("created_at", {
            ascending: false,
          }),

        supabase
          .from("tasks")
          .select(
            "id, user_id, project_id, title, status, priority, due_date, is_important"
          )
          .eq("user_id", currentUser.id)
          .order("created_at", {
            ascending: false,
          }),
      ]);

      if (cancelled) {
        return;
      }

      if (projectError) {
        console.error(
          "Error loading projects:",
          projectError
        );
      } else {
        setProjects((projectData || []) as Project[]);
      }

      if (taskError) {
        console.error(
          "Error loading tasks:",
          taskError
        );
      } else {
        setTasks((taskData || []) as Task[]);
      }

      setLoading(false);
    };

    void loadProjects();

    return () => {
      cancelled = true;
    };
  }, [router]);

  function resetForm() {
    setProjectName("");
    setProjectDescription("");
    setProjectColor("pink");
  }

  async function createProject() {
    if (!projectName.trim() || !user) return;

    setSaving(true);

    const { data, error } = await supabase
      .from("projects")
      .insert({
        user_id: user.id,
        name: projectName.trim(),
        description:
          projectDescription.trim() || null,
        color: projectColor,
      })
      .select()
      .single();

    if (error) {
      console.error(
        "Error creating project:",
        error
      );
      setSaving(false);
      return;
    }

    setProjects((current) => [
      data as Project,
      ...current,
    ]);

    resetForm();
    setShowCreateModal(false);
    setSaving(false);
  }

  function openEditProject(project: Project) {
    setSelectedProject(project);

    setProjectName(project.name);
    setProjectDescription(
      project.description || ""
    );
    setProjectColor(project.color);

    setShowEditModal(true);
  }

  async function saveProject() {
    if (!selectedProject || !projectName.trim() || !user) {
      return;
    }

    setSaving(true);

    const { data, error } = await supabase
      .from("projects")
      .update({
        name: projectName.trim(),
        description:
          projectDescription.trim() || null,
        color: projectColor,
        updated_at: new Date().toISOString(),
      })
      .eq("id", selectedProject.id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error(
        "Error updating project:",
        error
      );
      setSaving(false);
      return;
    }

    setProjects((current) =>
      current.map((project) =>
        project.id === selectedProject.id
          ? (data as Project)
          : project
      )
    );

    setSelectedProject(null);
    setShowEditModal(false);
    resetForm();
    setSaving(false);
  }

  async function deleteProject(project: Project) {
    if (!user) return;

    const confirmed = window.confirm(
      `Delete "${project.name}"? Tasks inside this project will not be deleted.`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", project.id)
      .eq("user_id", user.id);

    if (error) {
      console.error(
        "Error deleting project:",
        error
      );
      return;
    }

    setProjects((current) =>
      current.filter(
        (item) => item.id !== project.id
      )
    );

    setTasks((current) =>
      current.map((task) =>
        task.project_id === project.id
          ? {
              ...task,
              project_id: null,
            }
          : task
      )
    );
  }

  function getProjectColor(color: string) {
    return (
      projectColors.find(
        (item) => item.value === color
      ) || projectColors[0]
    );
  }

  function getProjectTasks(projectId: string) {
    return tasks.filter(
      (task) => task.project_id === projectId
    );
  }

  function getCompletedTasks(projectId: string) {
    return getProjectTasks(projectId).filter(
      (task) => task.status === "completed"
    );
  }

  function getProgress(projectId: string) {
    const projectTasks =
      getProjectTasks(projectId);

    if (projectTasks.length === 0) return 0;

    const completed = projectTasks.filter(
      (task) => task.status === "completed"
    ).length;

    return Math.round(
      (completed / projectTasks.length) * 100
    );
  }

  const totalProjectTasks = tasks.filter(
    (task) => task.project_id !== null
  ).length;

  const completedProjectTasks = tasks.filter(
    (task) =>
      task.project_id !== null &&
      task.status === "completed"
  ).length;

  const overallProgress =
    totalProjectTasks === 0
      ? 0
      : Math.round(
          (completedProjectTasks /
            totalProjectTasks) *
            100
        );

  const sortedProjects = useMemo(() => {
    return [...projects].sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    );
  }, [projects]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-300 via-pink-400 to-rose-500 shadow-[inset_4px_4px_10px_rgba(255,255,255,0.65),inset_-5px_-5px_12px_rgba(190,24,93,0.25),0_15px_30px_rgba(236,72,153,0.25)] flex items-center justify-center mx-auto mb-4">
            <FolderKanban className="w-7 h-7 text-white" />
          </div>

          <p className="text-slate-500 font-medium">
            Loading projects...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-white text-slate-800 p-4 md:p-8">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-pink-200/50 blur-3xl" />

        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-rose-200/45 blur-3xl" />

        <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] rounded-full bg-fuchsia-100/50 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                router.push("/dashboard")
              }
              className="w-11 h-11 rounded-2xl border border-white/80 bg-white/70 backdrop-blur-xl flex items-center justify-center text-slate-500 hover:text-pink-500 hover:bg-white transition shadow-[0_10px_25px_rgba(190,24,93,0.08)]"
              title="Back to dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <FolderKanban className="w-5 h-5 text-pink-500" />

                <span className="text-sm font-semibold text-pink-400">
                  TaskFlow
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Projects
              </h1>

              <p className="text-slate-400 mt-1">
                Organize your tasks into focused
                projects.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowCreateModal(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-400 to-rose-500 text-white font-semibold shadow-[inset_2px_2px_6px_rgba(255,255,255,0.4),inset_-3px_-3px_8px_rgba(190,24,93,0.2),0_12px_25px_rgba(236,72,153,0.25)] hover:scale-[1.02] active:scale-[0.98] transition"
          >
            <Plus className="w-5 h-5" />
            New Project
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-[28px] border border-white/80 bg-white/60 backdrop-blur-2xl p-5 shadow-[0_20px_50px_rgba(190,24,93,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-400">
                Projects
              </span>

              <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
                <FolderKanban className="w-5 h-5 text-pink-500" />
              </div>
            </div>

            <p className="text-3xl font-bold">
              {projects.length}
            </p>
          </div>

          <div className="rounded-[28px] border border-white/80 bg-white/60 backdrop-blur-2xl p-5 shadow-[0_20px_50px_rgba(190,24,93,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-400">
                Project Tasks
              </span>

              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <ListTodo className="w-5 h-5 text-rose-500" />
              </div>
            </div>

            <p className="text-3xl font-bold">
              {totalProjectTasks}
            </p>
          </div>

          <div className="rounded-[28px] border border-white/80 bg-white/60 backdrop-blur-2xl p-5 shadow-[0_20px_50px_rgba(190,24,93,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-400">
                Overall Progress
              </span>

              <div className="w-10 h-10 rounded-xl bg-fuchsia-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-fuchsia-500" />
              </div>
            </div>

            <p className="text-3xl font-bold">
              {overallProgress}%
            </p>
          </div>
        </div>

        {/* Projects */}
        {sortedProjects.length === 0 ? (
          <div className="rounded-[32px] border border-white/80 bg-white/60 backdrop-blur-2xl p-10 md:p-16 text-center shadow-[0_25px_70px_rgba(190,24,93,0.1),inset_0_1px_0_rgba(255,255,255,0.9)]">
            <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-pink-300 via-pink-400 to-rose-500 flex items-center justify-center mx-auto mb-5 shadow-[inset_5px_5px_12px_rgba(255,255,255,0.65),inset_-6px_-6px_14px_rgba(190,24,93,0.25),0_15px_30px_rgba(236,72,153,0.25)]">
              <FolderKanban className="w-9 h-9 text-white" />
            </div>

            <h2 className="text-2xl font-bold">
              No projects yet
            </h2>

            <p className="text-slate-400 max-w-md mx-auto mt-2 mb-6">
              Create your first project and start
              organizing your tasks.
            </p>

            <button
              onClick={() => {
                resetForm();
                setShowCreateModal(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-400 to-rose-500 text-white font-semibold shadow-lg shadow-pink-200/50"
            >
              <Plus className="w-5 h-5" />
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {sortedProjects.map((project) => {
              const projectTasks =
                getProjectTasks(project.id);

              const completedTasks =
                getCompletedTasks(project.id);

              const progress =
                getProgress(project.id);

              const color = getProjectColor(
                project.color
              );

              return (
                <div
                  key={project.id}
                  className="group rounded-[30px] border border-white/80 bg-white/60 backdrop-blur-2xl p-5 shadow-[0_25px_60px_rgba(190,24,93,0.09),inset_0_1px_0_rgba(255,255,255,0.9)] hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(190,24,93,0.14)] transition"
                >
                  {/* Project top */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br ${color.gradient} flex items-center justify-center text-white shadow-[inset_4px_4px_10px_rgba(255,255,255,0.6),inset_-5px_-5px_12px_rgba(190,24,93,0.22),0_12px_25px_rgba(236,72,153,0.2)]`}
                      >
                        <FolderKanban className="w-6 h-6" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-bold text-lg truncate">
                          {project.name}
                        </h3>

                        <p className="text-xs text-slate-400">
                          {projectTasks.length}{" "}
                          {projectTasks.length === 1
                            ? "task"
                            : "tasks"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition">
                      <button
                        onClick={() =>
                          openEditProject(project)
                        }
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-pink-500 hover:bg-pink-50 transition"
                        title="Edit project"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() =>
                          deleteProject(project)
                        }
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
                        title="Delete project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-400 mt-4 min-h-[40px] line-clamp-2">
                    {project.description ||
                      "No description added."}
                  </p>

                  {/* Progress */}
                  <div className="mt-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-slate-400">
                        Progress
                      </span>

                      <span className="text-sm font-bold text-pink-500">
                        {progress}%
                      </span>
                    </div>

                    <div className="h-2.5 rounded-full bg-pink-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${color.gradient} transition-all duration-500`}
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Task stats */}
                  <div className="grid grid-cols-2 gap-3 mt-5">
                    <div className="rounded-2xl bg-white/70 border border-white/80 p-3">
                      <div className="flex items-center gap-2">
                        <ListTodo className="w-4 h-4 text-pink-400" />

                        <span className="text-xs text-slate-400">
                          Tasks
                        </span>
                      </div>

                      <p className="font-bold mt-1">
                        {projectTasks.length}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/70 border border-white/80 p-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-pink-400" />

                        <span className="text-xs text-slate-400">
                          Done
                        </span>
                      </div>

                      <p className="font-bold mt-1">
                        {completedTasks.length}
                      </p>
                    </div>
                  </div>

                  {/* Project tasks */}
                  {projectTasks.length > 0 && (
                    <div className="mt-5 pt-5 border-t border-pink-100/70">
                      <p className="text-xs font-semibold text-slate-400 mb-3">
                        Recent tasks
                      </p>

                      <div className="space-y-2">
                        {projectTasks
                          .slice(0, 3)
                          .map((task) => (
                            <div
                              key={task.id}
                              className="flex items-center gap-2 text-sm"
                            >
                              {task.status ===
                              "completed" ? (
                                <CheckCircle2 className="w-4 h-4 shrink-0 text-pink-500" />
                              ) : (
                                <Circle className="w-4 h-4 shrink-0 text-slate-300" />
                              )}

                              <span
                                className={`truncate ${
                                  task.status ===
                                  "completed"
                                    ? "line-through text-slate-400"
                                    : "text-slate-600"
                                }`}
                              >
                                {task.title}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <ProjectModal
          title="Create New Project"
          buttonText={
            saving ? "Creating..." : "Create Project"
          }
          saving={saving}
          projectName={projectName}
          projectDescription={projectDescription}
          projectColor={projectColor}
          setProjectName={setProjectName}
          setProjectDescription={
            setProjectDescription
          }
          setProjectColor={setProjectColor}
          onClose={() => {
            if (!saving) {
              setShowCreateModal(false);
              resetForm();
            }
          }}
          onSave={createProject}
        />
      )}

      {/* Edit Project Modal */}
      {showEditModal && selectedProject && (
        <ProjectModal
          title="Edit Project"
          buttonText={
            saving ? "Saving..." : "Save Changes"
          }
          saving={saving}
          projectName={projectName}
          projectDescription={projectDescription}
          projectColor={projectColor}
          setProjectName={setProjectName}
          setProjectDescription={
            setProjectDescription
          }
          setProjectColor={setProjectColor}
          onClose={() => {
            if (!saving) {
              setShowEditModal(false);
              setSelectedProject(null);
              resetForm();
            }
          }}
          onSave={saveProject}
          editMode
        />
      )}
    </main>
  );
}

type ProjectModalProps = {
  title: string;
  buttonText: string;
  saving: boolean;
  projectName: string;
  projectDescription: string;
  projectColor: string;
  setProjectName: (value: string) => void;
  setProjectDescription: (value: string) => void;
  setProjectColor: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
  editMode?: boolean;
};

function ProjectModal({
  title,
  buttonText,
  saving,
  projectName,
  projectDescription,
  projectColor,
  setProjectName,
  setProjectDescription,
  setProjectColor,
  onClose,
  onSave,
  editMode = false,
}: ProjectModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-[32px] border border-white/90 bg-white/90 backdrop-blur-2xl shadow-[0_30px_80px_rgba(190,24,93,0.2),inset_0_1px_0_rgba(255,255,255,0.95)] p-6 md:p-8">
        <button
          disabled={saving}
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center hover:bg-pink-100 transition disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-300 via-pink-400 to-rose-500 flex items-center justify-center text-white mb-4 shadow-[inset_4px_4px_10px_rgba(255,255,255,0.65),inset_-5px_-5px_12px_rgba(190,24,93,0.25),0_12px_25px_rgba(236,72,153,0.25)]">
            {editMode ? (
              <Pencil className="w-6 h-6" />
            ) : (
              <Plus className="w-6 h-6" />
            )}
          </div>

          <h2 className="text-2xl font-bold">
            {title}
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            {editMode
              ? "Update your project details."
              : "Create a space for related tasks."}
          </p>
        </div>

        <div className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Project name
            </label>

            <input
              value={projectName}
              onChange={(e) =>
                setProjectName(e.target.value)
              }
              placeholder="e.g. College Project"
              className="w-full rounded-2xl border border-pink-100 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-pink-200"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Description
            </label>

            <textarea
              value={projectDescription}
              onChange={(e) =>
                setProjectDescription(e.target.value)
              }
              placeholder="What is this project about?"
              rows={4}
              className="w-full rounded-2xl border border-pink-100 bg-white px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-pink-200"
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-semibold mb-3">
              Project color
            </label>

            <div className="grid grid-cols-4 gap-3">
              {projectColors.map((color) => {
                const selected =
                  projectColor === color.value;

                return (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() =>
                      setProjectColor(
                        color.value
                      )
                    }
                    className={`rounded-2xl p-2 border transition ${
                      selected
                        ? "border-pink-400 bg-pink-50"
                        : "border-slate-100 bg-white hover:border-pink-200"
                    }`}
                  >
                    <div
                      className={`h-10 rounded-xl bg-gradient-to-r ${color.gradient} shadow-[inset_2px_2px_6px_rgba(255,255,255,0.55)]`}
                    />

                    <p className="text-xs font-medium mt-2 text-slate-500">
                      {color.name}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
            <button
              disabled={saving}
              onClick={onClose}
              className="flex-1 py-3.5 rounded-2xl border border-pink-100 bg-white text-slate-500 font-semibold hover:bg-pink-50 transition disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              disabled={
                saving || !projectName.trim()
              }
              onClick={onSave}
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-pink-400 to-rose-500 text-white font-semibold flex items-center justify-center gap-2 shadow-[inset_2px_2px_6px_rgba(255,255,255,0.4),inset_-3px_-3px_8px_rgba(190,24,93,0.2),0_12px_25px_rgba(236,72,153,0.2)] disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {editMode ? (
                <Save className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}

              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}