"use client";

import React, { useState } from "react";
import { useTranslation, SupportedLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { askAiAssistantAction } from "@/features/ai/actions";
import {
  Sparkles,
  X,
  AlertTriangle,
  ShieldCheck,
  Send,
  HelpCircle,
  Sprout,
  CheckCircle2,
  Info,
} from "lucide-react";

interface AiConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDistrict?: string;
  defaultCrop?: string;
}

const SAMPLE_QUESTIONS: Record<SupportedLanguage, { label: string; prompt: string }[]> = {
  mr: [
    { label: "कपाशीवरील बोंडअळी नियंत्रण", prompt: "कपाशीवरील बोंडअळी नियंत्रणासाठी सेंद्रिय आणि एकात्मिक उपाय कोणते?" },
    { label: "सोयाबीन खत व्यवस्थापन", prompt: "सोयाबीन पिकासाठी पेरणीनंतर ३० दिवसांनी कोणते खत द्यावे?" },
    { label: "टोमॅटो फळकूज प्रतिबंध", prompt: "टोमॅटो पिकातील फळकूज आणि बुरशीजन्य रोगांवर सुरक्षित फवारणी कोणती?" },
    { label: "कांदा साठवणूक तंत्रज्ञान", prompt: "चाळीमध्ये कांदा दीर्घकाळ चांगला राहण्यासाठी काढणीपूर्वीची काळजी काय घ्यावी?" },
  ],
  hi: [
    { label: "कपास की सुंडी नियंत्रण", prompt: "कपास में पिंक बॉलवर्म के नियंत्रण के लिए जैविक और एकीकृत उपाय बताएं।" },
    { label: "सोयाबीन उर्वरक प्रबंधन", prompt: "सोयाबीन की फसल में बुआई के 30 दिन बाद कौन सी खाद देनी चाहिए?" },
    { label: "टमाटर फल सड़न रोकथाम", prompt: "टमाटर में फफूंद जनित रोगों और फल सड़न से बचाव के उपाय क्या हैं?" },
    { label: "प्याज भंडारण तकनीक", prompt: "प्याज को लंबे समय तक सुरक्षित रखने के लिए कटाई से पहले क्या सावधानी रखें?" },
  ],
  en: [
    { label: "Cotton Bollworm Control", prompt: "What are the integrated pest management steps for pink bollworm in cotton?" },
    { label: "Soybean Fertilizer Care", prompt: "Which fertilizer dosage is recommended for soybean 30 days after sowing?" },
    { label: "Tomato Fruit Rot Prevention", prompt: "How can I prevent fungal infections and fruit rot in tomato crops?" },
    { label: "Onion Storage Management", prompt: "What pre-harvest management steps ensure longer shelf-life for stored onions?" },
  ],
};

export const AiConsultationModal: React.FC<AiConsultationModalProps> = ({
  isOpen,
  onClose,
  defaultDistrict = "Pune",
  defaultCrop = "",
}) => {
  const { t, language } = useTranslation();
  const [prompt, setPrompt] = useState("");
  const [cropContext, setCropContext] = useState(defaultCrop);
  const [district, setDistrict] = useState(defaultDistrict);

  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentQuestions = SAMPLE_QUESTIONS[language] || SAMPLE_QUESTIONS.mr;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await askAiAssistantAction({
        prompt: prompt.trim(),
        cropContext: cropContext.trim() || undefined,
        district: district.trim() || undefined,
        language,
      });

      setResponse(res);
    } catch (err: any) {
      setErrorMsg(err.message || t("ai.emptyQueryError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSample = (samplePrompt: string) => {
    setPrompt(samplePrompt);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-white w-full sm:max-w-xl rounded-t-3xl sm:rounded-3xl border border-krishi-border shadow-floating overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-krishi-border flex items-center justify-between bg-gradient-to-r from-krishi-deepGreen to-[#1b6b3e] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5 text-krishi-leafGreen animate-pulse" />
            </div>
            <div>
              <h2 id="ai-modal-title" className="text-base sm:text-lg font-extrabold text-white">
                {t("ai.modalTitle")}
              </h2>
              <p className="text-[11px] text-krishi-warmIvory/80">
                {t("ai.modalSubtitle")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 min-w-[44px] min-h-[44px] rounded-xl hover:bg-white/20 text-white transition-colors flex items-center justify-center"
            aria-label={t("common.close")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-left">
          {errorMsg && (
            <Alert variant="error">
              <span>{errorMsg}</span>
            </Alert>
          )}

          {/* Consultation Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-krishi-textMain mb-1.5">
                {t("ai.inputPlaceholder")}
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                required
                placeholder={t("ai.inputPlaceholder")}
                className="w-full p-3 text-sm rounded-2xl border border-krishi-border bg-krishi-ivory-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen transition-all text-krishi-textMain resize-none"
              />
            </div>

            {/* Optional Context Helpers */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-krishi-textMuted block mb-1">
                  {t("ai.cropContext")}
                </label>
                <input
                  type="text"
                  placeholder="उदा. कापूस / सोयाबीन"
                  value={cropContext}
                  onChange={(e) => setCropContext(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-krishi-border bg-krishi-ivory-50 text-xs focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-krishi-textMuted block mb-1">
                  {t("ai.districtContext")}
                </label>
                <input
                  type="text"
                  placeholder="उदा. नाशिक / पुणे"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-krishi-border bg-krishi-ivory-50 text-xs focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen"
                />
              </div>
            </div>

            {/* Quick Question Chips */}
            {!response && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-krishi-textMuted flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-krishi-leafGreen" />
                  <span>{t("ai.quickQuestionsTitle")}</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSample(q.prompt)}
                      className="text-left text-[11px] bg-krishi-ivory-100 hover:bg-krishi-primary-50 border border-krishi-border hover:border-krishi-leafGreen/40 text-krishi-deepGreen font-medium px-2.5 py-1.5 rounded-xl transition-all"
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              disabled={!prompt.trim()}
              className="w-full min-h-[48px] rounded-2xl font-bold shadow-subtle mt-2"
            >
              <Send className="w-4 h-4 mr-2" />
              <span>{isLoading ? t("ai.askingButton") : t("ai.askButton")}</span>
            </Button>
          </form>

          {/* AI Response Display */}
          {response && (
            <div className="pt-4 border-t border-krishi-border/80 space-y-3 animate-fadeIn">
              {/* Safety Classification Pill */}
              <div className="flex items-center justify-between gap-2">
                {response.hasHarmfulSubstanceFlag ? (
                  <Badge variant="warning" size="sm" className="flex items-center gap-1 font-bold bg-red-50 text-red-700 border-red-200">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                    <span>{t("ai.hazardAlertBadge")}</span>
                  </Badge>
                ) : (
                  <Badge variant="success" size="sm" className="flex items-center gap-1 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{t("ai.verifiedBadge")}</span>
                  </Badge>
                )}

                {response.isMockResponse && (
                  <span className="text-[10px] text-krishi-textMuted bg-krishi-ivory-100 px-2 py-0.5 rounded-full border border-krishi-border">
                    {t("ai.offlineBadge")}
                  </span>
                )}
              </div>

              {/* Safety Warnings if any */}
              {response.safetyWarnings && response.safetyWarnings.length > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                  <div className="font-bold text-xs text-amber-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>{t("ai.hazardAlertBadge")}</span>
                  </div>
                  {response.safetyWarnings.map((warning: string, i: number) => (
                    <p key={i} className="text-xs text-amber-800 leading-relaxed pl-5">
                      • {warning}
                    </p>
                  ))}
                </div>
              )}

              {/* Answer Content Card */}
              <div className="bg-krishi-ivory-50/70 border border-krishi-border rounded-2xl p-4 space-y-2 text-xs sm:text-sm text-krishi-textMain leading-relaxed whitespace-pre-wrap">
                {response.answer}
              </div>

              {/* Mandatory Legal & Agronomic Disclaimer */}
              <div className="p-3 bg-krishi-primary-50/70 border border-krishi-primary-200 rounded-xl text-[11px] text-krishi-textMuted flex items-start gap-2">
                <Info className="w-4 h-4 text-krishi-deepGreen shrink-0 mt-0.5" />
                <p className="leading-tight">
                  {response.disclaimer || t("ai.advisoryDisclaimer")}
                </p>
              </div>

              {/* Ask another question button */}
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => {
                  setResponse(null);
                  setPrompt("");
                }}
                className="w-full min-h-[44px] rounded-xl text-xs font-semibold"
              >
                <span>{t("ai.askButton")}</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
