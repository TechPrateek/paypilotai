import React from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { ThemeProvider } from "@/providers/theme-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Sidebar for desktop */}
        <div className="hidden md:flex">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {/* Demo Mode Banner */}
          <div className="bg-primary/10 text-primary text-xs sm:text-sm font-medium py-1.5 px-4 text-center border-b border-primary/20">
            Demo Mode - All data is synthetic
          </div>

          <Topbar />

          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
