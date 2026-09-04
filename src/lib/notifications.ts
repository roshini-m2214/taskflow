import { supabase } from "@/lib/supabase";

export type NotificationType =
  | "general"
  | "deadline"
  | "overdue"
  | "important"
  | "project";

type CreateNotificationInput = {
  userId: string;
  title: string;
  message: string;
  type?: NotificationType;
  taskId?: string | null;
  projectId?: string | null;
};

export async function createNotification({
  userId,
  title,
  message,
  type = "general",
  taskId = null,
  projectId = null,
}: CreateNotificationInput) {
  const { data, error } = await supabase
    .from("notifications")
    .insert({
      user_id: userId,
      title,
      message,
      type,
      task_id: taskId,
      project_id: projectId,
      is_read: false,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating notification:", error);

    return {
      success: false,
      data: null,
      error,
    };
  }

  return {
    success: true,
    data,
    error: null,
  };
}

// Task completed notification
export async function notifyTaskCompleted(
  userId: string,
  taskId: string,
  taskTitle: string
) {
  return createNotification({
    userId,
    taskId,
    title: "Task completed 🎉",
    message: `"${taskTitle}" has been completed.`,
    type: "general",
  });
}

// Important task notification
export async function notifyTaskImportant(
  userId: string,
  taskId: string,
  taskTitle: string
) {
  return createNotification({
    userId,
    taskId,
    title: "Important task ⭐",
    message: `"${taskTitle}" was marked as important.`,
    type: "important",
  });
}

// Project assignment notification
export async function notifyTaskAssignedToProject(
  userId: string,
  taskId: string,
  taskTitle: string,
  projectId: string,
  projectName: string
) {
  return createNotification({
    userId,
    taskId,
    projectId,
    title: "Task added to project 📁",
    message: `"${taskTitle}" was added to ${projectName}.`,
    type: "project",
  });
}

// Upcoming deadline notification
export async function notifyUpcomingDeadline(
  userId: string,
  taskId: string,
  taskTitle: string,
  dueDate: string
) {
  return createNotification({
    userId,
    taskId,
    title: "Deadline approaching ⏰",
    message: `"${taskTitle}" is due on ${dueDate}.`,
    type: "deadline",
  });
}

// Overdue task notification
export async function notifyTaskOverdue(
  userId: string,
  taskId: string,
  taskTitle: string
) {
  return createNotification({
    userId,
    taskId,
    title: "Task overdue 🔴",
    message: `"${taskTitle}" is overdue.`,
    type: "overdue",
  });
}
export async function checkTaskDeadlineNotifications(
  userId: string
) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayString = today.toISOString().split("T")[0];
  const tomorrowString = tomorrow.toISOString().split("T")[0];

  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select("id, title, due_date, status")
    .eq("user_id", userId)
    .not("due_date", "is", null)
    .neq("status", "completed");

  if (tasksError) {
    console.error(
      "DEADLINE CHECK TASK ERROR:",
      tasksError
    );

    return;
  }

  if (!tasks || tasks.length === 0) {
    return;
  }

  const taskIds = tasks.map((task) => task.id);

  const { data: existingNotifications, error: notificationError } =
    await supabase
      .from("notifications")
      .select("task_id, type")
      .eq("user_id", userId)
      .in("task_id", taskIds)
      .in("type", ["deadline", "overdue"]);

  if (notificationError) {
    console.error(
      "DEADLINE CHECK NOTIFICATION ERROR:",
      notificationError
    );

    return;
  }

  const existingSet = new Set(
    (existingNotifications ?? []).map(
      (notification) =>
        `${notification.task_id}:${notification.type}`
    )
  );

  for (const task of tasks) {
    if (!task.due_date) continue;

    const dueDate = task.due_date;

    // ==============================
    // OVERDUE
    // ==============================

    if (dueDate < todayString) {
      const key = `${task.id}:overdue`;

      if (!existingSet.has(key)) {
        const result = await notifyTaskOverdue(
          userId,
          task.id,
          task.title
        );

        if (result.success) {
          existingSet.add(key);
        }
      }

      continue;
    }

    // ==============================
    // DUE TODAY
    // ==============================

    if (dueDate === todayString) {
      const key = `${task.id}:deadline`;

      if (!existingSet.has(key)) {
        const result = await notifyUpcomingDeadline(
          userId,
          task.id,
          task.title,
          "today"
        );

        if (result.success) {
          existingSet.add(key);
        }
      }

      continue;
    }

    // ==============================
    // DUE TOMORROW
    // ==============================

    if (dueDate === tomorrowString) {
      const key = `${task.id}:deadline`;

      if (!existingSet.has(key)) {
        const result = await notifyUpcomingDeadline(
          userId,
          task.id,
          task.title,
          "tomorrow"
        );

        if (result.success) {
          existingSet.add(key);
        }
      }
    }
  }
}