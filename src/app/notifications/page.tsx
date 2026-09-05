"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  FolderKanban,
  Loader2,
  Star,
  Trash2,
  AlertCircle,
  Inbox,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type NotificationType =
  | "general"
  | "deadline"
  | "overdue"
  | "important"
  | "project";

type Notification = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  task_id: string | null;
  project_id: string | null;
  created_at: string;
  reminder_key?: string | null;
};

type FilterType = "all" | "unread" | "deadline" | "important" | "project";

export default function NotificationsPage() {
  const router = useRouter();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    let cancelled = false;

    const loadNotifications = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (cancelled) {
        return;
      }

      if (userError || !user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        });

      if (cancelled) {
        return;
      }

      if (error) {
        console.error("Error loading notifications:", error);
        setNotifications([]);
      } else {
        setNotifications((data ?? []) as Notification[]);
      }

      setLoading(false);
    };

    void loadNotifications();

    const channel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
        },
        async () => {
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (!user || cancelled) {
            return;
          }

          const { data, error } = await supabase
            .from("notifications")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", {
              ascending: false,
            });

          if (cancelled) {
            return;
          }

          if (error) {
            console.error(
              "Error refreshing notifications:",
              error
            );
            return;
          }

          setNotifications((data ?? []) as Notification[]);
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      void supabase.removeChannel(channel);
    };
  }, [router]);

  const unreadCount = useMemo(() => {
    return notifications.filter(
      (notification) => !notification.is_read
    ).length;
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    switch (filter) {
      case "unread":
        return notifications.filter(
          (notification) => !notification.is_read
        );

      case "deadline":
        return notifications.filter(
          (notification) =>
            notification.type === "deadline" ||
            notification.type === "overdue"
        );

      case "important":
        return notifications.filter(
          (notification) => notification.type === "important"
        );

      case "project":
        return notifications.filter(
          (notification) => notification.type === "project"
        );

      default:
        return notifications;
    }
  }, [notifications, filter]);

  const markAsRead = async (notificationId: string) => {
    setActionLoading(notificationId);

    const { error } = await supabase
      .from("notifications")
      .update({
        is_read: true,
      })
      .eq("id", notificationId);

    if (error) {
      console.error(
        "Error marking notification as read:",
        error
      );
    } else {
      setNotifications((current) =>
        current.map((notification) =>
          notification.id === notificationId
            ? {
                ...notification,
                is_read: true,
              }
            : notification
        )
      );
    }

    setActionLoading(null);
  };

  const markAllAsRead = async () => {
    if (unreadCount === 0) {
      return;
    }

    setActionLoading("all");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error(
        "Unable to get current user:",
        userError
      );
      setActionLoading(null);
      return;
    }

    const { error } = await supabase
      .from("notifications")
      .update({
        is_read: true,
      })
      .eq("user_id", user.id)
      .eq("is_read", false);

    if (error) {
      console.error(
        "Error marking all notifications as read:",
        error
      );
    } else {
      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      );
    }

    setActionLoading(null);
  };

  const deleteNotification = async (
    notificationId: string
  ) => {
    setActionLoading(notificationId);

    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId);

    if (error) {
      console.error(
        "Error deleting notification:",
        error
      );
    } else {
      setNotifications((current) =>
        current.filter(
          (notification) =>
            notification.id !== notificationId
        )
      );
    }

    setActionLoading(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    const difference =
      now.getTime() - date.getTime();

    const minutes = Math.floor(
      difference / (1000 * 60)
    );

    if (minutes < 1) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours}h ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
      return `${days}d ago`;
    }

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getNotificationIcon = (
    type: NotificationType
  ) => {
    switch (type) {
      case "deadline":
        return (
          <Clock className="h-5 w-5" />
        );

      case "overdue":
        return (
          <AlertCircle className="h-5 w-5" />
        );

      case "important":
        return (
          <Star className="h-5 w-5" />
        );

      case "project":
        return (
          <FolderKanban className="h-5 w-5" />
        );

      default:
        return (
          <Bell className="h-5 w-5" />
        );
    }
  };

  const getNotificationIconBackground = (
    type: NotificationType
  ) => {
    switch (type) {
      case "deadline":
        return "bg-orange-100 text-orange-600";

      case "overdue":
        return "bg-red-100 text-red-600";

      case "important":
        return "bg-yellow-100 text-yellow-600";

      case "project":
        return "bg-purple-100 text-purple-600";

      default:
        return "bg-pink-100 text-pink-600";
    }
  };

  const getNotificationTypeLabel = (
    type: NotificationType
  ) => {
    switch (type) {
      case "deadline":
        return "Deadline";

      case "overdue":
        return "Overdue";

      case "important":
        return "Important";

      case "project":
        return "Project";

      default:
        return "General";
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fff0f5] px-4 py-8">
        <div className="mx-auto flex min-h-[80vh] max-w-5xl items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/70 bg-white/60 shadow-lg backdrop-blur-xl">
              <Loader2 className="h-6 w-6 animate-spin text-pink-500" />
            </div>

            <p className="text-sm font-medium text-pink-900/60">
              Loading notifications...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#fff0f5] px-4 py-6 text-pink-950 sm:px-6 lg:px-8">
      {/* Decorative background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-pink-300/30 blur-3xl" />
        <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-fuchsia-300/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-orange-200/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <header className="mb-6 rounded-[28px] border border-white/70 bg-white/55 p-5 shadow-[0_20px_60px_rgba(236,72,153,0.10)] backdrop-blur-2xl sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/80 bg-gradient-to-br from-pink-400/80 to-fuchsia-400/70 text-white shadow-lg shadow-pink-300/30">
                <Bell className="h-6 w-6" />

                {unreadCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[10px] font-bold text-white shadow-md">
                    {unreadCount > 99
                      ? "99+"
                      : unreadCount}
                  </span>
                )}
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-pink-950 sm:text-3xl">
                  Notifications
                </h1>

                <p className="mt-1 text-sm text-pink-900/55">
                  Stay updated with your tasks and projects.
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                disabled={actionLoading === "all"}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-pink-200/70 bg-white/70 px-4 py-2.5 text-sm font-semibold text-pink-700 shadow-sm transition hover:bg-white hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {actionLoading === "all" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCheck className="h-4 w-4" />
                )}

                Mark all as read
              </button>
            )}
          </div>
        </header>

        {/* Filters */}
        <div className="mb-5 overflow-x-auto">
          <div className="flex min-w-max gap-2 rounded-2xl border border-white/70 bg-white/45 p-2 shadow-sm backdrop-blur-xl">
            {[
              {
                id: "all" as const,
                label: "All",
                count: notifications.length,
              },
              {
                id: "unread" as const,
                label: "Unread",
                count: unreadCount,
              },
              {
                id: "deadline" as const,
                label: "Deadlines",
                count: notifications.filter(
                  (notification) =>
                    notification.type === "deadline" ||
                    notification.type === "overdue"
                ).length,
              },
              {
                id: "important" as const,
                label: "Important",
                count: notifications.filter(
                  (notification) =>
                    notification.type === "important"
                ).length,
              },
              {
                id: "project" as const,
                label: "Projects",
                count: notifications.filter(
                  (notification) =>
                    notification.type === "project"
                ).length,
              },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  filter === item.id
                    ? "bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white shadow-md shadow-pink-300/30"
                    : "text-pink-900/60 hover:bg-white/70 hover:text-pink-900"
                }`}
              >
                {item.label}

                <span
                  className={`ml-1.5 ${
                    filter === item.id
                      ? "text-white/80"
                      : "text-pink-900/35"
                  }`}
                >
                  {item.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Notification list */}
        {filteredNotifications.length === 0 ? (
          <section className="rounded-[28px] border border-white/70 bg-white/50 px-6 py-16 text-center shadow-[0_20px_60px_rgba(236,72,153,0.08)] backdrop-blur-2xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-white/80 bg-white/70 text-pink-300 shadow-lg">
              <Inbox className="h-9 w-9" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-pink-950">
              {filter === "all"
                ? "No notifications yet"
                : "Nothing here"}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-pink-900/50">
              {filter === "all"
                ? "Your task and project updates will appear here."
                : "There are no notifications matching this filter."}
            </p>
          </section>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map(
              (notification) => {
                const isActionLoading =
                  actionLoading === notification.id;

                return (
                  <article
                    key={notification.id}
                    className={`group relative overflow-hidden rounded-[24px] border p-4 shadow-[0_15px_45px_rgba(236,72,153,0.07)] backdrop-blur-2xl transition sm:p-5 ${
                      notification.is_read
                        ? "border-white/70 bg-white/45"
                        : "border-pink-200/70 bg-white/65 shadow-pink-200/20"
                    }`}
                  >
                    {!notification.is_read && (
                      <div className="absolute bottom-0 left-0 top-0 w-1 bg-gradient-to-b from-pink-400 to-fuchsia-400" />
                    )}

                    <div className="flex gap-4">
                      {/* Icon */}
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${getNotificationIconBackground(
                          notification.type
                        )}`}
                      >
                        {getNotificationIcon(
                          notification.type
                        )}
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h2
                                className={`text-sm font-bold ${
                                  notification.is_read
                                    ? "text-pink-950/75"
                                    : "text-pink-950"
                                }`}
                              >
                                {notification.title}
                              </h2>

                              {!notification.is_read && (
                                <span className="rounded-full bg-pink-500 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                                  New
                                </span>
                              )}
                            </div>

                            <p className="mt-1.5 text-sm leading-6 text-pink-900/60">
                              {notification.message}
                            </p>
                          </div>

                          <span className="shrink-0 text-xs font-medium text-pink-900/35">
                            {formatDate(
                              notification.created_at
                            )}
                          </span>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-white/80 bg-white/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-pink-800/60">
                            {getNotificationTypeLabel(
                              notification.type
                            )}
                          </span>

                          <div className="ml-auto flex items-center gap-1">
                            {!notification.is_read && (
                              <button
                                type="button"
                                onClick={() =>
                                  void markAsRead(
                                    notification.id
                                  )
                                }
                                disabled={
                                  isActionLoading
                                }
                                title="Mark as read"
                                className="flex h-9 w-9 items-center justify-center rounded-xl text-pink-700/60 transition hover:bg-pink-100 hover:text-pink-700 disabled:opacity-50"
                              >
                                {isActionLoading ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Check className="h-4 w-4" />
                                )}
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() =>
                                void deleteNotification(
                                  notification.id
                                )
                              }
                              disabled={
                                isActionLoading
                              }
                              title="Delete notification"
                              className="flex h-9 w-9 items-center justify-center rounded-xl text-pink-900/35 transition hover:bg-red-100 hover:text-red-600 disabled:opacity-50"
                            >
                              {isActionLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        )}
      </div>
    </main>
  );
}