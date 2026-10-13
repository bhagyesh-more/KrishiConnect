"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation, SupportedLanguage } from "@/lib/i18n";
import { Globe, Sprout, Wifi } from "lucide-react";

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
          className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen rounded-xl p-1"
        >
          <div className="w-10 h-10 rounded-xl bg-krishi-deepGreen flex items-center justify-center text-krishi-warmIvory shadow-subtle group-hover:bg-krishi-primary-600 transition-colors">
            <Sprout className="w-6 h-6 text-krishi-leafGreen" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base sm:text-lg text-krishi-deepGreen tracking-tight leading-tight">
              {t("app.name")}
            </span>
            <span className="text-[10px] sm:text-xs text-krishi-textMuted leading-none hidden xs:inline-block">
              {t("app.tagline")}
            </span>
          </div>
        </Link>

        {/* Right Controls: Online Status & Language Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
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
            <div className="flex items-center bg-krishi-ivory-100 hover:bg-krishi-ivory-200 border border-krishi-border rounded-xl px-2.5 py-1.5 transition-colors focus-within:ring-2 focus-within:ring-krishi-deepGreen">
              <Globe className="w-4 h-4 text-krishi-deepGreen mr-1.5 flex-shrink-0" />
              <select
                id="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="bg-transparent text-xs sm:text-sm font-semibold text-krishi-deepGreen focus:outline-none cursor-pointer pr-1"
                aria-label={t("languages.select")}
              >
                <option value="mr">मराठी</option>
                <option value="hi">हिंदी</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
