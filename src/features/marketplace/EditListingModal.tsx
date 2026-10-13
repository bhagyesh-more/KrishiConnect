"use client";

import React, { useState } from "react";
import { useTranslation } from "@/lib/i18n";
import { X, AlertCircle, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProductListing, ListingStatus, PriceUnit } from "./types";
import { updateListingAction, deleteListingAction } from "./actions";

interface EditListingModalProps {
  isOpen: boolean;
  listing: ProductListing;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditListingModal: React.FC<EditListingModalProps> = ({
  isOpen,
  listing,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();

  const [commodityName, setCommodityName] = useState(listing.commodity_name);
  const [variety, setVariety] = useState(listing.variety || "");
  const [quantity, setQuantity] = useState(listing.quantity_available.toString());
  const [quantityUnit, setQuantityUnit] = useState<PriceUnit>(listing.quantity_unit);
  const [pricePerUnit, setPricePerUnit] = useState(listing.price_per_unit.toString());
  const [priceUnit, setPriceUnit] = useState<PriceUnit>(listing.price_unit);
  const [status, setStatus] = useState<ListingStatus>(listing.status);
  const [description, setDescription] = useState(listing.description || "");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen) return null;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const qtyNum = parseFloat(quantity);
    if (isNaN(qtyNum) || qtyNum <= 0) {
      setError("कृपया योग्य उपलब्ध प्रमाण प्रविष्ट करा (प्रमाण शून्यापेक्षा मोठे असावे)");
      return;
    }

    const priceNum = parseFloat(pricePerUnit);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError("कृपया योग्य अपेक्षित दर प्रविष्ट करा (दर शून्यापेक्षा मोठा असावा)");
      return;
    }

    setLoading(true);

    try {
      const result = await updateListingAction(listing.id, {
        commodityName: commodityName.trim(),
        variety: variety.trim() || undefined,
        quantity: qtyNum,
        quantityUnit,
        pricePerUnit: priceNum,
        priceUnit,
        status,
        description: description.trim() || undefined,
      });

      if (!result.success) {
        setError(result.error || "यादी अद्ययावत करण्यात त्रुटी आली");
      } else {
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      setError(err.message || "अनपेक्षित त्रुटी आली");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await deleteListingAction(listing.id);
      if (!result.success) {
        setError(result.error || "यादी हटवण्यात त्रुटी आली");
      } else {
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      setError(err.message || "अनपेक्षित त्रुटी आली");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-krishi-border overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-krishi-border flex items-center justify-between bg-krishi-primary-50/50">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-krishi-deepGreen">
              {t("marketplace.editListing")}
            </h2>
            <p className="text-xs text-krishi-textMuted">
              दर, प्रमाण किंवा उपलब्धता स्थिती बदला
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-krishi-textMuted hover:text-krishi-deepGreen hover:bg-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleUpdate} className="overflow-y-auto p-4 sm:p-5 space-y-4 text-xs sm:text-sm">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Status Selection */}
          <div className="bg-krishi-primary-50/70 p-3 rounded-xl border border-krishi-primary-100">
            <label className="block font-semibold text-krishi-deepGreen mb-1.5">
              यादी स्थिती (Listing Status) *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus("active")}
                className={`py-2 px-2 rounded-lg text-xs font-bold border transition text-center ${
                  status === "active"
                    ? "bg-green-600 text-white border-green-600 shadow-sm"
                    : "bg-white text-green-700 border-green-200 hover:bg-green-50"
                }`}
              >
                उपलब्ध (Active)
              </button>
              <button
                type="button"
                onClick={() => setStatus("paused")}
                className={`py-2 px-2 rounded-lg text-xs font-bold border transition text-center ${
                  status === "paused"
                    ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                    : "bg-white text-amber-700 border-amber-200 hover:bg-amber-50"
                }`}
              >
                थांबवले (Paused)
              </button>
              <button
                type="button"
                onClick={() => setStatus("sold_out")}
                className={`py-2 px-2 rounded-lg text-xs font-bold border transition text-center ${
                  status === "sold_out"
                    ? "bg-red-600 text-white border-red-600 shadow-sm"
                    : "bg-white text-red-700 border-red-200 hover:bg-red-50"
                }`}
              >
                विक्री झाली (Sold Out)
              </button>
            </div>
          </div>

          {/* Commodity Name & Variety */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-krishi-deepGreen mb-1">
                शेतीमालाचे नाव *
              </label>
              <input
                type="text"
                required
                value={commodityName}
                onChange={(e) => setCommodityName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-krishi-border bg-white focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen/30"
              />
            </div>

            <div>
              <label className="block font-semibold text-krishi-deepGreen mb-1">
                वाण / जात
              </label>
              <input
                type="text"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-krishi-border bg-white focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen/30"
              />
            </div>
          </div>

          {/* Quantity & Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-krishi-deepGreen mb-1">
                उपलब्ध प्रमाण *
              </label>
              <input
                type="number"
                step="any"
                required
                min="0.1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-krishi-border bg-white focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen/30"
              />
            </div>

            <div>
              <label className="block font-semibold text-krishi-deepGreen mb-1">
                प्रमाण एकक
              </label>
              <select
                value={quantityUnit}
                onChange={(e) => setQuantityUnit(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-krishi-border bg-white focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen/30"
              >
                <option value="per_quintal">क्विंटल (Quintal)</option>
                <option value="per_kg">किलो (Kg)</option>
                <option value="per_crate">क्रेट (Crate)</option>
                <option value="per_ton">टन (Ton)</option>
                <option value="per_dozen">डझन (Dozen)</option>
              </select>
            </div>
          </div>

          {/* Asking Price & Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-krishi-deepGreen mb-1">
                अपेक्षित दर (₹) *
              </label>
              <input
                type="number"
                step="any"
                required
                min="1"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-krishi-border bg-white focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen/30"
              />
            </div>

            <div>
              <label className="block font-semibold text-krishi-deepGreen mb-1">
                दर एकक
              </label>
              <select
                value={priceUnit}
                onChange={(e) => setPriceUnit(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-krishi-border bg-white focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen/30"
              >
                <option value="per_quintal">प्रति क्विंटल</option>
                <option value="per_kg">प्रति किलो</option>
                <option value="per_crate">प्रति क्रेट</option>
                <option value="per_ton">प्रति टन</option>
                <option value="per_dozen">प्रति डझन</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-krishi-deepGreen mb-1">
              शेतीमालाचा सविस्तर तपशील
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-krishi-border bg-white focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen/30"
            />
          </div>

          {/* Delete Danger Section */}
          <div className="pt-2 border-t border-krishi-border">
            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t("marketplace.deleteListing")}</span>
              </button>
            ) : (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-2">
                <p className="text-xs font-medium text-red-700">
                  खरोखर ही यादी हटवायची आहे का? ही कृती पूर्ववत करता येणार नाही.
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="accent"
                    size="sm"
                    onClick={handleDelete}
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 text-white border-red-600"
                  >
                    होय, यादी हटवा
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={loading}
                  >
                    रद्द करा
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onClose}
              disabled={loading}
            >
              रद्द करा
            </Button>
            <Button
              type="submit"
              variant="accent"
              size="md"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  अद्ययावत करत आहे...
                </>
              ) : (
                "बदल जतन करा (Save Changes)"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
