"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { signInAction } from "@/features/auth/actions";
import { LogIn, UserPlus, KeyRound, AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";

function LoginFormContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/home";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const res = await signInAction({ email, password });
      if (res.success) {
        setSuccessMsg(res.message || "लॉगिन यशस्वी!");
        setTimeout(() => {
          router.push(redirectTo);
        }, 600);
      } else {
        setErrorMsg(res.error || "लॉगिन अयशस्वी झाले.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "काहीतरी चूक झाली.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-krishi-border shadow-card p-6 sm:p-8 space-y-6">
      <CardHeader className="text-center flex-col items-center mb-0">
        <div className="w-12 h-12 rounded-2xl bg-krishi-primary-50 text-krishi-deepGreen flex items-center justify-center mb-2 shadow-subtle">
          <LogIn className="w-6 h-6" />
        </div>
        <CardTitle className="text-2xl font-black text-krishi-deepGreen">
          खात्यात प्रवेश करा (Log In)
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          {t("app.subTagline")}
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
        <Input
          label="ईमेल आयडी (Email Address)"
          type="email"
          required
          autoComplete="email"
          placeholder="shree@krishi.demo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="space-y-1">
          <Input
            label="पासवर्ड (Password)"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-krishi-deepGreen hover:underline"
            >
              पासवर्ड विसरलात? (Forgot Password?)
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full mt-2"
        >
          <LogIn className="w-4 h-4 mr-2" />
          <span>लॉगिन करा (Log In)</span>
        </Button>
      </form>

      <div className="pt-4 border-t border-krishi-border/80 text-center space-y-3">
        <p className="text-xs text-krishi-textMuted">
          नवीन खाते उघडायचे आहे?{" "}
          <Link
            href="/register"
            className="font-bold text-krishi-deepGreen hover:underline inline-flex items-center gap-1"
          >
            येथे नोंदणी करा (Register)
          </Link>
        </p>

        {/* Security & Setup Advisory Note */}
        <div className="p-3 bg-krishi-ivory-100 rounded-xl text-left border border-krishi-border text-[11px] text-krishi-textMuted space-y-1">
          <div className="font-bold text-krishi-deepGreen flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-krishi-deepGreen" />
            <span>सुरक्षित प्रमाणीकरण (Supabase Auth & RLS)</span>
          </div>
          <p>
            क्लाउड प्रमाणीकरणासाठी `.env.local` मध्ये Supabase क्रेडेंशियल्स आवश्यक आहेत.
          </p>
        </div>
      </div>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <Card className="border-krishi-border shadow-card p-8 text-center text-sm text-krishi-textMuted">
          माहिती लोड होत आहे... (Loading Login...)
        </Card>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
