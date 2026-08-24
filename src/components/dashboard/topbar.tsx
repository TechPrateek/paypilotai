"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, Sun, Moon, Menu, Settings, LogOut, User, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { NotificationCenter } from "@/components/shared/notification-center";
import { CommandPalette } from "@/components/search/command-palette";
import { useAuth } from "@/providers/session-provider";

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const { data: sessionData, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const currentUser = sessionData?.user || {
    name: "Raj Patel",
    email: "merchant@paypilot.ai",
    role: "MERCHANT",
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="h-14 border-b bg-card flex items-center justify-between px-3 sm:px-4 lg:px-6 shrink-0 sticky top-0 z-20">
        {/* Mobile Menu Drawer */}
        <div className="flex items-center gap-2 md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <Sidebar onNavigate={() => setMobileMenuOpen(false)} />
            </SheetContent>
          </Sheet>

          <Link href="/overview" className="font-bold text-base tracking-tight text-primary flex items-center gap-1.5 sm:hidden">
            <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
            <span>PayPilot</span>
          </Link>
        </div>

        <div className="flex items-center flex-1 justify-end md:justify-between gap-2 sm:gap-4">
          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-sm">
            <Button
              variant="outline"
              onClick={() => setSearchOpen(true)}
              className="w-full justify-start text-muted-foreground h-9 px-3"
            >
              <Search className="mr-2 h-4 w-4" />
              <span>Search transactions, customers, cases...</span>
              <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">Ctrl</span>K
              </kbd>
            </Button>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Mobile Search Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="md:hidden h-9 w-9 text-muted-foreground"
              title="Search"
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>

            <NotificationCenter />

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Profile Dropdown */}
            <div className="relative ml-1 sm:ml-2" ref={menuRef}>
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="relative h-8 w-8 rounded-full flex items-center justify-center ring-2 ring-primary/20 hover:ring-primary/50 transition-all focus:outline-none cursor-pointer"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={currentUser.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                    {currentUser.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-60 max-w-[calc(100vw-1.5rem)] rounded-xl bg-card border shadow-lg p-2 z-50 animate-in fade-in-0 zoom-in-95">
                  <div className="px-3 py-2.5 border-b mb-1">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                        {currentUser.name.charAt(0)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <p className="text-sm font-semibold truncate leading-tight">{currentUser.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{currentUser.email}</p>
                      </div>
                    </div>
                    <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold bg-primary/15 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider">
                      <ShieldCheck className="h-3 w-3" />
                      {currentUser.role}
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <Link
                      href="/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md hover:bg-accent transition-colors"
                    >
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Profile & Settings</span>
                    </Link>

                    <Link
                      href="/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md hover:bg-accent transition-colors"
                    >
                      <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Model Monitoring</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md text-destructive hover:bg-destructive/10 transition-colors text-left mt-1 border-t pt-2 cursor-pointer"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <CommandPalette open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
