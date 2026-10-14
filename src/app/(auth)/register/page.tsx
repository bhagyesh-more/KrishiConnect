"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation, SupportedLanguage } from "@/lib/i18n";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { signUpAction } from "@/features/auth/actions";
import { MAHARASHTRA_DISTRICTS } from "@/features/auth/maharashtraDistricts";
import {
  UserPlus,
  Sprout,
  Store,
  GraduationCap,
  ShoppingBag,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function RegisterPage() {
  const { t, language } = useTranslation();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [district, setDistrict] = useState("Pune");
  const [taluka, setTaluka] = useState("Haveli");
  const [role, setRole] = useState<"farmer" | "buyer" | "expert" | "seller">("farmer");
  const [preferredLanguage, setPreferredLanguage] = useState<SupportedLanguage>("mr");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const selectedDistrictData = MAHARASHTRA_DISTRICTS[district];
  const talukas = selectedDistrictData ? selectedDistrictData.talukas : [];

  const handleDistrictChange = (newDistrict: string) => {
    setDistrict(newDistrict);
    const firstTaluka = MAHARASHTRA_DISTRICTS[newDistrict]?.talukas[0]?.nameEn || "";
    setTaluka(firstTaluka);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const res = await signUpAction({
        fullName,
        email,
        password,
        district,
        taluka,
        role,
        preferredLanguage,
      });

      if (res.success) {
        setSuccessMsg(res.message || t("auth.registerSuccess"));
        if (!res.data?.requiresEmailVerification) {
          setTimeout(() => {
            router.push("/home");
          }, 800);
        }
      } else {
        setErrorMsg(res.error || t("auth.registerFailed"));
      }
    } catch (err: any) {
      setErrorMsg(err.message || t("common.error"));
    } finally {
      setIsLoading(false);
    }
  };

  const roleCards = [
    {
      id: "farmer" as const,
      title: t("auth.roleFarmerTitle"),
      desc: t("auth.roleFarmerDesc"),
      icon: Sprout,
      badge: t("roles.verified"),
    },
    {
      id: "buyer" as const,
      title: t("auth.roleBuyerTitle"),
      desc: t("auth.roleBuyerDesc"),
      icon: ShoppingBag,
      badge: t("roles.verified"),
    },
    {
      id: "expert" as const,
      title: t("auth.roleExpertTitle"),
      desc: t("auth.roleExpertDesc"),
      icon: GraduationCap,
      badge: t("roles.pending"),
    },
    {
      id: "seller" as const,
      title: t("auth.roleSellerTitle"),
      desc: t("auth.roleSellerDesc"),
      icon: Store,
      badge: t("roles.pending"),
    },
  ];

  return (
    <Card className="border-krishi-border shadow-card p-6 sm:p-8 space-y-6">
      <CardHeader className="text-center flex-col items-center mb-0">
        <div className="w-12 h-12 rounded-2xl bg-krishi-primary-50 text-krishi-deepGreen flex items-center justify-center mb-2 shadow-subtle">
          <UserPlus className="w-6 h-6" />
        </div>
        <CardTitle className="text-2xl font-black text-krishi-deepGreen">
          {t("auth.registerTitle")}
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          {t("auth.registerSubtitle")}
        </CardDescription>
      </CardHeader>

      {errorMsg && (
        <Alert variant="error" icon={<AlertCircle className="w-5 h-5 text-red-600" />}>
          <span>{errorMsg}</span>
        </Alert>
      )}

      {successMsg && (
        <Alert variant="success" icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}>
          <span>{successMsg}</span>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <Input
          label={t("auth.fullNameLabel")}
          type="text"
          required
          placeholder={t("auth.fullNamePlaceholder")}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        {/* Email & Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label={t("auth.emailLabel")}
            type="email"
            required
            autoComplete="email"
            placeholder={t("auth.emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label={t("auth.passwordLabel")}
            type="password"
            required
            autoComplete="new-password"
            placeholder={t("auth.passwordPlaceholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Location Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5 text-left">
            <label className="block text-sm font-semibold text-krishi-textMain">
              {t("auth.districtLabel")}
            </label>
            <select
              value={district}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="w-full min-h-[48px] rounded-xl border border-krishi-border bg-white px-3.5 py-2.5 text-sm font-medium text-krishi-textMain focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen"
            >
              {Object.entries(MAHARASHTRA_DISTRICTS).map(([key, item]) => (
                <option key={key} value={key}>
                  {language === "en" ? item.nameEn : `${item.nameMr} (${item.nameEn})`}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5 text-left">
            <label className="block text-sm font-semibold text-krishi-textMain">
              {t("auth.talukaLabel")}
            </label>
            <select
              value={taluka}
              onChange={(e) => setTaluka(e.target.value)}
              className="w-full min-h-[48px] rounded-xl border border-krishi-border bg-white px-3.5 py-2.5 text-sm font-medium text-krishi-textMain focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen"
            >
              {talukas.map((tItem) => (
                <option key={tItem.nameEn} value={tItem.nameEn}>
                  {language === "en" ? tItem.nameEn : `${tItem.nameMr} (${tItem.nameEn})`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Preferred Language */}
        <div className="space-y-1.5 text-left">
          <label className="block text-sm font-semibold text-krishi-textMain">
            {t("auth.languageLabel")}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { code: "mr" as const, label: t("languages.mr") },
              { code: "hi" as const, label: t("languages.hi") },
              { code: "en" as const, label: t("languages.en") },
            ].map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setPreferredLanguage(lang.code)}
                className={`min-h-[44px] px-2 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  preferredLanguage === lang.code
                    ? "bg-krishi-deepGreen text-white border-krishi-deepGreen shadow-subtle"
                    : "bg-white text-krishi-textMain border-krishi-border hover:bg-krishi-ivory-100"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Role Selection Grid */}
        <div className="space-y-2 text-left pt-1">
          <label className="block text-sm font-semibold text-krishi-textMain">
            {t("auth.roleLabel")}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {roleCards.map((rc) => {
              const Icon = rc.icon;
              const isSelected = role === rc.id;
              return (
                <div
                  key={rc.id}
                  onClick={() => setRole(rc.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? "border-krishi-deepGreen bg-krishi-primary-50 ring-2 ring-krishi-deepGreen/30 shadow-subtle"
                      : "border-krishi-border bg-white hover:bg-krishi-ivory-100"
                  }`}
                >
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <div className="flex items-center gap-1.5">
                      <Icon
                        className={`w-4 h-4 ${
                          isSelected ? "text-krishi-deepGreen" : "text-krishi-textMuted"
                        }`}
                      />
                      <span className="font-bold text-xs text-krishi-textMain">{rc.title}</span>
                    </div>
                    <Badge variant={isSelected ? "primary" : "neutral"} size="sm">
                      {rc.badge}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-krishi-textMuted leading-tight">{rc.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full mt-4 min-h-[48px]"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          <span>{t("auth.registerButton")}</span>
        </Button>
      </form>

      <div className="pt-4 border-t border-krishi-border/80 text-center">
        <p className="text-xs text-krishi-textMuted">
          {t("auth.alreadyHaveAccount")}{" "}
          <Link
            href="/login"
            className="font-bold text-krishi-deepGreen hover:underline inline-flex items-center gap-1"
          >
            {t("auth.loginLink")}
          </Link>
        </p>
      </div>
    </Card>
  );
}
