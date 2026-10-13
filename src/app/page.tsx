"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { TopHeader } from "@/components/layout/TopHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Container } from "@/components/ui/Container";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Sprout,
  CloudSun,
  Users,
  Store,
  FileText,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Languages,
} from "lucide-react";

export default function LandingPage() {
  const { t } = useTranslation();

  const features = [
    {
      title: t("landing.cropsFeatureTitle"),
      desc: t("landing.cropsFeatureDesc"),
      icon: Sprout,
      href: "/crops",
      badge: "स्मार्ट शेती",
      color: "text-krishi-deepGreen bg-krishi-primary-50",
    },
    {
      title: t("landing.weatherFeatureTitle"),
      desc: t("landing.weatherFeatureDesc"),
      icon: CloudSun,
      href: "/weather",
      badge: "अचूक अंदाज",
      color: "text-amber-700 bg-amber-50",
    },
    {
      title: t("landing.communityFeatureTitle"),
      desc: t("landing.communityFeatureDesc"),
      icon: Users,
      href: "/community",
      badge: "शेतकरी संवाद",
      color: "text-emerald-700 bg-emerald-50",
    },
    {
      title: t("landing.marketFeatureTitle"),
      desc: t("landing.marketFeatureDesc"),
      icon: Store,
      href: "/marketplace",
      badge: "थेट विक्री",
      color: "text-krishi-accent-700 bg-krishi-accent-50",
    },
    {
      title: t("landing.schemesFeatureTitle"),
      desc: t("landing.schemesFeatureDesc"),
      icon: FileText,
      href: "/schemes",
      badge: "महाडीबीटी",
      color: "text-blue-700 bg-blue-50",
    },
    {
      title: t("landing.expertsFeatureTitle"),
      desc: t("landing.expertsFeatureDesc"),
      icon: GraduationCap,
      href: "/experts",
      badge: "तज्ज्ञ सल्ला",
      color: "text-purple-700 bg-purple-50",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-krishi-warmIvory pb-20 md:pb-8">
      {/* Top Header */}
      <TopHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 bg-gradient-to-b from-white via-krishi-ivory-100 to-krishi-warmIvory border-b border-krishi-border/60">
          <Container>
            <div className="max-w-2xl mx-auto text-center space-y-4 sm:space-y-6">
              {/* Regional Focus Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-krishi-primary-50 border border-krishi-primary-200 shadow-subtle">
                <span className="w-2 h-2 rounded-full bg-krishi-deepGreen animate-ping" />
                <span className="text-xs sm:text-sm font-bold text-krishi-deepGreen">
                  🌱 महाराष्ट्र प्रथम • Maharashtra First
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-5xl font-black text-krishi-deepGreen tracking-tight leading-[1.15]">
                {t("landing.heroTitle")}
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-krishi-textMuted leading-relaxed max-w-xl mx-auto">
                {t("landing.heroDesc")}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-md mx-auto">
                <Link href="/home" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="w-full shadow-card">
                    <span>{t("landing.ctaExplore")}</span>
                    <ArrowRight className="w-5 h-5 ml-1" />
                  </Button>
                </Link>
                <Link href="/crops" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full">
                    <span>{t("nav.crops")}</span>
                  </Button>
                </Link>
              </div>

              {/* Key Trust Signals */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-krishi-textMuted">
                <span className="flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-krishi-deepGreen" />
                  मोबाईल-फ्रेंडली PWA
                </span>
                <span className="flex items-center gap-1.5">
                  <Languages className="w-4 h-4 text-krishi-deepGreen" />
                  मराठी • हिंदी • English
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-krishi-deepGreen" />
                  सुरक्षित डेटा व RLS
                </span>
              </div>
            </div>
          </Container>
        </section>

        {/* Feature Cards Grid */}
        <section className="py-10 sm:py-14">
          <Container>
            <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12 space-y-2">
              <Badge variant="secondary" size="md">
                {t("status.foundationNotice")}
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-krishi-deepGreen">
                {t("landing.featuresTitle")}
              </h2>
              <p className="text-sm sm:text-base text-krishi-textMuted">
                {t("landing.featuresSubtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {features.map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <Link
                    key={idx}
                    href={feat.href}
                    className="group block transition-transform duration-200 hover:-translate-y-1 focus:outline-none"
                  >
                    <Card className="h-full flex flex-col justify-between border border-krishi-border hover:border-krishi-deepGreen/40 shadow-subtle hover:shadow-card">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${feat.color} group-hover:scale-105 transition-transform`}
                          >
                            <Icon className="w-6 h-6" />
                          </div>
                          <Badge variant="neutral" size="sm">
                            {feat.badge}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg group-hover:text-krishi-deepGreen transition-colors">
                          {feat.title}
                        </CardTitle>
                        <CardDescription className="text-sm line-clamp-3">
                          {feat.desc}
                        </CardDescription>
                      </div>

                      <div className="pt-4 mt-auto flex items-center gap-1 text-xs font-bold text-krishi-deepGreen group-hover:text-krishi-primary-600">
                        <span>{t("common.viewMore")}</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </Container>
        </section>

        {/* Capstone Project Notice Section */}
        <section className="py-8 bg-krishi-ivory-100/80 border-t border-krishi-border/80">
          <Container>
            <div className="p-4 sm:p-6 rounded-2xl bg-white border border-krishi-border flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-full bg-krishi-primary-50 flex items-center justify-center text-krishi-deepGreen flex-shrink-0">
                <Sprout className="w-6 h-6" />
              </div>
              <div className="space-y-1 flex-1">
                <h4 className="font-bold text-sm text-krishi-deepGreen">
                  {t("status.foundationNotice")}
                </h4>
                <p className="text-xs sm:text-sm text-krishi-textMuted">
                  {t("landing.capstoneNotice")}
                </p>
              </div>
              <Link href="/home">
                <Button variant="primary" size="sm">
                  {t("landing.ctaExplore")}
                </Button>
              </Link>
            </div>
          </Container>
        </section>
      </main>

      {/* Persistent Mobile Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
