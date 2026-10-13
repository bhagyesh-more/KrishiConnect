/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  MapPin,
  Calendar,
  CheckCircle2,
  Package,
  Sparkles,
  PhoneCall,
  Edit,
  ArrowRight,
} from "lucide-react";
import { ProductListing } from "./types";

interface ListingCardProps {
  listing: ProductListing;
  currentUserId?: string;
  onEnquireClick?: (listing: ProductListing) => void;
  onEditClick?: (listing: ProductListing) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  currentUserId,
  onEnquireClick,
  onEditClick,
}) => {
  const { t } = useTranslation();

  const isOwner = currentUserId === listing.seller_id;

  const categoryLabels: Record<string, string> = {
    grains: t("marketplace.catGrains"),
    pulses: t("marketplace.catPulses"),
    vegetables: t("marketplace.catVegetables"),
    fruits: t("marketplace.catFruits"),
    spices: t("marketplace.catSpices"),
    other: t("marketplace.catOther"),
    oilseeds: "गळित धान्य",
    flowers: "फुले",
    inputs: "कृषी निविष्ठा",
  };

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
    <Card className="flex flex-col justify-between overflow-hidden border border-krishi-border hover:shadow-md transition-all duration-200 bg-white group">
      <div className="space-y-3.5">
        {/* Top bar: Category, Organic, Status */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="accent" size="sm">
              {categoryLabels[listing.category] || listing.category}
            </Badge>

            {listing.is_organic && (
              <Badge variant="success" size="sm" className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-krishi-accentGreen" />
                <span>{t("marketplace.organicBadge")}</span>
              </Badge>
            )}
          </div>

          <Badge variant={statusInfo.variant} size="sm">
            {statusInfo.label}
          </Badge>
        </div>

        {/* Commodity Title & Variety */}
        <div>
          <Link
            href={`/marketplace/${listing.id}`}
            className="hover:underline focus:outline-none"
          >
            <h3 className="text-base sm:text-lg font-bold text-krishi-deepGreen group-hover:text-krishi-primary-700 transition line-clamp-1">
              {listing.commodity_name}
            </h3>
          </Link>
          {listing.variety && (
            <p className="text-xs font-medium text-krishi-earthBrown line-clamp-1 mt-0.5">
              वाण (Variety): {listing.variety}
            </p>
          )}
        </div>

        {/* Price & Quantity Highlight Box */}
        <div className="bg-krishi-primary-50/70 border border-krishi-primary-100/60 rounded-xl p-3 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-krishi-textMuted font-medium block">
              अपेक्षित भाव (Asking Price)
            </span>
            <div className="text-lg font-extrabold text-krishi-deepGreen">
              ₹ {listing.price_per_unit.toLocaleString("en-IN")}
              <span className="text-xs font-medium text-krishi-textMuted ml-1">
                / {unitLabels[listing.price_unit] || listing.price_unit}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-krishi-textMuted font-medium block">
              उपलब्ध प्रमाण (Available)
            </span>
            <div className="text-sm font-bold text-krishi-deepGreen flex items-center justify-end gap-1">
              <Package className="w-3.5 h-3.5 text-krishi-earthBrown" />
              <span>{listing.quantity_available} {unitLabels[listing.quantity_unit] || listing.quantity_unit}</span>
            </div>
          </div>
        </div>

        {/* Description snippet */}
        {listing.description && (
          <p className="text-xs text-krishi-textMuted line-clamp-2 leading-relaxed">
            {listing.description}
          </p>
        )}

        {/* Meta details: District, Harvest Date */}
        <div className="space-y-1.5 text-xs text-krishi-textMuted pt-1 border-t border-krishi-border/60">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-krishi-earthBrown shrink-0" />
            <span className="truncate">
              {listing.location_district}
              {listing.location_taluka ? `, ${listing.location_taluka}` : ""}
            </span>
          </div>

          {listing.harvest_date && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-krishi-primary-600 shrink-0" />
              <span>{t("marketplace.harvestDate")}: {listing.harvest_date}</span>
            </div>
          )}

          {listing.minimum_order_qty > 1 && (
            <div className="text-[11px] text-krishi-earthBrown font-medium">
              {t("marketplace.minOrder")}: {listing.minimum_order_qty} {unitLabels[listing.quantity_unit] || ""}
            </div>
          )}
        </div>
      </div>

      {/* Seller info & Action buttons */}
      <div className="pt-3.5 mt-3.5 border-t border-krishi-border flex flex-col gap-2.5">
        {listing.seller && (
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="w-6 h-6 rounded-full bg-krishi-primary-100 text-krishi-deepGreen font-bold flex items-center justify-center text-[10px] shrink-0">
                {listing.seller.full_name.charAt(0)}
              </div>
              <span className="font-semibold text-krishi-deepGreen truncate">
                {listing.seller.full_name}
              </span>
              {listing.seller.is_verified && (
                <CheckCircle2 className="w-3.5 h-3.5 text-krishi-accentGreen shrink-0" />
              )}
            </div>

            {isOwner && (
              <Badge variant="accent" size="sm">
                माझी यादी (Mine)
              </Badge>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <Link
            href={`/marketplace/${listing.id}`}
            className="flex-1"
          >
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs font-semibold"
            >
              <span>{t("marketplace.viewDetails")}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>

          {isOwner ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onEditClick && onEditClick(listing)}
              className="text-xs font-semibold px-3"
            >
              <Edit className="w-3.5 h-3.5 mr-1" />
              <span>{t("marketplace.editListing")}</span>
            </Button>
          ) : (
            listing.status === "active" && (
              <Button
                variant="accent"
                size="sm"
                onClick={() => onEnquireClick && onEnquireClick(listing)}
                className="text-xs font-semibold px-3"
              >
                <PhoneCall className="w-3.5 h-3.5 mr-1" />
                <span>{t("marketplace.sendEnquiry")}</span>
              </Button>
            )
          )}
        </div>
      </div>
    </Card>
  );
};
