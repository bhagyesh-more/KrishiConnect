"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  ArrowLeft,
  Building,
  Bookmark,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  ListOrdered,
  HelpCircle,
  AlertCircle,
  Share2,
} from "lucide-react";
import { GovernmentScheme } from "@/features/schemes/types";
import { getSchemeDetailAction, toggleSaveSchemeAction } from "@/features/schemes/actions";
import { EligibilityCheckerModal } from "@/features/schemes/EligibilityCheckerModal";

export default function SchemeDetailPage() {
  const { language } = useTranslation();
  const params = useParams();
  const schemeId = params.id as string;

  const [scheme, setScheme] = useState<GovernmentScheme | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEligibilityModal, setShowEligibilityModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchScheme = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getSchemeDetailAction(schemeId);
      if (!result.success || !result.data) {
        setError(result.error || "योजना सापडली नाही");
        setScheme(null);
      } else {
        setScheme(result.data);
      }
    } catch (err: any) {
      setError(err.message || "योजना आणण्यात त्रुटी आली");
    } finally {
      setLoading(false);
    }
  }, [schemeId]);

  useEffect(() => {
    if (schemeId) {
      fetchScheme();
    }
  }, [schemeId, fetchScheme]);

  const handleBookmarkToggle = async () => {
    if (!scheme) return;
    try {
      const result = await toggleSaveSchemeAction(scheme.id);
      if (result.success) {
        setScheme((prev) => (prev ? { ...prev, is_saved: result.data.saved } : null));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto pb-12">
        <Skeleton className="h-8 w-32" />
        <Card className="p-6 space-y-4">
          <Skeleton className="h-7 w-2/3" />
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full" />
        </Card>
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 mx-auto flex items-center justify-center">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-krishi-deepGreen">
          योजना सापडली नाही (Scheme Not Found)
        </h2>
        <p className="text-xs text-krishi-textMuted">
          {error || "तुम्ही शोधत असलेली शासकीय योजना अस्तित्वात नाही किंवा ती हलवण्यात आली आहे."}
        </p>
        <Link href="/schemes">
          <Button variant="accent" size="md">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>सर्व योजनांकडे परत जा</span>
          </Button>
        </Link>
      </div>
    );
  }

  const title = language === "en" ? scheme.title_en : language === "hi" ? scheme.title_hi : scheme.title_mr;
  const summary = language === "en" ? scheme.summary_en : language === "hi" ? scheme.summary_hi : scheme.summary_mr;
  const benefits = language === "en" ? scheme.benefits_description_en : language === "hi" ? scheme.benefits_description_hi : scheme.benefits_description_mr;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Navigation */}
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/schemes"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-krishi-deepGreen hover:text-krishi-primary-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>सर्व योजना (Schemes Directory)</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="text-xs"
          >
            <Share2 className="w-3.5 h-3.5 mr-1" />
            <span>{copiedLink ? "लिंक कॉपी झाली!" : "शेअर"}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleBookmarkToggle}
            className="text-xs font-semibold"
          >
            <Bookmark className={`w-3.5 h-3.5 mr-1 ${scheme.is_saved ? "fill-krishi-deepGreen text-krishi-deepGreen" : ""}`} />
            <span>{scheme.is_saved ? "जतन केली" : "जतन करा"}</span>
          </Button>
        </div>
      </div>

      {/* Main Content Card */}
      <Card className="border border-krishi-border bg-white p-5 sm:p-7 space-y-6 shadow-sm">
        {/* Header Tags & Code */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Badge variant="accent" size="md">
              {scheme.category}
            </Badge>
            <span className="text-xs font-bold text-krishi-earthBrown bg-krishi-primary-50 px-2.5 py-1 rounded-lg border border-krishi-primary-100">
              {scheme.scheme_code}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-krishi-textMuted">
            <ShieldCheck className="w-4 h-4 text-krishi-accentGreen" />
            <span>माहिती पडताळणी: {scheme.last_verified_date}</span>
          </div>
        </div>

        {/* Scheme Title & Admin Body */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-krishi-deepGreen tracking-tight">
            {title}
          </h1>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-krishi-earthBrown font-semibold mt-1.5">
            <Building className="w-4 h-4 text-krishi-earthBrown shrink-0" />
            <span>प्रशासकीय विभाग: {scheme.administering_body}</span>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-krishi-primary-50/50 p-4 rounded-2xl border border-krishi-primary-100/70 text-xs sm:text-sm text-krishi-deepGreen/90 leading-relaxed">
          {summary}
        </div>

        {/* Benefits Section */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-krishi-deepGreen">
            योजनेचे स्वरूप व लाभ (Benefits & Subsidy Details)
          </h3>
          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-emerald-900 leading-relaxed font-medium">
            {benefits}
          </div>
        </div>

        {/* Eligibility Criteria */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-krishi-deepGreen">
              पात्रता निकष व अटी (Eligibility Criteria)
            </h3>
            <Button
              variant="accent"
              size="sm"
              onClick={() => setShowEligibilityModal(true)}
              className="text-xs font-semibold"
            >
              <HelpCircle className="w-3.5 h-3.5 mr-1" />
              <span>पात्रता तपासा</span>
            </Button>
          </div>

          <div className="bg-white border border-krishi-border rounded-2xl p-4 space-y-2">
            <div className="text-xs font-semibold text-krishi-textMuted mb-1">
              लक्षित लाभार्थी: <strong className="text-krishi-deepGreen">{scheme.beneficiary_type}</strong>
            </div>
            <ul className="space-y-2">
              {scheme.eligibility_criteria.map((crit, idx) => (
                <li key={idx} className="text-xs text-krishi-deepGreen flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-krishi-accentGreen shrink-0 mt-0.5" />
                  <span>{language === "en" && crit.label_en ? crit.label_en : crit.label_mr}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Required Documents */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-krishi-deepGreen flex items-center gap-1.5">
            <FileCheck className="w-4 h-4 text-krishi-earthBrown" />
            <span>आवश्यक कागदपत्रे (Required Documents)</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {scheme.documents_required.map((doc, idx) => (
              <div key={idx} className="p-2.5 bg-krishi-primary-50/50 border border-krishi-border/80 rounded-xl flex items-center gap-2 text-krishi-deepGreen">
                <span className="w-5 h-5 rounded-full bg-krishi-primary-100 text-krishi-deepGreen font-bold flex items-center justify-center text-[10px] shrink-0">
                  {idx + 1}
                </span>
                <span>{doc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Application Steps */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-krishi-deepGreen flex items-center gap-1.5">
            <ListOrdered className="w-4 h-4 text-krishi-deepGreen" />
            <span>अर्ज प्रक्रिया व टप्पे (Application Steps)</span>
          </h3>
          <div className="bg-white border border-krishi-border rounded-2xl p-4 space-y-2.5 text-xs">
            {scheme.application_steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-krishi-deepGreen">
                <span className="font-bold text-krishi-deepGreen bg-krishi-primary-100 px-2 py-0.5 rounded text-[11px] shrink-0">
                  टप्पा {idx + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Official Portal CTA */}
        {scheme.official_portal_url && (
          <div className="p-4 sm:p-5 bg-gradient-to-r from-krishi-deepGreen to-krishi-primary-800 rounded-2xl text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
            <div>
              <h4 className="font-bold text-sm sm:text-base">
                शासनाच्या अधिकृत पोर्टलवर अर्ज करा
              </h4>
              <p className="text-xs text-white/80 mt-0.5">
                अधिकृत संकेतस्थळ: {scheme.official_portal_url}
              </p>
            </div>

            <a
              href={scheme.official_portal_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button variant="accent" size="md" className="w-full sm:w-auto font-bold bg-white text-krishi-deepGreen hover:bg-white/90">
                <span>पोर्टल उघडा (Open Portal)</span>
                <ExternalLink className="w-4 h-4 ml-1.5" />
              </Button>
            </a>
          </div>
        )}

        {/* Official Channel Disclaimer */}
        <Alert variant="info" title="शासकीय अधिकृतता सूचना">
          <span>
            कृषीकनेक्ट थेट अनुदानाची रक्कम वितरित करत नाही किंवा अर्जाची छाननी करत नाही. सर्व अर्ज अधिकृत शासकीय पोर्टल (उदा. MahaDBT / PM-KISAN) द्वारेच भरले जातात.
          </span>
        </Alert>
      </Card>

      {/* Eligibility Modal */}
      {showEligibilityModal && (
        <EligibilityCheckerModal
          isOpen={showEligibilityModal}
          scheme={scheme}
          onClose={() => setShowEligibilityModal(false)}
        />
      )}
    </div>
  );
}
