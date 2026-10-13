"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  MessageSquare,
  Phone,
  User,
  Clock,
  CheckCircle,
  XCircle,
  Archive,
  PhoneCall,
  Loader2,
} from "lucide-react";
import { MarketplaceEnquiry, EnquiryStatus } from "./types";
import { updateEnquiryStatusAction } from "./actions";

interface EnquiryListProps {
  enquiries: MarketplaceEnquiry[];
  currentUserId: string;
  onRefresh: () => void;
}

export const EnquiryList: React.FC<EnquiryListProps> = ({
  enquiries,
  currentUserId,
  onRefresh,
}) => {
  const { t } = useTranslation();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const statusBadges: Record<
    EnquiryStatus,
    { label: string; variant: "accent" | "warning" | "success" | "neutral" }
  > = {
    new: { label: t("marketplace.enquiryNew"), variant: "accent" },
    contacted: { label: t("marketplace.enquiryContacted"), variant: "warning" },
    accepted: { label: t("marketplace.enquiryAccepted"), variant: "success" },
    declined: { label: t("marketplace.enquiryDeclined"), variant: "neutral" },
    closed: { label: t("marketplace.enquiryClosed"), variant: "neutral" },
  };

  const handleStatusUpdate = async (enquiryId: string, newStatus: EnquiryStatus) => {
    setUpdatingId(enquiryId);
    try {
      await updateEnquiryStatusAction({
        enquiryId,
        status: newStatus,
        statusNotes: `स्थिती बदलली: ${newStatus}`,
      });
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (enquiries.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-krishi-border p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-krishi-primary-50 text-krishi-deepGreen mx-auto flex items-center justify-center">
          <MessageSquare className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-krishi-deepGreen text-base">
          {t("marketplace.noEnquiriesFound")}
        </h3>
        <p className="text-xs text-krishi-textMuted max-w-sm mx-auto">
          अद्याप कोणतीही चौकशी उपलब्ध नाही. शेतीमालाची यादी नोंदवून किंवा बाजारपेठेतील मालावर चौकशी पाठवून संवाद सुरू करा.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {enquiries.map((enquiry) => {
        const isSeller = enquiry.seller_id === currentUserId;
        const isBuyer = enquiry.buyer_id === currentUserId;
        const badge = statusBadges[enquiry.status] || {
          label: enquiry.status,
          variant: "default",
        };

        const isUpdating = updatingId === enquiry.id;

        return (
          <div
            key={enquiry.id}
            className="bg-white rounded-2xl border border-krishi-border p-4 sm:p-5 space-y-3 shadow-sm hover:border-krishi-deepGreen/40 transition"
          >
            {/* Header: Commodity title, Status badge, Timestamp */}
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-krishi-primary-100 text-krishi-deepGreen">
                    {isSeller ? "प्राप्त चौकशी (Received)" : "पाठवलेली चौकशी (Sent)"}
                  </span>
                  <Badge variant={badge.variant} size="sm">
                    {badge.label}
                  </Badge>
                </div>

                {enquiry.listing ? (
                  <Link
                    href={`/marketplace/${enquiry.listing_id}`}
                    className="hover:underline mt-1 block"
                  >
                    <h4 className="font-bold text-krishi-deepGreen text-sm sm:text-base">
                      {enquiry.listing.commodity_name}
                    </h4>
                  </Link>
                ) : (
                  <h4 className="font-bold text-krishi-deepGreen text-sm sm:text-base mt-1">
                    शेतीमाल चौकशी #{enquiry.id.slice(0, 8)}
                  </h4>
                )}
              </div>

              <div className="text-[11px] text-krishi-textMuted flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-krishi-primary-600" />
                <span>{new Date(enquiry.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Buyer / Seller details box */}
            <div className="bg-krishi-primary-50/60 rounded-xl p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-krishi-deepGreen">
                  <User className="w-3.5 h-3.5 text-krishi-earthBrown" />
                  <span>
                    {isSeller ? `खरेदीदार: ${enquiry.buyer?.full_name || "खरेदीदार"}` : `शेतकरी: ${enquiry.seller?.full_name || "शेतकरी"}`}
                  </span>
                </div>
                {enquiry.buyer_phone && (
                  <div className="flex items-center gap-1.5 text-krishi-textMuted">
                    <Phone className="w-3.5 h-3.5 text-krishi-accentGreen" />
                    <a
                      href={`tel:${enquiry.buyer_phone}`}
                      className="hover:underline font-medium text-krishi-deepGreen"
                    >
                      {enquiry.buyer_phone}
                    </a>
                  </div>
                )}
              </div>

              <div className="space-y-1 sm:text-right">
                <div className="font-bold text-krishi-deepGreen">
                  मागणी: {enquiry.proposed_quantity} {enquiry.listing?.quantity_unit || "एकक"}
                </div>
                {enquiry.proposed_price_per_unit && (
                  <div className="text-krishi-earthBrown font-medium">
                    प्रस्तावित दर: ₹ {enquiry.proposed_price_per_unit.toLocaleString("en-IN")}
                  </div>
                )}
              </div>
            </div>

            {/* Buyer message */}
            <div className="bg-white border border-krishi-border/80 rounded-xl p-3 text-xs text-krishi-deepGreen/90 leading-relaxed">
              <span className="font-semibold text-krishi-earthBrown block mb-0.5">
                संदेश:
              </span>
              <p className="whitespace-pre-wrap">{enquiry.buyer_message}</p>
            </div>

            {/* Status notes if any */}
            {enquiry.status_notes && (
              <div className="text-[11px] text-krishi-textMuted italic">
                टीप: {enquiry.status_notes}
              </div>
            )}

            {/* Seller Action Controls */}
            {isSeller && enquiry.status !== "closed" && (
              <div className="pt-2 border-t border-krishi-border flex items-center justify-end gap-1.5 flex-wrap">
                <span className="text-[11px] text-krishi-textMuted mr-auto font-medium">
                  स्थिती बदला:
                </span>

                {enquiry.status === "new" && (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isUpdating}
                    onClick={() => handleStatusUpdate(enquiry.id, "contacted")}
                    className="text-xs py-1 px-2.5 h-auto text-amber-700 hover:bg-amber-50"
                  >
                    <PhoneCall className="w-3 h-3 mr-1" />
                    संपर्क केला
                  </Button>
                )}

                {enquiry.status !== "accepted" && (
                  <Button
                    variant="accent"
                    size="sm"
                    disabled={isUpdating}
                    onClick={() => handleStatusUpdate(enquiry.id, "accepted")}
                    className="text-xs py-1 px-2.5 h-auto bg-green-700 hover:bg-green-800"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    स्वीकारले
                  </Button>
                )}

                {enquiry.status !== "declined" && (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isUpdating}
                    onClick={() => handleStatusUpdate(enquiry.id, "declined")}
                    className="text-xs py-1 px-2.5 h-auto text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="w-3 h-3 mr-1" />
                    नाकारले
                  </Button>
                )}

                <Button
                  variant="secondary"
                  size="sm"
                  disabled={isUpdating}
                  onClick={() => handleStatusUpdate(enquiry.id, "closed")}
                  className="text-xs py-1 px-2.5 h-auto"
                >
                  <Archive className="w-3 h-3 mr-1" />
                  पूर्ण / बंद
                </Button>
              </div>
            )}

            {/* Buyer action to close enquiry */}
            {isBuyer && !isSeller && enquiry.status !== "closed" && (
              <div className="pt-2 border-t border-krishi-border flex items-center justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isUpdating}
                  onClick={() => handleStatusUpdate(enquiry.id, "closed")}
                  className="text-xs py-1 px-2.5 h-auto"
                >
                  <Archive className="w-3 h-3 mr-1" />
                  चौकशी बंद करा
                </Button>
              </div>
            )}

            {isUpdating && (
              <div className="flex items-center justify-center gap-1.5 text-xs text-krishi-textMuted py-1">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>अद्ययावत होत आहे...</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
