"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DateFilterProps {
  onChange?: (from: Date, to: Date) => void;
  className?: string;
}

export function DateFilter({ onChange, className }: DateFilterProps) {
  const [active, setActive] = useState("30d");

  const options = [
    { label: "Today", value: "1d", days: 1 },
    { label: "7 Days", value: "7d", days: 7 },
    { label: "30 Days", value: "30d", days: 30 },
    { label: "90 Days", value: "90d", days: 90 },
  ];

  const handleSelect = (option: typeof options[0]) => {
    setActive(option.value);
    
    if (onChange) {
      const to = new Date();
      const from = new Date();
      from.setDate(from.getDate() - option.days);
      onChange(from, to);
    }
  };

  return (
    <div className={cn("inline-flex items-center rounded-lg bg-muted p-1", className)}>
      {options.map((option) => (
        <Button
          key={option.value}
          variant="ghost"
          size="sm"
          onClick={() => handleSelect(option)}
          className={cn(
            "h-7 px-3 text-xs font-medium rounded-md transition-all",
            active === option.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
