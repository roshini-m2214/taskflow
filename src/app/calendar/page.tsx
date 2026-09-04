"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Flag,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type TaskStatus =
  | "todo"
  | "in_progress"
  | "completed";

type TaskPriority =
  | "low"
  | "normal"
  | "high";

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
};

type CalendarDay = {
  date: Date;
  currentMonth: boolean;
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

function formatDate(date: Date) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatReminder(
  minutes: number | null
) {
  if (minutes === null) {
    return "No reminder";
  }

  if (minutes < 60) {
    return `${minutes} minutes before`;
  }

  if (minutes === 60) {
    return "1 hour before";
  }

  if (minutes === 1440) {
    return "1 day before";
  }

  return `${minutes} minutes before`;
}

export default function CalendarPage() {
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentDate, setCurrentDate] =
    useState(new Date());

  const [selectedDate, setSelectedDate] =
    useState(formatDate(new Date()));

  const [showModal, setShowModal] =
    useState(false);

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [priority, setPriority] =
    useState<TaskPriority>("normal");

  const [important, setImportant] =
    useState(false);

  const [dueTime, setDueTime] =
    useState("");

  const [reminderMinutes, setReminderMinutes] =
    useState<number | null>(30);

  const [saving, setSaving] =
    useState(false);

  const year =
    currentDate.getFullYear();

  const month =
    currentDate.getMonth();

  /*
   * LOAD TASKS
   */
  async function loadTasks() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      router.push("/login");
      return;
    }

    const { data, error } =
      await supabase
        .from("tasks")
        .select(
          `
            id,
            user_id,
            title,
            description,
            status,
            priority,
            due_date,
            due_time,
            reminder_minutes,
            is_important
          `
        )
        .eq("user_id", user.id)
        .order("due_date", {
          ascending: true,
        })
        .order("due_time", {
          ascending: true,
          nullsFirst: false,
        });

    if (error) {
      console.error(
        "Error loading tasks:",
        error
      );

      setTasks([]);
    } else {
      setTasks((data ?? []) as Task[]);
    }

    setLoading(false);
  }

  /*
   * INITIAL LOAD
   */
  useEffect(() => {
    loadTasks();
  }, []);

  /*
   * AUTO REFRESH
   *
   * Replaces the Supabase Realtime listener.
   * This avoids the postgres_changes callback
   * error while still keeping the calendar
   * reasonably up to date.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      loadTasks();
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  /*
   * CALENDAR DAYS
   */
  const calendarDays =
    useMemo<CalendarDay[]>(() => {
      const days: CalendarDay[] = [];

      const firstDayOfMonth =
        new Date(
          year,
          month,
          1
        ).getDay();

      const daysInCurrentMonth =
        new Date(
          year,
          month + 1,
          0
        ).getDate();

      /*
       * PREVIOUS MONTH
       */
      for (
        let i = firstDayOfMonth - 1;
        i >= 0;
        i--
      ) {
        days.push({
          date: new Date(
            year,
            month,
            -i
          ),
          currentMonth: false,
        });
      }

      /*
       * CURRENT MONTH
       */
      for (
        let day = 1;
        day <= daysInCurrentMonth;
        day++
      ) {
        days.push({
          date: new Date(
            year,
            month,
            day
          ),
          currentMonth: true,
        });
      }

      /*
       * NEXT MONTH
       */
      let nextDay = 1;

      while (days.length < 42) {
        days.push({
          date: new Date(
            year,
            month + 1,
            nextDay
          ),
          currentMonth: false,
        });

        nextDay++;
      }

      return days;
    }, [year, month]);

  const selectedTasks = tasks.filter(
    (task) =>
      task.due_date === selectedDate
  );

  const today =
    formatDate(new Date());

  function goPreviousMonth() {
    setCurrentDate(
      new Date(
        year,
        month - 1,
        1
      )
    );
  }

  function goNextMonth() {
    setCurrentDate(
      new Date(
        year,
        month + 1,
        1
      )
    );
  }

  function goToday() {
    const date = new Date();

    setCurrentDate(date);

    setSelectedDate(
      formatDate(date)
    );
  }

  function openAddTask() {
    setTitle("");
    setDescription("");
    setPriority("normal");
    setImportant(false);
    setDueTime("");
    setReminderMinutes(30);
    setShowModal(true);
  }

  /*
   * CREATE TASK
   */
  async function createTask() {
    if (!title.trim()) {
      return;
    }

    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      router.push("/login");
      return;
    }

    const { data, error } =
      await supabase
        .from("tasks")
        .insert({
          user_id: user.id,
          title: title.trim(),
          description:
            description.trim()
              ? description.trim()
              : null,
          status: "todo",
          priority,
          due_date: selectedDate,
          due_time:
            dueTime || null,
          reminder_minutes:
            dueTime
              ? reminderMinutes
              : null,
          is_important: important,
        })
        .select(
          `
            id,
            user_id,
            title,
            description,
            status,
            priority,
            due_date,
            due_time,
            reminder_minutes,
            is_important
          `
        )
        .single();

    if (error) {
      console.error(
        "Error creating task:",
        error
      );

      setSaving(false);
      return;
    }

    if (data) {
      setTasks(
        (previousTasks) => [
          ...previousTasks,
          data as Task,
        ]
      );
    }

    setSaving(false);
    setShowModal(false);
  }

  /*
   * TOGGLE COMPLETE
   */
  async function toggleComplete(
    task: Task
  ) {
    const newStatus: TaskStatus =
      task.status === "completed"
        ? "todo"
        : "completed";

    const { error } =
      await supabase
        .from("tasks")
        .update({
          status: newStatus,
          updated_at:
            new Date().toISOString(),
        })
        .eq("id", task.id);

    if (error) {
      console.error(
        "Error updating task:",
        error
      );

      return;
    }

    setTasks(
      (previousTasks) =>
        previousTasks.map(
          (item) =>
            item.id === task.id
              ? {
                  ...item,
                  status: newStatus,
                }
              : item
        )
    );
  }

  /*
   * DELETE TASK
   */
  async function deleteTask(
    taskId: string
  ) {
    const { error } =
      await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId);

    if (error) {
      console.error(
        "Error deleting task:",
        error
      );

      return;
    }

    setTasks(
      (previousTasks) =>
        previousTasks.filter(
          (task) =>
            task.id !== taskId
        )
    );
  }

  /*
   * TASK COLORS
   */
  function getTaskClasses(
    task: Task
  ) {
    if (task.status === "completed") {
      return "bg-emerald-100/80 text-emerald-600 border-emerald-200";
    }

    if (task.priority === "high") {
      return "bg-red-100/80 text-red-500 border-red-200";
    }

    if (task.priority === "low") {
      return "bg-blue-100/80 text-blue-500 border-blue-200";
    }

    return "bg-pink-100/80 text-pink-600 border-pink-200";
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-white text-slate-800 p-4 md:p-8">

      {/* BACKGROUND LIQUID BLOBS */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div
          className="absolute -top-32 -left-32 w-[420px] h-[420px]
          rounded-full bg-pink-200/50 blur-3xl"
        />

        <div
          className="absolute top-1/3 -right-40 w-[500px] h-[500px]
          rounded-full bg-rose-200/45 blur-3xl"
        />

        <div
          className="absolute -bottom-40 left-1/3 w-[500px] h-[500px]
          rounded-full bg-fuchsia-100/50 blur-3xl"
        />

      </div>

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

          <div>

            <button
              onClick={() =>
                router.push(
                  "/dashboard"
                )
              }
              className="mb-4 text-slate-500 hover:text-pink-500 transition"
            >
              ← Back to Dashboard
            </button>

            <div className="flex items-center gap-4">

              {/* JELLY CALENDAR ICON */}
              <div
                className="relative w-14 h-14 rounded-[20px]
                bg-gradient-to-br from-pink-300 via-pink-400 to-rose-500
                flex items-center justify-center
                shadow-[inset_4px_4px_10px_rgba(255,255,255,0.65),inset_-5px_-5px_12px_rgba(190,24,93,0.25),0_12px_25px_rgba(236,72,153,0.25)]
                border border-white/70"
              >

                <div
                  className="absolute top-2 left-3 w-5 h-2 rounded-full bg-white/50 blur-[2px]"
                />

                <CalendarDays
                  className="relative w-7 h-7 text-white drop-shadow-md"
                />

              </div>

              <div>

                <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                  Calendar
                </h1>

                <p className="text-slate-500 mt-1">
                  Organize your tasks by date
                </p>

              </div>

            </div>

          </div>

          {/* ADD TASK */}
          <button
            onClick={openAddTask}
            className="group flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl
            bg-gradient-to-br from-pink-400 via-pink-500 to-rose-500
            text-white font-medium
            border border-white/70
            shadow-[inset_3px_3px_8px_rgba(255,255,255,0.5),inset_-4px_-5px_10px_rgba(190,24,93,0.25),0_12px_25px_rgba(236,72,153,0.25)]
            hover:-translate-y-0.5
            hover:shadow-[inset_3px_3px_8px_rgba(255,255,255,0.55),inset_-4px_-5px_10px_rgba(190,24,93,0.25),0_16px_30px_rgba(236,72,153,0.3)]
            transition-all duration-200"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            Add Task
          </button>

        </div>

        {/* CALENDAR GLASS */}
        <div
          className="rounded-[32px]
          border border-white/80
          bg-white/60
          backdrop-blur-2xl
          shadow-[0_25px_70px_rgba(190,24,93,0.12),inset_0_1px_0_rgba(255,255,255,0.9)]
          overflow-hidden"
        >

          {/* CALENDAR HEADER */}
          <div
            className="p-5 md:p-6
            border-b border-pink-100/80
            bg-white/40
            flex items-center justify-between"
          >

            <div>

              <h2 className="text-xl md:text-2xl font-bold text-slate-800">
                {MONTHS[month]} {year}
              </h2>

              <p className="text-slate-400 text-sm mt-1">
                Select a date to view tasks
              </p>

            </div>

            <div className="flex items-center gap-2">

              <button
                onClick={goToday}
                className="hidden sm:block px-4 py-2 rounded-xl
                bg-white/70
                border border-white
                text-slate-600
                shadow-[inset_2px_2px_5px_rgba(255,255,255,0.9),0_5px_12px_rgba(190,24,93,0.08)]
                hover:bg-pink-50
                hover:text-pink-500
                transition"
              >
                Today
              </button>

              <button
                onClick={goPreviousMonth}
                className="w-10 h-10 rounded-xl
                bg-white/70
                border border-white
                text-slate-600
                flex items-center justify-center
                shadow-[inset_2px_2px_5px_rgba(255,255,255,0.9),0_5px_12px_rgba(190,24,93,0.08)]
                hover:bg-pink-50
                hover:text-pink-500
                transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={goNextMonth}
                className="w-10 h-10 rounded-xl
                bg-white/70
                border border-white
                text-slate-600
                flex items-center justify-center
                shadow-[inset_2px_2px_5px_rgba(255,255,255,0.9),0_5px_12px_rgba(190,24,93,0.08)]
                hover:bg-pink-50
                hover:text-pink-500
                transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

            </div>

          </div>

          {/* WEEKDAYS */}
          <div className="grid grid-cols-7 border-b border-pink-100/80">

            {WEEKDAYS.map(
              (day) => (
                <div
                  key={day}
                  className="py-3 text-center text-xs md:text-sm
                  text-slate-400 font-semibold"
                >
                  {day}
                </div>
              )
            )}

          </div>

          {/* DAYS */}
          <div className="grid grid-cols-7">

            {calendarDays.map(
              (
                {
                  date,
                  currentMonth,
                },
                index
              ) => {

                const dateString =
                  formatDate(date);

                const dayTasks =
                  tasks.filter(
                    (task) =>
                      task.due_date ===
                      dateString
                  );

                const isSelected =
                  selectedDate ===
                  dateString;

                const isToday =
                  today ===
                  dateString;

                return (
                  <button
                    key={`${dateString}-${index}`}
                    onClick={() =>
                      setSelectedDate(
                        dateString
                      )
                    }
                    className={`
                      relative
                      min-h-[90px]
                      md:min-h-[125px]
                      p-2
                      md:p-3
                      text-left
                      border-r
                      border-b
                      border-pink-100/60
                      transition-all
                      duration-200
                      ${
                        isSelected
                          ? "bg-pink-100/70"
                          : "bg-white/20 hover:bg-pink-50/70"
                      }
                      ${
                        !currentMonth
                          ? "opacity-35"
                          : ""
                      }
                    `}
                  >

                    {/* DATE */}
                    <div
                      className={`
                        w-9
                        h-9
                        rounded-full
                        flex
                        items-center
                        justify-center
                        text-sm
                        font-semibold
                        transition
                        ${
                          isToday
                            ? "bg-gradient-to-br from-pink-400 to-rose-500 text-white shadow-[inset_2px_2px_5px_rgba(255,255,255,0.55),inset_-3px_-3px_6px_rgba(190,24,93,0.25),0_6px_12px_rgba(236,72,153,0.25)]"
                            : isSelected
                            ? "bg-white text-pink-500 shadow-[inset_2px_2px_5px_rgba(255,255,255,1),0_5px_10px_rgba(236,72,153,0.12)]"
                            : "text-slate-600"
                        }
                      `}
                    >
                      {date.getDate()}
                    </div>

                    {/* TASKS */}
                    <div className="mt-2 space-y-1">

                      {dayTasks
                        .slice(0, 2)
                        .map(
                          (task) => (
                            <div
                              key={task.id}
                              className={`
                                text-[10px]
                                md:text-xs
                                truncate
                                rounded-lg
                                px-2
                                py-1
                                font-medium
                                border
                                ${getTaskClasses(
                                  task
                                )}
                              `}
                            >

                              <div className="flex items-center gap-1">

                                {task.is_important && (
                                  <Flag className="w-2.5 h-2.5 shrink-0" />
                                )}

                                <span className="truncate">
                                  {task.title}
                                </span>

                              </div>

                              {task.due_time && (
                                <div className="flex items-center gap-1 mt-0.5 opacity-75">

                                  <Clock3 className="w-2.5 h-2.5 shrink-0" />

                                  <span>
                                    {task.due_time.slice(
                                      0,
                                      5
                                    )}
                                  </span>

                                </div>
                              )}

                            </div>
                          )
                        )}

                      {dayTasks.length > 2 && (
                        <div className="text-[10px] text-slate-400 px-1">
                          +
                          {dayTasks.length - 2}{" "}
                          more
                        </div>
                      )}

                    </div>

                  </button>
                );
              }
            )}

          </div>

        </div>

        {/* SELECTED DATE */}
        <section className="mt-8">

          <div className="flex items-center justify-between mb-5">

            <div>

              <h2 className="text-xl font-bold text-slate-800">

                Tasks for{" "}

                {new Date(
                  `${selectedDate}T00:00:00`
                ).toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }
                )}

              </h2>

              <p className="text-slate-400 text-sm mt-1">
                {selectedTasks.length}{" "}
                {selectedTasks.length ===
                1
                  ? "task"
                  : "tasks"}
              </p>

            </div>

            <button
              onClick={openAddTask}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl
              bg-white/80
              border border-white
              text-pink-500
              shadow-[inset_2px_2px_5px_rgba(255,255,255,1),0_6px_15px_rgba(236,72,153,0.1)]
              hover:bg-pink-50
              transition"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>

          </div>

          {/* LOADING */}
          {loading && (
            <div
              className="rounded-2xl
              border border-white
              bg-white/65
              backdrop-blur-xl
              p-10
              text-center
              text-slate-400
              shadow-[0_15px_35px_rgba(190,24,93,0.08)]"
            >
              Loading tasks...
            </div>
          )}

          {/* EMPTY */}
          {!loading &&
            selectedTasks.length ===
              0 && (
              <div
                className="rounded-2xl
                border border-white
                bg-white/65
                backdrop-blur-xl
                p-12
                text-center
                shadow-[0_15px_35px_rgba(190,24,93,0.08)]"
              >

                <div
                  className="w-16 h-16 mx-auto mb-4 rounded-[22px]
                  bg-gradient-to-br from-pink-200 to-rose-300
                  flex items-center justify-center
                  shadow-[inset_3px_3px_8px_rgba(255,255,255,0.7),inset_-4px_-4px_8px_rgba(190,24,93,0.15),0_10px_20px_rgba(236,72,153,0.15)]"
                >
                  <CalendarDays className="w-7 h-7 text-pink-500" />
                </div>

                <p className="text-slate-500">
                  No tasks scheduled
                  for this date.
                </p>

                <button
                  onClick={openAddTask}
                  className="mt-4 text-pink-500 hover:text-pink-600 text-sm font-medium"
                >
                  + Add a task
                </button>

              </div>
            )}

          {/* TASK LIST */}
          {!loading &&
            selectedTasks.length >
              0 && (
              <div className="grid gap-4">

                {selectedTasks.map(
                  (task) => (
                    <div
                      key={task.id}
                      className="rounded-2xl
                      border border-white/80
                      bg-white/65
                      backdrop-blur-xl
                      p-4
                      flex items-center gap-4
                      shadow-[0_12px_30px_rgba(190,24,93,0.08),inset_0_1px_0_rgba(255,255,255,0.95)]
                      hover:-translate-y-0.5
                      transition-all"
                    >

                      {/* COMPLETE */}
                      <button
                        onClick={() =>
                          toggleComplete(
                            task
                          )
                        }
                        className="shrink-0"
                      >
                        {task.status ===
                        "completed" ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        ) : (
                          <Clock3 className="w-6 h-6 text-pink-400" />
                        )}
                      </button>

                      {/* TASK INFO */}
                      <div className="flex-1 min-w-0">

                        <div className="flex items-center gap-2">

                          <h3
                            className={`
                              font-semibold
                              text-slate-800
                              truncate
                              ${
                                task.status ===
                                "completed"
                                  ? "line-through text-slate-400"
                                  : ""
                              }
                            `}
                          >
                            {task.title}
                          </h3>

                          {task.is_important && (
                            <Flag className="w-4 h-4 text-pink-500 shrink-0" />
                          )}

                        </div>

                        {task.description && (
                          <p className="text-sm text-slate-400 mt-1 truncate">
                            {task.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-2 mt-2">

                          {/* PRIORITY */}
                          <span
                            className={`
                              text-xs
                              px-2.5
                              py-1
                              rounded-lg
                              font-medium
                              ${
                                task.priority ===
                                "high"
                                  ? "bg-red-100 text-red-500"
                                  : task.priority ===
                                    "low"
                                  ? "bg-blue-100 text-blue-500"
                                  : "bg-pink-100 text-pink-500"
                              }
                            `}
                          >
                            {task.priority}
                          </span>

                          {/* STATUS */}
                          <span className="text-xs text-slate-400">
                            {task.status ===
                            "completed"
                              ? "Completed"
                              : task.status ===
                                "in_progress"
                              ? "In Progress"
                              : "To Do"}
                          </span>

                          {/* TIME */}
                          {task.due_time && (
                            <span
                              className="inline-flex items-center gap-1
                              text-xs
                              px-2.5
                              py-1
                              rounded-lg
                              bg-white/80
                              border border-white
                              text-slate-500"
                            >
                              <Clock3 className="w-3 h-3" />

                              {task.due_time.slice(
                                0,
                                5
                              )}
                            </span>
                          )}

                          {/* REMINDER */}
                          {task.due_time &&
                            task.reminder_minutes !==
                              null && (
                              <span
                                className="text-xs
                                px-2.5
                                py-1
                                rounded-lg
                                bg-pink-50
                                border border-pink-100
                                text-pink-500"
                              >
                                ⏰{" "}
                                {formatReminder(
                                  task.reminder_minutes
                                )}
                              </span>
                            )}

                        </div>

                      </div>

                      {/* DELETE */}
                      <button
                        onClick={() =>
                          deleteTask(
                            task.id
                          )
                        }
                        className="shrink-0
                        w-10
                        h-10
                        rounded-xl
                        bg-white/70
                        border border-white
                        text-slate-400
                        hover:bg-red-50
                        hover:text-red-500
                        transition
                        flex items-center
                        justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>
                  )
                )}

              </div>
            )}

        </section>

      </div>

      {/* ADD TASK MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center
          bg-pink-950/10
          backdrop-blur-md
          p-4"
          onClick={() =>
            setShowModal(false)
          }
        >

          <div
            onClick={(event) =>
              event.stopPropagation()
            }
            className="w-full max-w-lg
            rounded-[30px]
            border border-white/80
            bg-white/85
            backdrop-blur-2xl
            shadow-[0_30px_80px_rgba(190,24,93,0.2),inset_0_1px_0_rgba(255,255,255,1)]
            p-6
            max-h-[90vh]
            overflow-y-auto"
          >

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">

              <div>

                <h2 className="text-xl font-bold text-slate-800">
                  Add Task
                </h2>

                <p className="text-slate-400 text-sm mt-1">
                  {new Date(
                    `${selectedDate}T00:00:00`
                  ).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </p>

              </div>

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="w-10 h-10 rounded-xl
                bg-pink-50
                border border-white
                text-pink-400
                hover:bg-pink-100
                transition
                flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>

            </div>

            <div className="space-y-5">

              {/* TITLE */}
              <div>

                <label className="text-sm font-medium text-slate-600">
                  Task title
                </label>

                <input
                  value={title}
                  onChange={(event) =>
                    setTitle(
                      event.target.value
                    )
                  }
                  placeholder="What needs to be done?"
                  className="mt-2 w-full
                  rounded-xl
                  border border-pink-100
                  bg-white/80
                  px-4 py-3
                  text-slate-800
                  placeholder:text-slate-300
                  outline-none
                  shadow-[inset_2px_2px_6px_rgba(236,72,153,0.04)]
                  focus:border-pink-300
                  focus:ring-4
                  focus:ring-pink-100"
                  autoFocus
                />

              </div>

              {/* DESCRIPTION */}
              <div>

                <label className="text-sm font-medium text-slate-600">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  placeholder="Add some details..."
                  rows={3}
                  className="mt-2 w-full
                  rounded-xl
                  border border-pink-100
                  bg-white/80
                  px-4 py-3
                  text-slate-800
                  placeholder:text-slate-300
                  outline-none
                  resize-none
                  focus:border-pink-300
                  focus:ring-4
                  focus:ring-pink-100"
                />

              </div>

              {/* PRIORITY */}
              <div>

                <label className="text-sm font-medium text-slate-600">
                  Priority
                </label>

                <div className="grid grid-cols-3 gap-2 mt-2">

                  {(
                    [
                      "low",
                      "normal",
                      "high",
                    ] as const
                  ).map(
                    (item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() =>
                          setPriority(
                            item
                          )
                        }
                        className={`
                          py-2.5
                          rounded-xl
                          capitalize
                          border
                          transition
                          font-medium
                          ${
                            priority ===
                            item
                              ? "border-pink-300 bg-pink-100 text-pink-600 shadow-[inset_2px_2px_5px_rgba(255,255,255,0.9),0_5px_10px_rgba(236,72,153,0.08)]"
                              : "border-white bg-white/70 text-slate-400 hover:bg-pink-50"
                          }
                        `}
                      >
                        {item}
                      </button>
                    )
                  )}

                </div>

              </div>

              {/* TIME + REMINDER */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* TIME */}
                <div>

                  <label className="text-sm font-medium text-slate-600">
                    Due time
                  </label>

                  <div className="relative mt-2">

                    <Clock3
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400 pointer-events-none"
                    />

                    <input
                      type="time"
                      value={dueTime}
                      onChange={(event) =>
                        setDueTime(
                          event.target.value
                        )
                      }
                      className="w-full
                      rounded-xl
                      border border-pink-100
                      bg-white/80
                      pl-10
                      pr-4
                      py-3
                      text-slate-800
                      outline-none
                      focus:border-pink-300
                      focus:ring-4
                      focus:ring-pink-100"
                    />

                  </div>

                </div>

                {/* REMINDER */}
                <div>

                  <label className="text-sm font-medium text-slate-600">
                    Reminder
                  </label>

                  <select
                    value={
                      reminderMinutes ===
                      null
                        ? "none"
                        : String(
                            reminderMinutes
                          )
                    }
                    onChange={(event) => {
                      const value =
                        event.target.value;

                      setReminderMinutes(
                        value ===
                          "none"
                          ? null
                          : Number(
                              value
                            )
                      );
                    }}
                    disabled={!dueTime}
                    className="mt-2 w-full
                    rounded-xl
                    border border-pink-100
                    bg-white/80
                    px-4
                    py-3
                    text-slate-800
                    outline-none
                    focus:border-pink-300
                    focus:ring-4
                    focus:ring-pink-100
                    disabled:opacity-50
                    disabled:cursor-not-allowed"
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

                </div>

              </div>

              {/* IMPORTANT */}
              <label
                className="flex items-center gap-3
                p-3.5
                rounded-xl
                bg-pink-50/70
                border border-pink-100
                cursor-pointer"
              >

                <input
                  type="checkbox"
                  checked={important}
                  onChange={(event) =>
                    setImportant(
                      event.target.checked
                    )
                  }
                  className="accent-pink-500"
                />

                <span className="text-sm font-medium text-slate-600">
                  Mark as important
                </span>

              </label>

              {/* SCHEDULE INFO */}
              {dueTime && (
                <div
                  className="rounded-xl
                  border border-pink-100
                  bg-pink-50/60
                  p-3"
                >

                  <div className="flex items-start gap-2">

                    <Clock3 className="w-4 h-4 text-pink-500 mt-0.5 shrink-0" />

                    <div>

                      <p className="text-sm font-medium text-pink-600">
                        Scheduled reminder
                      </p>

                      <p className="text-xs text-slate-500 mt-0.5">
                        Task at{" "}
                        {dueTime}
                        {reminderMinutes !==
                          null &&
                          ` • reminder ${formatReminder(
                            reminderMinutes
                          )}`}
                      </p>

                    </div>

                  </div>

                </div>
              )}

            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 mt-7">

              <button
                type="button"
                onClick={() =>
                  setShowModal(false)
                }
                className="flex-1
                py-3
                rounded-xl
                bg-white/80
                border border-white
                text-slate-500
                hover:bg-slate-50
                transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={createTask}
                disabled={
                  !title.trim() ||
                  saving
                }
                className="flex-1
                py-3
                rounded-xl
                bg-gradient-to-br
                from-pink-400
                via-pink-500
                to-rose-500
                text-white
                font-semibold
                border border-white/70
                shadow-[inset_3px_3px_8px_rgba(255,255,255,0.5),inset_-4px_-4px_8px_rgba(190,24,93,0.2),0_8px_18px_rgba(236,72,153,0.2)]
                disabled:opacity-40
                disabled:cursor-not-allowed
                transition"
              >
                {saving
                  ? "Creating..."
                  : "Create Task"}
              </button>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}