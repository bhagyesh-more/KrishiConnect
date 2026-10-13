"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import {
  Home,
  Sprout,
  MessageSquare,
  Store,
  User,
  CloudSun,
  FileText,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const DesktopSidebar: React.FC = () => {
  const pathname = usePathname();
  const { t } = useTranslation();

  const mainLinks = [
    { href: "/home", label: t("nav.home"), icon: Home },
    { href: "/crops", label: t("nav.crops"), icon: Sprout },
    { href: "/community", label: t("nav.community"), icon: MessageSquare },
    { href: "/marketplace", label: t("nav.marketplace"), icon: Store },
    { href: "/profile", label: t("nav.profile"), icon: User },
  ];

  const resourceLinks = [
    { href: "/weather", label: t("nav.weather"), icon: CloudSun },
    { href: "/schemes", label: t("nav.schemes"), icon: FileText },
    { href: "/experts", label: t("nav.experts"), icon: GraduationCap },
    { href: "/learning", label: t("nav.learning"), icon: BookOpen },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-krishi-border min-h-[calc(100vh-4rem)] p-4 space-y-6">
      {/* Primary Section */}
      <div className="space-y-1">
        <p className="px-3 text-xs font-bold text-krishi-textMuted uppercase tracking-wider mb-2">
          {t("app.name")}
        </p>
        {mainLinks.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href === "/home" && pathname === "/") ||
            pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all",
                isActive
                  ? "bg-krishi-deepGreen text-krishi-warmIvory shadow-subtle"
                  : "text-krishi-textMain hover:bg-krishi-ivory-100 hover:text-krishi-deepGreen"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Resources & Shortcuts Section */}
      <div className="space-y-1 pt-4 border-t border-krishi-border/80">
        <p className="px-3 text-xs font-bold text-krishi-textMuted uppercase tracking-wider mb-2">
          {t("landing.featuresTitle")}
        </p>
        {resourceLinks.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all",
                isActive
                  ? "bg-krishi-primary-100 text-krishi-deepGreen font-bold"
                  : "text-krishi-textMain hover:bg-krishi-ivory-100 hover:text-krishi-deepGreen"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0 text-krishi-primary-600" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Capstone Badge Notice */}
      <div className="mt-auto pt-4 border-t border-krishi-border/60">
        <div className="p-3 bg-krishi-ivory-100 rounded-xl border border-krishi-border text-xs text-krishi-textMuted leading-relaxed">
          <p className="font-bold text-krishi-deepGreen mb-1">
            🌱 {t("status.foundationNotice")}
          </p>
          <p>{t("landing.capstoneNotice")}</p>
        </div>
      </div>
    </aside>
  );
};
