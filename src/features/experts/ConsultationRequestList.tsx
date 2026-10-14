"use client";

import React, { useState } from "react";
import { ConsultationRequest } from "./types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { updateConsultationStatusAction } from "./actions";
import { Clock, Phone, CheckCircle, MessageSquare, AlertCircle } from "lucide-react";

interface ConsultationRequestListProps {
  requests: ConsultationRequest[];
  onRefresh?: () => void;
}

export const ConsultationRequestList: React.FC<ConsultationRequestListProps> = ({
  requests,
  onRefresh,
}) => {
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const getStatusBadge = (status: ConsultationRequest["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="warning">प्रलंबित (Pending)</Badge>;
      case "accepted":
        return <Badge variant="primary">स्वीकारले (Accepted)</Badge>;
      case "completed":
        return <Badge variant="success">पूर्ण (Completed)</Badge>;
      case "cancelled":
        return <Badge variant="neutral">रद्द (Cancelled)</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm("तुम्हाला खात्री आहे का ही सल्ला विनंती रद्द करायची आहे?")) return;
    setCancellingId(id);
    await updateConsultationStatusAction({
      requestId: id,
      status: "cancelled",
      expertNotes: "शेतकऱ्याने विनंती मागे घेतली.",
    });
    setCancellingId(null);
    onRefresh?.();
  };

  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-stone-200/80 p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <MessageSquare className="w-6 h-6" />
        </div>
        <h3 className="font-semibold text-stone-800">कोणतीही सल्ला विनंती आढळली नाही</h3>
        <p className="text-xs text-stone-500 max-w-sm mx-auto">
          आपण अजून कोणत्याही कृषी तज्ज्ञांकडे सल्ला मागितलेला नाही. वरील &apos;तज्ज्ञ निर्देशिका&apos; टॅबमधून तज्ज्ञ निवडून मार्गदर्शन मिळवा.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <span>
          <strong>सूचना:</strong> सर्व विनंत्या सध्या प्रात्यक्षिक (डेमो) वातावरणात आहेत. सर्व्हर रीस्टार्ट झाल्यावर डेटा पूर्ववत होऊ शकतो.
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {requests.map((req) => (
          <Card key={req.id} className="border-stone-200/80 flex flex-col justify-between space-y-3">
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-stone-900 text-sm leading-snug">{req.subject}</h4>
                  {req.crop_name && (
                    <span className="inline-block mt-1 text-[11px] font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                      पीक: {req.crop_name}
                    </span>
                  )}
                </div>
                {getStatusBadge(req.status)}
              </div>

              <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                {req.description}
              </p>

              <div className="text-[11px] text-stone-500 space-y-1">
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3 text-stone-400" />
                  <span>संपर्क माध्यम: <strong>{req.preferred_contact_method}</strong> ({req.farmer_phone || "नोंद नाही"})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3 text-stone-400" />
                  <span>प्राधान्य वेळ: <strong>{req.preferred_time_slot || "कोणतीही"}</strong> • दिनांक: {new Date(req.created_at).toLocaleDateString("mr-IN")}</span>
                </div>
              </div>

              {req.expert_notes && (
                <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded text-xs text-emerald-900">
                  <strong className="block text-[11px] text-emerald-800 font-bold mb-0.5">तज्ज्ञांचा अभिप्राय:</strong>
                  {req.expert_notes}
                </div>
              )}
            </div>

            {req.status === "pending" && (
              <div className="pt-2 border-t border-stone-100 flex items-center justify-end">
                <button
                  type="button"
                  disabled={cancellingId === req.id}
                  onClick={() => handleCancel(req.id)}
                  className="text-xs text-red-600 hover:text-red-700 font-medium hover:underline disabled:opacity-50"
                >
                  {cancellingId === req.id ? "रद्द करत आहे..." : "विनंती मागे घ्या (रद्द करा)"}
                </button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
