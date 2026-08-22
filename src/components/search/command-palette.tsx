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
import { CreditCard, Users, ShieldAlert, ArrowRight, Activity } from "lucide-react";

interface CommandPaletteProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CommandPalette({ open: controlledOpen, onOpenChange: controlledOnOpenChange }: CommandPaletteProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{
    transactions?: Array<{ id: string; externalId: string; amount: number; currency: string; status: string }>;
    customers?: Array<{ id: string; name: string; email: string }>;
    cases?: Array<{ id: string; priority: string; status: string }>;
  }>({});
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

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults({});
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error("Search error:", err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const runCommand = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Search transactions, customers, cases, or type a page..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No results found for "{query}".</CommandEmpty>

        {results.transactions && results.transactions.length > 0 && (
          <CommandGroup heading="Transactions">
            {results.transactions.map((tx) => (
              <CommandItem key={tx.id} onSelect={() => runCommand(`/transactions/${tx.id}`)}>
                <CreditCard className="mr-2 h-4 w-4 text-blue-500" />
                <div className="flex items-center justify-between w-full">
                  <span className="font-mono text-xs">{tx.externalId}</span>
                  <span className="font-semibold text-xs">
                    {tx.currency} {tx.amount.toLocaleString()}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {results.customers && results.customers.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Customers">
              {results.customers.map((c) => (
                <CommandItem key={c.id} onSelect={() => runCommand(`/customers/${c.id}`)}>
                  <Users className="mr-2 h-4 w-4 text-emerald-500" />
                  <div className="flex flex-col">
                    <span className="text-xs font-medium">{c.name}</span>
                    <span className="text-[10px] text-muted-foreground">{c.email}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {results.cases && results.cases.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Risk Cases">
              {results.cases.map((c) => (
                <CommandItem key={c.id} onSelect={() => runCommand(`/risk-cases/${c.id}`)}>
                  <ShieldAlert className="mr-2 h-4 w-4 text-amber-500" />
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-mono">Case #{c.id.slice(-6)}</span>
                    <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">
                      {c.priority} • {c.status}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        <CommandSeparator />
        <CommandGroup heading="Quick Navigation">
          <CommandItem onSelect={() => runCommand("/overview")}>
            <Activity className="mr-2 h-4 w-4 text-primary" />
            <span>Overview Dashboard</span>
            <ArrowRight className="ml-auto h-3 w-3 text-muted-foreground" />
          </CommandItem>
          <CommandItem onSelect={() => runCommand("/transactions")}>
            <CreditCard className="mr-2 h-4 w-4 text-primary" />
            <span>Transactions List</span>
            <ArrowRight className="ml-auto h-3 w-3 text-muted-foreground" />
          </CommandItem>
          <CommandItem onSelect={() => runCommand("/simulator")}>
            <Activity className="mr-2 h-4 w-4 text-primary" />
            <span>Fraud Simulator</span>
            <ArrowRight className="ml-auto h-3 w-3 text-muted-foreground" />
          </CommandItem>
          <CommandItem onSelect={() => runCommand("/risk-cases")}>
            <ShieldAlert className="mr-2 h-4 w-4 text-primary" />
            <span>Risk Cases Queue</span>
            <ArrowRight className="ml-auto h-3 w-3 text-muted-foreground" />
          </CommandItem>
          <CommandItem onSelect={() => runCommand("/analytics")}>
            <Activity className="mr-2 h-4 w-4 text-primary" />
            <span>Risk Analytics</span>
            <ArrowRight className="ml-auto h-3 w-3 text-muted-foreground" />
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
