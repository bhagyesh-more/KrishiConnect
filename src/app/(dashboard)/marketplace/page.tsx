"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  Store,
  Plus,
  ArrowLeft,
  Sparkles,
  Inbox,
  RefreshCw,
  SearchX,
} from "lucide-react";
import { MarketplaceFilters } from "@/features/marketplace/MarketplaceFilters";
import { ListingCard } from "@/features/marketplace/ListingCard";
import { CreateListingModal } from "@/features/marketplace/CreateListingModal";
import { EditListingModal } from "@/features/marketplace/EditListingModal";
import { EnquiryModal } from "@/features/marketplace/EnquiryModal";
import { EnquiryList } from "@/features/marketplace/EnquiryList";
import {
  ProductListing,
  MarketplaceEnquiry,
  CommodityCategory,
} from "@/features/marketplace/types";
import {
  getMarketplaceListingsAction,
  getMyEnquiriesAction,
} from "@/features/marketplace/actions";

export default function MarketplacePage() {
  const { t } = useTranslation();

  // Filter States
  const [activeTab, setActiveTab] = useState<"browse" | "my_listings" | "my_enquiries">("browse");
  const [selectedCategory, setSelectedCategory] = useState<CommodityCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedTaluka, setSelectedTaluka] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "price_asc" | "price_desc">("newest");

  // Data States
  const [listings, setListings] = useState<ProductListing[]>([]);
  const [enquiries, setEnquiries] = useState<MarketplaceEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedForEdit, setSelectedForEdit] = useState<ProductListing | null>(null);
  const [selectedForEnquiry, setSelectedForEnquiry] = useState<ProductListing | null>(null);

  // Default demo user ID: Ramesh Patil (farmer)
  const currentUserId = "00000000-0000-0000-0000-000000000020";

  const fetchListings = useCallback(async () => {
    try {
      const result = await getMarketplaceListingsAction({
        category: selectedCategory,
        search: searchQuery,
        district: selectedDistrict,
        taluka: selectedTaluka,
        sortBy,
        sellerId: activeTab === "my_listings" ? currentUserId : undefined,
      });

      if (result.success && result.data) {
        setListings(result.data.listings);
      }
    } catch (err) {
      console.error(err);
    }
  }, [selectedCategory, searchQuery, selectedDistrict, selectedTaluka, sortBy, activeTab, currentUserId]);

  const fetchEnquiries = useCallback(async () => {
    try {
      const result = await getMyEnquiriesAction("all");
      if (result.success && result.data) {
        setEnquiries(result.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    if (activeTab === "my_enquiries") {
      await fetchEnquiries();
    } else {
      await fetchListings();
    }
    setLoading(false);
  }, [activeTab, fetchListings, fetchEnquiries]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (activeTab === "my_enquiries") {
      await fetchEnquiries();
    } else {
      await fetchListings();
    }
    setRefreshing(false);
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
                <Store className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-extrabold text-krishi-deepGreen tracking-tight">
                {t("marketplace.title")}
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-krishi-textMuted">
            {t("marketplace.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="md"
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1 ${refreshing ? "animate-spin" : ""}`} />
            <span>रिफ्रेश</span>
          </Button>

          <Button
            variant="accent"
            size="md"
            onClick={() => setShowCreateModal(true)}
            className="flex-1 sm:flex-initial shadow-md"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span>{t("marketplace.createListing")}</span>
          </Button>
        </div>
      </div>

      {/* Direct Contact Policy Alert Banner */}
      <Alert
        variant="warning"
        title={t("marketplace.directPolicyTitle")}
      >
        <span>
          {t("marketplace.directPolicyNotice")}
        </span>
      </Alert>

      {/* Filter and Tab Navigation Controls */}
      <MarketplaceFilters
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedDistrict={selectedDistrict}
        onSelectDistrict={setSelectedDistrict}
        selectedTaluka={selectedTaluka}
        onSelectTaluka={setSelectedTaluka}
        sortBy={sortBy}
        onSortChange={setSortBy}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Content Rendering: Enquiries Tab vs Listings Grid */}
      {activeTab === "my_enquiries" ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-krishi-deepGreen flex items-center gap-2">
              <Inbox className="w-4 h-4 text-krishi-accentGreen" />
              <span>{t("marketplace.myEnquiries")}</span>
            </h2>
            <span className="text-xs text-krishi-textMuted font-medium">
              एकूण: {enquiries.length}
            </span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 bg-white rounded-2xl border border-krishi-border space-y-2">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <EnquiryList
              enquiries={enquiries}
              currentUserId={currentUserId}
              onRefresh={fetchEnquiries}
            />
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Active section header */}
          <div className="flex items-center justify-between text-xs text-krishi-textMuted">
            <span className="font-semibold text-krishi-deepGreen">
              {activeTab === "my_listings"
                ? `माझ्या नोंदवलेल्या याद्या (${listings.length})`
                : `उपलब्ध शेतीमाल याद्या (${listings.length})`}
            </span>
            {selectedCategory !== "all" && (
              <span className="bg-krishi-primary-100 text-krishi-deepGreen px-2 py-0.5 rounded-full font-medium">
                वर्ग: {selectedCategory}
              </span>
            )}
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-krishi-border p-4 space-y-3"
                >
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-16 w-full rounded-xl" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-9 w-full rounded-xl" />
                </div>
              ))}
            </div>
          ) : listings.length === 0 ? (
            /* Empty state */
            <div className="bg-white rounded-2xl border border-krishi-border p-10 text-center space-y-3.5">
              <div className="w-14 h-14 rounded-full bg-krishi-primary-50 text-krishi-deepGreen mx-auto flex items-center justify-center">
                <SearchX className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-krishi-deepGreen text-base">
                {t("marketplace.noListingsFound")}
              </h3>
              <p className="text-xs text-krishi-textMuted max-w-sm mx-auto">
                {activeTab === "my_listings"
                  ? "तुम्ही अद्याप कोणताही शेतीमाल नोंदवलेला नाही. वर दिलेल्या बटनावर क्लिक करून नवीन यादी तयार करा."
                  : "निवडलेल्या निकषांनुसार सध्या कोणताही शेतीमाल उपलब्ध नाही. कृपया इतर जिल्हा किंवा वर्ग निवडून पहा."}
              </p>
              <Button
                variant="accent"
                size="sm"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="w-4 h-4 mr-1.5" />
                <span>{t("marketplace.createListing")}</span>
              </Button>
            </div>
          ) : (
            /* Listings Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  currentUserId={currentUserId}
                  onEnquireClick={(l) => setSelectedForEnquiry(l)}
                  onEditClick={(l) => setSelectedForEdit(l)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Demo helper banner */}
      <div className="bg-krishi-primary-50/70 border border-krishi-primary-100 rounded-2xl p-4 text-xs text-krishi-textMuted flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-krishi-accentGreen" />
          <span>
            <strong>डेमो मोड:</strong> महाराष्ट्र राज्य शेतीमाल बाजारपेठ (नाशिक, जळगाव, कोल्हापूर, पुणे, लातूर). थेट संपर्क चौकशी आणि यादी व्यवस्थापन सक्रिय आहे.
          </span>
        </div>
        <span className="text-[11px] font-semibold text-krishi-deepGreen bg-white px-2.5 py-1 rounded-lg border border-krishi-border">
          Phase 4B Demo
        </span>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateListingModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleRefresh}
        />
      )}

      {selectedForEdit && (
        <EditListingModal
          isOpen={!!selectedForEdit}
          listing={selectedForEdit}
          onClose={() => setSelectedForEdit(null)}
          onSuccess={handleRefresh}
        />
      )}

      {selectedForEnquiry && (
        <EnquiryModal
          isOpen={!!selectedForEnquiry}
          listing={selectedForEnquiry}
          onClose={() => setSelectedForEnquiry(null)}
          onSuccess={() => {
            setSelectedForEnquiry(null);
            setActiveTab("my_enquiries");
            fetchEnquiries();
          }}
        />
      )}
    </div>
  );
}
