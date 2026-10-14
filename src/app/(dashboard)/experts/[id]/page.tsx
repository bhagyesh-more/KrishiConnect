"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UserCheck, MapPin, Languages, Briefcase, Sprout, Building, Calendar, Info, Clock } from "lucide-react";
import { ExpertProfile } from "@/features/experts/types";
import { getExpertDetailAction } from "@/features/experts/actions";
import { ConsultationRequestModal } from "@/features/experts/ConsultationRequestModal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function ExpertDetailPage() {
  const params = useParams();
  const router = useRouter();
  const expertId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const [expert, setExpert] = useState<ExpertProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!expertId) return;
    async function loadExpert() {
      setLoading(true);
      const res = await getExpertDetailAction(expertId);
      if (res.success && res.data) {
        setExpert(res.data);
      }
      setLoading(false);
    }
    loadExpert();
  }, [expertId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 space-y-4">
        <div className="h-6 w-32 bg-stone-200 animate-pulse rounded" />
        <div className="h-64 bg-stone-100 animate-pulse rounded-2xl" />
      </div>
    );
  }

  if (!expert) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-800">तज्ज्ञ प्रोफाईल आढळली नाही</h2>
        <p className="text-xs text-stone-500">शोधलेले तज्ज्ञ रेकॉर्ड उपलब्ध नाही किंवा हटवले गेले असावे.</p>
        <Link href="/experts" className="inline-block text-xs font-semibold text-emerald-700 underline">
          ← तज्ज्ञ निर्देशिकेकडे परत जा
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/experts"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          सर्व कृषी तज्ज्ञांकडे परत जा
        </Link>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
        {/* Banner Top */}
        <div className="bg-gradient-to-r from-emerald-900 to-stone-900 text-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 text-emerald-900 font-extrabold flex items-center justify-center text-2xl sm:text-3xl border-2 border-emerald-300 flex-shrink-0">
                {expert.full_name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{expert.full_name}</h1>
                  {expert.is_verified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      <UserCheck className="w-3.5 h-3.5" />
                      सत्यापित तज्ज्ञ
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-emerald-100 mt-1">
                  {expert.qualification || "कृषी तज्ज्ञ"}
                </p>
                {expert.affiliation && (
                  <p className="text-xs text-emerald-200/80 flex items-center gap-1 mt-0.5">
                    <Building className="w-3.5 h-3.5" />
                    {expert.affiliation}
                  </p>
                )}
              </div>
            </div>

            <Button
              variant="accent"
              size="lg"
              onClick={() => setIsModalOpen(true)}
              className="text-xs sm:text-sm shadow-md whitespace-nowrap self-start sm:self-center"
            >
              <Calendar className="w-4 h-4 mr-1.5" />
              सल्ला विनंती पाठवा
            </Button>
          </div>
        </div>

        {/* Demo disclaimer */}
        {expert.is_demo_profile && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center gap-2 text-xs text-amber-800">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong>डेमो प्रोफाईल:</strong> हे कृषी तज्ज्ञ प्रोफाईल KrishiConnect ॲपच्या चाचणी व सादरीकरणासाठी आहे.
            </span>
          </div>
        )}

        {/* Profile Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Key Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-stone-50 rounded-xl border border-stone-100 text-xs">
            <div>
              <span className="text-stone-500 block text-[11px]">विशेषज्ञता क्षेत्र</span>
              <strong className="text-stone-800 capitalize font-bold">
                {expert.specialization.replace(/_/g, " ")}
              </strong>
            </div>
            <div>
              <span className="text-stone-500 block text-[11px]">एकूण अनुभव</span>
              <strong className="text-stone-800 font-bold">{expert.experience_years} वर्षे</strong>
            </div>
            <div>
              <span className="text-stone-500 block text-[11px]">कार्यक्षेत्र जिल्हा</span>
              <strong className="text-stone-800 font-bold">{expert.district}</strong>
            </div>
            <div>
              <span className="text-stone-500 block text-[11px]">सल्ला शुल्क</span>
              <strong className="text-emerald-700 font-bold">मोफत (निसर्ग सेवा)</strong>
            </div>
          </div>

          {/* Biography */}
          {expert.bio && (
            <div className="space-y-2">
              <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-700" />
                तज्ज्ञांचा परिचय व पार्श्वभूमी
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed whitespace-pre-line">
                {expert.bio}
              </p>
            </div>
          )}

          {/* Supported crops */}
          {expert.supported_crops && expert.supported_crops.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Sprout className="w-4 h-4 text-emerald-700" />
                मुख्य मार्गदर्शन पिके
              </h2>
              <div className="flex flex-wrap gap-2">
                {expert.supported_crops.map((crop) => (
                  <span
                    key={crop}
                    className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-3 py-1 rounded-lg font-medium"
                  >
                    🌱 {crop}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {expert.languages_spoken && expert.languages_spoken.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Languages className="w-4 h-4 text-emerald-700" />
                संभाषणाची भाषा
              </h2>
              <div className="flex flex-wrap gap-2">
                {expert.languages_spoken.map((lang) => (
                  <Badge key={lang} variant="secondary">
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Consultation CTA Banner */}
          <div className="mt-8 p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-emerald-950">
                आपल्या शेतीतील समस्यांसाठी थेट सल्ला हवा आहे का?
              </h3>
              <p className="text-xs text-stone-600">
                पिकाचे नाव, फोटो किंवा लक्षणांचे वर्णन जोडून मोफत सल्ला विनंती सबमिट करा.
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsModalOpen(true)}
              className="whitespace-nowrap text-xs"
            >
              सल्ला विनंती फॉर्म भरा
            </Button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <ConsultationRequestModal
        expert={expert}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          router.push("/experts");
        }}
      />
    </div>
  );
}
