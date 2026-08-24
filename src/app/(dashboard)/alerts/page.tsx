"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AlertTriangle, AlertCircle, Info, CheckCircle2, Clock, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

type Alert = {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  message: string;
  timeAgo: string;
  unread: boolean;
  transactionId?: string;
};

const initialAlerts: Alert[] = [
  {
    id: "al-1",
    type: "critical",
    title: "High-value fraud spike detected",
    message: "Multiple transactions over $5,000 flagged in the last 15 minutes from IP range 192.168.x.x.",
    timeAgo: "2 mins ago",
    unread: true,
  },
  {
    id: "al-2",
    type: "warning",
    title: "Velocity limit approaching",
    message: "Merchant 'TechStore Inc' is at 90% of their daily velocity limit.",
    timeAgo: "1 hour ago",
    unread: true,
  },
  {
    id: "al-3",
    type: "critical",
    title: "Known fraud ring matched",
    message: "Transaction tx_8932jfd matches signature of known 'Alpha' fraud ring.",
    timeAgo: "3 hours ago",
    unread: false,
    transactionId: "tx_8932jfd",
  },
  {
    id: "al-4",
    type: "info",
    title: "Model retraining completed",
    message: "Risk scoring model v2.4.1 has finished retraining and is now active.",
    timeAgo: "5 hours ago",
    unread: false,
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case "critical":
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    case "warning":
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    case "info":
      return <Info className="h-5 w-5 text-blue-500" />;
    default:
      return <Info className="h-5 w-5" />;
  }
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [activeTab, setActiveTab] = useState("all");

  const handleMarkAsRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, unread: false } : a))
    );
  };

  const handleMarkAllAsRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, unread: false })));
  };

  const handleResolve = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return alert.unread;
    if (activeTab === "critical") return alert.type === "critical";
    if (activeTab === "warning") return alert.type === "warning";
    return true;
  });

  return (
    <div className="flex-1 space-y-4 p-2 sm:p-4 md:p-8 pt-4 sm:pt-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Alert Center</h2>
          <p className="text-muted-foreground text-xs sm:text-sm">Monitor and respond to system alerts</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleMarkAllAsRead} className="h-8 text-xs sm:text-sm">
          <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
          Mark all as read
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="overflow-x-auto pb-1">
          <TabsList className="w-full sm:w-auto justify-start inline-flex">
            <TabsTrigger value="all">All Alerts</TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              {alerts.filter(a => a.unread).length > 0 && (
                <span className="ml-2 rounded-full bg-primary w-5 h-5 flex items-center justify-center text-[10px] text-primary-foreground">
                  {alerts.filter(a => a.unread).length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="critical">Critical</TabsTrigger>
            <TabsTrigger value="warning">Warning</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="space-y-4 mt-0">
          {filteredAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg border-dashed">
              <CheckCircle2 className="h-12 w-12 text-green-500 mb-4 opacity-50" />
              <h3 className="text-lg font-medium">All caught up!</h3>
              <p className="text-sm text-muted-foreground mt-1">No alerts match the selected filter.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAlerts.map((alert) => (
                <Card 
                  key={alert.id} 
                  className={cn(
                    "transition-all",
                    alert.unread ? "border-l-4 border-l-primary bg-muted/20" : ""
                  )}
                >
                  <CardHeader className="p-3 sm:p-4 pb-2 flex flex-row items-start space-y-0 gap-3 sm:gap-4">
                    <div className="mt-0.5 shrink-0">
                      {getIcon(alert.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <CardTitle className="text-sm sm:text-base font-semibold leading-tight">
                          {alert.title}
                        </CardTitle>
                        <span className="text-[11px] sm:text-xs text-muted-foreground flex items-center shrink-0">
                          <Clock className="mr-1 h-3 w-3" />
                          {alert.timeAgo}
                        </span>
                      </div>
                      <CardDescription className="mt-1 text-xs sm:text-sm text-foreground/80 leading-relaxed">
                        {alert.message}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 pt-1 sm:pt-2 flex flex-wrap items-center justify-end gap-2 sm:ml-9">
                    {alert.transactionId && (
                      <Button variant="secondary" size="sm" className="h-7 sm:h-8 text-[11px] sm:text-xs">
                        <ExternalLink className="mr-1.5 h-3 w-3" />
                        View {alert.transactionId}
                      </Button>
                    )}
                    {alert.unread && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 sm:h-8 text-[11px] sm:text-xs"
                        onClick={() => handleMarkAsRead(alert.id)}
                      >
                        Mark Read
                      </Button>
                    )}
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="h-7 sm:h-8 text-[11px] sm:text-xs"
                      onClick={() => handleResolve(alert.id)}
                    >
                      Resolve
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
