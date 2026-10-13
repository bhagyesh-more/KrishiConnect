"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { BookOpen, Video, ArrowLeft, Bookmark } from "lucide-react";

export default function LearningPage() {
  const { t } = useTranslation();

  const tutorials = [
    {
      title: "ठिबक सिंचन देखभाल व स्वच्छता तंत्रज्ञान",
      crop: "सिंचन तंत्रज्ञान",
      duration: "८ मिनिटे",
      desc: "ऍसिड ट्रीटमेंट व लॅटरल स्वच्छता कशी करावी, जेणेकरून संच चोकअप होणार नाही.",
    },
    {
      title: "सोयाबीन पीक: सुरुवातीच्या ३० दिवसांचे खत नियोजन",
      crop: "सोयाबीन",
      duration: "१० मिनिटे",
      desc: "संतुलित एनपीके खत मात्रा आणि सूक्ष्म अन्नद्रव्य फवारणीचे वेळेवर नियोजन.",
    },
    {
      title: "जिवामृत व दशपर्णी अर्क तयार करण्याची सोपी पद्धत",
      crop: "सेंद्रिय शेती",
      duration: "१२ मिनिटे",
      desc: "स्थानिक उपलब्ध साहित्यापासून घरच्या घरी सेंद्रिय कीडनाशके तयार करा.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Link
          href="/home"
          className="md:hidden text-krishi-textMuted hover:text-krishi-deepGreen p-1 -ml-1 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-krishi-deepGreen">
            {t("nav.learning")}
          </h1>
          <p className="text-xs sm:text-sm text-krishi-textMuted">
            शेतकऱ्यांसाठी आधुनिक शेती पद्धती, व्हिडिओ व प्रात्यक्षिके
          </p>
        </div>
      </div>

      <Alert
        variant="info"
        title="मार्गदर्शन केंद्र (Learning Centre Preview)"
      >
        <span>
          टप्पा ६ मध्ये शेतकरी सर्व मार्गदर्शक व्हिडिओ व लेख स्थानिक भाषेत पाहू शकतील आणि ऑफलाइन वापरासाठी जतन (Offline Cache) करू शकतील.
        </span>
      </Alert>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tutorials.map((tut, idx) => (
          <Card key={idx} className="border-krishi-border flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" size="sm">{tut.crop}</Badge>
                <span className="text-[11px] text-krishi-textMuted flex items-center gap-1">
                  <Video className="w-3.5 h-3.5 text-krishi-deepGreen" /> {tut.duration}
                </span>
              </div>
              <CardTitle className="text-base">{tut.title}</CardTitle>
              <CardDescription className="text-xs line-clamp-3">
                {tut.desc}
              </CardDescription>
            </div>

            <div className="pt-3 mt-auto flex items-center justify-between text-xs font-bold text-krishi-deepGreen">
              <span>माहिती वाचा</span>
              <Bookmark className="w-4 h-4 text-krishi-textMuted hover:text-krishi-deepGreen cursor-pointer" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
