"use client";

import React, { useState } from "react";
import { useTranslation } from "@/lib/i18n";
import { X, Sparkles, AlertCircle, Loader2, Store } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MAHARASHTRA_DISTRICTS } from "@/features/auth/maharashtraDistricts";
import { createListingAction } from "./actions";
import { CommodityCategory, PriceUnit } from "./types";

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateListingModal: React.FC<CreateListingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { t, language } = useTranslation();

  const [commodityName, setCommodityName] = useState("");
  const [variety, setVariety] = useState("");
  const [category, setCategory] = useState<CommodityCategory>("vegetables");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [quantityUnit, setQuantityUnit] = useState<PriceUnit>("per_quintal");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [priceUnit, setPriceUnit] = useState<PriceUnit>("per_quintal");
  const [minimumOrderQty, setMinimumOrderQty] = useState("1");
  const [district, setDistrict] = useState("Nashik");
  const [taluka, setTaluka] = useState("");
  const [harvestDate, setHarvestDate] = useState("");
  const [isOrganic, setIsOrganic] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const districtData = MAHARASHTRA_DISTRICTS[district];

  const handleSubmit = async (e: React.FormEvent) => {
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

    const minQtyNum = parseFloat(minimumOrderQty);
    if (isNaN(minQtyNum) || minQtyNum <= 0) {
      setError("किमान खरेदी प्रमाण शून्यापेक्षा मोठे असावे");
      return;
    }

    setLoading(true);

    try {
      const result = await createListingAction({
        commodityName: commodityName.trim(),
        variety: variety.trim() || undefined,
        category,
        description: description.trim() || undefined,
        quantity: qtyNum,
        quantityUnit,
        pricePerUnit: priceNum,
        priceUnit,
        minimumOrderQty: minQtyNum,
        locationDistrict: language === "mr" && districtData ? districtData.nameMr : district,
        locationTaluka: taluka || undefined,
        harvestDate: harvestDate || undefined,
        imageUrls: [],
        isOrganic,
      });

      if (!result.success) {
        setError(result.error || "यादी तयार करण्यात त्रुटी आली");
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
            <div className="p-2 bg-krishi-deepGreen text-white rounded-xl">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-krishi-deepGreen">
                {t("marketplace.createListing")}
              </h2>
              <p className="text-xs text-krishi-textMuted">
                थेट खरेदीदारांसाठी उपलब्ध शेतीमालाची नोंद करा
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

          {/* Commodity Name & Variety */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-krishi-deepGreen mb-1">
                शेतीमालाचे नाव (Produce Name) *
              </label>
              <input
                type="text"
                required
                placeholder="उदा. लाल कांदा, सोयाबीन, केळी"
                value={commodityName}
                onChange={(e) => setCommodityName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-krishi-border bg-white focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen/30"
              />
            </div>

            <div>
              <label className="block font-semibold text-krishi-deepGreen mb-1">
                वाण / जात (Variety)
              </label>
              <input
                type="text"
                placeholder="उदा. गरवा, G-9, JS-335"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-krishi-border bg-white focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen/30"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block font-semibold text-krishi-deepGreen mb-1">
              शेतीमाल वर्ग (Category) *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-krishi-border bg-white focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen/30"
            >
              <option value="vegetables">{t("marketplace.catVegetables")}</option>
              <option value="fruits">{t("marketplace.catFruits")}</option>
              <option value="grains">{t("marketplace.catGrains")}</option>
              <option value="pulses">{t("marketplace.catPulses")}</option>
              <option value="spices">{t("marketplace.catSpices")}</option>
              <option value="other">{t("marketplace.catOther")}</option>
            </select>
          </div>

          {/* Quantity & Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-krishi-deepGreen mb-1">
                उपलब्ध प्रमाण (Available Quantity) *
              </label>
              <input
                type="number"
                step="any"
                required
                min="0.1"
                placeholder="उदा. 50"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-krishi-border bg-white focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen/30"
              />
            </div>

            <div>
              <label className="block font-semibold text-krishi-deepGreen mb-1">
                प्रमाण एकक (Quantity Unit) *
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

          {/* Asking Price & Price Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-krishi-deepGreen mb-1">
                अपेक्षित दर (Asking Price in ₹) *
              </label>
              <input
                type="number"
                step="any"
                required
                min="1"
                placeholder="उदा. 2600"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-krishi-border bg-white focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen/30"
              />
            </div>

            <div>
              <label className="block font-semibold text-krishi-deepGreen mb-1">
                दर एकक (Price Unit) *
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

          {/* Minimum Order Qty & Harvest Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-krishi-deepGreen mb-1">
                किमान खरेदी प्रमाण (Min Order Qty)
              </label>
              <input
                type="number"
                step="any"
                min="1"
                placeholder="1"
                value={minimumOrderQty}
                onChange={(e) => setMinimumOrderQty(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-krishi-border bg-white focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen/30"
              />
            </div>

            <div>
              <label className="block font-semibold text-krishi-deepGreen mb-1">
                काढणी तारीख (Harvest Date)
              </label>
              <input
                type="date"
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-krishi-border bg-white focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen/30"
              />
            </div>
          </div>

          {/* District & Taluka */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-krishi-deepGreen mb-1">
                जिल्हा (District) *
              </label>
              <select
                value={district}
                onChange={(e) => {
                  setDistrict(e.target.value);
                  setTaluka("");
                }}
                className="w-full px-3 py-2 rounded-xl border border-krishi-border bg-white focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen/30"
              >
                {Object.entries(MAHARASHTRA_DISTRICTS).map(([key, d]) => (
                  <option key={key} value={key}>
                    {language === "mr" ? d.nameMr : d.nameEn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-krishi-deepGreen mb-1">
                तालुका (Taluka)
              </label>
              {districtData && districtData.talukas.length > 0 ? (
                <select
                  value={taluka}
                  onChange={(e) => setTaluka(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-krishi-border bg-white focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen/30"
                >
                  <option value="">तालुका निवडा</option>
                  {districtData.talukas.map((t) => (
                    <option key={t.nameEn} value={t.nameMr}>
                      {language === "mr" ? t.nameMr : t.nameEn}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="उदा. हवेली, निफाड"
                  value={taluka}
                  onChange={(e) => setTaluka(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-krishi-border bg-white focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen/30"
                />
              )}
            </div>
          </div>

          {/* Organic Checkbox */}
          <div className="flex items-center gap-2 p-3 bg-krishi-primary-50/60 rounded-xl border border-krishi-primary-100">
            <input
              type="checkbox"
              id="isOrganicCheckbox"
              checked={isOrganic}
              onChange={(e) => setIsOrganic(e.target.checked)}
              className="w-4 h-4 text-krishi-deepGreen rounded border-krishi-border focus:ring-krishi-deepGreen"
            />
            <label htmlFor="isOrganicCheckbox" className="font-semibold text-krishi-deepGreen flex items-center gap-1.5 cursor-pointer">
              <Sparkles className="w-4 h-4 text-krishi-accentGreen" />
              <span>सेंद्रिय / रासायनिक खतेविरहित शेतीमाल (Certified Organic)</span>
            </label>
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-krishi-deepGreen mb-1">
              शेतीमालाचा सविस्तर तपशील (Description)
            </label>
            <textarea
              rows={3}
              placeholder="गुणवत्ता, ओलावा, आकार, गाडी उचलण्याची सोय, बांधावर पाहणी याविषयी माहिती लिहा..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-krishi-border bg-white focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen/30"
            />
          </div>

          {/* Direct Model Advisory Banner */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[11px] leading-relaxed">
            <strong>थेट व्यवहार सूचना:</strong> खरेदीदार तुमच्याशी संपर्क साधतील आणि प्रत्यक्ष बांधावर अथवा गोदामात मालाची पाहणी करून व्यवहार करतील. कोणतीही आगाऊ रक्कम पाठवण्यापूर्वी मालाची खात्री करा.
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
                  नोंदवत आहे...
                </>
              ) : (
                "यादी प्रसिद्ध करा (Publish)"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
