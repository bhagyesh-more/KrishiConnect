"use client";

import React from "react";
import Link from "next/link";
import { useTranslation, SupportedLanguage } from "@/lib/i18n";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import {
  User,
  Globe,
  Shield,
  Smartphone,
  MapPin,
  Phone,
  CheckCircle,
  Clock,
  ArrowLeft,
  Info,
} from "lucide-react";

export default function ProfilePage() {
  const { language, setLanguage, t } = useTranslation();

  const roleTypes = [
    { key: "farmer", label: t("roles.farmer"), status: t("roles.verified"), variant: "primary" as const },
    { key: "buyer", label: t("roles.buyer"), status: t("roles.verified"), variant: "secondary" as const },
    { key: "expert", label: t("roles.expert"), status: t("roles.pending"), variant: "warning" as const },
    { key: "seller", label: t("roles.seller"), status: t("roles.pending"), variant: "warning" as const },
    { key: "admin", label: t("roles.admin"), status: "प्रशासकीय नियंत्रण", variant: "neutral" as const },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Link
          href="/home"
          className="md:hidden text-krishi-textMuted hover:text-krishi-deepGreen p-1 -ml-1 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-krishi-deepGreen">
            {t("nav.profile")}
          </h1>
          <p className="text-xs sm:text-sm text-krishi-textMuted">
            वापरकर्ता खाते, भूमिका आणि ॲप प्राधान्ये
          </p>
        </div>
      </div>

      {/* Profile Card Preview */}
      <Card className="border-krishi-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-krishi-deepGreen text-krishi-warmIvory flex items-center justify-center font-extrabold text-2xl shadow-subtle flex-shrink-0">
            कृ
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-krishi-textMain">शेतकरी मित्र (Farmer Demo)</h2>
              <Badge variant="primary" size="sm">
                <CheckCircle className="w-3 h-3" /> {t("roles.farmer")}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-krishi-textMuted">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-krishi-earthBrown" /> पुणे, महाराष्ट्र (Pune, MH)
              </span>
              <span className="flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-krishi-deepGreen" /> PWA इन्स्टॉल सक्षम
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Language Preference Setting */}
      <Card className="border-krishi-border space-y-3">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-krishi-deepGreen" />
            <CardTitle className="text-base">{t("languages.select")}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2 max-w-md">
            {[
              { code: "mr" as SupportedLanguage, label: "मराठी (Default)" },
              { code: "hi" as SupportedLanguage, label: "हिंदी" },
              { code: "en" as SupportedLanguage, label: "English" },
            ].map((item) => (
              <button
                key={item.code}
                onClick={() => setLanguage(item.code)}
                className={`min-h-[48px] px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                  language === item.code
                    ? "bg-krishi-deepGreen text-white border-krishi-deepGreen shadow-subtle"
                    : "bg-white text-krishi-textMain border-krishi-border hover:bg-krishi-ivory-100"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Role-Aware Capabilities Architecture Preview */}
      <Card className="border-krishi-border space-y-3">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-krishi-deepGreen" />
            <div>
              <CardTitle className="text-base">प्लॅटफॉर्म भूमिका व परवानग्या (RBAC)</CardTitle>
              <CardDescription>
                सर्व भूमिका सर्व्हर-स्तरीय Supabase RLS द्वारे नियंत्रित केल्या जातील
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {roleTypes.map((role) => (
              <div
                key={role.key}
                className="flex items-center justify-between p-3 rounded-xl bg-krishi-ivory-100 border border-krishi-border text-xs sm:text-sm"
              >
                <span className="font-semibold text-krishi-textMain">{role.label}</span>
                <Badge variant={role.variant} size="sm">
                  {role.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Milestone 2 Authentication Hand-off Notice */}
      <Alert
        variant="info"
        icon={<Info className="w-5 h-5 text-krishi-deepGreen" />}
        title="टप्पा २ मध्ये प्रमाणीकरण सुरू होईल (Milestone 2 Preview)"
      >
        <span>
          पुढील टप्प्यात Supabase Email/Password नोंदणी, OTP पडताळणी, आणि सर्व्हर-सत्यापित प्रोफाइल व्यवस्थापन कार्यान्वित केले जाईल.
        </span>
      </Alert>
    </div>
  );
}
