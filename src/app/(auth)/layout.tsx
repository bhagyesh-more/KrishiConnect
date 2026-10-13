"use client";

import React, { ReactNode } from "react";
import { TopHeader } from "@/components/layout/TopHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-krishi-warmIvory">
      <TopHeader />
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 pb-24 md:pb-12">
        <div className="w-full max-w-md">{children}</div>
      </main>
      <BottomNavigation />
    </div>
  );
}
