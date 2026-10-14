"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n";
import { Download, X, Smartphone, CheckCircle } from "lucide-react";

export const InstallPwaPrompt: React.FC = () => {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode
    if (typeof window !== "undefined") {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true;
      if (isStandalone) {
        setIsInstalled(true);
        return;
      }

      const handleBeforeInstallPrompt = (e: Event) => {
        // Prevent default mini-infobar on mobile
        e.preventDefault();
        setDeferredPrompt(e);
      };

      const handleAppInstalled = () => {
        setIsInstalled(true);
        setDeferredPrompt(null);
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.addEventListener("appinstalled", handleAppInstalled);

      return () => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        window.removeEventListener("appinstalled", handleAppInstalled);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  if (isInstalled || isDismissed || !deferredPrompt) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-krishi-deepGreen to-[#1b6b3e] text-white px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-md animate-fadeIn border-b border-krishi-leafGreen/30">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-krishi-leafGreen shrink-0">
            <Smartphone className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold leading-tight truncate">
              {t("pwa.installTitle")}
            </p>
            <p className="text-[11px] text-krishi-warmIvory/80 leading-none truncate hidden xs:block">
              {t("pwa.installSubtitle")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleInstallClick}
            className="px-3 py-1.5 min-h-[36px] bg-krishi-leafGreen hover:bg-[#97bd77] text-krishi-deepGreen rounded-xl text-xs font-extrabold shadow-subtle transition-transform active:scale-95 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t("pwa.installButton")}</span>
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            aria-label={t("pwa.dismissButton")}
            className="p-1.5 min-w-[36px] min-h-[36px] rounded-xl hover:bg-white/10 text-krishi-warmIvory/70 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
