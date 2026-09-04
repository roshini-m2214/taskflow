"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bell,
  BellRing,
  Check,
  CheckCheck,
  Trash2,
  Clock3,
  AlertTriangle,
  Star,
  FolderKanban,
  Info,
  Loader2,
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
};

export default function NotificationsPage() {
  const router = useRouter();

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] =
    useState(false);

  useEffect(() => {
    loadNotifications();

    const channel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
        },
        () => {
          loadNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadNotifications() {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

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

    if (error) {
      console.error(
        "Error loading notifications:",
        error
      );
    } else {
      setNotifications(
        (data || []) as Notification[]
      );
    }

    setLoading(false);
  }

  async function markAsRead(
    notificationId: string
  ) {
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
      return;
    }

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

  async function markAllAsRead() {
    if (unreadCount === 0) return;

    setActionLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
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
      setActionLoading(false);
      return;
    }

    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        is_read: true,
      }))
    );

    setActionLoading(false);
  }

  async function deleteNotification(
    notificationId: string
  ) {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId);

    if (error) {
      console.error(
        "Error deleting notification:",
        error
      );
      return;
    }

    setNotifications((current) =>
      current.filter(
        (notification) =>
          notification.id !== notificationId
      )
    );
  }

  async function clearAllNotifications() {
    if (notifications.length === 0) return;

    const confirmed = window.confirm(
      "Delete all notifications?"
    );

    if (!confirmed) return;

    setActionLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("user_id", user.id);

    if (error) {
      console.error(
        "Error clearing notifications:",
        error
      );
      setActionLoading(false);
      return;
    }

    setNotifications([]);
    setActionLoading(false);
  }

  function getNotificationIcon(
    type: NotificationType
  ) {
    switch (type) {
      case "deadline":
        return (
          <Clock3 className="w-5 h-5 text-pink-500" />
        );

      case "overdue":
        return (
          <AlertTriangle className="w-5 h-5 text-rose-500" />
        );

      case "important":
        return (
          <Star className="w-5 h-5 text-pink-500 fill-pink-400" />
        );

      case "project":
        return (
          <FolderKanban className="w-5 h-5 text-fuchsia-500" />
        );

      default:
        return (
          <Info className="w-5 h-5 text-pink-500" />
        );
    }
  }

  function getNotificationBackground(
    type: NotificationType
  ) {
    switch (type) {
      case "deadline":
        return "bg-pink-50";

      case "overdue":
        return "bg-rose-50";

      case "important":
        return "bg-pink-50";

      case "project":
        return "bg-fuchsia-50";

      default:
        return "bg-slate-50";
    }
  }

  function formatTime(
    createdAt: string
  ) {
    const date = new Date(createdAt);
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

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-300 via-pink-400 to-rose-500 flex items-center justify-center mx-auto mb-4 shadow-[inset_4px_4px_10px_rgba(255,255,255,0.65),inset_-5px_-5px_12px_rgba(190,24,93,0.25),0_15px_30px_rgba(236,72,153,0.25)]">
            <Bell className="w-7 h-7 text-white" />
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading notifications...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-white text-slate-800">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-32 w-[450px] h-[450px] rounded-full bg-pink-200/50 blur-3xl" />

        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-rose-200/45 blur-3xl" />

        <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] rounded-full bg-fuchsia-100/50 blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  router.push("/dashboard")
                }
                className="w-11 h-11 rounded-2xl border border-white/80 bg-white/70 backdrop-blur-xl flex items-center justify-center text-slate-500 hover:text-pink-500 hover:bg-white transition shadow-[0_10px_25px_rgba(190,24,93,0.08)]"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div>
                <p className="text-sm font-semibold text-pink-400">
                  TaskFlow
                </p>

                <h1 className="text-3xl md:text-4xl font-bold">
                  Notifications
                </h1>

                <p className="text-slate-400 mt-1">
                  Stay updated with your tasks.
                </p>
              </div>
            </div>

            {notifications.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={markAllAsRead}
                  disabled={
                    unreadCount === 0 ||
                    actionLoading
                  }
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/70 border border-white/80 text-sm font-semibold text-slate-500 hover:text-pink-500 hover:bg-white transition disabled:opacity-40"
                >
                  <CheckCheck className="w-4 h-4" />
                  Mark all read
                </button>

                <button
                  onClick={clearAllNotifications}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/70 border border-white/80 text-sm font-semibold text-slate-500 hover:text-red-500 hover:bg-white transition disabled:opacity-40"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="rounded-[26px] border border-white/80 bg-white/60 backdrop-blur-2xl p-5 shadow-[0_20px_50px_rgba(190,24,93,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">
                    Total
                  </p>

                  <p className="text-3xl font-bold mt-1">
                    {notifications.length}
                  </p>
                </div>

                <div className="w-11 h-11 rounded-2xl bg-pink-100 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-pink-500" />
                </div>
              </div>
            </div>

            <div className="rounded-[26px] border border-white/80 bg-white/60 backdrop-blur-2xl p-5 shadow-[0_20px_50px_rgba(190,24,93,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">
                    Unread
                  </p>

                  <p className="text-3xl font-bold mt-1 text-pink-500">
                    {unreadCount}
                  </p>
                </div>

                <div className="w-11 h-11 rounded-2xl bg-pink-100 flex items-center justify-center">
                  <BellRing className="w-5 h-5 text-pink-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="rounded-[32px] border border-white/80 bg-white/60 backdrop-blur-2xl p-4 md:p-6 shadow-[0_25px_70px_rgba(190,24,93,0.1),inset_0_1px_0_rgba(255,255,255,0.9)]">
            {notifications.length === 0 ? (
              <div className="py-20 text-center">
                <div className="w-20 h-20 rounded-[28px] bg-pink-100 flex items-center justify-center mx-auto mb-5">
                  <Bell className="w-9 h-9 text-pink-400" />
                </div>

                <h2 className="text-xl font-bold">
                  You&apos;re all caught up
                </h2>

                <p className="text-slate-400 mt-2 max-w-md mx-auto">
                  You don&apos;t have any notifications
                  yet. New task updates and reminders
                  will appear here.
                </p>

                <button
                  onClick={() =>
                    router.push("/dashboard")
                  }
                  className="mt-6 px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-400 to-rose-500 text-white font-semibold shadow-[inset_2px_2px_6px_rgba(255,255,255,0.4),0_12px_25px_rgba(236,72,153,0.2)]"
                >
                  Go to Dashboard
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map(
                  (notification) => (
                    <div
                      key={notification.id}
                      className={`relative rounded-2xl border p-4 transition ${
                        notification.is_read
                          ? "border-white/80 bg-white/50"
                          : "border-pink-100 bg-white/85 shadow-[0_10px_30px_rgba(236,72,153,0.08)]"
                      }`}
                    >
                      {!notification.is_read && (
                        <div className="absolute left-0 top-5 bottom-5 w-1 rounded-r-full bg-gradient-to-b from-pink-400 to-rose-500" />
                      )}

                      <div className="flex items-start gap-4">
                        <div
                          className={`w-11 h-11 shrink-0 rounded-2xl flex items-center justify-center ${getNotificationBackground(
                            notification.type
                          )}`}
                        >
                          {getNotificationIcon(
                            notification.type
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                            <h3
                              className={`font-semibold ${
                                notification.is_read
                                  ? "text-slate-600"
                                  : "text-slate-800"
                              }`}
                            >
                              {notification.title}
                            </h3>

                            <span className="text-xs text-slate-400 shrink-0">
                              {formatTime(
                                notification.created_at
                              )}
                            </span>
                          </div>

                          <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                            {notification.message}
                          </p>

                          <div className="flex items-center gap-2 mt-3">
                            {!notification.is_read && (
                              <button
                                onClick={() =>
                                  markAsRead(
                                    notification.id
                                  )
                                }
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-50 text-pink-500 text-xs font-semibold hover:bg-pink-100 transition"
                              >
                                <Check className="w-3.5 h-3.5" />
                                Mark as read
                              </button>
                            )}

                            {notification.is_read && (
                              <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                                <CheckCheck className="w-3.5 h-3.5" />
                                Read
                              </span>
                            )}

                            <button
                              onClick={() =>
                                deleteNotification(
                                  notification.id
                                )
                              }
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-400 text-xs font-semibold hover:text-red-500 hover:bg-red-50 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}