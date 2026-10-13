"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Sparkles,
  Package,
  Phone,
  CheckCircle2,
  PhoneCall,
  Edit,
  ShieldCheck,
  Share2,
  Inbox,
  AlertCircle,
} from "lucide-react";
import {
  ProductListing,
  MarketplaceEnquiry,
} from "@/features/marketplace/types";
import {
  getMarketplaceListingDetailAction,
  getMyEnquiriesAction,
} from "@/features/marketplace/actions";
import { EnquiryModal } from "@/features/marketplace/EnquiryModal";
import { EditListingModal } from "@/features/marketplace/EditListingModal";
import { EnquiryList } from "@/features/marketplace/EnquiryList";

export default function ListingDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const listingId = params.id as string;

  const [listing, setListing] = useState<ProductListing | null>(null);
  const [listingEnquiries, setListingEnquiries] = useState<MarketplaceEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Default demo user ID: Ramesh Patil
  const currentUserId = "00000000-0000-0000-0000-000000000020";

  const fetchListing = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getMarketplaceListingDetailAction(listingId);
      if (!result.success || !result.data) {
        setError(result.error || "यादी सापडली नाही");
        setListing(null);
      } else {
        setListing(result.data);

        // If current user is the owner, fetch enquiries on this listing
        if (result.data.seller_id === currentUserId) {
          const enqResult = await getMyEnquiriesAction("received");
          if (enqResult.success && enqResult.data) {
            setListingEnquiries(
              enqResult.data.filter((e: MarketplaceEnquiry) => e.listing_id === listingId)
            );
          }
        }
      }
    } catch (err: any) {
      setError(err.message || "यादी आणण्यात त्रुटी आली");
    } finally {
      setLoading(false);
    }
  }, [listingId, currentUserId]);

  useEffect(() => {
    if (listingId) {
      fetchListing();
    }
  }, [listingId, fetchListing]);

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

  if (error || !listing) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 mx-auto flex items-center justify-center">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-krishi-deepGreen">
          यादी सापडली नाही (Listing Not Found)
        </h2>
        <p className="text-xs text-krishi-textMuted">
          {error || "तुम्ही शोधत असलेली शेतीमाल यादी अस्तित्वात नाही किंवा ती हटवण्यात आली आहे."}
        </p>
        <Link href="/marketplace">
          <Button variant="accent" size="md">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>बाजारपेठेकडे परत जा</span>
          </Button>
        </Link>
      </div>
    );
  }

  const isOwner = listing.seller_id === currentUserId;

  const unitLabels: Record<string, string> = {
    per_quintal: t("marketplace.unitQuintal"),
    per_kg: t("marketplace.unitKg"),
    per_crate: t("marketplace.unitCrate"),
    per_ton: t("marketplace.unitTon"),
    per_dozen: t("marketplace.unitDozen"),
  };

  const statusBadges: Record<string, { label: string; variant: "success" | "warning" | "accent" | "neutral" }> = {
    active: { label: t("marketplace.statusActive"), variant: "success" },
    paused: { label: t("marketplace.statusPaused"), variant: "warning" },
    sold_out: { label: t("marketplace.statusSoldOut"), variant: "neutral" },
    removed: { label: t("marketplace.statusRemoved"), variant: "neutral" },
  };

  const statusInfo = statusBadges[listing.status] || {
    label: listing.status,
    variant: "neutral",
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-krishi-deepGreen hover:text-krishi-primary-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t("common.back")} (बाजारपेठ)</span>
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

          {isOwner && (
            <Button
              variant="accent"
              size="sm"
              onClick={() => setShowEditModal(true)}
              className="text-xs"
            >
              <Edit className="w-3.5 h-3.5 mr-1" />
              <span>{t("marketplace.editListing")}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Main Listing Details Card */}
      <Card className="border border-krishi-border bg-white p-5 sm:p-7 space-y-6 shadow-sm">
        {/* Header Tags & Status */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="accent" size="md">
              {listing.category}
            </Badge>

            {listing.is_organic && (
              <Badge variant="success" size="md" className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-krishi-accentGreen" />
                <span>{t("marketplace.organicBadge")}</span>
              </Badge>
            )}
          </div>

          <Badge variant={statusInfo.variant} size="md">
            {statusInfo.label}
          </Badge>
        </div>

        {/* Title and Variety */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-krishi-deepGreen tracking-tight">
            {listing.commodity_name}
          </h1>
          {listing.variety && (
            <p className="text-sm sm:text-base font-semibold text-krishi-earthBrown mt-1">
              वाण (Variety): {listing.variety}
            </p>
          )}
        </div>

        {/* Price & Quantity Highlight Banner */}
        <div className="bg-krishi-primary-50 border border-krishi-primary-100 rounded-2xl p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-krishi-textMuted font-medium block">
              अपेक्षित बाजारभाव (Asking Price)
            </span>
            <div className="text-2xl sm:text-3xl font-black text-krishi-deepGreen mt-0.5">
              ₹ {listing.price_per_unit.toLocaleString("en-IN")}
              <span className="text-sm font-semibold text-krishi-textMuted ml-1.5">
                / {unitLabels[listing.price_unit] || listing.price_unit}
              </span>
            </div>
          </div>

          <div className="sm:text-right">
            <span className="text-xs text-krishi-textMuted font-medium block">
              उपलब्ध एकूण प्रमाण (Available Quantity)
            </span>
            <div className="text-xl sm:text-2xl font-black text-krishi-deepGreen flex items-center sm:justify-end gap-1.5 mt-0.5">
              <Package className="w-5 h-5 text-krishi-earthBrown" />
              <span>
                {listing.quantity_available} {unitLabels[listing.quantity_unit] || listing.quantity_unit}
              </span>
            </div>
            {listing.minimum_order_qty > 1 && (
              <span className="text-xs text-krishi-earthBrown font-semibold block mt-1">
                किमान खरेदी (Min Order): {listing.minimum_order_qty} {unitLabels[listing.quantity_unit] || ""}
              </span>
            )}
          </div>
        </div>

        {/* Description Section */}
        {listing.description && (
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-krishi-deepGreen">
              शेतीमालाचा सविस्तर तपशील (Description)
            </h3>
            <p className="text-xs sm:text-sm text-krishi-deepGreen/90 leading-relaxed whitespace-pre-wrap bg-krishi-primary-50/30 p-4 rounded-xl border border-krishi-border/60">
              {listing.description}
            </p>
          </div>
        )}

        {/* Specifications Table */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-krishi-deepGreen">
            तांत्रिक माहिती व ठिकाण (Specifications)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="p-3 bg-white border border-krishi-border rounded-xl flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-krishi-earthBrown shrink-0" />
              <div>
                <span className="text-[11px] text-krishi-textMuted block">जिल्हा व तालुका</span>
                <span className="font-semibold text-krishi-deepGreen">
                  {listing.location_district}
                  {listing.location_taluka ? `, ${listing.location_taluka}` : ""}
                </span>
              </div>
            </div>

            {listing.harvest_date && (
              <div className="p-3 bg-white border border-krishi-border rounded-xl flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-krishi-primary-600 shrink-0" />
                <div>
                  <span className="text-[11px] text-krishi-textMuted block">{t("marketplace.harvestDate")}</span>
                  <span className="font-semibold text-krishi-deepGreen">
                    {listing.harvest_date}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seller Profile Card */}
        {listing.seller && (
          <div className="p-4 sm:p-5 bg-krishi-primary-50/70 border border-krishi-primary-100 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-krishi-deepGreen text-white font-bold flex items-center justify-center text-lg shrink-0">
                {listing.seller.full_name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-krishi-deepGreen text-sm sm:text-base">
                    {listing.seller.full_name}
                  </h4>
                  {listing.seller.is_verified && (
                    <CheckCircle2 className="w-4 h-4 text-krishi-accentGreen" />
                  )}
                </div>
                <p className="text-xs text-krishi-textMuted">
                  {listing.seller.role === "farmer" ? "प्रमाणित शेतकरी" : "कृषी विक्रेता"} • {listing.seller.district}
                </p>
              </div>
            </div>

            {listing.seller.phone_number && (
              <a
                href={`tel:${listing.seller.phone_number}`}
                className="w-full sm:w-auto"
              >
                <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs font-semibold">
                  <Phone className="w-3.5 h-3.5 mr-1.5 text-krishi-accentGreen" />
                  <span>{listing.seller.phone_number}</span>
                </Button>
              </a>
            )}
          </div>
        )}

        {/* Direct Contact Policy Alert */}
        <Alert variant="warning" title={t("marketplace.directPolicyTitle")}>
          <span>{t("marketplace.directPolicyNotice")}</span>
        </Alert>

        {/* Bottom CTA Button */}
        {!isOwner ? (
          listing.status === "active" ? (
            <Button
              variant="accent"
              size="lg"
              onClick={() => setShowEnquiryModal(true)}
              className="w-full text-sm sm:text-base font-bold shadow-lg py-3.5"
            >
              <PhoneCall className="w-5 h-5 mr-2" />
              <span>{t("marketplace.sendEnquiry")}</span>
            </Button>
          ) : (
            <div className="p-3 text-center bg-gray-50 text-krishi-textMuted rounded-xl font-medium text-xs">
              हा शेतीमाल सध्या उपलब्ध नाही ({statusInfo.label})
            </div>
          )
        ) : (
          <div className="p-3.5 bg-krishi-primary-50 rounded-xl border border-krishi-primary-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-krishi-deepGreen">
              ही आपली स्वतःची यादी आहे (Your Own Listing)
            </span>
            <Button
              variant="accent"
              size="sm"
              onClick={() => setShowEditModal(true)}
            >
              <Edit className="w-3.5 h-3.5 mr-1" />
              <span>{t("marketplace.editListing")}</span>
            </Button>
          </div>
        )}
      </Card>

      {/* Received Enquiries Section (Visible only to Listing Owner) */}
      {isOwner && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-krishi-deepGreen flex items-center gap-2">
              <Inbox className="w-4 h-4 text-krishi-accentGreen" />
              <span>या यादीवर प्राप्त झालेल्या चौकशी ({listingEnquiries.length})</span>
            </h2>
          </div>

          <EnquiryList
            enquiries={listingEnquiries}
            currentUserId={currentUserId}
            onRefresh={fetchListing}
          />
        </div>
      )}

      {/* Modals */}
      {showEnquiryModal && (
        <EnquiryModal
          isOpen={showEnquiryModal}
          listing={listing}
          onClose={() => setShowEnquiryModal(false)}
          onSuccess={() => {
            setShowEnquiryModal(false);
            router.push("/marketplace");
          }}
        />
      )}

      {showEditModal && (
        <EditListingModal
          isOpen={showEditModal}
          listing={listing}
          onClose={() => setShowEditModal(false)}
          onSuccess={fetchListing}
        />
      )}
    </div>
  );
}
