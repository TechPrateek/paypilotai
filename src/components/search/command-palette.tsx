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
  Smartphone,
  Globe,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CommandPaletteProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CommandPalette({ open: controlledOpen, onOpenChange: controlledOnOpenChange }: CommandPaletteProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{
    rings?: any[];
    transactions?: any[];
    customers?: any[];
    devices?: any[];
    ips?: any[];
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
    if (!query.trim()) {
      setResults({});
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error("Search error:", err);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const runCommand = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  const hasDynamicResults =
    (results.rings && results.rings.length > 0) ||
    (results.transactions && results.transactions.length > 0) ||
    (results.customers && results.customers.length > 0) ||
    (results.devices && results.devices.length > 0) ||
    (results.ips && results.ips.length > 0);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Search ring, transaction, customer, device, IP..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList className="max-h-[420px] overflow-y-auto">
        <CommandEmpty>No matching entities found for "{query}".</CommandEmpty>

        {/* Dynamic Rings */}
        {results.rings && results.rings.length > 0 && (
          <CommandGroup heading="Abuse Rings (Coordinated Syndicates)">
            {results.rings.map((ring) => (
              <CommandItem
                key={ring.id}
                onSelect={() => runCommand(`/investigations/${ring.id}`)}
                className="cursor-pointer py-2.5"
              >
                <Share2 className="mr-2.5 h-4 w-4 text-rose-500 shrink-0" />
                <div className="flex items-center justify-between w-full">
                  <div className="flex flex-col">
                    <span className="font-mono font-bold text-xs text-foreground">{ring.id}</span>
                    <span className="text-[11px] text-muted-foreground">{ring.name}</span>
                  </div>
                  <Badge variant="destructive" className="font-mono text-[9px]">
                    Risk {ring.risk_score}/100
                  </Badge>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Dynamic Transactions */}
        {results.transactions && results.transactions.length > 0 && (
          <CommandGroup heading="Transactions">
            {results.transactions.map((tx) => (
              <CommandItem
                key={tx.id}
                onSelect={() => runCommand(tx.cluster_id ? `/investigations/${tx.cluster_id}` : `/transactions`)}
                className="cursor-pointer py-2"
              >
                <CreditCard className="mr-2.5 h-4 w-4 text-blue-500 shrink-0" />
                <div className="flex items-center justify-between w-full text-xs font-mono">
                  <span>{tx.id} • {tx.customer_id}</span>
                  <span className="font-bold text-foreground">₹{tx.amount}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Dynamic Devices */}
        {results.devices && results.devices.length > 0 && (
          <CommandGroup heading="Hardware Devices">
            {results.devices.map((d) => (
              <CommandItem
                key={d.id}
                onSelect={() => runCommand(`/graph`)}
                className="cursor-pointer py-2"
              >
                <Smartphone className="mr-2.5 h-4 w-4 text-purple-500 shrink-0" />
                <div className="flex items-center justify-between w-full text-xs font-mono">
                  <span>{d.id} ({d.fingerprint})</span>
                  <Badge variant="outline" className="text-[9px]">{d.type}</Badge>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Dynamic IPs */}
        {results.ips && results.ips.length > 0 && (
          <CommandGroup heading="IP Addresses / Gateways">
            {results.ips.map((ip) => (
              <CommandItem
                key={ip.id}
                onSelect={() => runCommand(`/graph`)}
                className="cursor-pointer py-2"
              >
                <Globe className="mr-2.5 h-4 w-4 text-amber-500 shrink-0" />
                <div className="flex items-center justify-between w-full text-xs font-mono">
                  <span>{ip.ip}</span>
                  <Badge variant="outline" className="text-[9px]">{ip.type}</Badge>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Dynamic Customers */}
        {results.customers && results.customers.length > 0 && (
          <CommandGroup heading="Customers">
            {results.customers.map((c) => (
              <CommandItem
                key={c.id}
                onSelect={() => runCommand(`/graph`)}
                className="cursor-pointer py-2"
              >
                <User className="mr-2.5 h-4 w-4 text-emerald-500 shrink-0" />
                <div className="flex flex-col text-xs">
                  <span className="font-bold">{c.name} ({c.id})</span>
                  <span className="text-[10px] text-muted-foreground">{c.email}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {!hasDynamicResults && (
          <>
            <CommandGroup heading="Abuse Rings (Syndicates)">
              <CommandItem onSelect={() => runCommand("/investigations/RING-0042")} className="cursor-pointer py-2">
                <Share2 className="mr-2 h-4 w-4 text-rose-500" />
                <div className="flex items-center justify-between w-full font-mono text-xs">
                  <span className="font-bold">RING-0042</span>
                  <span className="text-rose-500 font-bold">CRITICAL (91/100) • ₹8.4L</span>
                </div>
              </CommandItem>
              <CommandItem onSelect={() => runCommand("/investigations/RING-7092")} className="cursor-pointer py-2">
                <Share2 className="mr-2 h-4 w-4 text-rose-500" />
                <div className="flex items-center justify-between w-full font-mono text-xs">
                  <span className="font-bold">RING-7092</span>
                  <span className="text-rose-500 font-bold">CRITICAL (94/100) • $145k</span>
                </div>
              </CommandItem>
              <CommandItem onSelect={() => runCommand("/investigations/RING-4108")} className="cursor-pointer py-2">
                <Share2 className="mr-2 h-4 w-4 text-amber-500" />
                <div className="flex items-center justify-between w-full font-mono text-xs">
                  <span className="font-bold">RING-4108</span>
                  <span className="text-amber-500 font-bold">HIGH (88/100) • $42.5k</span>
                </div>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />
            <CommandGroup heading="Sentinel Navigation">
              <CommandItem onSelect={() => runCommand("/overview")} className="cursor-pointer py-2">
                <LayoutDashboard className="mr-2 h-4 w-4 text-primary" />
                <span>Overview Posture</span>
                <ArrowRight className="ml-auto h-3 w-3 text-muted-foreground" />
              </CommandItem>
              <CommandItem onSelect={() => runCommand("/rings")} className="cursor-pointer py-2">
                <Share2 className="mr-2 h-4 w-4 text-primary" />
                <span>Abuse Rings Ledger</span>
                <ArrowRight className="ml-auto h-3 w-3 text-muted-foreground" />
              </CommandItem>
              <CommandItem onSelect={() => runCommand("/graph")} className="cursor-pointer py-2">
                <Network className="mr-2 h-4 w-4 text-primary" />
                <span>Graph Explorer</span>
                <ArrowRight className="ml-auto h-3 w-3 text-muted-foreground" />
              </CommandItem>
              <CommandItem onSelect={() => runCommand("/transactions")} className="cursor-pointer py-2">
                <CreditCard className="mr-2 h-4 w-4 text-primary" />
                <span>Transactions Ledger</span>
                <ArrowRight className="ml-auto h-3 w-3 text-muted-foreground" />
              </CommandItem>
              <CommandItem onSelect={() => runCommand("/evaluation")} className="cursor-pointer py-2">
                <Activity className="mr-2 h-4 w-4 text-primary" />
                <span>Held-Out Model Evaluation</span>
                <ArrowRight className="ml-auto h-3 w-3 text-muted-foreground" />
              </CommandItem>
              <CommandItem onSelect={() => runCommand("/settings")} className="cursor-pointer py-2">
                <Settings className="mr-2 h-4 w-4 text-primary" />
                <span>Settings & Parameters</span>
                <ArrowRight className="ml-auto h-3 w-3 text-muted-foreground" />
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
