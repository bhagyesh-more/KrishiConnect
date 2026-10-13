"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import {
  Sprout,
  CloudSun,
  Users,
  Store,
  FileText,
  GraduationCap,
  ArrowRight,
  Info,
  Calendar,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  const { t } = useTranslation();

  const quickNavItems = [
    {
      title: t("nav.crops"),
      desc: t("landing.cropsFeatureDesc"),
      href: "/crops",
      icon: Sprout,
      color: "text-krishi-deepGreen bg-krishi-primary-50",
    },
    {
      title: t("nav.weather"),
      desc: t("landing.weatherFeatureDesc"),
      href: "/weather",
      icon: CloudSun,
      color: "text-amber-700 bg-amber-50",
    },
    {
      title: t("nav.community"),
      desc: t("landing.communityFeatureDesc"),
      href: "/community",
      icon: Users,
      color: "text-emerald-700 bg-emerald-50",
    },
    {
      title: t("nav.marketplace"),
      desc: t("landing.marketFeatureDesc"),
      href: "/marketplace",
      icon: Store,
      color: "text-krishi-accent-700 bg-krishi-accent-50",
    },
    {
      title: t("nav.schemes"),
      desc: t("landing.schemesFeatureDesc"),
      href: "/schemes",
      icon: FileText,
      color: "text-blue-700 bg-blue-50",
    },
    {
      title: t("nav.experts"),
      desc: t("landing.expertsFeatureDesc"),
      href: "/experts",
      icon: GraduationCap,
      color: "text-purple-700 bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-krishi-deepGreen to-krishi-primary-700 rounded-3xl p-6 sm:p-8 text-krishi-warmIvory shadow-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" size="sm">
                🌱 {t("roles.farmer")} • महाराष्ट्र (Maharashtra)
              </Badge>
              <Badge variant="neutral" size="sm" className="bg-white/20 text-white border-white/30">
                {t("status.beta")}
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t("app.name")} — {t("nav.home")}
            </h1>
            <p className="text-xs sm:text-sm text-krishi-warmIvory/80 max-w-xl">
              {t("app.subTagline")}
            </p>
          </div>

          <Link href="/crops" className="flex-shrink-0">
            <Button
              variant="secondary"
              size="md"
              className="bg-krishi-warmIvory text-krishi-deepGreen hover:bg-white"
            >
              <Sprout className="w-4 h-4 mr-1.5" />
              <span>{t("nav.crops")}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Milestone 1 Foundation Notice */}
      <Alert
        variant="info"
        icon={<Info className="w-5 h-5 text-krishi-deepGreen" />}
        title={t("status.foundationNotice")}
      >
        <span>
          {t("landing.capstoneNotice")} {t("status.comingSoon")}: Supabase Authentication & Real Database Migrations (Milestone 2).
        </span>
      </Alert>

      {/* Quick Action Pillars */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-krishi-deepGreen flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-krishi-primary-500" />
            <span>{t("landing.featuresTitle")}</span>
          </h2>
          <span className="text-xs text-krishi-textMuted font-medium">
            {t("common.all")} ६ विभाग
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickNavItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link key={idx} href={item.href} className="group focus:outline-none">
                <Card className="h-full hover:border-krishi-deepGreen transition-all flex flex-col justify-between p-4">
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                      style={{ backgroundColor: "rgba(24, 92, 55, 0.08)" }}
                    >
                      <Icon className="w-5 h-5 text-krishi-deepGreen" />
                    </div>
                    <div>
                      <CardTitle className="text-base group-hover:text-krishi-deepGreen">
                        {item.title}
                      </CardTitle>
                      <CardDescription className="text-xs line-clamp-2 mt-1">
                        {item.desc}
                      </CardDescription>
                    </div>
                  </div>

                  <div className="pt-3 mt-auto flex items-center justify-between text-xs font-bold text-krishi-deepGreen">
                    <span>{t("common.viewMore")}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
