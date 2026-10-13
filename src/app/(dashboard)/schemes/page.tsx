"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { FileText, ExternalLink, ArrowLeft, Bookmark } from "lucide-react";

export default function SchemesPage() {
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
            {t("nav.schemes")}
          </h1>
          <p className="text-xs sm:text-sm text-krishi-textMuted">
            {t("landing.schemesFeatureDesc")}
          </p>
        </div>
      </div>

      {/* Official Channel Disclaimer */}
      <Alert
        variant="info"
        title="शासकीय माहितीची अधिकृतता (Official Channels Notice)"
      >
        <span>
          कृषीकनेक्ट केवळ मार्गदर्शक माहिती व महाडीबीटी (MahaDBT) व केंद्र शासनाच्या अधिकृत पोर्टलच्या थेट लिंक्स प्रदान करते. अर्जाची प्रत्यक्ष छाननी व मंजुरी शासनाद्वारेच केली जाते. (टप्पा ६ मध्ये सर्व योजनांचा कॅटलॉग सक्रिय होईल).
        </span>
      </Alert>

      {/* Sample Scheme Card Preview */}
      <Card className="border-krishi-border space-y-3">
        <CardHeader>
          <div className="flex items-start justify-between w-full gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="primary" size="sm">महाराष्ट्र शासन</Badge>
                <Badge variant="secondary" size="sm">ठिबक सिंचन अनुदान</Badge>
              </div>
              <CardTitle className="text-lg">
                महाडीबीटी सूक्ष्म सिंचन योजना (MahaDBT Micro Irrigation)
              </CardTitle>
            </div>
            <Bookmark className="w-5 h-5 text-krishi-textMuted cursor-pointer hover:text-krishi-deepGreen" />
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="text-xs sm:text-sm text-krishi-textMuted leading-relaxed">
            अल्प व अत्यल्प भूधारक शेतकऱ्यांना ठिबक व तुषार सिंचन संच बसविण्यासाठी शासनाकडून ५५% ते ८०% पर्यंत अनुदान दिले जाते.
          </p>

          <div className="bg-krishi-ivory-100 p-3 rounded-xl border border-krishi-border text-xs text-krishi-textMain space-y-1">
            <span className="font-bold text-krishi-deepGreen">आवश्यक कागदपत्रे:</span>
            <p className="text-krishi-textMuted">७/१२ उतारा, ८-अ, आधार कार्ड, बँक पासबुक, पाण्याचा स्रोत दाखला</p>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <a
              href="https://mahadbt.maharashtra.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-krishi-deepGreen hover:underline"
            >
              <span>अधिकृत MahaDBT पोर्टल</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <span className="text-[11px] text-krishi-textMuted">सत्यापित: ऑक्टोबर २०२६</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
