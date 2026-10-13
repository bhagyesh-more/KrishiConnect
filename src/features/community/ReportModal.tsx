"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { createPostReportAction } from "./actions";
import { ReportReason } from "./types";
import { X, Flag, AlertTriangle, CheckCircle2 } from "lucide-react";

interface ReportModalProps {
  postId?: string;
  commentId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  postId,
  commentId,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [reason, setReason] = useState<ReportReason>("unsafe_pesticide_advice");
  const [details, setDetails] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const reasons: { id: ReportReason; label: string; desc: string }[] = [
    {
      id: "unsafe_pesticide_advice",
      label: "असुरक्षित कीटकनाशक सल्ला (Unsafe Advice)",
      desc: "अपप्रमाणित रसायने किंवा घातक प्रमाणाची शिफारस",
    },
    {
      id: "misinformation",
      label: "दिशाभूल करणारी माहिती (Misinformation)",
      desc: "शेतकऱ्यांची फसवणूक किंवा चुकीचे बाजारभाव/अनुदान दावे",
    },
    {
      id: "spam",
      label: "स्पॅम किंवा जाहिरात (Spam)",
      desc: "वारंवार व्यावसायिक जाहिराती किंवा असंबंधित लिंक",
    },
    {
      id: "abuse",
      label: "असभ्य किंवा अपमानास्पद भाषा (Abuse)",
      desc: "इतर शेतकऱ्यांशी वाद किंवा शिवीगाळ",
    },
    {
      id: "other",
      label: "इतर कारण (Other)",
      desc: "समुदाय नियमांचे इतर उल्लंघन",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await createPostReportAction({
        postId: postId || undefined,
        commentId: commentId || undefined,
        reason,
        details: details.trim() || undefined,
      });

      if (!res.success) {
        setErrorMsg(res.error || "तक्रार नोंदवण्यात त्रुटी आली");
        setIsLoading(false);
        return;
      }

      setSubmitted(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
        setSubmitted(false);
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err?.message || "नेटवर्क त्रुटी");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-red-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-krishi-lightGray/40 bg-red-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shadow-sm">
              <Flag className="w-5 h-5" />
            </div>
            <div>
              <h2 id="report-modal-title" className="text-base font-bold text-red-950">
                मजकुराची तक्रार नोंदवा (Report Content)
              </h2>
              <p className="text-xs text-krishi-gray">
                समुदाय सुरक्षित व विश्वासार्ह ठेवण्यासाठी मदत करा
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-krishi-gray hover:text-krishi-charcoal rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <h3 className="text-base font-bold text-krishi-deepGreen">
              तक्रार यशस्वीरित्या नोंदवली गेली!
            </h3>
            <p className="text-xs text-krishi-gray">
              प्रशासकीय पथक या मजकुराची पडताळणी करून योग्य ती कारवाई करेल. धन्यवाद!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
            {errorMsg && (
              <Alert variant="error" className="py-2.5">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              </Alert>
            )}

            <div>
              <label className="block font-semibold text-krishi-charcoal mb-2">
                तक्रारीचे मुख्य कारण निवडा:
              </label>
              <div className="space-y-2">
                {reasons.map((r) => (
                  <label
                    key={r.id}
                    className={`flex items-start space-x-2.5 p-2.5 rounded-xl border cursor-pointer transition ${
                      reason === r.id
                        ? "border-red-400 bg-red-50/60 ring-1 ring-red-400"
                        : "border-krishi-lightGray/60 hover:bg-krishi-warmIvory/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={r.id}
                      checked={reason === r.id}
                      onChange={() => setReason(r.id)}
                      className="mt-1 text-red-600 focus:ring-red-500 cursor-pointer"
                    />
                    <div>
                      <div className="font-bold text-xs text-krishi-charcoal">{r.label}</div>
                      <div className="text-[11px] text-krishi-gray">{r.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-krishi-charcoal mb-1">
                अधिक तपशील (पर्यायी):
              </label>
              <textarea
                rows={3}
                placeholder="उदा. या सल्ल्यामुळे पिकाचे नुकसान होण्याची शक्यता आहे..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full px-3 py-2 border border-krishi-lightGray rounded-xl text-xs text-krishi-charcoal outline-none focus:ring-2 focus:ring-red-400"
                maxLength={500}
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-krishi-lightGray/40">
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                रद्द करा
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 text-white min-w-[120px]"
              >
                {isLoading ? "नोंदवत आहे..." : "तक्रार पाठवा"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
