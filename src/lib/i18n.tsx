"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import mrTranslations from "@/locales/mr.json";
import hiTranslations from "@/locales/hi.json";
import enTranslations from "@/locales/en.json";

export type SupportedLanguage = "mr" | "hi" | "en";

interface I18nContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatNumber: (num: number) => string;
  formatDate: (date: string | Date | number, options?: Intl.DateTimeFormatOptions) => string;
}

const translations: Record<SupportedLanguage, Record<string, any>> = {
  mr: mrTranslations,
  hi: hiTranslations,
  en: enTranslations,
};

const I18nContext = createContext<I18nContextType>({
  language: "mr",
  setLanguage: () => {},
  t: (key) => key,
  formatNumber: (num) => String(num),
  formatDate: (date) => String(date),
});

export const STORAGE_KEY = "krishiconnect_lang";

const LOCALE_MAP: Record<SupportedLanguage, string> = {
  mr: "mr-IN",
  hi: "hi-IN",
  en: "en-IN",
};

export const I18nProvider: React.FC<{
  children: ReactNode;
  initialLanguage?: SupportedLanguage;
}> = ({ children, initialLanguage = "mr" }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    if (initialLanguage === "hi" || initialLanguage === "en" || initialLanguage === "mr") {
      return initialLanguage;
    }
    return "mr";
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as SupportedLanguage;
      if (saved && (saved === "mr" || saved === "hi" || saved === "en")) {
        setLanguageState(saved);
        if (typeof document !== "undefined") {
          document.documentElement.lang = saved;
        }
      } else {
        if (typeof document !== "undefined") {
          document.documentElement.lang = initialLanguage;
        }
      }
    } catch {
      // LocalStorage unavailable in certain environments
    }
  }, [initialLanguage]);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      if (typeof document !== "undefined") {
        document.cookie = `krishiconnect_lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
        document.documentElement.lang = lang;
      }
    } catch {
      // Ignore storage errors
    }
  };

  const t = (path: string, params?: Record<string, string | number>): string => {
    const keys = path.split(".");
    let current: any = translations[language];

    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        // Fallback to English dictionary if key missing in chosen language
        let fallback: any = translations.en;
        for (const fbKey of keys) {
          if (fallback && typeof fallback === "object" && fbKey in fallback) {
            fallback = fallback[fbKey];
          } else {
            return interpolate(path, params);
          }
        }
        return interpolate(typeof fallback === "string" ? fallback : path, params);
      }
    }

    const rawResult = typeof current === "string" ? current : path;
    return interpolate(rawResult, params);
  };

  const interpolate = (str: string, params?: Record<string, string | number>): string => {
    if (!params) return str;
    let result = str;
    for (const [k, v] of Object.entries(params)) {
      result = result
        .replace(new RegExp(`\\{\\{${k}\\}\\}`, "g"), String(v))
        .replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
    return result;
  };

  const formatNumber = (num: number): string => {
    try {
      const locale = LOCALE_MAP[language] || "mr-IN";
      return new Intl.NumberFormat(locale).format(num);
    } catch {
      return String(num);
    }
  };

  const formatDate = (
    dateInput: string | Date | number,
    options?: Intl.DateTimeFormatOptions
  ): string => {
    try {
      const d = typeof dateInput === "object" ? dateInput : new Date(dateInput);
      if (isNaN(d.getTime())) return String(dateInput);
      const locale = LOCALE_MAP[language] || "mr-IN";
      return new Intl.DateTimeFormat(locale, options || { dateStyle: "medium" }).format(d);
    } catch {
      return String(dateInput);
    }
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, formatNumber, formatDate }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => useContext(I18nContext);
