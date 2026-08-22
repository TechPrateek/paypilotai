import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string | number;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  description?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  description,
}: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(change || description) && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            {change && (
              <span
                className={cn(
                  "flex items-center",
                  changeType === "positive" ? "text-emerald-500" : "",
                  changeType === "negative" ? "text-destructive" : "",
                )}
              >
                {changeType === "positive" && <ArrowUpRight className="h-3 w-3 mr-0.5" />}
                {changeType === "negative" && <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                {change}
              </span>
            )}
            {description && <span className="ml-1">{description}</span>}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
