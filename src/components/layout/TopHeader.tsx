"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation, SupportedLanguage } from "@/lib/i18n";
import { Globe, Sprout, Wifi, User } from "lucide-react";

export const TopHeader: React.FC = () => {
  const { language, setLanguage, t } = useTranslation();
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsOnline(window.navigator.onLine);
      const on = () => setIsOnline(true);
      const off = () => setIsOnline(false);
      window.addEventListener("online", on);
      window.addEventListener("offline", off);
      return () => {
        window.removeEventListener("online", on);
        window.removeEventListener("offline", off);
      };
    }
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-krishi-border shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand Link */}
        <Link
          href="/"
          className="flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen rounded-xl p-1 min-h-[44px] shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-krishi-deepGreen flex items-center justify-center text-krishi-warmIvory shadow-subtle group-hover:bg-krishi-primary-600 transition-colors shrink-0">
            <Sprout className="w-5 h-5 text-krishi-leafGreen" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-extrabold text-sm sm:text-base text-krishi-deepGreen tracking-tight leading-tight truncate">
              {t("app.name")}
            </span>
            <span className="text-[10px] text-krishi-textMuted leading-none hidden sm:inline-block truncate">
              {t("app.tagline")}
            </span>
          </div>
        </Link>

        {/* Right Controls: Online Status & Language Switcher & Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Connectivity Pill */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              isOnline
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-amber-50 text-amber-800 border-amber-200"
            }`}
            title={isOnline ? t("status.online") : t("status.offline")}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isOnline ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              }`}
            />
            <span className="text-[11px] font-semibold">
              {isOnline ? t("status.online") : t("status.offline")}
            </span>
          </div>

          {/* Persistent Language Selector */}
          <div className="relative flex items-center">
            <label htmlFor="language-select" className="sr-only">
              {t("languages.select")}
            </label>
            <div className="flex items-center bg-krishi-ivory-100 hover:bg-krishi-ivory-200 border border-krishi-border rounded-xl px-2 py-1 min-h-[44px] transition-colors focus-within:ring-2 focus-within:ring-krishi-deepGreen">
              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-krishi-deepGreen mr-1 shrink-0" />
              <select
                id="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="bg-transparent text-xs font-bold text-krishi-deepGreen focus:outline-none cursor-pointer pr-0.5"
                aria-label={t("languages.select")}
              >
                <option value="mr">मराठी</option>
                <option value="hi">हिंदी</option>
                <option value="en">EN</option>
              </select>
            </div>
          </div>

          {/* Profile / Account Shortcut */}
          <Link
            href="/profile"
            aria-label={t("nav.profile")}
            className="flex items-center justify-center min-w-[44px] min-h-[44px] rounded-xl bg-krishi-ivory-100 hover:bg-krishi-primary-50 border border-krishi-border text-krishi-deepGreen transition-colors focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen"
          >
            <User className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
};
