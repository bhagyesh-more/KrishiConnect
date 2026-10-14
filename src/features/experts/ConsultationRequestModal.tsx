"use client";

import React, { useState } from "react";
import { X, AlertCircle, Info, Send, Clock, Phone, FileText, Sprout } from "lucide-react";
import { ExpertProfile } from "./types";
import { CreateConsultationRequestInput } from "./schemas";
import { createConsultationRequestAction } from "./actions";
import { Button } from "@/components/ui/Button";

interface ConsultationRequestModalProps {
  expert: ExpertProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ConsultationRequestModal: React.FC<ConsultationRequestModalProps> = ({
  expert,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<{
    cropName: string;
    subject: string;
    description: string;
    preferredContactMethod: "phone" | "whatsapp" | "in_person_kvk";
    preferredTimeSlot: string;
    farmerPhone: string;
  }>({
    cropName: "",
    subject: "",
    description: "",
    preferredContactMethod: "phone",
    preferredTimeSlot: "morning",
    farmerPhone: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen || !expert) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    const payload: CreateConsultationRequestInput = {
      expertId: expert.id,
      cropName: formData.cropName.trim() || undefined,
      subject: formData.subject.trim(),
      description: formData.description.trim(),
      preferredContactMethod: formData.preferredContactMethod,
      preferredTimeSlot: formData.preferredTimeSlot,
      farmerPhone: formData.farmerPhone.trim() || undefined,
      imageUrls: [],
    };

    const res = await createConsultationRequestAction(payload);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMessage(
        "आपली सल्ला विनंती यशस्वीरीत्या नोंदवली गेली आहे! (डेमो मोड: मेमरीमध्ये नोंद झाली)"
      );
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    } else {
      setError(res.error || "विनंती पाठवताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-stone-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-800 to-emerald-950 text-white flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold">कृषी सल्ला विनंती पाठवा</h2>
            <p className="text-xs text-emerald-200 mt-0.5">
              तज्ज्ञ: <span className="font-semibold text-white">{expert.full_name}</span> ({expert.specialization.replace(/_/g, " ")})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Mode Notice */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-start gap-2 text-xs text-amber-800">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p>
            <strong>प्रात्यक्षिक सूचना:</strong> हे डेमो वातावरण आहे. तज्ज्ञांना थेट फोन/व्हॉट्सॲप मेसेज जात नाही. आपली विनंती सिस्टिममध्ये सुरक्षित नोंदवली जाते.
          </p>
        </div>

        {/* Modal Body / Form */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-medium">
              {successMessage}
            </div>
          )}

          <form id="consultation-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Subject */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                विषय / समस्या शीर्षक <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="उदा. सोयाबीन पानांवरील पिवळे डाग आणि कीड"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Crop Context */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                संबंधित पीक (ऐच्छिक)
              </label>
              <div className="relative">
                <Sprout className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="उदा. कापूस, सोयाबीन, कांदा, डाळिंब..."
                  value={formData.cropName}
                  onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Detailed Description */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                समस्येचे सविस्तर वर्णन <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="पिकाचे वय, खतांची मात्रा, पाणी देण्याची पद्धत आणि सध्या दिसणारी लक्षणे सविस्तर लिहा..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Contact Preference & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  संपर्क माध्यम
                </label>
                <select
                  value={formData.preferredContactMethod}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferredContactMethod: e.target.value as "phone" | "whatsapp" | "in_person_kvk",
                    })
                  }
                  className="w-full p-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="phone">दूरध्वनी (Phone Call)</option>
                  <option value="whatsapp">व्हॉट्सॲप (WhatsApp)</option>
                  <option value="in_person_kvk">KVK प्रत्यक्ष भेट (In-person)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  सोयीस्कर वेळ
                </label>
                <div className="relative">
                  <Clock className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                  <select
                    value={formData.preferredTimeSlot}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferredTimeSlot: e.target.value,
                      })
                    }
                    className="w-full pl-8 pr-2 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="morning">सकाळी (08:00 AM - 12:00 PM)</option>
                    <option value="afternoon">दुपारी (12:00 PM - 04:00 PM)</option>
                    <option value="evening">संध्याकाळी (04:00 PM - 08:00 PM)</option>
                    <option value="anytime">कधीही उपलब्ध (Anytime)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Phone number */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                संपर्क क्रमांक (दूरध्वनीसाठी)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  placeholder="उदा. 9876543210"
                  value={formData.farmerPhone}
                  onChange={(e) => setFormData({ ...formData, farmerPhone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
            रद्द करा
          </Button>
          <Button
            type="submit"
            form="consultation-form"
            variant="primary"
            disabled={isSubmitting}
            className="flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? "पाठवत आहे..." : "विनंती सबमिट करा"}
          </Button>
        </div>
      </div>
    </div>
  );
};
