"use client";

import React from "react";
import Link from "next/link";
import { UserCheck, MapPin, Languages, Sprout, Briefcase, Calendar } from "lucide-react";
import { ExpertProfile } from "./types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface ExpertCardProps {
  expert: ExpertProfile;
  onRequestConsultation: (expert: ExpertProfile) => void;
}

export const ExpertCard: React.FC<ExpertCardProps> = ({ expert, onRequestConsultation }) => {
  return (
    <Card className="flex flex-col justify-between border-stone-200/80 hover:shadow-md transition-shadow">
      <div className="space-y-4">
        {/* Header / Avatar info */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-lg flex-shrink-0 border border-emerald-200">
              {expert.full_name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <Link
                  href={`/experts/${expert.id}`}
                  className="font-bold text-stone-900 hover:text-emerald-700 transition-colors text-base"
                >
                  {expert.full_name}
                </Link>
                {expert.is_verified && (
                  <span
                    title="पडताळणी झालेली प्रोफाईल"
                    className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
                  >
                    <UserCheck className="w-3 h-3" />
                    सत्यापित
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-600 line-clamp-1 mt-0.5">
                {expert.qualification || expert.affiliation || "कृषी तज्ज्ञ"}
              </p>
            </div>
          </div>
          <Badge variant="primary" className="text-[11px] capitalize">
            {expert.specialization.replace(/_/g, " ")}
          </Badge>
        </div>

        {/* Demo Disclaimer tag */}
        {expert.is_demo_profile && (
          <div className="bg-amber-50 text-amber-800 border border-amber-200/80 rounded px-2.5 py-1 text-[11px] font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            प्रात्यक्षिक प्रोफाईल (डेमो तज्ज्ञ)
          </div>
        )}

        {/* Bio summary */}
        {expert.bio && (
          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {expert.bio}
          </p>
        )}

        {/* Metadata Details */}
        <div className="space-y-1.5 pt-1 text-xs text-stone-600">
          <div className="flex items-center gap-2">
            <Briefcase className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
            <span>अनुभव: <strong className="text-stone-700 font-semibold">{expert.experience_years} वर्षे</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
            <span>कार्यक्षेत्र जिल्हा: <span className="text-stone-700 font-medium">{expert.district}</span></span>
          </div>

          {expert.languages_spoken && expert.languages_spoken.length > 0 && (
            <div className="flex items-center gap-2">
              <Languages className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
              <span>भाषा: <span className="text-stone-700">{expert.languages_spoken.join(", ")}</span></span>
            </div>
          )}
        </div>

        {/* Crops badges */}
        {expert.supported_crops && expert.supported_crops.length > 0 && (
          <div className="pt-2 border-t border-stone-100">
            <p className="text-[11px] font-semibold text-stone-500 mb-1.5 flex items-center gap-1">
              <Sprout className="w-3 h-3 text-emerald-600" />
              मार्गदर्शनाखालील मुख्य पिके:
            </p>
            <div className="flex flex-wrap gap-1">
              {expert.supported_crops.slice(0, 4).map((crop) => (
                <span
                  key={crop}
                  className="bg-stone-100 text-stone-700 text-[10px] px-2 py-0.5 rounded-full"
                >
                  {crop}
                </span>
              ))}
              {expert.supported_crops.length > 4 && (
                <span className="text-stone-500 text-[10px] self-center">
                  +{expert.supported_crops.length - 4} अधिक
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action CTA */}
      <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between gap-2">
        <Link
          href={`/experts/${expert.id}`}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
        >
          तपशील पहा →
        </Link>
        <Button
          size="sm"
          variant="primary"
          onClick={() => onRequestConsultation(expert)}
          className="text-xs"
        >
          <Calendar className="w-3.5 h-3.5 mr-1" />
          सल्ला विचारा
        </Button>
      </div>
    </Card>
  );
};
