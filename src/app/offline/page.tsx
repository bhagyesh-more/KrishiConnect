"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { TopHeader } from "@/components/layout/TopHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Button } from "@/components/ui/Button";
import { WifiOff, RotateCcw } from "lucide-react";

export default function OfflinePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-krishi-warmIvory pb-20 md:pb-8">
      <TopHeader />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-krishi-border p-6 sm:p-8 text-center space-y-4 shadow-subtle">
          <div className="w-16 h-16 rounded-2xl bg-krishi-accent-50 text-krishi-earthBrown flex items-center justify-center mx-auto">
            <WifiOff className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-krishi-deepGreen">
            {t("status.offline")}
          </h1>
          <p className="text-sm text-krishi-textMuted leading-relaxed">
            {t("status.offlineBanner")}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                if (typeof window !== "undefined") window.location.reload();
              }}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              <span>{t("common.refresh")}</span>
            </Button>
            <Link href="/">
              <Button variant="outline" size="md" className="w-full">
                <span>{t("errors.goHome")}</span>
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}
