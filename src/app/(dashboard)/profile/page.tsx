"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation, SupportedLanguage } from "@/lib/i18n";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { createClient } from "@/lib/supabase/client";
import { signOutAction, updateProfileAction } from "@/features/auth/actions";
import { MAHARASHTRA_DISTRICTS } from "@/features/auth/maharashtraDistricts";
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
  LogOut,
  LogIn,
  Save,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function ProfilePage() {
  const { language, setLanguage, t } = useTranslation();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form states
  const [fullName, setFullName] = useState("ज्ञानेश्वर पाटील");
  const [phoneNumber, setPhoneNumber] = useState("9876543210");
  const [district, setDistrict] = useState("Pune");
  const [taluka, setTaluka] = useState("Haveli");
  const [village, setVillage] = useState("वाघोली");

  useEffect(() => {
    async function loadSession() {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          setUser(session.user);
          const { data: prof } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (prof) {
            const p = prof as any;
            setProfile(p);
            setFullName(p.full_name || "");
            setPhoneNumber(p.phone_number || "");
            setDistrict(p.district || "Pune");
            setTaluka(p.taluka || "Haveli");
            setVillage(p.village || "");
          }

          const { data: userRoles } = await supabase
            .from("user_roles")
            .select("*")
            .eq("user_id", session.user.id);

          if (userRoles) {
            setRoles(userRoles as any[]);
          }
        }
      } catch (err) {
        // Fallback for offline or local preview
      }
    }

    loadSession();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await updateProfileAction({
        fullName,
        phoneNumber,
        district,
        taluka,
        village,
        preferredLanguage: language,
      });

      if (res.success) {
        setMessage({ type: "success", text: res.message || "प्रोफाइल जतन केले!" });
        setIsEditing(false);
      } else {
        setMessage({ type: "error", text: res.error || "अपडेट अयशस्वी." });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "त्रुटी आली." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOutAction();
    router.push("/login");
  };

  const talukas = MAHARASHTRA_DISTRICTS[district]?.talukas || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
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

        {user ? (
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-1.5" />
            <span>लॉगआउट (Log Out)</span>
          </Button>
        ) : (
          <Link href="/login">
            <Button variant="primary" size="sm">
              <LogIn className="w-4 h-4 mr-1.5" />
              <span>लॉगिन / नोंदणी (Log In / Register)</span>
            </Button>
          </Link>
        )}
      </div>

      {message && (
        <Alert
          variant={message.type === "success" ? "success" : "error"}
          icon={
            message.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )
          }
        >
          <span>{message.text}</span>
        </Alert>
      )}

      {/* User Information Card */}
      <Card className="border-krishi-border space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-krishi-deepGreen text-krishi-warmIvory flex items-center justify-center font-extrabold text-2xl shadow-subtle flex-shrink-0">
              {fullName ? fullName.charAt(0) : "कृ"}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-krishi-textMain">{fullName}</h2>
                <Badge variant="primary" size="sm">
                  <CheckCircle className="w-3 h-3" />{" "}
                  {roles.length > 0
                    ? roles.map((r) => r.role).join(", ")
                    : "शेतकरी (Farmer)"}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-krishi-textMuted">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-krishi-earthBrown" /> {district}, {taluka}
                </span>
                {phoneNumber && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-krishi-deepGreen" /> +91 {phoneNumber}
                  </span>
                )}
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "रद्द करा (Cancel)" : "माहिती बदला (Edit Profile)"}
          </Button>
        </div>

        {/* Edit Form Drawer */}
        {isEditing && (
          <form
            onSubmit={handleSaveProfile}
            className="pt-4 border-t border-krishi-border/80 space-y-3 bg-krishi-ivory-50 p-4 rounded-xl"
          >
            <h4 className="font-bold text-sm text-krishi-deepGreen">
              प्रोफाइल तपशील संपादित करा
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="पूर्ण नाव"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <Input
                label="मोबाईल नंबर"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="१० अंकी नंबर"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5 text-left">
                <label className="block text-sm font-semibold text-krishi-textMain">
                  जिल्हा
                </label>
                <select
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    const tList = MAHARASHTRA_DISTRICTS[e.target.value]?.talukas || [];
                    if (tList[0]) setTaluka(tList[0].nameEn);
                  }}
                  className="w-full min-h-[48px] rounded-xl border border-krishi-border bg-white px-3.5 py-2 text-sm font-medium focus:ring-2 focus:ring-krishi-deepGreen"
                >
                  {Object.entries(MAHARASHTRA_DISTRICTS).map(([key, item]) => (
                    <option key={key} value={key}>
                      {item.nameMr} ({item.nameEn})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="block text-sm font-semibold text-krishi-textMain">
                  तालुका
                </label>
                <select
                  value={taluka}
                  onChange={(e) => setTaluka(e.target.value)}
                  className="w-full min-h-[48px] rounded-xl border border-krishi-border bg-white px-3.5 py-2 text-sm font-medium focus:ring-2 focus:ring-krishi-deepGreen"
                >
                  {talukas.map((tItem) => (
                    <option key={tItem.nameEn} value={tItem.nameEn}>
                      {tItem.nameMr} ({tItem.nameEn})
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="गाव (Village)"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="गावाचे नाव"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSaving}
              className="mt-2"
            >
              <Save className="w-4 h-4 mr-1.5" />
              <span>बदल जतन करा (Save Changes)</span>
            </Button>
          </form>
        )}
      </Card>

      {/* Language Preference */}
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
                type="button"
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

      {/* Role-Based Permissions (RBAC) */}
      <Card className="border-krishi-border space-y-3">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-krishi-deepGreen" />
            <div>
              <CardTitle className="text-base">भूमिका व पडताळणी स्थिती (RBAC)</CardTitle>
              <CardDescription>
                सर्व्हर-स्तरीय Supabase RLS द्वारे नियंत्रित
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              {
                role: "farmer",
                label: t("roles.farmer"),
                status: t("roles.verified"),
                variant: "primary" as const,
              },
              {
                role: "buyer",
                label: t("roles.buyer"),
                status: t("roles.verified"),
                variant: "secondary" as const,
              },
              {
                role: "expert",
                label: t("roles.expert"),
                status: t("roles.pending"),
                variant: "warning" as const,
              },
              {
                role: "seller",
                label: t("roles.seller"),
                status: t("roles.pending"),
                variant: "warning" as const,
              },
              {
                role: "admin",
                label: t("roles.admin"),
                status: "प्रशासक नियंत्रण (Admin Restricted)",
                variant: "neutral" as const,
              },
            ].map((rItem) => (
              <div
                key={rItem.role}
                className="flex items-center justify-between p-3 rounded-xl bg-krishi-ivory-100 border border-krishi-border text-xs sm:text-sm"
              >
                <span className="font-semibold text-krishi-textMain">{rItem.label}</span>
                <Badge variant={rItem.variant} size="sm">
                  {rItem.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
