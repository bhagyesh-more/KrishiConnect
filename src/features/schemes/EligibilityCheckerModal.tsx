"use client";

import React, { useState } from "react";
import { X, CheckCircle, AlertCircle, HelpCircle, Loader2, Sparkles, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { GovernmentScheme, EligibilityAssessmentResult } from "./types";
import { checkSchemeEligibilityAction } from "./actions";

interface EligibilityCheckerModalProps {
  isOpen: boolean;
  scheme: GovernmentScheme;
  onClose: () => void;
}

export const EligibilityCheckerModal: React.FC<EligibilityCheckerModalProps> = ({
  isOpen,
  scheme,
  onClose,
}) => {
  const [landSizeAcres, setLandSizeAcres] = useState("3.5");
  const [farmerCategory, setFarmerCategory] = useState<"small_marginal" | "medium_large" | "sc_st" | "woman_farmer" | "general">("small_marginal");
  const [hasIrrigation, setHasIrrigation] = useState(true);

  const [loading, setLoading] = useState(false);
  const [assessment, setAssessment] = useState<EligibilityAssessmentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAssess = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const acres = parseFloat(landSizeAcres);
    if (isNaN(acres) || acres < 0) {
      setError("कृपया वैध जमीन धारणा प्रविष्ट करा");
      return;
    }

    setLoading(true);
    try {
      const result = await checkSchemeEligibilityAction(scheme.id, {
        landSizeAcres: acres,
        farmerCategory,
        hasIrrigation,
      });

      if (!result.success || !result.data) {
        setError(result.error || "पात्रता तपासण्यात त्रुटी आली");
      } else {
        setAssessment(result.data);
      }
    } catch (err: any) {
      setError(err.message || "त्रुटी आली");
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
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-krishi-deepGreen">
                योजना पात्रता तपासणी
              </h2>
              <p className="text-xs text-krishi-textMuted line-clamp-1">
                {scheme.title_mr}
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

        {/* Content Body */}
        <div className="overflow-y-auto p-4 sm:p-5 space-y-4 text-xs sm:text-sm">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAssess} className="space-y-3.5">
            <div>
              <label className="block font-semibold text-krishi-deepGreen mb-1">
                आपली एकूण शेतजमीन (एकरांमध्ये) *
              </label>
              <input
                type="number"
                step="any"
                min="0"
                required
                value={landSizeAcres}
                onChange={(e) => setLandSizeAcres(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-krishi-border bg-white focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen/30"
              />
              <span className="text-[11px] text-krishi-textMuted mt-0.5 block">
                ५ एकरांपेक्षा कमी असल्यास अल्प व अत्यल्प भूधारक गणले जाते.
              </span>
            </div>

            <div>
              <label className="block font-semibold text-krishi-deepGreen mb-1">
                शेतकरी प्रवर्ग / संवर्ग *
              </label>
              <select
                value={farmerCategory}
                onChange={(e) => setFarmerCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-krishi-border bg-white focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen/30"
              >
                <option value="small_marginal">अल्प / अत्यल्प भूधारक (५ एकरांपर्यंत)</option>
                <option value="medium_large">मध्यम ते मोठे शेतकरी (५ एकरांपेक्षा जास्त)</option>
                <option value="sc_st">अनुसूचित जाती / जमाती (SC / ST)</option>
                <option value="woman_farmer">महिला शेतकरी (Woman Farmer)</option>
                <option value="general">सर्वसाधारण प्रवर्ग (General)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 p-3 bg-krishi-primary-50/60 rounded-xl border border-krishi-primary-100">
              <input
                type="checkbox"
                id="hasIrrigationCheck"
                checked={hasIrrigation}
                onChange={(e) => setHasIrrigation(e.target.checked)}
                className="w-4 h-4 text-krishi-deepGreen rounded border-krishi-border focus:ring-krishi-deepGreen"
              />
              <label htmlFor="hasIrrigationCheck" className="font-semibold text-krishi-deepGreen cursor-pointer">
                शेतात कायमस्वरूपी सिंचन सोय (विहीर, कूपनलिका, शेततळे किंवा कालवा) उपलब्ध आहे
              </label>
            </div>

            <Button
              type="submit"
              variant="accent"
              size="md"
              disabled={loading}
              className="w-full font-bold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  तपासत आहे...
                </>
              ) : (
                "पात्रता तपासा (Check Eligibility)"
              )}
            </Button>
          </form>

          {/* Assessment Result Panel */}
          {assessment && (
            <div className="mt-4 p-4 rounded-2xl border space-y-3 animate-fadeIn bg-krishi-primary-50/40 border-krishi-primary-200">
              <div className="flex items-center justify-between">
                <Badge
                  variant={assessment.isLikelyEligible ? "success" : "warning"}
                  size="md"
                >
                  {assessment.isLikelyEligible ? "संभाव्य पात्र (Likely Eligible)" : "काही अटींची पूर्तता आवश्यक"}
                </Badge>
                <span className="text-xs font-bold text-krishi-deepGreen">
                  पात्रता गुण: {assessment.scorePercentage}%
                </span>
              </div>

              <p className="text-xs text-krishi-deepGreen/90 leading-relaxed font-medium">
                {assessment.notes}
              </p>

              {/* Matched Criteria */}
              {assessment.matchedCriteria.length > 0 && (
                <div className="space-y-1">
                  <span className="text-xs font-bold text-green-800 block">
                    पूर्ण झालेले निकष (Matched):
                  </span>
                  <ul className="space-y-1">
                    {assessment.matchedCriteria.map((c, i) => (
                      <li key={i} className="text-xs text-green-700 flex items-start gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Unmatched Criteria */}
              {assessment.unmatchedCriteria.length > 0 && (
                <div className="space-y-1">
                  <span className="text-xs font-bold text-amber-800 block">
                    अपूर्ण निकष (Unmet Criteria):
                  </span>
                  <ul className="space-y-1">
                    {assessment.unmatchedCriteria.map((c, i) => (
                      <li key={i} className="text-xs text-amber-800 flex items-start gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Disclaimer */}
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] leading-relaxed flex items-start gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>महत्त्वाची सूचना:</strong> हा निष्कर्ष केवळ उपलब्ध माहितीच्या आधारे प्राथमिक मार्गदर्शनासाठी आहे. प्रत्यक्ष लाभ शासनाच्या अधिकृत पडताळणीवर अवलंबून असतो.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
