"use client";

import React, { useState } from "react";
import { useTranslation } from "@/lib/i18n";
import { X, Send, PhoneCall, AlertCircle, Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProductListing } from "./types";
import { createEnquiryAction } from "./actions";

interface EnquiryModalProps {
  isOpen: boolean;
  listing: ProductListing;
  onClose: () => void;
  onSuccess: () => void;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  listing,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();

  const [proposedQuantity, setProposedQuantity] = useState(
    listing.minimum_order_qty ? listing.minimum_order_qty.toString() : "10"
  );
  const [proposedPricePerUnit, setProposedPricePerUnit] = useState(
    listing.price_per_unit.toString()
  );
  const [buyerPhone, setBuyerPhone] = useState("+91 ");
  const [contactPreference, setContactPreference] = useState<"phone" | "whatsapp" | "visit">("phone");
  const [buyerMessage, setBuyerMessage] = useState(
    `नमस्कार, मला आपल्या ${listing.commodity_name} मालाची पाहणी करून खरेदी करायची आहे.`
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const qtyNum = parseFloat(proposedQuantity);
    if (isNaN(qtyNum) || qtyNum <= 0) {
      setError("कृपया मागणी केलेले प्रमाण योग्य प्रविष्ट करा (प्रमाण शून्यापेक्षा मोठे असावे)");
      return;
    }

    const priceNum = proposedPricePerUnit ? parseFloat(proposedPricePerUnit) : undefined;
    if (priceNum !== undefined && (isNaN(priceNum) || priceNum <= 0)) {
      setError("प्रस्तावित दर शून्यापेक्षा मोठा असावा");
      return;
    }

    if (!buyerMessage || buyerMessage.trim().length < 5) {
      setError("संदेश किमान ५ अक्षरांचा असावा");
      return;
    }

    setLoading(true);

    try {
      const result = await createEnquiryAction({
        listingId: listing.id,
        proposedQuantity: qtyNum,
        proposedPricePerUnit: priceNum,
        buyerPhone: buyerPhone.trim() || undefined,
        contactPreference,
        buyerMessage: buyerMessage.trim(),
      });

      if (!result.success) {
        setError(result.error || "चौकशी पाठवण्यात त्रुटी आली");
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
          <div className="flex items-center gap-2">
            <div className="p-2 bg-krishi-accentGreen text-white rounded-xl">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-krishi-deepGreen">
                {t("marketplace.sendEnquiry")}
              </h2>
              <p className="text-xs text-krishi-textMuted">
                शेतकऱ्याशी थेट संपर्क साधून खरेदी चौकशी पाठवा
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-krishi-textMuted hover:text-krishi-deepGreen hover:bg-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-5 space-y-4 text-xs sm:text-sm">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Listing Brief Summary Card */}
          <div className="p-3 bg-krishi-primary-50/70 border border-krishi-primary-100 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-krishi-deepGreen text-sm">
                {listing.commodity_name}
              </span>
              <span className="font-extrabold text-krishi-deepGreen">
                ₹ {listing.price_per_unit.toLocaleString("en-IN")}
              </span>
            </div>
            <p className="text-xs text-krishi-textMuted">
              विक्रेता: <strong>{listing.seller?.full_name || "शेतकरी"}</strong> ({listing.location_district})
            </p>
          </div>

          {/* Quantity & Proposed Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-krishi-deepGreen mb-1">
                मागणी केलेले प्रमाण *
              </label>
              <input
                type="number"
                step="any"
                required
                min="0.1"
                placeholder="उदा. 20"
                value={proposedQuantity}
                onChange={(e) => setProposedQuantity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-krishi-border bg-white focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen/30"
              />
              <span className="text-[10px] text-krishi-textMuted mt-0.5 block">
                उपलब्ध: {listing.quantity_available}
              </span>
            </div>

            <div>
              <label className="block font-semibold text-krishi-deepGreen mb-1">
                प्रस्तावित दर (₹ प्रति एकक)
              </label>
              <input
                type="number"
                step="any"
                min="1"
                placeholder="उदा. 2600"
                value={proposedPricePerUnit}
                onChange={(e) => setProposedPricePerUnit(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-krishi-border bg-white focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen/30"
              />
              <span className="text-[10px] text-krishi-textMuted mt-0.5 block">
                अपेक्षित: ₹ {listing.price_per_unit}
              </span>
            </div>
          </div>

          {/* Contact Preference & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-krishi-deepGreen mb-1">
                संपर्क माध्यम पसंती
              </label>
              <select
                value={contactPreference}
                onChange={(e) => setContactPreference(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-krishi-border bg-white focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen/30"
              >
                <option value="phone">थेट फोन कॉल (Direct Call)</option>
                <option value="whatsapp">व्हॉट्सअ‍ॅप मेसेज (WhatsApp)</option>
                <option value="visit">बांधावर भेट (Farm / Yard Visit)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-krishi-deepGreen mb-1">
                आपला संपर्क क्रमांक
              </label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-krishi-border bg-white focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen/30"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block font-semibold text-krishi-deepGreen mb-1">
              आपला संदेश / प्रश्न *
            </label>
            <textarea
              rows={3}
              required
              placeholder="मालाची प्रत, पाहणीची तारीख, गाडी भरण्याची सोय याविषयी संदेश लिहा..."
              value={buyerMessage}
              onChange={(e) => setBuyerMessage(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-krishi-border bg-white focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen/30"
            />
          </div>

          {/* Advisory Notice */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] leading-relaxed flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>थेट संपर्क नीती सूचना:</strong> ही केवळ खरेदी चौकशी आहे. यातून कोणताही अंतिम खरेदी करार किंवा ऑनलाइन पेमेंट होत नाही. कृपया मालाची प्रत्यक्ष पाहणी करूनच देयकाची देवाणघेवाण करा.
            </div>
          </div>

          {/* Actions */}
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
                  पाठवत आहे...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-1.5" />
                  चौकशी पाठवा (Send)
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
