"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

import {
  LayoutDashboard,
  CheckSquare,
  CalendarDays,
  FolderKanban,
  TrendingUp,
  Star,
  User,
  Plus,
  CheckCircle2,
  Circle,
  Clock3,
  Trash2,
  X,
  LogOut,
  Pencil,
  Save,
  Flag,
  Bell,
  Sparkles,
  Search,
  SlidersHorizontal,
  ChevronDown,
  AlertCircle,
  Timer,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

import {
  notifyTaskCompleted,
  notifyTaskImportant,
  notifyTaskAssignedToProject,
  notifyUpcomingDeadline,
  notifyTaskOverdue,
} from "@/lib/notifications";

/* =========================================================
   TYPES
========================================================= */

type TaskStatus =
  | "todo"
  | "in_progress"
  | "completed";

type TaskPriority =
  | "low"
  | "normal"
  | "high";

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
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;

  due_date: string | null;
  due_time: string | null;
  reminder_minutes: number | null;

  is_important: boolean;
  project_id: string | null;
  created_at: string;
  updated_at: string;
};

type StatusFilter =
  | "all"
  | "todo"
  | "in_progress"
  | "completed";

type PriorityFilter =
  | "all"
  | "low"
  | "normal"
  | "high";

type SortOption =
  | "created_desc"
  | "created_asc"
  | "due_asc"
  | "due_desc"
  | "priority_high"
  | "priority_low"
  | "title_asc";

/* =========================================================
   NAVIGATION
========================================================= */

const navigation = [
  {
    name: "Overview",
    icon: LayoutDashboard,
    key: "overview",
  },
  {
    name: "My Tasks",
    icon: CheckSquare,
    key: "tasks",
  },
  {
    name: "Important",
    icon: Star,
    key: "important",
  },
  {
    name: "Calendar",
    icon: CalendarDays,
    key: "calendar",
  },
  {
    name: "Projects",
    icon: FolderKanban,
    key: "projects",
  },
  {
    name: "Progress",
    icon: TrendingUp,
    key: "progress",
  },
  {
    name: "Profile",
    icon: User,
    key: "profile",
  },
];

/* =========================================================
   HELPER FUNCTIONS
========================================================= */

function getTodayString(): string {
  const date = new Date();

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getTomorrowString(): string {
  const date = new Date();

  date.setDate(
    date.getDate() + 1
  );

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isOverdue(
  dueDate: string | null
): boolean {
  if (!dueDate) {
    return false;
  }

  return (
    dueDate < getTodayString()
  );
}

function isDueSoon(
  dueDate: string | null
): boolean {
  if (!dueDate) {
    return false;
  }

  const today =
    getTodayString();

  const tomorrow =
    getTomorrowString();

  return (
    dueDate === today ||
    dueDate === tomorrow
  );
}

function priorityValue(
  priority: TaskPriority
): number {
  if (priority === "high") {
    return 3;
  }

  if (priority === "normal") {
    return 2;
  }

  return 1;
}

function compareDueDates(
  first: string | null,
  second: string | null
): number {
  if (!first && !second) {
    return 0;
  }

  if (!first) {
    return 1;
  }

  if (!second) {
    return -1;
  }

  return first.localeCompare(second);
}

function getProjectFromList(
  projects: Project[],
  projectId: string | null
): Project | null {
  if (!projectId) {
    return null;
  }

  return (
    projects.find(
      (project) =>
        project.id === projectId
    ) || null
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

export default function DashboardPage() {
  const router = useRouter();

  /* =======================================================
     USER / DATA
  ======================================================= */

  const [user, setUser] =
    useState<any>(null);

  const [tasks, setTasks] =
    useState<Task[]>([]);

  const [projects, setProjects] =
    useState<Project[]>([]);

  const [loading, setLoading] =
    useState(true);

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const [activeSection, setActiveSection] =
    useState<
      "overview" | "tasks" | "important"
    >("overview");

  /* =======================================================
     MODALS
  ======================================================= */

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [editingTask, setEditingTask] =
    useState<Task | null>(null);

  const [saving, setSaving] =
    useState(false);

  /* =======================================================
     NOTIFICATIONS
  ======================================================= */

  const [
    unreadNotifications,
    setUnreadNotifications,
  ] = useState(0);

  const [
    notificationAnimating,
    setNotificationAnimating,
  ] = useState(false);

  /* =======================================================
     CREATE FORM
  ======================================================= */

  const [newTitle, setNewTitle] =
    useState("");

  const [newDescription, setNewDescription] =
    useState("");

  const [newPriority, setNewPriority] =
    useState<TaskPriority>("normal");

  const [newDueDate, setNewDueDate] =
    useState("");

  const [newDueTime, setNewDueTime] =
    useState("");

  const [
    newReminderMinutes,
    setNewReminderMinutes,
  ] = useState<number | null>(30);

  const [newImportant, setNewImportant] =
    useState(false);

  const [newProjectId, setNewProjectId] =
    useState("");

  /* =======================================================
     EDIT FORM
  ======================================================= */

  const [editTitle, setEditTitle] =
    useState("");

  const [editDescription, setEditDescription] =
    useState("");

  const [editPriority, setEditPriority] =
    useState<TaskPriority>("normal");

  const [editDueDate, setEditDueDate] =
    useState("");

  const [editDueTime, setEditDueTime] =
    useState("");

  const [
    editReminderMinutes,
    setEditReminderMinutes,
  ] = useState<number | null>(30);

  const [editImportant, setEditImportant] =
    useState(false);

  const [editStatus, setEditStatus] =
    useState<TaskStatus>("todo");

  const [editProjectId, setEditProjectId] =
    useState("");

  /* =======================================================
     SEARCH / FILTERS
  ======================================================= */

  const [searchQuery, setSearchQuery] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const [priorityFilter, setPriorityFilter] =
    useState<PriorityFilter>("all");

  const [projectFilter, setProjectFilter] =
    useState("all");

  const [sortOption, setSortOption] =
    useState<SortOption>("created_desc");

  const [showFilters, setShowFilters] =
    useState(false);

  /* =======================================================
     LOAD DASHBOARD
  ======================================================= */

  useEffect(() => {
    loadDashboard();
  }, []);

  /* =======================================================
     REALTIME NOTIFICATIONS
  ======================================================= */

  useEffect(() => {
    if (!user) {
      return;
    }

    loadUnreadNotifications();

    const channel = supabase
      .channel(
        `dashboard-notifications-${user.id}`
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          loadUnreadNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, [user]);

  /* =======================================================
     LOAD DASHBOARD DATA
  ======================================================= */

  async function loadDashboard() {
    setLoading(true);

    const {
      data: authData,
      error: authError,
    } =
      await supabase.auth.getUser();

    if (
      authError ||
      !authData.user
    ) {
      router.push("/login");
      return;
    }

    const currentUser =
      authData.user;

    setUser(currentUser);

    const [
      tasksResponse,
      projectsResponse,
    ] = await Promise.all([
      supabase
        .from("tasks")
        .select("*")
        .eq(
          "user_id",
          currentUser.id
        )
        .order("created_at", {
          ascending: false,
        }),

      supabase
        .from("projects")
        .select("*")
        .eq(
          "user_id",
          currentUser.id
        )
        .order("created_at", {
          ascending: false,
        }),
    ]);

    if (tasksResponse.error) {
      console.error(
        "Error loading tasks:",
        tasksResponse.error
      );
    }

    if (projectsResponse.error) {
      console.error(
        "Error loading projects:",
        projectsResponse.error
      );
    }

    const loadedTasks =
      (tasksResponse.data ||
        []) as Task[];

    const loadedProjects =
      (projectsResponse.data ||
        []) as Project[];

    setTasks(loadedTasks);
    setProjects(loadedProjects);

    await generateDeadlineNotifications(
      currentUser.id,
      loadedTasks
    );

    await loadUnreadNotifications(
      currentUser.id
    );

    setLoading(false);
  }

  /* =======================================================
     LOAD UNREAD NOTIFICATIONS
  ======================================================= */

  async function loadUnreadNotifications(
    userId?: string
  ) {
    const currentUserId =
      userId || user?.id;

    if (!currentUserId) {
      return;
    }

    const { count, error } =
      await supabase
        .from("notifications")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq(
          "user_id",
          currentUserId
        )
        .eq(
          "is_read",
          false
        );

    if (error) {
      console.error(
        "Error loading notifications:",
        error
      );

      return;
    }

    setUnreadNotifications(
      count || 0
    );
  }

  /* =======================================================
     AUTOMATIC DEADLINE NOTIFICATIONS
  ======================================================= */

  async function generateDeadlineNotifications(
    userId: string,
    taskList: Task[]
  ) {
    const activeTasks =
      taskList.filter(
        (task) =>
          task.status !==
            "completed" &&
          task.due_date
      );

    if (
      activeTasks.length === 0
    ) {
      return;
    }

    const taskIds =
      activeTasks.map(
        (task) => task.id
      );

    const {
      data: existingNotifications,
      error,
    } = await supabase
      .from("notifications")
      .select(
        "id, task_id, type"
      )
      .eq(
        "user_id",
        userId
      )
      .in(
        "task_id",
        taskIds
      )
      .in(
        "type",
        ["deadline", "overdue"]
      );

    if (error) {
      console.error(
        "Error checking deadline notifications:",
        error
      );

      return;
    }

    const existing =
      existingNotifications || [];

    const today =
      getTodayString();

    const tomorrow =
      getTomorrowString();

    for (const task of activeTasks) {
      if (!task.due_date) {
        continue;
      }

      const taskNotifications =
        existing.filter(
          (notification) =>
            notification.task_id ===
            task.id
        );

      /* OVERDUE */

      if (
        task.due_date < today
      ) {
        const alreadyNotified =
          taskNotifications.some(
            (notification) =>
              notification.type ===
              "overdue"
          );

        if (!alreadyNotified) {
          await notifyTaskOverdue(
            userId,
            task.id,
            task.title
          );
        }

        continue;
      }

      /* DEADLINE */

      if (
        task.due_date === today ||
        task.due_date === tomorrow
      ) {
        const alreadyNotified =
          taskNotifications.some(
            (notification) =>
              notification.type ===
              "deadline"
          );

        if (!alreadyNotified) {
          await notifyUpcomingDeadline(
            userId,
            task.id,
            task.title,
            task.due_date
          );
        }
      }
    }
  }

  /* =======================================================
     CREATE TASK
  ======================================================= */

  async function createTask() {
    if (
      !user ||
      !newTitle.trim()
    ) {
      return;
    }

    setSaving(true);

    const { data, error } =
      await supabase
        .from("tasks")
        .insert({
          user_id: user.id,

          title:
            newTitle.trim(),

          description:
            newDescription.trim() ||
            null,

          status: "todo",

          priority:
            newPriority,

          due_date:
            newDueDate || null,

          due_time:
            newDueTime || null,

          reminder_minutes:
            newDueDate
              ? newReminderMinutes
              : null,

          is_important:
            newImportant,

          project_id:
            newProjectId || null,
        })
        .select()
        .single();

    if (error) {
      console.error(
        "Error creating task:",
        error
      );

      setSaving(false);
      return;
    }

    const createdTask =
      data as Task;

    setTasks((current) => [
      createdTask,
      ...current,
    ]);

    /* PROJECT NOTIFICATION */

    if (newProjectId) {
      const project =
        projects.find(
          (item) =>
            item.id ===
            newProjectId
        );

      if (project) {
        await notifyTaskAssignedToProject(
          user.id,
          createdTask.id,
          createdTask.title,
          project.id,
          project.name
        );
      }
    }

    /* IMPORTANT NOTIFICATION */

    if (newImportant) {
      await notifyTaskImportant(
        user.id,
        createdTask.id,
        createdTask.title
      );
    }

    /* DEADLINE NOTIFICATION */

    await generateDeadlineNotifications(
      user.id,
      [createdTask]
    );

    await loadUnreadNotifications(
      user.id
    );

    resetCreateForm();

    setSaving(false);
    setShowCreateModal(false);
  }

  /* =======================================================
     RESET CREATE FORM
  ======================================================= */

  function resetCreateForm() {
    setNewTitle("");
    setNewDescription("");
    setNewPriority("normal");
    setNewDueDate("");
    setNewDueTime("");
    setNewReminderMinutes(30);
    setNewImportant(false);
    setNewProjectId("");
  }

  /* =======================================================
     OPEN EDIT MODAL
  ======================================================= */

  function openEditModal(
    task: Task
  ) {
    setEditingTask(task);

    setEditTitle(
      task.title
    );

    setEditDescription(
      task.description || ""
    );

    setEditPriority(
      task.priority
    );

    setEditDueDate(
      task.due_date || ""
    );

    setEditDueTime(
      task.due_time || ""
    );

    setEditReminderMinutes(
      task.reminder_minutes ??
        30
    );

    setEditImportant(
      task.is_important
    );

    setEditStatus(
      task.status
    );

    setEditProjectId(
      task.project_id || ""
    );

    setShowEditModal(true);
  }

  /* =======================================================
     SAVE EDITED TASK
  ======================================================= */

  async function saveEditedTask() {
    if (
      !user ||
      !editingTask ||
      !editTitle.trim()
    ) {
      return;
    }

    setSaving(true);

    const previousProjectId =
      editingTask.project_id;

    const previousImportant =
      editingTask.is_important;

    const previousStatus =
      editingTask.status;

    const { data, error } =
      await supabase
        .from("tasks")
        .update({
          title:
            editTitle.trim(),

          description:
            editDescription.trim() ||
            null,

          priority:
            editPriority,

          due_date:
            editDueDate || null,

          due_time:
            editDueTime || null,

          reminder_minutes:
            editDueDate
              ? editReminderMinutes
              : null,

          is_important:
            editImportant,

          status:
            editStatus,

          project_id:
            editProjectId || null,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          editingTask.id
        )
        .eq(
          "user_id",
          user.id
        )
        .select()
        .single();

    if (error) {
      console.error(
        "Error updating task:",
        error
      );

      setSaving(false);
      return;
    }

    const updatedTask =
      data as Task;

    setTasks((current) =>
      current.map((task) =>
        task.id ===
        updatedTask.id
          ? updatedTask
          : task
      )
    );

    /* IMPORTANT */

    if (
      !previousImportant &&
      editImportant
    ) {
      await notifyTaskImportant(
        user.id,
        updatedTask.id,
        updatedTask.title
      );
    }

    /* PROJECT */

    if (
      previousProjectId !==
        editProjectId &&
      editProjectId
    ) {
      const project =
        projects.find(
          (item) =>
            item.id ===
            editProjectId
        );

      if (project) {
        await notifyTaskAssignedToProject(
          user.id,
          updatedTask.id,
          updatedTask.title,
          project.id,
          project.name
        );
      }
    }

    /* COMPLETED */

    if (
      previousStatus !==
        "completed" &&
      editStatus ===
        "completed"
    ) {
      await notifyTaskCompleted(
        user.id,
        updatedTask.id,
        updatedTask.title
      );
    }

    /* DEADLINE / OVERDUE */

    await generateDeadlineNotifications(
      user.id,
      [updatedTask]
    );

    await loadUnreadNotifications(
      user.id
    );

    setShowEditModal(false);
    setEditingTask(null);
    setSaving(false);
  }

  /* =======================================================
     TOGGLE COMPLETE
  ======================================================= */

  async function toggleComplete(
    task: Task
  ) {
    if (!user) {
      return;
    }

    const newStatus: TaskStatus =
      task.status ===
      "completed"
        ? "todo"
        : "completed";

    const updatedAt =
      new Date().toISOString();

    const { error } =
      await supabase
        .from("tasks")
        .update({
          status:
            newStatus,

          updated_at:
            updatedAt,
        })
        .eq(
          "id",
          task.id
        )
        .eq(
          "user_id",
          user.id
        );

    if (error) {
      console.error(
        "Error updating task:",
        error
      );

      return;
    }

    const updatedTask: Task = {
      ...task,

      status:
        newStatus,

      updated_at:
        updatedAt,
    };

    setTasks((current) =>
      current.map((item) =>
        item.id === task.id
          ? updatedTask
          : item
      )
    );

    if (
      newStatus ===
      "completed"
    ) {
      await notifyTaskCompleted(
        user.id,
        task.id,
        task.title
      );

      await loadUnreadNotifications(
        user.id
      );
    } else {
      await generateDeadlineNotifications(
        user.id,
        [updatedTask]
      );
    }
  }

  /* =======================================================
     TOGGLE IMPORTANT
  ======================================================= */

  async function toggleImportant(
    task: Task
  ) {
    if (!user) {
      return;
    }

    const newImportant =
      !task.is_important;

    const updatedAt =
      new Date().toISOString();

    const { error } =
      await supabase
        .from("tasks")
        .update({
          is_important:
            newImportant,

          updated_at:
            updatedAt,
        })
        .eq(
          "id",
          task.id
        )
        .eq(
          "user_id",
          user.id
        );

    if (error) {
      console.error(
        "Error updating important status:",
        error
      );

      return;
    }

    setTasks((current) =>
      current.map((item) =>
        item.id === task.id
          ? {
              ...item,

              is_important:
                newImportant,

              updated_at:
                updatedAt,
            }
          : item
      )
    );

    if (newImportant) {
      await notifyTaskImportant(
        user.id,
        task.id,
        task.title
      );

      await loadUnreadNotifications(
        user.id
      );
    }
  }

  /* =======================================================
     DELETE TASK
  ======================================================= */

  async function deleteTask(
    taskId: string
  ) {
    if (!user) {
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this task?"
      );

    if (!confirmed) {
      return;
    }

    const { error } =
      await supabase
        .from("tasks")
        .delete()
        .eq(
          "id",
          taskId
        )
        .eq(
          "user_id",
          user.id
        );

    if (error) {
      console.error(
        "Error deleting task:",
        error
      );

      return;
    }

    setTasks((current) =>
      current.filter(
        (task) =>
          task.id !== taskId
      )
    );
  }

  /* =======================================================
     LOGOUT
  ======================================================= */

  async function logout() {
    await supabase.auth.signOut();

    router.push("/login");
    router.refresh();
  }

  /* =======================================================
     NAVIGATION
  ======================================================= */

  function handleNavigation(
    key: string
  ) {
    if (key === "calendar") {
      router.push(
        "/calendar"
      );
      return;
    }

    if (key === "projects") {
      router.push(
        "/projects"
      );
      return;
    }

    if (key === "progress") {
      router.push(
        "/progress"
      );
      return;
    }

    if (key === "profile") {
      router.push(
        "/profile"
      );
      return;
    }

    if (
      key === "overview" ||
      key === "tasks" ||
      key === "important"
    ) {
      setActiveSection(
        key as
          | "overview"
          | "tasks"
          | "important"
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  /* =======================================================
     NOTIFICATION BUTTON
  ======================================================= */

  function handleNotificationClick() {
    setNotificationAnimating(
      true
    );

    window.setTimeout(() => {
      router.push(
        "/notifications"
      );
    }, 500);

    window.setTimeout(() => {
      setNotificationAnimating(
        false
      );
    }, 800);
  }

  /* =======================================================
     FILTERED TASKS
  ======================================================= */

  const filteredTasks =
    useMemo(() => {
      let result = [...tasks];

      /* SECTION */

      if (
        activeSection ===
        "important"
      ) {
        result =
          result.filter(
            (task) =>
              task.is_important
          );
      }

      /* SEARCH */

      const query =
        searchQuery
          .trim()
          .toLowerCase();

      if (query) {
        result =
          result.filter(
            (task) => {
              const project =
                getProjectFromList(
                  projects,
                  task.project_id
                );

              return (
                task.title
                  .toLowerCase()
                  .includes(query) ||
                (
                  task.description ||
                  ""
                )
                  .toLowerCase()
                  .includes(query) ||
                (
                  project?.name ||
                  ""
                )
                  .toLowerCase()
                  .includes(query)
              );
            }
          );
      }

      /* STATUS */

      if (
        statusFilter !==
        "all"
      ) {
        result =
          result.filter(
            (task) =>
              task.status ===
              statusFilter
          );
      }

      /* PRIORITY */

      if (
        priorityFilter !==
        "all"
      ) {
        result =
          result.filter(
            (task) =>
              task.priority ===
              priorityFilter
          );
      }

      /* PROJECT */

      if (
        projectFilter !==
        "all"
      ) {
        result =
          result.filter(
            (task) =>
              task.project_id ===
              projectFilter
          );
      }

      /* SORT */

      result.sort((a, b) => {
        switch (sortOption) {
          case "created_asc":
            return (
              new Date(
                a.created_at
              ).getTime() -
              new Date(
                b.created_at
              ).getTime()
            );

          case "due_asc":
            return compareDueDates(
              a.due_date,
              b.due_date
            );

          case "due_desc":
            return compareDueDates(
              b.due_date,
              a.due_date
            );

          case "priority_high":
            return (
              priorityValue(
                b.priority
              ) -
              priorityValue(
                a.priority
              )
            );

          case "priority_low":
            return (
              priorityValue(
                a.priority
              ) -
              priorityValue(
                b.priority
              )
            );

          case "title_asc":
            return a.title.localeCompare(
              b.title
            );

          case "created_desc":
          default:
            return (
              new Date(
                b.created_at
              ).getTime() -
              new Date(
                a.created_at
              ).getTime()
            );
        }
      });

      return result;
    }, [
      tasks,
      projects,
      activeSection,
      searchQuery,
      statusFilter,
      priorityFilter,
      projectFilter,
      sortOption,
    ]);

  /* =======================================================
     STATISTICS
  ======================================================= */

  const totalTasks =
    tasks.length;

  const completedTasks =
    tasks.filter(
      (task) =>
        task.status ===
        "completed"
    ).length;

  const inProgressTasks =
    tasks.filter(
      (task) =>
        task.status ===
        "in_progress"
    ).length;

  const importantTasks =
    tasks.filter(
      (task) =>
        task.is_important
    ).length;

  const overdueTasks =
    tasks.filter(
      (task) =>
        task.status !==
          "completed" &&
        isOverdue(
          task.due_date
        )
    ).length;

  const dueSoonTasks =
    tasks.filter(
      (task) =>
        task.status !==
          "completed" &&
        isDueSoon(
          task.due_date
        )
    ).length;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks /
            totalTasks) *
            100
        );

  /* =======================================================
     FORMAT DATE
  ======================================================= */

  function formatDueDate(
    date: string | null
  ): string {
    if (!date) {
      return "No due date";
    }

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  }

  /* =======================================================
     PRIORITY STYLE
  ======================================================= */

  function getPriorityStyle(
    priority: TaskPriority
  ): string {
    if (priority === "high") {
      return "bg-pink-100 text-pink-600 border-pink-200";
    }

    if (priority === "low") {
      return "bg-slate-100 text-slate-500 border-slate-200";
    }

    return "bg-rose-50 text-rose-500 border-rose-100";
  }

  /* =======================================================
     PROJECT STYLE
  ======================================================= */

  function getProjectStyle(
    color: string
  ): string {
    switch (color) {
      case "rose":
        return "bg-rose-50 text-rose-500 border-rose-100";

      case "fuchsia":
        return "bg-fuchsia-50 text-fuchsia-500 border-fuchsia-100";

      case "purple":
        return "bg-purple-50 text-purple-500 border-purple-100";

      default:
        return "bg-pink-50 text-pink-500 border-pink-100";
    }
  }

  /* =======================================================
     STATUS LABEL
  ======================================================= */

  function getStatusLabel(
    status: TaskStatus
  ): string {
    if (
      status ===
      "completed"
    ) {
      return "Completed";
    }

    if (
      status ===
      "in_progress"
    ) {
      return "In Progress";
    }

    return "To Do";
  }

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-300 via-pink-400 to-rose-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink-200/40">
            <CheckSquare className="w-7 h-7 text-white" />
          </div>

          <p className="text-slate-500 font-medium">
            Loading your tasks...
          </p>
        </div>
      </main>
    );
  }

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <main className="min-h-screen bg-white text-slate-800 relative overflow-hidden">

      {/* BACKGROUND */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-pink-200/50 blur-3xl" />

        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-rose-200/40 blur-3xl" />

        <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] rounded-full bg-fuchsia-100/50 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-screen">

        {/* =================================================
            SIDEBAR
        ================================================= */}

        <aside className="hidden lg:flex w-72 p-5">
          <div className="w-full rounded-[32px] border border-white/80 bg-white/60 backdrop-blur-2xl shadow-[0_25px_70px_rgba(190,24,93,0.12)] p-5 flex flex-col">

            {/* LOGO */}

            <div className="flex items-center gap-3 px-2 mb-10">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-300 via-pink-400 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-200/40">
                <CheckSquare className="w-6 h-6 text-white" />
              </div>

              <div>
                <h1 className="font-bold text-xl">
                  TaskFlow
                </h1>

                <p className="text-xs text-slate-400">
                  Organize your life
                </p>
              </div>
            </div>

            {/* NAVIGATION */}

            <nav className="space-y-2">
              {navigation.map(
                (item) => {
                  const Icon =
                    item.icon;

                  const active =
                    item.key ===
                    activeSection;

                  return (
                    <button
                      key={
                        item.key
                      }
                      onClick={() =>
                        handleNavigation(
                          item.key
                        )
                      }
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition ${
                        active
                          ? "bg-gradient-to-r from-pink-400 to-rose-500 text-white shadow-lg shadow-pink-200/40"
                          : "text-slate-500 hover:bg-white/80 hover:text-pink-500"
                      }`}
                    >
                      <Icon className="w-5 h-5" />

                      {item.name}

                      {item.key ===
                        "important" &&
                        importantTasks >
                          0 && (
                          <span className="ml-auto text-xs">
                            {
                              importantTasks
                            }
                          </span>
                        )}
                    </button>
                  );
                }
              )}
            </nav>

            {/* USER */}

            <div className="mt-auto">
              <div className="rounded-2xl bg-white/70 border border-white p-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-200 to-rose-400 flex items-center justify-center text-white font-bold">
                    {(
                      user
                        ?.user_metadata
                        ?.full_name ||
                      user?.email ||
                      "U"
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {user
                        ?.user_metadata
                        ?.full_name ||
                        "User"}
                    </p>

                    <p className="text-xs text-slate-400 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={
                  logout
                }
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-slate-500 hover:bg-white/80 hover:text-pink-500 transition"
              >
                <LogOut className="w-5 h-5" />

                Log out
              </button>
            </div>
          </div>
        </aside>

        {/* =================================================
            CONTENT
        ================================================= */}

        <section className="flex-1 min-w-0 p-4 md:p-6 lg:p-8 pb-28 lg:pb-8">

          {/* HEADER */}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
            <div>
              <p className="text-sm text-pink-400 font-semibold mb-1">
                TaskFlow
              </p>

              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Good morning,{" "}
                {user
                  ?.user_metadata
                  ?.full_name ||
                  "there"}{" "}
                👋
              </h2>

              <p className="text-slate-400 mt-2">
                Here&apos;s what&apos;s
                happening with your
                tasks.
              </p>
            </div>

            <div className="flex items-center gap-3">

              {/* NOTIFICATION */}

              <button
                onClick={
                  handleNotificationClick
                }
                className={`relative w-12 h-12 rounded-2xl border border-white bg-white/70 backdrop-blur-xl flex items-center justify-center text-slate-500 hover:text-pink-500 transition ${
                  notificationAnimating
                    ? "scale-110 rotate-12"
                    : ""
                }`}
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />

                {unreadNotifications >
                  0 && (
                  <span className="absolute -top-1 -right-1 min-w-[19px] h-[19px] px-1 rounded-full bg-gradient-to-r from-pink-400 to-rose-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                    {unreadNotifications >
                    9
                      ? "9+"
                      : unreadNotifications}
                  </span>
                )}

                {notificationAnimating && (
                  <>
                    <Sparkles className="absolute -top-5 -left-3 w-4 h-4 text-pink-400" />

                    <Sparkles className="absolute -top-3 -right-4 w-3 h-3 text-rose-400" />

                    <Sparkles className="absolute -bottom-3 -left-4 w-3 h-3 text-pink-400" />

                    <Sparkles className="absolute -bottom-4 -right-2 w-4 h-4 text-rose-400" />
                  </>
                )}
              </button>

              {/* NEW TASK */}

              <button
                onClick={() =>
                  setShowCreateModal(
                    true
                  )
                }
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-400 to-rose-500 text-white font-semibold shadow-lg shadow-pink-200/50 hover:scale-[1.02] active:scale-[0.98] transition"
              >
                <Plus className="w-5 h-5" />

                New Task
              </button>
            </div>
          </div>

          {/* =================================================
              STATS
          ================================================= */}

          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">

            <StatCard
              label="Total Tasks"
              value={
                totalTasks
              }
              icon={
                <CheckSquare className="w-5 h-5 text-pink-500" />
              }
            />

            <StatCard
              label="Completed"
              value={
                completedTasks
              }
              icon={
                <CheckCircle2 className="w-5 h-5 text-pink-500" />
              }
            />

            <StatCard
              label="In Progress"
              value={
                inProgressTasks
              }
              icon={
                <Clock3 className="w-5 h-5 text-rose-500" />
              }
            />

            <StatCard
              label="Important"
              value={
                importantTasks
              }
              icon={
                <Star className="w-5 h-5 text-pink-500" />
              }
            />
          </div>

          {/* =================================================
              DEADLINE CARDS
          ================================================= */}

          {(
            overdueTasks >
              0 ||
            dueSoonTasks >
              0
          ) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

              {overdueTasks >
                0 && (
                <div className="rounded-[26px] border border-pink-200 bg-pink-50/70 backdrop-blur-xl p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-pink-500" />
                  </div>

                  <div>
                    <p className="font-bold text-pink-600">
                      {
                        overdueTasks
                      }{" "}
                      overdue{" "}
                      {overdueTasks ===
                      1
                        ? "task"
                        : "tasks"}
                    </p>

                    <p className="text-sm text-pink-400">
                      These tasks need
                      your attention.
                    </p>
                  </div>
                </div>
              )}

              {dueSoonTasks >
                0 && (
                <div className="rounded-[26px] border border-rose-100 bg-rose-50/70 backdrop-blur-xl p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center">
                    <Timer className="w-6 h-6 text-rose-500" />
                  </div>

                  <div>
                    <p className="font-bold text-rose-600">
                      {
                        dueSoonTasks
                      }{" "}
                      deadline
                      {dueSoonTasks ===
                      1
                        ? ""
                        : "s"}{" "}
                      coming up
                    </p>

                    <p className="text-sm text-rose-400">
                      Stay ahead of
                      your deadlines.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =================================================
              PROGRESS
          ================================================= */}

          <div className="rounded-[30px] border border-white/80 bg-white/60 backdrop-blur-2xl p-6 mb-8 shadow-[0_20px_55px_rgba(190,24,93,0.08)]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-lg">
                  Your Progress
                </h3>

                <p className="text-sm text-slate-400">
                  Keep going. You&apos;re
                  doing great.
                </p>
              </div>

              <span className="text-2xl font-bold text-pink-500">
                {progress}%
              </span>
            </div>

            <div className="h-3 rounded-full bg-pink-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-pink-400 to-rose-500 transition-all duration-700"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>

          {/* =================================================
              TASK CONTAINER
          ================================================= */}

          <div className="rounded-[32px] border border-white/80 bg-white/60 backdrop-blur-2xl p-5 md:p-7 shadow-[0_25px_70px_rgba(190,24,93,0.1)]">

            {/* TASK HEADER */}

            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-6">
              <div>
                <h3 className="text-xl font-bold">
                  {activeSection ===
                  "important"
                    ? "Important Tasks"
                    : "My Tasks"}
                </h3>

                <p className="text-sm text-slate-400 mt-1">
                  {
                    filteredTasks.length
                  }{" "}
                  {filteredTasks.length ===
                  1
                    ? "task"
                    : "tasks"}{" "}
                  shown
                </p>
              </div>

              <button
                onClick={() =>
                  setShowFilters(
                    (value) =>
                      !value
                  )
                }
                className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border text-sm font-semibold transition ${
                  showFilters
                    ? "bg-pink-50 border-pink-200 text-pink-500"
                    : "bg-white/70 border-white text-slate-500 hover:text-pink-500"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />

                Filters
              </button>
            </div>

            {/* SEARCH */}

            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-300" />

              <input
                type="text"
                value={
                  searchQuery
                }
                onChange={(
                  event
                ) =>
                  setSearchQuery(
                    event.target
                      .value
                  )
                }
                placeholder="Search tasks, descriptions, or projects..."
                className="w-full rounded-2xl border border-white bg-white/70 py-3.5 pl-12 pr-4 outline-none text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-pink-200"
              />
            </div>

            {/* FILTERS */}

            {showFilters && (
              <div className="rounded-3xl border border-white bg-white/50 p-4 mb-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                  <FilterSelect
                    label="Status"
                    value={
                      statusFilter
                    }
                    onChange={(
                      value
                    ) =>
                      setStatusFilter(
                        value as StatusFilter
                      )
                    }
                  >
                    <option value="all">
                      All statuses
                    </option>

                    <option value="todo">
                      To Do
                    </option>

                    <option value="in_progress">
                      In Progress
                    </option>

                    <option value="completed">
                      Completed
                    </option>
                  </FilterSelect>

                  <FilterSelect
                    label="Priority"
                    value={
                      priorityFilter
                    }
                    onChange={(
                      value
                    ) =>
                      setPriorityFilter(
                        value as PriorityFilter
                      )
                    }
                  >
                    <option value="all">
                      All priorities
                    </option>

                    <option value="high">
                      High
                    </option>

                    <option value="normal">
                      Normal
                    </option>

                    <option value="low">
                      Low
                    </option>
                  </FilterSelect>

                  <FilterSelect
                    label="Project"
                    value={
                      projectFilter
                    }
                    onChange={
                      setProjectFilter
                    }
                  >
                    <option value="all">
                      All projects
                    </option>

                    {projects.map(
                      (
                        project
                      ) => (
                        <option
                          key={
                            project.id
                          }
                          value={
                            project.id
                          }
                        >
                          {
                            project.name
                          }
                        </option>
                      )
                    )}
                  </FilterSelect>

                  <FilterSelect
                    label="Sort"
                    value={
                      sortOption
                    }
                    onChange={(
                      value
                    ) =>
                      setSortOption(
                        value as SortOption
                      )
                    }
                  >
                    <option value="created_desc">
                      Newest first
                    </option>

                    <option value="created_asc">
                      Oldest first
                    </option>

                    <option value="due_asc">
                      Due date ↑
                    </option>

                    <option value="due_desc">
                      Due date ↓
                    </option>

                    <option value="priority_high">
                      Highest priority
                    </option>

                    <option value="priority_low">
                      Lowest priority
                    </option>

                    <option value="title_asc">
                      Title A-Z
                    </option>
                  </FilterSelect>
                </div>

                <button
                  onClick={() => {
                    setSearchQuery(
                      ""
                    );

                    setStatusFilter(
                      "all"
                    );

                    setPriorityFilter(
                      "all"
                    );

                    setProjectFilter(
                      "all"
                    );

                    setSortOption(
                      "created_desc"
                    );
                  }}
                  className="mt-4 text-sm font-semibold text-pink-500 hover:text-pink-600"
                >
                  Reset filters
                </button>
              </div>
            )}

            {/* =================================================
                TASK LIST
            ================================================= */}

            {filteredTasks.length ===
            0 ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 rounded-3xl bg-pink-100 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-7 h-7 text-pink-400" />
                </div>

                <h4 className="font-bold text-lg">
                  {tasks.length ===
                  0
                    ? "No tasks yet"
                    : "No matching tasks"}
                </h4>

                <p className="text-slate-400 text-sm mt-2">
                  {tasks.length ===
                  0
                    ? "Create your first task to get started."
                    : "Try changing your search or filters."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTasks.map(
                  (task) => {
                    const project =
                      getProjectFromList(
                        projects,
                        task.project_id
                      );

                    const overdue =
                      task.status !==
                        "completed" &&
                      isOverdue(
                        task.due_date
                      );

                    const dueSoon =
                      task.status !==
                        "completed" &&
                      isDueSoon(
                        task.due_date
                      );

                    return (
                      <div
                        key={
                          task.id
                        }
                        className={`group rounded-2xl border p-4 md:p-5 transition hover:bg-white/90 hover:shadow-lg ${
                          overdue
                            ? "border-pink-200 bg-pink-50/40"
                            : "border-white bg-white/70"
                        } ${
                          task.status ===
                          "completed"
                            ? "opacity-70"
                            : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">

                          {/* COMPLETE */}

                          <button
                            onClick={() =>
                              toggleComplete(
                                task
                              )
                            }
                            className="mt-1 shrink-0"
                          >
                            {task.status ===
                            "completed" ? (
                              <CheckCircle2 className="w-6 h-6 text-pink-500" />
                            ) : (
                              <Circle className="w-6 h-6 text-slate-300 hover:text-pink-400" />
                            )}
                          </button>

                          {/* CONTENT */}

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4
                                className={`font-semibold ${
                                  task.status ===
                                  "completed"
                                    ? "line-through text-slate-400"
                                    : ""
                                }`}
                              >
                                {
                                  task.title
                                }
                              </h4>

                              {task.is_important && (
                                <Star className="w-4 h-4 text-pink-400 fill-pink-400" />
                              )}

                              {overdue && (
                                <span className="px-2 py-1 rounded-full bg-pink-100 text-pink-600 text-[10px] font-bold">
                                  OVERDUE
                                </span>
                              )}

                              {!overdue &&
                                dueSoon && (
                                  <span className="px-2 py-1 rounded-full bg-rose-50 text-rose-500 text-[10px] font-bold">
                                    DUE SOON
                                  </span>
                                )}
                            </div>

                            {task.description && (
                              <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                                {
                                  task.description
                                }
                              </p>
                            )}

                            <div className="flex flex-wrap items-center gap-2 mt-3">

                              {/* PRIORITY */}

                              <span
                                className={`px-2.5 py-1 rounded-full border text-xs font-medium ${getPriorityStyle(
                                  task.priority
                                )}`}
                              >
                                {task.priority
                                  .charAt(
                                    0
                                  )
                                  .toUpperCase() +
                                  task.priority.slice(
                                    1
                                  )}
                              </span>

                              {/* STATUS */}

                              <span className="px-2.5 py-1 rounded-full bg-white border border-slate-100 text-xs text-slate-400">
                                {getStatusLabel(
                                  task.status
                                )}
                              </span>

                              {/* PROJECT */}

                              {project && (
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs ${getProjectStyle(
                                    project.color
                                  )}`}
                                >
                                  <FolderKanban className="w-3 h-3" />

                                  {
                                    project.name
                                  }
                                </span>
                              )}

                              {/* DUE DATE + TIME */}

                              {task.due_date && (
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs ${
                                    overdue
                                      ? "bg-pink-100 text-pink-600 border-pink-200"
                                      : "bg-white text-slate-400 border-slate-100"
                                  }`}
                                >
                                  <CalendarDays className="w-3.5 h-3.5" />

                                  {formatDueDate(
                                    task.due_date
                                  )}

                                  {task.due_time && (
                                    <>
                                      <span className="text-slate-300">
                                        •
                                      </span>

                                      <Clock3 className="w-3.5 h-3.5" />

                                      {task.due_time.slice(
                                        0,
                                        5
                                      )}
                                    </>
                                  )}
                                </span>
                              )}

                              {/* REMINDER */}

                              {task.due_date &&
                                task.reminder_minutes !==
                                  null && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-purple-100 bg-purple-50 text-purple-500 text-xs">
                                    <Bell className="w-3.5 h-3.5" />

                                    {task.reminder_minutes <
                                    60
                                      ? `${task.reminder_minutes} min reminder`
                                      : task.reminder_minutes ===
                                        60
                                      ? "1 hour reminder"
                                      : task.reminder_minutes ===
                                        1440
                                      ? "1 day reminder"
                                      : `${task.reminder_minutes} min reminder`}
                                  </span>
                                )}
                            </div>
                          </div>

                          {/* ACTIONS */}

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() =>
                                openEditModal(
                                  task
                                )
                              }
                              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-pink-500 hover:bg-pink-50 transition"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() =>
                                toggleImportant(
                                  task
                                )
                              }
                              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                                task.is_important
                                  ? "text-pink-500 bg-pink-50"
                                  : "text-slate-400 hover:text-pink-500 hover:bg-pink-50"
                              }`}
                              title="Important"
                            >
                              <Star
                                className={`w-4 h-4 ${
                                  task.is_important
                                    ? "fill-pink-400"
                                    : ""
                                }`}
                              />
                            </button>

                            <button
                              onClick={() =>
                                deleteTask(
                                  task.id
                                )
                              }
                              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* =====================================================
          MOBILE NAVIGATION
      ===================================================== */}

      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
        <div className="rounded-3xl border border-white bg-white/80 backdrop-blur-2xl shadow-xl p-2 overflow-x-auto">
          <div className="flex items-center justify-between min-w-max">
            {navigation.map(
              (item) => {
                const Icon =
                  item.icon;

                const active =
                  item.key ===
                  activeSection;

                return (
                  <button
                    key={
                      item.key
                    }
                    onClick={() =>
                      handleNavigation(
                        item.key
                      )
                    }
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition ${
                      active
                        ? "bg-gradient-to-br from-pink-400 to-rose-500 text-white"
                        : "text-slate-400 hover:text-pink-500"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                );
              }
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          CREATE MODAL
      ===================================================== */}

      {showCreateModal && (
        <TaskModal
          mode="create"
          title="Create New Task"
          buttonText={
            saving
              ? "Creating..."
              : "Create Task"
          }
          saving={saving}

          taskTitle={
            newTitle
          }

          description={
            newDescription
          }

          priority={
            newPriority
          }

          dueDate={
            newDueDate
          }

          dueTime={
            newDueTime
          }

          reminderMinutes={
            newReminderMinutes
          }

          important={
            newImportant
          }

          status="todo"

          projectId={
            newProjectId
          }

          projects={
            projects
          }

          setTaskTitle={
            setNewTitle
          }

          setDescription={
            setNewDescription
          }

          setPriority={
            setNewPriority
          }

          setDueDate={
            setNewDueDate
          }

          setDueTime={
            setNewDueTime
          }

          setReminderMinutes={
            setNewReminderMinutes
          }

          setImportant={
            setNewImportant
          }

          setStatus={
            setEditStatus
          }

          setProjectId={
            setNewProjectId
          }

          onClose={() => {
            if (!saving) {
              setShowCreateModal(
                false
              );

              resetCreateForm();
            }
          }}

          onSave={
            createTask
          }
        />
      )}

      {/* =====================================================
          EDIT MODAL
      ===================================================== */}

      {showEditModal &&
        editingTask && (
          <TaskModal
            mode="edit"
            title="Edit Task"
            buttonText={
              saving
                ? "Saving..."
                : "Save Changes"
            }
            saving={saving}

            taskTitle={
              editTitle
            }

            description={
              editDescription
            }

            priority={
              editPriority
            }

            dueDate={
              editDueDate
            }

            dueTime={
              editDueTime
            }

            reminderMinutes={
              editReminderMinutes
            }

            important={
              editImportant
            }

            status={
              editStatus
            }

            projectId={
              editProjectId
            }

            projects={
              projects
            }

            setTaskTitle={
              setEditTitle
            }

            setDescription={
              setEditDescription
            }

            setPriority={
              setEditPriority
            }

            setDueDate={
              setEditDueDate
            }

            setDueTime={
              setEditDueTime
            }

            setReminderMinutes={
              setEditReminderMinutes
            }

            setImportant={
              setEditImportant
            }

            setStatus={
              setEditStatus
            }

            setProjectId={
              setEditProjectId
            }

            onClose={() => {
              if (!saving) {
                setShowEditModal(
                  false
                );

                setEditingTask(
                  null
                );
              }
            }}

            onSave={
              saveEditedTask
            }
          />
        )}
    </main>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-white/80 bg-white/60 backdrop-blur-2xl p-5 shadow-[0_20px_50px_rgba(190,24,93,0.08)]">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-slate-400">
          {label}
        </span>

        <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
          {icon}
        </div>
      </div>

      <p className="text-3xl font-bold">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   FILTER SELECT
========================================================= */

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-400 mb-2">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          className="w-full appearance-none rounded-2xl border border-white bg-white/80 px-4 py-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-pink-200"
        >
          {children}
        </select>

        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
      </div>
    </div>
  );
}

/* =========================================================
   TASK MODAL
========================================================= */

type TaskModalProps = {
  mode: "create" | "edit";

  title: string;

  buttonText: string;

  saving: boolean;

  taskTitle: string;

  description: string;

  priority: TaskPriority;

  dueDate: string;

  dueTime: string;

  reminderMinutes:
    | number
    | null;

  important: boolean;

  status: TaskStatus;

  projectId: string;

  projects: Project[];

  setTaskTitle: (
    value: string
  ) => void;

  setDescription: (
    value: string
  ) => void;

  setPriority: (
    value: TaskPriority
  ) => void;

  setDueDate: (
    value: string
  ) => void;

  setDueTime: (
    value: string
  ) => void;

  setReminderMinutes: (
    value: number | null
  ) => void;

  setImportant: (
    value: boolean
  ) => void;

  setStatus: (
    value: TaskStatus
  ) => void;

  setProjectId: (
    value: string
  ) => void;

  onClose: () => void;

  onSave: () => void;
};

function TaskModal({
  mode,
  title,
  buttonText,
  saving,
  taskTitle,
  description,
  priority,
  dueDate,
  dueTime,
  reminderMinutes,
  important,
  status,
  projectId,
  projects,
  setTaskTitle,
  setDescription,
  setPriority,
  setDueDate,
  setDueTime,
  setReminderMinutes,
  setImportant,
  setStatus,
  setProjectId,
  onClose,
  onSave,
}: TaskModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* OVERLAY */}

      <div
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}

      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[32px] border border-white bg-white/95 backdrop-blur-2xl shadow-2xl p-6 md:p-8">

        {/* CLOSE */}

        <button
          type="button"
          onClick={
            onClose
          }
          disabled={saving}
          className="absolute top-5 right-5 w-10 h-10 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center hover:bg-pink-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER */}

        <div className="mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-300 via-pink-400 to-rose-500 flex items-center justify-center text-white mb-4">
            {mode ===
            "edit" ? (
              <Pencil className="w-6 h-6" />
            ) : (
              <Plus className="w-6 h-6" />
            )}
          </div>

          <h3 className="text-2xl font-bold">
            {title}
          </h3>

          <p className="text-sm text-slate-400 mt-1">
            {mode ===
            "edit"
              ? "Update your task details."
              : "Add something you want to accomplish."}
          </p>
        </div>

        <div className="space-y-4">

          {/* TITLE */}

          <div>
            <label className="block text-sm font-semibold mb-2">
              Task title
            </label>

            <input
              type="text"
              value={
                taskTitle
              }
              onChange={(
                event
              ) =>
                setTaskTitle(
                  event.target
                    .value
                )
              }
              placeholder="What needs to be done?"
              className="w-full rounded-2xl border border-pink-100 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-pink-200"
            />
          </div>

          {/* DESCRIPTION */}

          <div>
            <label className="block text-sm font-semibold mb-2">
              Description
            </label>

            <textarea
              value={
                description
              }
              onChange={(
                event
              ) =>
                setDescription(
                  event.target
                    .value
                )
              }
              placeholder="Add some details..."
              rows={4}
              className="w-full rounded-2xl border border-pink-100 bg-white px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-pink-200"
            />
          </div>

          {/* PROJECT */}

          <div>
            <label className="block text-sm font-semibold mb-2">
              Project
            </label>

            <select
              value={
                projectId
              }
              onChange={(
                event
              ) =>
                setProjectId(
                  event.target
                    .value
                )
              }
              className="w-full rounded-2xl border border-pink-100 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-pink-200"
            >
              <option value="">
                No Project
              </option>

              {projects.map(
                (
                  project
                ) => (
                  <option
                    key={
                      project.id
                    }
                    value={
                      project.id
                    }
                  >
                    {
                      project.name
                    }
                  </option>
                )
              )}
            </select>
          </div>

          {/* STATUS */}

          {mode ===
            "edit" && (
            <div>
              <label className="block text-sm font-semibold mb-2">
                Status
              </label>

              <select
                value={
                  status
                }
                onChange={(
                  event
                ) =>
                  setStatus(
                    event.target
                      .value as TaskStatus
                  )
                }
                className="w-full rounded-2xl border border-pink-100 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-pink-200"
              >
                <option value="todo">
                  To Do
                </option>

                <option value="in_progress">
                  In Progress
                </option>

                <option value="completed">
                  Completed
                </option>
              </select>
            </div>
          )}

          {/* PRIORITY + DUE DATE */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* PRIORITY */}

            <div>
              <label className="block text-sm font-semibold mb-2">
                Priority
              </label>

              <select
                value={
                  priority
                }
                onChange={(
                  event
                ) =>
                  setPriority(
                    event.target
                      .value as TaskPriority
                  )
                }
                className="w-full rounded-2xl border border-pink-100 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-pink-200"
              >
                <option value="low">
                  Low
                </option>

                <option value="normal">
                  Normal
                </option>

                <option value="high">
                  High
                </option>
              </select>
            </div>

            {/* DUE DATE */}

            <div>
              <label className="block text-sm font-semibold mb-2">
                Due date
              </label>

              <input
                type="date"
                value={
                  dueDate
                }
                onChange={(
                  event
                ) =>
                  setDueDate(
                    event.target
                      .value
                  )
                }
                className="w-full rounded-2xl border border-pink-100 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-pink-200"
              />
            </div>
          </div>

          {/* SCHEDULING */}

          {dueDate && (
            <div className="rounded-3xl border border-pink-100 bg-pink-50/40 p-4 space-y-4">

              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-pink-500" />

                <div>
                  <p className="text-sm font-bold text-slate-700">
                    Scheduling
                  </p>

                  <p className="text-xs text-slate-400">
                    Set when the task is due and when you want a reminder.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* DUE TIME */}

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Due time
                  </label>

                  <div className="relative">
                    <Clock3 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-300 pointer-events-none" />

                    <input
                      type="time"
                      value={
                        dueTime
                      }
                      onChange={(
                        event
                      ) =>
                        setDueTime(
                          event.target
                            .value
                        )
                      }
                      className="w-full rounded-2xl border border-pink-100 bg-white px-4 py-3 pl-10 outline-none focus:ring-2 focus:ring-pink-200"
                    />
                  </div>
                </div>

                {/* REMINDER */}

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Reminder
                  </label>

                  <div className="relative">
                    <Bell className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-300 pointer-events-none" />

                    <select
                      value={
                        reminderMinutes ===
                        null
                          ? "none"
                          : String(
                              reminderMinutes
                            )
                      }
                      onChange={(
                        event
                      ) => {
                        const value =
                          event
                            .target
                            .value;

                        setReminderMinutes(
                          value ===
                            "none"
                            ? null
                            : Number(
                                value
                              )
                        );
                      }}
                      className="w-full appearance-none rounded-2xl border border-pink-100 bg-white px-4 py-3 pl-10 pr-10 outline-none focus:ring-2 focus:ring-pink-200"
                    >
                      <option value="15">
                        15 minutes before
                      </option>

                      <option value="30">
                        30 minutes before
                      </option>

                      <option value="60">
                        1 hour before
                      </option>

                      <option value="1440">
                        1 day before
                      </option>

                      <option value="none">
                        No reminder
                      </option>
                    </select>

                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* IMPORTANT */}

          <label className="flex items-center gap-3 p-4 rounded-2xl bg-pink-50 border border-pink-100 cursor-pointer">
            <input
              type="checkbox"
              checked={
                important
              }
              onChange={(
                event
              ) =>
                setImportant(
                  event.target
                    .checked
                )
              }
              className="w-5 h-5 accent-pink-500"
            />

            <div>
              <p className="font-semibold text-sm flex items-center gap-2">
                <Flag className="w-4 h-4 text-pink-500" />

                Mark as important
              </p>

              <p className="text-xs text-slate-400">
                Show this task in
                Important.
              </p>
            </div>
          </label>

          {/* BUTTONS */}

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">

            <button
              type="button"
              onClick={
                onClose
              }
              disabled={
                saving
              }
              className="flex-1 py-3.5 rounded-2xl border border-pink-100 bg-white text-slate-500 font-semibold hover:bg-pink-50 transition disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={
                onSave
              }
              disabled={
                saving ||
                !taskTitle.trim()
              }
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-pink-400 to-rose-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-pink-200/40 disabled:opacity-50"
            >
              {mode ===
              "edit" ? (
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