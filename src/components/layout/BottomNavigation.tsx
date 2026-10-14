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
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-krishi-border shadow-[0_-2px_12px_rgba(24,92,55,0.08)] pb-[calc(env(safe-area-inset-bottom,0px)+0.35rem)]"
    >
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto px-1 items-center">
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
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-col items-center justify-center gap-1 min-h-[48px] py-1 px-1 transition-all select-none rounded-xl mx-0.5 active:scale-95",
                isActive
                  ? "text-krishi-deepGreen font-bold"
                  : "text-krishi-textMuted hover:text-krishi-deepGreen font-medium opacity-85 hover:opacity-100"
              )}
            >
              <div
                className={cn(
                  "p-1.5 rounded-xl transition-all flex items-center justify-center",
                  isActive
                    ? "bg-krishi-primary-100/90 text-krishi-deepGreen shadow-subtle ring-1 ring-krishi-deepGreen/20"
                    : "text-current"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5]")} />
              </div>
              <span className="text-[10px] sm:text-[11px] leading-tight text-center truncate max-w-full font-semibold">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
