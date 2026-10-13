"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { GraduationCap, CheckCircle, ArrowLeft, Send } from "lucide-react";

export default function ExpertsPage() {
  const { t } = useTranslation();

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
            {t("nav.experts")}
          </h1>
          <p className="text-xs sm:text-sm text-krishi-textMuted">
            {t("landing.expertsFeatureDesc")}
          </p>
        </div>
      </div>

      <Alert
        variant="info"
        title="प्रमाणित कृषी सल्लागार प्रणाली (Expert Connect Preview)"
      >
        <span>
          टप्पा ६ मध्ये शेतकरी थेट मान्यताप्राप्त कृषी विद्यापीठ पदवीधारक व कीटकशास्त्र तज्ज्ञांना फोटो पाठवून सल्ला मागू शकतील. तज्ज्ञांची पडताळणी प्रशासक स्तरावर कागदपत्रांद्वारे केली जाते.
        </span>
      </Alert>

      <Card className="border-krishi-border space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-lg">
              डॉ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">डॉ. संजय देशमुख</CardTitle>
                <Badge variant="success" size="sm">
                  <CheckCircle className="w-3 h-3" /> प्रमाणित
                </Badge>
              </div>
              <CardDescription>
                एम.एस्सी. कृषी (कीटकशास्त्र) • १५ वर्षे अनुभव
              </CardDescription>
            </div>
          </div>

          <Button variant="outline" size="sm" disabled>
            <Send className="w-3.5 h-3.5 mr-1.5" />
            <span>सल्ला विचारा (Ask Consultation)</span>
          </Button>
        </div>

        <p className="text-xs text-krishi-textMuted leading-relaxed">
          विशेष प्राविण्य: कापूस, सोयाबीन, कांदा व डाळिंब पिकांमधील कीड व बुरशीजन्य रोग नियंत्रण.
        </p>
      </Card>
    </div>
  );
}
