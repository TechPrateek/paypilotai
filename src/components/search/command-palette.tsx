"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Share2,
  Search,
  Network,
  CreditCard,
  Activity,
  ArrowRight,
  ShieldAlert,
  Settings,
  LayoutDashboard,
} from "lucide-react";

interface CommandPaletteProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CommandPalette({ open: controlledOpen, onOpenChange: controlledOnOpenChange }: CommandPaletteProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (controlledOnOpenChange || (() => {})) : setInternalOpen;

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, setOpen]);

  const runCommand = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Search ring, customer, device, IP, or type a page..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No results found for "{query}".</CommandEmpty>

        <CommandGroup heading="Abuse Rings (Detected Syndicates)">
          <CommandItem onSelect={() => runCommand("/investigations/RING-0042")}>
            <Share2 className="mr-2 h-4 w-4 text-rose-500" />
            <div className="flex items-center justify-between w-full">
              <span className="font-mono font-bold text-xs">RING-0042</span>
              <span className="text-xs text-rose-500 font-bold">CRITICAL (91/100) • ₹8.4L</span>
            </div>
          </CommandItem>
          <CommandItem onSelect={() => runCommand("/investigations/RING-7092")}>
            <Share2 className="mr-2 h-4 w-4 text-rose-500" />
            <div className="flex items-center justify-between w-full">
              <span className="font-mono font-bold text-xs">RING-7092</span>
              <span className="text-xs text-rose-500 font-bold">CRITICAL (94/100) • $145k</span>
            </div>
          </CommandItem>
          <CommandItem onSelect={() => runCommand("/investigations/RING-4108")}>
            <Share2 className="mr-2 h-4 w-4 text-amber-500" />
            <div className="flex items-center justify-between w-full">
              <span className="font-mono font-bold text-xs">RING-4108</span>
              <span className="text-xs text-amber-500 font-bold">HIGH (88/100) • $42.5k</span>
            </div>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />
        <CommandGroup heading="Sentinel Navigation">
          <CommandItem onSelect={() => runCommand("/overview")}>
            <LayoutDashboard className="mr-2 h-4 w-4 text-primary" />
            <span>Overview Posture</span>
            <ArrowRight className="ml-auto h-3 w-3 text-muted-foreground" />
          </CommandItem>
          <CommandItem onSelect={() => runCommand("/rings")}>
            <Share2 className="mr-2 h-4 w-4 text-primary" />
            <span>Abuse Rings Ledger</span>
            <ArrowRight className="ml-auto h-3 w-3 text-muted-foreground" />
          </CommandItem>
          <CommandItem onSelect={() => runCommand("/graph")}>
            <Network className="mr-2 h-4 w-4 text-primary" />
            <span>Graph Explorer</span>
            <ArrowRight className="ml-auto h-3 w-3 text-muted-foreground" />
          </CommandItem>
          <CommandItem onSelect={() => runCommand("/transactions")}>
            <CreditCard className="mr-2 h-4 w-4 text-primary" />
            <span>Transactions Ledger</span>
            <ArrowRight className="ml-auto h-3 w-3 text-muted-foreground" />
          </CommandItem>
          <CommandItem onSelect={() => runCommand("/evaluation")}>
            <Activity className="mr-2 h-4 w-4 text-primary" />
            <span>Held-Out Model Evaluation</span>
            <ArrowRight className="ml-auto h-3 w-3 text-muted-foreground" />
          </CommandItem>
          <CommandItem onSelect={() => runCommand("/settings")}>
            <Settings className="mr-2 h-4 w-4 text-primary" />
            <span>Settings & Parameters</span>
            <ArrowRight className="ml-auto h-3 w-3 text-muted-foreground" />
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
