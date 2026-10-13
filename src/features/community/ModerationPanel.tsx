"use client";

import React, { useState, useEffect } from "react";
import { ContentReport, ReportStatus } from "./types";
import { getModerationReportsAction, moderateContentAction } from "./actions";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  ShieldAlert,
  CheckCircle,
  EyeOff,
  Eye,
  Lock,
  RefreshCw,
  AlertTriangle,
  FileText,
  User,
} from "lucide-react";

export const ModerationPanel: React.FC = () => {
  const [reports, setReports] = useState<ContentReport[]>([]);
  const [filterStatus, setFilterStatus] = useState<ReportStatus | "all">("pending");
  const [isLoading, setIsLoading] = useState(true);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const loadReports = async () => {
    setIsLoading(true);
    try {
      const res = await getModerationReportsAction();
      if (res.success && res.data) {
        setReports(res.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleAction = async (
    reportId: string,
    action: "dismiss" | "hide_content" | "restore_content" | "lock_post"
  ) => {
    try {
      const res = await moderateContentAction({ reportId, action });
      if (res.success) {
        setActionFeedback("कारवाई यशस्वीरित्या पूर्ण झाली!");
        setTimeout(() => setActionFeedback(null), 3000);
        await loadReports();
      } else {
        alert(res.error || "कारवाई अयशस्वी");
      }
    } catch (err: any) {
      alert(err?.message || "त्रुटी");
    }
  };

  const getReasonLabel = (reason: string) => {
    switch (reason) {
      case "unsafe_pesticide_advice":
        return "असुरक्षित कीटकनाशक सल्ला";
      case "misinformation":
        return "दिशाभूल करणारी माहिती";
      case "spam":
        return "स्पॅम / जाहिरात";
      case "abuse":
        return "असभ्य भाषा";
      default:
        return "इतर उल्लंघन";
    }
  };

  const filteredReports =
    filterStatus === "all" ? reports : reports.filter((r) => r.status === filterStatus);

  return (
    <div className="bg-white rounded-2xl border border-krishi-lightGray/70 p-5 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-krishi-lightGray/40 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-krishi-deepGreen">
              प्रशासकीय नियंत्रण व तक्रार निवारण (Community Moderation)
            </h2>
            <p className="text-xs text-krishi-gray">
              शेतकऱ्यांनी नोंदवलेल्या तक्रारी तपासा आणि अयोग्य मजकूर लपवा
            </p>
          </div>
        </div>

        <button
          onClick={loadReports}
          disabled={isLoading}
          className="p-2 text-krishi-gray hover:text-krishi-deepGreen hover:bg-krishi-warmIvory/60 rounded-xl transition flex items-center space-x-1.5 text-xs font-semibold self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>रिफ्रेश</span>
        </button>
      </div>

      {actionFeedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold animate-fade-in flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex space-x-2 text-xs">
        {(["pending", "action_taken", "dismissed", "all"] as const).map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-xl font-semibold border transition ${
              filterStatus === st
                ? "bg-krishi-deepGreen text-white border-krishi-deepGreen"
                : "bg-white text-krishi-charcoal border-krishi-lightGray/60 hover:bg-krishi-warmIvory/60"
            }`}
          >
            {st === "pending"
              ? "प्रलंबित (Pending)"
              : st === "action_taken"
              ? "कारवाई केलेली"
              : st === "dismissed"
              ? "फेटाळलेल्या"
              : "सर्व (All)"}
          </button>
        ))}
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="text-center py-8 text-krishi-gray text-xs space-y-1">
          <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
          <p className="font-semibold text-krishi-charcoal">कोणतीही प्रलंबित तक्रार नाही!</p>
          <p>समुदाय सुरक्षित आणि निकोप चालू आहे.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="p-4 rounded-xl border border-krishi-lightGray/60 bg-krishi-warmIvory/30 space-y-3 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-krishi-lightGray/40 pb-2.5">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-bold text-[10px]">
                    {getReasonLabel(report.reason)}
                  </span>
                  <span className="text-krishi-gray">
                    तक्रारदार: <strong>{report.reporter_name || "शेतकरी"}</strong>
                  </span>
                </div>
                <Badge
                  variant={
                    report.status === "pending"
                      ? "warning"
                      : report.status === "action_taken"
                      ? "primary"
                      : "neutral"
                  }
                  size="sm"
                >
                  {report.status}
                </Badge>
              </div>

              {/* Reported Content Snippet */}
              <div className="bg-white p-3 rounded-lg border border-krishi-lightGray/50 space-y-1">
                <div className="font-bold text-krishi-charcoal flex items-center space-x-1.5 text-xs">
                  <FileText className="w-3.5 h-3.5 text-krishi-gray" />
                  <span>{report.post_title || "मजकूर:"}</span>
                </div>
                <p className="text-krishi-gray text-[11px] line-clamp-2 italic">
                  &ldquo;{report.target_content || "सदर पोस्टवर तक्रार नोंदवली आहे"}&rdquo;
                </p>
                {report.details && (
                  <p className="text-red-700 text-[11px] pt-1">
                    <strong>तक्रार तपशील:</strong> {report.details}
                  </p>
                )}
              </div>

              {/* Moderation Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                {report.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleAction(report.id, "dismiss")}
                      className="px-2.5 py-1 rounded-lg border border-krishi-lightGray bg-white text-krishi-charcoal hover:bg-gray-50 text-[11px] font-semibold"
                    >
                      तक्रार फेटाळा (Dismiss)
                    </button>
                    <button
                      onClick={() => handleAction(report.id, "lock_post")}
                      className="px-2.5 py-1 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 text-[11px] font-semibold flex items-center space-x-1"
                    >
                      <Lock className="w-3 h-3" />
                      <span>चर्चा बंद करा</span>
                    </button>
                    <button
                      onClick={() => handleAction(report.id, "hide_content")}
                      className="px-2.5 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700 text-[11px] font-semibold flex items-center space-x-1"
                    >
                      <EyeOff className="w-3 h-3" />
                      <span>मजकूर लपवा (Hide)</span>
                    </button>
                  </>
                )}
                {report.status === "action_taken" && (
                  <button
                    onClick={() => handleAction(report.id, "restore_content")}
                    className="px-2.5 py-1 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 text-[11px] font-semibold flex items-center space-x-1"
                  >
                    <Eye className="w-3 h-3" />
                    <span>मजकूर पूर्ववत करा (Restore)</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
