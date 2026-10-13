"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import { Home, Sprout, MessageSquare, Store, User } from "lucide-react";
import { cn } from "@/lib/utils";

export const BottomNavigation: React.FC = () => {
  const pathname = usePathname();
  const { t } = useTranslation();

  const navItems = [
    { href: "/home", label: t("nav.home"), icon: Home },
    { href: "/crops", label: t("nav.crops"), icon: Sprout },
    { href: "/community", label: t("nav.community"), icon: MessageSquare },
    { href: "/marketplace", label: t("nav.marketplace"), icon: Store },
    { href: "/profile", label: t("nav.profile"), icon: User },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-krishi-border shadow-[0_-2px_10px_rgba(24,92,55,0.06)] pb-safe"
    >
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto px-1">
        {navItems.map((item) => {
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
                "flex flex-col items-center justify-center gap-1 min-h-[48px] py-1 px-0.5 transition-all select-none rounded-xl mx-0.5",
                isActive
                  ? "text-krishi-deepGreen font-bold"
                  : "text-krishi-textMuted hover:text-krishi-deepGreen font-medium opacity-80 hover:opacity-100"
              )}
            >
              <div
                className={cn(
                  "p-1 rounded-xl transition-all",
                  isActive
                    ? "bg-krishi-primary-100/80 text-krishi-deepGreen"
                    : "text-current"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5]")} />
              </div>
              <span className="text-[10px] leading-none text-center truncate max-w-full">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
