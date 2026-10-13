"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { Store, Plus, MapPin, Phone, ShieldCheck, ArrowLeft } from "lucide-react";

export default function MarketplacePage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/home"
              className="md:hidden text-krishi-textMuted hover:text-krishi-deepGreen p-1 -ml-1 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-extrabold text-krishi-deepGreen">
              {t("nav.marketplace")}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-krishi-textMuted">
            {t("landing.marketFeatureDesc")}
          </p>
        </div>

        <Button variant="accent" size="md" disabled className="opacity-90">
          <Plus className="w-4 h-4 mr-1.5" />
          <span>शेतीमाल विका (Post Listing)</span>
        </Button>
      </div>

      {/* Direct Contact Policy & Foundation Alert */}
      <Alert
        variant="warning"
        title="थेट बाजार नीती (Direct Contact Model)"
      >
        <span>
          पहिल्या टप्प्यात ऑन-प्लॅटफॉर्म ऑनलाइन पेमेंट किंवा डिलिव्हरी समाविष्ट नाही. खरेदीदार व शेतकरी थेट संपर्क साधून मालाची पाहणी करून रोख/UPI द्वारे व्यवहार करतील. (टप्पा ५ मध्ये प्रत्यक्ष यादी व चौकशी व्यवस्थापन सुरू होईल).
        </span>
      </Alert>

      {/* Sample Produce Cards Preview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Sample 1: Onion */}
        <Card className="border-krishi-border flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="accent" size="sm">भाजीपाला</Badge>
              <span className="text-xs text-krishi-textMuted flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-krishi-earthBrown" /> नाशिक (Nashik)
              </span>
            </div>

            <div>
              <CardTitle className="text-lg">लाल कांदा (Nashik Red Onion)</CardTitle>
              <CardDescription>उत्कृष्ट गुणवत्ता, साठवणुकीस योग्य</CardDescription>
            </div>

            <div className="bg-krishi-ivory-100 rounded-xl p-3 border border-krishi-border space-y-1">
              <div className="text-xs text-krishi-textMuted">अपेक्षित दर</div>
              <div className="text-lg font-black text-krishi-deepGreen">
                ₹१,८०० <span className="text-xs font-normal text-krishi-textMuted">/ क्विंटल</span>
              </div>
              <div className="text-[11px] text-krishi-textMuted font-medium">
                उपलब्ध साठा: ५० क्विंटल
              </div>
            </div>
          </div>

          <div className="pt-4 mt-auto">
            <Button variant="outline" size="sm" className="w-full" disabled>
              <Phone className="w-3.5 h-3.5 mr-1.5" />
              <span>शेतकऱ्यांशी संपर्क (Contact Farmer)</span>
            </Button>
          </div>
        </Card>

        {/* Sample 2: Soybean */}
        <Card className="border-krishi-border flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" size="sm">तेलबिया</Badge>
              <span className="text-xs text-krishi-textMuted flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-krishi-earthBrown" /> कोल्हापूर (Kolhapur)
              </span>
            </div>

            <div>
              <CardTitle className="text-lg">सोयाबीन (JS 335 Soybean)</CardTitle>
              <CardDescription>स्वच्छ, ग्रेडिंग केलेले, उच्च तेल प्रमाण</CardDescription>
            </div>

            <div className="bg-krishi-ivory-100 rounded-xl p-3 border border-krishi-border space-y-1">
              <div className="text-xs text-krishi-textMuted">अपेक्षित दर</div>
              <div className="text-lg font-black text-krishi-deepGreen">
                ₹४,६०० <span className="text-xs font-normal text-krishi-textMuted">/ क्विंटल</span>
              </div>
              <div className="text-[11px] text-krishi-textMuted font-medium">
                उपलब्ध साठा: २५ क्विंटल
              </div>
            </div>
          </div>

          <div className="pt-4 mt-auto">
            <Button variant="outline" size="sm" className="w-full" disabled>
              <Phone className="w-3.5 h-3.5 mr-1.5" />
              <span>शेतकऱ्यांशी संपर्क (Contact Farmer)</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
