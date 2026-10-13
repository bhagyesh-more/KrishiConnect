"use client";

import React, { ReactNode } from "react";
import { TopHeader } from "@/components/layout/TopHeader";
import { DesktopSidebar } from "@/components/layout/DesktopSidebar";
import { BottomNavigation } from "@/components/layout/BottomNavigation";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-krishi-warmIvory">
      {/* Top Header */}
      <TopHeader />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar (hidden on mobile, visible md+) */}
        <DesktopSidebar />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-12 max-w-5xl">
          {children}
        </main>
      </div>

      {/* Persistent Mobile Bottom Navigation (visible <md) */}
      <BottomNavigation />
    </div>
  );
}
