"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n";
import { WifiOff } from "lucide-react";

export const OfflineIndicator: React.FC = () => {
  const { t } = useTranslation();
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Initial check
    if (typeof window !== "undefined") {
      setIsOffline(!window.navigator.onLine);

      const handleOnline = () => setIsOffline(false);
      const handleOffline = () => setIsOffline(true);

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  if (!isOffline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-krishi-earthBrown text-white px-4 py-2 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 shadow-md transition-all sticky top-0 z-50 animate-fadeIn"
    >
      <WifiOff className="w-4 h-4 flex-shrink-0 animate-pulse" />
      <span>{t("status.offlineBanner")}</span>
    </div>
  );
};
