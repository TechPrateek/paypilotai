"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, AlertCircle, AlertTriangle, Info, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Notification = {
  id: string;
  title: string;
  message: string;
  type: "critical" | "warning" | "info";
  time: string;
  read: boolean;
};

const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "High-value fraud spike",
    message: "Multiple transactions over ₹75,000 flagged.",
    type: "critical",
    time: "2m ago",
    read: false,
  },
  {
    id: "2",
    title: "Velocity limit",
    message: "Customer Aarav Patel exceeded 5 tx/5min.",
    type: "warning",
    time: "1h ago",
    read: false,
  },
  {
    id: "3",
    title: "Model updated",
    message: "PayPilot Risk Model v1.0 active in production.",
    type: "info",
    time: "5h ago",
    read: true,
  },
];

export function NotificationCenter() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />;
      default:
        return <Info className="h-4 w-4 mt-0.5 shrink-0" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        className="relative h-9 w-9"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center bg-destructive text-[10px]">
            {unreadCount}
          </Badge>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl bg-card border shadow-lg z-50 animate-in fade-in-0 zoom-in-95">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <span className="font-semibold text-sm">Notifications</span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
              >
                <Check className="h-3 w-3" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[300px] overflow-y-auto divide-y">
            {notifications.length === 0 ? (
              <div className="py-6 text-center text-xs text-muted-foreground">
                No notifications
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={cn(
                    "flex items-start gap-2.5 p-3 cursor-pointer hover:bg-accent/50 transition-colors text-xs",
                    !n.read && "bg-primary/5"
                  )}
                >
                  {getIcon(n.type)}
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className={cn("font-medium truncate", !n.read && "font-semibold text-foreground")}>
                        {n.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground ml-2 shrink-0">
                        {n.time}
                      </span>
                    </div>
                    <p className="text-muted-foreground line-clamp-2">{n.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2.5 border-t text-center">
            <Link
              href="/alerts"
              onClick={() => setOpen(false)}
              className="text-xs font-semibold text-primary hover:underline block"
            >
              View all alerts →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
