"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import mrTranslations from "@/locales/mr.json";
import hiTranslations from "@/locales/hi.json";
import enTranslations from "@/locales/en.json";

export type SupportedLanguage = "mr" | "hi" | "en";

interface I18nContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
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
});

const STORAGE_KEY = "krishiconnect_lang";

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Marathi is the blueprint-mandated default
  const [language, setLanguageState] = useState<SupportedLanguage>("mr");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as SupportedLanguage;
      if (saved && (saved === "mr" || saved === "hi" || saved === "en")) {
        setLanguageState(saved);
      }
    } catch {
      // LocalStorage unavailable in certain environments
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore storage errors
    }
  };

  const t = (path: string): string => {
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
            return path;
          }
        }
        return typeof fallback === "string" ? fallback : path;
      }
    }

    return typeof current === "string" ? current : path;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => useContext(I18nContext);
