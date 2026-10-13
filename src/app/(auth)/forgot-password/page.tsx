"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { resetPasswordAction } from "@/features/auth/actions";
import { KeyRound, ArrowLeft, Mail, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const res = await resetPasswordAction({ email });
      if (res.success) {
        setSuccessMsg(res.message || "रीसेट लिंक पाठवण्यात आली.");
      } else {
        setErrorMsg(res.error || "विनंती अयशस्वी झाली.");
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
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-2 shadow-subtle">
          <KeyRound className="w-6 h-6" />
        </div>
        <CardTitle className="text-2xl font-black text-krishi-deepGreen">
          पासवर्ड पुनर्प्राप्ती (Reset Password)
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          आपला नोंदणीकृत ईमेल प्रविष्ट करा, आम्ही पासवर्ड रीसेट लिंक पाठवू.
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
          label="नोंदणीकृत ईमेल (Registered Email)"
          type="email"
          required
          autoComplete="email"
          placeholder="shree@krishi.demo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full mt-2"
        >
          <Mail className="w-4 h-4 mr-2" />
          <span>रीसेट लिंक पाठवा (Send Reset Link)</span>
        </Button>
      </form>

      <div className="pt-4 border-t border-krishi-border/80 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-krishi-deepGreen hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>लॉगिन पानावर परत जा (Back to Login)</span>
        </Link>
      </div>
    </Card>
  );
}
