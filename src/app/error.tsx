"use client";

import React, { useEffect } from "react";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { RefreshCw, AlertTriangle } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation();

  useEffect(() => {
    console.error("App boundary caught error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-krishi-warmIvory p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-krishi-border p-6 sm:p-8 text-center space-y-4 shadow-subtle">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-krishi-deepGreen">
          {t("errors.somethingWentWrong")}
        </h2>
        <p className="text-sm text-krishi-textMuted leading-relaxed">
          {t("errors.somethingWentWrongDesc")}
        </p>
        <div className="pt-2">
          <Button
            variant="primary"
            size="md"
            onClick={() => reset()}
            className="w-full sm:w-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            <span>{t("common.tryAgain")}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
