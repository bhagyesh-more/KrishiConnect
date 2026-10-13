"use client";

import React from "react";
import { CropGuideItem } from "./agronomy";
import {
  X,
  BookOpen,
  Calendar,
  Clock,
  Layers,
  Droplets,
  Bug,
  ShieldCheck,
  Building2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

interface CropGuideDrawerProps {
  guide: CropGuideItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CropGuideDrawer: React.FC<CropGuideDrawerProps> = ({
  guide,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !guide) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-drawer-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-krishi-leafGreen/40">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-krishi-lightGray/40 bg-krishi-warmIvory/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-krishi-deepGreen text-white flex items-center justify-center shadow-sm">
              <BookOpen className="w-5 h-5 text-krishi-leafGreen" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 id="guide-drawer-title" className="text-lg font-bold text-krishi-deepGreen">
                  {guide.crop_name_mr} ({guide.crop_name_en})
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-krishi-leafGreen/20 text-krishi-deepGreen font-semibold">
                  {guide.variety}
                </span>
              </div>
              <p className="text-xs text-krishi-gray">
                महाराष्ट्र कृषी विद्यापीठ शिफारशींवर आधारित परिपूर्ण मार्गदर्शिका
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-2 text-krishi-gray hover:text-krishi-charcoal hover:bg-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-krishi-warmIvory/60 rounded-xl border border-krishi-lightGray/60">
              <div className="flex items-center text-xs text-krishi-gray mb-1">
                <Calendar className="w-3.5 h-3.5 mr-1 text-krishi-deepGreen" />
                हंगाम
              </div>
              <div className="font-bold text-krishi-deepGreen text-sm">{guide.ideal_season}</div>
            </div>

            <div className="p-3 bg-krishi-warmIvory/60 rounded-xl border border-krishi-lightGray/60">
              <div className="flex items-center text-xs text-krishi-gray mb-1">
                <Clock className="w-3.5 h-3.5 mr-1 text-krishi-deepGreen" />
                कालावधी
              </div>
              <div className="font-bold text-krishi-deepGreen text-sm">
                ~{guide.growing_duration_days} दिवस
              </div>
            </div>

            <div className="p-3 bg-krishi-warmIvory/60 rounded-xl border border-krishi-lightGray/60 col-span-2">
              <div className="flex items-center text-xs text-krishi-gray mb-1">
                <Building2 className="w-3.5 h-3.5 mr-1 text-krishi-deepGreen" />
                माहिती स्त्रोत
              </div>
              <div className="font-semibold text-krishi-charcoal text-xs line-clamp-1">
                {guide.source_attribution}
              </div>
            </div>
          </div>

          {/* Soil & Water Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-krishi-lightGray/60 bg-white">
              <div className="flex items-center space-x-2 text-krishi-deepGreen font-bold mb-2">
                <Layers className="w-4 h-4 text-amber-700" />
                <span>जमीन व मशागत (Soil & Tillage)</span>
              </div>
              <p className="text-xs text-krishi-charcoal leading-relaxed">
                {guide.soil_requirements}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-krishi-lightGray/60 bg-white">
              <div className="flex items-center space-x-2 text-krishi-deepGreen font-bold mb-2">
                <Droplets className="w-4 h-4 text-blue-600" />
                <span>पाणी व सिंचन (Water Management)</span>
              </div>
              <p className="text-xs text-krishi-charcoal leading-relaxed">
                {guide.water_requirements}
              </p>
            </div>
          </div>

          {/* Growth Stages Timeline */}
          <div>
            <h3 className="text-sm font-bold text-krishi-deepGreen mb-3 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-krishi-leafGreen" />
              <span>महत्त्वाचे वाढ टप्पे आणि शेती कामे (Growth Stages)</span>
            </h3>
            <div className="space-y-3">
              {guide.growth_stages.map((stage, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-krishi-lightGray/60 bg-krishi-warmIvory/30 flex flex-col sm:flex-row sm:items-start justify-between gap-2"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-krishi-deepGreen text-white text-[11px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-krishi-charcoal text-xs">
                        {stage.nameMr} ({stage.stage})
                      </span>
                    </div>
                    <ul className="pl-7 list-disc list-outside text-xs text-krishi-charcoal/80 space-y-0.5">
                      {stage.tasks.map((task, tidx) => (
                        <li key={tidx}>{task}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-[11px] font-bold text-krishi-deepGreen bg-white px-2.5 py-1 rounded-md border border-krishi-lightGray/40 self-start sm:self-center">
                    ~{stage.days} दिवसांपर्यंत
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pests & IPM Section */}
          {guide.common_pests && guide.common_pests.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-krishi-deepGreen mb-3 flex items-center space-x-1.5">
                <Bug className="w-4 h-4 text-red-600" />
                <span>प्रमुख कीड / रोग व एकात्मिक नियंत्रण (Pest Management)</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {guide.common_pests.map((pest, pidx) => (
                  <div
                    key={pidx}
                    className="p-3.5 rounded-xl border border-red-100 bg-red-50/40 text-xs space-y-1.5"
                  >
                    <div className="font-bold text-red-950 flex items-center space-x-1.5">
                      <ShieldCheck className="w-4 h-4 text-red-600" />
                      <span>{pest.name}</span>
                    </div>
                    <div className="text-krishi-charcoal">
                      <strong className="text-krishi-deepGreen">लक्षणे:</strong> {pest.symptoms}
                    </div>
                    <div className="text-krishi-charcoal">
                      <strong className="text-krishi-deepGreen">प्रतिबंधात्मक उपाय:</strong>{" "}
                      {pest.preventive}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Disclaimer Callout */}
          <div className="flex items-start space-x-2.5 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>महत्त्वाची सूचना:</strong> वरील मार्गदर्शिका ही सामान्य शैक्षणिक हेतूने
              तयार करण्यात आलेली आहे. कोणत्याही रासायनिक औषधांचा वापर करण्यापूर्वी कृषी सेवा
              केंद्र, कृषी विज्ञान केंद्र (KVK) अथवा कृषी सहाय्यक यांच्याशी संपर्क साधावा.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-krishi-lightGray/40 bg-krishi-warmIvory/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-krishi-deepGreen text-white text-xs font-semibold hover:bg-krishi-deepGreen/90 transition"
          >
            बंद करा (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
