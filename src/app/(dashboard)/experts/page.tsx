"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Users, AlertTriangle } from "lucide-react";
import { ExpertProfile, ConsultationRequest, ExpertSpecialization } from "@/features/experts/types";
import { getExpertsAction, getMyConsultationsAction } from "@/features/experts/actions";
import { ExpertFilters } from "@/features/experts/ExpertFilters";
import { ExpertCard } from "@/features/experts/ExpertCard";
import { ConsultationRequestModal } from "@/features/experts/ConsultationRequestModal";
import { ConsultationRequestList } from "@/features/experts/ConsultationRequestList";

export default function ExpertsPage() {
  const [activeTab, setActiveTab] = useState<"browse" | "my_requests">("browse");
  const [experts, setExperts] = useState<ExpertProfile[]>([]);
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [search, setSearch] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState<ExpertSpecialization | "all">("all");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");

  // Modal state
  const [selectedExpertForBooking, setSelectedExpertForBooking] = useState<ExpertProfile | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const fetchExperts = useCallback(async () => {
    setLoading(true);
    const res = await getExpertsAction({
      search: search || undefined,
      specialization: selectedSpecialization,
      district: selectedDistrict === "all" ? undefined : selectedDistrict,
    });
    if (res.success && res.data) {
      setExperts(res.data);
    }
    setLoading(false);
  }, [search, selectedSpecialization, selectedDistrict]);

  const fetchConsultations = useCallback(async () => {
    const res = await getMyConsultationsAction();
    if (res.success && res.data) {
      setConsultations(res.data);
    }
  }, []);

  useEffect(() => {
    fetchExperts();
  }, [fetchExperts]);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  const handleOpenBooking = (expert: ExpertProfile) => {
    setSelectedExpertForBooking(expert);
    setIsBookingModalOpen(true);
  };

  const handleBookingSuccess = () => {
    fetchConsultations();
    setActiveTab("my_requests");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Heading */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-stone-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold backdrop-blur-sm border border-emerald-400/30">
            <Users className="w-3.5 h-3.5" />
            कृषी तज्ज्ञ सल्ला केंद्र (Agri Expert Connect)
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            अनुभवी कृषी शास्त्रज्ञ व तज्ज्ञांचे मार्गदर्शन
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            कीड-रोग नियंत्रण, सेंद्रिय शेती, आधुनिक सिंचन आणि माती परीक्षणासाठी थेट तज्ज्ञांशी संपर्क साधा आणि योग्य सल्ला मिळवा.
          </p>
        </div>
      </div>

      {/* Disclaimers & Integrity Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-800 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold">प्रात्यक्षिक व पारदर्शकता सूचना:</p>
          <p className="text-amber-700 leading-relaxed">
            सध्या प्रणालीत दाखवण्यात आलेले तज्ज्ञ प्रोफाईल प्रात्यक्षिक (डेमो) उद्देशासाठी आहेत. कोणतीही खरी खाजगी संपर्क माहिती, पेमेंट किंवा बाह्य थर्ड-पार्टी कॉल/व्हिडिओ इंटिग्रेशन वापरलेले नाही. सल्ला विनंत्या लोकल मेमरी/चाचणी डेटाबेसमध्ये सुरक्षित नोंदवल्या जातात.
          </p>
        </div>
      </div>

      {/* Filters and Navigation */}
      <ExpertFilters
        searchQuery={search}
        onSearchChange={setSearch}
        selectedSpecialization={selectedSpecialization}
        onSelectSpecialization={setSelectedSpecialization}
        selectedDistrict={selectedDistrict}
        onSelectDistrict={setSelectedDistrict}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab Content */}
      {activeTab === "browse" ? (
        <div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-xl h-64 border border-stone-200 animate-pulse p-4 space-y-3">
                  <div className="w-12 h-12 bg-stone-200 rounded-full" />
                  <div className="h-4 bg-stone-200 rounded w-3/4" />
                  <div className="h-3 bg-stone-100 rounded w-1/2" />
                  <div className="h-16 bg-stone-100 rounded" />
                </div>
              ))}
            </div>
          ) : experts.length === 0 ? (
            <div className="bg-white rounded-xl border border-stone-200/80 p-12 text-center space-y-3">
              <Users className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="font-semibold text-stone-700">कोणतेही तज्ज्ञ सापडले नाहीत</h3>
              <p className="text-xs text-stone-500">कृपया वेगळे शोध शब्द किंवा जिल्हा फिल्टर निवडून पहा.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {experts.map((exp) => (
                <ExpertCard
                  key={exp.id}
                  expert={exp}
                  onRequestConsultation={handleOpenBooking}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <ConsultationRequestList
          requests={consultations}
          onRefresh={fetchConsultations}
        />
      )}

      {/* Booking Modal */}
      <ConsultationRequestModal
        expert={selectedExpertForBooking}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSuccess={handleBookingSuccess}
      />
    </div>
  );
}
