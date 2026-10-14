"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { Alert } from "@/components/ui/Alert";
import { Skeleton } from "@/components/ui/Skeleton";
import { FileText, ArrowLeft, RefreshCw, SearchX, HelpCircle } from "lucide-react";
import { SchemeFilters } from "@/features/schemes/SchemeFilters";
import { SchemeCard } from "@/features/schemes/SchemeCard";
import { EligibilityCheckerModal } from "@/features/schemes/EligibilityCheckerModal";
import { GovernmentScheme, SchemeCategory } from "@/features/schemes/types";
import { getSchemesAction, toggleSaveSchemeAction } from "@/features/schemes/actions";

export default function SchemesPage() {
  const { t } = useTranslation();

  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<SchemeCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [onlySaved, setOnlySaved] = useState(false);

  const [assessingScheme, setAssessingScheme] = useState<GovernmentScheme | null>(null);

  const fetchSchemes = useCallback(async () => {
    try {
      const result = await getSchemesAction({
        category: selectedCategory,
        search: searchQuery,
        onlySaved,
      });

      if (result.success && result.data) {
        setSchemes(result.data.schemes);
      }
    } catch (err) {
      console.error(err);
    }
  }, [selectedCategory, searchQuery, onlySaved]);

  useEffect(() => {
    setLoading(true);
    fetchSchemes().finally(() => setLoading(false));
  }, [fetchSchemes]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSchemes();
    setRefreshing(false);
  };

  const handleBookmarkToggle = async (schemeId: string) => {
    try {
      const result = await toggleSaveSchemeAction(schemeId);
      if (result.success) {
        setSchemes((prev) =>
          prev.map((s) => (s.id === schemeId ? { ...s, is_saved: result.data.saved } : s))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
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
            <div className="flex items-center gap-2">
              <div className="p-2 bg-krishi-primary-100 text-krishi-deepGreen rounded-xl">
                <FileText className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-extrabold text-krishi-deepGreen tracking-tight">
                {t("nav.schemes")}
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-krishi-textMuted">
            महाराष्ट्र व केंद्र शासनाच्या कृषी योजना, अनुदान व पीक विमा सविस्तर माहिती
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing || loading}
          className="text-xs text-krishi-deepGreen font-semibold px-3 py-1.5 rounded-lg border border-krishi-border bg-white hover:bg-krishi-primary-50/50 transition flex items-center gap-1.5 self-end sm:self-auto shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          <span>रिफ्रेश</span>
        </button>
      </div>

      {/* Official Channel Disclaimer */}
      <Alert
        variant="info"
        title="शासकीय माहिती व अधिकृत पोर्टल थेट दुवे"
      >
        <span>
          कृषीकनेक्ट केवळ मार्गदर्शक माहिती व महाडीबीटी (MahaDBT) व केंद्र शासनाच्या अधिकृत पोर्टलचे थेट दुवे प्रदान करते. कोणत्याही योजनेचा अर्ज, छाननी व मंजुरी संबंधित शासकीय प्राधिकरणाद्वारेच केली जाते.
        </span>
      </Alert>

      {/* Search & Filters */}
      <SchemeFilters
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onlySaved={onlySaved}
        onToggleSaved={setOnlySaved}
      />

      {/* Schemes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-krishi-border p-5 space-y-3">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : schemes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-krishi-border p-10 text-center space-y-3.5">
          <div className="w-14 h-14 rounded-full bg-krishi-primary-50 text-krishi-deepGreen mx-auto flex items-center justify-center">
            <SearchX className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-krishi-deepGreen text-base">
            कोणतीही योजना सापडली नाही
          </h3>
          <p className="text-xs text-krishi-textMuted max-w-sm mx-auto">
            {onlySaved
              ? "आपण अद्याप कोणतीही योजना जतन केलेली नाही."
              : "निवडलेल्या निकषांनुसार योजना उपलब्ध नाहीत. कृपया इतर वर्ग निवडून पहा."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {schemes.map((scheme) => (
            <SchemeCard
              key={scheme.id}
              scheme={scheme}
              onBookmarkToggle={handleBookmarkToggle}
              onCheckEligibility={(s) => setAssessingScheme(s)}
            />
          ))}
        </div>
      )}

      {/* Eligibility Modal */}
      {assessingScheme && (
        <EligibilityCheckerModal
          isOpen={!!assessingScheme}
          scheme={assessingScheme}
          onClose={() => setAssessingScheme(null)}
        />
      )}
    </div>
  );
}
